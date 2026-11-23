// Inlines src/*.js (in name order) into src/template.html -> index.html (one self-contained page).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
export function build() {
  const src = path.join(DIR, 'src');
  const js = fs.readdirSync(src).filter(f => f.endsWith('.js')).sort().map(f => `/* ---- ${f} ---- */\n` + fs.readFileSync(path.join(src, f), 'utf8')).join('\n');
  const html = fs.readFileSync(path.join(src, 'template.html'), 'utf8').replace('/*__JS__*/', () => js);
  fs.writeFileSync(path.join(DIR, 'index.html'), html);
  return html.length;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log('index.html', build(), 'bytes');
