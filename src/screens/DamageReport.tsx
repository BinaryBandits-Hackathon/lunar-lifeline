import { useMemo, useState } from "react";
import { getSite } from "../content/landingSites";
import { GROUPS, arrivalReadings, type Reading } from "../content/systems";
import { currentLine, fillText, isLastLine } from "../engine/flow";
import { speak } from "../services/speech";
import { BaseScene } from "../ui/BaseScene";
import { Dialogue } from "../ui/Dialogue";
import { Icon } from "../ui/Icon";
import type { ScreenProps } from "../ui/screen";

const STATUS_TEXT = { ok: "OK", watch: "Watch", low: "Low" } as const;

function format(r: Reading): string {
  return `${r.value}${r.unit === "%" || r.unit === "°C" ? "" : " "}${r.unit}`;
}

/** Bar fill for a reading; temperatures below zero fill toward the cold end. */
function fill(r: Reading): number {
  if (r.id === "tempOutside") return Math.min(100, (Math.abs(r.value) / 80) * 100);
  return Math.max(0, Math.min(100, (r.value / r.max) * 100));
}

/** Systems check after a safe landing: every reading on the base, explained. */
export function DamageReport({ state, dispatch }: ScreenProps) {
  const readings = useMemo(() => arrivalReadings(state), [state]);
  const [selected, setSelected] = useState<string | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const line = currentLine(state);
  const site = state.site ? getSite(state.site) : null;
  const dialogueDone = isLastLine(state);
  const picked = readings.find((r) => r.id === selected) ?? null;

  const select = (r: Reading) => {
    setSelected(r.id);
    setSeen((s) => new Set(s).add(r.id));
    if (state.settings.readAloud) speak(`${r.label}: ${format(r)}. ${r.explain}`);
  };

  const warnings = readings.filter((r) => r.status !== "ok").length;
  const text = picked ? `${picked.label}: ${format(picked)}. ${picked.explain}` : line ? fillText(line.text, state) : "";

  return (
    <main className="screen report-screen systems-screen">
      <header className="screen-head systems-head">
        <div>
          <span className="label">Sol 0 · Safe landing{site ? ` at ${site.name}` : ""}</span>
          <h2>Systems check</h2>
        </div>
        <span className="systems-summary mono">
          {readings.length} systems · {warnings} need watching · {seen.size}/{readings.length} checked
        </span>
      </header>

      <div className="systems-layout">
        <div className="panel scene-panel">
          <div className="panel-head">
            <span>Base camera</span>
            <span className="mono">Mars · Sol 0</span>
          </div>
          <BaseScene flags={state.flags} />
        </div>

        <div className="systems-grid">
          {GROUPS.map((g) => (
            <section key={g} className="panel system-group">
              <div className="panel-head">
                <span>{g}</span>
              </div>
              <div className="readings">
                {readings
                  .filter((r) => r.group === g)
                  .map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`reading status-${r.status}${selected === r.id ? " selected" : ""}${seen.has(r.id) ? " seen" : ""}`}
                      onClick={() => select(r)}
                      aria-pressed={selected === r.id}
                      aria-label={`${r.label}: ${format(r)}, ${STATUS_TEXT[r.status]}. ${r.short}`}
                    >
                      <span className="reading-top">
                        <Icon name={r.icon} size={16} />
                        <span className="reading-label">{r.label}</span>
                        <span className={`tag tag-${r.status}`}>{STATUS_TEXT[r.status]}</span>
                      </span>
                      <span className="reading-value">{format(r)}</span>
                      <span className="reading-bar" aria-hidden="true">
                        <i style={{ width: `${fill(r)}%` }} />
                      </span>
                      <span className="reading-short">{r.short}</span>
                    </button>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <Dialogue
        text={text}
        mood={picked ? (picked.status === "low" ? "alert" : "calm") : line?.mood}
        form="rover"
        readAloud={state.settings.readAloud}
        onNext={dialogueDone ? () => dispatch({ type: "START_SIMULATION" }) : () => dispatch({ type: "NEXT" })}
        nextLabel={dialogueDone ? "Start simulation" : "Next"}
      >
        {dialogueDone && seen.size < readings.length && <span className="hint">Tap any reading to learn about it</span>}
      </Dialogue>
    </main>
  );
}
