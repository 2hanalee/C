# 점검 도구

사이트를 고친 뒤 돌리는 Playwright 점검 묶음입니다. 사이트에 들어가는 파일이 아닙니다.

준비: 저장소 맨 위에서 `python3 -m http.server 8765`로 사이트를 띄웁니다. 사진 칸 점검에는 `python3 tools/qa/make-test-images.py`로 시험 그림을 먼저 만듭니다. 접근성 점검에는 `tools/qa` 안에서 `npm i axe-core`가 필요합니다.

| 명령 | 하는 일 |
| --- | --- |
| `node tools/qa/qa.js tools/qa/qa-ext-all.js` | 인물 49인, 문서 10건, 장소 11곳, 링크, 기밀 흐름, 입장 연출, 가로 넘침, 용어 판, 시대 막대, 사진 칸 |
| `node tools/qa/audit.js` | 접근성(axe), 누르는 곳 높이, 제목 구조, 화면별 용량, 안 쓰는 CSS. 결과는 `audit.json` |
| `node tools/qa/qa-vt.js` | 메뉴로 페이지를 옮길 때의 전환 방향, 움직임 줄이기에서 전환이 꺼지는지 |
| `node tools/qa/qa-swap.js` | 목록과 상세 사이의 기록 넘김, ←/→ 키, 열람함 도장 |
| `node tools/qa/qa-extra.js` | 최근 열람한 기록, 읽기 진행선, 미리 불러오기 규칙 |
| `node tools/qa/qa-music.js` | 음악 플레이어. 시험용 wav 3개가 `tools/qa/testaudio/`에 있어야 합니다 |
| `node tools/qa/intro-test.js` | 입장 연출이 단추까지 8초 안에 끝나는지 |
| `node tools/qa/shot.js 주소 폭 높이 출력.png` | 화면 한 장 찍기 |
| `python3 tools/qa/build-pub.py 출력폴더` | 미리보기 아티팩트용 페이지 만들기 |

인물이나 문서, 장소 수가 바뀌면 `qa.js`의 기대 숫자를 함께 고칩니다.
