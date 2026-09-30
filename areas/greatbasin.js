/* GREAT BASIN AREA. Facts come from the TCI lesson "California's Native Peoples." */
window.GAME_AREAS.greatbasin = {
  id: "greatbasin", name: "Great Basin", color: "#e3c86b", hero: "desert",
  cardLine: "Desert, mountains, and moving with the food",
  title: "Seasons of the Great Basin",
  subtitle: "East of the Sierra Nevada",
  meters: { h1: { emoji: "🌲", label: "Seed grasses and pine groves" }, h2: { emoji: "🐇", label: "Game animals" } },
  labels: { shelter: "Dome-shaped home", clothing: "Clothing and blankets" },
  decay: { shelter: [14, 12, 14, 22], clothing: [8, 5, 10, 18] },
  goods: { emoji: "🪨", name: "obsidian tools" },

  intro: {
    where: "The Great Basin lies east of the Sierra Nevada. Little rain falls on this side of the mountains, and much of the land is desert. Large deposits of obsidian, a glass-like rock, dot the landscape. Summers are hot and dry, but winters can be very cold. There are no large rivers or oak trees, but the mountain slopes have pine trees and wild grasses.",
    peoples: [
      { name: "Washoe", say: "" },
      { name: "Mono", say: "MOH-no" }
    ],
    peoplesLine: "The Washoe, Mono, and other peoples have lived in the Great Basin for a very long time. They are still here today.",
    job: "You will guide the work teams of a Great Basin community through the seasons. Your community is a nomad community. It moves often to follow the food. Each season, decide where to camp and how to spend your time. In winter you settle in one place, so you need enough stored food to last until spring."
  },

  start: { food: 12, shelter: 70, clothing: 70, goods: 2, h1: 8, h2: 8, wellbeing: 70 },
  teams: 6, foodNeed: 14, foodCap: 40,

  seasons: [
    { name: "Spring", emoji: "🌱", blurb: "Grass seeds are ready in some places. Rabbits live on the desert floor. Where will you camp?" },
    { name: "Summer", emoji: "☀️", blurb: "Summers are hot and dry. The mountain slopes are cooler, and deer wander there." },
    { name: "Fall", emoji: "🍂", blurb: "Pine nuts are ready on the mountain slopes. Gather all you can, because winter is coming." },
    { name: "Winter", emoji: "❄️", blurb: "Winters can be very cold. Your community settles in one place. If you collected enough food, you can survive until spring." }
  ],

  activities: [
    { id: "seeds", group: "Food", emoji: "🌾", name: "Gather grass seeds", kind: "food", source: "h1", yields: [3, 4, 2, 0], only: [0, 1, 2], limit: 3,
      desc: "Wild grasses grow on the slopes. Your community finds grass seeds at one camp and pine nuts at the next.",
      tooMany: "Gathering too many seeds left fewer grasses to grow back." },
    { id: "pine", group: "Food", emoji: "🌰", name: "Gather pine nuts", kind: "food", source: "h1", yields: [0, 0, 8, 0], only: [2], limit: 3,
      desc: "Pine trees grow on the mountain slopes. Their nuts are a rich food that keeps well through winter.",
      tooMany: "Taking too many pine nuts left fewer for the trees to grow more." },
    { id: "hunt", group: "Food", emoji: "🦌", name: "Hunt deer", kind: "food", source: "h2", yields: [2, 2, 4, 3], limit: 2,
      desc: "Deer and antelope wander the mountain slopes.",
      tooMany: "Too much hunting left fewer deer on the slopes." },
    { id: "rabbits", group: "Food", emoji: "🐇", name: "Trap rabbits", kind: "food", source: "h2", yields: [3, 3, 3, 3], limit: 3,
      desc: "Rabbits, snakes, and lizards live on the desert floor. Rabbits are a steady food all year.",
      tooMany: "Trapping too many rabbits left fewer for next season." },

    { id: "house", group: "Home and clothing", emoji: "🏠", name: "Build a dome-shaped home", kind: "shelter", gain: 25,
      desc: "The Washoe built dome-shaped homes of bark and brush, with a fire pit in the center. They are quick to build, but they wear out quickly. Each team builds a lot." },
    { id: "blankets", group: "Home and clothing", emoji: "🧵", name: "Make rabbit-skin blankets", kind: "clothing", gain: 15,
      desc: "Blankets made of rabbit skin keep people warm in the winter." },

    { id: "route", group: "Big projects and trade", emoji: "⛰️", name: "Scout a trail across the Sierra", kind: "project",
      desc: "Mono traders carried goods across the Sierra Nevada. A well-scouted trail makes each trading trip bigger. It takes a few seasons of work." },
    { id: "obsidian", group: "Big projects and trade", emoji: "🪨", name: "Make obsidian tools", kind: "goods", gain: 3,
      desc: "Obsidian is a glass-like rock. The Mono made knives and arrowheads from it. Each team makes 3 tools." },
    { id: "trade", group: "Big projects and trade", emoji: "🔄", name: "Trade across the Sierra", kind: "trade", cost: 2, food: 5, foodProject: 8,
      desc: "Trade obsidian tools to the Yokuts and Miwok for acorns, reeds, and shells. Each team uses 2 tools." },

    { id: "care", group: "Care for the land", emoji: "🌱", name: "Care for the land", kind: "care",
      desc: "Take only part of the seeds, nuts, and animals, and leave some behind. Each team helps the weaker of the plants and the game recover." }
  ],

  project: { id: "route", emoji: "⛰️", stat: "Trail across the Sierra", work: 3, boosts: {},
    done: "You have scouted a good trail over the mountains! Each trading trip now brings back more food.",
    finalYes: "You scouted a trail across the Sierra. Trading trips brought back more food.",
    finalNo: "You did not scout a trail this time. Try it next game and see how it changes your trading." },
  goodsFinal: "Obsidian was valuable, and the Mono traded it far across the mountains.",
  whyNotes: [
    { activity: "pine", season: 2, text: "Pine nuts are ready in the fall. They keep well, so they feed your community through the winter." },
    { activity: "rabbits", season: 3, text: "Rabbits are one of the few reliable foods in a cold desert winter." },
    { activity: "house", season: 3, text: "Dome-shaped homes wear out quickly, especially in winter." }
  ],

  events: [
    { id: "campSpring", seasons: [0], always: true, emoji: "🧭", title: "Where will you camp?",
      text: "Your community follows the food. In spring, grass seeds are ready in some places, and rabbits are easiest to trap in others.",
      choices: [
        { label: "Camp near the grass seed meadows", desc: "Good for seeds, not as good for hunting.",
          effects: { mod: { seeds: 1.4, hunt: 0.8 } },
          result: "You moved camp to the seed meadows. Great Basin peoples were nomads who moved often to follow the food." },
        { label: "Camp on the desert floor", desc: "Good for trapping rabbits, not as good for seeds.",
          effects: { mod: { rabbits: 1.3, seeds: 0.8 } },
          result: "You moved camp to the desert floor. Great Basin peoples moved often to follow the food." }
      ] },
    { id: "campSummer", seasons: [1], always: true, emoji: "🧭", title: "Where will you camp?",
      text: "Summer is hot on the desert floor. The slopes are cooler and have deer, but seeds are plentiful in the valleys.",
      choices: [
        { label: "Camp on the cool mountain slopes", desc: "Good for deer, not as good for seeds.",
          effects: { mod: { hunt: 1.3, seeds: 0.9 } },
          result: "You followed the deer up the slopes." },
        { label: "Camp in the seed-rich valleys", desc: "Good for seeds, not as good for hunting.",
          effects: { mod: { seeds: 1.3, hunt: 0.8 } },
          result: "You followed the seeds to the valleys." }
      ] },
    { id: "campFall", seasons: [2], always: true, emoji: "🧭", title: "Where will you camp?",
      text: "Fall is pine nut time, and winter is coming.",
      choices: [
        { label: "Camp on the pine slopes", desc: "Great for pine nuts, not as good for rabbits.",
          effects: { mod: { pine: 1.4, rabbits: 0.8 } },
          result: "You camped among the pines. Pine nuts keep well through winter." },
        { label: "Stay on the desert floor", desc: "Good for rabbits, but far from the pine nuts.",
          effects: { mod: { rabbits: 1.3, pine: 0.6 } },
          result: "You stayed near the rabbits. Fewer pine nuts will be stored for winter." }
      ] },

    { id: "failedPine", seasons: [2], emoji: "🌲", title: "Few pine nuts this year",
      text: "The pine trees have fewer nuts than usual. Some years are like that.",
      choices: [
        { label: "Trade obsidian tools for food", desc: "Give 4 obsidian tools and get 10 food.", needs: { goods: 4 },
          effects: { mod: { pine: 0.4 }, goods: -4, food: 10 },
          result: "Your obsidian tools bought food from trading partners." },
        { label: "Turn to rabbits and deer", desc: "Hunt and trap more.",
          effects: { mod: { pine: 0.4, rabbits: 1.2, hunt: 1.2 } },
          result: "You shifted to other foods. A community that uses many foods handles a poor pine nut year." }
      ] },

    { id: "drought", seasons: [0, 1], emoji: "🏜️", title: "A long dry spell",
      text: "Less rain than usual fell. Seeds and plants grow slowly.",
      choices: [
        { label: "Move to camps near water", desc: "Lose 1 team's time to move camp, but keep gathering seeds.",
          effects: { mod: { seeds: 0.9 }, teamsLost: 1 },
          result: "Moving camp took time, but you found better seed grasses near water." },
        { label: "Stay and gather less", desc: "Fewer seeds and less game this season.",
          effects: { mod: { seeds: 0.6, rabbits: 0.8 } },
          result: "You made do with less. A dry year is hard in the desert." }
      ] },

    { id: "coldSnap", seasons: [3], emoji: "🥶", title: "A bitter cold snap",
      text: "The cold is fierce. Blankets and homes wear out fast.",
      choices: [
        { label: "Make more blankets now", desc: "Lose 1 team's time, but stay warm.",
          effects: { clothing: 5, teamsLost: 1 },
          result: "New rabbit-skin blankets kept everyone warm." },
        { label: "Make do with what you have", desc: "Keep all teams busy, but clothing wears out.",
          effects: { clothing: -15 },
          result: "Blankets wore thin in the cold. You will need to make more soon." }
      ] },

    { id: "neighborsNeed", seasons: [0, 1, 2, 3], emoji: "🤲", title: "Neighbors need help",
      text: "A nearby community had a hard season and is short on food. They ask if you can share.",
      needs: { food: 10 },
      choices: [
        { label: "Share 6 food", desc: "Give food from your stores.",
          effects: { food: -6, shared: 1 },
          result: "Sharing earns respect. Someday your community may need help too." },
        { label: "Keep your food", desc: "Hold on to your whole supply.",
          effects: {},
          result: "You kept your food for your own community this season." }
      ] }
  ],

  today: {
    text: "The Washoe, Mono, and Paiute peoples are living communities today. The Washoe live around Lake Tahoe and the Carson Valley. The Bishop Paiute Tribe is in the Owens Valley, east of the Sierra Nevada. To learn about them from the people themselves, visit their official websites:",
    links: [
      { name: "Washoe Tribe of Nevada and California", url: "https://washoetribe.us" },
      { name: "Bishop Paiute Tribe", url: "https://bishoppaiute.net" }
    ]
  },
  reflection: [
    "Why did Great Basin communities move so often? How did camping in different places help?",
    "How did obsidian help the Mono?",
    "How did a nomad way of life fit the Great Basin's land and weather?"
  ]
};
