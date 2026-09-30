/* Seasons game engine. Reads its content from window.GAME_AREAS.<area>.
   No accounts, no tracking. Progress is saved only in this browser (localStorage). */
(function () {
  "use strict";

  var AREA_ID = "northwest";
  var A = window.GAME_AREAS[AREA_ID];
  var app = document.getElementById("app");
  var SAVE_KEY = "seasonsGame_" + AREA_ID + "_v1";
  var S = null;           // game state
  var focusAfter = null;  // element to refocus after re-render

  /* ---------- helpers ---------- */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function seasonIdx() { return S.i % 4; }
  function season() { return A.seasons[seasonIdx()]; }
  function yearNum() { return Math.floor(S.i / 4) + 1; }
  function shortMode() { return S.mode === "short"; }

  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {} }
  function load() { try { var r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

  function newState(mode) {
    return {
      mode: mode, total: mode === "short" ? 8 : 12, i: 0, phase: "season-start",
      food: A.start.food, shelter: A.start.shelter, clothing: A.start.clothing,
      strings: A.start.strings, river: A.start.river, land: A.start.land,
      wellbeing: A.start.wellbeing, canoeWork: 0, canoe: false, shared: 0,
      mods: {}, teamsLost: 0, plan: {}, eventId: null, eventResult: null,
      recent: [], report: null, history: []
    };
  }

  /* ---------- yields ---------- */
  function healthMult(h) { return 0.3 + 0.09 * h; }
  function foodPerTeam(act) {
    var m = 1, base = act.yields[seasonIdx()];
    if (act.source === "river") m *= healthMult(S.river);
    if (act.source === "land") m *= healthMult(S.land);
    if (act.id === "salmon" && S.canoe) m *= 1.2;
    m *= (S.mods[act.id] || 1);
    return base * m;
  }
  function stars(v) { return v >= 5 ? 3 : v >= 3 ? 2 : 1; }
  function starText(n) { return "★".repeat(n) + "☆".repeat(3 - n); }

  function teamsAvailable() { return Math.max(1, A.teams - S.teamsLost); }
  function teamsUsed() { var t = 0; for (var k in S.plan) t += S.plan[k]; return t; }
  function isAvailable(act) {
    if (act.needsCanoe && !S.canoe) return false;
    if (act.kind === "canoe" && S.canoe) return false;
    return true;
  }
  function maxFor(act) {
    var left = teamsAvailable() - teamsUsed() + (S.plan[act.id] || 0);
    if (act.kind === "trade") left = Math.min(left, Math.floor(S.strings / act.cost));
    return Math.max(0, left);
  }

  /* ---------- events ---------- */
  function eligibleEvents() {
    return A.events.filter(function (e) {
      if (e.seasons.indexOf(seasonIdx()) < 0) return false;
      if (S.recent.indexOf(e.id) >= 0) return false;
      if (e.needs) {
        if (e.needs.canoe && !S.canoe) return false;
        if (e.needs.food && S.food < e.needs.food) return false;
      }
      return true;
    });
  }
  function pickEvent() {
    if (S.i === 0) return null;
    var list = eligibleEvents();
    if (!list.length || Math.random() > 0.7) return null;
    return list[Math.floor(Math.random() * list.length)];
  }
  function applyEffects(fx) {
    if (!fx) return;
    if (fx.food) S.food = clamp(S.food + fx.food, 0, A.foodCap);
    if (fx.shelter) S.shelter = clamp(S.shelter + fx.shelter, 0, 100);
    if (fx.clothing) S.clothing = clamp(S.clothing + fx.clothing, 0, 100);
    if (fx.strings) S.strings = Math.max(0, S.strings + fx.strings);
    if (fx.river) S.river = clamp(S.river + fx.river, 1, 10);
    if (fx.land) S.land = clamp(S.land + fx.land, 1, 10);
    if (fx.teamsLost) S.teamsLost += fx.teamsLost;
    if (fx.shared) S.shared += fx.shared;
    if (fx.mod) for (var k in fx.mod) S.mods[k] = (S.mods[k] || 1) * fx.mod[k];
  }

  /* ---------- season flow ---------- */
  function beginSeason() {
    S.mods = {}; S.teamsLost = 0; S.plan = {}; S.report = null;
    S.eventResult = null;
    var ev = pickEvent();
    if (ev) {
      S.eventId = ev.id;
      S.recent.push(ev.id); if (S.recent.length > 2) S.recent.shift();
      S.phase = "event";
    } else {
      S.eventId = null;
      S.phase = "plan";
    }
    save(); render();
  }

  function resolveSeason() {
    var lines = [], harvested = 0, p = S.plan, si = seasonIdx();
    var riverDelta = 1, landDelta = 1;

    A.activities.forEach(function (act) {
      var n = p[act.id] || 0; if (!n) return;
      if (act.kind === "food") {
        var f = Math.round(foodPerTeam(act) * n);
        harvested += f;
        lines.push({ icon: act.emoji, text: act.name + ": +" + f + " food." });
        if (act.limit && n > act.limit) {
          var over = n - act.limit;
          if (act.source === "river") riverDelta -= (1 + over);
          if (act.source === "land") landDelta -= 2;
          lines.push({ icon: "⚠️", text: act.tooMany, warn: true });
        }
      } else if (act.kind === "shelter") {
        S.shelter = clamp(S.shelter + act.gain * n, 0, 100);
        lines.push({ icon: act.emoji, text: "Your teams repaired the house." });
      } else if (act.kind === "clothing") {
        S.clothing = clamp(S.clothing + act.gain * n, 0, 100);
        lines.push({ icon: act.emoji, text: "Your teams made and mended capes." });
      } else if (act.kind === "canoe") {
        S.canoeWork += n;
        if (S.canoeWork >= A.canoeWork) {
          S.canoe = true;
          lines.push({ icon: "🛶", text: "Your canoe is finished! Canoe fishing is now open, salmon catches grow, and trade carries more.", good: true });
        } else {
          lines.push({ icon: act.emoji, text: "Canoe carving: " + S.canoeWork + " of " + A.canoeWork + " seasons of work done." });
        }
      } else if (act.kind === "strings") {
        S.strings += act.gain * n;
        lines.push({ icon: act.emoji, text: "+" + (act.gain * n) + " shell strings." });
      } else if (act.kind === "trade") {
        var got = 0;
        for (var k = 0; k < n; k++) {
          if (S.strings >= act.cost) { S.strings -= act.cost; got += S.canoe ? act.foodCanoe : act.food; }
        }
        harvested += got;
        lines.push({ icon: act.emoji, text: "Trade: +" + got + " food." });
      } else if (act.kind === "care") {
        for (var c = 0; c < n; c++) {
          if (S.river <= S.land) S.river = clamp(S.river + 1, 1, 10); else S.land = clamp(S.land + 1, 1, 10);
        }
        lines.push({ icon: act.emoji, text: "Your teams cared for the river and land.", good: true });
      }
    });

    /* seasonal "why" notes */
    if ((p.salmon || 0) > 0 && si === 2) lines.push({ icon: "💡", text: "Fall is when salmon swim upstream. That is why fishing paid off so well." });
    if ((p.salmon || 0) > 0 && si === 3) lines.push({ icon: "💡", text: "Salmon are hard to catch in winter. Stored food matters most now." });
    if ((p.gather || 0) > 0 && si === 3) lines.push({ icon: "💡", text: "Few plants grow in the winter rain, so gathering brings little." });

    /* renewal of river and land */
    if (riverDelta > 0 && (p.care || 0) === 0) { /* natural renewal only */ }
    S.river = clamp(S.river + riverDelta, 1, 10);
    S.land = clamp(S.land + landDelta, 1, 10);

    /* wear and tear */
    var shelterDecay = [8, 6, 10, 20][si], clothingDecay = [6, 4, 8, 15][si];
    S.shelter = clamp(S.shelter - shelterDecay, 0, 100);
    S.clothing = clamp(S.clothing - clothingDecay, 0, 100);

    /* storehouse and eating */
    var before = S.food + harvested, overflow = 0;
    if (before > A.foodCap) { overflow = before - A.foodCap; before = A.foodCap; }
    if (overflow > 0) lines.push({ icon: "📦", text: "The storehouse is full. " + overflow + " food could not be kept." });
    var foodOk = before >= A.foodNeed, short = 0;
    if (foodOk) { S.food = before - A.foodNeed; } else { short = A.foodNeed - before; S.food = 0; }

    /* wellbeing (never a game over: hard seasons are survivable) */
    var shelterOk = S.shelter >= 40, clothingOk = shortMode() ? true : S.clothing >= 40;
    var d = 0;
    d += foodOk ? 4 : -Math.min(12, short);
    d += shelterOk ? 2 : -6;
    d += clothingOk ? 2 : -6;
    S.wellbeing = clamp(S.wellbeing + d, 0, 100);

    var status = [];
    status.push(foodOk ? { icon: "🍲", text: "Everyone had enough to eat.", good: true }
                       : { icon: "🍲", text: "A lean season. The community shared what little there was and got through, but it was hard.", warn: true });
    if (!shelterOk) status.push({ icon: "🏠", text: "The house is damp and drafty. It needs repairs.", warn: true });
    if (!clothingOk) status.push({ icon: "🧵", text: "Clothing is worn thin. People need new capes.", warn: true });

    S.report = { lines: lines, status: status, eat: foodOk ? A.foodNeed : before };
    S.history.push({ i: S.i, wellbeing: S.wellbeing });
    S.phase = "results";
    save(); render();
  }

  function nextSeason() {
    S.i += 1;
    if (S.i >= S.total) { S.phase = "final"; save(); render(); }
    else beginSeason();
  }

  /* ---------- rendering ---------- */
  function meter(emoji, label, value, max, text) {
    var pct = Math.round((value / max) * 100);
    return '<div class="meter"><div class="meter-top"><span class="m-ico" aria-hidden="true">' + emoji + '</span><span class="m-label">' + esc(label) +
      '</span><span class="m-val">' + esc(text) + '</span></div><div class="bar" role="img" aria-label="' + esc(label) + ' ' + esc(text) +
      '"><div class="fill" style="width:' + pct + '%"></div></div></div>';
  }
  function meters() {
    var h = '<section class="meters" aria-label="Community status">';
    h += meter("🍲", "Food stored", S.food, A.foodCap, S.food + " of " + A.foodCap);
    h += meter("🏠", "Plank house", S.shelter, 100, S.shelter >= 70 ? "Strong" : S.shelter >= 40 ? "Worn" : "Needs repair");
    if (!shortMode()) h += meter("🧵", "Clothing", S.clothing, 100, S.clothing >= 70 ? "Good" : S.clothing >= 40 ? "Worn" : "Needs new capes");
    h += meter("🐟", "River health", S.river, 10, S.river + " of 10");
    h += meter("🌲", "Forests and meadows", S.land, 10, S.land + " of 10");
    h += meter("💚", "Community wellbeing", S.wellbeing, 100, S.wellbeing >= 75 ? "Thriving" : S.wellbeing >= 45 ? "Doing okay" : "Struggling");
    h += '<div class="extras"><span>📿 Shell strings: <strong>' + S.strings + '</strong></span><span>🛶 Canoe: <strong>' +
      (S.canoe ? "Finished" : S.canoeWork > 0 ? S.canoeWork + " of " + A.canoeWork + " seasons" : "Not started") + '</strong></span></div>';
    h += '</section>';
    return h;
  }
  function header() {
    var s = season();
    return '<header class="season-head"><div class="season-ico" aria-hidden="true">' + s.emoji + '</div><div><h2>' + esc(s.name) + ", Year " + yearNum() +
      '</h2><p class="muted">Season ' + (S.i + 1) + " of " + S.total + '</p></div></header>';
  }
  function readBtn() { return '<button class="btn ghost" data-act="read" type="button">🔊 Read this page aloud</button>'; }

  function render() {
    var h = "";
    if (!S) { renderTitle(); return; }
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
    restoreFocus();
  }

  function restoreFocus() {
    if (!focusAfter) return;
    var el = document.querySelector(focusAfter);
    if (el) el.focus();
    focusAfter = null;
  }

  /* title and intro */
  function renderTitle() {
    var saved = load();
    var h = '<div class="title-screen" id="readable">';
    h += '<div class="hero" aria-hidden="true"><svg viewBox="0 0 600 160" preserveAspectRatio="xMidYMid slice"><rect width="600" height="160" fill="#cfe0dc"/>' +
      '<path d="M0 120 C80 100 140 110 220 96 C320 78 420 104 600 84 L600 160 L0 160Z" fill="#1f6f78"/>' +
      '<path d="M0 138 C120 122 200 140 320 126 C430 114 520 134 600 122 L600 160 L0 160Z" fill="#17535a"/>' +
      '<g fill="#1e3b34"><path d="M40 98 l18 -62 l18 62z"/><path d="M78 100 l22 -78 l22 78z"/><path d="M130 100 l16 -52 l16 52z"/><path d="M470 92 l18 -60 l18 60z"/><path d="M510 94 l22 -74 l22 74z"/><path d="M560 92 l14 -44 l14 44z"/></g></svg></div>';
    h += '<h1>' + esc(A.title) + '</h1><p class="lead">' + esc(A.subtitle) + '</p>';
    h += '<p>' + esc(A.intro.where) + '</p>';
    h += '<p>' + esc(A.intro.peoplesLine) + '</p>';
    h += '<ul class="say">' + A.intro.peoples.map(function (p) { return "<li><strong>" + esc(p.name) + "</strong>" + (p.say ? " (" + esc(p.say) + ")" : "") + "</li>"; }).join("") + '</ul>';
    h += '<p>' + esc(A.intro.job) + '</p>';
    h += '<aside class="note"><h3>About this game</h3><p>' + esc(A.intro.note) + '</p></aside>';
    h += '<details class="gloss"><summary>Words to know</summary><dl>' + A.glossary.map(function (g) { return "<dt>" + esc(g.word) + "</dt><dd>" + esc(g.meaning) + "</dd>"; }).join("") + '</dl></details>';
    h += '</div>';
    h += '<div class="choose"><h2>How long do you want to play?</h2><div class="row">' +
      '<button class="btn primary" data-act="start" data-mode="short" type="button">Short game<br><small>2 years, about 10 minutes</small></button>' +
      '<button class="btn primary" data-act="start" data-mode="full" type="button">Full game<br><small>3 years, about 15 minutes</small></button></div>';
    if (saved && saved.phase !== "final") h += '<button class="btn" data-act="continue" type="button">Continue my game (Year ' + (Math.floor(saved.i / 4) + 1) + ', ' + esc(A.seasons[saved.i % 4].name) + ')</button>';
    h += '</div><div class="row tools">' + readBtn() + '</div>';
    app.innerHTML = h; window.scrollTo(0, 0);
  }

  /* event */
  function viewEvent() {
    var ev = byId(A.events, S.eventId);
    var h = header() + meters() + '<section class="card" id="readable"><h2>' + ev.emoji + " " + esc(ev.title) + '</h2><p>' + esc(ev.text) + '</p><p class="muted">What will your community do?</p><div class="choices">';
    ev.choices.forEach(function (c, idx) {
      var ok = true;
      if (c.needs && c.needs.strings && S.strings < c.needs.strings) ok = false;
      h += '<button class="choice" data-act="choose" data-idx="' + idx + '" type="button"' + (ok ? "" : " disabled") + '><strong>' + esc(c.label) + '</strong><span>' + esc(c.desc) + (ok ? "" : " (You do not have enough shell strings.)") + '</span></button>';
    });
    h += '</div></section><div class="row tools">' + readBtn() + '</div>';
    return h;
  }
  function viewEventResult() {
    var ev = byId(A.events, S.eventId);
    return header() + meters() + '<section class="card" id="readable"><h2>' + ev.emoji + " " + esc(ev.title) + '</h2><p>' + esc(S.eventResult) + '</p></section>' +
      '<div class="row"><button class="btn primary" data-act="to-plan" type="button">Plan the season</button>' + readBtn() + '</div>';
  }

  /* planning */
  function viewPlan() {
    var s = season(), left = teamsAvailable() - teamsUsed();
    var h = header() + '<section class="card" id="readable"><p>' + esc(s.blurb) + '</p></section>' + meters();
    h += '<section class="plan"><div class="teams-bar" aria-live="polite"><strong>Work teams left: ' + left + '</strong> of ' + teamsAvailable() +
      (S.teamsLost ? '<span class="muted"> (' + S.teamsLost + ' team busy this season)</span>' : "") + '</div>';
    var group = "";
    A.activities.forEach(function (act) {
      if (!isAvailable(act)) return;
      if (act.group !== group) { if (group) h += "</div>"; group = act.group; h += '<h3 class="grp">' + esc(group) + '</h3><div class="acts">'; }
      var n = S.plan[act.id] || 0, mx = maxFor(act);
      var extra = "";
      if (act.kind === "food") {
        var v = foodPerTeam(act), st = stars(v);
        extra = '<span class="stars" title="Food from each team this season" aria-label="Food this season: ' + st + ' out of 3 stars">' + starText(st) + '</span>';
      }
      var note = "";
      if (act.kind === "canoe") note = '<p class="note-line">Progress: ' + S.canoeWork + " of " + A.canoeWork + " seasons of work.</p>";
      if (act.kind === "trade") note = '<p class="note-line">You have ' + S.strings + " shell strings. Each team uses " + act.cost + ".</p>";
      if (act.limit && act.kind === "food") note = '<p class="note-line">More than ' + act.limit + " teams here can wear down " + (act.source === "river" ? "the river" : "the forests and meadows") + ".</p>";
      h += '<div class="act"><div class="a-ico" aria-hidden="true">' + act.emoji + '</div><div class="a-info"><h4>' + esc(act.name) + " " + extra + '</h4><p>' + esc(act.desc) + '</p>' + note + '</div>' +
        '<div class="stepper"><button type="button" class="step" data-act="dec" data-id="' + act.id + '" aria-label="Fewer teams: ' + esc(act.name) + '"' + (n <= 0 ? " disabled" : "") + '>−</button>' +
        '<output aria-label="Teams assigned: ' + esc(act.name) + '">' + n + '</output>' +
        '<button type="button" class="step" data-act="inc" data-id="' + act.id + '" aria-label="More teams: ' + esc(act.name) + '"' + (n >= mx ? " disabled" : "") + '>+</button></div></div>';
    });
    h += "</div></section>";
    h += '<div class="row sticky-go"><button class="btn primary" data-act="go" type="button"' + (left === 0 ? "" : " disabled") + '>' + (left === 0 ? "Start the season" : "Use all " + teamsAvailable() + " teams to start") + '</button>' + readBtn() + '</div>';
    return h;
  }

  /* results */
  function viewResults() {
    var r = S.report;
    var h = header() + '<section class="card" id="readable"><h2>What happened this season</h2><ul class="report">';
    r.lines.concat(r.status).forEach(function (l) {
      h += '<li class="' + (l.warn ? "warn" : l.good ? "good" : "") + '"><span aria-hidden="true">' + l.icon + '</span><span>' + esc(l.text) + '</span></li>';
    });
    h += '</ul></section>' + meters();
    var last = S.i + 1 >= S.total;
    h += '<div class="row"><button class="btn primary" data-act="next" type="button">' + (last ? "See how your community did" : "Next season") + '</button>' + readBtn() + '</div>';
    return h;
  }

  /* final */
  function avg3(v, hi, mid) { return v >= hi ? 3 : v >= mid ? 2 : 1; }
  function viewFinal() {
    var wb = avg3(S.wellbeing, 75, 50);
    var land = avg3((S.river + S.land) / 2, 7, 5);
    var sh = S.shared >= 2 ? 3 : S.shared === 1 ? 2 : 1;
    var wbText = wb === 3 ? "Your community is thriving. People are well fed, dry, and warm." : wb === 2 ? "Your community is doing okay, with some hard seasons along the way." : "It was a hard stretch. Try planning ahead for winter next time.";
    var landText = land === 3 ? "The river and land are healthy and ready for the next generation." : land === 2 ? "The river and land held up, but they show some wear." : "The river and land are worn down. Taking less and caring more can help them recover.";
    var shText = sh === 3 ? "You shared with neighbors more than once. Sharing earns respect." : sh === 2 ? "You shared once. Sharing earns respect." : "You kept what you had. Sharing with neighbors is another way communities stayed strong.";
    var h = '<section class="card" id="readable"><h1>Your community after ' + (S.total / 4) + ' years</h1>' +
      '<div class="results-grid">' +
      '<div><h3>💚 Wellbeing</h3><p class="big">' + starText(wb) + '</p><p>' + esc(wbText) + '</p></div>' +
      '<div><h3>🌲 Care for the land</h3><p class="big">' + starText(land) + '</p><p>' + esc(landText) + '</p></div>' +
      '<div><h3>🤲 Sharing</h3><p class="big">' + starText(sh) + '</p><p>' + esc(shText) + '</p></div></div>' +
      '<p>📿 You ended with <strong>' + S.strings + '</strong> shell strings. Shells were money, and rich families showed off rare shells. But wealth alone did not win a person respect.</p>' +
      '<p>🛶 Canoe: ' + (S.canoe ? "You finished one." : "You did not finish one this time. Try it next game and see how it changes your catch.") + '</p></section>';
    h += '<section class="card"><h2>Think about it</h2><ul class="think">' + A.reflection.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + '</ul></section>';
    h += '<section class="card today"><h2>Today</h2><p>' + esc(A.today.text) + '</p><ul>' +
      A.today.links.map(function (l) { return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.name) + '</a></li>'; }).join("") + '</ul></section>';
    h += '<div class="row"><button class="btn primary" data-act="again" type="button">Play again</button>' + readBtn() + '</div>';
    return h;
  }

  /* ---------- read aloud ---------- */
  function readAloud() {
    if (!("speechSynthesis" in window)) { alert("Read aloud is not available in this browser."); return; }
    if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); return; }
    var nodes = document.querySelectorAll("#readable, .choose h2");
    var text = "";
    nodes.forEach(function (n) { text += n.innerText + ". "; });
    var u = new SpeechSynthesisUtterance(text || document.getElementById("app").innerText);
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }

  /* ---------- events ---------- */
  app.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act]"); if (!t || t.disabled) return;
    var act = t.getAttribute("data-act"), id = t.getAttribute("data-id");
    if (act === "read") { readAloud(); return; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (act === "start") { S = newState(t.getAttribute("data-mode")); beginSeason(); }
    else if (act === "continue") { S = load(); if (S) render(); }
    else if (act === "choose") {
      var ev = byId(A.events, S.eventId), c = ev.choices[+t.getAttribute("data-idx")];
      applyEffects(c.effects); S.eventResult = c.result; S.phase = "event-result"; save(); render();
    }
    else if (act === "to-plan") { S.phase = "plan"; save(); render(); }
    else if (act === "inc" || act === "dec") {
      var a = byId(A.activities, id), n = S.plan[id] || 0;
      if (act === "inc" && n < maxFor(a)) n++; else if (act === "dec" && n > 0) n--;
      if (n) S.plan[id] = n; else delete S.plan[id];
      var sel = '[data-act="' + act + '"][data-id="' + id + '"]';
      focusAfter = sel;
      save(); render();
      var stillOk = document.querySelector(sel);
      if (!stillOk || stillOk.disabled) { var o = document.querySelector('[data-act="' + (act === "inc" ? "dec" : "inc") + '"][data-id="' + id + '"]'); if (o && !o.disabled) o.focus(); }
    }
    else if (act === "go") { if (teamsUsed() === teamsAvailable()) resolveSeason(); }
    else if (act === "next") { nextSeason(); }
    else if (act === "again") { clearSave(); S = null; renderTitle(); }
  });

  /* start */
  S = null;
  renderTitle();
})();
