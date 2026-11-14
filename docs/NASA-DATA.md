# NASA data and facts

## 1. Real data: solar particle storms (DONKI SEP) and Curiosity RAD

**Why we changed from geomagnetic storms.** The first version used DONKI geomagnetic storms (Kp). Kp measures how much **Earth's** magnetic field is disturbed. Mars has no global magnetic field, so Kp says nothing about radiation on Mars. What raises radiation for astronauts on and around Mars is a **solar energetic particle (SEP) event**: a burst of fast protons from the Sun.

- **Source:** NASA DONKI SEP records, `https://api.nasa.gov/DONKI/SEP`.
- **Snapshot:** `src/data/sep-events.json` (54 instrument records, grouped into 10 storms by `src/sim/sep.ts`). Windows fetched: September 2017, 20 April to 18 June 2024, August to September 2024. It includes:
  - the **10 September 2017** event, which also hit Mars, where Curiosity saw surface radiation more than double
  - the **May 2024** storms.
- **Strength (3-6):** every SEP storm starts at 3. Add 1 if 3 or more instruments saw it, 1 if DONKI links it to a solar flare, and 2 if protons above 100 MeV were seen (those get through suits and thin walls).
- **Everyday radiation:** every sol each astronaut gets **0.64 mSv**, the dose Curiosity's RAD measured on the Martian surface (Hassler et al., *Science*, 2014).
- **Trip dose:** astronauts start at 380 mSv. RAD measured about **1.8 mSv a day** on the way to Mars (Zeitlin et al., *Science*, 2013), about 330 mSv for a 6-month trip.
- **Limit:** 600 mSv, NASA's career limit (2022 standard).
- **Game scale (honest note):** storm doses in the game (25 mSv outside per strength point) are bigger than a real storm gives on the Martian surface, where the air shields a lot. We make storms stronger so the choice to shelter matters in a 7-10 sol mission. The in-game NASA data screen says this.
- **Refresh:** `NASA_API_KEY=your_key npm run fetch:sep -- 2021-01-01 2025-12-31` (60 days per request; DEMO_KEY allows about 10 requests an hour).

The old geomagnetic snapshot (`src/data/solar-storms.json`) is used only by the unused card game.

**Not covered by DONKI:** Martian dust storms. The game's dust storms aren't tied to records; the related fact cites the 2018 global dust storm.

## 2. Facts shown to players

Each fact was checked against NASA mission results we know (14 November 2026). "Matches" means the fact agrees with the named NASA finding; a teammate should still paste the exact page link. Three facts were corrected.

| # | Fact (as shown in the game) | Where | Check against | Status |
|---|---|---|---|---|
| 1 | NASA's InSight lander recorded more than 1,300 marsquakes. | Marsquake surprise | InSight mission summary (1,319 quakes) | Matches |
| 2 | Space Station crews have hunted down and fixed small air leaks. | Leak surprise | ISS leak news (2020-2021) | Matches |
| 3 | Dust devils sometimes blew the solar panels of the Spirit and Opportunity rovers clean. | Dust devil surprise | Mars Exploration Rover mission pages | Matches |
| 4 | Space Station crews run experiments for scientists all over the world. | Earth experiment surprise | ISS research overview | Matches |
| 5 | Astronauts carry a medical kit, and one crew member is trained as the medical officer. | Sick crewmate surprise | ISS crew medical officer role | Matches |
| 6 | Mars nights can drop below −70 °C. | Heater fault surprise | Mars facts / Curiosity REMS weather | Matches |
| 7 | Craters let scientists see rock from deep underground without digging. | Crater rim walk | Mars geology explainer | Matches |
| 8 | Spacecraft orbiting Mars have photographed steep cliffs of buried water ice. | Ice cliff walk | MRO HiRISE ice scarps (2018) | Matches |
| 9 | The Curiosity rover found rocks on Mars that formed in ancient lakes. | Layered cliffs walk | Curiosity Gale crater lake findings | Matches |
| 10 | The Curiosity rover found iron meteorites lying on the surface of Mars. | Meteorite field walk | Curiosity meteorite finds | Matches |
| 11 | NASA's Viking 1 lander has been sitting on Mars since 1976. | Old lander walk | Viking 1 mission page | Matches |
| 12 | Astronauts grew lettuce under LED lights on the Space Station and ate it in 2015. | Greenhouse unlock | Veggie experiment (2015) | Matches |
| 13 | NASA's Phoenix lander dug up water ice on Mars in 2008. | Ice drill unlock | Phoenix mission | Matches |
| 14 | NASA's MOXIE experiment made oxygen from Mars air. | Fuel plant unlock | MOXIE on Perseverance | Matches |
| 15 | On the Space Station, astronauts go on spacewalks in pairs, and check every part of their suits first. | Spacewalk unlock, checklist | NASA spacewalk basics | **Corrected**: "always" was too strong (early solo spacewalks happened) |
| 16 | Apollo astronauts drove a rover on the Moon to reach places too far to walk. | Rover unlock | Lunar Roving Vehicle (Apollo 15-17) | Matches |
| 17 | The Space Station recycles about 98% of its water. | Life support drill | ISS water recovery (2023 milestone) | Matches |
| 18 | NASA's career radiation limit is 600 mSv; a trip to Mars uses more than half. | Systems check | NASA 2022 radiation standard; Curiosity RAD cruise dose | Matches |
| 19 | Air on Earth is about 21% oxygen; Mars air is more than 100 times thinner. | Systems check | Mars surface pressure is under 1% of Earth's | **Corrected** ("about 100" to "more than 100") |
| 20 | A radio message takes about 3 to 22 minutes between Earth and Mars (the game uses 12). | Opening, systems check | Mars communication delay | **Corrected** (range was 4 to 24) |
| 21 | Astronauts fix their own equipment on the Space Station. | Engineer job | ISS maintenance | Matches |
| 22 | Astronauts check their own health in space, and doctors on Earth watch over them. | Doctor job | ISS crew health | Matches |
| 23 | Crews on the Space Station have run thousands of experiments. | Scientist job | ISS research overview | Matches |
| 24 | Curiosity measured about 0.64 mSv a day on the Martian surface. | NASA data screen, every sol | Hassler et al., Science 2014 (RAD) | Matches |
| 25 | In September 2017 a solar storm hit Mars and Curiosity saw the radiation on the ground more than double. | Solar storm, NASA data screen | NASA/JPL news, 29 Sept 2017 | Matches |
| 26 | Sunsets on Mars look blue. | Crew line after a quiet sol | Curiosity sunset images (2015) | Matches |

Where to find them in the code: `src/sim/events.ts`, `src/sim/eva.ts`, `src/sim/unlocks.ts`, `src/content/academy.ts`, `src/content/systems.ts`, `src/content/roles.ts`, `src/content/script.ts`.

## 3. Ideas for more NASA data (not built)

- **OSDR** (Open Science Data Repository): astronaut and plant research, for crop and crew-health rules.
- **Mars weather** from Curiosity (REMS) or InSight: real temperatures by season for the heaters.
- **NASA Image and Video Library:** real photos of each destination in the spacewalk planner.
