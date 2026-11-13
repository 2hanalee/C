const { chromium } = require('playwright');
const S = __dirname;
const LIST = `window.MUSIC=[{title:"시험 곡 하나",by:"참치",src:"assets/audio/t0.wav",note:"시험용 2초"},{title:"시험 곡 둘",by:"",src:"assets/audio/t1.wav",note:""},{title:"없는 곡",by:"",src:"assets/audio/missing.wav",note:""}];`;
(async () => {
  const b = await chromium.launch();
  const fails = [], errs = [];
  for (const [v, vp] of [['phone', { width: 390, height: 844 }], ['pc', { width: 1440, height: 900 }]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('blackout.gate', 'seen'); } catch (e) {} });
    await ctx.route('**/assets/js/music.js', r => r.fulfill({ body: LIST, contentType: 'text/javascript' }));
    await ctx.route('**/assets/audio/t*.wav', r => {
      const buf = require('fs').readFileSync(S + '/testaudio/' + r.request().url().split('/').pop());
      const range = r.request().headers()['range'];
      const m = range && /bytes=(\d+)-(\d*)/.exec(range);
      if (!m) return r.fulfill({ status: 200, body: buf, headers: { 'content-type': 'audio/wav', 'accept-ranges': 'bytes' } });
      const a = +m[1], z = m[2] ? +m[2] : buf.length - 1;
      return r.fulfill({ status: 206, body: buf.slice(a, z + 1), headers: { 'content-type': 'audio/wav', 'accept-ranges': 'bytes', 'content-range': 'bytes ' + a + '-' + z + '/' + buf.length } });
    });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(v + ' ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/missing\.wav|404/.test(m.text())) errs.push(v + ' ' + m.text()); });
    await p.goto('http://localhost:8765/world.html');
    const bh = await p.$eval('.music-btn', e => e.getBoundingClientRect().height).catch(() => 0);
    if (bh < 44) fail('단추 높이 ' + v + ' ' + bh);
    await p.click('.music-btn'); await p.waitForTimeout(350);
    const box = await p.$eval('dialog.music-sheet', d => { const r = d.getBoundingClientRect(); return [r.x, r.y, r.width, r.height, innerWidth, innerHeight, d.open]; });
    if (!box[6]) fails.push('판 안 열림 ' + v);
    if (v === 'phone' && Math.abs(box[1] + box[3] - box[5]) > 2) fails.push('휴대폰 판 위치 ' + box);
    if (v === 'pc' && Math.abs(box[0] + box[2] - box[4]) > 2) fails.push('PC 판 위치 ' + box);
    await p.click('.ms-play'); await p.waitForTimeout(600);
    let st = await p.evaluate(() => ({ label: document.querySelector('.ms-play').getAttribute('aria-label'), on: document.querySelector('.music-btn').classList.contains('on') }));
    if (st.label !== '일시정지' || !st.on) fails.push('재생 안 됨 ' + v + JSON.stringify(st));
    // 끝나면 다음 곡으로
    await p.waitForTimeout(2000);
    let title = await p.textContent('#ms-title');
    if (title !== '시험 곡 둘') fails.push('다음 곡으로 안 넘어감 ' + v + ' ' + title);
    // 재생 위치 옮기기
    await p.$eval('#ms-pos', el => { el.value = 800; el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); });
    await p.waitForTimeout(200);
    const cur = await p.textContent('#ms-cur'); if (cur !== '0:02') fails.push('위치 이동 ' + v + ' ' + cur);
    // 없는 곡
    await p.click('[data-track="2"]'); await p.waitForTimeout(500);
    const stt = await p.textContent('.ms-status'); if (!stt) fails.push('오류 안내 없음 ' + v);
    // 이전 곡 → 둘
    await p.click('.ms-prev'); await p.waitForTimeout(400);
    title = await p.textContent('#ms-title'); if (title !== '시험 곡 둘') fails.push('이전 곡 ' + title);
    // 닫아도 계속 재생, 초점 복귀
    await p.click('.ms-close'); await p.waitForTimeout(200);
    st = await p.evaluate(() => ({ on: document.querySelector('.music-btn').classList.contains('on'), focus: document.activeElement.className }));
    if (!st.on || st.focus !== 'music-btn on') fails.push('닫은 뒤 상태 ' + v + JSON.stringify(st));
    await p.click('.music-btn'); await p.keyboard.press('Escape'); await p.waitForTimeout(150);
    if (await p.$eval('dialog.music-sheet', d => d.open)) fails.push('Esc 안 닫힘 ' + v);
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ov > 0) fails.push('넘침 ' + v + ' ' + ov);
    if (v === 'pc') await p.screenshot({ path: S + '/music-pc-head.png', clip: { x: 0, y: 0, width: 1440, height: 70 } });
    // 다른 페이지로: 같은 곡, 같은 위치
    await p.locator('a[href="timeline.html"]:visible').first().click(); await p.waitForTimeout(900);
    const after = await p.evaluate(() => ({ t: document.querySelector('#ms-title').textContent, on: document.querySelector('.music-btn').classList.contains('on') }));
    console.log(v, 'after nav', JSON.stringify(after));
    if (after.t !== '시험 곡 둘') fails.push('페이지 이동 뒤 곡 ' + v + ' ' + after.t);
    await p.click('.music-btn'); await p.waitForTimeout(350);
    await p.screenshot({ path: S + '/music-' + v + '.png' });
    await ctx.close();
  }
  // 목록이 비면 단추 없음
  const ctx = await b.newContext(); const p = await ctx.newPage();
  await p.goto('http://localhost:8765/characters.html');
  if (await p.$('.music-btn')) fails.push('빈 목록인데 단추가 있음');
  await b.close();
  console.log(JSON.stringify({ fails, errs }, null, 1));
  function fail(m) { fails.push(m); }
})();
