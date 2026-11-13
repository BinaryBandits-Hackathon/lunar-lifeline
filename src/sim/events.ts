import type { SimState } from "./types";

// Surprises that happen at the start of a sol. Each one asks the player to
// choose, and each choice has a cost. "real" facts must be checked against
// NASA sources before release.

export interface EventOption {
  label: string;
  /** What happens, in one short line. */
  result: string;
  apply: (sim: SimState) => SimState;
}

export interface SimEvent {
  id: string;
  title: string;
  text: string;
  options: EventOption[];
  /** Only offered when this is true. */
  when?: (sim: SimState) => boolean;
  real: string;
}

const breakMachine = (sim: SimState, id: SimState["broken"][number]): SimState =>
  sim.broken.includes(id) ? sim : { ...sim, broken: [...sim.broken, id] };

const tired = (sim: SimState, amount: number): SimState => ({
  ...sim,
  crew: sim.crew.map((c) => ({ ...c, energy: Math.max(0, c.energy - amount) })),
});

export const EVENTS: SimEvent[] = [
  {
    id: "leak",
    title: "Leaking pipe",
    text: "A water pipe in the habitat is dripping. Every sol it leaks, we lose water.",
    options: [
      { label: "Send someone to Repair it", result: "The leak stays until someone does a Repair job.", apply: (s) => ({ ...s, leak: true }) },
      {
        label: "Patch it with tape for now",
        result: "Quick fix: it costs 10 litres of water and tires the crew a little.",
        apply: (s) => tired({ ...s, res: { ...s.res, water: Math.max(0, s.res.water - 10) } }, 10),
      },
    ],
    when: (s) => !s.leak,
    real: "Space Station crews have hunted down and fixed small air leaks.",
  },
  {
    id: "quake",
    title: "Marsquake!",
    text: "The ground shook. The CO₂ scrubber rattled loose and stopped working.",
    options: [
      { label: "Fix it with a Repair job", result: "The scrubber is broken until someone repairs it. CO₂ will rise.", apply: (s) => breakMachine(s, "scrubber") },
      {
        label: "Use a spare filter cartridge",
        result: "Spare filters scrub the air today, but it uses 6 battery.",
        apply: (s) => ({ ...s, res: { ...s.res, battery: Math.max(0, s.res.battery - 6) } }),
      },
    ],
    when: (s) => !s.broken.includes("scrubber"),
    real: "NASA's InSight lander recorded more than 1,300 marsquakes.",
  },
  {
    id: "dustDevil",
    title: "Dust devil",
    text: "A spinning dust devil swept over the base and coated the solar panels.",
    options: [
      { label: "Clean them with a Repair job", result: "Dusty panels make less power until someone cleans them.", apply: (s) => ({ ...s, dusty: true }) },
      {
        label: "Blow them clean with the air jets",
        result: "Panels clean, but the air jets used 4 % oxygen from the tanks.",
        apply: (s) => ({ ...s, res: { ...s.res, oxygen: Math.max(0, s.res.oxygen - 4) } }),
      },
    ],
    when: (s) => !s.dusty,
    real: "Dust devils sometimes blew the solar panels of the Spirit and Opportunity rovers clean.",
  },
  {
    id: "earthExperiment",
    title: "Message from Earth",
    text: "Scientists on Earth ask the crew to run a special experiment today.",
    options: [
      { label: "Accept the experiment", result: "+3 extra science if someone does Research today.", apply: (s) => ({ ...s, bonusScience: 3 }) },
      { label: "Too busy today", result: "Nothing changes. The scientists understand.", apply: (s) => s },
    ],
    real: "Space Station crews run experiments for scientists all over the world.",
  },
  {
    id: "sick",
    title: "Feeling unwell",
    text: "A crew member woke up with a headache and a fever.",
    options: [
      {
        label: "Rest today",
        result: "They rest today and get better.",
        apply: (s) => {
          const c = s.crew.find((m) => !m.isPlayer) ?? s.crew[0];
          return { ...s, mustRest: [c.id], crew: s.crew.map((m) => (m.id === c.id ? { ...m, task: "rest" } : m)) };
        },
      },
      {
        label: "Keep working",
        result: "They keep working, but their health drops by 15.",
        apply: (s) => {
          const c = s.crew.find((m) => !m.isPlayer) ?? s.crew[0];
          return { ...s, crew: s.crew.map((m) => (m.id === c.id ? { ...m, health: Math.max(0, m.health - 15) } : m)) };
        },
      },
    ],
    real: "Astronauts carry a medical kit, and one crew member is trained as the medical officer.",
  },
  {
    id: "heaterFault",
    title: "Heater fault",
    text: "A heater is flickering. Tonight could get cold.",
    options: [
      {
        label: "Run the backup heater",
        result: "The backup heater keeps everyone warm, but uses 8 extra battery.",
        apply: (s) => ({ ...s, res: { ...s.res, battery: Math.max(0, s.res.battery - 8) } }),
      },
      {
        label: "Wear extra layers tonight",
        result: "Saves power, but the crew sleep badly: −10 energy each.",
        apply: (s) => tired(s, 10),
      },
    ],
    real: "Mars nights can drop below −70 °C, so heating is a big part of a base's power use.",
  },
];

export function getEvent(id: string): SimEvent {
  const e = EVENTS.find((x) => x.id === id);
  if (!e) throw new Error(`Unknown event: ${id}`);
  return e;
}
