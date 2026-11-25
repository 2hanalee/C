(function () {
  "use strict";
  var R = window.RAEON || {};
  var U = R.ui;
  var app = document.getElementById("app");
  if (!U || !app) return;
  var esc = U.esc;

  var HREF = { "101": "bestiary.html", maghi: "atlas.html", romance: "bestiary.html#romance", rift: "bestiary.html#rift" };
  var books = R.books || [];
  var shelf = books.map(function (b) {
    var key = b.monsterBook === "101" ? "101" : b.id === "monster-101" ? "101" : b.id;
    var cls = key === "101" ? "book-101" : key;
    return '<a class="spine ' + esc(cls) + '" href="' + esc(HREF[key] || "bestiary.html") + '"><b>' + esc(b.title) + "</b><span>" + esc(b.scope) + "</span>" +
      (b.line ? "<q>" + esc(b.line) + "</q>" : "<span>해독되지 않은 문자가 섞인 문헌입니다.</span>") + "</a>";
  }).join("");

  var secrets = (R.secrets || []).map(function (s) { return U.seal(s, s.title); }).join("");
  var terms = (R.terms || []).map(function (t) {
    return "<dt>" + esc(t.term) + "</dt><dd>" + (t.level && t.level !== "open" ? U.seal(t, t.term) : esc(t.def)) + "</dd>";
  }).join("");

  app.innerHTML =
    '<div class="band"><b>서고</b><span>스스로 말하는 책 세 권</span></div>' +
    '<h1 class="page-title">서고</h1>' +
    '<p class="lead">' + esc(R.booksIntro || "") + "</p>" +
    '<div class="shelf">' + shelf + "</div>" +
    '<section class="section" id="seals"><h2>봉인 서가</h2><p>이야기를 읽어 가며 하나씩 풀리는 비밀을 모아 두었습니다. 책갈피를 꽂은 곳까지만 열립니다.</p>' + secrets + "</section>" +
    '<section class="section" id="terms"><h2>색인</h2><p>본문에 나오는 용어를 모았습니다. 스포일러가 담긴 풀이는 봉인되어 있습니다.</p><dl class="form">' + terms + "</dl></section>" +
    '<section class="section"><h2>세계의 법칙</h2><p>닻과 마왕, 힘과 등급의 규칙은 별도의 책에 정리되어 있습니다.</p><p><a class="btn solid" href="world.html">세계의 법칙 읽기</a></p></section>';

  var jump = function () {
    var id = decodeURIComponent(location.hash.replace(/^#/, ""));
    var el = id && document.getElementById(id);
    if (el) el.scrollIntoView();
  };
  window.addEventListener("hashchange", function () { U.transition(jump); });
  jump();
})();
