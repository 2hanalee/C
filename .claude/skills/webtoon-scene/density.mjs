#!/usr/bin/env node
// 콘티 정보 밀도 측정 (condense-pass.md 1단계)
// 사용법: TMPD=/tmp/x node .claude/skills/webtoon-scene/density.mjs episodes/<작품>/canvas v2_1.dc.html v2_2.dc.html ...
// 출력: 장마다 나레이션·말풍선·네임플레이트·강조 타이포 개수, 컷 수, 글자 수, 그림 면적 대비 텍스트 면적(JSON)
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const [src, ...files] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1000,height:1200}});
const out=[];
for (const f of files) {
  let h = fs.readFileSync(path.join(src,f),'utf8').replace(/<script src="\.\/support\.js"><\/script>/g,'').replace(/<script type="text\/x-dc"[\s\S]*?<\/script>/g,'').replace(/<\/?x-dc>|<\/?helmet>/g,'').replace(/\{\{\s*ld\s*\}\}/g,'none');
  const tmp = path.join((process.env.TMPD || '/tmp'), f+'.html'); fs.writeFileSync(tmp,h);
  await p.goto('file://'+tmp,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
  const r = await p.evaluate(()=>{
    const pg=document.querySelector('.pg'); const q=s=>[...pg.querySelectorAll(s)].filter(e=>getComputedStyle(e).display!=='none');
    const txt=e=>e.textContent.replace(/\s+/g,'');
    const nar=q('.nar'), bal=q('.bal'), np=q('.np'), ph=q('.ph');
    const disp=q('.disp,.num,.brush'); 
    const narChars=nar.reduce((a,e)=>a+txt(e).length,0), balChars=bal.reduce((a,e)=>a+txt(e).length,0);
    const allText=[...nar,...bal,...np,...disp].reduce((a,e)=>a+txt(e).length,0);
    // panel area (image) vs text box area
    const area=els=>els.reduce((a,e)=>{const r=e.getBoundingClientRect();return a+r.width*r.height},0);
    const labs=[...pg.querySelectorAll('.lab')].map(l=>(l.textContent.match(/K-\d+[a-z]?/)||[''])[0]).filter(Boolean);
    return {nar:nar.length,bal:bal.length,np:np.length,disp:disp.length,cuts:labs.filter(x=>x).length,narChars,balChars,allText,imgArea:Math.round(area(ph.filter(e=>!e.parentElement.closest('.ph')))/1000),textArea:Math.round(area([...nar,...bal,...np])/1000)};
  });
  out.push({f,...r});
}
console.log(JSON.stringify(out));
await b.close();
