import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinema } from '../data/cinema';
import { useExperience } from './Experience';
gsap.registerPlugin(ScrollTrigger);
export default function StudioArrival() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const still = useRef<HTMLImageElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const { motion } = useExperience();
  useEffect(() => {
    if (!motion || !ready || !video.current) return;
    const film = video.current;
    let desired = 0;
    const seek = () => { if (!film.seeking && Math.abs(film.currentTime - desired) > 0.06) film.currentTime = desired; };
    film.addEventListener('seeked', seek);
    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: 'top 80px', end: 'bottom bottom',
      onUpdate: self => {
        desired = self.progress * Math.max(0, film.duration - 0.08);
        seek();
        gsap.set(still.current, { opacity: Math.max(0, (self.progress - 0.9) * 10) });
        gsap.set(bar.current, { scaleX: self.progress });
      },
    });
    return () => { trigger.kill(); film.removeEventListener('seeked', seek); };
  }, [motion, ready]);
  return <section ref={root} className={`studio-arrival ${motion ? 'is-scrubbed' : ''}`} aria-label="StarrVerse Studios cinematic entrance">
    <div className="studio-sticky">
      <img className="studio-base" src={cinema.studioPoster} alt="StarrX rises in front of the cosmic world tree" />
      {motion && <video ref={video} src={cinema.studioVideo} className="studio-film" muted playsInline preload="auto" poster={cinema.studioPoster} onLoadedMetadata={() => setReady(true)} onError={() => setReady(false)} aria-hidden="true" />}
      <img ref={still} className="studio-end" src={cinema.studioPoster} alt="" style={{ opacity: motion ? 0 : 1 }} />
      <div className="studio-arrival-shade" />
      <a className="studio-back" href="#/">← The seven worlds</a>
      <div className="studio-arrival-title"><p className="cinema-eyebrow">WELCOME TO</p><img src={cinema.studioLogo} alt="StarrVerse Studios" /><p>Where imagination takes form.</p></div>
      <div className="studio-scroll-cue"><span>{motion ? 'SCROLL TO RISE' : 'THE STUDIO IS OPEN'}</span><button onClick={() => document.getElementById('world-destinations')?.scrollIntoView({ behavior: 'auto' })}>Explore the work ↓</button></div>
      <div className="studio-progress" ref={bar} />
    </div>
  </section>;
}
