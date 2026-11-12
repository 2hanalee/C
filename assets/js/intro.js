/* 입장 연출.
   순서: 대사가 한 글자씩 켜진다 → 문장이 완성되면 문양이 돈다 → 전기가 튀며 정전된다 → 잔상 위로 로고가 떠오른다.
   처음 방문하면 처음부터 보여 주고, 다시 방문하면 로고 화면부터 시작한다. 같은 방문 안에서는 다시 띄우지 않는다.
   소리는 파일 없이 브라우저에서 합성한다. 화면을 한 번 눌러야 켜진다. */
(function () {
  "use strict";
  var gate = document.getElementById("gate");
  if (!gate) return;
  var B = window.BLACKOUT;
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var quoteEl = $("gate-quote"), byEl = $("gate-by"), lamp = $("gate-lamp"), cut = $("gate-cut"), hint = $("gate-hint");
  var btnSkip = $("gate-skip"), btnReplay = $("gate-replay"), btnEnter = $("gate-enter"), btnMute = $("gate-mute");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var POOL = window.QUOTES || [];
  var outside = Array.prototype.slice.call(document.querySelectorAll("body > :not(#gate):not(script)"));

  /* ── 대사 고르기 ── */
  var firstIdx = Math.max(0, POOL.map(function (q) { return !!q.first; }).indexOf(true));
  var lastIdx = -1;
  var pick = function (initial) {
    if (initial || POOL.length < 2) { lastIdx = firstIdx; return POOL[firstIdx]; }
    // 다시 보기: 방금 본 대사를 빼고 돌아가며 고른다
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
    var rgb = glowFor(q);
    var core = rgb.map(function (v) { return Math.round(v + (255 - v) * 0.85); });
    gate.style.setProperty("--glow-rgb", rgb.join(" "));
    gate.style.setProperty("--core-rgb", core.join(" "));
    glowCss = rgb.join(",");
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

  /* ── 호흡: beats 가 없으면 띄어쓰기와 문장부호로 정한다 ── */
  var SCALE = [587.3, 523.3, 466.2, 440, 392, 349.2, 329.6, 293.7];
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
      if (ch === "“" || ch === "‘") { out.push({ hold: 170, sweep: 1.6, e: 0, f: 0 }); return; }
      if (ch === "”" || ch === "’") { out.push({ hold: 0, sweep: 1.4, e: 0, f: 0 }); return; }
      if (/[.!?]/.test(ch)) {
        var closing = glyphs[i + 1] && /[”’]/.test(glyphs[i + 1].ch);
        out.push({ hold: i === glyphs.length - 1 || closing ? 380 : 1000, sweep: 0.9, e: 0, f: 0, rest: closing ? 0.82 : 1 });
        return;
      }
      if (ch === ",") { out.push({ hold: 450, sweep: 0.7, e: 0, f: 0 }); return; }
      if (ch === "…") { out.push({ hold: 700, sweep: 1.2, e: 0, f: 0 }); return; }
      if (ch === "♡") { out.push({ hold: 420, sweep: 0.9, e: 0.5, f: 698.5 }); return; }
      var p = posInSentence[i] || { k: 0, n: 1 };
      var wordStart = !prev || prev.line !== g.line || /[ “‘]/.test(prev.ch) || (g.el.previousSibling && / sp/.test(g.el.previousSibling.className));
      var wordEnd = g.next === " " || g.last;
      var final = glyphs[i + 1] && /[.!?…,]/.test(glyphs[i + 1].ch);
      var e = p.k === 0 ? 0.9 : wordStart ? 0.55 : 0.3;
      var step = Math.round((p.k / Math.max(1, p.n - 1)) * (SCALE.length - 1));
      if (wordStart && step > 0) step -= 1;
      out.push({
        hold: 170 + (wordEnd ? 140 : 0) + (g.last ? 200 : 0) + (final ? 200 : 0),
        sweep: final ? 1.0 : wordStart ? 0.5 : 0.55,
        e: final ? 0.5 : e,
        f: SCALE[Math.min(SCALE.length - 1, step)],
        len: final ? 2.2 : 1.6,
        rest: final && p.k === p.n - 1 ? 0.9 : 1,
      });
    });
    return out;
  };

  /* ── 소리 ── */
  var AC = window.AudioContext || window.webkitAudioContext;
  var ac = null, master, verb, drone = null;
  var muted = B.local.get("blackout.mute") === "1";
  var audio = function () {
    if (!AC) return null;
    if (ac) return ac;
    try { ac = new AC(); } catch (e) { AC = null; return null; }
    master = ac.createGain(); master.gain.value = muted ? 0 : 0.55; master.connect(ac.destination);
    verb = ac.createConvolver();
    var len = ac.sampleRate * 2.8, buf = ac.createBuffer(2, len, ac.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    verb.buffer = buf;
    var wet = ac.createGain(); wet.gain.value = 0.5; verb.connect(wet); wet.connect(master);
    return ac;
  };
  var running = function () { return ac && ac.state === "running" && !muted; };
  var syncHint = function () {
    hint.classList.toggle("off", !AC || muted || (ac && ac.state === "running") || phase !== "play");
  };
  var unlock = function () {
    if (gate.hidden) return;
    var a = audio();
    if (a && a.state === "suspended") a.resume().then(syncHint, function () {});
    setTimeout(syncHint, 150);
  };
  ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { gate.addEventListener(ev, unlock, { passive: true }); });

  var voice = function (f, t, dur, gain, type, toVerb) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    var s = ac.createGain(); s.gain.value = toVerb == null ? 0.8 : toVerb; g.connect(s); s.connect(verb);
    o.start(t); o.stop(t + dur + 0.05);
  };
  var chime = function (f, e, len) {
    if (!running() || !f) return;
    var t = ac.currentTime, g = 0.04 + 0.11 * e;
    voice(f, t, len, g); voice(f * 2.01, t, len * 0.5, g * 0.3); voice(f * 3.98, t, 0.3, g * 0.1);
  };
  var shimmer = function () {
    if (!running()) return;
    var t = ac.currentTime;
    [880, 1174.7, 1318.5, 1760, 2349.3].forEach(function (f, k) { voice(f, t + k * 0.05, 1.2, 0.025); });
  };
  var startDrone = function () {
    if (!ac || drone) return;
    var t = ac.currentTime, g = ac.createGain(), lp = ac.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 420;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07, t + 2.5);
    var os = [73.4, 110, 73.9].map(function (f, k) {
      var o = ac.createOscillator(); o.type = k === 1 ? "triangle" : "sine";
      o.frequency.value = f; o.connect(lp); o.start(t); return o;
    });
    lp.connect(g); g.connect(master); drone = { g: g, os: os };
  };
  var stopDrone = function (hard) {
    if (!drone) return;
    var t = ac.currentTime, d = drone; drone = null;
    d.g.gain.cancelScheduledValues(t); d.g.gain.setValueAtTime(d.g.gain.value, t);
    d.g.gain.linearRampToValueAtTime(0, t + (hard ? 0.03 : 0.8));
    d.os.forEach(function (o) { o.stop(t + (hard ? 0.05 : 0.9)); });
  };
  var buzz = function (dur) {
    if (!running()) return;
    var t = ac.currentTime, o = ac.createOscillator(), bp = ac.createBiquadFilter(), g = ac.createGain();
    o.type = "sawtooth"; o.frequency.value = 60; bp.type = "bandpass"; bp.frequency.value = 180; bp.Q.value = 2;
    g.gain.setValueAtTime(0.09, t); g.gain.setValueAtTime(0, t + dur);
    o.connect(bp); bp.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  };
  var thunk = function () {
    if (!running()) return;
    var t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(32, t + 0.4);
    g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.65);
    var n = ac.createBufferSource(), nb = ac.createBuffer(1, ac.sampleRate * 0.15, ac.sampleRate), d = nb.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    var lp = ac.createBiquadFilter(), ng = ac.createGain(); lp.type = "lowpass"; lp.frequency.value = 900; ng.gain.value = 0.25;
    n.buffer = nb; n.connect(lp); lp.connect(ng); ng.connect(master); n.start(t);
  };
  var setMute = function (m) {
    muted = m;
    btnMute.textContent = muted ? "소리 켜기" : "소리 끄기";
    btnMute.setAttribute("aria-pressed", String(muted));
    B.local.set("blackout.mute", muted ? "1" : "0");
    if (master) master.gain.setTargetAtTime(muted ? 0 : 0.55, ac.currentTime, 0.05);
    syncHint();
  };
  btnMute.addEventListener("click", function () { setMute(!muted); });

  /* ── 화면 효과: 떠다니는 먼지, 불티, 문양 ── */
  var cv = $("gate-fx"), ctx = cv.getContext("2d");
  var W = 0, H = 0, raf = 0, glowCss = BOUNDARY.join(",");
  var resize = function () {
    var r = Math.min(window.devicePixelRatio || 1, 2);
    W = gate.clientWidth; H = gate.clientHeight;
    cv.width = W * r; cv.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0);
  };
  var motes = [], sparks = [];
  var light = { x: 0, y: 0, k: 0, tk: 0 };
  var sigil = 0, sigilT = 0.045;
  var seedMotes = function () {
    motes = [];
    for (var i = 0, n = Math.round(Math.min(90, W / 9)); i < n; i++) {
      motes.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + 0.3,
        vy: -(Math.random() * 0.18 + 0.04), vx: (Math.random() - 0.5) * 0.08, ph: Math.random() * 6.28 });
    }
  };
  var burst = function (x, y, n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.28, sp = Math.random() * 1.5 + 0.3;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.4, life: 1, r: Math.random() * 1.4 + 0.4 });
    }
  };
  var drawSigil = function (t) {
    if (sigil < 0.005) return;
    var R = Math.min(W, H) * 0.42;
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(t * 0.00005);
    ctx.strokeStyle = "rgba(" + glowCss + "," + sigil + ")"; ctx.lineWidth = 1;
    [1, 0.93].forEach(function (k) { ctx.beginPath(); ctx.arc(0, 0, R * k, 0, 6.283); ctx.stroke(); });
    for (var i = 0; i < 24; i++) {
      var a = i / 24 * 6.283, l = i % 2 ? 0.965 : 0.94;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * R * l, Math.sin(a) * R * l); ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx.stroke();
    }
    ctx.rotate(-t * 0.0001);
    for (var k = 0; k < 2; k++) {
      ctx.beginPath();
      for (var j = 0; j <= 3; j++) {
        var b = j / 3 * 6.283 + k * Math.PI / 3 - Math.PI / 2;
        var px = Math.cos(b) * R * 0.62, py = Math.sin(b) * R * 0.62;
        if (j) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  };
  var t0 = 0;
  var frame = function (now) {
    var t = now - t0;
    ctx.clearRect(0, 0, W, H);
    sigil += (sigilT - sigil) * 0.03; light.k += (light.tk - light.k) * 0.1; drawSigil(t);
    var reach = Math.min(W, H) * 0.35;
    motes.forEach(function (m) {
      if (!reduce) { m.x += m.vx; m.y += m.vy; }
      if (m.y < -4) { m.y = H + 4; m.x = Math.random() * W; }
      var lit = light.k * Math.max(0, 1 - Math.hypot(m.x - light.x, m.y - light.y) / reach);
      ctx.fillStyle = "rgba(" + glowCss + "," + (0.18 + 0.12 * Math.sin(t * 0.0012 + m.ph) + lit * 0.7) + ")";
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r + lit * 1.2, 0, 6.283); ctx.fill();
    });
    sparks = sparks.filter(function (s) { return s.life > 0; });
    sparks.forEach(function (s) {
      s.x += s.vx; s.y += s.vy; s.vy -= 0.012; s.vx *= 0.985; s.life -= 0.022;
      ctx.fillStyle = "rgba(255,246,250," + s.life + ")"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.life + 0.2, 0, 6.283); ctx.fill();
    });
    raf = requestAnimationFrame(frame);
  };

  /* ── 진행 ── */
  var timers = [], phase = "idle", keyboard = false;
  gate.addEventListener("keydown", function (e) { if (e.key === "Tab" || e.key === "Enter" || e.key === " ") keyboard = true; });
  gate.addEventListener("pointerdown", function () { keyboard = false; });
  var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
  var clearAll = function () { timers.forEach(clearTimeout); timers = []; };
  var center = function (el) {
    var r = el.getBoundingClientRect(), g = gate.getBoundingClientRect();
    return { x: r.left - g.left + r.width / 2, y: r.top - g.top + r.height / 2 };
  };
  var setPhase = function (p) { phase = p; gate.dataset.phase = p; syncHint(); };

  // 정전 뒤: 잔상만 남고 로고와 단추가 나온다
  var endState = function () {
    clearAll(); setPhase("end");
    B.local.set("blackout.intro", "1");
    chars.forEach(function (c) { c.classList.remove("glow", "sheen"); c.classList.add("static"); });
    lamp.classList.remove("on"); light.tk = 0; sigilT = 0; sigil = 0;
    cut.classList.remove("cut"); cut.classList.add("dark");
    if (ac) stopDrone(true);
    // 키보드로 보던 사람에게만 입장 단추로 초점을 옮긴다. 손가락이나 마우스로 보던 화면에는 초점 테두리를 띄우지 않는다
    if (keyboard) btnEnter.focus({ preventScroll: true });
  };
  var powerCut = function () {
    setPhase("cut");
    if (reduce) { thunk(); endState(); return; }
    cut.classList.add("cut");
    [[0, 70], [160, 90], [350, 120], [650, 60]].forEach(function (b) { later(function () { buzz(b[1] / 1000); }, b[0]); });
    later(function () { thunk(); if (ac) stopDrone(true); }, 1250);
    later(endState, 1250 + 900);
  };

  var play = function (initial) {
    clearAll();
    build(pick(initial));
    setPhase("play");
    cut.classList.remove("cut", "dark");
    chars.forEach(function (c) { c.classList.remove("glow", "static", "sheen"); c.style.cssText = ""; });
    sigilT = 0.045;
    var a = audio();
    if (a) { if (a.state === "suspended") a.resume().catch(function () {}); startDrone(); }
    setTimeout(syncHint, 400);
    // 다시 보기 단추는 재생 중에 숨으므로 초점을 연출 화면으로 옮긴다
    if (document.activeElement !== btnMute) gate.focus({ preventScroll: true });
    if (reduce) {
      chars.forEach(function (c) { c.classList.add("static"); });
      gate.classList.add("spoken");
      later(powerCut, 2600);
      return;
    }
    gate.classList.remove("spoken");
    var q = POOL[lastIdx];
    var beats = q.beats && q.beats.length === glyphs.length ? q.beats : autoBeats();
    var at = 900;
    glyphs.forEach(function (g, i) {
      var p = beats[i];
      g.el.style.setProperty("--sweep", p.sweep + "s");
      g.el.style.setProperty("--e", p.e);
      g.el.style.setProperty("--rest", p.rest == null ? 1 : p.rest);
      later(function () {
        var c = center(g.el);
        lamp.style.left = c.x + "px"; lamp.style.top = c.y + "px"; lamp.classList.add("on");
        light.x = c.x; light.y = c.y; light.tk = p.f ? 0.45 + 0.7 * p.e : 0.25;
        g.el.classList.add("glow");
        if (p.f) burst(c.x, c.y - g.el.offsetHeight * 0.3, Math.round(4 + 14 * p.e));
        chime(p.f, p.e, p.len || 1.6);
      }, at);
      at += p.hold;
    });
    // 문장이 다 켜지면 빛이 한 번 훑고 지나가고 말한 사람이 드러난다
    at += 900;
    later(function () { lamp.classList.remove("on"); light.tk = 0; sigilT = 0.13; shimmer(); gate.classList.add("spoken"); }, at);
    glyphs.forEach(function (g, i) {
      later(function () { g.el.classList.remove("glow"); g.el.style.removeProperty("--rest"); g.el.classList.add("static", "sheen"); }, at + i * 35);
    });
    at += glyphs.length * 35 + 1400 + 900;
    later(powerCut, at);
  };

  /* ── 열고 닫기 ── */
  var open = function (mode) {
    gate.hidden = false;
    root.classList.add("gate-open");
    outside.forEach(function (el) { el.inert = true; });
    resize(); seedMotes();
    light.x = W / 2; light.y = H / 2;
    if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); }
    btnMute.textContent = muted ? "소리 켜기" : "소리 끄기";
    btnMute.setAttribute("aria-pressed", String(muted));
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
    setTimeout(once, 2500);
  };
  var close = function () {
    clearAll(); setPhase("idle");
    gate.hidden = true;
    root.classList.remove("gate-open");
    outside.forEach(function (el) { el.inert = false; });
    B.session.set("blackout.gate", "seen");
    B.local.set("blackout.intro", "1");
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (ac) { stopDrone(true); ac.suspend().catch(function () {}); }
    if (location.hash === "#gate") { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
    var main = document.getElementById("cover");
    if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
  };

  btnSkip.addEventListener("click", function () { if (phase === "play" || phase === "cut") { thunk(); endState(); } });
  btnReplay.addEventListener("click", function () { play(false); });
  btnEnter.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || gate.hidden) return;
    e.preventDefault();
    if (phase === "play" || phase === "cut") { thunk(); endState(); } else close();
  });
  window.addEventListener("resize", function () { if (!gate.hidden) { resize(); fit(); } });
  Array.prototype.forEach.call(document.querySelectorAll("[data-replay-gate]"), function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); open("first"); });
  });

  // 주소 끝에 #gate 를 붙이면 처음부터 다시 본다
  var forced = location.hash === "#gate";
  if (forced) open("first");
  else if (B.session.get("blackout.gate") !== "seen") open(B.local.get("blackout.intro") === "1" ? "end" : "first");
})();
