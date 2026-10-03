import {
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
  type CSSProperties,
  type ReactNode,
} from "react";
import { worlds, items, type Item, type World } from "./data/content";
import catalog from "../app/commerce-catalog.json";
import { ServiceCard } from "../app/CommerceCatalog";
import { EPFeature, MyPOVFeature } from "../app/ReleasePromotion";
import StarrFruit from "./components/StarrFruit";
const MusicCatalog = lazy(() => import("../app/MusicCatalog"));
const UnreleasedVault = lazy(() => import("../app/UnreleasedVault"));
const tone = (color: string) => ({ "--tone": color }) as CSSProperties;
function Poster({ world, large = false }: { world: World; large?: boolean }) {
  return (
    <div className={`st-sculpture ${large ? "is-large" : ""}`}>
      <StarrFruit worldId={world.id} color={world.color} large={large} />
    </div>
  );
}
function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef(document.activeElement as HTMLElement | null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      requestAnimationFrame(() => {
        if (previousFocus.current?.isConnected) previousFocus.current.focus();
      });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="st-dialog"
      aria-label={title}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
    >
      <div className="st-dialog-bar">
        <span>{title}</span>
        <button onClick={onClose} aria-label="Close detail">
          Close ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
function ItemDetail({ item, onClose }: { item: Item; onClose: () => void }) {
  const service = catalog.find((s) => s.id === item.serviceId);
  const world = worlds.find((w) => w.id === item.worldId)!;
  return (
    <Dialog title={item.title} onClose={onClose}>
      <div className="st-detail" style={tone(world.color)}>
        <p className="st-kicker">
          {world.title} / {item.kind}
        </p>
        <span className="st-status">{item.status}</span>
        {service ? (
          <>
            <p className="st-test-notice">
              TEST MODE · No real payments or confirmed bookings. Google
              Calendar is the availability source of truth.
            </p>
            <ServiceCard service={service} />
          </>
        ) : (
          <>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            {item.image && !item.feature && (
              <img
                className="st-detail-image"
                src={item.image}
                alt={item.title}
              />
            )}
          </>
        )}
        {item.feature === "ep" && <EPFeature />}
        {item.feature === "mypov" && <MyPOVFeature />}
        <Suspense fallback={<p role="status">Opening the music archive…</p>}>
          {item.feature === "catalog" && <MusicCatalog />}
          {item.feature === "vault" && <UnreleasedVault />}
        </Suspense>
        {item.feature === "gallery" && (
          <div className="st-art-gallery">
            {[
              "origin-portrait",
              "tree-crown",
              "chakra-bloom",
              "cosmic-profile",
              "constellation-maker",
              "world-tree",
              "touch-the-orb",
              "awakening-bloom",
              "portal-flight",
              "tree-eye",
              "starborn",
              "blue-orb",
            ].map((name) => (
              <img
                key={name}
                src={`/images/${name}.webp`}
                loading="lazy"
                alt={name.replaceAll("-", " ")}
              />
            ))}
          </div>
        )}
        {item.href && !["ep", "mypov"].includes(item.feature || "") && (
          <a
            className="st-primary"
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.cta || "Explore"} ↗
          </a>
        )}
        {!service && !item.href && !item.feature && (
          <a
            className="st-primary"
            href={`mailto:hello@starrtree.org?subject=${encodeURIComponent(item.title + " — enquiry")}`}
          >
            Ask about{" "}
            {item.kind === "Service" ? "this service" : "this project"} ↗
          </a>
        )}
      </div>
    </Dialog>
  );
}
function ItemCard({ item, onOpen }: { item: Item; onOpen: (i: Item) => void }) {
  const world = worlds.find((w) => w.id === item.worldId)!;
  const service = catalog.find((s) => s.id === item.serviceId);
  return (
    <button
      className="st-item"
      onClick={() => onOpen(item)}
      style={tone(world.color)}
    >
      <span className="st-item-meta">
        {item.kind}
        <span>{world.title}</span>
      </span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <span className="st-item-bottom">
        <span>{service?.price || item.status}</span>
        <b aria-hidden="true">↗</b>
      </span>
    </button>
  );
}
function WorldPage({
  world,
  onOpen,
}: {
  world: World;
  onOpen: (i: Item) => void;
}) {
  const [filter, setFilter] = useState("All");
  const own = items.filter((i) => i.worldId === world.id);
  const kinds = ["All", ...new Set(own.map((i) => i.kind))];
  return (
    <section className="st-world" style={tone(world.color)}>
      <a className="st-back" href="#/">
        ← All seven worlds
      </a>
      <div className="st-world-hero">
        <div>
          <p className="st-kicker">
            STARRFRUIT {world.number} / {world.chakra}
          </p>
          <h1>{world.title}</h1>
          <p className="st-world-lead">{world.short}</p>
          <p className="st-description">{world.description}</p>
          <div className="st-world-meta">
            <span>{own.length} destinations</span>
            <span>{world.frequency} Hz · symbolic</span>
          </div>
          {world.id === "music" && (
            <button
              className="st-primary"
              onClick={() => onOpen(items.find((i) => i.feature === "ep")!)}
            >
              Listen to Sharks & Starrs ↗
            </button>
          )}
        </div>
        <div className="st-world-art">
          <Poster world={world} large />
          <span className="st-art-caption">
            {world.id === "music"
              ? "SOUND BECOMES A WORLD"
              : "ONE BRANCH. MANY POSSIBILITIES."}
          </span>
        </div>
      </div>
      {world.id === "music" && (
        <div className="st-music-feature">
          <img
            src="/images/releases/sharks-starrs.jpg"
            alt="Sharks & Starrs EP cover"
          />
          <div>
            <p className="st-kicker">MAX STARR / FEATURED RELEASE</p>
            <h2>Sharks &amp; Starrs</h2>
            <p>7 tracks. MyPOV + 6 more.</p>
            <div className="st-sound-bars" aria-hidden="true">
              {Array.from({ length: 34 }, (_, n) => (
                <i key={n} style={{ height: 8 + ((n * 17) % 31) }} />
              ))}
            </div>
          </div>
          <div className="st-music-actions">
            <button
              className="st-primary"
              onClick={() => onOpen(items.find((i) => i.feature === "mypov")!)}
            >
              Watch MyPOV ↗
            </button>
            <button
              className="st-secondary"
              onClick={() =>
                onOpen(items.find((i) => i.feature === "catalog")!)
              }
            >
              Explore the catalog →
            </button>
          </div>
        </div>
      )}
      <div className="st-section-heading">
        <h2>Inside this world</h2>
        <span>Choose a destination to go deeper</span>
      </div>
      <div className="st-filters" aria-label="Filter destinations">
        {kinds.map((k) => (
          <button
            key={k}
            aria-pressed={filter === k}
            onClick={() => setFilter(k)}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="st-items">
        {own
          .filter((i) => filter === "All" || i.kind === filter)
          .map((i) => (
            <ItemCard key={i.id} item={i} onOpen={onOpen} />
          ))}
      </div>
      <nav className="st-world-switch" aria-label="Other worlds">
        {worlds
          .filter((w) => w.id !== world.id)
          .map((w) => (
            <a key={w.id} href={`#/world/${w.id}`}>
              {w.title} ↗
            </a>
          ))}
      </nav>
    </section>
  );
}
export default function App() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || "/");
  const [selected, setSelected] = useState<World | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [about, setAbout] = useState(false);
  const [intro, setIntro] = useState(() => {
    try {
      return !sessionStorage.getItem("starrtree:welcome:v2");
    } catch {
      return true;
    }
  });
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("All");
  const [worldFilter, setWorldFilter] = useState("All");
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () => setRoute(location.hash.slice(1) || "/");
    addEventListener("hashchange", update);
    return () => removeEventListener("hashchange", update);
  }, []);
  const world = worlds.find((w) => route === `/world/${w.id}`);
  const home = route === "/";
  const services = route === "/services";
  useEffect(() => {
    setItem(null);
    setKind("All");
    setWorldFilter("All");
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [route]);
  const leaveIntro = () => {
    setIntro(false);
    try {
      sessionStorage.setItem("starrtree:welcome:v2", "1");
    } catch {}
  };
  const found = items.filter(
    (i) =>
      (!services || i.kind === "Service" || i.kind === "Product") &&
      (kind === "All" || i.kind === kind) &&
      (worldFilter === "All" || i.worldId === worldFilter) &&
      `${i.title} ${i.description} ${i.kind} ${i.status} ${worlds.find((w) => w.id === i.worldId)?.title}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <div className="st-app">
      <a
        href="#st-main"
        className="st-skip"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="st-header">
        <a href="#/" className="st-brand" aria-label="StarrTree home">
          <img src="/images/starrtree-gold-logo.png" alt="" />
          <span>
            STARRTREE<small>THE CREATIVE ECOSYSTEM</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#/" aria-current={home ? "page" : undefined}>
            Explore
          </a>
          <a href="#/services" aria-current={services ? "page" : undefined}>
            Services
          </a>
          <a
            href="#/items"
            aria-current={route === "/items" ? "page" : undefined}
          >
            All Items
          </a>
          <a
            className="st-search-link"
            href="#/search"
            aria-current={route === "/search" ? "page" : undefined}
          >
            <span aria-hidden="true">⌕</span> Search
          </a>
        </nav>
      </header>
      <main id="st-main" ref={main} tabIndex={-1} className="st-main">
        {home ? (
          <>
            <div className="st-home-heading">
              <div>
                <p className="st-kicker">
                  ROOTED ON EARTH. REACHING FOR THE STARS.
                </p>
                <h1>
                  Seven worlds.
                  <br />
                  <em>One living root.</em>
                </h1>
                <p className="st-original">
                  A Light that Grows through its Darkness...
                  <br />A Life that Shines through its Branches...
                </p>
                <p className="st-home-description">
                  Music shapes the storytelling. Engineering makes it real.
                  Education makes it useful. AI helps it scale.
                </p>
                <a className="st-text-link" href="#/services">
                  Have something in mind? Find a service ↗
                </a>
              </div>
              <div
                className="st-constellation"
                aria-label="Explore seven StarrFruit worlds"
              >
                <div className="st-orbit st-orbit-one" />
                <div className="st-orbit st-orbit-two" />
                <button className="st-center" onClick={() => setAbout(true)}>
                  <img
                    src="/images/starrtree-gold-logo.png"
                    alt="Original StarrTree symbol"
                  />
                  <strong>
                    M<span>✦</span>X
                  </strong>
                  <small>STARRX / THE HUMAN AT THE CENTER</small>
                </button>
                {worlds.map((w, n) => (
                  <button
                    key={w.id}
                    className={`st-fruit-node st-node-${n} ${selected?.id === w.id ? "is-selected" : ""}`}
                    style={tone(w.color)}
                    aria-pressed={selected?.id === w.id}
                    onClick={() => setSelected(w)}
                  >
                    <Poster world={w} />
                    <span className="st-node-number">{w.number}</span>
                    <strong>{w.title}</strong>
                    <small>
                      {w.chakra} · {w.frequency} Hz
                    </small>
                  </button>
                ))}
              </div>
            </div>
            <div
              className="st-selection"
              aria-live="polite"
              style={tone(selected?.color || "#dec598")}
            >
              <div>
                <p className="st-kicker">
                  {selected
                    ? `SELECTED WORLD / ${selected.number}`
                    : "EXPLORE THE STARR SYSTEM"}
                </p>
                <h2>
                  {selected?.title || "Choose a StarrFruit. Follow the light."}
                </h2>
                <p>
                  {selected?.short ||
                    "Seven branches of one creative ecosystem. Select a world above, then step inside."}
                </p>
              </div>
              {selected ? (
                <a className="st-primary" href={`#/world/${selected.id}`}>
                  Enter {selected.title} →
                </a>
              ) : (
                <a className="st-primary" href="#/items">
                  Find something directly ↗
                </a>
              )}
            </div>
            <div className="st-home-foot">
              <span>IMAGINATION ↔ INVENTION</span>
              <button onClick={() => setAbout(true)}>Meet Max Starr ↗</button>
              <span>Sound off until you press play</span>
            </div>
          </>
        ) : world ? (
          <WorldPage key={world.id} world={world} onOpen={setItem} />
        ) : (
          <section className="st-directory">
            <a className="st-back" href="#/">
              ← Explore the worlds
            </a>
            <p className="st-kicker">THE DIRECT PATH</p>
            <h1>
              {services
                ? "Let’s make something real."
                : route === "/search"
                  ? "What are you looking for?"
                  : "Everything, within reach."}
            </h1>
            <p>
              {services
                ? "Websites, creative work, AI systems and sessions. Open an offering for scope, price and next steps."
                : "Search across services, releases, creative work and ideas taking shape."}
            </p>
            <div className="st-search-controls">
              <label>
                Search
                <input
                  autoFocus={route === "/search"}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try website, recording, AI, MyPOV…"
                />
              </label>
              <label>
                World
                <select
                  value={worldFilter}
                  onChange={(e) => setWorldFilter(e.target.value)}
                >
                  <option value="All">All worlds</option>
                  {worlds.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Type
                <select value={kind} onChange={(e) => setKind(e.target.value)}>
                  <option>All</option>
                  {(services
                    ? ["Service", "Product"]
                    : [
                        "Service",
                        "Product",
                        "Release",
                        "Portfolio",
                        "Venture",
                        "Concept",
                      ]
                  ).map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </label>
            </div>
            <p className="st-result-count" role="status">
              {found.length}{" "}
              {found.length === 1 ? "destination" : "destinations"}
            </p>
            {found.length ? (
              <div className="st-items">
                {found.map((i) => (
                  <ItemCard key={i.id} item={i} onOpen={setItem} />
                ))}
              </div>
            ) : (
              <div className="st-empty">
                <h2>No matching destinations yet.</h2>
                <button
                  className="st-primary"
                  onClick={() => {
                    setQuery("");
                    setWorldFilter("All");
                    setKind("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        )}
      </main>
      <footer className="st-footer">
        <a href="#/">STARRTREE</a>
        <span>One creation unlocks the next.</span>
        <small>Frequencies are symbolic. No healing claims.</small>
        <button onClick={() => setIntro(true)}>Replay welcome</button>
      </footer>
      {item && <ItemDetail item={item} onClose={() => setItem(null)} />}
      {about && (
        <Dialog title="Max Starr / StarrX" onClose={() => setAbout(false)}>
          <div className="st-detail st-about">
            <img
              src="/images/origin-portrait.webp"
              alt="Max Starr beside a luminous cosmic node"
            />
            <p className="st-kicker">THE HUMAN AT THE CENTER</p>
            <h2>
              Many branches.
              <br />
              The same root.
            </h2>
            <p>
              StarrTree is what happens when the branches stop competing and
              start feeding the same root.
            </p>
            <p>
              Max/StarrX is the bridge between rooted life and spiritual
              possibility: an inverse star illuminating the creations and people
              around him.
            </p>
            <p>Creative engineer · Educator · Artist</p>
            <a
              className="st-primary"
              href="https://max-starr-bio.mastarrmindx.chatgpt.site/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Max’s biography ↗
            </a>
          </div>
        </Dialog>
      )}
      {intro && (
        <Dialog title="Welcome to StarrTree" onClose={leaveIntro}>
          <div className="st-welcome">
            <p className="st-kicker">WELCOME TO THE</p>
            <img
              src="/images/starrtree-gold-logo.png"
              alt="The original StarrTree logo"
            />
            <h2>STARRTREE</h2>
            <p>The Light that Grows through Darkness</p>
            <button className="st-primary" onClick={leaveIntro}>
              ✦ Spark the Seed
            </button>
            <button className="st-welcome-skip" onClick={leaveIntro}>
              Explore the seven worlds →
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
