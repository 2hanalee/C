// Frame Studio 14 검증 스크립트 (Playwright, Chromium)
// 사용: LANG=C.UTF-8 node tools/verify-frame-studio-14.js <v13 HTML> <v14 HTML> <결과 폴더> <큰 테스트 이미지>
// v13에서 데이터를 만든 뒤 v14로 열어 이전, 캐릭터 목록, 줄바꿈, ZIP 분할·중지, 탭 키보드, 템플릿 복제·삭제, 새로고침 후 유지를 확인한다.
// navigator.deviceMemory를 2로 흉내 내 ZIP 분할 기준(80MB)을 낮춘다.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const V13 = 'file://' + process.argv[2], V14 = 'file://' + process.argv[3], OUT = process.argv[4], ART = process.argv[5];
const R = {}, ok = (k, v) => { R[k] = v; };
const done = p => p.waitForFunction(() => [...document.querySelectorAll('.btn')].every(b => !b.textContent.includes('생성 중…') && !b.textContent.includes('만드는 중…')), null, { timeout: 180000 });
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  await ctx.addInitScript(() => { Object.defineProperty(navigator, 'deviceMemory', { get: () => 2 }); });
  const errs = [], downloads = [];
  const hook = p => { p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); }); p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('download', async d => { const f = path.join(OUT, d.suggestedFilename()); await d.saveAs(f); downloads.push(d.suggestedFilename()); }); };
  // ── v13 legacy data
  const p13 = await ctx.newPage(); hook(p13);
  await p13.goto(V13); await p13.waitForTimeout(1500);
  await p13.fill('#f-nameEn', 'LEGACY'); await p13.setInputFiles('#artFile', ART); await p13.waitForTimeout(1500); await p13.close();
  // ── v14
  const p = await ctx.newPage(); hook(p);
  await p.goto(V14); await p.waitForTimeout(2500);
  const st = () => p.evaluate(() => document.querySelector('#status').textContent);
  ok('migrate', await p.evaluate(() => ({ opts: [...document.querySelector('#charSel').options].map(o => o.text), nameEn: document.querySelector('#f-nameEn').value, art: document.querySelector('#artInfo').textContent, artImg: !document.querySelector('#artImg').hidden, saveInfo: document.querySelector('#saveInfo').textContent })));
  // render split perf
  ok('paint', await p.evaluate(() => { const el = document.querySelector('#f-nameKo'); const ts = []; for (let i = 0; i < 15; i++) { el.value = '테스트' + i; const t = performance.now(); el.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('#canvas svg').getBoundingClientRect(); ts.push(performance.now() - t); } ts.sort((a, b) => a - b); return { med: +ts[7].toFixed(1), svgKB: Math.round(document.querySelector('#svgHost').innerHTML.length / 1024) }; }));
  // art alignment: zoom/offset/rotate/flip
  await p.click('#tab-art');
  await p.evaluate(() => { const s = (id, v) => { const e = document.querySelector('#ag-' + id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }; s('zoom', 1.4); s('dx', 220); s('dy', -90); s('rot', 12); document.querySelector('#artFlip').click(); });
  await p.fill('#f-nameKo', '레거시').catch(() => {});
  await p.click('#tab-fields'); await p.fill('#f-nameKo', '레거시');
  // wrap
  await p.fill('#f-quote', 'THE STARS KNEEL BEFORE THE SILENT VOID AND THE MOON WEEPS');
  await p.fill('#f-quoteSub', 'A VERY LONG TRANSLATION LINE THAT SHOULD WRAP ONTO A SECOND LINE INSIDE THE BOX NICELY');
  await p.waitForTimeout(300);
  ok('wrap', await p.evaluate(() => ['quote', 'quoteSub'].map(id => { const el = document.querySelector(`#canvas [data-slot="${id}"]`); const ts = [...el.querySelectorAll('tspan')]; return { lines: ts.map(t => t.textContent), size: el.getAttribute('font-size'), w: Math.round(el.getBBox().width), maxW: el.dataset.maxw, bottom: Math.round(el.getBBox().y + el.getBBox().height) }; })));
  await p.locator('.canvasWrap').screenshot({ path: OUT + '/preview.png' });
  // export compare
  await p.click('#tab-export'); await p.click('#expSave'); await done(p); await p.waitForTimeout(500);
  fs.writeFileSync(OUT + '/export1x.png', Buffer.from((await p.evaluate(() => document.querySelector('#expImg').src)).split(',')[1], 'base64'));
  // chars: new / switch / dup / delete
  await p.click('#charNew'); await p.waitForTimeout(400);
  ok('new', await p.evaluate(() => ({ opts: [...document.querySelector('#charSel').options].map(o => o.text), nameEn: document.querySelector('#f-nameEn').value, art: document.querySelector('#artInfo').textContent, focus: document.activeElement.id })));
  await p.fill('#f-nameKo', '베타'); await p.fill('#f-nameEn', 'BETA');
  await p.click('#tab-sig'); await p.click('[data-preset="금박 이탤릭"]');
  await p.waitForTimeout(400);
  await p.selectOption('#charSel', { index: 0 }); await p.waitForTimeout(1500);
  ok('back1', await p.evaluate(() => ({ nameEn: document.querySelector('#f-nameEn').value, sigColor: document.querySelector('#sigColor').value, art: document.querySelector('#artInfo').textContent, opts: [...document.querySelector('#charSel').options].map(o => o.text) })));
  await p.click('#charDup'); await p.waitForTimeout(600);
  ok('dup', await p.evaluate(() => ({ opts: [...document.querySelector('#charSel').options].map(o => o.text), sel: document.querySelector('#charSel').selectedIndex, art: document.querySelector('#artInfo').textContent })));
  await p.click('#charDel'); await p.click('#charDel'); await p.waitForTimeout(800);
  ok('del', await p.evaluate(() => ({ opts: [...document.querySelector('#charSel').options].map(o => o.text), sel: document.querySelector('#charSel').selectedIndex })));
  // tabs keyboard
  await p.focus('#tab-fields'); await p.click('#tab-fields'); await p.keyboard.press('ArrowRight');
  const t1 = await p.evaluate(() => [document.activeElement.id, document.querySelector('[aria-selected=true][role=tab]').id]);
  await p.keyboard.press('End');
  ok('tabs', { afterRight: t1, afterEnd: await p.evaluate(() => [document.activeElement.id, [...document.querySelectorAll('[role=tab]')].map(t => t.tabIndex).join(''), document.querySelector('#tab-json').textContent]) });
  // template dup / delete
  await p.click('#tplDup'); await p.waitForTimeout(300);
  const afterDup = await p.evaluate(() => [document.querySelector('#tplSel').value, document.querySelector('#tplSel').options.length, document.querySelector('#tplDel').disabled]);
  await p.click('#tplDel'); await p.click('#tplDel'); await p.waitForTimeout(300);
  ok('tpl', { afterDup, afterDel: await p.evaluate(() => [document.querySelector('#tplSel').value, document.querySelector('#tplSel').options.length, document.querySelector('#tplDel').disabled]) });
  // chars export ZIP
  await p.click('#tab-export'); await p.selectOption('#expScale', '1');
  await p.click('#charsGo'); await done(p); await p.waitForTimeout(1500);
  ok('charsZip', { status: await st() });
  // ZIP split (deviceMemory 2 → 80MB parts) with multi images at 3x
  const imgs = [1, 2, 3, 4].map(i => { const f = path.join(OUT, `m${i}.jpg`); fs.copyFileSync(ART, f); return f; });
  await p.setInputFiles('#multiFiles', imgs); await p.waitForTimeout(800);
  await p.selectOption('#expScale', '3');
  await p.click('#multiGo'); await done(p); await p.waitForTimeout(2000);
  ok('split', { status: await st(), info: await p.evaluate(() => document.querySelector('#multiInfo').textContent) });
  // cancel
  await p.selectOption('#expScale', '2');
  await p.click('#multiGo'); await p.waitForFunction(() => /생성 중 2/.test(document.querySelector('#status').textContent), null, { timeout: 60000 });
  await p.click('#batchStop'); await done(p); await p.waitForTimeout(1500);
  ok('cancel', { status: await st() });
  // reload persistence
  await p.reload(); await p.waitForTimeout(2500);
  ok('reload', await p.evaluate(() => ({ opts: [...document.querySelector('#charSel').options].map(o => o.text), cur: document.querySelector('#charSel').selectedIndex, art: document.querySelector('#artInfo').textContent })));
  await p.selectOption('#charSel', { index: 0 }); await p.waitForTimeout(1500);
  ok('reloadChar1', await p.evaluate(() => ({ nameEn: document.querySelector('#f-nameEn').value, art: document.querySelector('#artInfo').textContent, quote: document.querySelector('#f-quote').value.slice(0, 20) })));
  ok('downloads', downloads);
  ok('errors', errs);
  console.log(JSON.stringify(R, null, 1));
  // mobile
  const m = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const q = await m.newPage(); await q.goto(V14); await q.waitForTimeout(2000);
  await q.screenshot({ path: OUT + '/mobile.png' });
  console.log('mobile', await q.evaluate(() => ({ hscroll: document.documentElement.scrollWidth + '/' + innerWidth, barH: document.querySelector('.bar').getBoundingClientRect().height, canvas: Math.round(document.querySelector('#canvas').getBoundingClientRect().width) + 'x' + Math.round(document.querySelector('#canvas').getBoundingClientRect().height), fabIn: !!document.querySelector('.canvasWrap .fab') })));
  await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
