const prevMore = global.EXT_MORE;
global.EXT_MORE = async (ctx) => {
  if (prevMore) await prevMore(ctx);
  const { browser, newPage, BASE, fail, out, overflow } = ctx;
  const S = __dirname;
  for (const v of ['phone', 'tablet', 'pc']) {
    // 3:2 시험 그림 7장
    const p = await newPage(browser, v);
    await p.route('**/test3x2/*', (r) => r.fulfill({ path: S + '/test3x2/' + r.request().url().split('/').pop() }));
    await p.goto(BASE + 'characters.html#list'); await p.waitForTimeout(200);
    await p.evaluate(() => { const c = window.CHARACTERS[0]; c.image = 'test3x2/e0.webp'; c.emotes = { 웃음: 'test3x2/e1.webp', 의문: 'test3x2/e2.webp', 부끄러움: 'test3x2/e3.webp', 슬픔: 'test3x2/e4.webp', 분노: 'test3x2/e5.webp', 기술: 'test3x2/e6.webp' }; location.hash = '#reina-de-rose'; });
    await p.waitForTimeout(400);
    const rect = () => p.evaluate(() => { const e = document.querySelector('.polaroid .photo'); const r = e.getBoundingClientRect(); const i = document.getElementById('portrait'); return [e.offsetWidth, e.offsetHeight, r.top, i.naturalWidth / i.naturalHeight, i.complete, i.getAttribute('src')]; });
    const first = await rect();
    if (Math.abs(first[0] / first[1] - 1.5) > 0.01) fail(`사진 칸 비율 ${v} ${first[0] / first[1]}`);
    const btns = await p.locator('.emotes button').count();
    if (btns !== 7) fail('표정 단추 수 ' + btns);
    for (let i = 0; i < 7; i++) {
      await p.locator('.emotes button').nth(i).click(); await p.waitForTimeout(150);
      const r = await rect();
      if (Math.abs(r[0] - first[0]) > 0.5 || Math.abs(r[1] - first[1]) > 0.5 || Math.abs(r[2] - first[2]) > 0.5) fail(`표정 ${i} 칸 흔들림 ${v} ${JSON.stringify(r)}`);
      if (!r[5].endsWith('e' + i + '.webp')) fail(`표정 ${i} 그림 안 바뀜 ${r[5]}`);
      if (Math.abs(r[3] - 1.5) > 0.01) fail(`표정 ${i} 원본 비율 ${r[3]}`);
      const hb = await p.locator('.emotes button').nth(i).evaluate((b) => b.getBoundingClientRect().height);
      if (hb < 40) fail(`표정 단추 높이 ${hb}`);
    }
    if ((await overflow(p)) > 0) fail('넘침 시험 상세 ' + v);
    await p.context().close();
    // 레이나 지금 그림(16:9): 비율 유지, 잘림 없음
    const q = await newPage(browser, v);
    await q.goto(BASE + 'characters.html#reina-de-rose'); await q.waitForTimeout(500);
    const fit = await q.evaluate(() => { const i = document.getElementById('portrait'); const s = getComputedStyle(i); return [s.objectFit, s.transform, i.naturalWidth, i.naturalHeight]; });
    if (fit[0] !== 'contain' || fit[1] !== 'none' || !fit[2]) fail('레이나 그림 맞춤 ' + JSON.stringify(fit));
    await q.context().close();
  }
  out.notes.push('사진 칸 점검 끝');
};
