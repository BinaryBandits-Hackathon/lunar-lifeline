import type { Level, RoleId, SavedProgress } from "../engine/types";

// Saved in this browser only. Nothing here is ever sent to a server:
// the players are children, so their names stay on their own device.
const KEY = "jamt:progress:v1";

const LEVELS: Level[] = ["cadet", "commander"];
const ROLE_IDS: RoleId[] = ["engineer", "doctor", "scientist"];

export function loadProgress(): Partial<SavedProgress> | undefined {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return undefined;
    const d = JSON.parse(raw) as Partial<SavedProgress>;
    const out: Partial<SavedProgress> = {};
    if (d.level && LEVELS.includes(d.level)) out.level = d.level;
    if (d.player && typeof d.player.name === "string") {
      out.player = {
        name: d.player.name.slice(0, 16),
        role: d.player.role && ROLE_IDS.includes(d.player.role) ? d.player.role : null,
      };
    }
    if (d.settings && typeof d.settings === "object") {
      out.settings = {
        readAloud: d.settings.readAloud === true,
        reduceMotion: d.settings.reduceMotion === true,
        sound: d.settings.sound !== false,
      };
    }
    if (typeof d.seenIntro === "boolean") out.seenIntro = d.seenIntro;
    return out;
  } catch {
    return undefined;
  }
}

export function saveProgress(p: SavedProgress): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage blocked (private window, settings). The game still works without it.
  }
}

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}
