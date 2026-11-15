// PART 3: crisis 5 (marsquake, decisions 9-10), crisis 6 (launch day,
// decisions 11-12), the ending and the mission debrief.
// Must ask exactly decisions 9-12, then show the ending from `outcome`.
//
// Same full-screen look as Parts 1 and 2. Only after the ending does the game
// finally reveal what each choice cost: the debrief turns consequences into
// lessons.

import { useCallback, useEffect, useMemo, useState } from "react";
import { speak, stopSpeaking } from "../../services/speech";
import { Pip } from "../../ui/Pip";
import { fill, type Line } from "../core/Beats";
import { CRISIS_OF, DECISION_LABELS } from "../core/labels";
import { DECISIONS, effectOf, finalOutcome, FUEL_NEEDED, HEALTH_FAIL } from "../core/outcome";
import "../part1/part1.css";
import { MeiFace, TundeFace } from "../part1/portraits";
import { p1Sound } from "../part1/sound";
import type { Choice, DecisionId, FinalPartProps, Lang, Outcome } from "../types";
import { Part3Art } from "./art";
import { DEBRIEF, ENDING_TEXT, PART3_BEATS, PART3_CHAPTERS, RADIATION, SCIENCE, type Part3ArtKey } from "./content";
import "./part3.css";

const UI = {
  part: { en: "Part 3 · The way home", bn: "পার্ট ৩ · বাসায় ফেরার পথ" },
  next: { en: "Next", bn: "পরের" },
  fact: { en: "Real NASA fact", bn: "নাসার আসল তথ্য" },
  source: { en: "Read the NASA source", bn: "নাসার সোর্স দেখো" },
  choose: { en: "Choose one", bn: "একটা বেছে নাও" },
  sound: { en: "Sound", bn: "সাউন্ড" },
  who: {
    pip: { en: "Pip", bn: "পিপ" },
    tunde: { en: "Tunde · Engineer", bn: "তুন্দে · ইঞ্জিনিয়ার" },
    mei: { en: "Mei · Doctor", bn: "মেই · ডাক্তার" },
    earth: { en: "Message from Earth", bn: "পৃথিবী থেকে মেসেজ" },
  },
} as const;

/** The six crises and their decisions, for the ending path (Tijul's ending). */
const CRISES: DecisionId[][] = [
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
  [9, 10],
  [11, 12],
];
const CRISIS_NAMES = [
  { en: "The broken ship", bn: "ভাঙা স্পেসশিপ" },
  { en: "The dust storm", bn: "ডাস্ট স্টর্ম" },
  { en: "Bad air", bn: "খারাপ বাতাস" },
  { en: "The solar storm", bn: "সোলার স্টর্ম" },
  { en: "The ground shakes", bn: "মাটি কাঁপছে" },
  { en: "Launch day", bn: "লঞ্চের দিন" },
] as const;

const SOUND_KEY = "p1-sound";
const storedSound = () => {
  try {
    return window.localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
};
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
/** Numbers in Bangla digits when the game is in Bangla. */
const num = (n: number | string, lang: Lang) => (lang === "bn" ? String(n).replace(/[0-9]/g, (d) => BN_DIGITS[+d]) : String(n));

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor" />
      {on ? <path d="M16 8.5 Q19 12 16 15.5 M18.5 6 Q23 12 18.5 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> : <path d="M16 9 L21 15 M21 9 L16 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

// ---------- the mission debrief ----------

const NAMES = {
  fuel: { en: "Fuel", bn: "ফুয়েল" },
  time: { en: "Time", bn: "সময়" },
  health: { en: "Health", bn: "স্বাস্থ্য" },
} as const;

/** "Fuel +3 · Health −2" for one decision, in the player's language. */
function effectChips(id: DecisionId, choices: Choice[], lang: Lang) {
  const d = effectOf(id, choices);
  return (["fuel", "time", "health"] as const)
    .filter((k) => d[k])
    .map((k) => ({ k, text: `${NAMES[k][lang]} ${d[k]! > 0 ? "+" : "−"}${num(Math.abs(d[k]!), lang)}`, up: d[k]! > 0 }));
}

/** The first decision that, changed on its own, would flip the ending. */
function oneFlip(choices: Choice[], outcome: Outcome): DecisionId | null {
  for (const id of DECISIONS) {
    const other = [...choices];
    other[id - 1] = other[id - 1] === "A" ? "B" : "A";
    if (finalOutcome(other).result !== outcome.result) return id;
  }
  return null;
}

function Gauge({ label, value, shown, need, ok, okText, shortText, max }: { label: string; value: number; shown: string; need: string; ok: boolean; okText: string; shortText: string; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`story-p3-gauge${ok ? " is-ok" : " is-short"}`}>
      <div className="story-p3-gauge-top">
        <strong>{label}</strong>
        <span className="story-p3-gauge-value">{shown}</span>
      </div>
      <div className="story-p3-gauge-bar">
        <i style={{ width: `${pct}%` }} />
      </div>
      <div className="story-p3-gauge-foot">
        <span>{need}</span>
        <span className="story-p3-gauge-verdict">{ok ? `✓ ${okText}` : `✗ ${shortText}`}</span>
      </div>
    </div>
  );
}

function Debrief({ lang, choices, outcome, onRestart, onExit }: { lang: Lang; choices: Choice[]; outcome: Outcome; onRestart: () => void; onExit: () => void }) {
  const t = (x: { en: string; bn: string }) => x[lang];
  const label = (id: DecisionId, c: Choice) => DECISION_LABELS[id][c][lang];
  const flip = oneFlip(choices, outcome);
  // radiation: sols on the surface (one more if they waited a sol to launch),
  // plus one doubled sol if they finished the job outside in the storm
  const sols = 13 + (choices[11] === "B" ? 1 : 0);
  const marsDose = Math.round((sols + (choices[6] === "B" ? 1 : 0)) * RADIATION.surfacePerSol * 10) / 10;
  const tripDose = Math.round(RADIATION.tripDays * RADIATION.spacePerDay);
  const crises = [1, 2, 3, 4, 5, 6] as const;

  return (
    <section className="story-p3-debrief" aria-labelledby="debrief-title">
      {/* the report opens at the top; its title takes focus without scrolling */}
      <h2 id="debrief-title" tabIndex={-1} ref={(el) => el?.focus({ preventScroll: true })}>
        {t(DEBRIEF.open)}
      </h2>

      <div className="story-p3-block">
        <h3>{t(DEBRIEF.numbersTitle)}</h3>
        <p className="story-p3-note">{t(DEBRIEF.numbersNote)}</p>
        <div className="story-p3-gauges">
          <Gauge label={t(DEBRIEF.fuel)} value={outcome.fuel} shown={num(outcome.fuel, lang)} need={t(DEBRIEF.needFuel)} ok={outcome.fuel >= FUEL_NEEDED} okText={t(DEBRIEF.ok)} shortText={t(DEBRIEF.short)} max={14} />
          <Gauge label={t(DEBRIEF.time)} value={outcome.time} shown={num(outcome.time, lang)} need={t(DEBRIEF.needTime)} ok={outcome.time >= 0} okText={t(DEBRIEF.ok)} shortText={t(DEBRIEF.short)} max={7} />
          <Gauge label={t(DEBRIEF.health)} value={outcome.health} shown={num(outcome.health, lang)} need={t(DEBRIEF.needHealth)} ok={outcome.health > HEALTH_FAIL} okText={t(DEBRIEF.ok)} shortText={t(DEBRIEF.short)} max={12} />
        </div>
      </div>

      <div className="story-p3-block">
        <h3>{t(DEBRIEF.oneTitle)}</h3>
        <p className="story-p3-flip">
          {flip
            ? t(outcome.result === "success" ? DEBRIEF.oneLost : DEBRIEF.oneSaved)
                .replace("{a}", label(flip, choices[flip - 1]))
                .replace("{b}", label(flip, choices[flip - 1] === "A" ? "B" : "A"))
            : t(DEBRIEF.oneNone)}
        </p>
      </div>

      <div className="story-p3-block">
        <h3>{t(DEBRIEF.choicesTitle)}</h3>
        <p className="story-p3-note">{t(DEBRIEF.choicesNote)}</p>
        <ol className="story-p3-choices">
          {crises.map((cr) => (
            <li key={cr} className="story-p3-crisis">
              <span className="story-p3-crisis-name">
                {t(DEBRIEF.crisis)} {num(cr, lang)}
              </span>
              <ul>
                {DECISIONS.filter((id) => CRISIS_OF[id] === cr).map((id) => {
                  const blamed = outcome.blame.includes(id);
                  const chips = effectChips(id, choices, lang);
                  return (
                    <li key={id} className={`story-p3-choice${blamed ? " is-blamed" : ""}`}>
                      <span className="story-p3-choice-name">{label(id, choices[id - 1])}</span>
                      <span className="story-p3-chips">
                        {chips.length === 0 ? <em>{t(DEBRIEF.noChange)}</em> : chips.map((c) => <b key={c.k} className={c.up ? "up" : "down"}>{c.text}</b>)}
                      </span>
                      {blamed && <span className="story-p3-tag">{t(DEBRIEF.caused)}</span>}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <div className="story-p3-block">
        <h3>{t(DEBRIEF.scienceTitle)}</h3>
        {/* the crew's radiation dose against NASA's career limit */}
        <div className="story-p3-dose" aria-label="Radiation">
          <div className="story-p3-dose-bar">
            <i className="mars" style={{ width: `${(marsDose / RADIATION.careerLimit) * 100}%` }} />
            <i className="trip" style={{ width: `${(tripDose / RADIATION.careerLimit) * 100}%` }} />
          </div>
          <div className="story-p3-dose-legend">
            <span>
              <i className="mars" /> {lang === "bn" ? `মঙ্গলে ${num(sols, lang)} সোল: প্রায় ${num(marsDose, lang)} mSv` : `${sols} sols on Mars: about ${marsDose} mSv`}
            </span>
            <span>
              <i className="trip" /> {lang === "bn" ? `৭ মাসের ফেরার পথ: প্রায় ${num(tripDose, lang)} mSv` : `7 months flying home: about ${tripDose} mSv`}
            </span>
            <span>
              <i className="limit" /> {lang === "bn" ? `নাসার ক্যারিয়ার লিমিট: ${num(RADIATION.careerLimit, lang)} mSv` : `NASA career limit: ${RADIATION.careerLimit} mSv`}
            </span>
          </div>
        </div>
        <div className="story-p3-cards">
          {SCIENCE.map((c) => (
            <article key={c.id} className="story-p3-card">
              <strong>{t(c.title)}</strong>
              <p>{t(c.body)}</p>
              <a href={c.source} target="_blank" rel="noreferrer" className="story-p1-source">
                {t(DEBRIEF.source)} ↗
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="story-p3-actions">
        <button type="button" className="story-p1-next" onClick={onRestart}>
          {t(DEBRIEF.again)}
        </button>
        <button type="button" className="story-p3-link" onClick={onExit}>
          {t(ENDING_TEXT.title)}
        </button>
      </div>
    </section>
  );
}

// ---------- the Part 3 player ----------

type Stage = "story" | "result" | "debrief";

export function Part3(props: FinalPartProps) {
  const { lang, readAloud, reduceMotion, playerName, choices, outcome, onChoose, onRestart, onExit } = props;
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [stage, setStage] = useState<Stage>("story");
  const [soundOn, setSoundOn] = useState(storedSound);
  const beat = PART3_BEATS[i];
  const say = (l: Line) => fill(l[lang], playerName);
  const won = outcome?.result === "success";

  const storyKey = ([...PART3_BEATS.slice(0, i + 1)].reverse().find((b) => b.art)?.art ?? "quake") as Part3ArtKey;
  const artKey = stage === "story" ? storyKey : won ? "home" : "stranded";
  const chapter = [...PART3_CHAPTERS].reverse().find((c) => c.from <= i) ?? PART3_CHAPTERS[0];
  // The launch scene follows decisions 11 and 12 (rock boxes, ignition, night).
  const rocks = choices[10];
  const launchChoice = choices[11];
  const scene = useMemo(() => <Part3Art k={artKey} rocks={rocks ?? null} launch={launchChoice ?? null} />, [artKey, rocks, launchChoice]);
  const pipMood = stage !== "story" ? (won ? "happy" : "calm") : storyKey === "quake" ? "alert" : "calm";

  const next = useCallback(() => {
    p1Sound.unlock();
    p1Sound.tick();
    setPicked(null);
    if (stage === "result") setStage("debrief");
    else if (i + 1 >= PART3_BEATS.length) setStage("result");
    else setI(i + 1);
  }, [i, stage]);

  const choose = (c: Choice) => {
    if (picked) return;
    p1Sound.unlock();
    p1Sound.tick();
    onChoose(c);
    setPicked(c);
  };

  const text =
    stage !== "story" || !beat
      ? ""
      : beat.kind === "line"
        ? say(beat.line)
        : beat.kind === "fact"
          ? say(beat.fact)
          : picked
            ? say(beat[picked === "A" ? "a" : "b"].reaction)
            : say(beat.question);

  // ---------- sound ----------
  useEffect(() => {
    p1Sound.setEnabled(soundOn);
    try {
      window.localStorage.setItem(SOUND_KEY, soundOn ? "on" : "off");
    } catch {
      // private mode: the switch still works for this visit
    }
  }, [soundOn]);
  useEffect(
    () => () => {
      p1Sound.stopAll();
      stopSpeaking();
    },
    [],
  );
  useEffect(() => {
    if (artKey === "quake") {
      p1Sound.bed("heat"); // the deep rumble of the ground
      p1Sound.crack();
    }
    if (artKey === "launch") p1Sound.bed("surface");
    if (artKey === "home") {
      p1Sound.bed(null);
      p1Sound.thrust(true);
      const t = window.setTimeout(() => {
        p1Sound.thrust(false);
        p1Sound.chime();
      }, 3200);
      return () => window.clearTimeout(t);
    }
    if (artKey === "stranded") {
      p1Sound.bed("surface");
      p1Sound.night();
    }
  }, [artKey]);
  const pipSpeaks = stage === "story" && ((beat?.kind === "line" && beat.line.who === "pip") || (beat?.kind === "decide" && !picked));
  useEffect(() => {
    if (pipSpeaks) p1Sound.blip();
    if (stage === "story" && beat?.kind === "fact") p1Sound.chime();
  }, [i, pipSpeaks, beat?.kind, stage]);
  useEffect(() => {
    if (readAloud && text) speak(text);
  }, [text, readAloud]);

  // keyboard: → moves on; A/B or 1/2 picks an option
  const canAdvance = stage === "result" || (stage === "story" && beat && (beat.kind !== "decide" || picked !== null));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || stage === "debrief") return;
      const k = e.key.toLowerCase();
      if (stage === "story" && beat?.kind === "decide" && !picked) {
        if (k === "a" || k === "1") choose("A");
        if (k === "b" || k === "2") choose("B");
        return;
      }
      if (k === "arrowright" && canAdvance) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (stage === "story" && !beat) return null;
  const who = stage === "story" && beat ? (beat.kind === "line" ? beat.line.who : beat.kind === "decide" && !picked ? "pip" : undefined) : undefined;
  const narration = !who && beat?.kind !== "fact";

  return (
    <div className={`story-p1 story-p3${reduceMotion ? " story-p1-still" : ""}${stage === "debrief" ? " is-debrief" : ""}`} lang={lang === "bn" ? "bn" : "en"} onPointerDown={() => p1Sound.unlock()}>
      <div className="story-p1-scene" aria-hidden="true">
        <div className="story-p1-scene-in" key={artKey}>
          {scene}
        </div>
      </div>
      <div className="story-p1-vignette" aria-hidden="true" />

      <header className="story-p1-top">
        <span className="story-p1-brand">{UI.part[lang]}</span>
        <span className="story-p1-tab">{stage === "story" ? chapter[lang] : won ? ENDING_TEXT.success.title[lang] : ENDING_TEXT.fail.title[lang]}</span>
        <span className="story-p1-switches">
          <button type="button" className="story-p1-switch" aria-pressed={soundOn} onClick={() => setSoundOn((v) => !v)} title={UI.sound[lang]}>
            <SpeakerIcon on={soundOn} />
            <span>{UI.sound[lang]}</span>
          </button>
        </span>
      </header>

      {stage === "story" && beat?.kind === "decide" && !picked && (
        <div className="story-p1-options" role="group" aria-label={UI.choose[lang]}>
          {(["A", "B"] as Choice[]).map((c) => {
            const o = beat[c === "A" ? "a" : "b"];
            return (
              <button key={c} type="button" className="story-p1-option" onClick={() => choose(c)} autoFocus={c === "A"}>
                <span className="story-p1-key" aria-hidden="true">{c}</span>
                <span className="story-p1-option-text">
                  <strong>{say(o.label)}</strong>
                  <span>{say(o.detail)}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {stage === "story" && beat?.kind === "fact" && (
        <section className="story-p1-fact" key={i}>
          <span className="story-p1-fact-head">{UI.fact[lang]}</span>
          <p>{text}</p>
          <div className="story-p1-row">
            <a href={beat.source} target="_blank" rel="noreferrer" className="story-p1-source">
              {UI.source[lang]} ↗
            </a>
            <button type="button" className="story-p1-next" onClick={next} autoFocus>
              {UI.next[lang]}
            </button>
          </div>
        </section>
      )}

      {stage === "story" && beat && beat.kind !== "fact" && (
        <section className={`story-p1-dialogue${narration ? " is-narration" : ""}`} key={`${i}-${picked ?? ""}`} aria-live="polite">
          {who && (
            <span className="story-p1-avatar">
              {who === "pip" ? <Pip mood={pipMood} size={64} /> : who === "mei" ? <MeiFace /> : <TundeFace />}
            </span>
          )}
          <div className="story-p1-words">
            {who && <span className="story-p1-who">{UI.who[who][lang]}</span>}
            <p className="story-p1-text">{text}</p>
          </div>
          {canAdvance && (
            <button type="button" className="story-p1-next" onClick={next} autoFocus>
              {UI.next[lang]}
            </button>
          )}
        </section>
      )}

      {stage === "result" && outcome && (
        <section className={`story-p3-end ${won ? "is-home" : "is-stranded"}`} aria-live="polite" aria-labelledby="p3-end-title">
          <h2 id="p3-end-title" className="story-p3-end-title">
            {won ? ENDING_TEXT.success.title[lang] : ENDING_TEXT.fail.title[lang]}
          </h2>
          {won ? (
            ENDING_TEXT.success.lines.map((l) => (
              <p key={l.en} className="story-p3-end-text">
                {l[lang]}
              </p>
            ))
          ) : (
            <p className="story-p3-end-text">{ENDING_TEXT.fail.reasons[outcome.reason!][lang]}</p>
          )}
          <div className="story-p3-end-path" aria-label={ENDING_TEXT.path[lang]}>
            <span className="story-p3-end-head">{won ? ENDING_TEXT.path[lang] : ENDING_TEXT.fail.led[lang]}</span>
            <ol className="story-p3-end-crises">
              {CRISES.map((ids, ci) => (
                <li key={ci} className="story-p3-end-crisis" style={{ animationDelay: `${0.5 + ci * 0.25}s` }}>
                  <span className="story-p3-end-name">
                    {num(ci + 1, lang)}. {CRISIS_NAMES[ci][lang]}
                  </span>
                  {ids.map((id) => (
                    <span key={id} className={`story-p3-end-choice${!won && outcome.blame.includes(id) ? " is-blamed" : ""}`}>
                      <b>{choices[id - 1]}</b>
                      {DECISION_LABELS[id][choices[id - 1]][lang]}
                    </span>
                  ))}
                </li>
              ))}
            </ol>
          </div>
          <div className="story-p3-end-actions">
            <button type="button" className="story-p1-next" onClick={next} autoFocus>
              {DEBRIEF.next[lang]}
            </button>
            <button type="button" className="story-p3-link" onClick={onRestart}>
              {ENDING_TEXT.tryAgain[lang]}
            </button>
            <button type="button" className="story-p3-link" onClick={onExit}>
              {ENDING_TEXT.title[lang]}
            </button>
          </div>
        </section>
      )}

      {stage === "debrief" && outcome && <Debrief lang={lang} choices={choices} outcome={outcome} onRestart={onRestart} onExit={onExit} />}
    </div>
  );
}
