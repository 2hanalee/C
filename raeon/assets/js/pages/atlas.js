/* 지도와 지역: 산적 마그히와 대해. #지역id 는 지역 쪽, #place-장소id 는 장소 카드. */
(function () {
  "use strict";
  var R = window.RAEON, U = R.ui, esc = U.esc;
  var app = document.getElementById("app");
  var regions = R.regions || [], places = R.places || [];
  var regionById = U.byId(regions), placeById = U.byId(places), chars = U.byId(R.characters);
  var monsterByName = {};
  (R.monsters || []).forEach(function (m) { if (!monsterByName[m.name]) monsterByName[m.name] = m; });
  var KIND = { hub: "중심지", edge: "변경", danger: "위험 지대", special: "특별한 장소", region: "지역", other: "장소" };

  var plate = function (p, big) {
    return '<a class="plate-card' + (big ? "" : " mini") + '" href="#place-' + p.id + '">' +
      '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + " 장소 카드. 위험도 " + esc(p.grade) + ". " + esc(p.desc) + '" loading="lazy" width="1534" height="1024"></a>';
  };
  var regionLink = function (r) { return '<a href="#' + r.id + '">' + esc(r.name) + "</a>"; };

  var mapHtml = function (pressed) {
    var path = (R.journeyPath || []).map(function (p) { return p.x + "," + p.y; }).join(" ");
    return '<div class="map" id="map">' +
      '<img src="assets/img/map/raeon-map.webp" alt="라에온 대륙 지도" width="2528" height="1686">' +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="' + path + '" fill="none" stroke="rgba(155,59,46,0)" stroke-width=".4"/></svg>' +
      regions.filter(function (r) { return r.map; }).map(function (r) {
        return '<button type="button" class="pin" data-pin="' + r.id + '" aria-pressed="' + (pressed === r.id) + '" aria-label="' + esc(r.title) + '" style="left:' + r.map.x + "%;top:" + r.map.y + '%"><span></span></button>';
      }).join("") + "</div>" +
      '<div id="pin-panel" aria-live="polite"></div>';
  };
  var pinPanel = function (r) {
    return '<a class="entry" href="#' + r.id + '" style="margin-top:.8rem"><span class="no">마그히 제' + (regions.indexOf(r) + 1) + "장</span><b>" + esc(r.title) + '</b><span class="sub">' + esc(r.theme) + '</span><span class="meta"><span>' + esc(r.land) + '</span><span class="go">지역 펼치기</span></span></a>';
  };

  var renderList = function () {
    document.title = "지도 · 라에온";
    app.innerHTML =
      '<div class="on-sky hero"><div class="band maghi"><b>산적 마그히와 대해</b><span>세계 각지의 지형</span></div>' +
      '<h1 class="page-title">지도</h1>' +
      '<p class="lead">라에온 대륙의 17개 지역입니다. 지도의 점이나 아래 목록을 누르면 그 지역의 쪽이 열립니다. 붉은 점선은 「용사의 여정」이 지나간 길입니다.</p></div>' +
      '<div class="leaf">' + mapHtml(null) +
      '<p class="margin-note">지하에 있는 지저국 펀다는 지도에 안 나와. 땅 밑까지 그려 달라고? 거긴 내려가 본 놈이 없어서 못 그린다.<cite>마그히의 방주</cite></p>' +
      '<div class="entries">' + regions.map(function (r, i) {
        return '<a class="entry" href="#' + r.id + '"><span class="no">마그히 제' + (i + 1) + "장" + (r.cardGrade ? " · 위험도 " + esc(r.cardGrade) : "") + "</span><b>" + esc(r.name) + '</b><span class="sub">' + esc(r.theme) + '</span><span class="meta"><span>인물 ' + (r.characters || []).length + "명 · 마물 " + (r.monsters || []).length + '종</span><span class="go">펼치기</span></span></a>';
      }).join("") + "</div>" +
      '<section class="section"><h2>장소 카드</h2><p>마그히가 직접 다녀온 장소 ' + places.length + "곳의 기록입니다.</p>" +
        '<div class="plates">' + places.map(function (p) { return plate(p, false); }).join("") + "</div></section>" +
      '<section class="section"><h2>지역 사이의 길</h2><div class="table-wrap"><table class="book"><thead><tr><th>길</th><th>잇는 곳</th><th>내용</th></tr></thead><tbody>' +
        (R.routes || []).map(function (x) { return "<tr><td>" + esc(x.name) + "</td><td>" + esc(x.connects || x.between || "") + "</td><td>" + esc(x.desc || x.text || "") + "</td></tr>"; }).join("") + "</tbody></table></div></section>" +
      '<section class="section"><h2>주인 없는 땅</h2><div class="table-wrap"><table class="book"><thead><tr><th>땅</th><th>위치</th><th>내용</th><th>머무는 사람</th></tr></thead><tbody>' +
        (R.noMansLand || []).map(function (x) { return "<tr><td>" + esc(x.name) + "</td><td>" + esc(x.location || x.where || "") + "</td><td>" + esc(x.desc || x.text || "") + "</td><td>" + esc(x.who || x.dwellers || "") + "</td></tr>"; }).join("") + "</tbody></table></div></section></div>";
    bindPins();
  };

  var bindPins = function () {
    Array.prototype.forEach.call(app.querySelectorAll("[data-pin]"), function (b) {
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(app.querySelectorAll("[data-pin]"), function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        document.getElementById("pin-panel").innerHTML = pinPanel(regionById[b.dataset.pin]);
      });
    });
  };

  var renderRegion = function (r) {
    document.title = r.name + " · 라에온";
    var i = regions.indexOf(r);
    var prev = regions[(i + regions.length - 1) % regions.length], next = regions[(i + 1) % regions.length];
    var own = places.filter(function (p) { return p.region === r.id; });
    var people = (r.characters || []).map(function (id) {
      var c = chars[id]; if (!c) return "";
      return '<li><a href="guild.html#' + id + '"><b>' + esc(c.name) + "</b><em>" + esc(c.epithet || "") + "</em></a></li>";
    }).join("");
    var monsters = (r.monsters || []).map(function (m) {
      var hit = monsterByName[m.name];
      var label = esc(m.name) + " <span class=\"grade-stamp monster\">" + esc(m.grade) + "</span>";
      return "<li>" + (hit && U.isOpen(hit) ? '<a href="bestiary.html#' + hit.id + '"><b>' + label + "</b><em>" + (hit.book === "romance" ? "연애록" : hit.book === "101" ? "총해록 제" + hit.no + "항" : "") + "</em></a>" : '<span class="row"><b>' + label + "</b></span>") + "</li>";
    }).join("");
    var routes = (R.routes || []).filter(function (x) { return (x.links || []).indexOf(r.id) !== -1; });
    var stories = (r.stories || []).map(function (s) {
      var st = (R.stories || []).filter(function (x) { return x.id === s.story; })[0];
      var p = st && st.points.filter(function (x) { return x.id === s.at; })[0];
      return st && p ? '<li><a href="journey.html#' + s.story + "-" + s.at + '"><b>제' + s.story + "권</b><em>" + esc(p.title) + "</em></a></li>" : "";
    }).join("");
    var card = r.card ? '<div class="plate-card" style="margin-top:1rem"><img src="' + esc(r.card) + '" alt="' + esc(r.name) + " 지역 카드. 위험도 " + esc(r.cardGrade) + ". " + esc(r.cardDesc) + '" width="1536" height="1024"></div>' : "";
    app.innerHTML =
      '<div class="on-sky hero"><nav class="crumbs"><a class="back" href="#list">지도로 돌아가기</a><span><a href="#' + prev.id + '">이전: ' + esc(prev.name) + '</a> · <a href="#' + next.id + '">다음: ' + esc(next.name) + "</a></span></nav>" +
      '<div class="band maghi"><b>산적 마그히와 대해</b><span>제' + (i + 1) + "장</span></div>" +
      '<h1 class="page-title">' + esc(r.title) + "</h1>" +
      '<p class="lead">' + esc(r.theme) + "</p>" + card +
      (r.cardDesc ? '<p class="margin-note">' + esc(r.cardDesc) + "<cite>산적 마그히와 대해 발췌</cite></p>" : "") + "</div>" +
      '<div class="leaf"><div class="detail-grid"><div>' +
        '<dl class="form"><dt>다스리는 방식</dt><dd>' + esc(r.rule) + "</dd><dt>풍경</dt><dd>" + esc(r.land) + "</dd><dt>사는 이들</dt><dd>" + esc(r.people) + "</dd>" +
          (r.cardGrade ? "<dt>위험도</dt><dd>" + esc(r.cardGrade) + "</dd>" : "") + "</dl>" +
        '<section class="section"><h2>세 장소</h2><dl class="form"><dt>중심지</dt><dd>' + U.linkTerms(esc(r.hub)) + "</dd><dt>변경</dt><dd>" + U.linkTerms(esc(r.edge)) + '</dd><dt style="color:var(--marker)">✕ 위험 지대</dt><dd>' + U.linkTerms(esc(r.danger)) + "</dd></dl></section>" +
        (own.length ? '<div class="plates">' + own.map(function (p) { return plate(p, false); }).join("") + "</div>" : "") +
        '<section class="section"><h2>마물과 위험</h2><p>' + U.linkTerms(esc(r.monsterNote)) + '</p><ul class="rel" style="margin-top:.6rem">' + monsters + "</ul></section>" +
      "</div><div>" +
        (people ? '<section class="section"><h2>이곳의 사람들</h2><ul class="rel">' + people + "</ul></section>" : "") +
        (stories ? '<section class="section"><h2>이 지역이 나오는 이야기</h2><ul class="rel">' + stories + "</ul></section>" : "") +
        (routes.length ? '<section class="section"><h2>이어진 길</h2><ul class="rel">' + routes.map(function (x) { return '<li><span class="row"><b>' + esc(x.name) + "</b><em>" + esc(x.desc || x.text || "") + "</em></span></li>"; }).join("") + "</ul></section>" : "") +
      "</div></div></div>";
  };

  var renderPlace = function (p) {
    document.title = p.name + " · 라에온";
    var r = regionById[p.region];
    app.innerHTML =
      '<div class="on-sky hero"><nav class="crumbs"><a class="back" href="' + (r ? "#" + r.id : "#list") + '">' + (r ? esc(r.name) + "(으)로 돌아가기" : "지도로 돌아가기") + "</a></nav>" +
      '<div class="band maghi"><b>' + esc(p.source || "산적 마그히와 대해") + "</b><span>" + esc(KIND[p.kind] || "장소") + "</span></div>" +
      '<h1 class="page-title">' + esc(p.name) + "</h1>" +
      '<div class="plate-card" style="margin-top:1rem"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + " 장소 카드" + '" width="1534" height="1024"></div></div>' +
      '<div class="leaf"><dl class="form" style="margin-top:0"><dt>위험도</dt><dd>' + esc(p.grade) + "</dd><dt>지역</dt><dd>" + (r ? regionLink(r) : "어느 나라에도 속하지 않습니다") + "</dd><dt>상세설명</dt><dd>" + U.linkTerms(esc(p.desc)) + "</dd></dl></div>";
  };

  var route = function () {
    var id = location.hash.slice(1);
    if (id.indexOf("place-") === 0 && placeById[id.slice(6)]) { var pl = placeById[id.slice(6)]; U.setSky(pl.region || "night"); renderPlace(pl); }
    else if (regionById[id]) { U.setSky(id); renderRegion(regionById[id]); }
    else { U.setSky(); renderList(); }
    window.scrollTo(0, 0);
  };
  window.addEventListener("hashchange", route);
  route();
})();
