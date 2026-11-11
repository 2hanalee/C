# BLACKOUT site improvement — master prompt

Think and plan in English. Write everything the owner (참치) reads in Korean.

## Goal
Raise the perceived visual quality of the site in `/home/user/C` (branch `ccr-5349d371-74kjyl`) for its real visitors: people who arrive on a phone from an AI character chat platform, want to grasp the world in under a minute, find a character, and go chat.

The owner's diagnosis to test, not assume:
1. The site reads as unfinished because it is close to monochrome.
2. Most assets are thin vector line art, which looks low quality.
3. The design avoided some conventions that successful sites in this genre rely on.

## Fixed constraints
- Keep: page structure and navigation, all data files and their public / 내부용 / 기밀 levels, the gate sequence (character quote, redaction, blackout, logo), the BLACKOUT wordmark, the academy insignia, the seven seat symbols in their original three colors, the palette roles in `assets/css/site.css`.
- Do not hard-code any chat platform. Do not invent lore; `assets/js/*.js` data is the canon for the site.
- You cannot generate raster illustrations. Where a picture is the real fix, design the slot and write or update the prompt in `docs/image-prompts.md` instead.
- Static HTML/CSS/JS only, no framework, no build step.
- Commit in small, separately revertible commits. Push only to the designated branch. No pull request.

## Token discipline
- Read files by section with grep and line ranges; never re-read a file you just edited.
- At most 6 web searches in total, each tied to a specific open question. Prefer primary sources.
- One screenshot pass per phase at 390px and 1440px; no repeated looks at an unchanged page.
- No subagents. No planning documents beyond the brief described below.
- Batch related edits into one script or one commit.

## Phases
For each phase, first write a brief of at most six lines in your working notes (objective, inputs, method, done-when), then execute it. Do not write long per-phase prompts.

1. **Baseline.** Capture all five pages at both widths. Note load weight and anything broken. This is the "before" set.
2. **Analysis.** Start with the owner's added reference, https://inferno-dusky.vercel.app/ (allowed in this environment): open it in the browser at both widths, go past any entry screen, and record what it does for first impression, color, imagery, type, and character pages that this site does not. Image hosts it uses may be blocked; say so if pictures fail to load. Inspect the seat symbols, wordmark, insignia, type scale, color use, spacing rhythm, and image slots as they actually render. Search for what current character-world and game promotional sites do above the fold and on character pages. Separate genre conventions that serve visitors from clichés.
3. **Evaluation.** Score each page on two axes, asset design and visitor experience, from the visitor's seat on a phone. For each finding record: evidence, who it hurts, fix, cost, and whether it needs the owner's approval.
4. **Prioritize.** Pick the fixes with the best effect for the least risk. Anything that replaces an approved decision, removes content, or changes the overall look beyond refinement goes on a proposal list and is not applied.
5. **Improve.** Apply the chosen fixes: asset treatment (stroke weight, fills, scale, texture, depth), typography, color balance, hierarchy, the first screen, the character card and detail page. Re-capture and compare with the baseline; revert anything that is not clearly better.
6. **Report in Korean.** What changed with before and after, what was verified and how, what was not done and why, and the proposal list awaiting approval. Republish the existing artifacts so the links stay the same.

## Done when
Both widths render without overflow or console errors, every change is committed and pushed, and the report states plainly which of the three diagnoses held up.
