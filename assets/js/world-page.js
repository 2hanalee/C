/* 세계관 목록과 문서 상세. 주소의 #문서id 로 화면을 바꾼다.
   목록은 문서철 묶음이고, 상세는 문서 한 건을 꺼내 펼친 화면이다. */
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
  var MARKS = { academy: "faction-academy", thrones: "celestis", consortium: "faction-consortium", "grey-zone": "faction-grey-zone" };
  var ARROW = '<svg class="go-ico" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 7h9M8 3.5 11.5 7 8 10.5"/></svg>';
  var LOCK = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="2" y="5.5" width="8" height="5.5" rx="1"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5"/></svg>';

  var mark = B.mark;
  var hiddenCount = function (d) { return d.internal.length + d.secret.length; };

  var renderList = function () {
    document.title = "세계관 · 블랙아웃";
    app.innerHTML =
      '<header class="page-head" data-ghost="ARCHIVE"><p class="kicker">방위청 공개 기록철</p><h1 class="lit">세계관</h1>' +
        "<p>인천과 이계에 관한 공개 문서 여덟 건입니다. 번호 순서대로 읽으면 20년의 흐름이 이어집니다. 문서를 누르면 본문이 열립니다.</p></header>" +
      '<ol class="folders">' + DOCS.map(function (d) {
        var n = hiddenCount(d);
        return '<li><span class="tab" aria-hidden="true">문서 ' + d.no + "</span>" +
          '<a class="folder" href="#' + d.id + '"><span class="fd-text"><b>' + esc(d.title) + "</b><span>" + esc(d.lead) + "</span>" +
            '<span class="rc-foot"><span class="rc-hidden' + (n ? "" : " zero") + '">' + (n ? LOCK + "가려진 기록 " + n + "건" : "가려진 기록 없음") + "</span>" +
            '<span class="go">문서 열람' + ARROW + "</span></span></span>" +
            (MARKS[d.id] ? '<span class="fd-mark"><img src="assets/img/emblems/' + MARKS[d.id] + '.webp" alt="" loading="lazy"></span>' : "") +
          "</a>" + (B.seen.has("w", d.id) ? '<i class="stamp-read" aria-label="열람한 문서">열람함</i>' : "") + "</li>";
      }).join("") + "</ol>" +
      '<p class="after"><a class="btn go" href="characters.html">이 세계의 인물 ' + (window.CHARACTERS || []).length + '인 보기' + ARROW + "</a>" +
      '<a class="btn go" href="timeline.html">연표와 지도 보기' + ARROW + "</a></p>";
  };

  var seatsHtml = function () {
    return '<ol class="seats">' + SEATS.map(function (s) {
      var c = B.charById[s.id];
      return '<li><a class="plaque" href="characters.html#' + s.id + '" aria-label="' + esc(c ? c.name : s.id) + ' 기록 보기"><img src="assets/img/emblems/seat-' + s.id + '.webp" alt=""></a>' +
        '<div class="who"><span class="seat-no">제' + s.seat + '좌</span><a href="characters.html#' + s.id + '">' + esc(c ? c.name : s.id) + ARROW + "</a>" +
        "<span>" + esc(s.sin) + "의 자리, " + esc(s.law) + "의 법</span></div>" +
        '<p><span class="mono">흔드는 것</span>' + esc(s.pillar) + "</p>" +
        '<p><span class="mono">조건과 한계</span>' + esc(s.limit) + "</p></li>";
    }).join("") + "</ol>";
  };

  var renderDoc = function (d) {
    document.title = d.title + " · 블랙아웃";
    B.seen.add("w", d.id);
    var i = DOCS.indexOf(d);
    var prev = DOCS[(i - 1 + DOCS.length) % DOCS.length];
    var next = DOCS[(i + 1) % DOCS.length];
    var body = d.body.map(function (b) {
      if (b.seats) return seatsHtml();
      // 구획은 문단(p)과 표(table: { head, rows, note })를 함께 담을 수 있다
      var table = b.table ? '<div class="doc-table-wrap"><table class="doc-table"><thead><tr>' + b.table.head.map(function (h) { return '<th scope="col">' + esc(h) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        b.table.rows.map(function (r) { return "<tr>" + r.map(function (c, i) { return i ? "<td>" + mark(esc(c)) + "</td>" : '<th scope="row">' + esc(c) + "</th>"; }).join("") + "</tr>"; }).join("") +
        "</tbody></table></div>" + (b.table.note ? '<p class="doc-table-note">' + esc(b.table.note) + "</p>" : "") : "";
      return "<section><h2>" + esc(b.h) + "</h2>" + (b.p || []).map(function (t) { return "<p>" + mark(esc(t)) + "</p>"; }).join("") + table + (b.after || []).map(function (t) { return "<p>" + mark(esc(t)) + "</p>"; }).join("") + "</section>";
    }).join("");
    var places = (d.places || []).filter(function (id) { return placeById[id]; }).map(function (id) {
      return '<li><a href="timeline.html#' + id + '">' + esc(placeById[id].name) + "</a></li>";
    }).join("");
    var people = B.people(d.people);
    var list = B.records(d.internal, d.secret, "w:" + d.id, "「" + d.title + "」 문서의");

    app.innerHTML =
      '<nav class="crumbs" aria-label="문서 이동"><a class="back" href="#list">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4"/></svg>세계관 목록으로</a>' +
        '<div><a href="#' + prev.id + '">이전 문서: ' + esc(prev.title) + '</a><a href="#' + next.id + '">다음 문서: ' + esc(next.title) + "</a></div></nav>" +
      '<article class="sheetcard docsheet">' +
        '<header class="sc-head"><span>방위청 공개 기록철</span><span class="mono">문서 ' + d.no + ", 열람용 사본</span></header>" +
        '<div class="doc">' +
          '<header class="doc-head' + (MARKS[d.id] ? " marked" : "") + '"><h1>' + esc(d.title) + "</h1><p>" + esc(d.lead) + "</p>" +
            (MARKS[d.id] ? '<span class="mark"><img src="assets/img/emblems/' + MARKS[d.id] + '.webp" alt=""></span>' : "") + "</header>" +
          (d.image ? '<img class="scene" src="' + esc(d.image) + '" alt="' + esc(d.title) + '">' : "") +
          body +
          (people || places ? '<dl class="form refs">' +
            (people ? "<dt>관련 인물</dt><dd>" + people + "</dd>" : "") +
            (places ? '<dt>지도에서 보기</dt><dd><ul class="people">' + places + "</ul></dd>" : "") +
          "</dl>" : "") +
        "</div>" +
      "</article>" +
      B.hiddenSection(list) +
      '<nav class="pager" aria-label="앞뒤 문서">' +
        '<a href="#' + prev.id + '"><span class="mono">이전 문서 ' + prev.no + "</span><b>" + esc(prev.title) + "</b></a>" +
        '<a href="#' + next.id + '"><span class="mono">다음 문서 ' + next.no + "</span><b>" + esc(next.title) + "</b></a></nav>";
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
