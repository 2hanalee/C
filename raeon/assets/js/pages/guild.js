(function () {
  "use strict";
  var R = window.RAEON || {};
  var U = R.ui;
  var app = document.getElementById("app");
  if (!U || !app) return;
  var esc = U.esc;
  var chars = R.characters || [];
  var regions = U.byId(R.regions);
  var chars$ = U.byId(chars);
  var state = { q: "", region: "all", group: "all" };

  var GROUPS = [
    ["all", "전체", function () { return true; }],
    ["core", "이야기의 중심", function (c) { return c.group === "core" || c.group === "party"; }],
    ["demon", "마왕령", function (c) { return c.group === "demon"; }],
    ["romance", "연애록", function (c) { return !!c.romance; }],
  ];
  var regionName = function (c) { return regions[c.region] ? regions[c.region].name : "지역 없음"; };
  var stamp = function (c) {
    var g = c.grade || {};
    return '<span class="grade-stamp' + (g.kind === "monster" ? " monster" : "") + '">' + esc(g.label || "미등록") + "</span>";
  };
  var firstLine = function (c) { return (c.lines && c.lines[0]) || ""; };

  var matches = function (c) {
    var q = state.q.trim().toLowerCase();
    if (q && [c.name, c.epithet, c.race].join(" ").toLowerCase().indexOf(q) === -1) return false;
    if (state.region === "none" ? c.region : state.region !== "all" && c.region !== state.region) return false;
    var g = GROUPS.filter(function (x) { return x[0] === state.group; })[0];
    return g ? g[2](c) : true;
  };

  var card = function (c) {
    var name = c.romance ? '<span class="pressed-flower" aria-hidden="true">✿</span> ' + esc(c.name) : esc(c.name);
    return '<a class="rcard' + (c.romance ? " romance" : "") + '" href="#' + esc(c.id) + '">' +
      '<div class="top-row"><span>' + esc(regionName(c)) + "</span>" + stamp(c) + "</div>" +
      "<b>" + name + "</b>" +
      '<span class="epi">' + esc(c.epithet) + "</span>" +
      (firstLine(c) ? "<q>" + esc(firstLine(c)) + "</q>" : "") +
      '<div class="meta"><span>등록 카드 열람</span><span class="go"></span></div></a>';
  };

  var chipRow = function (attr, items, cur) {
    return items.map(function (it) {
      return '<button type="button" ' + attr + '="' + esc(it[0]) + '" aria-pressed="' + (cur === it[0]) + '">' + esc(it[1]) + " <small>" + it[2] + "</small></button>";
    }).join("");
  };

  var drawResults = function () {
    var box = document.getElementById("results");
    if (!box) return;
    var list = chars.filter(matches);
    box.innerHTML = list.length ? '<div class="rcards">' + list.map(card).join("") + "</div>" :
      '<p class="empty">조건에 맞는 인물이 등록부에 없습니다. 검색어나 필터를 바꾸어 보십시오.</p>';
  };
  var drawChips = function () {
    var rc = {}, none = 0;
    chars.forEach(function (c) { if (regions[c.region]) rc[c.region] = (rc[c.region] || 0) + 1; else none++; });
    var items = [["all", "전체", chars.length]];
    (R.regions || []).forEach(function (r) { if (rc[r.id]) items.push([r.id, r.name, rc[r.id]]); });
    if (none) items.push(["none", "지역 없음", none]);
    document.getElementById("chips-region").innerHTML = chipRow("data-region", items, state.region);
    document.getElementById("chips-group").innerHTML = chipRow("data-group", GROUPS.map(function (g) {
      return [g[0], g[1], chars.filter(g[2]).length];
    }), state.group);
  };

  var list = function () {
    document.title = "인물 · 라에온";
    app.innerHTML =
      '<div class="band"><b>모험가 길드 등록부</b><span>' + chars.length + "명</span></div>" +
      '<h1 class="page-title">인물</h1>' +
      '<p class="lead">길드 등록부에는 용사와 마왕군, 마을 사람까지 라에온에서 이름을 남긴 사람이 모두 실려 있습니다. 이름이나 종족으로 찾거나, 지역과 무리별로 추려 보십시오.</p>' +
      '<label class="search">이름, 별칭, 종족으로 찾기<input type="search" id="q" autocomplete="off" placeholder="예: 카일, 엘프, 성녀"></label>' +
      '<div class="chips" id="chips-region" role="group" aria-label="지역별로 보기"></div>' +
      '<div class="chips" id="chips-group" role="group" aria-label="무리별로 보기"></div>' +
      '<div id="results" aria-live="polite"></div>';
    var q = document.getElementById("q");
    q.value = state.q;
    q.addEventListener("input", function () { state.q = q.value; drawResults(); });
    app.querySelector("#chips-region").addEventListener("click", function (e) {
      var b = e.target.closest("[data-region]");
      if (!b) return;
      state.region = b.getAttribute("data-region"); drawChips(); drawResults();
    });
    app.querySelector("#chips-group").addEventListener("click", function (e) {
      var b = e.target.closest("[data-group]");
      if (!b) return;
      state.group = b.getAttribute("data-group"); drawChips(); drawResults();
    });
    drawChips();
    drawResults();
  };

  var detail = function (i) {
    var c = chars[i], prev = chars[i - 1], next = chars[i + 1];
    document.title = c.name + " · 인물 · 라에온";
    var g = c.grade || {};
    var reg = regions[c.region]
      ? '<a href="atlas.html#' + esc(c.region) + '">' + esc(regions[c.region].name) + "</a>" : "지역 없음";
    var sec = function (h, t) { return t ? "<h2>" + h + "</h2><p>" + esc(t) + "</p>" : ""; };
    var no = String(i + 1);
    if (no.length < 2) no = "0" + no;
    var rel = (c.relations || []).map(function (r) {
      var t = chars$[r.to];
      var inner = "<b>" + esc(t ? t.name : r.to) + "</b><em>" + esc(r.note) + (r.implied ? " (넌지시 암시된 관계입니다.)" : "") + "</em>";
      return "<li>" + (t ? '<a href="#' + esc(t.id) + '">' + inner + "</a>" : '<span class="row">' + inner + "</span>") + "</li>";
    }).join("");
    var secrets = (c.secrets || []).map(function (s) { return U.seal(s, s.title || "숨겨진 기록"); }).join("");
    var label = c.name + U.josa(c.name, "와", "과") + " 대화";
    app.innerHTML =
      '<nav class="crumbs" aria-label="등록부 탐색"><a class="back" href="#">등록부로 돌아가기</a><span>' +
      (prev ? '<a href="#' + esc(prev.id) + '">이전 ' + esc(prev.name) + "</a> " : "") +
      (next ? '<a href="#' + esc(next.id) + '">다음 ' + esc(next.name) + "</a>" : "") + "</span></nav>" +
      '<article class="sheet"><div class="sheet-head"><b>모험가 길드 등록부</b><span>등록 번호 ' + no + "</span></div>" +
      "<h1>" + (c.romance ? '<span class="pressed-flower" aria-hidden="true">✿</span> ' : "") + esc(c.name) + "</h1>" +
      '<p class="epithet">' + esc(c.epithet) + "</p>" +
      '<div class="detail-grid"><div>' +
      '<dl class="form"><dt>종족</dt><dd>' + esc(c.race) + "</dd><dt>나이</dt><dd>" + esc(c.age || "알 수 없음") +
      "</dd><dt>등급</dt><dd>" + stamp(c) + "</dd><dt>지역</dt><dd>" + reg + "</dd><dt>등장</dt><dd>" + esc(c.appears || "기록 없음") + "</dd></dl>" +
      sec("외형", c.looks) + sec("성격과 설정", c.nature) + sec("말투", c.speech) +
      ((c.lines || []).length ? '<div class="quote">' + c.lines.map(function (l) { return "<p>" + esc(l) + "</p>"; }).join("") + "</div>" : "") +
      sec("몸짓", c.gesture) + sec("용사 제도와의 거리", c.heroDistance) +
      "</div><aside>" +
      "<h2>관계</h2>" + (rel ? '<ul class="rel">' + rel + "</ul>" : "<p>등록부에 적힌 관계가 아직 없습니다.</p>") +
      secrets +
      (c.romance ? '<p class="margin-note bard">노바카사의 연애록에 실린 인물이라네. <a class="go" href="bestiary.html#romance">연애록 펼치기</a></p>' : "") +
      "<h2>대화</h2><p>" + U.chatButtons(label) + "</p>" +
      "</aside></div></article>";
  };

  var render = function (scroll) {
    var id = decodeURIComponent(location.hash.replace(/^#/, ""));
    var i = -1;
    chars.forEach(function (c, n) { if (c.id === id) i = n; });
    if (i >= 0) detail(i); else list();
    if (scroll) window.scrollTo(0, 0);
  };
  window.addEventListener("hashchange", function () { render(true); });
  render(false);
})();
