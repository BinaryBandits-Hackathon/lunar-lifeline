import { GAUGE_INFO } from "../content/script";
import type { GaugeId, Gauges as GaugeValues } from "../engine/types";
import { Icon } from "./Icon";

const ORDER: GaugeId[] = ["power", "supplies", "dose", "science"];

interface Props {
  gauges: GaugeValues;
  selected?: GaugeId | null;
  seen?: Set<GaugeId>;
  onSelect?: (id: GaugeId) => void;
}

/** Instrument readouts: label, value, and a segmented bar (one segment per unit). */
export function Gauges({ gauges, selected, seen, onSelect }: Props) {
  return (
    <div className="gauges">
      {ORDER.map((id) => {
        const info = GAUGE_INFO[id];
        const value = gauges[id];
        const low = (id === "power" || id === "supplies") && value <= 3;
        const high = id === "dose" && value >= info.max - 2;
        const warn = low || high;
        const content = (
          <>
            <span className="gauge-top">
              <Icon name={info.icon} size={18} />
              <span className="gauge-label">{info.label}</span>
              {warn && <span className="tag tag-warn">{low ? "Low" : "High"}</span>}
            </span>
            <span className="gauge-value">
              {value}
              <small>/{info.max}</small>
            </span>
            <span className={`segments${warn ? " warn" : ""}`} aria-hidden="true">
              {Array.from({ length: info.max }, (_, i) => (
                <i key={i} className={i < value ? "on" : ""} />
              ))}
            </span>
          </>
        );
        const label = `${info.label}: ${value} out of ${info.max}${warn ? (low ? ", low" : ", high") : ""}`;
        if (!onSelect) return <div key={id} className="gauge" aria-label={label}>{content}</div>;
        return (
          <button
            key={id}
            type="button"
            className={`gauge gauge-btn${selected === id ? " selected" : ""}${seen?.has(id) ? " seen" : ""}`}
            onClick={() => onSelect(id)}
            aria-pressed={selected === id}
            aria-label={label}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
