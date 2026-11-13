import type { IconName, Level, RoleId, StormRecord } from "../engine/types";

export type ResourceId = "battery" | "oxygen" | "co2" | "water" | "food" | "fuel" | "science";
export type Resources = Record<ResourceId, number>;

export type Phase = "morning" | "day" | "evening" | "night";

export type MachineId = "heaters" | "scrubber" | "oxygenMaker" | "recycler" | "greenhouseLights" | "fuelPlant" | "roverCharger";

export type TaskId = "farm" | "mine" | "repair" | "research" | "exercise" | "rest" | "shelter" | "eva";

export type CropId = "lettuce" | "potato";

export interface CrewMember {
  id: string;
  name: string;
  role: RoleId;
  isPlayer: boolean;
  energy: number;
  health: number;
  /** Radiation dose in mSv, counting the trip to Mars. */
  dose: number;
  task: TaskId;
}

export interface Plot {
  crop: CropId | null;
  growth: number;
  /** Crop to plant here when someone farms. */
  plan: CropId | null;
}

export interface LedgerEntry {
  res: ResourceId | "energy" | "health";
  amount: number;
  cause: string;
}

export interface PhaseSnapshot {
  phase: Phase;
  res: Resources;
  /** Machines that could not run this phase for lack of power. */
  unpowered: MachineId[];
}

export interface SolReport {
  sol: number;
  ledger: LedgerEntry[];
  notes: { text: string; tone: "good" | "bad" | "info" }[];
  timeline: PhaseSnapshot[];
}

export type SimEndingType = "commander" | "survived" | "emergency" | "grounded";
export interface SimEnding {
  type: SimEndingType;
  stars: 0 | 1 | 2 | 3;
  sol: number;
  reason: string;
}

export interface SimStorm {
  sol: number;
  kind: "solar" | "dust";
  /** Solar storm strength from the real record (Kp), or the dust storm length in sols. */
  strength: number;
  record: StormRecord | null;
}

export interface SimState {
  /** Seeded random state, so a mission can be replayed and tested. */
  rng: number;
  storm: SimStorm;
  /** Panels are dusty after a dust storm or dust devil until someone cleans them. */
  dusty: boolean;
  broken: MachineId[];
  leak: boolean;
  /** A surprise waiting for the player to choose, shown at the start of the sol. */
  eventId: string | null;
  eventsSeen: string[];
  /** Extra science from an Earth experiment if someone researches today. */
  bonusScience: number;
  /** Crew who must rest today (from an event). */
  mustRest: string[];
  /** The rover: its own battery (0-100) and whether it needs a repair. */
  rover: { battery: number; broken: boolean };
  /** Systems that opened at the start of this sol, shown once. */
  newUnlocks: import("./unlocks").Feature[];
  /** Where today's spacewalk goes, or null. */
  evaSite: string | null;
  /** Sites already explored (a second visit gives little new science). */
  visited: string[];
  /** What the player chose for this sol's surprise, shown in the report. */
  eventResult: string | null;
  sol: number;
  totalSols: number;
  level: Level;
  mode: "plan" | "report" | "ended";
  res: Resources;
  machines: Record<MachineId, boolean>;
  panelsCracked: boolean;
  nearIce: boolean;
  crew: CrewMember[];
  plots: Plot[];
  goals: { fuel: number; science: number };
  report: SolReport | null;
  history: SolReport[];
  ending: SimEnding | null;
}

export interface MachineInfo {
  id: MachineId;
  name: string;
  icon: IconName;
  /** Battery points used in each phase while switched on. */
  use: Record<Phase, number>;
  canSwitchOff: boolean;
  what: string;
}

export interface TaskInfo {
  id: TaskId;
  name: string;
  icon: IconName;
  energy: number;
  what: string;
}

export interface CropInfo {
  id: CropId;
  name: string;
  sols: number;
  meals: number;
}
