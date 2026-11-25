/* 책 뷰어: 마물과 지형을 실제 책처럼 펼쳐 본다.
   [data-book-open="101|romance|rift|maghi"] 단추가 연다. [data-book-at] 이 있으면 그 항목부터, 없으면 목차부터.
   넓은 화면은 펼침면(왼쪽 도판, 오른쪽 글), 좁은 화면은 한 쪽씩. 책장은 등을 축으로 넘어간다.
   ← → 키, 옆으로 밀기, 목차, Esc. 움직임 줄이기 설정에서는 넘기지 않고 겹쳐 바꾼다. */
(function () {
  "use strict";
  var R = window.RAEON, U = R.ui, esc = U.esc;
  var GRADES = ["F", "D", "D+", "C", "C+", "B", "A", "A+", "S", "SS", "SSS"];
  var CREST = { beast: "✶", kin: "⚔", undead: "☠", blood: "✠", "dragon-sea": "≈", construct: "⚙", demon: "♆", rift: "◎" };
  var KIND = { hub: "중심지", edge: "변경", danger: "위험 지대", special: "특별한 장소", region: "지역", other: "장소" };
  var regionById = U.byId(R.regions), charById = U.byId(R.characters), metaById = U.byId(R.books);
  var monsterByName = {};
  (R.monsters || []).forEach(function (m) { if (!monsterByName[m.name]) monsterByName[m.name] = m; });

  var BOOKS = {
    "101": { meta: "monster-101", short: "총해록", src: "《오우거도 알아듣는 마물 101종 총해록》 발췌" },
    romance: { meta: "romance", short: "연애록", src: "《노바카사와 21명의 마물 연애록》 발췌" },
    rift: { meta: "rift", short: "균열 문헌", src: "《신이 없는 세계의 신, 그리고 균열》 발췌" },
    maghi: { meta: "maghi", short: "마그히", src: "《산적 마그히와 대해》 발췌" },
  };

  /* ── 책 만들기: 항목 목록. 0번은 언제나 목차 ── */
  var monsterEntries = function (kind) {
    var list = (R.monsters || []).filter(function (m) { return m.book === kind; }).sort(function (a, b) {
      return (a.no || 0) - (b.no || 0) || GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade);
    });
    return list.map(function (m, i) {
      var open = U.isOpen(m);
      var unit = kind === "101" && m.no ? "제" + m.no + "항" : kind === "romance" ? "제" + (i + 1) + "장" : "단편 " + (i + 1);
      return { id: m.id, m: m, unit: unit, art: U.art.monster(m), toc: open ? m.name : "봉인된 항목", tocSub: open ? m.grade : "", type: "monster" };
    });
  };
  var maghiEntries = function () {
    var out = [];
    (R.regions || []).forEach(function (r, ri) {
      out.push({ id: r.id, r: r, ch: ri + 1, unit: "제" + (ri + 1) + "장", art: U.art.region(r.id), toc: r.name, tocSub: r.cardGrade || "", type: "region" });
      (R.places || []).filter(function (p) { return p.region === r.id; }).sort(function (a, b) { return (a.no || 0) - (b.no || 0); }).forEach(function (p) {
        out.push({ id: "place:" + p.id, p: p, r: r, ch: ri + 1, unit: "제" + (ri + 1) + "장 · " + p.name, art: U.art.place(p), toc: p.name, tocSub: p.grade || "", type: "place", sub: true });
      });
    });
    var stray = (R.places || []).filter(function (p) { return !regionById[p.region]; });
    stray.forEach(function (p) {
      out.push({ id: "place:" + p.id, p: p, r: null, ch: 0, unit: "주인 없는 땅 · " + p.name, art: U.art.place(p), toc: p.name, tocSub: p.grade || "", type: "place" });
    });
    return out;
  };
  var build = function (kind) {
    var entries = kind === "maghi" ? maghiEntries() : monsterEntries(kind);
    var meta = metaById[BOOKS[kind].meta] || {};
    return [{ id: "", type: "toc", unit: "목차", art: kind === "maghi" ? U.MAP : U.art.book(kind), meta: meta }].concat(entries);
  };

  /* ── 쪽 그리기 ── */
  var folio = function (n) { return '<p class="bk-folio">' + n + "</p>"; };
  var ladder = function (g) {
    if (g === "???") return '<p class="bk-unmeasured"><b>???</b> 위험도를 잰 사람이 없습니다</p>';
    return '<div class="bk-ladder" aria-label="위험도 ' + esc(g) + '">' + GRADES.map(function (x) {
      return '<span class="' + (x === g ? (/^S/.test(x) ? "on high" : "on") : "") + '"' + (x === g ? ' aria-current="true"' : ' aria-hidden="true"') + ">" + x + "</span>";
    }).join("") + "</div>";
  };
  var drawnPlate = function (m) {
    return '<div class="plate-card"><div class="plate-frame"><div class="crest" aria-hidden="true">' + (m.book === "romance" ? "❀" : CREST[m.family] || "✶") + "</div>" +
      "<h3>" + esc(m.quoted ? "‘" + m.name + "’" : m.name) + "</h3>" + (m.en ? '<p class="en">' + esc(m.en) + "</p>" : "") +
      '<div class="risk"><span>위험도</span><strong class="' + U.gradeClass(m.grade) + '">' + esc(m.grade) + "</strong></div></div></div>";
  };
  // 대륙 지도의 한 조각. 지역 위치에 붉은 동그라미
  var locator = function (r) {
    if (!r || !r.map) return "";
    var W = 168, H = 108, S = 680, SH = S * 1686 / 2528;
    var px = S * r.map.x / 100, py = SH * r.map.y / 100;
    var bx = Math.min(0, Math.max(W - S, W / 2 - px)), by = Math.min(0, Math.max(H - SH, H / 2 - py));
    return '<div class="bk-loc" role="img" aria-label="대륙 지도에서 ' + esc(r.name) + '의 위치" style="background-position:' + bx.toFixed(1) + "px " + by.toFixed(1) + 'px"><i style="left:' + (px + bx).toFixed(1) + "px;top:" + (py + by).toFixed(1) + 'px"></i></div>';
  };
  var monsterLinks = function (r) {
    return (r.monsters || []).map(function (x) {
      var hit = monsterByName[x.name];
      var label = esc(x.name) + " <small>" + esc(x.grade) + "</small>";
      return hit && U.isOpen(hit) ? '<a href="bestiary.html#' + esc(hit.id) + '">' + label + "</a>" : "<span>" + label + "</span>";
    }).join(" · ");
  };
  var peopleLinks = function (ids) {
    return (ids || []).filter(function (id) { return charById[id]; }).map(function (id) {
      return '<a href="guild.html#' + esc(id) + '">' + esc(charById[id].name) + "</a>";
    }).join(" · ");
  };

  var page = {
    toc: function (e, side, b) {
      var meta = e.meta, entries = b.entries;
      var title = '<span class="bk-orn" aria-hidden="true"></span><p class="bk-kicker">' + esc(meta.scope || "") + '</p><h2 class="bk-title bk-cover-title">' + esc(meta.title || BOOKS[b.kind].short) + "</h2>" +
        (meta.line ? '<blockquote class="bk-quote">“' + esc(meta.line) + "”</blockquote>" : "");
      var last = b.last > 0 && b.last < entries.length ? '<p class="bk-resume"><button type="button" data-goto="' + b.last + '">지난번에 덮은 곳: ' + esc(entries[b.last].unit) + " " + esc(entries[b.last].toc) + " →</button></p>" : "";
      var count = '<p class="bk-count">' + (b.kind === "maghi" ? (R.regions || []).length + "장, 장소 " + (R.places || []).length + "곳" : (entries.length - 1) + "종") + "이 실려 있습니다.</p>";
      var list = '<p class="bk-kicker">목차</p><ol class="bk-toc' + (b.kind === "maghi" ? " maghi" : "") + '">' + entries.slice(1).map(function (x, i) {
        return '<li class="' + (x.sub ? "sub" : "") + '"><button type="button" data-goto="' + (i + 1) + '"><span class="u">' + esc(x.type === "place" ? "" : x.unit) + "</span><span class=\"n\">" + esc(x.toc) + '</span><span class="g">' + esc(x.tocSub) + "</span></button></li>";
      }).join("") + "</ol>";
      if (side === "left") return title + count + last + folio("i");
      if (side === "right") return list + folio("ii");
      return title + count + last + list;
    },
    monster: function (e, side, b, i) {
      var m = e.m, bk = BOOKS[b.kind];
      if (!U.isOpen(m)) {
        var sealL = '<p class="bk-kicker">' + esc(e.unit) + '</p><div class="bk-wax" aria-hidden="true"></div><p class="bk-caption">이 장은 밀랍으로 봉해져 있습니다.</p>';
        var sealR = '<p class="bk-kicker">' + esc(e.unit) + '</p><h2 class="bk-title">봉인된 항목</h2>' + U.seal(m, "봉인된 항목");
        return side === "left" ? sealL + folio(i * 2) : side === "right" ? sealR + folio(i * 2 + 1) : sealL + sealR;
      }
      var where = (m.regions || []).filter(function (id) { return regionById[id]; }).map(function (id) { return regionById[id].name; });
      var L = '<p class="bk-kicker">도판 ' + esc(m.no || i) + "</p>" +
        '<figure class="bk-plate">' + (m.image ? '<img src="' + esc(m.image) + '" alt="' + esc(m.name) + ' 도감 카드" width="1200" height="800">' : drawnPlate(m)) + "</figure>" +
        '<p class="bk-caption">도판 ' + esc(m.no || i) + ". " + esc(m.name) + (where.length ? ", " + esc(where.join("·")) : "") + "</p>";
      var whereLinks = (m.regions || []).filter(function (id) { return regionById[id]; }).map(function (id) { return '<a href="atlas.html#' + esc(id) + '">' + esc(regionById[id].name) + "</a>"; }).join(" · ");
      var named = peopleLinks(m.named);
      var Rt = '<p class="bk-kicker">' + esc(e.unit) + " · " + esc(bk.short) + "</p>" +
        '<h2 class="bk-title">' + esc(m.quoted ? "‘" + m.name + "’" : m.name) + "</h2>" + (m.en ? '<p class="bk-en">' + esc(m.en) + "</p>" : "") +
        ladder(m.grade) +
        '<p class="bk-label">상세설명' + (m.draft ? ' <span class="draft-tag">초안</span>' : "") + "</p>" +
        '<p class="bk-line' + (m.quoted ? " quoted" : "") + '">' + esc(m.line) + "</p>" +
        '<dl class="bk-dl"><dt>사는 곳</dt><dd>' + (whereLinks || (b.kind === "rift" ? "균열 주변" : "기록되지 않음")) + "</dd>" +
        (named ? "<dt>알려진 개체</dt><dd>" + named + "</dd>" : "") + "</dl>" +
        '<p class="bk-src">' + esc(bk.src) + ' · <a href="bestiary.html#' + esc(m.id) + '">도감 항목</a></p>';
      return side === "left" ? L + folio(i * 2) : side === "right" ? Rt + folio(i * 2 + 1) : L + Rt;
    },
    region: function (e, side, b, i) {
      var r = e.r, own = b.entries.filter(function (x) { return x.type === "place" && x.r === r; });
      var L = '<p class="bk-kicker">' + esc(e.unit) + " · 지역</p>" +
        '<figure class="bk-tip"><img src="' + esc(e.art) + '" alt="' + esc(r.name) + ' 지역 카드" width="1536" height="1024"></figure>' +
        '<div class="bk-locrow">' + locator(r) + '<p class="bk-caption">' + esc(r.land) + "</p></div>" +
        '<dl class="bk-dl"><dt>다스리는 방식</dt><dd>' + esc(r.rule) + "</dd><dt>사는 이들</dt><dd>" + esc(r.people) + "</dd><dt>중심지</dt><dd>" + esc(r.hub) + "</dd><dt>변경</dt><dd>" + esc(r.edge) + "</dd></dl>";
      var Rt = '<p class="bk-kicker">산적 마그히와 대해 · ' + esc(e.unit) + "</p>" +
        '<h2 class="bk-title">' + esc(r.name) + "</h2>" + '<p class="bk-en">' + esc(r.title) + "</p>" +
        (r.cardGrade ? '<p class="bk-risk"><span>위험도</span><b>' + esc(r.cardGrade) + "</b></p>" : "") +
        '<p class="bk-line">' + esc(r.cardDesc || r.theme) + "</p>" +
        '<p class="bk-danger">✕ ' + esc(r.danger) + "</p>" +
        '<dl class="bk-dl"><dt>이곳의 마물</dt><dd>' + (monsterLinks(r) || "기록되지 않음") + "</dd>" +
        (peopleLinks(r.characters) ? "<dt>이곳의 사람</dt><dd>" + peopleLinks(r.characters) + "</dd>" : "") +
        (own.length ? "<dt>이 장의 장소</dt><dd>" + own.map(function (x) { return '<button type="button" class="bk-inline" data-goto="' + b.entries.indexOf(x) + '">' + esc(x.p.name) + "</button>"; }).join(" · ") + "</dd>" : "") + "</dl>";
      return side === "left" ? L + folio(i * 2) : side === "right" ? Rt + folio(i * 2 + 1) : L + Rt;
    },
    place: function (e, side, b, i) {
      var p = e.p, r = e.r;
      var L = '<p class="bk-kicker">' + esc(KIND[p.kind] || "장소") + "</p>" +
        '<figure class="bk-tip"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + ' 장소 카드" width="1534" height="1024"></figure>' +
        '<div class="bk-locrow">' + locator(r) + '<p class="bk-caption">' + (r ? esc(r.name) + "의 " + esc(KIND[p.kind] || "장소") : "어느 나라에도 속하지 않는 땅") + "</p></div>";
      var back = r ? b.entries.map(function (x) { return x.r === r && x.type === "region"; }).indexOf(true) : -1;
      var Rt = '<p class="bk-kicker">' + (r ? esc(r.name) + " · " : "") + "장소 " + esc(p.no) + "</p>" +
        '<h2 class="bk-title">' + esc(p.name) + "</h2>" +
        '<p class="bk-risk"><span>위험도</span><b>' + esc(p.grade) + "</b></p>" +
        '<p class="bk-line">' + esc(p.desc) + "</p>" +
        (r ? '<dl class="bk-dl"><dt>이 지역의 마물</dt><dd>' + (monsterLinks(r) || "기록되지 않음") + "</dd></dl>" : "") +
        '<p class="bk-src">' + esc(p.source || BOOKS.maghi.src) + (back > -1 ? ' · <button type="button" class="bk-inline" data-goto="' + back + '">' + esc(r.name) + " 장으로</button>" : "") + "</p>";
      return side === "left" ? L + folio(i * 2) : side === "right" ? Rt + folio(i * 2 + 1) : L + Rt;
    },
  };
  var render = function (b, i, side) { var e = b.entries[i]; return page[e.type](e, side, b, i); };

  /* ── 뷰어 틀 ── */
  var dlg, el = {}, B = null, cache = {}, anim = null;
  var wide = function () { return window.matchMedia("(min-width: 900px)").matches; };
  var mount = function () {
    if (dlg) return;
    dlg = document.createElement("dialog");
    dlg.className = "bookv";
    dlg.innerHTML =
      '<div class="bk-art" aria-hidden="true"><i></i><i></i></div>' +
      '<header class="bk-top"><p class="bk-where"><b></b><span></span></p><button type="button" class="bk-close" data-bk="close">닫기</button></header>' +
      '<div class="bk-stage"><div class="bk-book">' +
        '<section class="bk-page left" aria-label="왼쪽 쪽"></section><section class="bk-page right" aria-label="오른쪽 쪽"></section>' +
        '<section class="bk-page single" aria-live="polite"></section>' +
        '<span class="bk-ribbon" aria-hidden="true"></span>' +
      "</div></div>" +
      '<nav class="bk-nav" aria-label="책장 넘기기"><button type="button" data-bk="prev">← <span>앞 장</span></button><button type="button" data-bk="toc">목차</button><button type="button" class="next" data-bk="next"><span>다음 장</span> →</button></nav>' +
      '<p class="bk-hint"></p>';
    document.body.appendChild(dlg);
    el.book = dlg.querySelector(".bk-book");
    el.left = dlg.querySelector(".bk-page.left");
    el.right = dlg.querySelector(".bk-page.right");
    el.single = dlg.querySelector(".bk-page.single");
    el.where = dlg.querySelector(".bk-where");
    el.prev = dlg.querySelector('[data-bk="prev"]');
    el.next = dlg.querySelector('[data-bk="next"]');
    el.hint = dlg.querySelector(".bk-hint");
    el.art = dlg.querySelector(".bk-art").children;
    el.artFront = 0;

    dlg.addEventListener("click", function (e) {
      var t = e.target.closest("[data-bk],[data-goto],a");
      if (!t) return;
      if (t.tagName === "A") { dlg.close(); return; }
      if (t.hasAttribute("data-goto")) { go(+t.getAttribute("data-goto")); return; }
      var a = t.getAttribute("data-bk");
      if (a === "close") dlg.close();
      else if (a === "prev") go(B.i - 1);
      else if (a === "next") go(B.i + 1);
      else if (a === "toc") go(0);
    });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(B.i + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(B.i - 1); }
      else if (e.key === "Home") { e.preventDefault(); go(0); }
      else if (e.key === "End") { e.preventDefault(); go(B.entries.length - 1); }
    });
    dlg.addEventListener("close", function () {
      if (anim) anim.finish(true);
      document.documentElement.classList.remove("bk-lock");
    });
    var lastWide = wide();
    window.addEventListener("resize", function () {
      if (!dlg.open || wide() === lastWide) return;
      lastWide = wide();
      if (anim) anim.finish(true);
      fill();
    });
    swipe();
  };

  var setArt = function (src) {
    var next = el.art[1 - el.artFront], prev = el.art[el.artFront];
    if (next.getAttribute("data-src") === src && next.classList.contains("on")) return;
    if (prev.getAttribute("data-src") === src) return;
    next.setAttribute("data-src", src);
    next.style.backgroundImage = "url(" + src + ")";
    next.classList.add("on"); prev.classList.remove("on");
    el.artFront = 1 - el.artFront;
  };
  var chrome = function () {
    var e = B.entries[B.i], n = B.entries.length;
    el.where.querySelector("b").textContent = (metaById[BOOKS[B.kind].meta] || {}).title || BOOKS[B.kind].short;
    el.where.querySelector("span").textContent = B.i ? " · " + e.unit + (e.type === "monster" ? " " + (U.isOpen(e.m) ? e.m.name : "봉인된 항목") : "") : " · 목차";
    el.prev.disabled = B.i <= 0;
    el.next.disabled = B.i >= n - 1;
    var pe = B.entries[B.i - 1], ne = B.entries[B.i + 1];
    el.prev.querySelector("span").textContent = pe ? (pe.type === "toc" ? "목차" : pe.toc) : "앞 장";
    el.next.querySelector("span").textContent = ne ? ne.toc : "다음 장";
    el.hint.textContent = wide() ? "← → 키로 넘기고, Esc로 덮습니다." : "옆으로 밀어 넘깁니다.";
    setArt(e.art);
    if (B.i > 0) { U.store.set("raeon.book." + B.kind, String(B.i)); B.last = B.i; }
  };
  var fill = function () {
    el.book.classList.toggle("is-wide", wide());
    el.book.classList.toggle("is-toc", B.i === 0);
    if (wide()) {
      el.left.innerHTML = render(B, B.i, "left");
      el.right.innerHTML = render(B, B.i, "right");
      el.left.scrollTop = el.right.scrollTop = 0;
    } else {
      el.single.innerHTML = render(B, B.i, "single");
      el.single.scrollTop = 0;
    }
    chrome();
  };

  /* ── 책장 넘기기 ──
     넓은 화면 앞으로: 오른쪽 쪽이 등을 축으로 왼쪽으로 넘어간다(앞면=지금 오른쪽, 뒷면=다음 왼쪽).
     넓은 화면 뒤로: 왼쪽 쪽이 오른쪽으로 넘어온다(앞면=지금 왼쪽, 뒷면=앞 장 오른쪽).
     좁은 화면: 한 장이 왼쪽으로 넘어가 사라지거나(앞으로), 왼쪽에서 넘어와 덮는다(뒤로). */
  var DUR = 600;
  var turn = function (to) {
    var from = B.i, dir = to > from ? 1 : -1, W = wide();
    var leaf = document.createElement("div");
    leaf.className = "bk-leaf " + (W ? (dir > 0 ? "on-right" : "on-left") : "on-single");
    var front = document.createElement("div"), back = document.createElement("div");
    front.className = "bk-face front bk-page " + (W ? (dir > 0 ? "right" : "left") : "single");
    back.className = "bk-face back bk-page " + (W ? (dir > 0 ? "left" : "right") : "single blank");
    var a0, a1;
    if (W) {
      front.innerHTML = render(B, from, dir > 0 ? "right" : "left");
      back.innerHTML = render(B, to, dir > 0 ? "left" : "right");
      a0 = 0; a1 = dir > 0 ? -180 : 180;
      (dir > 0 ? el.right : el.left).innerHTML = render(B, to, dir > 0 ? "right" : "left");
    } else if (dir > 0) {
      front.innerHTML = render(B, from, "single");
      a0 = 0; a1 = -180;
      el.single.innerHTML = render(B, to, "single");
    } else {
      front.innerHTML = render(B, to, "single");
      a0 = -180; a1 = 0;
    }
    leaf.appendChild(front); leaf.appendChild(back);
    el.book.appendChild(leaf);
    var p = 0, done = false;
    var set = function (q, ms) {
      p = q;
      leaf.style.transition = ms ? "transform " + ms + "ms cubic-bezier(.45,.05,.25,1)" : "none";
      leaf.style.transform = "rotateY(" + (a0 + (a1 - a0) * q) + "deg)";
      leaf.style.setProperty("--p", String(Math.sin(Math.PI * q).toFixed(3)));
    };
    var cleanup = function () { if (leaf.parentNode) leaf.parentNode.removeChild(leaf); anim = null; };
    var commit = function () {
      B.i = to;
      el.book.classList.toggle("is-toc", to === 0);
      if (W) (dir > 0 ? el.left : el.right).innerHTML = render(B, to, dir > 0 ? "left" : "right");
      else if (dir < 0) el.single.innerHTML = render(B, to, "single");
      el.left.scrollTop = el.right.scrollTop = el.single.scrollTop = 0;
    };
    var ctl = {
      set: set,
      finish: function (now) {
        if (done) return; done = true;
        chromeFor(to);
        if (now) { commit(); cleanup(); return; }
        var ms = Math.max(160, DUR * (1 - p));
        set(1, ms);
        setTimeout(function () { commit(); cleanup(); }, ms + 20);
      },
      cancel: function () {
        if (done) return; done = true;
        var ms = Math.max(140, DUR * p * .8);
        set(0, ms);
        setTimeout(function () {
          if (W) (dir > 0 ? el.right : el.left).innerHTML = render(B, from, dir > 0 ? "right" : "left");
          else if (dir > 0) el.single.innerHTML = render(B, from, "single");
          cleanup();
        }, ms + 20);
      },
    };
    set(0, 0);
    anim = ctl;
    return ctl;
  };
  var chromeFor = function (to) { var keep = B.i; B.i = to; chrome(); B.i = keep; };

  var go = function (to) {
    if (!B || to < 0 || to >= B.entries.length || to === B.i) return;
    if (anim) anim.finish(true);
    if (U.reduced()) {
      el.book.classList.remove("fade"); void el.book.offsetWidth; el.book.classList.add("fade");
      B.i = to; fill(); return;
    }
    var c = turn(to);
    requestAnimationFrame(function () { requestAnimationFrame(function () { c.finish(false); }); });
  };

  // 옆으로 밀기: 손가락을 따라 책장이 넘어가고, 놓으면 마저 넘어가거나 되돌아온다
  var swipe = function () {
    var stage = dlg.querySelector(".bk-stage"), sx = 0, sy = 0, ctl = null, dir = 0, width = 1, live = false, dragged = 0;
    // 밀어 넘긴 손가락이 놓인 자리의 단추가 눌리지 않게
    stage.addEventListener("click", function (e) { if (Date.now() - dragged < 400) { e.stopPropagation(); e.preventDefault(); } }, true);
    stage.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || (e.pointerType === "mouse" && e.target.closest("button,a"))) return;
      sx = e.clientX; sy = e.clientY; live = true; ctl = null; dir = 0;
      width = (wide() ? el.right : el.single).getBoundingClientRect().width || 1;
    });
    stage.addEventListener("pointermove", function (e) {
      if (!live) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (!ctl) {
        if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy) * 1.2) { if (Math.abs(dy) > 12) live = false; return; }
        dir = dx < 0 ? 1 : -1;
        var to = B.i + dir;
        if (to < 0 || to >= B.entries.length || U.reduced()) { live = false; return; }
        if (anim) anim.finish(true);
        ctl = turn(to);
        el.book.classList.add("dragging");
        try { window.getSelection().removeAllRanges(); } catch (err) {}
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
      }
      var q = Math.max(0, Math.min(1, (dir > 0 ? -dx : dx) / (width * 1.1)));
      ctl.set(q, 0);
    });
    var end = function (e) {
      if (!live) return;
      live = false;
      if (!ctl) {
        // 움직임 줄이기 설정에서는 짧게 민 것도 넘김으로 친다
        var dx = e.clientX - sx;
        if (U.reduced() && Math.abs(dx) > 50) go(B.i + (dx < 0 ? 1 : -1));
        return;
      }
      var dx2 = e.clientX - sx, q = Math.abs(dx2) / (width * 1.1);
      if (q > .28) ctl.finish(false); else ctl.cancel();
      ctl = null; dragged = Date.now();
      el.book.classList.remove("dragging");
    };
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", function () { if (ctl) ctl.cancel(); ctl = null; live = false; el.book.classList.remove("dragging"); });
  };

  var open = function (kind, at) {
    if (!BOOKS[kind]) return;
    mount();
    if (!cache[kind]) cache[kind] = { kind: kind, entries: build(kind), i: 0, last: 0 };
    B = cache[kind];
    var saved = +(U.store.get("raeon.book." + kind) || 0);
    B.last = saved;
    var idx = 0;
    if (at) B.entries.forEach(function (e, n) { if (e.id === at) idx = n; });
    B.i = idx;
    dlg.classList.toggle("maghi", kind === "maghi");
    dlg.setAttribute("aria-label", ((metaById[BOOKS[kind].meta] || {}).title || BOOKS[kind].short) + " 책 보기");
    fill();
    document.documentElement.classList.add("bk-lock");
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    dlg.classList.remove("opening"); void dlg.offsetWidth; dlg.classList.add("opening");
    el.next.focus();
  };

  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-book-open]");
    if (!t) return;
    e.preventDefault();
    open(t.getAttribute("data-book-open"), t.getAttribute("data-book-at") || "");
  });

  R.book = { open: open };
})();
