(function () {
  "use strict";
  var root = document.documentElement;
  var mem = function (area) {
    return {
      get: function (k) { try { return window[area].getItem(k); } catch (e) { return null; } },
      set: function (k, v) { try { window[area].setItem(k, v); } catch (e) {} },
      del: function (k) { try { window[area].removeItem(k); } catch (e) {} },
    };
  };
  var local = mem("localStorage");
  var session = mem("sessionStorage");

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  };
  // 받침이 있으면 b, 없으면 a. 예: josa("레이나", "와", "과") → "와"
  var josa = function (word, a, b) {
    var last = String(word).replace(/[^가-힣0-9]+$/, "").slice(-1);
    if (!last) return a;
    if (/[0-9]/.test(last)) return "013678".indexOf(last) !== -1 ? b : a;
    var code = last.charCodeAt(0) - 0xac00;
    return code >= 0 && code <= 11171 && code % 28 ? b : a;
  };

  /* ── 열람 기록: 열어 본 기밀, 펼쳐 둔 기록, 열람한 인물과 문서를 이 기기에 남긴다 ── */
  var readSet = function (key) {
    try { var v = JSON.parse(local.get(key) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  };
  var opened = readSet("blackout.open");
  var seenList = readSet("blackout.seen");
  var confirmed = local.get("blackout.ok") === "1";
  var saveOpen = function () { local.set("blackout.open", JSON.stringify(opened)); };
  var isOpen = function (key) { return opened.indexOf(key) !== -1; };
  var setOpen = function (key, on) {
    var i = opened.indexOf(key);
    if (on && i === -1) opened.push(key);
    if (!on && i !== -1) opened.splice(i, 1);
    saveOpen();
  };
  var seen = {
    has: function (kind, id) { return seenList.indexOf(kind + ":" + id) !== -1; },
    add: function (kind, id) {
      if (seenList.indexOf(kind + ":" + id) !== -1) return;
      seenList.push(kind + ":" + id);
      local.set("blackout.seen", JSON.stringify(seenList));
    },
  };

  /* ── 가려진 기록 ──
     내부용(lv 1)은 누르면 바로 펼쳐진다.
     기밀(lv 2)은 경고를 띄우고, "확인"을 한 번 입력한 뒤로는 바로 열린다. */
  var uid = 0;
  var ICON_DOWN = '<svg class="rec-ico" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>';
  var ICON_LOCK = '<svg class="rec-ico" width="16" height="16" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="2" y="5.5" width="8" height="5.5" rx="1"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5"/></svg>';

  // it: { lv, key, topic, text, owner, about }  about 은 경고창 첫 문장을 통째로 바꿀 때 쓴다. owner 는 "천시온의", "「칠월의 밤」 문서의" 처럼 '의'까지 붙인 말
  var rec = function (it) {
    var open = isOpen(it.key);
    var id = "rb-" + (++uid);
    var secret = it.lv === 2;
    var verb = open ? "접기" : secret ? "눌러서 열람" : "펼치기";
    return '<div class="rec' + (open ? " open" : "") + '" data-lv="' + it.lv + '" data-key="' + esc(it.key) + '"' +
      ' data-topic="' + esc(it.topic) + '" data-owner="' + esc(it.owner || "") + '"' + (it.about ? ' data-about="' + esc(it.about) + '"' : "") + ">" +
      '<button class="rec-tab" type="button" aria-expanded="' + open + '" aria-controls="' + id + '"' + (secret ? ' aria-haspopup="dialog"' : "") + ">" +
        '<span class="rec-grade">' + (secret ? "기밀" : "내부") + "</span>" +
        '<span class="rec-topic">' + esc(it.topic) + "</span>" +
        '<span class="rec-verb">' + verb + "</span>" + (secret && !open ? ICON_LOCK : ICON_DOWN) +
      "</button>" +
      '<div class="rec-body" id="' + id + '"' + (open ? "" : " hidden") + "><p>" + esc(it.text) + "</p>" +
        (secret ? '<span class="rec-stamps" aria-hidden="true"><i class="st-secret">기밀</i><i class="st-ok">열람 승인</i></span>' : "") +
      "</div></div>";
  };
  // 기록 묶음. list 는 [{topic,text}] 두 갈래를 받아 내부용 → 기밀 순서로 놓는다.
  var records = function (internal, secret, ns, owner) {
    var all = [];
    (internal || []).forEach(function (it, i) { all.push({ lv: 1, key: ns + ":i" + i, topic: it.topic, text: it.text, owner: owner }); });
    (secret || []).forEach(function (it, i) { all.push({ lv: 2, key: ns + ":s" + i, topic: it.topic, text: it.text, owner: owner }); });
    return all;
  };
  var hiddenSection = function (list, opts) {
    opts = opts || {};
    if (!list.length) {
      return opts.quietIfEmpty ? "" : '<section class="hidden-recs empty-recs"><h2>가려진 기록</h2><p>이 기록철에는 가려진 기록이 없습니다.</p></section>';
    }
    return '<section class="hidden-recs" aria-label="가려진 기록">' +
      '<header><h2>가려진 기록 ' + list.length + "건</h2>" +
      "<p>내부 기록은 누르면 펼쳐집니다. 기밀은 경고를 읽고 확인을 입력해야 열립니다.</p></header>" +
      '<div class="rec-grid">' + list.map(rec).join("") + "</div></section>";
  };

  var toggleRec = function (box, on, fresh) {
    var tab = box.querySelector(".rec-tab");
    var body = box.querySelector(".rec-body");
    var secret = box.dataset.lv === "2";
    box.classList.toggle("open", on);
    box.classList.toggle("just", !!(on && fresh && secret));
    tab.setAttribute("aria-expanded", String(on));
    body.hidden = !on;
    tab.querySelector(".rec-verb").textContent = on ? "접기" : secret ? "눌러서 열람" : "펼치기";
    var ico = tab.querySelector(".rec-ico");
    if (ico) ico.outerHTML = secret && !on ? ICON_LOCK : ICON_DOWN;
    setOpen(box.dataset.key, on);
  };

  /* 기밀 경고창. 페이지마다 하나만 만든다. */
  var sheet = null, pending = null, lastFocus = null;
  var buildSheet = function () {
    if (sheet) return sheet;
    sheet = document.createElement("dialog");
    sheet.className = "warn-sheet";
    sheet.setAttribute("aria-labelledby", "warn-title");
    sheet.innerHTML =
      '<form method="dialog" class="warn-in" novalidate>' +
        '<span class="stamp-secret" aria-hidden="true">기밀</span>' +
        '<h2 id="warn-title">기밀 기록을 엽니다</h2>' +
        '<p class="warn-about" id="warn-about"></p>' +
        '<label for="warn-input">열람하려면 아래 칸에 <b>확인</b>이라고 입력하세요.</label>' +
        '<input id="warn-input" name="ok" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" aria-describedby="warn-about warn-err">' +
        '<p class="warn-err" id="warn-err" aria-live="polite"></p>' +
        '<p class="warn-note">한 번 입력하면 이 기기에서는 다른 기밀도 입력 없이 바로 열립니다.</p>' +
        '<div class="warn-acts"><button type="button" class="btn" data-warn="close">닫기</button>' +
        '<button type="submit" class="btn solid" value="ok">열람하기</button></div>' +
      "</form>";
    document.body.appendChild(sheet);
    var input = sheet.querySelector("#warn-input");
    var err = sheet.querySelector("#warn-err");
    var shut = function () { if (sheet.open) sheet.close(); };
    sheet.querySelector("[data-warn=close]").addEventListener("click", shut);
    // 한글은 입력이 조합되므로 글자마다 검사하지 않고 열람 단추를 누를 때 한 번만 비교한다
    sheet.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      if (input.value.replace(/\s+/g, "") !== "확인") {
        err.textContent = "확인 두 글자를 입력해야 열립니다.";
        input.focus();
        return;
      }
      confirmed = true;
      local.set("blackout.ok", "1");
      var box = pending;
      pending = null;
      shut();
      if (box) toggleRec(box, true, true);
    });
    // 바깥 어두운 곳을 누르면 닫는다
    sheet.addEventListener("click", function (e) { if (e.target === sheet) shut(); });
    sheet.addEventListener("close", function () {
      input.value = ""; err.textContent = "";
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    });
    return sheet;
  };
  var askSecret = function (box) {
    var dlg = buildSheet();
    pending = box;
    lastFocus = box.querySelector(".rec-tab");
    var owner = box.dataset.owner;
    dlg.querySelector("#warn-about").textContent = (box.dataset.about ||
      "이 기록은 " + (owner ? owner + " " : "") + "「" + box.dataset.topic + "」에 관한 기밀입니다.") +
      " 대화에서 직접 알아내고 싶다면 열지 마세요.";
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    dlg.querySelector("#warn-input").focus();
  };

  document.addEventListener("click", function (e) {
    var tab = e.target.closest ? e.target.closest(".rec-tab") : null;
    if (!tab) return;
    var box = tab.parentNode;
    var on = !box.classList.contains("open");
    if (on && box.dataset.lv === "2" && !confirmed) { askSecret(box); return; }
    toggleRec(box, on, on);
  });

  /* ── 대화 버튼: 설정에 등록된 플랫폼만 보여 준다 ── */
  var fillChat = function (slot) {
    var list = (window.SITE && window.SITE.chat) || [];
    var who = slot.getAttribute("data-chat-with");
    slot.textContent = "";
    if (!list.length) {
      var off = document.createElement("button");
      off.className = "btn"; off.type = "button"; off.disabled = true;
      off.textContent = "대화 링크 준비 중";
      slot.appendChild(off);
      return;
    }
    list.forEach(function (p, i) {
      var a = document.createElement("a");
      a.className = "btn go" + (i === 0 ? " solid" : "");
      a.href = p.url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = who ? p.name + "에서 " + who + josa(who, "와", "과") + " 대화하기" : p.name + "에서 대화하기";
      slot.appendChild(a);
    });
  };
  Array.prototype.forEach.call(document.querySelectorAll("[data-chat]"), fillChat);

  /* ── 목차: 지금 보는 구획 표시 ── */
  var links = Array.prototype.slice.call(document.querySelectorAll(".rail a[href^='#']"));
  if (links.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    links.forEach(function (l) {
      var t = document.getElementById(l.getAttribute("href").slice(1));
      if (t) io.observe(t);
    });
  }

  /* ── 주 메뉴: 모든 페이지가 같은 목록을 쓴다. 세 번째 값은 좁은 하단 탭에 쓰는 짧은 이름 ── */
  var NAV = [
    ["index.html", "메인", "메인", "main"],
    ["world.html", "세계관", "세계관", "world"],
    ["characters.html", "인물", "인물", "characters"],
    ["webtoon.html", "웹툰", "웹툰", "webtoon"],
    ["timeline.html", "연표와 지도", "연표·지도", "timeline"],
  ];
  var page = document.body.getAttribute("data-page");
  Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (el) {
    var short = el.classList.contains("tabbar");
    el.innerHTML = NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (n[3] === page ? ' aria-current="page"' : "") + ">" + (short ? n[2] : n[1]) + "</a>";
    }).join("");
  });

  /* ── 열람 기록 지우기 ── */
  Array.prototype.forEach.call(document.querySelectorAll("[data-forget]"), function (btn) {
    btn.addEventListener("click", function () {
      if (!window.confirm("열어 본 기밀과 열람 표시를 모두 지웁니다. 다음부터 기밀을 열 때 다시 확인을 입력해야 합니다.")) return;
      ["blackout.open", "blackout.seen", "blackout.ok"].forEach(local.del);
      session.del("blackout.gate");
      location.reload();
    });
  });

  /* ── 페이지 공통 도우미 ── */
  var charById = {};
  (window.CHARACTERS || []).forEach(function (c) { charById[c.id] = c; });
  // 인물 이름 목록. 누르면 인물 기록으로 간다
  var people = function (ids) {
    var list = (ids || []).filter(function (id) { return charById[id]; });
    if (!list.length) return "";
    return '<ul class="people">' + list.map(function (id) {
      return '<li><a href="characters.html#' + id + '">' + esc(charById[id].name) + "</a></li>";
    }).join("") + "</ul>";
  };
  // 용지 위에 쓸 고유색. 밝은 색은 용지에서 읽히도록 어둡게 내린다
  var inkOn = function (hex, bg) {
    var rgb = function (h) { h = h.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); };
    var lum = function (c) {
      var v = c.map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
      return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    };
    var c = rgb(hex), b = lum(rgb(bg || "#E7E3D6"));
    for (var k = 0; k < 20; k++) {
      if ((b + 0.05) / (lum(c) + 0.05) >= 4.6) break;
      c = c.map(function (x) { return Math.round(x * 0.9); });
    }
    return "#" + c.map(function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
  };

  /* ── 핵심어와 용어 설명 창 ──
     본문의 핵심어에 색을 준다. 한 문단에서 같은 말은 처음 한 번만.
     world.js 의 TERMS 에 정의가 있는 말은 누르면 설명 창이 열리는 단추가 되고, 없는 말은 색만 칠한다. */
  var KW = [
    ["칠월의 밤", ""], ["침식의 5단계", "r"], ["침식", "r"], ["마모", "r"], ["회색 구역", "r"], ["이계 균류", "r"],
    ["왕명", ""], ["칠좌", ""], ["경계인", ""], ["임시 봉합", ""], ["랭킹제", "b"], ["휴전", "b"], ["종전", "b"], ["만기", "b"],
    ["4,172명", "r"], ["340미터의 흉터", ""], ["안전파", "b"], ["이윤파", "b"], ["진화파", "b"], ["위협 등급", "b"], ["판정위원회", "b"], ["홍보팀", "b"], ["파스텔 구역", ""], ["녹 구역", "r"],
  ];
  var termByName = {};
  (window.TERMS || []).forEach(function (t) { termByName[t.term] = t; });
  var kwTag = function (word, tone) {
    var cls = "kw" + (tone ? " " + tone : "");
    return termByName[word]
      ? '<button type="button" class="' + cls + ' term" data-term="' + esc(word) + '" aria-haspopup="dialog">' + word + "</button>"
      : '<em class="' + cls + '">' + word + "</em>";
  };
  // html 은 esc 를 거친 문단. 표시한 말은 자리표로 바꿔 두었다가 마지막에 되돌려서, 겹쳐 표시하지 않는다
  var mark = function (html) {
    var held = [];
    KW.forEach(function (k) {
      var i = html.indexOf(k[0]);
      if (i === -1) return;
      var end = i + k[0].length;
      var tag = kwTag(k[0], k[1]);
      // 단추는 줄바꿈이 끊기는 자리라서, 뒤에 붙은 조사가 다음 줄로 혼자 넘어가지 않게 묶는다
      if (termByName[k[0]]) {
        var tail = (html.slice(end).match(/^[가-힣]{1,3}/) || [""])[0];
        tag = '<span class="kw-w">' + tag + tail + "</span>";
        end += tail.length;
      }
      held.push(tag);
      html = html.slice(0, i) + "\u0001" + (held.length - 1) + "\u0002" + html.slice(end);
    });
    return html.replace(/\u0001(\d+)\u0002/g, function (m, n) { return held[+n]; });
  };
  // 정적인 화면(메인의 네 장면)에 박아 둔 핵심어도 정의가 있으면 단추로 바꾼다
  Array.prototype.forEach.call(document.querySelectorAll("em.kw"), function (em) {
    var word = em.textContent;
    if (!termByName[word]) return;
    var tone = em.classList.contains("r") ? "r" : em.classList.contains("b") ? "b" : "";
    var wrap = document.createElement("span");
    wrap.className = "kw-w";
    wrap.innerHTML = kwTag(esc(word), tone);
    var next = em.nextSibling;
    var tail = next && next.nodeType === 3 ? (next.data.match(/^[가-힣]{1,3}/) || [""])[0] : "";
    if (tail) { next.data = next.data.slice(tail.length); wrap.appendChild(document.createTextNode(tail)); }
    em.parentNode.replaceChild(wrap, em);
  });

  var termSheet = null, termFrom = null;
  var docTitle = function (id) {
    var d = (window.WORLD || []).filter(function (x) { return x.id === id; })[0];
    return d ? d.title : "";
  };
  var buildTermSheet = function () {
    if (termSheet) return termSheet;
    termSheet = document.createElement("dialog");
    termSheet.className = "term-sheet";
    termSheet.setAttribute("aria-labelledby", "term-title");
    termSheet.innerHTML =
      '<div class="term-in">' +
        '<p class="term-kicker mono">용어 설명</p>' +
        '<h2 id="term-title"></h2>' +
        '<p class="term-def" id="term-def"></p>' +
        '<p class="term-doc"></p>' +
        '<button type="button" class="btn term-close">닫기</button>' +
      "</div>";
    termSheet.setAttribute("aria-describedby", "term-def");
    document.body.appendChild(termSheet);
    var shut = function () { if (termSheet.open) termSheet.close(); };
    termSheet.querySelector(".term-close").addEventListener("click", shut);
    termSheet.addEventListener("click", function (e) {
      if (e.target === termSheet) shut();
      // 같은 페이지 안의 문서로 가는 링크는 창을 닫고 이동한다
      if (e.target.closest && e.target.closest(".term-doc a")) shut();
    });
    termSheet.addEventListener("close", function () {
      if (termFrom && document.contains(termFrom)) termFrom.focus();
    });
    return termSheet;
  };
  var openTerm = function (btn) {
    var t = termByName[btn.getAttribute("data-term")];
    if (!t) return;
    var dlg = buildTermSheet();
    termFrom = btn;
    dlg.querySelector("#term-title").textContent = t.term;
    dlg.querySelector("#term-def").textContent = t.def;
    var title = docTitle(t.doc);
    var here = page === "world" && location.hash === "#" + t.doc;
    var ARROW = '<svg class="go-ico" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 7h9M8 3.5 11.5 7 8 10.5"/></svg>';
    dlg.querySelector(".term-doc").innerHTML = !title ? "" : here
      ? "지금 읽고 있는 문서에서 설명하는 말입니다."
      : '<a class="go" href="world.html#' + esc(t.doc) + '">문서 「' + esc(title) + "」 읽기" + ARROW + "</a>";
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    dlg.querySelector(".term-close").focus();
  };
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("button.term") : null;
    if (btn) openTerm(btn);
  });

  window.BLACKOUT = {
    local: local, session: session,
    esc: esc, josa: josa, people: people, charById: charById,
    rec: rec, records: records, hiddenSection: hiddenSection,
    seen: seen, inkOn: inkOn, fillChat: fillChat, mark: mark,
  };
  root.classList.add("js");
})();
