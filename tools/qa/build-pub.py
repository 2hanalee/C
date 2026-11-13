# 저장소 HTML 을 아티팩트용 페이지로 바꾼다: 문서 머리와 body 태그를 빼고 data-page 를 스크립트로 단다
import re, sys, pathlib
root = pathlib.Path('/home/user/C'); out = pathlib.Path(sys.argv[1])
for f in ['index.html', 'world.html', 'characters.html', 'timeline.html', 'webtoon.html']:
    s = (root / f).read_text(encoding='utf-8')
    page = re.search(r'<body data-page="([^"]+)">', s).group(1)
    head = s[s.index('<title>'):s.index('</head>')].rstrip() + '\n'
    body = s[s.index('>', s.index('<body')) + 1:s.index('</body>')]
    (out / f).write_text(head + '<script>document.body.setAttribute("data-page","%s");</script>' % page + body, encoding='utf-8')
