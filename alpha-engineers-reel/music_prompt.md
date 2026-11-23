# Alpha Engineers 30초 릴 — 외부 AI 음악 생성 프롬프트

영상(`out/alpha_engineers_reel.mp4`)에는 코드로 만든 사운드트랙이 이미 들어 있습니다. 이 문서는 같은 영상에 **다른 AI(Suno, ElevenLabs Music, Udio)로 만든 음악**을 쓰고 싶을 때 바로 붙여 넣을 수 있는 프롬프트와, 생성한 음악을 영상 박자에 맞추는 방법을 정리한 것입니다.

프롬프트 본문은 영어로 썼습니다. 세 서비스 모두 영어 프롬프트를 가장 안정적으로 따릅니다.

---

## 1. 기준 비트맵 (영상과 정확히 일치)

- **120 BPM, 4/4, A minor**
- 1비트 = 0.5초, 1마디 = 2초, **15마디 = 60비트 = 정확히 30.000초**
- 마디별 코드: `| Am | Am | F | G | Am | Em | C | G | Am | F | Am | F | G | Am | Am |`
- 첫 프레임과 마지막 프레임이 같은 루프 영상이므로, 음악도 **페이드아웃 없이 30.0초에 끝나야** 처음으로 자연스럽게 이어집니다.

| 마디 | 시간(초) | 화면 | 음악이 해야 할 일 |
|---|---|---|---|
| 1 | 0–2 | 흰 선이 A로 접히고 ALPHA ENGINEERS가 생김 | 킥과 서브 베이스만, 필터가 천천히 열리는 신스 |
| 2 | 2–4 | 2.0/2.25/2.5초에 주황·파랑·라임 화면이 바뀜, 2.75초 큰 A, 3.0초부터 A가 로봇 팔 골격으로 펼쳐짐 | 2.0·2.25·2.5초 짧은 코드 스탭 3번, 2.75초 임팩트, 3–4초 기계식 래칫, 끝에 상승 스윕 |
| 3–6 | 4–12 | **하드웨어**: 청사진이 3D 로봇 팔로, 8.0초에 팔이 셋으로 분열, 10.5초에 커서를 집음, 11–12초 카메라가 커서로 돌진 | 4.0초 히트, 금속성 퍼커션, 오프비트 쏘우 베이스, 서보 같은 스윕, 11–12초 라이저 |
| 7–10 | 12–20 | **소프트웨어**: 커서가 검색창이 되고 12.5–13.4초 타이핑, 13.5초 창이 열림, 14.0/14.5/15.0초 카드 착지, 18.0초 클릭, 19.0–19.5초 카드가 뒤집힘 | 12.0초 히트, 가벼운 16분 하이햇(키보드 클릭 느낌), 플럭 베이스, 밝은 아르페지오, 19.5–20초 8비트 상승음 |
| 11–14 | 20–28 | **게임**: 20.0초 픽셀 화면, 21–23초 타격 교환, 25.0초 공중 충돌, **26.0초 K.O.**, 26.5초 "K.", 27.0초 "O." | 칩튠 스퀘어 베이스와 아르페지오, 24–26초 라이저와 스네어 롤, **26.0초에 곡 전체에서 가장 큰 임팩트**, 26.5·27.0초 짧은 히트 |
| 15 | 28–30 | **엔딩**: ALPHA ENGINEERS, 28.25 "Build." 28.5 "Code." 28.75 "Play." | 28.0초 풀 코드, 28.25·28.5·28.75초 짧은 스탭 3번, 30.0초에 깔끔하게 끝 |

**정확히 맞아야 하는 히트 포인트(초):** 0.0, 2.0, 2.25, 2.5, 2.75, 4.0, 8.0, 10.5, 12.0, 13.5, 18.0, 19.0, 20.0, 25.0, **26.0**, 26.5, 27.0, 28.0, 28.25, 28.5, 28.75

---

## 2. 공통 브리프 (어느 서비스든 이 내용을 유지)

```
30-second instrumental, no vocals, 120 BPM, 4/4, A minor.
Clean, modern electronic with a tech / engineering feel.
Punchy kick on every beat, crisp off-beat hats, tight sub bass, short plucky synth stabs.
Dry, punchy mix with short reverb. No vocals, no lyrics, no long reverb tails, no fade-out.
Ends on a hard final hit at exactly 30.0 seconds so the video can loop.
```

---

## 3. Suno

**Style of Music** 칸:

```
instrumental, no vocals, electronic, tech house with chiptune accents, 120 BPM, 4/4, A minor, punchy four-on-the-floor kick, tight sub bass, off-beat saw bass, crisp off-beat hats, metallic percussion, servo-like synth sweeps, clean plucked digital arpeggios, 8-bit square-wave lead, big impact hits, short reverb, dry punchy mix, hard ending
```

**Exclude styles** 칸(있는 경우):

```
vocals, choir, singing, spoken word, lo-fi, long reverb, fade out, ambient
```

**Lyrics** 칸에는 가사 없이 구조 태그만 넣고, **Instrumental 스위치를 켭니다**:

```
[Intro: sparse kick, sub bass, filtered synth slowly opening]
[Stabs: three short chord hits, then one impact]
[Instrumental: mechanical, metallic percussion, servo sweeps, off-beat saw bass]
[Build: noise riser, one bar]
[Drop: clean digital, keyboard-click hats, bright plucked arpeggio]
[Break: one bar, rising 8-bit sweep]
[Drop: chiptune, square-wave bass, 8-bit arpeggios]
[Build: snare roll riser]
[Impact: biggest hit of the track, sub drop]
[Outro: full chord stab, three short hits, hard stop]
[End]
```

- 스타일, BPM, 악기는 Style 칸에, 구조는 Lyrics 칸에 나눠 넣는 것이 권장 방식입니다.
- Suno는 길이를 정확히 지키지 않습니다. V5.5의 Duration 슬라이더를 소개하는 커뮤니티 가이드가 있지만 공식 문서로 확인하지는 못했습니다. 보통은 더 길게 생성된 곡에서 가장 맞는 30초 구간을 골라 아래 5절 방법으로 자릅니다.

---

## 4. ElevenLabs Music

### 웹 화면용 프롬프트 (길이를 30초로 설정)

```
A 30-second instrumental for a motion-design showreel about a high-school coding club. 120 BPM, 4/4, A minor. Clean, modern electronic with a tech / engineering feel: a punchy kick on every beat, tight sub bass, crisp off-beat hats, short plucky synth stabs. No vocals, no lyrics, no long reverb tails, no fade-out.
0-4 s: sparse kick and sub bass under a filtered synth that slowly opens; three short chord stabs at 2.0, 2.25 and 2.5 seconds, then an impact at 2.75 seconds.
4-12 s: mechanical and metallic: metal percussion, servo-like synth sweeps, off-beat saw bass; a noise riser from 11 to 12 seconds.
12-20 s: lighter and cleaner: 16th-note hats like keyboard clicks, plucked bass, a bright arpeggio; a rising 8-bit sweep from 19.5 to 20 seconds.
20-28 s: 8-bit chiptune: square-wave bass and arpeggios; a riser and snare roll from 24 to 26 seconds; the biggest impact of the track at exactly 26 seconds, then two short hits at 26.5 and 27 seconds.
28-30 s: a full chord stab, three short hits at 28.25, 28.5 and 28.75 seconds, and a clean hard ending at exactly 30 seconds so the track can loop.
```

ElevenLabs 문서에 따르면 BPM과 조성을 명시하면 템포와 화성 제어가 좋아지고, 곡의 흐름(조용히 시작 → 빌드 → 드롭)을 문장으로 설명하는 방식이 잘 맞습니다.

### API를 쓰는 경우: 구간별 길이를 고정하는 composition plan (예시)

현재 문서 기준으로 `music_v2` 계열 모델은 plan을 `chunks` 목록(각각 `text`, `duration_ms`, `positive_styles`, `negative_styles`)으로 받고, 작곡 시 `respect_sections_durations: true`를 주면 각 구간 길이를 정확히 지킵니다. 이전 `music_v1` 스키마는 `sections` 구조라 필드 이름이 다르니 **사용 직전에 API 레퍼런스에서 필드 이름을 확인하세요.**

```json
{
  "chunks": [
    { "text": "", "duration_ms": 4000,
      "positive_styles": ["120 BPM", "A minor", "sparse kick", "sub bass", "filtered synth opening", "three short chord stabs", "impact hit"],
      "negative_styles": ["vocals", "long reverb", "fade in"] },
    { "text": "", "duration_ms": 8000,
      "positive_styles": ["four-on-the-floor kick", "metallic percussion", "servo-like synth sweeps", "off-beat saw bass", "noise riser at the end"],
      "negative_styles": ["vocals"] },
    { "text": "", "duration_ms": 8000,
      "positive_styles": ["clean digital", "keyboard-click 16th hats", "plucked bass", "bright plucked arpeggio", "rising 8-bit sweep at the end"],
      "negative_styles": ["vocals", "distortion"] },
    { "text": "", "duration_ms": 6000,
      "positive_styles": ["chiptune", "square-wave bass", "8-bit arpeggios", "riser", "snare roll building"],
      "negative_styles": ["vocals"] },
    { "text": "", "duration_ms": 2000,
      "positive_styles": ["biggest impact hit", "sub drop", "two short 8-bit hits"],
      "negative_styles": ["vocals"] },
    { "text": "", "duration_ms": 2000,
      "positive_styles": ["full chord stab", "three short stabs", "hard stop ending"],
      "negative_styles": ["vocals", "fade out", "reverb tail"] }
  ]
}
```

---

## 5. Udio

**Prompt** 칸 (세션 연주자에게 주는 제작 브리프처럼):

```
Instrumental tech-house track with chiptune accents, 120 BPM, A minor, for a 30-second motion-graphics showreel. Punchy four-on-the-floor kick, tight sub bass, crisp off-beat hats. Opens sparse with a filtering synth and three short chord stabs, moves into a mechanical section with metallic percussion and servo-like synth sweeps, then a clean digital section with plucked arpeggios and keyboard-click hats, then an 8-bit chiptune section with square-wave bass and arpeggios that builds through a snare roll into one huge impact, and ends on a full chord stab with a hard stop. Dry, punchy mix, short reverb, no vocals, no fade-out.
```

**Lyrics** 칸: `[Instrumental]` 로 두고 Instrumental 옵션을 켭니다.

---

## 6. 생성한 음악을 영상 박자에 맞추는 법

외부 생성기는 BPM과 길이를 정확히 지킨다는 보장이 없습니다. 그래서 다음 순서로 맞춥니다.

1. **같은 BPM·조성으로 3–5개를 생성**하고, 위 비트맵과 구조가 가장 비슷한 것을 고릅니다.
2. **템포를 확인**합니다. DAW를 써도 되고, 이 폴더의 `tools/tempo_check.py`로 0.1 BPM 단위까지 확인할 수 있습니다(ffmpeg와 numpy 필요, 이 사운드트랙으로 시험했을 때 120.0 BPM으로 측정됨).
3. **템포를 120으로 맞춥니다.** 예를 들어 118.5 BPM이면 `120 / 118.5 = 1.01266` 배로 늘립니다(음정은 유지됨).
4. **첫 다운비트를 0.000초에 두고 정확히 30.000초로 자릅니다.** 끝의 20ms만 클릭 방지용으로 처리합니다.
5. **정확해야 하는 히트는 코드로 만든 효과음 스템을 겹칩니다.** `node render.mjs audio-sfx`를 실행하면 `out/sfx_stem.wav`가 만들어집니다. 타격음, 클릭, 서보음, 스윕만 들어 있고, 원래 사운드트랙과 같은 레벨 기준으로 정규화되어 있습니다.
6. 원래 코드 사운드트랙(`out/soundtrack.wav`)은 기본값이자 대체 음원으로 그대로 둡니다.

```bash
python3 tools/tempo_check.py ai_music.wav
```

```bash
ffmpeg -i ai_music.wav -af "atempo=1.01266" music_120.wav
```

```bash
ffmpeg -i music_120.wav -af "atrim=start=0.42:duration=30,asetpts=PTS-STARTPTS,apad=whole_dur=30,afade=t=out:st=29.98:d=0.02" music_30s.wav
```

`start=0.42`는 예시입니다. 실제 곡의 첫 다운비트 위치로 바꾸세요. 원곡이 짧아도 `apad`가 무음을 채워 결과는 항상 정확히 30.000초가 됩니다.

```bash
ffmpeg -i out/alpha_engineers_reel.mp4 -i music_30s.wav -i out/sfx_stem.wav -filter_complex "[1:a][2:a]amix=inputs=2:normalize=0,alimiter=limit=0.94[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 320k -t 30 reel_ai_music.mp4
```

---

## 참고한 자료

- ElevenLabs, [Music best practices](https://elevenlabs.io/docs/overview/capabilities/music/best-practices)
- ElevenLabs, [Composition plans](https://elevenlabs.io/docs/eleven-api/guides/how-to/music/composition-plans) / [Create composition plan](https://elevenlabs.io/docs/api-reference/music/create-composition-plan.md)
- fal.ai, [Eleven Music prompt guide](https://fal.ai/learn/biz/eleven-music-prompt-guide)
- [Suno Guide: Tags, Meta Tags & Prompts (V5.5)](https://www.blakecrosley.com/guides/suno)
- [Suno field guide (GitHub)](https://github.com/mttkllr/suno-field-guide)
- [Suno AI prompts that actually work in v5.5 (2026)](https://roo.beehiiv.com/p/suno-ai-prompts-that-actually-work-in-v5-5-2026)
- Jack Righteous, [Suno V5.5 Duration slider guide](https://jackrighteous.com/blogs/guides-using-suno-ai-music-creation/suno-duration-slider-control-song-length-in-v5-5) (커뮤니티 가이드, 공식 확인 안 됨)
- Jack Righteous, [AI Music Prompt Engineering Guide](https://jackrighteous.com/de/pages/ai-music-prompts-guide)
