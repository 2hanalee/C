/* 연표와 지도. #timeline 은 연표, #map 은 지도, #장소id 는 그 장소를 고른 지도. */
(function () {
  "use strict";
  var ERAS = window.ERAS || [];
  var PLACES = window.PLACES || [];
  var DOCS = window.WORLD || [];
  var app = document.getElementById("app");
  var rail = document.getElementById("rail-eras");
  if (!app) return;
  var B = window.BLACKOUT;
  var esc = B.esc;

  var placeById = {};
  PLACES.forEach(function (p) { placeById[p.id] = p; });
  var docById = {};
  DOCS.forEach(function (d) { docById[d.id] = d; });

  var tabs = function (view) {
    return '<div class="seg tabs" role="group" aria-label="보기">' +
      '<a href="#timeline"' + (view === "timeline" ? ' aria-current="true"' : "") + ">연표</a>" +
      '<a href="#map"' + (view === "map" ? ' aria-current="true"' : "") + ">지도</a></div>";
  };

  /* ───── 연표 ───── */
  var eventHtml = function (ev) {
    var when = '<span class="when">' + esc(ev.when) + (ev.day ? "<small>" + esc(ev.day) + "</small>" : "") + "</span>";
    if (ev.level > 0) {
      // 사건 전체가 가려진 경우: 날짜만 보인다
      return '<li class="ev sealed">' + when + "<div>" + B.bar(ev.title + ". " + ev.text, ev.level, ev.when) + "</div></li>";
    }
    var more = (ev.more || []).map(function (m) { return B.bar(m.text, m.level, ev.title); }).join("");
    var links = [];
    if (ev.place && placeById[ev.place]) links.push('<a href="#' + ev.place + '">지도: ' + esc(placeById[ev.place].name) + "</a>");
    if (ev.topic && docById[ev.topic]) links.push('<a href="world.html#' + ev.topic + '">문서: ' + esc(docById[ev.topic].title) + "</a>");
    return '<li class="ev">' + when + "<div><h3>" + esc(ev.title) + "</h3><p>" + esc(ev.text) + "</p>" +
      (more ? '<div class="more-bars">' + more + "</div>" : "") +
      B.people(ev.people) +
      (links.length ? '<p class="ev-links">' + links.join("") + "</p>" : "") +
      "</div></li>";
  };

  var renderTimeline = function () {
    document.title = "연표 · 블랙아웃";
    app.innerHTML =
      '<header class="page-head" data-ghost="CHRONICLE"><h1>연표</h1><p>첫 균열부터 지금까지. 가려진 사건은 날짜만 보입니다.</p></header>' +
      tabs("timeline") +
      ERAS.map(function (era) {
        return '<section class="era" id="era-' + era.id + '"><h2>' + esc(era.title) + "</h2>" +
          '<ol class="events">' + era.events.map(eventHtml).join("") + "</ol></section>";
      }).join("");
    B.refresh();
  };

  /* ───── 지도 ───── */
  // 하란 약도. 서쪽이 바다다. 좌표계는 800 x 560.
  var COAST = "260,0 250,60 225,110 240,170 290,215 300,250 345,262 350,300 300,312 296,352 335,372 330,410 270,440 255,500 270,560";
  var mapSvg = function () {
    return '<svg viewBox="0 0 800 560" role="img" aria-label="하란 약도. 서쪽은 바다, 항구 주변이 회색 구역이다." preserveAspectRatio="xMidYMid slice">' +
      "<defs>" +
        '<pattern id="sea" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 5 H10" class="m-sea-line"/></pattern>' +
        '<pattern id="spore" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" class="m-spore"/><circle cx="6.5" cy="6.5" r="0.8" class="m-spore"/></pattern>' +
        '<pattern id="scrap" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0 V8" class="m-scrap"/></pattern>' +
      "</defs>" +
      '<rect width="800" height="560" class="m-land"/>' +
      '<polygon points="0,0 ' + COAST + ' 0,560" class="m-sea"/>' +
      '<polygon points="0,0 ' + COAST + ' 0,560" fill="url(#sea)"/>' +
      '<polyline points="' + COAST + '" class="m-coast"/>' +
      // 부두
      '<path d="M300 268 H330 M300 282 H336 M300 296 H330 M296 366 H322 M296 384 H318" class="m-pier"/>' +
      // 큰길
      '<path d="M350 300 L470 318 L560 330 L800 352 M470 318 L455 185 L430 0 M560 330 L520 440 L500 560 M560 330 L650 170 L760 70" class="m-road"/>' +
      // 회색 구역
      '<clipPath id="zone"><ellipse cx="372" cy="292" rx="112" ry="92"/></clipPath>' +
      '<image class="m-myc" href="assets/img/texture/mycelium-pattern.svg" x="232" y="152" width="280" height="280" clip-path="url(#zone)"/>' +
      '<ellipse cx="372" cy="292" rx="112" ry="92" fill="url(#spore)" opacity="0.55"/>' +
      '<ellipse cx="372" cy="292" rx="112" ry="92" class="m-zone"/>' +
      // 고철동 폐공장 지대
      '<polygon points="430,140 520,128 530,208 440,220" fill="url(#scrap)"/>' +
      '<polygon points="430,140 520,128 530,208 440,220" class="m-block"/>' +
      // 제3구
      '<rect x="520" y="296" width="96" height="70" class="m-block"/>' +
      '<path d="M552 296 V366 M584 296 V366 M520 320 H616 M520 343 H616" class="m-grid"/>' +
      // 아카데미가 있는 언덕
      '<ellipse cx="656" cy="178" rx="70" ry="46" class="m-contour"/><ellipse cx="656" cy="178" rx="46" ry="29" class="m-contour"/><ellipse cx="656" cy="178" rx="22" ry="13" class="m-contour"/>' +
      // 글자
      '<text x="70" y="300" class="m-label big">서해</text>' +
      '<text x="640" y="480" class="m-label big">하란</text>' +
      '<text x="568" y="388" class="m-label">제3구</text>' +
      '<text x="612" y="54" class="m-label">안개고개 방면</text>' +
      // 방위
      '<path d="M40 70 V30 M40 30 l-6 10 M40 30 l6 10" class="m-arrow"/><text x="34" y="88" class="m-label">N</text>' +
      "</svg>";
  };

  var placePanel = function (p) {
    var topic = p.topic && docById[p.topic] ? '<a class="more" href="world.html#' + p.topic + '">문서: ' + esc(docById[p.topic].title) + "</a>" : "";
    var hidden = "";
    if (p.internal && p.internal.length) hidden += B.notes(p.internal, 1, "내부용");
    if (p.secret && p.secret.length) hidden += B.notes(p.secret, 2, "기밀");
    return (p.image ? '<img class="scene" src="' + esc(p.image) + '" alt="' + esc(p.name) + '">' : "") +
      '<span class="mono">' + esc(p.note) + "</span><h2>" + esc(p.name) + "</h2><p>" + esc(p.text) + "</p>" +
      B.people(p.people) + topic + (hidden ? '<div class="notes">' + hidden + "</div>" : "");
  };

  var selected = PLACES[0] ? PLACES[0].id : null;
  var selectPlace = function (id) {
    if (!placeById[id]) return;
    selected = id;
    Array.prototype.forEach.call(app.querySelectorAll("[data-place]"), function (el) {
      el.setAttribute("aria-pressed", String(el.dataset.place === id));
    });
    var panel = document.getElementById("place");
    if (panel) { panel.innerHTML = placePanel(placeById[id]); B.refresh(); }
  };

  var renderMap = function (id) {
    document.title = "지도 · 블랙아웃";
    if (id && placeById[id]) selected = id;
    app.innerHTML =
      '<header class="page-head" data-ghost="HARAN"><h1>지도</h1><p>무대 도시 하란. 번호를 누르면 그곳의 기록이 열립니다.</p></header>' +
      tabs("map") +
      '<div class="mapwrap">' +
        '<div class="map">' + mapSvg() +
          PLACES.map(function (p, n) {
            return '<button type="button" class="pin' + (p.off ? " off" : "") + '" data-place="' + p.id + '" aria-pressed="false" aria-label="' + esc(p.name) +
              '" style="left:' + p.x + "%;top:" + p.y + '%">' + (n + 1) + "</button>";
          }).join("") +
        "</div>" +
        '<div class="place" id="place" aria-live="polite"></div>' +
        '<ol class="place-list">' + PLACES.map(function (p, n) {
            return '<li><button type="button" data-place="' + p.id + '" aria-pressed="false"><i>' + (n + 1) + "</i><span><b>" +
              esc(p.name) + "</b><span>" + esc(p.note) + "</span></span></button></li>";
          }).join("") + "</ol>" +
      "</div>";
    selectPlace(selected);
  };

  app.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-place]") : null;
    if (!t) return;
    selectPlace(t.dataset.place);
    // 주소에 고른 장소를 남긴다. 막혀 있는 환경에서는 건너뛴다
    try { history.replaceState(null, "", "#" + t.dataset.place); } catch (err) {}
  });

  var showing = null;
  var route = function () {
    var id = location.hash.replace(/^#/, "");
    var isMap = id === "map" || !!placeById[id];
    if (isMap) renderMap(id); else renderTimeline();
    if (rail) rail.hidden = isMap;
    var now = isMap ? "map" : "timeline";
    if (showing !== now || !isMap) window.scrollTo(0, 0);
    showing = now;
    // 연표의 시대 이름으로 바로 가는 주소 (#era-...)
    if (!isMap && id.indexOf("era-") === 0) {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView();
    }
  };

  if (rail) {
    rail.innerHTML = ERAS.map(function (era) {
      return '<li><button type="button" data-era="' + era.id + '">' + esc(era.title) + "<span>" + era.events.length + "</span></button></li>";
    }).join("");
    rail.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-era]") : null;
      var el = t && document.getElementById("era-" + t.dataset.era);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  window.addEventListener("hashchange", route);
  route();
})();
