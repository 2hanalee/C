#!/usr/bin/env python3
"""콘티 캔버스의 컷 메모에서 에셋 목록을 뽑는다.

사용법: python3 .claude/skills/webtoon-scene/extract_assets.py episodes/<작품>/canvas > /tmp/assets.md
출력: 에셋 이름 | 쓰이는 컷 | 칸 크기 | 내용(컷 메모) — 마크다운 표
"""
import json
import re
import sys
from pathlib import Path

src = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
order = json.loads((src / "canvas.json").read_text(encoding="utf-8"))["order"]

PH = re.compile(r'<div class="ph[^"]*"[^>]*style="([^"]*)"')
LAB = re.compile(r'<b>([A-Z]-\d+[a-z]?)</b>(.*?)</div>', re.S)
TAG = re.compile(r"<[^>]+>")

rows = {}
for f in order:
    s = (src / f).read_text(encoding="utf-8")
    for m in LAB.finditer(s):
        cut, body = m.group(1), m.group(2)
        a = re.search(r"에셋:\s*(.*)", body)
        if not a:
            continue
        before = s[: m.start()]
        ph = list(PH.finditer(before))
        size = ""
        if ph:
            st = ph[-1].group(1)
            w = re.search(r"width:\s*(\d+)px", st)
            h = re.search(r"height:\s*(\d+)px", st)
            size = f"{w.group(1) if w else 1000}×{h.group(1) if h else '?'}"
        desc = TAG.sub("", body.split("에셋:")[0]).replace("<br>", " ").strip(" ·\n")
        for name in re.split(r"[,，]", TAG.sub("", a.group(1))):
            name = re.sub(r"\(.*?\)", "", name).strip()
            if not name:
                continue
            r = rows.setdefault(name, {"cuts": [], "size": size, "desc": desc})
            r["cuts"].append(cut)

print("| 에셋 이름 | 컷 | 칸 크기 | 내용 |")
print("|---|---|---|---|")
for name, r in rows.items():
    print(f"| {name} | {', '.join(r['cuts'])} | {r['size']} | {r['desc'][:90]} |")
print(f"\n총 {len(rows)}개", file=sys.stderr)
