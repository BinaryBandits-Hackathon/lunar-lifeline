import { useEffect, useState } from "react";
import { getRole } from "../content/roles";
import { powerForecast, stormStatus, summarize } from "../sim/engine";
import { getEvent } from "../sim/events";
import { BADGES, rankFor } from "../content/academy";
import { missionBadges, missionPoints } from "../engine/career";
import { evaChecklist, getSite as getEvaSite, sitesFor } from "../sim/eva";
import { FEATURE_INFO, isUnlocked, machineFeature, machineLocked, taskFeature, taskLocked, unlockSol } from "../sim/unlocks";
import { CAPS, CROPS, DOSE_LIMIT, MACHINES, PHASES, TASKS, TASK_ORDER } from "../sim/rules";
import type { CropId, MachineId, Phase, ResourceId, Resources, SimState } from "../sim/types";
import type { IconName } from "../engine/types";
import { Dialogue } from "../ui/Dialogue";
import { Icon } from "../ui/Icon";
import { SimScene } from "../ui/SimScene";
import { useSpeak, type ScreenProps } from "../ui/screen";

const RES_INFO: Record<ResourceId, { label: string; icon: IconName; unit: string; low?: number; high?: number }> = {
  battery: { label: "Battery", icon: "power", unit: "%", low: 25 },
  oxygen: { label: "Oxygen", icon: "supplies", unit: "%", low: 35 },
  co2: { label: "CO₂", icon: "dose", unit: "%", high: 1 },
  water: { label: "Water", icon: "water", unit: " L", low: 60 },
  food: { label: "Food", icon: "flask", unit: " meals", low: 8 },
  fuel: { label: "Fuel", icon: "rocket", unit: "%" },
  science: { label: "Science", icon: "science", unit: "" },
};
const LEFT: ResourceId[] = ["battery", "oxygen", "co2", "water", "food"];
const PHASE_LABEL: Record<Phase, string> = { morning: "Morning", day: "Day", evening: "Evening", night: "Night" };

function Meter({ id, value, goal }: { id: ResourceId; value: number; goal?: number }) {
  const info = RES_INFO[id];
  const max = goal ?? CAPS[id];
  const warn = (info.low !== undefined && value <= info.low) || (info.high !== undefined && value >= info.high);
  const done = goal !== undefined && value >= goal;
  return (
    <div className={`meter${warn ? " warn" : ""}${done ? " done" : ""}`} aria-label={`${info.label} ${value}${info.unit}${goal ? ` of ${goal}` : ""}`}>
      <Icon name={info.icon} size={16} />
      <span className="meter-text">
        <span className="meter-label">{info.label}</span>
        <span className="meter-value">
          {value}
          {goal !== undefined ? <small>/{goal}</small> : <small>{info.unit}</small>}
        </span>
      </span>
      <span className="meter-bar">
        <i style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </span>
    </div>
  );
}

function stormDate(sim: SimState): string {
  const r = sim.storm.record;
  if (!r) return "";
  const d = new Date(r.start);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function hint(sim: SimState): string {
  const f = powerForecast(sim);
  const storm = stormStatus(sim);
  const date = stormDate(sim);
  if (storm === "today" && sim.storm.kind === "solar" && sim.crew.some((c) => c.task !== "shelter"))
    return `Solar storm today! Send the crew to Shelter. Anyone outside gets the most radiation.${date ? ` This storm is based on a real one NASA recorded on ${date}.` : ""}`;
  if (storm === "today" && sim.storm.kind === "dust") return "Dust storm! The panels make very little power. Switch off what you can.";
  if (storm === "tomorrow" && sim.storm.kind === "solar") return `Warning from Earth: a solar storm hits tomorrow${date ? ` (like the real one on ${date})` : ""}. Plan to shelter.`;
  if (storm === "tomorrow" && sim.storm.kind === "dust") return "Weather warning: a dust storm arrives tomorrow and lasts 2 sols. Save battery today!";
  const walkers = sim.crew.filter((c) => c.task === "eva").length;
  if (walkers && !sim.evaSite) return "Someone is going on a spacewalk. Open the spacewalk plan and pick a destination.";
  if (walkers === 1) return "Astronauts never go outside alone. Send a buddy on the spacewalk too.";
  if (walkers && sim.evaSite && stormStatus(sim) === "today") return "There's a storm today. A spacewalk now is dangerous: think about waiting.";
  if (sim.broken.length && !sim.crew.some((c) => c.task === "repair")) return `The ${MACHINES[sim.broken[0]].name.toLowerCase()} is broken. Send someone to Repair it.`;
  if (sim.leak && !sim.crew.some((c) => c.task === "repair")) return "A pipe is leaking water every sol. Send someone to Repair it.";
  if (sim.dusty && !sim.crew.some((c) => c.task === "repair")) return "The panels are dusty and make less power. A Repair job will clean them.";
  const ripe = sim.plots.some((p) => p.crop && p.growth >= CROPS[p.crop].sols);
  const tired = sim.crew.find((c) => c.energy < 30 && c.task !== "rest");
  if (sim.panelsCracked && !sim.crew.some((c) => c.task === "repair")) return "Two solar panels are cracked. Send someone to Repair them for full power.";
  if (sim.res.oxygen < 40 && !sim.machines.oxygenMaker) return "Oxygen is getting low. Switch on the oxygen maker.";
  if (sim.res.water < 60) return "Water is low. Mine ice, or switch on the water recycler.";
  if (sim.res.food < 8) return "Food is running low. Plant crops and send someone to Farm.";
  if (tired) return `${tired.name} is very tired. Let them Rest today.`;
  if (ripe && !sim.crew.some((c) => c.task === "farm")) return "Crops are ripe! Send someone to Farm to harvest them.";
  if (sim.res.battery + f.make - f.use < 20) return "Careful: the machines and jobs use more power than you have. The heaters need power at night.";
  if (!sim.machines.fuelPlant && sim.res.fuel < sim.goals.fuel && isUnlocked(sim, "fuel")) return "To fly home you need fuel. The fuel plant uses lots of power, so plan around it.";
  return "Plan the sol: give everyone a job and choose which machines run. Then press Run sol.";
}

export function SimScreen({ state, dispatch }: ScreenProps) {
  const sim = state.sim!;
  const [step, setStep] = useState<number | null>(null);
  const [planning_eva, setPlanningEva] = useState(false);
  const fast = state.settings.reduceMotion;

  // Play the sol: step through morning, day, evening and night.
  useEffect(() => {
    if (step === null) return;
    const timeline = sim.report?.timeline ?? [];
    if (step >= timeline.length) {
      setStep(null);
      return;
    }
    const t = window.setTimeout(() => setStep(step + 1), fast ? 250 : 900);
    return () => window.clearTimeout(t);
  }, [step, sim.report, fast]);

  const playing = step !== null && sim.report !== null;
  const snapshot = playing ? sim.report!.timeline[Math.min(step!, sim.report!.timeline.length - 1)] : null;
  const shown: Resources = snapshot ? snapshot.res : sim.res;
  const phase: Phase = snapshot ? snapshot.phase : sim.mode === "plan" ? "morning" : "night";
  const planning = sim.mode === "plan";
  const forecast = powerForecast(sim);
  const tip = planning ? hint(sim) : "";
  useSpeak(planning && sim.newUnlocks.length === 0 ? tip : null, state.settings.readAloud);

  const run = () => {
    dispatch({ type: "SIM_RUN" });
    setStep(0);
  };

  return (
    <main className="sim-screen">
      {/* top bar: life support on the left, mission goals on the right */}
      <header className="hud" aria-label="Base readings">
        <div className="hud-group">
          {LEFT.map((id) => (
            <Meter key={id} id={id} value={shown[id]} />
          ))}
        </div>
        <div className="hud-group hud-right">
          <Meter id="fuel" value={shown.fuel} goal={sim.goals.fuel} />
          <Meter id="science" value={shown.science} goal={sim.goals.science} />
          {stormStatus(sim) && (
            <div className={`hud-storm ${stormStatus(sim)}`}>
              <Icon name={sim.storm.kind === "solar" ? "dose" : "water"} size={16} />
              <span>
                {sim.storm.kind === "solar" ? "Solar storm" : "Dust storm"}
                <strong>{stormStatus(sim) === "today" ? "Today" : "Tomorrow"}</strong>
              </span>
            </div>
          )}
          <div className="hud-clock">
            <span className="mono">
              Sol {sim.sol}/{sim.totalSols}
            </span>
            <strong>{PHASE_LABEL[phase]}</strong>
          </div>
        </div>
      </header>

      <div className="sim-main">
        {/* machines */}
        <section className="panel sim-side" aria-labelledby="machines-h">
          <div className="panel-head">
            <span id="machines-h">Machines</span>
            <span className="mono">power / sol</span>
          </div>
          <div className="machine-list">
            {(Object.keys(MACHINES) as MachineId[]).map((id) => {
              const info = MACHINES[id];
              const use = PHASES.reduce((n, p) => n + info.use[p], 0);
              const broken = sim.broken.includes(id);
              const feature = machineFeature(id);
              const locked = machineLocked(sim, id);
              const on = sim.machines[id] && !broken;
              return (
                <button
                  key={id}
                  type="button"
                  className={`machine${on ? " on" : ""}${locked ? " locked" : ""}`}
                  onClick={() => dispatch({ type: "SIM_TOGGLE", machine: id })}
                  disabled={!planning || !info.canSwitchOff || broken || locked}
                  aria-pressed={on}
                  title={info.what}
                >
                  <Icon name={info.icon} size={18} />
                  <span className="machine-text">
                    <strong>{info.name}</strong>
                    <span>{info.what}</span>
                  </span>
                  {locked && feature ? <span className="tag lock-tag">Sol {unlockSol(sim, feature)}</span> : broken ? <span className="tag tag-low">Broken</span> : <span className="machine-use mono">−{use}</span>}
                  <span className="switch" aria-hidden="true">
                    <i />
                  </span>
                </button>
              );
            })}
          </div>
          <div className="power-forecast">
            <span>
              Panels make <strong>+{forecast.make}</strong>
            </span>
            <span>
              Machines and jobs use <strong>−{forecast.use}</strong>
            </span>
            <span className={forecast.make - forecast.use < 0 ? "neg" : "pos"}>
              Battery {forecast.make - forecast.use >= 0 ? "+" : ""}
              {forecast.make - forecast.use} by tonight
            </span>
          </div>
        </section>

        {/* the base */}
        <section className="sim-center">
          <div className="panel scene-panel sim-scene-wrap">
            <SimScene sim={sim} phase={phase} res={shown} weather={stormStatus(sim) === "today" ? sim.storm.kind : "clear"} />
          </div>
          <EvaBar sim={sim} onOpen={() => setPlanningEva(true)} disabled={!planning} />
          <div className={`greenhouse-row${isUnlocked(sim, "greenhouse") ? "" : " locked"}`} aria-label="Greenhouse" data-lock={isUnlocked(sim, "greenhouse") ? undefined : `Greenhouse opens on sol ${unlockSol(sim, "greenhouse")}`}>
            {sim.plots.map((p, i) => {
              const ripe = p.crop !== null && p.growth >= CROPS[p.crop].sols;
              return (
                <div key={i} className={`plot${ripe ? " ripe" : ""}`}>
                  <span className="plot-head mono">Bed {i + 1}</span>
                  {p.crop ? (
                    <>
                      <strong>{CROPS[p.crop].name}</strong>
                      <span className="plot-bar">
                        <i style={{ width: `${Math.min(100, (p.growth / CROPS[p.crop].sols) * 100)}%` }} />
                      </span>
                      <span className="plot-note">{ripe ? "Ripe! Send a farmer." : `${p.growth}/${CROPS[p.crop].sols} sols · ${CROPS[p.crop].meals} meals`}</span>
                    </>
                  ) : (
                    <>
                      <strong>Empty</strong>
                      <span className="plot-pick" role="group" aria-label={`Seeds for bed ${i + 1}`}>
                        {(["lettuce", "potato"] as CropId[]).map((c) => (
                          <button
                            key={c}
                            type="button"
                            aria-pressed={p.plan === c}
                            disabled={!planning}
                            onClick={() => dispatch({ type: "SIM_PLOT", plot: i, crop: c })}
                          >
                            {CROPS[c].name}
                          </button>
                        ))}
                      </span>
                      <span className="plot-note">{p.plan ? "A farmer will plant it." : "Pick seeds."}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* crew */}
        <section className="panel sim-side" aria-labelledby="crew-h">
          <div className="panel-head">
            <span id="crew-h">Crew jobs</span>
            <span className="mono">today</span>
          </div>
          <div className="crew-list">
            {sim.crew.map((c) => (
              <div key={c.id} className={`crew-card${c.isPlayer ? " player" : ""}`}>
                <div className="crew-top">
                  <span className="crew-icon">
                    <Icon name={getRole(c.role).icon} size={18} />
                  </span>
                  <strong>{c.name}</strong>
                  <span className="mono">{getRole(c.role).name}</span>
                </div>
                <div className="crew-bars">
                  <span className={c.energy < 30 ? "warn" : ""}>
                    Energy <i style={{ width: `${c.energy}%` }} />
                  </span>
                  <span className={c.health < 50 ? "warn" : ""}>
                    Health <i style={{ width: `${c.health}%` }} />
                  </span>
                  <span className={c.dose >= DOSE_LIMIT - 100 ? "warn" : ""} title={`${c.dose} of ${DOSE_LIMIT} mSv career limit`}>
                    Radiation <i style={{ width: `${Math.min(100, (c.dose / DOSE_LIMIT) * 100)}%` }} />
                  </span>
                </div>
                <div className="task-pick" role="group" aria-label={`Job for ${c.name}`}>
                  {TASK_ORDER.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={c.task === t}
                      disabled={!planning || taskLocked(sim, t)}
                      className={taskLocked(sim, t) ? "locked" : ""}
                      onClick={() => dispatch({ type: "SIM_ASSIGN", crewId: c.id, task: t })}
                      title={taskLocked(sim, t) ? `Opens on sol ${unlockSol(sim, taskFeature(t)!)}` : TASKS[t].what}
                    >
                      <Icon name={TASKS[t].icon} size={15} />
                      <span>{TASKS[t].name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Dialogue
        text={planning ? tip : playing ? `${PHASE_LABEL[phase]} on Mars...` : "Sol complete."}
        mood={planning && tip.startsWith("Careful") ? "alert" : "calm"}
        form="rover"
        readAloud={state.settings.readAloud}
        onNext={planning && !sim.eventId ? run : undefined}
        nextLabel={`Run sol ${sim.sol}`}
      />

      {planning && sim.newUnlocks.length > 0 && <UnlockModal sim={sim} onClose={() => dispatch({ type: "SIM_DISMISS_UNLOCKS" })} />}
      {planning && planning_eva && !sim.eventId && (
        <EvaModal
          sim={sim}
          onPick={(site) => dispatch({ type: "SIM_EVA_SITE", site })}
          onAssign={(crewId, on) => dispatch({ type: "SIM_ASSIGN", crewId, task: on ? "eva" : "research" })}
          onClose={() => setPlanningEva(false)}
        />
      )}
      {planning && sim.eventId && sim.newUnlocks.length === 0 && <EventModal sim={sim} onPick={(index) => dispatch({ type: "SIM_EVENT", index })} />}
      {sim.mode !== "plan" && !playing && sim.report && <SolReportModal careerPoints={state.career.points} sim={sim} onNext={() => dispatch({ type: "SIM_NEXT" })} onHome={() => dispatch({ type: "RESTART" })} />}
    </main>
  );
}

function UnlockModal({ sim, onClose }: { sim: SimState; onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <section className="modal panel unlock-modal" role="dialog" aria-modal="true" aria-labelledby="unlock-h">
        <div className="panel-head">
          <span>Sol {sim.sol}</span>
          <span className="tag tag-ok">Unlocked</span>
        </div>
        <div className="panel-body">
          <h3 id="unlock-h" className="event-title">New on the base!</h3>
          <div className="unlock-list">
            {sim.newUnlocks.map((f) => (
              <div key={f} className="unlock-item">
                <span className="unlock-icon">
                  <Icon name={FEATURE_INFO[f].icon} size={26} />
                </span>
                <span>
                  <strong>{FEATURE_INFO[f].name}</strong>
                  <span className="unlock-what">{FEATURE_INFO[f].what}</span>
                  <span className="unlock-real">{FEATURE_INFO[f].real}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
            Got it
          </button>
        </div>
      </section>
    </div>
  );
}

function EvaBar({ sim, onOpen, disabled }: { sim: SimState; onOpen: () => void; disabled: boolean }) {
  const walkers = sim.crew.filter((c) => c.task === "eva");
  const site = sim.evaSite ? getEvaSite(sim.evaSite) : null;
  const list = evaChecklist(sim, stormStatus(sim) === "today");
  const ok = list.filter((i) => i.ok).length;
  if (!isUnlocked(sim, "eva")) {
    return (
      <div className="eva-bar locked">
        <span className="eva-bar-title">
          <Icon name="astronaut" size={16} />
          Spacewalk
        </span>
        <span className="eva-bar-info">Spacewalks open on sol {unlockSol(sim, "eva")}. Learn the base first.</span>
      </div>
    );
  }
  return (
    <div className={`eva-bar${walkers.length ? " active" : ""}`}>
      <span className="eva-bar-title">
        <Icon name="astronaut" size={16} />
        Spacewalk
      </span>
      <span className="eva-bar-info">
        {walkers.length ? `${walkers.map((w) => w.name).join(" + ")} → ${site ? site.name : "no destination"}` : "Nobody going outside today"}
      </span>
      <span className="eva-bar-rover mono" title="Rover battery">
        Rover {Math.round(sim.rover.battery)}%{sim.rover.broken ? " · broken" : ""}
      </span>
      {walkers.length > 0 && (
        <span className={`eva-bar-check mono${ok === list.length ? " ok" : ""}`}>
          Checklist {ok}/{list.length}
        </span>
      )}
      <button type="button" className="btn btn-secondary btn-small" onClick={onOpen} disabled={disabled}>
        Plan spacewalk
      </button>
    </div>
  );
}

function EvaModal({
  sim,
  onPick,
  onAssign,
  onClose,
}: {
  sim: SimState;
  onPick: (site: string | null) => void;
  onAssign: (crewId: string, on: boolean) => void;
  onClose: () => void;
}) {
  const storm = stormStatus(sim) === "today";
  const list = evaChecklist(sim, storm);
  const walkers = sim.crew.filter((c) => c.task === "eva");
  return (
    <div className="modal-backdrop">
      <section className="modal panel eva-modal" role="dialog" aria-modal="true" aria-labelledby="eva-h">
        <div className="panel-head">
          <span id="eva-h">Spacewalk plan · Sol {sim.sol}</span>
          <span className="mono">Rover battery {Math.round(sim.rover.battery)}%</span>
        </div>
        <div className="panel-body eva-body">
          <div className="eva-col">
            <span className="label">1. Who goes outside</span>
            <div className="eva-crew">
              {sim.crew.map((c) => {
                const going = c.task === "eva";
                return (
                  <button key={c.id} type="button" className="option-pill" aria-pressed={going} onClick={() => onAssign(c.id, !going)}>
                    {c.name} · energy {Math.round(c.energy)}
                  </button>
                );
              })}
            </div>
            <span className="label">2. Where to go</span>
            <div className="eva-sites">
              {sitesFor(sim).map((site) => {
                const needsRover = site.rover > 0;
                const roverLocked = needsRover && !isUnlocked(sim, "rover");
                const roverShort = needsRover && (roverLocked || sim.rover.broken || sim.rover.battery < site.rover);
                const visited = sim.visited.includes(site.id);
                return (
                  <button
                    key={site.id}
                    type="button"
                    className={`eva-site${roverShort ? " short" : ""}`}
                    aria-pressed={sim.evaSite === site.id}
                    onClick={() => onPick(sim.evaSite === site.id ? null : site.id)}
                    disabled={roverLocked}
                  >
                    <span className="eva-site-head">
                      <strong>{site.name}</strong>
                      <span className="mono">
                        {site.km} km · {roverLocked ? `rover opens sol ${unlockSol(sim, "rover")}` : needsRover ? `rover ${site.rover}%` : "on foot"}
                      </span>
                    </span>
                    <span className="eva-site-what">{site.what}</span>
                    <span className="chips">
                      <span className="chip good">Science +{visited ? 1 : site.science}{visited ? " (visited)" : ""}</span>
                      {site.bonusText && <span className="chip good">{site.bonusText}</span>}
                      <span className="chip bad">Suit O₂ −{site.suitO2}% each</span>
                      <span className="chip bad">Radiation +{site.dose} mSv each</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="eva-col">
            <span className="label">3. Pre-spacewalk checklist</span>
            <ul className="checklist">
              {list.map((i) => (
                <li key={i.id} className={i.ok ? "ok" : "no"}>
                  <span className="check-mark" aria-hidden="true">{i.ok ? "✓" : "!"}</span>
                  <span>
                    <strong>{i.label}</strong>
                    <small>{i.why}</small>
                  </span>
                </li>
              ))}
            </ul>
            <p className="real">
              <span className="label">Real missions</span>
              Astronauts check their suits, tools and the plan together before every spacewalk, and always go out in pairs.
            </p>
            {walkers.length === 0 && <p className="hint">Pick at least one astronaut to go outside.</p>}
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
            Done
          </button>
        </div>
      </section>
    </div>
  );
}

function MissionAwards({ sim, careerPoints }: { sim: SimState; careerPoints: number }) {
  const badges = missionBadges(sim);
  const earned = missionPoints(sim);
  const before = rankFor(careerPoints - earned);
  const after = rankFor(careerPoints);
  return (
    <div className="mission-awards">
      <span className="mono">+{earned} points</span>
      {after.index > before.index && <strong className="rank-up">Promoted to {after.name}!</strong>}
      {badges.length > 0 && (
        <span className="award-badges">
          {badges.map((b) => (
            <span key={b} className="chip good" title={BADGES[b].what}>
              <Icon name={BADGES[b].icon} size={14} />
              {BADGES[b].name}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

function EventModal({ sim, onPick }: { sim: SimState; onPick: (index: number) => void }) {
  const event = getEvent(sim.eventId!);
  return (
    <div className="modal-backdrop">
      <section className="modal panel event-modal" role="dialog" aria-modal="true" aria-labelledby="event-h">
        <div className="panel-head">
          <span>Morning news · Sol {sim.sol}</span>
          <span className="tag tag-watch">Surprise</span>
        </div>
        <div className="panel-body">
          <h3 id="event-h" className="event-title">{event.title}</h3>
          <p className="card-text">{event.text}</p>
          <div className="options">
            {event.options.map((o, i) => (
              <button key={o.label} type="button" className="option" onClick={() => onPick(i)} autoFocus={i === 0}>
                <span className="option-key">{String.fromCharCode(65 + i)}</span>
                <span className="option-body">
                  <strong>{o.label}</strong>
                  <span className="option-note">{o.result}</span>
                </span>
                <Icon name="next" size={20} />
              </button>
            ))}
          </div>
          <p className="real">
            <span className="label">Real missions</span>
            {event.real}
          </p>
        </div>
      </section>
    </div>
  );
}

function SolReportModal({ sim, careerPoints, onNext, onHome }: { sim: SimState; careerPoints: number; onNext: () => void; onHome: () => void }) {
  const report = sim.report!;
  const lines = summarize(report);
  const groups = [...LEFT, "fuel", "science"] as ResourceId[];
  const ending = sim.ending;
  return (
    <div className="modal-backdrop">
      <section className="modal panel" role="dialog" aria-modal="true" aria-labelledby="report-h">
        <div className="panel-head">
          <span id="report-h">Sol {report.sol} report</span>
          <span className="mono">evening</span>
        </div>
        <div className="panel-body report-body">
          {ending && (
            <div className={`ending-banner ${ending.type === "grounded" ? "emergency" : ending.type}`}>
              <strong>{ending.type === "emergency" ? "Emergency return" : ending.type === "grounded" ? "Grounded" : ending.type === "commander" ? "Mission Commander!" : "Mission complete"}</strong>
              <span className="ending-stars-row">
                {[1, 2, 3].map((n) => (
                  <svg key={n} viewBox="0 0 24 24" width="28" height="28" className={`star${n <= ending.stars ? " on" : ""}`} aria-hidden="true">
                    <path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.6l-6 3.3 1.3-6.7-5-4.7 6.8-.8z" />
                  </svg>
                ))}
              </span>
              <MissionAwards sim={sim} careerPoints={careerPoints} />
              <span>
                {ending.type === "emergency" || ending.type === "grounded"
                  ? ending.reason
                  : `Survived ${sim.totalSols} sols. Fuel ${sim.res.fuel}/${sim.goals.fuel}, science ${sim.res.science}/${sim.goals.science}.`}
              </span>
            </div>
          )}
          <div className="report-grid">
            {groups.map((id) => {
              const items = lines.filter((l) => l.res === id);
              if (!items.length) return null;
              const total = Math.round(items.reduce((n, l) => n + l.amount, 0) * 10) / 10;
              return (
                <div key={id} className="report-res">
                  <span className="report-res-head">
                    <Icon name={RES_INFO[id].icon} size={15} />
                    {RES_INFO[id].label}
                    <strong className={total >= 0 ? (id === "co2" ? "neg" : "pos") : id === "co2" ? "pos" : "neg"}>
                      {total > 0 ? "+" : ""}
                      {total}
                    </strong>
                  </span>
                  <ul>
                    {items.map((l) => (
                      <li key={l.cause}>
                        <span>{l.cause}</span>
                        <span className="mono">
                          {l.amount > 0 ? "+" : ""}
                          {l.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          {report.notes.length > 0 && (
            <ul className="log">
              {report.notes.map((n, i) => (
                <li key={i} className={n.tone}>
                  <span className="dot" aria-hidden="true" />
                  <span>{n.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="modal-actions">
          {ending ? (
            <button type="button" className="btn btn-primary" onClick={onHome}>
              <Icon name="home" size={18} />
              Back to start
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onNext} autoFocus>
              Plan sol {sim.sol + 1}
              <Icon name="next" size={18} />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
