# Working on Lunar Life

## The everyday loop

1. Get the latest code: `git checkout main && git pull`
2. Make a branch: `git checkout -b feat/short-name` (or `fix/...`, `docs/...`)
3. Run the game while you work: `npm run dev`
4. Before you push, all three must pass:
   ```bash
   npm run typecheck
   ```
   ```bash
   npm test
   ```
   ```bash
   npm run build
   ```
5. Push and open a pull request into `main`. Write what changed and how you checked it.
6. Merge only when the PR's check passes. **Merging to `main` puts it live** at https://nasa-hack-26.pages.dev within a minute, so test the PR's preview link (`https://<branch-name>.nasa-hack-26.pages.dev`) first.

Keep branches short-lived and pull `main` often. The base scene (`src/ui/SimScene.tsx`) and `src/styles.css` are the files most likely to conflict, so tell the team when you're working on them.

## Rules for the game itself

- **Every choice must cost something.** If one option is always best, it isn't a decision. Run `npm test` after changing numbers: the balance bots fail if a lazy or greedy strategy starts winning.
- **Teach one true thing.** Every surprise, destination, unlock and drill carries a real-world fact. Add new facts to the list in [docs/NASA-DATA.md](docs/NASA-DATA.md) and check them against a NASA source.
- **Words for a 7-year-old.** Short sentences. Explain any science word the first time. No jargon in buttons.
- **No emoji.** Use the drawn icons in `src/ui/Icon.tsx`.
- **The look:** black and white instrument panels, Mars orange (`--accent`) as the one accent colour, green and red only for good and bad. Colours are CSS variables at the top of `src/styles.css`.
- **Landscape first.** Check new screens at 1280×760 (laptop), 1024×768 (tablet) and 812×375 (phone sideways). Pip's panel and its button must stay on screen.
- **Privacy:** no analytics, no ads, no outside requests. Don't add anything that sends data off the device.

## Recipes

### Change a number
Every simulation number is in `src/sim/rules.ts` (power, machine use, crew needs, crops, goals, radiation, risks). Change it, then run `npm test` and read any balance failures before forcing them green.

### Add a surprise event
Add an entry to `EVENTS` in `src/sim/events.ts`: a title, a short situation, two options that each cost something (`apply` changes the simulation), an optional `when` condition, and a `real` fact. The engine picks it up automatically.

### Add a spacewalk destination
Add an entry to `EVA_SITES` in `src/sim/eva.ts`: distance, rover battery needed (0 = on foot), science, suit oxygen per astronaut, radiation, optional bonus, and a fact.

### Add an Academy drill
Add a drill to `DRILLS` in `src/content/academy.ts`: 3 questions, each with one correct answer and a `why` line for every option. Answers are shuffled on screen, so the order in the file doesn't matter.

### Change what unlocks when
Edit `UNLOCK_SOL` in `src/sim/unlocks.ts`. Cadet must have everything open before its last sol (a test checks this).

### Refresh the NASA storms
Get a free key at https://api.nasa.gov, then:
```bash
NASA_API_KEY=your_key npm run fetch:storms -- 2023-01-01 2025-12-31
```
Never commit the key.

### Redraw the app icon or store graphic
Edit `scripts/make-icons.mjs`, then `node scripts/make-icons.mjs`.

## Where to ask

Open a GitHub issue or ask in the team chat, and link the file and line you mean.
