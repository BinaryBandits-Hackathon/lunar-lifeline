import type { IconName } from "../engine/types";
import { Icon } from "../ui/Icon";
import type { ScreenProps } from "../ui/screen";

// Optional reading for curious kids, parents and classrooms.
// Every fact must be checked against a NASA or ESA source before release.
const PAGES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "water",
    title: "Training underwater",
    text: "Astronauts practise spacewalks in a giant swimming pool. Floating in water feels a bit like floating in space.",
  },
  {
    icon: "strength",
    title: "Staying strong",
    text: "In space, muscles and bones get weaker. Astronauts on the Space Station exercise about two hours every day.",
  },
  {
    icon: "paths",
    title: "Many paths to space",
    text: "Astronauts have been pilots, doctors, engineers, scientists and teachers. Many say it started with being curious as a kid.",
  },
];

export function Academy({ dispatch }: ScreenProps) {
  return (
    <main className="screen academy-screen">
      <header className="screen-head">
        <span className="label">Astronaut Academy</span>
        <h2>How real astronauts get ready</h2>
      </header>
      <div className="academy-grid">
        {PAGES.map((p, i) => (
          <article key={p.title} className="panel">
            <div className="panel-head">
              <span>Lesson {i + 1}</span>
              <Icon name={p.icon} size={18} />
            </div>
            <div className="panel-body">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          </article>
        ))}
      </div>
      <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "BACK_TO_TITLE" })}>
        <Icon name="back" size={18} />
        Back to start
      </button>
    </main>
  );
}
