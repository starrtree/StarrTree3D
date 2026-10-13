import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { createPortal } from 'react-dom';
import { cinema } from '../data/cinema';
import { useExperience } from './Experience';

export default function SeedEntrance({ onComplete, onReveal }: { onComplete: () => void; onReveal: () => void }) {
  const [stage, setStage] = useState<'seed' | 'spark' | 'flight'>('seed');
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const symbol = useRef<HTMLImageElement>(null);
  const flood = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const hasRevealed = useRef(false);
  const { playIntro, completeIntro, stopSound, motion } = useExperience();
  const reveal = () => {
    if (hasRevealed.current) return;
    hasRevealed.current = true;
    setRevealed(true);
    onReveal();
  };
  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    completeIntro(video.current?.currentTime || 0);
    reveal();
    onComplete();
  };
  const play = () => {
    const film = video.current;
    if (!film) return;
    setNeedsGesture(false);
    void playIntro(film).catch(() => { if (!finished.current) setNeedsGesture(true); });
  };
  useEffect(() => {
    dialog.current?.showModal();
    dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();
    return () => dialog.current?.close();
  }, []);
  useEffect(() => {
    if (stage !== 'spark') return;
    const animation = gsap.timeline({ onComplete: () => setStage('flight') });
    animation.to(symbol.current, { scale: 1.65, filter: 'drop-shadow(0 0 70px #fff5c8) brightness(3)', duration: 1.1, ease: 'power2.in' })
      .to(flood.current, { opacity: 1, duration: 0.55 }, 0.65);
    return () => { animation.kill(); };
  }, [stage]);
  useEffect(() => {
    if (stage !== 'flight') return;
    dialog.current?.close();
    const film = video.current;
    play();
    let frame = 0;
    const tick = () => {
      if (film && film.currentTime >= cinema.homeRevealSeconds) reveal();
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
    stopSound();
    if (!motion) { finish(); return; }
    setStage('spark');
  };
  return <>
    {stage === 'flight' && createPortal(<div className={`intro-film-layer ${revealed ? 'is-revealed' : ''}`}>
      <video ref={video} className="entrance-film" src={cinema.introVideo} poster={cinema.flightPoster} playsInline preload="auto" onPlaying={() => setPlaying(true)} onEnded={finish} onError={finish} />
      <div className={`film-white-fade ${playing ? 'has-played' : ''}`} aria-hidden="true" />
      {needsGesture && <div className="film-retry"><button onClick={play}>Play film with sound →</button><button onClick={finish}>Skip film</button></div>}
      {!revealed && !needsGesture && <button className="skip-film" onClick={finish}>Skip film →</button>}
    </div>, document.getElementById('intro-film-host') || document.body)}
    <dialog ref={dialog} className={`seed-entrance stage-${stage}`} aria-label="Collect the StarrSeed" onCancel={e => { e.preventDefault(); finish(); }}>
      <div className="seed-content">
        <button className="seed-collect" onClick={begin} disabled={stage === 'spark'} aria-label="Collect the StarrSeed and play the entrance film with sound">
          <span className="seed-aura" aria-hidden="true" />
          <img ref={symbol} src={cinema.seed} alt="" style={{ maskImage: `url(${cinema.seed})`, maskMode: 'luminance', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
          <span>Collect the StarrSeed <span aria-hidden="true">↗</span></span>
        </button>
      </div>
      <div ref={flood} className="seed-flood" aria-hidden="true" />
    </dialog>
  </>;
}
