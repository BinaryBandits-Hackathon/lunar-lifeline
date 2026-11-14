import type { GameState, IconName } from "../engine/types";

// The base's readings right after a safe landing, before the simulation starts.
// Real-world numbers are noted next to each value; check them against NASA
// sources before release.

export type Status = "ok" | "watch" | "low";
export type SystemGroup = "Power and fuel" | "Air" | "Water and food" | "Crew" | "Outside";

export interface Reading {
  id: string;
  group: SystemGroup;
  label: string;
  icon: IconName;
  value: number;
  unit: string;
  /** Where the bar is full. */
  max: number;
  status: Status;
  /** One short line a 7-year-old can read. */
  short: string;
  /** What Pip says when the reading is tapped. */
  explain: string;
}

export const GROUPS: SystemGroup[] = ["Power and fuel", "Air", "Water and food", "Crew", "Outside"];

export function arrivalReadings(state: GameState): Reading[] {
  const cracked = state.flags.includes("PANELS_DAMAGED");
  const farIce = state.flags.includes("FAR_FROM_ICE");
  const waitedInOrbit = state.site === "holdOrbit";

  return [
    // ---------- power and fuel ----------
    {
      id: "battery",
      group: "Power and fuel",
      label: "Battery charge",
      icon: "power",
      value: waitedInOrbit ? 64 : 78,
      unit: "%",
      max: 100,
      status: waitedInOrbit ? "watch" : "ok",
      short: "Stored power for the night.",
      explain: "The battery stores power from the solar panels. At night there is no sunlight, so the base lives on the battery.",
    },
    {
      id: "solar",
      group: "Power and fuel",
      label: "Solar panels",
      icon: "power",
      value: cracked ? 50 : 100,
      unit: "%",
      max: 100,
      status: cracked ? "low" : "ok",
      short: cracked ? "Two panels cracked in the landing." : "All panels working.",
      explain: cracked
        ? "Two of our four panels cracked, so we make only half the power. Fixing them will be an early job."
        : "All four solar panels are working. Mars gets less sunlight than Earth, so every panel counts.",
    },
    {
      id: "fuel",
      group: "Power and fuel",
      label: "Rocket fuel",
      icon: "rocket",
      value: 8,
      unit: "%",
      max: 100,
      status: "low",
      short: "Not enough to fly home yet.",
      explain:
        "The landing used almost all our fuel. To fly home, the base must make new fuel from Mars air and ice. NASA plans to do the same on real missions.",
    },

    // ---------- air ----------
    {
      id: "oxygen",
      group: "Air",
      label: "Oxygen in the air",
      icon: "supplies",
      value: 21,
      unit: "%",
      max: 30,
      status: "ok",
      short: "Same as the air on Earth.",
      explain: "Air on Earth is about 21% oxygen. The base keeps the same mix so the crew can breathe normally.",
    },
    {
      id: "oxygenTank",
      group: "Air",
      label: "Oxygen tanks",
      icon: "supplies",
      value: waitedInOrbit ? 70 : 85,
      unit: "%",
      max: 100,
      status: waitedInOrbit ? "watch" : "ok",
      short: "Spare oxygen to top up the air.",
      explain: "Every breath uses oxygen. The tanks top up the air, and a machine can make more oxygen by splitting water.",
    },
    {
      id: "co2",
      group: "Air",
      label: "Carbon dioxide",
      icon: "dose",
      value: 0.4,
      unit: "%",
      max: 1,
      status: "watch",
      short: "The gas we breathe out. Keep it low.",
      explain:
        "We breathe out carbon dioxide. Too much gives the crew headaches, so a scrubber machine removes it from the air all day.",
    },
    {
      id: "pressure",
      group: "Air",
      label: "Air pressure inside",
      icon: "home",
      value: 101,
      unit: "kPa",
      max: 110,
      status: "ok",
      short: "Like standing on a beach on Earth.",
      explain:
        "Inside, the air pushes as hard as it does on Earth. Outside, Mars air is about 100 times thinner, so the crew need spacesuits.",
    },

    // ---------- water and food ----------
    {
      id: "water",
      group: "Water and food",
      label: "Water tank",
      icon: "supplies",
      value: farIce ? 120 : 180,
      unit: "L",
      max: 250,
      status: farIce ? "watch" : "ok",
      short: farIce ? "The ice is far away, so save water." : "Ice nearby to make more.",
      explain: farIce
        ? "We brought water with us, but the ice is far away. Every drop must be recycled."
        : "We landed near ice. Melting it gives us more water when the tank runs low.",
    },
    {
      id: "food",
      group: "Water and food",
      label: "Packed food",
      icon: "flask",
      value: 24,
      unit: "meals",
      max: 60,
      status: "ok",
      short: "About 8 sols for 3 astronauts.",
      explain: "We packed food for about 8 sols. To stay longer, the crew must grow food in the greenhouse.",
    },

    // ---------- crew ----------
    {
      id: "energy",
      group: "Crew",
      label: "Crew energy",
      icon: "strength",
      value: 60,
      unit: "%",
      max: 100,
      status: "watch",
      short: "Tired after the long trip.",
      explain: "Seven months in space and a bumpy landing are tiring. After months floating, walking in Mars gravity feels heavy.",
    },
    {
      id: "health",
      group: "Crew",
      label: "Crew health",
      icon: "medical",
      value: 92,
      unit: "%",
      max: 100,
      status: "ok",
      short: "Healthy, but muscles are weaker.",
      explain: "In space, muscles and bones get weaker. Exercise every day keeps the crew strong.",
    },
    {
      id: "dose",
      group: "Crew",
      label: "Radiation from the trip",
      icon: "dose",
      value: waitedInOrbit ? 410 : 380,
      unit: "mSv",
      max: 600,
      status: "watch",
      short: "The trip used more than half the safe limit.",
      explain:
        "Space radiation added up during the flight. NASA's limit for a whole career is 600 units, and the trip to Mars used more than half. That's why shelter from storms matters.",
    },

    // ---------- outside ----------
    {
      id: "tempInside",
      group: "Outside",
      label: "Temperature inside",
      icon: "home",
      value: 21,
      unit: "°C",
      max: 40,
      status: "ok",
      short: "Warm and comfortable.",
      explain: "Heaters keep the base warm. They use a lot of power at night.",
    },
    {
      id: "tempOutside",
      group: "Outside",
      label: "Temperature outside",
      icon: "water",
      value: -63,
      unit: "°C",
      max: 0,
      status: "low",
      short: "Much colder than any winter on Earth.",
      explain: "Mars is far colder than Earth. At night it can drop below minus 70 degrees.",
    },
    {
      id: "delay",
      group: "Outside",
      label: "Radio delay to Earth",
      icon: "speaker",
      value: 12,
      unit: "min",
      max: 24,
      status: "watch",
      short: "Earth can't help right away.",
      explain: "A radio message takes 12 minutes to reach Earth and 12 more to come back. The crew must solve problems themselves.",
    },
  ];
}
