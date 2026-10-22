import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinema } from '../data/cinema';
import { useExperience } from './Experience';
gsap.registerPlugin(ScrollTrigger);

/** Native page scroll stays available; only the film is pinned. No wheel interception. */
export default function ScrollJourney() {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [nearby, setNearby] = useState(false);
  const { motion } = useExperience();
  useEffect(() => {
    if (!root.current || !motion) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNearby(true); }, { rootMargin:'700px' });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [motion]);
  useEffect(() => {
    const video = film.current;
    if (!video || !ready || !motion) return;
    let target = 1, time = 1, velocity = 0, visible = false;
    const end = Math.max(1, video.duration - 0.06);
    video.currentTime = 1;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({scrollTrigger:{trigger:root.current,start:'top top',end:'bottom bottom',scrub:0.6,
        onToggle:self => { visible = self.isActive; },
        onUpdate:self => { target = 1 + self.progress * (end - 1); visible = self.isActive; },
      }});
      timeline.fromTo('.journey-copy-0',{autoAlpha:1,y:0},{autoAlpha:0,y:-110,duration:.25},0)
        .fromTo('.journey-copy-1',{autoAlpha:0,y:120},{autoAlpha:1,y:0,duration:.2},.25)
        .to('.journey-copy-1',{autoAlpha:0,y:-100,duration:.2},.55)
        .fromTo('.journey-copy-2',{autoAlpha:0,y:110},{autoAlpha:1,y:0,duration:.22},.76);
    },root);
    const tick = (_time:number, delta:number) => {
      if (document.hidden || (!visible && Math.abs(target-time)<.02)) return;
      const dt = Math.min(delta/1000,.035);
      velocity = (velocity+(target-time)*90*dt)*Math.exp(-18*dt);
      time = Math.max(1,Math.min(end,time+velocity*dt));
      if (!video.seeking && Math.abs(video.currentTime-time)>.025) video.currentTime=time;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); context.revert(); };
  },[ready,motion]);
  return <section ref={root} className={`scroll-journey ${motion && ready ? 'is-ready' : 'is-still'}`} aria-label="From one spark to a universe">
    <div className="journey-sticky">
      <img className="journey-media" src={cinema.journeyPoster} alt="A luminous spark expands through StarrX into a cosmic universe" loading="lazy" />
      {motion && nearby && <video ref={film} className="journey-media" src={cinema.journeyVideo} muted playsInline preload="auto" poster={cinema.journeyPoster} onLoadedMetadata={event => { event.currentTarget.currentTime = 1; }} onSeeked={() => setReady(true)} onError={() => setReady(false)} aria-hidden="true" />}
      <div className="journey-shade" />
      <div className="journey-copy journey-copy-0"><p className="cinema-eyebrow">01 / THE SPARK</p><h2>It starts<br />within.</h2><p>One imagination. Seven ways to bring it to life.</p></div>
      <div className="journey-copy journey-copy-1"><p className="cinema-eyebrow">02 / THE EXPANSION</p><h2>Let the idea<br />become a world.</h2><p>Sound, image, technology and a little curiosity.</p></div>
      <div className="journey-copy journey-copy-2"><p className="cinema-eyebrow">03 / MAKE SOMETHING REAL</p><h2>Where will<br />you take it?</h2><a className="st-primary" href="#/world/art">Enter StarrVerse Studios ↗</a><a className="st-secondary" href="#/services">Build with Max ↗</a></div>
      <span className="journey-cue">{motion && ready ? 'SCROLL TO EXPAND ↓' : 'A UNIVERSE OF POSSIBILITIES'}</span>
      <a className="journey-skip" href="#after-journey" onClick={event=>{event.preventDefault();const next=document.getElementById('after-journey');next?.scrollIntoView({behavior:'instant'});next?.focus({preventScroll:true});}}>Skip this chapter ↓</a>
    </div>
  </section>;
}
