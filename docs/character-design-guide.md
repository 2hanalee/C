# 캐릭터 디자인 기준서 (참치 × Claude)

AI 이미지 생성(NAI V4.5 / Local)용 캐릭터 프롬프트를 쓸 때 따르는 기준이다.
근거는 세 가지다: 참치가 제공한 레퍼런스 7종, 레포에 있는 결과 이미지, 그리고 호평받은 상업 캐릭터 디자인(게임 개발자 인터뷰, 디자인 가이드)을 웹으로 조사한 내용.

> 원칙만 차용한다. 특정 기존 캐릭터의 이름, 외형 조합, 고유 장식을 그대로 재현하지 않는다.

---

## 1. 외부 조사에서 확인한 원칙

| # | 원칙 | 출처 근거 | 프롬프트 적용 |
|---|---|---|---|
| A | **성격과 설정이 먼저, 외형은 그다음** | ZZZ 개발진은 캐릭터 성격을 먼저 정하고 배경 설정으로 비주얼 방향을 잡는다고 밝혔다. HSR 리드 디자이너는 character-first라고 했고, NIKKE CEO는 디자인 요소가 성격을 반영해야 한다고 했다. Reverse: 1999는 텍스트 설정부터 쓴다. 클립스튜디오 해설은 이것을 "디자인의 이유"라고 부른다 | 태그를 쓰기 전에 **컨셉 한 문장**을 먼저 정한다. 성격 아키타입 태그(yandere, expressionless, mesugaki 등)와 서사 디테일 1~2개를 반드시 넣는다 |
| B | **실루엣이 먼저 읽혀야 한다** | 여러 디자인 가이드가 공통으로 "색과 디테일을 빼도 식별되는가"를 기준으로 든다 | 머리 형태, 외투, 소매 같은 큰 덩어리 하나는 독특하게 만든다. 예: twintails + 큰 리본, oversized coat, 헤드기어 |
| C | **형태 언어** | 원형은 친근함, 사각형은 안정과 신뢰, 예각은 공격성과 교활함을 준다 | 원형: bob cut, puffy sleeves, frills, round eyewear. 사각형: military uniform, epaulettes, structured shoulders. 예각: tsurime, angular armor, spikes, pointy ears. **성격과 같은 방향의 형태 태그를 고른다** |
| D | **정보량 대비와 휴식 영역** | 클립스튜디오 해설은 상하 정보 밀도 대비(한쪽 단순, 한쪽 밀도)를 권한다. Proko와 Polycount는 디테일 없는 휴식 영역이 있어야 시선이 머문다고 한다. 대-중-소 형태 배분도 권장된다 | 장식이 집중되는 구역은 **1곳**만 둔다. 나머지는 단색 면으로 남겨 둔다(태그를 안 쓰는 것도 설계다). 대(외투, 케이프) 1 + 중(리본, 벨트) 1~2 + 소(귀걸이, 핀) 1~2 |
| E | **채도 높은 포인트 컬러는 하나** | 차분한 의상에 강한 색 하나를 두면 의도적으로 보이고, 채도가 흩어지면 위계가 무너진다 | 포인트 컬러 태그는 눈, 시그니처, 이펙트 중 2~3곳에만 반복한다. 그 외는 무채색이나 메인 컬러로 둔다 |
| F | **모티프는 역할을 상징해야 한다** | Blue Archive의 헤일로는 학생의 성격이나 테마를 반영한다(저격수 캐릭터는 조준경 모양) | 시그니처 아이템은 **능력, 직업, 성격을 상징하는 물건**으로 정한다. 같은 모티프를 장식, 이펙트, 배경에 반복한다 |
| G | **전통/장르 요소 + 일상 패션** | 원신 개발진은 전통 경극 의상을 참고하되 일상 패션과 섞어 운진을 만들었다고 밝혔다 | "장르 1개 + 의외의 현대 요소 1개" 대비 공식. 예: miko + streetwear jacket, gothic lolita + techwear harness |
| H | **현대 의상은 실존 패션처럼** | 명일방주는 테크웨어 유행을 이끌었다는 평을 받는다(투명하고 오버사이즈인 코트, 브랜드가 만든 옷이라는 설정). ZZZ는 현대 의류를 캐릭터 성격에 맞춘다 | techwear, streetwear, oversized jacket, see-through jacket, harness, patches처럼 **실존 패션 장르와 아이템 태그**를 쓴다 |
| I | **매력은 노출보다 성격** | NIKKE 아트 디렉터는 매력의 핵심이 노출이 아니라 성격이라고 했다. 명일방주와 Reverse: 1999는 성적 요소 없이 호평과 흥행을 얻었다 | 노출 태그로 매력을 채우지 않는다. 표정, 시선, 포즈, 시그니처에 슬롯을 쓴다 |
| J | **익숙함과 새로움의 균형** | ZZZ 개발진은 캐릭터를 만들 때 판타지(새로움)와 공감(익숙함)의 균형을 본다고 했다. 첫 캐릭터는 누구나 떠올릴 수 있는 액션 캐릭터로 만들었다 | 정석 원형 약 70%(6번 기사처럼), 비틀기 약 30%(시그니처와 대비 요소) |
| K | **일관성이 곧 브랜드** | VTuber 디자인 분석에서 의상이나 표정이 바뀌어도 핵심 요소를 유지하는 것이 인지도를 만든다고 본다 | **고정 블록**(머리, 눈, 시그니처)과 **가변 블록**(의상, 포즈, 배경)을 나눈다. 고정 블록은 변주할 때도 그대로 쓴다 |
| L | **흑백/블러 테스트** | 흑백이나 블러로 봐서 초점과 경쟁하는 디테일을 찾으라고 권한다 | 머리, 의상, 배경의 **명도를 분리**한다. 예: 밝은 머리 + 검은 의상 + 채도 높은 배경 |

---

## 2. 레포 이미지 관찰 (0.png, 1~7.webp: 동일 캐릭터 "김태양 / Marionette" 변주)

- **고정 요소가 잘 유지됨**: 금발 트윈테일 + 검은 리본, 보라빛 눈, 검은 광택 하네스 상의, 초커, 십자 귀걸이. 원칙 K를 잘 보여준다.
- **소재 대비**: 광택 블랙(라텍스, 에나멜)과 매트 화이트(니트, 메시)의 대비가 고급스럽다.
- **가장 완성도 높은 컷은 0.png와 7.webp**. 능력(실 조종)을 보여주는 **보라색 실과 마리오네트 인형**이 눈색과 같은 포인트 컬러로 반복된다. 원칙 E와 F에 해당한다.
- **1~4.webp는 능력 모티프가 없어서** 예쁘지만 평범한 캐릭터로 보인다. 시그니처가 빠지면 개성이 떨어진다는 증거다.
- **6.webp(해변)**는 배경을 바꿔도 리본, 귀걸이, 초커로 동일인임을 알아볼 수 있다. 재현성 성공 사례다.

### 2-1. 정정: 디테일 대부분은 모델이 스스로 추가한 것

원본 프롬프트에는 하네스, 초커, 십자 귀걸이, 마리오네트 인형, 메시 소매가 **없다**. 지정된 것은 컨셉 태그(villain suit, marionette, puppet strings, doll-like), 팔레트(ash blonde / black and white / pale violet), 고정 요소(트윈테일 + 검은 리본)뿐이다.

| 프롬프트 입력 | 모델이 채운 디테일 (추정) |
|---|---|
| black and white form-fitting villain suit | 광택 라텍스 상의, 하네스 스트랩, O링, 하이넥 칼라 |
| unsettling doll-like expression + porcelain pale skin | 무표정, 반쯤 감은 눈, 창백한 피부, 인형 같은 눈동자 |
| glowing puppet strings + marionette energy | 보라색 실, 치비 인형(일부 컷만), 손끝 발광 |
| pale violet 톤 지정 | 이펙트, 귀걸이, 하이라이트가 전부 보라 계열로 통일 |

**교훈**
1. **팔레트를 명시하면 모델이 추가하는 디테일도 그 팔레트 안에 머문다.** 김태양 컷들이 통일감 있어 보이는 핵심 이유다.
2. **컨셉 태그는 일관된 디테일을 대신 생성한다.** 단, 무엇을 만들지는 seed마다 달라진다. 1~4.webp에 인형이 빠진 것처럼.
3. 그래서 디자인 방식은 두 가지로 나뉜다.

| 방식 | 방법 | 장점 | 단점 | 해당 레퍼런스 |
|---|---|---|---|---|
| **지정형** | 의상 부품, 결합 방식을 태그로 고정 | 재현성이 높고 고유한 의상 | 태그가 많아 충돌·누락 위험 | 2번 |
| **위임형** | 컨셉 + 팔레트 + 고정 요소만 지정 | 모델이 만든 디테일의 완성도와 통일감 | 결과 편차가 큼 | 김태양 |

### 2-2. 표준 워크플로: 위임 → 선별 → 역추출 → 고정

1. **위임**: 컨셉 태그, 팔레트, 고정 요소(머리·눈·시그니처)만으로 여러 seed를 생성한다.
2. **선별**: 가장 좋은 컷을 고른다(김태양은 0.png, 7.webp).
3. **역추출**: 그 컷에서 모델이 만든 디테일을 Danbooru 태그로 옮긴다.
   예) harness, o-ring, high collar, latex, cross earrings, black choker, see-through sleeves, puppet, string
4. **고정**: 역추출한 태그 중 시그니처급 2~4개만 프롬프트에 추가한다. 나머지는 계속 위임해서 자연스러움을 유지한다.

→ 1단계에서 완성도를 얻고, 4단계에서 재현성을 얻는다.

---

## 3. 확정 규칙 (기존 [외형 완성도 규칙] 개정판)

1. **컨셉 한 문장**: "○○ 장르인데 ○○가 있는 △△한 성격의 캐릭터"
2. **팔레트**: 메인 2~3색 + 포인트 1색. 포인트 컬러는 2~3곳에만 반복하고, 머리·의상·배경은 명도를 분리한다.
3. **시그니처 1개(최대 2개)**: 역할을 상징하는 물건이나 요소로 정하고 가중치를 준다. 모티프는 이펙트나 배경에 반복한다.
4. **얼굴**: 색 + 모양 태그 1~2 + 메이크업 0~1 + 품질 태그 0~2. 가림이나 비대칭(안대, hair over one eye, 마스크) 요소를 쓰면 기억에 남는다.
5. **헤어**: 색 → 길이 → 스타일 → 질감 순서. 실루엣을 만드는 요소 하나를 포함한다.
6. **의상**: 장르 → 소재(광택과 매트 대비) → 구조와 결합 방식 → 포인트 장식. 8~12개. 장식 집중 구역 1곳, 휴식 영역을 남긴다.
7. **서사 디테일 1~2개**: 흉터, 반창고, 다크서클, 점 등.
8. **형태 언어 일치**: 성격과 실루엣·소재 형태가 같은 방향인지 확인한다.
9. **가중치**: 기본 1.1~1.3. 모델이 무시하는 색이나 시그니처에 한해 NAI에서 2::까지(캐릭터당 1곳). 작가 가중치는 0.5~0.9.
10. **억제 태그**: 장르가 습관적으로 끌고 오는 요소는 -1::로 지운다.
11. **조명**: 같은 광원으로 설명되는 태그만 쓰고 최대 5개. 포인트 컬러와 같은 색의 rim light를 우선한다.
12. **구도 일치**: 보이지 않는 부위의 태그는 넣지 않는다.
13. **안전 기준**: 어려 보이는 체형(loli, petite child 등)에는 노출·성적 태그를 결합하지 않는다.

### 캐릭터 프롬프트 구조 (일반용, 개정)

```
소체 → 성격 아키타입/표정 → 헤어 → 눈 → 체형
→ ★시그니처(가중치) → 의상 장르 → 의상 부품(구조·결합, 색+소재 쌍) → 포인트 장식 2~3
→ 서사 디테일 1~2 → 억제 태그(-1::)
```

### 결과 평가 6기준 (각 1~5점)

실루엣 가독성 / 팔레트 통제 / 시선 집중 계층 / 컨셉 일관성 / 태그 반영률 / 재현성

---

## 4. 조사의 한계

- 상업 게임의 디자인 철학은 주로 인터뷰 요약 기사에 의존했다. 팬덤 반응은 대부분 2차 출처다.
- 웹 결과의 상당수가 저품질 SEO 페이지라 제외했다. 아래 출처는 비교적 신뢰할 수 있는 것만 남겼다.
- 이 원칙들은 휴리스틱이다. 최종 판단은 실제 생성 결과로 검증한다.

## 출처

- [Automaton – ZZZ 개발진: 캐릭터 제작 방식을 하나로 고정하지 않는다](https://automaton-media.com/en/news/zenless-zone-zeros-flashy-character-designs-are-a-result-of-the-dev-team-not-wanting-to-settle-on-just-one-character-creation-method-it-would-only-limit-our-ability-to-create-intere/)
- [Siliconera – ZZZ 2.0 캐릭터 인터뷰](https://www.siliconera.com/interview-preparing-zenless-zone-zero-2-0-and-its-characters/)
- [Geek Culture – ZZZ TGS 2023 프리뷰](https://geekculture.co/tgs-2023-hoyoverse-zenless-zone-zero-preview)
- [Anime News Network – HSR 리드 디자이너 인터뷰](https://animenewsnetwork.com/interview/2025-04-28/honkai-star-rail-lead-game-designer-chengnan-an-on-creating-an-immersive-world/.223853)
- [Siliconera – 원신 운진 디자인 과정](https://www.siliconera.com/mihoyo-discusses-how-it-created-yun-jin-in-genshin-impact/)
- [Wikipedia – List of Genshin Impact characters](https://en.wikipedia.org/wiki/List_of_Genshin_Impact_characters)
- [Automaton – Shift Up CEO: NIKKE 디자인](https://automaton-media.com/en/?p=38711)
- [Game Watch – NIKKE 인터뷰](https://game.watch.impress.co.jp/docs/interview/1627639.html)
- [Pocket Gamer.biz – Reverse: 1999의 성공 요인](https://www.pocketgamer.biz/unconventional-characters-and-respect-for-creative-freedom-drive-reverse-1999s-100m-success)
- [Pocket Gamer – Reverse: 1999 팀 인터뷰](https://www.pocketgamer.com/reverse-1999-rpg/the-team-behind-the-hit-gacha-game-reveals-all)
- [Game Developer – Wuthering Waves 캐릭터](https://gamedeveloper.com/design/making-a-splash-how-wuthering-waves-characters-draw-players-into-its-world)
- [Tyson Tan – 테크웨어와 명일방주](https://tysontan.com/?p=1153)
- [TV Tropes – Arknights](https://www.tvtropes.org/pmwiki/pmwiki.php/Fridge/Arknights)
- [Blue Archive Wiki – Halo](https://bluearchive.fandom.com/wiki/Halo)
- [클립스튜디오 – 매력적인 캐릭터 디자인 방법 (실루엣/색상/설정)](https://www.clipstudio.net/drawing/archives/176087)
- [클립스튜디오 – 대담한 패션과 강한 실루엣](https://www.clipstudio.net/drawing/archives/159271)
- [클립스튜디오 – 흑백 실루엣의 중요성](https://www.clipstudio.net/drawing/archives/167782)
- [Wacom/BAM – Good vs bad character design](https://community.wacom.com/en-de/learn/good-vs-bad-character-design-bam/page/5)
- [Fiveable – Creating appealing character designs](https://fiveable.me/2d-animation/unit-12/creating-appealing-characters-designs/study-guide/9RmeKuOprOx3w7pJ)
- [Creative Bloq – Costumes for character designs](https://www.creativebloq.com/art/character-design/how-to-make-fabulously-fitting-costumes-for-character-designs)
- [Polycount – The Rot (디테일과 휴식 영역)](https://polycount.com/discussion/76862/the-rot)
- [Telkom University – 원신 캐릭터 디자인과 가챠 결정 연구](https://repository.telkomuniversity.ac.id/pustaka/files/212962/abstract/pengaruh-desain-karakter-terhadap-keputusan-gacha-pada-gim-genshin-impact-dalam-bentuk-buku-karya-ilmiah.pdf)

---

## 5. 참치 상시 규칙 (최우선 적용)

이 섹션이 앞의 규칙과 충돌하면 **이 섹션을 따른다.**

### 5-1. 환경

- 기본 환경은 **PixAI**(Local 문법): 가중치는 `(tag:1.2)`로 쓴다.
- NAI 전용 문법(`-3::artist collaboration ::`, `-1::tag::`)은 쓰지 않는다. 억제하고 싶은 태그는 네거티브로 보낸다.

### 5-2. 작가 태그 (순서 고정)

```
artist:nid417, artist:mocha_(cotton), artist:huashijw, artist:pei_(sumurai), artist:ciloranko, artist:pottsness, artist:nanoless, artist:mengxin_huazha, artist:qys3, artist:zhaofeng_yinyue, artist:yaguo, artist:LAM, artist:lack, artist:Fuzichoco, artist:toi8, artist:redjuice
```

- **전투 상황이나 능력 발동 상황**이면 맨 뒤에 `artist:murata_yusuke`를 추가한다.
- 표기는 항상 `artist:이름` 형식으로 통일한다(콜론 뒤 공백 없음).

### 5-2-1. PixAI 고정 퀄리티 태그 (포지티브 맨 끝에 항상 추가)

```
masterpiece, best quality, highres, absurdres, best illustration, novel illustration, no text, illustchuky (style), illustchuky, good body, flawless eyes, yuki18 style, 8k
```

### 5-3. 작성 원칙

1. Danbooru에 실제로 있는 태그가 뼈대다. 태그로 표현할 수 없는 디테일은 **짧은 자연어 구절로 보강**한다.
2. 배경이 있으면 **배경 디테일과 광원 묘사를 반드시 자세히** 쓴다. 광원은 아래 레이어 순서로 짠다.
   - 주광원(시간·장소, 예: moonlight, hard overhead spotlight)
   - 보조광·측광(예: amber side light)
   - 림라이트(포인트 컬러와 같은 색, 예: cyan rim lighting)
   - 반사광(예: wet surface reflections, stars reflected in water)
   - 이펙트광(예: glowing sword edge, light particles)
   - 대기(예: atmospheric fog, suspended dust, volumetric lighting)
   - 렌즈(예: depth of field, bokeh, subtle bloom)
   - 같은 광원 이야기로 설명되면 개수 제한은 두지 않는다. 이 규칙이 3절 11번(최대 5개)을 대체한다.
3. 의상은 **사용자 컨셉에 더해 추가할 만한 장식 후보**를 함께 제시한다. 후보는 프롬프트 밖 표로 보여주고 태그, 위치, 효과를 적는다.
4. **태그 삭제의 역설**: 태그가 애매하게 많으면 모델이 자율적으로 채우던 의상 디테일이 줄어든다. 대응은 두 가지다.
   - 의상 핵심 부품과 결합 방식을 프롬프트에 명시한다. 소재, 트림, 패스너, 안감 색을 써서 디테일을 직접 보장한다.
   - 의상과 무관한 군더더기 태그는 뺀다.

### 5-4. 기본 구도

`upper body, face focus, three quarter view` (필요하면 `straight on`, `looking at viewer`). 가중치 예: `(upper body:1.5), (face focus:1.1~1.35)`

### 5-5. 금지 태그

| 분류 | 금지 | 이유 |
|---|---|---|
| 눈 디테일을 낮추는 태그 | half-lidded eyes, half-closed eyes, smirk, closed eyes(예외는 감정 연출 컨셉일 때만) | 눈 디테일 손실 |
| 인체 비율을 무시하는 태그 | huge breasts, gigantic breasts 등 | 비선호 |
| 신발 태그 (**예외 없이 배제**) | shoes, boots, high heels, sandals, sneakers, footwear 계열 | 비선호. 얼굴 디테일 감소 |
| 하반신 태그 (**최소 사용**) | 컨셉상 필요한 간단한 것만 허용: skirt, pleated skirt, shorts, pants 등 1~2개. 다리 장식·legwear·feet 등 세부 태그는 쓰지 않음 | 얼굴 디테일이 크게 감소함 |

- 위 태그들은 네거티브 기본값에도 추가한다.
- 1번 레퍼런스 세트의 half-closed eyes 사용 패턴은 폐기한다.
- 대체할 눈 모양 태그: sharp eyes, tsurime, tareme, upturned eyes, narrowed eyes 대신 focused gaze

### 5-6. 눈 디테일 뱅크 (캐릭터마다 다르게 조합: 색 1 + 구조 2 + 광택 1~2 + 메이크업 0~1)

- 구조: detailed iris, detailed pupils, slit pupils, symbol-shaped pupils, ringed eyes, gradient eyes, heterochromia(컨셉이 필요할 때만)
- 광택: glossy eyes, eye highlights, sparkling eyes, light in eyes, reflection in eyes, glowing eyes, subtle eye highlights
- 속눈썹·메이크업: long eyelashes, colored eyelashes, eyeshadow, red eyeliner, eyeliner
- 시선: focused gaze, piercing gaze, gentle gaze, looking at viewer
- 자연어 보강 예: crystal-clear iris, starlight reflected in eyes

### 5-7. 전투 프롬프트

1. 능력의 효과보다 **발동 직전 장면**을 그린다(충전, 기세, 빛이 모이는 순간).
2. 동작 동사 태그는 필수: punching, slashing, kicking, aiming, casting spell 등
3. 능력은 정확한 시각화가 불가능하다. 기본 이펙트, 광원, 설정 전달에 집중한다.
4. 범용 태그 풀: dynamic pose, motion blur, motion lines, attack, attack effect, incoming attack, light trail, glowing eye, three quarter view, (impact frame), (concentric shockwave)
5. upper body 구도에서는 out of frame, ultimate attack 같은 원거리·전신 계열 태그는 필요할 때만 쓴다.

### 5-8. 출력 형식

1. Step 1: 의도 확인 + 외형 포인트 3가지
2. Step 3: ① 포지티브 ② 네거티브 (코드 블록, 한 줄)
3. **③ 장식 후보 표** (태그 / 위치 / 효과)

### 5-9. PixAI 포지티브 순서

```
작가 → 소체·직업 → 구도 → 헤어 → 눈 → 표정 → 의상 → 장식
→ (전투: 동작 → 이펙트) → 배경 → 광원 → 분위기 → 퀄리티
```

### 5-10. 네거티브 기본값 (PixAI)

```
lowres, worst quality, bad quality, bad anatomy, bad hands, extra fingers, missing fingers, extra limbs, deformed face, asymmetrical eyes, cross-eyed, blurry, jpeg artifacts, text, watermark, signature, half-closed eyes, half-lidded eyes, smirk, huge breasts, shoes, boots, footwear, feet, lower body focus
```

---

## 6. 결과 피드백 로그

### 2026-11-10 · 다크톤 마법소녀 1차 (강세아 / 노아 / 유채린, PixAI)

| 기준 | 강세아 | 노아 | 유채린 |
|---|---|---|---|
| 실루엣 | 4 | 5 | 5 |
| 팔레트 | 3 (빨강이 4곳 이상으로 번짐) | 4 (촛불이 파랗게 나와 웜/쿨 대비가 사라짐) | 5 |
| 시선 집중 | 4 | 5 | 5 |
| 컨셉 일관성 | 3 (다크톤 약함, 야외풍 수영장) | 4 | 5 |
| 태그 반영률 | 3 (호루라기, 녹슨 사다리, 형광등, 실내 누락) | 3 (교실, 시안 링, 따뜻한 촛불 누락) | 4 (음모론 보드 누락, 별자리 선 약함) |

**공통 발견**
1. **얼굴 중심 구도에서 배경 소품은 2~3개만 반영된다.** `(upper body:1.5)`, `(face focus)`, `depth of field`를 함께 쓰면 소품 대부분이 보케로 녹는다. 소품은 가장 상징적인 1~2개만 고르고 하나에 가중치를 준다.
2. **배경 분위기는 소품보다 광원 색 태그가 결정한다.** 광원 색은 반드시 명시한다(예: warm orange candle flame). 색이 없으면 장면 전체 톤에 맞춰 바뀐다(노아의 촛불이 파랗게 나옴).
3. **bokeh와 light particles는 둥근 오브젝트로 변할 수 있다.** 강세아 컷의 비치볼이 그 예다. 수영장이나 바다 장면에서는 bokeh를 뺀다.
4. **리본과 수영복에 글자 아티팩트가 생긴다.** 네거티브에 `english text, logo, letters`를 추가하고 포지티브는 `plain ~`으로 쓴다.
5. **모델이 얼굴 장식을 스스로 추가한다.** 노아 뺨의 파란 크리스털 패치, 유채린 뺨의 별 마크가 그 예다. 좋으면 역추출해서 고정한다.
6. **모델이 만든 좋은 디테일의 예**: 노아의 검은 기계 손과 버클 하네스 재킷, 유채린의 별+깃털 머리장식과 붕대 감은 손으로 뺨을 괸 포즈.

### 2026-11-10 · 2차 (수정 프롬프트 적용)

| 기준 | 강세아 | 노아 | 유채린 |
|---|---|---|---|
| 실루엣 | 4 | 4 | 5 |
| 팔레트 | 5 (빨강이 리본·끈·반창고에만) | 2 (주황이 고깔·깃발·헤드기어·불길로 번짐) | 5 |
| 시선 집중 | 5 | 3 (불길이 얼굴과 경쟁) | 5 |
| 컨셉 일관성 | 4 | 3 | 5 |
| 태그 반영률 | 4 (녹이 안 보임) | 2 (컵케이크 누락, 시안 링 실패) | 4 (깃털, 망원경 누락) |
| 1차 대비 동일인 유지 | ○ | ○ | ○ |

**발견**
1. **광원 색에 가중치를 주면 광원이 이펙트로 커지고, 그 색이 다른 소품으로 번진다.** 노아의 `(warm orange candle flame:1.15)`가 불길 이펙트가 됐고, 고깔과 깃발까지 주황이 됐다. 광원 색은 가중치 없이 `small` 같은 크기 한정어와 함께 쓴다. 소품 색은 팔레트 색으로 직접 지정해서 번짐을 막는다.
2. **같은 색 계열을 이중 지정하면 모델이 기본 연상을 따른다.** `grey eyes` + `cyan ring`은 두 번 다 주황·빨강 링으로 나왔다. 대체 태그로 `mechanical pupils`를 쓴다.
3. **`held in both hands` 같은 자연어 소품 지시는 손이 다른 물건을 쥐면 사라진다.** 소품은 Danbooru 태그로 쓴다(`cupcake`, `holding food`).
4. 강세아는 1차 피드백을 거의 다 해결했다. `bokeh` 제거, `indoors` 가중치, `plain` 지정이 효과가 있었다.

## 7. 추가 상시 규칙

- **손동작은 가변 블록이다.** 기본 프롬프트에서 손동작 태그(`hand on own cheek` 등)를 고정하지 않는다. 감정 프롬프트를 만들 때는 감정마다 손동작을 새로 정한다. 손에 드는 시그니처 소품(노아의 컵케이크 등)도 기본 프롬프트에서는 선택 항목이다.

## 8. 캐릭터 설정 변경 기록

- **노아 (2026-11-10)**: 생일·기념일 설정 삭제. 고깔모자, 컵케이크, 촛불, 장식 끈 모티프 폐기. 새 시그니처는 방벽 능력을 시각화한 **시안 육각 방벽 패널**. 배경은 아카데미 정비실로 변경.
