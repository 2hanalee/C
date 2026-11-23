/* =====================================================================
   GAME DEV (beats 41-56, 20-27.75 s) — an original 2D fighter on a real
   384x216 pixel grid (5 px pixels, hard alpha, no anti-aliasing)
   ===================================================================== */
const GAME = (() => {
  const LW = 384, LH = 216, FLOOR = 178, ENDT = 27.75, COLLAPSE = 27.5, KO = 26.0;
  const [low, lx] = mkCanvas(LW, LH, true);
  const DIM = c => css(mix3(as3(c), K3, 0.42)), TINT = css(mix3(LI3, K3, 0.8)), FLOORD = css(mix3(W3, K3, 0.82));
  let EMB;                                   // background emblem (the A, as a lowres outline)

  /* ---------- poses: degrees relative to facing (0 forward, 90 down, -90 up) ---------- */
  const POSE = {
    stance: { tor: -80, fu: 35, ff: -70, bu: 70, bf: -55, ft: 66, fs: 98, bt: 116, bs: 100 },
    guard:  { tor: -86, fu: -25, ff: -100, bu: 5, bf: -105, ft: 66, fs: 98, bt: 116, bs: 100 },
    jab:    { tor: -72, fu: -2, ff: -2, bu: 80, bf: -60, ft: 60, fs: 96, bt: 120, bs: 100 },
    cross:  { tor: -66, fu: 50, ff: -62, bu: -4, bf: -4, ft: 58, fs: 95, bt: 124, bs: 100 },
    hurt:   { tor: -106, fu: 78, ff: 28, bu: 118, bf: 48, ft: 72, fs: 100, bt: 110, bs: 95 },
    kick:   { tor: -120, fu: 60, ff: -40, bu: 110, bf: -30, ft: -8, fs: -2, bt: 95, bs: 92 },
    sweep:  { tor: -52, fu: 100, ff: 82, bu: 140, bf: 118, ft: 30, fs: 14, bt: 150, bs: 95 },
    fall:   { tor: -132, fu: 150, ff: 118, bu: 165, bf: 142, ft: 18, fs: 40, bt: 40, bs: 62 },
    crouch: { tor: -64, fu: 18, ff: -72, bu: 58, bf: -62, ft: 22, fs: 108, bt: 148, bs: 72 },
    jump:   { tor: -76, fu: -12, ff: -82, bu: 40, bf: -62, ft: 12, fs: 112, bt: 62, bs: 132 },
    dash:   { tor: -50, fu: 30, ff: -40, bu: 120, bf: 160, ft: 40, fs: 100, bt: 150, bs: 110 },
    upper:  { tor: -66, fu: -80, ff: -96, bu: 110, bf: 50, ft: 35, fs: 115, bt: 125, bs: 70 },
    launch: { tor: -150, fu: -165, ff: -172, bu: -140, bf: -150, ft: 20, fs: 50, bt: 40, bs: 70 },
    lying:  { tor: -180, fu: -200, ff: -186, bu: -160, bf: -176, ft: 4, fs: 0, bt: -6, bs: 4 },
    win:    { tor: -88, fu: -84, ff: -92, bu: 100, bf: -40, ft: 68, fs: 92, bt: 112, bs: 98 },
  };
  const KEYS_O = [[0, 'stance'], [21.0, 'jab'], [21.22, 'stance'], [21.53, 'hurt'], [21.8, 'stance'], [22.0, 'cross'], [22.25, 'jab'], [22.5, 'kick'], [22.72, 'stance'],
    [23.04, 'fall'], [23.5, 'jump'], [23.75, 'stance'], [24.0, 'crouch'], [24.5, 'jump'], [24.92, 'jab'], [25.25, 'hurt'], [25.45, 'stance'], [25.5, 'dash'], [26.0, 'upper'], [26.5, 'stance'], [27.0, 'win']];
  const KEYS_B = [[0, 'stance'], [20.98, 'guard'], [21.25, 'stance'], [21.5, 'kick'], [21.72, 'stance'], [22.02, 'hurt'], [22.2, 'stance'], [22.27, 'hurt'], [22.45, 'stance'], [22.52, 'hurt'], [22.8, 'stance'],
    [23.0, 'sweep'], [23.4, 'stance'], [24.0, 'crouch'], [24.5, 'jump'], [24.92, 'kick'], [25.25, 'hurt'], [25.45, 'stance'], [25.7, 'guard'], [26.02, 'launch'], [26.6, 'lying']];
  function poseAt(keys, t) {
    let i = 0; while (i + 1 < keys.length && keys[i + 1][0] <= t) i++;
    if (i === 0) return POSE[keys[0][1]];
    const A = POSE[keys[i - 1][1]], B = POSE[keys[i][1]], f = eo((t - keys[i][0]) / 0.085), o = {};
    for (const k in A) o[k] = lerp(A[k], B[k], f);
    return o;
  }
  const bob = t => (t >= 20.5 && t < 24.0) ? 1.6 * Math.exp(-((t - 20.5) % 0.5) * 12) : 0;
  // the leap: up to the clash, hang (time stops), knocked back down
  const leap = t => t < 24.5 ? 0 : t < 25.0 ? Math.sin(Math.PI / 2 * seg(t, 24.5, 25.0)) : t < 25.25 ? 1 : Math.cos(Math.PI / 2 * qi(seg(t, 25.25, 25.5)));
  function fO(t) {
    const x = trk([[0, 150], [21.0, 170, .12], [21.25, 158, .2], [21.53, 145, .12], [21.8, 152, .3], [22.0, 168, .1], [22.25, 173, .1], [22.5, 179, .1], [22.75, 164, .25],
      [23.04, 150, .16], [24.5, 184, .5, lin], [25.25, 150, .25, lin], [25.5, 204, .45], [26.0, 212, .12], [26.5, 196, .3]], t);
    let y = FLOOR - 25 + bob(t) + trk([[0, 0], [23.04, 11, .12], [23.5, 0, .14], [24.0, 8, .18], [24.5, 0, .08], [25.5, 6, .15], [26.0, 0, .08]], t);
    y -= 15 * Math.sin(Math.PI * seg(t, 23.5, 23.78)) + 36 * leap(t) + 17 * Math.sin(Math.PI * seg(t, 26.0, 26.5));
    return { x, y, f: 1, pose: poseAt(KEYS_O, t), col: C.or, who: 0 };
  }
  function fB(t) {
    let x = trk([[0, 234], [21.06, 239, .1], [21.25, 234, .2], [21.5, 224, .12], [21.75, 232, .25], [22.02, 237, .08], [22.27, 242, .08], [22.52, 254, .14], [22.8, 250, .2],
      [23.0, 214, .14], [23.4, 236, .3], [24.5, 200, .5, lin], [25.25, 236, .25, lin], [25.5, 226, .4]], t);
    let y = FLOOR - 25 + bob(t) + trk([[0, 0], [23.0, 6, .1], [23.4, 0, .15], [24.0, 8, .18], [24.5, 0, .08]], t) - 36 * leap(t);
    if (t >= KO) { const u = clamp((t - KO) / 0.62); x += 78 * (1 - (1 - u) * (1 - u)); y = lerp(FLOOR - 25, FLOOR - 5, u) - 66 * 4 * u * (1 - u); }
    return { x, y, f: -1, pose: poseAt(KEYS_B, t), col: C.bl, who: 1 };
  }

  /* ---------- rig + sprite ---------- */
  function rig(Fi) {
    const p = Fi.pose, d = a => [Fi.f * Math.cos(a * D2R), Math.sin(a * D2R)];
    const add = (P, a, L) => { const v = d(a); return [P[0] + v[0] * L, P[1] + v[1] * L]; };
    const Hp = [Fi.x, Fi.y], N = add(Hp, p.tor, 21), Sh = add(Hp, p.tor, 18), head = add(Hp, p.tor, 27.5);
    const bE = add(Sh, p.bu, 10), bH = add(bE, p.bf, 10), fE = add(Sh, p.fu, 10), fH = add(fE, p.ff, 10);
    const bK = add(Hp, p.bt, 13), bF = add(bK, p.bs, 13), fK = add(Hp, p.ft, 13), fF = add(fK, p.fs, 13);
    return { Hp, N, Sh, head, bE, bH, fE, fH, bK, bF, fK, fF, d };
  }
  function seg2(a, b, w, col) { lx.strokeStyle = col; lx.lineWidth = w; lx.beginPath(); lx.moveTo(a[0], a[1]); lx.lineTo(b[0], b[1]); lx.stroke(); }
  function sq(p, s, col) { lx.fillStyle = col; lx.fillRect(Math.round(p[0] - s / 2), Math.round(p[1] - s / 2), s, s); }
  // parts in draw order; each is assembled from the health bar at the start
  function drawFighter(Fi, t, origin, ink, shade) {
    const r = rig(Fi), main = ink || shade || Fi.col, back = ink || (shade ? css(mix3(as3(shade), K3, 0.4)) : DIM(Fi.col));
    const det = ink || (shade ? null : C.w);
    lx.lineCap = 'square';
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const parts = [
      [() => { seg2(r.Sh, r.bE, 5, back); seg2(r.bE, r.bH, 5, back); sq(r.bH, 5, back); }, mid(r.Sh, r.bH)],
      [() => { seg2(r.Hp, r.bK, 6, back); seg2(r.bK, r.bF, 5, back); sq([r.bF[0] + Fi.f * 1.5, r.bF[1]], 5, back); }, mid(r.Hp, r.bF)],
      [() => {
        seg2(r.Hp, r.N, 10, main);
        if (det && !shade) { const b0 = [r.Hp[0] + r.d(Fi.pose.tor)[0] * 3, r.Hp[1] + r.d(Fi.pose.tor)[1] * 3]; seg2([b0[0] - 4, b0[1]], [b0[0] + 4, b0[1]], 2, Fi.who ? C.k : C.w); }
      }, mid(r.Hp, r.N)],
      [() => {
        sq(r.head, 11, main);
        if (det && !shade) {
          const hx = Math.round(r.head[0]), hy = Math.round(r.head[1]);
          if (Fi.who === 0) {        // headband with two tails trailing behind
            lx.fillStyle = C.w; lx.fillRect(hx - 6, hy - 3, 12, 2);
            const tb = -Fi.f, sw = Math.sin(t * 13) * 1.6;
            seg2([hx + tb * 6, hy - 2], [hx + tb * 12, hy - 1 + sw], 2, C.w); seg2([hx + tb * 12, hy - 1 + sw], [hx + tb * 17, hy + 1 - sw], 2, C.w);
          } else {                   // visor + three spikes
            lx.fillStyle = C.w; lx.fillRect(hx + (Fi.f > 0 ? -1 : -5), hy - 2, 6, 3);
            lx.fillStyle = main; for (let k = 0; k < 3; k++) lx.fillRect(hx - 5 + k * 4, hy - 8, 2, 3);
          }
        }
      }, r.head],
      [() => { seg2(r.Hp, r.fK, 6, main); seg2(r.fK, r.fF, 5, main); sq([r.fF[0] + Fi.f * 1.5, r.fF[1]], 5, main); }, mid(r.Hp, r.fF)],
      [() => { seg2(r.Sh, r.fE, 5, main); seg2(r.fE, r.fH, 5, main); sq(r.fH, 6, main); }, mid(r.Sh, r.fH)],
    ];
    parts.forEach((pt, k) => {
      const e = origin ? eo((t - 20.08 - k * 0.04) / 0.3) : 1;
      if (e <= 0) return;
      lx.save();
      if (e < 1) { const o = origin(k); lx.translate((1 - e) * (o[0] - pt[1][0]), (1 - e) * (o[1] - pt[1][1])); }
      pt[0](); lx.restore();
    });
    return r;
  }
  function health(t, who) {
    let v, tr;
    if (who === 1) {
      v = 1 - 0.18 * eo((t - 22.02) / 0.06) - 0.12 * eo((t - 22.27) / 0.06) - 0.15 * eo((t - 22.52) / 0.06) - 0.15 * eo((t - 25.0) / 0.06) - 0.4 * eo((t - KO) / 0.3);
      tr = 1 - 0.45 * eo((t - 22.8) / 0.3) - 0.15 * eo((t - 25.4) / 0.3) - 0.4 * eo((t - 26.35) / 0.35);
    } else {
      v = 1 - 0.28 * eo((t - 21.53) / 0.06) - 0.22 * eo((t - 23.04) / 0.06) - 0.1 * eo((t - 25.0) / 0.06);
      tr = 1 - 0.28 * eo((t - 21.8) / 0.3) - 0.22 * eo((t - 23.3) / 0.3) - 0.1 * eo((t - 25.4) / 0.3);
    }
    const rf = eo((t - 27.18) / 0.2);
    return [lerp(v, 1, rf), lerp(Math.max(v, tr), 1, rf)];
  }
  // impact marks: square rings that expand once
  const HITS = [[21.06, 1, 'B.fH', 10], [21.55, 0, 'O.N', 14], [22.03, 1, 'B.N', 14], [22.28, 1, 'B.head', 14], [22.53, 1, 'B.N', 20], [23.05, 0, 'O.fK', 14], [25.0, 2, 'mid', 44], [KO, 1, 'B.head', 74]];

  // emblem (the A again, a thin outline behind the stage) + floor; k = 1 lowres pixels, k = 5 screen vectors
  function stage(c, t, k, hitF) {
    const em = eo(seg(t, 19.55, 20.25)), fp = eo((t - 19.5) / 0.35);
    c.save(); c.scale(k, k);
    c.lineWidth = 1; c.lineJoin = 'miter'; c.strokeStyle = hitF ? C.k : TINT;
    if (em > 0) {
      const o = trimPts(EMB.outer, 0, em); if (o.length > 1) { pathPts(c, o); c.stroke(); }
      if (EMB.hole) { const h = trimPts(EMB.hole, 0, em); if (h.length > 1) { pathPts(c, h); c.stroke(); } }
    }
    c.fillStyle = hitF ? C.k : C.w; c.fillRect(192 - 300 * fp, FLOOR, 600 * fp, 1);
    c.fillStyle = hitF ? C.k : FLOORD;
    for (let x = -120; x < 520; x += 12) if (Math.abs(x + 3 - 192) < 300 * fp) c.fillRect(x, FLOOR + 4, 6, 1);
    for (let x = -126; x < 520; x += 20) if (Math.abs(x + 5 - 192) < 300 * fp) c.fillRect(x, FLOOR + 9, 10, 1);
    c.restore();
  }
  function stageVector(t) { stage(ctx, t, 5, false); }
  function init() {
    const G = TYPE.aGeom(192, FLOOR, 150, 150 * 0.52, 150 * 0.17);
    EMB = { outer: G.outer.concat([G.outer[0]]), hole: G.hole ? G.hole.concat([G.hole[0]]) : null };
  }

  function draw(t) {
    if (t >= ENDT) { ctx.fillStyle = C.k; ctx.fillRect(0, 0, W, H); TYPE.drawEnd(t); return; }
    ctx.fillStyle = C.k; ctx.fillRect(0, 0, W, H);
    lx.setTransform(1, 0, 0, 1, 0, 0); lx.clearRect(0, 0, LW, LH);
    const hitF = (t >= KO && t < KO + 0.05) || (t >= 25.0 && t < 25.034);
    const ink = hitF ? C.k : null;
    if (hitF) { lx.fillStyle = C.li; lx.fillRect(0, 0, LW, LH); }
    const ex = ei((t - COLLAPSE) / 0.17);
    const O = fO(t), B = fB(t);
    // world camera: push in through bars 11-13, punch at the K.O., follow the action sideways
    const z = 1 + 0.24 * eio(seg(t, 20.0, 20.9)) + 0.08 * eio(seg(t, 20.9, 24.0)) + 0.09 * eio(seg(t, 24.0, 25.9)) + 0.16 * eo((t - KO) / 0.08) * (1 - eio(seg(t, KO + 0.15, KO + 0.9)));
    const mid = (O.x + Math.min(B.x, 260)) / 2, track = (192 - mid) * 0.65 * eio(seg(t, 20.5, 21.5));
    lx.save();
    lx.translate(192, 168); lx.scale(z, z); lx.translate(-192 + track, -168 + ex * 270);
    stage(lx, t, 1, hitF);
    // fighters (assembled out of the health bars), with dash afterimages
    const inv = (x, y) => [(x - 192) / z + 192 - track, (y - 168) / z + 168 - ex * 270];   // screen -> world
    const oL = k => inv(24 + 150 * (k / 5), 23), oR = k => inv(360 - 150 * (k / 5), 23);
    const trail = (fn, t0, t1) => { if (t >= t0 && t < t1) [3, 2, 1].forEach(k => drawFighter(fn(t - k * 0.045), t, null, null, k === 3 ? css(mix3(as3(fn(t).col), K3, 0.78)) : k === 2 ? css(mix3(as3(fn(t).col), K3, 0.66)) : css(mix3(as3(fn(t).col), K3, 0.52)))); };
    trail(fB, 22.98, 23.12); trail(fO, 25.55, 26.1); trail(fO, 20.98, 21.08);
    const rB = drawFighter(B, t, t < 20.6 ? oR : null, ink);
    const rO = drawFighter(O, t, t < 20.6 ? oL : null, ink);
    // impacts
    HITS.forEach(([t0, who, at, size]) => {
      if (t < t0 || t > t0 + 0.4) return;
      let P;
      const RO = rig(fO(t0)), RB = rig(fB(t0));
      if (at === 'mid') P = [(RO.fH[0] + RB.fF[0]) / 2, (RO.fH[1] + RB.fF[1]) / 2];
      else { const [w, k] = at.split('.'); P = (w === 'O' ? RO : RB)[k]; }
      [[0, C.li], [0.06, C.w]].forEach(([dl, col], j) => {
        if (t < t0 + dl) return;
        const p = eo((t - t0 - dl) / 0.32), rr2 = 2 + size * p, lw = Math.max(0, (size > 40 ? 5 : 2.5) * (1 - p));
        if (lw < 0.6 || (j && size < 20)) return;
        lx.strokeStyle = hitF ? C.k : col; lx.lineWidth = lw; lx.lineCap = 'butt'; lx.strokeRect(P[0] - rr2, P[1] - rr2, rr2 * 2, rr2 * 2);
      });
    });
    void rO; void rB;
    lx.restore();
    // K . O .
    lx.font = F(900, 64); lx.textBaseline = 'alphabetic';
    const wK = lx.measureText('K.').width, wO = lx.measureText('O.').width, gp = 8, x0 = 192 - (wK + gp + wO) / 2, by = 90 + ex * 180;
    [['K.', x0, wK, 26.5], ['O.', x0 + wK + gp, wO, 27.0]].forEach(([s, x, w, t0]) => {
      if (t < t0) return;
      const sc = 1 + 1.8 * (1 - eo((t - t0) / 0.16));
      lx.save(); lx.translate(x + w / 2, by - 23); lx.scale(sc, sc); lx.fillStyle = C.li; lx.fillText(s, -w / 2, 23); lx.restore();
    });
    // HUD: health bars split out of the career meter
    if (t < COLLAPSE) {
      const g = eo((t - 20.0) / 0.25), fr = eo((t - 20.06) / 0.2);
      const Lb = [24, lerp(192, 180, g)], Rb = [lerp(192, 204, g), 360];
      const [hL, tL] = health(t, 0), [hR, tR] = health(t, 1);
      if (fr > 0.01) { lx.fillStyle = hitF ? C.k : C.w; lx.fillRect(Lb[0] - 1, 19, (Lb[1] - Lb[0] + 2) * fr, 9); lx.fillRect(Rb[1] + 1 - (Rb[1] - Rb[0] + 2) * fr, 19, (Rb[1] - Rb[0] + 2) * fr, 9); }
      lx.fillStyle = C.k; lx.fillRect(Lb[0], 20, Lb[1] - Lb[0], 7); lx.fillRect(Rb[0], 20, Rb[1] - Rb[0], 7);
      const wl = Lb[1] - Lb[0], wr = Rb[1] - Rb[0];
      lx.fillStyle = C.w; lx.fillRect(Lb[0], 20, wl * tL, 7); lx.fillRect(Rb[1] - wr * tR, 20, wr * tR, 7);
      lx.fillStyle = hitF ? C.k : C.li; lx.fillRect(Lb[0], 20, wl * hL, 7); lx.fillRect(Rb[1] - wr * hR, 20, wr * hR, 7);
    }
    // label, on the same pixel grid
    lx.save(); lx.beginPath(); lx.rect(0, 186, LW, 16); lx.clip();
    lx.font = F(900, 13);
    const dy = (1 - eo((t - 20.5) / 0.32)) * 16 + ei((t - COLLAPSE) / 0.15) * 16;
    lx.fillStyle = hitF ? C.k : C.li; lx.fillText('GAME DEV', 24, 198 + dy);
    lx.fillStyle = hitF ? C.k : C.w; lx.fillText(' — 2D FIGHTER', 24 + lx.measureText('GAME DEV').width, 198 + dy);
    lx.restore();
    // hard alpha threshold = real pixels
    const im = lx.getImageData(0, 0, LW, LH), d = im.data;
    for (let i = 3; i < d.length; i += 4) d[i] = d[i] >= 120 ? 255 : 0;
    lx.putImageData(im, 0, 0);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(low, 0, 0, W, H); ctx.imageSmoothingEnabled = true;
    // the bars leave the pixel grid and slide together into one line
    if (t >= COLLAPSE) {
      const p = eio(seg(t, COLLAPSE, COLLAPSE + 0.22)), col = mix(C.li, C.w, p);
      ctx.fillStyle = col;
      ctx.fillRect(lerp(115, 660, p), lerp(95, 532, p), lerp(790, 300, p), lerp(45, 16, p));
      ctx.fillRect(lerp(1015, 960, p), lerp(95, 532, p), lerp(790, 300, p), lerp(45, 16, p));
    }
  }
  return { init, draw, stageVector };
})();
