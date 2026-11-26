import { useEffect, useRef, useState } from 'react';
import { cinema } from '../data/cinema';
import { useExperience } from './Experience';

export default function ScrollJourney() {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const { motion } = useExperience();
  const [nearby, setNearby] = useState(false);
  const [failed, setFailed] = useState(false);
  const [chapter, setChapter] = useState(0);
  const scrolling = motion && !failed;

  useEffect(() => {
    const section = root.current;
    if (!section || !motion) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearby(true);
        observer.disconnect();
      }
    }, { rootMargin: '800px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, [motion]);

  useEffect(() => {
    const section = root.current;
    const video = film.current;
    if (!section || !video || !scrolling) return;
    let frame = 0;
    let target = 0;
    // Coalesce touch scrolls while the decoder is busy, then seek the latest target.
    const seek = () => {
      if (!Number.isFinite(video.duration) || video.seeking) return;
      const time = target * Math.max(0, video.duration - 1 / 30);
      if (Math.abs(video.currentTime - time) > 1 / 40) video.currentTime = time;
    };
    const sync = () => {
      frame = 0;
      const box = section.getBoundingClientRect();
      const sticky = section.firstElementChild as HTMLElement;
      target = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - sticky.offsetHeight)));
      section.style.setProperty('--film-progress', String(target));
      setChapter(target < .32 ? 0 : target < .78 ? 1 : 2);
      seek();
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(sync); };
    const resize = new ResizeObserver(update);
    resize.observe(section);
    window.addEventListener('scroll', update, { passive: true });
    video.addEventListener('loadedmetadata', update);
    video.addEventListener('loadeddata', update);
    video.addEventListener('seeked', seek);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', update);
      video.removeEventListener('loadedmetadata', update);
      video.removeEventListener('loadeddata', update);
      video.removeEventListener('seeked', seek);
    };
  }, [nearby, scrolling]);

  const labels = ['The spark', 'Expansion', 'The return'];
  return <section ref={root} className={`scroll-journey ${scrolling ? 'is-ready' : 'is-still'}`} aria-label="From one spark to a universe">
    <div className="journey-sticky">
      <img className="journey-media" src={cinema.journeyPoster} alt="A luminous spark expands through StarrX into a cosmic universe" loading="lazy" />
      {scrolling && nearby && <video ref={film} className="journey-media" muted playsInline preload="auto" poster={cinema.journeyPoster} onError={event => { if (event.target === event.currentTarget) setFailed(true); }} aria-hidden="true">
        <source media="(max-width: 700px)" src="/cinema/journey/portrait.mp4" type="video/mp4" />
        <source media="(max-width: 700px)" src="/cinema/journey/portrait.webm" type="video/webm" />
        <source src={cinema.journeyVideo} type="video/mp4" onError={() => setFailed(true)} />
      </video>}
      <div className="journey-shade" />
      <div className="journey-caption">
        <h2>{labels[scrolling ? chapter : 2]}</h2>
        {scrolling && <><span className="journey-progress" aria-hidden="true"><i /></span><small>Scroll to move through the film</small></>}
        {(!scrolling || chapter === 2) && <nav aria-label="Continue from the film"><a href="#/world/art">Explore art ↗</a><a href="#/services">Build with Max ↗</a></nav>}
      </div>
      <a className="journey-skip" href="#after-journey" onClick={event => {
        event.preventDefault();
        const next = document.getElementById('after-journey');
        next?.scrollIntoView({ behavior: 'instant' });
        next?.focus({ preventScroll: true });
      }}>Skip film ↓</a>
    </div>
  </section>;
}
