/* 입장 연출: 닫힌 가죽 장정 → 금박 닻 문장이 깨어남 → 표지가 열림 → 대륙 지도로 들어감.
   한 방문(탭)에 한 번만. 아무 데나 누르거나 키를 누르면 바로 끝난다. 움직임 줄이기 설정이면 보여 주지 않는다.
   <head> 의 짧은 스크립트가 html 에 intro-pending 을 붙여 첫 화면이 먼저 비치지 않게 한다. */
(function () {
  "use strict";
  var R = window.RAEON, root = document.documentElement;
  var ANCHOR = '<svg class="intro-anchor" width="84" height="96" viewBox="0 0 84 96" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><circle cx="42" cy="12" r="8"/><path d="M42 20v66M24 34h36M10 62c4 14 16 24 32 24s28-10 32-24M10 62l-6 6M10 62l8 4M74 62l6 6M74 62l-8 4"/></svg>';
  var box = null, timers = [];
  var later = function (ms, fn) { timers.push(setTimeout(fn, ms)); };

  var finish = function (fast) {
    if (!box) return;
    timers.forEach(clearTimeout); timers = [];
    root.classList.remove("intro-pending");
    var b = box; box = null;
    b.classList.add(fast ? "s-skip" : "s-out");
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, fast ? 320 : 640);
    document.removeEventListener("keydown", onKey, true);
    try { sessionStorage.setItem("raeon.intro", "1"); } catch (e) {}
    var main = document.getElementById("app");
    if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
  };
  var onKey = function (e) { if (e.key === "Tab") return; e.preventDefault(); finish(true); };

  var play = function () {
    if (box) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { root.classList.remove("intro-pending"); return; }
    box = document.createElement("div");
    box.className = "intro";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "라에온 입장 장면");
    box.innerHTML =
      '<button type="button" class="intro-skip">건너뛰기</button>' +
      '<div class="intro-scene"><div class="intro-book">' +
        '<div class="intro-inner"><img src="assets/img/map/raeon-map.webp" alt="" width="2528" height="1686"></div>' +
        '<div class="intro-cover">' +
          '<div class="intro-face">' + ANCHOR + '<p class="intro-name">라에온</p><p class="intro-latin">CHRONICLE OF ANCHORS</p></div>' +
          '<div class="intro-back" aria-hidden="true"></div>' +
        "</div>" +
      "</div></div>" +
      '<p class="intro-line">하늘에서 내려온 거대한 닻이<br>대륙 곳곳에 박힌 세계.</p>';
    document.body.appendChild(box);
    box.addEventListener("click", function () { finish(true); });
    document.addEventListener("keydown", onKey, true);
    box.querySelector(".intro-skip").focus({ preventScroll: true });
    // 장면 순서: 0.5초 떠오름, 0.8초 금박, 0.9초 표지, 0.6초 지도로
    requestAnimationFrame(function () { box && box.classList.add("s1"); });
    later(550, function () { box && box.classList.add("s2"); });
    later(1450, function () { box && box.classList.add("s3"); });
    later(2350, function () { if (!box) return; box.classList.add("s4"); root.classList.remove("intro-pending"); });
    later(2950, function () { finish(false); });
  };

  if (root.classList.contains("intro-pending")) play();
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-intro-replay]");
    if (!t) return;
    window.scrollTo(0, 0);
    play();
  });
  R.intro = { play: play };
})();
