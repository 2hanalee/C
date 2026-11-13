/* 입장 연출. 소리 없이 8초 안에 끝난다.
   순서: 대사가 한 글자씩 켜진다 → 말한 사람이 드러난다 → 전기가 튀듯 깜빡이며 정전된다 → 잔상 위로 로고가 켜진다.
   처음 방문하면 처음부터 보여 주고, 다시 방문하면 로고 화면부터 시작한다. 같은 방문 안에서는 다시 띄우지 않는다. */
(function () {
  "use strict";
  var gate = document.getElementById("gate");
  if (!gate) return;
  var B = window.BLACKOUT;
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var quoteEl = $("gate-quote"), byEl = $("gate-by"), lamp = $("gate-lamp"), cut = $("gate-cut");
  var btnSkip = $("gate-skip"), btnReplay = $("gate-replay"), btnEnter = $("gate-enter");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var POOL = window.QUOTES || [];
  var outside = Array.prototype.slice.call(document.querySelectorAll("body > :not(#gate):not(script)"));

  /* ── 시간표(초). 대사가 길면 글자 간격을 줄여 QUOTE_END 안에 맞춘다 ── */
  var QUOTE_START = 0.6;   // 첫 글자
  var QUOTE_END = 3.9;     // 마지막 글자가 켜지는 가장 늦은 시각
  var SPOKEN_AFTER = 0.35; // 마지막 글자 뒤 말한 사람이 드러난다
  var CUT_AFTER = 0.55;    // 말한 사람이 드러난 뒤 정전 시작
  var CUT_LEN = 0.95;      // 정전 시작부터 완전히 꺼질 때까지

  /* ── 대사 고르기 ── */
  var firstIdx = Math.max(0, POOL.map(function (q) { return !!q.first; }).indexOf(true));
  var lastIdx = -1;
  var pick = function (initial) {
    if (initial || POOL.length < 2) { lastIdx = firstIdx; return POOL[firstIdx]; }
    var n = (lastIdx + 1) % POOL.length;
    if (n === lastIdx) n = (n + 1) % POOL.length;
    lastIdx = n;
    return POOL[n];
  };
  var rgbOf = function (hex) {
    hex = (hex || "").replace("#", "");
    if (hex.length !== 6) return null;
    return [0, 2, 4].map(function (i) { return parseInt(hex.substr(i, 2), 16); });
  };
  var BOUNDARY = [175, 203, 209];
  var glowRgb = BOUNDARY;
  var glowFor = function (q) {
    var c = q && q.id && B.charById[q.id];
    return (c && rgbOf(c.color)) || BOUNDARY;
  };

  /* ── 글자 만들기 ── */
  var glyphs = [], chars = [];
  var build = function (q) {
    quoteEl.textContent = "";
    glyphs = []; chars = [];
    quoteEl.setAttribute("aria-label", q.lines.join(" "));
    q.lines.forEach(function (text, li) {
      var line = document.createElement("span");
      line.className = "line";
      Array.prototype.forEach.call(text, function (ch, ci) {
        var s = document.createElement("span");
        s.className = "ch";
        s.setAttribute("aria-hidden", "true");
        if (ch === " ") { s.className += " sp"; s.innerHTML = "&nbsp;"; }
        else {
          s.textContent = ch;
          if (/[.,!?…“”"'’‘]/.test(ch)) s.className += " punct";
          glyphs.push({ el: s, ch: ch, line: li, next: text.charAt(ci + 1), last: ci === text.length - 1 });
        }
        line.appendChild(s);
        chars.push(s);
      });
      quoteEl.appendChild(line);
    });
    byEl.textContent = q.name + (q.alias ? ", " + q.alias : "");
    glowRgb = glowFor(q);
    var core = glowRgb.map(function (v) { return Math.round(v + (255 - v) * 0.85); });
    gate.style.setProperty("--glow-rgb", glowRgb.join(" "));
    gate.style.setProperty("--core-rgb", core.join(" "));
    fit();
  };
  // 가장 긴 줄이 화면 폭을 넘지 않게 글자 크기를 맞춘다
  var fit = function () {
    quoteEl.style.fontSize = "";
    var room = gate.clientWidth * 0.9;
    var widest = 0;
    Array.prototype.forEach.call(quoteEl.children, function (l) { widest = Math.max(widest, l.scrollWidth); });
    if (widest > room) {
      var size = parseFloat(getComputedStyle(quoteEl).fontSize);
      quoteEl.style.fontSize = Math.floor(size * room / widest) + "px";
    }
  };

  /* ── 호흡: beats 가 없으면 띄어쓰기와 문장부호로 정한다.
     hold 다음 글자까지의 간격(ms), sweep 빛이 글자를 채우는 시간(초), e 강세(0~1), rest 마지막 밝기 ── */
  var autoBeats = function () {
    var out = [];
    var sentence = [], sentences = [];
    glyphs.forEach(function (g, i) {
      sentence.push(i);
      if (/[.!?…]/.test(g.ch) || i === glyphs.length - 1) { sentences.push(sentence); sentence = []; }
    });
    var posInSentence = {};
    sentences.forEach(function (list) {
      var syl = list.filter(function (i) { return /[가-힣]/.test(glyphs[i].ch); });
      syl.forEach(function (i, k) { posInSentence[i] = { k: k, n: syl.length }; });
    });
    glyphs.forEach(function (g, i) {
      var ch = g.ch, prev = glyphs[i - 1];
      if (ch === "“" || ch === "‘") { out.push({ hold: 170, sweep: 1.6, e: 0 }); return; }
      if (ch === "”" || ch === "’") { out.push({ hold: 0, sweep: 1.4, e: 0 }); return; }
      if (/[.!?]/.test(ch)) {
        var closing = glyphs[i + 1] && /[”’]/.test(glyphs[i + 1].ch);
        out.push({ hold: i === glyphs.length - 1 || closing ? 380 : 1000, sweep: 0.9, e: 0, rest: closing ? 0.82 : 1 });
        return;
      }
      if (ch === ",") { out.push({ hold: 450, sweep: 0.7, e: 0 }); return; }
      if (ch === "…") { out.push({ hold: 700, sweep: 1.2, e: 0 }); return; }
      if (ch === "♡") { out.push({ hold: 420, sweep: 0.9, e: 0.5 }); return; }
      var p = posInSentence[i] || { k: 0, n: 1 };
      var wordStart = !prev || prev.line !== g.line || /[ “‘]/.test(prev.ch) || (g.el.previousSibling && / sp/.test(g.el.previousSibling.className));
      var wordEnd = g.next === " " || g.last;
      var final = glyphs[i + 1] && /[.!?…,]/.test(glyphs[i + 1].ch);
      out.push({
        hold: 170 + (wordEnd ? 140 : 0) + (g.last ? 200 : 0) + (final ? 200 : 0),
        sweep: final ? 1.0 : wordStart ? 0.5 : 0.55,
        e: final ? 0.5 : p.k === 0 ? 0.9 : wordStart ? 0.55 : 0.3,
        rest: final && p.k === p.n - 1 ? 0.9 : 1,
      });
    });
    return out;
  };
  // 정해 둔 시간 안에 들어가도록 간격을 줄인다. 호흡의 비율은 그대로 둔다
  var fitBeats = function (beats) {
    var total = 0;
    for (var i = 0; i < beats.length - 1; i++) total += beats[i].hold;
    var room = (QUOTE_END - QUOTE_START) * 1000;
    var k = total > room ? room / total : 1;
    var sk = Math.max(0.6, k);
    return beats.map(function (b) {
      return { hold: b.hold * k, sweep: b.sweep * sk, e: b.e || 0, rest: b.rest };
    });
  };

  /* ── 진행 ── */
  var timers = [], phase = "idle", keyboard = false;
  gate.addEventListener("keydown", function (e) { if (e.key === "Tab" || e.key === "Enter" || e.key === " ") keyboard = true; });
  gate.addEventListener("pointerdown", function () { keyboard = false; });
  var later = function (fn, sec) { timers.push(setTimeout(fn, Math.round(sec * 1000))); };
  var clearAll = function () { timers.forEach(clearTimeout); timers = []; };
  var center = function (el) {
    var r = el.getBoundingClientRect(), g = gate.getBoundingClientRect();
    return { x: r.left - g.left + r.width / 2, y: r.top - g.top + r.height / 2 };
  };
  var setPhase = function (p) { phase = p; gate.dataset.phase = p; };
  // 정전 뒤: 잔상만 남고 로고와 단추가 나온다
  var endState = function () {
    clearAll(); setPhase("end");
    B.local.set("blackout.intro", "1");
    chars.forEach(function (c) { c.classList.remove("glow", "sheen"); c.classList.add("static"); });
    lamp.classList.remove("on");
    cut.classList.add("dark");
    // 키보드로 보던 사람에게만 입장 단추로 초점을 옮긴다
    if (keyboard) btnEnter.focus({ preventScroll: true });
  };
  var powerCut = function () {
    setPhase("cut");
    if (reduce) { endState(); return; }
    later(endState, CUT_LEN);
  };

  var play = function (initial) {
    clearAll();
    build(pick(initial));
    setPhase("play");
    cut.classList.remove("dark");
    chars.forEach(function (c) { c.classList.remove("glow", "static", "sheen"); c.style.cssText = ""; });
    gate.classList.remove("spoken");
    // 다시 보기 단추는 재생 중에 숨으므로 초점을 연출 화면으로 옮긴다
    gate.focus({ preventScroll: true });
    if (reduce) {
      chars.forEach(function (c) { c.classList.add("static"); });
      gate.classList.add("spoken");
      later(powerCut, 2.4);
      return;
    }
    var q = POOL[lastIdx];
    var beats = fitBeats(q.beats && q.beats.length === glyphs.length ? q.beats : autoBeats());
    var at = QUOTE_START;
    glyphs.forEach(function (g, i) {
      var p = beats[i];
      g.el.style.setProperty("--sweep", p.sweep + "s");
      g.el.style.setProperty("--e", p.e);
      g.el.style.setProperty("--rest", p.rest == null ? 1 : p.rest);
      later(function () {
        var c = center(g.el);
        lamp.style.left = c.x + "px"; lamp.style.top = c.y + "px"; lamp.classList.add("on");
        g.el.classList.add("glow");
      }, at);
      if (i < glyphs.length - 1) at += p.hold / 1000;
    });
    // 마지막 글자 뒤: 빛이 한 번 훑고 말한 사람이 드러난다
    var spoken = at + SPOKEN_AFTER;
    later(function () { lamp.classList.remove("on"); gate.classList.add("spoken"); }, spoken);
    glyphs.forEach(function (g, i) {
      later(function () { g.el.classList.remove("glow"); g.el.style.removeProperty("--rest"); g.el.classList.add("static", "sheen"); }, spoken + i * 0.02);
    });
    later(powerCut, spoken + CUT_AFTER);
  };

  /* ── 열고 닫기 ── */
  var open = function (mode) {
    gate.hidden = false;
    root.classList.add("gate-open");
    outside.forEach(function (el) { el.inert = true; });
    var go = function () {
      if (mode === "end") { build(pick(true)); endState(); }
      else play(mode === "first");
    };
    // 글꼴이 늦게 오면 기다리지 않고 대체 글꼴로 시작한다
    var fonts = document.fonts && document.fonts.load
      ? Promise.all([document.fonts.load('700 40px "HeirofLightBold"', "끝난 게 아니야"), document.fonts.load('500 16px "IBM Plex Mono"')])
      : Promise.resolve();
    var started = false;
    var once = function () { if (!started) { started = true; go(); } };
    fonts.then(once, once);
    setTimeout(once, 1200);
  };
  var close = function () {
    clearAll(); setPhase("idle");
    gate.hidden = true;
    root.classList.remove("gate-open");
    outside.forEach(function (el) { el.inert = false; });
    B.session.set("blackout.gate", "seen");
    B.local.set("blackout.intro", "1");
    if (location.hash === "#gate") { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
    var main = document.getElementById("cover");
    if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
  };

  btnSkip.addEventListener("click", function () { if (phase === "play" || phase === "cut") endState(); });
  btnReplay.addEventListener("click", function () { play(false); });
  btnEnter.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || gate.hidden) return;
    e.preventDefault();
    if (phase === "play" || phase === "cut") endState(); else close();
  });
  window.addEventListener("resize", function () { if (!gate.hidden) fit(); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-replay-gate]"), function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); open("first"); });
  });

  // 주소 끝에 #gate 를 붙이면 처음부터 다시 본다
  var forced = location.hash === "#gate";
  if (forced) open("first");
  else if (B.session.get("blackout.gate") !== "seen") open(B.local.get("blackout.intro") === "1" ? "end" : "first");
})();
