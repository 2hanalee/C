# 05. 라에온 사이트 데이터 명세

정적 사이트다. 데이터는 `raeon/assets/js/data/*.js`에 둔다. 각 파일은 `window.RAEON = window.RAEON || {};` 다음에 `window.RAEON.<키> = [...]` 하나를 정의한다. 빌드 도구는 없다.

## 공통 규칙
- 원천: `raeon/docs/source/setting-v2-world.md`, `setting-v2-characters.md`, `cards.json`. 지역과 장소는 카드가 설정보다 앞선다.
- 문자열은 원문 그대로 옮긴다. 새로 쓰는 문장은 `draft: true`를 단다(마물 한 줄은 전부 초안).
- id는 영문 소문자와 하이픈. 한 번 정하면 바꾸지 않는다.
- 공개 등급: 항목에 비밀 칸이 있으면 `{ text, level, unlock }`.
  - `level: "spoiler"` + `unlock: { story: 1, at: "ch8" }` 또는 `{ story: 2, at: "found" }` 또는 `"warn"`(경고 후 열람)
  - `level: "sealed"`: 존재만 보이고 내용은 열 수 없음(내용 문자열은 비워 둔다)
- 스토리 1의 지점 id: `start, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8`. 스토리 2: `muster, descent, snowfield, found, branch`.

## 지역 id
laeon, berham, silvanir, mortizen, sartion, astra, nocturna, seilia, watch-isle, shizunuma, whisper-isles, itzaka, great-sea, demon-realm, funda, erata, aeris

## 파일과 칸

### regions.js → `RAEON.regions`
`{ id, name, title, theme, rule, land, people, hub, edge, danger, characters: [인물 id], monsters: [마물 id], monsterNote, stories: [{story, at}], card: "assets/img/regions/x.webp" | null, cardGrade, cardDesc, places: [장소 id], map: { x, y } }`
- `title`은 "인간 제국 라에온"처럼 지명+고유명. `map`은 지도 그림(`assets/img/map/raeon-map.webp`) 위의 퍼센트 좌표.

### places.js → `RAEON.places`
카드 35장. `{ id, no, name, region, grade, desc, source, image: "assets/img/places/place-NN.webp" }`. `region`은 지역 id.

### routes.js → `RAEON.routes`, `RAEON.noMansLand`, `RAEON.specialPlaces`, `RAEON.races`, `RAEON.orgs`
설정집 3장의 표를 그대로 옮긴다. 지역 이름은 가능하면 지역 id로도 연결한다(`links: [id]`).

### characters.js → `RAEON.characters`
`{ id, name, epithet, race, age, grade: { kind: "job"|"monster"|"none", label }, region, group: "core"|"party"|"demon"|"local"|"guild"|"none", looks, nature, speech, lines: [], gesture, heroDistance, appears, relations: [{ to, note }], romance: true|false, secrets: [{ text, level, unlock }] }`
- `grade.label` 예: "기사 1급", "B", "미등록(왕녀)".
- `relations.to`는 인물 id가 있으면 id, 없으면 원문 대상("죽은 여제").

### monsters.js → `RAEON.monsters`
`{ id, name, en, grade, book: "101"|"romance"|"rift", no, family, regions: [지역 id], line, named: [인물 id], check: "" , draft: true, level? }`
- `family`: beast, kin(서서 다니는 아인), undead, blood(노크투르나 혈족), dragon-sea, construct(정령과 구조물), demon, rift.
- `no`: 총해록 항 번호 1~101(book이 "101"일 때만). 등급 낮은 순, 같은 등급은 처음 나오는 지역 순.
- `line`: 문체 규칙은 `04-bestiary-style.md` + 아래 분량 규칙.
- 마왕화 루시아나는 `level: "spoiler", unlock: { story: 1, at: "ch8" }`, 《회한》도 같은 조건.

### world.js, stories.js, terms.js, secrets.js, books.js
- `RAEON.world`: 2장의 단원 배열 `{ id, title, body: [문단], table? }`.
- `RAEON.stories`: `{ id: 1|2, title, logline, intro, cast: [인물 id], points: [{ id, title, region, summary, draft: true }] }`. 장 소개(summary)는 스포일러 없이 2~3문장 초안.
- `RAEON.terms`: `{ term, def, level? }`.
- `RAEON.secrets`: 9장 표 + 큰 비밀 문단. `{ id, title, owners: [id], level, unlock, text }`.
- `RAEON.books`: 서고의 책 세 권과 균열 문헌.

## 마물 한 줄 분량(11월 25일 결정)
- 최소: 미노타우르스 예시 정도(2문장, 약 55자).
- 최대: 《회한》 예시 정도(약 150자).
- 04 문서의 단계표 견본보다 1.5~2배 길게 쓴다. 단계가 높을수록 길다.
