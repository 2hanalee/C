// 「과거」 구획 점검: 원문 일치, 먹칠, 열람 흐름, 가로 넘침. 화면 캡처는 출력 폴더를 주면 남긴다.
// 준비: 저장소 맨 위에서 python3 -m http.server 8765
//   node tools/qa/qa-past.js [캡처 폴더]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const split = require('./past-split.js');

const ROOT = path.join(__dirname, '..', '..');
const fails = [];
const fail = (m) => fails.push(m);

// 1. 데이터: past 문장을 이으면 v3 원문과 같고, 원문은 v3 블록 해시와 같다
const src = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'v3-past.json'), 'utf8'));
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'assets', 'js', 'characters.js'), 'utf8'), sb);
const C = sb.window.CHARACTERS;
const sha8 = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 8);
const txt = (it) => (typeof it === 'string' ? it : it.t);
src.items.forEach((it) => {
  const c = C.find((x) => x.no === it.no);
  if (sha8(it.text) !== it.h) fail(`${it.no}번 스냅숏이 v3 해시와 다름`);
  if (!c || !c.past) return fail(`${it.no}번 past 없음`);
  if (c.past.map(txt).join(' ') !== it.text) fail(`${c.name} past 가 원문과 다름`);
  if (split(it.text).length !== c.past.length) fail(`${c.name} 문장 수 다름`);
  if (it.traces) {
    const tr = c.pastTraces || [];
    it.traces.forEach((t, i) => { if (!tr[i] || txt(tr[i]) !== t.text) fail(`${c.name} 남은 흔적 ${i} 다름`); });
  }
  const topics = c.internal.concat(c.secret).map((r) => r.topic);
  c.past.concat(c.pastTraces || []).forEach((p) => {
    if (typeof p === 'string') return;
    if (p.ref && topics.indexOf(p.ref) === -1) fail(`${c.name} 먹칠 문장의 기록 「${p.ref}」 없음`);
    if (!p.ref && p.lv !== 1 && p.lv !== 2) fail(`${c.name} 먹칠 등급 없음`);
  });
});
if (C.length !== src.items.length) fail(`인물 ${C.length}명, 원문 ${src.items.length}개`);

// 이어진 같은 기록의 문장은 막대 하나로 묶이므로, 화면의 막대 수는 묶음 수와 같아야 한다
const keyOf = (x) => (typeof x === 'string' ? null : x.ref || 'lv' + x.lv + Math.random());
const groups = (c) => {
  let n = 0;
  [c.past, ...(c.pastTraces || []).map((t) => [t])].forEach((list) => {
    let prev = null;
    list.forEach((x) => { const k = keyOf(x); if (k && k !== prev) n++; prev = k; });
  });
  return n;
};

// 2. 화면
(async () => {
  const shots = process.argv[2];
  const b = await chromium.launch();
  for (const [w, h, tag] of [[1280, 900, 'desktop'], [375, 812, 'phone']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('blackout.gate', 'seen'); } catch (e) {} });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => fail(`${tag} 스크립트 오류: ${e.message}`));
    for (const c of C) {
      await p.goto('http://localhost:8765/characters.html#' + c.id);
      await p.waitForFunction((n) => { const h = document.querySelector('.sheetcard h1'); return h && h.textContent === n && document.querySelector('.sc-past'); }, c.name);
      await p.waitForTimeout(450);
      const r = await p.evaluate(() => {
        const sec = document.querySelector('.sc-past');
        const shown = sec.innerText;
        const bars = [...sec.querySelectorAll('.redact')];
        return {
          shown,
          diamond: shown.indexOf('◇') !== -1,
          bars: bars.length,
          leaked: bars.filter((x) => !x.classList.contains('open') && x.querySelector('.redact-text').offsetParent !== null).length,
          over: document.documentElement.scrollWidth - window.innerWidth,
        };
      });
      const hiddenCount = groups(c);
      if (r.diamond) fail(`${tag} ${c.name}: ◇ 가 화면에 보임`);
      if (r.bars !== hiddenCount) fail(`${tag} ${c.name}: 먹칠 ${r.bars}개, 데이터 ${hiddenCount}개`);
      if (r.leaked) fail(`${tag} ${c.name}: 열기 전에 가린 문장이 보임`);
      if (r.over > 0) fail(`${tag} ${c.name}: 가로 넘침 ${r.over}px`);
      c.past.concat(c.pastTraces || []).forEach((x) => {
        if (typeof x !== 'string') return;
        const s = x.replace(/\s*◇/g, '');
        if (r.shown.indexOf(s) === -1) fail(`${tag} ${c.name}: 공개 문장이 안 보임: ${s.slice(0, 20)}`);
      });
      if (shots && ['reina-de-rose', 'kwon-doha', 'cha-yuri'].includes(c.id)) {
        await p.locator('.sc-past').screenshot({ path: path.join(shots, `past-${c.id}-${tag}.png`) });
      }
    }
    // 열람 흐름: 내부용은 바로, 기밀은 경고창을 거쳐 열리고, 아래 가려진 기록도 함께 열린다
    if (tag === 'desktop') {
      await p.goto('http://localhost:8765/characters.html#kang-sea');
      await p.waitForFunction(() => { const h = document.querySelector('.sheetcard h1'); return h && h.textContent === '강세아'; });
      await p.waitForTimeout(450);
      const inner = p.locator('.sc-past .redact[data-lv="1"]').first();
      const key = await inner.getAttribute('data-key');
      await inner.click();
      if (!(await inner.evaluate((el) => el.classList.contains('open')))) fail('내부용 먹칠이 눌러도 안 열림');
      const recOpen = await p.evaluate((k) => { const b = [...document.querySelectorAll('.rec')].find((x) => x.dataset.key === k); return b && b.classList.contains('open'); }, key);
      if (!recOpen) fail('내부용 먹칠을 열었는데 같은 가려진 기록이 안 열림');

      await p.goto('http://localhost:8765/characters.html#reina-de-rose');
      await p.waitForFunction(() => { const h = document.querySelector('.sheetcard h1'); return h && h.textContent === '레이나 드 로즈'; });
      await p.waitForTimeout(450);
      const sec = p.locator('.sc-past .redact[data-lv="2"]').first();
      await sec.focus();
      await p.keyboard.press('Enter');
      if (!(await p.isVisible('.warn-sheet'))) fail('기밀 먹칠이 경고창을 안 띄움');
      await p.fill('#warn-input', '확인');
      await p.click('.warn-sheet button[type=submit]');
      await p.waitForTimeout(200);
      if (!(await sec.evaluate((el) => el.classList.contains('open')))) fail('확인 뒤에도 기밀 먹칠이 안 열림');
      const text = await sec.innerText();
      if (text.indexOf('판단 착오') === -1) fail('연 기밀 문장이 원문과 다름');
      if (shots) await p.locator('.sc-past').screenshot({ path: path.join(shots, 'past-reina-de-rose-opened.png') });
      // 가려진 기록 쪽에서 닫으면 먹칠도 다시 덮인다
      const k2 = await sec.getAttribute('data-key');
      await p.evaluate((k) => { const b = [...document.querySelectorAll('.rec')].find((x) => x.dataset.key === k); b.querySelector('.rec-tab').click(); }, k2);
      if (await sec.evaluate((el) => el.classList.contains('open'))) fail('가려진 기록을 닫아도 먹칠이 안 덮임');
    }
    await ctx.close();
  }
  await b.close();
  console.log(fails.length ? '실패 ' + fails.length + '건\n' + fails.join('\n') : '과거 점검 통과');
  process.exit(fails.length ? 1 : 0);
})();
