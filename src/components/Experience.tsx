import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { cinema } from '../data/cinema';
type EffectName = keyof typeof cinema.effects;
const ExperienceContext = createContext({ sound: false, trackTitle: '0nly_1', playPreview: (_src:string,_title:string) => {}, motion: true, toggleSound: () => {}, toggleMotion: () => {}, startSound: () => {}, stopSound: () => {}, primeAudio: () => {}, playIntro: async (_film: HTMLVideoElement) => {}, completeIntro: (_time: number) => {}, effect: (_name: EffectName) => {} });
export const useExperience = () => useContext(ExperienceContext);
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [sound, setSound] = useState(false);
  const [motion, setMotion] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [preview, setPreview] = useState<{src:string;title:string;end:number}|null>(null);
  const song = useRef<HTMLAudioElement>(null);
  const intro = useRef<HTMLVideoElement | null>(null);
  const context = useRef<AudioContext | null>(null);
  const sounds = useRef<Partial<Record<EffectName, AudioBuffer>>>({});
  const enabled = useRef(false);
  const activeEffects = useRef<Set<AudioBufferSourceNode>>(new Set());
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setMotion(!media.matches);
    media.addEventListener('change', change);
    return () => { media.removeEventListener('change', change); void context.current?.close(); };
  }, []);
  const startSound = () => {
    enabled.current = true;
    if (intro.current) {
      intro.current.muted = false;
      void intro.current.play().then(() => setSound(true)).catch(() => { enabled.current = false; setSound(false); });
      return;
    }
    if (!context.current || context.current.state === 'closed') context.current = new AudioContext();
    void context.current.resume();
    const ctx = context.current;
    if (!sounds.current.arrival) void fetch(cinema.effects.arrival).then(r => r.arrayBuffer()).then(data => ctx.decodeAudioData(data)).then(buffer => { sounds.current.arrival = buffer; }).catch(() => {});
    if (song.current) {
      song.current.volume = 0.22;
      void song.current.play().then(() => setSound(true)).catch(() => { enabled.current = false; setSound(false); });
    }
  };
  const stopSound = () => {
    enabled.current = false;
    if (intro.current) intro.current.muted = true;
    song.current?.pause();
    activeEffects.current.forEach(source => { try { source.stop(); } catch { /* already ended */ } });
    activeEffects.current.clear();
    setSound(false);
  };
  const playPreview = (src:string,title:string) => {
    stopSound();
    setPreview({src,title,end:30});
  };
  useEffect(() => {
    if (!preview || !song.current) return;
    song.current.currentTime = 0;
    startSound();
  }, [preview]);
  const primeAudio = () => {
    if (!context.current || context.current.state === 'closed') context.current = new AudioContext();
    void context.current.resume();
  };
  const playIntro = async (film: HTMLVideoElement) => {
    song.current?.pause();
    setPreview(null);
    intro.current = film;
    film.muted = false;
    film.volume = 0.22;
    try { await film.play(); enabled.current = true; setSound(true); effect("seed"); }
    catch (error) { enabled.current = false; setSound(false); throw error; }
  };
  const completeIntro = (time: number) => {
    intro.current?.pause();
    intro.current = null;
    if (song.current) song.current.currentTime = time;
    if (enabled.current) startSound();
  };
  const effect = (name: EffectName) => {
    const ctx = context.current;
    if (!enabled.current || !ctx) return;
    const play = (buffer: AudioBuffer) => {
      if (!enabled.current || ctx.state === 'closed') return;
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      gain.gain.value = name === 'seed' ? 0.35 : 0.2;
      source.buffer = buffer;
      source.connect(gain).connect(ctx.destination);
      activeEffects.current.add(source);
      source.onended = () => activeEffects.current.delete(source);
      source.start();
    };
    if (sounds.current[name]) play(sounds.current[name]!);
    else void fetch(cinema.effects[name]).then(r => r.arrayBuffer()).then(data => ctx.decodeAudioData(data)).then(buffer => { sounds.current[name] = buffer; play(buffer); }).catch(() => {});
  };
  useEffect(() => {
    const pause = () => { if (document.hidden) stopSound(); };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);
  return <ExperienceContext.Provider value={{ sound, trackTitle: preview?.title || '0nly_1', playPreview, motion, startSound, stopSound, primeAudio, playIntro, completeIntro, effect, toggleSound: () => sound ? stopSound() : startSound(), toggleMotion: () => setMotion(v => !v) }}>
    <audio ref={song} src={preview?.src || cinema.music.src} loop={!preview} preload="none" onPause={()=>setSound(false)} onError={()=>{enabled.current=false;setSound(false);}} onTimeUpdate={()=>{if(preview && song.current && song.current.currentTime>=preview.end){stopSound();song.current.currentTime=0;}}} />
    {children}
  </ExperienceContext.Provider>;
}
export function ExperienceControls() {
  const { sound, trackTitle, motion, toggleSound, toggleMotion } = useExperience();
  return <aside className="experience-controls" aria-label="Experience controls">
    <button onClick={toggleSound} aria-pressed={sound} aria-label={sound ? 'Pause soundtrack and sound effects' : 'Play 0nly_1 soundtrack'}>
      <span className={`audio-bars ${sound ? 'is-playing' : ''}`} aria-hidden="true"><i /><i /><i /><i /></span>
      <span>{sound ? trackTitle : 'Sound off'}<small>{sound ? 'MAX STARR · LISTENING' : 'PLAY / RESUME AUDIO'}</small></span>
    </button>
    <button className="motion-control" onClick={toggleMotion} aria-pressed={motion} aria-label={motion ? 'Pause ambient motion' : 'Enable ambient motion'}>{motion ? 'Ⅱ' : '▷'}<span>Motion</span></button>
  </aside>;
}
