// 페이지 전환 점검: 방향이 메뉴 순서와 맞는지, 움직임 줄이기에서는 전환이 없는지
const { chromium } = require('playwright');
const BASE = 'http://localhost:8765/';
(async () => {
  const b = await chromium.launch(); const fails = [], errs = []; let ran = 0, skipped = 0;
  for (const [v, vp, sel] of [['phone', { width: 390, height: 844 }, '.tabbar'], ['pc', { width: 1440, height: 900 }, '.top-nav']]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('blackout.gate', 'seen'); } catch (e) {} });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(v + ' ' + e.message));
    await p.goto(BASE + 'index.html');
    const supported = await p.evaluate(() => CSS.supports('view-transition-name', 'x') && 'onpagereveal' in window);
    if (!supported) { fails.push('이 브라우저는 전환을 지원하지 않아 점검할 수 없음'); break; }
    const hops = [['world.html', 'forward'], ['timeline.html', 'forward'], ['characters.html', 'back'], ['index.html', 'back'], ['webtoon.html', 'forward']];
    for (const [to, want] of hops) {
      await p.click(`${sel} a[href="${to}"]`);
      await p.waitForURL('**/' + to); await p.waitForTimeout(500);
      const got = await p.evaluate(() => document.documentElement.getAttribute('data-vt'));
      // 새 화면이 늦으면 브라우저가 전환을 건너뛴다(null). 건너뛴 횟수만 세고, 실행된 전환의 방향이 틀리면 실패로 본다
      if (got === null) skipped++; else { ran++; if (got !== want) fails.push(`${v} ${to} 방향 ${got} (기대 ${want})`); }
      const cur = await p.evaluate((s) => { const a = document.querySelector(s + ' a[aria-current="page"]'); return a && a.getAttribute('href'); }, sel);
      if (cur !== to) fails.push(`${v} ${to} 현재 탭 표시 ${cur}`);
    }
    // 본문 링크로 가는 이동은 방향 없이 떠오른다
    await p.goto(BASE + 'index.html'); await p.click('a.btn[href="world.html"]'); await p.waitForURL('**/world.html'); await p.waitForTimeout(400);
    const t = await p.evaluate(() => document.documentElement.getAttribute('data-vt')); if (t !== null && t !== 'forward') fails.push(v + ' 본문 링크 방향 ' + t);
    await ctx.close();
  }
  // 움직임 줄이기
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('blackout.gate', 'seen'); } catch (e) {} });
  const p = await ctx.newPage(); await p.goto(BASE + 'index.html');
  await p.click('.tabbar a[href="world.html"]'); await p.waitForURL('**/world.html'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => document.documentElement.getAttribute('data-vt'));
  if (r !== null) fails.push('움직임 줄이기인데 전환이 실행됨 ' + r);
  if (!(await p.locator('.folder').count())) fails.push('움직임 줄이기에서 화면이 안 뜸');
  await b.close();
  if (!ran) fails.push('전환이 한 번도 실행되지 않음');
  console.log(JSON.stringify({ fails, errs, ran, skipped }));
})();
