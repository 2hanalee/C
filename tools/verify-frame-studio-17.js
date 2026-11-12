// Frame Studio 17 검증: 펜 서명체 목록·새 조절·프리셋·글자 잇기·다시 그리기 시간·후보·보고 다듬기(흉내 낸 Claude)·페르소나·내보내기
// 사용: node tools/verify-frame-studio-17.js <v17 HTML 절대경로> <결과 폴더>
const { chromium } = require('playwright');
const fs = require('fs');
const FILE = 'file://' + process.argv[2], OUT = process.argv[3];
const R = {}, ok = (k, v) => { R[k] = v; };
(async () => {
  const b = await chromium.launch(), errs = [];
  const c = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  await c.addInitScript(() => {
    window.__prompts = [];
    const s = async () => ({ text: '' });
    s.limits = async () => ({ images: { maxCount: 4 } });
    s.json = async (pr, o) => { window.__prompts.push(pr);
      if (pr.includes('"axes"')) return { axes: { formal: 0.3, flair: 0.8, edge: 0.3, energy: 0.8, abstract: 0.6, classic: 0.4 }, why: {}, summary: '역동적인 펜 서명' };
      if (pr.includes('"scores"')) return { scores: { legibility: 4, character: 4, flow: 3, balance: 4, ornament: 4 }, overall: 7, done: false, note: '필압 변화를 조금 키움', patch: { pressure: 0.95, contrast: 0.8 } };
      return { patch: {} }; };
    window.claude = { use: async n => n === 'sample' ? s : null };
  });
  const p = await c.newPage();
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  await p.goto(FILE); await p.waitForTimeout(3500); await p.click('#tab-sig');
  const sigPath = () => p.evaluate(() => { const g = document.querySelector('#canvas [data-field="__sig"]'); const ps = g ? [...g.querySelectorAll('path')] : []; const d = ps.length ? ps[ps.length - 1].getAttribute('d') : ''; return { subpaths: (d.match(/M/g) || []).length, kb: Math.round(d.length / 1024) }; });
  ok('fonts', await p.evaluate(() => [...document.querySelector('#fontEn').options].map(o => o.value + '=' + o.textContent)));
  ok('sliders', await p.evaluate(() => ['pressure', 'contrast', 'connect'].map(k => k + ':' + !!document.querySelector('#sg-' + k))));
  ok('outline', await sigPath());
  await p.click('[data-preset="펜 필기체"]'); await p.waitForTimeout(300);
  ok('penPreset', { font: await p.evaluate(() => document.querySelector('#fontEn').value), path: await sigPath(), qual: await p.evaluate(() => document.querySelector('#sigQual').textContent) });
  const setS = (k, v) => p.evaluate(([k, v]) => { const e = document.querySelector('#sg-' + k); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, [k, v]);
  await setS('connect', 0); await p.waitForTimeout(150); const c0 = await sigPath();
  await setS('connect', 1); await p.waitForTimeout(150); const c1 = await sigPath();
  ok('connect', { off: c0, on: c1 });
  await p.locator('.canvasWrap').screenshot({ path: OUT + '/card-pen.png' });
  // paint 시간
  ok('paint', await p.evaluate(() => { const el = document.querySelector('#f-nameEn'); const ts = []; for (let i = 0; i < 10; i++) { el.value = 'Celestis' + 'abcdefghij'[i]; const t = performance.now(); el.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('#canvas svg').getBoundingClientRect(); ts.push(performance.now() - t); } ts.sort((a, b) => a - b); el.value = 'Celestis'; el.dispatchEvent(new Event('input', { bubbles: true })); return { med: +ts[5].toFixed(1), max: +ts[9].toFixed(1) }; }));
  await p.click('#tab-sig');
  await p.click('#candGo'); await p.waitForTimeout(500);
  ok('cands', await p.evaluate(() => document.querySelector('#candMsg').textContent));
  await p.locator('#sigQualBox').screenshot({ path: OUT + '/cands-pen.png' });
  await p.click('#reviewGo'); await p.waitForFunction(() => !document.querySelector('#reviewGo').disabled && document.querySelectorAll('#reviewLog .rv').length, null, { timeout: 30000 });
  ok('review', { rows: await p.evaluate(() => [...document.querySelectorAll('#reviewLog .rv b')].map(x => x.textContent)), pressure: await p.evaluate(() => document.querySelector('#sg-pressure').value), prompt: await p.evaluate(() => { const x = window.__prompts.find(q => q.includes('"scores"')); return x ? ['pressure(', 'contrast(', 'connect(', '펜 · Decorous'].map(k => k + ':' + x.includes(k)).join(' ') : null; }) });
  await p.click('#personaInfer'); await p.waitForTimeout(400);
  ok('persona', { fontEn: await p.evaluate(() => document.querySelector('#fontEn').value), pressure: await p.evaluate(() => document.querySelector('#sg-pressure').value), contrast: await p.evaluate(() => document.querySelector('#sg-contrast').value) });
  await p.click('#tab-export'); await p.click('#expSave'); await p.waitForFunction(() => !document.querySelector('#expSave').disabled); await p.waitForTimeout(600);
  fs.writeFileSync(OUT + '/export-pen.png', Buffer.from((await p.evaluate(() => document.querySelector('#expImg').src)).split(',')[1], 'base64'));
  ok('export', await p.evaluate(() => document.querySelector('#status').textContent));
  ok('errors', errs);
  console.log(JSON.stringify(R, null, 1));
  await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
