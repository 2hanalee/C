/* 인물 목록과 인물 상세. 한 페이지에서 주소의 #인물id 로 화면을 바꾼다.
   목록은 인사기록카드 묶음이고, 상세는 카드 한 장을 펼친 화면이다. */
(function () {
  "use strict";
  var ALL = window.CHARACTERS || [];
  var app = document.getElementById("app");
  var rail = document.getElementById("rail-factions");
  if (!app) return;
  var B = window.BLACKOUT;
  var esc = B.esc;

  var byId = {};
  ALL.forEach(function (c) { byId[c.id] = c; });

  var FACTIONS = [
    ["all", "전체"],
    ["academy", "아카데미와 협력자"],
    ["outsider", "반역자와 외부 인물, 판정위원회"],
    ["throne", "이계의 왕과 칠좌"],
    ["border", "경계인과 연예, 기업, 용병"],
  ];
  var factionName = function (f) { return FACTIONS.filter(function (x) { return x[0] === f; })[0][1]; };
  // 데이터의 가운뎃점 목록은 화면에서 쉼표로 읽히게 바꾼다
  var plain = function (s) { return String(s || "").replace(/\s*·\s*/g, ", "); };
  // 공개 랭킹의 빈자리. 인물이 아니라 순위표에만 나타난다.
  var VOIDS = [
    { rank: 3, struck: true, note: "2년 전 말소" },
    { rank: 5, name: "공석", note: "1년 전 3월 전사" },
  ];
  var EMOTES = ["평상시", "웃음", "의문", "부끄러움", "슬픔", "분노", "기술"];
  var SEAT_SYMBOL = {
    celestis: "celestis", arbel: "seat-arbel", merkan: "seat-merkan", sitriel: "seat-sitriel",
    neisa: "seat-neisa", orgam: "seat-orgam", lagbar: "seat-lagbar", nemuri: "seat-nemuri",
  };
  var ARROW = '<svg class="go-ico" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 7h9M8 3.5 11.5 7 8 10.5"/></svg>';
  var LOCK = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="2" y="5.5" width="8" height="5.5" rx="1"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5"/></svg>';

  var state = { faction: "all", q: "", view: B.local.get("blackout.view") === "board" ? "board" : "card", listY: 0 };

  var count = function (f) {
    return f === "all" ? ALL.length : ALL.filter(function (c) { return c.faction === f; }).length;
  };
  // 순위가 있는 인물은 순위순, 없는 인물은 설정집 순서로 뒤에 둔다
  var ordered = ALL.slice().sort(function (a, b) {
    var ra = a.rank == null ? 1000 + a.no : a.rank;
    var rb = b.rank == null ? 1000 + b.no : b.rank;
    return ra - rb;
  });
  var no2 = function (n) { return (n < 10 ? "0" : "") + n; };
  var rankText = function (c) { return c.rank == null ? c.badge : String(c.rank); };
  var rankPill = function (c) {
    if (c.rank != null) return c.rank + "위";
    if (/^\d좌$/.test(c.badge)) return "제" + c.badge;
    if (c.badge === "왕") return "이계의 왕";
    return c.badge;
  };
  var rankClass = function (c) { return c.rank == null ? " label" : c.rank === 0 ? " zero" : ""; };
  var subline = function (c) { return [c.alias, plain(c.role)].filter(Boolean).join(", "); };
  var hiddenCount = function (c) { return c.internal.length + c.secret.length; };
  var moveHtml = function (c) {
    if (!c.move) return "";
    var up = c.move > 0;
    return '<b class="mv ' + (up ? "up" : "down") + '" aria-label="' + Math.abs(c.move) + "계단 " + (up ? "상승" : "하락") + '">' +
      (up ? "▲ " : "▼ ") + Math.abs(c.move) + "</b>";
  };
  // 도장이 매번 같은 각도로 찍히지 않게 인물마다 조금씩 비튼다
  var tilt = function (c, span) {
    var h = 0;
    for (var i = 0; i < c.id.length; i++) h = (h * 31 + c.id.charCodeAt(i)) % 997;
    return ((h % (span * 2 + 1)) - span) + "deg";
  };
  var styleVars = function (c) {
    var v = [];
    if (c.color) { v.push("--char:" + c.color); v.push("--char-ink:" + B.inkOn(c.color)); }
    return v.length ? ' style="' + esc(v.join(";")) + '"' : "";
  };

  // 등록 사진 자리. 그림, 문장, 미제출 도장 가운데 하나를 넣는다
  var photo = function (c, big) {
    var lazy = big ? "" : ' loading="lazy"';
    if (c.image) {
      // imageFocus: [가로 %, 세로 %, 확대] 그림 속 얼굴 쪽으로 사진을 맞춘다
      var f = c.imageFocus;
      var focus = f ? ' style="--fx:' + f[0] + "%;--fy:" + f[1] + "%;--fz:" + f[2] + '"' : "";
      return '<span class="photo has-img"' + focus + '><span class="ph"><img' + (big ? ' id="portrait"' : "") + ' src="' + esc(c.image) + '" alt="' + esc(c.name) + '의 등록 사진"' + lazy + "></span></span>";
    }
    var sym = SEAT_SYMBOL[c.id];
    if (sym) {
      return '<span class="photo has-sym"><img src="assets/img/emblems/' + sym + '.webp" alt="' + esc(c.name) + '의 문장"' + lazy + "></span>";
    }
    // 전사자는 사진 자리에 「전사」 도장을 찍는다
    if (c.fallen) return '<span class="photo none fallen"><i class="stamp-nophoto" style="--tilt:' + tilt(c, 9) + '">전사</i></span>';
    return '<span class="photo none"><i class="stamp-nophoto" style="--tilt:' + tilt(c, 9) + '">사진 미제출</i></span>';
  };

  /* ───── 목록 ───── */
  var matches = function (c) {
    if (state.faction !== "all" && c.faction !== state.faction) return false;
    var q = state.q.trim().toLowerCase();
    if (!q) return true;
    var hay = [c.name, c.alias, c.role, c.kind, c.ability ? c.ability.name : "", c.traits.join(" ")].join(" ").toLowerCase();
    return hay.indexOf(q) !== -1;
  };

  var cardHtml = function (c) {
    var n = hiddenCount(c);
    var visited = B.seen.has("c", c.id);
    return "<li" + styleVars(c) + '><a class="rcard" href="#' + c.id + '">' +
      '<span class="clip" aria-hidden="true"></span>' + photo(c, false) +
      '<span class="rc-body">' +
        '<span class="rc-top"><span class="rc-no">기록 ' + no2(c.no) + '</span><span class="pill">' + esc(rankPill(c)) + "</span></span>" +
        '<b class="rc-name">' + esc(c.name) + "</b>" +
        '<span class="rc-alias">' + esc(subline(c) || c.kind) + "</span>" +
        '<span class="rc-dl"><span class="k">구분</span><span>' + esc(plain(c.kind)) + "</span>" +
          (c.ability ? '<span class="k">능력</span><span>' + esc(c.ability.name) + "</span>" : "") + "</span>" +
        '<span class="rc-foot"><span class="rc-hidden' + (n ? "" : " zero") + '">' + (n ? LOCK + "가려진 기록 " + n + "건" : "가려진 기록 없음") + "</span>" +
          '<span class="go">기록 열람' + ARROW + "</span></span>" +
      "</span></a>" +
      (visited ? '<i class="stamp-read" aria-label="열람한 기록">열람함</i>' : "") + "</li>";
  };
  var cardsHtml = function (list) {
    return '<ul class="rcards">' + list.map(cardHtml).join("") + "</ul>";
  };

  var boardHtml = function (list) {
    var rows = list.map(function (c) {
      return { key: c.rank == null ? 1000 + c.no : c.rank, html:
        '<li class="f-' + c.faction + (B.seen.has("c", c.id) ? " seen" : "") + '"><a class="row" href="#' + c.id + '"><span class="rk' + rankClass(c) + '">' + esc(rankText(c)) + "</span>" +
        '<span class="who"><b>' + esc(c.name) + "</b><span>" + esc(subline(c) || c.kind) + "</span></span>" +
        '<span class="st">' + moveHtml(c) + "<span>" + esc(c.ability ? c.ability.name : plain(c.kind)) + "</span></span>" + ARROW + "</a></li>" };
    });
    // 빈자리는 검색 중이 아닐 때, 아카데미가 보이는 목록에만 넣는다
    if (!state.q.trim() && (state.faction === "all" || state.faction === "academy")) {
      VOIDS.forEach(function (v) {
        rows.push({ key: v.rank, html:
          '<li class="void"><span class="row"><span class="rk">' + v.rank + '</span><span class="who">' +
          (v.struck ? '<i class="struck" role="img" aria-label="기록 말소"></i>' : "<b>" + esc(v.name) + "</b>") +
          '</span><span class="st"><span>' + esc(v.note) + "</span></span></span></li>" });
      });
    }
    rows.sort(function (a, b) { return a.key - b.key; });
    return '<ol class="board list-board">' + rows.map(function (r) { return r.html; }).join("") + "</ol>" +
      '<p class="mono board-key">▲ ▼ 표시는 직전 발표와 비교한 등수 변동입니다.</p>';
  };

  var renderResults = function () {
    var list = ordered.filter(matches);
    var box = document.getElementById("results");
    var tally = document.getElementById("tally");
    if (!box) return;
    tally.textContent = list.length === ALL.length ? ALL.length + "인 전원을 보고 있습니다." : ALL.length + "인 가운데 " + list.length + "인을 찾았습니다.";
    box.innerHTML = !list.length
      ? '<p class="empty">찾는 인물이 없습니다. 이름이나 활동명, 능력 이름으로 다시 찾아보세요.</p>'
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
    document.title = "인물 " + ALL.length + "인 · 블랙아웃";
    app.innerHTML =
      '<header class="page-head" data-ghost="DOSSIER"><p class="kicker">방위청 인사 기록, 열람용 사본</p><h1 class="lit">인물 ' + ALL.length + "인</h1>" +
        "<p>아카데미에 등록된 인물과 외부 인물의 인사기록카드입니다. 카드를 누르면 전체 기록이 열립니다.</p></header>" +
      '<div class="tools">' +
        '<label class="search"><span>이름이나 능력으로 찾기</span><input id="q" type="search" autocomplete="off" placeholder="예: 레이나, 왕관 없는 정원" value="' + esc(state.q) + '"></label>' +
        '<div class="tools-row"><span class="mono" id="tally" aria-live="polite"></span>' +
          '<div class="seg" role="group" aria-label="보기 방식">' +
            '<button type="button" data-view="card" aria-pressed="' + (state.view === "card") + '">기록 카드</button>' +
            '<button type="button" data-view="board" aria-pressed="' + (state.view === "board") + '">순위표</button>' +
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
  var renderDetail = function (c) {
    document.title = c.name + " · 블랙아웃";
    B.seen.add("c", c.id);
    var i = ALL.indexOf(c);
    var prev = ALL[(i - 1 + ALL.length) % ALL.length];
    var next = ALL[(i + 1) % ALL.length];
    var rels = c.relations.map(function (r) {
      var o = byId[r.id];
      return '<li><a href="#' + o.id + '"><b>' + esc(o.name) + "</b><span>" + esc(r.note) + "</span>" + ARROW + "</a></li>";
    }).join("");
    var emotes = !c.image ? "" :
      '<div class="emotes" role="group" aria-label="표정 고르기">' + EMOTES.map(function (e, n) {
        var src = n === 0 ? c.image : (c.emotes && c.emotes[e]);
        return '<button type="button" aria-pressed="' + (n === 0) + '"' + (src ? ' data-src="' + esc(src) + '"' : ' disabled title="이 표정은 아직 준비 중입니다"') + ">" + e + "</button>";
      }).join("") + "</div>";
    var caption = c.image ? "등록 사진, 평상시 표정" : c.fallen ? "전사자의 기록" : SEAT_SYMBOL[c.id] ? "사진 대신 문장을 붙여 둔 기록" : "등록 사진이 아직 제출되지 않았습니다";
    var list = B.records(c.internal, c.secret, "c:" + c.id, c.name + "의");

    app.innerHTML =
      '<nav class="crumbs" aria-label="기록 이동"><a class="back" href="#list">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4"/></svg>인물 목록으로</a>' +
        '<div><a href="#' + prev.id + '">이전 기록: ' + esc(prev.name) + '</a><a href="#' + next.id + '">다음 기록: ' + esc(next.name) + "</a></div></nav>" +
      '<article class="sheetcard"' + styleVars(c) + ">" +
        '<header class="sc-head"><span>방위청 인사기록카드</span><span class="mono">기록 번호 ' + no2(c.no) + ", 열람용 사본</span></header>" +
        (c.hook ? '<p class="sc-hook">' + esc(c.hook) + "</p>" : "") +
        '<div class="sc-grid">' +
          '<div class="sc-photo">' +
            '<figure class="polaroid' + (c.image ? "" : " small") + '"><span class="tape" aria-hidden="true"></span><span class="clip" aria-hidden="true"></span>' +
              photo(c, true) + "<figcaption>" + caption + "</figcaption></figure>" + emotes +
          "</div>" +
          '<div class="sc-main">' +
            '<div class="id"><span class="rk' + (c.rank == null ? " label" : "") + '" aria-label="' + esc(rankPill(c)) + '">' + esc(c.rank == null ? rankPill(c) : rankText(c)) + "</span>" +
              "<div><h1>" + esc(c.name) + "</h1>" + (c.alias ? "<p>" + esc(c.alias) + "</p>" : "") + "</div></div>" +
            (c.quote ? '<blockquote class="said"><p>' + esc(c.quote) + "</p></blockquote>" : "") +
            '<dl class="form">' +
              "<dt>구분</dt><dd>" + esc(plain(c.kind)) + "</dd>" +
              "<dt>소속</dt><dd>" + esc(factionName(c.faction)) + "</dd>" +
              (c.role ? "<dt>직위</dt><dd>" + esc(plain(c.role)) + "</dd>" : "") +
              "<dt>성격</dt><dd>" + esc(c.traits.join(", ")) + "</dd>" +
            "</dl>" +
            '<section class="sc-sec"><h2>개요</h2><p>' + esc(c.summary) + "</p></section>" +
            (c.ability ? '<section class="sc-ability"><h2>능력</h2><p class="ab-name">' + esc(c.ability.name) + "</p><p>" + esc(c.ability.text) + "</p>" +
              (c.subs && c.subs.length ? '<dl class="ab-subs">' + c.subs.map(function (u) { return "<dt>" + esc(u.name) + "</dt><dd>" + esc(u.text) + "</dd>"; }).join("") + "</dl>" : "") +
              '<p class="ab-limit"><strong>한계</strong> ' + esc(c.ability.limit) + "</p></section>" : "") +
            // 대화를 시작하는 재료: 자주 벌어지는 일과 말투
            (c.scenes && c.scenes.length ? '<section class="sc-sec sc-scenes"><h2>자주 벌어지는 일</h2><ul>' + c.scenes.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></section>" : "") +
            (c.voice && c.voice.text ? '<section class="sc-sec sc-voice"><h2>말투</h2><p>' + esc(c.voice.text) + "</p>" +
              (c.voice.sample ? "<blockquote><p>" + esc(c.voice.sample) + "</p></blockquote>" : "") + "</section>" : "") +
            (rels ? '<section class="sc-sec"><h2>관계</h2><ul class="rel">' + rels + "</ul></section>" : "") +
            '<div class="platforms" data-chat data-chat-with="' + esc(c.name) + '"></div>' +
          "</div>" +
        "</div>" +
      "</article>" +
      B.hiddenSection(list) +
      '<nav class="pager" aria-label="앞뒤 인물">' +
        '<a href="#' + prev.id + '"><span class="mono">이전 기록</span><b>' + esc(prev.name) + "</b></a>" +
        '<a href="#' + next.id + '"><span class="mono">다음 기록</span><b>' + esc(next.name) + "</b></a></nav>";
    B.fillChat(app.querySelector("[data-chat]"));
  };

  /* ───── 화면 전환 ───── */
  var showing = null;
  var route = function () {
    var id = location.hash.replace(/^#/, "");
    var c = byId[id];
    // 메인의 순위표 링크(#board)는 순위표 보기로 연다
    if (id === "board") { state.view = "board"; state.faction = "all"; }
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
    var cap = document.querySelector(".polaroid figcaption");
    var e2 = t.textContent;
    if (cap) cap.textContent = "등록 사진, " + (e2 === "기술" ? "기술을 쓰는 모습" : e2 + " 표정");
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
