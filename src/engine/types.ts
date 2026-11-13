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
  | "sol1";

export type GaugeId = "power" | "supplies" | "dose" | "science";
export type Gauges = Record<GaugeId, number>;

export type Flag = "PANELS_DAMAGED" | "NEAR_ICE" | "FAR_FROM_ICE";

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
  | { type: "BEGIN_SOL_1" }
  | { type: "SET_SETTING"; key: keyof Settings; value: boolean }
  | { type: "RESTART" };
