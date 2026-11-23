'use strict';
/* =====================================================================
   ALPHA ENGINEERS — "One line builds everything"   (v2 · 30 s · 120 BPM)
   1920x1080. Every pixel is a pure function of time inside window.seek(t):
   no CSS animation, no timers, no state carried between frames.
   ===================================================================== */
const W = 1920, H = 1080, DUR = 30, BPM = 120, BEAT = 60 / BPM;
const bt = n => (n - 1) * BEAT;                 // start time of beat n (1-based): bt(1)=0, bt(9)=4 ...
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');

/* ---------- palette: three colours + black and white ---------- */
const C = { k: '#0B0B0D', w: '#F4F2EE', or: '#FF5A1F', bl: '#2E64FF', li: '#C6FF3A' };
const hex3 = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const K3 = hex3(C.k), W3 = hex3(C.w), OR3 = hex3(C.or), BL3 = hex3(C.bl), LI3 = hex3(C.li);

/* ---------- math ---------- */
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const D2R = Math.PI / 180, TAU = Math.PI * 2;
const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const css = a => 'rgb(' + Math.round(a[0]) + ',' + Math.round(a[1]) + ',' + Math.round(a[2]) + ')';
const as3 = c => typeof c === 'string' ? hex3(c) : c;
const mix = (a, b, t) => css(mix3(as3(a), as3(b), clamp(t)));
const u32 = a => (0xFF000000 | (Math.round(a[2]) << 16) | (Math.round(a[1]) << 8) | Math.round(a[0])) >>> 0;

/* ---------- easing: all pure functions of normalised time ---------- */
const eo = x => { x = clamp(x); return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); };          // expo out
const ei = x => { x = clamp(x); return x <= 0 ? 0 : Math.pow(2, 10 * x - 10); };          // expo in
const eio = x => { x = clamp(x); return x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2; };
const co = x => { x = clamp(x); return 1 - Math.pow(1 - x, 3); };                         // cubic out
const ci = x => { x = clamp(x); return x * x * x; };                                      // cubic in
const cio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const qi = x => { x = clamp(x); return x * x; };
const lin = x => clamp(x);
// damped spring step response (z < 1). z = 0.9 -> ~0.15 % overshoot: snappy, never bouncy
function spring(dt, w = 20, z = 0.9) {
  if (dt <= 0) return 0;
  const s = Math.sqrt(1 - z * z), wd = w * s;
  return 1 - Math.exp(-z * w * dt) * (Math.cos(wd * dt) + (z / s) * Math.sin(wd * dt));
}
// critically damped step in normalised time (zero start velocity, soft landing, ~1 at x = 1)
const sp = x => x <= 0 ? 0 : 1 - (1 + 8 * x) * Math.exp(-8 * x);
// sum-of-steps track: keys [[t, value, dur?], ...]; each key eases from the previous value
function trk(keys, t, e = sp, d0 = 0.4) {
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++) { const k = keys[i]; if (t > k[0]) v += (k[1] - keys[i - 1][1]) * (k[3] || e)((t - k[0]) / (k[2] || d0)); }
  return v;
}

/* ---------- drawing helpers ---------- */
const F = (wt, size) => wt + ' ' + size + 'px ID';
function pathPts(c, pts, close) {
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  if (close) c.closePath();
}
function strokePts(c, pts, w, col, join = 'bevel', cap = 'butt') {
  if (pts.length < 2 || w <= 0.05) return;
  pathPts(c, pts); c.lineWidth = w; c.strokeStyle = col; c.lineJoin = join; c.lineCap = cap; c.miterLimit = 4; c.stroke();
}
function fillPts(c, pts, col) { pathPts(c, pts, true); c.fillStyle = col; c.fill(); }
function line(c, x0, y0, x1, y1, w, col, cap = 'butt') {
  c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.lineWidth = w; c.strokeStyle = col; c.lineCap = cap; c.stroke();
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2))); }
function ptsLen(pts) { const cum = [0]; let L = 0; for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); cum.push(L); } return { cum, L }; }
function ptAt(pts, m, f) {            // point at fraction f of total length (m = ptsLen(pts))
  const d = clamp(f) * m.L; let i = 1; while (i < pts.length - 1 && m.cum[i] < d) i++;
  const l = m.cum[i] - m.cum[i - 1], u = l > 1e-9 ? (d - m.cum[i - 1]) / l : 0;
  return [lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)];
}
function trimPts(pts, a, b) {         // sub-polyline between fractions a..b of the arc length
  a = clamp(a); b = clamp(b); if (b <= a) return [];
  const m = ptsLen(pts), da = a * m.L, db = b * m.L, out = [ptAt(pts, m, a)];
  for (let i = 1; i < pts.length - 1; i++) if (m.cum[i] > da + 1e-6 && m.cum[i] < db - 1e-6) out.push(pts[i]);
  out.push(ptAt(pts, m, b)); return out;
}
function resample(pts, n) { const m = ptsLen(pts), out = []; for (let k = 0; k < n; k++) out.push(ptAt(pts, m, k / (n - 1))); return out; }
const lerpPts = (A, B, p) => A.map((a, i) => [lerp(a[0], B[i][0], p), lerp(a[1], B[i][1], p)]);

/* ---------- hinge chains: the line as a rigid linkage ---------- */
// chain = { x, y, s: [[len, angle], ...] }  (screen space, angles in radians, y down)
function chainPts(ch) { const out = [[ch.x, ch.y]]; let x = ch.x, y = ch.y; for (const s of ch.s) { x += Math.cos(s[1]) * s[0]; y += Math.sin(s[1]) * s[0]; out.push([x, y]); } return out; }
function chainOf(pts) { const s = []; for (let i = 1; i < pts.length; i++) s.push([Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])]); return { x: pts[0][0], y: pts[0][1], s }; }
function chainLerp(A, B, p, pl) {     // p: angle/anchor progress, pl: optional length progress
  if (pl === undefined) pl = p;
  return { x: lerp(A.x, B.x, p), y: lerp(A.y, B.y, p), s: A.s.map((a, i) => [lerp(a[0], B.s[i][0], pl), lerp(a[1], B.s[i][1], p)]) };
}

/* ---------- scratch canvases ---------- */
function mkCanvas(w, h, readback) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d', readback ? { willReadFrequently: true } : undefined)]; }
const [scrA, sctxA] = mkCanvas(W, H);

/* ---------- the shared section label (bottom-left, rises out of a mask) ---------- */
const LABEL = { x: 120, y: 990, size: 64 };
function labelParts(a, b) { ctx.font = F(900, LABEL.size); return { wa: ctx.measureText(a).width, wb: ctx.measureText(b).width, cap: ctx.measureText('H').actualBoundingBoxAscent }; }
function drawLabel(t, a, b, colA, colB, tIn, tOut) {
  if (t < tIn - 0.02 || t > tOut + 0.45) return;
  const m = labelParts(a, b);
  ctx.save(); ctx.font = F(900, LABEL.size); ctx.textBaseline = 'alphabetic';
  ctx.beginPath(); ctx.rect(0, LABEL.y - m.cap - 22, W, m.cap + 40); ctx.clip();
  const dyA = (1 - eo((t - tIn) / 0.4)) * 96 + ei((t - tOut) / 0.26) * 96;
  const dyB = (1 - eo((t - tIn - 0.08) / 0.4)) * 96 + ei((t - tOut - 0.05) / 0.26) * 96;
  ctx.fillStyle = colA; ctx.fillText(a, LABEL.x, LABEL.y + dyA);
  ctx.fillStyle = colB; ctx.fillText(b, LABEL.x + m.wa, LABEL.y + dyB);
  ctx.restore();
}

/* ---------- mouse pointer (classic arrow) ---------- */
const PTR = [[0, 0], [0, 17], [4.1, 13.1], [7, 19.6], [9.7, 18.4], [6.9, 12.1], [12.3, 12.1]];
function drawPointer(c, x, y, s, fill = C.k, edge = C.w, press = 0) {
  c.save(); c.translate(x, y); c.scale(s * (1 - 0.12 * press), s * (1 - 0.12 * press));
  pathPts(c, PTR, true); c.lineJoin = 'round'; c.lineWidth = 3.2; c.strokeStyle = edge; c.stroke(); c.fillStyle = fill; c.fill();
  c.restore();
}
