import { useEffect, useRef, useState } from 'react';
import { cinema } from '../data/cinema';
import { useExperience } from './Experience';

/** A fixed, decorative film; native scroll remains the only navigation input. */
export default function VentureEye() {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const { motion } = useExperience();
  useEffect(() => {
    const film = video.current;
    const branch = root.current?.closest<HTMLElement>('.st-world');
    if (!motion || !ready || !film || !branch || !Number.isFinite(film.duration)) return;
    const end = Math.max(0, film.duration - 0.05);
    let frame = 0;
    let last = 0;
    let target = 0;
    let current = film.currentTime;
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      current += (target - current) * (1 - Math.exp(-10 * dt));
      if (!film.seeking && Math.abs(film.currentTime - current) > 0.025) film.currentTime = current;
      if (Math.abs(current - target) > 0.015 || film.seeking) frame = requestAnimationFrame(tick);
      else { frame = 0; last = 0; }
    };
    const update = () => {
      const rect = branch.getBoundingClientRect();
      const distance = Math.max(1, rect.height - innerHeight);
      target = Math.max(0, Math.min(1, -rect.top / distance)) * end;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    film.pause();
    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    const observer = new ResizeObserver(update);
    observer.observe(branch);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', update);
      removeEventListener('resize', update);
      observer.disconnect();
      film.pause();
    };
  }, [motion, ready]);
  return <div ref={root} className="venture-eye" aria-hidden="true">
    <img src={cinema.venturesPoster} alt="" />
    {motion && <video ref={video} src={cinema.venturesVideo} poster={cinema.venturesPoster} muted playsInline preload="auto"
      onLoadedMetadata={() => setReady(true)} onError={() => setReady(false)} style={{ opacity: ready ? 1 : 0 }} />}
    <div className="venture-eye-shade" />
  </div>;
}
