import { canSkipIntro } from "../engine/flow";
import { canSpeak } from "../services/speech";
import { Icon } from "../ui/Icon";
import { Pip } from "../ui/Pip";
import type { ScreenProps } from "../ui/screen";
import { LevelPicker } from "./Badge";
import { RankCard } from "./Academy";

export function Title({ state, dispatch }: ScreenProps) {
  const { settings } = state;
  return (
    <main className="screen title-screen">
      <div className="title-planet" aria-hidden="true" />
      <div className="title-card panel">
        <div className="panel-head">
          <span>NASA Space Apps 2026</span>
          <span className="mono">Mission: Mars Base 1</span>
        </div>
        <div className="title-body">
          <h1>
            Junior Astronaut
            <br />
            <span className="accent">Mission Trainer</span>
          </h1>
          <p className="title-sub">Fly to Mars, land your crew, and keep your base alive.</p>

          <div className="title-pip">
            <Pip mood="happy" size={48} />
            <p>
              <strong>Hi, I'm Pip.</strong> I'll be your ship's computer. Ready to train?
            </p>
          </div>

          {state.career.points > 0 || state.career.missions.length > 0 ? <RankCard points={state.career.points} compact /> : null}

          <div className="field">
            <span className="label">Level</span>
            <LevelPicker level={state.level} onPick={(level) => dispatch({ type: "SET_LEVEL", level })} />
          </div>

          <div className="title-actions">
            <button type="button" className="btn btn-primary btn-big" onClick={() => dispatch({ type: "START" })}>
              <Icon name="rocket" />
              Start mission
            </button>
            {canSkipIntro(state) && (
              <button type="button" className="btn btn-secondary" onClick={() => dispatch({ type: "SKIP_INTRO" })}>
                Skip to landing as {state.player.name}
                <Icon name="next" size={18} />
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "OPEN_ACADEMY" })}>
              <Icon name="academy" />
              Astronaut Academy
            </button>
          </div>
        </div>

        <fieldset className="settings">
          <legend className="label">Settings</legend>
          <label className="toggle">
            <input
              id="setting-read-aloud"
              type="checkbox"
              checked={settings.readAloud}
              disabled={!canSpeak()}
              onChange={(e) => dispatch({ type: "SET_SETTING", key: "readAloud", value: e.target.checked })}
            />
            <span>Read to me{!canSpeak() && " (not available in this browser)"}</span>
          </label>
          <label className="toggle">
            <input
              id="setting-reduce-motion"
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => dispatch({ type: "SET_SETTING", key: "reduceMotion", value: e.target.checked })}
            />
            <span>Reduce motion</span>
          </label>
        </fieldset>
      </div>
    </main>
  );
}
