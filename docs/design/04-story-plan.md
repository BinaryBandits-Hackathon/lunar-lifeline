# Plan: "14 Sols", the story-based decision game

> **Status:** plan, not built yet (written 15 November 2026).
> **Replaces:** the base simulation in [03-base-simulation.md](03-base-simulation.md) as the main game, because time is short and a story with clear decisions is easier to finish, test and explain.
> **Audience:** anyone on the team, or an AI assistant, who needs to build or change this game. Everything needed is in this file.

---

## 1. The idea in one paragraph

The player is an astronaut on a spaceship orbiting Mars. A meteoroid damages the ship, so the crew must land on Mars and fly home in an old return rocket that has no fuel. They have **14 sols** (Mars days) before the planets move out of line for the trip home. Along the way there are **4 crises**. In each crisis the player makes **2 decisions** (A or B), 8 decisions in total. **The player does not see the result of each decision straight away.** Every decision quietly changes three hidden numbers. At the end the numbers decide one of **two outcomes: Success (the crew gets home) or Fail (the crew is stranded)**. A Fail screen explains which decisions caused it, so the player learns and can try again.

## 2. Design rules

1. **Exactly 2 outcomes:** Success or Fail. No "partly" ending.
2. **Delayed consequences:** no score, meter or "good choice!" message during play. The story text after a decision describes what happens *in the scene*, never whether it was right.
3. **Every option has a cost.** No option is free; a player who always picks the "safe" option fails, and so does a player who always picks the "bold" option (checked in section 7).
4. **Decisions connect:** at least one early decision changes what a later one costs (decision 2 changes decision 6).
5. **Real science:** every crisis is based on a real NASA finding (section 9), shown to the player as one short fact.
6. **Words for ages 7-12:** short sentences, explain any science word once, no jargon on buttons.
7. **Keep what already works:** Pip (the ship's computer), the crew names, the Bangla option, the NASA data screen, offline play and privacy rules from the current game.

## 3. Characters

| Name | Role | Used for |
|---|---|---|
| The player (name chosen at start) | Mission commander | Makes every decision |
| Mei | Doctor | Warns about health and cold |
| Tunde | Engineer | Warns about fuel, power and repairs |
| Pip | Ship's computer | Narrates, gives the NASA fact, explains the ending |

## 4. The story

### Prologue: aboard the spaceship
Three astronauts are orbiting Mars, ready to fly home after their mission. A tiny meteoroid smashes into the ship. The main engine stops and an oxygen tank starts to hiss.

Pip finds one way home: an empty return rocket that NASA landed on Mars years ago for a future crew. It has a **fuel plant** that can make rocket fuel from Mars air and water. But the planets line up for the trip home in only **14 sols**. Miss that, and the next chance is two years away.

### Crisis 1: The broken ship (sol 0, in orbit)
*The oxygen tank is leaking. Mars fills the window.*

| Decision | A | B |
|---|---|---|
| **1. The leak** | Land right away. The leak keeps hissing until touchdown. | Spacewalk to patch the leak first. It takes time. |
| **2. Where to land** | Flat ground next to the rocket. A safe landing, but the ice is far away. | An ice crater 8 km away. Water for fuel nearby, but a rough landing. |

NASA fact: *Space Station crews have tracked down and fixed real air leaks.*

### Crisis 2: The dust storm (sol 4)
*The sky turns orange-brown. The solar panels make almost no power.*

| Decision | A | B |
|---|---|---|
| **3. What gets the power** | Keep the heaters on. The crew stays warm, the fuel plant waits. | Keep the fuel plant running. The crew shivers through nights of −75 °C. |
| **4. The dusty panels** | Go out in the storm and wipe the panels. | Wait inside until the dust settles. It takes time. |

NASA fact: *In 2018 a dust storm covered all of Mars and ended the Opportunity rover's mission.*

### Crisis 3: The solar storm (sol 8)
*A message from Earth, sent 12 minutes ago: "A burst of fast particles has left the Sun."*

| Decision | A | B |
|---|---|---|
| **5. Shelter or finish the job** | Everyone into the shelter now. The fuel line waits. | Finish connecting the fuel line outside first. |
| **6. A water shield** | Stack the water tanks around the shelter. Water blocks radiation, but it is used up. | Keep the water for making fuel. |

NASA fact: *In September 2017 a solar storm hit Mars and NASA's Curiosity rover measured the radiation on the ground more than double.*

### Crisis 4: Launch day (sol 13)
*The rocket is almost full. Almost.*

| Decision | A | B |
|---|---|---|
| **7. The rock samples** | Leave the Mars rocks behind so the rocket is lighter. | Keep them. Science is why we came. |
| **8. When to launch** | Launch now. | Wait one more sol to make more fuel. |

NASA fact: *NASA's MOXIE experiment made oxygen from Mars air, the first step to making rocket fuel on Mars.*

### Endings
- **Success: "Home"**. The rocket climbs through the pink sky. Pip: "Next stop, Earth." Show the crew's path through the 8 decisions.
- **Fail: "Stranded"**. Pip explains the main reason (see section 6) and names the decisions that led there, then offers **Try again**.

## 5. The hidden calculation

Three hidden numbers. The player never sees them during the story.

| Number | Meaning | Starts at |
|---|---|---|
| **Fuel** | How full the rocket is | 4 |
| **Time** | Spare sols before the window closes | 6 |
| **Health** | The crew's health (cold, radiation, injuries) | 8 |

### Effects of each decision

| Decision | Option A | Option B |
|---|---|---|
| 1. The leak | Health −2 | Time −2 |
| 2. Landing site | (no change) | Fuel +3, Health −2 |
| 3. Power | (no change) | Fuel +3, Health −2 |
| 4. Dusty panels | Health −1 | Time −2 |
| 5. Solar storm | Time −1 | Health −3 |
| 6. Water shield | Health +1, and Fuel −2 **only if decision 2 was A** (no ice nearby to refill the water) | Health −1 |
| 7. Rock samples | Fuel +2 | (no change) |
| 8. Launch | (no change) | Time −2, Fuel +2 |

### Ending rule (checked in this order)

1. **Time below 0** → Fail ("The planets moved out of line.")
2. **Fuel below 7** → Fail ("Not enough fuel to reach orbit.")
3. **Health 1 or lower** → Fail ("The crew was too hurt to fly the rocket.")
4. Otherwise → **Success**.

### Reference code (TypeScript)

```ts
type Choice = "A" | "B";
type Outcome = { result: "success" | "fail"; reason: "time" | "fuel" | "health" | null; fuel: number; time: number; health: number };

/** decisions[0] is decision 1, decisions[7] is decision 8. */
export function finalOutcome(decisions: Choice[]): Outcome {
  let fuel = 4, time = 6, health = 8;
  const [d1, d2, d3, d4, d5, d6, d7, d8] = decisions;
  if (d1 === "A") health -= 2; else time -= 2;
  if (d2 === "B") { fuel += 3; health -= 2; }
  if (d3 === "B") { fuel += 3; health -= 2; }
  if (d4 === "A") health -= 1; else time -= 2;
  if (d5 === "A") time -= 1; else health -= 3;
  if (d6 === "A") { health += 1; if (d2 === "A") fuel -= 2; } else health -= 1;
  if (d7 === "A") fuel += 2;
  if (d8 === "B") { time -= 2; fuel += 2; }
  const reason = time < 0 ? "time" : fuel < 7 ? "fuel" : health <= 1 ? "health" : null;
  return { result: reason ? "fail" : "success", reason, fuel, time, health };
}
```

## 6. Explaining a Fail

The Fail screen names the reason and the decisions that pushed that number down most. Use these lines (Pip speaking):

| Reason | Pip says | Decisions to point at |
|---|---|---|
| time | "We ran out of time. The planets moved out of line for the trip home." | 1B, 4B, 5A, 8B (the ones that cost Time) |
| fuel | "The rocket didn't have enough fuel to reach orbit." | 2A, 3A, 6A (with 2A), 7B, 8A (the ones that skipped Fuel) |
| health | "The crew was too hurt or too cold to fly the rocket safely." | 1A, 2B, 3B, 4A, 5B, 6B (the ones that cost Health) |

Only list the decisions the player actually chose. Then offer **Try again** (same story, all choices cleared).

## 7. Balance check (all 256 combinations tested)

| Outcome | Combinations | Share |
|---|---|---|
| Success | 111 | 43% |
| Fail: not enough fuel | 61 | 24% |
| Fail: crew too hurt | 68 | 27% |
| Fail: out of time | 16 | 6% |

- Always picking A ("play it safe") → **Fail** (not enough fuel).
- Always picking B ("take every risk") → **Fail** (crew too hurt).
- Example winning paths: `AABAAAAA` (fuel plant over heaters), `AAABABAB`, `AAABBBAB`.

**After changing any number in section 5, run the check again** (write it as a test that loops over all 256 combinations and asserts: Success between 30% and 55%, all-A fails, all-B fails).

## 8. How to build it (for a developer or AI)

> **Team of 3:** the work is split into three independent jobs with no shared files. Start with [docs/team/README.md](../team/README.md), then your own task doc: [Person 1: logic](../team/person-1-logic.md), [Person 2: screens](../team/person-2-screens.md), [Person 3: content and science](../team/person-3-content.md). The shared contract is `src/story/types.ts`; the first English draft of the story is `src/story/content/crises.ts`.

### Screens, in order
1. **Title** (keep the current one): name, language, Start.
2. **Prologue**: 2-3 lines from Pip on the spaceship, meteoroid strike (screen shake, honours Reduce motion).
3. **Crisis screen** × 4: a scene picture, 2-3 short story lines, then **decision 1** (two big buttons A and B with one-line descriptions), a one-line reaction, then **decision 2**, a reaction, and the NASA fact.
4. **Ending screen**: Success or Fail, the reason, the 8 choices shown as a path (like the tree sketch), Try again, and the Real NASA data button.

### Data, not code
Store the story as data so text and Bangla can change without touching logic:

```ts
interface Decision {
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  question: string;           // "The oxygen tank is leaking. What do we do?"
  a: { label: string; reaction: string };   // reaction = what happens in the scene, never "good/bad"
  b: { label: string; reaction: string };
}
interface Crisis {
  id: 1 | 2 | 3 | 4;
  title: string;
  sol: number;
  scene: string[];            // 2-3 story lines
  decisions: [Decision, Decision];
  nasaFact: { text: string; source: string };  // link from docs/NASA-DATA.md
}
```

Put the English text in `src/story/crises.ts` and the Bangla in `src/content/bn.ts` (same everyday style as now: technical words in English, written in Bangla letters).

### State
`{ stage, crisis: 1..4, step: 1..2, choices: Choice[] }`. Keep the reducer pure like `src/engine/flow.ts`. Save progress on the device only.

### What to reuse from the current game
- `src/ui/Pip.tsx`, `src/ui/Dialogue.tsx` (Pip and captions, read-aloud)
- `src/screens/Title.tsx`, the Bangla setting and `src/content/bn.ts`
- `src/ui/NasaData.tsx` and `src/sim/sep.ts` (the real storm in crisis 3 can still come from NASA DONKI: show its date in Pip's warning)
- Cockpit and descent screens for the prologue and the landing in crisis 1
- `src/ui/SimScene.tsx` as the background for crises 2-4

The base simulation (`src/sim/`) and Academy can stay in the code but are no longer the main path.

### Done when
- [ ] All 8 decisions playable in English and Bangla
- [ ] No hint of good or bad before the ending
- [ ] Ending matches `finalOutcome()` for every combination (test over all 256)
- [ ] Fail screen names the reason and the player's own decisions
- [ ] Works at 1280×760, 1024×768 and 812×375, offline, no console errors
- [ ] Each crisis shows one NASA fact with its source in `docs/NASA-DATA.md`

## 9. NASA sources for the story

| Story moment | Real finding | Source |
|---|---|---|
| Ship leak | Space Station crews tracked down a real air leak | [NASA, 2020](https://blogs.nasa.gov/spacestation/2020/09/29/crew-continues-troubleshooting-as-tests-isolate-small-leak) |
| Trip radiation | About 1.8 mSv a day on the way to Mars | [NASA/JPL, Curiosity RAD](https://www.jpl.nasa.gov/news/data-from-nasa-rovers-voyage-to-mars-aids-planning/) |
| Ice crater | Cliffs of buried water ice seen from orbit | [NASA/JPL, 2018](https://www.jpl.nasa.gov/news/steep-slopes-on-mars-reveal-structure-of-buried-ice/) |
| Fuel from Mars air | MOXIE made 122 g of oxygen on Mars | [NASA, 2023](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/) |
| Cold nights | Night air down to about −75 °C | [NASA, Curiosity](https://science.nasa.gov/resource/taking-mars-temperature/) |
| Dust on panels | Rovers lost power to dust; wind sometimes cleaned it | [NASA](https://science.nasa.gov/photojournal/solar-panel-dust-accumulation-and-cleanings/) |
| Solar storm | September 2017 storm doubled radiation on the ground | [NASA/JPL](https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/) |
| Storm data | Real solar particle storms | [NASA DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) |
| 12-minute message | Radio takes 4 to 24 minutes each way | [NASA Goddard](https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/) |
| Radiation limit | NASA career limit 600 mSv | [NASA-STD-3001](https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf) |

Not yet sourced (add a link before showing it in the game): the 2018 global dust storm ending Opportunity, and the two-year wait between launch windows.

## 10. Open questions for the team
1. Game name (not decided).
2. Should the Fail screen let the player change just one decision, or always restart from the prologue?
3. Pictures for each crisis: reuse the current base scene, or draw new scenes?
