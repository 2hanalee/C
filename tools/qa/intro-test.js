const { chromium } = require('playwright');
const S = __dirname;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  for (const [name, vp] of [['phone', { width: 390, height: 844 }], ['pc', { width: 1440, height: 900 }]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
    await p.goto('http://localhost:8765/index.html');
    const t0 = await p.evaluate(() => performance.now());
    
    const shots = name === 'pc' ? [2.6, 7.6] : [2.6];
    for (const s of shots) {
      await p.waitForFunction((t) => performance.now() >= t, t0 + s * 1000, { polling: 20 });
      await p.screenshot({ path: `${S}/intro-${name}-${s}.png` });
    }
    // 단추가 다 보이는 시각
    await p.waitForFunction(() => { const e = document.getElementById('gate-enter'); return e && getComputedStyle(e).display !== 'none' && parseFloat(getComputedStyle(e).opacity) >= 0.99; }, null, { polling: 20, timeout: 15000 });
    const done = (await p.evaluate(() => performance.now())) - t0;
    const webgl = await p.evaluate(() => String(!!document.getElementById('gate-fx')));
    console.log(name, 'buttons visible at', (done / 1000).toFixed(2), 's canvas', webgl, 'errors', JSON.stringify(errs));
    await ctx.close();
  }
  await b.close();
})();
