"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const GLBackground = dynamic(() => import("./GLBackground"), { ssr: false });
const IntroSpell = dynamic(() => import("./IntroSpell"), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;

const TABS = ["home", "about", "projects", "experience", "contact"] as const;
type Tab = (typeof TABS)[number];

const projects = [
  {
    title: "Four Fronts",
    year: "2026",
    blurb:
      "A study hub for my four Berkeley courses. A dependency-free Python service mirrors every course through the Canvas REST API, a deadline view flags the weeks where exams collide, and a built-in tutor answers questions using the actual course files.",
    tags: ["python", "canvas api", "llm"],
  },
  {
    title: "Spending Leak Detector",
    year: "2026",
    blurb:
      "A CLI that reads bank CSV exports and finds where money quietly leaks: subscriptions detected from charge cadence, price hikes, duplicate charges, late night habit spending. Standard library Python; data never leaves the machine.",
    tags: ["python", "cli", "local-first"],
  },
  {
    title: "FloodWatch",
    year: "2025",
    blurb:
      "A live flood risk dashboard built during the December 2025 King County flood warnings. It benchmarked real time NOAA rainfall against historical baselines and reached school and community groups while the warnings were active.",
    tags: ["python", "noaa api", "gis"],
  },
  {
    title: "Eat Happy iOS",
    year: "2025 to 2026",
    blurb:
      "A ground-up rebuild of a food rescue nonprofit's volunteer app in Swift, with a volunteer hour tracker and a full interface redesign, pitched directly to executive leadership.",
    tags: ["swift", "ios"],
  },
  {
    title: "TrashSmart",
    year: "2023 to 2026",
    blurb:
      "Litter density mapping from national datasets to find urban zones underserved by waste collection. The analysis anchored a fundraising campaign that put waste bins into three cities.",
    tags: ["python", "data viz", "civic"],
  },
  {
    title: "EcoMap",
    year: "2024 to 2026",
    blurb:
      "Four public APIs merged into one real time environmental dashboard, used to brief local community organizations on what the combined data actually showed.",
    tags: ["apis", "dashboard"],
  },
];

const experience = [
  {
    org: "Eat Happy",
    role: "Software Development Intern",
    year: "2025 to 2026",
    blurb:
      "Rebuilt the volunteer-facing iOS app for a food rescue nonprofit in Swift and shipped it to the volunteers who use it weekly. Also delivered 80+ hours of rescued food to families, which is a good way to learn what your users actually need.",
  },
  {
    org: "Jenny Cochrane Law",
    role: "Legal Intern, Immigration & H-1B",
    year: "2025 to 2026",
    blurb:
      "Managed client intake and case files for active H-1B matters, tracked filing deadlines, and condensed regulatory changes into summaries the supervising attorney used directly in client work.",
  },
];

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="panel"
      initial={{ opacity: 0, x: 32, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -24, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="panel-inner">{children}</div>
    </motion.div>
  );
}

export default function Site() {
  const [introDone, setIntroDone] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [hovered, setHovered] = useState<Tab | null>(null);

  useEffect(() => {
    const fromHash = window.location.hash.replace("#", "") as Tab;
    if (TABS.includes(fromHash)) setTab(fromHash);
  }, []);

  const go = (t: Tab) => {
    setTab(t);
    window.history.replaceState(null, "", t === "home" ? " " : `#${t}`);
  };

  return (
    <>
      <IntroSpell onDone={() => setIntroDone(true)} />
      <GLBackground />

      <motion.div
        className="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.7 }}
      >
        <aside className="side">
          <button className="wordmark" onClick={() => go("home")}>
            Aniket <em>B.</em>
          </button>
          <nav className="nav" onMouseLeave={() => setHovered(null)}>
            {TABS.map((t) => (
              <button
                key={t}
                className={`nav-item${tab === t ? " active" : ""}`}
                onMouseEnter={() => setHovered(t)}
                onFocus={() => setHovered(t)}
                onClick={() => go(t)}
              >
                {hovered === t && (
                  <motion.span
                    className="nav-hover"
                    layoutId="nav-hover"
                    transition={{ type: "spring", stiffness: 550, damping: 40 }}
                  />
                )}
                {tab === t && (
                  <motion.span
                    className="nav-active"
                    layoutId="nav-active"
                    transition={{ type: "spring", stiffness: 550, damping: 40 }}
                  />
                )}
                <span className="nav-label">
                  <span className="nav-slash">/</span>
                  {t}
                </span>
              </button>
            ))}
          </nav>
          <div className="side-foot">
            <span>© 2026 aniket bhattacharjee</span>
            <span>berkeley, california</span>
          </div>
        </aside>

        <main className="panel-wrap">
          <AnimatePresence mode="wait">
            {tab === "home" && (
              <Panel key="home">
                <p className="eyebrow">Berkeley, California</p>
                <h1 className="home-name">
                  Aniket <em>Bhattacharjee</em>
                </h1>
                <p className="home-sub">
                  Economics undergrad at UC Berkeley. I write Python that reads
                  messy public data and turns it into tools people can act on:
                  flood dashboards, litter maps, deadline trackers, and one
                  script that audits my own bank statements.
                </p>
                <p className="home-hint">
                  start with{" "}
                  <button onClick={() => go("about")}>about</button> or jump to{" "}
                  <button onClick={() => go("projects")}>projects</button>
                </p>
              </Panel>
            )}

            {tab === "about" && (
              <Panel key="about">
                <p className="eyebrow">about</p>
                <h2 className="panel-title">
                  Data first, <em>then</em> the code.
                </h2>
                <div className="about-cols">
                  <div>
                    <p>
                      I got into programming in high school, not because I
                      loved computers but because I kept running into questions
                      a spreadsheet couldn&apos;t answer. Where does a
                      city&apos;s litter actually accumulate? How bad is this
                      week&apos;s flooding compared to the last decade? Python
                      turned out to be the fastest way to find out, and I never
                      really stopped. Now I&apos;m a first-year at{" "}
                      <strong>UC Berkeley</strong> studying economics, which is
                      the same habit applied to people instead of sensors.
                    </p>
                    <p>
                      Most of what I build follows one pattern: find a public
                      dataset, write a script that cleans it, and put the
                      result where someone can act on it.{" "}
                      <strong>TrashSmart</strong> ended with waste bins
                      installed in three cities. <strong>FloodWatch</strong>{" "}
                      was written during the December 2025 King County floods
                      and reached community groups while the warnings were
                      still active.
                    </p>
                  </div>
                  <div>
                    <p>
                      I&apos;ve worked on the other side of the desk too. At{" "}
                      <strong>Eat Happy</strong>, a food rescue nonprofit, I
                      rebuilt their volunteer iOS app in Swift. At an
                      immigration law firm I managed H-1B case files and filing
                      deadlines. Lately I point the tools at my own life: one
                      service syncs my four Berkeley courses through the Canvas
                      API, another finds subscriptions I forgot to cancel.
                    </p>
                    <p>
                      Outside of code: <strong>squash</strong>, a racquet sport
                      played in a glass-walled court. I&apos;ve competed since
                      I was six, been ranked in the top 50 US juniors, placed
                      10th at the 2025 US Junior Silver Championships, and
                      trained around 19 hours a week for over a decade. I also
                      spent 210+ hours coaching younger players, including kids
                      on the autism spectrum. Squash taught me that
                      fundamentals beat flash, which is my philosophy for
                      software as well.
                    </p>
                  </div>
                </div>
                <div className="stack-row">
                  <span>
                    <b>Languages</b> Python · Swift
                  </span>
                  <span>
                    <b>Tools</b> GIS · Excel · APIs
                  </span>
                  <span>
                    <b>Speaks</b> English · Hindi · Spanish
                  </span>
                </div>
              </Panel>
            )}

            {tab === "projects" && (
              <Panel key="projects">
                <p className="eyebrow">projects</p>
                <h2 className="panel-title">
                  Built, shipped, <em>used.</em>
                </h2>
                <div className="proj-grid">
                  {projects.map((p) => (
                    <article className="proj-card" key={p.title}>
                      <div className="proj-card-head">
                        <h3>{p.title}</h3>
                        <span className="year">{p.year}</span>
                      </div>
                      <p>{p.blurb}</p>
                      <div className="tags">
                        {p.tags.map((t) => (
                          <span className="tag" key={t}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </Panel>
            )}

            {tab === "experience" && (
              <Panel key="experience">
                <p className="eyebrow">experience</p>
                <h2 className="panel-title">
                  Where I&apos;ve <em>worked.</em>
                </h2>
                <div className="xp-grid">
                  {experience.map((x) => (
                    <article className="xp-card" key={x.org}>
                      <h3>{x.org}</h3>
                      <span className="role">{x.role}</span>
                      <p>{x.blurb}</p>
                      <span className="year">{x.year}</span>
                    </article>
                  ))}
                </div>
              </Panel>
            )}

            {tab === "contact" && (
              <Panel key="contact">
                <p className="eyebrow">contact</p>
                <h2 className="contact-title">
                  Send <em>word.</em>
                </h2>
                <div className="contact-links">
                  <a className="pill" href="mailto:aniket_b@berkeley.edu">
                    aniket_b@berkeley.edu
                  </a>
                  <a
                    className="pill"
                    href="https://linkedin.com/in/aniket-bhattacharjee-9b23a432b"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    linkedin ↗
                  </a>
                </div>
              </Panel>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </>
  );
}
