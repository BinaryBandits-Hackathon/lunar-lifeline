import { useState } from "react";
import { BADGES, DRILLS, POINTS, rankFor, type BadgeId, type Drill } from "../content/academy";
import { Icon } from "../ui/Icon";
import { useSpeak, type ScreenProps } from "../ui/screen";

/** Rank, drills, badges and the mission log. */
export function Academy({ state, dispatch }: ScreenProps) {
  const [active, setActive] = useState<Drill | null>(null);
  const career = state.career;

  if (active) {
    return (
      <DrillRunner
        drill={active}
        readAloud={state.settings.readAloud}
        onDone={(score) => {
          dispatch({ type: "RECORD_DRILL", drill: active.id, score });
        }}
        onExit={() => setActive(null)}
      />
    );
  }

  return (
    <main className="screen academy-screen">
      <header className="screen-head">
        <span className="label">Astronaut Academy</span>
        <h2>Train like a real astronaut</h2>
      </header>

      <div className="academy-layout">
        <div className="academy-main">
          <RankCard points={career.points} />

          <section className="panel">
            <div className="panel-head">
              <span>Training drills</span>
              <span className="mono">
                +{POINTS.drillPass} pass · +{POINTS.drillPerfect} perfect
              </span>
            </div>
            <div className="drill-list">
              {DRILLS.map((d) => {
                const best = career.drills[d.id] ?? 0;
                const total = d.questions.length;
                return (
                  <div key={d.id} className={`drill-row${best >= total ? " perfect" : best > 0 ? " done" : ""}`}>
                    <span className="drill-icon">
                      <Icon name={d.icon} size={22} />
                    </span>
                    <span className="drill-text">
                      <strong>{d.title}</strong>
                      <span>{d.intro}</span>
                    </span>
                    <span className="drill-score mono">
                      {best}/{total}
                    </span>
                    <button type="button" className="btn btn-secondary btn-small" onClick={() => setActive(d)}>
                      {best ? "Retry" : "Start"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="academy-side">
          <section className="panel">
            <div className="panel-head">
              <span>Badges</span>
              <span className="mono">
                {career.badges.length}/{Object.keys(BADGES).length}
              </span>
            </div>
            <div className="badge-grid">
              {(Object.keys(BADGES) as BadgeId[]).map((id) => {
                const earned = career.badges.includes(id);
                return (
                  <div key={id} className={`badge-tile${earned ? " earned" : ""}`} title={BADGES[id].what}>
                    <Icon name={BADGES[id].icon} size={20} />
                    <strong>{BADGES[id].name}</strong>
                    <span>{earned ? BADGES[id].what : "Earn it on a mission"}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <span>Mission log</span>
              <span className="mono">{career.missions.length} flown</span>
            </div>
            {career.missions.length === 0 ? (
              <p className="panel-body hint">No missions yet. Finish a mission to see it here.</p>
            ) : (
              <ol className="mission-log">
                {[...career.missions].reverse().slice(0, 8).map((m, i) => (
                  <li key={i}>
                    <span className="mono">{new Date(m.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                    <span>{m.level === "cadet" ? "Cadet" : "Commander"}</span>
                    <span className="log-stars">{"★".repeat(m.stars)}{"☆".repeat(3 - m.stars)}</span>
                    <span className="mono">+{m.points}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>

      <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "BACK_TO_TITLE" })}>
        <Icon name="back" size={18} />
        Back to start
      </button>
    </main>
  );
}

export function RankCard({ points, compact }: { points: number; compact?: boolean }) {
  const rank = rankFor(points);
  const pct = rank.next ? Math.min(100, (points / rank.next.points) * 100) : 100;
  return (
    <div className={`rank-card${compact ? " compact" : ""}`}>
      <span className="rank-insignia" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} className={i <= rank.index ? "on" : ""} />
        ))}
      </span>
      <span className="rank-text">
        <span className="label">Rank</span>
        <strong>{rank.name}</strong>
        <span className="rank-next">
          {rank.next ? `${points} / ${rank.next.points} points to ${rank.next.name}` : `${points} points · highest rank`}
        </span>
        <span className="rank-bar">
          <i style={{ width: `${pct}%` }} />
        </span>
      </span>
    </div>
  );
}

function DrillRunner({ drill, readAloud, onDone, onExit }: { drill: Drill; readAloud: boolean; onDone: (score: number) => void; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  // Shuffle the answers once per drill so the right one isn't always in the same place.
  const [shuffled] = useState(() =>
    drill.questions.map((question) => ({
      ...question,
      options: [...question.options].map((o) => ({ o, k: Math.random() })).sort((a, b) => a.k - b.k).map((x) => x.o),
    })),
  );
  const q = shuffled[index];
  useSpeak(finished ? null : q.q, readAloud);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (q.options[i].correct) setScore((s) => s + 1);
  };
  const nextQ = () => {
    if (index + 1 < drill.questions.length) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      setFinished(true);
      onDone(score);
    }
  };

  return (
    <main className="screen academy-screen">
      <header className="screen-head">
        <span className="label">
          Drill · {drill.title} · {finished ? "done" : `question ${index + 1} of ${drill.questions.length}`}
        </span>
        <h2>{finished ? `${score} of ${drill.questions.length} correct` : q.q}</h2>
      </header>

      {finished ? (
        <section className="panel">
          <div className="panel-body">
            <p className="drill-result">
              {score === drill.questions.length
                ? "Perfect! You're thinking like a real astronaut."
                : score >= Math.ceil(drill.questions.length * 0.66)
                  ? "Passed! Try again for a perfect score."
                  : "Good try. Read the answers and try again."}
            </p>
          </div>
        </section>
      ) : (
        <div className="options drill-options">
          {q.options.map((o, i) => {
            const state = picked === null ? "" : o.correct ? " right" : picked === i ? " wrong" : " dim";
            return (
              <button key={o.text} type="button" className={`option${state}`} onClick={() => pick(i)} disabled={picked !== null}>
                <span className="option-key">{String.fromCharCode(65 + i)}</span>
                <span className="option-body">
                  <strong>{o.text}</strong>
                  {picked !== null && (o.correct || picked === i) && <span className="option-note">{o.why}</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="drill-actions">
        <button type="button" className="btn btn-ghost" onClick={onExit}>
          <Icon name="back" size={18} />
          Academy
        </button>
        {!finished && picked !== null && (
          <button type="button" className="btn btn-primary" onClick={nextQ} autoFocus>
            {index + 1 < drill.questions.length ? "Next question" : "Finish drill"}
            <Icon name="next" size={18} />
          </button>
        )}
      </div>
    </main>
  );
}
