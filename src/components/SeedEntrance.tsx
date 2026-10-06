import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { createPortal } from 'react-dom';
import { cinema } from '../data/cinema';
import { useExperience } from './Experience';
export default function SeedEntrance({ onComplete, onReveal }: { onComplete: () => void; onReveal: () => void }) {
  const [stage, setStage] = useState<'seed' | 'spark' | 'flight'>('seed');
  const [revealed, setRevealed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const symbol = useRef<HTMLImageElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const hasRevealed = useRef(false);
  const { startSound, stopSound, effect, motion } = useExperience();
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
    reveal();
    onComplete();
  };
  useEffect(() => { dialog.current?.showModal(); dialog.current?.querySelector<HTMLElement>('h1')?.focus(); return () => dialog.current?.close(); }, []);
  useEffect(() => {
    if (stage !== 'spark') return;
    const animation = gsap.to(symbol.current, { filter: 'hue-rotate(70deg) drop-shadow(0 0 36px #edc064)', scale: 1.08, duration: motion ? 1.1 : 0, onComplete: () => motion ? setStage('flight') : finish() });
    return () => { animation.kill(); };
  }, [stage]);
  useEffect(() => {
    if (stage !== 'flight') return;
    dialog.current?.close();
    const film = video.current;
    if (!film) return;
    void film.play().catch(finish);
    let frame = 0;
    const tick = () => {
      if (film.currentTime >= cinema.homeRevealSeconds) reveal();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const leave = () => finish();
    addEventListener('hashchange', leave);
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') finish(); };
    addEventListener('keydown', escape);
    return () => { cancelAnimationFrame(frame); removeEventListener('hashchange', leave); removeEventListener('keydown', escape); };
  }, [stage]);
  useEffect(() => { if (!motion && stage === 'flight') finish(); }, [motion]);
  const begin = (withSound: boolean) => {
    if (withSound) { startSound(); effect('seed'); } else stopSound();
    setStage('spark');
  };
  return <>
    {stage === 'flight' && createPortal(<div className={`intro-film-layer ${revealed ? 'is-revealed' : ''}`}>
      <video ref={video} className="entrance-film" src={cinema.introVideo} poster={cinema.flightPoster} muted playsInline autoPlay onEnded={finish} onError={finish} />
      {!revealed && <button className="skip-film" onClick={finish}>Skip film →</button>}
    </div>, document.getElementById('intro-film-host') || document.body)}
    <dialog ref={dialog} className={`seed-entrance stage-${stage}`} aria-label="Welcome to StarrTree" onCancel={e => { e.preventDefault(); finish(); }}>
    <div className="seed-content">
      <p className="cinema-eyebrow">EVERY UNIVERSE BEGINS WITH A SEED</p>
      <button className="seed-activate" onClick={() => begin(true)} disabled={stage === 'spark'} aria-label="Spark the StarrSeed and enter with sound">
        <img ref={symbol} src={cinema.seed} alt="The original MAX StarrSeed symbol" style={{ maskImage: `url(${cinema.seed})`, maskMode: 'luminance', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
      </button>
      <h1 tabIndex={-1}>Let there be <em>possibility.</em></h1>
      <p className="seed-invitation">Touch the seed. Bring the world to life.</p>
      <button className="seed-sound-entry" onClick={() => begin(true)} disabled={stage === 'spark'}>ENTER WITH SOUND <span>↗</span></button>
      <button className="seed-silent" onClick={() => begin(false)} disabled={stage === 'spark'}>Enter silently</button>
      <small>Featuring “0nly_1” by Max Starr</small>
    </div>
  </dialog></>;
}
