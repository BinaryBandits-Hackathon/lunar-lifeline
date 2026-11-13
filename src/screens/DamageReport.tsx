import { useState } from "react";
import { getSite } from "../content/landingSites";
import { GAUGE_INFO } from "../content/script";
import { currentLine, fillText, isLastLine } from "../engine/flow";
import type { GaugeId } from "../engine/types";
import { speak } from "../services/speech";
import { BaseScene } from "../ui/BaseScene";
import { EffectChips } from "../ui/Chips";
import { Dialogue } from "../ui/Dialogue";
import { Gauges } from "../ui/Gauges";
import type { ScreenProps } from "../ui/screen";

export function DamageReport({ state, dispatch }: ScreenProps) {
  const [selected, setSelected] = useState<GaugeId | null>(null);
  const [seen, setSeen] = useState<Set<GaugeId>>(new Set());
  const line = currentLine(state);
  const site = state.site ? getSite(state.site) : null;
  const dialogueDone = isLastLine(state);

  const select = (id: GaugeId) => {
    setSelected(id);
    setSeen((s) => new Set(s).add(id));
    if (state.settings.readAloud) speak(GAUGE_INFO[id].explain);
  };

  const text = selected ? GAUGE_INFO[selected].explain : line ? fillText(line.text, state) : "";
  const mood = selected ? "calm" : line?.mood;

  return (
    <main className="screen report-screen">
      <h2 className="screen-title">Landing report{site ? `: ${site.name}` : ""}</h2>
      <div className="report-layout">
        <BaseScene flags={state.flags} />
        <aside className="report-side">
          {site && (
            <div className="report-card">
              <span className="eyebrow">What the landing did</span>
              <EffectChips effects={site.effects} flags={site.flags} />
              <p className="report-lesson">{site.lesson}</p>
            </div>
          )}
          <Gauges gauges={state.gauges} selected={selected} seen={seen} onSelect={dialogueDone ? select : undefined} />
        </aside>
      </div>
      <Dialogue
        text={text}
        mood={mood}
        form="rover"
        readAloud={state.settings.readAloud}
        onNext={dialogueDone ? () => dispatch({ type: "BEGIN_SOL_1" }) : () => dispatch({ type: "NEXT" })}
        nextLabel={dialogueDone ? "Begin Sol 1" : "Next"}
      >
        {dialogueDone && seen.size < 4 && <span className="hint">Tap the meters ({seen.size}/4)</span>}
      </Dialogue>
    </main>
  );
}
