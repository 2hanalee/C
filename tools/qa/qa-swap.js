// 기록 넘김 점검: 목록 ↔ 상세, 이전·다음, ←/→ 키, 도장, 움직임 줄이기
const { chromium } = require('playwright');
const BASE = 'http://localhost:8765/';
(async () => {
  const b = await chromium.launch(); const fails = [], errs = [];
  for (const [v, opts] of [['phone', { viewport: { width: 390, height: 844 } }], ['pc', { viewport: { width: 1440, height: 900 } }], ['reduce', { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }]]) {
    const ctx = await b.newContext(Object.assign({ deviceScaleFactor: 1 }, opts));
    await ctx.addInitScript(() => { try { sessionStorage.setItem('blackout.gate', 'seen'); } catch (e) {} });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(v + ' ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(v + ' ' + m.text()); });
    const hash = () => p.evaluate(() => location.hash);
    // 인물
    await p.goto(BASE + 'characters.html'); await p.waitForTimeout(300);
    const ids = await p.evaluate(() => window.CHARACTERS.map(c => c.id));
    await p.evaluate(() => scrollTo({ top: 600, behavior: 'instant' }));
    const card = p.locator('.rcard').nth(3); const id = (await card.getAttribute('href')).slice(1);
    await card.click(); await p.waitForTimeout(700);
    if (!(await p.locator('.sheetcard h1').count())) fails.push(v + ' 카드를 눌러도 상세가 안 뜸');
    if ((await p.evaluate(() => scrollY)) > 5) fails.push(v + ' 상세가 맨 위에서 시작하지 않음');
    const i = ids.indexOf(id), n = ids.length;
    await p.keyboard.press('ArrowRight'); await p.waitForTimeout(700);
    if ((await hash()) !== '#' + ids[(i + 1) % n]) fails.push(v + ' → 키로 다음 기록이 안 열림 ' + (await hash()));
    await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(700);
    if ((await hash()) !== '#' + id) fails.push(v + ' ← 키로 이전 기록이 안 열림 ' + (await hash()));
    await p.click('.crumbs div a:last-child'); await p.waitForTimeout(700);
    if ((await hash()) !== '#' + ids[(i + 1) % n]) fails.push(v + ' 다음 기록 링크');
    await p.goBack(); await p.waitForTimeout(700);
    await p.click('.crumbs .back'); await p.waitForTimeout(900);
    if ((await p.locator('.rcard').count()) !== n) fails.push(v + ' 목록으로 돌아오지 못함');
    const y = await p.evaluate(() => scrollY); if (Math.abs(y - 600) > 5) fails.push(v + ' 목록 스크롤 위치 ' + y);
    const stamps = await p.locator('.stamp-read').count(); if (stamps < 1) fails.push(v + ' 열람함 도장 없음');
    // 검색 칸에서는 화살표가 기록을 넘기지 않는다
    await p.click('#q'); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(200);
    if ((await p.locator('.rcard').count()) === 0) fails.push(v + ' 검색 칸의 화살표가 화면을 바꿈');
    // 세계관
    await p.goto(BASE + 'world.html'); await p.waitForTimeout(300);
    const docs = await p.evaluate(() => window.WORLD.map(d => d.id));
    await p.locator('.folder').nth(1).click(); await p.waitForTimeout(700);
    if (!(await p.locator('.docsheet h1').count())) fails.push(v + ' 문서가 안 열림');
    await p.keyboard.press('ArrowRight'); await p.waitForTimeout(700);
    if ((await hash()) !== '#' + docs[2]) fails.push(v + ' 문서 → 키 ' + (await hash()));
    // 용어 판이 떠 있을 때는 화살표가 문서를 넘기지 않는다
    const term = p.locator('button.term').first();
    if (await term.count()) { await term.click(); await p.waitForTimeout(350); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
      if ((await hash()) !== '#' + docs[2]) fails.push(v + ' 용어 판이 떠 있는데 문서가 넘어감'); await p.keyboard.press('Escape'); }
    await p.click('.crumbs .back'); await p.waitForTimeout(800);
    if ((await p.locator('.folder').count()) !== docs.length) fails.push(v + ' 문서 목록으로 돌아오지 못함');
    if (v !== 'reduce' && !(await p.locator('.folders .stamp-read').count())) fails.push(v + ' 문서 도장 없음');
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ov > 0) fails.push(v + ' 넘침 ' + ov);
    await ctx.close();
  }
  await b.close();
  console.log(JSON.stringify({ fails, errs }));
})();
