const { chromium } = require('playwright');
(async () => {
  const [,, url, w, h, out, action] = process.argv;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('blackout.gate', 'seen'); } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8765/' + url); await p.waitForTimeout(400);
  if (action) { await eval('(async()=>{' + action + '})()'); await p.waitForTimeout(500); }
  await p.screenshot({ path: out });
  await b.close();
})();
