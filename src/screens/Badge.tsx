import { PRESET_NAMES, ROLES, getRole } from "../content/roles";
import { NAME_MAX } from "../engine/flow";
import type { Level } from "../engine/types";
import { Icon } from "../ui/Icon";
import type { ScreenProps } from "../ui/screen";

export function LevelPicker({ level, onPick }: { level: Level; onPick: (l: Level) => void }) {
  return (
    <div className="segmented" role="group" aria-label="Level">
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
      <header className="screen-head">
        <span className="label">Pre-flight</span>
        <h2>Make your crew badge</h2>
      </header>
      <div className="badge-layout">
        <div className="badge-form">
          <section className="panel">
            <div className="panel-head">
              <span>Step 1</span>
              <span>Your name</span>
            </div>
            <div className="panel-body">
              <div className="name-presets">
                {PRESET_NAMES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="option-pill"
                    aria-pressed={name === n}
                    onClick={() => dispatch({ type: "SET_NAME", name: n })}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <label className="name-input" htmlFor="astronaut-name">
                <span className="label">Or type your own</span>
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
          </section>

          <section className="panel">
            <div className="panel-head">
              <span>Step 2</span>
              <span>Your job</span>
            </div>
            <div className="panel-body roles">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="role-card"
                  aria-pressed={role === r.id}
                  onClick={() => dispatch({ type: "PICK_ROLE", role: r.id })}
                >
                  <span className="role-icon">
                    <Icon name={r.icon} size={26} />
                  </span>
                  <strong>{r.name}</strong>
                  <span className="role-line">{r.oneLiner}</span>
                  <span className="role-perk">{r.perkText}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <span>Step 3</span>
              <span>Your level</span>
            </div>
            <div className="panel-body">
              <LevelPicker level={state.level} onPick={(level) => dispatch({ type: "SET_LEVEL", level })} />
            </div>
          </section>
        </div>

        <aside className="badge-preview" aria-label="Your badge">
          <div className="badge-card">
            <div className="badge-top">
              <span>Mars Base 1</span>
              <span className="mono">Crew ID</span>
            </div>
            <div className="badge-photo">
              <Icon name={chosen ? chosen.icon : "astronaut"} size={52} />
            </div>
            <strong className="badge-name">{name.trim() || "Your name"}</strong>
            <dl className="badge-fields">
              <div>
                <dt>Job</dt>
                <dd>{chosen?.name ?? "—"}</dd>
              </div>
              <div>
                <dt>Level</dt>
                <dd>{state.level === "cadet" ? "Cadet" : "Commander"}</dd>
              </div>
              <div>
                <dt>Mission</dt>
                <dd>Mars Base 1</dd>
              </div>
            </dl>
            <div className="badge-stripe" aria-hidden="true" />
          </div>
          {chosen && (
            <p className="badge-fact">
              <span className="label">Real astronauts</span>
              {chosen.fact}
            </p>
          )}
          <div className="badge-actions">
            <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "BACK_TO_TITLE" })}>
              <Icon name="back" size={18} />
              Back
            </button>
            <button type="button" className="btn btn-primary btn-big" disabled={!ready} onClick={() => dispatch({ type: "NEXT" })}>
              Board the ship
              <Icon name="next" size={18} />
            </button>
          </div>
          {!ready && <p className="hint">Pick a name and a job to board.</p>}
        </aside>
      </div>
    </main>
  );
}
