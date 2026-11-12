// Frame Studio 16 검증: 보고 다듬기(이미지 있음/없음), 한글 서명 방식, 페르소나 → 한글 서명체, 프로젝트 파일의 페르소나
// window.claude를 정해진 응답을 돌려주는 가짜로 바꿔 끼워 흐름만 확인한다(실제 Claude 응답 품질은 확인하지 않음).
// 사용: node tools/verify-frame-studio-16.js <v16 HTML 절대경로> <결과 폴더>
const { chromium } = require('playwright');
const fs = require('fs');
const FILE = 'file://' + process.argv[2], OUT = process.argv[3];
const R = {}, ok = (k, v) => { R[k] = v; };
const mock = withImages => {
  window.__calls = [];
  let round = 0;
  const sample = async () => ({ text: '' });
  sample.limits = async () => withImages ? { maxPromptBytes: 65536, images: { maxCount: 4, maxInputBytes: 20e6, mediaTypes: ['image/jpeg', 'image/png'] } } : { maxPromptBytes: 65536 };
  sample.json = async (prompt, opts) => {
    const im = opts && opts.images;
    window.__calls.push({ len: prompt.length, img: im ? im.map(b => b.type + ':' + b.size) : null, noImgText: prompt.includes('그림은 볼 수 없다'), fenced: prompt.includes('<<<'), hasPrev: prompt.includes('[이전 회차]'), tier: opts && opts.modelTier, cache: opts && opts.cache });
    await new Promise(r => setTimeout(r, 60));
    if (prompt.includes('"axes"')) return { axes: { formal: 0.3, flair: 0.8, edge: 0.3, energy: 0.8, abstract: 0.6, classic: 0.4 }, why: {}, summary: '역동적인 붓 서명' };
    round++;
    if (round === 1) return { scores: { legibility: 4, character: 3, flow: 3, balance: 3, ornament: 2 }, overall: 6, done: false, note: '꼬리가 길어 박스를 벗어날 듯함', patch: { tail: 0.6, under: 0.5, color: '#00ff00', bogus: 3 } };
    if (round === 2) return { scores: { legibility: 4, character: 4, flow: 4, balance: 4, ornament: 4 }, overall: 8, done: true, note: '균형이 좋아짐', patch: {} };
    return { overall: 5, patch: {} };
  };
  window.claude = { use: async name => name === 'sample' ? sample : null };
};
(async () => {
  const b = await chromium.launch(), errs = [];
  const hook = p => { p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); }); };
  for (const withImages of [true, false]) {
    const c = await b.newContext({ viewport: { width: 1440, height: 1000 } });
    await c.addInitScript(mock, withImages);
    const p = await c.newPage(); hook(p);
    await p.goto(FILE); await p.waitForTimeout(3000); await p.click('#tab-sig');
    const color0 = await p.evaluate(() => document.querySelector('#sigColor').value);
    await p.click('#reviewGo');
    await p.waitForFunction(() => !document.querySelector('#reviewGo').disabled && document.querySelectorAll('#reviewLog .rv').length, null, { timeout: 30000 });
    ok('review_' + (withImages ? 'img' : 'text'), {
      msg: await p.evaluate(() => document.querySelector('#reviewMsg').textContent),
      rows: await p.evaluate(() => [...document.querySelectorAll('#reviewLog .rv b')].map(x => x.textContent)),
      changed: await p.evaluate(() => [...document.querySelectorAll('#reviewLog .rv small')].map(x => x.textContent).filter(t => t.startsWith('바꾼')).join(' | ')),
      applied: await p.evaluate(() => [...document.querySelectorAll('#reviewLog .rv')].findIndex(x => x.classList.contains('on'))),
      tail: await p.evaluate(() => document.querySelector('#sg-tail').value), colorKept: color0 === await p.evaluate(() => document.querySelector('#sigColor').value),
      calls: await p.evaluate(() => window.__calls)
    });
    if (withImages) {
      await p.locator('#sigQualBox').screenshot({ path: OUT + '/review.png' });
      await p.click('#reviewLog [data-ri="0"]'); await p.waitForTimeout(200);
      ok('revertRound1', { tail: await p.evaluate(() => document.querySelector('#sg-tail').value), on: await p.evaluate(() => [...document.querySelectorAll('#reviewLog .rv')].findIndex(x => x.classList.contains('on'))) });
      // 한글 서명 방식 · 페르소나 → 서명체/방식
      await p.selectOption('#sigSrc', 'ko'); await p.selectOption('#koMode', 'flow'); await p.waitForTimeout(200);
      ok('koMode', { qual: await p.evaluate(() => document.querySelector('#sigQual').textContent), mode: await p.evaluate(() => document.querySelector('#koMode').value) });
      await p.click('#personaInfer'); await p.waitForTimeout(400);
      ok('personaKo', { fontKo: await p.evaluate(() => document.querySelector('#fontKo').value), koMode: await p.evaluate(() => document.querySelector('#koMode').value), fontOpts: await p.evaluate(() => [...document.querySelector('#fontKo').options].map(o => o.textContent)) });
      await p.locator('.canvasWrap').screenshot({ path: OUT + '/card-ko.png' });
      // 프로젝트 파일 왕복
      await p.click('#tab-export'); await p.click('#projSave'); await p.waitForTimeout(800);
      const json = await p.evaluate(() => document.querySelector('#expText').value);
      fs.writeFileSync(OUT + '/proj.json', json);
      const pj = JSON.parse(json);
      await p.click('#tab-sig'); await p.click('#personaClear'); await p.waitForTimeout(100);
      await p.setInputFiles('#projFile', OUT + '/proj.json'); await p.waitForTimeout(800); await p.click('#tab-sig');
      ok('projPersona', { saved: !!pj.persona, savedKoMode: pj.sig.koMode, after: await p.evaluate(() => document.querySelector('#personaSrc').textContent) });
    }
    await c.close();
  }
  ok('errors', errs);
  console.log(JSON.stringify(R, null, 1));
  await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
