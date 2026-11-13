export type RoleId = "engineer" | "doctor" | "scientist";
export type SiteId = "plains" | "iceValley" | "holdOrbit";
export type Level = "cadet" | "commander";

export type Stage =
  | "title"
  | "academy"
  | "badge"
  | "approach"
  | "alarm"
  | "briefing"
  | "landingChoice"
  | "descent"
  | "touchdown"
  | "damageReport"
  | "simReady"
  | "sim"
  | "board"
  | "card"
  | "result"
  | "ending";

export type GaugeId = "power" | "supplies" | "dose" | "science";
export type Gauges = Record<GaugeId, number>;

export type Flag =
  // from the landing
  | "PANELS_DAMAGED"
  | "NEAR_ICE"
  | "FAR_FROM_ICE"
  // set by choices on the base
  | "SHELTER_BUILT"
  | "SHELTER_STOCKED"
  | "SHELTERED"
  | "DUSTY_PANELS";

export type Perk =
  | { kind: "repairDiscount"; power: number }
  | { kind: "shelterDiscount"; supplies: number }
  | { kind: "scienceBonus"; science: number };

export type IconName =
  | GaugeId
  | "wrench" | "medical" | "flask" | "speaker" | "speakerOff" | "home" | "rocket"
  | "academy" | "pin" | "replay" | "next" | "back" | "check"
  | "water" | "strength" | "paths" | "astronaut";

export interface Role {
  id: RoleId;
  name: string;
  icon: IconName;
  oneLiner: string;
  perk: Perk;
  perkText: string;
  fact: string;
}

export interface LandingSite {
  id: SiteId;
  name: string;
  pitch: string;
  levels: Level[];
  effects: Partial<Gauges>;
  flags: Flag[];
  lesson: string;
}

export type Speaker = "pip" | "earth" | "narrator";
export type Mood = "calm" | "alert" | "happy";

export interface DialogueLine {
  speaker: Speaker;
  text: string;
  mood?: Mood;
}

export interface Settings {
  readAloud: boolean;
  reduceMotion: boolean;
  sound: boolean;
}

export interface Player {
  name: string;
  role: RoleId | null;
}

export interface GameState {
  stage: Stage;
  level: Level;
  player: Player;
  /** Site the player is looking at on the map, before confirming. */
  pendingSite: SiteId | null;
  /** Site the crew actually landed at. */
  site: SiteId | null;
  gauges: Gauges;
  flags: Flag[];
  /** Index into the dialogue lines of the current stage. */
  lineIndex: number;
  settings: Settings;
  seenIntro: boolean;
  /** The base game, from Sol 1 on. Null during the opening. */
  base: BaseState | null;
  /** The base simulation. Null until it starts. */
  sim: import("../sim/types").SimState | null;
}

// ---------- base game ----------

export type System = "habitat" | "greenhouse" | "shield";
export type Allocation = Record<System, number>;

export type Tone = "good" | "bad" | "info";
export interface LogLine {
  text: string;
  tone: Tone;
}

export type StormKind = "solar" | "dust";

/** A real solar storm from NASA DONKI (src/data/solar-storms.json). */
export interface StormRecord {
  id: string;
  start: string;
  maxKp: number;
  link: string;
}

export interface StormPlan {
  sol: number;
  kind: StormKind;
  /** Radiation a solar storm adds before any protection. */
  strength: number;
  record: StormRecord | null;
}

export type OptionTag = "repair" | "shelter" | "research" | "outside";

export interface CardOption {
  label: string;
  effects: Partial<Gauges>;
  /** Extra growth for the greenhouse crop (can be negative). */
  growth?: number;
  /** What happened, shown on the result screen. */
  outcome: string;
  note?: string;
  /** Only offered at Commander level. */
  commander?: boolean;
  requires?: Flag[];
  excludes?: Flag[];
  sets?: Flag[];
  clears?: Flag[];
  tags?: OptionTag[];
  /** Effect that arrives on a later sol. */
  later?: { inSols: number; effects: Partial<Gauges>; text: string };
}

export interface Card {
  id: string;
  title: string;
  text: string;
  /** Pool cards are drawn at random; fixed cards are placed by the engine. */
  kind: "pool" | "fixed";
  requires?: Flag[];
  options: CardOption[];
  teaches: string;
  real: string;
}

export interface Delayed {
  sol: number;
  effects: Partial<Gauges>;
  text: string;
}

export type EndingType = "commander" | "safe" | "grounded" | "early";
export interface Ending {
  type: EndingType;
  stars: 0 | 1 | 2 | 3;
  sol: number;
}

export interface SolRecord {
  sol: number;
  lines: LogLine[];
  gauges: Gauges;
}

export interface BaseState {
  sol: number;
  totalSols: number;
  scienceGoal: number;
  /** Seeded random state, so a run can be replayed and tested. */
  rng: number;
  storm: StormPlan;
  /** Blocks the panels make this sol. */
  production: number;
  allocation: Allocation;
  /** Greenhouse crop progress toward a harvest. */
  growth: number;
  cardId: string;
  seen: string[];
  delayed: Delayed[];
  /** News at the start of the sol. */
  morning: LogLine[];
  /** What happened at the end of the sol. */
  today: LogLine[];
  history: SolRecord[];
  ending: Ending | null;
}

/** The part of the state kept on this device between visits. */
export interface SavedProgress {
  level: Level;
  player: Player;
  settings: Settings;
  seenIntro: boolean;
}

export type Action =
  | { type: "START" }
  | { type: "SKIP_INTRO" }
  | { type: "OPEN_ACADEMY" }
  | { type: "BACK_TO_TITLE" }
  | { type: "SET_LEVEL"; level: Level }
  | { type: "SET_NAME"; name: string }
  | { type: "PICK_ROLE"; role: RoleId }
  | { type: "NEXT" }
  | { type: "PICK_SITE"; site: SiteId }
  | { type: "CONFIRM_SITE" }
  | { type: "BEGIN_SOL_1"; seed?: number }
  | { type: "START_SIMULATION" }
  | { type: "BEGIN_SIM"; seed?: number }
  | { type: "SIM_ASSIGN"; crewId: string; task: import("../sim/types").TaskId }
  | { type: "SIM_TOGGLE"; machine: import("../sim/types").MachineId }
  | { type: "SIM_PLOT"; plot: number; crop: import("../sim/types").CropId | null }
  | { type: "SIM_EVENT"; index: number }
  | { type: "SIM_EVA_SITE"; site: string | null }
  | { type: "SIM_DISMISS_UNLOCKS" }
  | { type: "SIM_RUN" }
  | { type: "SIM_NEXT" }
  | { type: "ADD_BLOCK"; system: System }
  | { type: "REMOVE_BLOCK"; system: System }
  | { type: "CONFIRM_BOARD" }
  | { type: "CHOOSE_OPTION"; index: number }
  | { type: "NEXT_SOL" }
  | { type: "REPLAY" }
  | { type: "SET_SETTING"; key: keyof Settings; value: boolean }
  | { type: "RESTART" };
