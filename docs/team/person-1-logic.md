# Person 1: Logic

You build the brain of the game: the hidden calculation and the step-by-step flow. No screens, no text.

- **Branch:** `story/logic`
- **You own:** `src/story/logic.ts` (new), `tests/story.test.ts` (new)
- **You read but don't edit:** `src/story/types.ts` (the contract), `src/story/content/crises.ts` (only to know how many crises/decisions exist)
- **Merge:** first. See [README.md](README.md).

## What to build

### 1. `finalOutcome(choices: Choice[]): Outcome`
The hidden calculation, exactly as in [04-story-plan.md, section 5](../design/04-story-plan.md#5-the-hidden-calculation):

- Start: Fuel 4, Time 6, Health 8.
- Apply each decision's effect (table in the plan). Decision 6A costs Fuel −2 **only if decision 2 was A**.
- Ending rule, in this order: Time < 0 → fail "time"; Fuel < 7 → fail "fuel"; Health ≤ 1 → fail "health"; else success.
- Fill `blame`: for a fail, list the decisions **the player chose** that lowered the failing number:
  - time: 1B, 4B, 5A, 8B
  - fuel (decisions that skipped or cost fuel): 2A, 3A, 6A (only with 2A), 7B, 8A
  - health: 1A, 2B, 3B, 4A, 5B, 6B
- Success → `reason: null`, `blame: []`.

### 2. `initialStory(): StoryState`
Returns `{ step: { kind: "prologue" }, choices: [] }`.

### 3. `storyReducer(state, action): StoryState`
A pure function (no React, no random, no dates), like `src/engine/flow.ts`. The flow:

```
prologue
  → scene(crisis 1) → decide(1) → reaction(1) → decide(2) → reaction(2) → fact(crisis 1)
  → scene(crisis 2) → decide(3) → reaction(3) → decide(4) → reaction(4) → fact(crisis 2)
  → scene(crisis 3) → ... → fact(crisis 3)
  → scene(crisis 4) → ... → fact(crisis 4)
  → ending(finalOutcome(choices))
```

- `STORY_NEXT` moves forward on every step **except** `decide` (there it does nothing).
- `STORY_CHOOSE` only works on a `decide` step: it appends the choice and moves to `reaction`.
- `STORY_RESTART` returns `initialStory()` from any step.
- Any other action, or an action on the wrong step, returns the **same state object** (so React skips a re-render).

Decision numbers per crisis: crisis 1 → 1, 2; crisis 2 → 3, 4; crisis 3 → 5, 6; crisis 4 → 7, 8.

## Tests (`tests/story.test.ts`)

Use Vitest like the other tests. At least:

1. **All 256 combinations:** loop over every A/B pattern, run `finalOutcome`, and check:
   - success share is between 30% and 55% (the plan says 43%: 111 of 256)
   - `AAAAAAAA` fails with reason "fuel"
   - `BBBBBBBB` fails with reason "health"
   - `AABAAAAA` succeeds
2. **Blame:** every decision in `blame` was actually chosen by the player and appears in that reason's list.
3. **Reducer walk:** play through with `STORY_NEXT` / `STORY_CHOOSE` and reach `ending` after exactly 8 choices; `STORY_NEXT` on a `decide` step returns the same object; `STORY_RESTART` returns to the prologue.
4. **Ending matches:** the outcome stored in the `ending` step equals `finalOutcome(choices)`.

## Checklist before your pull request

- [ ] Only `src/story/logic.ts` and `tests/story.test.ts` changed (`git diff --stat main` shows nothing else)
- [ ] `npm run typecheck`, `npm test`, `npm run build` all pass
- [ ] Posted in the chat: "logic.ts merged, Person 2 can drop the mock"

## If the numbers need changing

Change them in `logic.ts`, rerun the 256-combination test, and update section 5 and 7 of `docs/design/04-story-plan.md` **in the same pull request** (tell Person 3, since that doc is shared reading).
