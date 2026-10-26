import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cinema } from '../data/cinema';
import { useExperience } from './Experience';

type Stage = 'seed' | 'grow' | 'flight';
export default function SeedEntrance({ onComplete, onReveal }: { onComplete: () => void; onReveal: () => void }) {
  const [stage, setStage] = useState<Stage>('seed');
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [wash, setWash] = useState(0);
  const [needsGesture, setNeedsGesture] = useState(false);
  // Keep one orientation for this playthrough, even if the phone rotates.
  const [mobile] = useState(() => matchMedia('(max-width:700px)').matches);
  const dialog = useRef<HTMLDialogElement>(null);
  const growth = useRef<HTMLVideoElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const hasRevealed = useRef(false);
  const { startSound, primeAudio, effect, motion } = useExperience();
  const reveal = () => {
    if (hasRevealed.current) return;
    hasRevealed.current = true;
    setRevealed(true);
    effect('arrival');
    onReveal();
  };
  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    growth.current?.pause();
    video.current?.pause();
    reveal();
    onComplete();
  };
  const enterFlight = () => { setPlaying(false); setStage('flight'); };
  const play = () => {
    const film = stage === 'grow' ? growth.current : video.current;
    if (!film) return;
    setNeedsGesture(false);
    void film.play().catch(() => { if (!finished.current) setNeedsGesture(true); });
  };
  useEffect(() => {
    const modal = dialog.current;
    modal?.showModal();
    modal?.querySelector<HTMLButtonElement>('button')?.focus();
    return () => modal?.close();
  }, []);
  useEffect(() => {
    if (stage === 'seed') return;
    dialog.current?.close();
    play();
    const film = stage === 'grow' ? growth.current : video.current;
    if (film?.error) { if (stage === 'grow') enterFlight(); else finish(); return; }
    let frame = 0;
    // Media time, rather than wall-clock time, handles buffering and seeking.
    const tick = () => {
      if (stage === 'flight' && film && film.currentTime >= cinema.homeRevealSeconds) { reveal(); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const leave = () => finish();
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') finish(); };
    addEventListener('hashchange', leave);
    addEventListener('keydown', escape);
    return () => { film?.pause(); cancelAnimationFrame(frame); removeEventListener('hashchange', leave); removeEventListener('keydown', escape); };
  }, [stage]);
  useEffect(() => { if (!motion && stage !== 'seed') finish(); }, [motion]);
  const begin = () => {
    primeAudio();
    startSound();
    if (!motion) { finish(); return; }
    setStage('grow');
  };
  return <>
    {createPortal(<div className={`intro-film-layer stage-${stage} ${revealed ? 'is-revealed' : ''}`} style={{ visibility: stage === 'seed' ? 'hidden' : undefined }}>
      <video ref={growth} className={`entrance-film seed-growth-film ${stage === 'grow' ? 'is-current' : ''}`} src={mobile ? cinema.seedGrowMobile : cinema.seedGrowDesktop} muted playsInline preload="auto" onTimeUpdate={event => { const film = event.currentTarget; if (Number.isFinite(film.duration)) setWash(Math.min(1,Math.max(0,(film.currentTime - film.duration + .6) / .6))); }} onEnded={enterFlight} onError={() => { if (stage === 'grow') enterFlight(); }} />
      <video ref={video} className={`entrance-film starrx-flight-film ${stage === 'flight' ? 'is-current' : ''}`} src={cinema.introVideo} poster={cinema.flightPoster} muted playsInline preload="auto" onPlaying={() => setPlaying(true)} onTimeUpdate={() => { if (video.current && video.current.currentTime >= cinema.homeRevealSeconds) reveal(); }} onEnded={finish} onError={() => { if (stage === 'flight') finish(); }} />
      {stage === 'grow' && <div className="seed-to-starrx-light" style={{ opacity: wash }} aria-hidden="true" />}
      {stage === 'flight' && <><div className={`film-white-fade ${playing ? 'has-played' : ''}`} aria-hidden="true" />{!revealed && <h1 className="intro-wordmark">STARRTREE</h1>}</>}
      {needsGesture && <div className="film-retry"><button onClick={play}>Continue film →</button><button onClick={finish}>Skip film</button></div>}
    </div>, document.getElementById('intro-film-host') || document.body)}
    <dialog ref={dialog} className="seed-entrance" aria-label="Collect the StarrSeed" onCancel={event => { event.preventDefault(); finish(); }}>
      <video className="seed-draw-film" src={mobile ? cinema.seedDrawMobile : cinema.seedDrawDesktop} autoPlay={motion} muted playsInline preload="auto" onLoadedMetadata={event => { if (!motion) event.currentTarget.currentTime = Math.max(0,event.currentTarget.duration - .1); }} />
      <button className="seed-collect seed-video-collect" onClick={begin} aria-label="Collect the StarrSeed and enter StarrTree"><span>Collect the StarrSeed ↗</span></button>
    </dialog>
  </>;
}
