/* 마물 도감. 세 책이 나눠 맡는다: 총해록(#, #monster-101), 연애록(#romance), 균열 문헌(#rift). #마물id 는 항목 하나. */
(function () {
  "use strict";
  var R = window.RAEON, U = R.ui, esc = U.esc;
  var app = document.getElementById("app");
  var all = R.monsters || [];
  var byId = U.byId(all), regions = U.byId(R.regions), chars = U.byId(R.characters);
  var GRADES = ["F", "D", "D+", "C", "C+", "B", "A", "A+", "S", "SS", "SSS"];
  var CREST = { beast: 1, kin: 1, undead: 1, blood: 1, "dragon-sea": 1, construct: 1, demon: 1, rift: 1 };
  var crestImg = function (m) { return m.book === "romance" ? "❀" : CREST[m.family] ? '<img src="assets/img/ui/crest-' + m.family + '.webp" alt="" width="256" height="256">' : "✶"; };
  var BOOK = {
    "101": { id: "monster-101", title: "오우거도 알아듣는 마물 101종 총해록", short: "총해록", src: "《오우거도 알아듣는 마물 101종 총해록 발췌》", cls: "", band: "" },
    romance: { id: "romance", title: "노바카사와 21명의 마물 연애록", short: "연애록", src: "《노바카사와 21명의 마물 연애록 발췌》", cls: "romance", band: "romance" },
    rift: { id: "rift", title: "신이 없는 세계의 신, 그리고 균열", short: "균열 문헌", src: "《신이 없는 세계의 신, 그리고 균열에서 발췌》", cls: "rift", band: "" },
  };
  var state = { book: "101", grade: "", region: "", q: "" };

  var nameOf = function (m) { return m.quoted ? "‘" + m.name + "’" : m.name; };
  var crest = crestImg;

  var frame = function (m, mini) {
    var b = BOOK[m.book] || BOOK["101"];
    if (m.image) return '<img src="' + esc(m.image) + '" alt="' + esc(m.name) + " 도감 카드. 위험도 " + esc(m.grade) + ". " + esc(m.line) + '" loading="lazy" width="1200" height="800">';
    return '<div class="plate-frame"><div class="crest" aria-hidden="true">' + crest(m) + "</div>" +
      (m.book === "101" && m.no ? '<p class="en">제' + m.no + "항</p>" : "") +
      "<h3>" + esc(nameOf(m)) + "</h3>" + (m.en ? '<p class="en">' + esc(m.en) + "</p>" : "") +
      '<div class="risk"><span>위험도</span><strong class="' + U.gradeClass(m.grade) + '">' + esc(m.grade) + "</strong></div>" +
      (mini ? "" : '<p class="label">상세설명</p><p class="line">' + esc(m.line) + '</p><p class="src">' + b.src + "</p>") + "</div>";
  };
  var card = function (m) {
    if (!U.isOpen(m)) {
      return '<div class="plate-card mini ' + (BOOK[m.book] || {}).cls + '"><div class="plate-frame"><div class="crest" aria-hidden="true"><img src="assets/img/ui/wax-seal.webp" alt="" width="320" height="328"></div><h3>봉인된 항목</h3><div class="risk"><span>위험도</span><strong class="rift">???</strong></div></div></div>';
    }
    return '<a class="plate-card mini ' + (BOOK[m.book] || {}).cls + '" href="#' + m.id + '">' + frame(m, true) + "</a>";
  };

  var list = function () {
    return all.filter(function (m) {
      if (m.book !== state.book) return false;
      if (state.grade && m.grade !== state.grade) return false;
      if (state.region && (m.regions || []).indexOf(state.region) === -1) return false;
      var q = state.q.trim();
      if (q && (m.name + " " + (m.en || "") + " " + (U.isOpen(m) ? m.line : "")).indexOf(q) === -1) return false;
      return true;
    }).sort(function (a, b) { return (a.no || 0) - (b.no || 0) || GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade); });
  };

  var renderResults = function () {
    var items = list();
    var box = document.getElementById("results");
    box.innerHTML = items.length ? '<div class="plates">' + items.map(card).join("") + "</div>"
      : '<p class="empty">조건에 맞는 마물이 이 책에는 없습니다. 거르기를 풀거나 다른 책을 펼쳐 보십시오.</p>';
    document.getElementById("tally").textContent = "이 책에서 " + items.length + "종을 찾았습니다.";
  };

  var renderList = function () {
    var b = BOOK[state.book];
    U.setBook(state.book === "romance" ? "romance" : "101");
    U.setBg(U.art.book(state.book));
    document.title = b.short + " · 라에온";
    var inBook = all.filter(function (m) { return m.book === state.book; });
    var regionIds = [];
    inBook.forEach(function (m) { (m.regions || []).forEach(function (r) { if (regionIds.indexOf(r) === -1) regionIds.push(r); }); });
    var humanoids = ["라미아", "세이렌", "하피", "아라크네", "스킬라", "메두사"].filter(function (n) { return all.some(function (m) { return m.book === "romance" && m.name === n; }); }).join(", ");
    app.innerHTML =
      '<div class="band ' + b.band + '"><b>' + esc(b.title) + "</b><span>" + inBook.length + "종</span></div>" +
      '<h1 class="page-title">마물 도감</h1>' +
      '<p class="lead">세 권의 책이 마물을 나눠 맡습니다. 총해록은 사람의 모습이 아닌 마물을, 노바카사의 연애록은 사람의 모습을 한 마물을, 균열 문헌은 균열 너머에서 온 것들을 다룹니다.</p>' +
      '<p><button type="button" class="btn book-open" data-book-open="' + esc(state.book) + '">책으로 펼쳐 보기</button></p>' +
      '<div class="chips" role="group" aria-label="책 고르기" style="margin-top:.8rem">' + Object.keys(BOOK).map(function (k) {
        return '<button type="button" data-book="' + k + '" aria-pressed="' + (state.book === k) + '">' + BOOK[k].short + "<small>" + all.filter(function (m) { return m.book === k; }).length + "</small></button>";
      }).join("") + "</div>" +
      (state.book === "101" ? '<p class="margin-note scholar">사람의 모습을 한 마물을 찾으신다면, 그건 담당이 아닙니다. 노바카사의 연애록을 펼치십시오(' + humanoids + " 등).<cite>총해록의 서문</cite></p>" : "") +
      (state.book === "romance" ? '<p class="margin-note bard">사람의 얼굴을 한 마물들이라네. 다들 한 번쯤 누군가를 울렸고, 누군가에게 울었지.<cite>노바카사의 서문</cite></p>' : "") +
      (state.book !== "rift" ? '<div class="ladder" role="group" aria-label="등급으로 거르기">' + GRADES.map(function (g) {
        return '<button type="button" data-grade="' + g + '" aria-pressed="' + (state.grade === g) + '"' + (g === "D+" ? ' class="base" title="무기를 든 일반인 성인 남성"' : "") + ">" + g + "</button>";
      }).join("") + '</div><p class="ladder-note">등급을 누르면 그 등급만 봅니다. D+는 무기를 든 일반인 성인 남성의 기준선이며, 한 등급 위를 상대하려면 바로 아래 등급이 다섯 이상 필요합니다.</p>' : "") +
      (regionIds.length ? '<div class="chips" role="group" aria-label="지역으로 거르기"><button type="button" data-region="" aria-pressed="' + !state.region + '">모든 지역</button>' + regionIds.map(function (id) {
        return '<button type="button" data-region="' + id + '" aria-pressed="' + (state.region === id) + '">' + esc(regions[id] ? regions[id].name : id) + "</button>";
      }).join("") + "</div>" : "") +
      '<label class="search">이름이나 설명으로 찾기<input id="q" type="search" autocomplete="off" value="' + esc(state.q) + '" placeholder="예: 슬라임, 바다"></label>' +
      '<p class="ui" id="tally" aria-live="polite" style="font-size:.8rem;color:var(--ink-3)"></p>' +
      '<div id="results"></div>';
    document.getElementById("q").addEventListener("input", function (e) { state.q = e.target.value; renderResults(); });
    renderResults();
  };

  var renderItem = function (m) {
    document.title = m.name + " · 라에온";
    U.setBook(m.book === "romance" ? "romance" : "101");
    U.setBg(U.art.monster(m));
    var b = BOOK[m.book] || BOOK["101"];
    var back = m.book === "101" ? "#" : "#" + m.book;
    if (!U.isOpen(m)) {
      app.innerHTML = '<nav class="crumbs"><a class="back" href="' + back + '">도감으로 돌아가기</a></nav>' + U.seal(m, "봉인된 항목");
      return;
    }
    var named = (m.named || []).filter(function (id) { return chars[id]; }).map(function (id) {
      return '<li><a href="guild.html#' + id + '"><b>' + esc(chars[id].name) + "</b><em>" + esc(chars[id].epithet || "") + "</em></a></li>";
    }).join("");
    var where = (m.regions || []).filter(function (id) { return regions[id]; }).map(function (id) {
      return '<li><a href="atlas.html#' + id + '"><b>' + esc(regions[id].name) + "</b><em>" + esc(regions[id].land) + "</em></a></li>";
    }).join("");
    var same = all.filter(function (x) { return x.book === m.book && x.grade === m.grade && x.id !== m.id && U.isOpen(x); }).slice(0, 8);
    app.innerHTML =
      '<nav class="crumbs"><a class="back" href="' + back + '">' + b.short + '(으)로 돌아가기</a><button type="button" class="btn book-open" data-book-open="' + esc(m.book) + '" data-book-at="' + esc(m.id) + '">책으로 펼쳐 보기</button></nav>' +
      '<div class="band ' + b.band + '"><b>' + esc(b.title) + "</b><span>" + (m.no ? "제" + m.no + "항" : "") + "</span></div>" +
      '<div class="detail-grid"><div>' +
        '<div class="plate-card ' + b.cls + '" style="margin-top:.5rem">' + frame(m, false) + "</div>" +
        (m.draft ? '<p class="ui" style="font-size:.75rem;color:var(--ink-3);margin-top:.4rem">상세설명은 초안입니다.</p>' : "") +
      "</div><div>" +
        (where ? '<section class="section"><h2>사는 곳</h2><ul class="rel">' + where + "</ul></section>" : "") +
        (named ? '<section class="section"><h2>이름이 알려진 개체</h2><ul class="rel">' + named + "</ul></section>" : "") +
        (same.length ? '<section class="section"><h2>같은 등급의 마물</h2><div class="plates" style="grid-template-columns:repeat(2,minmax(0,1fr))">' + same.map(card).join("") + "</div></section>" : "") +
      "</div></div>";
  };

  app.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-book],[data-grade],[data-region]");
    if (!t) return;
    if (t.dataset.book) { state.book = t.dataset.book; state.grade = ""; state.region = ""; history.replaceState(null, "", t.dataset.book === "101" ? location.pathname : "#" + t.dataset.book); renderList(); return; }
    if (t.dataset.grade !== undefined && t.hasAttribute("data-grade")) state.grade = state.grade === t.dataset.grade ? "" : t.dataset.grade;
    if (t.hasAttribute("data-region")) state.region = t.dataset.region;
    Array.prototype.forEach.call(app.querySelectorAll("[data-grade]"), function (x) { x.setAttribute("aria-pressed", String(x.dataset.grade === state.grade)); });
    Array.prototype.forEach.call(app.querySelectorAll("[data-region]"), function (x) { x.setAttribute("aria-pressed", String(x.dataset.region === state.region)); });
    renderResults();
  });

  var route = function () {
    var id = location.hash.slice(1);
    if (byId[id]) { renderItem(byId[id]); window.scrollTo(0, 0); return; }
    if (id === "romance" || id === "rift") state.book = id;
    else if (!id || id === "monster-101") state.book = "101";
    renderList();
    window.scrollTo(0, 0);
  };
  window.addEventListener("hashchange", function () { U.transition(route); });
  route();
})();
