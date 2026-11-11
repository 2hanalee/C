// Frame Studio 실측 검증 스크립트 (Playwright, Chromium)
// 사용: node tools/verify-frame-studio.js <HTML 절대경로> <결과 폴더>
// 로드 오류, 다시 그리기 시간, 내보내기 시간·크기, 미리보기 대 내보내기, 모바일 레이아웃 등을 JSON으로 출력한다.
const { chromium } = require('playwright');
const fs = require('fs');
const FILE = 'file://' + process.argv[2], OUT = process.argv[3];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [], failed = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  p.on('requestfailed', r => failed.push(r.url().slice(0, 80)));
  const t0 = Date.now();
  await p.goto(FILE, { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  const R = {};
  R.loadMs = Date.now() - t0 - 2500;
  R.errs = errs; R.failed = [...new Set(failed)].slice(0, 5);
  R.fonts = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family).filter((v, i, a) => a.indexOf(v) === i));
  // T2 seg aria-pressed
  R.seg = await p.evaluate(() => ['#expFmt', '#expScope', '#artMode', '#legiShadow'].map(s => s + ':' + [...document.querySelectorAll(s + ' button')].map(x => x.getAttribute('aria-pressed')).join(',')));
  await p.screenshot({ path: OUT + '/desktop.png' });
  await p.click('#tab-export'); await p.waitForTimeout(200);
  await p.screenshot({ path: OUT + '/export-tab.png' });
  // T3 values across templates
  await p.click('#tab-fields');
  await p.fill('#f-nameEn', 'AURELIA');
  await p.selectOption('#tplSel', 'profile-card-lite');
  R.carry = await p.evaluate(() => document.querySelector('#f-nameEn').value);
  await p.selectOption('#tplSel', 'profile-card');
  // T7 keyword fallback
  await p.click('#tab-sig');
  await p.fill('#aiText', '조금 더 굵게'); await p.click('#aiGo'); await p.waitForTimeout(300);
  R.kw = await p.evaluate(() => document.querySelector('#aiApplied').textContent);
  // T4 paint timing
  const timePaint = () => p.evaluate(() => { const el = document.querySelector('#f-nameKo'); const ts = []; for (let i = 0; i < 15; i++) { el.value = '테스트' + i; const t = performance.now(); el.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('#canvas svg').getBoundingClientRect(); ts.push(performance.now() - t); } ts.sort((a, b) => a - b); return { med: +ts[7].toFixed(1), max: +ts[14].toFixed(1), htmlKB: Math.round(document.querySelector('#canvas').innerHTML.length / 1024) }; });
  R.paintNoArt = await timePaint();
  // make art
  const durl = await p.evaluate(() => { const c = document.createElement('canvas'); c.width = 3000; c.height = 2000; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 3000, 2000); g.addColorStop(0, '#f4e9d0'); g.addColorStop(.5, '#7fb0e0'); g.addColorStop(1, '#fff'); x.fillStyle = g; x.fillRect(0, 0, 3000, 2000); for (let i = 0; i < 40000; i++) { x.fillStyle = `hsl(${Math.random() * 360} 70% ${40 + Math.random() * 50}%)`; x.fillRect(Math.random() * 3000, Math.random() * 2000, 14, 14); } return c.toDataURL('image/jpeg', 0.9); });
  fs.writeFileSync(OUT + '/art.jpg', Buffer.from(durl.split(',')[1], 'base64'));
  R.artKB = Math.round(fs.statSync(OUT + '/art.jpg').size / 1024);
  await p.setInputFiles('#artFile', OUT + '/art.jpg'); await p.waitForTimeout(1500);
  R.status = await p.evaluate(() => document.querySelector('#status').textContent);
  R.paintArt = await timePaint();
  await p.screenshot({ path: OUT + '/desktop-art.png' });
  // legibility check on bright image
  await p.click('#tab-legi'); await p.click('#legiCheck'); await p.waitForTimeout(1500);
  R.legi = await p.evaluate(() => document.querySelector('#legiRes').innerText.replace(/\s+/g, ' ').slice(0, 400));
  await p.click('#legiAuto'); await p.waitForTimeout(2500);
  R.legiAfter = await p.evaluate(() => document.querySelector('#legiRes').innerText.replace(/\s+/g, ' ').slice(0, 400) + ' | ' + document.querySelector('#status').textContent);
  await p.screenshot({ path: OUT + '/legi-auto.png' });
  // T5 export timings
  await p.click('#tab-export');
  for (const sc of ['1', '3']) {
    await p.selectOption('#expScale', sc);
    const t = Date.now(); await p.click('#expSave');
    await p.waitForFunction(() => !document.querySelector('#expSave').disabled, null, { timeout: 60000 });
    await p.waitForTimeout(300);
    R['exp' + sc] = { ms: Date.now() - t - 300, status: await p.evaluate(() => document.querySelector('#status').textContent), dim: await p.evaluate(async () => { const i = document.querySelector('#expImg'); try { await i.decode(); } catch (e) {} return i.naturalWidth + 'x' + i.naturalHeight + ' ' + Math.round(i.src.length * .75 / 1024) + 'KB'; }) };
  }
  const src = await p.evaluate(() => document.querySelector('#expImg').src);
  fs.writeFileSync(OUT + '/export3x.png', Buffer.from(src.split(',')[1], 'base64'));
  await p.selectOption('#expScale', '1'); await p.click('#expSave'); await p.waitForFunction(() => !document.querySelector('#expSave').disabled); await p.waitForTimeout(300);
  fs.writeFileSync(OUT + '/export1x.png', Buffer.from((await p.evaluate(() => document.querySelector('#expImg').src)).split(',')[1], 'base64'));
  await p.locator('.canvasWrap').screenshot({ path: OUT + '/preview.png' });
  R.segAfter = await p.evaluate(() => ['#expFmt', '#expScope', '#artMode'].map(s => s + ':' + [...document.querySelectorAll(s + ' button')].map(x => x.getAttribute('aria-pressed')).join(',')));
  // T6 project save standalone
  await p.click('#projSave'); await p.waitForTimeout(800);
  R.proj = await p.evaluate(async () => { const i = document.querySelector('#expImg'); let ok = true; try { await i.decode(); } catch (e) { ok = false; } return { status: document.querySelector('#status').textContent, src: i.src.slice(0, 40), decodes: ok }; });
  // T10 oversize
  R.big = await p.evaluate(async () => { const j = document.querySelector('#json'); const d = JSON.parse(j.value); d.template.id = 'big'; d.template.canvas = { w: 6000, h: 6000 }; j.value = JSON.stringify(d); document.querySelector('#jsonApply').click(); await new Promise(r => setTimeout(r, 500)); document.querySelector('#expScale').value = '3'; document.querySelector('#expSave').click(); await new Promise(r => setTimeout(r, 6000)); return document.querySelector('#status').textContent + ' | tpls=' + document.querySelector('#tplSel').options.length; });
  // a11y: tab arrow keys, tabindex
  R.tabIdx = await p.evaluate(() => [...document.querySelectorAll('[role=tab]')].map(t => t.tabIndex).join(','));
  R.small = await p.evaluate(() => { document.querySelector('#tab-fields').click(); return ['.tcX', '.tcIn', '.tsIn', '#vPrev', '.chk input'].map(s => { const e = [...document.querySelectorAll(s)].find(x => x.offsetParent); if (!e) return s + ':hidden'; const r = e.getBoundingClientRect(); return s + ':' + Math.round(r.width) + 'x' + Math.round(r.height); }); });
  R.ls = await p.evaluate(() => Object.keys(localStorage).map(k => k + ':' + Math.round(localStorage[k].length / 1024) + 'KB'));
  console.log(JSON.stringify(R, null, 1));
  // mobile
  const m = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const q = await m.newPage(); await q.goto(FILE); await q.waitForTimeout(2000);
  await q.screenshot({ path: OUT + '/mobile.png' });
  await q.evaluate(() => window.scrollTo(0, 500)); await q.waitForTimeout(300);
  await q.screenshot({ path: OUT + '/mobile-scrolled.png' });
  console.log('mobile hscroll', await q.evaluate(() => document.documentElement.scrollWidth + '/' + innerWidth));
  await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
