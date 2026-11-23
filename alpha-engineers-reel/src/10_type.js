/* =====================================================================
   The Alpha mark, the lockup, and the hook / end-title scenes
   ===================================================================== */
const TYPE = (() => {
  let L, ABIG, ALOCK, AEND, AL, SKC, GR, SKP;
  const LINE0 = { x: 660, y: 540, s: [[100, 0], [200, 0], [300, 0], [0, Math.PI], [0, Math.PI]] }, LINE_W = 16;
  const END_CY = 474;
  const [pcv, pctx] = mkCanvas(W, H, true);

  /* The "A" as one stroke: left foot -> apex -> right foot -> back up -> crossbar.
     Drawn with bevel joins and clipped at the baseline, so it is also a clean linkage. */
  function aGeom(cx, base, capH, hw, w) {
    let al = Math.atan(hw / capH);
    for (let i = 0; i < 5; i++) al = Math.atan((hw - (w / 2) / Math.cos(al)) / (capH - (w / 2) * Math.sin(al)));
    const fx = hw - (w / 2) / Math.cos(al), ay = base - capH + (w / 2) * Math.sin(al), ext = w * 0.9;
    const sa = Math.sin(al), ca = Math.cos(al);
    const P0 = [cx - fx - sa * ext, base + ca * ext], AP = [cx, ay], P2 = [cx + fx + sa * ext, base + ca * ext];
    const yc = base - 0.30 * capH, cbx = fx * (yc - ay) / (base - ay), CR = [cx + cbx, yc], CL = [cx - cbx, yc];
    const SPL = [lerp(P0[0], AP[0], 1 / 3), lerp(P0[1], AP[1], 1 / 3)];
    const aL = Math.atan2(AP[1] - P0[1], AP[0] - P0[0]), aR = Math.atan2(P2[1] - AP[1], P2[0] - AP[0]);
    const d = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
    const chain = { x: P0[0], y: P0[1], s: [[d(P0, SPL), aL], [d(SPL, AP), aL], [d(AP, P2), aR], [d(P2, CR), aR + Math.PI], [d(CR, CL), Math.PI]] };
    // explicit outline polygon (for the blueprint style)
    const top = base - capH, iay = ay + (w / 2) / sa, xin = y => (y - iay) * Math.tan(al);
    const outer = [[cx - hw, base], [cx - (w / 2) * ca, top], [cx + (w / 2) * ca, top], [cx + hw, base], [cx + xin(base), base], [cx + xin(yc + w / 2), yc + w / 2], [cx - xin(yc + w / 2), yc + w / 2], [cx - xin(base), base]];
    const hole = iay < yc - w / 2 - 1 ? [[cx, iay], [cx + xin(yc - w / 2), yc - w / 2], [cx - xin(yc - w / 2), yc - w / 2]] : null;
    return { chain, base, w, outer, hole, cx, capH, hw, AP, CR, CL, top };
  }
  function drawA(c, ch, w, col, clipY) {
    c.save(); c.beginPath(); c.rect(-4000, -4000, 8000 + W, 4000 + clipY); c.clip();
    strokePts(c, chainPts(ch), w, col, 'bevel', 'butt'); c.restore();
  }

  function init() {
    const S = 250, S2 = 92;
    ctx.font = F(900, S);
    const capH = ctx.measureText('H').actualBoundingBoxAscent, stem = S * 0.168, hw = capH * 0.52, gap = S * 0.028;
    const mL = ctx.measureText('L'), mAll = ctx.measureText('LPHA');
    const lb = -mL.actualBoundingBoxLeft, rb = mAll.actualBoundingBoxRight;
    const TW = 2 * hw + gap + (rb - lb), x0 = -TW / 2, lpx = x0 + 2 * hw + gap - lb;
    const ladv = [...'LPHA'].map((_, i) => ctx.measureText('LPHA'.slice(0, i)).width);
    ctx.font = F(700, S2);
    const capH2 = ctx.measureText('H').actualBoundingBoxAscent, E = [...'ENGINEERS'];
    const adv = E.map(ch => ctx.measureText(ch).width), sum = adv.reduce((a, b) => a + b, 0);
    const elb = -ctx.measureText('E').actualBoundingBoxLeft, erb = adv[8] - ctx.measureText('S').actualBoundingBoxRight;
    const trFull = (TW - (sum - elb - erb)) / 8, trTight = S2 * 0.03;
    const ex = tr => { const o = []; let x = x0 - elb; for (let i = 0; i < 9; i++) { o.push(x); x += adv[i] + tr; } return o; };
    const lg = 46, total = capH + lg + capH2, base1 = -total / 2 + capH, base2 = total / 2;
    ctx.font = F(700, 66);
    const words = [['Build.', C.or], ['Code.', C.bl], ['Play.', C.li]], sp2 = 30;
    const ww = words.map(w => ctx.measureText(w[0]).width), tot = ww.reduce((a, b) => a + b, 0) + sp2 * 2;
    const tagx = []; let tx = -tot / 2; for (let i = 0; i < 3; i++) { tagx.push(tx); tx += ww[i] + sp2; }
    L = { S, S2, capH, capH2, stem, hw, gap, TW, x0, lpx, ladv, exFull: ex(trFull), exTight: ex(trTight), base1, base2, total, words, tagx, tagBase: base2 + 124, E };
    AL = aGeom(x0 + hw, base1, capH, hw, stem);                                   // lockup-local A
    ALOCK = aGeom(960 + x0 + hw, 540 + base1, capH, hw, stem);                    // screen A, hook lockup
    AEND = aGeom(960 + x0 + hw, END_CY + base1, capH, hw, stem);                  // screen A, end title
    ABIG = aGeom(960, 772, 464, 464 * 0.52, stem * 464 / capH);                   // the big opening A
    // the arm skeleton the A unfolds into (blueprint camera, rest pose) and the ground line
    SKP = HW.skel2D(0, 4.0); SKC = chainOf(SKP);
    const cam = HW.camAt(4.0); GR = HW.GROUND.map(P => HW.proj(P, cam));
  }

  /* lockup text in lockup-local coordinates. k: { lp[4], lpDy[4], en[9] (dy), track, mode } */
  function lockupText(c, fg, k) {
    c.textBaseline = 'alphabetic';
    const stroke = k.mode === 'stroke';
    if (stroke) { c.strokeStyle = fg; c.lineWidth = 4; c.lineJoin = 'miter'; c.miterLimit = 3; } else c.fillStyle = fg;
    const put = (s, x, y) => stroke ? c.strokeText(s, x, y) : c.fillText(s, x, y);
    c.font = F(900, L.S);
    const clipX = L.x0 + 2 * L.hw + L.gap * 0.1;
    c.save(); c.beginPath(); c.rect(clipX, -2000, 4000, 2000 + L.base1 + 6); c.clip();
    // the word slides out from behind the A's right leg as one piece; a small per-letter lag opens the spacing
    const wordW = L.ladv[3] + 190, sl = k.lp === undefined ? 1 : k.lp;
    for (let i = 0; i < 4; i++) {
      const x = L.lpx + L.ladv[i], lag = k.lpLag ? k.lpLag * i * 26 : 0;
      put('LPHA'[i], x - (1 - sl) * (wordW + 40) - lag, L.base1 + (k.lpDy ? k.lpDy[i] : 0));
    }
    c.restore();
    c.font = F(700, L.S2);
    c.save(); c.beginPath(); c.rect(-2000, L.base1 + 14, 4000, L.base2 - L.base1 - 8); c.clip();
    const tp = k.track === undefined ? 1 : k.track;
    for (let i = 0; i < 9; i++) put(L.E[i], lerp(L.exTight[i], L.exFull[i], tp), L.base2 + (k.en ? k.en[i] : 0));
    c.restore();
  }
  function aOutline(c, G, lw, col) {
    c.strokeStyle = col; c.lineWidth = lw; c.lineJoin = 'miter'; c.miterLimit = 6;
    pathPts(c, G.outer, true); c.stroke();
    if (G.hole) { pathPts(c, G.hole, true); c.stroke(); }
  }
  const SETTLED = {};
  // full static lockup, lockup-local coords, in a given style
  function lockupStatic(c, fg, mode) {
    if (mode === 'stroke') aOutline(c, AL, 4, fg); else drawA(c, AL.chain, AL.w, fg, AL.base);
    lockupText(c, fg, { mode });
  }

  /* ---------- HOOK (beats 1-8) ---------- */
  function heroHook(t) {
    if (t < 0.5) {            // the line folds at its middle into the A; the crossbar draws last
      const p = spring(t - 0.012, 17, 0.88), pc = eo(seg(t, 0.27, 0.5)), A = ABIG.chain;
      const s = LINE0.s.map((a, i) => i < 3 ? [lerp(a[0], A.s[i][0], p), lerp(a[1], A.s[i][1], p)] : [A.s[i][0] * pc, i === 3 ? lerp(Math.PI, A.s[3][1], p) : Math.PI]);
      return { ch: { x: lerp(LINE0.x, A.x, p), y: lerp(LINE0.y, A.y, p), s }, w: lerp(LINE_W, ABIG.w, p), clip: ABIG.base };
    }
    const p = spring(t - 0.5, 17, 0.9);
    return { ch: chainLerp(ABIG.chain, ALOCK.chain, p), w: lerp(ABIG.w, ALOCK.w, p), clip: lerp(ABIG.base, ALOCK.base, p) };
  }
  function drawHook(t) {
    const F1 = 2.0, F2 = 2.25, F3 = 2.5, F4 = 2.75, U = 3.0;
    if (t < F1) {                                   // black: line -> A -> lockup
      ctx.fillStyle = C.k; ctx.fillRect(0, 0, W, H);
      const h = heroHook(t);
      // slow push-in keeps the lockup alive
      const z = 1 + 0.03 * seg(t, 0.9, 2.0);
      ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
      drawA(ctx, h.ch, h.w, C.w, h.clip);
      if (t > 0.5) {
        ctx.save(); ctx.translate(960, 540);
        lockupText(ctx, C.w, {
          lp: eo((t - 0.56) / 0.42), lpLag: 1 - eo((t - 0.6) / 0.5),
          en: [...Array(9)].map((_, i) => (1 - eo((t - 1.0 - i * 0.022) / 0.32)) * (L.capH2 + 40)),
          track: spring(t - 1.5, 15, 0.9),
        });
        ctx.restore();
      }
      ctx.restore();
      return;
    }
    if (t < F4) {                                   // three fields, three materials: blueprint / interface / pixels
      const idx = t < F2 ? 0 : t < F3 ? 1 : 2, t0 = [F1, F2, F3][idx], u = (t - t0) / 0.25;
      const bg = [C.or, C.bl, C.li][idx], fg = [C.k, C.w, C.k][idx];
      const z = [1.03, 1.10, 1.17][idx] + 0.025 * eo(u);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      if (idx === 2) {                              // snapped to a pixel grid that resolves 30 -> 20 -> 12
        const b = u < 1 / 3 ? 30 : u < 2 / 3 ? 20 : 12, lw = Math.ceil(W / b), lh = Math.ceil(H / b);
        pctx.setTransform(1, 0, 0, 1, 0, 0); pctx.clearRect(0, 0, lw + 2, lh + 2);
        pctx.setTransform(z / b, 0, 0, z / b, 960 / b, 540 / b);
        lockupStatic(pctx, C.k, 'fill');
        pctx.setTransform(1, 0, 0, 1, 0, 0);
        const im = pctx.getImageData(0, 0, lw, lh), d = im.data;
        for (let i = 3; i < d.length; i += 4) d[i] = d[i] >= 118 ? 255 : 0;
        pctx.putImageData(im, 0, 0);
        ctx.imageSmoothingEnabled = false; ctx.drawImage(pcv, 0, 0, lw, lh, 0, 0, lw * b, lh * b); ctx.imageSmoothingEnabled = true;
        return;
      }
      ctx.save(); ctx.translate(960, 540); ctx.scale(z, z);
      if (idx === 0) {                              // blueprint: outlines + construction lines
        const a = eo(u / 0.7), X0 = L.x0, X1 = -L.x0, gx = 150;
        ctx.strokeStyle = C.k; ctx.lineWidth = 2;
        [[-L.total / 2, 1], [L.base1, 0], [L.base2, 0]].forEach(([y, dash], i) => {
          ctx.setLineDash(dash ? [14, 10] : []); const e = eo((u - i * 0.08) / 0.6);
          ctx.beginPath(); ctx.moveTo(X0 - gx * e, y); ctx.lineTo(X0 + (X1 - X0 + gx) * e, y); ctx.stroke();
        });
        ctx.setLineDash([22, 8, 4, 8]); ctx.beginPath(); ctx.moveTo(AL.cx, -L.total / 2 - 90 * a); ctx.lineTo(AL.cx, L.base1 + 60 * a); ctx.stroke(); ctx.setLineDash([]);
        [AL.AP, AL.CR, AL.CL].forEach(P => { ctx.beginPath(); ctx.arc(P[0], P[1], 11 * a, 0, TAU); ctx.stroke(); });
        // dimension line under the lockup
        const dy = L.base2 + 62; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(lerp(0, X0, a), dy); ctx.lineTo(lerp(0, X1, a), dy); ctx.moveTo(X0, dy - 16 * a); ctx.lineTo(X0, dy + 16 * a); ctx.moveTo(X1, dy - 16 * a); ctx.lineTo(X1, dy + 16 * a); ctx.stroke();
        lockupStatic(ctx, C.k, 'stroke');
      } else {                                      // interface: selection box, handles, pointer dragging a corner
        lockupStatic(ctx, C.w, 'fill');
        const m = 38, x = L.x0 - m, y = -L.total / 2 - m, w = L.TW + 2 * m, h = L.total + 2 * m;
        ctx.strokeStyle = C.w; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) continue;
          const hx = x + w * i / 2, hy = y + h * j / 2;
          ctx.fillStyle = C.w; ctx.fillRect(hx - 9, hy - 9, 18, 18); ctx.strokeStyle = C.bl; ctx.lineWidth = 3; ctx.strokeRect(hx - 9, hy - 9, 18, 18);
        }
        drawPointer(ctx, x + w + 2, y + h + 2, 3.1, C.k, C.w);
      }
      ctx.restore();
      return;
    }
    // black again: the big A alone, then it unfolds like a linkage into the arm skeleton
    ctx.fillStyle = C.k; ctx.fillRect(0, 0, W, H);
    if (t < U) {
      const z = 1 + 0.14 * (1 - eo((t - F4) / 0.2));
      ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
      drawA(ctx, ABIG.chain, ABIG.w, C.w, ABIG.base); ctx.restore();
      return;
    }
    const p = spring(t - U, 13, 0.86), ch = chainLerp(ABIG.chain, SKC, p), w = lerp(ABIG.w, 6, eo((t - U) / 0.42));
    const clip = lerp(ABIG.base, H + 600, eo((t - U) / 0.2));
    const base = SKP[0], g = eo(seg(t, 3.5, 3.76)), fl = ci(seg(t, 3.76, 4.0));
    const gpts = [[lerp(base[0], GR[0][0], g), base[1]], [lerp(base[0], GR[1][0], g), base[1]]];
    const drawLines = col => { drawA(ctx, ch, w, col, clip); if (g > 0.001) strokePts(ctx, gpts, 6, col); };
    drawLines(C.w);
    if (fl > 0) {                                   // the ground line swells into the orange field
      const y0 = lerp(base[1] - 3, -10, fl), y1 = lerp(base[1] + 3, H + 10, fl), x0 = lerp(GR[0][0], -10, fl), x1 = lerp(GR[1][0], W + 10, fl);
      ctx.fillStyle = C.or; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip(); drawLines(C.k); ctx.restore();
    }
  }

  /* ---------- END TITLE (beats 57-60) ---------- */
  const E_IN = 27.75, E_OUT = 29.5;
  function heroEnd(t) {
    if (t >= 29.972) return { ch: LINE0, w: LINE_W, clip: H + 600 };
    const A = AEND.chain;
    const fold = (p, pc) => ({
      ch: { x: lerp(LINE0.x, A.x, p), y: lerp(LINE0.y, A.y, p), s: LINE0.s.map((a, i) => i < 3 ? [lerp(a[0], A.s[i][0], p), lerp(a[1], A.s[i][1], p)] : [A.s[i][0] * pc, i === 3 ? lerp(Math.PI, A.s[3][1], p) : Math.PI]) },
      w: lerp(LINE_W, AEND.w, p), clip: lerp(H + 600, AEND.base, clamp(p * 4)),
    });
    if (t < E_OUT + 0.12) return fold(spring(t - E_IN, 19, 0.9), eo(seg(t, E_IN + 0.12, E_IN + 0.3)));
    const q = 1 - cio(seg(t, E_OUT + 0.12, 29.97));
    return fold(q, clamp(q * 1.6 - 0.6));
  }
  function drawEnd(t) {         // the caller has already painted the black field
    if (t < E_IN) return;
    const h = heroEnd(t);
    drawA(ctx, h.ch, h.w, C.w, h.clip);
    if (t >= 29.972) return;
    const out = i => ei((t - E_OUT - i * 0.012) / 0.2);
    ctx.save(); ctx.translate(960, END_CY);
    lockupText(ctx, C.w, {
      lp: eo((t - E_IN - 0.2) / 0.36), lpLag: 1 - eo((t - E_IN - 0.22) / 0.45),
      lpDy: [0, 1, 2, 3].map(i => out(i) * (L.capH + 60)),
      en: [...Array(9)].map((_, i) => (1 - eo((t - E_IN - 0.3 - i * 0.016) / 0.3) + out(i + 2)) * (L.capH2 + 40)),
    });
    ctx.font = F(700, 66);
    ctx.beginPath(); ctx.rect(-2000, L.base2 + 34, 4000, 116); ctx.clip();
    L.words.forEach((w, j) => {
      const dy = (1 - eo((t - 28.25 - j * 0.25) / 0.3)) * 84 + ei((t - E_OUT - 0.03 - j * 0.02) / 0.2) * 90;
      ctx.fillStyle = w[1]; ctx.fillText(w[0], L.tagx[j], L.tagBase + dy);
    });
    ctx.restore();
  }
  return { init, drawHook, drawEnd, LINE0, LINE_W, aGeom, drawA, get L() { return L; } };
})();
