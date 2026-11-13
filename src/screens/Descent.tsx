import { currentLine, fillText } from "../engine/flow";
import { Dialogue } from "../ui/Dialogue";
import { useAutoAdvance, type ScreenProps } from "../ui/screen";

const PHASES = ["heat", "chute", "rockets"] as const;

/** Descent (three steps) and touchdown. Real Mars landings run on their own, so the player only watches. */
export function Descent({ state, dispatch }: ScreenProps) {
  const line = currentLine(state);
  const touchdown = state.stage === "touchdown";
  const phase = touchdown ? "landed" : PHASES[Math.min(state.lineIndex, PHASES.length - 1)];

  useAutoAdvance(`${state.stage}-${state.lineIndex}`, touchdown ? 3000 : 3500, dispatch);

  return (
    <main className={`screen descent phase-${phase}`}>
      <div className="descent-sky" aria-hidden="true">
        <div className="lander">
          {phase === "heat" && <div className="heat-glow" />}
          {phase === "chute" && <div className="chute" />}
          <div className="capsule" />
          {phase === "rockets" && <div className="flames" />}
        </div>
        <div className="descent-ground" />
        {touchdown && <div className="dust-puff" />}
      </div>
      <ol className="descent-steps" aria-label="Landing steps">
        {["Heat shield", "Parachute", "Rockets", "Touchdown"].map((s, i) => {
          const at = touchdown ? 3 : state.lineIndex;
          return (
            <li key={s} className={i < at ? "done" : i === at ? "now" : ""}>
              {s}
            </li>
          );
        })}
      </ol>
      {line && (
        <Dialogue
          text={fillText(line.text, state)}
          mood={line.mood}
          readAloud={state.settings.readAloud}
          onNext={() => dispatch({ type: "NEXT" })}
        />
      )}
    </main>
  );
}
