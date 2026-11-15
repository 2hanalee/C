# 블랙아웃 에셋 프롬프트 — 로컬 SDXL(Illustrious/NoobAI 계열) 최적화판

## 사용법
- `BREAK` 지원 UI(WebUI·Forge, ComfyUI는 smZ/Conditioning Concat 노드)에서 그대로 붙여 넣기.
- 생성 해상도는 1MP 버킷만 사용 → 2배 업스케일(Hires.fix 0.35~0.45) → 칸 비율로 크롭.
- CFG 4~6, 28~35 steps (NoobAI 모델카드 기준).
- 자체 스타일 태그(illustchuky, yuki18 style)는 해당 LoRA/임베딩을 로드했을 때만 퀄리티 줄 끝에 추가.

## 1. 인물·클로즈업

### 👞 시온_앉음_3-4 (A-03 · 칸 1000×1500)
- 생성: 832×1216
- 메모: 윤서는 별도 컷(윤서_앉음_측면)으로 뽑아 합성
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, full body, sitting, from side, looking at viewer, smile, closed mouth, silver hair, short hair, yellow eyes, detailed eyes, petite BREAK black coat, fur-trimmed coat, oversized clothes, sleeves past fingers, neck ribbon, pocket watch, mini crown, tilted headwear BREAK traffic light, steel beam, (spot color:1.2), greyscale background, monochrome background, city, street, debris, floating rubble, grey sky
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, color background
```

### 👞 윤서_앉음_측면 (A-03 · 칸 1000×1500)
- 생성: 832×1216
- 메모: 시온 컷과 좌우로 합성
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, full body, sitting, from side, profile, looking ahead, closed mouth, cigarette, smoking, mature female, grey hair, long hair, loose hair, yellow eyes, detailed eyes, bags under eyes BREAK military coat, open coat, epaulettes, white shirt, collared shirt, open collar BREAK traffic light, steel beam, (spot color:1.2), greyscale background, monochrome background, city, street, debris, floating rubble, grey sky
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, color background
```

### 시온_턱괴기_미소_MS (A-14 · 칸 1000×700)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, head rest, hand on own chin, looking at viewer, smile, closed mouth, smug, silver hair, short hair, yellow eyes, detailed eyes, petite BREAK black coat, fur-trimmed coat, oversized clothes, sleeves past fingers, neck ribbon, pocket watch, mini crown, tilted headwear BREAK (spot color:1.2), greyscale background, monochrome background, city, street, debris, floating rubble, grey sky
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, color background
```

### 시온_정면응시_CU (A-15 · 칸 1000×760)
- 생성: 1216×832
- 메모: A-19와 같은 seed로 컬러 버전 생성
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, portrait, straight-on, looking at viewer, light smile, closed mouth, silver hair, short hair, yellow eyes, detailed eyes, petite BREAK black coat, fur-trimmed coat, oversized clothes, sleeves past fingers, neck ribbon, pocket watch, mini crown, tilted headwear BREAK (spot color:1.2), greyscale background, monochrome background, city, street, debris, floating rubble, grey sky
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, three quarter view, open mouth
```

### ⚔ 시온_손가락튕김_ECU (A-16 · 칸 1000×380)
- 생성: 1216×832 → 손 부분 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice, artist:murata_yusuke BREAK 1girl, solo, upper body, hand up, snapping fingers, silver hair, short hair, yellow eyes, detailed eyes, petite BREAK black coat, fur-trimmed coat, oversized clothes, sleeves past fingers, neck ribbon, pocket watch, mini crown, tilted headwear BREAK (spot color:1.1), greyscale background, cracks, shattered glass, color splash, golden sparks, light rays
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### 시온_능글미소_CU (A-19 · 칸 1000×600)
- 생성: 1216×832
- 메모: A-15 seed 재사용 → img2img
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, portrait, straight-on, looking at viewer, smile, closed mouth, smug, silver hair, short hair, yellow eyes, detailed eyes, petite BREAK black coat, fur-trimmed coat, oversized clothes, sleeves past fingers, neck ribbon, pocket watch, mini crown, tilted headwear BREAK dust, smoke, sunlight, light rays, rim light, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, greyscale, monochrome, three quarter view
```

### 시온_컵라면 (B-28d · 칸 496×360)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, sitting, eating, cup ramen, holding chopsticks, steam, silver hair, short hair, yellow eyes, detailed eyes, petite BREAK black coat, fur-trimmed coat, oversized clothes, sleeves past fingers, neck ribbon, pocket watch, mini crown, tilted headwear BREAK auditorium, seats, dim lighting, stage lights, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### 윤서_담배_ECU (A-04 · 칸 1000×620)
- 생성: 1216×832 → 입가 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, portrait, from side, cigarette, smoking, holding lighter, lighter flame, mature female, grey hair, long hair, loose hair, yellow eyes, detailed eyes, bags under eyes BREAK military coat, open coat, epaulettes, white shirt, collared shirt, open collar BREAK dark background, firelight, smoke, warm lighting, high contrast
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### ⚔ 윤서_빛의막_전개 (A-17 · 칸 1000×1400)
- 생성: 832×1216
- 메모: 괴수가 무너지면 괴수만 따로 뽑아 합성
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice, artist:murata_yusuke BREAK 1girl, solo, cowboy shot, from side, outstretched arm, energy shield, barrier, translucent, orange light, serious, closed mouth, mature female, grey hair, long hair, loose hair, yellow eyes, detailed eyes, bags under eyes BREAK military coat, open coat, epaulettes, white shirt, collared shirt, open collar BREAK giant monster, kaijuu, open mouth, sharp teeth, city, street, impact, sparks, dust, motion blur, dramatic lighting
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, multiple girls
```

### 👞 윤서_구두_꽁초 (A-18 · 칸 1000×340)
- 생성: 1216×832 → 발 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, lower body, standing, black footwear, loafers, stepping on cigarette, cigarette butt, smoke, military coat, open coat, epaulettes, white shirt, collared shirt, open collar BREAK asphalt, dusk, from side, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, upper body
```

### 윤서_팔짱_벽 (B-28c · 칸 496×360)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, crossed arms, against wall, looking away, closed mouth, expressionless, mature female, grey hair, long hair, loose hair, yellow eyes, detailed eyes, bags under eyes BREAK military coat, open coat, epaulettes, white shirt, collared shirt, open collar BREAK auditorium, wall, dim lighting, stage lights, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, smile, clapping
```

### 윤서_뒷모습_교실 (C-20 · 칸 1000×480)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, cowboy shot, from behind, facing away, walking away, mature female, grey hair, long hair, loose hair, yellow eyes, detailed eyes, bags under eyes BREAK military coat, open coat, epaulettes, white shirt, collared shirt, open collar BREAK classroom, chalkboard, doorway, afternoon, sunlight, long shadows
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, face
```

### 👞 레이나_구두_ECU (B-02 · 칸 1000×420)
- 생성: 1216×832 → 발 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, lower body, running, from side, pink footwear, high heels, splashing, puddle, magical girl, pink dress, frilled dress, puffy sleeves, pink ribbon, wet clothes, dirty clothes, blood on clothes BREAK rain, night, wet ground, ruins, blue lighting, motion blur
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, upper body
```

### 레이나_변신복_달림_뒷모습 (B-03 · 칸 1000×760)
- 생성: 1152×896
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, cowboy shot, from behind, facing away, running, wet hair, blonde hair, long hair, wavy hair, magenta eyes, detailed eyes BREAK magical girl, pink dress, frilled dress, puffy sleeves, pink ribbon, wet clothes, dirty clothes, blood on clothes BREAK heavy rain, ruins, wet ground, puddle, fire, blue lighting, motion blur
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, face
```

### [①] 레이나_수술대 (B-11 · B-12/B-15 크롭) (B-11 · 칸 1000×600)
- 생성: 1216×832
- 메모: 유안은 손만 보이게. 엄지·눈 컷은 업스케일 후 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo focus, upper body, kneeling, holding another's hand, holding another's wrist, out of frame, looking down, tears, crying, expressionless, wet hair, blonde hair, long hair, wavy hair, magenta eyes, detailed eyes BREAK magical girl, pink dress, frilled dress, puffy sleeves, pink ribbon, wet clothes, dirty clothes, blood on clothes BREAK operating table, surgical light, laboratory, ruins, glass shards, cables, green lighting, red lighting, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, smile, 2girls
```

### ⚔ 레이나_손끝_붉은마력 (B-16 · 칸 1000×560)
- 생성: 1216×832 → 손 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice, artist:murata_yusuke BREAK 1girl, solo, upper body, hand up, glowing hand, red aura, magic, red threads, blonde hair, long hair, wavy hair, magenta eyes, detailed eyes BREAK magical girl, pink dress, frilled dress, puffy sleeves, pink ribbon, wet clothes, dirty clothes, blood on clothes BREAK ruins, dark, rain, red lighting, high contrast
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### ⚔ [②] 레이나_다정한미소 (B-21 · B-20 크롭) (B-21 · 칸 1000×900)
- 생성: 1024×1024
- 메모: B-29도 같은 seed로
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice, artist:murata_yusuke BREAK 1girl, solo, portrait, straight-on, looking at viewer, smile, closed mouth, tears, wet face, scratch on cheek, blood on face, wet hair, blonde hair, long hair, wavy hair, magenta eyes, detailed eyes BREAK magical girl, pink dress, frilled dress, puffy sleeves, pink ribbon, wet clothes, dirty clothes, blood on clothes BREAK glass shards, flying debris, explosion, backlighting, red lighting, rain, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, three quarter view, open mouth
```

### ⚔ 레이나_손가락튕김 (B-22 · 칸 1000×340)
- 생성: 1216×832 → 손 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice, artist:murata_yusuke BREAK 1girl, solo, upper body, hand up, snapping fingers, blonde hair, long hair, wavy hair, magenta eyes, detailed eyes BREAK magical girl, pink dress, frilled dress, puffy sleeves, pink ribbon, wet clothes, dirty clothes, blood on clothes BREAK rose petals, red sparks, dark background, red lighting
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### 레이나_리본줍기 (B-24 · 칸 1000×440)
- 생성: 1216×832 → 손 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, kneeling, looking down, holding ribbon, brown ribbon, blonde hair, long hair, wavy hair, magenta eyes, detailed eyes BREAK magical girl, pink dress, frilled dress, puffy sleeves, pink ribbon, wet clothes, dirty clothes, blood on clothes BREAK rubble, ash, rain, puddle, blue lighting
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### 레이나_손목리본_CU (B-25 · 칸 1000×460)
- 생성: 1216×832 → 손목 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, hand up, wrist ribbon, brown ribbon, white gloves, blonde hair, long hair, wavy hair, magenta eyes, detailed eyes BREAK white jacket, tailcoat, double-breasted, high collar, capelet, red neck ribbon, brooch, white gloves BREAK daytime, sunlight, window, soft lighting, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### 레이나_단상연설 (B-27 · 칸 1000×700)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, podium, microphone, looking at viewer, smile, closed mouth, blonde hair, long hair, wavy hair, magenta eyes, detailed eyes BREAK white jacket, tailcoat, double-breasted, high collar, capelet, red neck ribbon, brooch, white gloves, wrist ribbon BREAK auditorium, stage, drone, spotlight, pastel colors, pink lighting, blue lighting, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### 레이나_정면미소_CU (B-29 · 칸 1000×500)
- 생성: 1024×1024 → 2:1 크롭
- 메모: ② seed 재사용 → img2img로 의상만 교체
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, portrait, straight-on, looking at viewer, smile, closed mouth, blonde hair, long hair, wavy hair, magenta eyes, detailed eyes BREAK white jacket, tailcoat, double-breasted, high collar, capelet, red neck ribbon, brooch, white gloves BREAK auditorium, stage lights, pastel colors, bloom, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, three quarter view, tears
```

### 레이나유안_어깨 (B-07 · 칸 1000×400)
- 생성: 1216×832
- 메모: 두 인물 속성이 섞이면 Regional Prompter로 좌/우 분리
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 2girls, upper body, side-by-side, sitting, head on another's shoulder, sleeping, smile BREAK blonde hair girl, blonde hair, long hair, wavy hair, magenta eyes, detailed eyes, pink dress BREAK grey hair girl, grey hair, white hair, long hair, purple eyes, white eyelashes, detailed eyes, closed eyes, brown hair ribbon, greenhouse, afternoon, sunlight, dappled sunlight, tea
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, rain, blood
```

### 유안_미소_찻잔 (B-06 · 칸 1000×400)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, holding cup, teacup, offering, looking at viewer, smile, closed mouth, grey hair, white hair, long hair, purple eyes, white eyelashes, detailed eyes BREAK brown hair ribbon, white shirt, school uniform BREAK greenhouse, steam, sunlight, dappled sunlight, warm lighting
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, crown
```

### ⚔ [③] 유안_수술대 (B-09 · B-10 크롭) (B-09 · 칸 1000×1200)
- 생성: 896×1152
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice, artist:murata_yusuke BREAK 1girl, solo, lying, on back, from above, upper body, looking up, expressionless, grey hair, white hair, long hair, purple eyes, white eyelashes, detailed eyes BREAK hospital gown, black veins, tubes, cables BREAK operating table, laboratory, ruins, glass shards, floating, crystal crown, green lighting, red lighting, high contrast
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, nsfw, cleavage, nude
```

### ⚔ 유안_가슴_장미표식_ECU (B-17 · 칸 1000×640)
- 생성: 1216×832 → 쇄골 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice, artist:murata_yusuke BREAK 1girl, solo, upper body, collarbone, chest tattoo, rose tattoo, glowing tattoo, black veins, grey hair, white hair, long hair, purple eyes, white eyelashes, detailed eyes BREAK hospital gown BREAK dark background, red lighting, high contrast
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, nsfw, cleavage, nude, nipples
```

### ⚔ 유안_눈_타락 (B-18 · 칸 1000×380)
- 생성: 1216×832 → 눈 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice, artist:murata_yusuke BREAK 1girl, solo, portrait, close-up, looking at viewer, ringed eyes, dark aura, black veins on face, tears, grey hair, white hair, long hair, purple eyes, white eyelashes, detailed eyes BREAK dark background, purple lighting, high contrast
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### ⚔ 유안_타락_유리왕관_완성 (B-19 · 칸 1000×1000)
- 생성: 1024×1024
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice, artist:murata_yusuke BREAK 1girl, solo, upper body, straight-on, looking at viewer, expressionless, closed mouth, black veins, grey hair, white hair, long hair, purple eyes, white eyelashes, detailed eyes, floating hair BREAK crystal crown, glass shards, floating, black dress, torn clothes BREAK laboratory, ruins, prismatic light, purple lighting, red lighting, high contrast
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, smile, nsfw
```

### 하은_이어폰_CU (A-11 · 칸 1000×520)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, portrait, looking at viewer, expressionless, closed mouth, bags under eyes, black hair, long hair, messy hair, blue eyes, detailed eyes BREAK earbuds, wireless earphones, black hoodie BREAK night, city, blue lighting, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, headphones
```

### 하은_이어폰_졸림 (B-28a · 칸 496×360)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, sitting, sleepy, closed mouth, head tilt, bags under eyes, black hair, long hair, messy hair, blue eyes BREAK earbuds, black hoodie BREAK auditorium, seats, stage lights, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, headphones
```

### 하진_무대_미소_CU (A-12 · 칸 1000×520)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, portrait, looking at viewer, smile, sweat, bruise on face, orange hair, long hair, side ribbon, brown eyes, detailed eyes BREAK idol clothes, white dress, headset, bandaged wrist BREAK stage, spotlight, pink lighting, sparkle, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, crying
```

### 나윤_바이크_MS (A-13 · C-19 공용 · 칸 1000×520)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, on motorcycle, scooter, hands on handlebars, nervous, sweat, closed mouth, brown hair, ponytail, goggles on head, green eyes BREAK leather jacket, oversized jacket, basket, mandarin orange BREAK alley, night, orange lights, wet ground, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, helmet
```

### 나윤_긴장 (B-28b · 칸 496×360)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, sitting, nervous, sweat, hands on own knees, closed mouth, brown hair, ponytail, green eyes BREAK leather jacket BREAK auditorium, seats, stage lights, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, smile
```

### 하위랭커_손_청구서 (A-06 · 칸 1000×680)
- 생성: 1216×832 → 손 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, holding paper, reading, looking down, trembling, brown hair, short hair BREAK school uniform, bandaged hands, bandages BREAK underground, pipes, rust, flickering light, dim lighting
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### 상위랭커_광고컷 (연하율) (A-10 · 칸 1000×760)
- 생성: 1152×896
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, upper body, looking at viewer, smile, closed mouth, gradient hair, pink hair, blue hair, long hair, double bun, purple eyes, detailed eyes BREAK idol clothes, white dress, frills, brooch BREAK gradient background, sparkle, lens flare, glossy
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

## 2. 실루엣·군중

### 유안_실루엣_유리왕관 (A-09 · 칸 1000×620)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, silhouette, from behind, long hair, crystal crown, glass shards BREAK dark background, purple lighting, rim light, high contrast
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, face
```

### 나윤_바이크_역광 (C-19 · 칸 1000×520)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, silhouette, on motorcycle, scooter, backlighting BREAK alley, night, headlight, orange lights, lens flare, wet ground
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### 학생군중 (C-09 · 칸 1000×620)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 6+girls, crowd, from behind, facing away, school uniform, queue BREAK school gate, campus, morning, sunlight, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, close-up
```

### 소녀들_실루엣 (A-02 · 칸 —)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 6+girls, silhouette, holding wand, magical girl BREAK ruins, city, grey sky, backlighting, dust
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, face
```

### ⚔ 칠좌_실루엣_7 (A-07 · C-11 · 칸 —)
- 생성: 1216×832
- 메모: 인원 수는 정확히 7명이 안 나올 수 있음 → 여러 장 중 선택
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice, artist:murata_yusuke BREAK 6+girls, silhouette, standing, red eyes, glowing eyes, backlighting BREAK halo, cloak, wings, armor BREAK giant gate, white light, dark foreground, high contrast
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, face
```

### 경계인_실루엣 (A-08 · 칸 —)
- 생성: 832×1216
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, silhouette, standing, rooftop, cloak, twintails, wind BREAK full moon, night sky, stars, moonlight, rim light
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, face
```

### 최초12인_실루엣 (C-02 · 칸 —)
- 생성: 1216×832
- 메모: 아이 셋을 감싼 인물은 별도 실루엣으로 뽑아 합성 권장
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 6+girls, silhouette, standing, backlighting BREAK ruins, ashes, embers, harbor, light rays
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, face
```

### 이펙트_어긋난그림자 (C-12 · 칸 —)
- 생성: 832×1216
- 메모: '몸과 어긋난 그림자'는 로컬 모델로 재현이 거의 불가 → 그림자만 편집에서 반전·이동
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, from behind, walking, long shadow BREAK alley, night, streetlight, wall, shadow
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, face
```

## 3. 소품·이펙트

### 소품_통신기 (B-04 · 칸 —)
- 생성: 1216×832 → 귀 크롭
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK 1girl, solo, portrait, from side, earpiece, wet hair, blonde hair BREAK rain, night, blue lighting, depth of field
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

### ⚔ 이펙트_꽃잎폭발 (B-23 · 칸 —)
- 생성: 1216×832
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice, artist:murata_yusuke BREAK (no humans:1.3), rose petals, falling petals, explosion, shockwave, glass shards BREAK laboratory, ruins, red lighting, pink lighting, light rays, high contrast
```
네거티브
```
worst quality, low quality, lowres, bad quality, bad anatomy, bad hands, mutated hands, extra digits, fewer digits, old, early, signature, username, logo, watermark, text, nsfw, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear
```

## 4. 배경

### 배경_칠월의밤_인천항 (A-01 · C-01)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, harbor, port, crane, burning, smoke, embers, night BREAK grey sky, torn sky, glowing rings, ring, cracks in sky BREAK red lighting, fire, high contrast
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_폐허도시 (A-02)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, ruins, city, collapsed building, broken road BREAK dust, debris, grey sky BREAK overcast, dim lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_인천거리_정지 (A-03)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, city, street, intersection, traffic light BREAK (greyscale:1.2), monochrome, floating rubble, debris, giant monster silhouette, blurry BREAK flat lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_인천거리_컬러 (A-17)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, city, street, intersection, traffic light BREAK debris, cracked ground, dust, smoke BREAK sunset, orange lighting, blue lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_아카데미정문_전광판 (A-05)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, school gate, building, pastel colors, pink building, blue building BREAK billboard, blank screen, flower bed BREAK daytime, sunlight, blue sky
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_지하정비창 (A-06)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, underground, garage, pipes, rust, workbench BREAK machinery, puddle BREAK flickering light, green lighting, dim lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_기업타워_광고 (A-10)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, skyscraper, city, night, neon lights BREAK billboard, blank screen, glass BREAK city lights, reflection
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_구도심골목_밤 (A-13)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, alley, night, old building, shutters, power lines BREAK streetlight, puddle, wet ground BREAK dim lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_침식구역_비밤 (B-01)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, ruins, steel frame, rust, mushroom, fungus, night BREAK rain, searchlight, distant lights BREAK blue lighting, fog
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_온실 (B-05)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, greenhouse, plant, rose, table, teacup, teapot BREAK steam, glass roof BREAK sunlight, dappled sunlight, warm lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_실험장_철문 (B-08)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, metal door, rivets, corridor, hazard stripes BREAK rust, scratches BREAK red lighting, dim lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_폐허실험장_내부 (B-09)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, laboratory, operating table, cables, tubes, ruins BREAK glass shards, broken glass, broken light BREAK green lighting, dim lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_폐허실험장_폭발 (B-23)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, laboratory, operating table, ruins BREAK explosion, rose petals, glass shards, smoke, debris BREAK red lighting, light rays, high contrast
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_대강당_입학식 (B-27)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, auditorium, stage, podium, seats, pastel colors BREAK drone, banner, blank banner BREAK spotlight, pink lighting, blue lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_송도_아카데미전경 (C-03)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, city, skyline, campus, building, waterfront BREAK blue sky, cloud BREAK daytime, sunlight
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_회색구역_내항 (C-04)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, harbor, ship, warehouse, rust, grey water BREAK overcast, distant city BREAK dim lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_방위청본청 (C-08)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, building, government building, flag, stairs BREAK overcast sky BREAK cold lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_아카데미캠퍼스 (C-09)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, campus, school, plaza, clock tower, cherry blossoms BREAK pavement BREAK morning, sunlight
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_기업타워_회의실 (C-10)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, meeting room, table, glass table, window, city BREAK photograph, papers BREAK cold lighting, white lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_신포동골목 (C-12)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, alley, old building, market, signboard, lantern BREAK night, wet ground BREAK streetlight, warm lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_월미산계단 (C-13)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, stairs, stone stairs, forest, tree BREAK sign, blank sign, lantern BREAK dusk, warm lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_휴전기념식 (C-16)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, stage, chair, flower, white flower, flag BREAK blank banner BREAK overcast, cold lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_빈사물함 (C-17)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, locker, hallway, school BREAK empty, open locker BREAK afternoon, sunlight, dim lighting
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```

### 배경_강의실칠판 (C-20)
- 생성: 1216×832 → 업스케일
포지티브
```
masterpiece, best quality, newest, absurdres, highres, safe, artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice BREAK (no humans:1.3), (scenery:1.2), wide shot, classroom, chalkboard, desk, window BREAK chalk, empty classroom BREAK afternoon, sunlight, light rays
```
네거티브
```
1girl, 1boy, multiple girls, multiple boys, solo, person, people, human, character, face, crowd, silhouette, worst quality, low quality, lowres, old, early, signature, username, logo, watermark, text
```
