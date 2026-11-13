import { RADIO_DELAY_MIN } from "../content/script";
import { currentLine, fillText } from "../engine/flow";
import { Dialogue } from "../ui/Dialogue";
import { useAutoAdvance, type ScreenProps } from "../ui/screen";

/** Approach, alarm and briefing all happen in the cockpit (the only first-person view). */
export function Cockpit({ state, dispatch }: ScreenProps) {
  const line = currentLine(state);
  const alarm = state.stage === "alarm";
  const storm = state.stage !== "approach";
  // Mars grows in the window as the ship gets closer.
  const marsScale = state.stage === "approach" ? 0.75 + state.lineIndex * 0.12 : 1.05;

  useAutoAdvance(`${state.stage}-${state.lineIndex}`, 3200, dispatch, alarm);

  return (
    <main className={`screen cockpit${alarm ? " is-alarm" : ""}`}>
      <div className="cockpit-window" aria-hidden="true">
        <div className="stars" />
        <div className="window-mars" style={{ transform: `translate(-50%, -50%) scale(${marsScale})` }}>
          {storm && <div className="window-storm" />}
        </div>
        <div className="window-frame" />
      </div>
      <div className="cockpit-panel" aria-hidden="true">
        <div className="panel-screen">
          <span>DIST TO MARS</span>
          <strong>{state.stage === "approach" ? (state.lineIndex === 0 ? "48,000 km" : "21,000 km") : "6,000 km"}</strong>
        </div>
        <div className={`panel-screen${storm ? " panel-warn" : ""}`}>
          <span>LANDING SITE</span>
          <strong>{storm ? "DUST STORM" : "CLEAR"}</strong>
        </div>
        <div className="panel-screen">
          <span>EARTH RADIO</span>
          <strong>{RADIO_DELAY_MIN} min delay</strong>
        </div>
        <div className="panel-lights">
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} className={alarm ? "red" : i % 3 === 0 ? "teal" : "amber"} />
          ))}
        </div>
      </div>
      {alarm && <div className="alarm-overlay" aria-hidden="true" />}
      {line && (
        <Dialogue
          text={fillText(line.text, state)}
          mood={line.mood}
          readAloud={state.settings.readAloud}
          onNext={() => dispatch({ type: "NEXT" })}
          nextLabel={state.stage === "briefing" && state.lineIndex === 2 ? "Open the map" : "Next"}
        />
      )}
    </main>
  );
}
