# Person 1: Part 1, "The fall"

- **Story:** the prologue on the spaceship, crisis 1 (the broken ship) and the landing. Master text: [04-story-plan.md, Part 1](../design/04-story-plan.md#part-1-the-fall-person-1).
- **Decisions you ask:** 1 (the leak) and 2 (where to land). Call `onChoose` twice, in that order, then `onDone()`.
- **Your folder:** `src/story/part1/` (only here). Optional test: `tests/story-part1.test.ts`.
- **Branch:** `story/part1`, pull request into `plan`.

## Files in your folder

| File | What's there now | Your job |
|---|---|---|
| `content.ts` | All Part 1 lines in English (exact master text) and first-draft Bangla | Review the Bangla (everyday style, master section 9). Keep the English exactly as the master. |
| `art.tsx` | Placeholder pictures `ship`, `orbit`, `descent` | Draw the real scenes (master section 10). |
| `index.tsx` | Uses the shared `Beats` player | Optional: build richer screens (e.g. a cockpit view, a falling capsule), but keep the contract. |
| `part1.css` | Empty | Your styles, class names starting `story-p1-`. |

## Your scenes

| Key | Shows | Ideas |
|---|---|---|
| `ship` | Inside the spaceship: big window with Mars, control panel lights | The crack and a red warning light on the meteoroid line (no shaking if `reduceMotion`) |
| `orbit` | The damaged ship above Mars, a thin stream of gas from the tank | Stars, Mars curve at the bottom |
| `descent` | The capsule falling: orange heat glow, then the parachute | Can change with the three landing lines |

All art: inline SVG, `viewBox="0 0 1600 900"`, realistic and dark, Mars orange as the one accent, **no words inside pictures**, no external images.

## Real data in your part

| Line | Source |
|---|---|
| Launch window every 26 months | [NASA Mars mission timeline](https://mars.nasa.gov/msl/timeline/launch/launch-windows/) |
| Air leak fact | [NASA Space Station blog, 2020](https://blogs.nasa.gov/spacestation/2020/09/29/crew-continues-troubleshooting-as-tests-isolate-small-leak) |
| Ice crater (decision 2B) | [NASA/JPL: buried ice cliffs](https://www.jpl.nasa.gov/news/steep-slopes-on-mars-reveal-structure-of-buried-ice/) |

## Hidden effects of your decisions (for understanding only; already coded in `core/outcome.ts`)

| Decision | A | B |
|---|---|---|
| 1. The leak | Health −2 | Time −2 |
| 2. Where to land | — | Fuel +3, Health −2 |

Decision 2 also changes decision 6 later: on flat ground (2A), the water wall costs fuel.

## Checklist

- [ ] Only files in `src/story/part1/` changed (`git diff --stat plan`)
- [ ] English matches the master word for word; Bangla reviewed
- [ ] `onChoose` called exactly twice, then `onDone()`
- [ ] Three real pictures; reduce motion respected
- [ ] Works at 1280×760, 1024×768, 812×375 in both languages
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass
