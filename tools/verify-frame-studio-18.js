// 지명 카드 템플릿 검증: 캐릭터 목록 이름, 긴 지역 이름·본문, 장식색, 배치 편집, JSON 검증, SVG 내보내기
// 사용: node tools/verify-frame-studio-18.js <v18 HTML> <결과 폴더> <그림 파일>
const { chromium } = require('playwright');
const fs = require('fs');
const FILE = 'file://' + process.argv[2], OUT = process.argv[3], ART = process.argv[4];
const R = {}, ok = (k, v) => { R[k] = v; };
(async () => {
  const b = await chromium.launch(), errs = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  await p.goto(FILE); await p.waitForTimeout(3000);
  await p.selectOption('#tplSel', 'region-card'); await p.waitForTimeout(400);
  await p.setInputFiles('#artFile', ART); await p.waitForTimeout(1200);
  // 지역 이름 바꾸면 캐릭터 목록 이름에 반영
  await p.fill('#f-region', '서리 숲'); await p.fill('#f-grade', 'A'); await p.waitForTimeout(600);
  ok('charLabel', await p.evaluate(() => document.querySelector('#charSel').options[0].textContent));
  // 긴 지역 이름 · 긴 본문
  await p.fill('#f-region', '끝없이 이어진 망각의 회랑'); await p.fill('#f-desc', '한때 왕국의 수도였던 이 회랑은 이제 망각의 안개에 잠겨, 들어간 자는 자신의 이름조차 잊는다. 벽마다 새겨진 문장은 읽을 때마다 다른 뜻을 드러내며, 밤이 되면 지워진 자들의 목소리가 메아리친다. 길잡이 없이 들어가는 것은 금지되어 있다.'); await p.waitForTimeout(800);
  ok('long', await p.evaluate(() => ({ region: [document.querySelector('#canvas [data-slot="region"]').getAttribute('font-size'), Math.round(document.querySelector('#canvas [data-slot="region"]').getBBox().width)], desc: [...document.querySelectorAll('#canvas [data-slot="desc"] tspan')].map(t => t.textContent), descSize: document.querySelector('#canvas [data-slot="desc"]').getAttribute('font-size') })));
  await p.locator('.canvasWrap').screenshot({ path: OUT + '/long.png' });
  // 장식색: 빙결
  await p.click('#tab-deco'); await p.click('#decoPresets [data-i="2"]'); await p.waitForTimeout(400);
  await p.locator('.canvasWrap').screenshot({ path: OUT + '/deco-ice.png' });
  // 배치 편집: 슬롯 목록, 위험도 등급 이동
  await p.click('#tab-layout');
  ok('slots', await p.evaluate(() => [...document.querySelectorAll('#slotList [data-pick]')].map(b => b.textContent)));
  await p.click('#slotList [data-pick="grade"]'); await p.waitForTimeout(200);
  ok('fontOpts', await p.evaluate(() => [...document.querySelectorAll('#props [data-prop="font"] option')].map(o => o.value).join(',') + ' sel=' + document.querySelector('#props [data-prop="font"]').value));
  // JSON 탭 검증 통과
  await p.click('#tab-json'); await p.click('#jsonApply'); await p.waitForTimeout(300);
  ok('jsonApply', await p.evaluate(() => [document.querySelector('#status').textContent, document.querySelector('#errs').textContent]));
  // SVG 내보내기 (나눔명조 @import 포함)
  await p.click('#tab-export'); await p.click('#expFmt [data-v="svg"]'); await p.click('#expSave'); await p.waitForFunction(() => !document.querySelector('#expSave').disabled); await p.waitForTimeout(600);
  ok('svgExport', await p.evaluate(async () => { const a = document.querySelector('#expLink'); const t = await (await fetch(a.href)).text(); return { kb: Math.round(t.length / 1024), nanum: t.includes('Nanum+Myeongjo'), webp: t.includes('image/webp') }; }));
  ok('errors', errs);
  console.log(JSON.stringify(R, null, 1));
  await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
