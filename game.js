/* Seasons of California: game engine.
   Content for each culture area lives in areas/<area>.js.
   No accounts, no tracking. Progress is saved only in this browser (localStorage). */
(function () {
  "use strict";

  var AREAS = window.GAME_AREAS, ORDER = window.GAME_ORDER, C = window.GAME_COMMON;
  var app = document.getElementById("app");
  var A = null;           // current area data
  var S = null;           // current game state
  var focusAfter = null;

  /* ---------- helpers ---------- */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function cap1(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function seasonIdx() { return S.i % 4; }
  function season() { return A.seasons[seasonIdx()]; }
  function yearNum() { return Math.floor(S.i / 4) + 1; }
  function shortMode() { return S.mode === "short"; }
  function foodCap() { return A.foodCap + S.capBonus; }

  function saveKey(id) { return "seasonsGame_" + id + "_v2"; }
  function save() { try { localStorage.setItem(saveKey(S.area), JSON.stringify(S)); } catch (e) {} }
  function load(id) { try { var r = localStorage.getItem(saveKey(id)); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function clearSave(id) { try { localStorage.removeItem(saveKey(id)); } catch (e) {} }

  function newState(areaId, mode) {
    var st = A.start;
    return {
      area: areaId, mode: mode, total: mode === "short" ? 8 : 12, i: 0, phase: "season-start",
      food: st.food, shelter: st.shelter, clothing: st.clothing, goods: st.goods,
      h1: st.h1, h2: st.h2, wellbeing: st.wellbeing,
      projWork: 0, built: false, capBonus: 0, crops: 0, shared: 0,
      mods: {}, teamsLost: 0, plan: {}, queue: [], cur: null, curResult: null, recent: [], report: null
    };
  }

  /* ---------- yields ---------- */
  function healthMult(h) { return 0.3 + 0.09 * h; }
  function srcVal(src) { return src === "h1" ? S.h1 : src === "h2" ? S.h2 : null; }
  function foodPerTeam(act) {
    var m = 1, base = act.yields[seasonIdx()];
    if (act.source) m *= healthMult(srcVal(act.source));
    if (S.built && A.project && A.project.boosts && A.project.boosts[act.id]) m *= A.project.boosts[act.id];
    m *= (S.mods[act.id] || 1);
    return base * m;
  }
  function cropsPerTeam(act) { return act.crops * healthMult(S.h1) * (S.mods[act.id] || 1); }
  function stars(v) { return v < 0.5 ? 0 : v >= 5 ? 3 : v >= 3 ? 2 : 1; }
  function starText(n) { return "★".repeat(n) + "☆".repeat(3 - n); }
  function hasCrops() { return A.activities.some(function (a) { return a.kind === "plant"; }); }

  function teamsAvailable() { return Math.max(1, A.teams - S.teamsLost); }
  function teamsUsed() { var t = 0; for (var k in S.plan) t += S.plan[k]; return t; }
  function inSeason(act) { return !act.only || act.only.indexOf(seasonIdx()) >= 0; }
  function isVisible(act) {
    if (act.needsProject && !S.built) return false;
    if (act.kind === "project" && S.built) return false;
    return true;
  }
  function maxFor(act) {
    if (!inSeason(act)) return 0;
    var left = teamsAvailable() - teamsUsed() + (S.plan[act.id] || 0);
    if (act.kind === "trade") left = Math.min(left, Math.floor(S.goods / act.cost));
    if (act.kind === "storage") left = Math.min(left, Math.max(0, Math.ceil((act.max - S.capBonus) / act.gain)));
    return Math.max(0, left);
  }

  /* ---------- events ---------- */
  function meetsNeeds(n) {
    if (!n) return true;
    if (n.project && !S.built) return false;
    if (n.food && S.food < n.food) return false;
    return true;
  }
  function eventOk(e) { return e.seasons.indexOf(seasonIdx()) >= 0 && meetsNeeds(e.needs); }
  function makeCur(ev) {
    if (ev.outcomes) {
      var o = ev.outcomes[Math.floor(Math.random() * ev.outcomes.length)];
      return { emoji: ev.emoji, title: ev.title, text: ev.text + " " + o.text,
               choices: [{ label: "Continue", desc: "", effects: o.effects, result: o.result }] };
    }
    return { emoji: ev.emoji, title: ev.title, text: ev.text, choices: ev.choices };
  }
  function applyEffects(fx) {
    if (!fx) return;
    if (fx.food) S.food = clamp(S.food + fx.food, 0, foodCap());
    if (fx.shelter) S.shelter = clamp(S.shelter + fx.shelter, 0, 100);
    if (fx.clothing) S.clothing = clamp(S.clothing + fx.clothing, 0, 100);
    if (fx.goods) S.goods = Math.max(0, S.goods + fx.goods);
    if (fx.h1) S.h1 = clamp(S.h1 + fx.h1, 1, 10);
    if (fx.h2) S.h2 = clamp(S.h2 + fx.h2, 1, 10);
    if (fx.crops) S.crops = Math.max(0, S.crops + fx.crops);
    if (fx.teamsLost) S.teamsLost += fx.teamsLost;
    if (fx.shared) S.shared += fx.shared;
    if (fx.mod) for (var k in fx.mod) S.mods[k] = (S.mods[k] || 1) * fx.mod[k];
  }

  /* ---------- season flow ---------- */
  function beginSeason() {
    S.mods = {}; S.teamsLost = 0; S.plan = {}; S.report = null; S.curResult = null;
    var q = [];
    A.events.forEach(function (e) { if (e.always && eventOk(e)) q.push(e.id); });
    if (S.i > 0 && Math.random() <= 0.7) {
      var pool = A.events.filter(function (e) { return !e.always && eventOk(e) && S.recent.indexOf(e.id) < 0; });
      if (pool.length) {
        var pick = pool[Math.floor(Math.random() * pool.length)];
        q.push(pick.id);
        S.recent.push(pick.id); if (S.recent.length > 2) S.recent.shift();
      }
    }
    S.queue = q;
    nextEvent();
  }
  function nextEvent() {
    if (S.queue.length) {
      var ev = byId(A.events, S.queue.shift());
      S.cur = makeCur(ev); S.phase = "event";
    } else { S.cur = null; S.phase = "plan"; }
    save(); render();
  }

  function resolveSeason() {
    var lines = [], harvested = 0, p = S.plan, si = seasonIdx();
    var d1 = 1, d2 = 1;

    A.activities.forEach(function (act) {
      var n = p[act.id] || 0; if (!n) return;
      var k = act.kind;
      if (k === "food") {
        var f = Math.round(foodPerTeam(act) * n);
        harvested += f;
        lines.push({ icon: act.emoji, text: act.name + ": +" + f + " food." });
        if (act.limit && n > act.limit) {
          var over = n - act.limit;
          if (act.source === "h1") d1 -= (1 + over); else if (act.source === "h2") d2 -= (1 + over);
          if (act.tooMany) lines.push({ icon: "⚠️", text: act.tooMany, warn: true });
        }
      } else if (k === "shelter") {
        S.shelter = clamp(S.shelter + act.gain * n, 0, 100);
        lines.push({ icon: act.emoji, text: "Your teams built and repaired the home." });
      } else if (k === "clothing") {
        S.clothing = clamp(S.clothing + act.gain * n, 0, 100);
        lines.push({ icon: act.emoji, text: "Your teams made and mended clothing." });
      } else if (k === "project") {
        S.projWork += n;
        if (S.projWork >= A.project.work) { S.built = true; lines.push({ icon: A.project.emoji, text: A.project.done, good: true }); }
        else lines.push({ icon: act.emoji, text: A.project.stat + ": " + S.projWork + " of " + A.project.work + " seasons of work done." });
      } else if (k === "goods") {
        S.goods += act.gain * n;
        lines.push({ icon: act.emoji, text: "+" + (act.gain * n) + " " + A.goods.name + "." });
      } else if (k === "trade") {
        var got = 0, per = (S.built && act.foodProject) ? act.foodProject : act.food;
        for (var t = 0; t < n; t++) if (S.goods >= act.cost) { S.goods -= act.cost; got += per; }
        harvested += got;
        lines.push({ icon: act.emoji, text: "Trade: +" + got + " food." });
      } else if (k === "care") {
        for (var c = 0; c < n; c++) { if (S.h1 <= S.h2) S.h1 = clamp(S.h1 + 1, 1, 10); else S.h2 = clamp(S.h2 + 1, 1, 10); }
        lines.push({ icon: act.emoji, text: "Your teams cared for the land and water.", good: true });
      } else if (k === "storage") {
        var before = S.capBonus;
        S.capBonus = Math.min(act.max, S.capBonus + act.gain * n);
        lines.push({ icon: act.emoji, text: "Storage space grew by " + (S.capBonus - before) + "." });
      } else if (k === "plant") {
        var cr = Math.round(cropsPerTeam(act) * n);
        S.crops += cr;
        lines.push({ icon: act.emoji, text: "Planted fields: " + cr + " crops are growing." });
      } else if (k === "harvest") {
        var take = Math.min(S.crops, n * act.perTeam);
        S.crops -= take; harvested += take;
        lines.push({ icon: act.emoji, text: "Harvest: +" + take + " food from the fields." + (take < n * act.perTeam ? " There were not enough ripe crops for every team." : "") });
      }
    });

    (A.whyNotes || []).forEach(function (w) {
      if (w.season === si && (p[w.activity] || 0) > 0) lines.push({ icon: "💡", text: w.text });
    });

    if (hasCrops() && si === 2 && S.crops > 0) { lines.push({ icon: "🥀", text: "Crops left in the fields after fall were lost.", warn: true }); S.crops = 0; }

    S.h1 = clamp(S.h1 + d1, 1, 10);
    S.h2 = clamp(S.h2 + d2, 1, 10);

    S.shelter = clamp(S.shelter - A.decay.shelter[si], 0, 100);
    S.clothing = clamp(S.clothing - A.decay.clothing[si], 0, 100);

    var total = S.food + harvested, cap = foodCap();
    if (total > cap) { lines.push({ icon: "📦", text: "The storehouse is full. " + (total - cap) + " food could not be kept." }); total = cap; }
    var foodOk = total >= A.foodNeed, short = 0;
    if (foodOk) S.food = total - A.foodNeed; else { short = A.foodNeed - total; S.food = 0; }

    var shelterOk = S.shelter >= 40, clothingOk = shortMode() ? true : S.clothing >= 40;
    var d = (foodOk ? 4 : -Math.min(12, short)) + (shelterOk ? 2 : -6) + (clothingOk ? 2 : -6);
    S.wellbeing = clamp(S.wellbeing + d, 0, 100);

    var status = [];
    status.push(foodOk ? { icon: "🍲", text: "Everyone had enough to eat.", good: true }
                       : { icon: "🍲", text: "A lean season. The community shared what little there was and got through, but it was hard.", warn: true });
    if (!shelterOk) status.push({ icon: "🏠", text: "The home is damp and drafty. It needs repairs.", warn: true });
    if (!clothingOk) status.push({ icon: "🧵", text: "Clothing is worn thin. People need new clothing.", warn: true });

    S.report = { lines: lines, status: status };
    S.phase = "results";
    save(); render();
  }

  function nextSeason() {
    S.i += 1;
    if (S.i >= S.total) { S.phase = "final"; save(); render(); } else beginSeason();
  }

  /* ---------- rendering ---------- */
  function meter(emoji, label, value, max, text) {
    var pct = Math.round((value / max) * 100);
    return '<div class="meter"><div class="meter-top"><span aria-hidden="true">' + emoji + '</span><span class="m-label">' + esc(label) +
      '</span><span class="m-val">' + esc(text) + '</span></div><div class="bar" role="img" aria-label="' + esc(label) + ": " + esc(text) +
      '"><div class="fill" style="width:' + pct + '%"></div></div></div>';
  }
  function meters() {
    var L = A.labels, M = A.meters;
    var h = '<section class="meters" aria-label="Community status">';
    h += meter("🍲", "Food stored", S.food, foodCap(), S.food + " of " + foodCap());
    h += meter("🏠", L.shelter, S.shelter, 100, S.shelter >= 70 ? "Strong" : S.shelter >= 40 ? "Worn" : "Needs repair");
    if (!shortMode()) h += meter("🧵", L.clothing, S.clothing, 100, S.clothing >= 70 ? "Good" : S.clothing >= 40 ? "Worn" : "Needs mending");
    h += meter(M.h1.emoji, M.h1.label, S.h1, 10, S.h1 + " of 10");
    h += meter(M.h2.emoji, M.h2.label, S.h2, 10, S.h2 + " of 10");
    h += meter("💚", "Community wellbeing", S.wellbeing, 100, S.wellbeing >= 75 ? "Thriving" : S.wellbeing >= 45 ? "Doing okay" : "Struggling");
    h += '<div class="extras"><span>' + A.goods.emoji + " " + cap1(A.goods.name) + ": <strong>" + S.goods + "</strong></span>";
    if (A.project) h += "<span>" + A.project.emoji + " " + esc(A.project.stat) + ": <strong>" + (S.built ? "Finished" : S.projWork > 0 ? S.projWork + " of " + A.project.work + " seasons" : "Not started") + "</strong></span>";
    if (hasCrops()) h += "<span>🌽 Crops growing: <strong>" + S.crops + "</strong></span>";
    h += "</div></section>";
    return h;
  }
  function header() {
    var s = season();
    return '<div class="topbar"><button class="btn ghost small" data-act="home" type="button">← All areas</button><span class="area-tag" style="border-color:' + A.color + '">' + esc(A.name) + '</span></div>' +
      '<header class="season-head"><div class="season-ico" aria-hidden="true">' + s.emoji + '</div><div><h2>' + esc(s.name) + ", Year " + yearNum() +
      '</h2><p class="muted">Season ' + (S.i + 1) + " of " + S.total + '</p></div></header>';
  }

  function render() {
    if (!S) { renderChoose(); return; }
    A = AREAS[S.area];
    var h = "";
    switch (S.phase) {
      case "season-start": beginSeason(); return;
      case "event": h = viewEvent(); break;
      case "event-result": h = viewEventResult(); break;
      case "plan": h = viewPlan(); break;
      case "results": h = viewResults(); break;
      case "final": h = viewFinal(); break;
    }
    app.innerHTML = h;
    window.scrollTo(0, 0);
    if (focusAfter) { var el = document.querySelector(focusAfter); if (el) el.focus(); focusAfter = null; }
  }

  /* hero pictures: simple shapes of land, no people */
  function hero(kind, color) {
    var bg = "#cfe0dc", g = "";
    if (kind === "forest") {
      g = '<path d="M0 120 C80 100 140 110 220 96 C320 78 420 104 600 84 L600 160 L0 160Z" fill="#1f6f78"/><path d="M0 138 C120 122 200 140 320 126 C430 114 520 134 600 122 L600 160 L0 160Z" fill="#17535a"/>' +
        '<g fill="#1e3b34"><path d="M40 98 l18 -62 l18 62z"/><path d="M78 100 l22 -78 l22 78z"/><path d="M130 100 l16 -52 l16 52z"/><path d="M470 92 l18 -60 l18 60z"/><path d="M510 94 l22 -74 l22 74z"/><path d="M560 92 l14 -44 l14 44z"/></g>';
    } else if (kind === "plateau") {
      bg = "#d7e3e6";
      g = '<path d="M0 90 L80 90 L100 70 L260 70 L280 90 L420 90 L440 62 L600 62 L600 160 L0 160Z" fill="#b9a98b"/><path d="M0 120 L600 120 L600 160 L0 160Z" fill="#9c8d72"/>' +
        '<ellipse cx="300" cy="136" rx="120" ry="14" fill="#2f7f8a"/><g fill="#3d5b3a"><path d="M60 118 l10 -34 l10 34z"/><path d="M90 120 l8 -26 l8 26z"/><path d="M500 118 l10 -34 l10 34z"/><path d="M530 120 l8 -26 l8 26z"/></g>';
    } else if (kind === "oak") {
      bg = "#dfe8d3";
      g = '<path d="M0 110 C100 70 200 100 300 84 C400 68 500 100 600 80 L600 160 L0 160Z" fill="#b8a86a"/><path d="M0 138 C150 118 300 140 600 122 L600 160 L0 160Z" fill="#8f7c4a"/>' +
        '<g fill="#5b3f2a"><rect x="96" y="92" width="6" height="26"/><rect x="326" y="86" width="6" height="26"/><rect x="496" y="96" width="6" height="26"/></g>' +
        '<g fill="#3f6b36"><circle cx="99" cy="84" r="20"/><circle cx="329" cy="78" r="24"/><circle cx="499" cy="88" r="20"/></g>';
    } else if (kind === "desert") {
      bg = "#efe3c4";
      g = '<path d="M0 100 L90 60 L170 96 L260 50 L360 100 L480 56 L600 98 L600 160 L0 160Z" fill="#a98c6b"/><path d="M0 120 C120 100 240 130 360 112 C460 98 540 124 600 110 L600 160 L0 160Z" fill="#d8b56c"/>' +
        '<g fill="#4c6b3a"><rect x="120" y="100" width="8" height="28"/><rect x="108" y="108" width="6" height="12"/><rect x="134" y="104" width="6" height="14"/><rect x="480" y="106" width="8" height="26"/><rect x="468" y="112" width="6" height="12"/></g>';
    } else if (kind === "coast") {
      bg = "#dbe9ef";
      g = '<circle cx="480" cy="50" r="22" fill="#f1d27a"/><path d="M0 100 C120 92 240 106 360 98 C460 92 540 104 600 98 L600 160 L0 160Z" fill="#2f7f9a"/><path d="M0 126 C100 116 200 132 300 122 C420 110 520 130 600 120 L600 160 L0 160Z" fill="#256c86"/>' +
        '<path d="M0 100 L0 60 C60 54 120 70 180 84 C220 94 240 100 260 104 L0 130Z" fill="#8a7a5c"/><path d="M0 60 C60 54 120 70 180 84 L0 84Z" fill="#6d8a4c"/>';
    } else if (kind === "river") {
      bg = "#f0e2c0";
      g = '<path d="M0 100 L100 70 L200 98 L320 60 L440 96 L600 66 L600 160 L0 160Z" fill="#b48a66"/><path d="M0 118 L600 118 L600 160 L0 160Z" fill="#c9a26f"/>' +
        '<path d="M0 132 C100 122 200 140 300 130 C420 118 500 140 600 128 L600 152 C500 162 420 142 300 152 C200 162 100 144 0 154Z" fill="#2f7fa8"/><path d="M0 126 C100 118 200 132 300 124 C420 112 500 134 600 122 L600 130 C500 140 420 120 300 132 C200 140 100 126 0 134Z" fill="#6c9a4b"/>';
    }
    return '<div class="hero" aria-hidden="true" style="border-bottom-color:' + color + '"><svg viewBox="0 0 600 160" preserveAspectRatio="xMidYMid slice"><rect width="600" height="160" fill="' + bg + '"/>' + g + '</svg></div>';
  }

  /* area chooser */
  function renderChoose() {
    var h = '<h1>' + esc(C.title) + '</h1><p class="lead">' + esc(C.question) + '</p><p>' + esc(C.chooseText) + '</p><div class="area-grid">';
    ORDER.forEach(function (id) {
      var a = AREAS[id]; if (!a) return;
      var saved = load(id), tag = "";
      if (saved && saved.phase !== "final") tag = '<span class="badge">In progress: Year ' + (Math.floor(saved.i / 4) + 1) + "</span>";
      h += '<button class="area-card" style="border-left-color:' + a.color + '" data-act="pick" data-area="' + id + '" type="button"><span class="swatch" style="background:' + a.color + '" aria-hidden="true"></span>' +
        '<span class="ac-text"><strong>' + esc(a.name) + '</strong><span>' + esc(a.cardLine) + '</span>' + tag + '</span></button>';
    });
    h += '</div><aside class="note"><h3>About this game</h3><p>' + esc(C.note) + '</p></aside>';
    app.innerHTML = h; window.scrollTo(0, 0);
  }

  /* area intro */
  function renderIntro(id) {
    A = AREAS[id];
    var saved = load(id);
    var h = '<div class="topbar"><button class="btn ghost small" data-act="home" type="button">← All areas</button></div>' + hero(A.hero, A.color);
    h += '<h1>' + esc(A.title) + '</h1><p class="lead">' + esc(A.subtitle) + '</p>';
    h += '<p>' + esc(A.intro.where) + '</p><p>' + esc(A.intro.peoplesLine) + '</p>';
    h += '<ul class="say">' + A.intro.peoples.map(function (p) { return "<li><strong>" + esc(p.name) + "</strong>" + (p.say ? " (" + esc(p.say) + ")" : "") + "</li>"; }).join("") + '</ul>';
    h += '<p>' + esc(A.intro.job) + '</p>';
    h += '<aside class="note"><h3>About this game</h3><p>' + esc(C.note) + '</p></aside>';
    h += '<details class="gloss"><summary>Words to know</summary><dl>' + C.glossary.map(function (g) { return "<dt>" + esc(g.word) + "</dt><dd>" + esc(g.meaning) + "</dd>"; }).join("") + '</dl></details>';
    h += '<div class="choose"><h2>How long do you want to play?</h2><div class="row">' +
      '<button class="btn primary" data-act="start" data-area="' + id + '" data-mode="short" type="button">Short game<br><small>2 years, about 10 minutes</small></button>' +
      '<button class="btn primary" data-act="start" data-area="' + id + '" data-mode="full" type="button">Full game<br><small>3 years, about 15 minutes</small></button></div>';
    if (saved && saved.phase !== "final") h += '<button class="btn" data-act="continue" data-area="' + id + '" type="button">Continue my game (Year ' + (Math.floor(saved.i / 4) + 1) + ", " + esc(A.seasons[saved.i % 4].name) + ')</button>';
    h += '</div>';
    app.innerHTML = h; window.scrollTo(0, 0);
  }

  function viewEvent() {
    var ev = S.cur;
    var h = header() + meters() + '<section class="card"><h2>' + ev.emoji + " " + esc(ev.title) + '</h2><p>' + esc(ev.text) + '</p>';
    if (ev.choices.length > 1 || ev.choices[0].desc) h += '<p class="muted">What will your community do?</p>';
    h += '<div class="choices">';
    ev.choices.forEach(function (c, idx) {
      var ok = !(c.needs && c.needs.goods && S.goods < c.needs.goods);
      h += '<button class="choice" data-act="choose" data-idx="' + idx + '" type="button"' + (ok ? "" : " disabled") + '><strong>' + esc(c.label) + '</strong>' +
        (c.desc ? '<span>' + esc(c.desc) + (ok ? "" : " (You do not have enough " + esc(A.goods.name) + ".)") + '</span>' : "") + '</button>';
    });
    return h + '</div></section>';
  }
  function viewEventResult() {
    var ev = S.cur;
    return header() + meters() + '<section class="card"><h2>' + ev.emoji + " " + esc(ev.title) + '</h2><p>' + esc(S.curResult) + '</p></section>' +
      '<div class="row"><button class="btn primary" data-act="next-event" type="button">' + (S.queue.length ? "Continue" : "Plan the season") + '</button></div>';
  }

  function viewPlan() {
    var s = season(), left = teamsAvailable() - teamsUsed();
    var h = header() + '<section class="card"><p>' + esc(s.blurb) + '</p></section>' + meters();
    h += '<section class="plan"><div class="teams-bar" aria-live="polite"><strong>Work teams left: ' + left + '</strong> of ' + teamsAvailable() +
      (S.teamsLost ? '<span class="muted"> (' + S.teamsLost + ' busy this season)</span>' : "") + '</div>';
    var group = "";
    A.activities.forEach(function (act) {
      if (!isVisible(act)) return;
      if (act.group !== group) { if (group) h += "</div>"; group = act.group; h += '<h3 class="grp">' + esc(group) + '</h3><div class="acts">'; }
      var open = inSeason(act), n = S.plan[act.id] || 0, mx = maxFor(act), extra = "", note = "";
      if (act.kind === "food" && open) {
        var st = stars(foodPerTeam(act));
        extra = '<span class="stars" title="Food from each team this season" aria-label="Food this season: ' + st + ' out of 3 stars">' + starText(st) + '</span>';
      }
      if (!open) {
        note = '<p class="note-line">Not available in ' + esc(season().name) + '. Available in: ' + act.only.map(function (x) { return A.seasons[x].name; }).join(" and ") + '.</p>';
      } else if (act.kind === "project") note = '<p class="note-line">Progress: ' + S.projWork + " of " + A.project.work + " seasons of work.</p>";
      else if (act.kind === "trade") note = '<p class="note-line">You have ' + S.goods + " " + esc(A.goods.name) + ". Each team uses " + act.cost + ".</p>";
      else if (act.kind === "storage") note = '<p class="note-line">Extra storage so far: +' + S.capBonus + " of +" + act.max + ".</p>";
      else if (act.kind === "plant") note = '<p class="note-line">About ' + Math.round(cropsPerTeam(act)) + " crops per team. Crops growing now: " + S.crops + ".</p>";
      else if (act.kind === "harvest") note = '<p class="note-line">Crops ready in the fields: ' + S.crops + ". Each team harvests up to " + act.perTeam + ".</p>";
      else if (act.limit && act.kind === "food") note = '<p class="note-line">More than ' + act.limit + " teams here can wear down " + esc(A.meters[act.source].label.toLowerCase()) + ".</p>";
      h += '<div class="act' + (open ? "" : " closed") + '"><div class="a-ico" aria-hidden="true">' + act.emoji + '</div><div class="a-info"><h4>' + esc(act.name) + " " + extra + '</h4><p>' + esc(act.desc) + '</p>' + note + '</div>' +
        '<div class="stepper"><button type="button" class="step" data-act="dec" data-id="' + act.id + '" aria-label="Fewer teams: ' + esc(act.name) + '"' + (n <= 0 ? " disabled" : "") + '>−</button>' +
        '<output aria-label="Teams assigned: ' + esc(act.name) + '">' + n + '</output>' +
        '<button type="button" class="step" data-act="inc" data-id="' + act.id + '" aria-label="More teams: ' + esc(act.name) + '"' + (n >= mx ? " disabled" : "") + '>+</button></div></div>';
    });
    h += "</div></section>";
    h += '<div class="row sticky-go"><button class="btn primary" data-act="go" type="button"' + (left === 0 ? "" : " disabled") + '>' + (left === 0 ? "Start the season" : "Use all " + teamsAvailable() + " teams to start") + '</button></div>';
    return h;
  }

  function viewResults() {
    var r = S.report;
    var h = header() + '<section class="card"><h2>What happened this season</h2><ul class="report">';
    r.lines.concat(r.status).forEach(function (l) {
      h += '<li class="' + (l.warn ? "warn" : l.good ? "good" : "") + '"><span aria-hidden="true">' + l.icon + '</span><span>' + esc(l.text) + '</span></li>';
    });
    h += '</ul></section>' + meters();
    var last = S.i + 1 >= S.total;
    return h + '<div class="row"><button class="btn primary" data-act="next" type="button">' + (last ? "See how your community did" : "Next season") + '</button></div>';
  }

  function avg3(v, hi, mid) { return v >= hi ? 3 : v >= mid ? 2 : 1; }
  function viewFinal() {
    var wb = avg3(S.wellbeing, 75, 50), land = avg3((S.h1 + S.h2) / 2, 7, 5), sh = S.shared >= 2 ? 3 : S.shared === 1 ? 2 : 1;
    var wbText = wb === 3 ? "Your community is thriving. People are well fed, dry, and warm." : wb === 2 ? "Your community is doing okay, with some hard seasons along the way." : "It was a hard stretch. Try planning ahead for winter next time.";
    var landText = land === 3 ? "The land and water are healthy and ready for the next generation." : land === 2 ? "The land and water held up, but they show some wear." : "The land and water are worn down. Taking less and caring more can help them recover.";
    var shText = sh === 3 ? "You shared with neighbors more than once. Sharing earns respect." : sh === 2 ? "You shared once. Sharing earns respect." : "You kept what you had. Sharing with neighbors is another way communities stayed strong.";
    var h = '<div class="topbar"><span class="area-tag" style="border-color:' + A.color + '">' + esc(A.name) + '</span></div>';
    h += '<section class="card"><h1>Your community after ' + (S.total / 4) + ' years</h1><div class="results-grid">' +
      '<div><h3>💚 Wellbeing</h3><p class="big">' + starText(wb) + '</p><p>' + esc(wbText) + '</p></div>' +
      '<div><h3>🌿 Care for the land</h3><p class="big">' + starText(land) + '</p><p>' + esc(landText) + '</p></div>' +
      '<div><h3>🤲 Sharing</h3><p class="big">' + starText(sh) + '</p><p>' + esc(shText) + '</p></div></div>' +
      '<p>' + A.goods.emoji + " You ended with <strong>" + S.goods + "</strong> " + esc(A.goods.name) + ". " + esc(A.goodsFinal || "") + '</p>';
    if (A.project) h += '<p>' + A.project.emoji + " " + esc(S.built ? A.project.finalYes : A.project.finalNo) + '</p>';
    h += '</section>';
    h += '<section class="card"><h2>Think about it</h2><ul class="think">' + A.reflection.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + '</ul></section>';
    h += '<section class="card today"><h2>Today</h2><p>' + esc(A.today.text) + '</p><ul>' +
      A.today.links.map(function (l) { return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.name) + '</a></li>'; }).join("") + '</ul></section>';
    return h + '<div class="row"><button class="btn primary" data-act="again" type="button">Play this area again</button><button class="btn" data-act="home" type="button">Choose another area</button></div>';
  }

  /* ---------- clicks ---------- */
  app.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act]"); if (!t || t.disabled) return;
    var act = t.getAttribute("data-act"), id = t.getAttribute("data-id");
    if (act === "home") { S = null; A = null; renderChoose(); }
    else if (act === "pick") { S = null; renderIntro(t.getAttribute("data-area")); }
    else if (act === "start") { A = AREAS[t.getAttribute("data-area")]; S = newState(A.id, t.getAttribute("data-mode")); beginSeason(); }
    else if (act === "continue") { S = load(t.getAttribute("data-area")); if (S) render(); }
    else if (act === "choose") {
      var c = S.cur.choices[+t.getAttribute("data-idx")];
      applyEffects(c.effects); S.curResult = c.result; S.phase = "event-result"; save(); render();
    }
    else if (act === "next-event") { nextEvent(); }
    else if (act === "inc" || act === "dec") {
      var a = byId(A.activities, id), n = S.plan[id] || 0;
      if (act === "inc" && n < maxFor(a)) n++; else if (act === "dec" && n > 0) n--;
      if (n) S.plan[id] = n; else delete S.plan[id];
      var sel = '[data-act="' + act + '"][data-id="' + id + '"]';
      focusAfter = sel; save(); render();
      var now = document.querySelector(sel);
      if (!now || now.disabled) {
        var other = document.querySelector('[data-act="' + (act === "inc" ? "dec" : "inc") + '"][data-id="' + id + '"]');
        if (other && !other.disabled) other.focus();
      }
    }
    else if (act === "go") { if (teamsUsed() === teamsAvailable()) resolveSeason(); }
    else if (act === "next") { nextSeason(); }
    else if (act === "again") { var aid = S.area; clearSave(aid); S = null; renderIntro(aid); }
  });

  renderChoose();
})();
