# 사진 칸 점검(qa-photo.js)에 쓰는 3:2 시험 그림 7장을 tools/qa/test3x2/ 에 만든다. 커밋하지 않는다.
import os, sys
from PIL import Image, ImageDraw
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(os.path.dirname(here))
src = Image.open(os.path.join(root, 'assets/img/characters/reina-de-rose.webp')).convert('RGB')
W, H = src.size; w = int(H * 1.5)
base = src.crop(((W - w) // 2, 0, (W - w) // 2 + w, H)).resize((900, 600))
os.makedirs(os.path.join(here, 'test3x2'), exist_ok=True)
cols = [(0, 0, 0), (255, 200, 0), (0, 160, 255), (255, 120, 180), (80, 80, 200), (220, 40, 40), (160, 0, 255)]
for i, c in enumerate(cols):
    im = Image.blend(base, Image.new('RGB', (900, 600), c), 0.25 if i else 0)
    ImageDraw.Draw(im).rectangle([0, 0, 899, 599], outline=(0, 255, 0), width=6)
    im.save(os.path.join(here, 'test3x2', 'e%d.webp' % i))
