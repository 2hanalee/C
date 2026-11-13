/* 입장 연출. 소리 없이 8초 안에 끝난다.
   순서: 밤의 인천이 드러난다 → 대사가 한 글자씩 켜진다 → 하늘에 균열이 그어진다
        → 전기가 튀며 녹 구역부터 정전되고, 파스텔 불빛과 전광판은 반 박자 늦게 꺼진다 → 잔상 위로 로고가 켜진다.
   배경은 WebGL 로 그린다. WebGL 이 없으면 배경 없이 글자만 켜진다.
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
  var SPOKEN_AFTER = 0.35; // 마지막 글자 뒤 말한 사람이 드러나고 균열이 그어지기 시작
  var CRACK_LEN = 0.5;
  var CUT_AFTER = 0.55;    // 균열 시작 뒤 정전 시작
  var CUT_LEN = 0.95;      // 정전 시작부터 완전히 꺼질 때까지
  // 정전 안의 순서: 녹 구역 세 칸 → 반 박자 쉬고 파스텔 → 전광판
  var OFF_RUST = [0, 0.15, 0.3], OFF_PASTEL = 0.6, OFF_BOARD = 0.78;

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

  /* ── 배경: 밤의 인천 ──
     도시 그림은 한 번만 캔버스에 그려 텍스처로 올린다. 채널마다 뜻이 다르다.
     R 녹 구역 불빛, G 파스텔 분홍 불빛, B 파스텔 하늘색 불빛, A 건물 실루엣.
     셰이더가 정전 상태에 따라 채널을 켜고 끄며, 흐린 밉맵으로 빛 번짐을 만든다. */
  var cv = $("gate-fx");
  var scene = null;
  var rng = function (seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  var drawCity = function () {
    var TW = 1024, TH = 512, GROUND = 470;
    var c = document.createElement("canvas");
    c.width = TW; c.height = TH;
    var g = c.getContext("2d");
    var r = rng(20061);
    var SIL = "rgba(0,0,0,1)";
    var win = function (x, y, w, h, color) { g.fillStyle = color; g.fillRect(x, y, w, h); };
    // 매립지 땅(왼쪽)과 부두(오른쪽 위쪽 띠)
    g.fillStyle = SIL;
    g.fillRect(0, GROUND, TW * 0.55, TH - GROUND);
    g.fillRect(TW * 0.6, GROUND - 6, TW * 0.4, 8);
    // 송도: 파스텔 타워
    var x = TW * 0.1, k = 0;
    var board = null;
    while (x < TW * 0.52) {
      var w = 28 + r() * 34, h = 150 + r() * 230;
      if (k === 4) h = 360;
      var top = GROUND - h;
      g.fillStyle = SIL; g.fillRect(x, top, w, h);
      if (r() < 0.4) g.fillRect(x + w * 0.45, top - 18 - r() * 20, 2, 30); // 안테나
      var tint = k % 3 === 0 ? "rgb(0,255,0)" : k % 3 === 1 ? "rgb(0,0,255)" : "rgb(0,200,255)";
      for (var wy = top + 8; wy < GROUND - 10; wy += 11) {
        for (var wx = x + 4; wx < x + w - 6; wx += 8) {
          if (r() < 0.42) win(wx, wy, 4, 6, tint);
        }
      }
      // 랭킹 전광판: 다섯째 타워 옆면
      if (k === 4) {
        board = { x: x + w + 2, y: top + 40, w: 92, h: 46 };
        g.fillStyle = SIL; g.fillRect(board.x - 2, board.y - 2, board.w + 4, board.h + 4);
        g.fillStyle = "rgb(0,70,110)"; g.fillRect(board.x, board.y, board.w, board.h);
        g.fillStyle = "rgb(0,255,255)";
        g.font = '600 15px "IBM Plex Sans KR", sans-serif';
        g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText("구조율 92%", board.x + board.w / 2, board.y + board.h / 2 + 1);
        x += board.w + 6;
      }
      x += w + 3 + r() * 6;
      k++;
    }
    // 다리: 파스텔과 녹 사이
    g.strokeStyle = SIL; g.lineWidth = 3;
    g.beginPath(); g.moveTo(TW * 0.5, GROUND - 40);
    g.quadraticCurveTo(TW * 0.57, GROUND - 95, TW * 0.64, GROUND - 40); g.stroke();
    g.fillRect(TW * 0.5, GROUND - 42, TW * 0.14, 4);
    for (var bx = TW * 0.505; bx < TW * 0.64; bx += 9) win(bx, GROUND - 46, 2, 2, "rgb(0,180,200)");
    // 내항: 창고와 녹슨 크레인
    g.fillStyle = SIL;
    for (var hx = TW * 0.62; hx < TW * 0.95; ) {
      var hw = 40 + r() * 50, hh = 26 + r() * 40;
      g.fillRect(hx, GROUND - 6 - hh, hw, hh);
      for (var lx = hx + 6; lx < hx + hw - 6; lx += 14) if (r() < 0.35) win(lx, GROUND - 6 - hh + 8, 4, 4, "rgb(255,0,0)");
      g.fillStyle = SIL;
      hx += hw + 4 + r() * 10;
    }
    [0.66, 0.74, 0.83, 0.91].forEach(function (cx, i) {
      var px = TW * cx, base = GROUND - 6, ht = 150 + i * 12;
      g.strokeStyle = SIL; g.lineWidth = 4;
      g.beginPath();
      g.moveTo(px, base); g.lineTo(px, base - ht);
      g.moveTo(px + 34, base); g.lineTo(px + 34, base - ht);
      g.moveTo(px - 70, base - ht + 10); g.lineTo(px + 60, base - ht + 10); // 붐
      g.moveTo(px, base - ht); g.lineTo(px + 17, base - ht - 40); g.lineTo(px + 34, base - ht);
      g.moveTo(px + 17, base - ht - 40); g.lineTo(px - 70, base - ht + 10);
      g.stroke();
      g.lineWidth = 2;
      g.beginPath(); g.moveTo(px - 40, base - ht + 10); g.lineTo(px - 40, base - ht + 60); g.stroke();
      win(px + 15, base - ht - 44, 4, 4, "rgb(255,0,0)");
      win(px - 72, base - ht + 7, 3, 3, "rgb(255,0,0)");
    });
    // 가로등
    for (var sx = TW * 0.6; sx < TW; sx += 26) win(sx, GROUND - 14, 3, 3, "rgb(255,0,0)");
    return { canvas: c, ground: 1 - GROUND / TH, board: board ? [board.x / TW, 1 - (board.y + board.h) / TH, (board.x + board.w) / TW, 1 - board.y / TH] : [0, 0, 0, 0] };
  };

  var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FS = [
    "precision mediump float;",
    "uniform sampler2D uCity;uniform vec2 uRes;uniform vec2 uBox;uniform vec4 uBoardRect;uniform vec3 uGlow;",
    "uniform float uT,uFade,uPush,uCrack,uGlitch,uRustOff,uPastel,uBoard,uGround;",
    "float h(float n){return fract(sin(n)*43758.5453);}",
    "float h2(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233)))*43758.5453);}",
    "float seg(vec2 q,vec2 a,vec2 b){vec2 pa=q-a,ba=b-a;float t=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*t);}",
    "vec3 lights(vec2 uv,float bias){",
    "  vec4 t=texture2D(uCity,uv,bias);",
    "  float rb=uv.x<0.6?0.:(uv.x<0.73?1.:(uv.x<0.86?2.:3.));",
    "  float rOn=rb<0.5?1.:step(uRustOff+0.5,rb);",
    "  float inB=step(uBoardRect.x,uv.x)*step(uv.x,uBoardRect.z)*step(uBoardRect.y,uv.y)*step(uv.y,uBoardRect.w);",
    "  float pOn=mix(uPastel,uBoard,inB);",
    "  return t.r*vec3(1.,.5,.22)*rOn+(t.g*vec3(1.,.6,.8)+t.b*vec3(.58,.8,1.))*pOn;",
    "}",
    "vec3 city(vec2 frag,out float sil){",
    "  vec2 org=vec2((uRes.x-uBox.x)*.5,-uBox.y*.03);",
    "  vec2 uv=(frag-org)/uBox;",
    "  sil=0.;",
    "  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)return vec3(0.);",
    "  vec4 t=texture2D(uCity,uv);sil=t.a;",
    "  float inB=step(uBoardRect.x-.01,uv.x)*step(uv.x,uBoardRect.z+.01)*step(uBoardRect.y-.02,uv.y)*step(uv.y,uBoardRect.w+.02);",
    "  vec3 c=lights(uv,0.)*mix(1.15,.8,inB)+(lights(uv,3.2)*1.1+lights(uv,5.)*0.6)*mix(1.,.3,inB);",
    "  if(uv.y<uGround&&uv.x>0.55){",
    "    vec2 m=vec2(uv.x+sin(uv.y*420.+uT*2.6)*0.0025,2.*uGround-uv.y);",
    "    c+=(lights(m,1.5)*0.55+lights(m,4.)*0.4)*(1.-uv.y/uGround*0.3);",
    "  }",
    "  return c;",
    "}",
    "void main(){",
    "  vec2 frag=gl_FragCoord.xy;",
    "  vec2 ctr=vec2(uRes.x*.5,uRes.y*.28);",
    "  vec2 f=ctr+(frag-ctr)*(1.-uPush);",
    "  float tick=floor(uT*24.);",
    "  float band=floor(frag.y/uRes.y*36.);",
    "  f.x+=(h(band+tick)-.5)*uGlitch*.05*uRes.x*step(.55,h(band*1.7+tick));",
    "  float yN=frag.y/uRes.y,xN=frag.x/uRes.x;",
    "  vec3 sky=mix(vec3(.05,.085,.115),vec3(.012,.02,.03),yN);",
    "  float hz=exp(-pow((frag.y-uBox.y*.5)/(uRes.y*.22),2.));",
    "  sky+=hz*mix(vec3(.13,.07,.11)*uPastel,vec3(.12,.06,.025)*step(uRustOff,.5),smoothstep(.35,.7,xN))*.7;",
    "  float sil;",
    "  float sep=uGlitch*.006*uRes.x;",
    "  vec3 L=vec3(city(f+vec2(sep,0.),sil).r,0.,0.);",
    "  vec3 C=city(f,sil);L.g=C.g;",
    "  float s2;L.b=city(f-vec2(sep,0.),s2).b;",
    "  vec3 col=mix(sky,vec3(.016,.022,.03),sil)+L;",
    // 균열: 하늘 위쪽을 가로지르는 들쭉날쭉한 선
    "  vec2 q=frag/uRes.y;vec2 a=vec2(uRes.x/uRes.y*.63,.97);float d=1e3;float n=9.;",
    "  for(int i=0;i<9;i++){",
    "    float fi=float(i);",
    "    vec2 b=a+vec2(-.035-h(fi*3.1)*.03,-.026-h(fi*7.7)*.02);b.x+=(h(fi*13.)-.5)*.05;",
    "    float vis=clamp(uCrack*n-fi,0.,1.);",
    "    if(vis>0.){d=min(d,seg(q,a,mix(a,b,vis)));}",
    "    a=b;",
    "  }",
    "  float px=d*uRes.y;",
    "  float cr=(exp(-px/1.2)+exp(-px/16.)*.35)*step(.001,uCrack)*(.85+.15*sin(uT*40.));",
    "  col+=cr*mix(uGlow,vec3(1.),.55);",
    // 글자 뒤를 조금 어둡게: 대사가 도시 불빛에 묻히지 않게
    "  vec2 dc=(frag-uRes*vec2(.5,.52))/uRes.y;",
    "  col*=1.-.5*exp(-dot(dc,dc)*7.);",
    "  col*=1.-uGlitch*.3*(.5+.5*sin(frag.y*3.14159));",
    "  col*=uFade;",
    "  col+=(h2(frag+fract(uT)*91.)-.5)*.035;",
    "  float v=length((frag-uRes*.5)/uRes);col*=1.-smoothstep(.45,.95,v)*.7;",
    "  gl_FragColor=vec4(max(col,0.),1.);",
    "}",
  ].join("\n");

  var makeScene = function () {
    var gl = null;
    try { gl = cv.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false }); } catch (e) {}
    if (!gl) return null;
    var sh = function (type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return null;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ["uCity", "uRes", "uBox", "uBoardRect", "uGlow", "uT", "uFade", "uPush", "uCrack", "uGlitch", "uRustOff", "uPastel", "uBoard", "uGround"].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
    var drawn = drawCity();
    var tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drawn.canvas);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(U.uCity, 0);
    gl.uniform4fv(U.uBoardRect, drawn.board);
    gl.uniform1f(U.uGround, drawn.ground);
    var W = 0, H = 0;
    return {
      resize: function () {
        var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        W = Math.round(gate.clientWidth * dpr); H = Math.round(gate.clientHeight * dpr);
        cv.width = W; cv.height = H; gl.viewport(0, 0, W, H);
        // 도시 폭: 가로 화면은 화면보다 조금 넓게, 세로 화면은 가운데(송도와 내항이 맞닿는 곳)만 보이게 크게
        var cw = W * (W > H ? 1.08 : 1.9);
        gl.uniform2f(U.uRes, W, H);
        gl.uniform2f(U.uBox, cw, Math.min(cw / 2, H * 0.62));
      },
      draw: function (s) {
        gl.uniform3f(U.uGlow, glowRgb[0] / 255, glowRgb[1] / 255, glowRgb[2] / 255);
        gl.uniform1f(U.uT, s.t); gl.uniform1f(U.uFade, s.fade); gl.uniform1f(U.uPush, s.push);
        gl.uniform1f(U.uCrack, s.crack); gl.uniform1f(U.uGlitch, s.glitch);
        gl.uniform1f(U.uRustOff, s.rustOff); gl.uniform1f(U.uPastel, s.pastel); gl.uniform1f(U.uBoard, s.board);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
    };
  };

  /* ── 진행 ── */
  var timers = [], phase = "idle", keyboard = false, raf = 0;
  var tl = null; // 이번 재생의 시각표(초): { start, spoken, cut }
  gate.addEventListener("keydown", function (e) { if (e.key === "Tab" || e.key === "Enter" || e.key === " ") keyboard = true; });
  gate.addEventListener("pointerdown", function () { keyboard = false; });
  var later = function (fn, sec) { timers.push(setTimeout(fn, Math.round(sec * 1000))); };
  var clearAll = function () { timers.forEach(clearTimeout); timers = []; };
  var center = function (el) {
    var r = el.getBoundingClientRect(), g = gate.getBoundingClientRect();
    return { x: r.left - g.left + r.width / 2, y: r.top - g.top + r.height / 2 };
  };
  var setPhase = function (p) { phase = p; gate.dataset.phase = p; };
  var smooth = function (a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  var pulse = function (x, at, len) { return x >= at && x < at + len ? 1 - (x - at) / len : 0; };

  // 시각표로부터 지금 화면 상태를 계산한다
  var stateAt = function (t) {
    var s = { t: t, fade: smooth(0.05, 0.9, t), push: reduce ? 0 : 0.05 * smooth(0, 8, t), crack: 0, glitch: 0, rustOff: 0, pastel: 1, board: 1 };
    if (!tl) return s;
    if (t >= tl.spoken) s.crack = smooth(tl.spoken, tl.spoken + CRACK_LEN, t);
    var c = tl.cut;
    if (t >= c) {
      s.glitch = Math.max(pulse(t, c, 0.14), pulse(t, c + 0.22, 0.12) * 0.8, pulse(t, c + OFF_PASTEL - 0.04, 0.1) * 0.6);
      s.rustOff = OFF_RUST.filter(function (o) { return t >= c + o; }).length;
      // 파스텔은 반 박자 늦게, 꺼지기 직전에 한 번 깜빡인다
      s.pastel = t >= c + OFF_PASTEL ? 0 : t >= c + OFF_PASTEL - 0.12 && t < c + OFF_PASTEL - 0.07 ? 0.25 : 1;
      s.board = t >= c + OFF_BOARD ? 0 : t >= c + OFF_BOARD - 0.1 && t < c + OFF_BOARD - 0.05 ? 0.3 : 1;
      s.crack *= 1 - smooth(c + 0.4, c + 0.7, t);
    }
    return s;
  };
  var frame = function (now) {
    var t = tl ? (now - tl.start) / 1000 : 0;
    if (scene) scene.draw(stateAt(t));
    raf = phase === "play" || phase === "cut" ? requestAnimationFrame(frame) : 0;
  };
  var startLoop = function () { if (!raf) raf = requestAnimationFrame(frame); };

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
      tl = { start: performance.now(), spoken: 1e9, cut: 1e9 };
      if (scene) scene.draw(stateAt(1));
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
    // 마지막 글자 뒤: 빛이 한 번 훑고 말한 사람이 드러나며 하늘이 갈라진다
    var spoken = at + SPOKEN_AFTER;
    later(function () { lamp.classList.remove("on"); gate.classList.add("spoken"); }, spoken);
    glyphs.forEach(function (g, i) {
      later(function () { g.el.classList.remove("glow"); g.el.style.removeProperty("--rest"); g.el.classList.add("static", "sheen"); }, spoken + i * 0.02);
    });
    tl = { start: performance.now(), spoken: spoken, cut: spoken + CUT_AFTER };
    later(powerCut, tl.cut);
    startLoop();
  };

  /* ── 열고 닫기 ── */
  var open = function (mode) {
    gate.hidden = false;
    root.classList.add("gate-open");
    outside.forEach(function (el) { el.inert = true; });
    var go = function () {
      if (!scene && mode !== "end") scene = makeScene();
      if (scene) scene.resize();
      if (mode === "end") { build(pick(true)); endState(); }
      else play(mode === "first");
    };
    // 글꼴이 늦게 오면 기다리지 않고 대체 글꼴로 시작한다
    var fonts = document.fonts && document.fonts.load
      ? Promise.all([document.fonts.load('700 40px "HeirofLightBold"', "끝난 게 아니야"), document.fonts.load('600 15px "IBM Plex Sans KR"', "구조율")])
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
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (location.hash === "#gate") { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
    var main = document.getElementById("cover");
    if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
  };

  btnSkip.addEventListener("click", function () { if (phase === "play" || phase === "cut") endState(); });
  btnReplay.addEventListener("click", function () {
    if (!scene) { scene = makeScene(); if (scene) scene.resize(); }
    play(false);
  });
  btnEnter.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || gate.hidden) return;
    e.preventDefault();
    if (phase === "play" || phase === "cut") endState(); else close();
  });
  window.addEventListener("resize", function () { if (!gate.hidden) { if (scene) scene.resize(); fit(); } });
  Array.prototype.forEach.call(document.querySelectorAll("[data-replay-gate]"), function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); open("first"); });
  });

  // 주소 끝에 #gate 를 붙이면 처음부터 다시 본다
  var forced = location.hash === "#gate";
  if (forced) open("first");
  else if (B.session.get("blackout.gate") !== "seen") open(B.local.get("blackout.intro") === "1" ? "end" : "first");
})();
