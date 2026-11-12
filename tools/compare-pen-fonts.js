// 펜 서명체 4종 × 이름 3개의 점수·그리기 시간·경로 크기와 비교 그림을 만든다. 진단용 사본(window.__fs)이 필요하다(calibrate-signature-quality.js 머리말 참고, thumb·buildSignature·FONTREG도 꺼낼 것).
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 1000 } }); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('file://' + process.argv[2]); await p.waitForTimeout(3500);
const res = await p.evaluate(() => {
  const F = window.__fs, rows = [], cells = []; let v;
  const cases = [['enItalic(윤곽)', { fontEn: 'enItalic' }], ['penAllure', { fontEn: 'penAllure' }], ['penBrush', { fontEn: 'penBrush' }], ['penCapitol', { fontEn: 'penCapitol' }], ['penDecorous', { fontEn: 'penDecorous' }], ['펜 필기체 프리셋', F.PRESETS['펜 필기체']], ['모노라인 펜 프리셋', F.PRESETS['모노라인 펜']]];
  for (const [en, ko] of [['CELESTIS', '셀레스티스'], ['Aurelia', '아우렐리아'], ['Maximilian von Hohenzollern', '막시밀리안']]) {
    v = F.valsOf(); v.nameEn = en; v.nameKo = ko;
    for (const [lab, pp] of cases) {
      const sig = F.cleanSig({ ...F.SIG_DEFAULT, ...pp });
      const t0 = performance.now(); let svgLen = 0; for (let i = 0; i < 5; i++) svgLen = F.buildSignature(en, sig, 0, 0, 440, 285, 'center').length; const ms = (performance.now() - t0) / 5;
      const q = F.measureSig(sig);
      rows.push(`${en.slice(0, 12).padEnd(12)} ${lab.padEnd(14)} ${q ? q.score : '-'}점 ${q ? q.issues.join('/') : ''} | ${ms.toFixed(1)}ms ${Math.round(svgLen / 1024)}KB | dens ${q && q.metrics.density}`);
      if (en !== 'Maximilian von Hohenzollern') cells.push(`<figure style="margin:0"><div style="background:#07060a">${F.thumb(sig, 'x' + cells.length)}</div><figcaption style="color:#ccc;font:12px sans-serif">${en} · ${lab} · ${q ? q.score : '-'}점</figcaption></figure>`);
    }
  }
  /* 한영 혼합 */
  v = F.valsOf(); v.nameEn = 'Celestis'; v.nameKo = '셀레스티스';
  const mix = F.cleanSig({ ...F.SIG_DEFAULT, ...F.PRESETS['펜 필기체'], source: 'mix' }), qm = F.measureSig(mix);
  rows.push('mix 펜 필기체 ' + (qm ? qm.score + '점 ' + qm.issues.join('/') : '-'));
  cells.push(`<figure style="margin:0"><div style="background:#07060a">${F.thumb(mix, 'mx')}</div><figcaption style="color:#ccc;font:12px sans-serif">한영 혼합 · 펜 필기체 · ${qm ? qm.score : '-'}점</figcaption></figure>`);
  document.body.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,420px);gap:10px;padding:10px;background:#111">${cells.join('')}</div>`;
  document.querySelectorAll('svg').forEach(s => { s.style.width = '420px'; s.style.height = 'auto'; s.style.display = 'block'; });
  return rows;
});
await p.waitForTimeout(300); await p.screenshot({ path: process.argv[3] + '/pen-grid.png', fullPage: true });
console.log(res.join('\n'), errs); await b.close(); })();
