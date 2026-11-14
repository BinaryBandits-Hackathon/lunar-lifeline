# NASA data and facts

## 1. Real data: solar particle storms (DONKI SEP) and Curiosity RAD

**Why we changed from geomagnetic storms.** The first version used DONKI geomagnetic storms (Kp). Kp measures how much **Earth's** magnetic field is disturbed. Mars has no global magnetic field, so Kp says nothing about radiation on Mars. What raises radiation for astronauts on and around Mars is a **solar energetic particle (SEP) event**: a burst of fast protons from the Sun.

- **Source:** NASA DONKI SEP records, `https://api.nasa.gov/DONKI/SEP`.
- **Snapshot:** `src/data/sep-events.json` (54 instrument records, grouped into 10 storms by `src/sim/sep.ts`). Windows fetched: September 2017, 20 April to 18 June 2024, August to September 2024. It includes:
  - the **10 September 2017** event, which also hit Mars, where Curiosity saw surface radiation more than double
  - the **May 2024** storms.
- **Strength (3-6):** every SEP storm starts at 3. Add 1 if 3 or more spacecraft instruments saw it (DONKI's model estimates are not counted), 1 if DONKI links it to a solar flare, and 2 if protons above 100 MeV were seen (those get through suits and thin walls).
- **Everyday radiation:** every sol each astronaut gets **0.64 mSv**, the dose Curiosity's RAD measured on the Martian surface (Hassler et al., *Science*, 2014).
- **Trip dose:** astronauts start at 380 mSv. RAD measured about **1.8 mSv a day** on the way to Mars (Zeitlin et al., *Science*, 2013), about 330 mSv for a 6-month trip.
- **Limit:** 600 mSv, NASA's career limit (2022 standard).
- **Game scale (honest note):** storm doses in the game (25 mSv outside per strength point) are bigger than a real storm gives on the Martian surface, where the air shields a lot. We make storms stronger so the choice to shelter matters in a 7-10 sol mission. The in-game NASA data screen says this.
- **Refresh:** `NASA_API_KEY=your_key npm run fetch:sep -- 2021-01-01 2025-12-31` (60 days per request; DEMO_KEY allows about 10 requests an hour).

The old geomagnetic snapshot (`src/data/solar-storms.json`) is used only by the unused card game.

**Not covered by DONKI:** Martian dust storms. The game's dust storms aren't tied to records; the related fact cites the 2018 global dust storm.

## 2. Facts shown to players

Each fact is linked to the NASA page it comes from (checked 14 November 2026).

| # | Fact (as shown in the game) | Where | NASA source |
|---|---|---|---|
| 1 | NASA's InSight lander recorded more than 1,300 marsquakes. | Marsquake surprise | [NASA Retires InSight Mars Lander Mission](https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/) (1,319 quakes) |
| 2 | Space Station crews have hunted down and fixed small air leaks. | Leak surprise | [Crew Continues Troubleshooting as Tests Isolate Small Leak](https://blogs.nasa.gov/spacestation/2020/09/29/crew-continues-troubleshooting-as-tests-isolate-small-leak) |
| 3 | Dust devils sometimes blew the solar panels of the Spirit and Opportunity rovers clean. | Dust devil surprise | [Solar-Panel Dust Accumulation and Cleanings](https://science.nasa.gov/photojournal/solar-panel-dust-accumulation-and-cleanings/); [APOD 2005-03-23](https://science.nasa.gov/image-article/apod-2005-march-23-a-dust-devil-swirling-on-mars/) |
| 4 | Space Station crews run experiments for scientists all over the world. | Earth experiment surprise | [Space Station 20th: First NASA Research](https://www.nasa.gov/history/space-station-20th-first-nasa-research-on-iss/) (researchers in 108 countries) |
| 5 | Astronauts carry a medical kit, and one crew member is trained as the medical officer. | Sick crewmate surprise | [Crew Medical Officer Training and Role of Ground Support (NTRS)](https://ntrs.nasa.gov/citations/20205008925) |
| 6 | Mars nights can drop below −70 °C. | Heater fault surprise | [Taking Mars' Temperature](https://science.nasa.gov/resource/taking-mars-temperature/) (night air down to −75 °C); [Mars facts](https://science.nasa.gov/mars/facts/) |
| 7 | Craters let scientists see rock from deep underground without digging. | Crater rim walk | [Nature's Drilling Exposes Deeply Buried Minerals](https://www.nasa.gov/image-article/natures-drilling-exposes-deeply-buried-minerals/) |
| 8 | Spacecraft orbiting Mars have photographed steep cliffs of buried water ice. | Ice cliff walk | [Steep Slopes on Mars Reveal Structure of Buried Ice](https://www.jpl.nasa.gov/news/steep-slopes-on-mars-reveal-structure-of-buried-ice/) |
| 9 | The Curiosity rover found rocks on Mars that formed in ancient lakes. | Layered cliffs walk | [Curiosity Rover Team Confirms Ancient Lakes on Mars](https://www.jpl.nasa.gov/news/nasas-curiosity-rover-team-confirms-ancient-lakes-on-mars/) |
| 10 | The Curiosity rover found iron meteorites lying on the surface of Mars. | Meteorite field walk | [Curiosity Finds Iron Meteorite on Mars](https://www.nasa.gov/image-article/curiosity-finds-iron-meteorite-mars/) |
| 11 | NASA's Viking 1 lander has been sitting on Mars since 1976. | Old lander walk | [Viking 1](https://science.nasa.gov/mission/viking-1/) (landed 20 July 1976) |
| 12 | Astronauts grew lettuce under LED lights on the Space Station and ate it in 2015. | Greenhouse unlock | [Veggie fact sheet](https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf); [Lettuce Feast, 10 Aug 2015](https://blogs.nasa.gov/commercialcrew/2015/08/10/lettuce-feast-previews-research-potential-of-station/) |
| 13 | NASA's Phoenix lander dug up water ice on Mars in 2008. | Ice drill unlock | [Phoenix Mars Lander Confirms Frozen Water](https://www.jpl.nasa.gov/news/nasa-phoenix-mars-lander-confirms-frozen-water/) |
| 14 | NASA's MOXIE experiment made oxygen from Mars air. | Fuel plant unlock | [MOXIE Completes Mars Mission](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/) (122 g of oxygen) |
| 15 | On the Space Station, astronauts go on spacewalks in pairs, and check every part of their suits first. | Spacewalk unlock, checklist | [Final Suit Checks and Reviews before Friday's Spacewalk](https://www.nasa.gov/blogs/spacestation/2019/03/21/final-suit-checks-and-reviews-before-fridays-spacewalk/) |
| 16 | Apollo astronauts drove a rover on the Moon to reach places too far to walk. | Rover unlock | [The Apollo Lunar Roving Vehicle](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html) |
| 17 | The Space Station recycles about 98% of its water. | Life support drill | [NASA Achieves Water Recovery Milestone](https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/) |
| 18 | NASA's career radiation limit is 600 mSv; a trip to Mars uses more than half. | Systems check | [NASA-STD-3001 radiation technical brief](https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf); [Data From NASA Rover's Voyage to Mars](https://www.jpl.nasa.gov/news/data-from-nasa-rovers-voyage-to-mars-aids-planning/) (1.8 mSv a day in cruise) |
| 19 | Air on Earth is about 21% oxygen; Mars air is more than 100 times thinner. | Systems check | [NASA Rover Finds Clues to Changes in Mars' Atmosphere](https://www.jpl.nasa.gov/news/nasa-rover-finds-clues-to-changes-in-mars-atmosphere/) ("100 times thinner"; surface pressure is about 0.6% of Earth's) |
| 20 | A radio message takes about 4 to 24 minutes between Earth and Mars (the game uses 12). | Opening, systems check | [Space Communications: 7 Things You Need to Know](https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/) |
| 21 | Astronauts fix their own equipment on the Space Station. | Engineer job | [Crew Continues Troubleshooting as Tests Isolate Small Leak](https://blogs.nasa.gov/spacestation/2020/09/29/crew-continues-troubleshooting-as-tests-isolate-small-leak) |
| 22 | Astronauts check their own health in space, and doctors on Earth watch over them. | Doctor job | [Crew Medical Officer Training and Role of Ground Support (NTRS)](https://ntrs.nasa.gov/citations/20205008925) |
| 23 | Crews on the Space Station have run thousands of experiments. | Scientist job | [25 Years of Scientific Discovery Aboard the ISS](https://www.nasa.gov/missions/station/iss-research/25-year-of-scientific-discovery-aboard-international-space-station/) (more than 4,000) |
| 24 | Curiosity measured about 0.64 mSv a day on the Martian surface. | NASA data screen, every sol | [Curiosity's First Radiation Measurements on Mars](https://science.nasa.gov/resource/curiositys-first-radiation-measurements-on-mars/); Hassler et al., *Science* 2014 |
| 25 | In September 2017 a solar storm hit Mars and Curiosity saw the radiation on the ground more than double. | Solar storm, NASA data screen | [Large Solar Storm Sparks Global Aurora and Doubles Radiation Levels on the Martian Surface](https://www.jpl.nasa.gov/news/large-solar-storm-sparks-global-aurora-and-doubles-radiation-levels-on-the-martian-surface/) |
| 26 | Sunsets on Mars look blue. | Crew line after a quiet sol | [NASA's Curiosity Rover Views Serene Sundown on Mars](https://www.jpl.nasa.gov/news/nasas-curiosity-rover-views-serene-sundown-on-mars/) |

**Notes from checking:**
- #3: NASA says the 2005 Spirit cleaning was *possibly* a dust devil; cleanings by wind are confirmed. The game says "sometimes", which fits.
- #20: NASA's Goddard page gives 4 to 24 minutes. An earlier edit changed this to "3 to 22"; that was wrong and is reverted.
- #18: "more than half" means one way: about 180 days × 1.8 mSv ≈ 330 mSv.

**Data sources:**
- [DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/), NASA's space weather database, for the solar particle storms. Example record: [10 September 2017, above 100 MeV](https://ccmc.gsfc.nasa.gov/DONKI/view/SEP/13101/-1).
- [Curiosity's radiation readings during the September 2017 storm](https://science.nasa.gov/photojournal/solar-storms-radiation-at-martian-orbit-and-surface/).

Where to find them in the code: `src/sim/events.ts`, `src/sim/eva.ts`, `src/sim/unlocks.ts`, `src/content/academy.ts`, `src/content/systems.ts`, `src/content/roles.ts`, `src/content/script.ts`.

## 3. Ideas for more NASA data (not built)

- **OSDR** (Open Science Data Repository): astronaut and plant research, for crop and crew-health rules.
- **Mars weather** from Curiosity (REMS) or InSight: real temperatures by season for the heaters.
- **NASA Image and Video Library:** real photos of each destination in the spacewalk planner.
