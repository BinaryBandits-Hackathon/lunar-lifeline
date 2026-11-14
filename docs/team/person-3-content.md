# Person 3: Content and science

You own the words, the Bangla, the pictures and the NASA facts.

- **Branch:** `story/content`
- **You own:** everything in `src/story/content/` and `src/story/art/` (new folder), and `docs/NASA-DATA.md`
- **You read but don't edit:** `src/story/types.ts`
- **Merge:** second. See [README.md](README.md).

## What to build

### 1. Polish the English story: `src/story/content/crises.ts`
A first draft is already there. Improve it, keeping the shape from `types.ts`:

- Short sentences a 7-year-old can read. Explain a science word the first time (sol, radiation).
- **Reactions describe the scene only.** Never say or hint that a choice was good or bad ("Great choice!", "Uh oh, that was risky" are not allowed).
- Keep each option's meaning the same as the plan's table in [04-story-plan.md](../design/04-story-plan.md#5-the-hidden-calculation): Person 1's calculation depends on what A and B mean. If you want to change what an option *does*, ask Person 1.
- Keep the prologue to 3 lines and each scene to 2-3 lines.

### 2. Bangla: `src/story/content/bn.ts`
Export `BN_STORY: Record<string, string>`, keyed by the **exact English text** (every scene line, question, label, detail, reaction, NASA fact, prologue and ending line). Person 2's `t()` helper looks lines up here.

Style (same as the current game's Bangla in `src/content/bn.ts`):
- Everyday spoken Bangla, the way people in Bangladesh talk.
- Technical words in English, written in Bangla letters: হিট শিল্ড, রেডিয়েশন, সোলার প্যানেল, ফুয়েল, শেল্টার, রকেট.
- No bookish words (বিকিরণ, অবতরণ, মহাকাশযান).

Add a small test-friendly helper: `export const BN_MISSING = (lines: string[]) => lines.filter((l) => !BN_STORY[l]);` so Person 1 or 2 can check nothing is missing.

### 3. Scene pictures: `src/story/art/`
Export from `src/story/art/index.tsx`:

```ts
export const SCENES: Record<"orbit" | "dustStorm" | "solarStorm" | "launch" | "ship", () => JSX.Element>;
```

- Inline SVG components, 16:9 (`viewBox="0 0 1600 900"`), no external images (the game works offline).
- Same look as the current game: realistic, dark, Mars orange as the one accent. You may reuse shapes from `src/ui/SimScene.tsx` by copying them into your folder (don't edit `SimScene.tsx`).
- `ship` is the inside of the spaceship for the prologue.
- No text inside the pictures (text is translated; pictures aren't).

### 4. NASA facts: `docs/NASA-DATA.md`
- Add a section "Facts in 14 Sols" listing each crisis's `nasaFact` with its source link.
- **Two facts still need a source:** the 2018 dust storm that ended Opportunity, and the two-year wait between launch windows. Find NASA pages, fill the `source` field in `crises.ts`, and add the links here.
- Every `nasaFact.source` in `crises.ts` must be a working NASA link (not empty).

## Checklist before your pull request

- [ ] Only files in `src/story/content/`, `src/story/art/` and `docs/NASA-DATA.md` changed
- [ ] Every English line has a Bangla line (`BN_MISSING` returns nothing)
- [ ] Every `nasaFact.source` is filled and opens a NASA page
- [ ] No reaction judges the choice
- [ ] `npm run typecheck`, `npm test`, `npm run build` all pass
- [ ] Posted in the chat: "content merged; scene names are orbit, dustStorm, solarStorm, launch, ship"
