# Person 2: Part 2, "Surviving Mars"

- **Story:** crisis 2 (the dust storm, sol 4) and crisis 3 (the solar storm, sol 8). Master text: [04-story-plan.md, Part 2](../design/04-story-plan.md#part-2-surviving-mars-person-2).
- **Decisions you ask:** 3 (power), 4 (dusty panels), 5 (shelter or finish the job), 6 (water wall). Call `onChoose` four times, in that order, then `onDone()`.
- **Your folder:** `src/story/part2/` (only here). Optional test: `tests/story-part2.test.ts`.
- **Branch:** `story/part2`, pull request into `plan`.

## Files in your folder

| File | What's there now | Your job |
|---|---|---|
| `content.ts` | All Part 2 lines in English (exact master text) and first-draft Bangla | Review the Bangla (everyday style, master section 9). Keep the English exactly as the master. |
| `art.tsx` | Placeholder pictures `dustStorm`, `solarStorm` | Draw the real scenes (master section 10). You may copy shapes from `src/ui/SimScene.tsx` into your folder (don't edit it). |
| `index.tsx` | Uses the shared `Beats` player | Optional: richer screens (e.g. dust blowing, a radiation badge that beeps), keeping the contract. |
| `part2.css` | Empty | Your styles, class names starting `story-p2-`. |

## Your scenes

| Key | Shows | Ideas |
|---|---|---|
| `dustStorm` | The base under an orange-brown sky, panels covered in dust | Swirling dust (static if `reduceMotion`) |
| `solarStorm` | The base at night, the shelter lit up, faint streaks of particles | Water tanks visible beside the shelter |

All art: inline SVG, `viewBox="0 0 1600 900"`, realistic and dark, Mars orange as the one accent, **no words inside pictures**, no external images.

## Real data in your part

| Line | Source |
|---|---|
| 2018 dust storm ended Opportunity | [NASA](https://science.nasa.gov/missions/mer/nasas-opportunity-rover-mission-on-mars-comes-to-end/) |
| Nights near −75 °C | [NASA, Curiosity](https://science.nasa.gov/resource/taking-mars-temperature/) |
| Message sent 12 minutes ago (real range 4-24) | [NASA Goddard](https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/) |
| Sept 2017 storm doubled radiation | [NASA/JPL](https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/) |
| The storm in NASA's DONKI database (10 Sept 2017) | [DONKI record](https://ccmc.gsfc.nasa.gov/DONKI/view/SEP/13101/-1) |
| Water blocks radiation | [NASA](https://www.nasa.gov/science-research/heliophysics/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/) |

## Hidden effects of your decisions (for understanding only; already coded in `core/outcome.ts`)

| Decision | A | B |
|---|---|---|
| 3. Power | — | Fuel +3, Health −2 |
| 4. Dusty panels | Health −1 | Time −2 |
| 5. Solar storm | Time −1 | Health −3 |
| 6. Water wall | Health +1, Fuel −2 only if decision 2 was A | Health −1 |

## Checklist

- [ ] Only files in `src/story/part2/` changed (`git diff --stat plan`)
- [ ] English matches the master word for word; Bangla reviewed
- [ ] `onChoose` called exactly four times, then `onDone()`
- [ ] Two real pictures; reduce motion respected
- [ ] Works at 1280×760, 1024×768, 812×375 in both languages
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass
