# EMS SVG 한 줄 글꼴 → Frame Studio 펜 서명체 좌표 변환 스크립트
# 사용: python convert-stroke-fonts.py EMSAllure EMSBrush EMSCapitol EMSDecorousScript  (같은 폴더에 .svg 파일)
# 결과: stroke-fonts.json (글자 → [가로 폭, [[x, y, ...], ...]], 3차 곡선은 8등분해 꺾은선으로)
import re, json, sys, html
NUM = r'[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?'
def parse(d):
    toks = re.findall(r'[A-Za-z]|' + NUM, d)
    strokes, cmd, i, cx, cy = [], None, 0, 0.0, 0.0
    def num():
        nonlocal i; v = float(toks[i]); i += 1; return v
    while i < len(toks):
        if re.match(r'[A-Za-z]', toks[i]): cmd = toks[i]; i += 1
        if cmd in 'Mm':
            x, y = num(), num()
            if cmd == 'm': x += cx; y += cy
            strokes.append([x, y]); cx, cy = x, y; cmd = 'L' if cmd == 'M' else 'l'
        elif cmd in 'Ll':
            x, y = num(), num()
            if cmd == 'l': x += cx; y += cy
            strokes[-1] += [x, y]; cx, cy = x, y
        elif cmd in 'Cc':
            p = [num() for _ in range(6)]
            if cmd == 'c': p = [p[0] + cx, p[1] + cy, p[2] + cx, p[3] + cy, p[4] + cx, p[5] + cy]
            for k in range(1, 9):
                t = k / 8; u = 1 - t
                strokes[-1] += [u**3 * cx + 3 * u * u * t * p[0] + 3 * u * t * t * p[2] + t**3 * p[4], u**3 * cy + 3 * u * u * t * p[1] + 3 * u * t * t * p[3] + t**3 * p[5]]
            cx, cy = p[4], p[5]
        elif cmd in 'Zz': i += 0; cmd = None
        else: raise ValueError('cmd ' + str(cmd))
    return [[round(v) for v in st] for st in strokes if len(st) >= 4]
out = {}
for name in sys.argv[1:]:
    s = open(name + '.svg', encoding='utf8').read()
    meta = re.search(r'<metadata>(.*?)</metadata>', s, re.S).group(1).strip()
    xh = float(re.search(r'x-height="([\d.]+)"', s).group(1))
    dflt = float(re.search(r'<font [^>]*horiz-adv-x="([\d.]+)"', s).group(1))
    glyphs = {}
    for m in re.finditer(r'<glyph ([^>]*?)/?>', s):
        a = m.group(1); u = re.search(r'unicode="([^"]*)"', a)
        if not u: continue
        ch = html.unescape(u.group(1))
        if len(ch) != 1 or not (32 <= ord(ch) < 127): continue
        adv = float(re.search(r'horiz-adv-x="([\d.]+)"', a).group(1)) if 'horiz-adv-x' in a else dflt
        d = re.search(r' d="([^"]*)"', a)
        glyphs[ch] = [round(adv), parse(d.group(1)) if d else []]
    out[name] = {'xh': xh, 'meta': meta, 'g': glyphs}
    print(name, 'glyphs', len(glyphs), 'json', len(json.dumps(glyphs, separators=(',', ':'))))
json.dump(out, open('stroke-fonts.json', 'w'), separators=(',', ':'))
