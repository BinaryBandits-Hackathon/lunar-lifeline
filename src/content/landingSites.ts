import type { Flag, LandingSite, Level, SiteId } from "../engine/types";

// First-pass numbers from docs/design/01-opening-sequence.md, to be checked by the balance bots.
export const LANDING_SITES: LandingSite[] = [
  {
    id: "plains",
    name: "Flat plains",
    pitch: "Smooth ground, so the landing is safe. But the ice is far away.",
    levels: ["cadet", "commander"],
    effects: { supplies: -1 },
    flags: ["FAR_FROM_ICE"],
    lesson: "A safe choice now can cost you later.",
  },
  {
    id: "iceValley",
    name: "Ice valley",
    pitch: "Water ice nearby! But it's rocky, so the landing will be bumpy.",
    levels: ["cadet", "commander"],
    effects: { power: -3 },
    flags: ["NEAR_ICE", "PANELS_DAMAGED"],
    lesson: "Water is precious, and every risk has a price.",
  },
  {
    id: "holdOrbit",
    name: "Wait in orbit",
    pitch: "Circle Mars until the storm clears, then land at the ice.",
    levels: ["commander"],
    effects: { supplies: -2, dose: 2 },
    flags: ["NEAR_ICE"],
    lesson: "Waiting costs supplies, and space has more radiation than the ground on Mars.",
  },
];

export function getSite(id: SiteId): LandingSite {
  const site = LANDING_SITES.find((s) => s.id === id);
  if (!site) throw new Error(`Unknown landing site: ${id}`);
  return site;
}

export function sitesForLevel(level: Level): LandingSite[] {
  return LANDING_SITES.filter((s) => s.levels.includes(level));
}

export const FLAG_TEXT: Record<Flag, { label: string; good: boolean }> = {
  NEAR_ICE: { label: "Ice nearby: more water later", good: true },
  FAR_FROM_ICE: { label: "Ice far away: water costs more later", good: false },
  PANELS_DAMAGED: { label: "Bumpy: 2 solar panels crack", good: false },
  SHELTER_BUILT: { label: "Soil on the roof blocks radiation", good: true },
  SHELTER_STOCKED: { label: "Shelter stocked with food and water", good: true },
  SHELTERED: { label: "Crew in the shelter", good: true },
  DUSTY_PANELS: { label: "Dusty panels: 1 fewer block tomorrow", good: false },
};
