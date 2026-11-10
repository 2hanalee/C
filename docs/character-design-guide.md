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
