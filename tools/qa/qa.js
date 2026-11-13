// 블랙아웃 점검: node qa.js  (사이트는 http://localhost:8765 에서 연다)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/user/C', BASE = 'http://localhost:8765/';
const out = { errors: [], fails: [], notes: [] };
const fail = (m) => out.fails.push(m);
const VIEWS = { phone: { width: 390, height: 844 }, tablet: { width: 820, height: 1180 }, pc: { width: 1440, height: 900 } };

async function newPage(browser, view, skipGate = true) {
  const ctx = await browser.newContext({ viewport: VIEWS[view], deviceScaleFactor: 1 });
  if (skipGate) await ctx.addInitScript(() => { try { sessionStorage.setItem('blackout.gate', 'seen'); } catch (e) {} });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => out.errors.push(view + ' ' + page.url() + ' ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') out.errors.push(view + ' ' + page.url() + ' ' + m.text()); });
  return page;
}
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

(async () => {
  const browser = await chromium.launch();
  const pages = ['index.html', 'world.html', 'characters.html', 'timeline.html', 'webtoon.html'];
  // 1. 페이지별 가로 넘침
  for (const v of Object.keys(VIEWS)) {
    const p = await newPage(browser, v);
    for (const f of pages) {
      await p.goto(BASE + f); await p.waitForTimeout(200);
      const o = await overflow(p); if (o > 0) fail(`넘침 ${v} ${f} ${o}px`);
    }
    await p.context().close();
  }
  // 2. 인물 48인, 문서 8건, 장소 9곳
  const p = await newPage(browser, 'phone');
  await p.goto(BASE + 'characters.html');
  const ids = await p.evaluate(() => window.CHARACTERS.map((c) => c.id));
  if (ids.length !== 49) fail('인물 수 ' + ids.length);
  const cards = await p.locator('.rcard').count(); if (cards !== 49) fail('카드 수 ' + cards);
  for (const id of ids) {
    await p.goto(BASE + 'characters.html#' + id);
    const ok = await p.locator('.sheetcard h1').count(); if (!ok) fail('인물 화면 없음 ' + id);
    const o = await overflow(p); if (o > 0) fail('넘침 인물 ' + id + ' ' + o);
  }
  await p.goto(BASE + 'world.html');
  const docs = await p.evaluate(() => window.WORLD.map((d) => d.id));
  if (docs.length !== 10) fail('문서 수 ' + docs.length);
  for (const id of docs) {
    await p.goto(BASE + 'world.html#' + id);
    if (!(await p.locator('.docsheet h1').count())) fail('문서 화면 없음 ' + id);
    const o = await overflow(p); if (o > 0) fail('넘침 문서 ' + id + ' ' + o);
  }
  await p.goto(BASE + 'timeline.html#map');
  const places = await p.evaluate(() => window.PLACES.map((x) => x.id));
  if (places.length !== 11) fail('장소 수 ' + places.length);
  for (const id of places) {
    await p.goto(BASE + 'timeline.html#' + id); await p.waitForTimeout(50);
    const pressed = await p.locator(`.pin[data-place="${id}"][aria-pressed="true"]`).count(); if (!pressed) fail('장소 선택 안 됨 ' + id);
  }
  // 3. 링크: 로컬 파일과 인물/문서 해시
  const hrefs = new Set();
  for (const f of pages) {
    await p.goto(BASE + f); await p.waitForTimeout(100);
    (await p.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')))).forEach((h) => hrefs.add(f + '|' + h));
  }
  for (const id of docs) { await p.goto(BASE + 'world.html#' + id); (await p.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')))).forEach((h) => hrefs.add('world.html|' + h)); }
  let linkCount = 0;
  for (const item of hrefs) {
    const [from, h] = item.split('|');
    if (/^(https?:|mailto:)/.test(h)) continue;
    linkCount++;
    const [file, hash] = h.split('#');
    const target = file || from;
    if (hash === 'app' || hash === 'board') continue;
    if (!fs.existsSync(path.join(ROOT, target))) { fail('없는 파일 ' + from + ' → ' + h); continue; }
    if (hash && target === 'characters.html' && hash !== 'list' && !ids.includes(hash)) fail('없는 인물 ' + h);
    if (hash && target === 'world.html' && hash !== 'list' && !docs.includes(hash)) fail('없는 문서 ' + h);
  }
  out.notes.push('링크 ' + linkCount + '개 확인');
  // 4. 기밀 흐름
  await p.goto(BASE + 'world.html#july-night');
  await p.locator('.rec[data-lv="2"] .rec-tab').first().click();
  if (!(await p.locator('dialog.warn-sheet[open]').count())) fail('기밀 경고창 안 열림');
  await p.fill('#warn-input', '아니');
  await p.click('.warn-sheet button[type=submit]');
  if (!(await p.locator('dialog.warn-sheet[open]').count())) fail('틀린 입력에 경고창 닫힘');
  await p.fill('#warn-input', '확인');
  await p.click('.warn-sheet button[type=submit]');
  if (!(await p.locator('.rec[data-lv="2"].open').count())) fail('기밀 안 열림');
  // 5. 입장 연출
  const g = await newPage(browser, 'phone', false);
  await g.goto(BASE + 'index.html'); await g.waitForTimeout(400);
  const gateOn = await g.evaluate(() => { const x = document.getElementById('gate'); return x && !x.hidden; });
  if (!gateOn) fail('입장 연출 안 뜸');
  else {
    await g.click('#gate-skip'); await g.waitForTimeout(2600);
    if (await g.isVisible('#gate-enter')) { await g.click('#gate-enter'); await g.waitForTimeout(900); }
    const hidden = await g.evaluate(() => document.getElementById('gate').hidden);
    if (!hidden) fail('입장 연출이 닫히지 않음');
  }
  await g.context().close();
  // 6. 확장 점검(용어, 시대 막대, 사진)
  const extra = process.argv[2] ? require(path.resolve(process.argv[2])) : null;
  if (extra) await extra({ browser, newPage, BASE, fail, out, overflow });
  await browser.close();
  console.log(JSON.stringify({ fails: out.fails, errors: [...new Set(out.errors)].slice(0, 20), notes: out.notes }, null, 1));
})();
