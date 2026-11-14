# Person 3: Part 3, "The way home"

- **Story:** crisis 4 (launch day, sol 13) and both endings (Home and Stranded). Master text: [04-story-plan.md, Part 3](../design/04-story-plan.md#part-3-the-way-home-person-3).
- **Decisions you ask:** 7 (the rock samples) and 8 (when to launch). Call `onChoose` twice, in that order, then show the ending.
- **Your folder:** `src/story/part3/` (only here). Optional test: `tests/story-part3.test.ts`.
- **Branch:** `story/part3`, pull request into `plan`.

## Files in your folder

| File | What's there now | Your job |
|---|---|---|
| `content.ts` | Crisis 4 lines and all ending text, English (exact master text) and first-draft Bangla | Review the Bangla (everyday style, master section 9). Keep the English exactly as the master. |
| `art.tsx` | Placeholder pictures `launch`, `home`, `stranded` | Draw the real scenes (master section 10). |
| `index.tsx` | Crisis 4 with the shared `Beats` player, then a simple ending | Make the ending great (below). |
| `part3.css` | Basic ending styles | Your styles, class names starting `story-p3-`. |

## The ending (your main job)

You get `outcome` from the shell (`FinalPartProps`). It is `null` until all 8 choices are made, then it holds `result`, `reason` and `blame`. **Never compute the result yourself**; always use `outcome`.

- **Success (`outcome.result === "success"`):** picture `home`, the two success lines, and the player's path.
- **Fail:** picture `stranded`, title "Stranded", the reason line for `outcome.reason`, "These choices led here:" and the labels of `outcome.blame` (use `DECISION_LABELS` from `core/labels.ts`).
- **The path:** show the 8 choices as a path through the 4 crises, like a tree: crisis 1 → 2 → 3 → 4, each with the chosen option's label. On a fail, highlight the blamed decisions.
- **Buttons:** Try again (`onRestart`) and Back to title (`onExit`).
- Optionally add the existing **Real NASA data** button (`src/ui/NasaData.tsx`).

## Your scenes

| Key | Shows | Ideas |
|---|---|---|
| `launch` | The return rocket on the pad beside the base | Fuel hose, Pip's light |
| `home` | The rocket climbing; Earth as a small blue dot | Flame and smoke (still if `reduceMotion`) |
| `stranded` | The rocket on the pad at sunset; Mars sunsets look blue | Quiet and calm, not scary (players are 7-12) |

All art: inline SVG, `viewBox="0 0 1600 900"`, realistic and dark, Mars orange as the one accent, **no words inside pictures**, no external images.

## Real data in your part

| Line | Source |
|---|---|
| MOXIE made oxygen from Mars air | [NASA, 2023](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/) |
| Blue sunset on Mars (for the `stranded` picture) | [NASA/JPL, Curiosity](https://www.jpl.nasa.gov/news/nasas-curiosity-rover-views-serene-sundown-on-mars/) |

## Hidden effects of your decisions (for understanding only; already coded in `core/outcome.ts`)

| Decision | A | B |
|---|---|---|
| 7. Rock samples | Fuel +2 | — |
| 8. When to launch | — | Time −2, Fuel +2 |

Ending rule: Time < 0 → Fail (time); Fuel < 7 → Fail (fuel); Health ≤ 1 → Fail (health); otherwise Success.

## Checklist

- [ ] Only files in `src/story/part3/` changed (`git diff --stat plan`)
- [ ] English matches the master word for word; Bangla reviewed
- [ ] `onChoose` called exactly twice; the ending uses only `outcome`
- [ ] `AAAAAAAA` shows Stranded (fuel), `BBBBBBBB` Stranded (health), `AABAAAAA` Home
- [ ] Three real pictures; reduce motion respected
- [ ] Works at 1280×760, 1024×768, 812×375 in both languages
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass
