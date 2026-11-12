/* 웹툰 회차 목록과 뷰어. #ep-번호 로 회차를 연다. */
(function () {
  "use strict";
  var W = window.WEBTOON;
  var app = document.getElementById("app");
  if (!app || !W) return;
  var esc = window.BLACKOUT.esc;
  var ARROW = '<svg class="go-ico" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 7h9M8 3.5 11.5 7 8 10.5"/></svg>';

  var eps = W.episodes.slice().sort(function (a, b) { return a.no - b.no; });
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var sampleNote = W.sample
    ? '<p class="sample mono">지금 보이는 것은 견본 화면입니다. 실제 회차를 등록하면 이 안내는 사라집니다.</p>'
    : "";
  // 그림이 없으면 자리 표시 판을 그린다
  var plate = function (src, label, alt) {
    if (src) return '<div class="plate"><img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy"></div>';
    return '<div class="plate" aria-hidden="true" style="--fit:14"><b>' + esc(label) + "</b></div>";
  };

  var renderList = function () {
    document.title = "웹툰 · 블랙아웃";
    if (!eps.length) {
      app.innerHTML = '<header class="page-head" data-ghost="SERIES"><p class="kicker">블랙아웃 연재</p><h1 class="lit">웹툰</h1><p>연재를 준비하고 있습니다.</p></header>';
      return;
    }
    var first = eps[0];
    app.innerHTML =
      '<header class="page-head" data-ghost="SERIES"><p class="kicker">블랙아웃 연재</p><h1 class="lit">웹툰</h1><p>하란의 이야기를 세로 만화로 연재합니다. 회차를 누르면 뷰어가 열립니다.</p></header>' + sampleNote +
      '<div class="series">' +
        plate(W.cover, "표지", W.title + " 표지") +
        '<div class="series-info"><h2>' + esc(W.title) + '</h2><p class="mono">' + esc(W.genre) + ", " + esc(W.schedule) + "</p>" +
          "<p>" + esc(W.intro) + '</p><a class="btn solid go" href="#ep-' + first.no + '">첫 화 보기' + ARROW + "</a></div>" +
      "</div>" +
      '<h2 class="sub">회차</h2>' +
      // 최신 회차가 위로 온다
      '<ol class="episodes">' + eps.slice().reverse().map(function (e) {
        return '<li><a href="#ep-' + e.no + '">' + plate(e.thumb, pad(e.no), e.title) +
          '<span><span class="mono">EP.' + pad(e.no) + "</span><b>" + esc(e.title) + "</b><span>" + esc(e.date) + "</span></span></a></li>";
      }).join("") + "</ol>";
  };

  var renderEpisode = function (e) {
    document.title = "EP." + pad(e.no) + " " + e.title + " · 블랙아웃";
    var i = eps.indexOf(e);
    var prev = eps[i - 1];
    var next = eps[i + 1];
    var step = function (ep, label, solid) {
      return ep
        ? '<a class="btn' + (solid ? " solid" : "") + '" href="#ep-' + ep.no + '">' + label + "</a>"
        : '<button class="btn" type="button" disabled>' + label + "</button>";
    };
    app.innerHTML =
      '<nav class="crumbs" aria-label="회차 이동"><a class="back" href="#list"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4"/></svg>회차 목록으로</a>' +
        '<span class="mono">' + esc(W.title) + "</span></nav>" +
      '<article class="viewer">' +
        '<header><span class="mono">EP.' + pad(e.no) + "</span><h1>" + esc(e.title) + "</h1></header>" + sampleNote +
        '<div class="cuts">' + e.cuts.map(function (src, n) {
          return src
            ? '<img src="' + esc(src) + '" alt="' + esc(e.title) + " " + (n + 1) + '번째 컷" loading="lazy">'
            : '<div class="cut-blank" aria-hidden="true"><span class="mono">컷 ' + (n + 1) + ", 세로로 이어지는 그림이 들어갈 자리</span></div>";
        }).join("") + "</div>" +
        '<nav class="steps" aria-label="회차 넘기기">' + step(prev, "이전 화") +
          '<a class="btn" href="#list">목록</a>' + step(next, "다음 화", true) + "</nav>" +
      "</article>";
  };

  var route = function () {
    var m = /^#ep-(\d+)$/.exec(location.hash);
    var e = m && eps.filter(function (x) { return x.no === Number(m[1]); })[0];
    if (e) renderEpisode(e); else renderList();
    window.scrollTo(0, 0);
  };
  window.addEventListener("hashchange", route);
  route();
})();
