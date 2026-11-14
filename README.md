# Lunar Life: Junior Astronaut Mission Trainer

**Play it:** https://nasa-hack-26.pages.dev (no download, no sign-in; works on laptops, tablets and phones held sideways)

A learning game for children aged 7 to 12, made by **Vantaloc Space** (team **Binary Bandits**) for the **NASA Space Apps Challenge 2026** challenge *"Build a Junior Astronaut Mission Trainer"*. Players land on Mars and run a small base, where every choice has a real cost: power, air, water, food, radiation and the fuel to fly home.

![Lunar Life feature graphic](docs/play-store/feature-graphic-1024x500.png)

## What the player does

1. **Gets ready:** picks a name, a job (engineer, doctor or scientist) and a level (Cadet for ages 7-9, Commander for 10-12).
2. **Lands on Mars:** a dust storm covers the landing site and the player chooses where to land. Each site trades safety against water.
3. **Checks the base:** a systems check explains every reading: battery, oxygen, carbon dioxide, water, food, radiation from the trip.
4. **Runs the base, one sol (Mars day) at a time:**
   - switches machines on and off (heaters, CO₂ scrubber, oxygen maker, water recycler, greenhouse lights, fuel plant, rover charger), because the solar panels never make enough power for everything;
   - gives each of 3 astronauts a job: farm, mine ice, repair, research, exercise, rest, shelter or spacewalk;
   - plants lettuce and potatoes in a glass greenhouse;
   - plans spacewalks and rover trips with a real pre-spacewalk checklist (always take a buddy);
   - deals with surprises: marsquakes, leaks, dust devils, a sick crewmate;
   - shelters from **solar storms based on real storms recorded by NASA**, and survives dust storms.
5. **Reads the evening report:** every change to every reading, with its cause.
6. **Finishes the mission** with up to 3 stars, earns badges and climbs the ranks from Trainee to Commander. Short drills in the **Astronaut Academy** practise the same skills.

For Cadets, systems unlock one at a time over the first 5 sols so young players learn the base step by step.

## Real NASA data

| Data | Where it is used |
|---|---|
| **DONKI** (NASA space weather database): 47 geomagnetic storms from 2023-2025, Kp 6 and up, including the Kp 9 storm of 10 May 2024 | Each mission's solar storm takes its strength from a real storm, and Pip names its date |
| NASA mission facts (InSight, Curiosity, Phoenix, MOXIE, Viking, Apollo, the Space Station) | One real fact on every surprise, unlock card, destination and drill |

Details and the fact-check list: [docs/NASA-DATA.md](docs/NASA-DATA.md).

## Run it on your computer

Needs Node.js 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173.

| Command | What it does |
|---|---|
| `npm run dev` | Development server with live reload |
| `npm test` | All 72 tests, including the balance bots |
| `npm run typecheck` | TypeScript check |
| `npm run build` | Production build into `dist/` |
| `npm run fetch:storms -- 2023-01-01 2025-12-31` | Refresh the NASA storm data (needs `NASA_API_KEY`, see [docs/NASA-DATA.md](docs/NASA-DATA.md)) |

## How it's built

TypeScript, React and Vite. No server and no database: the game is a static website. The rules are plain TypeScript with no React, so they're tested directly, and the art is drawn in code (SVG). Hosting is Cloudflare Pages, which rebuilds the site automatically on every merge to `main`.

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how the code is organised and how a sol is simulated
- [CONTRIBUTING.md](CONTRIBUTING.md): how the team works, and how to add events, destinations, drills or tune the numbers
- [docs/design/03-base-simulation.md](docs/design/03-base-simulation.md): the game rules and every number
- [docs/play-store/README.md](docs/play-store/README.md): the paused Google Play release

## Branches

Everything below is already merged into `main`, which is the live game. The other branches keep each part of the work together so visitors can see how it was built.

| Branch | What it holds |
|---|---|
| `main` | The live game at https://nasa-hack-26.pages.dev. Every merge goes live. |
| `feat/game` | The game itself: opening and landing, the base simulation, surprises, NASA storms, unlocks, spacewalks, suit checks and the rover. |
| `feat/ui-polish` | The look: Labib's UI polish, the realistic base scene, the title and crew screens, and layouts for laptops, tablets and phones. |
| `feat/academy` | The Astronaut Academy: drills, badges and ranks. |
| `feat/play-store` | Android app and Google Play preparation (on hold). |
| `docs/team-docs` | The team documentation. |

New work starts on a short branch from `main` and comes back through a pull request (see [CONTRIBUTING.md](CONTRIBUTING.md)).

## Privacy

No accounts, ads, analytics or tracking. The player's name and progress are saved only in the browser on their own device. Fonts and NASA data are built into the game, so playing makes no outside requests. Read-aloud uses on-device voices only. Full policy: https://nasa-hack-26.pages.dev/privacy

## Team

Vantaloc Space (team Binary Bandits), NASA Space Apps Challenge 2026. See the repository's contributors on GitHub. *(Add team member names and roles here.)*
