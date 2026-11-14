// Render pipeline for index.html
//   node render.mjs audio            -> out/soundtrack.wav (OfflineAudioContext)
//   node render.mjs beats            -> out/beats/beat_XX.png + out/contact_sheet.png (one frame per beat)
//   node render.mjs frames 0 1.25 .. -> out/check/t_<t>.png (spot checks)
//   node render.mjs video            -> out/alpha_engineers_reel.mp4 (60fps, 3 subframes/frame via tmix, muxed audio)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'out');
fs.mkdirSync(OUT, { recursive: true });
const FPS = 60, SUB = 3, DUR = 15, FRAMES = FPS * DUR;
const mode = process.argv[2];
const browser = await chromium.launch();

async function newPage() {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('PAGE ERROR', e));
  await p.goto('file://' + path.join(DIR, 'index.html'));
  await p.evaluate(() => window.ready);
  return p;
}
async function grab(p, t, type = 'image/png', q = 0.95) {
  const d = await p.evaluate(([t, type, q]) => { window.seek(t); return document.getElementById('c').toDataURL(type, q); }, [t, type, q]);
  return Buffer.from(d.slice(d.indexOf(',') + 1), 'base64');
}
const ff = (args) => { const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' }); if (r.status) throw new Error('ffmpeg failed'); };

if (mode === 'audio') {
  const p = await newPage();
  const b64 = await p.evaluate(() => window.renderAudio());
  fs.writeFileSync(path.join(OUT, 'soundtrack.wav'), Buffer.from(b64, 'base64'));
  console.log('wrote soundtrack.wav');
}

if (mode === 'beats') {
  const p = await newPage(); const bd = path.join(OUT, 'beats'); fs.mkdirSync(bd, { recursive: true });
  const off = parseFloat(process.argv[3] ?? '0.3');
  for (let k = 1; k <= 30; k++) fs.writeFileSync(path.join(bd, `beat_${String(k).padStart(2, '0')}.png`), await grab(p, (k - 1) * 0.5 + off));
  const fontfile = path.join(DIR, 'fonts', 'InterDisplay-Bold.otf');
  ff(['-framerate', '1', '-start_number', '1', '-i', path.join(bd, 'beat_%02d.png'),
    '-vf', `scale=384:216,pad=384:216,drawtext=fontfile=${fontfile}:text='beat %{eif\\:n+1\\:d}   %{eif\\:n*0.5+${off}\\:d}.%{eif\\:mod((n*5+${off * 10})\\,10)\\:d}s':x=10:y=8:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=4,drawbox=x=0:y=0:w=iw:h=ih:color=0x333333:t=1,tile=5x6`,
    '-frames:v', '1', path.join(OUT, 'contact_sheet.png')]);
  console.log('wrote contact_sheet.png');
}

if (mode === 'frames') {
  const p = await newPage(); const cd = path.join(OUT, 'check'); fs.mkdirSync(cd, { recursive: true });
  for (const a of process.argv.slice(3)) fs.writeFileSync(path.join(cd, `t_${a}.png`), await grab(p, parseFloat(a)));
}

if (mode === 'video') {
  const WORKERS = parseInt(process.env.WORKERS || '4');
  const per = Math.ceil(FRAMES / WORKERS); const t0 = Date.now();
  const segs = [];
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const f0 = w * per, f1 = Math.min(FRAMES, f0 + per); const seg = path.join(OUT, `seg_${w}.mkv`); segs[w] = seg;
    const p = await newPage();
    const enc = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS * SUB), '-i', '-',
      '-vf', `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/(${FPS}*TB)`,
      '-r', String(FPS), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '8', '-pix_fmt', 'yuv444p', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((res, rej) => enc.on('close', c => c ? rej(new Error('enc ' + c)) : res()));
    for (let f = f0; f < f1; f++) {
      for (let s = 0; s < SUB; s++) {
        const t = (f + (s - (SUB - 1) / 2) / SUB) / FPS; // subframes centred on the frame time
        const buf = await grab(p, t, 'image/jpeg', 0.96);
        if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
      }
      if (w === 0 && f % 60 === 0) console.log(`frame ${f}/${f1} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    enc.stdin.end(); await done;
  }));
  fs.writeFileSync(path.join(OUT, 'segs.txt'), segs.map(s => `file '${s}'`).join('\n'));
  const final = path.join(OUT, 'alpha_engineers_reel.mp4');
  ff(['-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'segs.txt'), '-i', path.join(OUT, 'soundtrack.wav'),
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-af', 'volume=3dB,alimiter=limit=0.94:level=false', '-c:a', 'aac', '-b:a', '320k', '-t', String(DUR), '-movflags', '+faststart', final]);
  segs.forEach(s => fs.unlinkSync(s));
  console.log('wrote', final, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}

await browser.close();
