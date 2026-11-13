# NASA data and facts

## 1. Real data: DONKI solar storms

- **Source:** NASA's Space Weather Database Of Notifications, Knowledge, Information (DONKI), geomagnetic storm (GST) records, via `https://api.nasa.gov/DONKI/GST`.
- **Snapshot:** `src/data/solar-storms.json`, 47 storms from 2023 to 2025 with a maximum Kp of 6 or more, fetched 13 November 2026. It includes the Kp 9 storm of 10 May 2024.
- **How the game uses it:** each mission picks one storm (solar 60%, dust 40%). A solar storm's strength comes from its real Kp:

  | Kp | Strength | Radiation per astronaut outside | Inside | In the shelter |
  |---|---|---|---|---|
  | 6 | 3 | 75 mSv | 36 mSv | 0 |
  | 7 | 4 | 100 mSv | 48 mSv | 0 |
  | 8 | 5 | 125 mSv | 60 mSv | 0 |
  | 9 | 6 | 150 mSv | 72 mSv | 0 |

  Pip names the real storm's date the day before and on the day.
- **Honesty notes:**
  - The snapshot is archived, not live, and the game never claims it's live.
  - Kp measures storms at Earth. The game uses it as a stand-in for storm strength at Mars, and says "based on a real storm".
  - Radiation numbers are simplified for play; only the 600 mSv career limit and the trip dose are meant to be close to real.
- **Refresh:** `NASA_API_KEY=your_key npm run fetch:storms -- <from> <to>`. DONKI allows 60 days per request; the script splits longer ranges. The free `DEMO_KEY` allows only about 10 requests an hour.

**Not covered by DONKI:** Martian dust storms. The game's dust storms aren't tied to records; the related fact cites the 2018 global dust storm.

## 2. Facts shown to players

Every fact must be checked against a NASA (or ESA) page before a public launch. Mark each one when done, with the source link.

| # | Fact (as shown in the game) | Where | Check against | Status |
|---|---|---|---|---|
| 1 | NASA's InSight lander recorded more than 1,300 marsquakes. | Marsquake surprise | InSight mission summary | To check |
| 2 | Space Station crews have hunted down and fixed small air leaks. | Leak surprise | ISS leak news (2020-2021) | To check |
| 3 | Dust devils sometimes blew the solar panels of the Spirit and Opportunity rovers clean. | Dust devil surprise | Mars Exploration Rover mission pages | To check |
| 4 | Space Station crews run experiments for scientists all over the world. | Earth experiment surprise | ISS research overview | To check |
| 5 | Astronauts carry a medical kit, and one crew member is trained as the medical officer. | Sick crewmate surprise | ISS crew medical officer role | To check |
| 6 | Mars nights can drop below −70 °C. | Heater fault surprise | Mars facts / Curiosity REMS weather | To check |
| 7 | Craters let scientists see rock from deep underground without digging. | Crater rim walk | Mars geology explainer | To check |
| 8 | Spacecraft orbiting Mars have photographed steep cliffs of buried water ice. | Ice cliff walk | MRO HiRISE ice scarps (2018) | To check |
| 9 | The Curiosity rover found rocks on Mars that formed in ancient lakes. | Layered cliffs walk | Curiosity Gale crater lake findings | To check |
| 10 | The Curiosity rover found iron meteorites lying on the surface of Mars. | Meteorite field walk | Curiosity meteorite finds | To check |
| 11 | NASA's Viking 1 lander has been sitting on Mars since 1976. | Old lander walk | Viking 1 mission page | To check |
| 12 | Astronauts grew lettuce under LED lights on the Space Station and ate it in 2015. | Greenhouse unlock | Veggie experiment (2015) | To check |
| 13 | NASA's Phoenix lander dug up water ice on Mars in 2008. | Ice drill unlock | Phoenix mission | To check |
| 14 | NASA's MOXIE experiment made oxygen from Mars air. | Fuel plant unlock | MOXIE on Perseverance | To check |
| 15 | Astronauts always go on spacewalks in pairs, and check every part of their suits first. | Spacewalk unlock, checklist | NASA spacewalk basics | To check |
| 16 | Apollo astronauts drove a rover on the Moon to reach places too far to walk. | Rover unlock | Lunar Roving Vehicle (Apollo 15-17) | To check |
| 17 | The Space Station recycles about 98% of its water. | Life support drill | ISS water recovery (2023 milestone) | To check |
| 18 | NASA's career radiation limit is 600 mSv; a trip to Mars uses more than half. | Systems check | NASA 2022 radiation standard; Curiosity RAD cruise dose | To check |
| 19 | Air on Earth is about 21% oxygen; Mars air is about 100 times thinner. | Systems check | Mars atmosphere facts | To check |
| 20 | A radio message takes about 4 to 24 minutes between Earth and Mars (the game uses 12). | Opening, systems check | Mars communication delay | To check |
| 21 | Astronauts fix their own equipment on the Space Station. | Engineer job | ISS maintenance | To check |
| 22 | Astronauts check their own health in space, and doctors on Earth watch over them. | Doctor job | ISS crew health | To check |
| 23 | Crews on the Space Station have run thousands of experiments. | Scientist job | ISS research overview | To check |

Where to find them in the code: `src/sim/events.ts`, `src/sim/eva.ts`, `src/sim/unlocks.ts`, `src/content/academy.ts`, `src/content/systems.ts`, `src/content/roles.ts`, `src/content/script.ts`.

## 3. Ideas for more NASA data (not built)

- **OSDR** (Open Science Data Repository): astronaut and plant research, for crop and crew-health rules.
- **Mars weather** from Curiosity (REMS) or InSight: real temperatures by season for the heaters.
- **NASA Image and Video Library:** real photos of each destination in the spacewalk planner.
