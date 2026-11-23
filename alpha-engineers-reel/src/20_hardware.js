/* =====================================================================
   HARDWARE (beats 9-24, 4-12 s) — blueprint -> toon-shaded 3D robot arms
   A tiny z-buffer rasteriser (2x supersampled) with screen-space ink lines.
   ===================================================================== */
const HW = (() => {
  const SS = 2, RW = W * SS, RH = H * SS;
  const idBuf = new Uint16Array(RW * RH), zBuf = new Float32Array(RW * RH), shBuf = new Uint8Array(RW * RH);
  const [rcv, rctx] = mkCanvas(RW, RH);
  const img = rctx.createImageData(RW, RH), px = new Uint32Array(img.data.buffer);
  let bx0, by0, bx1, by1;                               // dirty bbox (2x pixels)

  /* ---------- 3x4 matrices ---------- */
  function mmul(a, b) {
    const o = new Array(12);
    for (let r = 0; r < 3; r++) {
      const a0 = a[r * 4], a1 = a[r * 4 + 1], a2 = a[r * 4 + 2], a3 = a[r * 4 + 3];
      o[r * 4] = a0 * b[0] + a1 * b[4] + a2 * b[8];
      o[r * 4 + 1] = a0 * b[1] + a1 * b[5] + a2 * b[9];
      o[r * 4 + 2] = a0 * b[2] + a1 * b[6] + a2 * b[10];
      o[r * 4 + 3] = a0 * b[3] + a1 * b[7] + a2 * b[11] + a3;
    }
    return o;
  }
  const mT = (x, y, z) => [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z];
  const mS = (x, y, z) => [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0];
  const mRy = a => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0]; };
  const mRz = a => { const c = Math.cos(a), s = Math.sin(a); return [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0]; };
  const mRx = a => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0]; };
  const mApply = (m, p) => [m[0] * p[0] + m[1] * p[1] + m[2] * p[2] + m[3], m[4] * p[0] + m[5] * p[1] + m[6] * p[2] + m[7], m[8] * p[0] + m[9] * p[1] + m[10] * p[2] + m[11]];

  /* ---------- convex mesh builders (outward winding fixed automatically) ---------- */
  function finish(V, tris) {
    let cx = 0, cy = 0, cz = 0; for (const v of V) { cx += v[0]; cy += v[1]; cz += v[2]; } cx /= V.length; cy /= V.length; cz /= V.length;
    let ns = 0;
    for (const t of tris) {
      let A = V[t.a], B = V[t.b], Cc = V[t.c];
      let nx = (B[1] - A[1]) * (Cc[2] - A[2]) - (B[2] - A[2]) * (Cc[1] - A[1]);
      let ny = (B[2] - A[2]) * (Cc[0] - A[0]) - (B[0] - A[0]) * (Cc[2] - A[2]);
      let nz = (B[0] - A[0]) * (Cc[1] - A[1]) - (B[1] - A[1]) * (Cc[0] - A[0]);
      const mx = (A[0] + B[0] + Cc[0]) / 3 - cx, my = (A[1] + B[1] + Cc[1]) / 3 - cy, mz = (A[2] + B[2] + Cc[2]) / 3 - cz;
      if (nx * mx + ny * my + nz * mz < 0) { const q = t.b; t.b = t.c; t.c = q; const qn = t.nb; t.nb = t.nc; t.nc = qn; nx = -nx; ny = -ny; nz = -nz; }
      const l = Math.hypot(nx, ny, nz) || 1; t.n = [nx / l, ny / l, nz / l];
      if (!t.na) { t.na = t.nb = t.nc = t.n; t.flat = true; }
      ns = Math.max(ns, t.s + 1);
    }
    return { V, tris, ns };
  }
  function mBox8(P) {      // 8 corners: 0..3 = near-x ring, 4..7 = far-x ring
    const q = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5], [0, 1, 5, 4], [3, 2, 6, 7]], tris = [];
    q.forEach((f, s) => { tris.push({ a: f[0], b: f[1], c: f[2], s }); tris.push({ a: f[0], b: f[2], c: f[3], s }); });
    return finish(P, tris);
  }
  // box tapered along x: half-height h0 at x0 -> h1 at x1, half-depth d
  const mLink = (x0, x1, h0, h1, d) => mBox8([[x0, -h0, -d], [x0, h0, -d], [x0, h0, d], [x0, -h0, d], [x1, -h1, -d], [x1, h1, -d], [x1, h1, d], [x1, -h1, d]]);
  const mBox = (x0, x1, y0, y1, z0, z1) => mBox8([[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]);
  function mCyl(r, a0, a1, n, axis) {       // axis 'y' or 'z'
    const V = [], tris = [], P = (c, s, h) => axis === 'y' ? [r * c, h, r * s] : [r * c, r * s, h], N = (c, s) => axis === 'y' ? [c, 0, s] : [c, s, 0];
    const nrm = [];
    for (let i = 0; i < n; i++) { const th = i / n * TAU, c = Math.cos(th), s = Math.sin(th); V.push(P(c, s, a0), P(c, s, a1)); nrm.push(N(c, s)); }
    const cb = V.length; V.push(axis === 'y' ? [0, a0, 0] : [0, 0, a0]); const ct = V.length; V.push(axis === 'y' ? [0, a1, 0] : [0, 0, a1]);
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, b0 = i * 2, t0 = i * 2 + 1, b1 = j * 2, t1 = j * 2 + 1;
      tris.push({ a: b0, b: b1, c: t1, s: 0, na: nrm[i], nb: nrm[j], nc: nrm[j] });
      tris.push({ a: b0, b: t1, c: t0, s: 0, na: nrm[i], nb: nrm[j], nc: nrm[i] });
      tris.push({ a: ct, b: t0, c: t1, s: 1 });
      tris.push({ a: cb, b: b1, c: b0, s: 2 });
    }
    return finish(V, tris);
  }

  /* ---------- the arm ---------- */
  const A = { hS: 150, L1: 300, L2: 260, L3: 64, LF: 64 };
  const WHITE = 0, BLACK = 1;
  // frame ids: 0 root, 1 shoulder (no pitch), 2 upper arm, 3 forearm, 4 hand
  const PARTS = [
    { mesh: mCyl(130, 0, 22, 28, 'y'), mat: BLACK, fr: 0, grow: 'xz' },                     // base plate
    { mesh: mCyl(78, 22, 118, 28, 'y'), mat: WHITE, fr: 0, grow: 'xz' },                    // turret
    { mesh: mCyl(58, -86, 86, 28, 'z'), mat: BLACK, fr: 1, grow: 'xy' },                    // shoulder hub
    { mesh: mLink(0, 300, 46, 37, 39), mat: WHITE, fr: 2, grow: 'y' },                      // upper arm
    { mesh: mCyl(46, -62, 62, 24, 'z'), mat: BLACK, fr: 3, grow: 'xy' },                    // elbow hub
    { mesh: mLink(0, 260, 35, 27, 30), mat: WHITE, fr: 3, grow: 'y' },                      // forearm
    { mesh: mCyl(34, -46, 46, 22, 'z'), mat: BLACK, fr: 4, grow: 'xy' },                    // wrist hub
    { mesh: mBox(0, 64, -21, 21, -21, 21), mat: WHITE, fr: 4, grow: 'y' },                  // hand
    { mesh: mBox(64, 86, -56, 56, -22, 22), mat: BLACK, fr: 4, grow: 'y' },                 // palm
    { mesh: mBox(86, 156, -8, 8, -17, 17), mat: WHITE, fr: 4, grow: 'y', finger: 1 },       // finger +
    { mesh: mBox(86, 156, -8, 8, -17, 17), mat: WHITE, fr: 4, grow: 'y', finger: -1 },      // finger -
  ];
  const NP = PARTS.length;                                      // parts per arm
  const CARET = { mesh: mBox(-10, 10, 0, 180, -10, 10), meshHeld: mBox(58, 238, -10, 10, -10, 10) };   // held: the same box, in hand space
  const CARET_POS = [230, 0, 230], CARET_GRIP_Y = 110, T_GRIP = 10.5;
  const ARM_X = [0, -540, 540], CANON = [0.125, 0, 0.25], AIM = [-45 * D2R, -Math.atan2(230, 770), -(Math.PI - Math.atan2(230, 310))];
  const GRIP_CARET = 9 / 31;

  function ik(r, y, psi) {
    const Lh = A.L3 + A.LF, wx = r - Lh * Math.cos(psi), wy = y - Lh * Math.sin(psi);
    const dx = wx, dy = wy - A.hS, d = clamp(Math.hypot(dx, dy), Math.abs(A.L1 - A.L2) + 2, A.L1 + A.L2 - 2);
    const al = Math.atan2(dy, dx);
    const be = Math.acos(clamp((A.L1 * A.L1 + d * d - A.L2 * A.L2) / (2 * A.L1 * d), -1, 1));
    const ga = Math.acos(clamp((A.L1 * A.L1 + A.L2 * A.L2 - d * d) / (2 * A.L1 * A.L2), -1, 1));
    const phi1 = al + be, a2 = -(Math.PI - ga);
    return { phi1, a2, a3: psi - (phi1 + a2) };
  }

  /* ---------- choreography: gripper-tip targets (r, y, psi) + yaw + grip ---------- */
  function armPose(i, t) {
    const d = CANON[i], R = D2R;
    const yaw = trk([[0, 0], [6.0, -38 * R, .42], [7.0, -14 * R, .42], [7.72, 0, .3], [9.0 + d, AIM[i], .5], ...(i === 0 ? [[11.0, -64 * R, .55]] : [])], t);
    let r, y, psi, grip;
    const common = (k) => [[0, k[0]], [6.5, k[1], .42], [7.0, k[2], .42], [7.72, k[0], .3], [8.5 + d, k[3], .42], [9.0 + d, k[4], .45]];
    if (i === 0) {
      r = trk([...common([380, 470, 240, 180, 300]), [9.5, 325, .4], [11.0, 285, .55]], t);
      y = trk([...common([120, 400, 360, 560, 300]), [9.5, 200, .4], [10.1, CARET_GRIP_Y, .36], [11.0, 345, .55]], t);
      psi = trk([...common([-80, -15, -120, 70, -70]), [9.5, -90, .4]], t) * R;
      grip = trk([[0, .55], [7.5, 1, .14], [7.75, .12, .12], [8.0, .55, .3], [10.0, 1, .2], [T_GRIP, GRIP_CARET, .1]], t);
    } else {
      r = trk([...common([380, 470, 240, 180, 300]), [9.5 + d * .5, 360, .4], [10.05 + d * .5, 270, .45]], t);
      y = trk([...common([120, 400, 360, 560, 300]), [9.5 + d * .5, 240, .4], [10.05 + d * .5, 92, .45]], t);
      psi = trk([...common([-80, -15, -120, 70, -70]), [9.5 + d * .5, -45, .4], [10.05 + d * .5, -100, .45]], t) * R;
      grip = trk([[0, .55], [7.5, 1, .14], [7.75, .12, .12], [8.0, .55, .3], [9.5 + d * .5, 1, .2], [10.05 + d * .5, .3, .2]], t);
    }
    const bx = i === 0 ? 0 : ARM_X[i] * spring(t - 8.0, 13, 0.86);
    return { i, bx, bz: 0, yaw, r, y, psi, grip, ...ik(r, y, psi) };
  }
  const growT = gi => 4.0 + gi * 0.045, fillT = gi => 5.12 + gi * 0.04;
  const depAt = t => lerp(0.02, 1, sp((t - 5.0) / 0.75));

  function frames(p, dep) {
    const M0 = mmul(mmul(mT(p.bx, 0, p.bz), mRy(p.yaw)), mS(1, 1, dep));
    const M1 = mmul(M0, mT(0, A.hS, 0));
    const M2 = mmul(M1, mRz(p.phi1));
    const M3 = mmul(mmul(M2, mT(A.L1, 0, 0)), mRz(p.a2));
    const M4 = mmul(mmul(M3, mT(A.L2, 0, 0)), mRz(p.a3));
    return [M0, M1, M2, M3, M4];
  }
  // skeleton in the arm plane -> world points [base, S, E, W, T, tip]
  function skelWorld(p) {
    const c = Math.cos, s = Math.sin, a1 = p.phi1, a2 = a1 + p.a2, a3 = a2 + p.a3;
    const S = [0, A.hS], E = [S[0] + A.L1 * c(a1), S[1] + A.L1 * s(a1)], Wr = [E[0] + A.L2 * c(a2), E[1] + A.L2 * s(a2)];
    const T = [Wr[0] + A.L3 * c(a3), Wr[1] + A.L3 * s(a3)], Tip = [T[0] + A.LF * c(a3), T[1] + A.LF * s(a3)];
    return [[0, 0], S, E, Wr, T, Tip].map(q => [p.bx + q[0] * c(p.yaw), q[1], p.bz - q[0] * s(p.yaw)]);
  }
  function caretEnds(t) {        // the caret's two ends in world space [bottom, top]
    if (t < T_GRIP) return [[CARET_POS[0], 0, CARET_POS[2]], [CARET_POS[0], 180, CARET_POS[2]]];
    const M = frames(armPose(0, t), 1)[4];
    return [mApply(M, [238, 0, 0]), mApply(M, [58, 0, 0])];
  }
  function caretWorld(t) {       // caret centre-bottom in world space
    if (t < T_GRIP) return CARET_POS;
    const tip = skelWorld(armPose(0, t))[5];
    return [tip[0], tip[1] - CARET_GRIP_Y, tip[2]];
  }

  /* ---------- camera ---------- */
  function camAt(t) {
    const R = D2R;
    const yaw = trk([[0, 0], [5.0, -30 * R, .95], [6.0, -23 * R, 2.4], [8.0, -17 * R, .8], [10.0, -27 * R, 1.6]], t);
    const pitch = trk([[0, 0], [5.0, 15 * R, .95], [8.0, 21 * R, .8], [10.0, 13 * R, 1.6]], t);
    const S = trk([[0, 1.3], [8.0, 0.8, .8], [10.0, 1.3, 1.1], [11.0, 2.7, .95]], t);
    const D = 1 / lerp(1 / 60000, 1 / 2700, sp((t - 5.0) / 0.95));
    const f = cio(seg(t, 10.0, 11.3)), row = sp((t - 8.0) / 0.8), ce = caretEnds(t);
    const p0 = [145, 215, 0], p1 = [0, 215, 0], p2 = mix3(ce[0], ce[1], 0.5);
    let pv = mix3(p0, p1, row); pv = mix3(pv, p2, f);
    const ax = lerp(980, 960, row), ay = lerp(lerp(510, 505, row), 540, f);
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp_ = Math.sin(pitch);
    // rows of Rx(pitch) * Ry(yaw)
    const r = [cy, 0, sy, sp_ * sy, cp, -sp_ * cy, -cp * sy, sp_, cp * cy];
    return { yaw, pitch, S, D, SD: S * D, px: pv[0], py: pv[1], pz: pv[2], ax, ay, r };
  }
  function proj(P, cam) {
    const dx = P[0] - cam.px, dy = P[1] - cam.py, dz = P[2] - cam.pz, r = cam.r;
    const xc = r[0] * dx + r[1] * dy + r[2] * dz, yc = r[3] * dx + r[4] * dy + r[5] * dz, zc = r[6] * dx + r[7] * dy + r[8] * dz;
    const k = cam.SD / (cam.D - zc);
    return [cam.ax + xc * k, cam.ay - yc * k, k];
  }
  const skel2D = (i, t) => { const cam = camAt(t); return skelWorld(armPose(i, t)).map(P => { const q = proj(P, cam); return [q[0], q[1]]; }); };

  /* ---------- rasteriser ---------- */
  const LIGHT = (() => { const v = [-0.52, 0.74, 0.43], l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; })();
  const T_LIT = 0.56, T_MID = 0.02;
  const SX = new Float32Array(256), SY = new Float32Array(256), SQ = new Float32Array(256), WXa = new Float32Array(256), WYa = new Float32Array(256), WZa = new Float32Array(256);
  let shadowPath = null, CULL = true;

  function rasterTri(x0, y0, q0, i0, x1, y1, q1, i1, x2, y2, q2, i2, sid, key) {
    let area = (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0);
    if (area >= 0) { if (CULL || area === 0) return; let q; q = x1; x1 = x2; x2 = q; q = y1; y1 = y2; y2 = q; q = q1; q1 = q2; q2 = q; q = i1; i1 = i2; i2 = q; area = -area; }
    const minx = Math.max(0, Math.floor(Math.min(x0, x1, x2))), maxx = Math.min(RW - 1, Math.ceil(Math.max(x0, x1, x2)));
    const miny = Math.max(0, Math.floor(Math.min(y0, y1, y2))), maxy = Math.min(RH - 1, Math.ceil(Math.max(y0, y1, y2)));
    if (minx > maxx || miny > maxy) return;
    const inv = 1 / area;
    const A0 = y1 - y2, B0 = x2 - x1, C0 = x1 * y2 - x2 * y1;
    const A1 = y2 - y0, B1 = x0 - x2, C1 = x2 * y0 - x0 * y2;
    const A2 = y0 - y1, B2 = x1 - x0, C2 = x0 * y1 - x1 * y0;
    const flat = i0 === i1 && i1 === i2, tone0 = i0 > T_LIT ? 0 : i0 > T_MID ? 1 : 2;
    for (let y = miny; y <= maxy; y++) {
      const py = y + 0.5, xs = minx + 0.5;
      let e0 = A0 * xs + B0 * py + C0, e1 = A1 * xs + B1 * py + C1, e2 = A2 * xs + B2 * py + C2;
      let o = y * RW + minx;
      for (let x = minx; x <= maxx; x++, o++, e0 += A0, e1 += A1, e2 += A2) {
        if (e0 > 0 || e1 > 0 || e2 > 0) continue;
        const q = (e0 * q0 + e1 * q1 + e2 * q2) * inv;
        if (q <= zBuf[o]) continue;
        zBuf[o] = q; idBuf[o] = sid;
        if (flat) shBuf[o] = key | tone0;
        else { const it = (e0 * i0 + e1 * i1 + e2 * i2) * inv; shBuf[o] = key | (it > T_LIT ? 0 : it > T_MID ? 1 : 2); }
      }
    }
  }

  function drawPart(mesh, M, sidBase, key, cam, shadow) {
    const V = mesh.V, nv = V.length, r = cam.r;
    for (let i = 0; i < nv; i++) {
      const v = V[i];
      const wx = M[0] * v[0] + M[1] * v[1] + M[2] * v[2] + M[3], wy = M[4] * v[0] + M[5] * v[1] + M[6] * v[2] + M[7], wz = M[8] * v[0] + M[9] * v[1] + M[10] * v[2] + M[11];
      WXa[i] = wx; WYa[i] = wy; WZa[i] = wz;
      const dx = wx - cam.px, dy = wy - cam.py, dz = wz - cam.pz;
      const xc = r[0] * dx + r[1] * dy + r[2] * dz, yc = r[3] * dx + r[4] * dy + r[5] * dz, zc = r[6] * dx + r[7] * dy + r[8] * dz;
      const k = cam.SD / (cam.D - zc), sx = (cam.ax + xc * k) * SS, sy = (cam.ay - yc * k) * SS;
      SX[i] = sx; SY[i] = sy; SQ[i] = cam.D / (cam.D - zc);
      if (sx < bx0) bx0 = sx; if (sx > bx1) bx1 = sx; if (sy < by0) by0 = sy; if (sy > by1) by1 = sy;
    }
    // normal matrix = cofactor of the linear part (handles the non-uniform scales)
    const a = M[0], b = M[1], c = M[2], d = M[4], e = M[5], f = M[6], g = M[8], h = M[9], k2 = M[10];
    const n00 = e * k2 - f * h, n01 = f * g - d * k2, n02 = d * h - e * g, n10 = c * h - b * k2, n11 = a * k2 - c * g, n12 = b * g - a * h, n20 = b * f - c * e, n21 = c * d - a * f, n22 = a * e - b * d;
    const lit = n => { const x = n00 * n[0] + n01 * n[1] + n02 * n[2], y = n10 * n[0] + n11 * n[1] + n12 * n[2], z = n20 * n[0] + n21 * n[1] + n22 * n[2]; return (x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2]) / (Math.hypot(x, y, z) || 1); };
    const tris = mesh.tris;
    for (let j = 0; j < tris.length; j++) {
      const t = tris[j], ia = t.a, ib = t.b, ic = t.c;
      const ig = lit(t.n);
      let i0, i1, i2; if (t.flat) i0 = i1 = i2 = ig; else { i0 = lit(t.na); i1 = lit(t.nb); i2 = lit(t.nc); }
      rasterTri(SX[ia], SY[ia], SQ[ia], i0, SX[ib], SY[ib], SQ[ib], i1, SX[ic], SY[ic], SQ[ic], i2, sidBase + t.s, key);
      if (shadow && ig > 0.02) {         // light-facing triangles projected onto the floor
        const P = [ia, ib, ic].map(q => { const ky = WYa[q] / LIGHT[1]; return proj([WXa[q] - LIGHT[0] * ky, 0, WZa[q] - LIGHT[2] * ky], cam); });
        const ar = (P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[1][1] - P[0][1]) * (P[2][0] - P[0][0]);
        if (Math.abs(ar) > 0.01) { const o = ar > 0 ? [0, 1, 2] : [0, 2, 1]; shadowPath.moveTo(P[o[0]][0], P[o[0]][1]); shadowPath.lineTo(P[o[1]][0], P[o[1]][1]); shadowPath.lineTo(P[o[2]][0], P[o[2]][1]); shadowPath.closePath(); }
      }
    }
  }

  // ink where surface ids change; heavier line on the silhouette
  function resolve(lut, INK) {
    const RS = 3, RC = 2, RSd = 2, RCd = 1;
    let x0 = Math.max(RS, (Math.floor(bx0) - RS - 2) & ~1), y0 = Math.max(RS, (Math.floor(by0) - RS - 2) & ~1);
    let x1 = Math.min(RW - RS - 1, (Math.ceil(bx1) + RS + 3) | 1), y1 = Math.min(RH - RS - 1, (Math.ceil(by1) + RS + 3) | 1);
    if (x1 <= x0 || y1 <= y0) return null;
    const dS = RSd * RW, dC = RCd * RW;
    for (let y = y0; y <= y1; y++) {
      let o = y * RW + x0;
      for (let x = x0; x <= x1; x++, o++) {
        const id = idBuf[o];
        if (id === 0) {
          px[o] = (idBuf[o - RS] | idBuf[o + RS] | idBuf[o - RS * RW] | idBuf[o + RS * RW] | idBuf[o - RSd - dS] | idBuf[o + RSd - dS] | idBuf[o - RSd + dS] | idBuf[o + RSd + dS]) ? INK : 0;
        } else if (!idBuf[o - RS] || !idBuf[o + RS] || !idBuf[o - RS * RW] || !idBuf[o + RS * RW] || !idBuf[o - RSd - dS] || !idBuf[o + RSd - dS] || !idBuf[o - RSd + dS] || !idBuf[o + RSd + dS]) {
          px[o] = INK;
        } else if (idBuf[o - RC] !== id || idBuf[o + RC] !== id || idBuf[o - RC * RW] !== id || idBuf[o + RC * RW] !== id || idBuf[o - RCd - dC] !== id || idBuf[o + RCd - dC] !== id || idBuf[o - RCd + dC] !== id || idBuf[o + RCd + dC] !== id) {
          px[o] = INK;
        } else px[o] = lut[shBuf[o]];
      }
    }
    return [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
  }

  /* ---------- materials ---------- */
  const WHITE_T = [W3, mix3(W3, mix3(OR3, K3, 0.30), 0.24), mix3(W3, mix3(OR3, K3, 0.55), 0.50)];
  const BLACK_T = [mix3(K3, W3, 0.30), mix3(K3, W3, 0.13), K3];
  const SHADOW = css(mix3(OR3, K3, 0.26)), GRIDC = css(mix3(OR3, K3, 0.11)), INK32 = u32(K3);
  const BLUE_T = [mix3(BL3, W3, 0.28), BL3, mix3(BL3, K3, 0.38)];

  function renderArms(t, cam) {
    idBuf.fill(0); zBuf.fill(0);
    bx0 = by0 = 1e9; bx1 = by1 = -1e9;
    shadowPath = new Path2D();
    const lut = new Uint32Array(256);
    const n = t >= 8.0 ? 3 : 1, shadowOn = cam.pitch > 0.004;
    for (let i = 0; i < n; i++) {
      const p = armPose(i, t), hero = i === 0;
      if (!hero && Math.abs(p.bx) < 40) continue;      // still hidden inside the hero arm (avoids coplanar z-fighting)
      const dep = hero ? depAt(t) : 1, Fm = frames(p, dep);
      for (let k = 0; k < NP; k++) {
        const P = PARTS[k], g = i * NP + k;
        const wf = hero ? eo((t - growT(k)) / 0.36) : 1, fl = hero ? eo((t - fillT(k)) / 0.32) : 1;
        if (wf <= 0.001) continue;
        const tones = P.mat === WHITE ? WHITE_T : BLACK_T;
        for (let q = 0; q < 3; q++) lut[(g << 2) | q] = u32(mix3(OR3, tones[q], fl));
        let M = Fm[P.fr];
        if (P.finger) M = mmul(M, mT(0, P.finger * (9 + 31 * p.grip), 0));
        const s = P.grow === 'xz' ? mS(wf, 1, wf) : P.grow === 'xy' ? mS(wf, wf, 1) : mS(1, wf, 1);
        M = mmul(M, s);
        drawPart(P.mesh, M, 1 + g * 8, g << 2, cam, shadowOn);
      }
      if (hero && t >= 9.5) {         // the caret: pops up, blinks, gets picked
        const g = 3 * NP, blink = t < 10.25 ? (Math.floor((t - 9.5) / 0.125) % 2 === 0) : true;
        if (blink) {
          for (let q = 0; q < 3; q++) lut[(g << 2) | q] = u32(BLUE_T[q]);
          if (t < T_GRIP) drawPart(CARET.mesh, mmul(mT(CARET_POS[0], 0, CARET_POS[2]), mS(1, spring(t - 9.5, 22, 0.8), 1)), 1 + g * 8, g << 2, cam, shadowOn);
          else drawPart(CARET.meshHeld, Fm[4], 1 + g * 8, g << 2, cam, shadowOn);
        }
      }
    }
    if (bx1 < bx0) return;
    if (shadowOn) { ctx.fillStyle = SHADOW; ctx.fill(shadowPath, 'nonzero'); }
    const rc = resolve(lut, INK32);
    if (!rc) return;
    rctx.putImageData(img, 0, 0, rc[0], rc[1], rc[2], rc[3]);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(rcv, rc[0], rc[1], rc[2], rc[3], rc[0] / SS, rc[1] / SS, rc[2] / SS, rc[3] / SS);
  }

  /* ---------- 2D overlays projected from the 3D world ---------- */
  function wline(cam, a, b, w, col, p0 = 0, p1 = 1) {
    if (p1 <= p0) return;
    const A2 = [lerp(a[0], b[0], p0), lerp(a[1], b[1], p0), lerp(a[2], b[2], p0)], B2 = [lerp(a[0], b[0], p1), lerp(a[1], b[1], p1), lerp(a[2], b[2], p1)];
    const P = proj(A2, cam), Q = proj(B2, cam); line(ctx, P[0], P[1], Q[0], Q[1], w, col);
  }
  function drawGrid(t, cam) {
    const gin = i => eo((t - 4.02 - i * 0.012) / 0.5);
    ctx.save();
    let k = 0;
    const ZW = -300, flo = sp((t - 5.0) / 0.8);
    for (let x = -2100; x <= 2400; x += 100, k++) wline(cam, [x, 0, ZW], [x, 1500, ZW], 2, GRIDC, 0, gin(k % 24));
    k = 0;
    for (let y = 100; y <= 1500; y += 100, k++) wline(cam, [-2100, y, ZW], [2400, y, ZW], 2, GRIDC, 0, gin(k + 3));
    if (flo > 0.001) {
      for (let x = -2100; x <= 2400; x += 100) wline(cam, [x, 0, ZW], [x, 0, 1500], 2, GRIDC, 0, flo);
      for (let z = ZW; z <= 1500; z += 100) wline(cam, [-2100, 0, z], [2400, 0, z], 2, GRIDC);
    }
    ctx.restore();
  }
  // blueprint annotations: joint marks, dimension lines, range arcs (side view only)
  function drawNotes(t, cam) {
    if (t < 4.4 || t > 5.45) return;
    const out = ei((t - 5.0) / 0.3), sk = skelWorld(armPose(0, t)).map(P => proj(P, cam));
    const S = sk[1], E = sk[2], Wr = sk[3], k = cam.S, col = C.k;
    ctx.save(); ctx.strokeStyle = col; ctx.lineCap = 'butt';
    [[S, 58], [E, 46], [Wr, 34]].forEach(([P, r], i) => {
      const a = eo((t - 4.5 - i * 0.07) / 0.3) * (1 - out); if (a <= 0.001) return;
      const R = (r + 20) * k;
      ctx.lineWidth = 2.5; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.arc(P[0], P[1], R, -Math.PI / 2, -Math.PI / 2 + TAU * a); ctx.stroke(); ctx.setLineDash([]);
      const c2 = (R + 26) * a; line(ctx, P[0] - c2, P[1], P[0] + c2, P[1], 2, col); line(ctx, P[0], P[1] - c2, P[0], P[1] + c2, 2, col);
    });
    const dim = (P, Q, off, d) => {
      const a = eo((t - 4.62 - d) / 0.34) * (1 - out); if (a <= 0.001) return;
      const dx = Q[0] - P[0], dy = Q[1] - P[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
      const A2 = [P[0] + nx * off, P[1] + ny * off], B2 = [Q[0] + nx * off, Q[1] + ny * off];
      const m = [(A2[0] + B2[0]) / 2, (A2[1] + B2[1]) / 2];
      line(ctx, lerp(m[0], A2[0], a), lerp(m[1], A2[1], a), lerp(m[0], B2[0], a), lerp(m[1], B2[1], a), 2.5, col);
      [[P, A2], [Q, B2]].forEach(([p0, p1]) => { line(ctx, lerp(p0[0], p1[0], 0.45), lerp(p0[1], p1[1], 0.45), lerp(p0[0], p1[0], 0.45 + 0.7 * a), lerp(p0[1], p1[1], 0.45 + 0.7 * a), 2, col); });
      if (a > 0.9) [A2, B2].forEach((p, j) => { const s = j ? -1 : 1, ux = dx / l * s, uy = dy / l * s; fillPts(ctx, [p, [p[0] + ux * 18 + nx * 6, p[1] + uy * 18 + ny * 6], [p[0] + ux * 18 - nx * 6, p[1] + uy * 18 - ny * 6]], col); });
    };
    dim(S, E, -128 * k, 0); dim(E, Wr, -104 * k, 0.07);
    // reach arc from the shoulder
    const a = eo((t - 4.74) / 0.36) * (1 - out);
    if (a > 0.001) { const R = Math.hypot(sk[5][0] - S[0], sk[5][1] - S[1]) + 40 * k, a0 = Math.atan2(sk[5][1] - S[1], sk[5][0] - S[0]); ctx.lineWidth = 2; ctx.setLineDash([4, 10]); ctx.beginPath(); ctx.arc(S[0], S[1], R, a0 - 0.5 * a, a0 + 0.42 * a); ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
  }

  const GROUND = [[-516.9, 0, 0], [775.8, 0, 0]];
  function draw(t) {
    const cam = camAt(t);
    ctx.fillStyle = C.or; ctx.fillRect(0, 0, W, H);
    drawGrid(t, cam);
    // the ground line (the hero line, now black) retracts once the world turns 3D
    const gr = 1 - eo((t - 5.05) / 0.5);
    if (gr > 0.002) { const b = [0, 0, 0]; wline(cam, b, GROUND[0], 6, C.k, 0, gr); wline(cam, b, GROUND[1], 6, C.k, 0, gr); }
    renderArms(t, cam);
    // the skeleton the parts grow out of
    const skw = 6 * (1 - eo((t - 4.05) / 0.5));
    if (skw > 0.1) strokePts(ctx, skel2D(0, t), skw, C.k);
    drawNotes(t, cam);
    // the caret widens into the white field
    if (t >= 11.5) {
      const ce = caretEnds(t), a = proj(ce[0], cam), b = proj(ce[1], cam);
      const cx0 = (a[0] + b[0]) / 2, cy0 = (a[1] + b[1]) / 2, h0 = Math.hypot(a[0] - b[0], a[1] - b[1]), w0 = 20 * (a[2] + b[2]) / 2;
      const m = eio(seg(t, 11.55, 12.0)), cx = lerp(cx0, 960, m), cy = lerp(cy0, 540, m), ch = lerp(h0, 76, m), cw2 = lerp(w0, 10, m);
      const ow = ci(seg(t, 11.5, 11.97)), oh = eo(seg(t, 11.5, 11.85));
      const fw = lerp(cw2, W * 2.2, ow), fh = lerp(ch, H * 2.2, oh);
      ctx.fillStyle = C.w; ctx.fillRect(cx - fw / 2, cy - fh / 2, fw, fh);
      ctx.fillStyle = C.bl; ctx.fillRect(cx - cw2 / 2, cy - ch / 2, cw2, ch);
    }
    drawLabel(t, 'HARDWARE', ' — ROBOT ARMS', C.k, C.w, 4.02, 11.25);
  }
  return { draw, skel2D, camAt, proj, GROUND, setCull: v => { CULL = v; } };
})();
