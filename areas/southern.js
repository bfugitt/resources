/* SOUTHERN AREA. Facts come from the TCI lesson "California's Native Peoples." */
window.GAME_AREAS.southern = {
  id: "southern", name: "Southern", color: "#b59ac7", hero: "coast",
  cardLine: "A land of contrasts: coast, hills, and desert",
  title: "Seasons of the Southern Area",
  subtitle: "A land of contrasts",
  meters: { h1: { emoji: "🌊", label: "Shore and sea" }, h2: { emoji: "🌄", label: "Hills and valleys" } },
  labels: { shelter: "Domed house", clothing: "Clothing" },
  decay: { shelter: [6, 5, 6, 10], clothing: [4, 4, 5, 7] },
  goods: { emoji: "📿", name: "clamshell beads" },

  intro: {
    where: "The Southern area is a land of contrasts. Along the coast are beaches and rocky bluffs. Inland, there are hills, valleys, and desert. Oak trees, grasses, cactus, and brush grow in the hills. Many streambeds contain clay. Rain falls in the winter, but streams often dry up during the long, hot summers. People settled near year-round sources of water.",
    peoples: [
      { name: "Chumash", say: "CHOO-mash" },
      { name: "Luiseño", say: "loo-wee-SAYN-yo" }
    ],
    peoplesLine: "The Chumash, Luiseño, and other peoples have lived in this area for a very long time. They are still here today.",
    job: "You will guide the work teams of a Southern area community through the seasons. Some communities lived on the coast, and others in the hills and valleys. Use the sea, the hills, and the valleys, and keep your community well. Take care of them so they stay healthy."
  },

  start: { food: 14, shelter: 70, clothing: 70, goods: 2, h1: 8, h2: 8, wellbeing: 70 },
  teams: 6, foodNeed: 14, foodCap: 40,

  seasons: [
    { name: "Spring", emoji: "🌱", blurb: "The winter rains have fed the hills and valleys. Seeds and grasses are growing, and fish and shellfish fill the coastal waters." },
    { name: "Summer", emoji: "☀️", blurb: "Summers are long and hot. Streams often dry up, so people stay near year-round water." },
    { name: "Fall", emoji: "🍂", blurb: "Oak trees in the hills drop their acorns. The coastal waters still hold fish, seals, and sea lions." },
    { name: "Winter", emoji: "🌧️", blurb: "Rain falls in the winter. Streams run again, and stored food and clay pots are a great help." }
  ],

  activities: [
    { id: "shore", group: "Food", emoji: "🐚", name: "Gather shellfish and fish from shore", kind: "food", source: "h1", yields: [3, 3, 3, 2], limit: 3,
      desc: "The coastal waters were home to fish, and shellfish live along the beaches and rocks.",
      tooMany: "Taking too many from the shore left fewer shellfish and fish." },
    { id: "sea", group: "Food", emoji: "🛶", name: "Hunt and fish at sea", kind: "food", needsProject: true, source: "h1", yields: [4, 4, 4, 3], limit: 3,
      desc: "Your plank canoe can reach fish, seals, and sea lions far from shore.",
      tooMany: "Too many trips to sea left fewer fish and sea animals." },
    { id: "hunt", group: "Food", emoji: "🐇", name: "Hunt deer and rabbits", kind: "food", source: "h2", yields: [2, 3, 3, 3], limit: 2,
      desc: "Deer and rabbits live in the hills and valleys.",
      tooMany: "Too much hunting left fewer deer and rabbits." },
    { id: "seeds", group: "Food", emoji: "🌾", name: "Gather seeds and grasses", kind: "food", source: "h2", yields: [3, 3, 3, 1], limit: 3,
      desc: "The Luiseño gathered seeds and grasses, and even collected insects to eat.",
      tooMany: "Gathering too much left fewer seeds and grasses to grow back." },

    { id: "house", group: "Home and clothing", emoji: "🏠", name: "Build a domed house", kind: "shelter", gain: 15,
      desc: "Use willow sticks and reeds to build domed houses near year-round water." },
    { id: "clothes", group: "Home and clothing", emoji: "🧵", name: "Make clothing", kind: "clothing", gain: 15,
      desc: "Use skins, plant fibers, and other local materials to make clothing." },

    { id: "canoe", group: "Big projects and trade", emoji: "🪵", name: "Build a plank canoe", kind: "project",
      desc: "Near the coast, the Chumash built canoes out of wooden planks to hunt and fish at sea. It takes several seasons of work." },
    { id: "pots", group: "Big projects and trade", emoji: "🏺", name: "Make clay pots", kind: "storage", gain: 4, max: 16,
      desc: "Streambeds contain clay. Clay pots store and boil food and water. Each team adds room for 4 more food, up to 16 more." },
    { id: "beads", group: "Big projects and trade", emoji: "📿", name: "Make clamshell beads", kind: "goods", gain: 3,
      desc: "The Chumash used beads made of clamshells as money to buy resources from other groups. Each team makes 3 strings." },
    { id: "trade", group: "Big projects and trade", emoji: "🔄", name: "Trade beads for resources", kind: "trade", cost: 2, food: 5, foodProject: 7,
      desc: "Like other California Indians, the Chumash traded with other groups. Each team uses 2 strings. A canoe carries more." },

    { id: "care", group: "Care for the land", emoji: "🌱", name: "Care for the coast and hills", kind: "care",
      desc: "Take only part of what you find, and leave some behind. Each team helps the weaker of the shore-and-sea and the hills-and-valleys recover." }
  ],

  project: { id: "canoe", emoji: "🛶", stat: "Plank canoe", work: 4, boosts: {},
    done: "Your plank canoe is finished! You can now hunt and fish at sea, and trade carries more.",
    finalYes: "You built a plank canoe, like the Chumash did. It opened up the sea and carried more trade goods.",
    finalNo: "You did not build a canoe this time. Try it next game and see what the sea adds to your food." },
  goodsFinal: "Shell beads were money. Food was so plentiful on the coast that a Chumash village may have supported a thousand people.",
  whyNotes: [
    { activity: "sea", season: 0, text: "The sea was full of fish, seals, and sea lions. A canoe opened all of it." },
    { activity: "seeds", season: 3, text: "Few seeds grow in winter, so gathering brings little." },
    { activity: "shore", season: 2, text: "The coastal waters give steady food all year." }
  ],

  events: [
    { id: "streamsDry", seasons: [1], emoji: "🏜️", title: "The streams are drying up",
      text: "The summer is long and hot, and the streams are drying up. Water is harder to find in the hills.",
      choices: [
        { label: "Move closer to year-round water", desc: "Lose 1 team's time to move, but keep gathering.",
          effects: { mod: { seeds: 0.9 }, teamsLost: 1 },
          result: "People settled near year-round water. Moving took time, but the community had the water it needed." },
        { label: "Stay and use the coast more", desc: "Shore food is easier now. Seeds and hunting are harder.",
          effects: { mod: { shore: 1.2, seeds: 0.6, hunt: 0.7 } },
          result: "You leaned on the coast while the hills were dry." }
      ] },

    { id: "hillFire", seasons: [2], emoji: "🔥", title: "A fire in the dry hills",
      text: "The hills are dry after the long summer, and a fire sweeps through them.",
      choices: [
        { label: "Move to the coast until the rains", desc: "The hills are hurt, but the coast feeds you.",
          effects: { mod: { seeds: 0.5, hunt: 0.6, shore: 1.2 } },
          result: "You moved to the coast. After the winter rains, the hills will begin to grow again." },
        { label: "Protect the village and stay", desc: "Lose 1 team's time, but the village is safe.",
          effects: { mod: { seeds: 0.7, hunt: 0.8 }, teamsLost: 1 },
          result: "One team worked to protect the village. The hills will need time to recover." }
      ] },

    { id: "winterStorm", seasons: [3], emoji: "⛈️", title: "A big winter storm",
      text: "Heavy rain and wind hit the coast and the hills. The storm damages your house.",
      choices: [
        { label: "Repair it right away", desc: "Lose 1 team's time, but the damage is small.",
          effects: { shelter: -10, teamsLost: 1 },
          result: "Quick repairs kept the house strong." },
        { label: "Patch it and keep working", desc: "Keep all teams busy, but the house is damaged.",
          effects: { shelter: -30 },
          result: "You kept working, but the house took a lot of damage." }
      ] },

    { id: "calmSeas", seasons: [0, 1, 2], emoji: "🌊", title: "Calm seas",
      text: "The ocean is calm and full of fish, seals, and sea lions. A canoe can carry a team far out on the water.",
      needs: { project: true },
      choices: [
        { label: "Take long trips to sea", desc: "Sea hunting and fishing are extra good this season.",
          effects: { mod: { sea: 1.5 } },
          result: "Your canoes carried your teams to rich waters." }
      ] },

    { id: "richSeeds", seasons: [0], emoji: "🌾", title: "A rich seed year",
      text: "Plenty of winter rain has made the hills and valleys full of seeds and grasses.",
      choices: [
        { label: "Gather all you can", desc: "Seeds are extra plentiful this season.",
          effects: { mod: { seeds: 1.5 } },
          result: "A bountiful spring! Your teams gathered a lot." },
        { label: "Gather some, and share with neighbors", desc: "A good harvest, plus a gift to neighbors.",
          effects: { mod: { seeds: 1.25 }, shared: 1 },
          result: "Sharing earns trust and respect." }
      ] },

    { id: "neighborsNeed", seasons: [0, 1, 2, 3], emoji: "🤲", title: "Neighbors need help",
      text: "A nearby village had a hard season and is short on food. They ask if you can share.",
      needs: { food: 10 },
      choices: [
        { label: "Share 6 food", desc: "Give food from your storehouse.",
          effects: { food: -6, shared: 1 },
          result: "Sharing earns respect. Someday your community may need help too." },
        { label: "Keep your food", desc: "Hold on to your whole storehouse.",
          effects: {},
          result: "You kept your food for your own community this season." }
      ] }
  ],

  today: {
    text: "The Chumash and Luiseño peoples are living communities today. The Santa Ynez Band of Chumash Indians runs a museum and cultural center. The Rincon Band of Luiseño Indians has a museum too. To learn about them from the people themselves, visit their official websites:",
    links: [
      { name: "Santa Ynez Band of Chumash Indians", url: "https://chumash.gov" },
      { name: "Rincon Band of Luiseño Indians", url: "https://rincon-nsn.gov" }
    ]
  },
  reflection: [
    "How was life on the coast different from life in the hills and valleys?",
    "How did clay pots and canoes help your community?",
    "Why did people settle near year-round sources of water?"
  ]
};
