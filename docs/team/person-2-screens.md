# Person 2: Screens

You build everything the player sees and taps, and you connect the story to the existing game at the very end.

- **Branch:** `story/screens`
- **You own:** everything in `src/story/ui/` (new folder), including `src/story/ui/story.css`
- **At the very end only (after Persons 1 and 3 have merged):** `src/App.tsx`, `src/screens/Title.tsx`, `src/engine/types.ts`, `src/engine/flow.ts`
- **You read but don't edit:** `src/story/types.ts`, `src/story/logic.ts`, `src/story/content/*`, `src/story/art/*`
- **Merge:** last. See [README.md](README.md).

## What to build (in `src/story/ui/`)

| File | What it shows |
|---|---|
| `StoryGame.tsx` | The container. Holds `useReducer(storyReducer, undefined, initialStory)` and picks the screen for the current `step`. Props: `{ bangla: boolean; readAloud: boolean; reduceMotion: boolean; playerName: string; onExit: () => void }`. |
| `Prologue.tsx` | The spaceship and the prologue lines, one at a time, with **Next**. |
| `CrisisScreen.tsx` | The crisis background (`art`), title and sol, then the scene lines, the question with **two big buttons (A and B)** showing `label` and `detail`, then the `reaction` line, then the NASA fact card with its source link. |
| `EndingScreen.tsx` | **Home** or **Stranded**, the reason line, the blamed decisions, the path, **Try again** (dispatches `STORY_RESTART`) and **Back to title** (`onExit`). |
| `PathTree.tsx` | The player's 8 choices as a path (like the sketch: crisis by crisis, A/B), the blamed decisions highlighted. Shown only on the ending. |
| `text.ts` | Picks English or Bangla: a small helper `t(english: string, bangla: boolean)` that looks the line up in Person 3's Bangla map and falls back to English. |
| `mockLogic.ts` | **Temporary.** A copy of the functions from `types.ts` so you can work before Person 1 merges. Delete before your final merge. |
| `story.css` | All styles for these screens. Use the existing colour variables from `src/styles.css` (`--accent`, `--good`, `--bad`, `--ink`); don't edit `styles.css` itself. Prefix every class with `story-`. |

### Rules for the screens

- **No hint of good or bad** before the ending: both option buttons look the same, no colours, scores or icons that judge.
- Reuse existing parts by importing them: `Pip` and `Dialogue` from `src/ui/`, `Icon` from `src/ui/Icon.tsx`, `speak` from `src/services/speech.ts` for read-aloud, `NasaData` for the data button on the ending.
- Landscape first: check 1280×760, 1024×768 and 812×375 (phone sideways). Buttons must always be on screen.
- Respect `reduceMotion` (no screen shake or moving backgrounds when it's on).
- Get the art with `import { SCENES } from "../art"` and render `SCENES[crisis.art]` (Person 3 provides it; until then draw a plain coloured box).

## Final wiring (after Persons 1 and 3 merged)

1. `git checkout story/screens && git pull origin main` (merge main into your branch).
2. Delete `mockLogic.ts`; import from `../logic` instead.
3. `src/engine/types.ts`: add `"story"` to the `Stage` union and `{ type: "START_STORY" }` and `{ type: "EXIT_STORY" }` to `Action`.
4. `src/engine/flow.ts`: `START_STORY` from the title goes to stage `"story"`; `EXIT_STORY` goes back to `"title"`.
5. `src/App.tsx`: `case "story":` renders `<StoryGame bangla={state.settings.bangla} readAloud={...} reduceMotion={...} playerName={state.player.name} onExit={() => dispatch({ type: "EXIT_STORY" })} />`.
6. `src/screens/Title.tsx`: the main **Start mission** button dispatches `START_STORY`. Keep the other title rows (language, read to me, NASA data).
7. Play the whole game in English and Bangla at the three sizes, then open the pull request.

## Checklist before your pull request

- [ ] `mockLogic.ts` deleted; no file outside your list changed except the 4 wiring files
- [ ] The ending shown always matches `finalOutcome()` (try `AAAAAAAA`, `BBBBBBBB`, `AABAAAAA`)
- [ ] Works at the three sizes, offline, no console errors
- [ ] `npm run typecheck`, `npm test`, `npm run build` all pass
