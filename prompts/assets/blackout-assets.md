# 블랙아웃 에셋 프롬프트 (PixAI)

## 공통 블록

- 작가: `artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice`
- 작가(전투·능력 컷, ⚔ 표시): 위 작가 + `, artist:murata_yusuke`
- 퀄리티(인물·실루엣·클로즈업): `masterpiece, best quality, (high complexity:1.7), highres, absurdres, best illustration, novel illustration, no text, illustchuky (style), illustchuky, good body, flawless eyes, yuki18 style, 8k`
- 퀄리티(배경): `masterpiece, best quality, (high complexity:1.7), highres, absurdres, best illustration, novel illustration, no text, illustchuky (style), illustchuky, yuki18 style, 8k, highly detailed background`
- 네거티브(인물): `lowres, worst quality, bad quality, bad anatomy, bad hands, extra fingers, missing fingers, extra limbs, deformed face, asymmetrical eyes, cross-eyed, blurry, jpeg artifacts, text, watermark, signature, english text, logo, letters, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, feet` — 구두 컷(👞)은 `shoes, boots, footwear, feet` 제외
- 네거티브(배경): `1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, humanoid, character, face, crowd, silhouette, figure, body, hands, animal, lowres, worst quality, bad quality, blurry, jpeg artifacts, text, english text, logo, letters, watermark, signature`

## 생성 규칙
- 원본 가로 2000px 이상: 표의 생성 해상도로 뽑고 2배 업스케일(Hires.fix 또는 업스케일러) 뒤 칸 비율로 중앙 크롭.
- 같은 구도 2버전(인천거리 정지/컬러, 실험장 내부/폭발, 레이나 B-21/B-29)은 같은 seed로 뽑고, 2번째는 img2img(denoise 0.45~0.6)로 만들면 구도가 맞는다.
- 글자(전광판·현수막·칠판·표지·청구서)는 비워 두고 렌더러/Claude가 얹는다.

## 1. 인물·클로즈업

### 👞 시온윤서_철골_A03  (A-03 · 1000×1500)
- 생성: 832×1216 생성 → 2배 업스케일 → 1000:1500 비율 크롭
```
2girls, full body, sitting on steel frame of a traffic light, legs dangling, swinging legs, from side, looking at viewer, mouth closed, sly smile, silver hair, short hair, sleek hair, yellow eyes, antique gold eyes, detailed iris, glossy eyes, eye highlights, long eyelashes, petite, ageless, oversized black coat, fur collar, sleeves past fingers, ivory ribbon tie, pocket watch chain, (small tilted golden crown floating above head:1.15), second girl sitting beside her, side view, mature female, grey hair, long hair, loosely tied hair, loose hair strands, dull gold eyes, detailed iris, subtle eye highlights, worn military coat, open coat, asymmetrical collar, faded shoulder patch, removed insignia mark, worn epaulette, wrinkled off-white shirt, open collar, cigarette, (partially colored:1.25), (greyscale background:1.2), monochrome city street, frozen debris floating mid-air, time stop, ash grey sky, faint rim light on characters, depth of field
```
N+: `color background, multiple boys, crowd`

### 시온_턱괴기_미소_MS  (A-14 · 1000×700)
- 생성: 1216×832 생성 → 2배 업스케일 → 1000:700 비율 크롭
```
1girl, solo, (upper body:1.5), (face focus:1.1), three quarter view, looking at viewer, mouth closed, chin rest, head on hand, smug, amused smile, silver hair, short hair, sleek hair, yellow eyes, antique gold eyes, detailed iris, glossy eyes, eye highlights, long eyelashes, petite, ageless, oversized black coat, fur collar, sleeves past fingers, ivory ribbon tie, pocket watch chain, (small tilted golden crown floating above head:1.15), (partially colored:1.2), (greyscale background:1.2), frozen grey city, suspended dust, soft gold rim light, depth of field
```
N+: `color background`

### 시온_정면응시_CU  (A-15 · 1000×760)
- 생성: 1152×896 생성 → 2배 업스케일 → 1000:760 비율 크롭
```
1girl, solo, (portrait:1.3), (face focus:1.2), straight-on, front view, looking at viewer, mouth closed, slight smile, smile with lips only, playful eyes, mischievous, silver hair, short hair, sleek hair, yellow eyes, antique gold eyes, detailed iris, glossy eyes, eye highlights, long eyelashes, petite, ageless, oversized black coat, fur collar, sleeves past fingers, ivory ribbon tie, pocket watch chain, (small tilted golden crown floating above head:1.15), (partially colored:1.2), (greyscale background:1.15), frozen grey world, cold flat light, gold eye highlights, depth of field
```
N+: `three quarter view, open mouth`

### ⚔ 시온_손가락튕김_ECU  (A-16 · 1000×380)
- 생성: 1536×640 생성 → 2배 업스케일 → 1000:380 비율 크롭
```
1girl, solo, (head out of frame:1.2), close-up, (hand focus:1.3), finger snap, snapping fingers, sleeve past wrist, black coat sleeve, fur trim, (grey world cracking from fingertips:1.2), color spreading through cracks, shattering monochrome, glass-like fragments, golden sparks, gold light leaking, high contrast, dynamic, depth of field
```
N+: `face, eyes, multiple hands`

### 시온_능글미소_CU  (A-19 · 1000×600)
- 생성: 1344×768 생성 → 2배 업스케일 → 1000:600 비율 크롭
```
1girl, solo, (portrait:1.3), (face focus:1.2), straight-on, front view, looking at viewer, mouth closed, sly smile, smug, silver hair, short hair, sleek hair, yellow eyes, antique gold eyes, detailed iris, glossy eyes, eye highlights, long eyelashes, petite, ageless, oversized black coat, fur collar, sleeves past fingers, ivory ribbon tie, pocket watch chain, (small tilted golden crown floating above head:1.15), dust clouds, settling debris, warm sunlight breaking through dust, full color, gold rim light, light particles, depth of field
```
N+: `greyscale, monochrome, three quarter view`

### 시온_컵라면  (B-28d · 496×360)
- 생성: 1216×832 생성 → 2배 업스케일 → 496:360 비율 크롭
```
1girl, solo, (upper body:1.4), (face focus:1.1), three quarter view, looking at viewer, eating cup noodles, holding cup ramen, chopsticks, steam, relaxed, silver hair, short hair, sleek hair, yellow eyes, antique gold eyes, detailed iris, glossy eyes, eye highlights, long eyelashes, petite, ageless, oversized black coat, fur collar, sleeves past fingers, ivory ribbon tie, pocket watch chain, (small tilted golden crown floating above head:1.15), back row of auditorium seats, dim auditorium, stage light far away, warm steam glow, depth of field, comedic
```
N+: `crowd`

### ⚔ 윤서_담배_ECU  (A-04 · 1000×620)
- 생성: 1344×768 생성 → 2배 업스케일 → 1000:620 비율 크롭
```
1girl, solo, (extreme close-up:1.3), lips focus, lower face, cigarette in mouth, lighter flame, (lighter flame grazing hair ends:1.15), grey hair strands, ember glow, smoke, mature female, grey hair, long hair, loosely tied hair, loose hair strands, dull gold eyes, detailed iris, subtle eye highlights, worn military coat, open coat, asymmetrical collar, faded shoulder patch, removed insignia mark, worn epaulette, wrinkled off-white shirt, open collar, dark background, warm orange flame light on lips, deep shadows, high contrast, cinematic
```
N+: `full face, eyes`

### ⚔ 윤서_빛의막_전개  (A-17 · 1000×1400)
- 생성: 832×1216 생성 → 2배 업스케일 → 1000:1400 비율 크롭
```
1girl, solo, cowboy shot, from side, dynamic pose, one arm raised, (slanted translucent light barrier:1.3), (orange afterglow lines on barrier edges:1.15), mature female, grey hair, long hair, loosely tied hair, loose hair strands, dull gold eyes, detailed iris, subtle eye highlights, worn military coat, open coat, asymmetrical collar, faded shoulder patch, removed insignia mark, worn epaulette, wrinkled off-white shirt, open collar, mouth closed, serious, (colossal otherworld monster jaw lunging at her:1.25), giant teeth, monster saliva, impact, shockwave, cracked asphalt, color city street, sparks, dust, high contrast, motion blur, cinematic lighting
```
N+: `multiple girls`

### 👞 윤서_구두_꽁초  (A-18 · 1000×340)
- 생성: 1536×640 생성 → 2배 업스케일 → 1000:340 비율 크롭
```
1girl, solo, (head out of frame:1.2), close-up, (foot focus:1.2), black leather dress shoe, stepping on cigarette butt, grinding cigarette butt, ash smear, cracked asphalt, coat hem, dusk light, smoke wisp, low angle, depth of field
```
N+: `face`

### 윤서_팔짱_벽  (B-28c · 496×360)
- 생성: 1216×832 생성 → 2배 업스케일 → 496:360 비율 크롭
```
1girl, solo, (upper body:1.4), (face focus:1.1), three quarter view, looking away, mouth closed, crossed arms, leaning against wall, not clapping, tired expression, unimpressed, mature female, grey hair, long hair, loosely tied hair, loose hair strands, dull gold eyes, detailed iris, subtle eye highlights, worn military coat, open coat, asymmetrical collar, faded shoulder patch, removed insignia mark, worn epaulette, wrinkled off-white shirt, open collar, auditorium side wall, pastel stage light spill, dim corner, depth of field
```
N+: `smile, clapping`

### 윤서_뒷모습_교실  (C-20 · 1000×480)
- 생성: 1536×640 생성 → 2배 업스케일 → 1000:480 비율 크롭
```
1girl, solo, from behind, back view, walking away, leaving, mature female, grey hair, long hair, loosely tied hair, loose hair strands, dull gold eyes, detailed iris, subtle eye highlights, worn military coat, open coat, asymmetrical collar, faded shoulder patch, removed insignia mark, worn epaulette, wrinkled off-white shirt, open collar, empty classroom, blackboard with chalk line, chalk dust, afternoon light through windows, long shadows, open door, depth of field, melancholy
```
N+: `face, front view`

### 👞 레이나_구두_ECU  (B-02 · 1000×420)
- 생성: 1536×640 생성 → 2배 업스케일 → 1000:420 비율 크롭
```
1girl, solo, (head out of frame:1.2), close-up, (foot focus:1.2), pink heels, magical girl shoes, frilled ankle ribbons, heel striking wet concrete, water splash, rain, puddle ripples, ash water, night, cold blue light, motion blur, low angle
```
N+: `face`

### 레이나_변신복_달림_뒷모습  (B-03 · 1000×760)
- 생성: 1152×896 생성 → 2배 업스케일 → 1000:760 비율 크롭
```
1girl, solo, from behind, back view, running, light blonde hair, long hair, wavy hair, wet hair, hair stuck to face, magenta eyes, detailed iris, glossy eyes, long eyelashes, wet eyelashes, (pink frilled magical girl outfit:1.2), layered pink frills, puffy sleeves, pink ribbons, rose brooch, soaked fabric, ash stains, blood stains, heavy rain, collapsed ruins, wet concrete, ash puddles, distant fire glow, cold blue night light, motion blur, depth of field, desperate
```
N+: `face, front view`

### [①] 레이나_수술대_손잡기 (B-11, B-12·B-15 크롭)  (B-11 · 1000×600 (크롭용 큰 원본))
- 생성: 1344×768 생성 → 2배 업스케일 → 1000:600 비율 크롭
```
2girls, (upper body:1.4), (face focus:1.15), three quarter view, kneeling beside operating table, holding hands, (clasping another girl's hands with both hands:1.2), (thumb resting on wrist pulse:1.1), tears, crying, (calculating eyes:1.1), light blonde hair, long hair, wavy hair, wet hair, hair stuck to face, magenta eyes, detailed iris, glossy eyes, long eyelashes, wet eyelashes, (pink frilled magical girl outfit:1.2), layered pink frills, puffy sleeves, pink ribbons, rose brooch, soaked fabric, ash stains, blood stains, second girl lying on operating table, pale hands, grey hair, white hair, long hair, straight hair, purple eyes, detailed iris, glossy eyes, long eyelashes, white eyelashes, ruined laboratory, surgical lights, floating glass shards, black mana tubes, cold green light, red emergency light, deep shadows, depth of field
```
N+: `smile`

### ⚔ 레이나_손끝_붉은마력  (B-16 · 1000×560)
- 생성: 1344×768 생성 → 2배 업스케일 → 1000:560 비율 크롭
```
1girl, solo, (head out of frame:1.2), close-up, (hand focus:1.3), fingertips, (red mana rising like threads from fingertips:1.25), crimson glowing threads, rose-shaped sparks, pink frilled sleeve, rain droplets, dark ruined lab, crimson light, deep shadows, high contrast
```
N+: `face`

### ⚔ [②] 레이나_다정한미소_CU (B-21, B-20 크롭)  (B-21 · 1000×900)
- 생성: 1024×1024 생성 → 2배 업스케일 → 1000:900 비율 크롭
```
1girl, solo, (portrait:1.3), (face focus:1.2), straight-on, front view, looking at viewer, mouth closed, (gentle smile:1.2), kind smile, tears, wet cheeks, (fresh cut on cheek:1.15), glass shard flying past cheek, not flinching, light blonde hair, long hair, wavy hair, wet hair, hair stuck to face, magenta eyes, detailed iris, glossy eyes, long eyelashes, wet eyelashes, (pink frilled magical girl outfit:1.2), layered pink frills, puffy sleeves, pink ribbons, rose brooch, soaked fabric, ash stains, blood stains, ruined laboratory, explosion light behind, crimson rim light, floating glass shards, rain, depth of field
```
N+: `three quarter view, open mouth`

### ⚔ 레이나_손가락튕김  (B-22 · 1000×340)
- 생성: 1536×640 생성 → 2배 업스케일 → 1000:340 비율 크롭
```
1girl, solo, (head out of frame:1.2), close-up, (hand focus:1.3), light finger flick, flicking fingers, pink frilled sleeve, crimson sparks, rose petals bursting, dark background, crimson light, motion lines
```
N+: `face`

### 레이나_리본줍기  (B-24 · 1000×440)
- 생성: 1536×640 생성 → 2배 업스케일 → 1000:440 비율 크롭
```
1girl, solo, (head out of frame:1.2), close-up, (hand focus:1.3), picking up ribbon, tea-colored ribbon, olive brown ribbon, dirty wet ribbon, putting into pocket, pink frilled sleeve, rubble, ash, rain puddle, cold light, quiet
```
N+: `face`

### 레이나_손목리본_CU  (B-25 · 1000×460)
- 생성: 1536×640 생성 → 2배 업스케일 → 1000:460 비율 크롭
```
1girl, solo, (head out of frame:1.2), close-up, (wrist focus:1.3), white glove, neatly tied tea-colored ribbon, olive brown ribbon around wrist, cream white tailcoat sleeve, gold cuff button, daylight, soft sunlight, clean, elegant, depth of field
```
N+: `face`

### 레이나_단상연설  (B-27 · 1000×700)
- 생성: 1216×832 생성 → 2배 업스케일 → 1000:700 비율 크롭
```
1girl, solo, (upper body:1.4), (face focus:1.1), standing at podium, speech, microphone, three quarter view, looking at viewer, perfect smile, mouth closed, poised, light blonde hair, long hair, wavy hair, voluminous hair, side swept bangs, thin metal hairpin, magenta eyes, detailed iris, glossy eyes, eye highlights, long eyelashes, cream white tailcoat, double-breasted, high collar, structured shoulders, capelet, red inner lining, white collared shirt, crimson neck ribbon, (rose brooch:1.2), gold clasps, white gloves, tea-colored ribbon, olive brown ribbon on wrist, pastel auditorium, entrance ceremony, banners, camera drones, stage spotlights, pastel pink and sky blue lights, golden rim light, depth of field
```
N+: `crowd in focus`

### 레이나_정면미소_CU  (B-29 · 1000×500)
- 생성: 1344×768 생성 → 2배 업스케일 → 1000:500 비율 크롭
```
1girl, solo, (portrait:1.3), (face focus:1.2), straight-on, front view, looking at viewer, mouth closed, (gentle smile:1.2), kind smile, light blonde hair, long hair, wavy hair, voluminous hair, side swept bangs, thin metal hairpin, magenta eyes, detailed iris, glossy eyes, eye highlights, long eyelashes, cream white tailcoat, double-breasted, high collar, structured shoulders, capelet, red inner lining, white collared shirt, crimson neck ribbon, (rose brooch:1.2), gold clasps, white gloves, pastel auditorium background, soft stage light, golden rim light, subtle bloom, depth of field
```
N+: `three quarter view, tears`

### 레이나유안_어깨  (B-07 · 1000×400)
- 생성: 1536×640 생성 → 2배 업스케일 → 1000:400 비율 크롭
```
2girls, (upper body:1.3), side by side, (girl sleeping on another girl's shoulder:1.2), leaning on shoulder, afternoon nap, light blonde hair, long hair, wavy hair, magenta eyes, detailed iris, glossy eyes, long eyelashes, (pink frilled magical girl outfit:1.2), layered pink frills, puffy sleeves, pink ribbons, rose brooch, gentle smile, second girl asleep, grey hair, white hair, long hair, straight hair, purple eyes, detailed iris, glossy eyes, long eyelashes, white eyelashes, closed eyes, tea-colored ribbon, olive brown ribbon in hair, greenhouse bench, afternoon sunlight, dappled light, tea cups, warm golden light, nostalgic, soft focus
```
N+: `rain, blood`

### 유안_미소_찻잔  (B-06 · 1000×400)
- 생성: 1536×640 생성 → 2배 업스케일 → 1000:400 비율 크롭
```
1girl, solo, (upper body:1.4), (face focus:1.1), three quarter view, looking at viewer, gentle smile, mouth closed, offering teacup, holding teacup out, grey hair, white hair, long hair, straight hair, purple eyes, detailed iris, glossy eyes, long eyelashes, white eyelashes, tea-colored ribbon, olive brown ribbon in hair, white blouse, academy uniform, greenhouse, black tea steam, sunlight through glass, dappled light, warm golden light, nostalgic
```
N+: `glass crown, corruption`

### ⚔ [③] 유안_수술대_누움 (B-09, B-10 크롭)  (B-09 · 1000×1200)
- 생성: 896×1152 생성 → 2배 업스케일 → 1000:1200 비율 크롭
```
1girl, solo, lying on operating table, on back, from above, (upper body:1.3), unfocused eyes, half-conscious, grey hair, white hair, long hair, straight hair, purple eyes, detailed iris, glossy eyes, long eyelashes, white eyelashes, hospital gown, (black mana tubes attached to body:1.2), black veins spreading on skin, (floating glass shards:1.2), (half-formed glass crown above head:1.25), ruined laboratory, surgical lights, cold green light, crimson rim light, deep shadows, high contrast, tragic
```
N+: `nsfw, cleavage, nude`

### ⚔ 유안_가슴_장미표식_ECU  (B-17 · 1000×640)
- 생성: 1216×832 생성 → 2배 업스케일 → 1000:640 비율 크롭
```
close-up, collarbone, upper chest above hospital gown neckline, (black mana core glowing under skin:1.2), (small rose bud mark being engraved:1.25), crimson glowing lines, black veins, pale skin, dark background, crimson light, high contrast
```
N+: `nsfw, cleavage, nude, nipples, face`

### ⚔ 유안_눈_타락  (B-18 · 1000×380)
- 생성: 1536×640 생성 → 2배 업스케일 → 1000:380 비율 크롭
```
(extreme close-up:1.3), (eye focus:1.3), single eye, purple eye, (black corruption spreading from edge of iris:1.25), trembling white eyelashes, tear, glass reflection in eye, cold light, high contrast
```
N+: `full face`

### ⚔ 유안_타락_유리왕관_완성  (B-19 · 1000×1000)
- 생성: 1024×1024 생성 → 2배 업스케일 → 1000:1000 비율 크롭
```
1girl, solo, (upper body:1.4), (face focus:1.1), straight-on, looking at viewer, mouth closed, expressionless, cold eyes, black corruption in purple eyes, grey hair, white hair, long hair, straight hair, purple eyes, detailed iris, glossy eyes, long eyelashes, white eyelashes, floating hair, (completed glass crown behind her back:1.3), (glass shards all pointing forward at viewer:1.2), black lace overlay, torn hospital gown, black veins, ruined laboratory, prismatic refraction, violet light, crimson rim light, high contrast, overwhelming
```
N+: `smile, nsfw`

### 하은_이어폰_CU  (A-11 · 1000×520)
- 생성: 1344×768 생성 → 2배 업스케일 → 1000:520 비율 크롭
```
1girl, solo, (portrait:1.3), (face focus:1.2), three quarter view, looking at viewer, mouth closed, expressionless, (wireless earbuds:1.2), noise cancelling earphones, (bags under eyes:1.15), black hair, long hair, messy hair, hair between eyes, blue-grey eyes, detailed iris, glossy eyes, pale skin, oversized black hoodie, dim city night, cold blue light, depth of field
```
N+: `headphones, smile`

### 하은_이어폰_졸림  (B-28a · 496×360)
- 생성: 1216×832 생성 → 2배 업스케일 → 496:360 비율 크롭
```
1girl, solo, (upper body:1.3), (face focus:1.1), sleepy, drowsy, nodding off, head tilt, mouth closed, wireless earbuds, bags under eyes, black hair, long hair, messy hair, blue-grey eyes, oversized black hoodie, auditorium seat, entrance ceremony, pastel stage light, depth of field
```
N+: `headphones`

### 하진_무대_미소_CU  (A-12 · 1000×520)
- 생성: 1344×768 생성 → 2배 업스케일 → 1000:520 비율 크롭
```
1girl, solo, (portrait:1.3), (face focus:1.2), three quarter view, looking at viewer, (forced smile:1.15), encore smile, sweat, (bruise under makeup:1.15), faint bruise on cheek, coral hair, long hair, big side ribbon, peach-tinted brown eyes, detailed iris, sparkling eyes, glitter makeup, white idol costume, headset microphone, (taped wrist:1.1), athletic tape, concert stage, pink and gold spotlights, light beams, glitter particles, depth of field
```
N+: `crying`

### 나윤_바이크_MS (A-13·C-19 공용 가능)  (A-13 · 1000×520)
- 생성: 1344×768 생성 → 2배 업스케일 → 1000:520 비율 크롭
```
1girl, solo, (upper body:1.3), sitting on motorcycle, three quarter view, looking at viewer, mouth closed, nervous, sweat, (trembling hands on handlebars:1.15), brown hair, ponytail, goggles on head, dark green eyes, (oversized scuffed leather rider jacket:1.15), (125cc scooter motorcycle:1.15), (hazard lights blinking:1.2), front basket full of tangerines, old downtown alley at night, orange hazard light glow, wet asphalt reflections, depth of field
```
N+: `helmet`

### 나윤_긴장  (B-28b · 496×360)
- 생성: 1216×832 생성 → 2배 업스케일 → 496:360 비율 크롭
```
1girl, solo, (upper body:1.3), sitting in auditorium seat, mouth closed, nervous, sweat drop, (trembling knees:1.1), hands on knees, brown hair, ponytail, dark green eyes, oversized leather rider jacket, pastel auditorium, stage light, depth of field
```
N+: `smile`

### 하위랭커_손_청구서  (A-06 · 1000×680)
- 생성: 1216×832 생성 → 2배 업스케일 → 1000:680 비율 크롭
```
1girl, solo, (head out of frame:1.2), close-up, (hand focus:1.3), trembling hands holding repair invoice, paper bill, illegible text, (bandaged hands:1.2), scraped knuckles, underground maintenance depot, rusty pipes, flickering light, cold light, depth of field
```
N+: `face, readable text`

### 상위랭커_광고컷 (기본: 연하율 — 변경 가능)  (A-10 · 1000×760)
- 생성: 1152×896 생성 → 2배 업스케일 → 1000:760 비율 크롭
```
1girl, solo, (upper body:1.4), (face focus:1.1), looking at viewer, idol smile, sparkling eyes, advertisement poster style, (gradient hair:1.1), pink hair, light blue hair, long hair, twin side buns, amethyst eyes, detailed iris, gem-like eyes, white and pastel blue idol costume, iridescent fabric, amethyst gem brooch, glossy commercial lighting, lens flare, sparkles, pastel gradient background, glamorous
```
N+: `text`

### 학생군중  (C-09 · 1000×620)
- 생성: 1344×768 생성 → 2배 업스케일 → 1000:620 비율 크롭
```
(crowd:1.3), many students lining up, from behind, back view, academy uniforms, (faceless:1.1), in front of academy campus gate, morning light, long queue, depth of field
```
N+: `close-up, 1girl`

## 2. 실루엣

### 유안_실루엣_유리왕관  (A-09 · 1000×620)
- 생성: 1344×768 생성 → 2배 업스케일 → 1000:620 비율 크롭
```
1girl, solo, (silhouette:1.3), from behind, back view, faceless, long hair, (crown of floating glass shards above head:1.25), darkness, faint violet glow on glass edges, prismatic glints, black background, high contrast, ominous
```
N+: `face, eyes, colored clothes`

### 소녀들_실루엣  (A-02 · —)
- 생성: 1216×832 (자유)
```
multiple girls, (silhouette:1.3), faceless, holding pastel magical wands, glowing wand tips, standing in ruined city, collapsed buildings, ash grey sky, backlighting, rim light, dust
```
N+: `face, eyes`

### ⚔ 칠좌_실루엣_7 (A-07·C-11)  (A-07 · —)
- 생성: 1216×832 (자유)
```
(7girls:1.2), (silhouette:1.3), faceless, (glowing red eyes:1.3), backlighting, standing in a row, varied silhouettes, halo, cloak, wings, armor, flame hair, colossal gate behind, white-gold light, black foreground, high contrast, ominous
```
N+: `detailed face`

### 경계인_실루엣  (A-08 · —)
- 생성: 1216×832 (자유)
```
1girl, solo, (silhouette:1.3), faceless, traveler, cloak blowing in wind, twintails, standing on rooftop, full moon behind, moonlight, night sky, starlight, rim light
```
N+: `detailed face`

### 최초12인_실루엣  (C-02 · —)
- 생성: 1216×832 (자유)
```
(12girls:1.2), (silhouette:1.3), faceless, rising from ashes, standing in light, one girl shielding three children with her arms, ruined harbor, embers, ash, god rays, backlighting, hopeful, solemn
```
N+: `detailed face`

### 나윤_바이크_역광  (C-19 · 1000×520)
- 생성: 1344×768 생성 → 2배 업스케일 → 1000:520 비율 크롭 (A-13 재사용 시 생략)
```
1girl, solo, (backlighting:1.3), silhouette, sitting on motorcycle, (hazard lights turning on:1.2), orange blinking light, dark alley at night, light flare, wet ground reflections, rim light, dramatic
```
N+: `detailed face`

## 3. 사용자 담당 소품·이펙트

### 소품_통신기  (B-04 · —)
- 생성: 1216×832 (자유)
```
(extreme close-up:1.3), ear focus, (earpiece communicator in ear:1.25), small blinking light, wet hair strands, rain droplets, light blonde hair, night, cold blue light, depth of field
```
N+: `full face`

### ⚔ 이펙트_꽃잎폭발  (B-23 · —)
- 생성: 1216×832 (자유)
```
(no humans:1.3), (rose petal explosion:1.3), crimson petals bursting outward, shockwave, glass shards, crimson and pink light, ruined laboratory, debris, light rays, high contrast, dynamic
```
N+: `1girl, face`

### 이펙트_어긋난그림자  (C-12 · —)
- 생성: 1216×832 (자유)
```
1girl, solo, from behind, walking in narrow alley, (shadow out of sync with body:1.3), (shadow in a different pose:1.2), long shadow on wall, streetlight, night, Sinpo-dong old alley, eerie, uncanny
```
N+: `detailed face`

## 4. 배경

### 배경_칠월의밤_인천항  (A-01, C-01)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, torn ash grey sky, (seven glowing rings in the sky:1.25), incheon port at night, container cranes, burning harbor, smoke, embers, collapsed piers, red and grey light, apocalyptic, high contrast
```

### 배경_폐허도시  (A-02)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, ruined city, collapsed buildings, broken highway, ash grey sky, dust, scattered debris, faint pastel glow remnants, desolate
```

### 배경_인천거리_정지  (A-03)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, city street intersection, traffic light steel frame, (greyscale:1.3), (monochrome:1.2), (debris frozen mid-air:1.25), suspended glass and rubble, (blurred giant monster silhouette in background:1.15), time stop, flat grey light, eerie stillness
```

### 배경_인천거리_컬러  (A-17)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, same city street intersection, traffic light steel frame, full color, flying debris, cracked asphalt, dust clouds, giant monster shadow, sunset, orange and blue light, chaos
```

### 배경_아카데미정문_전광판  (A-05)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, academy main gate, pink and sky blue facade, pastel architecture, (large blank led billboard above gate:1.2), flower beds, clear day, bright sunlight, cheerful yet artificial
```

### 배경_지하정비창  (A-06)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, underground maintenance depot, rusty pipes, dripping water, broken magical equipment on workbenches, flickering fluorescent lights, cold green light, puddles, gritty
```

### 배경_기업타워_광고  (A-10)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, corporate skyscraper, (giant blank advertisement screen on building:1.2), city at night, neon, glass facade reflections, bright commercial lights, capitalism
```

### 배경_구도심골목_밤  (A-13)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, old downtown alley at night, narrow street, old shops with shutters, tangled power lines, single streetlight, wet asphalt, puddles, quiet
```

### 배경_침식구역_비밤  (B-01)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, eroded zone at night, heavy rain, (fungus-covered steel frames:1.2), rusted skeleton buildings, glowing fungi, distant rescue team lights, searchlights in rain, cold blue, ominous
```

### 배경_온실  (B-05)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, academy greenhouse, tea table with black tea set, steam, sunlight through glass roof, dappled light, potted plants, roses, warm golden light, peaceful
```

### 배경_실험장_철문  (B-08)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, heavy iron door of experimental facility, rusted rivets, warning stripes, scratched paint, dim corridor, flickering red light, ominous
```

### 배경_폐허실험장_내부  (B-09)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, ruined laboratory interior, operating table in center, black mana tubes hanging, broken surgical lights, floating glass shards, cracked walls, cold green light, eerie
```

### 배경_폐허실험장_폭발  (B-23)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, same ruined laboratory, explosion, crimson light burst, rose petals flying, debris, glass shards, shockwave, smoke, high contrast
```

### 배경_대강당_입학식  (B-27)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, pastel auditorium, entrance ceremony, stage with podium, pastel banners without letters, rows of seats, (camera drones floating:1.15), stage spotlights, pink and sky blue lights, bright
```

### 배경_송도_아카데미전경  (C-03)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, academy campus panorama, modern city skyline, clear sky, bright day, pastel buildings, waterfront, wide shot, hopeful
```

### 배경_회색구역_내항  (C-04)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, grey zone inner harbor, overcast sky, rusted ships, abandoned warehouses, grey water, distant gleaming academy campus on the horizon, contrast, bleak
```

### 배경_방위청본청  (C-08)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, defense agency headquarters building, brutalist architecture, flags without emblems, imposing facade, overcast sky, cold light, authoritarian
```

### 배경_아카데미캠퍼스  (C-09)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, academy campus, main plaza, gate, clock tower, cherry trees, morning sunlight, clean pavement
```

### 배경_기업타워_회의실  (C-10)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, corporate boardroom, long glass table, (photos spread on table with blank price tags:1.2), floor-to-ceiling windows, city view, cold white light, clinical
```

### 배경_신포동골목  (C-12)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, sinpo-dong old alley, narrow market street, old signboards without letters, hanging lanterns, streetlight, night, wet pavement, nostalgic, eerie
```

### 배경_월미산계단  (C-13)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, wolmi mountain stairs, long stone steps through trees, (two blank wooden signposts:1.15), dusk, leaves, lanterns, quiet
```

### 배경_휴전기념식  (C-16)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, armistice memorial ceremony, outdoor stage, (blank banners:1.2), rows of white chairs, white chrysanthemums, flags, overcast sky, solemn
```

### 배경_빈사물함  (C-17)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, row of school lockers, one empty locker open, (removed nameplate marks:1.2), faded rectangle where nameplate was, dim hallway, afternoon light, lonely
```

### 배경_강의실칠판  (C-20)
- 생성: 1344×768 → 2배 업스케일
```
(no humans:1.3), (scenery:1.2), wide shot, classroom, (blank blackboard:1.2), chalk tray, empty desks, afternoon light through windows, chalk dust in light, quiet
```
