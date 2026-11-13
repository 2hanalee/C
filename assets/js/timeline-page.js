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
  var ARROW = '<svg class="go-ico" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 7h9M8 3.5 11.5 7 8 10.5"/></svg>';
  var eventHtml = function (ev, key) {
    var when = '<span class="when">' + esc(ev.when) + (ev.day ? "<small>" + esc(ev.day) + "</small>" : "") + "</span>";
    if (ev.level > 0) {
      // 사건 전체가 가려진 경우: 날짜만 보인다
      return '<li class="ev sealed">' + when + "<div>" + B.rec({
        lv: ev.level, key: key, topic: ev.when + "의 사건", text: ev.title + ". " + ev.text,
        about: "이 기록은 " + ev.when + "에 있었던 사건 전체를 적은 기밀입니다.",
      }) + "</div></li>";
    }
    var tally = { 1: 0, 2: 0 };
    var many = { 1: 0, 2: 0 };
    (ev.more || []).forEach(function (m) { many[m.level]++; });
    var more = (ev.more || []).map(function (m, i) {
      tally[m.level]++;
      return B.rec({
        lv: m.level, key: key + ":m" + i, text: m.text,
        topic: "숨은 사정" + (many[m.level] > 1 ? " " + tally[m.level] : ""),
        about: "이 기록은 「" + ev.title + "」 사건의 숨은 사정을 적은 기밀입니다.",
      });
    }).join("");
    var links = [];
    if (ev.place && placeById[ev.place]) links.push('<a href="#' + ev.place + '">지도에서 ' + esc(placeById[ev.place].name) + " 보기" + ARROW + "</a>");
    if (ev.topic && docById[ev.topic]) links.push('<a href="world.html#' + ev.topic + '">문서 「' + esc(docById[ev.topic].title) + "」 읽기" + ARROW + "</a>");
    return '<li class="ev">' + when + "<div><h3>" + esc(ev.title) + "</h3><p>" + B.mark(esc(ev.text)) + "</p>" +
      (more ? '<div class="more-bars">' + more + "</div>" : "") +
      B.people(ev.people) +
      (links.length ? '<p class="ev-links">' + links.join("") + "</p>" : "") +
      "</div></li>";
  };

  var renderTimeline = function () {
    document.title = "연표 · 블랙아웃";
    app.innerHTML =
      '<header class="page-head" data-ghost="CHRONICLE"><p class="kicker">방위청 사건 일지</p><h1 class="lit">연표</h1><p>약 300년 전의 첫 균열부터 지금까지 일어난 일을 적었습니다. 가려진 사건은 날짜만 보이고, 누르면 내용이 열립니다.</p></header>' +
      tabs("timeline") +
      // 좁은 화면에서 위에 붙는 시대 막대. 넓은 화면은 왼쪽 목차를 쓰고 이 막대는 숨긴다
      '<nav class="era-bar" aria-label="시대 바로가기"><ol>' + ERAS.map(function (era) {
        return '<li><button type="button" data-era="' + era.id + '">' + esc(era.title) + "<span>" + era.events.length + "건</span></button></li>";
      }).join("") + "</ol></nav>" +
      ERAS.map(function (era) {
        return '<section class="era" id="era-' + era.id + '"><h2>' + esc(era.title) + "</h2>" +
          '<ol class="events">' + era.events.map(function (ev, i) { return eventHtml(ev, "t:" + era.id + ":" + i); }).join("") + "</ol></section>";
      }).join("");
  };

  /* ───── 지도 ───── */
  // 인천 약도. 실제 지형을 단순하게 줄였다. 서쪽은 서해, 남쪽은 바다를 메운 송도다. 좌표계는 800 x 560.
  var COAST = "430,0 400,58 352,94 322,120 306,160 330,190 318,226 300,246 312,274 338,302 362,330 392,350 432,360 472,372 522,402 562,432 602,462 640,502 662,560";
  var SONGDO = "300,396 470,392 502,430 506,522 334,532 290,470";
  var YEONGJONG = "40,118 196,98 238,168 220,258 122,292 30,242";
  var mapSvg = function () {
    return '<svg viewBox="0 0 800 560" role="img" aria-label="인천 약도. 서쪽은 서해, 내항 일대가 회색 구역이고 남쪽 매립지에 송도가 있다." preserveAspectRatio="xMidYMid slice">' +
      "<defs>" +
        '<pattern id="sea" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 5 H10" class="m-sea-line"/></pattern>' +
        '<pattern id="spore" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" class="m-spore"/><circle cx="6.5" cy="6.5" r="0.8" class="m-spore"/></pattern>' +
        '<pattern id="scrap" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0 V8" class="m-scrap"/></pattern>' +
      "</defs>" +
      // 바다를 깔고 그 위에 땅을 얹는다
      '<rect width="800" height="560" class="m-sea"/><rect width="800" height="560" fill="url(#sea)"/>' +
      '<polygon points="' + COAST + ' 800,560 800,0" class="m-land"/>' +
      '<polyline points="' + COAST + '" class="m-coast"/>' +
      '<polygon points="' + SONGDO + '" class="m-land"/><polygon points="' + SONGDO + '" class="m-coast"/>' +
      '<polygon points="' + YEONGJONG + '" class="m-land"/><polygon points="' + YEONGJONG + '" class="m-coast"/>' +
      '<ellipse cx="270" cy="262" rx="22" ry="13" class="m-land"/><ellipse cx="270" cy="262" rx="22" ry="13" class="m-coast"/>' +
      // 부두: 북항과 내항
      '<path d="M306 132 H286 M308 146 H284 M312 266 H290 M314 280 H292 M320 294 H300" class="m-pier"/>' +
      // 큰길과 다리: 송도와 구도심, 부평을 잇는다
      '<path d="M360 330 L420 300 L520 280 L620 268 L800 262 M420 300 L430 200 L470 60 M462 392 L480 368 M440 393 L452 366 M520 280 L560 420" class="m-road"/>' +
      // 회색 구역: 내항 일대
      '<clipPath id="zone"><ellipse cx="338" cy="250" rx="70" ry="54"/></clipPath>' +
      '<image class="m-myc" href="assets/img/texture/mycelium-pattern.svg" x="248" y="176" width="180" height="150" clip-path="url(#zone)"/>' +
      '<ellipse cx="338" cy="250" rx="70" ry="54" fill="url(#spore)" opacity="0.55"/>' +
      '<ellipse cx="338" cy="250" rx="70" ry="54" class="m-zone"/>' +
      // 고철동(만석동, 화수동 공장지대)
      '<polygon points="344,190 398,184 404,222 350,230" fill="url(#scrap)"/><polygon points="344,190 398,184 404,222 350,230" class="m-block"/>' +
      // 구도심
      '<rect x="372" y="276" width="62" height="40" class="m-block"/><path d="M393 276 V316 M414 276 V316 M372 296 H434" class="m-grid"/>' +
      // 부평
      '<rect x="584" y="246" width="64" height="44" class="m-block"/><path d="M605 246 V290 M626 246 V290 M584 268 H648" class="m-grid"/>' +
      // 송도: 기업 타워 지구와 남단 캠퍼스
      '<path d="M392 452 V430 M402 452 V420 M412 452 V426 M422 452 V414 M432 452 V428" class="m-grid"/>' +
      '<rect x="360" y="492" width="64" height="26" class="m-block"/>' +
      // 글자
      '<text x="96" y="420" class="m-label big">서해</text>' +
      '<text x="640" y="170" class="m-label big">인천</text>' +
      '<text x="100" y="206" class="m-label">영종도</text>' +
      '<text x="236" y="292" class="m-label">월미도</text>' +
      '<text x="382" y="338" class="m-label">구도심</text>' +
      '<text x="596" y="310" class="m-label">부평</text>' +
      '<text x="446" y="478" class="m-label">송도</text>' +
      '<text x="608" y="40" class="m-label">서울, 강원 방면</text>' +
      '<path d="M760 34 l18 0 M772 28 l6 6 l-6 6" class="m-arrow"/>' +
      // 방위
      '<path d="M40 70 V30 M40 30 l-6 10 M40 30 l6 10" class="m-arrow"/><text x="34" y="88" class="m-label">N</text>' +
      "</svg>";
  };

  var placePanel = function (p) {
    var topic = p.topic && docById[p.topic] ? '<a class="more" href="world.html#' + p.topic + '">문서 「' + esc(docById[p.topic].title) + "」 읽기</a>" : "";
    var list = B.records(p.internal, p.secret, "p:" + p.id, p.name + "의");
    return (p.image ? '<img class="scene" src="' + esc(p.image) + '" alt="' + esc(p.name) + '">' : "") +
      '<span class="mono">' + esc(p.note.replace(/\s*·\s*/g, ", ")) + "</span><h2>" + esc(p.name) + "</h2><p>" + esc(p.text) + "</p>" +
      B.people(p.people) + topic + (list.length ? '<div class="rec-grid">' + list.map(B.rec).join("") + "</div>" : "");
  };

  var selected = PLACES[0] ? PLACES[0].id : null;
  var selectPlace = function (id) {
    if (!placeById[id]) return;
    selected = id;
    Array.prototype.forEach.call(app.querySelectorAll("[data-place]"), function (el) {
      el.setAttribute("aria-pressed", String(el.dataset.place === id));
    });
    var panel = document.getElementById("place");
    if (panel) panel.innerHTML = placePanel(placeById[id]);
  };

  var renderMap = function (id) {
    document.title = "지도 · 블랙아웃";
    if (id && placeById[id]) selected = id;
    app.innerHTML =
      '<header class="page-head" data-ghost="INCHEON"><p class="kicker">인천 약도</p><h1 class="lit">지도</h1><p>이야기의 무대인 인천입니다. 지도의 번호나 장소 목록을 누르면 그곳의 기록이 열립니다.</p></header>' +
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

  /* ───── 지금 보고 있는 시대 ─────
     머리띠(와 시대 막대) 바로 아래에 가는 선을 두고, 그 선에 걸린 시대를 표시한다 */
  var eraIo = null;
  var markEra = function (id) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-era]"), function (b) {
      if (b.dataset.era === id) b.setAttribute("aria-current", "location"); else b.removeAttribute("aria-current");
    });
  };
  var lineY = function () {
    var top = document.querySelector(".top");
    var bar = app.querySelector(".era-bar");
    var y = top ? top.getBoundingClientRect().bottom : 0;
    if (bar && bar.offsetParent) y += bar.offsetHeight;
    return Math.round(y + 24);
  };
  var watchEras = function () {
    if (eraIo) { eraIo.disconnect(); eraIo = null; }
    var top = document.querySelector(".top");
    if (top) document.documentElement.style.setProperty("--top-h", top.offsetHeight + "px");
    var secs = Array.prototype.slice.call(app.querySelectorAll(".era"));
    if (!secs.length) return;
    markEra(ERAS[0].id);
    if (!("IntersectionObserver" in window)) return;
    var y = lineY();
    eraIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) markEra(e.target.id.replace(/^era-/, "")); });
    }, { rootMargin: -y + "px 0px " + -(window.innerHeight - y - 1) + "px 0px" });
    secs.forEach(function (s) { eraIo.observe(s); });
  };
  // 맨 아래까지 내려 마지막 시대의 머리가 선에 닿지 못할 때와, 첫 시대보다 위에 있을 때
  var edgeEra = function () {
    var secs = app.querySelectorAll(".era");
    if (!secs.length) return;
    var doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) markEra(ERAS[ERAS.length - 1].id);
    else if (secs[0].getBoundingClientRect().top > lineY()) markEra(ERAS[0].id);
  };
  window.addEventListener("scroll", edgeEra, { passive: true });
  var resizeT = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { if (app.querySelector(".era")) watchEras(); }, 150);
  });
  var goEra = function (id) {
    var el = document.getElementById("era-" + id);
    if (!el) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
  app.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest(".era-bar [data-era]") : null;
    if (t) goEra(t.dataset.era);
  });

  var showing = null;
  var route = function () {
    var id = location.hash.replace(/^#/, "");
    var isMap = id === "map" || !!placeById[id];
    if (isMap) { renderMap(id); if (eraIo) { eraIo.disconnect(); eraIo = null; } } else { renderTimeline(); watchEras(); }
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
      if (t) goEra(t.dataset.era);
    });
  }
  window.addEventListener("hashchange", route);
  route();
})();
