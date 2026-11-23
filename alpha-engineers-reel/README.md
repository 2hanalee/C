# Alpha Engineers — "One line builds everything" (30 s showreel)

A 30-second, 120 BPM motion piece for the Alpha Engineers coding club: one white line folds into the Alpha "A",
unfolds into a robot arm (hardware), becomes the text caret of a career-explorer site (software), flips into a
pixel fighting game (game dev), and folds back into the "A" — the last frame matches the first, so it loops.

## Files

| Path | What it is |
|---|---|
| `src/*.js`, `src/template.html` | The source, one module per scene. `build.mjs` inlines them into `index.html`. |
| `index.html` | The whole film as one self-contained page: every pixel is a pure function of time in `window.seek(t)`. |
| `render.mjs` | Playwright + ffmpeg pipeline (contact sheet, spot checks, audio, final MP4). |
| `out/alpha_engineers_reel.mp4` | Final render: 1920x1080, 60 fps, 30.000 s, H.264 + AAC. |
| `out/contact_sheet.png` | One frame per beat (60 beats). |
| `out/soundtrack.wav` / `out/sfx_stem.wav` | The code-generated soundtrack, and its sound-design layer alone. |
| `music_prompt.md` | Ready-to-paste prompts for Suno / ElevenLabs Music / Udio and how to sync their output. |
| `tools/tempo_check.py` | Measures the BPM of a generated track (to about 0.1 BPM). |
| `reference/reference.mp4` | The reference reel used for craft and pacing only. |

## Commands

```bash
node render.mjs beats
```

```bash
node render.mjs strip 18 20.5 0.0833
```

```bash
node render.mjs audio
```

```bash
node render.mjs audio-sfx
```

```bash
WORKERS=4 node render.mjs video
```

The video render draws 3 subframes per frame (forward shutter) and blends them with ffmpeg `tmix` for motion blur,
then muxes `out/soundtrack.wav`. It takes about 4 minutes on 4 cores.
