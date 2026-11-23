// Render pipeline for index.html (built from src/ by build.mjs)
//   node render.mjs audio                 -> out/soundtrack.wav   (OfflineAudioContext, exact DUR)
//   node render.mjs beats [offset]        -> out/contact_sheet.png (one frame per beat, beat start + offset)
//   node render.mjs frames t1 t2 ...      -> out/check/t_<t>.png   (spot checks, full size)
//   node render.mjs strip a b step [cols] -> out/check/strip_<a>_<b>.png (tiled frames a..b)
//   node render.mjs video                 -> out/alpha_engineers_reel.mp4 (60 fps, 3 subframes per frame, muxed audio)
import { createRequire } from 'node:module';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'out'), CHECK = path.join(OUT, 'check');
fs.mkdirSync(CHECK, { recursive: true });
const FPS = 60, SUB = 3, BEAT = 0.5;
const FONT = path.join(DIR, 'fonts', 'InterDisplay-Bold.otf');
const mode = process.argv[2];
build();
const browser = await chromium.launch({ args: ['--disable-gpu-vsync', '--disable-frame-rate-limit'] });

async function newPage() {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => { console.error('PAGE ERROR', e); process.exitCode = 1; });
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.error('console:', m.text()); });
  await p.goto('file://' + path.join(DIR, 'index.html'));
  await p.evaluate(() => window.ready);
  return p;
}
async function grab(p, t, type = 'image/png', q = 0.95) {
  const d = await p.evaluate(([t, type, q]) => { window.seek(t); return document.getElementById('c').toDataURL(type, q); }, [t, type, q]);
  return Buffer.from(d.slice(d.indexOf(',') + 1), 'base64');
}
const ff = (args) => { const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' }); if (r.status) throw new Error('ffmpeg failed: ' + args.join(' ')); };
const fmt = t => (Math.round(t * 1000) / 1000).toFixed(3);
// tile a list of PNG buffers, each with a burned-in caption
function tile(bufs, captions, cols, outFile, w = 384, h = 216) {
  const td = fs.mkdtempSync(path.join(OUT, 'tile_')), rows = Math.ceil(bufs.length / cols);
  bufs.forEach((b, i) => {
    const n = String(i).padStart(4, '0');
    fs.writeFileSync(path.join(td, `f_${n}.png`), b); fs.writeFileSync(path.join(td, `cap_${n}.txt`), captions[i]);
    ff(['-i', path.join(td, `f_${n}.png`), '-vf', `scale=${w}:${h},drawtext=fontfile=${FONT}:textfile=${path.join(td, `cap_${n}.txt`)}:x=8:y=6:fontsize=17:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=4,drawbox=x=0:y=0:w=iw:h=ih:color=0x444444:t=1`, path.join(td, `c_${n}.png`)]);
  });
  ff(['-framerate', '1', '-i', path.join(td, 'c_%04d.png'), '-vf', `tile=${cols}x${rows}:color=0x111111`, '-frames:v', '1', outFile]);
  fs.rmSync(td, { recursive: true, force: true });
}

if (mode === 'audio' || mode === 'audio-sfx') {
  const p = await newPage();
  const full = await p.evaluate(() => window.renderAudio(0, 'full'));
  if (mode === 'audio') { fs.writeFileSync(path.join(OUT, 'soundtrack.wav'), Buffer.from(full.wav, 'base64')); console.log('wrote out/soundtrack.wav'); }
  else {
    const sfx = await p.evaluate(g => window.renderAudio(0, 'sfx', g), full.gain);
    fs.writeFileSync(path.join(OUT, 'sfx_stem.wav'), Buffer.from(sfx.wav, 'base64')); console.log('wrote out/sfx_stem.wav');
  }
}

if (mode === 'beats') {
  const p = await newPage(), DUR = await p.evaluate(() => window.DUR), n = Math.round(DUR / BEAT);
  const off = parseFloat(process.argv[3] ?? '0.3');
  const bufs = [], caps = [];
  for (let k = 1; k <= n; k++) { const t = (k - 1) * BEAT + off; bufs.push(await grab(p, t)); caps.push(`beat ${k}  ${t.toFixed(2)}s`); }
  tile(bufs, caps, 6, path.join(OUT, 'contact_sheet.png'), 320, 180);
  console.log('wrote out/contact_sheet.png', n, 'beats');
}

if (mode === 'frames') {
  const p = await newPage();
  for (const a of process.argv.slice(3)) fs.writeFileSync(path.join(CHECK, `t_${a}.png`), await grab(p, parseFloat(a)));
  console.log('wrote', process.argv.length - 3, 'frames');
}

if (mode === 'strip') {
  const p = await newPage();
  const a = parseFloat(process.argv[3]), b = parseFloat(process.argv[4]), step = parseFloat(process.argv[5] ?? '0.0833333'), cols = parseInt(process.argv[6] ?? '6');
  const bufs = [], caps = [];
  for (let t = a; t <= b + 1e-6; t += step) { bufs.push(await grab(p, t)); caps.push(fmt(t) + 's'); }
  const out = path.join(CHECK, `strip_${a}_${b}.png`);
  tile(bufs, caps, cols, out, 480, 270);
  console.log('wrote', out);
}

if (mode === 'video') {
  const probe = await newPage(), DUR = await probe.evaluate(() => window.DUR); await probe.close();
  const FRAMES = Math.round(FPS * DUR), WORKERS = parseInt(process.env.WORKERS || '4');
  const per = Math.ceil(FRAMES / WORKERS), t0 = Date.now(), segs = [];
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const f0 = w * per, f1 = Math.min(FRAMES, f0 + per), seg = path.join(OUT, `seg_${w}.mkv`); segs[w] = seg;
    const p = await newPage();
    const enc = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS * SUB), '-i', '-',
      '-vf', `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/(${FPS}*TB)`,
      '-r', String(FPS), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '6', '-pix_fmt', 'yuv444p', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((res, rej) => enc.on('close', c => c ? rej(new Error('enc ' + c)) : res()));
    for (let f = f0; f < f1; f++) {
      for (let s = 0; s < SUB; s++) {
        const t = (f + s / SUB) / FPS;                            // forward shutter: cuts on frame boundaries stay clean
        const buf = await grab(p, t, 'image/jpeg', 0.97);
        if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
      }
      if (w === 0 && (f - f0) % 60 === 0) console.log(`worker0 frame ${f - f0}/${f1 - f0}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    enc.stdin.end(); await done;
  }));
  fs.writeFileSync(path.join(OUT, 'segs.txt'), segs.map(s => `file '${s}'`).join('\n'));
  const final = path.join(OUT, 'alpha_engineers_reel.mp4');
  ff(['-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'segs.txt'), '-i', path.join(OUT, 'soundtrack.wav'),
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-af', 'alimiter=limit=0.94:level=false', '-c:a', 'aac', '-b:a', '320k', '-t', String(DUR), '-movflags', '+faststart', final]);
  segs.forEach(s => fs.unlinkSync(s));
  console.log('wrote', final, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}

await browser.close();
