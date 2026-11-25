(function () {
  "use strict";
  var R = window.RAEON || {};
  var U = R.ui;
  var app = document.getElementById("app");
  if (!U || !app) return;
  var esc = U.esc;
  var regions = U.byId(R.regions);

  var table = function (head, rows) {
    return '<div class="table-wrap"><table class="book"><thead><tr>' + head.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") +
      "</tr></thead><tbody>" + rows.map(function (r) {
        return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
  };
  var links = function (ids) {
    return (ids || []).filter(function (id) { return regions[id]; }).map(function (id) {
      return '<a href="atlas.html#' + esc(id) + '">' + esc(regions[id].name) + "</a>";
    }).join(", ");
  };
  var section = function (id, title, inner) {
    return '<section class="section" id="' + esc(id) + '"><h2>' + esc(title) + "</h2>" + inner + "</section>";
  };

  var world = R.world || [];
  var toc = [];
  var out = world.map(function (s) {
    toc.push([s.id, s.title]);
    var h = '<div class="prose">' + (s.body || []).map(function (p) { return "<p>" + U.linkTerms(esc(p)) + "</p>"; }).join("") + "</div>";
    if (s.list) h += '<ul class="prose">' + s.list.map(function (l) { return "<li>" + U.linkTerms(esc(l)) + "</li>"; }).join("") + "</ul>";
    if (s.table) h += table(s.table.head, s.table.rows.map(function (r) { return r.map(function (c) { return U.linkTerms(esc(c)); }); }));
    if (s.quote) h += '<blockquote class="quote"><p>' + esc(s.quote) + "</p></blockquote>";
    return section(s.id, s.title, h);
  });

  var races = R.races || [];
  if (races.length) {
    toc.push(["races", "종족"]);
    out.push(section("races", "종족", "<p>대륙에 사는 종족과 그들이 고향으로 삼는 땅입니다.</p>" +
      table(["종족", "고향", "바깥에서의 모습"], races.map(function (r) { return [esc(r.name), esc(r.home), esc(r.abroad)]; }))));
  }
  var orgs = R.orgs || [];
  if (orgs.length) {
    toc.push(["orgs", "조직"]);
    out.push(section("orgs", "조직", "<p>나라 위에서 힘을 나누어 쥔 조직들입니다.</p>" +
      table(["조직", "근거지", "하는 일", "관련 지역"], orgs.map(function (o) { return [esc(o.name), esc(o.home), esc(o.work), links(o.links)]; }))));
  }
  var notes = R.regionNotes || [];
  if (notes.length) {
    toc.push(["notes", "지역 너머의 이야기"]);
    out.push(section("notes", "지역 너머의 이야기", notes.map(function (n) {
      var l = links(n.links);
      return '<div class="prose" id="' + esc(n.id) + '"><h3>' + esc(n.title) + "</h3><p>" + U.linkTerms(esc(n.text)) + "</p>" +
        (l ? "<p>관련 지역은 " + l + "입니다.</p>" : "") + "</div>";
    }).join("")));
  }

  app.innerHTML =
    '<div class="band"><b>교단 성도 서고</b><span>세계 법칙서</span></div>' +
    '<h1 class="page-title">세계의 법칙</h1>' +
    '<p class="lead">라에온을 움직이는 닻과 마왕, 힘과 등급의 규칙을 한 권으로 묶었습니다. 본문의 용어를 누르면 색인 풀이가 열립니다.</p>' +
    '<nav aria-label="이 페이지의 차례"><p>' + toc.map(function (t) { return '<a class="go" href="#' + esc(t[0]) + '">' + esc(t[1]) + "</a>"; }).join(" &nbsp; ") + "</p></nav>" +
    out.join("") +
    '<p class="prose"><a class="btn" href="library.html#terms">색인 전체 보기</a></p>';

  var jump = function () {
    var id = decodeURIComponent(location.hash.replace(/^#/, ""));
    var el = id && document.getElementById(id);
    if (el) el.scrollIntoView(); else window.scrollTo(0, 0);
  };
  window.addEventListener("hashchange", function () { U.transition(jump); });
  if (location.hash) jump();
})();
