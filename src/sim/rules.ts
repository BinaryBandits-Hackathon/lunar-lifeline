import type { Level } from "../engine/types";
import type { CropInfo, MachineId, MachineInfo, Phase, ResourceId, TaskId, TaskInfo } from "./types";

// Every number in the base simulation. Battery is in percent points.
// Change here and run `npm test`; the simulation bots check the balance.

export const PHASES: Phase[] = ["morning", "day", "evening", "night"];

/** Battery points made by four healthy panels in each part of the sol. */
export const SOLAR: Record<Phase, number> = { morning: 12, day: 30, evening: 8, night: 0 };
export const CRACKED_SOLAR = 0.5;

export const MACHINES: Record<MachineId, MachineInfo> = {
  heaters: {
    id: "heaters",
    name: "Heaters",
    icon: "home",
    use: { morning: 4, day: 0, evening: 4, night: 14 },
    canSwitchOff: false,
    what: "Keep the base warm. Mars nights are colder than −70 °C.",
  },
  scrubber: {
    id: "scrubber",
    name: "CO₂ scrubber",
    icon: "dose",
    use: { morning: 2, day: 2, evening: 2, night: 2 },
    canSwitchOff: true,
    what: "Removes the carbon dioxide the crew breathes out.",
  },
  oxygenMaker: {
    id: "oxygenMaker",
    name: "Oxygen maker",
    icon: "supplies",
    use: { morning: 3, day: 3, evening: 3, night: 0 },
    canSwitchOff: true,
    what: "Splits water into oxygen to breathe.",
  },
  recycler: {
    id: "recycler",
    name: "Water recycler",
    icon: "water",
    use: { morning: 2, day: 2, evening: 2, night: 0 },
    canSwitchOff: true,
    what: "Cleans used water so it can be drunk again.",
  },
  greenhouseLights: {
    id: "greenhouseLights",
    name: "Greenhouse lights",
    icon: "flask",
    use: { morning: 3, day: 3, evening: 0, night: 0 },
    canSwitchOff: true,
    what: "Plants need light every sol to grow.",
  },
  fuelPlant: {
    id: "fuelPlant",
    name: "Fuel plant",
    icon: "rocket",
    use: { morning: 0, day: 10, evening: 4, night: 0 },
    canSwitchOff: true,
    what: "Makes rocket fuel from Mars air and water, for the trip home.",
  },
  roverCharger: {
    id: "roverCharger",
    name: "Rover charger",
    icon: "power",
    use: { morning: 0, day: 4, evening: 4, night: 0 },
    canSwitchOff: true,
    what: "Charges the rover's battery for long trips.",
  },
};

/** When power runs short, machines switch off in this order (first = first to go). */
export const SHED_ORDER: MachineId[] = ["roverCharger", "fuelPlant", "greenhouseLights", "recycler", "oxygenMaker", "scrubber", "heaters"];

export const TASKS: Record<TaskId, TaskInfo> = {
  farm: { id: "farm", name: "Farm", icon: "flask", energy: 20, what: "Plant seeds and harvest ripe crops." },
  mine: { id: "mine", name: "Mine ice", icon: "water", energy: 35, what: "Drill ice and melt it into water. Uses power." },
  repair: { id: "repair", name: "Repair", icon: "wrench", energy: 30, what: "Fix broken equipment, like cracked panels." },
  research: { id: "research", name: "Research", icon: "science", energy: 25, what: "Run experiments in the lab. Uses power." },
  exercise: { id: "exercise", name: "Exercise", icon: "strength", energy: 15, what: "Keeps muscles and bones strong." },
  rest: { id: "rest", name: "Rest", icon: "home", energy: -35, what: "Get energy back." },
  eva: { id: "eva", name: "Spacewalk", icon: "astronaut", energy: 30, what: "Go outside in a spacesuit to explore. Plan it first!" },
  suitPrep: { id: "suitPrep", name: "Suit check", icon: "wrench", energy: 15, what: "Practise in the airlock and get one spacesuit ready. Each spacewalker needs a ready suit." },
  shelter: { id: "shelter", name: "Shelter", icon: "dose", energy: 0, what: "Hide in the shielded room. Safe from radiation, but no work gets done." },
};

export const TASK_ORDER: TaskId[] = ["eva", "suitPrep", "farm", "mine", "repair", "research", "exercise", "rest", "shelter"];

/** Jobs done outside in a spacesuit. Inside jobs get some protection from the habitat walls. */
export const OUTSIDE_TASKS: TaskId[] = ["mine", "repair", "eva"];

export const TASK_POWER = { mine: 8, research: 6 } as const;
export const MINE_WATER = { near: 25, far: 10 } as const;
export const RESEARCH_SCIENCE = 1;

export const CROPS: Record<"lettuce" | "potato", CropInfo> = {
  lettuce: { id: "lettuce", name: "Lettuce", sols: 3, meals: 4 },
  potato: { id: "potato", name: "Potatoes", sols: 5, meals: 10 },
};

export const PLOTS = 3;
export const PLOT_WATER = 1;

/** What 3 astronauts use in one sol, spread over the four parts of the sol. */
export const CREW_USE = { oxygen: 6, water: 9, food: 3, co2: 0.6 } as const;
export const RECYCLE_SHARE = 0.7;
export const OXYGEN_MAKER = { oxygen: 2, water: 1 } as const; // per running phase
export const SCRUBBER_REMOVES = 0.2; // CO2 points per running phase
export const CO2_FLOOR = 0.3;
export const CO2_TIRED = 1;
export const CO2_DANGER = 2;
export const CO2_EMERGENCY = 3;
export const FUEL_PER_SOL = 5;

export const SLEEP_ENERGY = 30;
export const COLD_SLEEP_ENERGY = 10;
export const COLD_HEALTH = 5;
export const NO_EXERCISE_HEALTH = 2;
export const EXERCISE_HEALTH = 4;
export const TIRED_ENERGY = 20;

export const CAPS: Record<ResourceId, number> = {
  battery: 100,
  oxygen: 100,
  co2: 5,
  water: 250,
  food: 60,
  fuel: 100,
  science: 99,
};

export const LEVELS: Record<Level, { sols: number; fuelGoal: number; scienceGoal: number; stormSols: [number, number] }> = {
  cadet: { sols: 7, fuelGoal: 25, scienceGoal: 12, stormSols: [4, 4] },
  commander: { sols: 10, fuelGoal: 35, scienceGoal: 18, stormSols: [4, 7] },
};

// ---------- storms ----------
/** Chance the mission's storm is a solar storm (the rest are dust storms). */
export const SOLAR_CHANCE = 0.6;
/**
 * mSv of radiation per point of solar storm strength. GAME SCALE: real storms on
 * the Martian surface add a few mSv (the air shields a lot); in open space an
 * unshielded astronaut could get far more. The game uses a bigger number so the
 * choice to shelter matters in a 7-10 sol mission. The NASA data screen says so.
 */
export const DOSE_OUTSIDE = 25;
export const DOSE_INSIDE = 12;
/** NASA's career radiation limit for astronauts, in mSv. */
export const DOSE_LIMIT = 600;
/** The trip: about 6 months at RAD's measured 1.8 mSv a day in cruise is about 330 mSv, plus training and earlier flights. */
export const DOSE_START = 380;
/** Solar power during a dust storm, and with dusty panels afterwards. */
export const DUST_STORM_SOLAR = 0.2;
export const DUST_STORM_SOLS = 2;
export const DUSTY_SOLAR = 0.7;

// ---------- surprises ----------
export const EVENT_CHANCE = 0.5;
export const LEAK_WATER = 5;

// ---------- spacewalks and the rover ----------
/** Rover battery points added in each part of the sol while charging. */
export const ROVER_CHARGE = 12;
export const ROVER_START = 40;
/** Base chance something goes wrong on a spacewalk, before the extra risks. */
export const EVA_RISK = { base: 0.08, solo: 0.25, tired: 0.12, far: 0.1 } as const;
/** Oxygen to keep in the tanks after the suits are filled. */
export const EVA_O2_RESERVE = 20;
export const EVA_MIN_ENERGY = 40;
/** Spacesuits on the base. */
export const SUITS = 3;
/** Radiation on a spacewalk is this many times higher during a solar storm. */
export const EVA_STORM_DOSE = 3;
