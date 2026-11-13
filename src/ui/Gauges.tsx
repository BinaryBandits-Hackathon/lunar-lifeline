import { GAUGE_INFO } from "../content/script";
import type { GaugeId, Gauges as GaugeValues } from "../engine/types";

const ORDER: GaugeId[] = ["power", "supplies", "dose", "science"];

interface Props {
  gauges: GaugeValues;
  selected?: GaugeId | null;
  seen?: Set<GaugeId>;
  onSelect?: (id: GaugeId) => void;
}

export function Gauges({ gauges, selected, seen, onSelect }: Props) {
  return (
    <div className="gauges">
      {ORDER.map((id) => {
        const info = GAUGE_INFO[id];
        const value = gauges[id];
        const pct = Math.min(100, (100 * value) / info.max);
        const low = (id === "power" || id === "supplies") && value <= 3;
        const high = id === "dose" && value >= info.max - 2;
        const content = (
          <>
            <span className="gauge-top">
              <span className="gauge-icon" aria-hidden="true">{info.icon}</span>
              <span className="gauge-label">{info.label}</span>
              <span className="gauge-value">
                {value}/{info.max}
              </span>
            </span>
            <span className="gauge-track">
              <span className={`gauge-fill gauge-${id}${low || high ? " warn" : ""}`} style={{ width: `${pct}%` }} />
            </span>
          </>
        );
        if (!onSelect) return <div key={id} className="gauge">{content}</div>;
        return (
          <button
            key={id}
            type="button"
            className={`gauge gauge-btn${selected === id ? " selected" : ""}${seen?.has(id) ? " seen" : ""}`}
            onClick={() => onSelect(id)}
            aria-pressed={selected === id}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
