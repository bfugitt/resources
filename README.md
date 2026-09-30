# Seasons of the Northwest (prototype)

A turn-based classroom game based on the TCI lesson "California's Native Peoples."
No accounts, no tracking, no server. Progress is saved only in the student's own browser.

## Put it online with GitHub Pages
1. Create a new GitHub repository and upload these files, keeping the folder layout.
2. In the repository, open Settings, then Pages.
3. Under "Build and deployment," choose "Deploy from a branch," pick `main` and `/ (root)`, and save.
4. After a minute, your game is at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

To try it on your own computer first, just double-click `index.html`.

## Change the content (no coding needed)
Open `areas/northwest.js` in any text editor. Wording, numbers, activities, and events are all there.
- `start`, `teams`, `foodNeed`: how hard the game is.
- `activities`: what teams can do. `yields` are food per team for Spring, Summer, Fall, Winter.
- `events`: surprises. Each has choices with trade-offs. Add or remove freely.
- `today.links`: confirm these tribal website addresses are still correct before sharing with students.

## Adding the next culture area
Copy `northwest.js` to a new file (for example `areas/central.js`), change the content, add a `<script>`
line for it in `index.html`, and change `AREA_ID` at the top of `game.js`. (Later we can add an
area-chooser screen.)

## Note on images
The game uses simple drawn shapes and emoji, not the textbook's photographs, which are copyrighted.
