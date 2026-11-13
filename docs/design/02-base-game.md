# Base game: running the Mars outpost

Status: playable draft. Numbers are checked by the balance bots, not yet by a playtest with children.

## One sol (Mars day)

1. **Morning report.** The solar panels make power blocks (5 on a clear sol, fewer if cracked or dusty, 1 in a dust storm). Earth's replies, storm forecasts and launch warnings arrive here.
2. **Power board.** The player splits battery + new blocks between three systems. Unused blocks go to the battery (up to 10).
   - **Habitat:** needs 2 blocks, or supplies drop by the missing amount.
   - **Greenhouse:** each block grows the crop; at 3 growth the harvest gives +3 supplies.
   - **Shield:** each block stops 1 point of solar-storm radiation. On other sols it is wasted.
   The board shows a live preview of what will happen before the player locks it in.
3. **Decision card.** One situation, two or three options. Every option costs something, even if only a missed chance. Power costs come from the battery; a shortfall costs supplies instead.
4. **End-of-sol report.** What happened, with each cause spelled out, plus the lesson and the real mission behind the card.

The crew uses 1 supply every sol.

## Missions and endings

| | Cadet (7–9) | Commander (10–12) |
|---|---|---|
| Length | 7 sols | 10 sols |
| Science goal | 4 | 6 |
| Storm | Sol 4 | Sol 4–7 |
| Options per card | 2 | 2–3 |
| Power board | Pip suggests a split each sol | Keeps yesterday's split; no advice |
| Starting supplies | +2 cushion | none |

Endings, decided by the gauges at the end:

- **Early return (0 stars):** supplies reach 0 on any sol.
- **Grounded (0 stars):** radiation at or above 7 at the end.
- **Mission Commander (3 stars):** science goal reached.
- **Safe return (1–2 stars):** everyone safe but the science goal missed.

## Storms

Each run has one storm, solar (60%) or dust (40%), with a forecast card the sol before.

- **Solar storm:** strength comes from a real NASA DONKI geomagnetic storm (`src/data/solar-storms.json`): Kp 6 → 3, Kp 7 → 4, Kp 8 → 5, Kp 9 → 6. The mission report names the real storm's date and links to NASA's record. The snapshot holds 47 storms from 2023–2025 (Kp 6 and up), including the Kp 9 storm of 10 May 2024. If the file is ever empty, the game uses strength 4 and says it is an example.
- **Dust storm:** panels make 1 block. DONKI does not cover Mars weather; the card cites the real 2018 global dust storm.

To refresh the storm data (DONKI allows 60 days per request; the free demo key allows 10 requests an hour):

```bash
NASA_API_KEY=your_key npm run fetch:storms -- 2023-01-01 2025-12-31
```

## Where to change things

- `src/content/rules.ts`: every number (production, needs, harvest, limits, level settings).
- `src/content/cards.ts`: every decision card, its options, lesson and real-world fact.
- `src/engine/base.ts`: the rules engine (pure functions, no React).

After any change run `npm test`. The balance bots (`tests/bots.ts`) play 600 seeded runs per strategy and level, and the tests fail if:

- a thoughtful player stops winning most of the time,
- playing totally safe earns 3 stars too often (Cadet allows up to 15%, since it is gentler on purpose),
- chasing only science stops being risky,
- ignoring the forecast stops doing worse,
- random play wins too often or loses every time.

Current results (600 runs each):

| Strategy | Cadet 3-star | Cadet lost | Commander 3-star | Commander lost |
|---|---|---|---|---|
| Thoughtful | 96% | 0% | 98% | 2% |
| Always safe, no science | 11% | 1% | 0% | 2% |
| Chasing science | 75% | 25% | 31% | 69% |
| Ignores the forecast | 75% | 25% | 26% | 74% |
| Random | 38% | 43% | 15% | 68% |

## Known gaps

- Only one storm per mission; Commander could use a second, smaller one.
- Card facts need checking against NASA sources before release.
- Not yet playtested with children.
