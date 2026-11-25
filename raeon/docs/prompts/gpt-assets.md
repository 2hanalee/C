# ChatGPT 에셋 프롬프트(11월 25일)

## 쓰는 법
1. **대화 하나를 열 때마다 맨 먼저 [공통 화풍]을 붙여 넣는다.** 참치의 카드 한 장(모래 밑 왕릉 권장)을 함께 올린다.
2. 그다음 같은 묶음(예: S-1~S-4)의 프롬프트를 한 대화에서 차례로 넣는다. 같은 대화 안이어야 화풍이 이어진다.
3. 마음에 안 들면 새로 뽑지 말고 `Same image, but ...`으로 한 가지씩 고친다(예: `Same image, but darker background and thinner gold lines.`).
4. 받은 그림은 **파일 이름** 칸의 이름으로 저장해서 주면, 그대로 사이트에 넣는다.
5. 투명 배경이 안 나오면 그냥 먹색 배경으로 받는다. 잘라 내는 건 Claude가 한다.

## 공통 화풍(대화마다 맨 처음 1번)
```
You will create a set of assets for a dark-fantasy world encyclopedia website called "Raeon".
Match the attached reference card: painterly dark-fantasy oil illustration, rich texture, warm candle-like light, aged gold filigree.
Use ONLY this palette: ink black #100E0B, dark leather brown #2A2018, parchment #E9DFC8, antique gold #C9A45C, warning red #B8463A (sparingly). Muted, never neon, never pastel.
Absolute rules for every image: no text, no letters, no numbers, no runes that look like letters, no signatures, no watermarks, no human or creature faces, no people, no hands.
Reply "ready" and wait for my asset requests.
```

## 우선순위 한눈에
| 등급 | 뜻 | 개수 |
|---|---|---|
| S | 첫인상을 바로 바꾼다(입장, 로고, 표지 바탕, 종이) | 8 |
| A | 책 뷰어와 서가의 재질감 | 13 |
| B | 장식과 아이콘(작지만 화면 전체에 반복) | 12 |
| C | 문장 세트(수가 많고, 없어도 돌아간다) | 25 |
| D | 있으면 좋은 삽화와 소품 | 12 |

---

## S. 첫인상 (먼저 만들 것)

### S-1 닻 문장(로고) · `logo-anchor.png`
쓰는 곳: 머리띠, 입장 표지, 파비콘, 표지 상단
```
A heraldic emblem of a massive ancient anchor, front view, perfectly centered and symmetrical. Antique gold leaf with subtle engraved filigree on the shank and crown, a small ring at the top, gently curved flukes. Slight raised emboss and soft rim light. Isolated on a transparent background (if not possible: flat #100E0B background). Square 1:1, the emblem fills 80% of the height. Must stay readable when shrunk to 32 pixels: bold silhouette, no thin hair lines.
```

### S-2 닫힌 가죽 장정 표지 · `tome-cover.png`
쓰는 곳: 입장 연출 1·2장면(닫힌 책)
```
A closed antique tome seen straight from the front, flat and orthographic, no perspective. Dark brown tooled leather (#2A2018) with fine grain and worn edges, a thin gold-leaf border inset from the edge, small gold corner pieces, and an empty embossed gold cartouche in the center (leave it blank — the logo is placed later). A slight left spine ridge. Plain #100E0B background, the cover fills 90% of the frame. Portrait 2:3.
```

### S-3 표지 안쪽 면지 · `tome-endpaper.png`
쓰는 곳: 입장 3장면(표지가 열린 뒷면), 책 뷰어 목차 왼쪽 바탕
```
The inside of an antique book cover: marbled endpaper in deep brown and muted gold swirls, framed by a narrow leather turn-in with a thin gold tooled line. Flat front view, even lighting. Portrait 2:3, fills the whole frame.
```

### S-4 표지 대표 바탕(닻이 박힌 대륙) · `hero-anchors.jpg`
쓰는 곳: 표지 첫 화면 뒤 바탕(흐리게 깔림), 공유 미리보기의 원본
```
An epic wide landscape at dusk: a continent of plains, forests and distant mountains where several colossal ancient anchors have fallen from the sky and are embedded in the land, each larger than a castle, chains rising into heavy clouds and vanishing. Tiny scattered towns for scale (no people visible). Warm low sun through clouds, gold highlights, deep brown and ink shadows. Painterly oil style. Wide 16:9, keep the center-top area calm and darker so a title can sit there.
```

### S-5 양피지 종이 타일 · `paper-parchment.png`
쓰는 곳: 책 뷰어 쪽, 사이트 종이 칸 전체
```
Seamless tileable texture of aged parchment paper, color around #E9DFC8, subtle fibers, faint stains and very soft tonal variation. Flat even lighting, no vignette, no folds, no edges, no text. Square 1:1, must tile without visible seams.
```

### S-6 지도 용지 타일 · `paper-mapgrid.png`
쓰는 곳: 마그히의 지형 책, 지도 화면 종이
```
Seamless tileable texture of old cartographer's paper, parchment #E6D8B8 with a very faint brown square grid (about 8 squares across), light foxing spots and soft fibers. Flat even lighting, no vignette, no text, no symbols. Square 1:1, tileable.
```

### S-7 가죽 타일 · `leather-tile.png`
쓰는 곳: 책등, 둘째 이야기 문, 가죽 단추
```
Seamless tileable texture of dark brown book leather (#2A2018), fine pebbled grain, slight wear, soft sheen. Flat even lighting, no vignette, no stitching, no tooling. Square 1:1, tileable.
```

### S-8 공유 미리보기 · `og-image.jpg`
쓰는 곳: 링크를 보낼 때 뜨는 그림(글자는 Claude가 얹음)
```
Using the same world as the anchor landscape: a closed dark leather tome with a gold anchor emblem on its cover lies on an old map of a continent, candlelight from the left, gold dust in the air. Leave the right 45% of the image calm and dark for a title. Landscape 1200x630 (about 1.9:1).
```

---

## A. 책과 서가의 재질

### A-1 총해록 표지 · `book-101-cover.png`
```
Front cover of a thick scholarly bestiary: worn dark leather, brass corner guards, a gold-tooled frame and a central embossed medallion of an ogre's club crossed with a quill (objects only). Academic, heavy, slightly pompous. Flat front view, plain #100E0B background, portrait 2:3, no text.
```

### A-2 마그히와 대해 표지 · `book-maghi-cover.png`
```
Front cover of a bandit's travel atlas: scuffed oxblood-brown leather, a leather strap with a brass buckle, a gold-tooled compass rose in the center and a red wax drip near the edge. Rough and well-travelled. Flat front view, plain #100E0B background, portrait 2:3, no text.
```

### A-3 연애록 표지 · `book-romance-cover.png`
```
Front cover of a bard's poetry book: soft dark brown leather with delicate gold vine and rose tooling forming an oval frame, a pressed dried flower tucked under a gold thread. Elegant and lyrical, not pink. Flat front view, plain #100E0B background, portrait 2:3, no text.
```

### A-4 균열 문헌 표지 · `book-rift-cover.png`
```
Front cover of a forbidden codex: near-black leather (#100E0B) cracked across the middle by a jagged fissure that glows faint warning red (#B8463A), bound with old iron clasps and a thin chain. Unsettling but restrained. Flat front view, plain background, portrait 2:3, no text, no symbols that look like letters.
```

### A-5 네 권이 꽂힌 서가 · `shelf-four-books.png`
쓰는 곳: 표지의 서고 칸 바탕
```
Four antique books standing upright side by side on a dark wooden shelf, spines facing the viewer, matching the four covers made earlier in this chat (scholarly bestiary, bandit atlas, bard's poetry, cracked forbidden codex). Each spine has gold-tooled bands but no titles. Candlelight from the left. Landscape 3:2.
```

### A-6 펼친 책 빈 펼침면 · `book-spread-blank.png`
쓰는 곳: 책 뷰어 넓은 화면의 바탕 실험용(글은 사이트가 얹음)
```
An open antique book seen from directly above, perfectly flat and centered, two blank parchment pages with a soft shadow in the center gutter, slightly curled page edges, dark leather cover visible around the edges. Plain #100E0B background. Landscape 16:10, the book fills 92% of the width. No text on the pages.
```

### A-7 낱장 한 쪽 · `book-page-single.png`
쓰는 곳: 휴대폰 책 뷰어 바탕
```
A single blank parchment book page seen flat from above, slight shadow along the left edge where it meets the spine, faint aged texture, gently uneven edges. Plain #100E0B background. Portrait 9:16, page fills 92% of the frame. No text.
```

### A-8 책 옆면(페이지 단면) · `book-edge.png`
쓰는 곳: 책 뷰어 바닥의 두께감
```
Close-up of the fore-edge of a thick closed book: many stacked parchment page edges, slightly uneven, with a gilded gold edge on top. Straight side view, horizontal strip. Very wide 8:1, plain #100E0B background.
```

### A-9 서고 봉인 서가 · `library-sealed-shelf.png`
쓰는 곳: 서고 화면의 봉인 서가
```
A narrow bookcase of old books wrapped in heavy iron chains with a large padlock and red wax seals hanging from the chains. Dim candlelight, dust in the air. No titles on spines. Portrait 2:3.
```

### A-10 길드 등록증 빈 양식 · `guild-card-blank.png`
쓰는 곳: 인물 등록 카드 바탕
```
A blank adventurer guild registration card on thick cream paper, printed ornamental border in brown ink, a blank box at upper right for a portrait, several empty ruled lines, and a red wax stamp space at the bottom right. Flat front view, plain #100E0B background, landscape 3:2. No text, no numbers.
```

### A-11 표지 열림 장면 참고 · `tome-opening.png`
쓰는 곳: 입장 연출 3장면 그림 참고(동작은 사이트가 만듦)
```
The same leather tome from earlier in this chat, front cover swung open to the left at about 120 degrees, revealing the first page with a hand-drawn continent map in brown ink. Three-quarter front view, candlelight, plain #100E0B background. Portrait 4:5.
```

### A-12 둘째 이야기 문 바탕(하늘 없는 설원) · `door-story2.png`
```
A vast underground cavern that looks like a snowfield under a ceiling of ice: grey ash-like snow falling endlessly, faint blue-grey light from cracks in the ice ceiling, the tip of a colossal anchor frozen into the rock in the distance. No people. Cold, quiet, desolate. Landscape 3:2, darker on the left for text.
```

### A-13 첫째 이야기 문 바탕(출발의 길) · `door-story1.png`
```
A white-walled imperial capital with tall spires at sunrise seen from a distant road, a giant anchor chain rising behind the city into the clouds, the road leading out toward misty forests. No people. Hopeful but heavy light. Landscape 3:2, darker on the left for text.
```

---

## B. 장식과 아이콘

### B-1 금 모서리 장식 · `ornament-corner.png`
```
A single ornate antique gold filigree corner piece (top-left corner of a frame), engraved scrollwork, slight emboss. Transparent background (or flat #100E0B). Square 1:1, the ornament sits in the top-left with both arms reaching the edges. It will be mirrored for the other corners.
```

### B-2 가로 구분 장식 · `ornament-divider.png`
```
A horizontal antique gold filigree divider: thin line with a small anchor-like diamond in the center and symmetrical curling scrolls on both sides. Transparent background (or flat #100E0B). Very wide 8:1.
```

### B-3 도판 금 틀 · `frame-plate.png`
```
An empty rectangular antique gold frame with fine engraved filigree and small corner flourishes, thin profile, the inside completely transparent/empty (or flat #100E0B inside). Landscape 3:2.
```

### B-4 책갈피 끈 · `ribbon-bookmark.png`
```
A single red silk bookmark ribbon (#B8463A) hanging straight down, with a forked V-cut end and soft folds and sheen. Transparent background (or flat #100E0B). Tall 1:6.
```

### B-5 밀랍 봉인 · `wax-seal.png`
쓰는 곳: 봉인된 항목, 스포일러 칸
```
A round red wax seal (#B8463A) pressed with an anchor emblem, irregular melted edges, glossy highlights, seen from the front. Transparent background (or flat #100E0B). Square 1:1.
```

### B-6 깨진 밀랍 봉인 · `wax-seal-broken.png`
쓰는 곳: 봉인을 연 뒤
```
The same red wax seal, now cracked in two with small chips missing, slightly lifted from the paper. Transparent background (or flat #100E0B). Square 1:1.
```

### B-7 사진 모서리 · `photo-corner.png`
```
A single dark leather photo-album corner mount (triangle pocket) with a thin gold edge, as if holding the top-left corner of a card. Transparent background (or flat #100E0B). Square 1:1.
```

### B-8 지도 핀 · `map-pin.png`
```
A small antique map marker: a brass pushpin with a round red enamel head (#B8463A) and a gold rim, seen slightly from above. Transparent background (or flat #100E0B). Square 1:1. Must read clearly at 28 pixels.
```

### B-9 나침반 장미 · `compass-rose.png`
```
An antique compass rose in brown ink and gold leaf, eight points, fine engraved lines, as drawn on an old map. Transparent background (or flat #100E0B). Square 1:1. No letters for directions.
```

### B-10 마그히의 붉은 ✕ · `maghi-x.png`
쓰는 곳: 위험 지대 표시
```
A hand-drawn red ink X mark (#B8463A), rough brush strokes with ink splatter, as if scrawled by a bandit on a map. Transparent background (or flat #E9DFC8). Square 1:1.
```

### B-11 잉크 얼룩 세트 · `ink-stains.png`
쓰는 곳: 종이 칸 여백의 낡은 느낌
```
Four separate faint brown ink and coffee stains (ring stain, splatter, smudge, drip) arranged in a 2x2 grid with space between them, on a transparent background (or flat #E9DFC8). Square 1:1.
```

### B-12 균열 빛줄기 · `rift-crack.png`
쓰는 곳: 균열 문헌, 균열 장소
```
A jagged vertical crack in darkness glowing faint warning red (#B8463A) at its core, thin branching fissures, a few drifting embers. Mostly black #100E0B. Portrait 1:2.
```

---

## C. 문장 세트(아이콘)

모두 같은 규칙: 
```
Simple heraldic line icon in antique gold (#C9A45C) on a transparent background (or flat #100E0B), bold even strokes, centered, square 1:1, readable at 40 pixels, no text, no faces.
```
위 한 줄을 대화에 한 번 넣고, 아래 한 줄씩 차례로 넣는다. 한 번에 4개씩 `in a 2x2 grid with generous spacing`으로 받아도 된다.

### C-1~C-8 마물 계열 문장 · `crest-<id>.png`
| 파일 | 프롬프트 |
|---|---|
| crest-beast | A claw mark of three curved slashes. |
| crest-kin | Two crossed crude spears behind a small round shield. |
| crest-undead | A cracked bone crossed with a broken sword, no skull. |
| crest-blood | A single falling drop above a thorned chalice. |
| crest-dragon-sea | A coiling sea-serpent tail rising from three waves (tail only, no head). |
| crest-construct | A gear interlocked with a stone block. |
| crest-demon | A horned crown with a flame above it (no face). |
| crest-rift | A circle split by a jagged crack, with a small dot inside. |

### C-9~C-25 지역 문장 · `region-<id>.png`
| 파일 | 프롬프트 |
|---|---|
| region-laeon | A white tower with a crown above it, wheat stalks on both sides. |
| region-berham | A crossed axe and sword planted in a snow mound under a mountain peak. |
| region-silvanir | A tall tree with mist lines around its trunk. |
| region-mortizen | A broken crown above a crumbling city gate. |
| region-sartion | A sun over a pyramid with an oasis palm. |
| region-astra | A mountain peak struck by a lightning bolt. |
| region-nocturna | A cliff castle under a crescent moon with a drop of blood. |
| region-seilia | A ship's wheel over a coin. |
| region-watch-isle | A lighthouse on a small island with a shield. |
| region-shizunuma | A cherry blossom over steam rising from water. |
| region-whisper-isles | A palm tree over a sea cave arch. |
| region-itzaka | A stepped jungle pyramid with leaves. |
| region-great-sea | Deep waves with a sunken column. |
| region-demon-realm | A volcanic island with a jagged castle silhouette. |
| region-funda | An anchor tip frozen in ice with falling snow. |
| region-erata | Raindrops falling upward from a twisted path. |
| region-aeris | A floating island with gears and steam underneath. |

---

## D. 있으면 좋은 삽화와 소품

| 파일 | 쓰는 곳 | 프롬프트 |
|---|---|---|
| prop-inkwell.png | 학자 방주 옆 | `A still life of a brass inkwell with a quill, an open notebook with blank pages, candle light. Square 1:1, #100E0B background.` |
| prop-maghi-dagger.png | 마그히 방주 옆 | `A bandit's curved dagger stuck into an old map, a few coins scattered, candle light. Square 1:1, #100E0B background.` |
| prop-guild-badge.png | 인물 화면 머리 | `A bronze adventurer guild badge shaped like a shield with a crossed sword and anchor relief, on a leather strap. Square 1:1, #100E0B background.` |
| prop-compass.png | 지도 화면 머리 | `An open antique brass pocket compass with a cracked glass, lying on parchment. Square 1:1.` |
| prop-lute.png | 연애록 방주 옆 | `A small worn lute with a dried rose tied to its neck with a ribbon. Square 1:1, #100E0B background.` |
| prop-hourglass.png | 책갈피 칸 | `An antique hourglass with gold frame, sand half fallen. Square 1:1, #100E0B background.` |
| world-anchor-fall.jpg | 세계의 법칙 첫머리 | `A colossal anchor plunging from storm clouds toward a continent, chain trailing up into the sky, shockwave of dust on the horizon. No people. Landscape 16:9.` |
| world-cross-section.jpg | 세계의 법칙(펀다 설명) | `A cutaway cross-section of a continent: surface lands on top, a giant anchor driven down through rock layers, its tip frozen in an underground ice cavern far below. Diagram-like painterly style, no labels. Landscape 16:9.` |
| world-aeris.jpg | 아에리스 설명 | `Floating islands drifting in the sky held up by huge steaming arcane engines beneath them, their shadows passing over farmland. No people. Landscape 16:9.` |
| world-erata.jpg | 에라타 설명 | `A strange frontier village where rain falls upward into the clouds and a road twists into a loop. No people. Landscape 16:9.` |
| texture-ash-snow.png | 둘째 이야기 쪽 바탕 | `Seamless tileable texture of grey ash-like snow falling on black, sparse flakes, no vignette. Square 1:1.` |
| texture-gold-dust.png | 입장 연출 반짝임 | `Sparse floating gold dust particles on pure black, soft bokeh, no vignette. Square 1:1.` |

---

## 넘겨 줄 때
- 파일 이름대로 저장해서 한 번에 올려 주면 된다. 순서는 S → A → B → C → D.
- 고른 것만 넘겨도 된다. 받은 것부터 사이트에 넣고, 없는 것은 지금의 CSS 그림이 그대로 대신한다.
- 같은 에셋을 여러 장 뽑았다면 모두 넘겨 주면 Claude가 다섯 색 기준으로 골라 준다.
