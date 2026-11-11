(function () {
  "use strict";
  var root = document.documentElement;
  var mem = function (area) {
    return {
      get: function (k) { try { return window[area].getItem(k); } catch (e) { return null; } },
      set: function (k, v) { try { window[area].setItem(k, v); } catch (e) {} },
    };
  };
  var local = mem("localStorage");
  var session = mem("sessionStorage");

  /* ── 게이트: 인물 대사 → 가림 → 정전 → 제목 ── */
  var gate = document.getElementById("gate");
  if (gate) {
    var timers = [];
    var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
    var clear = function () { timers.forEach(clearTimeout); timers = []; };
    var setPhase = function (p) { gate.dataset.phase = p; };
    var close = function () {
      clear();
      gate.hidden = true;
      root.classList.remove("gate-open");
      session.set("blackout.gate", "seen");
    };

    // 방문 중 한 번만 보여 준다. 주소 끝에 #gate 를 붙이면 다시 본다.
    if (session.get("blackout.gate") === "seen" && location.hash !== "#gate") {
      gate.hidden = true;
    } else {
      root.classList.add("gate-open");

      // 대사 고르기: 직전에 본 대사는 피한다
      var pool = window.QUOTES || [];
      var quoteEl = document.getElementById("gate-quote");
      var byEl = document.getElementById("gate-by");
      var lineEls = [];
      if (pool.length && quoteEl && byEl) {
        var last = parseInt(local.get("blackout.quote"), 10);
        var idx = Math.floor(Math.random() * pool.length);
        if (pool.length > 1 && idx === last) idx = (idx + 1) % pool.length;
        local.set("blackout.quote", String(idx));
        var pick = pool[idx];
        quoteEl.textContent = "";
        pick.lines.forEach(function (text) {
          var gl = document.createElement("span");
          gl.className = "gl";
          var q = document.createElement("span");
          q.className = "q";
          q.textContent = text;
          gl.appendChild(q);
          quoteEl.appendChild(gl);
          lineEls.push(gl);
        });
        byEl.textContent = pick.name + (pick.alias ? " · " + pick.alias : "");
        byEl.classList.remove("in");
      }

      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setPhase("title");
      } else {
        var t = 150;
        lineEls.forEach(function (el) {
          later(function () { el.classList.add("in"); }, t);
          t += 1500;
        });
        later(function () { byEl.classList.add("in"); }, t - 500);
        later(function () { setPhase("struck"); }, t + 1900);
        later(function () { setPhase("dark"); }, t + 3100);
        later(function () { setPhase("title"); }, t + 4100);
      }
      document.getElementById("gate-skip").addEventListener("click", function () { clear(); setPhase("title"); });
      document.getElementById("gate-enter").addEventListener("click", close);
      document.addEventListener("keydown", function (e) {
        if (!gate.hidden && e.key === "Escape") close();
      });
    }
  }

  /* ── 열람 등급: 0 공개, 1 내부용, 2 기밀 ──
     막대는 화면이 바뀔 때 새로 그려지므로 그때마다 refresh() 로 현재 등급을 다시 적용한다. */
  var level = 0;
  var levelBtns = Array.prototype.slice.call(document.querySelectorAll("#clearance button"));
  var allBars = function () { return Array.prototype.slice.call(document.querySelectorAll(".bar")); };
  var applyLevel = function (n) {
    level = n;
    levelBtns.forEach(function (btn) {
      btn.setAttribute("aria-pressed", Number(btn.dataset.level) === n ? "true" : "false");
    });
    allBars().forEach(function (b) {
      b.setAttribute("aria-expanded", Number(b.dataset.level) <= n ? "true" : "false");
    });
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest(".bar") : null;
    if (b) b.setAttribute("aria-expanded", "true");
  });
  if (levelBtns.length) {
    var saved = parseInt(local.get("blackout.level"), 10);
    if (saved === 1 || saved === 2) applyLevel(saved);
    levelBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLevel(Number(btn.dataset.level));
        local.set("blackout.level", String(level));
      });
    });
  }

  /* ── 대화 버튼: 설정에 등록된 플랫폼만 보여 준다 ── */
  var fillChat = function (slot) {
    var list = (window.SITE && window.SITE.chat) || [];
    slot.textContent = "";
    if (!list.length) {
      var off = document.createElement("button");
      off.className = "btn"; off.type = "button"; off.disabled = true;
      off.textContent = "대화 링크 준비 중";
      slot.appendChild(off);
      return;
    }
    list.forEach(function (p, i) {
      var a = document.createElement("a");
      a.className = "btn" + (i === 0 ? " solid" : "");
      a.href = p.url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = p.name + "에서 대화하기";
      slot.appendChild(a);
    });
  };
  Array.prototype.forEach.call(document.querySelectorAll("[data-chat]"), fillChat);

  /* ── 목차: 지금 보는 구획 표시 ── */
  var links = Array.prototype.slice.call(document.querySelectorAll(".rail a[href^='#']"));
  if (links.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    links.forEach(function (l) {
      var t = document.getElementById(l.getAttribute("href").slice(1));
      if (t) io.observe(t);
    });
  }

  window.BLACKOUT = {
    local: local,
    refresh: function () { applyLevel(level); },
    fillChat: fillChat,
  };
})();
