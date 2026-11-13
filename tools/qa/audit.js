const { chromium } = require('playwright');
const fs = require('fs');
const axe = fs.readFileSync(__dirname + '/node_modules/axe-core/axe.min.js', 'utf8');
const BASE = 'http://localhost:8765/';
const ONLY_TAPS = process.argv[2] === 'taps';
const VIEWS = [
  ['index.html', '메인'], ['world.html', '세계관 목록'], ['world.html#erosion', '문서: 침식'], ['world.html#thrones', '문서: 칠좌'],
  ['characters.html', '인물 목록'], ['characters.html#board', '순위표'], ['characters.html#reina-de-rose', '인물: 레이나'], ['characters.html#kwon-doha', '인물: 권도하'],
  ['timeline.html', '연표'], ['timeline.html#map', '지도'], ['webtoon.html', '웹툰'],
];
(async () => {
  const b = await chromium.launch();
  const res = { axe: {}, taps: {}, outline: {}, weight: {}, misc: [] };
  for (const [vname, vp] of [['phone', { width: 390, height: 844 }], ['pc', { width: 1440, height: 900 }]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('blackout.gate', 'seen'); } catch (e) {} });
    const p = await ctx.newPage();
    for (const [url, name] of VIEWS) {
      const reqs = []; const onResp = async (r) => { try { const h = r.headers(); reqs.push([r.url(), +(h['content-length'] || 0), r.status()]); } catch (e) {} };
      p.on('response', onResp);
      await p.goto(BASE + url); await p.waitForTimeout(500);
      p.off('response', onResp);
      if (vname === 'phone') {
        res.weight[name] = { kb: Math.round(reqs.filter(r => r[0].startsWith(BASE)).reduce((n, r) => n + r[1], 0) / 1024), files: reqs.length, bad: reqs.filter(r => r[2] >= 400).map(r => r[0] + ' ' + r[2]) };
      }
      await p.evaluate(axe);
      const r = await p.evaluate(async () => {
        const out = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'best-practice'] });
        return out.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0, 2).map(x => x.target.join(' ') + (x.any[0] && x.any[0].data && x.any[0].data.contrastRatio ? ' cr=' + x.any[0].data.contrastRatio + ' fg=' + x.any[0].data.fgColor + ' bg=' + x.any[0].data.bgColor : '')) }));
      });
      if (r.length) res.axe[vname + ' ' + name] = r;
      // 누르는 곳 크기: 보이는 a, button, input 가운데 높이 40px 미만
      const taps = await p.evaluate(() => {
        const bad = {};
        document.querySelectorAll('a[href], button, input, select, [role=button]').forEach((e) => {
          const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
          if (!r.width || !r.height || cs.visibility === 'hidden' || e.closest('[hidden]') || e.disabled) return;
          let h = r.height; for (const ps of ['::before', '::after']) { const q = getComputedStyle(e, ps); if (q.content !== 'none' && q.position === 'absolute' && cs.position !== 'static') { const t = parseFloat(q.top), bo = parseFloat(q.bottom); if (!isNaN(t) && !isNaN(bo) && t <= 0 && bo <= 0) h = Math.max(h, r.height - t - bo); } }
          if (h < 39.5) { const k = (e.closest('[class]') ? e.tagName.toLowerCase() + '.' + (e.className || e.parentElement.className || '').toString().split(' ')[0] : e.tagName) + ' @' + (e.closest('nav,header,footer,section,article,main') || document.body).className.toString().split(' ')[0]; bad[k] = bad[k] || { n: 0, h: Math.round(h), w: Math.round(r.width), t: e.textContent.trim().slice(0, 14) }; bad[k].n++; }
        });
        return bad;
      });
      if (Object.keys(taps).length) res.taps[vname + ' ' + name] = taps;
      if (vname === 'pc') res.outline[name] = await p.evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4')].filter(h => h.offsetParent && !h.closest('dialog')).map(h => h.tagName[1]).join(''));
    }
    await ctx.close();
  }
  // 죽은 CSS: 모든 화면을 돌며 한 번도 맞지 않은 선택자
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const css = fs.readFileSync('/home/user/C/assets/css/site.css', 'utf8');
  const used = new Set(); let all = [];
  const urls = VIEWS.map(v => v[0]).concat(['index.html#gate', 'webtoon.html#ep1', 'timeline.html#gocheol']);
  for (const url of urls) {
    await p.goto(BASE + url); await p.waitForTimeout(400);
    // 가려진 기록, 용어 판, 경고창을 열어 본다
    await p.evaluate(() => { document.querySelectorAll('.rec[data-lv="1"] .rec-tab').forEach(b => b.click()); const t = document.querySelector('button.term'); if (t) t.click(); });
    await p.waitForTimeout(100);
    await p.keyboard.press('Escape');
    await p.evaluate(() => { const s = document.querySelector('.rec[data-lv="2"] .rec-tab'); if (s) s.click(); });
    await p.waitForTimeout(100);
    const r = await p.evaluate(() => {
      const sels = [];
      for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules; } catch (e) { continue; } if (!sh.href || !sh.href.includes('site.css')) continue;
        const walk = (rs) => { for (const r of rs) { if (r.selectorText) r.selectorText.split(',').forEach(s => sels.push(s.trim())); else if (r.cssRules) walk(r.cssRules); } }; walk(rules); }
      const hit = []; sels.forEach((s) => { const base = s.replace(/::?(before|after|backdrop|placeholder|selection|-webkit-[\w-]+|-moz-[\w-]+)/g, '').replace(/:(hover|focus-visible|focus|active|disabled|checked|open)/g, '') || '*'; try { if (document.querySelector(base)) hit.push(s); } catch (e) { hit.push(s); } });
      return { sels, hit };
    });
    all = r.sels; r.hit.forEach(s => used.add(s));
  }
  const dead = [...new Set(all)].filter(s => !used.has(s));
  res.css = { bytes: css.length, selectors: new Set(all).size, dead: dead.length, sample: dead };
  await b.close();
  fs.writeFileSync(__dirname + '/audit.json', JSON.stringify(res, null, 1));
  console.log(JSON.stringify({ axe: res.axe, taps: res.taps, outline: res.outline, weight: res.weight, css: { bytes: res.css.bytes, selectors: res.css.selectors, dead: res.css.dead } }, null, 0).slice(0, 9000));
})();
