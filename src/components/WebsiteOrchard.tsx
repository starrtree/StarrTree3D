import { useEffect, useRef, useState, type CSSProperties } from "react";
import { websiteProjects, type WebsiteProject } from "../data/websites";
import { useExperience } from "./Experience";
import "../website-orchard.css";

const filters = [
  { id: "all", label: "All projects" },
  { id: "business", label: "Businesses" },
  { id: "culture", label: "Culture & creators" },
  { id: "lab", label: "Experiments" },
] as const;

const businessCategories = new Set(["Restaurant", "Contractor", "Artist / Beauty", "Beauty", "Retail / Culture"]);
const labCategories = new Set(["Interactive", "Media"]);
const projectFilter = (project: WebsiteProject, filter: string) => (
  filter === "all" ||
  (filter === "business" && businessCategories.has(project.category)) ||
  (filter === "lab" && labCategories.has(project.category)) ||
  (filter === "culture" && !businessCategories.has(project.category) && !labCategories.has(project.category))
);

const projectStyle = (project: WebsiteProject) => ({
  "--wo-accent": project.colors[0],
  "--wo-depth": project.colors[1],
}) as CSSProperties;

/** A separate exhibition space for the Web StarrFruit, not the shared destination HUD. */
export default function WebsiteOrchard() {
  const { motion } = useExperience();
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(websiteProjects[0].id);
  const [loadFrame, setLoadFrame] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(920);
  const visible = websiteProjects.filter((project) => projectFilter(project, filter));
  const selected = visible.find((project) => project.id === selectedId) || visible[0];
  const selectedIndex = visible.findIndex((project) => project.id === selected.id);

  useEffect(() => {
    if (!frame.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) setFrameWidth(Math.max(1, entries[0].contentRect.width));
    });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);

  const select = (project: WebsiteProject) => {
    if (selectedId !== project.id) {
      setSelectedId(project.id);
      setLoadFrame(false);
    }
  };
  const changeFilter = (next: string) => {
    const options = websiteProjects.filter((project) => projectFilter(project, next));
    setFilter(next);
    if (!options.some((project) => project.id === selectedId)) {
      setSelectedId(options[0].id);
      setLoadFrame(false);
    }
  };
  const cycle = (offset: number) => {
    select(visible[(selectedIndex + offset + visible.length) % visible.length]);
  };

  return (
    <section className={"wo-orchard " + (motion ? "wo-motion" : "wo-still")} aria-labelledby="wo-title" style={projectStyle(selected)}>
      <div className="wo-intro">
        <div className="wo-orbit-mark" aria-hidden="true">
          <i /><i /><i /><span>✦</span>
        </div>
        <div className="wo-intro-copy">
          <p className="wo-kicker">STARRFRUIT 01 / THE DIGITAL GARDEN</p>
          <h2 id="wo-title">The Website <em>Orchard.</em></h2>
          <p>A constellation of crafted web experiences. Choose a project to bring its homepage into focus, then step inside the full build.</p>
        </div>
        <div className="wo-stat" aria-label={websiteProjects.length + " web projects"}><strong>{String(websiteProjects.length).padStart(2, "0")}</strong><span>WEBSITE WORLDS<br />IN THE ARCHIVE</span></div>
      </div>

      <div className="wo-filterbar" aria-label="Filter showcased websites">
        <span className="wo-filter-label">DISCOVER /</span>
        <div className="wo-filter-chips">
          {filters.map((option) => <button key={option.id} type="button" aria-pressed={filter === option.id} onClick={() => changeFilter(option.id)}>{option.label}</button>)}
        </div>
      </div>

      <div className="wo-exhibit" style={projectStyle(selected)}>
        <div className="wo-screen-column">
          <div className="wo-screen-heading">
            <span className="wo-signal"><i /> WEB FREQUENCY / {String(selectedIndex + 1).padStart(2, "0")}</span>
            <div className="wo-arrows"><button type="button" onClick={() => cycle(-1)} aria-label="Previous website">←</button><button type="button" onClick={() => cycle(1)} aria-label="Next website">→</button></div>
          </div>
          <div className="wo-browser" key={selected.id}>
            <div className="wo-browser-bar">
              <div className="wo-browser-dots" aria-hidden="true"><i /><i /><i /></div>
              <div className="wo-browser-url" title={selected.previewUrl}><span aria-hidden="true">⌁</span> {selected.previewUrl.replace(/^https?:\/\//, "")}</div>
              <span className="wo-browser-glyph" aria-hidden="true">✣</span>
            </div>
            <div className="wo-viewport" ref={frame}>
              {loadFrame ? (
                <iframe
                  className="wo-live-frame"
                  title={selected.name + " homepage preview"}
                  src={selected.previewUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  style={{ transform: "scale(" + frameWidth / 1280 + ")" }}
                />
              ) : (
                <div className="wo-placeholder">
                  <div className="wo-display-grid" aria-hidden="true" />
                  <div className="wo-standby-page" aria-hidden="true">
                    <div className="wo-standby-header"><span>STARRTREE / PROJECT STUDY</span><span>◯ ◯ ◯</span></div>
                    <div className="wo-standby-art"><span className="wo-big-star">✳</span><span className="wo-standby-ring" /></div>
                    <div className="wo-standby-lines"><b /><i /><i /></div>
                  </div>
                  <div className="wo-preview-cta">
                    <span>INTERACTIVE PROJECT WINDOW</span>
                    <strong>{selected.name}</strong>
                    <button type="button" onClick={() => setLoadFrame(true)}>Load homepage preview <span aria-hidden="true">↗</span></button>
                    <small>The graphic behind this button is an illustrative standby, not a screenshot.</small>
                  </div>
                </div>
              )}
              {loadFrame && <p className="wo-frame-note">Live page requested · Some websites block embedded views. Use “Open website” below if blank.</p>}
            </div>
          </div>
          <div className="wo-feature-detail" aria-live="polite">
            <div><p className="wo-project-type">{selected.category} <span>✦</span> {selected.stage}</p><h3>{selected.name}</h3><p>{selected.description}</p></div>
            <div className="wo-actions">
              <a href={selected.previewUrl} target="_blank" rel="noopener noreferrer">{selected.previewSource === "homepage" ? "Open website" : "Try hosted preview"} ↗</a>
              <a href={selected.repoUrl} target="_blank" rel="noopener noreferrer">View GitHub ↗</a>
            </div>
          </div>
          <p className="wo-verification">
            {selected.previewSource === "homepage"
              ? "Link listed by the GitHub repository. Live availability and embedding have not been independently verified."
              : selected.previewSource === "cname-candidate"
                ? "Domain recorded in GitHub CNAME. Live availability and embedding remain unverified."
                : "GitHub Pages address inferred from the repository. It may be unavailable or show an older build."}
          </p>
        </div>

        <aside className="wo-project-rail" aria-label="Website project selector">
          <div className="wo-rail-heading"><span>SELECT A WEBSITE</span><span>{String(visible.length).padStart(2, "0")} SIGNALS</span></div>
          <div className="wo-projects">
            {visible.map((project, index) => (
              <button key={project.id} type="button" className={"wo-project-tile " + (selected.id === project.id ? "is-active" : "")} aria-pressed={selected.id === project.id} onClick={() => select(project)} style={projectStyle(project)}>
                <span className="wo-tile-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="wo-tile-glyph" aria-hidden="true">✳</span>
                <span className="wo-tile-copy"><strong>{project.name}</strong><small>{project.category} / {project.stage}</small></span>
                <span className="wo-tile-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div className="wo-outro">
        <p><span>✦</span> Not just pages. Places to explore.</p>
        <a href="#/services">Build a website with StarrTree <span aria-hidden="true">↗</span></a>
      </div>
      <p className="wo-disclosure">Portfolio includes studio concepts and prototypes, not exclusively launched or client-approved websites. Live previews load only on request.</p>
    </section>
  );
}
