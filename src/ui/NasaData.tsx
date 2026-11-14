import { DOSE_LIMIT, DOSE_START } from "../sim/rules";
import { RAD_FACTS, SEP_STORMS, sepStrength, type SepStorm } from "../sim/sep";
import { Icon } from "./Icon";

const fmt = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
};

const MISSIONS: { what: string; mission: string }[] = [
  { what: "Marsquakes", mission: "InSight lander: more than 1,300 marsquakes" },
  { what: "Ice drill", mission: "Phoenix lander: dug up water ice in 2008" },
  { what: "Fuel and oxygen plant", mission: "MOXIE on Perseverance: made oxygen from Mars air" },
  { what: "Greenhouse", mission: "Veggie on the Space Station: lettuce eaten in 2015" },
  { what: "Ice cliff", mission: "Mars Reconnaissance Orbiter: cliffs of buried ice" },
  { what: "Layered cliffs, meteorites", mission: "Curiosity rover: old lake rocks and iron meteorites" },
  { what: "Old lander", mission: "Viking 1: on Mars since 1976" },
  { what: "Water recycler", mission: "Space Station: recycles about 98% of its water" },
];

/** Where the real numbers in the game come from. Opened from the title and the mission report. */
export function NasaData({ storm, onClose }: { storm?: SepStorm | null; onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <section className="modal panel nasa-data" role="dialog" aria-modal="true" aria-labelledby="nasa-h">
        <div className="panel-head">
          <span id="nasa-h">Real NASA data in this game</span>
          <span className="mono">Sources</span>
        </div>
        <div className="panel-body nasa-body">
          {storm && (
            <p className="nasa-lead">
              <strong>Your storm:</strong> a real burst of particles from the Sun, recorded by NASA on {fmt(storm.start)}
              {storm.highEnergy ? ", with very fast protons that get through thin walls" : ""}. Game strength {sepStrength(storm)} of 6.{" "}
              <a href={storm.link} target="_blank" rel="noreferrer">
                NASA record
              </a>
            </p>
          )}
          <h3>
            <Icon name="dose" size={16} /> Radiation
          </h3>
          <ul>
            <li>
              <strong>Solar storms</strong> come from {SEP_STORMS.length} real solar particle storms in NASA's DONKI space weather database, including September 2017 and May 2024.
            </li>
            <li>
              <strong>Every sol</strong> each astronaut gets {RAD_FACTS.surfacePerDay} mSv, what NASA's Curiosity rover measured on the ground on Mars.
            </li>
            <li>
              <strong>The trip</strong> starts you at {DOSE_START} mSv: Curiosity measured about {RAD_FACTS.cruisePerDay} mSv a day on its way to Mars.
            </li>
            <li>
              <strong>The limit</strong> is {DOSE_LIMIT} mSv, NASA's career limit for astronauts.
            </li>
            <li>{RAD_FACTS.sept2017}</li>
            <li className="nasa-note">
              Game scale: storms in the game give more radiation than a real storm does on the ground on Mars, where the air shields a lot. We made them stronger so you can see
              why sheltering matters in a short mission.
            </li>
          </ul>
          <h3>
            <Icon name="science" size={16} /> Real missions behind the base
          </h3>
          <ul className="nasa-missions">
            {MISSIONS.map((m) => (
              <li key={m.what}>
                <strong>{m.what}:</strong> {m.mission}
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
            Close
          </button>
        </div>
      </section>
    </div>
  );
}
