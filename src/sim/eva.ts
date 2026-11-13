import { EVA_MIN_ENERGY, EVA_O2_RESERVE } from "./rules";
import type { Resources, SimState } from "./types";

// Places the crew can explore on a spacewalk. Far sites need the rover.
// "fact" lines must be checked against NASA sources before release.

export interface EvaSite {
  id: string;
  name: string;
  km: number;
  /** Rover battery the round trip needs, or 0 if the crew can walk. */
  rover: number;
  science: number;
  /** Tank oxygen used to fill each astronaut's suit. */
  suitO2: number;
  /** Radiation per astronaut, in mSv, on a normal day. */
  dose: number;
  bonus?: Partial<Resources>;
  bonusText?: string;
  only?: (sim: SimState) => boolean;
  what: string;
  fact: string;
}

export const EVA_SITES: EvaSite[] = [
  {
    id: "craterRim",
    name: "Crater rim",
    km: 1,
    rover: 0,
    science: 3,
    suitO2: 3,
    dose: 8,
    what: "A short walk to collect rocks thrown out when the crater formed.",
    fact: "Craters let scientists see rock from deep underground without digging.",
  },
  {
    id: "iceCliff",
    name: "Ice cliff",
    km: 2,
    rover: 0,
    science: 3,
    suitO2: 4,
    dose: 10,
    bonus: { water: 20 },
    bonusText: "+20 L water from ice samples",
    only: (s) => s.nearIce,
    what: "Walk to the ice next to the base and cut samples.",
    fact: "Spacecraft orbiting Mars have photographed steep cliffs of buried water ice.",
  },
  {
    id: "layeredCliffs",
    name: "Layered cliffs",
    km: 5,
    rover: 30,
    science: 5,
    suitO2: 3,
    dose: 14,
    what: "Drive to rock layers that may have formed in an ancient lake.",
    fact: "The Curiosity rover found rocks on Mars that formed in ancient lakes.",
  },
  {
    id: "meteorite",
    name: "Meteorite field",
    km: 7,
    rover: 40,
    science: 6,
    suitO2: 4,
    dose: 18,
    what: "Drive out to a shiny metal rock that fell from space.",
    fact: "The Curiosity rover found iron meteorites lying on the surface of Mars.",
  },
  {
    id: "oldLander",
    name: "Old lander site",
    km: 10,
    rover: 55,
    science: 8,
    suitO2: 5,
    dose: 22,
    what: "A long drive to study an old robot lander from decades ago.",
    fact: "NASA's Viking 1 lander has been sitting on Mars since 1976.",
  },
];

export function getSite(id: string): EvaSite {
  const s = EVA_SITES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown spacewalk site: ${id}`);
  return s;
}

export function sitesFor(sim: SimState): EvaSite[] {
  return EVA_SITES.filter((s) => !s.only || s.only(sim));
}

export interface ChecklistItem {
  id: string;
  label: string;
  ok: boolean;
  /** Why it matters, in one short line. */
  why: string;
}

/** The pre-spacewalk checklist. Real crews go through one before every spacewalk. */
export function evaChecklist(sim: SimState, stormToday: boolean): ChecklistItem[] {
  const walkers = sim.crew.filter((c) => c.task === "eva");
  const site = sim.evaSite ? getSite(sim.evaSite) : null;
  const o2Needed = site ? site.suitO2 * Math.max(1, walkers.length) : 0;
  const items: ChecklistItem[] = [
    {
      id: "destination",
      label: site ? `Destination: ${site.name}` : "Choose a destination",
      ok: !!site,
      why: "Every spacewalk has a plan before anyone goes outside.",
    },
    {
      id: "buddy",
      label: `Buddy system: ${walkers.length} astronaut${walkers.length === 1 ? "" : "s"} going`,
      ok: walkers.length >= 2,
      why: "Astronauts never go outside alone, so someone can help if a suit has a problem.",
    },
    {
      id: "weather",
      label: stormToday ? "Weather: storm today!" : "Weather: no storm today",
      ok: !stormToday,
      why: "Dust hides the way back, and a solar storm means much more radiation outside.",
    },
    {
      id: "oxygen",
      label: site ? `Suit oxygen: ${o2Needed}% from the tanks` : "Suit oxygen",
      ok: !!site && sim.res.oxygen >= o2Needed + EVA_O2_RESERVE,
      why: `Fill the suits but keep at least ${EVA_O2_RESERVE}% in the tanks for the crew at the base.`,
    },
    {
      id: "energy",
      label: `Crew rested: energy ${EVA_MIN_ENERGY}+`,
      ok: walkers.length > 0 && walkers.every((c) => c.energy >= EVA_MIN_ENERGY),
      why: "Spacewalks are hard work. Tired astronauts make mistakes.",
    },
  ];
  if (site && site.rover > 0) {
    items.push({
      id: "rover",
      label: sim.rover.broken ? "Rover: broken!" : `Rover battery: ${Math.round(sim.rover.battery)}% (needs ${site.rover}%)`,
      ok: !sim.rover.broken && sim.rover.battery >= site.rover,
      why: "The rover must have enough charge to drive there and back.",
    });
  }
  return items;
}
