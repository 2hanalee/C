# 09. 다른 사이트의 외부 에셋 분석과 라에온 적용(11월 25일)

분석한 사이트 세 곳: **Reise 여명의 시작**(이번 프로젝트의 레퍼런스), **별을 삼킨 헌터**(이전 레퍼런스), **BLACKOUT**(참치의 이전 사이트, 이 저장소 루트).
프롬프트는 `docs/prompts/gpt-assets.md`의 [공통 화풍]을 먼저 붙여 넣은 대화에서 쓴다. 그 문서와 겹치는 것은 번호만 적었다.

## 1. 에셋 목록

### Reise 여명의 시작
| 에셋 | 종류와 출처 | 쓰는 방식 | 평가 |
|---|---|---|---|
| 사이트 바탕 그림 1장 | 별이 쏟아지는 하늘과 산맥, 1280×768 PNG(외부 이미지 서버) | 화면 전체에 깔고 검정 50%를 덮음 | 분위기를 한 장으로 잡는다. 가장 효과가 큰 에셋 |
| 장소·마물 그림 26장(BACK) | 1280×768, 그림 안에 금 테두리와 이름·설명 글자가 박혀 있음 | 지도 핀 정보, "왕관" 진열 | 그림은 좋지만 글자가 박혀 있어 다른 곳에 못 쓴다 |
| 인물 그림(표정별) | 인물마다 폴더, 표정 번호별 PNG | 인물 상세, 적성 결과 | 얼굴 그림이라 ChatGPT로 못 만든다 |
| 웹툰 썸네일 | 화별 PNG | 연재 목록 | 라에온에는 웹툰이 없다 |
| 배경 음악 1곡 | Pixabay 무료 음원 mp3, 반복 재생 | 입장 화면에서 켜고 끔 | 몰입에 크게 기여. 다만 그림 생성으로는 못 만든다 |
| 잡티(그레인) 덮개 | noise.svg, 불투명도 3% | 바탕 위에 얇게 | 화면이 디지털처럼 매끈해 보이는 것을 막는다. 값이 싸고 효과가 좋다 |
| 아이콘 | lucide 아이콘 묶음 | 메뉴, 단추 | 무난하지만 판타지 느낌은 없다 |
| 글꼴 | Cinzel, Cinzel Decorative, Cormorant Garamond, Noto Serif KR | 영문 대문자 제목에 Cinzel | 새긴 듯한 로마자 대문자가 판타지 문헌 느낌을 낸다 |

### 별을 삼킨 헌터
| 에셋 | 쓰는 방식 | 평가 |
|---|---|---|
| 광택 앱 아이콘 약 20개 | 홈 화면의 메뉴 격자 | 메뉴가 "물건"으로 보여 누르고 싶어진다. 라에온에는 앱 대신 **가죽에 금박을 누른 아이콘**으로 옮길 수 있다 |
| 성좌 선 그림, 하늘 원판 | 성좌 쪽 바탕, 관계도 | 세계의 법칙을 그림 한 장으로 보여 준다. 라에온의 **닻 분포도**로 옮길 수 있다 |
| 배경 음악 3곡(NCS) + 플레이어, 효과음 설정 | 상단 ♪ 단추, 출처 표기 판 | 음악 출처를 늘 표기하는 방식이 좋다 |
| 앱 아이콘, 매니페스트 | 홈 화면에 설치 | 작은 비용으로 완성도가 올라간다 |
| 인물 초상 | 명부, 상세 | 얼굴이라 제외 |

### BLACKOUT
| 에셋 | 쓰는 방식 | 평가 |
|---|---|---|
| 세력·좌석 문장 12개(webp, 작은 판 따로) | 세력 쪽, 인물 카드 | 그린 문장이 SVG 기호보다 훨씬 고급스러웠다. **큰 판과 작은 판을 따로 둔 것**이 좋다 |
| 워드마크 SVG, 파비콘 3종, 애플 터치 아이콘 | 머리띠, 브라우저 탭 | 꼭 필요한 최소 세트 |
| 균사 무늬(시그니처 그래픽) SVG 2종 | 바탕 무늬 | 세계관을 상징하는 무늬 하나가 사이트 전체를 묶어 준다 |
| 표지 인물 그림 | 첫 화면 | 얼굴이라 제외 |
| 음악 플레이어(표지 그림 포함) | 머리띠 「음악」 단추 | 곡 표지 그림 칸이 있다 |

## 2. 라에온에 가져올 것(우선순위)

| 순위 | 가져올 것 | 출처 | 방법 | 상태 |
|---|---|---|---|---|
| **1** | **지역 풍경 그림 17장(글자 없는 판)** | Reise BACK | ChatGPT(풍경이라 얼굴 없음) | 새 프롬프트 X-1 |
| **2** | **시그니처 무늬: 닻과 사슬** | BLACKOUT 균사 무늬 | ChatGPT 반복 타일 | 새 프롬프트 X-2 |
| **3** | 잡티 덮개 | Reise noise | 코드로 만든다(그림 생성 불필요) | Claude가 바로 적용 가능 |
| **4** | 사이트 바탕 한 장(밤하늘판) | Reise 바탕 | ChatGPT | 새 프롬프트 X-3. 낮판은 gpt-assets S-4 |
| **5** | 가죽 금박 메뉴 아이콘 7개 | 헌터 앱 아이콘 | ChatGPT | 새 프롬프트 X-4 |
| **6** | 문장을 "그린 문장"으로, 큰 판과 작은 판 | BLACKOUT 문장 | ChatGPT | gpt-assets C를 X-5 화풍으로 바꿔 쓴다 |
| **7** | 앱 아이콘, 파비콘 세트 | BLACKOUT, 헌터 | ChatGPT 1장 + Claude가 크기별로 자름 | 새 프롬프트 X-6 |
| **8** | 닻 분포도(세계 법칙 한 장 그림) | 헌터 성좌 원판 | ChatGPT | 새 프롬프트 X-7 |
| **9** | 배경 음악 | 세 사이트 모두 | **그림 생성으로 못 만든다.** 참치가 무료 음원(출처 표기 가능한 것)을 고르면 Claude가 플레이어를 붙인다 | 참치 결정 필요 |
| **10** | 강한 마물 "왕관" 진열의 실루엣 바탕 | Reise 왕관 | ChatGPT, 멀리서 본 실루엣만(얼굴이 보이지 않게) | 새 프롬프트 X-8. 실패하면 버린다 |
| **11** | 영문 대문자 글꼴(Cinzel) | Reise | 코드 | "CHRONICLE OF ANCHORS" 같은 새김 글자에만 |
| 제외 | 인물 표정 그림, 웹툰 썸네일, 인물 초상, 휴대폰 잠금 화면 | Reise, 헌터 | 얼굴이 필요하거나 라에온에 없는 구획 | |

**Reise에서 배울 점이자 피할 점:** Reise는 그림 안에 이름과 설명을 박아 넣어서, 같은 그림을 바탕이나 띠로 다시 쓸 수 없었다. 라에온은 **글자 없는 판을 따로 받는다.** 참치의 카드(글자 있음)는 도판으로, 새 풍경(글자 없음)은 바탕·여정 띠·지형 책 머리 그림으로 나눠 쓴다.

## 3. 새 프롬프트

### X-1 지역 풍경 17장 · `land-<지역id>.jpg` (1순위)
쓰는 곳: 바탕 그림, 여정의 장 띠, 지형 책의 장 머리. 참치의 지역·장소 카드를 대신하지 않고, 글자 없는 짝으로 쓴다.

먼저 한 번 넣는다:
```
Next I will ask for 17 landscape paintings, one per region of the continent. Same rules for all: wide 16:9, painterly dark-fantasy oil style like the reference card, no text, no frame, no border, no people, no creatures, no faces. Somewhere in or above each scene, part of a colossal ancient anchor or its chain should be visible (embedded in ground, hanging from clouds, or half-buried), small or large. Keep the lower third calmer and darker so text can sit over it.
```
그다음 한 줄씩:

| 파일 | 프롬프트 |
|---|---|
| land-laeon | Temperate golden farmland and a white-walled imperial capital with tall spires at morning, an anchor chain rising behind the palace into clouds. |
| land-berham | A frozen glacier valley and snowfield under a pale sky, weathered warrior cairns with old weapons planted in the snow. |
| land-silvanir | A misty ancient forest of colossal trees, an elven tree-city of lanterns high in the branches, fog between trunks. |
| land-mortizen | A grey ash wasteland with a collapsed royal city, broken towers, a dim red sun behind smoke. |
| land-sartion | A red desert at sunset with golden pyramid ruins and a hidden oasis, heat haze. |
| land-astra | Jagged high mountains in a lightning storm, a city carved into terraces up the slope, strong wind and clouds. |
| land-nocturna | Sheer cliffs wrapped in thick clouds at night, a gothic cliff castle with a few red windows, crescent moon. |
| land-seilia | A windy harbor city of trade with many ships and sails, gulls, choppy blue-grey sea. |
| land-watch-isle | A small fortress island with a tall lighthouse beam cutting through night sea fog. |
| land-shizunuma | A quiet marsh of hot springs with steam, wooden walkways, cherry blossoms drifting on water, soft dawn mist. |
| land-whisper-isles | Tropical islets with sea caves and turquoise water at dusk, a faint red crack of light inside one cave. |
| land-itzaka | Dense tropical rainforest with a stepped stone pyramid emerging from the canopy, rising mist. |
| land-great-sea | An endless open ocean under storm clouds, a sunken colossal anchor visible as a shadow beneath the waves. |
| land-demon-realm | A volcanic island in a dark sea, rivers of lava, a jagged black castle on the summit under ash clouds. |
| land-funda | A vast underground cavern under a ceiling of ice, grey ash-like snow falling, the frozen tip of a gigantic anchor driven into the rock. |
| land-erata | A strange frontier village where rain falls upward into the sky and roads twist into loops, uncanny calm light. |
| land-aeris | Floating islands drifting through the sky held up by huge steaming arcane engines, their shadows crossing farmland far below. |

### X-2 시그니처 무늬: 닻과 사슬 · `pattern-anchor-chain.png` (2순위)
쓰는 곳: 바탕 무늬, 책등, 표지 가장자리, 입장 장면 바닥
```
Seamless tileable decorative pattern: small antique gold anchors and interlinked chain links arranged in a diagonal lattice, tooled into dark brown leather (#2A2018), low contrast, subtle emboss. Flat even lighting, no vignette, no text. Square 1:1, must tile seamlessly.
```
같은 대화에서 하나 더:
```
Same pattern, but only the gold line work on a fully transparent background (or flat #100E0B), thin even strokes, so it can be laid over any surface.
```

### X-3 사이트 바탕 밤하늘판 · `hero-night.jpg` (4순위)
쓰는 곳: 서고, 세계의 법칙, 밤 장면 바탕
```
A night sky over a dark continent seen from a high ridge: a river of stars, and several colossal anchor chains hanging down from beyond the stars into the land below, catching faint gold light. Distant town lights, low mist in valleys. No people. Painterly oil style. Wide 16:9, the center kept calm for a title.
```

### X-4 가죽 금박 메뉴 아이콘 7개 · `icon-<이름>.png` (5순위)
쓰는 곳: 휴대폰 아래 메뉴, 표지의 구획 입구
먼저:
```
Create a set of menu icons. Each icon is a small square of dark brown leather (#2A2018) with rounded corners and a stitched edge, with a single symbol pressed into it in gold leaf (#C9A45C). Same lighting, size and style for every icon. Square 1:1, plain #100E0B background, no text.
```
그다음 한 줄씩(또는 `all seven in one image, a row of seven with equal spacing`):

| 파일 | 프롬프트 |
|---|---|
| icon-cover | Symbol: an anchor. |
| icon-journey | Symbol: a winding road with a small flag at its end. |
| icon-atlas | Symbol: a folded map with a compass needle. |
| icon-guild | Symbol: a shield with a crossed sword and quill. |
| icon-bestiary | Symbol: three claw marks over an open book. |
| icon-library | Symbol: three standing books with a key. |
| icon-world | Symbol: a globe crossed by a chain. |

### X-5 문장 화풍 바꾸기 (6순위)
`gpt-assets.md`의 C 묶음(마물 계열 8, 지역 17)을 만들 때, 그 문서의 공통 줄 대신 아래 줄을 쓴다. BLACKOUT 문장처럼 "그린 문장"이 된다.
```
Painted heraldic emblem in antique gold relief with fine engraved filigree and a few dark brown recesses, symmetrical, centered, on a transparent background (or flat #100E0B), square 1:1, no text, no faces. Keep a strong silhouette so a 48-pixel copy still reads.
```
받으면 Claude가 큰 판(512px)과 작은 판(96px)을 따로 만든다.

### X-6 앱 아이콘 · `app-icon.png` (7순위)
쓰는 곳: 파비콘 16·32·64, 애플 터치 아이콘 180, 홈 화면 설치 아이콘 192·512
```
An app icon: a rounded square of dark brown tooled leather with a thin gold border, and a bold gold anchor emblem in the center with soft emboss. Simple enough to read at 16 pixels. Square 1:1, 1024x1024, no text.
```

### X-7 닻 분포도 · `anchor-chart.jpg` (8순위)
쓰는 곳: 세계의 법칙 첫머리, 서고
```
An antique astrolabe-style chart drawn in gold and brown ink on dark parchment: a circular map of a continent in the center, with small anchor symbols marking where anchors are embedded, thin lines connecting them like a constellation, concentric rings and degree ticks around the edge. No labels, no letters, no numbers. Square 1:1.
```

### X-8 강한 마물 실루엣 바탕 · `crown-<마물id>.jpg` (10순위, 시험용)
쓰는 곳: 도감에서 S급 이상만 모은 진열 칸 바탕. 얼굴이 보이면 쓰지 않는다.
```
A colossal monster seen from very far away and from behind, only a dark silhouette against a stormy sky, no face visible, no eyes visible. Scale shown by a tiny ruined tower in the foreground. Painterly oil style, deep reds and ink black, wide 16:9, no text.
```
마물만 바꿔 넣는다. 예: `The monster is a giant sea serpent rising from the ocean.` / `The monster is a dragon perched on a mountain peak.` / `The monster is a towering kraken with tentacles over a ship.`

## 4. 그림 생성이 아닌 것(Claude가 코드로)
- 잡티 덮개(3%): 바로 넣을 수 있다.
- 새김 글자 영문 글꼴(Cinzel): "CHRONICLE OF ANCHORS"와 장 번호에만.
- 배경 음악 플레이어: 참치가 곡을 고르면 출처 표기 판과 함께 붙인다. 입장 장면에서 켜고 끄는 단추를 둔다.
- 홈 화면 설치(매니페스트): X-6 아이콘이 오면 붙인다.
