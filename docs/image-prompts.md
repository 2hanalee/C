# 이미지 생성 프롬프트 묶음

ChatGPT 이미지 생성용입니다. 프롬프트는 영어, 설명은 한국어입니다. 사용법과 근거는 맨 아래에 있습니다.

## 키비주얼

16:9. API를 쓴다면 1536x864 또는 2560x1440.

### KV1 · 정전의 하란 (메인 표지)

Blackout over Haran

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: key visual for the top of a website's main page, 16:9 landscape. A large title will be placed over the left half in HTML, so the left 55% of the image must stay dark, calm, and low in detail.

Scene: Night over Haran, a fictional modern port city on a west-facing coast, seen from a rooftop on a hillside above the harbor. The entire city has lost power. No lit windows, no street lights, no neon, no car headlights. Buildings read as near-black masses separated only by faint light from an overcast, moonless sky. In the middle distance: gantry cranes, stacked shipping containers, long piers, and flat still water. Around the harbor, the ground and the lower parts of the buildings are covered by a pale gray fungal growth that catches what little light there is, like frost.

Subject: On the right third of the image, small in the frame (about one eighth of the image height), one adult woman stands at the edge of the rooftop, seen from behind. She is a magical girl in a short uniform coat with a half cape. Her hair and cape are lifted by the wind. Her face is not visible. She is the only source of color and light in the image: a soft rose-gold glow outlines her figure and falls in a small pool on the rooftop around her feet. Full body visible, feet included.

Style: Japanese anime key-visual illustration with painted backgrounds. Clean architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything except the figure is monochrome: a cool blue-gray scale, from near-black #0A1118 to ivory #E8E6DC. Only the figure and her glow are in color.

Composition: Camera at eye level, just behind and above the rooftop edge, wide-angle view. Horizon in the upper third. The left 55% holds only dark sky and unlit city, with no bright shapes and no fine detail. Keep the figure and the cranes at least 8% away from every edge so the image can be cropped.

Lighting: Ambient night skylight only. The figure's glow is the brightest area of the image. No lens flare, no light rays, no stars.

Constraints:
- Exactly one figure. No other people or animals.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original city. Do not reproduce a real skyline or any existing film, game, or artwork.
```

### KV1-R · 정전의 하란, 캐릭터 지정판

Blackout over Haran with a reference character

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Image 1 is a character illustration. Use it for two things: the character's identity (face, hair, hair ornament, outfit, colors) and the illustration style of the figure. Do not reproduce the ornamental frame, the name plate, the signature, or any text from Image 1.

Use: key visual for the top of a website's main page, 16:9 landscape. A large title will be placed over the left half in HTML, so the left 55% of the image must stay dark, calm, and low in detail.

Scene: Night over Haran, a fictional modern port city on a west-facing coast, seen from a rooftop on a hillside above the harbor. The entire city has lost power: no lit windows, no street lights, no neon. Buildings read as near-black masses under an overcast, moonless sky. In the middle distance: gantry cranes, stacked shipping containers, long piers, and flat still water.

Subject: On the right third of the image, the character from Image 1 stands at the edge of the rooftop, shown from the knees up in three-quarter back view, looking over her shoulder toward the viewer with a calm, composed expression. Same face, same hair and hair ornament, same white uniform with red ribbon and brooch as Image 1. She is the only area of color in the image, lit by a soft warm glow that seems to come from her.

Style: The figure matches the painting style of Image 1: soft luminous highlights, fine hair strands, delicate linework. The city behind her is monochrome anime background art in a cool blue-gray scale, from near-black #0A1118 to ivory #E8E6DC.

Composition: Camera at eye level. The left 55% holds only dark sky and unlit city, with no bright shapes and no fine detail. Keep the figure at least 6% away from the right and top edges.

Constraints:
- Do not redesign the character. Do not change her age, face, or outfit.
- Exactly one figure.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
```

### KV2 · 340미터의 흉터 (세계관·연표 머리)

The scar over Angae Pass

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: wide header illustration for a world-setting website, 16:9 landscape. Text will be placed over the lower left in HTML, so the lower left quarter must stay dark and low in detail.

Scene: A mountain pass at dawn, six years after a battle. Low hills, thin fog lying in the valley, a dirt road, broken farm fence posts, the bare stone foundations of a village that is no longer there. Hanging in the open air above the pass is a scar in the sky: a single pale, slightly luminous fracture line, like a crack in thick glass that was stopped while spreading. It runs diagonally and reads as a few hundred metres long against the hills. It does not move. The fog drifts up to it and does not cross it.

Style: Japanese anime background art, the kind of painted environment used behind characters in an animated film. Clean, accurate architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything is monochrome: a cool blue-gray scale, from near-black #0A1118 in the shadows to ivory #E8E6DC in the brightest highlights. No other hues anywhere. The scar is the brightest thing in the image, close to #E8E6DC.

Composition: Very wide view from the road at standing height. The scar sits in the upper right two thirds of the sky. Hills low on the horizon, sky taking up about 60% of the frame. Lower left quarter: dark ground and fog only.

Lighting: Flat pre-dawn light, no sun disc, no rays. The scar gives off a faint cold light that touches the top of the fog.

Constraints:
- No people, no animals, no characters, no silhouettes of figures.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original location. Do not reproduce a real landmark or any existing film, game, or artwork.
- One scar only. No portal, no swirling vortex, no lightning, no monsters.
```

## 장소

16:9. P1을 먼저 만들어 기준으로 삼고, P2부터는 P1을 첨부한 뒤 아래 '화풍 고정 문구'를 프롬프트 맨 앞에 붙입니다.

### P1 · 하란항

Haran Port

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: location illustration for a world-setting website, 16:9 landscape. This image sets the style for the whole location set.

Scene: Haran Port, twenty years after a disaster. A large commercial harbor on a west-facing coast: gantry cranes, stacked shipping containers, a long concrete quay with bollards, calm open sea beyond. The port is partly abandoned. A pale gray fungal growth has spread from the waterline up the lower parts of the cranes, the container stacks, and the quay wall, in mats and shelf-like layers. Tide marks, rust streaks, cracked concrete.

Style: Japanese anime background art, the kind of painted environment used behind characters in an animated film. Clean, accurate architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything is monochrome: a cool blue-gray scale, from near-black #0A1118 in the shadows to ivory #E8E6DC in the brightest highlights. No other hues anywhere.

Composition: Wide view along the quay from standing height, the sea on the left, the cranes receding to the right in clear perspective. Horizon just below the middle.

Lighting: Overcast late afternoon. Soft, even light, no hard shadows, slight haze over the water.

Constraints:
- No people, no animals, no characters, no silhouettes of figures.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original location. Do not reproduce a real landmark or any existing film, game, or artwork.
```

### P2 · 폐항

Closed pier

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: location illustration for a world-setting website, 16:9 landscape. 

Scene: A closed pier at the edge of a port. A chain-link fence and concrete barriers block the entrance. Beyond them: rusting bollards, an empty warehouse with broken skylights and a half-open sliding door, weeds growing through cracks, shallow puddles on the concrete, coils of old rope.

Style: Japanese anime background art, the kind of painted environment used behind characters in an animated film. Clean, accurate architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything is monochrome: a cool blue-gray scale, from near-black #0A1118 in the shadows to ivory #E8E6DC in the brightest highlights. No other hues anywhere.

Composition: View from outside the fence, slightly low, looking through the gap between two barriers down the length of the pier toward the warehouse.

Lighting: Overcast morning after rain. Wet surfaces with dull reflections.

Constraints:
- No people, no animals, no characters, no silhouettes of figures.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original location. Do not reproduce a real landmark or any existing film, game, or artwork.
```

### P3 · 회색 구역

The Grey Zone

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: location illustration for a world-setting website, 16:9 landscape. 

Scene: A street inside a contaminated district beside a harbor. Low concrete buildings, shuttered shops, parked bicycles left for years. A pale gray fungus covers the ground, the gutters, and the lower walls in thick mats and shelf-like layers, and hangs from cables overhead. Fine spores drift in the still air like dust. Plain barrier tape and plastic sheeting close off the side alleys.

Style: Japanese anime background art, the kind of painted environment used behind characters in an animated film. Clean, accurate architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything is monochrome: a cool blue-gray scale, from near-black #0A1118 in the shadows to ivory #E8E6DC in the brightest highlights. No other hues anywhere.

Composition: Ground-level view straight down the middle of the street in one-point perspective. Growth thickest at the edges of the frame, the far end of the street fading into haze.

Lighting: Dim, diffuse daylight filtered through the haze. No direct sun.

Constraints:
- No people, no animals, no characters, no silhouettes of figures.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original location. Do not reproduce a real landmark or any existing film, game, or artwork.
```

### P4 · 고철동 폐공장 지대

Gocheol abandoned factory district

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: location illustration for a world-setting website, 16:9 landscape. 

Scene: A derelict factory district that people still live beside. Sawtooth factory roofs with missing panels, heaps of sorted scrap metal, stacked oil drums, a narrow lane between corrugated metal walls patched with mismatched sheets, a handcart, a small repaired door with a bare bulb above it that is switched off.

Style: Japanese anime background art, the kind of painted environment used behind characters in an animated film. Clean, accurate architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything is monochrome: a cool blue-gray scale, from near-black #0A1118 in the shadows to ivory #E8E6DC in the brightest highlights. No other hues anywhere.

Composition: View down the narrow lane toward a large factory hall at the end, walls close on both sides, a strip of sky above.

Lighting: Late afternoon, low flat light from behind the factory, long soft shadows in the lane.

Constraints:
- No people, no animals, no characters, no silhouettes of figures.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original location. Do not reproduce a real landmark or any existing film, game, or artwork.
```

### P5 · 제3구 지하상가

District 3 underground arcade

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: location illustration for a world-setting website, 16:9 landscape. 

Scene: An underground shopping arcade two years after an evacuation battle. A long, low-ceilinged corridor with tiled floor, rows of closed roller shutters on both sides, blank hanging sign boxes, a side passage branching off to the right. Signs of damage and repair: a line of cracked floor tiles, one dented shutter, a section of ceiling panels replaced with newer ones, a folded barrier leaning against a wall.

Style: Japanese anime background art, the kind of painted environment used behind characters in an animated film. Clean, accurate architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything is monochrome: a cool blue-gray scale, from near-black #0A1118 in the shadows to ivory #E8E6DC in the brightest highlights. No other hues anywhere.

Composition: One-point perspective straight down the corridor from standing height. The side passage visible in the right middle distance.

Lighting: Cold fluorescent strip lighting, half of the tubes off, so the corridor alternates between lit and dark bands.

Constraints:
- No people, no animals, no characters, no silhouettes of figures.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original location. Do not reproduce a real landmark or any existing film, game, or artwork.
```

### P6 · 하란시립체육관 지하 창고

Municipal gym basement storage

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: location illustration for a world-setting website, 16:9 landscape. 

Scene: A basement storage room under a municipal gymnasium, sealed after a contamination accident three years ago. Boxing equipment in storage: heavy bags hanging from a rail, coiled ring ropes, stacked corner pads, a shelf of old gloves. Half of the room is closed off behind thick plastic sheeting taped to the ceiling and floor. On the concrete wall behind the sheeting, a large pale stain spreads from a floor drain.

Style: Japanese anime background art, the kind of painted environment used behind characters in an animated film. Clean, accurate architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything is monochrome: a cool blue-gray scale, from near-black #0A1118 in the shadows to ivory #E8E6DC in the brightest highlights. No other hues anywhere.

Composition: View from the doorway at standing height, the equipment on the near side, the sheeted area filling the back half of the room.

Lighting: A single bare ceiling lamp on the near side. The area behind the plastic sheeting is dim and soft-edged.

Constraints:
- No people, no animals, no characters, no silhouettes of figures.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original location. Do not reproduce a real landmark or any existing film, game, or artwork.
```

### P7 · 월곶 해안

Wolgot beach

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: location illustration for a world-setting website, 16:9 landscape. 

Scene: A public beach on a west-facing coast at low tide, out of season. A wide flat of wet sand, a wooden lifeguard tower with an empty chair, a row of stacked rental parasols tied with rope. At the far end of the beach, a large round concrete drainage tunnel opens onto the sand, with a rusted grille across its mouth.

Style: Japanese anime background art, the kind of painted environment used behind characters in an animated film. Clean, accurate architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything is monochrome: a cool blue-gray scale, from near-black #0A1118 in the shadows to ivory #E8E6DC in the brightest highlights. No other hues anywhere.

Composition: Wide view along the shoreline, the sea on the left, the lifeguard tower in the middle distance, the tunnel mouth small but clear at the far right.

Lighting: Overcast afternoon, bright flat sky, soft reflections on the wet sand.

Constraints:
- No people, no animals, no characters, no silhouettes of figures.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original location. Do not reproduce a real landmark or any existing film, game, or artwork.
```

### P8 · 마법소녀 아카데미

The Academy

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: location illustration for a world-setting website, 16:9 landscape. 

Scene: The main grounds of an academy that is both a school and a defense installation. A broad modern main building with wide front steps, a plain facade, and tall windows; a training field with painted lane markings beside it; bare flagpoles; a row of slim defensive pylons along the perimeter wall; a guard booth by the open main gate. Everything is orderly and well maintained.

Style: Japanese anime background art, the kind of painted environment used behind characters in an animated film. Clean, accurate architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything is monochrome: a cool blue-gray scale, from near-black #0A1118 in the shadows to ivory #E8E6DC in the brightest highlights. No other hues anywhere.

Composition: View from just inside the main gate, the steps and main building centered, the training field opening to the right.

Lighting: Clear early morning, low sun from the right, crisp shadows across the steps.

Constraints:
- No people, no animals, no characters, no silhouettes of figures.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original location. Do not reproduce a real landmark or any existing film, game, or artwork.
```

### P9 · 안개고개 · 오르텐 마을 터

Angae Pass, the site of Orten village

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: location illustration for a world-setting website, 16:9 landscape. 

Scene: The site of a village that vanished six years ago, in a mountain pass. Rows of bare stone house foundations in rough grass, a dry well, a leaning farm fence, a single stone step that leads nowhere. Thin fog lies over the ground. Low hills behind.

Style: Japanese anime background art, the kind of painted environment used behind characters in an animated film. Clean, accurate architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything is monochrome: a cool blue-gray scale, from near-black #0A1118 in the shadows to ivory #E8E6DC in the brightest highlights. No other hues anywhere.

Composition: Low, wide view across the foundations, the fence in the foreground at left, the hills a soft band across the top third.

Lighting: Flat early morning light through fog. Nothing casts a hard shadow.

Constraints:
- No people, no animals, no characters, no silhouettes of figures.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original location. Do not reproduce a real landmark or any existing film, game, or artwork.
```

### P10 · 칠왕정

The Court of Seven Seats

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: location illustration for a world-setting website, 16:9 landscape. This place is in another world, so the architecture should feel exact rather than old.

Scene: A vast, dark court hall in another world, built as if by rule rather than by masons: perfectly straight edges, exact symmetry, floor and walls of one seamless dark material. Seven tall, empty seats stand in a shallow arc on a raised tier, each different in shape, all facing the same empty space at the center of the hall. In that space nothing stands, but seven thin plain rings float in the air in a level row, unlit, each a perfect circle.

Style: Japanese anime background art, the kind of painted environment used behind characters in an animated film. Clean, accurate architectural linework, visible gouache-like brushwork on large surfaces, fine film grain. Everything is monochrome: a cool blue-gray scale, from near-black #0A1118 in the shadows to ivory #E8E6DC in the brightest highlights. No other hues anywhere.

Composition: Symmetrical frontal view from the floor of the hall, looking up slightly at the tier. The seven rings centered in the upper half, the seats below them.

Lighting: Very low light with no visible source. Edges of the seats and rings are picked out by a thin pale rim, the rest falls to near-black.

Constraints:
- No people, no animals, no characters, no silhouettes of figures.
- No text of any kind: no letters, numbers, signs with writing, captions, logos, watermarks, or signature. Any sign or label surface is blank or too weathered to read.
- No border, frame, or vignette. One continuous image that fills the whole canvas, not a collage.
- Original location. Do not reproduce a real landmark or any existing film, game, or artwork.
- All seven seats are empty. No throne has a figure, a cloak, or a weapon on it.
- No flames, no torches, no banners, no gold, no stars, no fog.
```

## 인물 표정과 기술

참치님이 직접 만드는 그림입니다. 이 묶음의 프롬프트는 없고, 규격만 적습니다.

- 7장: 평상시, 웃음, 의문, 부끄러움, 슬픔, 분노, 기술(전투).
- 비율: 가로 3:2. API를 쓴다면 1536x1024. 7장 모두 같은 크기로 맞춥니다.
- 상세 화면의 사진 칸이 3:2라서 그림이 잘리지 않고 그대로 들어갑니다. 표정을 바꿔도 칸 크기는 같습니다.
- 목록 카드의 작은 사진은 세로 칸이라 그림 가운데 절반 정도만 보입니다. 얼굴은 그림 가운데 절반 안에 둡니다.
- 그림 안에 이름이나 대사 같은 글자를 넣지 않습니다. 이름과 대사는 화면에서 따로 씁니다.
- 파일은 assets/img/characters/에 webp로 두고, characters.js의 image와 emotes에 경로를 적습니다.

## 질감

T1, T2, T4는 1:1. T3은 3:1.

### T1 · 서식 용지

Form paper

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: background texture for a web page. It will be placed behind text at low contrast.

Subject: A flat, top-down scan of one blank sheet of uncoated office form paper, warm ivory, average color close to #E8E6DC. Fine paper fibers and a faint, even tooth are visible. A few tiny flecks. Nothing else.

Composition: The paper fills the entire image from edge to edge. No sheet edges, no corners, no table visible.

Lighting: Perfectly even scanner light. No shadows, no gradient, no vignette, no bright or dark patches.

Constraints:
- No text, no lines, no ruling, no stamps, no folds, no stains, no objects.
- Low contrast overall: the lightest and darkest points stay within a narrow range.
- Seamless tile: the left edge must match the right edge and the top edge must match the bottom edge.
```

### T2 · 복사 잡티

Photocopy noise

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: overlay texture for a web page, to be blended over dark and light areas.

Subject: A flat scan of a blank white page that has been photocopied many times. Scattered black toner specks of different sizes, a few short hairline scratches, very faint horizontal banding, a light dusting of gray noise. Pure white background, black marks only.

Composition: The page fills the entire image from edge to edge. Marks spread unevenly but across the whole area, denser in a few loose clusters. No sheet edges visible.

Lighting: Perfectly even. No shadows, no gradient, no vignette.

Constraints:
- Black and white only, no gray paper tone, no color.
- No text, no letters, no shapes that look like writing, no borders.
- At least 85% of the area stays pure white.
```

### T3 · 가림 막대

Redaction stroke

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: graphic element for a web page, a single censor bar.

Subject: One thick horizontal stroke of black permanent marker on white paper, drawn in a single pass from left to right. Dense solid black in the middle, slightly uneven top and bottom edges, a few thin dry streaks near the right end.

Composition: 3:1 wide image. The stroke runs the full width and takes up the middle 70% of the height. Plain white above and below.

Lighting: Perfectly even scanner light, no shadows.

Constraints:
- One stroke only. No text under it or around it, no other marks.
- Black and white only.
```

### T4 · 회색 균류

Grey Zone fungus

```text
Generate one image. Follow this description as written. Do not add subjects, text, or decorative elements that are not described.

Use: background texture for a section about a contaminated district.

Subject: A macro, top-down view of a pale gray fungal mat growing over rough concrete. Layered, overlapping lobes with fine ridges, small clusters of round caps, a dusting of spores, a few hairline cracks where dark concrete shows through.

Style: Painted illustration with fine detail, monochrome. A cool blue-gray scale, from near-black #0A1118 in the cracks to ivory #E8E6DC on the highest ridges.

Composition: The growth fills the entire image from edge to edge with similar density everywhere, no single focal point.

Lighting: Soft, even light from directly above. No cast shadows, no vignette.

Constraints:
- No text, no objects, no insects, no people.
- No bright colors.
```

## 화풍 고정 문구

기준 그림(P1)을 첨부하고, 프롬프트의 첫 문장 바로 뒤에 붙입니다.

```text
Image 1 is a style reference only. Match its visual medium, brushwork, line quality, tonal range, tint, and grain. Do not copy its content, layout, or objects.
```

## 색 있는 판이 필요할 때

장소 프롬프트의 Style 문단 끝에 붙입니다. 채팅 배경처럼 사이트 밖에서 쓸 그림용입니다.

```text
Full color instead of monochrome. Natural, slightly muted colors with soft luminous highlights, in the manner of painted anime background art. Keep everything else in the description the same.
```

## 고칠 때 쓰는 문구

한 번에 하나만 고칩니다.

### 제목 자리 비우기

```text
Change only the left 55% of the image: remove bright shapes and fine detail there so it shows only dark sky and unlit buildings. Keep the figure, the harbor, the style, the palette, the grain, and the framing exactly the same.
```

### 글자 지우기

```text
Remove every letter, number, and sign marking in the image and replace each with a blank or weathered surface. Change nothing else: same composition, same objects, same style, same tones.
```

### 사람 지우기

```text
Remove the person and fill the area with the surrounding scene. Change nothing else: same composition, same objects, same style, same tones.
```

### 색 빼기

```text
Convert the image to strict monochrome: a cool blue-gray scale, from #0A1118 to #E8E6DC, with no other hues. Keep the composition, every object, the brushwork, and the grain exactly the same.
```

### 세로 판 만들기

```text
Recreate this same scene as a 9:16 portrait image for phones. Same style, palette, city, and figure. Place the figure in the lower third. Keep the upper 45% as dark sky with no bright shapes, for a title. Do not add anything new.
```

### 화풍 흔들림 바로잡기

```text
Regenerate this image so it matches the style of the first image in this conversation: same medium, brushwork, line quality, tonal range, tint, and grain. Keep this image's content and composition.
```
