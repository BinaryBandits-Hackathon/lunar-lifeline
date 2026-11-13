import type { IconName, Level } from "../engine/types";
import type { MachineId, SimState, TaskId } from "./types";

// Systems open one at a time so a young player learns them one by one,
// the way real crews bring a new base online step by step.
// Commanders get everything from the start.

export type Feature = "greenhouse" | "mine" | "fuel" | "eva" | "rover";

export const UNLOCK_SOL: Record<Level, Record<Feature, number>> = {
  cadet: { greenhouse: 2, mine: 3, fuel: 3, eva: 4, rover: 5 },
  commander: { greenhouse: 1, mine: 1, fuel: 1, eva: 1, rover: 1 },
};

export const FEATURE_INFO: Record<Feature, { name: string; icon: IconName; what: string; real: string }> = {
  greenhouse: {
    name: "Greenhouse",
    icon: "flask",
    what: "Plant lettuce and potatoes, give them light and water, and send a farmer to harvest. Food for a longer stay.",
    real: "Astronauts grew lettuce under LED lights on the Space Station and ate it in 2015.",
  },
  mine: {
    name: "Ice drill",
    icon: "water",
    what: "A new job: Mine ice. Drill ice and melt it into water. It uses power.",
    real: "NASA's Phoenix lander dug up water ice on Mars in 2008.",
  },
  fuel: {
    name: "Fuel plant",
    icon: "rocket",
    what: "Make rocket fuel from Mars air and water for the trip home. It needs a lot of power.",
    real: "NASA's MOXIE experiment made oxygen from Mars air, the first step to making fuel on Mars.",
  },
  eva: {
    name: "Spacewalks",
    icon: "astronaut",
    what: "A new job: Spacewalk. Plan it, check the list, and explore on foot. Always take a buddy.",
    real: "Astronauts always go on spacewalks in pairs, and check every part of their suits first.",
  },
  rover: {
    name: "Rover",
    icon: "next",
    what: "Charge the rover to drive to far places: layered cliffs, a meteorite field and an old lander.",
    real: "Apollo astronauts drove a rover on the Moon to reach places too far to walk.",
  },
};

export const FEATURE_ORDER: Feature[] = ["greenhouse", "mine", "fuel", "eva", "rover"];

const MACHINE_FEATURE: Partial<Record<MachineId, Feature>> = {
  greenhouseLights: "greenhouse",
  fuelPlant: "fuel",
  roverCharger: "rover",
};

const TASK_FEATURE: Partial<Record<TaskId, Feature>> = {
  farm: "greenhouse",
  mine: "mine",
  eva: "eva",
};

export function unlockSol(sim: Pick<SimState, "level">, f: Feature): number {
  return UNLOCK_SOL[sim.level][f];
}

export function isUnlocked(sim: Pick<SimState, "level" | "sol">, f: Feature): boolean {
  return sim.sol >= UNLOCK_SOL[sim.level][f];
}

export function machineFeature(id: MachineId): Feature | null {
  return MACHINE_FEATURE[id] ?? null;
}

export function taskFeature(id: TaskId): Feature | null {
  return TASK_FEATURE[id] ?? null;
}

export function machineLocked(sim: Pick<SimState, "level" | "sol">, id: MachineId): boolean {
  const f = MACHINE_FEATURE[id];
  return !!f && !isUnlocked(sim, f);
}

export function taskLocked(sim: Pick<SimState, "level" | "sol">, id: TaskId): boolean {
  const f = TASK_FEATURE[id];
  return !!f && !isUnlocked(sim, f);
}

/** Features that open exactly on this sol (for the "new on the base" card). */
export function newOnSol(level: Level, sol: number): Feature[] {
  return FEATURE_ORDER.filter((f) => UNLOCK_SOL[level][f] === sol && sol > 1);
}
