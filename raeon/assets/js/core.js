/* 라에온 공통: 메뉴, 책갈피(스토리 진행도), 봉인, 용어 창, 도우미. */
(function () {
  "use strict";
  var R = window.RAEON = window.RAEON || {};
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} },
  };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  };
  var josa = function (w, a, b) {
    var l = String(w).replace(/[^가-힣]+$/, "").slice(-1);
    if (!l) return a;
    var c = l.charCodeAt(0) - 0xac00;
    return c >= 0 && c % 28 ? b : a;
  };
  var byId = function (list) { var m = {}; (list || []).forEach(function (x) { m[x.id] = x; }); return m; };

  /* ── 책갈피: 이야기를 어디까지 읽었나 ── */
  var ORDER = {
    1: ["start", "ch1", "ch2", "ch3", "ch4", "ch5", "ch6", "ch7", "ch8"],
    2: ["muster", "descent", "snowfield", "found", "branch"],
  };
  var POINT_NAME = {
    1: { start: "출발", ch1: "1장", ch2: "2장", ch3: "3장", ch4: "4장", ch5: "5장", ch6: "6장", ch7: "7장", ch8: "8장" },
    2: { muster: "출정", descent: "하강", snowfield: "설원", found: "발견", branch: "갈래" },
  };
  var bm = function (story) { return store.get("raeon.bm." + story); };
  var setBm = function (story, at) { if (at) store.set("raeon.bm." + story, at); else store.del("raeon.bm." + story); };
  var warned = function () { return store.get("raeon.warn") === "1"; };
  var reached = function (story, at) {
    var cur = bm(story);
    if (!cur) return false;
    return ORDER[story].indexOf(cur) >= ORDER[story].indexOf(at);
  };
  // 비밀 하나가 지금 열려 있는가
  var isOpen = function (s) {
    if (!s || s.level === "open" || !s.level) return true;
    if (s.level === "sealed") return false;
    if (s.unlock === "warn") return warned();
    if (s.unlock && s.unlock.story) return reached(s.unlock.story, s.unlock.at);
    return false;
  };
  var condition = function (s) {
    if (s.level === "sealed") return "아직 어떤 책에도 내용이 적히지 않은 비밀입니다.";
    if (s.unlock === "warn") return "이야기의 재미를 줄일 수 있는 내용입니다. 열면 이 기기에서는 같은 종류의 비밀이 모두 열립니다.";
    if (s.unlock && s.unlock.story) {
      var st = s.unlock.story === 1 ? "용사의 여정" : "버려진 원정";
      return "「" + st + "」의 " + POINT_NAME[s.unlock.story][s.unlock.at] + "까지 읽었다고 책갈피를 꽂으면 열립니다.";
    }
    return "";
  };
  // 봉인 칸. title 은 봉인 위에 보이는 제목
  var seal = function (s, title) {
    title = title || s.title || "봉인된 기록";
    if (isOpen(s)) {
      return '<div class="seal opened"><b class="ui">' + esc(title) + '</b><p class="txt">' + esc(s.text) + "</p></div>";
    }
    var btn = "";
    if (s.unlock === "warn") btn = '<button type="button" class="open-btn" data-open-warn>경고를 읽었고, 열겠습니다</button>';
    else if (s.unlock && s.unlock.story) btn = '<a class="open-btn" href="journey.html#story-' + s.unlock.story + '">책갈피 꽂으러 가기</a>';
    return '<div class="seal"><b>' + esc(title) + "</b><p>" + esc(condition(s)) + "</p>" + btn + "</div>";
  };
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-open-warn]");
    if (!t) return;
    if (!window.confirm("스포일러가 담긴 기록을 엽니다. 이 기기에서는 경고 표시가 붙은 비밀이 모두 열립니다.")) return;
    store.set("raeon.warn", "1");
    location.reload();
  });

  /* ── 메뉴 ── */
  var NAV = [
    ["index.html", "표지", "home"],
    ["journey.html", "여정", "journey"],
    ["atlas.html", "지도", "atlas"],
    ["guild.html", "인물", "guild"],
    ["bestiary.html", "도감", "bestiary"],
    ["library.html", "서고", "library"],
  ];
  var counts = function (key) {
    if (key === "guild" && R.characters) return R.characters.length;
    if (key === "bestiary" && R.monsters) return R.monsters.filter(function (m) { return isOpen(m); }).length;
    if (key === "atlas" && R.regions) return R.regions.length;
    return "";
  };
  var page = document.body.getAttribute("data-page");
  var drawNav = function () {
    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (el) {
      var tab = el.classList.contains("tabbar");
      el.innerHTML = NAV.filter(function (n) { return !tab || n[2] !== "home"; }).map(function (n) {
        var c = tab ? "" : counts(n[2]);
        return '<a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : "") + ">" + n[1] + (c ? "<small>" + c + "</small>" : "") + "</a>";
      }).join("");
    });
  };

  /* ── 용어 창 ── */
  var termMap = {};
  (R.terms || []).forEach(function (t) { termMap[t.term] = t; });
  var sheet = null;
  var openTerm = function (name) {
    var t = termMap[name];
    if (!t) return;
    if (!sheet) {
      sheet = document.createElement("dialog");
      sheet.className = "term-sheet";
      sheet.innerHTML = '<div class="in"><span class="kicker">색인</span><h2></h2><div class="body"></div><p><button type="button" class="btn" data-close>닫기</button> <a class="btn" href="library.html#terms">색인 전체 보기</a></p></div>';
      document.body.appendChild(sheet);
      sheet.addEventListener("click", function (e) { if (e.target === sheet || e.target.closest("[data-close]")) sheet.close(); });
    }
    sheet.querySelector("h2").textContent = t.term;
    sheet.querySelector(".body").innerHTML = t.level && t.level !== "open" ? seal(t, t.term) : "<p>" + esc(t.def) + "</p>";
    if (sheet.showModal) sheet.showModal(); else sheet.setAttribute("open", "");
  };
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-term]");
    if (t) { e.preventDefault(); openTerm(t.getAttribute("data-term")); }
  });
  // 본문 HTML 안의 용어를 처음 한 번씩 누를 수 있게 만든다
  var linkTerms = function (html) {
    var done = {};
    Object.keys(termMap).sort(function (a, b) { return b.length - a.length; }).forEach(function (k) {
      if (termMap[k].level && termMap[k].level !== "open") return;
      var i = html.indexOf(k);
      if (i === -1 || done[k]) return;
      if (html.lastIndexOf("<", i) > html.lastIndexOf(">", i)) return;
      if (html.lastIndexOf('<button class="term"', i) > html.lastIndexOf("</button>", i)) return;
      done[k] = 1;
      html = html.slice(0, i) + '<button class="term" type="button" data-term="' + esc(k) + '">' + k + "</button>" + html.slice(i + k.length);
    });
    return html;
  };

  /* ── 대화 시작 ── */
  var chatButtons = function (label) {
    var list = (R.config && R.config.chat) || [];
    if (!list.length) return '<button class="btn" type="button" disabled>대화 링크 준비 중</button>';
    return list.map(function (p, i) {
      return '<a class="btn' + (i ? "" : " solid") + '" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.name) + "에서 " + esc(label || "대화") + " 시작하기</a>";
    }).join(" ");
  };

  R.ui = {
    esc: esc, josa: josa, byId: byId, store: store,
    ORDER: ORDER, POINT_NAME: POINT_NAME, bm: bm, setBm: setBm, reached: reached,
    isOpen: isOpen, seal: seal, condition: condition, linkTerms: linkTerms, openTerm: openTerm, chatButtons: chatButtons,
    gradeClass: function (g) { return /^(S|SS|SSS)$/.test(g) ? "high" : g === "???" ? "rift" : ""; },
    drawNav: drawNav,
  };
  drawNav();

  Array.prototype.forEach.call(document.querySelectorAll("[data-forget]"), function (b) {
    b.addEventListener("click", function () {
      if (!window.confirm("책갈피와 열어 본 비밀을 모두 지웁니다.")) return;
      ["raeon.bm.1", "raeon.bm.2", "raeon.warn"].forEach(store.del);
      location.reload();
    });
  });
})();
