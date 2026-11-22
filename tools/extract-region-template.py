"""지명 카드 템플릿 에셋 추출 스크립트 (Frame Studio 18)
사용: python extract-region-template.py <작업 폴더>   (작업 폴더/src/castle.png = 사용자가 준 마왕성 카드 1534x1024)
결과: 작업 폴더/assets/ 에 rgnPanel.webp(.png), rgnTR.png, rgnBR.png, rgnEdgeT/B/R.png
필요: pip install pillow numpy opencv-python-headless
"""
"""마왕성 카드(1534x1024)에서 지명 템플릿 에셋을 뽑는다.
rgnPanel : 왼쪽 패널(고정 장식·고정 글자 포함), 가변 글자는 지우고 주변으로 메움, 오른쪽 끝은 투명하게 사라짐
rgnTR/BR : 왼쪽 위·아래 모서리 장식을 금색만 분리해 좌우로 뒤집은 것
rgnEdgeT/B/R : 위·아래·오른쪽 테두리 이중선(여러 열/행의 중앙값으로 고른 선) — slice9로 늘려 쓴다"""
import sys, numpy as np, cv2
from PIL import Image
S = sys.argv[1]
src = np.asarray(Image.open(S + '/src/castle.png').convert('RGB')).astype(np.float32)
H, W = src.shape[:2]
lum = src.max(axis=2)
BG = np.array([12., 12., 13.])

def key(rgb):
    """검은 배경 위 금색 → RGBA (밝기로 투명도, 배경을 빼서 색을 되살림)"""
    L = rgb.max(axis=2)
    a = np.clip((L - 24) / 150, 0, 1) ** 0.85
    col = np.where(a[..., None] > 0.02, (rgb - BG * (1 - a[..., None])) / np.maximum(a[..., None], 0.02), 0)
    return np.dstack([np.clip(col, 0, 255), a * 255]).astype(np.uint8)

out = {}
# 모서리: 왼쪽 위(0..90) · 왼쪽 아래(x 0..75, y 936..1024) → 좌우 반전
tl = key(src[0:90, 0:90])
bl_src = src[936:1024, 0:75].copy()
bl_src[980 - 936:996 - 936, 55:] = BG          # 왼쪽 패널 아래 가로선 조각은 지운다
bl = key(bl_src)
out['rgnTR'] = tl[:, ::-1]; out['rgnBR'] = bl[:, ::-1]
# 테두리 선: 중앙값 프로필
top = np.median(src[0:30, 120:600], axis=1)            # (30,3)
bot = np.median(src[994:1024, 120:600], axis=1)
left = np.median(src[120:880, 0:24], axis=0)            # (24,3)
out['rgnEdgeT'] = key(np.repeat(top[:, None, :], 8, axis=1))
out['rgnEdgeB'] = key(np.repeat(bot[:, None, :], 8, axis=1))
out['rgnEdgeR'] = key(np.repeat(left[None, ::-1, :], 8, axis=0))

# 왼쪽 패널
PW, OPAQ = 790, 646
panel = src[:, 0:PW].copy().astype(np.uint8)
mask = np.zeros((H, PW), np.uint8)
# 가변 글자 영역(그림자 테두리까지)을 사각형째 지운다. 고정 장식과 겹치지 않는 범위로 잡았다
boxes = {'name': (56, 236, 606, 360), 'grade': (444, 418, 532, 508), 'desc': (70, 642, 566, 868), 'cite': (96, 916, 554, 968)}
for k, (x0, y0, x1, y1) in boxes.items():
    mask[y0:y1, x0:x1] = 1
# 1) 낮은 주파수: 크게 흐린 배경을 바탕으로 사각형을 메운다
dark = np.minimum(panel, 34).astype(np.uint8)   # 밝은 장식·글자가 번져 들지 않게 눌러 둔 뒤 흐린다
low = cv2.inpaint(cv2.GaussianBlur(dark, (0, 0), 6), mask * 255, 15, cv2.INPAINT_TELEA).astype(np.float32)
# 2) 결(높은 주파수): 글자가 없는 패널 영역에서 떼어 와 이어 붙인다
patch = src[612:640, 250:600].astype(np.float32)
grain = patch - cv2.GaussianBlur(patch, (0, 0), 6)
gy, gx = grain.shape[:2]
filled = panel.astype(np.float32)
ys, xs = np.where(mask > 0)
filled[ys, xs] = low[ys, xs] + grain[(ys * 7) % gy, (xs * 3 + ys) % gx]
# 경계를 부드럽게
soft = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 1.5)[..., None]
panel = np.clip(filled * soft + panel.astype(np.float32) * (1 - soft), 0, 255).astype(np.uint8)
# 그림으로 넘어가는 오른쪽 끝. 안쪽 상자(y 380~) 옆은 상자 테두리(x≈630) 뒤부터, 그 위쪽은 원본에서도 그림이 비치므로 x 560부터 사라지게 한다
bgcol = np.zeros((H, 3))
for y in range(H):
    xs0, xs1 = (470, 540) if y < 376 else (560, 612)
    row = src[y, xs0:xs1]; d = row[row.max(axis=1) < 40]
    bgcol[y] = np.median(d, axis=0) if len(d) else BG
bgcol = cv2.GaussianBlur(bgcol.astype(np.float32)[:, None, :], (1, 31), 0)[:, 0, :]
rng0 = np.random.default_rng(3)
# 안쪽 상자 오른쪽 테두리 둘레(x 596~636)에 비친 그림색(보라·빨강)을 배경색으로 바꾼다. 금색 선은 남긴다
reg = src[380:1000, 596:636]
R, G, B = reg[..., 0], reg[..., 1], reg[..., 2]
gold = (R - B > 28) & (R >= G) & (G > 0.55 * R) & (G - B > 12) & (reg.max(axis=2) > 55)
bleed = (~gold) & (reg.max(axis=2) > 24)
yy, xx = np.where(bleed)
panel[380 + yy, 596 + xx] = np.clip(bgcol[380 + yy] + rng0.normal(0, 1.2, (len(yy), 3)), 0, 255).astype(np.uint8)
def zone(y):
    """(배경색으로 메우기 시작, 투명해지기 시작, 사라지는 폭) — 상자 위쪽과 상자 옆을 y 366~386에서 부드럽게 잇는다"""
    t = np.clip((y - 366) / 20, 0, 1)
    return 560 + (636 - 560) * t, 600 + (644 - 600) * t, 130 + (120 - 130) * t
alpha = np.ones((H, PW), np.float32)
rng = np.random.default_rng(7)
for y in range(H):
    f0, a0, fw = zone(y); fi = int(f0)
    xs = np.arange(fi, PW)
    t = np.clip((xs - a0) / fw, 0, 1)
    alpha[y, fi:] = 1 - t * t * (3 - 2 * t)
    panel[y, fi:] = np.clip(bgcol[y] + rng.normal(0, 1.2, (len(xs), 3)), 0, 255).astype(np.uint8)
out['rgnPanel'] = np.dstack([panel, (alpha * 255).astype(np.uint8)])
Image.fromarray(mask * 255).save(S + '/assets/_mask.png')
for k, v in out.items():
    im = Image.fromarray(v, 'RGBA')
    if k == 'rgnPanel':
        im.save(S + '/assets/' + k + '.webp', 'WEBP', quality=90, alpha_quality=100, method=6)
        im.save(S + '/assets/' + k + '.png')
    else:
        im.save(S + '/assets/' + k + '.png', optimize=True)
    print(k, v.shape)
