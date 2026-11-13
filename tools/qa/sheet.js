// node sheet.js out.png url [url...]  : 휴대폰 전체 화면을 잘라 한 장에 늘어놓는다
const { chromium } = require('playwright'); const { execFileSync } = require('child_process');
(async () => {
  const [,, out, ...urls] = process.argv;
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('blackout.gate', 'seen'); } catch (e) {} });
  const p = await ctx.newPage(); const files = [];
  for (let i = 0; i < urls.length; i++) {
    await p.goto('http://localhost:8765/' + urls[i]); await p.waitForTimeout(500);
    // 늦게 불러오는 그림을 깨우려고 끝까지 내렸다 올라온다
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 60)); } scrollTo({ top: 0, behavior: 'instant' }); });
    await p.waitForTimeout(300);
    const f = `${__dirname}/sheet-${i}.png`; await p.screenshot({ path: f, fullPage: true }); files.push(f);
  }
  await b.close();
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
out=sys.argv[1]; H=1500; tiles=[]
for f in sys.argv[2:]:
    im=Image.open(f).convert('RGB')
    for y in range(0, im.height, H):
        t=im.crop((0,y,390,min(y+H,im.height))); c=Image.new('RGB',(390,H),(60,0,60)); c.paste(t,(0,0)); tiles.append(c.resize((221,850)))
    tiles.append(Image.new('RGB',(12,850),(255,255,255)))
W=sum(t.width for t in tiles); s=Image.new('RGB',(W,850),(255,255,255)); x=0
for t in tiles: s.paste(t,(x,0)); x+=t.width
s.save(out); print(s.size)
`, out, ...files], { stdio: 'inherit' });
})();
