import { useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { worlds, type World } from '../data/content';
import { fruitAssets } from '../data/assets';
import { cinema } from '../data/cinema';
import { useExperience } from './Experience';
export default function CinematicHome({ onAbout, active }: { onAbout: () => void; active: boolean }) {
  const [selected, setSelected] = useState<World | null>(null);
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { motion } = useExperience();
  useEffect(() => {
    if (!active || !motion) { video.current?.pause(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) void video.current?.play().catch(() => {});
      else video.current?.pause();
    });
    if (root.current) observer.observe(root.current);
    const visibility = () => { if (document.hidden) video.current?.pause(); else void video.current?.play().catch(() => {}); };
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); video.current?.pause(); };
  }, [active, motion]);
  useEffect(() => {
    if (!active || !motion) return;
    const context = gsap.context(() => {
      gsap.from('.world-anchor', { opacity: 0, y: 18, stagger: 0.08, duration: 0.9, ease: 'power2.out' });
      gsap.from('.universe-title', { opacity: 0, y: 24, duration: 1.5, delay: 0.3 });
    }, root);
    return () => context.revert();
  }, [active, motion]);
  return <>
    <section ref={root} className={`universe ${motion ? '' : 'motion-paused'}`} aria-label="Explore the StarrTree universe">
      <picture className="universe-backdrop"><source media="(max-width: 700px)" srcSet={cinema.mobilePoster} /><img src={cinema.homePoster} alt="StarrX radiates golden light beneath seven luminous worlds" /></picture>
      {active && motion && <video className="universe-video" ref={video} src={cinema.homeVideo} poster={cinema.homePoster} muted playsInline loop preload="metadata" aria-hidden="true" />}
      <div className="universe-shade" />
      <div className="universe-coordinate">MAX STARR <span>ENGINEER · ARTIST · EDUCATOR</span></div>
      <button className="human-at-center" onClick={onAbout}><span>STARRX</span><small>THE HUMAN AT THE CENTER ↗</small></button>
      <div className="world-anchors" aria-label="Seven worlds">
        {worlds.map((world, index) => <button key={world.id} className={`world-anchor anchor-${index} ${selected?.id === world.id ? 'selected' : ''}`} style={{ '--world': world.color } as CSSProperties} onClick={() => setSelected(world)} aria-pressed={selected?.id === world.id} aria-controls="selected-world">
          <img src={fruitAssets[world.id].poster} alt="" width="100" height="100" />
          <span><small>{world.number} / EXPLORE</small><strong>{world.title}</strong></span><b aria-hidden="true">↗</b>
        </button>)}
      </div>
      <div className="universe-title"><p className="cinema-eyebrow">ROOTED ON EARTH. REACHING FOR THE STARS.</p><h1>STARRTREE</h1><p>A Light that Grows through its Darkness.<br className="mobile-only" /> A Life that Shines through its Branches.</p></div>
      <div className="universe-bottom"><span>SEVEN WORLDS. ONE LIVING ROOT.</span><a href="#/services">WORK WITH MAX <span>↗</span></a></div>
    </section>
    <section id="selected-world" className={`world-selection ${selected ? 'has-selection' : ''}`} style={{ '--world': selected?.color || '#dabb80' } as CSSProperties} aria-live="polite">
      {selected ? <><img src={fruitAssets[selected.id].poster} alt="" /><div><p className="cinema-eyebrow">STARRFRUIT {selected.number} · {selected.frequency} HZ / SYMBOLIC</p><h2>{selected.title}</h2><p>{selected.short}</p></div><a className="st-primary" href={`#/world/${selected.id}`}>Enter this world <span>→</span></a><button className="selection-close" onClick={() => setSelected(null)} aria-label="Close world selection">×</button></> : <><div><p className="cinema-eyebrow">FOLLOW YOUR CURIOSITY</p><h2>Choose a world. <em>See what grows.</em></h2></div><a href="#/items" className="st-secondary">Or find something directly ↗</a></>}
    </section>
    <section className="studio-teaser">
      <img className="studio-teaser-art" src={cinema.studioPoster} alt="StarrX in a luminous sanctuary of roots, water and starlight" loading="lazy" />
      <div><p className="cinema-eyebrow">ART & MEDIA × MUSIC & SOUND</p><img className="studio-wordmark" src={cinema.studioLogo} alt="StarrVerse Studios" loading="lazy" /><p>One imagination.<br /><em>Every form of expression.</em></p><a className="st-primary" href="#/world/art">Enter the studio →</a><a className="st-secondary" href="#/world/music">Follow the sound ↗</a></div>
    </section>
  </>;
}
