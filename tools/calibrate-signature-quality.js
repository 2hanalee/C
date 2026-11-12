// 서명 품질 점수 기준(QC)을 정할 때 쓴 측정 스크립트.
// 진단용 사본이 필요하다: Frame_Studio_15.html에서 "buildPersonaUI(); renderPersona(); renderPrefs();" 줄 다음에
//   window.__fs = { measureSig, genCandidates, state, keywordPersona, personaToSig, SIG_PARAMS, cleanSig, PRESETS, SIG_DEFAULT, valsOf };
// 를 넣은 사본을 만들어 그 경로를 넘긴다. 배포 파일에는 넣지 않는다.
// 사용: node tools/calibrate-signature-quality.js <진단용 사본 절대경로>
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + process.argv[2]); await p.waitForTimeout(3000);
const r = await p.evaluate(() => {
  const F = window.__fs, names = [['CELESTIS', '셀레스티스'], ['AURELIA', '아우렐리아'], ['MAXIMILIAN VON HOHENZOLLERN', '막시밀리안'], ['IO', '이오'], ['BERNHARDT', '베른하르트']];
  const rows = [];
  const setName = (en, ko) => { const v = F.valsOf(); v.nameEn = en; v.nameKo = ko; };
  const run = (label, p) => { const q = F.measureSig(F.cleanSig(p)); rows.push({ label, ...(q ? { score: q.score, ...q.metrics, issues: q.issues.join('/') } : { score: null }) }); };
  for (const [en, ko] of names) { setName(en, ko);
    for (const [pn, pp] of Object.entries(F.PRESETS)) for (const v of [0, 3, 11]) run(`${en}|${pn}|v${v}`, { ...F.SIG_DEFAULT, ...pp, variant: v });
    run(`${en}|ko-source`, { ...F.SIG_DEFAULT, source: 'ko' });
    run(`${en}|BAD-overlap`, { ...F.SIG_DEFAULT, under: 1, thick: 2.2, tail: 2.5, amp: 0.6 });
    run(`${en}|BAD-wobble`, { ...F.SIG_DEFAULT, jitter: 1, variant: 5 });
    run(`${en}|BAD-dense`, { ...F.SIG_DEFAULT, weight: 1, spacing: -0.3, wscale: 0.6 });
    run(`${en}|BAD-thin`, { ...F.SIG_DEFAULT, weight: 0, amp: 1.9, wscale: 1.6, spacing: 0.5 });
  }
  return rows;
});
const keys = ['rel', 'overlap', 'density', 'wobble', 'cover'];
const good = r.filter(x => !x.label.includes('BAD') && x.score !== null), bad = r.filter(x => x.label.includes('BAD'));
const q = (arr, k, f) => { const s = arr.map(x => x[k]).sort((a, b) => a - b); return s[Math.floor((s.length - 1) * f)]; };
for (const k of keys) console.log(k.padEnd(8), 'good p10/p50/p90', [0.1, 0.5, 0.9].map(f => q(good, k, f)).join(' / '), '| bad min/max', Math.min(...bad.map(x => x[k])), Math.max(...bad.map(x => x[k])));
console.log('good score p10/p50/p90', [0.1, 0.5, 0.9].map(f => q(good, 'score', f)).join(' / '));
bad.forEach(x => console.log(x.label.padEnd(44), x.score, keys.map(k => k + '=' + x[k]).join(' '), x.issues));
good.filter(x => x.score < 70).forEach(x => console.log('LOW', x.label.padEnd(40), x.score, x.issues));
console.log('errors', errs, 'n', r.length, 'nulls', r.filter(x => x.score === null).length);
await b.close(); })();
