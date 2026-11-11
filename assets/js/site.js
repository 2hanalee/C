(function () {
  "use strict";
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ── 게이트: 문서 세 줄 → 가림 → 정전 → 제목 ── */
  var gate = document.getElementById("gate");
  if (gate) {
    var timers = [];
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var setPhase = function (n) { gate.dataset.phase = String(n); };
    var clear = function () { timers.forEach(clearTimeout); timers = []; };
    var close = function () {
      clear();
      gate.hidden = true;
      root.classList.remove("gate-open");
      store.set("blackout.gate", "seen");
    };
    var toEnd = function () { clear(); setPhase(6); };

    if (store.get("blackout.gate") === "seen" && location.hash !== "#gate") {
      gate.hidden = true;
    } else {
      root.classList.add("gate-open");
      if (reduce) {
        setPhase(6);
      } else {
        var at = [[2, 1900], [3, 3800], [4, 5600], [5, 7600], [6, 9200]];
        at.forEach(function (s) { timers.push(setTimeout(function () { setPhase(s[0]); }, s[1])); });
      }
      document.getElementById("gate-skip").addEventListener("click", toEnd);
      document.getElementById("gate-enter").addEventListener("click", close);
      document.addEventListener("keydown", function (e) {
        if (gate.hidden) return;
        if (e.key === "Escape") close();
      });
    }
  }

  /* ── 기밀 막대: 개별 열람과 일괄 열람 ── */
  var bars = Array.prototype.slice.call(document.querySelectorAll(".bar"));
  var sw = document.getElementById("clearance");
  var openBar = function (b, on) { b.setAttribute("aria-expanded", on ? "true" : "false"); };
  bars.forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("aria-expanded") !== "true") openBar(b, true);
    });
  });
  if (sw) {
    var apply = function (on) {
      sw.setAttribute("aria-pressed", on ? "true" : "false");
      bars.forEach(function (b) { openBar(b, on); });
    };
    if (store.get("blackout.clearance") === "all") apply(true);
    sw.addEventListener("click", function () {
      var on = sw.getAttribute("aria-pressed") !== "true";
      apply(on);
      store.set("blackout.clearance", on ? "all" : "none");
    });
  }

  /* ── 대화 버튼: 설정에 등록된 플랫폼만 보여 준다 ── */
  var slot = document.getElementById("platforms");
  if (slot) {
    var list = (window.SITE && window.SITE.chat) || [];
    if (list.length) {
      slot.textContent = "";
      list.forEach(function (p, i) {
        var a = document.createElement("a");
        a.className = "btn" + (i === 0 ? " solid" : "");
        a.href = p.url; a.target = "_blank"; a.rel = "noopener";
        a.textContent = p.name + "에서 대화하기";
        slot.appendChild(a);
      });
    }
  }

  /* ── 목차: 지금 보는 구획 표시 ── */
  var links = Array.prototype.slice.call(document.querySelectorAll(".rail a"));
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
})();
