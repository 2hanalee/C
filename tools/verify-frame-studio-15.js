// Frame Studio 15 서명 AI 1단계 검증 (Playwright, Chromium)
// 사용: node tools/verify-frame-studio-15.js <v15 HTML 절대경로> <결과 폴더>
// A: AI 없이 키워드 페르소나·축 조절·후보 거르기·취향 기록·캐릭터별 저장·새로고침 유지
// B: window.claude를 흉내 내 Claude 페르소나 추정·후보 추천·프롬프트 구성을 확인한다(실제 Claude 응답은 아님).
const { chromium } = require('playwright');
const FILE = 'file://' + process.argv[2], OUT = process.argv[3];
const R = {}, ok = (k, v) => { R[k] = v; };
(async () => {
  const b = await chromium.launch(), errs = [];
  const hook = p => { p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); }); };
  // ── A: AI 없음
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  const p = await ctx.newPage(); hook(p);
  await p.goto(FILE); await p.waitForTimeout(2500);
  const val = id => p.evaluate(i => document.querySelector(i).value, id);
  const txt = id => p.evaluate(i => document.querySelector(i).textContent, id);
  await p.click('#tab-sig'); await p.waitForTimeout(200);
  ok('qualInitial', await txt('#sigQual'));
  ok('personaOff', await txt('#personaSrc'));
  const slant0 = await val('#sg-slant');
  await p.click('#personaInfer'); await p.waitForTimeout(300);
  ok('kwPersona', { src: await txt('#personaSrc'), note: await txt('#personaNote'), slant: [slant0, await val('#sg-slant')], axes: await p.evaluate(() => [...document.querySelectorAll('[data-pa]')].map(e => e.dataset.pa + '=' + e.value).join(' ')), font: await val('#fontEn') });
  await p.evaluate(() => { const e = document.querySelector('[data-pa="energy"]'); e.value = 95; e.dispatchEvent(new Event('input', { bubbles: true })); });
  ok('axisMove', { src: await txt('#personaSrc'), slant: await val('#sg-slant'), tail: await val('#sg-tail') });
  await p.click('#candGo'); await p.waitForTimeout(300);
  ok('cands', { n: await p.evaluate(() => document.querySelectorAll('#sigCands [data-ci]').length), msg: await txt('#candMsg'), labels: await p.evaluate(() => [...document.querySelectorAll('#sigCands b')].map(x => x.textContent).join(', ')), aiHidden: await p.evaluate(() => document.querySelector('#candAI').hidden) });
  await p.locator('#sigQualBox').screenshot({ path: OUT + '/cands.png' });
  // 취향: 후보 적용 → 꼬리 늘리기 두 번
  for (let r = 0; r < 2; r++) {
    await p.click('#sigCands [data-ci="0"]'); await p.waitForTimeout(150);
    await p.evaluate(() => { const e = document.querySelector('#sg-tail'); e.value = Math.min(2.5, +e.value + 0.6); e.dispatchEvent(new Event('input', { bubbles: true })); });
    await p.click('#candGo'); await p.waitForTimeout(250);
  }
  ok('prefs', { sum: await txt('#prefSum'), applyVisible: !(await p.evaluate(() => document.querySelector('#prefApply').hidden)), applied: await txt('#aiApplied') });
  await p.click('#prefApply'); await p.waitForTimeout(200);
  ok('prefApplied', { sum: await txt('#prefSum'), status: await txt('#status') });
  // 캐릭터별 페르소나 · 겹침 경고
  const p1 = await p.evaluate(() => [...document.querySelectorAll('[data-pa]')].map(e => e.value).join(','));
  await p.click('#charNew'); await p.waitForTimeout(300); await p.click('#tab-sig');
  ok('newChar', await txt('#personaSrc'));
  await p.click('#personaInfer'); await p.waitForTimeout(300);
  ok('nearWarn', await txt('#personaNote'));
  await p.selectOption('#charSel', { index: 0 }); await p.waitForTimeout(800); await p.click('#tab-sig');
  ok('backChar1', { src: await txt('#personaSrc'), same: p1 === await p.evaluate(() => [...document.querySelectorAll('[data-pa]')].map(e => e.value).join(',')) });
  await p.waitForTimeout(400); await p.reload(); await p.waitForTimeout(2500); await p.click('#tab-sig');
  ok('reload', { src: await txt('#personaSrc'), axes: p1 === await p.evaluate(() => [...document.querySelectorAll('[data-pa]')].map(e => e.value).join(',')), prefs: (await txt('#prefSum')).slice(0, 90) });
  await p.locator('#pane-sig').screenshot({ path: OUT + '/sig-pane.png' });
  // ── B: AI 흉내
  const c2 = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  await c2.addInitScript(() => {
    window.__prompts = [];
    window.claude = { use: async name => name === 'sample' ? { json: async (prompt) => { window.__prompts.push(prompt); await new Promise(r => setTimeout(r, 50));
      if (prompt.includes('"axes"')) return { axes: { formal: 0.8, flair: 0.7, edge: 0.3, energy: 0.4, abstract: 0.6, classic: 0.9 }, why: { formal: '군주라는 설정' }, summary: '격식 있고 장식적인 고전 서명' };
      if (prompt.includes('[후보]')) return { picks: [{ i: 2, why: '균형이 가장 좋음' }, { i: 0, why: '장식이 어울림' }, { i: 99, why: '없는 번호' }, { i: 2, why: '중복' }] };
      return { patch: { weight: 0.5 }, note: '굵기를 올렸습니다' }; } } : null };
  });
  const q = await c2.newPage(); hook(q);
  await q.goto(FILE); await q.waitForTimeout(2500); await q.click('#tab-sig');
  await q.click('#personaInfer'); await q.waitForTimeout(400);
  ok('aiPersona', { src: await q.evaluate(() => document.querySelector('#personaSrc').textContent), note: await q.evaluate(() => document.querySelector('#personaNote').textContent), why: await q.evaluate(() => document.querySelector('[data-pa="formal"]').title), formal: await q.evaluate(() => document.querySelector('[data-pa="formal"]').value) });
  await q.click('#candGo'); await q.waitForTimeout(300);
  await q.click('#candAI'); await q.waitForTimeout(400);
  ok('aiPicks', { badges: await q.evaluate(() => [...document.querySelectorAll('#sigCands .pick b')].map(x => x.textContent)), msg: await q.evaluate(() => document.querySelector('#candMsg').textContent) });
  await q.fill('#aiText', '더 굵게'); await q.click('#aiGo'); await q.waitForTimeout(300);
  ok('prompts', await q.evaluate(() => window.__prompts.map(x => ({ len: x.length, fenced: x.includes('<<<') && x.includes('>>>'), persona: x.includes('[서명 페르소나'), axesSpec: x.includes('[축]'), cands: x.includes('[후보]') }))));
  ok('aiApplied', await q.evaluate(() => document.querySelector('#aiApplied').textContent));
  ok('errors', errs);
  console.log(JSON.stringify(R, null, 1));
  await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
