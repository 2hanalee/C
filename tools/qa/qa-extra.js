// 최근 열람한 기록, 읽기 진행선, 미리 불러오기 점검
const { chromium } = require('playwright');
const BASE = 'http://localhost:8765/';
(async () => {
  const b = await chromium.launch(); const fails = [], errs = [];
  for (const [v, vp] of [['phone', { width: 390, height: 844 }], ['pc', { width: 1440, height: 900 }]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('blackout.gate', 'seen'); } catch (e) {} });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(v + ' ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(v + ' ' + m.text()); });
    await p.goto(BASE + 'characters.html'); await p.waitForTimeout(300);
    if (await p.locator('.recent').count()) fails.push(v + ' 열어 본 적이 없는데 최근 기록이 보임');
    const want = [];
    for (const id of ['jeong-haeun', 'kwon-doha', 'reina-de-rose', 'jeong-haeun']) {
      await p.evaluate((i) => { location.hash = '#' + i; }, id); await p.waitForTimeout(600);
      const i = want.indexOf(id); if (i !== -1) want.splice(i, 1); want.unshift(id);
    }
    await p.click('.crumbs .back'); await p.waitForTimeout(700);
    const got = await p.$$eval('.recent a', as => as.map(a => a.getAttribute('href').slice(1)));
    if (got.join() !== want.join()) fails.push(v + ' 최근 기록 순서 ' + got.join() + ' / 기대 ' + want.join());
    const hs = await p.$$eval('.recent a', as => as.map(a => a.getBoundingClientRect().height)); if (hs.length && Math.min(...hs) < 39.5) fails.push(v + ' 최근 기록 높이 ' + Math.min(...hs));
    await p.locator('.recent a').first().click(); await p.waitForTimeout(600);
    if ((await p.evaluate(() => location.hash)) !== '#' + want[0]) fails.push(v + ' 최근 기록 링크');
    // 읽기 진행선: 맨 위 0, 맨 아래 1
    const scale = () => p.evaluate(() => { const m = getComputedStyle(document.querySelector('.top'), '::after').transform; return m === 'none' ? null : +m.split('(')[1].split(',')[0]; });
    const s0 = await scale();
    await p.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await p.waitForTimeout(200);
    const s1 = await scale();
    if (s0 === null || s0 > 0.02 || s1 < 0.98) fails.push(v + ' 읽기 진행선 ' + s0 + ' → ' + s1);
    await p.click('.crumbs .back', { force: true }).catch(() => {}); await p.goto(BASE + 'characters.html#list'); await p.waitForTimeout(600);
    const none = await p.evaluate(() => getComputedStyle(document.querySelector('.top'), '::after').content);
    if (none !== 'none') fails.push(v + ' 목록에도 읽기 진행선이 보임');
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ov > 0) fails.push(v + ' 넘침 ' + ov);
    // 미리 불러오기 규칙
    if (!(await p.evaluate(() => !!document.querySelector('script[type=speculationrules]')))) fails.push(v + ' 미리 불러오기 규칙 없음');
    // 열람 기록 지우기 → 최근 기록도 사라짐
    p.once('dialog', d => d.accept());
    await p.click('[data-forget]'); await p.waitForTimeout(700);
    if (await p.locator('.recent').count()) fails.push(v + ' 기록을 지웠는데 최근 기록이 남음');
    if (v === 'phone') { await p.evaluate(() => { localStorage.setItem('blackout.recent', JSON.stringify(['c:reina-de-rose', 'c:kwon-doha', 'c:on-saebyeol'])); location.reload(); }); await p.waitForTimeout(600); await p.screenshot({ path: __dirname + '/recent-phone.png', clip: { x: 0, y: 0, width: 390, height: 520 } }); }
    await ctx.close();
  }
  await b.close();
  console.log(JSON.stringify({ fails, errs }));
})();
