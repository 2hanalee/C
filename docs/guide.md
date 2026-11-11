# 사이트 채우는 법

그림과 링크만 넣으면 완성되도록 만들어 두었습니다. 고칠 파일은 전부 `assets/` 안에 있습니다.

## 인물 그림 넣기

1. 글자와 테두리가 없는 16:9 그림을 `assets/img/characters/` 에 넣습니다. 파일 이름은 인물 id 와 같게 합니다(예: `jeong-haeun.webp`). id 는 `assets/js/characters.js` 의 `"id"` 값입니다.
2. 같은 파일에서 그 인물의 항목을 찾아 세 줄을 채웁니다.

```js
"color": "#e2334f",                                   // 서명 색. 등수와 능력명이 이 색으로 바뀝니다
"image": "assets/img/characters/jeong-haeun.webp",    // 기본 그림
"quote": "프로필 카드의 한 줄 대사"
```

3. 표정 그림이 있으면 `"emotes"` 를 더합니다. 있는 표정만 적으면 그 단추만 켜집니다.

```js
"emotes": { "기쁨": "assets/img/characters/jeong-haeun-joy.webp", "분노": "..." }
```

그림이 없는 인물은 활동명을 새긴 자리 표시가 대신 나옵니다. 칠좌는 기호가 나옵니다.

## 메인 표지 그림 바꾸기

`assets/img/hero/reina-cover.webp` 를 같은 이름의 새 그림으로 덮어씁니다. 가로로 긴 그림이면 되고, 얼굴이나 주제가 오른쪽 위에 오면 가장 잘 맞습니다. 표지 오른쪽 위의 인물 표시는 `index.html` 의 `cover-credit` 줄에서 고치거나 지웁니다.

## 대화 링크

`assets/js/config.js` 한 곳에서만 관리합니다. 여러 플랫폼을 적으면 단추가 여러 개 생깁니다. 비워 두면 메인에는 "준비 중"이 뜨고 인물 화면에서는 단추가 숨겨집니다.

```js
window.SITE = { chat: [ { name: "플랫폼 이름", url: "https://..." } ] };
```

## 입장 대사

`assets/js/quotes.js` 에 줄을 더하거나 고칩니다. 대사는 한 줄이나 두 줄입니다.

## 웹툰

`assets/js/webtoon.js` 에 제목, 표지, 회차를 적고 `sample` 을 `false` 로 바꿉니다. `cuts` 에 컷 그림 경로를 위에서 아래 순서로 적습니다.

## 열람 등급

인물은 `characters.js` 의 `internal`(내부용)과 `secret`(기밀), 세계관은 `world.js`, 연표와 지도는 `timeline.js` 에 있습니다. 기준은 `characters.js` 맨 위에 적혀 있습니다. 한 사실은 모든 파일에서 같은 등급이어야 합니다.

## 등수 변동

`characters.js` 의 `"move"` 값입니다. 양수는 상승, 음수는 하락, 0 은 표시 없음입니다. 지금 값은 임시입니다.

## 지도

`timeline.js` 의 `PLACES` 에서 장소마다 `x`, `y` 를 0 부터 100 사이 숫자로 고칩니다.
