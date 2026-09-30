/* NORTHEAST AREA. Facts come from the TCI lesson "California's Native Peoples." */
window.GAME_AREAS.northeast = {
  id: "northeast", name: "Northeast", color: "#8fb08f", hero: "plateau",
  cardLine: "A high, dry plateau with marshes and lakes",
  title: "Seasons of the Northeast",
  subtitle: "A high, dry plateau",
  meters: { h1: { emoji: "🦆", label: "Marshes and lakes" }, h2: { emoji: "🌲", label: "Plants and game animals" } },
  labels: { shelter: "Home", clothing: "Clothing" },
  decay: { shelter: [8, 4, 8, 18], clothing: [6, 3, 8, 16] },
  goods: { emoji: "🧺", name: "woven baskets" },

  intro: {
    where: "A dry plateau covers most of the Northeast area, where the land is high and flat. Pine trees and sagebrush are common. There are few large rivers, but in places the rivers widen to form marshes and shallow lakes. Summers are hotter and winters are colder on the plateau than near the coast.",
    peoples: [
      { name: "Modoc", say: "MOH-dahk" },
      { name: "Atsugewi", say: "aht-soo-GAY-wee" },
      { name: "Northern Paiute", say: "" }
    ],
    peoplesLine: "Many peoples have lived on this plateau for a very long time, including the Modoc, Atsugewi, and Northern Paiute. They are still here today.",
    job: "You will guide the work teams of a Northeast community through the seasons. Marshes, lakes, forests, and meadows give you food, but only if you harvest thoughtfully. Keep your community well. Leave enough plants, fish, and animals so they are there next season."
  },

  start: { food: 14, shelter: 70, clothing: 70, goods: 2, h1: 8, h2: 8, wellbeing: 70 },
  teams: 6, foodNeed: 14, foodCap: 40,

  seasons: [
    { name: "Spring", emoji: "🌱", blurb: "The plateau wakes up. Marshes and shallow lakes attract ducks and fish." },
    { name: "Summer", emoji: "☀️", blurb: "Summers are hotter here than near the coast. Berries and seeds ripen in the meadows and on the slopes." },
    { name: "Fall", emoji: "🍂", blurb: "Pinyon pine nuts and acorns are ready. This is a good time to gather and store food for winter." },
    { name: "Winter", emoji: "❄️", blurb: "Winters are much colder on the plateau. Game is harder to find, so stored food and warm clothing matter most." }
  ],

  activities: [
    { id: "nets", group: "Food", emoji: "🦆", name: "Trap ducks and rabbits", kind: "food", source: "h1", yields: [3, 3, 3, 2], limit: 3,
      desc: "Use large nets to trap ducks and rabbits. The marshes and lakes attract ducks.",
      tooMany: "Trapping too much left fewer ducks and rabbits for next season." },
    { id: "fish", group: "Food", emoji: "🐟", name: "Fish in the lakes and marshes", kind: "food", source: "h1", yields: [3, 3, 3, 1], limit: 3,
      desc: "The shallow lakes and marshes are full of fish.",
      tooMany: "Too much fishing left fewer fish in the lakes." },
    { id: "hunt", group: "Food", emoji: "🦌", name: "Hunt deer and elk", kind: "food", source: "h2", yields: [2, 2, 4, 3], limit: 2,
      desc: "Hunters used bows and arrows to hunt deer and elk.",
      tooMany: "Too much hunting left fewer deer and elk on the plateau." },
    { id: "gather", group: "Food", emoji: "🌰", name: "Gather seeds, nuts, and berries", kind: "food", source: "h2", yields: [3, 4, 5, 1], limit: 3,
      desc: "Collect berries, nuts, and seeds, like pinyon pine nuts and acorns. Take only part of what you find.",
      tooMany: "Gathering too much left fewer plants to grow back." },

    { id: "house", group: "Home and clothing", emoji: "🏠", name: "Build and repair homes", kind: "shelter", gain: 15,
      desc: "Keep your home strong against hot summers and cold winters on the high plateau." },
    { id: "clothes", group: "Home and clothing", emoji: "🧵", name: "Make warm clothing", kind: "clothing", gain: 15,
      desc: "Winters are colder on the plateau than near the coast, so warm clothing matters." },

    { id: "pits", group: "Big projects and trade", emoji: "⛏️", name: "Dig pit traps", kind: "project",
      desc: "Atsugewi hunters dug pits along the rivers and hid each one under a layer of branches. A deer or bear that stepped onto the branches was trapped. It takes a few seasons to dig a good set." },
    { id: "baskets", group: "Big projects and trade", emoji: "🧺", name: "Weave baskets", kind: "goods", gain: 3,
      desc: "The Modoc were expert weavers. They made tightly woven baskets from reeds and grasses, tight enough to cook soups and stews. Each team weaves 3 baskets." },
    { id: "trade", group: "Big projects and trade", emoji: "🔄", name: "Trade baskets for food", kind: "trade", cost: 2, food: 5,
      desc: "Baskets are useful and beautiful, and neighbors are glad to trade for them. Each team uses 2 baskets." },

    { id: "care", group: "Care for the land", emoji: "🌱", name: "Care for the marshes and land", kind: "care",
      desc: "Harvest thoughtfully and leave some behind. Each team helps the weaker of the marshes and the plants-and-game recover." }
  ],

  project: { id: "pits", emoji: "⛏️", stat: "Pit traps", work: 3, boosts: { hunt: 1.4 },
    done: "Your pit traps are ready! Hunting is easier from now on.",
    finalYes: "You dug pit traps along the rivers, like Atsugewi hunters did. Hunting got easier.",
    finalNo: "You did not dig pit traps this time. Try it next game and see how it changes your hunting." },
  goodsFinal: "Modoc baskets were so well made that people collect them as art today.",
  whyNotes: [
    { activity: "gather", season: 2, text: "Fall is when pinyon pine nuts and acorns are ready. That is why gathering paid off so well." },
    { activity: "hunt", season: 3, text: "Deer and elk are harder to find in a cold winter, but hunting still brings some food." },
    { activity: "nets", season: 0, text: "Marshes and lakes attract ducks, so netting works well in spring." }
  ],

  events: [
    { id: "deepSnow", seasons: [3], emoji: "🌨️", title: "Deep snow",
      text: "Heavy snow covers the plateau. Hunting is hard and the cold is sharp.",
      choices: [
        { label: "Hunt anyway in the deep snow", desc: "Keep some hunting, but clothing wears out.",
          effects: { mod: { hunt: 0.8 }, clothing: -10 },
          result: "Your hunters found some game, but the cold and snow wore out clothing." },
        { label: "Stay near camp and use stored food", desc: "Little hunting, but everyone stays warm.",
          effects: { mod: { hunt: 0.4 } },
          result: "Staying close kept everyone safe and warm. Stored food matters most in winter." }
      ] },

    { id: "dryMarsh", seasons: [1], emoji: "🏜️", title: "The marsh is shrinking",
      text: "A hot, dry summer is shrinking the marshes. There are fewer places for ducks and fish.",
      choices: [
        { label: "Harvest less and let the marsh recover", desc: "Fewer ducks and fish now, but a healthier marsh.",
          effects: { mod: { nets: 0.6, fish: 0.6 }, h1: 1 },
          result: "You harvested thoughtfully. The marsh will have more life next season." },
        { label: "Fish the deeper lake", desc: "Lose 1 team's time to travel, but keep catching fish.",
          effects: { mod: { fish: 0.9, nets: 0.7 }, teamsLost: 1 },
          result: "Travel to the deeper lake took a team's time, but the fish were still there." }
      ] },

    { id: "richPinyon", seasons: [2], emoji: "🌰", title: "A rich nut harvest",
      text: "The pinyon pines and oaks are heavy with nuts this fall.",
      choices: [
        { label: "Gather all you can", desc: "Nuts and seeds are extra plentiful this season.",
          effects: { mod: { gather: 1.5 } },
          result: "A bountiful fall! Your teams gathered a lot." },
        { label: "Gather some, and share with neighbors", desc: "A good harvest, plus a gift to neighbors.",
          effects: { mod: { gather: 1.25 }, shared: 1 },
          result: "Sharing your good harvest builds trust with your neighbors." }
      ] },

    { id: "ducks", seasons: [0, 2], emoji: "🦆", title: "Ducks arrive in great numbers",
      text: "Huge flocks of ducks land on the marshes and lakes.",
      choices: [
        { label: "Trap as many as you can", desc: "A big catch now.",
          effects: { mod: { nets: 1.5 } },
          result: "Your nets were full! Your teams trapped plenty of ducks." },
        { label: "Trap some, and leave the rest", desc: "A good catch, and the marsh stays healthy.",
          effects: { mod: { nets: 1.2 }, h1: 1 },
          result: "You left plenty of ducks. Thoughtful harvesting keeps the marsh full for next season." }
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
    text: "The Modoc, Atsugewi, and Paiute peoples are living communities today. The Atsugewi are part of the Pit River Tribe in California. The Modoc Nation is headquartered in Oklahoma, because many Modoc people were forced to leave their homeland long ago. To learn about them from the people themselves, visit their official websites:",
    links: [
      { name: "Pit River Tribe (includes the Atsugewi)", url: "https://pitrivertribe.gov" },
      { name: "Modoc Nation", url: "https://modocnation.com" }
    ]
  },
  reflection: [
    "How did the plateau's hot summers and cold winters shape what your community did each season?",
    "Why is it smart to harvest only part of the ducks, fish, and plants you find?",
    "How did weaving baskets help your community?"
  ]
};
