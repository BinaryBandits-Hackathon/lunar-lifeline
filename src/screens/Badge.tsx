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

/** Pre-flight: pick a name, a job and a level, shown as a marker on Mars. */
export function Badge({ state, dispatch }: ScreenProps) {
  const { name, role } = state.player;
  const ready = name.trim() !== "" && role !== null;
  const chosen = role ? getRole(role) : null;
  const level = state.level === "cadet" ? "Cadet" : "Commander";

  return (
    <main className="screen crew-screen">
      {/* the stage: Mars in full, with the sun rising behind its edge */}
      <div className="title-space" aria-hidden="true">
        <div className="title-mars mars-full">
          <div className="mars-surface" />
          <div className="mars-shade" />
        </div>
        <div className="mars-flare" />
      </div>

      {/* the crew marker floating over the planet, like a site label */}
      <div className="crew-marker" aria-hidden="true">
        <span className="crew-marker-hex">
          <Icon name={chosen ? chosen.icon : "astronaut"} size={22} />
        </span>
        <strong>{name.trim() || "New Astronaut"}</strong>
        <span>
          {chosen ? chosen.name : "Pick a job"} · {level}
        </span>
      </div>

      <div className="title-tab">Pre-flight · Crew Badge</div>

      <section className="crew-panel" aria-labelledby="crew-title">
        <h1 id="crew-title" className="crew-title">Crew Badge</h1>
        <p className="crew-sub">Mars Base 1 · Crew ID</p>

        <div className="title-rule" />
        <h2 className="crew-head">Your name</h2>
        <div className="crew-names">
          {PRESET_NAMES.map((n) => (
            <button key={n} type="button" aria-pressed={name === n} onClick={() => dispatch({ type: "SET_NAME", name: n })}>
              {n}
            </button>
          ))}
        </div>
        <input
          id="astronaut-name"
          className="crew-input"
          type="text"
          value={name}
          maxLength={NAME_MAX}
          autoComplete="off"
          placeholder="Or type your own name"
          aria-label="Your name"
          onChange={(e) => dispatch({ type: "SET_NAME", name: e.target.value })}
        />

        <div className="title-rule" />
        <h2 className="crew-head">Your job</h2>
        <div className="crew-roles">
          {ROLES.map((r) => (
            <button key={r.id} type="button" className="crew-role" aria-pressed={role === r.id} onClick={() => dispatch({ type: "PICK_ROLE", role: r.id })}>
              <Icon name={r.icon} size={20} />
              <span className="crew-role-text">
                <strong>{r.name}</strong>
                <span>{r.perkText}</span>
              </span>
            </button>
          ))}
        </div>
        {chosen && <p className="crew-fact">{chosen.fact}</p>}

        <div className="title-rule" />
        <ul className="title-rows">
          <li>
            <span className="row-key">Level</span>
            <span className="row-choice" role="group" aria-label="Level">
              <button type="button" aria-pressed={state.level === "cadet"} onClick={() => dispatch({ type: "SET_LEVEL", level: "cadet" })}>
                Cadet
              </button>
              <button type="button" aria-pressed={state.level === "commander"} onClick={() => dispatch({ type: "SET_LEVEL", level: "commander" })}>
                Commander
              </button>
            </span>
          </li>
        </ul>

        <div className="title-nav">
          {!ready && <span className="crew-hint">Pick a name and a job</span>}
          <button type="button" className="title-link" onClick={() => dispatch({ type: "BACK_TO_TITLE" })}>
            Back
          </button>
          <button type="button" className="title-link title-start" disabled={!ready} onClick={() => dispatch({ type: "NEXT" })}>
            Board the ship
          </button>
        </div>
      </section>
    </main>
  );
}
