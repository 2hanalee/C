/* =====================================================================
   SOFTWARE (beats 25-40, 12-20 s) — the career explorer builds itself out
   of the caret, the path steps up to "Game Developer", and the chosen card
   flips (true perspective) into the game screen.
   ===================================================================== */
const SW = (() => {
  const TXT = 'SOFTWARE — CAREER EXPLORER', NA = 8, TS = 58;
  const PILL = { cx: 960, cy: 540, w: 1240, h: 132 };
  const WIN = { x: 120, y: 80, w: 1680, h: 800, r: 30 }, TOPBAR_DY = 80;
  const ADDR = { cx: 960, cy: 120, w: 440, h: 46 };
  const CARD = { w: 480, h: 520, r: 26 };
  const CX = [420, 960, 1500], CY0 = 480, STAIR = [598, 484, 370], SSC = 0.78;
  const NAMES = ['Engineer', 'Designer', 'Game Developer'], MATCH = [7, 5, 9], LAND = [14.0, 14.5, 15.0];
  const ENTER = 13.5, T_TYPE = 12.5, DT_TYPE = 0.034, STAIR_T = 17.0, CLICK = 18.0, OUT = 18.5, FLIP0 = 19.0, FLIP1 = 19.5;
  const BAR = { x: 120, y: 100, w: 1680, h: 35 };          // where the health bar will be
  let adv = [], capT, capL, TX0, TB, CHIP_A;
  const [fcv, fctx] = mkCanvas(2000, 1140);

  function init() {
    ctx.font = F(900, TS);
    adv = [...Array(TXT.length + 1)].map((_, i) => ctx.measureText(TXT.slice(0, i)).width);
    capT = ctx.measureText('H').actualBoundingBoxAscent;
    ctx.font = F(900, 64); capL = ctx.measureText('H').actualBoundingBoxAscent;
    TX0 = PILL.cx - PILL.w / 2 + 24 + 84 + 30; TB = PILL.cy + capT / 2;
    CHIP_A = TYPE.aGeom(0, 22, 46, 46 * 0.52, 46 * 0.24);     // tiny A mark, chip-local (centre x = 0, baseline 22)
  }
  const typedN = t => t < T_TYPE ? 0 : clamp(Math.floor((t - T_TYPE) / DT_TYPE) + 1, 0, TXT.length);
  const T_TYPED = T_TYPE + (TXT.length - 1) * DT_TYPE;
  const lr = (A, B, p) => ({ x: lerp(A.x, B.x, p), y: lerp(A.y, B.y, p), w: lerp(A.w, B.w, p), h: lerp(A.h, B.h, p), r: lerp(A.r, B.r, p) });
  const RPILL = { x: PILL.cx - PILL.w / 2, y: PILL.cy - PILL.h / 2, w: PILL.w, h: PILL.h, r: PILL.h / 2 };
  const RWIN = { ...WIN }, RADDR = { x: ADDR.cx - ADDR.w / 2, y: ADDR.cy - ADDR.h / 2, w: ADDR.w, h: ADDR.h, r: ADDR.h / 2 };
  function strokeRR(R, lw, col) { rr(ctx, R.x + lw / 2, R.y + lw / 2, R.w - lw, R.h - lw, Math.max(0, R.r - lw / 2)); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.stroke(); }

  /* ---------- card geometry (centre, scale) as a function of time ---------- */
  function hover(i, t) {
    const on = 15.45 + 0.5 * i, off = i < 2 ? on + 0.5 : 99;
    return trk([[0, 0], [on, 1, .22], [off, 0, .22]], t);
  }
  function card(i, t) {
    const st = spring(t - STAIR_T - i * 0.06, 14, 0.9), hov = hover(i, t);
    let x = CX[i], y = lerp(CY0, STAIR[i], st) - (1 - eo((t - LAND[i]) / 0.32)) * 860 - 16 * hov, s = lerp(1, SSC, st);
    if (i < 2) y += ci(seg(t, OUT + i * 0.04, OUT + 0.26 + i * 0.04)) * 1000;
    else { const q = spring(t - OUT, 12, 0.9); x = lerp(x, 960, q); y = lerp(y, 540, q); s = lerp(s, 1, q); }
    const press = i === 2 ? 0.04 * Math.sin(Math.PI * seg(t, CLICK - 0.02, CLICK + 0.16)) : 0;
    return { x, y, s: s * (1 - press) };
  }
  function filled(i, t) {
    if (i === 2 && t >= CLICK + 0.02) return 10;
    return Math.min(MATCH[i], Math.max(0, Math.floor((t - LAND[i] - 0.3) / 0.0625) + 1));
  }

  /* ---------- card faces ---------- */
  function glyph(c, i) {
    c.save(); c.strokeStyle = C.w; c.fillStyle = C.w; c.lineWidth = 9; c.lineJoin = 'miter';
    c.translate(44 + 42, 44 + 42);
    if (i === 0) {          // gear
      for (let k = 0; k < 8; k++) { c.save(); c.rotate(k * Math.PI / 4); c.fillRect(-8, -42, 16, 14); c.restore(); }
      c.beginPath(); c.arc(0, 0, 28, 0, TAU); c.stroke(); c.beginPath(); c.arc(0, 0, 9, 0, TAU); c.fill();
    } else if (i === 1) {   // pen nib
      pathPts(c, [[0, -40], [28, 4], [0, 40], [-28, 4]], true); c.stroke();
      line(c, 0, 40, 0, 6, 7, C.w); c.beginPath(); c.arc(0, 2, 8, 0, TAU); c.fill();
    } else {                // d-pad
      c.fillRect(-40, -13, 80, 26); c.fillRect(-13, -40, 26, 80);
      c.fillStyle = C.bl; c.fillRect(-6, -6, 12, 12);
    }
    c.restore();
  }
  function cardFront(c, i, t, w, h, r) {
    c.fillStyle = C.bl; rr(c, 0, 0, w, h, r); c.fill();
    const k = Math.min(w / CARD.w, h / CARD.h);
    c.save(); c.translate((w - CARD.w * k) / 2, (h - CARD.h * k) / 2); c.scale(k, k);
    glyph(c, i);
    c.fillStyle = C.w; c.font = F(900, 50); c.textBaseline = 'alphabetic'; c.fillText(NAMES[i], 40, 392);
    const n = filled(i, t), sw = (CARD.w - 80 - 9 * 8) / 10;
    for (let k2 = 0; k2 < 10; k2++) {
      const x = 40 + k2 * (sw + 8), y = 432;
      const lime = i === 2 && t >= CLICK + 0.05 + k2 * 0.03;
      if (k2 < n) { c.fillStyle = lime ? C.li : C.w; c.fillRect(x, y, sw, 26); }
      else { c.strokeStyle = C.w; c.lineWidth = 3; c.strokeRect(x + 1.5, y + 1.5, sw - 3, 23); }
    }
    c.restore();
  }
  // back of the chosen card = the game screen: black, with the lime meter where the health bar will sit
  function cardBack(c, t, w, h, r) {
    c.fillStyle = C.k; rr(c, 0, 0, w, h, r); c.fill();
    const kx = w / 1944, ky = h / 1104, gap = 8 * (1 - eo(seg(t, FLIP1, FLIP1 + 0.35))), sw = (BAR.w - 9 * gap) / 10;
    c.fillStyle = C.li;
    for (let k = 0; k < 10; k++) c.fillRect((BAR.x + 12 + k * (sw + gap)) * kx, (BAR.y + 12) * ky, sw * kx + 0.5, BAR.h * ky);
  }
  // rotate a face about its vertical axis with real perspective, drawn as thin vertical strips
  function persp(src, sw, sh, cx, cy, ang, zs) {
    const f = 2600, N = 120, c = Math.cos(ang), s = Math.sin(ang) * zs;
    for (let j = 0; j < N; j++) {
      const xa = -sw / 2 + sw * j / N, xb = -sw / 2 + sw * (j + 1) / N;
      const ka = f / (f + xa * s), kb = f / (f + xb * s), km = (ka + kb) / 2;
      const Xa = cx + xa * c * ka, Xb = cx + xb * c * kb;
      ctx.drawImage(src, sw * j / N, 0, sw / N, sh, Xa, cy - sh / 2 * km, Math.max(0.5, Xb - Xa + 0.7), sh * km);
    }
  }

  /* ---------- the stepped career path (the line again) ---------- */
  function pathPts2(t) {
    const R = [0, 1, 2].map(i => { const c = card(i, t); return { l: c.x - CARD.w * c.s / 2, r: c.x + CARD.w * c.s / 2, b: c.y + CARD.h * c.s / 2 }; });
    const y = R.map(q => q.b + 34), g01 = (R[0].r + R[1].l) / 2, g12 = (R[1].r + R[2].l) / 2;
    return [[WIN.x + 40, y[0]], [g01, y[0]], [g01, y[1]], [g12, y[1]], [g12, y[2]], [WIN.x + WIN.w - 60, y[2]]];
  }
  function drawPath(t) {
    if (t < STAIR_T + 0.1 || t > OUT + 0.4) return;
    const P = pathPts2(t), m = ptsLen(P), cut = ci(seg(t, OUT, OUT + 0.3));
    // each segment draws on a 16th note
    let reach = 0;
    for (let k = 0; k < 5; k++) { const e = eo((t - STAIR_T - 0.125 - k * 0.125) / 0.12); reach = (m.cum[k] + (m.cum[k + 1] - m.cum[k]) * e) / m.L; if (e < 1) break; }
    const pts = trimPts(P, cut, reach);
    if (pts.length > 1) strokePts(ctx, pts, 6, C.k, 'miter', 'butt');
    for (let k = 1; k < 5; k++) {
      const f = m.cum[k] / m.L; if (f > reach + 1e-4 || f < cut) continue;
      const r = 11 * spring(t - STAIR_T - 0.125 - (k - 1) * 0.125 - 0.12, 26, 0.85);
      ctx.fillStyle = C.k; ctx.beginPath(); ctx.arc(P[k][0], P[k][1], r, 0, TAU); ctx.fill();
    }
    if (reach > 0.999 && cut < 0.98) {        // arrowhead
      const e = P[5], a = spring(t - STAIR_T - 0.125 - 5 * 0.125, 24, 0.85);
      fillPts(ctx, [[e[0] + 28 * a, e[1]], [e[0] - 6, e[1] - 17 * a], [e[0] - 6, e[1] + 17 * a]], C.k);
    }
  }

  /* ---------- pointer ---------- */
  function pointer(t) {
    const tgt = i => { const c = card(i, t); return [c.x + 70 * c.s, c.y + 30 * c.s]; };
    const c0 = tgt(0), c1 = tgt(1), c2 = tgt(2);
    let x = trk([[0, 1980], [15.2, c0[0], .3], [15.7, c1[0], .3], [16.2, c2[0], .3]], t);
    let y = trk([[0, 1160], [15.2, c0[1], .3], [15.7, c1[1], .3], [16.2, CY0 + 30, .3]], t);
    if (t > 16.2) { const k = sp((t - 16.2) / 0.3); x = lerp(x, c2[0], k); y = lerp(y, c2[1], k); }
    const ex = ci(seg(t, OUT, OUT + 0.32)); x = lerp(x, 2150, ex); y = lerp(y, 1260, ex);
    return [x, y, Math.sin(Math.PI * seg(t, CLICK - 0.02, CLICK + 0.14))];
  }

  function draw(t) {
    ctx.fillStyle = C.w; ctx.fillRect(0, 0, W, H);
    if (t >= FLIP1) {                                   // the card back now IS the screen
      ctx.fillStyle = C.k; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(-12, -12); cardBack(ctx, t, 1944, 1104, 0); ctx.restore();
      GAME.stageVector(t);
      return;
    }
    // -- the caret stretches into the search pill (12.0-12.4), then the pill grows the window (13.5)
    const pIn = spring(t - 12.0, 15, 0.9);
    const pill = { x: PILL.cx - lerp(10, PILL.w, pIn) / 2, y: PILL.cy - lerp(76, PILL.h, pIn) / 2, w: lerp(10, PILL.w, pIn), h: lerp(76, PILL.h, pIn) };
    pill.r = pill.h / 2;
    const pw = spring(t - ENTER - 0.05, 13, 0.9), pa = spring(t - ENTER, 15, 0.9), outP = ci(seg(t, OUT, OUT + 0.26));
    const c2 = card(2, t), c2R = { x: c2.x - CARD.w * c2.s / 2, y: c2.y - CARD.h * c2.s / 2, w: CARD.w * c2.s, h: CARD.h * c2.s, r: CARD.r * c2.s };
    if (t < ENTER) strokeRR(pill, 5, mix(C.bl, C.k, eo((t - 12.0) / 0.2)));
    else {
      const win = lr(lr(RPILL, RWIN, pw), { x: 960, y: 480, w: 0, h: 0, r: 0 }, outP), addr = lr(RPILL, RADDR, pa);
      strokeRR(win, 5, C.k);
      const tb = eo((t - ENTER - 0.14) / 0.36) * (1 - outP), yb = win.y + TOPBAR_DY * win.h / WIN.h;
      if (tb > 0.002) line(ctx, 960 - win.w / 2 * tb, yb, 960 + win.w / 2 * tb, yb, 4, C.k);
      const ao = 1 - ci(seg(t, OUT, OUT + 0.24));
      if (ao > 0.01) strokeRR({ x: addr.x + addr.w * (1 - ao) / 2, y: addr.y + addr.h * (1 - ao) / 2, w: addr.w * ao, h: addr.h * ao, r: addr.r * ao }, 4, C.k);
    }
    // -- the chip (A mark) lives in the pill, then in the address bar
    {
      const pop = spring(t - 12.22, 20, 0.86), toA = spring(t - ENTER, 15, 0.9), ao = 1 - ci(seg(t, OUT, OUT + 0.24));
      const s = lerp(84, 30, toA) * pop * ao;
      if (s > 0.5) {
        const cx = lerp(PILL.cx - PILL.w / 2 + 24 + 42, ADDR.cx - ADDR.w / 2 + 12 + 15, toA), cy = lerp(PILL.cy, ADDR.cy, toA);
        ctx.fillStyle = C.bl; rr(ctx, cx - s / 2, cy - s / 2, s, s, s * 0.22); ctx.fill();
        ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 84, s / 84); TYPE.drawA(ctx, CHIP_A.chain, CHIP_A.w, C.w, CHIP_A.base); ctx.restore();
      }
    }
    // -- cards (clipped to the window while they drop in)
    for (let i = 0; i < 3; i++) {
      if (t < LAND[i]) continue;
      if (i === 2 && t >= FLIP0) continue;
      const draw1 = tt => {
        const c = card(i, tt);
        ctx.save(); ctx.translate(c.x, c.y); ctx.scale(c.s, c.s); ctx.translate(-CARD.w / 2, -CARD.h / 2);
        cardFront(ctx, i, t, CARD.w, CARD.h, CARD.r); ctx.restore();
      };
      ctx.save();
      if (t < LAND[i] + 0.4) { ctx.beginPath(); ctx.rect(WIN.x, WIN.y + TOPBAR_DY + 2, WIN.w, WIN.h - TOPBAR_DY - 4); ctx.clip(); }
      const fast = t < LAND[i] + 0.3 || (i < 2 && t > OUT);
      if (fast) { const ga = ctx.globalAlpha; for (let k = 6; k >= 1; k--) { ctx.globalAlpha = 0.26 * (1 - k / 7); draw1(t - k / 240); } ctx.globalAlpha = ga; }
      draw1(t);
      ctx.restore();
    }
    // -- selection frame + handles on the chosen card (echo of the hook)
    if (t >= CLICK && t < OUT + 0.2) {
      const a = spring(t - CLICK, 22, 0.86) * (1 - ci(seg(t, OUT, OUT + 0.2))), c = card(2, t), m = 22;
      const w = (CARD.w * c.s + 2 * m) * a, h = (CARD.h * c.s + 2 * m) * a, x = c.x - w / 2, y = c.y - h / 2;
      if (a > 0.02) {
        ctx.strokeStyle = C.k; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) continue;
          const hx = x + w * i / 2, hy = y + h * j / 2;
          ctx.fillStyle = C.w; ctx.fillRect(hx - 9, hy - 9, 18, 18); ctx.strokeStyle = C.k; ctx.lineWidth = 3; ctx.strokeRect(hx - 9, hy - 9, 18, 18);
        }
      }
    }
    drawPath(t);
    // -- the flip: front (blue) -> back (black game screen), growing to cover the frame
    if (t >= FLIP0 - 0.05) {
      const e = eio(seg(t, FLIP0 - 0.05, FLIP1)), th = Math.PI * eio(seg(t, FLIP0, FLIP1)), c = card(2, t);
      const w = lerp(CARD.w * c.s, 1944, e), h = lerp(CARD.h * c.s, 1104, e), r = lerp(CARD.r, 0, e);
      const cx = lerp(c.x, 960, e), cy = lerp(c.y, 540, e);
      const sw = Math.ceil(w), sh = Math.ceil(h);
      fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.clearRect(0, 0, Math.min(2000, sw + 2), Math.min(1140, sh + 2));
      if (th < Math.PI / 2) { cardFront(fctx, 2, t, sw, sh, r); persp(fcv, sw, sh, cx, cy, th, 1); }
      else { cardBack(fctx, t, sw, sh, r); persp(fcv, sw, sh, cx, cy, Math.PI - th, -1); }
    }
    // -- pointer
    if (t >= 15.15 && t < OUT + 0.35) { const p = pointer(t); drawPointer(ctx, p[0], p[1], 2.7, C.k, C.w, p[2]); }
    // -- typed text: in the pill, then it flies to the label slot and leaves at OUT
    const n = typedN(t);
    if (n > 0) {
      const fly = spring(t - ENTER, 14, 0.9), x = lerp(TX0, LABEL.x, fly), y = lerp(TB, LABEL.y, fly), s = lerp(1, 64 / TS, fly);
      ctx.save();
      if (t > OUT - 0.14) { ctx.beginPath(); ctx.rect(0, LABEL.y - capL - 22, W, capL + 40); ctx.clip(); }
      const dyA = ei((t - OUT + 0.08) / 0.24) * 96, dyB = ei((t - OUT + 0.04) / 0.24) * 96;
      ctx.translate(x, y); ctx.scale(s, s); ctx.font = F(900, TS); ctx.textBaseline = 'alphabetic';
      const str = TXT.slice(0, n);
      ctx.fillStyle = C.bl; ctx.fillText(str.slice(0, NA), 0, dyA / s);
      if (n > NA) { ctx.fillStyle = C.k; ctx.fillText(str.slice(NA), adv[NA], dyB / s); }
      ctx.restore();
    }
    // -- caret: the field caret in the centre, then the typing caret (blinks on 8ths when idle)
    if (t < 12.3) {
      // still the caret itself (drawn by the pill stroke); nothing extra
    } else if (t < ENTER) {
      const idle = t < T_TYPE || t > T_TYPED + 0.03, vis = !idle || Math.floor((t - 12.3) / 0.125) % 2 === 0;
      if (vis) { const x = TX0 + adv[n] + (n ? 8 : 0); ctx.fillStyle = C.bl; ctx.fillRect(x, TB - capT - 10, 7, capT + 22); }
    }
  }
  return { init, draw };
})();
