# Frame Studio 평가·개선 마스터 프롬프트

프레임 이미지 생성 툴(단일 HTML 웹앱)을 평가하고 개선안을 도출할 때 그대로 붙여 넣어 쓰는 프롬프트입니다.
`{{ }}` 부분만 바꾸면 다음 버전(Frame Studio 13 …)에도 재사용할 수 있습니다.

## 설계 근거 (웹 조사 요약)

| 프롬프트에 반영한 요소 | 근거 |
|---|---|
| 맥락·목적·독자·출력 형식을 명시하고, 구역을 XML 태그로 분리 | Anthropic 「Best practices for prompt engineering」: 구체적이고 명시적인 요청, 제약·독자·출력 구조 명시, 태그 기반 구조화 |
| 휴리스틱 평가 + 심각도 0~4 | Nielsen 10 휴리스틱과 0~4 심각도 척도. 이슈 1건당 위반 휴리스틱·위치·심각도·수정안을 한 행으로 기록 |
| 접근성 기준 | WCAG 2.2 — 1.4.3 텍스트 대비(4.5:1, 큰 글자 3:1. 이미지 속 글자에도 적용), 1.4.11 비텍스트 대비 3:1, 2.5.8 타깃 크기 24×24 CSS px, WAI-ARIA APG 탭 패턴(방향키 이동, roving tabindex) |
| 웹 플랫폼 제약 점검 항목 | SVG→캔버스 변환 시 웹폰트 미적용, iOS Safari 캔버스 면적 한계(약 4096×4096, 기기 메모리에 따라 더 낮음), Safari에서 SVG 안의 이미지가 누락되는 사례, localStorage 약 5MB·동기식, Safari의 7일 저장소 삭제 정책과 `navigator.storage.persist()` |
| 경쟁 도구 벤치마크 | Dextrous(스프레드시트 데이터 병합, 블리드·재단선, CMYK PDF, 글꼴 임베드), nanDECK(데이터 기반 덱 생성), Card Conjurer(레이어 프레임 템플릿) |
| 우선순위화 | RICE = (Reach × Impact × Confidence) ÷ Effort. Impact 3/2/1/0.5/0.25, Confidence 100/80/50% |

출처는 문서 끝에 있습니다.

---

## 프롬프트 본문

```text
<role>
너는 웹 기반 그래픽 편집 도구를 전문으로 하는 시니어 프로덕트 리뷰어다.
프런트엔드 엔지니어링, UX 휴리스틱 평가, 웹 접근성, 타이포그래피·출력 품질을 함께 본다.
</role>

<context>
평가 대상: {{도구 이름과 버전. 예: Frame Studio 12 (단일 HTML 파일)}}
도구의 목적: 캐릭터 이미지 위에 고정 장식 프레임과 가변 텍스트·서명을 얹어 프로필 카드/배너 이미지를 만든다.
주 사용자: {{예: 캐릭터 설정 카드를 여러 장 만드는 1인 창작자. 데스크톱과 안드로이드/아이폰을 함께 사용}}
실행 환경: {{예: Claude 아티팩트 안에서 실행. 내려받은 HTML을 브라우저에서 직접 열기도 함}}
이 평가의 독자: 도구를 직접 고치는 제작자 본인. 다음에 무엇을 고칠지 결정하는 데 쓴다.
특히 알고 싶은 것: {{예: 모바일 사용성, 내보낸 이미지 품질, 대량 생성 안정성. 없으면 "전반"}}
</context>

<inputs>
{{HTML 파일 전체 또는 경로}}
(선택) {{사용자가 겪은 문제, 스크린샷, 이전 버전 평가 결과}}
</inputs>

<process>
아래 순서로 진행한다. 각 단계의 결과가 다음 단계의 근거가 된다.

1. 구조 파악
   - 파일을 끝까지 읽는다. base64 이미지·글꼴 같은 큰 덩어리는 건너뛰되, 무엇이 얼마나 들어 있는지는 기록한다.
   - 데이터 모델(템플릿 스키마, 상태, 저장 위치), 렌더링 경로(미리보기와 내보내기가 같은 경로인지), 기능 목록을 정리한다.

2. 외부 기준 조사 (웹 검색)
   - 같은 종류의 도구 3개 이상에서 이 도구에 없는 기능을 찾는다.
   - 이 도구가 쓰는 웹 기술의 알려진 제약을 찾는다: 캔버스 크기 한계, SVG→이미지 변환 시 글꼴·내장 이미지, 브라우저 저장소 한도와 삭제 정책, 파일 저장 방식.
   - WCAG 2.2에서 이 도구에 적용되는 기준을 확인한다.
   - 블로그 수치는 1차 출처(W3C, MDN, web.dev, 브라우저 버그 트래커)로 확인하고, 확인하지 못한 것은 "미확인"으로 표시한다.

3. 실측 검증
   - 코드를 읽고 의심되는 문제는 실제 브라우저(헤드리스 가능)에서 재현해 본다.
   - 최소한 다음을 측정한다: 초기 로드 오류, 입력 1회당 다시 그리는 시간(이미지 없음 / 큰 이미지 있음), 내보내기 소요 시간과 결과 크기, 미리보기와 내보낸 결과의 차이, 좁은 화면(390px) 레이아웃, 호스트 기능이 없을 때의 저장 동작.
   - 테스트하지 못한 환경(예: iOS Safari)은 그렇다고 적는다.

4. 다각도 평가 — 아래 12개 관점마다 1~5점과 근거 한두 줄
   ① 핵심 워크플로 완성도  ② 사용성(Nielsen 10 휴리스틱)  ③ 결과물 시각 품질·타이포그래피
   ④ 접근성(WCAG 2.2 AA)  ⑤ 성능  ⑥ 안정성·데이터 보존
   ⑦ 내보내기·호환성  ⑧ 확장성(템플릿·에셋·글꼴)  ⑨ 모바일
   ⑩ AI 연동의 견고함  ⑪ 보안·프라이버시  ⑫ 코드 구조·유지보수성

5. 이슈 목록
   - 이슈 1건 = 한 행. 열: ID / 관점 / 무엇이 문제인가(사용자가 겪는 현상) / 근거(파일 줄 번호 또는 측정값) / 검증 상태 / 심각도 / 수정 방향.
   - 검증 상태는 셋 중 하나: [실측] 브라우저에서 재현함, [코드] 코드로 확인했으나 실행해 보지는 않음, [추정] 조사 결과에 따른 위험.
   - 심각도는 Nielsen 0~4: 0 문제 아님, 1 외관, 2 경미, 3 중대, 4 치명(작업 불가·데이터 손실).

6. 개선안
   - 버그 수정과 별개로, 도구의 가치를 키우는 개선을 관점별로 제안한다.
   - 각 제안에 Impact(3/2/1/0.5/0.25), Confidence(100/80/50%), Effort(작업일)를 매기고 점수 = Impact × Confidence ÷ Effort로 정렬한다.
     사용량 데이터가 없으면 Reach는 생략하고 그 사실을 밝힌다.
   - "지금(1일 이내 수정) / 다음(1~2주) / 나중" 3단계 로드맵으로 묶는다.
   - 상위 5개는 구현 방법을 코드 수준으로 구체화한다(바꿀 함수, 새 데이터 구조, 주의할 부작용).
</process>

<rules>
- 잘 만든 부분도 적는다. 고칠 때 망가뜨리면 안 되는 설계를 제작자가 알아야 하기 때문이다.
- 모든 지적에는 줄 번호나 측정값을 붙인다. 근거를 댈 수 없으면 쓰지 않는다.
- 사용자 수, 전환율 같은 수치를 지어내지 않는다. 모르는 것은 모른다고 쓴다.
- 일반론("테스트를 추가하세요")으로 끝내지 않는다. 이 코드의 어느 함수에 어떤 테스트가 필요한지까지 쓴다.
- 원본 파일은 수정하지 않는다. 수정은 이 평가 뒤에 제작자가 따로 요청한다.
</rules>

<output_format>
한국어 마크다운 문서 하나.
1. 한 문단 총평 (가장 먼저 고칠 것 3가지 포함)
2. 관점별 점수표
3. 잘된 점
4. 이슈 목록 (심각도 높은 순)
5. 개선안 (점수 순) + 3단계 로드맵
6. 상위 5개 구현 스케치
7. 검증하지 못한 것과 그 이유
8. 출처
</output_format>
```

## 사용 팁

- 파일이 크면(이 도구는 약 2MB, 그중 1.9MB가 base64) 먼저 base64를 `<B64 길이>`로 치환한 사본을 만들어 읽히면 줄 번호가 원본과 같게 유지됩니다.
- 3단계 실측은 `tools/verify-frame-studio.js`(Playwright)로 다시 돌릴 수 있습니다.
- 수정 후에는 같은 프롬프트에 "이전 평가 결과"를 입력으로 넣어 회귀 여부를 함께 확인하게 하세요.

## 출처

- Anthropic, Best practices for prompt engineering — https://claude.com/blog/best-practices-for-prompt-engineering
- Heuristic evaluation template (Nielsen 0~4 심각도, 이슈 표 형식) — https://cleverx.com/blog/heuristic-evaluation-template/
- W3C, What's New in WCAG 2.2 — https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- W3C, Understanding SC 1.4.3 Contrast (Minimum) — https://w3c.github.io/wcag/understanding/contrast-minimum
- W3C WAI-ARIA APG, Tabs Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/
- web.dev, Storage for the web — https://web.dev/articles/storage-for-the-web
- Apple Developer Forums, Safari iOS PWA Data Persistence Beyond 7 Days — https://developer.apple.com/forums/thread/710157
- How SVG to PNG conversion actually works in the browser — https://dev.to/usman_basheers/how-svg-to-png-conversion-actually-works-in-the-browser-5307
- KaTeX HTML-to-image blank output (웹폰트와 SVG 변환) — https://dev.to/x_kernel27795/katex-html-to-image-outputs-a-blank-white-image-heres-why-and-how-to-fix-it-2ikd
- WebKit Bugzilla 230886 (Safari 캔버스 텍스처 크기) — https://www2.webkit.org/show_bug.cgi?id=230886
- Dextrous 소개(BGDF 포럼, 개발자 본인 글) — https://www.bgdf.com/forum/general/announcements-press-releases/dextrous-prototyping-platform
- AlternativeTo, Dextrous — https://alternativeto.net/software/dextrous/about
- AlternativeTo, nanDECK alternatives — https://alternativeto.net/software/nandeck
- Game card making software 비교 — https://worldmetrics.org/best/game-card-making-software/
- ProductPlan, RICE Scoring Model — https://productplan.com/glossary/rice-scoring-model
