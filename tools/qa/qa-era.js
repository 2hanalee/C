global.EXT_MORE = async ({ browser, newPage, BASE, fail, out, overflow }) => {
  for (const v of ['phone', 'tablet', 'pc']) {
    const p = await newPage(browser, v);
    await p.goto(BASE + 'timeline.html'); await p.waitForTimeout(200);
    const barShown = await p.evaluate(() => { const b = document.querySelector('.era-bar'); return !!(b && b.offsetParent); });
    if ((v === 'pc') === barShown) fail(`시대 막대 표시 ${v} ${barShown}`);
    const sel = v === 'pc' ? '.rail [data-era]' : '.era-bar [data-era]';
    if (barShown) {
      const hs = await p.$$eval(sel, (bs) => bs.map((b) => b.getBoundingClientRect().height));
      if (Math.min(...hs) < 40) fail(`시대 막대 높이 ${v} ${Math.min(...hs)}`);
    }
    const cur = () => p.evaluate((s) => { const b = document.querySelector(s + '[aria-current]'); return b && b.dataset.era; }, sel);
    if ((await cur()) !== 'before') fail(`처음 표시 ${v} ${await cur()}`);
    for (const id of ['war', 'truce', 'before', 'war']) {
      await p.click(`${sel}[data-era="${id}"]`); await p.waitForTimeout(1200);
      const now = await cur(); if (now !== id) fail(`누른 뒤 표시 ${v} ${id} → ${now}`);
      if (barShown) {
        // 시대 제목이 막대에 가리지 않는지
        const gap = await p.evaluate((i) => document.querySelector('#era-' + i + ' > h2').getBoundingClientRect().top - document.querySelector('.era-bar').getBoundingClientRect().bottom, id);
        if (gap < 0 && id !== 'truce') fail(`시대 제목이 막대에 가림 ${v} ${id} ${gap}`);
      }
    }
    // 손으로 스크롤: 각 시대 가운데로 옮겨 표시 확인
    for (const id of ['before', 'war', 'truce']) {
      await p.evaluate((i) => { const r = document.getElementById('era-' + i).getBoundingClientRect(); window.scrollTo({ top: scrollY + r.top + Math.min(r.height / 2, 300) - 150, behavior: 'instant' }); }, id);
      await p.waitForTimeout(300);
      const now = await cur(); if (now !== id) fail(`스크롤 표시 ${v} ${id} → ${now}`);
    }
    await p.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await p.waitForTimeout(300);
    if ((await cur()) !== 'truce') fail(`맨 아래 표시 ${v}`);
    if ((await overflow(p)) > 0) fail('넘침 연표 ' + v);
    // 지도로 갔다가 돌아오기
    await p.click('.tabs a[href="#map"]'); await p.waitForTimeout(200);
    if (await p.locator('.era-bar').count()) fail('지도에 시대 막대가 남음');
    await p.click('.tabs a[href="#timeline"]'); await p.waitForTimeout(200);
    if ((await cur()) !== 'before') fail(`지도 갔다 온 뒤 표시 ${v} ${await cur()}`);
    await p.context().close();
  }
  out.notes.push('시대 막대 점검 끝');
};
