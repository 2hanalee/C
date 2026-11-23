/* =====================================================================
   SOUNDTRACK — Web Audio, rendered offline to an exact 30.000 s WAV
   120 BPM, 4/4, A minor. Kick on every beat. Bars (2 s each):
     1 Am  2 Am (stutter) | 3 F  4 G  5 Am  6 Em (riser)  — hardware
     7 C   8 G  9 Am  10 F (flip, boot)                    — software
    11 Am 12 F 13 G (riser, snare roll) 14 Am (K.O.)       — game
    15 Am (end title)
   Each team has its own colour of sound: orange = metal/servo, blue = clean
   digital plucks and clicks, lime = 8-bit squares.
   ===================================================================== */
// stem: 'full' = the whole soundtrack; 'sfx' = only the sound-design layer (hits, clicks, servos, whooshes),
// normalised with the full mix's gain so it can be laid over externally generated music at the right level.
window.renderAudio = async function (gainDb = 0, stem = 'full', fixedGain = 0) {
  const SR = 48000, N = SR * DUR, ac = new OfflineAudioContext(2, N, SR);
  /* ---------- busses ---------- */
  const master = ac.createGain(); master.gain.value = Math.pow(10, gainDb / 20) * 0.7;
  const glue = ac.createDynamicsCompressor(); glue.threshold.value = -20; glue.knee.value = 10; glue.ratio.value = 3; glue.attack.value = 0.006; glue.release.value = 0.12;
  const lim = ac.createDynamicsCompressor(); lim.threshold.value = -6; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.06;
  master.connect(glue); glue.connect(lim); lim.connect(ac.destination);
  const drums = ac.createGain(); drums.gain.value = 1; drums.connect(master);
  const music = ac.createGain(); music.gain.value = 1;
  const duck = ac.createGain(); music.connect(duck); duck.connect(master);
  for (let b = 0; b < DUR * 2; b++) { const t = b * BEAT; duck.gain.setValueAtTime(0.38, t); duck.gain.linearRampToValueAtTime(1, t + 0.2); }
  const fx = ac.createGain(); fx.gain.value = 1; fx.connect(master);
  if (stem === 'sfx') { drums.disconnect(); duck.disconnect(); }
  // space: a dotted-8th echo and a short room
  const dly = ac.createDelay(1); dly.delayTime.value = 0.375; const fb = ac.createGain(); fb.gain.value = 0.28; const dlp = ac.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 3200;
  dly.connect(dlp); dlp.connect(fb); fb.connect(dly); const dret = ac.createGain(); dret.gain.value = 0.32; dlp.connect(dret); dret.connect(master);
  const echo = ac.createGain(); echo.connect(dly);
  const ir = ac.createBuffer(2, SR * 1.1, SR); let seed = 99;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 1073741823.5 - 1; };
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = rnd() * Math.pow(1 - i / d.length, 3.2) * 0.6; }
  const verb = ac.createConvolver(); verb.buffer = ir; const vret = ac.createGain(); vret.gain.value = 0.22; verb.connect(vret); vret.connect(master);
  const room = ac.createGain(); room.connect(verb);
  /* ---------- deterministic noise ---------- */
  const nb = ac.createBuffer(1, SR * 3, SR), nd = nb.getChannelData(0); seed = 12345;
  for (let i = 0; i < nd.length; i++) nd[i] = rnd();
  const noise = (t, dur) => { const s = ac.createBufferSource(); s.buffer = nb; s.start(Math.max(0, t), (t * 0.37) % 1.2, dur); return s; };
  /* ---------- helpers ---------- */
  const env = (t, peak, a, d) => { const g = ac.createGain(); g.gain.setValueAtTime(0.0001, Math.max(0, t)); g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); return g; };
  const osc = (type, f, t, dur) => { const o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, Math.max(0, t)); o.start(Math.max(0, t)); o.stop(t + dur); return o; };
  const filt = (type, f, Q = 0.7) => { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = Q; return b; };
  const pan = (v, dest = master) => { const p = ac.createStereoPanner(); p.pan.value = v; p.connect(dest); return p; };
  const send = (node, ...dests) => { dests.forEach(d => node.connect(d)); return node; };
  const NOTE = n => 440 * Math.pow(2, (n - 69) / 12);       // MIDI -> Hz
  const CH = { Am: [57, 60, 64], F: [53, 57, 60], G: [55, 59, 62], C: [48 + 12, 64, 67], Em: [52, 55, 59] };
  const ROOT = { Am: 45, F: 41, G: 43, C: 48, Em: 40 };
  const BARS = ['Am', 'Am', 'F', 'G', 'Am', 'Em', 'C', 'G', 'Am', 'F', 'Am', 'F', 'G', 'Am', 'Am'];
  const chordAt = t => BARS[Math.min(14, Math.floor(t / 2))];

  /* ---------- instruments ---------- */
  function kick(t, a = 1) {
    const o = osc('sine', 160, t, 0.5); o.frequency.exponentialRampToValueAtTime(44, t + 0.11);
    o.connect(env(t, a, 0.002, 0.42)).connect(drums);
    noise(t, 0.02).connect(filt('highpass', 2600)).connect(env(t, 0.2 * a, 0.0008, 0.016)).connect(drums);
  }
  function hat(t, a = 0.08, p = 0.22, open = false) { noise(t, 0.2).connect(filt('highpass', 7600)).connect(env(t, a, 0.001, open ? 0.12 : 0.04)).connect(pan(p, drums)); }
  function clap(t, a = 0.22) {
    [0, 0.011, 0.022].forEach((d, i) => noise(t + d, 0.12).connect(filt('bandpass', 1500, 1.1)).connect(env(t + d, a * (i === 2 ? 1 : 0.55), 0.001, i === 2 ? 0.12 : 0.01)).connect(drums));
    noise(t, 0.3).connect(filt('bandpass', 1600, 1)).connect(env(t, a * 0.3, 0.002, 0.2)).connect(room);
  }
  function snare(t, a) {
    noise(t, 0.16).connect(filt('bandpass', 1900, 0.9)).connect(env(t, a, 0.001, 0.1)).connect(drums);
    osc('triangle', 196, t, 0.1).connect(env(t, a * 0.5, 0.001, 0.07)).connect(drums);
  }
  function clank(t, a = 0.06, p = 0) {      // hardware: metallic tick
    noise(t, 0.08).connect(filt('bandpass', 3400, 7)).connect(env(t, a, 0.0006, 0.05)).connect(pan(p, drums));
    osc('square', 1860, t, 0.04).connect(filt('bandpass', 1860, 12)).connect(env(t, a * 0.35, 0.0006, 0.03)).connect(pan(p, drums));
  }
  function bassSaw(t, n, dur = 0.22, a = 0.24) {
    [1, 1.007].forEach(dt => {
      const o = osc('sawtooth', NOTE(n) * dt, t, dur + 0.05), lp = filt('lowpass', 1200, 5);
      lp.frequency.setValueAtTime(1300, t); lp.frequency.exponentialRampToValueAtTime(150, t + dur);
      o.connect(lp).connect(env(t, a, 0.004, dur)).connect(music);
    });
  }
  function bassPluck(t, n, dur = 0.16, a = 0.3) {
    const o = osc('triangle', NOTE(n), t, dur + 0.05); o.connect(env(t, a, 0.003, dur)).connect(music);
    const o2 = osc('sine', NOTE(n - 12), t, dur + 0.05); o2.connect(env(t, a * 0.8, 0.003, dur)).connect(music);
  }
  function bassSquare(t, n, dur = 0.11, a = 0.12) { osc('square', NOTE(n), t, dur + 0.02).connect(filt('lowpass', 1800)).connect(env(t, a, 0.002, dur)).connect(music); }
  function sub(t, n, dur, a = 0.32) {
    const o = osc('sine', NOTE(n), t, dur + 0.1), g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a, t + 0.03); g.gain.setValueAtTime(a, t + dur - 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(music);
  }
  function pad(t, chord, dur, a = 0.05, cut = 900) {
    CH[chord].forEach((n, i) => [0.996, 1.004].forEach((dt, j) => {
      const o = osc('sawtooth', NOTE(n) * dt, t, dur + 0.1), lp = filt('lowpass', cut, 0.8), g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a, t + 0.25); g.gain.setValueAtTime(a, t + dur - 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(lp).connect(g).connect(pan((i - 1) * 0.35 + (j ? 0.12 : -0.12), music));
    }));
  }
  // the three team timbres
  function stabOrange(t, chord, a = 0.1) {     // saw pluck
    CH[chord].forEach((n, i) => { const o = osc('sawtooth', NOTE(n + 12), t, 0.35), lp = filt('lowpass', 2600, 2); lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(300, t + 0.25); send(o.connect(lp).connect(env(t, a, 0.002, 0.24)), pan((i - 1) * 0.3), room); });
  }
  function stabBlue(t, chord, a = 0.12) {      // clean digital bell
    CH[chord].forEach((n, i) => { const f = NOTE(n + 24), o = osc('sine', f, t, 0.6), m = osc('sine', f * 3.01, t, 0.6), mg = ac.createGain(); mg.gain.setValueAtTime(f * 1.6, t); mg.gain.exponentialRampToValueAtTime(1, t + 0.3); m.connect(mg).connect(o.frequency); send(o.connect(env(t, a, 0.002, 0.45)), pan((i - 1) * 0.4), echo); });
  }
  function stabLime(t, chord, a = 0.07) {      // square chord
    CH[chord].forEach((n, i) => { const o = osc('square', NOTE(n + 12), t, 0.25); o.connect(filt('lowpass', 4200)).connect(env(t, a, 0.002, 0.16)).connect(pan((i - 1) * 0.3)); });
  }
  function pluck(t, n, a = 0.07, p = 0, tone = 2600) {
    const o = osc('triangle', NOTE(n), t, 0.3), o2 = osc('sawtooth', NOTE(n), t, 0.3), lp = filt('lowpass', tone, 1.5);
    lp.frequency.setValueAtTime(tone * 1.6, t); lp.frequency.exponentialRampToValueAtTime(400, t + 0.2);
    const g = env(t, a, 0.002, 0.2); o.connect(g); o2.connect(lp).connect(g); send(g, pan(p, music), echo);
  }
  function chip(t, n, a = 0.05, p = 0, dur = 0.08, duty = 'square') { osc(duty, NOTE(n), t, dur + 0.02).connect(env(t, a, 0.001, dur)).connect(pan(p, music)); }
  function blip(t, f, dur = 0.06, a = 0.08, p = 0, up = 1.5) { const o = osc('square', f, t, dur + 0.02); o.frequency.setValueAtTime(f * up, t + dur / 2); o.connect(env(t, a, 0.002, dur)).connect(pan(p, fx)); }
  function bell(t, f, a = 0.08, p = 0) { const o = osc('sine', f, t, 0.4); send(o.connect(env(t, a, 0.002, 0.3)), pan(p, fx), echo); }
  function click(t, a = 0.16, p = 0) {
    noise(t, 0.02).connect(filt('highpass', 3200)).connect(env(t, a, 0.0006, 0.013)).connect(pan(p, fx));
    osc('sine', 2300, t, 0.03).connect(env(t, a * 0.22, 0.001, 0.011)).connect(pan(p, fx));
  }
  function thump(t, a = 0.3, f0 = 260) { const o = osc('sine', f0, t, 0.25); o.frequency.exponentialRampToValueAtTime(80, t + 0.12); o.connect(env(t, a, 0.002, 0.18)).connect(fx); }
  function whoosh(t, dur, up = true, a = 0.18, p0 = 0, p1 = 0) {
    const n = noise(t, dur), bp = filt('bandpass', up ? 350 : 5000, 1.3); bp.frequency.setValueAtTime(up ? 350 : 5000, t); bp.frequency.exponentialRampToValueAtTime(up ? 6000 : 260, t + dur);
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a, t + dur * 0.72); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const pn = ac.createStereoPanner(); pn.pan.setValueAtTime(p0, t); pn.pan.linearRampToValueAtTime(p1, t + dur);
    n.connect(bp).connect(g).connect(pn).connect(fx);
  }
  function riser(t0, t1, a = 0.26, f0 = 300, f1 = 7500) {
    const n = noise(t0, t1 - t0), bp = filt('bandpass', f0, 1.2); bp.frequency.setValueAtTime(f0, t0); bp.frequency.exponentialRampToValueAtTime(f1, t1);
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(a, t1 - 0.02); g.gain.linearRampToValueAtTime(0.0001, t1);
    n.connect(bp).connect(g).connect(fx);
    const o = osc('sawtooth', 55, t0, t1 - t0); o.frequency.exponentialRampToValueAtTime(440, t1);
    const g2 = ac.createGain(); g2.gain.setValueAtTime(0.0001, t0); g2.gain.exponentialRampToValueAtTime(a * 0.28, t1 - 0.02); g2.gain.linearRampToValueAtTime(0.0001, t1);
    o.connect(filt('lowpass', 2400)).connect(g2).connect(fx);
  }
  function hit(t, big = false, a = 1) {
    const o = osc('sine', big ? 72 : 92, t, 1.3); o.frequency.exponentialRampToValueAtTime(34, t + 0.6);
    o.connect(env(t, (big ? 0.85 : 0.5) * a, 0.002, big ? 1.0 : 0.5)).connect(fx);
    const n = noise(t, 0.8), lp = filt('lowpass', 8000, 0.8); lp.frequency.setValueAtTime(8000, t); lp.frequency.exponentialRampToValueAtTime(220, t + 0.5);
    send(n.connect(lp).connect(env(t, (big ? 0.5 : 0.28) * a, 0.002, 0.45)), fx, room);
  }
  function servo(t, dur, a = 0.12, p = 0) {
    const o = osc('sawtooth', 75, t, dur + 0.05); o.frequency.exponentialRampToValueAtTime(160, t + dur * 0.55); o.frequency.exponentialRampToValueAtTime(100, t + dur);
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a, t + 0.03); g.gain.setValueAtTime(a, t + dur - 0.06); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(filt('bandpass', 950, 3)).connect(g).connect(pan(p, fx));
  }
  function clampSnd(t, a = 0.12) {
    [950, 1420].forEach(f => osc('square', f, t, 0.08).connect(filt('bandpass', f, 6)).connect(env(t, a, 0.001, 0.06)).connect(fx));
    noise(t, 0.05).connect(filt('highpass', 2000)).connect(env(t, a * 1.5, 0.001, 0.04)).connect(fx);
  }
  function punch8(t, a = 0.14, p = 0) {     // 8-bit hit
    noise(t, 0.12).connect(filt('lowpass', 3000)).connect(env(t, a * 1.6, 0.001, 0.09)).connect(pan(p, fx));
    const o = osc('square', 420, t, 0.14); o.frequency.exponentialRampToValueAtTime(70, t + 0.12); o.connect(env(t, a, 0.001, 0.12)).connect(pan(p, fx));
  }

  /* =============== ARRANGEMENT =============== */
  // kick on every beat (accents on scene changes and on the K.O.)
  for (let b = 0; b < DUR * 2; b++) { const t = b * BEAT; kick(t, [4, 8, 24, 40, 52].includes(b) ? 1.12 : b % 2 ? 0.82 : 0.95); }

  // ---- HOOK (bars 1-2)
  sub(0, ROOT.Am - 12, 2.0, 0.11); pad(0, 'Am', 2.0, 0.035, 700);
  for (let b = 0; b < 4; b++) hat(b * BEAT + 0.25, 0.05);
  whoosh(0.0, 0.4, true, 0.1);                               // the line folds
  click(0.56, 0.1, 0.25); click(0.62, 0.07, 0.3); for (let i = 0; i < 9; i++) click(1.0 + i * 0.022, 0.06, -0.2 + i * 0.05);
  bell(1.5, NOTE(76), 0.05, 0.3);                            // tracking opens
  stabOrange(2.0, 'Am', 0.12); stabBlue(2.25, 'Am', 0.13); stabLime(2.5, 'Am', 0.09);     // three fields, three timbres
  hit(2.75, false, 0.8); sub(2.75, ROOT.Am - 12, 1.25, 0.13);                                  // the big A lands
  for (let i = 0; i < 8; i++) clank(3.0 + i * 0.125, 0.04 + i * 0.006, (i % 2 ? 0.3 : -0.3));  // linkage ratchets open
  whoosh(3.55, 0.45, true, 0.16);                            // ground line swells into the field

  // ---- HARDWARE (bars 3-6): saw bass on off-beats, metal percussion, servos
  for (let bar = 2; bar < 6; bar++) {
    const t0 = bar * 2, ch = BARS[bar];
    pad(t0, ch, 2.0, 0.028, 800);
    for (let i = 0; i < 4; i++) { bassSaw(t0 + i * BEAT + 0.25, ROOT[ch] - 12); hat(t0 + i * BEAT + 0.25, 0.07); }
    [0, 3, 6, 10, 12, 15].forEach((s, k) => clank(t0 + s * 0.125, 0.05 + (k % 2) * 0.02, s % 4 === 0 ? -0.35 : 0.35));
    clap(t0 + 0.5, 0.16); clap(t0 + 1.5, 0.16);
  }
  hit(4.0, false, 0.7);
  for (let i = 0; i < 11; i++) clank(4.0 + i * 0.045, 0.03, -0.2 + i * 0.04);   // parts click into place
  for (let i = 0; i < 6; i++) bell(4.5 + i * 0.07, NOTE(72 + [0, 3, 7, 12, 7, 3][i]), 0.025, 0.2); // blueprint notes
  whoosh(4.95, 0.8, true, 0.12, -0.4, 0.4);                  // camera swings into 3D
  servo(6.0, 0.34); servo(6.5, 0.3, 0.1, 0.2); servo(7.0, 0.32, 0.1, -0.2); clampSnd(7.5); clampSnd(7.75, 0.08); servo(7.72, 0.26, 0.08);
  whoosh(7.85, 0.3, true, 0.14); [0, 1, 2].forEach(i => blip(8.0 + i * 0.06, 330 * Math.pow(2, i * 4 / 12), 0.05, 0.05, (i - 1) * 0.5));   // one arm becomes three
  [8.5, 9.0].forEach(t => [0.125, 0, 0.25].forEach((d, i) => servo(t + d, 0.22, 0.07, (i - 1) * 0.6)));
  for (let i = 0; i < 6; i++) bell(9.5 + i * 0.125, NOTE(88), 0.03, 0.4);   // the caret blinks
  servo(10.05, 0.4, 0.1); clampSnd(10.5, 0.14); servo(11.0, 0.5, 0.09);
  riser(11.0, 12.0, 0.24); whoosh(11.5, 0.5, true, 0.16);

  // ---- SOFTWARE (bars 7-10): clean, 16th hats, plucked bass, bright arpeggios
  hit(12.0, false, 0.75);
  for (let bar = 6; bar < 10; bar++) {
    const t0 = bar * 2, ch = BARS[bar], cn = CH[ch];
    pad(t0, ch, 2.0, 0.024, 1100);
    for (let i = 0; i < 4; i++) bassPluck(t0 + i * BEAT + 0.25, ROOT[ch] - 12, 0.16, 0.24);
    bassPluck(t0 + 1.875, ROOT[ch] - 12 + 7, 0.1, 0.16);
    for (let s = 0; s < 16; s++) hat(t0 + s * 0.125, s % 2 ? 0.045 : 0.03, s % 4 === 2 ? 0.3 : -0.2);
    if (bar >= 7) for (let s = 0; s < 16; s++) pluck(t0 + s * 0.125, cn[[0, 1, 2, 1][s % 4]] + 12 + (s >= 8 ? 12 : 0), 0.04 + (s % 4 === 0 ? 0.015 : 0), (s % 2 ? 0.35 : -0.35));
    clap(t0 + 0.5, 0.13); clap(t0 + 1.5, 0.13);
  }
  { const o = osc('sine', 300, 12.0, 0.35); o.frequency.exponentialRampToValueAtTime(900, 12.3); o.connect(env(12.0, 0.08, 0.02, 0.3)).connect(fx); }   // caret -> pill
  bell(12.22, NOTE(84), 0.06);                               // chip pops
  for (let i = 0; i < 26; i++) click(12.5 + i * 0.034, 0.13 + (i % 3 === 0 ? 0.04 : 0), ((i * 7) % 5 - 2) * 0.12);
  thump(13.5, 0.32); whoosh(13.45, 0.4, true, 0.12);         // enter: the window grows
  [14.0, 14.5, 15.0].forEach((t, i) => { thump(t, 0.26, 220); click(t, 0.12); const n = [7, 5, 9][i]; for (let k = 0; k < n; k++) bell(t + 0.3 + k * 0.0625, NOTE(76 + k * 2), 0.018, (k / n - 0.5)); });
  [15.5, 16.0, 16.5].forEach((t, i) => blip(t, NOTE(79 + i * 2), 0.04, 0.035, (i - 1) * 0.5, 1.25));   // hover
  whoosh(16.9, 0.3, true, 0.1);                              // cards step into a staircase
  for (let k = 0; k < 6; k++) pluck(17.125 + k * 0.125, [69, 72, 76, 79, 81, 84][k], 0.06, (k / 5 - 0.5) * 0.8, 3200);   // the path climbs
  click(18.0, 0.3); click(18.06, 0.18);                      // select
  for (let k = 0; k < 10; k++) chip(18.05 + k * 0.03, [69, 72, 76, 81][k % 4] + 12, 0.03, (k / 9 - 0.5));   // meter turns lime
  whoosh(18.45, 0.35, false, 0.14);                          // everything else drops away
  whoosh(18.95, 0.55, true, 0.2, -0.8, 0.8);                 // the card flips
  { const o = osc('square', 110, 19.5, 0.5); o.frequency.exponentialRampToValueAtTime(880, 19.95); o.connect(filt('lowpass', 3000)).connect(env(19.5, 0.05, 0.05, 0.42)).connect(fx); }   // game screen boots
  for (let k = 0; k < 4; k++) blip(19.5 + k * 0.125, NOTE(69 + k * 3), 0.05, 0.04, 0, 2);

  // ---- GAME (bars 11-14): square bass, chip arpeggios, 8-bit hits
  hit(20.0, false, 0.7);
  for (let bar = 10; bar < 14; bar++) {
    const t0 = bar * 2, ch = BARS[bar], cn = CH[ch];
    for (let s = 0; s < 8; s++) bassSquare(t0 + s * 0.25, ROOT[ch] - 12 + (s % 2 ? 12 : 0), 0.1, 0.1);
    for (let s = 0; s < 16; s++) chip(t0 + s * 0.125, cn[[0, 1, 2, 1, 0, 2, 1, 2][s % 8]] + 24, 0.022 + (s % 4 === 0 ? 0.012 : 0), (s % 2 ? 0.3 : -0.3), 0.07);
    for (let s = 0; s < 8; s++) hat(t0 + s * 0.25 + 0.125, 0.05, 0.2);
    if (bar < 13) { snare(t0 + 0.5, 0.16); snare(t0 + 1.5, 0.16); }
  }
  for (let k = 0; k < 12; k++) blip(20.08 + k * 0.035, NOTE(64 + (k % 6) * 2), 0.035, 0.04, k % 2 ? 0.3 : -0.3, 1.25);   // fighters assemble
  clank(21.06, 0.12, 0.2); blip(21.06, NOTE(88), 0.04, 0.06, 0.2);     // block
  punch8(21.55, 0.15, -0.3); punch8(22.03, 0.13, 0.3); punch8(22.28, 0.13, 0.3); punch8(22.53, 0.17, 0.3);
  whoosh(22.95, 0.2, false, 0.1); punch8(23.05, 0.15, -0.3);            // sweep
  blip(23.5, NOTE(72), 0.12, 0.06, -0.2, 2);                             // kip-up
  riser(24.0, 25.0, 0.2, 260, 5200); blip(24.5, NOTE(64), 0.25, 0.06, 0, 2.5);   // crouch, leap
  hit(25.0, false, 0.9); punch8(25.0, 0.18);                             // mid-air clash (time stops)
  { const o = osc('square', 1760, 25.0, 0.25); o.frequency.exponentialRampToValueAtTime(880, 25.25); o.connect(env(25.0, 0.03, 0.002, 0.23)).connect(fx); }
  riser(25.25, 26.0, 0.26, 400, 8000);
  for (let i = 0; i < 12; i++) snare(25.25 + i * 0.0625, 0.05 + i * 0.022);   // snare roll into the K.O.
  whoosh(25.45, 0.5, true, 0.16);                                        // dash
  // K.O. — the strongest moment
  hit(26.0, true, 1.1); punch8(26.0, 0.22);
  { const o = osc('square', 1100, 26.0, 0.55); o.frequency.exponentialRampToValueAtTime(90, 26.5); o.connect(env(26.0, 0.1, 0.002, 0.5)).connect(fx); }
  sub(26.0, ROOT.Am - 12, 1.5, 0.16);
  [26.5, 27.0].forEach((t, i) => { thump(t, 0.4, 200); stabLime(t, 'Am', 0.08); blip(t, NOTE(i ? 76 : 72), 0.12, 0.08); });
  for (let k = 0; k < 6; k++) blip(27.18 + k * 0.03, 440 * Math.pow(2, k / 6), 0.03, 0.04);   // bars refill
  whoosh(27.35, 0.35, false, 0.16);                                      // into one line

  // ---- END TITLE (bar 15): the line folds into the A, the chord rings, the words land in the team timbres
  { const o = osc('sine', 220, 27.75, 0.4); o.frequency.exponentialRampToValueAtTime(660, 28.0); o.connect(env(27.75, 0.06, 0.02, 0.35)).connect(fx); }
  hit(28.0, false, 0.6); sub(28.0, ROOT.Am - 12, 1.6, 0.11);
  ['Am'].forEach(ch => CH[ch].concat([71]).forEach((n, i) => {
    const o = osc('sawtooth', NOTE(n), 28.0, 2.0), lp = filt('lowpass', 2400, 1), g = ac.createGain();
    lp.frequency.setValueAtTime(3000, 28.0); lp.frequency.exponentialRampToValueAtTime(500, 29.9);
    g.gain.setValueAtTime(0.0001, 28.0); g.gain.exponentialRampToValueAtTime(0.045, 28.02); g.gain.setValueAtTime(0.045, 29.4); g.gain.exponentialRampToValueAtTime(0.0001, 29.95);
    send(o.connect(lp).connect(g), pan([-0.35, 0.35, -0.15, 0.15][i]), room);
  }));
  for (let i = 0; i < 4; i++) click(27.95 + i * 0.03, 0.07, 0.2);
  stabOrange(28.25, 'Am', 0.08); stabBlue(28.5, 'Am', 0.09); stabLime(28.75, 'Am', 0.06);   // Build. Code. Play.
  for (let b = 56; b < 60; b++) hat(b * BEAT + 0.25, 0.05);
  whoosh(29.5, 0.45, false, 0.12); click(29.62, 0.12);

  const buf = await ac.startRendering();
  const L = buf.getChannelData(0), R = buf.getChannelData(1);
  let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = fixedGain || 0.89 / (peak || 1);
  const ab = new ArrayBuffer(44 + N * 4), dv = new DataView(ab);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); dv.setUint32(4, 36 + N * 4, true); ws(8, 'WAVE'); ws(12, 'fmt '); dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true); dv.setUint16(22, 2, true); dv.setUint32(24, SR, true); dv.setUint32(28, SR * 4, true);
  dv.setUint16(32, 4, true); dv.setUint16(34, 16, true); ws(36, 'data'); dv.setUint32(40, N * 4, true);
  for (let i = 0; i < N; i++) {
    dv.setInt16(44 + i * 4, Math.round(clamp(L[i] * g, -1, 1) * 32767), true);
    dv.setInt16(46 + i * 4, Math.round(clamp(R[i] * g, -1, 1) * 32767), true);
  }
  const u8 = new Uint8Array(ab); let bin = '';
  for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return { wav: btoa(bin), gain: g };
};
