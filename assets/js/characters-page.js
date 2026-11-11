/* 인물 목록과 인물 상세. 한 페이지에서 주소의 #인물id 로 화면을 바꾼다. */
(function () {
  "use strict";
  var ALL = window.CHARACTERS || [];
  var app = document.getElementById("app");
  var rail = document.getElementById("rail-factions");
  if (!app) return;
  var B = window.BLACKOUT;

  var byId = {};
  ALL.forEach(function (c) { byId[c.id] = c; });

  var FACTIONS = [
    ["all", "전체"],
    ["academy", "아카데미·협력"],
    ["outsider", "반역자·외부"],
    ["throne", "이계의 왕과 칠좌"],
    ["border", "경계인·연예·기업·용병"],
  ];
  // 공개 랭킹의 빈자리. 인물이 아니라 보드에만 나타난다.
  var VOIDS = [
    { rank: 3, struck: true, note: "말소 · 2년 전" },
    { rank: 5, name: "공석", note: "전사 · 1년 전 3월" },
  ];
  var EMOTES = ["평상시", "웃음", "의문", "부끄러움", "슬픔", "분노", "기술"];
  var SEAT_SYMBOL = {
    celestis: "faction-seven-seats", arbel: "seat-arbel", merkan: "seat-merkan", sitriel: "seat-sitriel",
    neisa: "seat-neisa", orgam: "seat-orgam", lagbar: "seat-lagbar", nemuri: "seat-nemuri",
  };

  var state = { faction: "all", q: "", view: B.local.get("blackout.view") === "card" ? "card" : "board", listY: 0 };

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  };
  var count = function (f) {
    return f === "all" ? ALL.length : ALL.filter(function (c) { return c.faction === f; }).length;
  };
  // 순위가 있는 인물은 순위순, 없는 인물은 설정집 순서로 뒤에 둔다
  var ordered = ALL.slice().sort(function (a, b) {
    var ra = a.rank == null ? 1000 + a.no : a.rank;
    var rb = b.rank == null ? 1000 + b.no : b.rank;
    return ra - rb;
  });
  var rankText = function (c) { return c.rank == null ? c.badge : String(c.rank); };
  var rankClass = function (c) { return c.rank == null ? " label" : c.rank === 0 ? " zero" : ""; };
  var subline = function (c) { return [c.alias, c.role].filter(Boolean).join(" · "); };
  var moveHtml = function (c) {
    if (!c.move) return "";
    var up = c.move > 0;
    return '<b class="mv ' + (up ? "up" : "down") + '" aria-label="' + Math.abs(c.move) + "계단 " + (up ? "상승" : "하락") + '">' +
      (up ? "▲ " : "▼ ") + Math.abs(c.move) + "</b>";
  };
  var plate = function (c, big) {
    if (c.image) {
      return '<div class="plate"><img id="' + (big ? "portrait" : "") + '" src="' + esc(c.image) + '" alt="' + esc(c.name) + '의 프로필 그림"' + (big ? "" : ' loading="lazy"') + "></div>";
    }
    // 칠좌와 왕은 그림이 준비될 때까지 기호로 자리를 채운다
    var sym = SEAT_SYMBOL[c.id];
    if (sym) {
      return '<div class="plate has-sym f-' + c.faction + '"><span class="mono">그림 준비 중</span><img src="assets/img/symbols/' + sym + '.svg" alt="' + esc(c.name) + '의 기호"' + (big ? "" : ' loading="lazy"') + "></div>";
    }
    // 활동명이 길면 글자를 줄여 판 안에 들어오게 한다
    var label = c.alias || c.name;
    var width = label.replace(/ /g, "").length + (label.split(" ").length - 1) * 0.3;
    var fit = Math.min(20, Math.floor(880 / width) / 10);
    return '<div class="plate f-' + c.faction + '" aria-hidden="true" style="--fit:' + fit + '"><span class="mono">그림 준비 중</span>' +
      (c.rank != null ? '<i class="plate-rank">' + c.rank + "</i>" : "") + "<b>" + esc(label) + "</b></div>";
  };
  var colorStyle = function (c) { return c.color ? ' style="--char:' + esc(c.color) + '"' : ""; };

  /* ───── 목록 ───── */
  var matches = function (c) {
    if (state.faction !== "all" && c.faction !== state.faction) return false;
    var q = state.q.trim().toLowerCase();
    if (!q) return true;
    var hay = [c.name, c.alias, c.role, c.kind, c.ability.name, c.traits.join(" ")].join(" ").toLowerCase();
    return hay.indexOf(q) !== -1;
  };

  var boardHtml = function (list) {
    var rows = list.map(function (c) {
      return { key: c.rank == null ? 1000 + c.no : c.rank, html:
        '<li class="f-' + c.faction + '"><span class="rk' + rankClass(c) + '">' + esc(rankText(c)) + "</span>" +
        '<a class="who" href="#' + c.id + '"><b>' + esc(c.name) + "</b><span>" + esc(subline(c) || c.kind) + "</span></a>" +
        '<span class="st">' + moveHtml(c) + "<span>" + esc(c.traits.slice(0, 2).join(" · ")) + "</span></span></li>" };
    });
    // 빈자리는 검색 중이 아닐 때, 아카데미가 보이는 목록에만 넣는다
    if (!state.q.trim() && (state.faction === "all" || state.faction === "academy")) {
      VOIDS.forEach(function (v) {
        rows.push({ key: v.rank, html:
          '<li class="void"><span class="rk">' + v.rank + '</span><span class="who">' +
          (v.struck ? '<i class="struck" role="img" aria-label="기록 말소"></i>' : "<b>" + esc(v.name) + "</b>") +
          '</span><span class="st"><span>' + esc(v.note) + "</span></span></li>" });
      });
    }
    rows.sort(function (a, b) { return a.key - b.key; });
    return '<ol class="board list-board">' + rows.map(function (r) { return r.html; }).join("") + "</ol>" +
      '<p class="mono board-key">▲ ▼ 직전 발표 대비 등수 변동</p>';
  };

  var cardsHtml = function (list) {
    return '<ul class="cards">' + list.map(function (c) {
      return "<li" + colorStyle(c) + '><a href="#' + c.id + '">' + plate(c, false) +
        '<span class="cap"><i class="' + (c.rank == null ? "label" : "") + '">' + esc(rankText(c)) + "</i>" +
        "<span><b>" + esc(c.name) + "</b><span>" + esc(subline(c) || c.kind) + "</span></span></span></a></li>";
    }).join("") + "</ul>";
  };

  var renderResults = function () {
    var list = ordered.filter(matches);
    var box = document.getElementById("results");
    var tally = document.getElementById("tally");
    if (!box) return;
    tally.textContent = list.length === ALL.length ? "48인 전원" : ALL.length + "인 중 " + list.length + "인";
    box.innerHTML = !list.length
      ? '<p class="empty">찾는 인물이 없습니다. 이름, 활동명, 능력명으로 다시 검색해 보세요.</p>'
      : state.view === "card" ? cardsHtml(list) : boardHtml(list);
  };

  var factionButtons = function () {
    return FACTIONS.map(function (f) {
      return '<button type="button" data-faction="' + f[0] + '" aria-pressed="' + (state.faction === f[0]) + '">' +
        esc(f[1]) + "<span>" + count(f[0]) + "</span></button>";
    }).join("");
  };
  var syncFactions = function () {
    Array.prototype.forEach.call(document.querySelectorAll("[data-faction]"), function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.faction === state.faction));
    });
  };

  var renderList = function () {
    document.title = "인물 48인 · 블랙아웃";
    app.innerHTML =
      '<header class="page-head" data-ghost="DOSSIER"><h1>인물 48인</h1><p>전원과 대화할 수 있습니다. 이름을 누르면 기록을 엽니다.</p></header>' +
      '<div class="tools">' +
        '<label class="search"><span class="mono">검색</span><input id="q" type="search" autocomplete="off" placeholder="이름, 활동명, 능력명" value="' + esc(state.q) + '"></label>' +
        '<div class="tools-row"><span class="mono" id="tally"></span>' +
          '<div class="seg" role="group" aria-label="보기 방식">' +
            '<button type="button" data-view="board" aria-pressed="' + (state.view === "board") + '">목록</button>' +
            '<button type="button" data-view="card" aria-pressed="' + (state.view === "card") + '">카드</button>' +
          "</div></div>" +
        '<div class="chips" role="group" aria-label="소속">' + factionButtons() + "</div>" +
      "</div>" +
      '<div id="results"></div>';
    renderResults();
    document.getElementById("q").addEventListener("input", function (e) {
      state.q = e.target.value;
      renderResults();
    });
  };

  /* ───── 상세 ───── */
  var noteGroup = function (c, key, level, label) {
    var items = c[key];
    var head = "<h2><span>" + label + "</span><span>" + items.length + "건</span></h2>";
    if (!items.length) return '<div class="group">' + head + '<p class="none">등록된 기록이 없습니다.</p></div>';
    return '<div class="group">' + head + items.map(function (it) {
      return '<div class="secret"><p class="warn">' + esc(it.topic) + "</p>" +
        '<button class="bar" data-level="' + level + '" type="button" aria-expanded="false" aria-label="' + label + " 열람: " + esc(it.topic) + '">' +
        esc(it.text) + "</button></div>";
    }).join("") + "</div>";
  };

  var renderDetail = function (c) {
    document.title = c.name + " · 블랙아웃";
    var i = ALL.indexOf(c);
    var prev = ALL[(i - 1 + ALL.length) % ALL.length];
    var next = ALL[(i + 1) % ALL.length];
    var rels = c.relations.map(function (r) {
      var o = byId[r.id];
      return '<li><a href="#' + o.id + '">' + esc(o.name) + "</a><span>" + esc(r.note) + "</span></li>";
    }).join("");
    var emotes = !c.image ? "" :
      '<div class="emotes" role="group" aria-label="표정">' + EMOTES.map(function (e, n) {
        var src = n === 0 ? c.image : (c.emotes && c.emotes[e]);
        return '<button type="button" aria-pressed="' + (n === 0) + '"' + (src ? ' data-src="' + esc(src) + '"' : ' disabled title="준비 중"') + ">" + e + "</button>";
      }).join("") + "</div>";

    app.innerHTML =
      '<nav class="crumbs" aria-label="인물 이동"><a href="#list">← 인물 목록</a>' +
        '<div><a href="#' + prev.id + '">이전</a><a href="#' + next.id + '">다음</a></div></nav>' +
      '<article class="profile"' + colorStyle(c) + ">" +
        '<div class="profile-main">' + plate(c, true) + emotes +
          '<div class="dossier">' +
            '<div class="id"><span class="rk' + (c.rank == null ? " label" : "") + '">' + esc(rankText(c)) + "</span>" +
              "<div><h1 class=\"h3\">" + esc(c.name) + "</h1><p>" + esc([c.alias, c.kind, c.role].filter(Boolean).join(" · ")) + "</p></div></div>" +
            '<ul class="traits">' + c.traits.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
            (c.quote ? '<p class="said">' + esc(c.quote) + "</p>" : "") +
            '<p class="lead">' + esc(c.summary) + "</p>" +
            '<dl class="spec">' +
              '<div class="ability"><dt>능력</dt><dd><b>' + esc(c.ability.name) + "</b>" + esc(c.ability.text) + "</dd></div>" +
              '<div class="limit"><dt>한계</dt><dd>' + esc(c.ability.limit) + "</dd></div>" +
              (rels ? '<div><dt>관계</dt><dd><ul class="rel">' + rels + "</ul></dd></div>" : "") +
            "</dl>" +
            '<div class="platforms" data-chat data-chat-quiet></div>' +
          "</div>" +
        "</div>" +
        '<aside class="notes" aria-label="가려진 기록">' +
          noteGroup(c, "internal", 1, "내부용") + noteGroup(c, "secret", 2, "기밀") +
        "</aside>" +
        '<nav class="pager wide" aria-label="앞뒤 인물">' +
          '<a href="#' + prev.id + '"><span class="mono">이전</span><b>' + esc(prev.name) + "</b></a>" +
          '<a href="#' + next.id + '"><span class="mono">다음</span><b>' + esc(next.name) + "</b></a></nav>" +
      "</article>";
    B.fillChat(app.querySelector("[data-chat]"));
    B.refresh();
  };

  /* ───── 화면 전환 ───── */
  var showing = null;
  var route = function () {
    var id = location.hash.replace(/^#/, "");
    var c = byId[id];
    if (c) {
      if (showing === "list") state.listY = window.scrollY;
      renderDetail(c);
      showing = "detail";
      window.scrollTo(0, 0);
    } else {
      renderList();
      syncFactions();
      var back = showing === "detail";
      showing = "list";
      window.scrollTo(0, back ? state.listY : 0);
    }
  };

  // 표정 단추: 그림을 바꾼다
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest(".emotes button[data-src]") : null;
    var img = t && document.getElementById("portrait");
    if (!img) return;
    img.src = t.dataset.src;
    Array.prototype.forEach.call(t.parentNode.children, function (b) { b.setAttribute("aria-pressed", String(b === t)); });
  });

  // 목록 조작은 한 곳에서 받는다
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-faction],[data-view]") : null;
    if (!t) return;
    if (t.dataset.faction) {
      state.faction = t.dataset.faction;
      if (showing !== "list") { location.hash = "#list"; return; }
      syncFactions();
      renderResults();
    } else {
      state.view = t.dataset.view;
      B.local.set("blackout.view", state.view);
      Array.prototype.forEach.call(document.querySelectorAll("[data-view]"), function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.view === state.view));
      });
      renderResults();
    }
  });

  if (rail) rail.innerHTML = factionButtons().replace(/<button /g, "<li><button ").replace(/<\/button>/g, "</button></li>");
  window.addEventListener("hashchange", route);
  route();
})();
