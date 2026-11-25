/* 표지: 로그라인, 두 이야기의 문, 대륙 미리보기, 서고 입구. */
(function () {
  "use strict";
  var R = window.RAEON, U = R.ui, esc = U.esc;
  var app = document.getElementById("app");
  var story = function (id) { return (R.stories || []).filter(function (s) { return s.id === id; })[0] || {}; };
  var s1 = story(1), s2 = story(2);
  var where = function (s) {
    var at = U.bm(s.id);
    return at ? "책갈피: " + U.POINT_NAME[s.id][at] : "아직 펼치지 않았습니다";
  };
  var books = (R.books || []).map(function (b) {
    var href = { "monster-101": "bestiary.html", maghi: "atlas.html", romance: "bestiary.html#romance", rift: "bestiary.html#rift" }[b.id] || "library.html";
    var cls = { "monster-101": "book-101", maghi: "maghi", romance: "romance", rift: "rift" }[b.id] || "";
    return '<a class="spine ' + cls + '" href="' + href + '"><b>' + esc(b.title) + "</b><span>" + esc(b.scope || "") + "</span>" + (b.line ? "<q>" + esc(b.line) + "</q>" : "") + "</a>";
  }).join("");

  app.innerHTML =
    '<section class="cover on-sky">' +
      '<p class="kicker">닻이 박힌 대륙의 기록</p>' +
      '<h1 class="page-title">라에온</h1>' +
      '<p class="logline">하늘에서 내려온 거대한 닻이 대륙 곳곳에 박힌 세계입니다. 마왕의 자리가 비어 마물이 넘쳐 나는 범람기를, 여러 나라의 사람들이 저마다의 방식으로 건너고 있습니다.</p>' +
      '<p class="tone">세계는 웃지 않습니다. 사람은 웃습니다.</p>' +
    "</section>" +
    '<div class="on-sky"><div class="band"><b>여행자의 여정록</b><span>어느 이야기로 들어갈지 고르십시오</span></div></div>' +
    '<div class="story-doors">' +
      '<a class="door" href="journey.html#story-1"><span class="kicker">제1권</span><b>용사의 여정</b><p>' + esc(s1.logline) + "</p>" +
        '<span class="meta">출발과 8장 · 라에온에서 마왕성까지 · ' + where(s1) + '</span><span class="go">여정록 펼치기</span></a>' +
      '<a class="door" href="journey.html#story-2"><span class="kicker">제2권</span><b>버려진 원정</b><p>' + esc(s2.logline) + "</p>" +
        '<span class="meta">지저국 펀다, 하늘 없는 설원 · ' + where(s2) + '</span><span class="go">여정록 펼치기</span></a>' +
    "</div>" +
    '<div class="leaf"><div class="band maghi" style="margin-top:0"><b>산적 마그히와 대해</b><span>대륙 17개 지역</span></div>' +
    '<a class="map" href="atlas.html" aria-label="대륙 지도 펼치기"><img src="assets/img/map/raeon-map.webp" alt="라에온 대륙 지도. 서쪽에 라에온과 세일리아, 가운데에 모르티젠, 북쪽에 사르티온과 아스트라, 동쪽 대해 건너에 마왕령이 있다." width="2528" height="1686"></a>' +
    '<p class="margin-note">어이, 지도만 보고 다 안다고 생각하지 마. 붉은 점선은 용사 일행이 간 길이고, 그 길 밖이 진짜 위험하거든.<cite>마그히의 방주</cite></p>' +
    '<p><a class="go" href="atlas.html">지도와 17개 지역 보기</a></p></div>' +
    '<div class="leaf"><div class="band" style="margin-top:0"><b>서고</b><span>말하는 고대 마법서 세 권과 균열 문헌</span></div>' +
    '<div class="shelf">' + books + "</div>" +
    '<p><a class="go" href="guild.html">길드 등록부의 인물 ' + (R.characters || []).length + '명 보기</a></p>' +
    '<p><a class="go" href="world.html">세계의 법칙 읽기</a></p></div>';
})();
