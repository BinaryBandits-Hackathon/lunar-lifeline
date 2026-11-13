import type { Level } from "../engine/types";

// All the numbers that set how hard the base game is. Change them here and
// run `npm test`: the balance bots check that the game is still fair.
export const RULES = {
  /** Blocks the panels make on a clear sol. */
  production: 5,
  /** Fewer blocks while panels are cracked. */
  damagedPenalty: 2,
  /** Fewer blocks the sol after a dust devil, if the panels weren't cleaned. */
  dustyPenalty: 1,
  /** Blocks the panels make during a dust storm. */
  dustStormProduction: 1,
  /** Blocks the habitat needs each sol for air and water. */
  habitatNeed: 2,
  /** Powered greenhouse sols needed for a harvest. */
  growTo: 3,
  /** Supplies a harvest gives. */
  harvest: 3,
  /** Supplies the crew uses every sol. */
  upkeep: 1,
  /** Most power the battery can hold. */
  batteryCap: 10,
  /** Radiation blocked by a soil-covered roof. */
  shelterBuiltProtection: 2,
  /** Radiation blocked by spending the storm in the shelter. */
  shelteredProtection: 2,
  /** Radiation limit: at or above this, the crew is grounded. */
  doseLimit: 7,
  /** Solar storm strength when there is no real record to use. */
  defaultSolarStrength: 4,
  /** Chance a run's storm is a solar storm (the rest are dust storms). */
  solarChance: 0.6,
} as const;

export const LEVEL_RULES: Record<
  Level,
  { sols: number; scienceGoal: number; stormSols: [number, number]; bonusSupplies: number }
> = {
  // Cadets get a supply cushion so a young player can learn without running out.
  cadet: { sols: 7, scienceGoal: 4, stormSols: [4, 4], bonusSupplies: 2 },
  commander: { sols: 10, scienceGoal: 6, stormSols: [4, 7], bonusSupplies: 0 },
};

/** Storm strength from the real storm's Kp (measured at Earth, 0 to 9). */
export function strengthFromKp(kp: number): number {
  if (kp >= 9) return 6;
  if (kp >= 8) return 5;
  if (kp >= 7) return 4;
  return 3;
}
