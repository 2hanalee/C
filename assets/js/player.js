/* 음악 듣기. music.js 의 목록을 머리띠의 「음악」 단추와 플레이어 판으로 들려준다.
   판을 닫아도 음악은 계속 나온다. 다른 페이지로 옮기면 같은 곡의 같은 위치에서 이어 들으려 하고,
   브라우저가 자동 재생을 막으면 멈춘 채로 기다린다. */
(function () {
  "use strict";
  var LIST = (window.MUSIC || []).filter(function (t) { return t && t.src && t.title; });
  var bar = document.querySelector(".top-in");
  if (!LIST.length || !bar) return;
  var B = window.BLACKOUT;
  var esc = B.esc;
  var KEY = "blackout.music";

  var audio = new Audio();
  audio.preload = "metadata";
  var idx = 0, failed = false;

  var ICON_NOTE = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 12.5V3.5l7-1.5v9"/><circle cx="4.25" cy="12.5" r="1.75"/><circle cx="11.25" cy="11" r="1.75"/></svg>';
  var ICON_PLAY = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M7 4.5v13l11-6.5z" fill="currentColor"/></svg>';
  var ICON_PAUSE = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M6 4.5h3.5v13H6zM12.5 4.5H16v13h-3.5z" fill="currentColor"/></svg>';
  var ICON_PREV = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 3.5h2v11H4zM15 3.5v11L7 9z" fill="currentColor"/></svg>';
  var ICON_NEXT = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M12 3.5h2v11h-2zM3 3.5v11L11 9z" fill="currentColor"/></svg>';

  /* ── 머리띠 단추 ── */
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "music-btn";
  btn.setAttribute("aria-haspopup", "dialog");
  btn.innerHTML = ICON_NOTE + '<span class="mb-label">음악</span><span class="mb-eq" aria-hidden="true"><i></i><i></i><i></i></span>';
  bar.appendChild(btn);

  /* ── 플레이어 판 ── */
  var sheet = document.createElement("dialog");
  sheet.className = "music-sheet";
  sheet.setAttribute("aria-labelledby", "ms-title");
  sheet.innerHTML =
    '<div class="ms-in">' +
      '<p class="ms-kicker mono">음악</p>' +
      '<img class="ms-cover" alt="" hidden>' +
      '<h2 id="ms-title"></h2>' +
      '<p class="ms-by"></p>' +
      '<p class="ms-note"></p>' +
      '<div class="ms-seek"><input type="range" id="ms-pos" min="0" max="1000" step="1" value="0" aria-label="재생 위치">' +
        '<span class="ms-time mono"><span id="ms-cur">0:00</span><span id="ms-len">0:00</span></span></div>' +
      '<div class="ms-ctrl">' +
        '<button type="button" class="ms-prev" aria-label="이전 곡">' + ICON_PREV + "</button>" +
        '<button type="button" class="ms-play" aria-label="재생">' + ICON_PLAY + "</button>" +
        '<button type="button" class="ms-next" aria-label="다음 곡">' + ICON_NEXT + "</button>" +
      "</div>" +
      '<p class="ms-status" aria-live="polite"></p>' +
      '<h3 class="ms-list-head mono">곡 목록 ' + LIST.length + "곡</h3>" +
      '<ol class="ms-list">' + LIST.map(function (t, i) {
        return '<li><button type="button" data-track="' + i + '"><span class="ms-n mono">' + (i + 1 < 10 ? "0" : "") + (i + 1) + "</span>" +
          (t.cover ? '<img class="ms-thumb" src="' + esc(t.cover) + '" alt="" loading="lazy">' : "") +
          "<span><b>" + esc(t.title) + "</b>" + (t.by ? "<span>" + esc(t.by) + "</span>" : "") + "</span></button></li>";
      }).join("") + "</ol>" +
      '<button type="button" class="btn ms-close">닫기</button>' +
    "</div>";
  document.body.appendChild(sheet);
  var $ = function (sel) { return sheet.querySelector(sel); };
  var pos = $("#ms-pos"), playBtn = $(".ms-play"), status = $(".ms-status");
  $(".ms-cover").addEventListener("error", function () { this.hidden = true; });

  var clock = function (s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  };
  var playing = function () { return !audio.paused && !audio.ended; };

  var paint = function () {
    var t = LIST[idx];
    $("#ms-title").textContent = t.title;
    $(".ms-by").textContent = t.by || "";
    $(".ms-note").textContent = t.note || "";
    var cover = $(".ms-cover");
    if (t.cover) { if (cover.getAttribute("src") !== t.cover) cover.src = t.cover; cover.hidden = false; } else { cover.hidden = true; cover.removeAttribute("src"); }
    var on = playing();
    playBtn.innerHTML = on ? ICON_PAUSE : ICON_PLAY;
    playBtn.setAttribute("aria-label", on ? "일시정지" : "재생");
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-label", on ? "음악, " + t.title + " 재생 중" : "음악");
    Array.prototype.forEach.call(sheet.querySelectorAll("[data-track]"), function (b) {
      if (+b.dataset.track === idx) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
    var single = LIST.length < 2;
    $(".ms-prev").disabled = single; $(".ms-next").disabled = single;
  };
  var paintTime = function () {
    var d = audio.duration;
    $("#ms-cur").textContent = clock(audio.currentTime);
    $("#ms-len").textContent = clock(d);
    if (!seeking && isFinite(d) && d > 0) pos.value = Math.round(audio.currentTime / d * 1000);
  };

  var load = function (i, at) {
    idx = (i + LIST.length) % LIST.length;
    failed = false;
    status.textContent = "";
    audio.src = LIST[idx].src;
    if (at) {
      var jump = function () { try { audio.currentTime = at; } catch (e) {} audio.removeEventListener("loadedmetadata", jump); };
      audio.addEventListener("loadedmetadata", jump);
    }
    pos.value = 0;
    paint(); paintTime();
    if ("mediaSession" in navigator && window.MediaMetadata) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: LIST[idx].title, artist: LIST[idx].by || "", album: "마법소녀 아카데미: 블랙아웃",
        artwork: LIST[idx].cover ? [{ src: LIST[idx].cover }] : [] });
    }
  };
  var play = function () {
    if (failed) load(idx);
    var p = audio.play();
    if (p && p.catch) p.catch(function () { paint(); });
  };
  var toggle = function () { if (playing()) audio.pause(); else play(); };
  // 이전, 다음 곡은 누르면 바로 들려준다
  var step = function (d) { load(idx + d); play(); };

  btn.addEventListener("click", function () {
    paint(); paintTime();
    if (typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open", "");
    playBtn.focus();
  });
  playBtn.addEventListener("click", toggle);
  $(".ms-prev").addEventListener("click", function () { step(-1); });
  $(".ms-next").addEventListener("click", function () { step(1); });
  $(".ms-close").addEventListener("click", function () { sheet.close(); });
  sheet.addEventListener("click", function (e) {
    if (e.target === sheet) { sheet.close(); return; }
    var t = e.target.closest ? e.target.closest("[data-track]") : null;
    if (!t) return;
    if (+t.dataset.track === idx && !failed) { toggle(); return; }
    load(+t.dataset.track); play();
  });
  sheet.addEventListener("close", function () { btn.focus({ preventScroll: true }); });

  // 재생 위치: 끄는 동안에는 시간만 바꾸고, 놓으면 그 자리로 옮긴다
  var seeking = false;
  pos.addEventListener("input", function () {
    seeking = true;
    var d = audio.duration;
    if (isFinite(d)) $("#ms-cur").textContent = clock(pos.value / 1000 * d);
  });
  pos.addEventListener("change", function () {
    var d = audio.duration;
    if (isFinite(d)) audio.currentTime = pos.value / 1000 * d;
    seeking = false;
  });

  ["play", "pause"].forEach(function (ev) { audio.addEventListener(ev, paint); });
  audio.addEventListener("timeupdate", paintTime);
  audio.addEventListener("loadedmetadata", paintTime);
  audio.addEventListener("ended", function () {
    if (idx < LIST.length - 1) { load(idx + 1); play(); } else { paint(); }
  });
  audio.addEventListener("error", function () {
    if (!audio.getAttribute("src")) return;
    failed = true;
    status.textContent = "이 곡을 불러오지 못했습니다. 잠시 뒤 다시 눌러 주세요.";
    paint();
  });

  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.setActionHandler("play", play);
      navigator.mediaSession.setActionHandler("pause", function () { audio.pause(); });
      navigator.mediaSession.setActionHandler("previoustrack", function () { step(-1); });
      navigator.mediaSession.setActionHandler("nexttrack", function () { step(1); });
    } catch (e) {}
  }

  /* ── 페이지를 옮겨도 이어 듣기 ── */
  window.addEventListener("pagehide", function () {
    B.session.set(KEY, JSON.stringify({ i: idx, at: audio.currentTime || 0, on: playing() }));
  });
  var saved = null;
  try { saved = JSON.parse(B.session.get(KEY) || "null"); } catch (e) {}
  if (saved && saved.i >= 0 && saved.i < LIST.length) {
    load(saved.i, saved.at);
    if (saved.on) play();
  } else {
    load(0);
  }
})();
