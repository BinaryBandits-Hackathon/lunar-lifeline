# 14 Sols: the master story (single source of truth)

> **Status:** final plan, ready to build (15 November 2026).
> **Who reads this:** all three team members and any AI helping them. Everything the game shows, every decision, every number and every source is in this file. If your part and this file disagree, **this file wins**; change it only with the whole team's OK.
> **Team split:** see [docs/team/README.md](../team/README.md). Each person builds one part of the story completely (logic, pictures and text).

---

## 1. The game in one paragraph

You command a crew of three orbiting Mars. A meteoroid wrecks your ship. The only way home is an old, empty return rocket on the surface that can make its own fuel from Mars air and water. The planets line up for the trip home in **14 sols** (Mars days); after that the next chance is **26 months** away. You face **4 crises** and make **2 decisions in each** (8 in total, each A or B). **You never see whether a decision was good or bad until the end.** Each decision quietly changes three hidden numbers (Fuel, Time, Health). At the end the numbers give **one of two outcomes: Success (home) or Fail (stranded)**, and the game shows exactly which of your decisions caused a fail.

## 2. Rules every part must follow

1. **Two outcomes only:** Success or Fail.
2. **No early judgement:** no score, meter, colour, sound or words that hint whether a choice was good or bad. Reactions only describe what happens in the scene.
3. **Every option costs something.** All-A fails, all-B fails (section 7).
4. **Real science:** every crisis shows one real NASA fact with its source (section 8).
5. **Ages 7-12:** short sentences, explain a science word once, no jargon on buttons.
6. **Two languages:** English (default) and everyday Bangla (style in section 9).
7. **Works offline, landscape first:** 1280×760, 1024×768 and 812×375 (phone sideways). No external images or fonts.
8. **Reduce motion:** no shaking or moving backgrounds when the setting is on.

## 3. Characters

| Name | Who | Speaks about |
|---|---|---|
| **The player** | Mission commander (name from the title screen, default "Commander") | Makes every decision |
| **Mei** | Doctor | Health, cold, radiation |
| **Tunde** | Engineer | Fuel, power, repairs |
| **Pip** | The ship's computer, a small robot voice | Narrates, gives NASA facts, explains the ending |

## 4. The full story

Every line below is the exact English text. Lines marked **Pip:**, **Mei:**, **Tunde:** are spoken by that character; the rest is narration.

---

### PART 1: The fall (Person 1)

#### Prologue: aboard the spaceship *(art: `ship`)*
1. Pip: Good morning, {name}! Day 412 of our mission. We are orbiting Mars.
2. Pip: Tomorrow we start the long trip home to Earth.
3. CRACK! A tiny meteoroid, smaller than a pea, smashes into the ship at 10 kilometres a second.
4. Tunde: The main engine is dead! And an oxygen tank is leaking!
5. Pip: There is one way home. Years ago NASA landed an empty return rocket on Mars, ready for a crew like us. It can make its own fuel from Mars air and water.
6. Pip: But Earth and Mars line up for the trip home only once every 26 months. Our window closes in 14 sols. A sol is one day on Mars.

#### Crisis 1: The broken ship (sol 0, in orbit) *(art: `orbit`)*
Scene:
1. The oxygen tank hisses. Mars fills the window below.

**Decision 1: The leak**
- Question (Pip): The oxygen tank is leaking. What do we do?
- **A. Land right away** — *The leak keeps hissing until we touch down.*
  Reaction: We dive toward Mars. The hiss grows louder all the way down.
- **B. Patch the leak first** — *A spacewalk to fix it. It takes time.*
  Reaction: Tunde floats outside with a patch kit. The hiss stops, but the clock keeps ticking.

**Decision 2: Where to land**
- Question (Pip): Where should we land?
- **A. Flat ground by the rocket** — *A safe landing, but the ice is far away.*
  Reaction: A soft landing on smooth red ground. The rocket stands right beside us.
- **B. The ice crater** — *Water for fuel nearby, but a rough landing.*
  Reaction: BUMP! BUMP! We land hard on the rocky crater floor. Ice glitters close by.

Landing (art: `descent`, 3 short lines, no decision):
1. Pip: Heat shield on! The air outside glows hot.
2. Pip: Parachute open!
3. Pip: Rockets firing... touchdown!

NASA fact: **Space Station crews have tracked down and fixed real air leaks in space.**

---

### PART 2: Surviving Mars (Person 2)

#### Crisis 2: The dust storm (sol 4) *(art: `dustStorm`)*
Scene:
1. Sol 4. The sky turns orange-brown. A dust storm is rolling over the whole planet.
2. Tunde: The solar panels are covered. They make almost no power.

**Decision 3: Who gets the power**
- Question (Pip): There is only enough power for one thing. What gets it?
- **A. The heaters** — *The crew stays warm. The fuel plant waits.*
  Reaction: The base stays warm. The fuel plant goes quiet.
- **B. The fuel plant** — *More fuel, but nights drop to −75 °C.*
  Reaction: The fuel plant hums. Mei wraps everyone in blankets as frost grows on the windows.

**Decision 4: The dusty panels**
- Question (Pip): The panels are buried in dust. What now?
- **A. Wipe them in the storm** — *Go out into the dust with a brush.*
  Reaction: Someone steps into the swirling dust with a brush. The wind pushes hard.
- **B. Wait it out** — *Stay safe inside until the dust settles.*
  Reaction: We wait inside and watch the dust race past. Two sols slip away.

NASA fact: **In 2018 a dust storm covered all of Mars. It blocked the sunlight that NASA's Opportunity rover needed for power, and the rover never woke up again.**

#### Crisis 3: The solar storm (sol 8) *(art: `solarStorm`)*
Scene:
1. Sol 8. A message from Earth arrives. It was sent 12 minutes ago, because radio takes that long to reach Mars.
2. Earth: "NASA's space weather team saw a burst of fast particles leave the Sun. It hits Mars today."
3. Pip: Fast particles are radiation. Walls and water slow them down.

**Decision 5: Shelter or finish the job**
- Question (Pip): The fuel line isn't connected yet. What do we do?
- **A. Everyone to the shelter** — *Safe inside. The fuel line waits.*
  Reaction: We squeeze into the shelter and shut the door. Outside, the fuel line lies unfinished.
- **B. Finish the job outside** — *Connect the fuel line first, then shelter.*
  Reaction: Tunde's radiation badge beeps faster and faster as he tightens the last bolt.

**Decision 6: A water wall**
- Question (Pip): Water blocks radiation. Should we build a water wall?
- **A. Stack the water tanks** — *A shield around the shelter. The water gets used up.*
  Reaction: We stack the water tanks around the shelter like bricks.
- **B. Keep the water** — *Save it for making fuel.*
  Reaction: We leave the water tanks by the fuel plant.

NASA fact: **In September 2017 a real solar storm hit Mars, and NASA's Curiosity rover measured the radiation on the ground more than double.** (Pip may name the storm's date from NASA's DONKI database: 10 September 2017.)

---

### PART 3: The way home (Person 3)

#### Crisis 4: Launch day (sol 13) *(art: `launch`)*
Scene:
1. Sol 13. The return rocket stands ready. Its fuel tanks are almost full. Almost.
2. Pip: Tomorrow the planets start to move out of line.

**Decision 7: The rock samples**
- Question (Pip): The rocket is heavy. What about the Mars rocks we collected?
- **A. Leave them behind** — *A lighter rocket needs less fuel.*
  Reaction: We set the rock boxes down on the red ground. Maybe the next crew will take them home.
- **B. Keep them** — *Science is why we came.*
  Reaction: We strap the rock boxes in tight.

**Decision 8: When to launch**
- Question (Pip): Launch now, or wait one more sol for fuel?
- **A. Launch now** — *Go with the fuel we have.*
  Reaction: Countdown: 3... 2... 1...
- **B. Wait one more sol** — *More fuel, but less time.*
  Reaction: One more night on Mars. The fuel plant hums until morning. Then: 3... 2... 1...

NASA fact: **NASA's MOXIE experiment on the Perseverance rover made oxygen from Mars air, the first step toward making rocket fuel on Mars.**

#### Ending: Success *(art: `home`)*
1. The rocket roars up through the pink Mars sky.
2. Pip: We're in orbit! Next stop, Earth.
3. Pip: Here is the path you chose. *(show the 8 choices as a path)*

#### Ending: Fail *(art: `stranded`)*
1. Title: **Stranded**
2. Pip says the reason (one line, below).
3. Pip: These choices led here: *(list only the player's blamed decisions, by their option label)*
4. Buttons: **Try again** (back to the prologue, all choices cleared) and **Back to title**.

| Reason | Pip says |
|---|---|
| time | We ran out of time. The planets moved out of line for the trip home. |
| fuel | The rocket didn't have enough fuel to reach orbit. |
| health | The crew was too hurt or too cold to fly the rocket safely. |

## 5. The hidden calculation

### Starting numbers
| Number | Meaning | Start |
|---|---|---|
| **Fuel** | How full the return rocket is | 4 |
| **Time** | Spare sols before the window closes | 6 |
| **Health** | The crew's health (cold, radiation, injuries) | 8 |

### What each decision changes, and why (the real basis)

| # | Option | Effect | Real basis |
|---|---|---|---|
| 1 | A. Land right away | Health −2 | Losing cabin air means thin, low-oxygen air for the crew (Space Station leak, 2020) |
| 1 | B. Patch first | Time −2 | Spacewalks take hours of preparation and many hours outside |
| 2 | A. Flat ground | 0 | Safe and close to the rocket, but no water nearby |
| 2 | B. Ice crater | Fuel +3, Health −2 | Real buried ice cliffs on Mars (MRO, 2018); water plus Mars air makes fuel (MOXIE); rough ground is a hard landing |
| 3 | A. Heaters | 0 | Warm crew, no fuel made |
| 3 | B. Fuel plant | Fuel +3, Health −2 | Nights near −75 °C (Curiosity weather station) |
| 4 | A. Wipe the panels | Health −1 | Working outside in a storm is risky |
| 4 | B. Wait | Time −2 | Dust storms can last weeks (2018 storm) |
| 5 | A. Shelter | Time −1 | The job waits a sol |
| 5 | B. Finish outside | Health −3 | Radiation outside during a solar storm is far higher (Sept 2017 storm doubled surface radiation) |
| 6 | A. Water wall | Health +1; **Fuel −2 only if decision 2 was A** | Water is a good radiation shield (NASA); near the ice crater it can be refilled, on flat ground it can't |
| 6 | B. Keep water | Health −1 | No extra shield |
| 7 | A. Leave rocks | Fuel +2 | A lighter rocket needs less fuel |
| 7 | B. Keep rocks | 0 | — |
| 8 | A. Launch now | 0 | — |
| 8 | B. Wait a sol | Time −2, Fuel +2 | More fuel made, less margin |

### The ending rule (checked in this order)
1. **Time < 0** → Fail, reason `time`
2. **Fuel < 7** → Fail, reason `fuel`
3. **Health ≤ 1** → Fail, reason `health`
4. Otherwise → **Success**

### Blame (which decisions to show on a fail)
Only list decisions **the player actually chose** from the list for the fail reason:
- **time:** 1B, 4B, 5A, 8B
- **fuel:** 2A, 3A, 6A (only when 2 was A), 7B, 8A
- **health:** 1A, 2B, 3B, 4A, 5B, 6B

The code for all of this is already written and tested in `src/story/core/outcome.ts`. Nobody re-implements it.

## 6. Worked examples

| Path (decisions 1-8) | Fuel | Time | Health | Outcome |
|---|---|---|---|---|
| `AAAAAAAA` (always safe) | 4 | 5 | 6 | **Fail: fuel** |
| `BBBBBBBB` (always bold) | 12 | 0 | 0 | **Fail: health** |
| `AABAAAAA` | 7 | 5 | 4 | **Success** |
| `ABAAAAAA` | 9 | 5 | 4 | **Success** |
| `ABBAAAAA` | 12 | 5 | 2 | **Success** |
| `ABBABAAA` | 12 | 5 | −1 | **Fail: health** |

## 7. Balance (all 256 paths, tested in `tests/story.test.ts`)

| Outcome | Paths | Share |
|---|---|---|
| Success | 111 | 43% |
| Fail: fuel | 61 | 24% |
| Fail: health | 68 | 27% |
| Fail: time | 16 | 6% |

## 8. NASA sources

| Used in | Fact | Source |
|---|---|---|
| Prologue | Mars launch windows come about every 26 months | [NASA Mars mission timeline](https://mars.nasa.gov/msl/timeline/launch/launch-windows/) |
| Crisis 1 | Space Station crews tracked down a real air leak | [NASA, 2020](https://blogs.nasa.gov/spacestation/2020/09/29/crew-continues-troubleshooting-as-tests-isolate-small-leak) |
| Crisis 1, decision 2 | Cliffs of buried water ice on Mars | [NASA/JPL, 2018](https://www.jpl.nasa.gov/news/steep-slopes-on-mars-reveal-structure-of-buried-ice/) |
| Crisis 2 | 2018 dust storm ended Opportunity | [NASA](https://science.nasa.gov/missions/mer/nasas-opportunity-rover-mission-on-mars-comes-to-end/) |
| Crisis 2, decision 3 | Mars nights near −75 °C | [NASA, Curiosity](https://science.nasa.gov/resource/taking-mars-temperature/) |
| Crisis 3 | Radio takes 4 to 24 minutes each way (game uses 12) | [NASA Goddard](https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/) |
| Crisis 3 | Sept 2017 storm doubled radiation on the ground | [NASA/JPL](https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/) |
| Crisis 3 | The storm in NASA's space weather database | [DONKI record, 10 Sept 2017](https://ccmc.gsfc.nasa.gov/DONKI/view/SEP/13101/-1) |
| Crisis 3, decision 6 | Water is a good radiation shield | [NASA: protecting astronauts from radiation on Mars](https://www.nasa.gov/science-research/heliophysics/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/) |
| Crisis 4 | MOXIE made oxygen from Mars air | [NASA, 2023](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/) |

## 9. Bangla style (all parts)

- Everyday spoken Bangla, the way people in Bangladesh talk.
- Technical words in English, written in Bangla letters: স্পেসশিপ, অক্সিজেন, ল্যান্ডিং, হিট শিল্ড, সোলার প্যানেল, ডাস্ট স্টর্ম, রেডিয়েশন, শেল্টার, ফুয়েল, রকেট.
- No bookish words (বিকিরণ, অবতরণ, মহাকাশযান, সৌরঝড়).
- Example: "ওহ নো! মেইন ইঞ্জিন বন্ধ হয়ে গেছে, আর একটা অক্সিজেন ট্যাংক লিক করছে!"
- Numbers in Bangla digits (১৪ সোল).

## 10. Art list

| Key | Part | What it shows |
|---|---|---|
| `ship` | 1 | Inside the spaceship: windows with Mars, control panel |
| `orbit` | 1 | The damaged ship above Mars |
| `descent` | 1 | The capsule falling: heat glow, then parachute |
| `dustStorm` | 2 | The base under an orange-brown sky, dusty panels |
| `solarStorm` | 2 | The base at night with the shelter lit; faint streaks of particles |
| `launch` | 3 | The return rocket on the pad next to the base |
| `home` | 3 | The rocket climbing; Earth as a small blue dot |
| `stranded` | 3 | The rocket on the pad, sun setting (blue Mars sunset) |

All art: inline SVG, `viewBox="0 0 1600 900"`, realistic and dark, Mars orange as the one accent, **no words inside pictures**.
