/* 여정: 두 이야기. #story-1, #story-2. 책갈피로 스포일러를 연다. */
(function () {
  "use strict";
  var R = window.RAEON, U = R.ui, esc = U.esc;
  var app = document.getElementById("app");
  var chars = U.byId(R.characters), regions = U.byId(R.regions);
  var monsterByName = {};
  (R.monsters || []).forEach(function (m) { monsterByName[m.name] = m; });

  var who = function (id) { var c = chars[id]; return c ? '<a href="guild.html#' + id + '">' + esc(c.name) + "</a>" : ""; };

  var bookmark = function (s) {
    var cur = U.bm(s.id);
    return '<div class="bookmark" id="bm-' + s.id + '"><b>책갈피: 어디까지 읽었나요?</b>' +
      "<p>고른 지점까지의 비밀이 사이트 전체에서 열립니다. 아직 읽지 않았다면 비워 두십시오.</p>" +
      '<div class="chips" role="group" aria-label="책갈피 위치">' +
        '<button type="button" data-bm="' + s.id + '" data-at="" aria-pressed="' + !cur + '">비워 두기</button>' +
        U.ORDER[s.id].map(function (at) {
          return '<button type="button" data-bm="' + s.id + '" data-at="' + at + '" aria-pressed="' + (cur === at) + '">' + U.POINT_NAME[s.id][at] + "</button>";
        }).join("") + "</div></div>";
  };

  var point = function (s, p, i) {
    var r = regions[p.region];
    var read = U.reached(s.id, p.id);
    var people = r ? (r.characters || []).slice(0, 6).map(who).join("") : "";
    var danger = r ? (r.monsters || []).slice().sort(function (a, b) { return "FDCBAS".indexOf(b.grade[0]) - "FDCBAS".indexOf(a.grade[0]); }).slice(0, 3)
      .map(function (m) { return esc(m.name) + "(" + esc(m.grade) + ")"; }).join(", ") : "";
    var num = s.id === 1 ? (i === 0 ? "◆" : String(i)) : String(i + 1);
    return '<li class="chapter' + (read ? " read" : "") + '" id="' + s.id + "-" + p.id + '">' +
      '<div class="art-strip" style="background-image:url(' + U.art.region(p.region || "funda") + ')"><span class="num">' + num + "</span><div>" +
        (r ? '<span class="where">' + esc(r.title) + "</span>" : '<span class="where">당신의 선택</span>') + "<h3>" + esc(p.title) + "</h3></div></div>" +
      '<div class="page">' +
      "<p>" + U.linkTerms(esc(p.summary)) + (p.draft ? '<span class="draft-tag">초안</span>' : "") + "</p>" +
      (people ? '<p class="cast" aria-label="이 장에서 만나는 사람">' + people + "</p>" : "") +
      (danger ? '<p class="ui" style="font-size:.82rem;color:var(--marker)">이 장의 위험: ' + danger + "</p>" : "") +
      '<p class="links">' + (r ? '<a href="atlas.html#' + r.id + '">이 장의 지역 펼치기 →</a>' : "") + "</p>" +
      "</div></li>";
  };

  var storyHtml = function (s) {
    var spoilers = (s.spoilers || []).map(function (sp) {
      return U.seal({ level: "spoiler", unlock: sp.unlock, text: sp.text }, s.id === 1 ? "여정에 묻힌 것" : "원정의 진실");
    }).join("");
    return '<section class="section" id="story-' + s.id + '">' +
      '<div class="on-sky"><div class="band"><b>여행자의 여정록 · 제' + s.id + "권</b><span>" + (s.id === 1 ? "출발과 8장" : "다섯 단계") + "</span></div>" +
      '<h2 class="page-title">' + esc(s.title.replace(/^스토리 \d: /, "")) + "</h2>" +
      '<p class="lead">' + esc(s.logline) + "</p></div>" + '<div class="leaf">' +
      '<div class="prose" style="margin-top:1rem"><p>' + U.linkTerms(esc(s.intro)) + "</p></div>" +
      (s.id === 1 ? '<p class="section" style="margin-top:1rem"><b class="ui" style="font-size:.85rem">동료 여섯</b></p><p class="cast">' + (s.cast || []).map(who).join("") + "</p>"
        : '<p class="margin-note scholar">당신의 과거와 정체는 정해져 있지 않습니다. 당신이 말하는 것만이 사실이 됩니다.<cite>여정록의 일러두기</cite></p>') +
      bookmark(s) + "</div>" +
      (s.id === 2 ? '<div class="depth">' : "") +
      '<ol class="chapters">' + (s.points || []).map(function (p, i) { return point(s, p, i); }).join("") + "</ol>" +
      (s.id === 2 ? "</div>" : "") +
      '<div class="leaf">' + spoilers +
      '<div class="section" style="margin-top:.5rem"><h2>이 이야기로 대화하기</h2><p>' + (s.id === 1 ? "당신이 용사가 되어 동료들과 여정을 떠납니다." : "당신이 원정대의 마지막 생존자가 되어 카일과 마주합니다.") + "</p>" +
        '<p style="margin-top:.8rem">' + U.chatButtons("「" + s.title.replace(/^스토리 \d: /, "") + "」") + "</p></div></div>" +
    "</section>";
  };

  var render = function () {
    var list = R.stories || [];
    app.innerHTML =
      '<div class="on-sky" style="padding-top:2rem"><div class="band"><b>여행자의 여정록</b><span>두 권</span></div>' +
      '<h1 class="page-title">여정</h1>' +
      '<p class="lead">두 이야기는 같은 세계의 서로 다른 갈래입니다. 한 이야기 안에서는 다른 이야기를 이야기하지 않습니다. 장을 따라 내려가면 하늘이 그 나라의 하늘로 바뀝니다.</p></div>' +
      '<p class="chips" style="margin-top:.8rem">' + list.map(function (s) { return '<a class="btn" href="#story-' + s.id + '">제' + s.id + "권 " + esc(s.title.replace(/^스토리 \d: /, "")) + "</a>"; }).join(" ") + "</p>" +
      list.map(storyHtml).join("") +
      '<div class="leaf section"><h2>그 밖의 방식</h2><p>정해진 이야기 없이 자유롭게 대화할 수도 있습니다. 이때 당신은 용사가 아니며, 용사는 카일입니다.</p><p style="margin-top:.8rem">' + U.chatButtons("자유 대화") + "</p></div>";
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  };

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-bm]");
    if (!b) return;
    var story = Number(b.dataset.bm), at = b.dataset.at;
    U.setBm(story, at);
    var y = window.scrollY;
    render();
    window.scrollTo(0, y);
    U.drawNav();
  });
  render();
})();
