import type { Gauges } from "./types";

export const GAUGE_CAP = 10;

export const START_GAUGES: Gauges = { power: 6, supplies: 9, dose: 0, science: 0 };

/** Adds the effect to the gauges. Power and supplies stay between 0 and the cap; dose and science never go below 0. */
export function applyEffects(gauges: Gauges, effects: Partial<Gauges>): Gauges {
  const clamp = (v: number) => Math.max(0, Math.min(GAUGE_CAP, v));
  return {
    power: clamp(gauges.power + (effects.power ?? 0)),
    supplies: clamp(gauges.supplies + (effects.supplies ?? 0)),
    dose: Math.max(0, gauges.dose + (effects.dose ?? 0)),
    science: Math.max(0, gauges.science + (effects.science ?? 0)),
  };
}
