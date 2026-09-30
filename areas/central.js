/* CENTRAL AREA. Facts come from the TCI lesson "California's Native Peoples." */
window.GAME_AREAS.central = {
  id: "central", name: "Central", color: "#a88a6a", hero: "oak",
  cardLine: "Oak trees, rolling hills, and the Central Valley",
  title: "Seasons of the Central Area",
  subtitle: "From the Pacific Ocean to the Sierra Nevada",
  meters: { h1: { emoji: "🌳", label: "Oak groves and grasslands" }, h2: { emoji: "💧", label: "Rivers and marshes" } },
  labels: { shelter: "Home", clothing: "Clothing" },
  decay: { shelter: [6, 5, 6, 12], clothing: [4, 3, 5, 8] },
  goods: { emoji: "📿", name: "shell strings" },

  intro: {
    where: "The Central area stretches from the Pacific Ocean to the Sierra Nevada. It includes rolling hills and the long, flat Central Valley. There are rivers, marshes, and a few lakes. The climate is mild, with rainy winters and dry summers. Oak trees and wild grasses once covered the area. This area had the largest Indian population in the state and the most abundant natural resources.",
    peoples: [
      { name: "Ohlone", say: "oh-LOW-nee" },
      { name: "Miwok", say: "MEE-wahk" },
      { name: "Yokuts", say: "" }
    ],
    peoplesLine: "Many peoples have lived here for hundreds of years or more, including the Ohlone, Miwok, and Yokuts. They are still here today.",
    job: "You will guide the work teams of a Central area community through the seasons. Acorns are the most important food, but a strong community uses many resources. Keep your community well, and take care of the oak groves, rivers, and marshes."
  },

  start: { food: 16, shelter: 70, clothing: 70, goods: 2, h1: 8, h2: 8, wellbeing: 70 },
  teams: 6, foodNeed: 14, foodCap: 40,

  seasons: [
    { name: "Spring", emoji: "🌱", blurb: "The winter rains are ending. Wild grasses and seeds are growing, and the rivers and marshes are full." },
    { name: "Summer", emoji: "☀️", blurb: "Summers are dry. Deer graze in the grasslands, and the marshes and rivers still hold fish." },
    { name: "Fall", emoji: "🍂", blurb: "Acorn season! Acorns fall from the oak trees. They were a staple food for California Indians. Gather plenty and store them." },
    { name: "Winter", emoji: "🌧️", blurb: "Winters are rainy but mild. Acorn meal stored in airtight baskets can be cooked all year, so your stored food matters most." }
  ],

  activities: [
    { id: "acorns", group: "Food", emoji: "🌰", name: "Gather and prepare acorns", kind: "food", source: "h1", yields: [8, 8, 8, 8], only: [2], limit: 3,
      desc: "Acorns are ground up, and hot water is poured over them to wash away the bitter taste. The acorn meal is stored in airtight baskets and cooked all year in stews and other dishes.",
      tooMany: "Gathering every acorn left too few to grow into new oak trees." },
    { id: "seeds", group: "Food", emoji: "🌾", name: "Gather seeds and plants", kind: "food", source: "h1", yields: [3, 3, 2, 1], limit: 3,
      desc: "Wild grasses and other plants cover the hills and valley.",
      tooMany: "Gathering too many seeds left fewer plants to grow back." },
    { id: "hunt", group: "Food", emoji: "🦌", name: "Hunt deer", kind: "food", source: "h1", yields: [2, 2, 3, 3], limit: 2,
      desc: "Deer graze in the grasslands, and hunters in the hills and mountains hunt them.",
      tooMany: "Too much hunting left fewer deer in the grasslands." },
    { id: "fish", group: "Food", emoji: "🐟", name: "Fish in rivers and marshes", kind: "food", source: "h2", yields: [3, 3, 3, 2], limit: 3,
      desc: "The Yokuts fished in the rivers of the Central Valley.",
      tooMany: "Too much fishing left fewer fish in the rivers and marshes." },
    { id: "shellfish", group: "Food", emoji: "🐚", name: "Gather shellfish (coastal groups)", kind: "food", yields: [2, 2, 2, 2],
      desc: "Clams and other shellfish live in coastal waters. The Ohlone and Miwok who lived on the coast gathered and ate them." },

    { id: "house", group: "Home and clothing", emoji: "🏠", name: "Build and repair homes", kind: "shelter", gain: 15,
      desc: "Some people built round houses from poles covered with reeds or bark. Others made cone-shaped houses by leaning slabs of bark against a center post." },
    { id: "clothes", group: "Home and clothing", emoji: "🧵", name: "Make clothing", kind: "clothing", gain: 15,
      desc: "Use skins, plant fibers, and other local materials to make clothing." },

    { id: "storehouse", group: "Big projects and trade", emoji: "🧺", name: "Build storehouses", kind: "storage", gain: 5, max: 20,
      desc: "Storehouses that looked like large baskets on legs kept food safe. Each team adds room for 5 more food, up to 20 more." },
    { id: "shells", group: "Big projects and trade", emoji: "📿", name: "String shell money", kind: "goods", gain: 3,
      desc: "Coastal Miwok used leftover shells as money to buy resources from other Miwok on the plains and in the Sierra Nevada. Each team makes 3 strings." },
    { id: "trade", group: "Big projects and trade", emoji: "🔄", name: "Trade for resources", kind: "trade", cost: 2, food: 5,
      desc: "Trade shell strings for food and other resources from other groups. Each team uses 2 strings." },

    { id: "care", group: "Care for the land", emoji: "🌱", name: "Care for the oaks and waters", kind: "care",
      desc: "Leave some acorns to grow and some fish to swim on. Each team helps the weaker of the oak groves and the waters recover." }
  ],

  project: null,
  goodsFinal: "Shells were used as money to buy resources from other groups.",
  whyNotes: [
    { activity: "acorns", season: 2, text: "Acorns fall in autumn. Stored acorn meal feeds a community all year." },
    { activity: "fish", season: 1, text: "Summers are dry, but rivers and marshes still hold fish." }
  ],

  events: [
    { id: "poorAcorn", seasons: [2], emoji: "🌰", title: "A poor acorn year",
      text: "The oak trees dropped fewer acorns this fall. Some years are like that, even in a rich land.",
      choices: [
        { label: "Fish and hunt more", desc: "Look to other foods this season.",
          effects: { mod: { acorns: 0.5, fish: 1.2, hunt: 1.2 } },
          result: "You turned to rivers and grasslands. A community that uses many resources can handle a poor acorn year." },
        { label: "Trade shell strings for food", desc: "Give 4 shell strings and get 10 food.", needs: { goods: 4 },
          effects: { mod: { acorns: 0.5 }, goods: -4, food: 10 },
          result: "Your shell strings bought food from neighbors." },
        { label: "Gather every acorn you can find", desc: "More acorns now, but fewer new oak trees later.",
          effects: { mod: { acorns: 0.7 }, h1: -2 },
          result: "You got more acorns now, but the oak groves will grow back more slowly." }
      ] },

    { id: "richAcorn", seasons: [2], emoji: "🌳", title: "A bumper acorn crop",
      text: "The oaks are heavy with acorns this fall.",
      choices: [
        { label: "Gather all you can", desc: "Acorns are extra plentiful this season.",
          effects: { mod: { acorns: 1.4 } },
          result: "What a harvest! The storehouses will be full." },
        { label: "Gather some, and share with neighbors", desc: "A good harvest, plus a gift to neighbors.",
          effects: { mod: { acorns: 1.2 }, shared: 1 },
          result: "Sharing earns trust and respect." }
      ] },

    { id: "valleyFlood", seasons: [0, 3], emoji: "🌊", title: "Rivers overflow",
      text: "Heavy rain makes the rivers overflow across the flat Central Valley. Water reaches your homes.",
      choices: [
        { label: "Move to higher ground and repair", desc: "Lose 1 team's time, but the damage is small.",
          effects: { shelter: -10, teamsLost: 1 },
          result: "Moving to higher ground kept people safe. One team spent the season repairing." },
        { label: "Stay and patch the homes", desc: "Keep all teams busy, but the homes are damaged.",
          effects: { shelter: -30 },
          result: "You stayed, but the floodwater did a lot of damage." }
      ] },

    { id: "drySummer", seasons: [1], emoji: "🏜️", title: "A very dry summer",
      text: "The marshes are shrinking and the rivers run low.",
      choices: [
        { label: "Fish the larger rivers", desc: "Lose 1 team's time to travel, but keep catching fish.",
          effects: { mod: { fish: 0.85 }, teamsLost: 1 },
          result: "The larger rivers still had fish." },
        { label: "Rely on seeds, deer, and stored food", desc: "Fish less. Seeds and hunting are easier.",
          effects: { mod: { fish: 0.6, seeds: 1.2, hunt: 1.2 } },
          result: "You shifted to other foods while the waters recovered." }
      ] },

    { id: "traders", seasons: [0, 1, 2], emoji: "🤝", title: "Traders arrive",
      text: "Traders from the Sierra Nevada arrive. They have acorn meal and other goods and want shell money.",
      choices: [
        { label: "Trade 4 shell strings for 10 food", desc: "Shell strings buy resources from other groups.", needs: { goods: 4 },
          effects: { goods: -4, food: 10 },
          result: "Trade brought your community food from far away." },
        { label: "Not this time", desc: "Keep your shell strings.",
          effects: {},
          result: "You kept your shell strings for another time." }
      ] },

    { id: "neighborsNeed", seasons: [0, 1, 2, 3], emoji: "🤲", title: "Neighbors need help",
      text: "A nearby community had a hard season and is short on food. They ask if you can share.",
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
    text: "Ohlone, Miwok, and Yokuts people live in California today, and many work to keep their languages, foods, and traditions alive. The Tuolumne Band of Me-Wuk Indians (Miwok) holds an acorn festival each September. The Tule River Tribe is a Yokuts tribe. To learn about them from the people themselves, visit their official websites:",
    links: [
      { name: "Tuolumne Band of Me-Wuk Indians (Miwok)", url: "https://mewuk.com" },
      { name: "Tule River Indian Tribe (Yokuts)", url: "https://tulerivertribe-nsn.gov" }
    ]
  },
  reflection: [
    "Why were acorns such an important food in the Central area?",
    "How did storehouses and shell money help your community?",
    "What could your community do in a poor acorn year?"
  ]
};
