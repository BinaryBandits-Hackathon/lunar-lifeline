import { canSkipIntro } from "../engine/flow";
import { canSpeak } from "../services/speech";
import { Pip } from "../ui/Pip";
import type { ScreenProps } from "../ui/screen";
import { LevelPicker } from "./Badge";

export function Title({ state, dispatch }: ScreenProps) {
  const { settings } = state;
  return (
    <main className="screen title-screen">
      <div className="title-planet" aria-hidden="true" />
      <div className="title-card">
        <p className="eyebrow">NASA Space Apps 2026</p>
        <h1>
          Junior Astronaut
          <br />
          Mission Trainer
        </h1>
        <p className="title-sub">Fly to Mars, land your crew, and keep your base alive.</p>
        <div className="title-pip">
          <Pip mood="happy" size={56} />
          <span>Hi! I'm Pip. Ready to train?</span>
        </div>

        <LevelPicker level={state.level} onPick={(level) => dispatch({ type: "SET_LEVEL", level })} />

        <div className="title-actions">
          <button type="button" className="btn btn-primary btn-big" onClick={() => dispatch({ type: "START" })}>
            🚀 Start mission
          </button>
          {canSkipIntro(state) && (
            <button type="button" className="btn btn-secondary" onClick={() => dispatch({ type: "SKIP_INTRO" })}>
              Skip to landing as {state.player.name}
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "OPEN_ACADEMY" })}>
            🎓 Astronaut Academy
          </button>
        </div>

        <fieldset className="settings">
          <legend>Settings</legend>
          <label>
            <input
              type="checkbox"
              checked={settings.readAloud}
              disabled={!canSpeak()}
              onChange={(e) => dispatch({ type: "SET_SETTING", key: "readAloud", value: e.target.checked })}
            />
            Read aloud{!canSpeak() && " (not available in this browser)"}
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => dispatch({ type: "SET_SETTING", key: "reduceMotion", value: e.target.checked })}
            />
            Reduce motion (no shaking)
          </label>
        </fieldset>
      </div>
    </main>
  );
}
