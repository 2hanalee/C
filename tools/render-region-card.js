// 지명 카드 템플릿에 원본 카드 그림을 넣고 같은 글을 채워 내보낸다(원본과 위치 비교용)
// 사용: node tools/render-region-card.js <v18 HTML> <결과 폴더> <그림> [필드 JSON] [이름]
const { chromium } = require('playwright');
const fs = require('fs');
const FILE = 'file://' + process.argv[2], OUT = process.argv[3], ART = process.argv[4], VALS = JSON.parse(process.argv[5] || '{}'), TAG = process.argv[6] || 'castle';
(async () => {
  const b = await chromium.launch(), errs = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  await p.goto(FILE); await p.waitForTimeout(3000);
  const opts = await p.evaluate(() => [...document.querySelector('#tplSel').options].map(o => o.value + '=' + o.textContent));
  await p.selectOption('#tplSel', 'region-card'); await p.waitForTimeout(500);
  for (const [k, v] of Object.entries(VALS)) await p.fill('#f-' + k, v);
  await p.setInputFiles('#artFile', ART); await p.waitForTimeout(1500);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  await p.locator('.canvasWrap').screenshot({ path: OUT + '/' + TAG + '-preview.png' });
  await p.click('#tab-export'); await p.click('#expSave'); await p.waitForFunction(() => !document.querySelector('#expSave').disabled); await p.waitForTimeout(800);
  fs.writeFileSync(OUT + '/' + TAG + '-export.png', Buffer.from((await p.evaluate(() => document.querySelector('#expImg').src)).split(',')[1], 'base64'));
  const info = await p.evaluate(() => ({ status: document.querySelector('#status').textContent, errs: document.querySelector('#errs').textContent, desc: [...document.querySelectorAll('#canvas [data-slot="desc"] tspan')].map(t => t.textContent), fields: [...document.querySelectorAll('#fields label')].map(l => l.firstChild.textContent) }));
  console.log(JSON.stringify({ hasTpl: opts.find(o => o.startsWith('region-card')), ...info, errs2: errs }, null, 1));
  await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
