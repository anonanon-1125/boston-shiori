// =============================================================
//  栞の描画（ふつうは触らなくてOK）
//  文章と予定は plan.js、写真は photos.js にあります。
// =============================================================
(function () {
  "use strict";

  var DOW = ["日", "月", "火", "水", "木", "金", "土"];
  var TAG_CLASS = { "無料": "free", "要予約": "book", "要確認": "check", "元気なら": "maybe", "未定": "tbd", "チーズ": "cheese" };
  var problems = [];

  // ---------- 小さな道具 ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function toDate(md) {
    var p = String(md).split("-").map(Number);
    if (p.length !== 2 || !p[0] || !p[1]) throw new Error("日付は \"11-07\" のように書いてください（いま: " + md + "）");
    return new Date(TRIP.year, p[0] - 1, p[1]);
  }
  function key(d) { return pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function md(d) { return d.getMonth() + 1 + "/" + d.getDate(); }
  function dowOf(d) { return DOW[d.getDay()]; }
  function dowClass(d) { return d.getDay() === 0 ? "sun" : d.getDay() === 6 ? "sat" : ""; }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
  function between(d, a, b) { return d >= a && d <= b; }

  function rangeLabel(a, b) {
    var A = toDate(a), s = md(A) + "(" + dowOf(A) + ")";
    if (!b) return s;
    var B = toDate(b);
    return s + "–" + (B.getMonth() === A.getMonth() ? B.getDate() : md(B)) + "(" + dowOf(B) + ")";
  }
  function icon(name, cls) {
    return '<svg class="ic' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }
  function extLink(l, cls) {
    if (!l) return "";
    return '<a class="' + (cls || "more") + '" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' +
      esc(l.label || "くわしく") + icon("out") + "</a>";
  }
  function gotoLink(href) {
    var names = { "#portsmouth": "ポーツマスの章へ", "#anniversary": "記念日の章へ", "#spots": "おでかけスポットへ", "#life": "暮らしのメモへ", "#calendar": "カレンダーへ" };
    return '<a class="goto" href="' + esc(href) + '">' + esc(names[href] || "くわしく") + icon("arrow") + "</a>";
  }
  function tagList(list) {
    if (!list || !list.length) return "";
    return '<span class="tags">' + list.map(function (t) {
      return '<span class="tag tag-' + (TAG_CLASS[t] || "plain") + '">' + (t === "チーズ" ? icon("cheese") : "") + esc(t) + "</span>";
    }).join("") + "</span>";
  }
  function photo(name, opt) {
    opt = opt || {};
    var p = PHOTOS[name];
    var cls = "photo" + (opt.cls ? " " + opt.cls : "");
    if (!p) {
      problems.push("photos.js に「" + name + "」という写真がありません");
      return '<figure class="' + cls + ' missing"><div class="ph-img"><span>写真「' + esc(name) + "」がみつかりません</span></div></figure>";
    }
    var img = '<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '"' +
      (opt.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"' +
      (p.pos ? ' style="object-position:' + esc(p.pos) + '"' : "") + ">";
    var cap = opt.caption === false || !p.alt ? "" : "<figcaption>" + esc(p.alt) + "</figcaption>";
    return '<figure class="' + cls + '"><div class="ph-img">' + img + "</div>" + cap + "</figure>";
  }
  function collage(names) {
    if (!names || !names.length) return "";
    return '<div class="collage n' + names.length + '">' + names.map(function (n) { return photo(n); }).join("") + "</div>";
  }
  function route(steps) {
    return '<ol class="route">' + steps.map(function (s) {
      if (s.stop) return '<li class="r-stop"><span class="r-dot"></span><b>' + esc(s.stop) + "</b></li>";
      return '<li class="r-ride line-' + esc(s.line || "navy") + '"><span class="r-bar"></span><span class="r-name">' +
        esc(s.ride) + '</span><span class="r-note">' + (s.note || "") + "</span></li>";
    }).join("") + "</ol>";
  }

  // ---------- 予定に id をつける（カレンダーからのリンク用） ----------
  var firstItemOn = {};
  function prepareItems() {
    var seen = {};
    WEEKS.forEach(function (w) {
      (w.items || []).forEach(function (it, i) {
        var base = it.date ? "d-" + it.date : w.id + "-" + i;
        seen[base] = (seen[base] || 0) + 1;
        it._id = seen[base] > 1 ? base + "-" + seen[base] : base;
        if (!it.date) return;
        var a = toDate(it.date), b = it.to ? toDate(it.to) : a;
        for (var d = a; d <= b; d = addDays(d, 1)) {
          if (!firstItemOn[key(d)]) firstItemOn[key(d)] = it._id;
        }
      });
    });
  }

  // ---------- 表紙 ----------
  function renderCover() {
    var start = toDate(TRIP.start), end = toDate(TRIP.end);
    $("cover-photo").innerHTML = photo(TRIP.cover, { cls: "polaroid", eager: true });
    $("cover-dates").innerHTML = TRIP.year + "." + md(start).replace("/", ".") + "<small>" + dowOf(start) + "</small> – " +
      md(end).replace("/", ".") + "<small>" + dowOf(end) + "</small>";
    var nights = daysBetween(start, end);
    $("cover-nights").innerHTML = nights + "泊<br>" + (nights + 1) + "日";
  }

  // ---------- カレンダー ----------
  function renderCalendar() {
    var start = toDate(TRIP.start), end = toDate(TRIP.end), t = today();
    var marks = {};
    function mark(k) { return marks[k] || (marks[k] = { labels: [], big: false, range: false }); }

    WEEKS.forEach(function (w) {
      (w.items || []).forEach(function (it) {
        if (!it.date || !it.cal) return;
        var a = toDate(it.date), b = it.to && !it.open ? toDate(it.to) : a;
        for (var d = a; d <= b; d = addDays(d, 1)) {
          var m = mark(key(d));
          if (m.labels.indexOf(it.cal) < 0) m.labels.push(it.cal);
          if (it.big) m.big = true;
          if (it.to) m.range = true;
        }
      });
    });
    (TRIP.holidays || []).forEach(function (h) { mark(h.date).holiday = h.label || "祝日"; });

    var html = "";
    var first = new Date(start.getFullYear(), start.getMonth(), 1);
    var last = new Date(end.getFullYear(), end.getMonth(), 1);
    for (var m0 = first; m0 <= last; m0 = new Date(m0.getFullYear(), m0.getMonth() + 1, 1)) {
      var month = m0.getMonth();
      var en = m0.toLocaleString("en-US", { month: "long" });
      html += '<div class="cal-card"><div class="cal-head"><span class="cal-m">' + (month + 1) +
        '<small>月</small></span><span class="cal-en">' + en + " " + m0.getFullYear() + "</span></div>";
      html += '<div class="cal-grid">' + DOW.map(function (w, i) {
        return '<span class="cal-dow ' + (i === 0 ? "sun" : i === 6 ? "sat" : "") + '">' + w + "</span>";
      }).join("");
      for (var b = 0; b < m0.getDay(); b++) html += '<span class="cal-blank"></span>';
      for (var d = new Date(m0); d.getMonth() === month; d = addDays(d, 1)) {
        var k = key(d), mk = marks[k] || { labels: [] };
        var inTrip = between(d, start, end);
        var cls = ["cal-day", inTrip ? "in" : "out", dowClass(d)];
        if (mk.holiday) cls.push("holiday");
        if (mk.big) cls.push("big");
        if (mk.range) cls.push("range");
        if (mk.labels.length) cls.push("has");
        if (+d === +t) cls.push("today");
        var lbl = mk.labels.slice();
        if (mk.holiday && !lbl.length) lbl.push(mk.holiday);
        var inner = '<span class="num">' + d.getDate() + "</span>" +
          (lbl.length ? '<span class="lbl">' + lbl.map(esc).join("<br>") + "</span>" : "") +
          (+d === +t ? '<span class="today-tag">きょう</span>' : "");
        var target = inTrip && firstItemOn[k];
        html += target
          ? '<a class="' + cls.join(" ") + '" href="#' + target + '" aria-label="' + (month + 1) + "月" + d.getDate() + "日の予定" + '">' + inner + "</a>"
          : '<span class="' + cls.join(" ") + '">' + inner + "</span>";
      }
      html += "</div></div>";
    }

    // おもな予定
    var bigs = [];
    WEEKS.forEach(function (w) {
      (w.items || []).forEach(function (it) {
        if (it.big && it.date) bigs.push('<li><a href="#' + it._id + '"><b>' + rangeLabel(it.date, it.to) + "</b>" + esc(it.title) + "</a></li>");
      });
    });
    html += '<div class="cal-key"><p class="hand">おもな予定</p><ul>' + bigs.join("") + "</ul></div>";
    $("cal").innerHTML = html;
  }

  // ---------- 週ごとの予定 ----------
  function whenBox(it) {
    if (!it.date) return '<div class="when free"><span>' + esc(it.when || "").split(/\s+/).join("<br>") + "</span></div>";
    var A = toDate(it.date), B = it.to ? toDate(it.to) : null;
    var top = md(A) + (B ? "–" + (B.getMonth() === A.getMonth() ? B.getDate() : md(B)) : "") + (it.open ? "〜" : "");
    var sub = '<span class="' + dowClass(A) + '">' + dowOf(A) + "</span>" +
      (B ? "–<span class=\"" + dowClass(B) + '">' + dowOf(B) + "</span>" : "");
    return '<div class="when' + (B ? " rng" : "") + '"><span class="md">' + top + '</span><span class="dw">' + sub + "</span>" +
      (it.time ? '<span class="tm">' + esc(it.time) + "</span>" : "") + "</div>";
  }
  function choicesHTML(it) {
    if (!it.choices) return "";
    return '<div class="choices-wrap">' + (it.bubble ? '<p class="bubble small">' + esc(it.bubble) + "</p>" : "") +
      '<div class="choices">' + it.choices.map(function (c) {
        return '<div class="choice">' + (c.photo ? photo(c.photo, { caption: false }) : "") +
          "<h5>" + esc(c.name) + "</h5><p>" + (c.text || "") + "</p>" + extLink(c.link) + "</div>";
      }).join("") + "</div></div>";
  }
  function renderWeeks() {
    var t = today();
    $("week-list").innerHTML = WEEKS.map(function (w) {
      var now = w.from && w.to && between(t, toDate(w.from), toDate(w.to));
      var items = (w.items || []).map(function (it) {
        var isToday = it.date && between(t, toDate(it.date), it.to && !it.open ? toDate(it.to) : toDate(it.date));
        var actions = (it.goto ? gotoLink(it.goto) : "") + extLink(it.link);
        var meta = tagList(it.tags) + actions;
        return '<li class="item' + (isToday ? " is-today" : "") + '" id="' + it._id + '">' + whenBox(it) +
          '<div class="item-body"><h4>' + esc(it.title) + (isToday ? '<span class="today-tag">きょう</span>' : "") + "</h4>" +
          (it.text ? "<p>" + it.text + "</p>" : "") + (it.photo ? photo(it.photo, { cls: "item-photo" }) : "") +
          (meta ? '<div class="meta">' + meta + "</div>" : "") + "</div>" +
          choicesHTML(it) + "</li>";
      }).join("");
      return '<article class="week" id="' + esc(w.id) + '">' +
        '<div class="week-top"><p class="week-tab">' + esc(w.label) + "</p>" +
        (w.from ? '<p class="week-range">' + rangeLabel(w.from, w.to) + "</p>" : "") +
        (now ? '<p class="now-sticker">いまここ</p>' : "") + "</div>" +
        '<h3 class="week-theme">' + esc(w.theme) + "</h3>" +
        (w.lead ? '<p class="week-lead">' + w.lead + "</p>" : "") +
        collage(w.photos) + '<ol class="items">' + items + "</ol></article>";
    }).join("");
  }

  // ---------- ポーツマス ----------
  function renderPortsmouth() {
    var P = PORTSMOUTH;
    $("pt-dates").textContent = rangeLabel(P.from, P.to) + " ・ ニューハンプシャー州";
    var chosen = (P.hotels || []).some(function (h) { return h.chosen; });

    var days = (P.days || []).map(function (day) {
      return '<div class="day"><h4 class="day-head"><span class="day-label">' + esc(day.label) + '</span><span class="day-theme">' +
        esc(day.theme) + '</span></h4><ol class="tl">' + day.rows.map(function (r) {
          var shops = r.shops && P.shops ? '<ul class="shops">' + P.shops.map(function (s) {
            return "<li>" + icon("bag") + "<b>" + esc(s.name) + "</b><span>" + (s.text || "") + "</span></li>";
          }).join("") + "</ul>" : "";
          return '<li class="tl-row' + (r.food ? " food" : "") + '"><span class="tl-time">' + esc(r.time) + '</span><div class="tl-text">' +
            (r.food ? icon("fork") : "") + r.text + shops + "</div></li>";
        }).join("") + "</ol></div>";
    }).join("");

    var food = '<div class="food">' + (P.foodPhoto ? '<div class="food-photo">' + photo(P.foodPhoto) +
      (P.foodBubble ? '<p class="bubble small">' + esc(P.foodBubble) + "</p>" : "") + "</div>" : "") +
      '<ul class="food-list">' + (P.food || []).map(function (f) {
        return '<li><span class="food-when">' + esc(f.when || "") + "</span><b>" + esc(f.name) + "</b><span>" + (f.text || "") + "</span>" + tagList(f.tags) + "</li>";
      }).join("") + "</ul></div>";

    var hotels = !(P.hotels && P.hotels.length) ? "" :
      '<ul class="hotels' + (chosen ? " decided" : "") + '">' + P.hotels.map(function (h) {
        return '<li class="hotel' + (h.chosen ? " chosen" : "") + '">' + (h.chosen ? '<span class="hanko">決定</span>' : "") +
          "<h4>" + icon("bed") + esc(h.name) + "</h4><p>" + (h.text || "") + "</p>" + extLink(h.link) + "</li>";
      }).join("") + "</ul>";

    $("pt").innerHTML =
      '<p class="lead">' + (P.lead || "") + "</p>" + collage(P.photos) +
      '<div class="block"><h3 class="blk">' + icon("bus") + "行き方</h3>" + route(P.route) +
      (P.fare ? '<p class="fare hand">' + esc(P.fare) + "</p>" : "") + "</div>" +
      '<div class="block"><h3 class="blk">' + icon("cal") + "時間割</h3>" + days + "</div>" +
      '<div class="block"><h3 class="blk">' + icon("fork") + "ごはん</h3>" + food + "</div>" +
      (hotels ? '<div class="block"><h3 class="blk">' + icon("bed") + "泊まるところ</h3>" + hotels + "</div>" : "") +
      (P.notes && P.notes.length ? '<div class="sticky"><h3 class="hand">ちゅうい</h3><ul>' + P.notes.map(function (n) { return "<li>" + n + "</li>"; }).join("") + "</ul></div>" : "") +
      (P.links && P.links.length ? '<p class="refs">参考：' + P.links.map(function (l) { return extLink(l); }).join("") + "</p>" : "");
  }

  // ---------- 記念日 ----------
  var CAKE = '<svg class="cake-art" viewBox="0 0 220 180" aria-hidden="true">' +
    '<g class="sp"><path d="M18 40l6-6M14 54h-8M24 66l-6 5M196 34l6-6M204 50h8M196 64l6 5"/></g>' +
    '<ellipse class="plate" cx="110" cy="158" rx="96" ry="14"/>' +
    '<path class="cake-side" d="M36 82v54a74 19 0 0 0 148 0V82"/>' +
    '<path class="cake-band" d="M36 106a74 19 0 0 0 148 0v12a74 19 0 0 1-148 0z"/>' +
    '<g class="cake-berry-in"><ellipse cx="52" cy="115" rx="6" ry="4.5"/><ellipse cx="80" cy="121" rx="6" ry="4.5"/><ellipse cx="110" cy="123" rx="6" ry="4.5"/><ellipse cx="140" cy="121" rx="6" ry="4.5"/><ellipse cx="168" cy="115" rx="6" ry="4.5"/></g>' +
    '<ellipse class="cake-top" cx="110" cy="82" rx="74" ry="19"/>' +
    '<g class="cream"><path d="M46 84c-6-1-7-8-1-10 0-6 9-6 10-1 6 0 7 8 1 10z"/><path d="M76 94c-6-1-7-8-1-10 0-6 9-6 10-1 6 0 7 8 1 10z"/><path d="M110 98c-6-1-7-8-1-10 0-6 9-6 10-1 6 0 7 8 1 10z"/><path d="M144 94c-6-1-7-8-1-10 0-6 9-6 10-1 6 0 7 8 1 10z"/><path d="M174 84c-6-1-7-8-1-10 0-6 9-6 10-1 6 0 7 8 1 10z"/></g>' +
    '<g class="berry"><path d="M44 74c-5-7-3-14 6-14s11 7 6 14c-3 4-9 4-12 0z"/><path d="M74 84c-5-7-3-14 6-14s11 7 6 14c-3 4-9 4-12 0z"/><path d="M108 88c-5-7-3-14 6-14s11 7 6 14c-3 4-9 4-12 0z"/><path d="M142 84c-5-7-3-14 6-14s11 7 6 14c-3 4-9 4-12 0z"/><path d="M172 74c-5-7-3-14 6-14s11 7 6 14c-3 4-9 4-12 0z"/></g>' +
    '<g class="leafs"><path d="M46 61l4 3 4-3M76 71l4 3 4-3M110 75l4 3 4-3M144 71l4 3 4-3M174 61l4 3 4-3"/></g>' +
    '<g class="plaque"><path d="M90 48h44l-2 18H92z"/><text x="112" y="61" text-anchor="middle">11.25</text></g>' +
    "</svg>";

  function renderAnniversary() {
    var A = ANNIVERSARY, d = toDate(A.date);
    var steps = (A.steps || []).map(function (s, i) {
      return '<li class="step' + (s.sun ? " sun" : "") + '"><span class="st-no">' + (s.sun ? icon("sun") : i + 1) + '</span><div class="st-body">' +
        '<p class="st-time">' + esc(s.time) + "</p><h4>" + esc(s.title) + "</h4>" + (s.text ? "<p>" + s.text + "</p>" : "") + "</div></li>";
    }).join("");
    var prep = (A.prep || []).map(function (p) {
      return '<li class="' + (p.done ? "done" : "") + '"><span class="box">' + (p.done ? icon("check") : "") + "</span>" +
        esc(p.name) + (p.note ? "<small>" + esc(p.note) + "</small>" : "") + "</li>";
    }).join("");
    var shop = A.shopping ? '<div class="memo lined"><h4>買い出しメモ<small>' + esc(A.shopping.when || "") + "</small></h4><ul>" +
      A.shopping.items.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></div>" : "";

    $("an").innerHTML =
      '<div class="an-hero"><p class="an-stamp"><span class="an-m">' + (d.getMonth() + 1) + '月</span><span class="an-d">' + d.getDate() +
      '</span><span class="an-w">' + dowOf(d) + "曜日</span></p>" + CAKE + "</div>" +
      '<p class="lead an-lead">' + (A.lead || "") + "</p>" +
      '<div class="an-photos">' + (A.photos || []).map(function (p) { return photo(p); }).join("") + "</div>" +
      '<ol class="steps">' + steps + "</ol>" +
      (A.bubble ? '<p class="bubble an-bubble">' + A.bubble + "</p>" : "") +
      '<div class="an-lists"><div class="memo"><h4>事前に確認</h4><ul class="checks">' + prep + "</ul></div>" + shop + "</div>";
  }

  // ---------- ふらっとおでかけスポット ----------
  var ILLUST = {
    // H Mart など：ねぎとカップ麺が顔を出す紙袋
    bag: '<svg class="illo-art" viewBox="0 0 120 120" aria-hidden="true">' +
      '<path class="leek-g" d="M70 52c2-14 7-27 18-38M66 52c-2-13-6-24-14-33"/>' +
      '<path class="leek-w" d="M68 66V50"/>' +
      '<path class="box" d="M44 54l4-26 14 2-4 26z"/><path class="box-l" d="M46 40l14 2"/>' +
      '<path class="cup" d="M28 44h26l-3 20H31z"/><path class="cup-l" d="M26 44h30M30 52h22"/>' +
      '<path class="bag" d="M22 58h76l-7 48H29z"/><path class="bag-l" d="M22 58h76M28 66h64"/>' +
      '<path class="heart" d="M60 92s-9-5.5-9-11a4.6 4.6 0 0 1 9-2 4.6 4.6 0 0 1 9 2c0 5.5-9 11-9 11z"/>' +
      "</svg>",
    // Bow Market など：旗のついた小さなお店
    market: '<svg class="illo-art" viewBox="0 0 120 120" aria-hidden="true">' +
      '<path class="flag-l" d="M14 22c16 8 30 8 46 0s30-8 46 0"/>' +
      '<path class="flag a" d="M22 25l4 9 4-8z"/><path class="flag b" d="M38 28l4 9 4-8.5z"/><path class="flag a" d="M56 25l4 9 4-9z"/><path class="flag b" d="M74 25l4 9 4-8z"/><path class="flag a" d="M90 28l4 8.5 4-9z"/>' +
      '<path class="shop" d="M26 60h68v44H26z"/>' +
      '<path class="awn" d="M22 46h76l-4 14H26z"/><path class="awn-s" d="M37 46l-2 14M52 46l-1 14M67 46l1 14M82 46l2 14"/>' +
      '<path class="win" d="M34 70h22v18H34z"/><path class="door" d="M66 104V72h18v32"/>' +
      '<path class="pot" d="M36 94h16l-2 10H38z"/><path class="plant" d="M44 94c-2-6-6-8-9-8M44 94c1-6 5-9 9-9M44 94v-9"/>' +
      "</svg>",
  };

  function spotCard(s) {
    var pic = s.photo ? photo(s.photo, { caption: false })
      : '<figure class="photo illo"><div class="ph-img">' + (ILLUST[s.illust] || ILLUST.bag) + "</div></figure>";
    var map = s.map ? '<a class="map" href="https://www.google.com/maps/search/?api=1&amp;query=' + encodeURIComponent(s.map) +
      '" target="_blank" rel="noopener noreferrer">' + icon("pin") + "地図</a>" : "";
    var meta = (s.solo ? '<span class="tag tag-solo">' + icon("person") + "ひとりでもOK</span>" : "") + tagList(s.tags) + map + extLink(s.link);
    return '<li class="spot">' + pic + '<div class="spot-body"><h4>' + esc(s.name) + "</h4>" +
      (s.text ? "<p>" + s.text + "</p>" : "") + (s.info ? '<p class="spot-info">' + s.info + "</p>" : "") +
      (meta ? '<div class="meta">' + meta + "</div>" : "") + "</div></li>";
  }

  function renderSpots() {
    var S = SPOTS;
    var groups = (S.groups || []).map(function (g) {
      return '<div class="spot-group"><h3 class="spot-head"><span class="spot-len">' + icon("clock") + esc(g.label) + "</span>" +
        (g.note ? '<span class="spot-note">' + esc(g.note) + "</span>" : "") + "</h3>" +
        '<ul class="spots">' + (g.items || []).map(spotCard).join("") + "</ul></div>";
    }).join("");
    var solo = S.solo ? '<aside class="solo-memo"><h3>' + icon("person") + esc(S.solo.title) + "</h3><ul>" +
      S.solo.lines.map(function (l) { return "<li>" + l + "</li>"; }).join("") + "</ul></aside>" : "";
    $("spot-list").innerHTML = (S.lead ? '<p class="lead">' + S.lead + "</p>" : "") + groups + solo;
  }

  // ---------- 暮らしのメモ ----------
  function renderLife() {
    $("life-list").innerHTML = '<div class="life-grid">' + LIFE.map(function (n) {
      return '<article class="note' + (n.wide ? " wide" : "") + '" id="' + esc(n.id || "") + '">' +
        "<h3>" + (n.icon ? icon(n.icon) : "") + esc(n.title) + "</h3>" +
        (n.photo ? photo(n.photo) : "") +
        (n.route ? route(n.route) : "") +
        (n.big ? '<p class="note-big">' + esc(n.big) + "</p>" : "") +
        (n.lines ? "<ul>" + n.lines.map(function (l) { return "<li>" + l + "</li>"; }).join("") + "</ul>" : "") +
        "</article>";
    }).join("") + "</div>";
  }

  function addTopButton() {
    var a = document.createElement("a");
    a.href = "#toc";
    a.className = "fab";
    a.textContent = "もくじ";
    document.body.appendChild(a);
    var toc = document.querySelector(".toc");
    toc.id = "toc";
    function onScroll() { a.classList.toggle("show", toc.getBoundingClientRect().bottom < 0); }
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- 印刷・PDF ----------
  // 写真は「見えたら読み込む」設定なので、印刷の前に全部読み込んでおく
  function loadAllImages(timeout) {
    var imgs = [].slice.call(document.images);
    imgs.forEach(function (i) { i.loading = "eager"; });
    var all = Promise.all(imgs.map(function (i) {
      return i.complete ? 0 : new Promise(function (done) {
        i.addEventListener("load", done, { once: true });
        i.addEventListener("error", done, { once: true });
      });
    }));
    return Promise.race([all, new Promise(function (done) { setTimeout(done, timeout); })]);
  }

  function setupPrint() {
    var link = $("pdf-link");
    if (link) link.addEventListener("click", function (e) {
      e.preventDefault();
      if (link.classList.contains("busy")) return;
      link.classList.add("busy");
      Promise.all([loadAllImages(10000), document.fonts ? document.fonts.ready : 0]).then(function () {
        link.classList.remove("busy");
        window.print();
      });
    });
    addEventListener("beforeprint", function () { loadAllImages(0); });
    if (/[?&]pdf\b/.test(location.search)) loadAllImages(0); // tools などから PDF にするとき用
  }

  function showProblems() {
    var errs = (window.__errors || []).concat(problems);
    if (!errs.length) return;
    var box = $("error-box");
    box.innerHTML = "<b>栞のデータに書き間違いがあるかも</b><ul>" + errs.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") +
      "</ul><small>plan.js / photos.js のカンマや「\"」の閉じ忘れを確認してください。</small>";
    box.hidden = false;
  }

  function run(name, fn) {
    try { fn(); } catch (e) { problems.push(name + "：" + e.message); if (window.console) console.error(e); }
  }

  // ---------- ここから実行 ----------
  var need = { TRIP: "plan.js", WEEKS: "plan.js", PORTSMOUTH: "plan.js", ANNIVERSARY: "plan.js", SPOTS: "plan.js", LIFE: "plan.js", PHOTOS: "photos.js" };
  var missing = Object.keys(need).filter(function (k) {
    try { return typeof eval(k) === "undefined"; } catch (e) { return true; }
  });
  if (missing.length) {
    problems.push(missing.join("・") + " が読めませんでした（" + need[missing[0]] + " を確認）");
    showProblems();
    return;
  }

  run("予定の準備", prepareItems);
  run("表紙", renderCover);
  run("カレンダー", renderCalendar);
  run("週ごとの予定", renderWeeks);
  run("ポーツマス", renderPortsmouth);
  run("記念日", renderAnniversary);
  run("おでかけスポット", renderSpots);
  run("暮らしのメモ", renderLife);
  run("もくじボタン", addTopButton);
  run("印刷", setupPrint);
  showProblems();

  // ページ内リンク付きで開いたとき（例: …/#portsmouth）に、描画後の位置へ
  if (location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(function () { target.scrollIntoView(); }, 0);
  }

  // GitHub Pages（https）では、一度開いたページを圏外でも見られるようにする
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
