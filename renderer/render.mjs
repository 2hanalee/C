#!/usr/bin/env node
// 콘티 캔버스(.dc.html) → 1000×8000 PNG 렌더러 + 자동 검사
//
// 사용법:
//   node renderer/render.mjs --src episodes/<작품>/canvas --out output/<작품> [--assets assets] [--no-notes] [--only B4,C1] [--check-only]
//
// - --src     : 디자인 캔버스에서 받은 canvas.json과 *.dc.html이 있는 폴더
// - --assets  : 에셋 폴더. 컷 메모의 "에셋: 이름" 과 같은 파일명(png/jpg/webp)이 있으면 그 컷 칸에 합성한다
// - --no-notes: 컷 메모(.lab)를 숨기고 완성본처럼 렌더링
// - --check-only: PNG 없이 검사 결과만 출력
//
// 자동 검사 (knowledge/directing-rules.md 10절 "필수" 항목):
//   1) 내용이 8000px 안에 들어가는가   2) 글자 크기 26px 이상(컷 메모 제외)
//   3) 말풍선 3줄 이하                 4) 말풍선·나레이션·네임플레이트끼리 겹치지 않는가
//   5) 에셋 누락(placeholder로 남은 컷 수)

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : def;
};
const flag = (name) => args.includes(name);

const SRC = opt('--src');
const OUT = opt('--out', 'output');
const ASSETS = opt('--assets', 'assets');
const ONLY = opt('--only', '');
const NOTES = !flag('--no-notes');
const CHECK_ONLY = flag('--check-only');
const PAGE_W = 1000;
const PAGE_H = 8000;
const MIN_FONT = 26;
const MAX_BAL_LINES = 3;

if (!SRC) {
  console.error('--src 폴더를 지정하세요. 예: --src episodes/mahou/canvas');
  process.exit(1);
}

// 에셋 색인: 파일명(확장자 제외) → 절대 경로
function indexAssets(dir) {
  const map = {};
  if (!fs.existsSync(dir)) return map;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(png|jpe?g|webp)$/i.test(e.name)) map[e.name.replace(/\.[^.]+$/, '')] = path.resolve(p);
    }
  };
  walk(dir);
  return map;
}

// Design Component(.dc.html) → 일반 HTML
function toPlainHtml(src, notes) {
  return src
    .replace(/<script src="\.\/support\.js"><\/script>/g, '')
    .replace(/<script type="text\/x-dc"[\s\S]*?<\/script>/g, '')
    .replace(/<\/?x-dc>/g, '')
    .replace(/<\/?helmet>/g, '')
    .replace(/\{\{\s*ld\s*\}\}/g, notes ? 'block' : 'none');
}

const canvas = JSON.parse(fs.readFileSync(path.join(SRC, 'canvas.json'), 'utf8'));
let boards = canvas.order.map((file) => ({ file, title: canvas.boards[file]?.title || file }));
if (ONLY) {
  const want = ONLY.split(',').map((s) => s.trim());
  boards = boards.filter((b) => want.some((w) => b.file.startsWith(w) || b.title.includes(w)));
}

const assets = indexAssets(ASSETS);
if (!CHECK_ONLY) fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: PAGE_W, height: 1200 }, deviceScaleFactor: 1 });
const tmpDir = fs.mkdtempSync(path.join(OUT && !CHECK_ONLY ? OUT : '.', '.render-'));
let totalProblems = 0;

for (const b of boards) {
  const html = toPlainHtml(fs.readFileSync(path.join(SRC, b.file), 'utf8'), NOTES);
  const tmp = path.join(tmpDir, b.file.replace('.dc.html', '.html'));
  fs.writeFileSync(tmp, html);
  await page.goto('file://' + path.resolve(tmp), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const report = await page.evaluate(
    ({ assets, PAGE_H, MIN_FONT, MAX_BAL_LINES }) => {
      const pg = document.querySelector('.pg');
      const top = pg.getBoundingClientRect().top;
      // 1) 에셋 합성: 컷 메모의 "에셋: a, b" 중 첫 번째로 존재하는 파일을 칸 배경으로
      let placed = 0, missing = 0;
      const missingNames = [];
      for (const ph of pg.querySelectorAll('.ph')) {
        const lab = ph.querySelector(':scope > .lab');
        if (!lab) continue;
        const m = lab.textContent.match(/에셋:\s*([^\n]+)/);
        if (!m) continue;
        const names = m[1].split(/[,，]/).map((s) => s.replace(/\(.*?\)/g, '').trim()).filter(Boolean);
        const hit = names.find((n) => assets[n]);
        if (hit) {
          ph.style.backgroundImage = `url("file://${assets[hit]}")`;
          ph.style.backgroundSize = 'cover';
          ph.style.backgroundPosition = 'center';
          placed++;
        } else {
          missing++;
          missingNames.push(names[0]);
        }
      }
      // 2) 내용 높이: 가장 아래에 있는 요소의 바닥(남는 공간을 채우는 flex-grow 요소 자체는 제외)
      let contentBottom = 0;
      for (const el of pg.querySelectorAll('*')) {
        if (getComputedStyle(el).flexGrow !== '0') continue;
        const r = el.getBoundingClientRect();
        if (r.height > 0) contentBottom = Math.max(contentBottom, r.bottom - top);
      }
      // 3) 글자 크기(컷 메모 제외)
      const small = [];
      const walker = document.createTreeWalker(pg, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const t = walker.currentNode;
        if (!t.textContent.trim()) continue;
        const el = t.parentElement;
        if (el.closest('.lab')) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < MIN_FONT) small.push(`${fs}px "${t.textContent.trim().slice(0, 16)}"`);
      }
      // 4) 말풍선 줄 수
      const longBal = [];
      for (const b of pg.querySelectorAll('.bal')) {
        const cs = getComputedStyle(b);
        const lh = parseFloat(cs.lineHeight);
        const inner = b.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        const lines = Math.round(inner / lh);
        if (lines > MAX_BAL_LINES) longBal.push(`${lines}줄 "${b.textContent.trim().slice(0, 16)}"`);
      }
      // 5) 텍스트 요소끼리 겹침
      const boxes = [...pg.querySelectorAll('.bal, .nar, .np, .sys, .pr, .cap')]
        .filter((e) => getComputedStyle(e).display !== 'none')
        .map((e) => ({ e, r: e.getBoundingClientRect() }));
      const overlaps = [];
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i].r, c = boxes[j].r;
          if (a.left < c.right - 4 && c.left < a.right - 4 && a.top < c.bottom - 4 && c.top < a.bottom - 4)
            overlaps.push(`"${boxes[i].e.textContent.trim().slice(0, 10)}" ↔ "${boxes[j].e.textContent.trim().slice(0, 10)}"`);
        }
      return {
        contentBottom: Math.round(contentBottom),
        overflow: Math.max(0, Math.round(contentBottom - PAGE_H)),
        small, longBal, overlaps, placed, missing, missingNames,
      };
    },
    { assets, PAGE_H, MIN_FONT, MAX_BAL_LINES },
  );

  const problems = [];
  if (report.overflow > 0) problems.push(`높이 초과 ${report.overflow}px (내용 ${report.contentBottom}px)`);
  if (report.small.length) problems.push(`작은 글자 ${report.small.length}개: ${report.small.slice(0, 3).join(' / ')}`);
  if (report.longBal.length) problems.push(`긴 말풍선: ${report.longBal.join(' / ')}`);
  if (report.overlaps.length) problems.push(`겹침: ${report.overlaps.join(' / ')}`);
  totalProblems += problems.length;

  const status = problems.length ? '⚠' : '✓';
  console.log(`${status} ${b.title.padEnd(12)} 내용 ${String(report.contentBottom).padStart(5)}px / ${PAGE_H}px · 에셋 합성 ${report.placed} · 미제공 ${report.missing}`);
  for (const p of problems) console.log('    - ' + p);

  if (!CHECK_ONLY) {
    const name = b.title.replace(/[^\w가-힣]+/g, '_').replace(/_+$/, '') + (NOTES ? '' : '_clean') + '.png';
    await page.locator('.pg').screenshot({ path: path.join(OUT, name) });
  }
}

await browser.close();
fs.rmSync(tmpDir, { recursive: true, force: true });
console.log(totalProblems ? `\n문제 ${totalProblems}건` : '\n모든 장 통과');
process.exitCode = totalProblems ? 2 : 0;
