import { PRESET_NAMES, ROLES, getRole } from "../content/roles";
import { NAME_MAX } from "../engine/flow";
import type { Level } from "../engine/types";
import type { ScreenProps } from "../ui/screen";

export function LevelPicker({ level, onPick }: { level: Level; onPick: (l: Level) => void }) {
  return (
    <div className="level-picker" role="group" aria-label="Difficulty">
      <button type="button" aria-pressed={level === "cadet"} onClick={() => onPick("cadet")}>
        <strong>Cadet</strong>
        <span>Ages 7–9</span>
      </button>
      <button type="button" aria-pressed={level === "commander"} onClick={() => onPick("commander")}>
        <strong>Commander</strong>
        <span>Ages 10–12</span>
      </button>
    </div>
  );
}

export function Badge({ state, dispatch }: ScreenProps) {
  const { name, role } = state.player;
  const ready = name.trim() !== "" && role !== null;
  const chosen = role ? getRole(role) : null;

  return (
    <main className="screen badge-screen">
      <div className="badge-layout">
        <section className="badge-form" aria-labelledby="badge-h">
          <h2 id="badge-h">Make your astronaut badge</h2>

          <div className="field">
            <span className="field-label">1. Pick a name</span>
            <div className="name-presets">
              {PRESET_NAMES.map((n) => (
                <button
                  key={n}
                  type="button"
                  className="pill"
                  aria-pressed={name === n}
                  onClick={() => dispatch({ type: "SET_NAME", name: n })}
                >
                  {n}
                </button>
              ))}
            </div>
            <label className="name-input">
              <span>or type your own</span>
              <input
                id="astronaut-name"
                type="text"
                value={name}
                maxLength={NAME_MAX}
                autoComplete="off"
                placeholder="Your name"
                onChange={(e) => dispatch({ type: "SET_NAME", name: e.target.value })}
              />
            </label>
          </div>

          <div className="field">
            <span className="field-label">2. Pick your job</span>
            <div className="roles">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="role-card"
                  aria-pressed={role === r.id}
                  onClick={() => dispatch({ type: "PICK_ROLE", role: r.id })}
                >
                  <span className="role-icon" aria-hidden="true">{r.icon}</span>
                  <strong>{r.name}</strong>
                  <span>{r.oneLiner}</span>
                  <span className="role-perk">{r.perkText}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="field-label">3. Pick your level</span>
            <LevelPicker level={state.level} onPick={(level) => dispatch({ type: "SET_LEVEL", level })} />
          </div>
        </section>

        <aside className="badge-preview" aria-label="Your badge">
          <div className="badge-card">
            <span className="badge-agency">Mars Base 1 · Crew badge</span>
            <span className="badge-photo" aria-hidden="true">{chosen?.icon ?? "👩‍🚀"}</span>
            <strong className="badge-name">{name.trim() || "Your name"}</strong>
            <span className="badge-role">{chosen?.name ?? "Pick a job"}</span>
            <span className="badge-level">{state.level === "cadet" ? "Cadet" : "Commander"}</span>
          </div>
          {chosen && <p className="badge-fact">Real astronauts: {chosen.fact}</p>}
          <div className="badge-actions">
            <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "BACK_TO_TITLE" })}>
              ◀ Back
            </button>
            <button
              type="button"
              className="btn btn-primary btn-big"
              disabled={!ready}
              onClick={() => dispatch({ type: "NEXT" })}
            >
              Board the ship ▶
            </button>
          </div>
          {!ready && <p className="hint">Pick a name and a job to board.</p>}
        </aside>
      </div>
    </main>
  );
}
