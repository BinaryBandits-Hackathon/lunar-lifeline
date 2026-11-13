import { FLAG_TEXT } from "../content/landingSites";
import { GAUGE_INFO } from "../content/script";
import type { Flag, GaugeId, Gauges } from "../engine/types";

/** Cost and gain chips for a choice. Dose going up is bad, everything else going up is good. */
export function EffectChips({ effects, flags = [] }: { effects: Partial<Gauges>; flags?: Flag[] }) {
  const items = (Object.keys(effects) as GaugeId[])
    .filter((k) => effects[k])
    .map((k) => {
      const v = effects[k]!;
      const good = k === "dose" ? v < 0 : v > 0;
      return (
        <span key={k} className={`chip ${good ? "good" : "bad"}`}>
          {GAUGE_INFO[k].icon} {GAUGE_INFO[k].label} {v > 0 ? "+" : "−"}
          {Math.abs(v)}
        </span>
      );
    });
  return (
    <span className="chips">
      {items}
      {flags.map((f) => (
        <span key={f} className={`chip ${FLAG_TEXT[f].good ? "good" : "bad"}`}>
          {FLAG_TEXT[f].label}
        </span>
      ))}
    </span>
  );
}
