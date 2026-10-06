import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinema } from '../data/cinema';
import { useExperience } from './Experience';
gsap.registerPlugin(ScrollTrigger);
export default function StudioArrival() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const idle = useRef<HTMLVideoElement>(null);
  const still = useRef<HTMLImageElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<'opening' | 'scroll'>('opening');
  const { motion } = useExperience();
  useEffect(() => {
    if (!motion || !ready || !video.current) return;
    const film = video.current;
    const halfway = Math.min(cinema.studioOpeningSeconds, film.duration / 2);
    const end = film.duration - 0.08;
    let takeover = false;
    let idlePlaying = false;
    let inView = true;
    let previousScroll = window.scrollY;
    let progress = 0;
    const physics = { time: halfway, velocity: 0, target: halfway };
    const setStill = gsap.quickSetter(still.current, 'opacity');
    const setBar = gsap.quickSetter(bar.current, 'scaleX');
    const enterScroll = () => {
      if (takeover) return;
      takeover = true;
      film.pause();
      physics.time = Math.min(film.currentTime, halfway);
      physics.target = halfway + progress * (end - halfway);
      setPhase('scroll');
    };
    const trigger = ScrollTrigger.create({
      trigger: root.current, start: 'top top', end: 'bottom bottom',
      onToggle: self => { inView = self.isActive; },
      onUpdate: self => {
        progress = Math.min(1, self.progress / 0.62);
        physics.target = halfway + progress * (end - halfway);
        if (Math.abs(window.scrollY - previousScroll) > 4) enterScroll();
        previousScroll = window.scrollY;
      },
    });
    const tick = (_time: number, delta: number) => {
      if (!takeover) {
        if (film.currentTime >= halfway) enterScroll();
        setBar(film.currentTime / film.duration);
        return;
      }
      // Bounded damped spring. Native scroll drives a sticky scene; overlays travel independently.
      const dt = Math.min(delta / 1000, 0.035);
      physics.velocity += (physics.target - physics.time) * 95 * dt;
      physics.velocity *= Math.exp(-18 * dt);
      physics.time = Math.max(0, Math.min(end, physics.time + physics.velocity * dt));
      if (!film.seeking && Math.abs(film.currentTime - physics.time) > 0.025) film.currentTime = physics.time;
      setBar(physics.time / film.duration);
      const showIdle = progress >= 0.995 && Math.abs(physics.time - end) < 0.08;
      const loop = idle.current;
      if (loop) {
        if (showIdle && inView && !idlePlaying) {
          idlePlaying = true;
          void loop.play().catch(() => { idlePlaying = false; });
        } else if ((!showIdle || !inView) && idlePlaying) {
          loop.pause(); idlePlaying = false;
        }
        loop.style.opacity = showIdle && loop.readyState >= 2 ? '1' : '0';
      }
      setStill(showIdle && (!loop || loop.readyState < 2) ? 1 : 0);
    };
    gsap.ticker.add(tick);
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.65 } });
      timeline.fromTo('.studio-arrival-title', { y: 0, scale: 1, opacity: 1 }, { y: -120, scale: 0.8, opacity: 0, duration: 0.35 }, 0);
      timeline.fromTo('.studio-chapter', { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22 }, 0.3)
        .to('.studio-chapter', { y: -70, opacity: 0, duration: 0.2 }, 0.8);
    }, root);
    void film.play().catch(enterScroll);
    return () => { film.pause(); idle.current?.pause(); gsap.ticker.remove(tick); trigger.kill(); context.revert(); };
  }, [motion, ready]);
  return <section ref={root} className={`studio-arrival studio-flow ${motion ? 'is-scrubbed' : ''}`} aria-label="StarrVerse Studios cinematic entrance" data-phase={motion ? phase : 'still'}>
    <div className="studio-sticky">
      <div className="studio-media">
        <img className="studio-base" src={cinema.studioPoster} alt="StarrX rises in front of the cosmic world tree" />
        {motion && <video ref={video} src={cinema.studioVideo} className="studio-film" muted playsInline preload="auto" poster={cinema.studioPoster} onLoadedMetadata={() => setReady(true)} onError={() => setReady(false)} aria-hidden="true" />}
        {motion && <video ref={idle} src={cinema.studioIdleVideo} className="studio-film studio-idle" muted playsInline loop preload="auto" aria-hidden="true" style={{ opacity: 0, zIndex: 2, transition: 'opacity 250ms linear' }} />}
        <img ref={still} className="studio-end" src={cinema.studioPoster} alt="" style={{ opacity: motion ? 0 : 1 }} />
      </div>
      <div className="studio-arrival-shade" />
      <a className="studio-back" href="#/">← The seven worlds</a>
      <div className="studio-arrival-title"><p className="cinema-eyebrow">WELCOME TO</p><img src={cinema.studioLogo} alt="StarrVerse Studios" /><p>Where imagination takes form.</p></div>
      <div className="studio-chapter"><span>ART / SOUND / IMAGINATION</span><h2>Give your vision<br />a universe.</h2><p>Films. Photography. Music. Worlds worth entering.</p></div>
      <div className="studio-scroll-cue"><span>{!motion ? 'THE STUDIO IS OPEN' : phase === 'opening' ? 'THE WORLD IS WAKING · SCROLL TO TAKE OVER' : 'YOUR SCROLL. YOUR JOURNEY.'}</span><button onClick={() => document.getElementById('world-destinations')?.scrollIntoView({ behavior: 'auto' })}>Explore the work ↓</button></div>
      <div className="studio-progress" ref={bar} />
    </div>
  </section>;
}
