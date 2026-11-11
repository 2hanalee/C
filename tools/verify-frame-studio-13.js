// Frame Studio 13 수정 검증 스크립트 (Playwright, Chromium)
// 사용: LANG=C.UTF-8 node tools/verify-frame-studio-13.js <HTML 절대경로> <결과 폴더>
// 결과 폴더의 상위 폴더에 shots/art.jpg(큰 테스트 이미지)가 있어야 한다. verify-frame-studio.js가 만든다.
// UTF-8 로케일이 아니면 Chromium이 한글 다운로드 파일 이름을 "download"로 바꾼다(도구 버그 아님).
const { chromium } = require('playwright');
const fs = require('fs');
const FILE = 'file://' + process.argv[2], OUT = process.argv[3];
const R = {}, ok = (k, v) => { R[k] = v; };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const errs = [], downloads = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  p.on('download', d => downloads.push(d.suggestedFilename()));
  await p.goto(FILE); await p.waitForTimeout(2500);
  const st = () => p.evaluate(() => document.querySelector('#status').textContent);
  // B3
  ok('B3_seg', await p.evaluate(() => ['#expFmt', '#expScope', '#artMode', '.bar .seg'].map(s => [...document.querySelectorAll(s + ' button')].map(x => x.getAttribute('aria-pressed')).join(','))));
  // B4
  await p.fill('#f-nameEn', 'AURELIA'); await p.fill('#f-nameKo', '아우렐리아');
  await p.selectOption('#tplSel', 'profile-card-lite');
  ok('B4_carry', await p.evaluate(() => [document.querySelector('#f-nameEn').value, document.querySelector('#f-nameKo').value, document.querySelector('#f-quote').value, document.querySelector('#status').textContent]));
  await p.selectOption('#tplSel', 'profile-card');
  // B5
  await p.click('#tab-sig');
  await p.fill('#aiText', '조금 더 굵게'); await p.click('#aiGo'); await p.waitForTimeout(200);
  ok('B5_kw', await p.evaluate(() => document.querySelector('#aiApplied').textContent));
  await p.fill('#aiText', '금색으로'); await p.click('#aiGo'); await p.waitForTimeout(200);
  ok('B5_gold', await p.evaluate(() => document.querySelector('#aiApplied').textContent));
  // B10
  ok('B10_ime', await p.evaluate(() => { const a = document.querySelector('#aiApplied'); a.textContent = 'X'; const i = document.querySelector('#aiText'); i.value = '얇게'; i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true })); const comp = a.textContent; i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); return [comp, a.textContent]; }));
  // art
  await p.setInputFiles('#artFile', OUT + '/../shots/art.jpg'); await p.waitForTimeout(1500);
  // B2
  await p.click('#tab-legi'); await p.click('#legiAuto'); await p.waitForTimeout(3000);
  ok('B2_order', await p.evaluate(() => { const f = document.querySelector('#L-fixed'), kids = [...f.children].map(n => n.id || n.tagName); const bi = kids.indexOf('L-back'); return { backIndex: bi, backs: document.querySelectorAll('#L-back .legi-back').length, inSlots: document.querySelectorAll('#L-slots .legi-back').length, firstAfter: kids.slice(bi + 1, bi + 3) }; }));
  ok('B2_legi', await st());
  await p.locator('.canvasWrap').screenshot({ path: OUT + '/preview.png' });
  // B14/B15
  await p.click('#tab-fields');
  ok('B15_sizes', await p.evaluate(() => ['.tcIn', '.tsIn'].map(s => { const r = document.querySelector(s).getBoundingClientRect(); return s + ':' + Math.round(r.width) + 'x' + Math.round(r.height); })));
  ok('B14_colors', await p.evaluate(() => [getComputedStyle(document.querySelector('.fld .key')).color, getComputedStyle(document.querySelector('#f-nameEn')).borderTopColor]));
  // export PNG (no downloads cap → anchor + fallback)
  await p.click('#tab-export');
  await p.click('#expSave'); await p.waitForFunction(() => !document.querySelector('#expSave').disabled); await p.waitForTimeout(800);
  ok('B1_png', { status: await st(), link: await p.evaluate(() => [document.querySelector('#expLink').hidden, document.querySelector('#expLink').download, document.querySelector('#expImg').hidden, document.querySelector('#expText').hidden]) });
  const src = await p.evaluate(() => document.querySelector('#expImg').src);
  fs.writeFileSync(OUT + '/export1x.png', Buffer.from(src.split(',')[1], 'base64'));
  // B1 project json
  await p.click('#projSave'); await p.waitForTimeout(800);
  ok('B1_json', { status: await st(), state: await p.evaluate(() => [document.querySelector('#expLink').hidden, document.querySelector('#expLink').textContent, document.querySelector('#expImg').hidden, document.querySelector('#expText').hidden, document.querySelector('#expText').value.slice(0, 30).replace(/\s+/g, ' ')]) });
  // B9 CSV with one bad image
  fs.writeFileSync(OUT + '/bad.png', 'not an image');
  await p.click('#batchTpl');
  await p.evaluate(() => { const t = document.querySelector('#batchCsv'); t.value = 'nameEn,nameKo\nALPHA,알파\nbad,배드\nGAMMA,감마\n'; });
  await p.setInputFiles('#batchFiles', [OUT + '/bad.png']); await p.waitForTimeout(400);
  await p.click('#batchGo'); await p.waitForFunction(() => !document.querySelector('#batchGo').disabled, null, { timeout: 60000 }); await p.waitForTimeout(800);
  ok('B9_csv', { status: await st(), info: await p.evaluate(() => document.querySelector('#batchInfo').textContent), link: await p.evaluate(() => document.querySelector('#expLink').textContent) });
  // B7
  await p.click('#tab-art');
  await p.click('#clearArt'); ok('B7_first', await p.evaluate(() => [document.querySelector('#clearArt').textContent, !!document.querySelector('#artInfo').textContent.match(/art\.jpg/)]));
  await p.click('#clearArt'); ok('B7_second', await p.evaluate(() => [document.querySelector('#clearArt').textContent, document.querySelector('#artInfo').textContent]));
  // B6
  await p.click('#tab-export');
  await p.evaluate(async () => { const j = document.querySelector('#json'); const d = JSON.parse(j.value); d.template.id = 'big'; d.template.canvas = { w: 6000, h: 6000 }; j.value = JSON.stringify(d); document.querySelector('#jsonApply').click(); });
  await p.selectOption('#expScale', '3'); await p.waitForTimeout(200);
  ok('B6_hint', await p.evaluate(() => document.querySelector('#expSize').textContent));
  await p.click('#expSave'); await p.waitForFunction(() => !document.querySelector('#expSave').disabled); await p.waitForTimeout(300);
  ok('B6_status', await st());
  await p.selectOption('#expScale', '0.5'); await p.click('#expSave'); await p.waitForFunction(() => !document.querySelector('#expSave').disabled, null, { timeout: 60000 }); await p.waitForTimeout(500);
  ok('B6_half', await st());
  ok('downloads', downloads);
  ok('errors', errs);
  console.log(JSON.stringify(R, null, 1));
  const m = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const q = await m.newPage(); await q.goto(FILE); await q.waitForTimeout(2000);
  console.log('mobile hscroll', await q.evaluate(() => document.documentElement.scrollWidth + '/' + innerWidth));
  await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
