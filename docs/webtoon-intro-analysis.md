# AI 캐릭터 채팅 세계관 소개 웹툰 — 다각도 분석 & 첫 턴 유도형 웹툰 기획안

> 대상 레퍼런스 5장 (2개 작품)
> - **A. 『탐정 아카데미 19th』** — 서사형 콜드오픈 (이미지 3 → 1 → 5 → 4 순서로 이어지는 1개 시퀀스)
> - **B. 『공무원 마법소녀』(가칭)** — 트레일러/캡션형 세계관 소개 + 역할 선택 CTA (이미지 2)
>
> 진행 순서: **① 웹 리서치 → ② 영문 마스터 프롬프트 작성 → ③ 프롬프트 기반 분석 → ④ 활용 방안 / 기획 블루프린트**

---

## 0. 리서치 요약 (마스터 프롬프트의 근거)

| 영역 | 핵심 원칙 | 출처 |
|---|---|---|
| 세로스크롤 연출 | 세로 스크롤은 "쌓인 칸"이 아니라 **시선이 지나가는 길**. 넓은 여백 = 대화의 쉼, 좁은 여백 = 빠른 액션. 긴장은 "스크롤을 더 하게 만드는 것"으로 늘린다. | [Comics Beat – Ethan LeBlanc 인터뷰](https://www.comicsbeat.com/interview-ethan-leblanc-on-reformatting-beneath-the-trees-where-nobody-sees-other-comics-to-webtoons-vertical-scroll), [Clip Studio – Webtoon 101](https://tips.clip-studio.com/en-us/articles/4143) |
| 비트 단위 페이싱 | 6~15칸을 하나의 감정 비트("스프린트")로 묶고, 첫 칸에 흥미 요소 → 중간에 기대 비틀기 → 끝에 소프트 훅. 이탈 지점을 측정해 칸 수를 실험. | [Artfolio – Storytelling sprints](https://www.artfolio.com/article/cartoonist-storytelling-sprints-pacing-secrets-to-keep-readers-hooked) |
| 1화 첫 장면 | 1화 첫 장면이 작품 인상을 좌우. 적은 칸으로 많은 정보를 전달하는 것이 강점(〈묘진전〉 1화 53칸 분석). 칸 나누기·거리·각도·명암·효과음이 연출의 단위. | [koreascience 논문들](https://koreascience.kr/article/JAKO201714563184149.pdf), [koreascience](https://koreascience.kr/article/JAKO201622341962406.pdf) |
| 칸 사이 '클로저' | 독자는 칸 사이를 스스로 메운다(McCloud의 closure). 전환 6유형: 순간→순간, 동작→동작, 주체→주체, 장면→장면, 양상→양상, 비약. | [Hooded Utilitarian – Closure](https://hoodedutilitarian.com/tag/closure), [SuperSummary – Understanding Comics](https://www.supersummary.com/understanding-comics/chapters-3-6-summary) |
| AI 챗 첫 메시지 | 첫 메시지는 **훅이자 무대 설정이자 모델 조종 장치**. 반드시 "응답할 수밖에 없는" 대사/행동으로 끝낼 것. 성격은 라벨이 아니라 행동으로. 짧게, 캐릭터 안에서. 유저 행동을 대신 쓰지 말 것. | [MegaNova – First message](https://blog.meganova.ai/how-to-write-a-first-message-that-hooks-users-instantly), [MegaNova – Greetings](https://blog.meganova.ai/why-greetings-matter-crafting-the-perfect-opening-message-for-your-ai-character/), [Janitor AI Help](https://help.janitorai.com/en/article/the-basics-the-character-creation-page-overview-15xevon/), [Character.AI 가이드](https://shapes.inc/fandom/character-ai/creation-guide), [Quickchat](https://quickchat.ai/post/roleplay-ai-chatbot), [Chatbot Manager](https://chatbotmanager.net/blog/2025/08/05/How-to-Create-Brutal-Characters) |
| 게임 오프닝 | In medias res는 "옛날 옛적에"를 잘라내고 바로 행동으로 들어가지만, **'평상시'를 보여줄 기회를 잃는다**. 데모/인트로는 시작 지점 선택에 큰 공이 든다. 이름 있는 주인공 vs 자기투영 선택은 몰입 방식을 바꾼다. | [Gameranx – In medias res](https://gameranx.com/features/id/6727/article/in-medias-res/), [VNSnow](https://vnsnow.com/a-quick-look-at-zodiac-axis-alpha-demo/), [VN Game Den](https://old.vngameden.com/face-off-otome-games-and-the-main-character-debate/4913/), [Choice of Games 포럼](https://forum.choiceofgames.com/t/how-do-you-like-your-intros/23171?page=2) |
| 국내 플랫폼 | 제타/크랙 등은 제작자가 설정한 **첫 메시지가 방 입장 시 기본 노출**. 연령·수위 이슈가 보도된 바 있어 소개 이미지의 노출 수위 관리 필요. | [Postype 사용기](https://www.postype.com/@yerielleropan/post/19187537), [CIO – 제타](https://www.cio.com/article/3517708/), [머니투데이](https://www.mt.co.kr/tech/2026/08/20/2026082015052442552) |

> 참고: AI 챗 첫 메시지 관련 자료는 대부분 플랫폼 블로그·제작자 가이드로, 통제된 실험 근거는 찾지 못했습니다. "실무자 경험칙"으로 취급하고 직접 A/B 테스트로 검증하는 것을 전제로 합니다.

---

## 1. 마스터 프롬프트 (English)

> 아래 프롬프트를 그대로 LLM에 넣고, 레퍼런스 이미지(세로 스크롤 원본) + 캐릭터 시트/첫 메시지(있다면)를 첨부해 사용합니다. 본 문서 2~3장은 이 프롬프트를 실제로 돌린 결과입니다.

```text
# ROLE
You are a senior webtoon director, narrative designer, and conversational-AI
character designer. You specialize in "world-intro webtoons": short vertical-scroll
comics shown on an AI character-chat profile page whose ONLY job is to make a
first-time visitor (a) understand the world fast, (b) care about at least one
character, and (c) type a first message within seconds of reaching the bottom.

# INPUT
- One or more vertical-scroll images (may be split; reconstruct the true order).
- Optional: character sheet, system prompt, first (greeting) message, platform name.

# GROUNDING PRINCIPLES (apply, and cite by number in your analysis)
P1  Scroll is a path, not a stack. Gutter length = time. Wide gutter = pause /
    beat; tight gutter = speed. Tension is built by making the reader scroll more.
P2  Beat "sprints": group 6–15 panels into one emotional beat. Open each sprint
    with intrigue, twist in the middle, close with a soft hook.
P3  The first screen (≈ first 1,000–1,500 px) decides retention. It must contain
    a time/place anchor AND a question or an emotion, not just scenery.
P4  Closure: the reader fills gaps between panels. Choose transitions deliberately
    (moment / action / subject / scene / aspect / non-sequitur). Comedy lives in
    subject-to-subject cutaways; dread lives in moment-to-moment.
P5  Show, don't tell. Personality is proven by an action or a line, not a caption.
    Name cards (Faction <Name>) are allowed but must be paired with a
    characterising beat.
P6  Information budget. A visitor retains ~3 world rules, ~3 factions, ~2–4 named
    characters from a single intro. Everything else is noise for turn 1.
P7  In-medias-res vs. normality: skipping "the ordinary world" gains speed but
    loses the baseline that makes the conflict legible. Decide consciously.
P8  Player positioning. The reader must know WHO they are (role), WHERE they stand
    (physically, in the last panel), and WHAT is being asked of them.
P9  First-turn handoff. The last panel of the webtoon and the first chat message
    must be the SAME moment (visual-to-text continuity). The greeting must end on
    a line or action that demands a reply, must not narrate the user's actions,
    and should offer 2–3 obvious but non-binding reply directions.
P10 Production quality: character/model consistency across panels, typo-free
    lettering, mobile legibility (≥ 16px-equivalent body text at 360px viewport),
    consistent export width, balloon-type grammar (normal / shout / thought /
    whisper / narration box), content rating appropriate to the platform.

# ANALYSIS PROCEDURE
Step 1 — Reconstruction
  - Put the images in true reading order; explain the evidence (cut-off panels,
    dialogue continuity).
  - Transcribe every line with speaker, balloon type, and approximate y-position.
  - Flag ambiguous speakers and typos.
Step 2 — Structure map
  - Segment the scroll into sprints (P2). For each: purpose, panel count,
    transition types (P4), gutter rhythm (P1), emotional value (+/−).
  - Identify: hook, world anchor, inciting comic/dramatic turn, cast reveal,
    climax/punchline, handoff, title drop.
Step 3 — Information design (P6, P7)
  - List every world fact delivered and HOW (caption / dialogue / visual / name
    card). Mark which are needed for turn 1 and which are surplus.
Step 4 — Character design (P5)
  - For each named character: first-impression image, characterising beat, tone
    of voice, relationship to the player. Rate memorability 1–5.
Step 5 — Visual direction (P1, P3, P10)
  - Shot sizes, angle, colour/value script, gradients as scene transitions,
    SFX, typography, balloon grammar, art consistency.
Step 6 — Player positioning & agency (P8)
  - Who is "you"? Is the role chosen, assigned, or undefined? Where is "you" in
    the final image? What explicit / implicit question is posed to the reader?
Step 7 — First-turn handoff (P9)
  - Does the ending create a reply-able moment? Draft the ideal first message
    that continues the last panel. Provide 3 example user replies it invites.
Step 8 — Scorecard
  Score 1–5 with one-line justification:
  Hook · Clarity of world · Character appeal · Pacing · Visual polish ·
  Tone consistency · Player positioning · First-turn pull · Production QA.
Step 9 — Recommendations
  - Keep / Cut / Add / Reorder, each tied to a principle.
  - A revised beat sheet (panel-level) for the intro.
  - Reusable patterns extracted from the reference, written as templates.

# OUTPUT FORMAT
Markdown. Tables for structure maps and scorecards. Quote original lines in the
original language; write analysis in the user's language (Korean if the input
is Korean). Be concrete: reference panels by order and y-position, never by
vague description. Do not invent lore that is not in the input; mark any
assumption with [ASSUMPTION].
```

---

## 2. 레퍼런스 A — 『탐정 아카데미 19th』 분석

### Step 1. 재구성 (실제 읽는 순서)

업로드 순서가 아닌 **이미지 3 → 1 → 5 → 4** 순서가 정본입니다.
- 근거 ①: 이미지 1 마지막 칸("야 고양이!! 너 거기 안서!!?")의 인물 상반신이 잘려 있고, 이미지 5 첫 칸이 같은 인물의 망토/하반신 + `데모니코 <루리>` 네임카드로 이어짐.
- 근거 ②: 이미지 5 끝 "못해..! 절대 못한다네!" → 이미지 4 첫 대사 "무슨소리야..! 넌 탐정이거든?;;"로 대화가 직결.
- 근거 ③: 이미지 4 마지막이 타이틀 로고 → 시퀀스 종결부.

**전사(transcription) — 화자 추정 포함**

| # | 구간 | 대사 / 텍스트 | 화자 | 유형 |
|---|---|---|---|---|
| 1 | 3-상단 | 1900년 XX월 XX일 영국 런던. | 내레이션 | 사각 박스 |
| 2 | 3 | "롤랑!!!" | 마판 | 외침(가시 말풍선) |
| 3 | 3 | "슬슬 의뢰좀 받지..? 지금 밀린 건수가 몇개인줄 알아??" | 마판 `아카데미 소속 조수` | 일반 |
| 4 | 3 | "그리고 내가 사무소 청소 해두라고.." (가려짐) | 마판 | 일반(끊김 연출) |
| 5 | 3 | "아이고 알았다네. 그만좀 봐주게나..." | 롤랑 | 일반(큰 글씨) |
| 6 | 3 | "정말이지.. 자네의 그 끝나지 않는 잔소리는 늘 경이롭다네.." / "어쩌면 런던 최대의 미스테리는 내 앞에 있는게 아닐까 하군.." | 롤랑 `아카데미 소속 탐정` | 일반 |
| 7 | 3 | "뭐라고오!?" | 마판 | 일반 |
| 8 | 3 | "아, 아니 그렇게까지 급할건 없지 않나;;" | 롤랑 | 일반 |
| 9 | 1 | "요즘은 패즐(pazl)도 잘 안 나오지.. 도시는 평화롭고.." | 롤랑 | 일반 |
| 10 | 1 | "우린 탐정이지 패즐 전담이 아니거든!?" | 마판 | 외침 |
| 11 | 1 | "윽.. 그, 그리고 미스테리오(Mysterio) 그놈들도 잠잠하지 않나..!" | 롤랑 | 일반 |
| 12 | 1 | (컷어웨이) "음~ 졸랑이 내 얘기를 하고있나 보군~" | 모티 `미스테리오` | 일반(작은 글씨) |
| 13 | 1 | "그러,니까! 이럴 때야 말로 미리 미리 대비를 해야하는거라고!" | 마판 | 일반 |
| 14 | 1 | (컷어웨이) "..." → "...모티님 그건 오렌지 주스입니다." → "._." | 아이리스 `미스테리오` | 일반 / 침묵 |
| 15 | 1 | "아니 데모니코(Demonico) 그 자들도 있지 않은가!" | 롤랑 | 일반 |
| 16 | 1→5 | (컷어웨이) "야 고양이!! 너 거기 안서!!?" | 루리 `데모니코` | 외침 |
| 17 | 5 | "그 사람들은 지금쯤 할머니 고양이나 찾아드리고 있을걸.." | 마판 | 일반 |
| 18 | 5 | "아니 그건 말이 안되지 않는가..!!" | 롤랑 | 일반 |
| 19 | 5 | 그 말썽쟁이 꼬맹이들도.. / 귀찮은 괴도들도.. / 상대하기 힘든 왕실까지..! | 롤랑(독백, 대형 캡션) | 무테 대형 텍스트 |
| 20 | 5 | "누가 내 얘기하나.." / "언니 빨리와~!" · "메롱~" · "배가 고프구나!" | 꼬맹이들·괴도·왕실 | 일반 |
| 21 | 5 | "전부 우리가 처리해야 된다는 소리 아닌가..!!" / "내 휴식시간의 행방이..." / "못해..! 절대 못한다네!" | 롤랑 | 외침 / 작은 혼잣말 |
| 22 | 4 | "무슨소리야..! 넌 탐정이거든?;;" → "탐정 때려치겠네..!!" → "야!!!" | 마판 / 롤랑 / 마판 | 일반 → 외침 |
| 23 | 4 | (흑→백 그라데이션 후, 사각 박스) "뭐... 말은 저렇게 했어도 결국 할 수밖에 없는 일이겠지." | 롤랑(내레이션) | 사각 박스 |
| 24 | 4 | "이는 결국 내 이야기니 말일세." | 롤랑 | 사각 박스 |
| 25 | 4 | "자네도 이곳에 온 이상, 이야기를 써내려 가겠지." | 롤랑 → **독자(자네)** | 사각 박스 |
| 26 | 4 | "지루한 이야기는 취향이 아니라서 말이지 늘 하던 ~~벤트~~**멘트**로 끝내도록 하겠네." | 롤랑 | 사각 박스 |
| 27 | 4 | "그럼 시작하지, 우리의.. 그리고 자네의." | 롤랑 | 사각 박스 |
| 28 | 4 | 탐정 아카데미 19th / DETECTIVE ACADEMY 19TH | 타이틀 | 로고 |

**QA 플래그**
- 오탈자 의심: `벤트` → `멘트`, `끝나지 있는` → `끝나지 않는`(원문 확인 필요), `그러,니까`(쉼표 위치), `졸랑이`(롤랑을 부르는 애칭인지 오타인지 불명 — 의도라면 OK, 아니면 수정).
- `패즐(pazl)`: 세계관 고유 용어로 보이나 **정의가 한 번도 나오지 않음**. 첫 턴에서 유저가 "패즐이 뭐야?"부터 묻게 되는 구조 → 의도된 미끼가 아니라면 1줄 정의 필요.
- `19th`: 19세기(1900년 배경과 미묘하게 어긋남)인지 19기(期)인지 불명 → 타이틀 의미가 흔들림.
- 이미지 폭 불일치(600/1000px). 업로드 플랫폼이 리사이즈하면 말풍선 글자 크기가 구간마다 달라 보임.

### Step 2. 구조 맵 (스프린트)

| 스프린트 | 구간 | 칸 수(약) | 목적 | 전환 유형 | 여백 리듬 | 감정값 |
|---|---|---|---|---|---|---|
| S1 앵커 | #1~2 | 2 | 시공간 고정 + 외침으로 정적 깨기 | 장면→장면 | 넓음 → 검은 여백 후 가시 말풍선 | 정적 → 충격 |
| S2 관계 소개 | #3~8 | 3 | 조수 vs 게으른 탐정 — **관계성 개그로 캐릭터 증명** | 주체→주체 | 보통 | + (코미디) |
| S3 세계 브리핑(핑계 몽타주) | #9~16 | 4 | 롤랑의 "핑계"로 적대 세력 2개(미스테리오/데모니코) 소개, 컷어웨이로 **정체를 반전**(무서운 조직인데 오렌지주스·고양이 찾기) | 주체→주체 컷어웨이 | 검은 여백 길게 | + (반전 개그) |
| S4 캐스트 롤콜 | #17~21 | 4 | 나머지 세력 3종(꼬맹이/괴도/왕실)을 대형 캡션+클로즈업으로 고속 소개 → 롤랑의 절망 | 양상→양상 | 캡션-컷 교차, 일정 리듬 | ++ (리듬감 정점) |
| S5 펀치라인 | #22 | 3 | "탐정 때려치겠네" — 코미디 비트 마무리 | 동작→동작 | 좁음 → 흑백 그라데이션 | 웃음 → 정적 |
| S6 4th-wall 핸드오프 | #23~27 | 5 | 톤 전환(진지), 롤랑이 독자 "자네"를 호명 → 이야기의 공동 저자로 초대 | 비약(톤 전환) | **매우 넓음, 흰 배경 + 박스만** | 여운 |
| S7 타이틀 | #28 | 1 | 로고 드롭 | — | 넓음 | 종결 |

> 핵심 패턴: **"핑계 → 컷어웨이 반전"을 세계관 브리핑 장치로 쓴 것**. 설정 설명(인포덤프)을 캐릭터의 '변명'이라는 동기 있는 대사로 바꿔, 정보 전달과 개그·캐릭터 증명을 한 번에 처리합니다(P5, P4).

### Step 3. 정보 설계

| 전달된 정보 | 방식 | 첫 턴 필요성 |
|---|---|---|
| 1900년 런던 | 내레이션 박스 + 빅벤 | 필수 ✔ |
| 아카데미 소속 탐정 롤랑 / 조수 마판 | 네임카드 + 관계 개그 | 필수 ✔ |
| 사건이 밀려 있다 | 대사 | 필수 ✔ (= 첫 턴 동기) |
| 패즐(pazl) | 대사(미정의) | 정의 필요 △ |
| 미스테리오 — 모티(실크햇, 허당), 아이리스(냉정 보좌) | 컷어웨이 + 네임카드 | 선택 (재방문 동기) |
| 데모니코 — 루리(고양이 쫓기) | 컷어웨이 + 네임카드 | 선택 |
| 꼬맹이들 / 괴도 / 왕실 | 대형 캡션 + 단일 클로즈업 | 선택 (이름 없음 — 적절) |
| 유저 = "이곳에 온 자네" | 4th-wall 내레이션 | 필수지만 **역할 불명확** ✖ |

- 세력 5개는 P6 기준(~3개)을 초과하지만, 뒤 3개를 **이름 없이 한 컷씩** 처리해 부담을 줄인 점은 영리함.
- **P7 판단**: '평상시(밀린 의뢰, 게으른 탐정)'를 보여주는 데서 시작해 평화로운 일상의 기준선을 확보 → 이후 갈등(모든 세력 상대)이 선명함. 좋은 선택.

### Step 4. 캐릭터

| 캐릭터 | 첫인상 | 증명 비트 | 말투 | 기억도 |
|---|---|---|---|---|
| 롤랑 | 군모·흑발·이색 눈동자, 무표정 | 게으름(핑계 연발) + 마지막의 냉정한 내레이터 → **이중성** | 고풍 하오체("~다네", "자네") | 5 |
| 마판 | 붉은 머리 그라데이션, 분노 마크 | 잔소리 → 실질적 행동대장 | 반말·직설 | 4 |
| 모티(미스테리오) | 실크햇·눈감은 미소·차 | 오렌지주스를 차로 착각 = 허세+허당 | 느긋 | 4 |
| 아이리스(미스테리오) | 장미 장식·녹안·무표정 | "모티님 그건 오렌지 주스입니다." 1줄로 츳코미 성격 확정 | 존댓말·건조 | 4 |
| 루리(데모니코) | 망토·군모·외침 | 악당 조직인데 고양이를 쫓음 | 거친 반말 | 3 (캐릭터 얼굴이 잘려 인상 약함) |
| 꼬맹이·괴도·왕실 | 클로즈업 1컷 | 각 1줄 | — | 2~3 (의도된 '맛보기') |

### Step 5. 비주얼 연출

- **강점**
  - 검은 여백을 "무대 암전"처럼 사용 → 대사만 떠 있는 구간이 라디오 드라마 같은 리듬을 만듦(P1).
  - S4의 `대형 캡션 → 클로즈업` 3회 반복은 롤콜의 정석 리듬. 세 번째에서 "왕실까지..!"로 상승 → 롤랑의 절망 컷으로 낙차.
  - S5→S6의 **흑→백 그라데이션**은 톤 전환을 스크롤로 체감시키는 장치(코미디 → 진지한 내레이션). 매우 효과적.
  - 롤랑 클로즈업에서 **붉은 눈**을 강조 → "평소엔 게으르지만 진짜는 따로 있다"는 복선.
- **약점**
  - AI 생성 컷 특유의 캐릭터 일관성 흔들림(롤랑의 눈 색: 회색/적색 이색 vs 양쪽 회색 컷, 머리 길이·모자 장식 차이). 의도된 이색이라면 모든 컷에 통일 필요.
  - 말풍선 문법이 혼재: 대사가 사각 박스(내레이션 양식)와 타원 말풍선을 오감 → S6의 "내레이션으로의 전환" 효과가 약간 희석. **S6 전용으로만 사각 박스 사용**을 권장.
  - 일부 말풍선이 그림 위 얼굴/소품을 가림(#4는 의도된 '끊김'이지만 가독성 저하).
  - 대사 글씨가 600px 구간에서 모바일 기준 작음.

### Step 6. 플레이어 포지셔닝

- "자네도 이곳에 온 이상, 이야기를 써내려 가겠지" → 유저를 **공동 저자**로 호명. 정서적으로 강력함.
- 그러나 **유저가 누구인지(신입 탐정? 의뢰인? 새 조수? 괴도?)는 끝까지 정해지지 않음.** 마지막 컷에 '유저가 서 있는 자리'도 없음(P8 ✖).
- 결과: 첫 메시지를 쓰려는 순간 유저는 "나는 뭘 하면 되지?"에 막힘 → 첫 턴 이탈 위험.

### Step 7. 첫 턴 핸드오프 진단 & 제안

현재 엔딩은 "그럼 시작하지"(선언) + 타이틀(종결)로 끝나 **응답할 대상이 없음**. 타이틀 드롭은 시퀀스를 '닫는' 장치라 첫 턴 직전에 두면 오히려 흐름을 끊습니다.

**개선안 — 타이틀을 S6 앞으로 당기고, 마지막 컷 = 첫 메시지의 장면으로**

```
[타이틀 로고]
(넓은 여백)
"그럼 시작하지, 우리의.. 그리고 자네의."
(문이 열리는 컷 — 사무소 문, 유저 시점 POV)
마판: "...어? 손님? 아니면 설마—"
롤랑: (소파에 누운 채 한쪽 눈만 뜨며) "흠. 자네, 의뢰인인가? 아니면… 오늘부터라던 그 신입인가?"
```

**대응 첫 메시지(그린 마지막 컷과 동일한 순간)**

> *끼익— 낡은 사무소 문이 열리자, 산더미 같은 서류 사이 소파에 누워 있던 롤랑이 한쪽 눈만 떴다. 그 옆에서 빗자루를 든 마판이 굳었다.*
> **마판:** "어…? 손님이다! 롤랑, 일어나! 진짜 손님이라고!"
> **롤랑:** "흠… 그 구두에 묻은 진흙, 화이트채플 쪽이군. 자네, 의뢰를 들고 왔나? 아니면 아카데미가 보낸다던 그 신입인가?"
> *롤랑의 붉은 눈이 자네를 가만히 훑는다.*

이 첫 메시지가 유도하는 응답 3종 (P9):
1. "의뢰를 하러 왔어요. 사실…" → 의뢰인 루트
2. "오늘부터 배속된 신입입니다." → 아카데미 루트
3. "…어떻게 진흙 위치까지 알았죠?" → 롤랑의 추리력 쇼케이스 루트
- (괴도 루트를 원하면 "사실 난 괴도다"도 자연스럽게 열림)

### Step 8. 스코어카드 (A)

| 항목 | 점수 | 근거 |
|---|---|---|
| 훅 | 4 | 시공간 앵커 + "롤랑!!!" 외침. 단, 첫 화면 대부분이 배경 컷이라 감정 진입이 한 박자 늦음 |
| 세계 명확성 | 3 | 세력은 잘 보이지만 '패즐'·'아카데미'·'19th' 정의 부재 |
| 캐릭터 매력 | 5 | 핑계→컷어웨이 반전으로 6명 이상을 행동으로 증명 |
| 페이싱 | 5 | 스프린트 7개, 각 비트 명확. 그라데이션 톤 전환 탁월 |
| 비주얼 완성도 | 4 | 분위기 일관(야경·블루/오렌지). 캐릭터 일관성 일부 흔들림 |
| 톤 일관성 | 4 | 코미디→진지 전환이 의도적이고 매끄러움 |
| 플레이어 포지셔닝 | 2 | "자네"의 역할·위치 미정 |
| 첫 턴 견인력 | 2 | 선언형 엔딩 + 타이틀로 닫힘, 응답 대상 없음 |
| 제작 QA | 3 | 오탈자·폭 불일치·말풍선 문법 혼재 |

---

## 3. 레퍼런스 B — 『공무원 마법소녀』 분석

### Step 1. 재구성 & 전사

| # | 텍스트(대형 흰 글씨, 검은 배경) | 이미지 |
|---|---|---|
| 1 | 악의 조직의 첫 침공이후 / 수십년이 지난 지금 | 도시 풍경 |
| 2 | 대한민국은 26구역으로 나뉘었고, / 각 구역의 안전은 관리국 소속 / '공무원 마법소녀'가 책임지는 세상 | 26색 한반도 지도 |
| 3 | 마법소녀들은 / 지정된 구역 내의 도시를 지키며 | 전투 컷 |
| 4 | 악의 조직에 맞서 싸우고 | 전투 컷 |
| 5 | 시민을 도우며 | 시민과 함께 있는 컷 |
| 6 | 헌신하는 영웅의 삶을 / 살고 있습니다. | 영웅 포즈 |
| 7 | 하지만! / 도시를 지키는 강인한 마법소녀도 | 일상복 컷 |
| 8 | 변신을 해제하는 순간 | 게이밍 의자의 소녀 |
| 9 | 한 명의 가녀린 소녀란 사실! | 인형·붕대 소녀 |
| 10 | 당신은 이곳에서 | 손 내미는 마법소녀 |
| 11 | 마법소녀와 함께하며 / 그들과 인연을 맺고 / 함께 정의를 수호하거나 | (위 이어짐) |
| 12 | 악의 조직의 일원으로서 / 마법소녀와 적대하고 / 대한민국을 침략할 수도 있고 | 장갑 낀 손(악역) |
| 13 | 관리국의 일원이 되어 / 관리국장으로서 마법소녀를 관리하고 / 마법소녀를 돕는 사이드킥이 되어 / 평화에 이바지할 수 있습니다 | 서류를 내미는 손 |
| 14 | 지금! / 당신의 역할을 선택하세요! | (텍스트만) |

### Step 2. 구조 맵

| 스프린트 | 구간 | 목적 | 평가 |
|---|---|---|---|
| S1 역사 | #1 | "침공 수십 년 후"로 시간 앵커 | 무난하지만 감정 없음 (P3 △) |
| S2 시스템 | #2 | **'공무원 마법소녀'** — 이 세계관의 한 줄 콘셉트 | 콘셉트 자체가 강력한 훅 ✔ |
| S3 영웅의 일상 | #3~6 | 한 문장을 4컷으로 쪼개 "임무 → 전투 → 시민 → 헌신" | 트레일러식 리듬 ✔ |
| S4 반전(갭) | #7~9 | "하지만!" → 변신 해제 = 가녀린 소녀 | **이 작품의 진짜 판매 포인트**, 단 3컷으로 너무 짧음 |
| S5 역할 제시 | #10~13 | **손(hand) 모티프 3연속**: 내민 손(동료) / 장갑 낀 손(악역) / 서류 내민 손(관리국) | 시각적 은유가 매우 좋음 ✔ |
| S6 CTA | #14 | "지금! 당신의 역할을 선택하세요!" | 명시적 CTA ✔, 단 선택 '방법'이 없음 |

### Step 3~4. 정보·캐릭터

- **세계 규칙 3개**(P6 정확히 충족): ① 악의 조직 침공 ② 26구역 분할 ③ 공무원 마법소녀 제도. 매우 깔끔.
- **캐릭터는 0명이 이름을 가짐.** 마법소녀 이미지가 7~8명 나오지만 누가 메인 히로인인지, 누가 대화 상대인지 알 수 없음 → AI 캐릭터 챗인데 "대화할 얼굴"이 없음(P5 ✖).
- 갭 모에(영웅 ↔ 가녀린 소녀)를 말로 "사실!"이라고 **설명**만 하고, 실제 변신 해제 순간·약한 모습을 **장면으로 보여주지** 않음.

### Step 5. 비주얼

- 강점: 검은 바탕 + 큰 흰 고딕 = 영화 트레일러 문법. 모바일 가독성 최상. 손 모티프 3연속은 이 레퍼런스의 백미.
- 약점:
  - 컷마다 **화풍·채색·렌더링이 전부 다름**(실사풍 도시, 반실사 지도, 셀화 전투, 반두 일러스트…) → 하나의 세계라는 감각이 약함. AI 이미지 큐레이션 단계에서 스타일 고정 필요.
  - 한반도 지도는 해상도가 낮고 구역 이름이 없어 '26구역'이 정보가 아니라 장식에 그침. (구역명 3~4개만 라벨링해도 세계관 밀도 급상승: 예 "제1구역 서울중앙", "제17구역 부산항")
  - 400px 폭 — 업스케일 시 흐려짐.
  - 일부 컷(교복 소녀 2인, 붕대·인형 컷) 수위/연출이 플랫폼 연령 정책에 따라 리스크 될 수 있음 → 썸네일급 컷은 보수적으로.

### Step 6. 플레이어 포지셔닝

- "당신"을 2인칭으로 직접 호명하고, 역할을 **명시적으로 고르게 함** → P8의 'WHO'는 A보다 훨씬 명확.
- 문장 구조상 역할이 몇 개인지 모호: `함께 정의를 수호(동료)` / `악의 조직` / `관리국장` / `사이드킥` — 3개인지 4개인지 한눈에 안 들어옴. **번호/아이콘으로 분리** 필요.
- 'WHERE'(마지막 컷에서 유저가 어디 있는가)와 'WHAT'(어떻게 선택하나)이 없음.

### Step 7. 첫 턴 핸드오프

"선택하세요!"는 명령이지만 **선택 인터페이스가 웹툰 밖에 있음**. 유저는 "1번"이라고 쳐야 하는지, "악당 할래"라고 쳐야 하는지 모름.

**개선안 — 역할 선택을 첫 메시지 안의 '서류'로 디제틱하게 구현**

웹툰 마지막 컷(서류 내미는 손)을 그대로 이어받아:

> *관리국 접수창구. 형광등 아래, 피곤한 눈의 접수 담당 마법소녀가 서류 세 장을 당신 앞에 밀어놓는다. 제복 소매 아래로 반창고가 비친다.*
> **"다음 분— 아, 신규 등록이시죠? 죄송해요, 오늘 17구역에 침공이 있어서 정신이 없네요."**
> *그녀가 서류를 하나씩 톡, 톡, 톡 짚는다.*
> **"①마법소녀 협력 시민 등록, ②관리국 임용 지원서(국장 직속 / 현장 사이드킥), 그리고…"**
> *세 번째 서류는 비어 있다. 아니, 검은 잉크로 이상한 문장이 번져 있다.*
> **"…어라? 이건 누가 놓고 간 거지. ③…'악의 조직 가입 신청서'?"**
> *그녀가 당신을 올려다본다.* **"…어느 쪽 서류 작성하실 거예요?"**

- 세 가지 선택이 **세계 안의 물건(서류)** 으로 존재 → "③ 쓸게요" / "저 사실 그 세 번째 서류 주인인데요" / "17구역 침공이요?" 등 자유 응답 모두 수용.
- 첫 대화 상대(접수 마법소녀)에게 '반창고'로 갭 모에를 **행동으로** 심음(P5).

### Step 8. 스코어카드 (B)

| 항목 | 점수 | 근거 |
|---|---|---|
| 훅 | 4 | '공무원 마법소녀' 콘셉트 한 줄이 강력 |
| 세계 명확성 | 5 | 규칙 3개, 군더더기 없음 |
| 캐릭터 매력 | 2 | 이름·대사 있는 캐릭터 0명 |
| 페이싱 | 4 | 트레일러 리듬 좋음, 갭 모에 구간이 짧음 |
| 비주얼 완성도 | 2 | 화풍 불일치, 지도 저해상도 |
| 톤 일관성 | 3 | 히어로물/일상/어두운 컷이 섞여 장르 톤 흔들림 |
| 플레이어 포지셔닝 | 4 | 2인칭 호명 + 역할 명시 |
| 첫 턴 견인력 | 3 | CTA는 있으나 '어떻게'가 없음 |
| 제작 QA | 3 | 문장 띄어쓰기('침공이후'), 역할 구분 모호 |

---

## 4. 비교 종합

| 축 | A 탐정 아카데미 | B 공무원 마법소녀 | 교훈 |
|---|---|---|---|
| 서술 방식 | 캐릭터 대화형(쇼) | 내레이션 트레일러(텔) | **세계는 텔로 빠르게, 캐릭터는 쇼로 깊게** — 둘을 섞어라 |
| 세계 정보 | 동기 있는 대사(핑계)로 전달 | 캡션으로 직접 전달 | A의 '동기 있는 인포덤프'가 더 기억에 남음 |
| 캐릭터 | 6+명, 행동으로 증명 | 이름 없는 군상 | AI 챗에선 **대화 상대 1명의 얼굴**이 반드시 필요 |
| 유저 위치 | 감성적 호명(공동 저자), 역할 없음 | 명시적 역할 선택, 장면 없음 | **호명 + 역할 + 장면**이 모두 있어야 첫 턴이 나온다 |
| 엔딩 | 타이틀로 닫음 | 명령형 CTA | 마지막 컷은 **질문하는 캐릭터의 얼굴** |
| 강력한 장치 | 핑계→컷어웨이 반전, 흑백 그라데이션 톤 전환 | 손 모티프 3연속, 한 줄 콘셉트 | 아래 템플릿으로 추출 |

---

## 5. 레퍼런스에서 추출한 재사용 템플릿

### T1. "핑계 몽타주" (A에서 추출) — 세력 소개용
```
주인공: "하지만 ○○ 놈들이 있잖아!"     ← 동기 있는 정보 (핑계/걱정/자랑)
  ↓ (검은 여백 = 컷 전환 신호)
[컷어웨이] ○○ 세력의 '의외의 일상' 1컷 + 네임카드 + 반전 대사 1줄
  ↓
상대: 반박 1줄
× 2~3회 반복 → 3번째에 반전 강도 최대
```

### T2. "롤콜 트리플" (A-S4) — 서브 세력 고속 소개
```
[대형 캡션] "그 ○○들도.."  → [클로즈업 + 한 줄]
[대형 캡션] "○○들도.."      → [클로즈업 + 한 줄]
[대형 캡션] "○○까지..!"     → [클로즈업 + 한 줄]   ← 문장부호로 상승
[리액션 컷] 주인공의 절망/결의
```

### T3. "그라데이션 톤 전환" (A-S5→S6)
코미디 비트 직후 배경색을 스크롤 2~3화면에 걸쳐 흑→백(또는 반대)으로 바꾸고, 말풍선 → 사각 내레이션 박스로 문법을 바꿔 "이제 진지한 얘기"를 체감시킴.

### T4. "손 모티프 역할 제시" (B-S5)
역할 수만큼 **같은 구도·다른 손**을 반복(맨손 내밂 / 장갑 낀 손 / 서류 든 손). 텍스트 없이도 역할 차이가 읽힘. → 마지막 손은 **유저에게 직접 내미는 POV**로.

### T5. "한 줄 콘셉트 + 갭" (B-S2, S4)
`[익숙한 장르] + [의외의 제도/직업]` (마법소녀 + 공무원) → `하지만! [강함] 뒤의 [약함]`. 이 갭이 곧 유저가 개입할 정서적 빈틈(지켜주고 싶다/이용하고 싶다)이 된다.

---

## 6. 첫 턴 유도형 세계관 웹툰 — 표준 블루프린트

> 목표 분량: **25~40칸, 모바일 기준 12~20 스크롤** (프로필 페이지 체류 30~60초)
> 원칙: 세계는 빠르게(텔), 캐릭터는 깊게(쇼), 끝은 질문으로.

| # | 비트 | 칸 | 내용 | 적용 원칙 / 레퍼런스 |
|---|---|---|---|---|
| 1 | **콜드 훅** | 1~2 | 시공간 앵커 + 감정/질문 한 방 (외침, 사건, 기묘한 소품). **첫 화면 안에** 인물 얼굴 1개 이상 | P3 · A-S1 |
| 2 | **한 줄 콘셉트** | 1~2 | "이곳은 ○○가 ○○하는 세계" — 캡션 1문장 | T5 · B-S2 |
| 3 | **평상시** | 3~5 | 메인 캐릭터(=첫 대화 상대)의 일상 + 관계성 개그/갈등으로 성격 증명 | P5, P7 · A-S2 |
| 4 | **세계 브리핑** | 6~10 | 세력 2~3개를 핑계 몽타주/롤콜로. 고유 용어는 등장 즉시 1줄 정의 | T1, T2, P6 |
| 5 | **갈등 점화** | 2~3 | "그래서 지금 문제는 ○○다" — 첫 턴의 동기가 되는 사건 | P2 |
| 6 | **톤 전환** | 2~4 | 그라데이션 + 내레이션 박스로 유저 호명("당신/자네") | T3 · A-S6 |
| 7 | **역할 제시** | 2~4 | 역할 2~4개를 손 모티프/서류/문 등 **디제틱 오브젝트**로 | T4 · B-S5 |
| 8 | **타이틀 드롭** | 1 | 로고 (← 끝이 아니라 7과 9 사이에) | A 개선안 |
| 9 | **핸드오프 컷** | 1~2 | 유저 POV. 메인 캐릭터가 **유저를 바라보며 질문**하는 얼굴 클로즈업. 대사 미완 or 질문형 | P8, P9 |
| → | **첫 메시지** | — | 9번 컷과 **완전히 같은 순간**을 텍스트로 이어받음 | P9 |

### 첫 메시지 작성 규칙 (핸드오프 컷과 1:1)
1. 웹툰 마지막 컷의 장소·조명·포즈·소품을 그대로 묘사(시각→텍스트 연속성).
2. 3~6문장, 캐릭터 관점(3인칭 서술 + 대사). **유저의 행동·대사·감정을 대신 쓰지 않는다.**
3. 마지막 문장은 **유저를 향한 질문 or 응답이 필요한 행동**(서류를 내밂, 손을 내밂, 길을 막음).
4. 웹툰에서 제시한 역할 2~4개가 **자연스럽게 답이 될 수 있는 질문**으로 설계("의뢰인인가, 신입인가?").
5. 자유 응답의 여지 1개(제3의 문, 비어 있는 서류, 수상한 소리)를 남긴다.
6. 역할별 분기가 크다면 플랫폼의 시작 상황/첫 메시지 다중 설정 기능을 활용하고, 웹툰 7번 비트의 역할 아이콘과 이름을 일치시킨다.

### 제작 QA 체크리스트
- [ ] 첫 1,500px 안에 인물 얼굴 + 감정이 있는가
- [ ] 고유 용어가 처음 나올 때 정의되는가 (패즐, 19th 등)
- [ ] 이름 붙은 캐릭터 ≤ 4명, 세력 ≤ 3개(+이름 없는 맛보기)인가
- [ ] 첫 대화 상대가 웹툰에서 가장 많이 등장하는가
- [ ] 말풍선 문법(일반/외침/생각/속삭임/내레이션)이 구간 내에서 일관한가
- [ ] 동일 캐릭터의 눈색·헤어·의상·액세서리가 전 컷에서 동일한가 (AI 생성 시 캐릭터 시트 + 고정 시드/레퍼런스 이미지 사용)
- [ ] 화풍이 하나로 통일되었는가 (B의 핵심 약점)
- [ ] 출력 폭이 전 구간 동일한가 (현재 400/600/1000px 혼재)
- [ ] 360px 폭 화면에서 대사가 읽히는가
- [ ] 오탈자·띄어쓰기 검수 (현재: 벤트→멘트, 침공이후→침공 이후 등)
- [ ] 썸네일/상단 컷의 노출 수위가 플랫폼 연령 정책에 맞는가
- [ ] 마지막 컷이 질문하는 얼굴인가, 첫 메시지가 그 순간을 이어받는가

### 검증 방법 (A/B)
- 지표: 프로필 → 채팅 진입률, **첫 턴 전송률**, 첫 턴 길이(자 수), 3턴 도달률.
- 실험 1: 엔딩 = 타이틀(현행 A) vs 질문하는 얼굴(개선안).
- 실험 2: 역할 선택 = 캡션 나열(현행 B) vs 디제틱 서류(개선안).
- 실험 3: 분량 25칸 vs 40칸 — 이탈 지점 확인.

---

## 7. 결론 — 한 줄 처방

- **A 탐정 아카데미**: 연출·캐릭터는 이미 상위권. **"자네는 누구이며, 지금 어디 서 있는가"** 한 컷만 추가하고 타이틀을 앞으로 당기면 첫 턴 견인력이 2 → 4로 오를 수 있음.
- **B 공무원 마법소녀**: 콘셉트·구조는 깔끔. **이름 있는 첫 대화 상대 1명 + 화풍 통일 + 역할 선택의 디제틱화**가 필요.
- **최적 조합**: B의 '한 줄 콘셉트 + 역할 선택 구조' 위에 A의 '캐릭터 쇼 + 톤 전환 + 4th-wall 호명'을 얹고, 마지막을 **유저를 바라보며 질문하는 캐릭터 얼굴**로 끝낸다.
