/* COLORADO RIVER AREA. Facts come from the TCI lesson "California's Native Peoples." */
window.GAME_AREAS.colorado = {
  id: "colorado", name: "Colorado River", color: "#6fa2cf", hero: "river",
  cardLine: "A life-giving river in a dry desert",
  title: "Seasons of the Colorado River",
  subtitle: "A harsh, dry land with a life-giving river",
  meters: { h1: { emoji: "🌾", label: "Riverbank soil" }, h2: { emoji: "🏜️", label: "Desert plants and animals" } },
  labels: { shelter: "Home", clothing: "Clothing" },
  decay: { shelter: [7, 10, 7, 10], clothing: [3, 3, 3, 5] },
  goods: { emoji: "📿", name: "beaded jewelry" },

  intro: {
    where: "The Colorado River area is a harsh, dry land, but a life-giving river flows through it. Long ago, the Colorado River overflowed its banks each spring, covering the land with fresh soil. This new soil turned the river's banks into a garden. Beyond the river lies the Mojave Desert, where little rain falls. Summers are hot and winters are cold.",
    peoples: [
      { name: "Mojave", say: "" },
      { name: "Yuma (also called Quechan)", say: "YOO-mah" }
    ],
    peoplesLine: "The Mojave and Yuma peoples have lived along the Colorado River for a very long time. They are still here today.",
    job: "You will guide the work teams of a Colorado River community through the seasons. Unlike other California Indians, your community lives by farming. Plant after the flood, harvest before the year ends, and use the desert to fill the gaps. Keep your community well, and take care of the soil and the desert."
  },

  start: { food: 12, shelter: 70, clothing: 70, goods: 2, h1: 8, h2: 8, wellbeing: 70 },
  teams: 6, foodNeed: 14, foodCap: 40,

  seasons: [
    { name: "Spring", emoji: "🌱", blurb: "The river floods and covers its banks with fresh, damp soil. It is time to plant." },
    { name: "Summer", emoji: "☀️", blurb: "Summers are hot. The crops grow in the fields, and the first ones are ready to harvest." },
    { name: "Fall", emoji: "🍂", blurb: "Harvest time! Crops left in the fields will be lost, so bring them in and store them for winter." },
    { name: "Winter", emoji: "❄️", blurb: "Winters are cold. Nothing grows in the fields now, so stored food and warm homes matter most." }
  ],

  activities: [
    { id: "plant", group: "Farming", emoji: "🌽", name: "Plant corn, beans, and squash", kind: "plant", only: [0], crops: 8, source: "h1",
      desc: "After a flood, use digging sticks to plant crops in the damp soil." },
    { id: "harvest", group: "Farming", emoji: "🧺", name: "Harvest the crops", kind: "harvest", only: [1, 2], perTeam: 6,
      desc: "Bring in the corn, beans, and squash that are ripe. Crops left in the fields after fall are lost." },

    { id: "gather", group: "Food", emoji: "🌵", name: "Gather desert plants", kind: "food", source: "h2", yields: [2, 2, 3, 2], limit: 3,
      desc: "Cactus, grasses, and bushes can survive in the desert beyond the river.",
      tooMany: "Gathering too much left fewer desert plants for next season." },
    { id: "hunt", group: "Food", emoji: "🐦", name: "Hunt small animals and birds", kind: "food", source: "h2", yields: [2, 2, 2, 2], limit: 3,
      desc: "The desert plants support small animals and birds.",
      tooMany: "Too much hunting left fewer small animals and birds." },

    { id: "house", group: "Home and clothing", emoji: "🏠", name: "Build summer and winter homes", kind: "shelter", gain: 15,
      desc: "Summer homes are brush shelters with open sides. Winter homes have four walls and a sloped roof, plastered with a thick coat of mud and grass to keep the heat in and the cold out." },
    { id: "clothes", group: "Home and clothing", emoji: "🧵", name: "Make clothing", kind: "clothing", gain: 15,
      desc: "Use skins, plant fibers, and other local materials to make clothing." },

    { id: "beads", group: "Trade", emoji: "📿", name: "Make beaded jewelry", kind: "goods", gain: 3,
      desc: "Some people suggest the Mojave made and traded valuable beaded jewelry. Each team makes 3 pieces." },
    { id: "trade", group: "Trade", emoji: "🔄", name: "Trade with nearby groups", kind: "trade", cost: 2, food: 5,
      desc: "The Mojaves likely traded with other nearby California Indian groups. Each team uses 2 pieces of jewelry." },

    { id: "care", group: "Care for the land", emoji: "🌱", name: "Care for the riverbank and desert", kind: "care",
      desc: "Look after the riverbank soil and the desert plants and animals. Each team helps the weaker of the two recover." }
  ],

  project: null,
  goodsFinal: "Jewelry may have been traded with nearby groups.",
  whyNotes: [
    { activity: "plant", season: 0, text: "Planting right after the flood uses the damp, fresh soil. That is why farming works here." },
    { activity: "harvest", season: 2, text: "Harvest before winter so the food can be stored." }
  ],

  events: [
    { id: "springFlood", seasons: [0], always: true, emoji: "🌊", title: "The spring flood",
      text: "Each spring the Colorado River overflows its banks. Floods are not always the same size.",
      outcomes: [
        { text: "This year the river spread just the right amount of water, leaving rich, fresh soil across the banks.",
          effects: { h1: 2, mod: { plant: 1.25 } },
          result: "A good flood! The soil is rich and ready for planting." },
        { text: "This year the flood was small, and less fresh soil reached the banks.",
          effects: { h1: -1, mod: { plant: 0.7 } },
          result: "A small flood means less fertile soil, so planting will give fewer crops." },
        { text: "This year the flood was very big and washed over some homes.",
          effects: { shelter: -15, mod: { plant: 0.9 } },
          result: "A very big flood. It damaged homes, but the soil was still good for planting." }
      ] },

    { id: "heatWave", seasons: [1], emoji: "🥵", title: "Extreme heat",
      text: "A heat wave bakes the fields and the desert.",
      choices: [
        { label: "Water and shade the fields", desc: "Lose 1 team's time, but the crops are safe.",
          effects: { teamsLost: 1 },
          result: "One team spent the season protecting the fields. The crops came through." },
        { label: "Keep all teams working", desc: "Crops in the fields may be lost.",
          effects: { crops: -8 },
          result: "The heat hurt some of the growing crops." }
      ] },

    { id: "desertRain", seasons: [0, 2], emoji: "🌧️", title: "Rare desert rain",
      text: "Rain is rare in the desert, but this season some came. Plants and animals are more plentiful.",
      choices: [
        { label: "Gather and hunt all you can", desc: "Desert food is extra plentiful.",
          effects: { mod: { gather: 1.4, hunt: 1.3 } },
          result: "The desert gave more than usual." },
        { label: "Gather some, and share with neighbors", desc: "A good harvest, plus a gift to neighbors.",
          effects: { mod: { gather: 1.2, hunt: 1.1 }, shared: 1 },
          result: "Sharing builds trust and respect." }
      ] },

    { id: "coldSpell", seasons: [3], emoji: "🥶", title: "A long cold spell",
      text: "Winters are cold here. A long cold spell wears down homes and clothing.",
      choices: [
        { label: "Plaster the winter home with more mud and grass", desc: "Lose 1 team's time, but the home holds heat.",
          effects: { shelter: 10, teamsLost: 1 },
          result: "A thick coating of mud and grass kept the heat in and the cold out." },
        { label: "Make do with what you have", desc: "Keep all teams busy, but the home loses heat.",
          effects: { shelter: -20 },
          result: "The cold got into the home. It will need repairs soon." }
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
    text: "The Mojave and Yuma (Quechan) peoples are living communities today. Dams built upstream on the Colorado River have ended the big yearly floods, so the river no longer works the way it did long ago. To learn about them from the people themselves, visit their official websites:",
    links: [
      { name: "Fort Mojave Indian Tribe", url: "https://www.fortmojaveindiantribe.com" },
      { name: "Fort Yuma Quechan Indian Tribe", url: "https://quechantribe.com" }
    ]
  },
  reflection: [
    "Why was the spring flood so important for farming?",
    "Why did your community need to plant in spring and harvest before winter?",
    "How did your community use the desert as well as the river?"
  ]
};
