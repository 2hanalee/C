// 5차 작업 점검: 용어 설명 창, 연표 시대 막대, 사진 칸
module.exports = async ({ browser, newPage, BASE, fail, out, overflow }) => {
  const box = (page, sel) => page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, vw: innerWidth, vh: innerHeight }; }, sel);
  // A-1 용어
  for (const v of ['phone', 'pc']) {
    const p = await newPage(browser, v);
    let termCount = 0;
    for (const url of ['index.html', 'world.html#law', 'world.html#truce', 'timeline.html']) {
      await p.goto(BASE + url); await p.waitForTimeout(150);
      const n = await p.locator('button.term').count(); termCount += n;
      if (!n) { fail(`용어 단추 없음 ${v} ${url}`); continue; }
      const hs = await p.$$eval('button.term', (bs) => bs.map((b) => b.getBoundingClientRect().height));
      if (Math.min(...hs) < 40) fail(`용어 단추 높이 ${v} ${url} ${Math.min(...hs)}`);
      const btn = p.locator('button.term').first();
      await btn.scrollIntoViewIfNeeded(); await btn.click();
      if (!(await p.locator('dialog.term-sheet[open]').count())) { fail(`용어 판 안 열림 ${v} ${url}`); continue; }
      await p.waitForTimeout(350);
      const b = await box(p, 'dialog.term-sheet');
      if (v === 'phone' && Math.abs(b.y + b.h - b.vh) > 2) fail(`휴대폰 판이 아래에 붙지 않음 ${url} ${JSON.stringify(b)}`);
      if (v === 'pc' && (Math.abs(b.x + b.w - b.vw) > 2 || b.h < b.vh - 2)) fail(`PC 판이 오른쪽에 없음 ${url} ${JSON.stringify(b)}`);
      const word = await btn.textContent();
      const title = await p.textContent('#term-title'); if (title !== word) fail(`판 제목 ${title} ≠ ${word}`);
      // Esc 로 닫고 초점 복귀
      await p.keyboard.press('Escape'); await p.waitForTimeout(100);
      if (await p.locator('dialog.term-sheet[open]').count()) fail(`Esc 로 안 닫힘 ${v} ${url}`);
      const back = await p.evaluate(() => document.activeElement && document.activeElement.matches('button.term') && document.activeElement.textContent);
      if (back !== word) fail(`초점 복귀 실패(Esc) ${v} ${url} → ${back}`);
      // 닫기 단추
      await btn.click(); await p.click('.term-close'); await p.waitForTimeout(100);
      if (await p.locator('dialog.term-sheet[open]').count()) fail(`닫기 단추로 안 닫힘 ${v} ${url}`);
      // 바깥 누르기
      await btn.click(); await p.waitForTimeout(350);
      const pt = v === 'phone' ? { x: 195, y: 40 } : { x: 100, y: 450 };
      await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(100);
      if (await p.locator('dialog.term-sheet[open]').count()) fail(`바깥 눌러도 안 닫힘 ${v} ${url}`);
      const back2 = await p.evaluate(() => document.activeElement && document.activeElement.textContent);
      if (back2 !== word) fail(`초점 복귀 실패(바깥) ${v} ${url} → ${back2}`);
    }
    // 문서 링크 이동
    await p.goto(BASE + 'timeline.html'); await p.locator('button.term').first().click();
    const href = await p.getAttribute('.term-doc a', 'href');
    await p.click('.term-doc a'); await p.waitForURL('**/world.html#*');
    if (!(await p.locator('.docsheet h1').count())) fail('용어 판 문서 링크가 문서를 열지 못함 ' + href);
    out.notes.push(`용어 단추 ${v} ${termCount}개`);
    await p.context().close();
  }
  // TERMS 정의는 공개 본문에서 온 것인지(정의가 문서의 공개 본문에 있는 낱말로 시작하는지는 사람이 확인), 문서 id 가 있는지
  const p = await newPage(browser, 'phone');
  await p.goto(BASE + 'world.html');
  const bad = await p.evaluate(() => window.TERMS.filter((t) => !window.WORLD.some((d) => d.id === t.doc)).map((t) => t.term));
  if (bad.length) fail('TERMS 문서 id 없음 ' + bad.join(', '));
  await p.context().close();
  if (global.EXT_MORE) await global.EXT_MORE({ browser, newPage, BASE, fail, out, overflow, box });
};
