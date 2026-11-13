import { RULES } from "../content/rules";
import { LAUNCH_POWER, SYSTEMS, availableBlocks, boardOutcome, isStormToday, totalBlocks } from "../engine/base";
import type { GameState, IconName, System } from "../engine/types";
import { BaseScene } from "../ui/BaseScene";
import { Dialogue } from "../ui/Dialogue";
import { Gauges } from "../ui/Gauges";
import { Icon } from "../ui/Icon";
import { useSpeak, type ScreenProps } from "../ui/screen";

const SYSTEM_INFO: Record<System, { name: string; icon: IconName; job: (s: GameState) => string }> = {
  habitat: { name: "Habitat", icon: "supplies", job: () => `Air and water. Needs ${RULES.habitatNeed} blocks.` },
  greenhouse: {
    name: "Greenhouse",
    icon: "flask",
    job: (s) => `Grows food. Harvest at ${RULES.growTo} (now ${s.base!.growth}/${RULES.growTo}).`,
  },
  shield: { name: "Shield", icon: "dose", job: () => "Blocks radiation from solar storms." },
};

/** Pip's tip for Cadets. Commanders get no advice, only the facts. */
function hint(state: GameState): string {
  const b = state.base!;
  const a = b.allocation;
  const left = availableBlocks(state) - totalBlocks(a);
  const solsToLaunch = b.totalSols - b.sol;
  if (state.level === "commander") {
    return `Sol ${b.sol}, Commander. The power board is yours.`;
  }
  if (isStormToday(state) && b.storm.kind === "solar" && a.shield < b.storm.strength) {
    return "Solar storm today! Put blocks in the shield to protect the crew.";
  }
  if (b.storm.sol === b.sol + 1 && b.storm.kind === "dust") {
    return "A dust storm comes tomorrow and the panels will go dark. Save blocks in the battery!";
  }
  if (b.storm.sol === b.sol + 1 && b.storm.kind === "solar") {
    return "A solar storm comes tomorrow. Save some blocks so you can power the shield.";
  }
  if (a.habitat < RULES.habitatNeed) return `The habitat needs ${RULES.habitatNeed} blocks, or we lose air and water.`;
  if (solsToLaunch <= 2 && left < LAUNCH_POWER) return `Launch is close. Try to save ${LAUNCH_POWER} blocks in the battery for the rocket.`;
  if (a.shield > 0 && !isStormToday(state)) return "There's no storm today, so shield blocks will be wasted.";
  return "Split today's power. Blocks you don't use are saved in the battery.";
}

export function Board({ state, dispatch }: ScreenProps) {
  const b = state.base!;
  const a = b.allocation;
  const available = availableBlocks(state);
  const used = totalBlocks(a);
  const left = available - used;
  const preview = boardOutcome(state);
  const weather = isStormToday(state) ? b.storm.kind : "clear";
  const tip = hint(state);
  useSpeak(tip, state.settings.readAloud);

  return (
    <main className="screen base-screen">
      <header className="screen-head">
        <span className="label">
          Sol {b.sol} of {b.totalSols}
        </span>
        <h2>Power board</h2>
      </header>

      <Gauges gauges={state.gauges} scienceGoal={b.scienceGoal} />

      <div className="base-layout">
        <div className="base-left">
          <div className="panel scene-panel">
            <div className="panel-head">
              <span>Base camera</span>
              {weather !== "clear" && <span className="tag tag-warn">{weather === "solar" ? "Solar storm" : "Dust storm"}</span>}
            </div>
            <BaseScene flags={state.flags} weather={weather} power={{ ...a, habitatNeed: RULES.habitatNeed }} />
          </div>
          <section className="panel">
            <div className="panel-head">
              <span>Morning report</span>
            </div>
            <ul className="log panel-body">
              {b.morning.map((l, i) => (
                <li key={i} className={l.tone}>
                  <span className="dot" aria-hidden="true" />
                  <span>{l.text}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="panel board" aria-labelledby="board-h">
          <div className="panel-head">
            <span id="board-h">Today's power</span>
            <span className="mono">
              Battery {state.gauges.power} + panels {b.production} = {available}
            </span>
          </div>
          <div className="panel-body">
            <div className="pool" aria-label={`${left} of ${available} blocks not placed`}>
              {Array.from({ length: available }, (_, i) => (
                <i key={i} className={i < used ? "used" : ""} />
              ))}
              <span className="pool-label">
                {left} left <Icon name="next" size={14} /> battery
              </span>
            </div>

            {SYSTEMS.map((sys) => {
              const info = SYSTEM_INFO[sys];
              const short = sys === "habitat" && a.habitat < RULES.habitatNeed;
              return (
                <div key={sys} className={`system${short ? " short" : ""}`}>
                  <span className="system-icon">
                    <Icon name={info.icon} size={22} />
                  </span>
                  <span className="system-text">
                    <strong>{info.name}</strong>
                    <span>{info.job(state)}</span>
                  </span>
                  <span className="system-blocks" aria-hidden="true">
                    {Array.from({ length: Math.max(a[sys], sys === "habitat" ? RULES.habitatNeed : 0) }, (_, i) => (
                      <i key={i} className={i < a[sys] ? "on" : "need"} />
                    ))}
                  </span>
                  <span className="stepper">
                    <button
                      type="button"
                      className="btn btn-icon"
                      onClick={() => dispatch({ type: "REMOVE_BLOCK", system: sys })}
                      disabled={a[sys] === 0}
                      aria-label={`Take a block from the ${info.name}`}
                    >
                      −
                    </button>
                    <span className="stepper-value" aria-live="polite">
                      {a[sys]}
                    </span>
                    <button
                      type="button"
                      className="btn btn-icon"
                      onClick={() => dispatch({ type: "ADD_BLOCK", system: sys })}
                      disabled={left === 0}
                      aria-label={`Give a block to the ${info.name}`}
                    >
                      +
                    </button>
                  </span>
                </div>
              );
            })}

            <div className="forecast">
              <span className="label">If you lock this in</span>
              <ul className="log">
                {preview.lines.map((l, i) => (
                  <li key={i} className={l.tone}>
                    <span className="dot" aria-hidden="true" />
                    <span>{l.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <Dialogue
        text={tip}
        mood={weather !== "clear" ? "alert" : "calm"}
        form="rover"
        readAloud={state.settings.readAloud}
        onNext={() => dispatch({ type: "CONFIRM_BOARD" })}
        nextLabel="Lock in power"
      />
    </main>
  );
}
