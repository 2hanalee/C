// 인물 상세의 「과거」를 만든다.
//   원문: docs/v3-past.json (설정집 v3 인물 문단, 블록 해시로 원문 일치를 확인한 스냅숏)
//   결과: assets/js/characters.js 의 각 인물에 "past" (권도하는 "pastTraces" 도) 를 써 넣는다.
// 문장은 past-split.js 가 문장 경계에서만 나눈다. 글자는 고치지 않는다.
// 가릴 문장은 아래 GRADES 에 적는다. 값이 글자면 같은 인물의 가려진 기록 주제(topic)이고 그 기록의 등급을 따른다.
// 값이 1 이면 내부용, 2 면 기밀로 직접 가린다(이어 줄 기록이 없을 때).
// 다시 돌려도 된다. 기존 "past"/"pastTraces" 를 지우고 새로 쓴다.
//   node tools/qa/build-past.js
"use strict";
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var split = require("./past-split.js");

var ROOT = path.join(__dirname, "..", "..");
var SRC = path.join(ROOT, "docs", "v3-past.json");
var DATA = path.join(ROOT, "assets", "js", "characters.js");

// 인물 번호 → { 문장 번호: 기록 주제 | 1 | 2 }
var GRADES = {
  1: { 5: "판단 착오" },
  6: { 1: "월곶 하수 터널" },
  10: { 1: "쿠오와의 계약" },
  17: { 0: "학장", 1: "학장", 3: "능력의 대가", 4: "능력의 대가" },
  18: { 2: "버스", 3: "버스" },
  20: { 3: "훔친 기록" },
  24: { 2: "말소", 3: "말소", 4: "말소", 5: "말소", 6: 2 },
  25: { 2: "예고 장부", 3: "예고 장부", 4: "거짓 맹세", 5: "결투", 6: "결투" },
  26: { 3: "등급 조작" },
  28: { 2: "명령서", 3: "명령서", 4: "명령서", 5: "명령서", 6: "명령서" },
  35: { 2: "결투", 3: "결투", 4: "결투" },
  36: { 2: "임무" },
  38: { 2: 2, 3: 2 },
  39: { 0: "출생", 4: "쪽방과 찜질방" },
  49: { 2: 2 },
};
// 권도하의 「남은 흔적」 → { 줄 번호: 기록 주제 | 1 | 2 }
var TRACE_GRADES = { 25: { 1: "결투", 2: "사고 보고서" } };

var sha8 = function (s) { return crypto.createHash("sha256").update(s).digest("hex").slice(0, 8); };

function item(text, g) {
  if (g == null) return JSON.stringify(text);
  return '{ "t": ' + JSON.stringify(text) + (typeof g === "number" ? ', "lv": ' + g : ', "ref": ' + JSON.stringify(g)) + " }";
}
function block(name, list) {
  return '  "' + name + '": [\n' + list.map(function (l) { return "   " + l; }).join(",\n") + "\n  ],\n";
}

var src = JSON.parse(fs.readFileSync(SRC, "utf8"));
var text = fs.readFileSync(DATA, "utf8");
// 기존 과거 칸을 지운다
text = text.replace(/  "past(?:Traces)?": \[\n(?:   .*\n)*?  \],\n/g, "");

var vm = require("vm");
var sandbox = { window: {} };
vm.runInNewContext(text, sandbox);
var people = sandbox.window.CHARACTERS;

src.items.forEach(function (it) {
  if (sha8(it.text) !== it.h) throw new Error(it.no + "번 원문이 v3 해시와 다릅니다.");
  var c = people.filter(function (p) { return p.no === it.no; })[0];
  if (!c) throw new Error(it.no + "번 인물이 없습니다.");
  var topics = c.internal.concat(c.secret).map(function (r) { return r.topic; });
  var check = function (g, where) {
    if (typeof g === "string" && topics.indexOf(g) === -1) throw new Error(c.name + " " + where + ": 가려진 기록 「" + g + "」가 없습니다.");
  };
  var grades = GRADES[it.no] || {};
  var sentences = split(it.text);
  Object.keys(grades).forEach(function (k) { if (+k >= sentences.length) throw new Error(c.name + " 문장 " + k + " 없음"); check(grades[k], "문장 " + k); });
  var add = block("past", sentences.map(function (s, i) { return item(s, grades[i]); }));
  if (it.traces) {
    var tg = TRACE_GRADES[it.no] || {};
    it.traces.forEach(function (t) { if (sha8(t.text) !== t.h) throw new Error(it.no + "번 남은 흔적이 v3 해시와 다릅니다."); });
    Object.keys(tg).forEach(function (k) { check(tg[k], "흔적 " + k); });
    add += block("pastTraces", it.traces.map(function (t, i) { return item(t.text, tg[i]); }));
  }
  // "id" 줄 다음에 오는 첫 "summary" 줄 뒤에 넣는다
  var at = text.indexOf('\n  "id": "' + c.id + '"');
  if (at === -1) throw new Error(c.id + " 를 찾지 못했습니다.");
  var sum = text.indexOf('\n  "summary": ', at);
  var eol = text.indexOf("\n", sum + 1);
  text = text.slice(0, eol + 1) + add + text.slice(eol + 1);
});

fs.writeFileSync(DATA, text);
console.log("과거 " + src.items.length + "인을 썼습니다.");
