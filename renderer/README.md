# 렌더러

디자인 캔버스에서 만든 콘티(`*.dc.html` + `canvas.json`)를 **1000×8000 PNG**로 뽑고, 품질 규칙을 자동 검사한다.

## 준비 (최초 1회)
```bash
npm i playwright
npx playwright install chromium
```

## 사용법
```bash
# 검사만 (PNG 없이)
node renderer/render.mjs --src episodes/<작품>/canvas --check-only

# 컷 메모 포함 PNG (작업용)
node renderer/render.mjs --src episodes/<작품>/canvas --out output/<작품>

# 컷 메모 없이 완성본 PNG, 에셋 합성
node renderer/render.mjs --src episodes/<작품>/canvas --out output/<작품> --assets assets --no-notes

# 일부 장만
node renderer/render.mjs --src episodes/<작품>/canvas --only B3,B4
```

## 에셋 합성 규칙
- 각 컷 칸의 메모에 적힌 `에셋: 이름1, 이름2` 중 **파일명이 같은 첫 번째 이미지**(png/jpg/webp)를 `--assets` 폴더(하위 폴더 포함)에서 찾아 칸에 `cover`로 채운다.
- 이미지가 없으면 색면 placeholder가 그대로 남고, 검사 결과에 `미제공` 개수로 표시된다.

## 질감·장식 슬롯 (data-asset)
- 캔버스의 아무 요소에 `data-asset="파일명"`을 달면, 같은 이름의 이미지가 있을 때 그 요소의 배경으로 합성한다.
- `data-fit`: `contain`(기본) / `cover` / `100% 100%`, `data-blend`: `screen` 등(검은 배경 효과를 화면 합성).
- 이미지가 들어오면 요소에 `has-asset` 클래스가 붙고, 그 안의 `.fb`(대체 표현) 요소는 숨겨진다.
- 한글 글자는 슬롯에 굽지 않는다. 글자 없는 질감·효과·장식만 넣고 글자는 실제 폰트로 얹는다.

## 자동 검사 (knowledge/directing-rules.md 10절 필수 항목)
| 검사 | 기준 |
|---|---|
| 높이 | 내용이 8000px 안에 들어가는가 |
| 글자 크기 | 26px 이상 (컷 메모 제외) |
| 말풍선 | 3줄 이하 |
| 겹침 | 말풍선·나레이션·네임플레이트·시스템 박스끼리 겹치지 않는가 |

문제가 있으면 종료 코드 2를 반환한다.

## 캔버스 파일 받기
디자인 캔버스의 `project/` 아래 파일(`canvas.json`, `*.dc.html`)을 `episodes/<작품>/canvas/`에 그대로 둔다.
