# 한글 서명체용 글꼴 서브셋 스크립트 (Frame Studio 16에서 사용)
# 사용: python subset-korean-font.py <원본 TTF> <출력 WOFF> "<새 글꼴 이름>"
# 필요: pip install fonttools
# KS X 1001 완성형 2,350자 + 호환 자모 + 기본 ASCII만 남기고, OFL 예약 이름을 피하려고 이름 테이블을 바꾼다.
import sys
from fontTools.ttLib import TTFont
from fontTools import subset
src, dst, family = sys.argv[1], sys.argv[2], sys.argv[3]
# KS X 1001 완성형 한글 2,350자 + 호환 자모 + 기본 ASCII
chars = set()
for hi in range(0xB0, 0xC9):
    for lo in range(0xA1, 0xFF):
        try: chars.add(ord(bytes([hi, lo]).decode('euc-kr')))
        except Exception: pass
chars |= set(range(0x3131, 0x318F)) | set(range(0x20, 0x7F))
f = TTFont(src)
print('glyf' in f, 'CFF ' in f, 'hangul', sum(1 for c in chars if 0xAC00 <= c <= 0xD7A3))
opts = subset.Options(); opts.flavor = 'woff'; opts.name_IDs = []; opts.layout_features = []; opts.hinting = False; opts.notdef_outline = True
sub = subset.Subsetter(opts); sub.populate(unicodes=sorted(chars)); sub.subset(f)
# OFL 예약 글꼴 이름(Nanum 계열)을 쓰지 않도록 이름을 바꾼다
name = f['name']; name.names = []
for nid, val in [(0, 'Copyright (c) 2010, NHN Corporation. Modified (subset) for Frame Studio. Licensed under the SIL Open Font License 1.1.'), (1, family), (2, 'Regular'), (3, family + ' Regular'), (4, family), (6, family.replace(' ', '') + '-Regular'), (13, 'SIL Open Font License, Version 1.1'), (14, 'https://openfontlicense.org')]:
    name.setName(val, nid, 3, 1, 0x409)
f.flavor = 'woff'; f.save(dst)
import os; print(dst, os.path.getsize(dst))
