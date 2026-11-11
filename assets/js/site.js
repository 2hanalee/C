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

  /* ── 주 메뉴: 모든 페이지가 같은 목록을 쓴다 ── */
  var NAV = [
    ["index.html", "메인", "main"],
    ["world.html", "세계관", "world"],
    ["characters.html", "인물", "characters"],
    ["webtoon.html", "웹툰", "webtoon"],
    ["timeline.html", "연표·지도", "timeline"],
  ];
  var page = document.body.getAttribute("data-page");
  Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (el) {
    el.innerHTML = NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : "") + ">" + n[1] + "</a>";
    }).join("");
  });

  /* ── 페이지 공통 도우미 ── */
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  };
  var charById = {};
  (window.CHARACTERS || []).forEach(function (c) { charById[c.id] = c; });
  // 가려진 기록 묶음. level 1 내부용, 2 기밀
  var notes = function (items, lv, label) {
    items = items || [];
    var head = "<h2><span>" + label + "</span><span>" + items.length + "건</span></h2>";
    if (!items.length) return '<div class="group">' + head + '<p class="none">등록된 기록이 없습니다.</p></div>';
    return '<div class="group">' + head + items.map(function (it) {
      return '<div class="secret"><p class="warn">' + esc(it.topic) + "</p>" + bar(it.text, lv, it.topic) + "</div>";
    }).join("") + "</div>";
  };
  var bar = function (text, lv, about) {
    var label = lv === 2 ? "기밀" : "내부용";
    return '<button class="bar" data-level="' + lv + '" type="button" aria-expanded="false" aria-label="' + label + " 열람" +
      (about ? ": " + esc(about) : "") + '">' + esc(text) + "</button>";
  };
  // 인물 이름 목록. 누르면 인물 기록으로 간다
  var people = function (ids) {
    var list = (ids || []).filter(function (id) { return charById[id]; });
    if (!list.length) return "";
    return '<ul class="people">' + list.map(function (id) {
      return '<li><a href="characters.html#' + id + '">' + esc(charById[id].name) + "</a></li>";
    }).join("") + "</ul>";
  };

  window.BLACKOUT = {
    local: local,
    refresh: function () { applyLevel(level); },
    fillChat: fillChat,
    esc: esc, notes: notes, bar: bar, people: people, charById: charById,
  };
})();
