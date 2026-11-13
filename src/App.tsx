import { useEffect, useReducer } from "react";
import { createInitialState, currentLine, fillText, next, toSaved } from "./engine/flow";
import type { GameState, Stage } from "./engine/types";
import { Icon } from "./ui/Icon";
import { speak, stopSpeaking } from "./services/speech";
import { loadProgress, prefersReducedMotion, saveProgress } from "./services/storage";
import { Academy } from "./screens/Academy";
import { Badge } from "./screens/Badge";
import { Cockpit } from "./screens/Cockpit";
import { DamageReport } from "./screens/DamageReport";
import { Descent } from "./screens/Descent";
import { LandingMap } from "./screens/LandingMap";
import { Sol1 } from "./screens/Sol1";
import { Title } from "./screens/Title";

const PHASES: { label: string; stages: Stage[] }[] = [
  { label: "Badge", stages: ["badge"] },
  { label: "Approach", stages: ["approach", "alarm", "briefing"] },
  { label: "Landing", stages: ["landingChoice", "descent", "touchdown"] },
  { label: "Base", stages: ["damageReport", "sol1"] },
];

function init(): GameState {
  const saved = loadProgress();
  const state = createInitialState(saved);
  // First visit: follow the device's reduced-motion setting.
  if (!saved?.settings) state.settings.reduceMotion = prefersReducedMotion();
  return state;
}

export function App() {
  const [state, dispatch] = useReducer(next, undefined, init);

  useEffect(() => {
    saveProgress(toSaved(state));
  }, [state]);

  // Read each new line of Pip's dialogue aloud.
  const line = currentLine(state);
  const spoken = line ? fillText(line.text, state) : null;
  useEffect(() => {
    if (spoken && state.settings.readAloud) speak(spoken);
  }, [spoken, state.stage, state.lineIndex, state.settings.readAloud]);

  useEffect(() => {
    if (!state.settings.readAloud) stopSpeaking();
  }, [state.settings.readAloud]);

  const props = { state, dispatch };
  let screen;
  switch (state.stage) {
    case "title":
      screen = <Title {...props} />;
      break;
    case "academy":
      screen = <Academy {...props} />;
      break;
    case "badge":
      screen = <Badge {...props} />;
      break;
    case "approach":
    case "alarm":
    case "briefing":
      screen = <Cockpit {...props} />;
      break;
    case "landingChoice":
      screen = <LandingMap {...props} />;
      break;
    case "descent":
    case "touchdown":
      screen = <Descent {...props} />;
      break;
    case "damageReport":
      screen = <DamageReport {...props} />;
      break;
    case "sol1":
      screen = <Sol1 {...props} />;
      break;
  }

  const phase = PHASES.findIndex((p) => p.stages.includes(state.stage));

  return (
    <div className={`app${state.settings.reduceMotion ? " reduce-motion" : ""}`}>
      {state.stage !== "title" && (
        <nav className="topbar" aria-label="Game controls">
          <span className="topbar-name">
            <Icon name="astronaut" size={20} />
            {state.player.name || "Junior Astronaut"}
          </span>
          <ol className="phases" aria-label="Mission progress">
            {PHASES.map((p, i) => (
              <li key={p.label} className={i < phase ? "done" : i === phase ? "now" : ""} aria-current={i === phase ? "step" : undefined}>
                {p.label}
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="btn btn-icon"
            aria-pressed={state.settings.readAloud}
            aria-label={state.settings.readAloud ? "Turn voice off" : "Turn voice on"}
            title={state.settings.readAloud ? "Voice on" : "Voice off"}
            onClick={() => dispatch({ type: "SET_SETTING", key: "readAloud", value: !state.settings.readAloud })}
          >
            <Icon name={state.settings.readAloud ? "speaker" : "speakerOff"} />
          </button>
          <button type="button" className="btn btn-icon" aria-label="Back to start screen" title="Start screen" onClick={() => dispatch({ type: "RESTART" })}>
            <Icon name="home" />
          </button>
        </nav>
      )}
      {screen}
    </div>
  );
}
