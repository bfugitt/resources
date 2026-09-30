/* ==========================================================
   NORTHWEST AREA DATA
   Everything a teacher might want to edit lives in this file.
   Facts come from the TCI lesson "California's Native Peoples".
   The engine (game.js) reads this file; you don't need to touch
   game.js to change wording, numbers, or events.
   ========================================================== */

window.GAME_AREAS.northwest = {
  id: "northwest", name: "Northwest", color: "#d98a86", hero: "forest",
  cardLine: "Forests, rivers, and salmon",
  title: "Seasons of the Northwest",
  subtitle: "A land of forests and rivers",
  meters: { h1: { emoji: "🐟", label: "River health" }, h2: { emoji: "🌲", label: "Forests and meadows" } },
  labels: { shelter: "Plank house", clothing: "Clothing" },
  decay: { shelter: [8, 6, 10, 20], clothing: [6, 4, 8, 15] },
  goods: { emoji: "📿", name: "shell strings" },

  intro: {
    where: "The Northwest area of California is a land of forests and rivers with a rainy but mild climate. Along the coast there are marshes filled with reeds, and tall trees cover the hills near the sea. Further inland there are grassy meadows. The beaches, marshes, and rivers were full of food.",
    peoples: [
      { name: "Yurok", say: "YUR-ahk" },
      { name: "Karuk", say: "KAR-ook" },
      { name: "Tolowa", say: "" }
    ],
    peoplesLine: "Many different peoples, including the Yurok, Karuk, and Tolowa, have lived in this area for a very long time. They are still here today.",
    job: "You will guide the work teams of a Northwest community through the seasons. Each season, decide how your teams spend their time. Keep your community well. Take care of the river and the land so they stay healthy for the next generation.",
    note: "This game is a simplified model made for learning in class. Real life was richer and more complicated. The Northwest has many different peoples, each with its own language, stories, and ways of doing things. This game does not try to show any one tribe's traditions. It leaves out ceremonies and sacred stories on purpose."
  },

  start: { food: 14, shelter: 70, clothing: 70, goods: 2, h1: 8, h2: 8, wellbeing: 70 },
  teams: 6,          // work teams each season
  foodNeed: 14,      // food the community eats each season
  foodCap: 40,       // the storehouse holds this much

  seasons: [
    { name: "Spring", emoji: "🌱",
      blurb: "Rain keeps the forests green. The meadows and marshes start to grow. Some salmon swim up the rivers." },
    { name: "Summer", emoji: "☀️",
      blurb: "It is drier, but the climate stays mild. Meadows are full of plants, and the rivers run lower." },
    { name: "Fall", emoji: "🍂",
      blurb: "The big salmon run! Salmon swim upstream to lay their eggs, and the rivers teem with fish. This is the best time to fish." },
    { name: "Winter", emoji: "🌧️",
      blurb: "Storms bring heavy rain. Fish and plants are harder to find, so the food you stored matters most. Homes and clothing wear out faster." }
  ],

  /* ---------- ACTIVITIES ----------
     kind: food | shelter | clothing | canoe | strings | trade | care
     yields: food per team in [Spring, Summer, Fall, Winter]
     source: "h1" or "land" makes the yield depend on that health meter
     limit: more teams than this in one season harms that meter  */
  activities: [
    { id: "salmon", group: "Food", emoji: "🐟", name: "Fish for salmon", kind: "food", source: "h1",
      yields: [3, 2, 6, 1], limit: 3,
      desc: "Use nets and traps as salmon swim upstream. The Karuk caught so many this way that a family might have enough fish for a whole year in just a few weeks.",
      tooMany: "Too many teams fishing took more salmon than the river could replace. There may be fewer fish next time." },
    { id: "shellfish", group: "Food", emoji: "🐚", name: "Gather shellfish", kind: "food",
      yields: [3, 3, 3, 2],
      desc: "The beaches and marshes were full of shellfish and fish. This food is steady all year." },
    { id: "hunt", group: "Food", emoji: "🦌", name: "Hunt deer and elk", kind: "food", source: "h2",
      yields: [2, 2, 4, 3], limit: 2,
      desc: "Deer and elk roamed the forests.",
      tooMany: "Too many hunting teams left fewer deer and elk in the forest." },
    { id: "gather", group: "Food", emoji: "🌿", name: "Gather plants and berries", kind: "food", source: "h2",
      yields: [3, 4, 2, 1], limit: 3,
      desc: "Collect plants, seeds, and berries from the meadows and forests.",
      tooMany: "Gathering too much left fewer plants to grow back." },
    { id: "canoeFish", group: "Food", emoji: "🛶", name: "Fish from the canoe", kind: "food", needsProject: true,
      yields: [4, 4, 4, 2],
      desc: "Your canoe can reach fish far out on the water. The ocean stays steady, so this does not wear out the river." },

    { id: "house", group: "Home and clothing", emoji: "🏠", name: "Build and repair the plank house", kind: "shelter", gain: 15,
      desc: "People of this area built sturdy homes with wood planks. Rain, wind, and time wear them down, so they need care." },
    { id: "capes", group: "Home and clothing", emoji: "🧵", name: "Make cedar-bark capes", kind: "clothing", gain: 15,
      desc: "Waterproof capes made from the bark of cedar trees keep people dry in the rain." },

    { id: "canoe", group: "Big projects and trade", emoji: "🪵", name: "Carve a canoe", kind: "project",
      desc: "The Yurok hollowed out huge logs to make ocean-going canoes that could carry lots of fish. A canoe takes several seasons of work, and it does not wear out." },
    { id: "strings", group: "Big projects and trade", emoji: "📿", name: "Gather and string shells", kind: "goods", gain: 3,
      desc: "Shells served as money. Each team makes 3 strings of shells to trade." },
    { id: "trade", group: "Big projects and trade", emoji: "🔄", name: "Trade with neighbors", kind: "trade", cost: 2, food: 5, foodProject: 7,
      desc: "Trade shell strings for food. Each team uses 2 strings. A canoe lets you carry more." },

    { id: "care", group: "Care for the land", emoji: "🌱", name: "Care for the river and land", kind: "care",
      desc: "Gather carefully, leave some behind for next year, and look after the river and meadows. Each team helps the weaker of the two recover." }
  ],

  project: { id: "canoe", emoji: "🛶", stat: "Canoe", work: 4, boosts: { salmon: 1.2 },
    done: "Your canoe is finished! Canoe fishing is now open, salmon catches grow, and trade carries more.",
    finalYes: "You finished a canoe, like the Yurok canoe makers. It carried more fish and more trade goods.",
    finalNo: "You did not finish a canoe this time. Try it next game and see how it changes your catch." },
  goodsFinal: "Shells were money, and rich families showed off rare shells. But wealth alone did not win a person respect.",
  whyNotes: [
    { activity: "salmon", season: 2, text: "Fall is when salmon swim upstream. That is why fishing paid off so well." },
    { activity: "salmon", season: 3, text: "Salmon are hard to catch in winter. Stored food matters most now." },
    { activity: "gather", season: 3, text: "Few plants grow in the winter rain, so gathering brings little." }
  ],
  /* ---------- EVENTS ----------
     seasons: which seasons it can happen in (0 Spring, 1 Summer, 2 Fall, 3 Winter)
     effects: food, shelter, clothing, strings, river, land, teamsLost, shared,
              mod: { activityId: multiplier for this season }
     needs:   { strings: n, food: n, canoe: true }  */
  events: [
    { id: "weakRun", seasons: [2], emoji: "🐟", title: "A smaller salmon run",
      text: "This fall fewer salmon are swimming up the river. Nature changes from year to year. Communities that eat many different foods handle these years best.",
      choices: [
        { label: "Let more fish swim upstream", desc: "Fish less so more salmon can lay their eggs.",
          effects: { mod: { salmon: 0.5 }, h1: 2 },
          result: "You left more fish to lay eggs. Food is tight this fall, but the river will be healthier for years to come." },
        { label: "Trade shell strings for food", desc: "Give 4 shell strings and get 10 food.", needs: { goods: 4 },
          effects: { mod: { salmon: 0.5 }, goods: -4, food: 10 },
          result: "Your shell strings bought food from neighbors. Trade helped your community through a hard year." },
        { label: "Fish as hard as you can", desc: "Get more salmon now. The river may pay for it later.",
          effects: { mod: { salmon: 0.7 }, h1: -2 },
          result: "You caught more fish now, but taking so many weakened the river. Think about the next few years." }
      ] },

    { id: "winterStorm", seasons: [2, 3], emoji: "⛈️", title: "A big storm",
      text: "Heavy rain and wind batter the coast. The storm damages your plank house.",
      choices: [
        { label: "Repair it right away", desc: "Lose 1 team's time this season, but the damage is small.",
          effects: { shelter: -10, teamsLost: 1 },
          result: "Quick repairs kept the house strong. One team spent the season fixing it, so you have one fewer team for other work." },
        { label: "Patch it and keep working", desc: "Keep all your teams busy, but the house is damaged.",
          effects: { shelter: -30 },
          result: "You kept working, but the house took a lot of damage. It will need repairs soon." }
      ] },

    { id: "lowRiver", seasons: [1], emoji: "🏞️", title: "Low water in the river",
      text: "After a dry spell the river runs low, and the salmon are harder to reach.",
      choices: [
        { label: "Fish the deep pools upriver", desc: "Lose 1 team's time to travel, but keep some of your salmon catch.",
          effects: { mod: { salmon: 0.8 }, teamsLost: 1 },
          result: "Travel upriver took a team's time, but you found fish in the deep pools." },
        { label: "Turn to the sea and meadows", desc: "Fish less for salmon. Shellfish and plants are easier to find.",
          effects: { mod: { salmon: 0.6, shellfish: 1.3, gather: 1.3 } },
          result: "You shifted to other foods. Knowing many ways to get food is one way people adapted." }
      ] },

    { id: "richMeadows", seasons: [0, 1], emoji: "🌿", title: "Rich meadows",
      text: "Plenty of rain has fed the grassy meadows. Berries and seeds are everywhere.",
      choices: [
        { label: "Gather all you can", desc: "Plants and berries are extra plentiful this season.",
          effects: { mod: { gather: 1.5 } },
          result: "A bountiful season! Your teams gathered a lot." },
        { label: "Gather some, and share with neighbors", desc: "A good harvest, plus a gift to neighbors.",
          effects: { mod: { gather: 1.25 }, shared: 1 },
          result: "Sharing your good harvest builds trust. Neighbors remember who helped them." }
      ] },

    { id: "neighborsNeed", seasons: [0, 1, 2, 3], emoji: "🤲", title: "Neighbors need help",
      text: "A community down the coast had a hard season after a flood. They are short on food and ask if you can share.",
      needs: { food: 10 },
      choices: [
        { label: "Share 6 food", desc: "Give food from your storehouse.",
          effects: { food: -6, shared: 1 },
          result: "Sharing earns respect. Someday your community may need help too." },
        { label: "Keep your food", desc: "Hold on to your whole storehouse.",
          effects: {},
          result: "You kept your food for your own community this season." }
      ] },

    { id: "coldSpell", seasons: [3], emoji: "🥶", title: "A long, cold, wet spell",
      text: "Cold rain soaks everything. Cedar-bark capes wear out faster.",
      choices: [
        { label: "Make new capes now", desc: "Lose 1 team's time, but stay dry and warm.",
          effects: { clothing: 5, teamsLost: 1 },
          result: "Fresh capes kept people dry. One team spent the season making them." },
        { label: "Make do with what you have", desc: "Keep all teams busy, but clothing wears out.",
          effects: { clothing: -15 },
          result: "Clothing wore out in the cold rain. You will need to make new capes soon." }
      ] },

    { id: "calmSeas", seasons: [0, 1, 2], emoji: "🌊", title: "Calm seas",
      text: "The ocean is calm and full of fish. A canoe can carry a team far out on the water.",
      needs: { project: true },
      choices: [
        { label: "Take long fishing trips", desc: "Canoe fishing is extra good this season.",
          effects: { mod: { canoeFish: 1.5 } },
          result: "Your canoe carried your teams to rich fishing waters. Good transportation makes a big difference." }
      ] }
  ],

  today: {
    text: "The Yurok, Karuk, and Tolowa peoples are living communities today. Each has its own government, language programs, and work to protect the land, rivers, and salmon. To learn about them from the people themselves, visit their official websites:",
    links: [
      { name: "Yurok Tribe", url: "https://www.yuroktribe.org" },
      { name: "Karuk Tribe", url: "https://www.karuk.us" },
      { name: "Tolowa Dee-ni' Nation", url: "https://www.tolowa.gov" }
    ]
  },

  reflection: [
    "Which resources in the Northwest helped your community the most? Why?",
    "How did the environment shape the way your community lived?",
    "What did you do to take care of the river and land? Why does that matter?"
  ]
};
