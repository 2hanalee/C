// 정리본(docs/source/settings-integrated.md)과 사이트 데이터가 어긋나지 않는지 본다.
//   node tools/qa/qa-canon.js
// 인물 문장(성격, 과거, 지금, 외형, 덧붙임), 세계관 본문, 연표와 장소의 문장이 정리본에 그대로 있는지 확인한다.
// 정리본에 없는 문장은 목록으로 알려 준다. 알려 준 문장이 의도한 것(개요, 이름 미정 교관, 연결 문장)인지는 사람이 본다.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sb = { window: {} };
['characters', 'world', 'timeline'].forEach((f) => vm.runInNewContext(read('assets/js/' + f + '.js'), sb));
const W = sb.window;
const NAME = {};
read('tools/qa/build-canon.js').split('\n').forEach((l) => { const m = l.match(/^\s*\["((?:MG|AV|IW|SE|BR|ENT|COR|MER)\d\d)", "[^"]+", "([^"]+)"/); if (m) NAME[m[1]] = m[2]; });
let src = read('docs/source/settings-integrated.md').replace(/`/g, '').replace(/\*\*/g, '');
const josa = (w, j) => { const c = w.charCodeAt(w.length - 1), has = c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0; return { 은: has ? '은' : '는', 는: has ? '은' : '는', 이: has ? '이' : '가', 가: has ? '이' : '가', 을: has ? '을' : '를', 를: has ? '을' : '를', 과: has ? '과' : '와', 와: has ? '과' : '와' }[j]; };
src = src.replace(/\((?:MG|AV|IW|SE|BR|ENT|COR|MER)\d+\)/g, '').replace(/((?:MG|AV|IW|SE|BR|ENT|COR|MER)\d\d)(은|는|이|가|을|를|과|와)?/g, (m, c, j) => (NAME[c] || c) + (j ? josa(NAME[c] || c, j) : '')).replace(/\s*[♡♧♤]/g, '').replace(/[“”]/g, '');
const flat = src.replace(/\s+/g, ' ');
const fails = [], notes = [];
const fail = (m) => fails.push(m);
const txt = (it) => (typeof it === 'string' ? it : it.t);
const has = (s) => flat.indexOf(s.replace(/[“”]/g, '').replace(/\s+/g, ' ')) !== -1;

const C = W.CHARACTERS;
if (C.length !== 49) fail('인물 수 ' + C.length);
const ids = new Set(C.map((c) => c.id)); if (ids.size !== 49) fail('인물 id 겹침');
const off = [];
C.forEach((c) => {
  ['personality', 'past', 'now', 'appearance', 'notes'].forEach((k) => (c[k] || []).forEach((it) => { if (!has(txt(it).replace(/^(목표|잠입 임무): /, ''))) off.push(`${c.name} ${k}: ${txt(it).slice(0, 36)}`); }));
  if (c.ability && c.ability.text && !has(c.ability.text.split(/(?<=\.) /)[0])) off.push(`${c.name} 능력: ${c.ability.text.slice(0, 30)}`);
  [...c.internal, ...c.secret].forEach((r) => { if (!r.text) fail(`${c.name} 빈 기록 ${r.topic}`); });
  (c.past || []).concat(c.now || [], c.personality || [], c.appearance || [], c.notes || []).forEach((it) => {
    if (typeof it !== 'string' && ![...c.internal, ...c.secret].some((r) => r.topic === it.ref)) fail(`${c.name} 먹칠 기록 없음 ${it.ref}`);
  });
  c.relations.forEach((r) => { if (!ids.has(r.id)) fail(`${c.name} 관계 상대 없음 ${r.id}`); });
  if (c.summary.length < 40 || c.summary.length > 110) fail(`${c.name} 개요 길이 ${c.summary.length}`);
});
// 순위 겹침
const rk = {}; C.forEach((c) => { if (c.rank) (rk[c.rank] = rk[c.rank] || []).push(c.name); });
Object.keys(rk).forEach((r) => { if (rk[r].length > 1) fail(`순위 ${r} 겹침 ${rk[r].join(', ')}`); });
if (C.find((c) => c.id === 'lee-seohyeon').rank !== 6) fail('이서현 순위');
// 세계관
const dOff = [];
W.WORLD.forEach((d) => {
  d.body.forEach((b) => {
    (b.p || []).concat(b.after || []).forEach((p) => { if (!has(p)) dOff.push(`${d.title}/${b.h || ''}: ${p.slice(0, 40)}`); });
    if (b.table) b.table.rows.forEach((r) => { if (!has(r[1])) dOff.push(`${d.title} 표 ${r[0]}`); });
  });
  d.secret.forEach((r) => { if (!has(r.text)) dOff.push(`${d.title} 기밀 ${r.topic}`); });
});
W.TERMS.forEach((t) => { if (!W.WORLD.some((d) => d.id === t.doc)) fail('용어 문서 없음 ' + t.term); });
notes.push(`정리본에 그대로 없는 인물 문장 ${off.length}건, 세계관 문장 ${dOff.length}건`);
off.forEach((x) => notes.push('  인물 ' + x));
dOff.forEach((x) => notes.push('  세계관 ' + x));
console.log(notes.join('\n'));
console.log(fails.length ? '실패 ' + fails.length + '건\n' + fails.join('\n') : '정리본 점검 통과');
process.exit(fails.length ? 1 : 0);
