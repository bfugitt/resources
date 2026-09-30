# Seasons of California

A turn-based classroom game for the TCI lesson "California's Native Peoples."
Students choose one of the six culture areas and lead a community through the seasons.
No accounts, no tracking, no server. Progress is saved only in each student's own browser.

## Put it online with GitHub Pages
1. Create a new GitHub repository and upload everything here, keeping the folder layout.
2. In the repository, open Settings, then Pages.
3. Under "Build and deployment," choose "Deploy from a branch," pick `main` and `/ (root)`, and save.
4. After a minute, the game is at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

To try it on your own computer first, double-click `index.html`.

## The six areas
Northwest, Northeast, Central, Great Basin, Southern, Colorado River. Each has its own
land, seasons, foods, events, and a special feature:
- Northwest: build a canoe. Northeast: dig pit traps and weave baskets.
- Central: acorns, plus storehouses. Great Basin: choose where to camp each season.
- Southern: plank canoe and clay pots. Colorado River: plant after the flood, harvest before winter.

## Change the content (no coding needed)
Each area is one file in `areas/`. Open it in any text editor.
- `start`, `teams`, `foodNeed`: how hard the area is.
- `activities`: what teams can do. `yields` are food per team for Spring, Summer, Fall, Winter.
- `events`: surprises, each with choices and trade-offs. Add or remove freely.
- `today.links`: the "Today" links on the last screen.
Shared wording (the "About this game" note, vocabulary) is in `areas/common.js`.

## Links to check before each school year
Websites change. These were checked in September 2026:
yuroktribe.org, karuk.us, tolowa.gov, pitrivertribe.gov, modocnation.com, mewuk.com,
tulerivertribe-nsn.gov, washoetribe.us, bishoppaiute.net, chumash.gov, rincon-nsn.gov,
fortmojaveindiantribe.com, quechantribe.com.

## Notes
- Art is simple drawn landscapes and emoji objects. No people, costumes, or textbook photos.
- Some details are game simplifications (for example, baskets as a trade good in the Northeast,
  and the trail across the Sierra in the Great Basin). Ask a tribal education office to review
  before wider sharing.
