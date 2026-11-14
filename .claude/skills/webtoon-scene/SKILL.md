---
name: webtoon-scene
description: 사용자가 글로 설명한 웹툰 장면(또는 시나리오 원안)을 AI 캐릭터 채팅 도입부용 세로 스크롤 웹툰 콘티로 만든다. 장면 해석 → 디자인 캔버스에 1000×8000 실제 크기 콘티 → 렌더링 검사 → 에셋 요청서 → 에셋 합성 PNG까지 진행한다. "/webtoon-scene", "콘티 만들어줘", "이 장면 웹툰으로", "도입부 웹툰", "에셋 합성해서 뽑아줘" 같은 요청에 쓴다.
---

# webtoon-scene

AI 캐릭터 채팅의 세계관 소개·도입부 웹툰을 한 장면씩 만든다. 이 저장소의 `CLAUDE.md` 규칙이 항상 우선한다.

## 0. 시작 전에 읽기 (한 메시지에서 병렬로)
1. `CLAUDE.md` — 역할 경계(그림을 그리지 않음), 출력 규격
2. `knowledge/directing-rules.md` — 규칙 ID. 콘티의 모든 컷 메모에 근거 ID를 적는다
3. `knowledge/reference-analysis.md` — 6비트 골격(3절), 기준작 분석(5절), 혼합형(5.3)
4. `knowledge/private/world-bible.md` — 있으면 읽는다. 세계관·인물·말투·노출 금지 사항·사용자 결정 기록
5. 작품 폴더 `episodes/<작품>/` — 이미 있는 `brief.md`, `canvas/`, `asset-request.md`

없는 파일이 있으면 무엇이 없는지 말하고, 세계관 자료가 없으면 사용자에게 요청한다.

## 1. 장면 해석 → ▶ 승인
`episodes/<작품>/brief.md`에 콘티별로 다음을 쓴다.

```
## 콘티 X — 제목 (기준작: …)
목적 / 분량(1000×8000 몇 장) / 톤
핵심 연출 아이디어 (한 문단)
| 비트 | 내용 | 주요 기법(규칙 ID) |   ← ①콜드 오픈 ~ ⑥초대·타이틀
채팅 첫 메시지 초안
등장인물과 필요 에셋(예상)
```

- 첫 문장은 **"당신은"**으로 시작한다(O-07). 콘티 안 대사는 처음부터 한국어로 쓴다.
- 대사만 쓰는 장면이면 1인칭 독백은 대사나 그림 컷으로 옮긴다.
- 원안과 설정집이 어긋나면 표로 정리해 사용자에게 묻는다. 비밀·운용 메모는 은유로만 쓴다.
- **채팅 첫 메시지**: 웹툰 마지막 대사를 바로 받고, 2~3개의 구체적 선택지를 준 뒤, **독자에게 직접 선택을 묻는 질문**으로 끝낸다.
- 여기서 멈추고 승인을 받는다.

## 2. 디자인 캔버스에 콘티 배치
- `Artifact` 도구로 `action: "quickstart"`, `intent: "design"` → Design 타입으로 캔버스를 만든다. 이미 있는 캔버스를 고칠 때는 그 URL을 쓴다.
- **한 장 = 한 아트보드 = 1000×8000.** 첫 장은 `Main.dc.html`, 나머지는 `A2.dc.html`처럼 짓는다. 콘티마다 한 줄(행)로 배치하고 행 위에 `title1` 노트, 행 오른쪽에 채팅 첫 메시지 스티키를 둔다.
- 아트보드 원본은 `template.dc.html`(이 폴더)을 복사해 쓴다. 클래스 의미:
  - `.ph` 컷 자리(색면 placeholder) + `.lab` 컷 메모: `<b>X-01</b> · 숏 · 내용 · 규칙ID<br>에셋: 이름1, 이름2`
  - `.bal`(말풍선, `tl`/`tr` 꼬리, `dk` 어두운 배경, `weak` 약한 목소리, `dot` 속삭임), `.nar`(나레이션·캡션), `.sys`(통신·시스템), `.np`(네임플레이트), `.pr`(보도자료), `.cap`(세력 캡션), `.big`/`.mt`/`.red`(타이포), `.sfx`/`.pen`(효과음)
  - `.lab`에는 반드시 `style="display: {{ld}}"`를 둔다(Tweaks의 showNotes로 메모를 끄고 완성본처럼 본다).
- **에셋 이름 규칙**: `인물_포즈·표정_숏`, `배경_장소_시간`, `소품_…`, `이펙트_…`. 같은 그림을 여러 컷에서 쓰면 같은 이름을 쓴다.
- 인물·배경을 SVG/CSS로 그리지 않는다. 전광판, 화면 UI, 서류, 현수막 같은 **그래픽은 만들어도 된다.**
- 높이 예산을 컷마다 더해 가며 한 장에 7,800px 이하로 배치한다(빈 여백은 spacer div로).

## 3. 렌더링 검사
1. 캔버스 파일을 `episodes/<작품>/canvas/`에 맞춘다(`canvas.json`과 `*.dc.html`). 캔버스에서 고쳤다면 `Artifact` `read`로 받아 온다.
2. `node renderer/render.mjs --src episodes/<작품>/canvas --check-only`
3. 높이 초과, 작은 글자, 긴 말풍선, 겹침이 나오면 고쳐서 캔버스에 다시 올리고 2를 반복한다.
4. 사용자가 보게 할 때만 PNG를 뽑는다: `--out output/<작품>` (작업용), `--no-notes` (완성본).

## 4. 에셋 요청서
1. `python3 .claude/skills/webtoon-scene/extract_assets.py episodes/<작품>/canvas` 로 표를 뽑는다.
2. `episodes/<작품>/asset-request.md`로 정리한다: 받는 방법(파일명 = 에셋 이름) → 요약표 → 인물별 표(칸 크기, 내용, **크롭으로 대체 가능한 컷**) → 배경 → 소품·UI(Claude가 만들 수 있는 것 표시) → 우선순위.
3. `SendUserFile`로 보낸다.

## 5. 에셋 합성
- 사용자가 `assets/`에 파일을 넣으면: `node renderer/render.mjs --src episodes/<작품>/canvas --assets assets --out output/<작품> --no-notes`
- 검사 결과의 `미제공` 개수와 이름을 알려 주고, 크롭 위치가 어색한 컷은 캔버스에서 칸 높이나 `background-position`을 조정한다.

## 비공개 처리
저장소가 public이면 다음은 커밋하지 않는다(.gitignore 대상): `knowledge/private/`, `episodes/*/`, `references/raw/`, `assets/` 원본, `output/`. 공개해도 되는 것은 렌더러·스킬·연출 규칙·레퍼런스 **분석**(기법만)뿐이다.
