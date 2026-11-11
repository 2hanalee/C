/* 세계관 목록과 문서 상세. 주소의 #문서id 로 화면을 바꾼다. */
(function () {
  "use strict";
  var DOCS = window.WORLD || [];
  var SEATS = window.SEATS || [];
  var PLACES = window.PLACES || [];
  var app = document.getElementById("app");
  var rail = document.getElementById("rail-docs");
  if (!app) return;
  var B = window.BLACKOUT;
  var esc = B.esc;

  var byId = {};
  DOCS.forEach(function (d) { byId[d.id] = d; });
  var placeById = {};
  PLACES.forEach(function (p) { placeById[p.id] = p; });

  // 문서 머리에 놓는 세력 기호
  var MARKS = { academy: "faction-academy", thrones: "faction-seven-seats", consortium: "faction-consortium", "grey-zone": "faction-grey-zone" };

  // 본문의 핵심어에 색을 준다. 한 문단에서 같은 말은 처음 한 번만.
  var TERMS = [
    ["칠월의 밤", ""], ["하란항 대균열", ""], ["침식", "r"], ["마모", "r"], ["회색 구역", "r"], ["이계 균류", "r"],
    ["왕명", ""], ["칠좌", ""], ["경계인", ""], ["임시 봉합", ""], ["랭킹제", "b"], ["휴전", "b"], ["종전", "b"],
    ["4,172명", "r"], ["340미터의 흉터", ""], ["안전파", "b"], ["이윤파", "b"], ["진화파", "b"],
  ];
  var mark = function (html) {
    TERMS.forEach(function (t) {
      var i = html.indexOf(t[0]);
      // 이미 표시한 말 안쪽은 건드리지 않는다
      if (i === -1 || html.lastIndexOf("<em", i) > html.lastIndexOf("</em>", i)) return;
      html = html.slice(0, i) + '<em class="kw' + (t[1] ? " " + t[1] : "") + '">' + t[0] + "</em>" + html.slice(i + t[0].length);
    });
    return html;
  };

  var hiddenCount = function (d) {
    var parts = [];
    if (d.internal.length) parts.push("내부용 " + d.internal.length);
    if (d.secret.length) parts.push("기밀 " + d.secret.length);
    return parts.join(" · ");
  };

  var renderList = function () {
    document.title = "세계관 · 블랙아웃";
    app.innerHTML =
      '<header class="page-head" data-ghost="ARCHIVE"><h1>세계관</h1><p>문서 여덟 건. 번호 순서대로 읽으면 20년의 흐름이 이어집니다.</p></header>' +
      '<ol class="docs">' + DOCS.map(function (d) {
        return '<li><a href="#' + d.id + '"><span class="no">' + d.no + "</span>" +
          "<span><b>" + esc(d.title) + "</b><span>" + esc(d.lead) + "</span></span>" +
          '<span class="mono">' + hiddenCount(d) + "</span>" +
          (MARKS[d.id] ? '<img class="doc-mark" src="assets/img/symbols/' + MARKS[d.id] + '.svg" alt="">' : "") + "</a></li>";
      }).join("") + "</ol>" +
      '<p class="after"><a class="btn" href="characters.html">이 세계의 사람들 48인</a>' +
      '<a class="btn" href="timeline.html">연표와 지도</a></p>';
  };

  var seatsHtml = function () {
    return '<ol class="seats">' + SEATS.map(function (s) {
      var c = B.charById[s.id];
      return '<li><a class="plaque" href="characters.html#' + s.id + '"><img src="assets/img/symbols/seat-' + s.id + '.svg" alt=""></a>' +
        '<div class="who"><span class="seat-no">제' + s.seat + '좌</span><a href="characters.html#' + s.id + '">' + esc(c ? c.name : s.id) + "</a>" +
        "<span>" + esc(s.sin) + " · " + esc(s.law) + "의 법</span></div>" +
        '<p><span class="mono">흔드는 것</span>' + esc(s.pillar) + "</p>" +
        '<p><span class="mono">조건과 한계</span>' + esc(s.limit) + "</p></li>";
    }).join("") + "</ol>";
  };

  var renderDoc = function (d) {
    document.title = d.title + " · 블랙아웃";
    var i = DOCS.indexOf(d);
    var prev = DOCS[(i - 1 + DOCS.length) % DOCS.length];
    var next = DOCS[(i + 1) % DOCS.length];
    var body = d.body.map(function (b) {
      if (b.seats) return seatsHtml();
      return "<section><h2>" + esc(b.h) + "</h2>" + b.p.map(function (t) { return "<p>" + mark(esc(t)) + "</p>"; }).join("") + "</section>";
    }).join("");
    var places = (d.places || []).filter(function (id) { return placeById[id]; }).map(function (id) {
      return '<li><a href="timeline.html#' + id + '">' + esc(placeById[id].name) + "</a></li>";
    }).join("");
    var people = B.people(d.people);

    app.innerHTML =
      '<nav class="crumbs" aria-label="문서 이동"><a href="#list">← 세계관 목록</a>' +
        '<div><a href="#' + prev.id + '">이전</a><a href="#' + next.id + '">다음</a></div></nav>' +
      '<article class="profile">' +
        '<div class="profile-main doc">' +
          '<header class="doc-head' + (MARKS[d.id] ? " marked" : "") + (d.id === "grey-zone" ? " myc" : "") + '"><span class="no">' + d.no + "</span><h1>" + esc(d.title) + '</h1><p>' + esc(d.lead) + "</p>" +
            (MARKS[d.id] ? '<img class="mark" src="assets/img/symbols/' + MARKS[d.id] + '.svg" alt="">' : "") + "</header>" +
          body +
          '<dl class="spec">' +
            (people ? "<div><dt>관련 인물</dt><dd>" + people + "</dd></div>" : "") +
            (places ? '<div><dt>지도에서 보기</dt><dd><ul class="people">' + places + "</ul></dd></div>" : "") +
          "</dl>" +
        "</div>" +
        '<aside class="notes" aria-label="가려진 기록">' + B.notes(d.internal, 1, "내부용") + B.notes(d.secret, 2, "기밀") + "</aside>" +
        '<nav class="pager wide" aria-label="앞뒤 문서">' +
          '<a href="#' + prev.id + '"><span class="mono">' + prev.no + "</span><b>" + esc(prev.title) + "</b></a>" +
          '<a href="#' + next.id + '"><span class="mono">' + next.no + "</span><b>" + esc(next.title) + "</b></a></nav>" +
      "</article>";
    B.refresh();
  };

  var route = function () {
    var id = location.hash.replace(/^#/, "");
    var d = byId[id];
    if (d) renderDoc(d); else renderList();
    if (rail) {
      Array.prototype.forEach.call(rail.querySelectorAll("a"), function (a) {
        a.classList.toggle("on", a.getAttribute("href") === "#" + id);
      });
    }
    window.scrollTo(0, 0);
  };

  if (rail) {
    rail.innerHTML = DOCS.map(function (d) {
      return '<li><a href="#' + d.id + '"><span>' + d.no + "</span>" + esc(d.title) + "</a></li>";
    }).join("");
  }
  window.addEventListener("hashchange", route);
  route();
})();
