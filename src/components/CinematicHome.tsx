import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { worlds, type World } from '../data/content';
import { planets } from '../data/planets';
import ScrollJourney from './ScrollJourney';
import { cinema } from '../data/cinema';
import { useExperience } from './Experience';
// Follow the actual positions around StarrX, starting at the crown.
const ignitionOrder = ['wisdom', 'ventures', 'education', 'art', 'web', 'ai', 'music'];
const ignitionParticles = Array.from({ length: 12 }, (_, index) => {
  const angle = index * Math.PI / 6;
  const radius = 42 + (index % 3) * 14;
  return { '--spark-x': `${Math.cos(angle) * radius}px`, '--spark-y': `${Math.sin(angle) * radius}px` } as CSSProperties;
});
export default function CinematicHome({ onAbout, active, introPlaying = false }: { onAbout: () => void; active: boolean; introPlaying?: boolean }) {
  const [selected, setSelected] = useState<World | null>(null);
  const [launch, setLaunch] = useState({ x: 50, y: 50, size: 72 });
  const returnFocus = useRef<HTMLElement | null>(null);
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const origin = useRef<HTMLElement>(null);
  const [mobile, setMobile] = useState(() => matchMedia('(max-width:700px)').matches);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [artSize, setArtSize] = useState({width:1280,height:720});
  const { motion } = useExperience();
  useEffect(() => {
    const images = root.current?.querySelectorAll('.chakra-planet img');
    return () => { if (images) gsap.killTweensOf(images); };
  },[]);
  useEffect(() => {
    if (!active || !motion) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo('.origin-interlude picture',{yPercent:-8,filter:'brightness(.55) saturate(.7)'},{yPercent:8,filter:'brightness(1) saturate(1.1)',ease:'none',scrollTrigger:{trigger:origin.current,start:'top bottom',end:'bottom top',scrub:.6}});
      gsap.fromTo('.origin-interlude>div',{opacity:.2,y:50},{opacity:1,y:0,scrollTrigger:{trigger:origin.current,start:'top 80%',end:'top 25%',scrub:.5}});
    },origin);
    return () => context.revert();
  },[active,motion]);
  useEffect(() => {
    const media = matchMedia('(max-width:700px)');
    const change = () => setMobile(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  },[]);
  useEffect(() => {
    if (!stage.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const ratio = mobile ? 720/1280 : 1280/720;
      const width = Math.min(entry.contentRect.width,entry.contentRect.height*ratio);
      setArtSize({width,height:width/ratio});
    });
    observer.observe(stage.current);
    return () => observer.disconnect();
  },[mobile]);
  const choose = (world:World, target?:HTMLElement) => {
    returnFocus.current = target || null;
    const rect = target?.querySelector('img')?.getBoundingClientRect() || target?.getBoundingClientRect();
    if (rect) setLaunch({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, size: rect.width });
    setSelected(world);
  };
  const close = () => { setSelected(null); requestAnimationFrame(() => returnFocus.current?.focus()); };
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event:KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const link = document.querySelector<HTMLElement>('.branch-expansion-content a');
        const exit = document.querySelector<HTMLElement>('.branch-expansion-close');
        if (!link || !exit) return;
        if (event.shiftKey && document.activeElement === link) { event.preventDefault(); exit.focus(); }
        else if (!event.shiftKey && document.activeElement === exit) { event.preventDefault(); link.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); };
  }, [selected]);
  useEffect(() => {
    if (!active || !motion || introPlaying || mobile || videoFailed) { video.current?.pause(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) void video.current?.play().catch(() => setVideoFailed(true));
      else video.current?.pause();
    });
    if (root.current) observer.observe(root.current);
    const visibility = () => { if (document.hidden) video.current?.pause(); else void video.current?.play().catch(() => {}); };
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); video.current?.pause(); };
  }, [active, motion, introPlaying, mobile, videoFailed]);
  useEffect(() => {
    if (!active || !motion) return;
    const context = gsap.context(() => {
      gsap.from('.universe-title', { opacity: 0, y: 24, duration: 1.5, delay: 0.3 });
    }, root);
    return () => context.revert();
  }, [active, motion, introPlaying]);
  const useFilm = introPlaying || (motion && !mobile && !videoFailed && videoPlaying);
  return <>
    <section ref={root} className={`universe chakra-home ${active ? 'planets-live' : ''} ${motion ? '' : 'motion-paused'}`} aria-label="Explore the StarrTree universe">
      <div ref={stage} className="home-stage"><div className="home-art-plane" style={{width:artSize.width,height:artSize.height}}>
      <picture className="home-planet-backdrop"><source media="(max-width: 700px)" srcSet={cinema.mobilePoster} /><img src={cinema.homePoster} alt="StarrX radiates golden light beneath seven luminous worlds" /></picture>
      {motion && !mobile && !videoFailed && <video className="home-loop" ref={video} src={cinema.homeVideo} muted playsInline loop preload="auto" onPlaying={() => setVideoPlaying(true)} onError={() => setVideoFailed(true)} aria-hidden="true" style={{opacity:useFilm ? 1 : 0}} />}
      <div id="intro-film-host" />
      {worlds.map(world => {
        const planet = planets[world.id], [x,y,size] = mobile ? planet.mobile : useFilm ? planet.film : planet.desktop;
        return <button key={world.id} className={`chakra-planet ${selected?.id===world.id ? 'is-selected' : ''}`} style={{left:`${x}%`,top:`${y}%`,width:`${size}%`,'--world':world.color,'--birth-delay':`${ignitionOrder.indexOf(world.id) * 110}ms`} as CSSProperties} onClick={(event) => choose(world,event.currentTarget)} aria-label={`Explore ${world.title}`} aria-pressed={selected?.id===world.id} aria-controls="selected-world"><i className="planet-ignition" aria-hidden="true">{ignitionParticles.map((style,index)=><b key={index} style={style} />)}</i><img src={planet.src} alt="" width="512" height="512" loading="eager" decoding="async" /><span>{world.title}</span></button>;
      })}
      </div></div>
      <div className="universe-shade" />
      <div className="universe-coordinate">MAX STARR <span>ENGINEER · ARTIST · EDUCATOR</span></div>
      <button className="human-at-center" onClick={onAbout}><span>STARRX</span><small>THE HUMAN AT THE CENTER ↗</small></button>
      <div className="universe-title"><p className="cinema-eyebrow">ROOTED ON EARTH. REACHING FOR THE STARS.</p><h1>STARRTREE</h1><p>A Light that Grows through its Darkness.<br className="mobile-only" /> A Life that Shines through its Branches.</p></div>
      <div className="universe-bottom"><span>SEVEN WORLDS. ONE LIVING ROOT.</span><a href="#/services">WORK WITH MAX <span>↗</span></a></div>
    </section>
    <nav className="planet-legend" aria-label="Seven branches">{worlds.map(world=><button key={world.id} onClick={(event)=>choose(world,event.currentTarget)} aria-pressed={selected?.id===world.id} style={{'--world':world.color} as CSSProperties}><img src={planets[world.id].src} alt="" width="48" height="48" /><span><small>BRANCH {world.number}</small>{world.title}</span><b>↗</b></button>)}</nav>
    <section id="selected-world" className="world-selection"><div><p className="cinema-eyebrow">FOLLOW YOUR CURIOSITY</p><h2>Choose a world. <em>See what grows.</em></h2></div><a href="#/items" className="st-secondary">Or find something directly ↗</a>
    </section>
    {selected && createPortal(<div className={`branch-expansion branch-expansion-${selected.id} ${motion ? '' : 'motion-paused'}`} role="dialog" aria-modal="true" aria-labelledby="expanded-branch-title" style={{'--world':selected.color,'--launch-x':`${launch.x}px`,'--launch-y':`${launch.y}px`,'--launch-size':`${launch.size}px`} as CSSProperties}>
      <button className="branch-expansion-shade" onClick={close} aria-label="Close expanded branch" />
      <div className="branch-expansion-scene" aria-hidden="true"><img className="branch-expansion-tree" src={`/branches/${selected.id}.webp`} alt="" /><img className="branch-expansion-planet" src={planets[selected.id].src} alt="" /></div>
      <div className="branch-expansion-content"><p className="cinema-eyebrow">BRANCH {selected.number} · {selected.chakra.toUpperCase()}</p><h2 id="expanded-branch-title">{selected.title}</h2><p>{selected.short}</p><a className="st-primary" href={`#/world/${selected.id}`}>Enter this branch <span>→</span></a></div>
      <button className="branch-expansion-close" onClick={close} aria-label="Close expanded branch" autoFocus>×</button>
    </div>,document.body)}
    <ScrollJourney />
    <section ref={origin} id="after-journey" tabIndex={-1} className="origin-interlude"><picture><source media="(max-width:700px)" srcSet={cinema.originMobile}/><img src={cinema.originDesktop} alt="StarrX, rooted in a universe of possibility" loading="lazy" /></picture><div><p className="cinema-eyebrow">THE HUMAN AT THE CENTER</p><h2>Many branches.<br /><em>One imagination.</em></h2><button className="st-primary" onClick={onAbout}>Meet Max Starr ↗</button></div></section>
    <section className="studio-teaser">
      <img className="studio-teaser-art" src={cinema.sanctuary} alt="StarrX in a luminous sanctuary of roots, water and starlight" loading="lazy" />
      <div><p className="cinema-eyebrow">ART & MEDIA × MUSIC & SOUND</p><a href="#/world/art" aria-label="Enter StarrVerse Studios"><img className="studio-wordmark" src={cinema.studioLogo} alt="StarrVerse Studios" loading="lazy" /></a><p>One imagination.<br /><em>Every form of expression.</em></p><a className="st-primary" href="#/world/art">Enter the studio →</a><a className="st-secondary" href="#/world/music">Follow the sound ↗</a></div>
    </section>
  </>;
}
