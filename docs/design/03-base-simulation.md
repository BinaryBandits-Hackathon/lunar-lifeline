# Base simulation: rules and numbers

This is the current base game. It replaced the card game in [02-base-game.md](02-base-game.md). All numbers live in `src/sim/rules.ts`; this page explains them. Battery is in percent points, water in litres, food in meals, radiation in mSv. The screen shows whole numbers (CO₂ keeps one decimal); in the sol report, green + means gained and red − means used.

## Missions

| | Cadet (7-9) | Commander (10-12) |
|---|---|---|
| Length | 7 sols | 10 sols |
| Fuel goal | 25% | 35% |
| Science goal | 12 | 18 |
| Storm | Sol 4 | Sol 4-7 |
| Systems | Unlock one by one (below) | All open from sol 1 |

**Stars:** surviving gives 1, reaching the fuel goal adds 1, reaching the science goal adds 1.

**Ending early:**
- **Emergency:** oxygen, water or food reaches 0, CO₂ reaches 3%, or a crew member's health reaches 0.
- **Grounded:** any astronaut reaches 600 mSv of radiation.

## Starting state (from the landing)

| Reading | Normal | Changes |
|---|---|---|
| Battery | 78% | 64% if the crew waited in orbit |
| Oxygen tanks | 85% | 70% if the crew waited in orbit |
| Water | 180 L | 120 L if the base is far from ice |
| Food | 24 meals | |
| Fuel | 8% | |
| Radiation | 380 mSv per astronaut | 410 mSv if the crew waited in orbit |
| Solar panels | Full | Half power if 2 cracked in the ice valley landing |
| Crew | Energy 60, health 92 | |

## Power

**Solar panels make** 12 (morning), 30 (day), 8 (evening) and 0 (night): 50 per sol. That drops to half with cracked panels, 70% with dusty panels, and 20% in a dust storm.

| Machine | Morning | Day | Evening | Night | Per sol | Does |
|---|---|---|---|---|---|---|
| Heaters (always on) | 4 | 0 | 4 | 14 | 22 | Warmth; without them the crew sleep badly |
| CO₂ scrubber | 2 | 2 | 2 | 2 | 8 | Removes 0.2% CO₂ per part of the sol |
| Oxygen maker | 3 | 3 | 3 | 0 | 9 | +2% oxygen, −1 L water per part |
| Water recycler | 2 | 2 | 2 | 0 | 6 | Recovers 70% of the crew's water |
| Greenhouse lights | 3 | 3 | 0 | 0 | 6 | Crops grow only if lit morning and day |
| Fuel plant | 0 | 10 | 4 | 0 | 14 | +5% fuel per sol |
| Rover charger | 0 | 4 | 4 | 0 | 8 | +12% rover battery per part |

**Jobs that use power:** mining 8, research 6 (during the day).

**When power runs short,** machines switch off in this order: rover charger, fuel plant, greenhouse lights, recycler, oxygen maker, scrubber, heaters. Everything on uses more than the panels make, which is the main trade-off.

## Crew

3 astronauts use 6% oxygen, 9 L water and 3 meals a sol, and breathe out 0.6% CO₂. Above 1% CO₂ everyone tires faster; above 2% their health drops.

| Job | Energy | Effect |
|---|---|---|
| Farm | 20 | Plants empty beds, harvests ripe crops |
| Mine ice | 35 | +25 L water near ice (+10 far), +5 for the engineer |
| Repair | 30 | Fixes the first problem: cracked panels, broken machine, rover, leak, then dust |
| Research | 25 | +1 science (+2 for the scientist) |
| Exercise | 15 | +4 health (+6 for the doctor) |
| Rest | gains 35 | |
| Shelter | 0 | No radiation in a solar storm, no work |
| Suit check | 15 | Readies one spacesuit (3 on the base) |
| Spacewalk | 30 | See below |

Sleep gives +30 energy (+10 if the heaters lost power, and −5 health). Skipping exercise costs 2 health. Below 20 energy, an astronaut is too tired to work.

## Greenhouse

3 beds. Lettuce takes 3 sols and gives 4 meals; potatoes take 5 sols and give 10 meals. Each growing bed uses 1 L of water a sol. A farmer must plant and harvest.

## Storms

- **Solar storm** (60% of missions), strength 3-6 from a real NASA storm. Radiation per point of strength: 25 mSv outside, 12 mSv inside, 0 in the shelter. A spacewalk during one gets 3 times the dose.
- **Dust storm** (40%): solar power falls to 20% for 2 sols, spacewalks are cancelled, and the panels are dusty afterwards until repaired.
- **Warning:** the top bar and Pip warn the sol before.

## Surprises

On about half of the sols without a storm, a surprise arrives at the start of the sol. Each has two options that both cost something:
- leaking pipe
- marsquake that breaks the scrubber
- dust devil
- Earth experiment
- sick crewmate
- heater fault

Each surprise happens at most once per mission.

## Spacewalks and the rover

| Destination | Distance | Rover battery | Science | Suit oxygen each | Radiation each |
|---|---|---|---|---|---|
| Crater rim | 1 km | on foot | 3 | 3% | 8 |
| Ice cliff (near ice only) | 2 km | on foot | 3 (+20 L water) | 4% | 10 |
| Layered cliffs | 5 km | 30% | 5 | 3% | 14 |
| Meteorite field | 7 km | 40% | 6 | 4% | 18 |
| Old lander site | 10 km | 55% | 8 | 5% | 22 |

**Order (both levels):**
1. **Training and suits:** each spacewalker needs a checked suit. The Suit check job readies one suit per astronaut per sol. Passing the Academy *Spacewalk checklist* drill (2 of 3 or better) starts every mission with 1 suit ready. A suit alarm means that suit needs a new check.
2. **On foot first:** the crater rim or ice cliff.
3. **Then the rover:** far sites open only after one place has been explored on foot (and, for Cadets, from sol 5).

**Rules:**
- A second visit gives 1 science.
- The rover starts at 40%.
- The pre-spacewalk checklist covers: destination, buddy rule, ready suits, weather, suit oxygen (keep 20% in the tanks), crew energy 40 or more, and rover charge.

**Risk:** 8%, plus 25% when alone, 12% when tired, and 10% beyond 6 km. Going wrong halves the science and either breaks a rover wheel or sets off a suit alarm (−3% oxygen).

## Unlocks (Cadet)

| Sol | Opens |
|---|---|
| 1 | Life support, repair, research, exercise, rest, shelter |
| 2 | Greenhouse |
| 3 | Ice drill, fuel plant, Suit check and spacewalks on foot |
| 5 | Rover (after one walk on foot) |

## Sol report and story

- **Cadet** sees each total ("Water: down 7 L") and the 3 most important news lines; **More details** shows every line. Commander sees everything.
- After each sol a crewmate says one line about what really happened (storm, shelter, harvest, walk, cold night), from `src/sim/story.ts`.
- **Messages from Earth** arrive on sol 1, sol 2, the sol before a solar storm and the second-to-last sol, always marked "sent 12 minutes ago" to show the radio delay.
- Cadet machine descriptions show on sols 1-2 only; after that the name is enough (the text stays in the tooltip).

## Career

- **Points:** 10 per star, 5 per badge, 5 for the first walk on foot, 5 for a rover trip, 5 for passing a drill and 10 for a perfect drill (improvements only).
- **Ranks:**

  | Rank | Points |
  |---|---|
  | Trainee | 0 |
  | Cadet Astronaut | 20 |
  | Mission Specialist | 50 |
  | Flight Engineer | 90 |
  | Commander | 140 |

- **Badges:**
  - Storm safe
  - Buddy system
  - Power planner
  - Green thumb
  - Explorer
  - Mission commander

## Balance (from the tests)

Simulated players over 40 seeds per role and landing site:
- **A careful player:** never loses. 3 stars in about 63% of Cadet and 54% of Commander missions.
- **Doing nothing:** never earns more than 1 star, and loses every Commander mission.
- **Switching everything on and doing only science:** rarely wins.
- **Spacewalks:** missions with them earn more stars than missions without.
