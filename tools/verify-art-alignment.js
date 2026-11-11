// 미리보기와 내보낸 PNG에서 캐릭터 이미지 위치가 같은지 표식 이미지로 잰다.
// 사용: node tools/verify-art-alignment.js <HTML> <결과 폴더>
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + process.argv[2]); await p.waitForTimeout(2000);
  // marker image: black, with a pure green disc at (25%,30%) and blue disc at (80%,75%)
  const url = await p.evaluate(() => { const c = document.createElement('canvas'); c.width = 1600; c.height = 1200; const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, 1600, 1200); [['#00ff00', 400, 360], ['#0000ff', 1280, 900]].forEach(([f, a, bb]) => { x.fillStyle = f; x.beginPath(); x.arc(a, bb, 90, 0, 7); x.fill(); }); return c.toDataURL('image/png'); });
  fs.writeFileSync(process.argv[3] + '/marker.png', Buffer.from(url.split(',')[1], 'base64'));
  await p.setInputFiles('#artFile', process.argv[3] + '/marker.png'); await p.waitForTimeout(1200);
  const res = [];
  for (const [zoom, dx, dy, rot, flip, mode] of [[1, 0, 0, 0, false, 'cover'], [1.4, 220, -90, 12, true, 'cover'], [0.7, -150, 60, -30, false, 'contain']]) {
    await p.evaluate(([zoom, dx, dy, rot, flip, mode]) => { document.querySelector(`#artMode [data-mode="${mode}"]`).click(); const s = (id, v) => { const e = document.querySelector('#ag-' + id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }; s('zoom', zoom); s('dx', dx); s('dy', dy); s('rot', rot); const f = document.querySelector('#artFlip'); if (f.checked !== flip) f.click(); }, [zoom, dx, dy, rot, flip, mode]);
    await p.waitForTimeout(300);
    const shot = await p.locator('#canvas').screenshot();
    await p.click('#tab-export'); await p.click('#expSave'); await p.waitForFunction(() => !document.querySelector('#expSave').disabled); await p.waitForTimeout(400);
    const exp = await p.evaluate(() => document.querySelector('#expImg').src);
    const m = await p.evaluate(async ([a, bsrc]) => {
      const cent = async src => { const i = new Image(); i.src = src; await i.decode(); const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight; const x = c.getContext('2d'); x.drawImage(i, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data; const acc = { g: [0, 0, 0], b: [0, 0, 0] }; for (let y = 0; y < c.height; y++) for (let k = 0; k < c.width; k++) { const o = (y * c.width + k) * 4, R = d[o], G = d[o + 1], B = d[o + 2]; if (G > 200 && R < 60 && B < 60) { acc.g[0] += k; acc.g[1] += y; acc.g[2]++; } if (B > 200 && R < 60 && G < 60) { acc.b[0] += k; acc.b[1] += y; acc.b[2]++; } } const f = v => v[2] ? [+(v[0] / v[2] / c.width * 100).toFixed(2), +(v[1] / v[2] / c.height * 100).toFixed(2)] : null; return { green: f(acc.g), blue: f(acc.b) }; };
      return { preview: await cent(a), export: await cent(bsrc) };
    }, ['data:image/png;base64,' + shot.toString('base64'), exp]);
    res.push({ case: [zoom, dx, dy, rot, flip, mode].join(','), ...m });
    await p.click('#tab-art');
  }
  console.log(JSON.stringify(res, null, 1), errs);
  await b.close();
})();
