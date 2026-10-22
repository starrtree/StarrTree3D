import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { type Item } from '../data/content';
import { useExperience } from './Experience';
import './hud.css';

/** HTML controls with decorative light/tilt; descriptions expand on explicit input. */
export default function HudDestinations({ items, onOpen }: { items: Item[]; onOpen: (item: Item) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [tilt, setTilt] = useState(false);
  const [notice, setNotice] = useState('');
  const [snap, setSnap] = useState(true);
  const [view, setView] = useState<'overview' | 'trail'>('overview');
  const { motion } = useExperience();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    }), { threshold: 0.12 });
    root.current?.querySelectorAll('.hud-node').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [items, view]);
  useEffect(() => {
    if (!tilt || !motion) return;
    const orientation = (event: DeviceOrientationEvent) => {
      root.current?.style.setProperty('--tilt-x', `${Math.max(-6, Math.min(6, (event.beta ?? 0) / 8))}deg`);
      root.current?.style.setProperty('--tilt-y', `${Math.max(-8, Math.min(8, (event.gamma ?? 0) / 4))}deg`);
      root.current?.style.setProperty('--light-x', `${50 + Math.max(-35, Math.min(35, event.gamma ?? 0))}%`);
    };
    window.addEventListener('deviceorientation', orientation);
    return () => {
      window.removeEventListener('deviceorientation', orientation);
      root.current?.style.removeProperty('--tilt-x');
      root.current?.style.removeProperty('--tilt-y');
      root.current?.style.removeProperty('--light-x');
    };
  }, [tilt, motion]);
  useEffect(() => {
    if (!motion || !snap || view !== 'trail') return;
    let pointerScroll = false;
    let frame = 0;
    let settling = false;
    const input = () => { pointerScroll = true; if (frame) {cancelAnimationFrame(frame);frame=0;settling=false;} };
    const keyboard = () => { pointerScroll = false; if(frame){cancelAnimationFrame(frame);frame=0;settling=false;} };
    const settle = () => {
      if (!pointerScroll || settling) return;
      const nodes = Array.from(root.current?.querySelectorAll<HTMLElement>('.hud-node') || []);
      const closest = nodes.sort((a,b)=>Math.abs(a.getBoundingClientRect().top-innerHeight*.3)-Math.abs(b.getBoundingClientRect().top-innerHeight*.3))[0];
      if(!closest)return;
      const delta = closest.getBoundingClientRect().top-innerHeight*.3;
      if(Math.abs(delta)<8 || Math.abs(delta)>Math.min(100,innerHeight*.18))return;
      settling=true;pointerScroll=false;const start=scrollY;const time=performance.now();
      const tick=(now:number)=>{const p=Math.min(1,(now-time)/450);const ease=1-Math.pow(1-p,3)+Math.sin(p*Math.PI)*.04;window.scrollTo(0,start+delta*ease);if(p<1)frame=requestAnimationFrame(tick);else{frame=0;settling=false;}};
      frame=requestAnimationFrame(tick);
    };
    addEventListener('wheel',input,{passive:true});addEventListener('touchstart',input,{passive:true});addEventListener('keydown',keyboard);addEventListener('scrollend',settle);
    return()=>{cancelAnimationFrame(frame);removeEventListener('wheel',input);removeEventListener('touchstart',input);removeEventListener('keydown',keyboard);removeEventListener('scrollend',settle);};
  },[motion,snap,view]);
  const enableTilt = async () => {
    if (tilt) { setTilt(false); return; }
    if (!('DeviceOrientationEvent' in window)) { setNotice('Phone tilt is unavailable in this browser.'); return; }
    try {
      const api = DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };
      if (api.requestPermission && await api.requestPermission() !== 'granted') { setNotice('Tilt permission was not granted. Touch navigation still works.'); return; }
      setTilt(true); setNotice('Tilt enabled. Gently move your phone to shift the light.');
    } catch { setNotice('Tilt is unavailable. Touch navigation still works.'); }
  };
  return <div ref={root} className={`hud-destinations hud-${view} ${motion ? 'has-motion' : ''}`}>
    <div className="hud-toolbar">
      <div className="hud-view-switch" role="group" aria-label="Fruit layout">
        <button aria-pressed={view === 'overview'} onClick={() => setView('overview')}>At a glance</button>
        <button aria-pressed={view === 'trail'} onClick={() => setView('trail')}>Branch trail</button>
      </div>
      {view === "trail" && <button aria-pressed={snap} disabled={!motion} onClick={()=>setSnap(v=>!v)}>Soft snap {snap ? "on" : "off"}</button>}
      <button disabled={!motion} aria-pressed={tilt} onClick={enableTilt}>{tilt ? 'Disable phone tilt' : 'Enable phone tilt'}</button>
    </div>
    <p className="hud-notice" role="status">{notice}</p>
    <div className="hud-path" aria-hidden="true" />
    <div className="hud-fruits">
    {items.map((item, index) => <article key={item.id} className="hud-node" style={{ '--node-index': index } as CSSProperties}>
      <span className="hud-coordinate" aria-hidden="true">{String(index + 1).padStart(2, '0')} /</span>
      <div className={`hud-surface ${selected === item.id ? "is-open" : ""}`} onPointerMove={event => {
        if (!motion || event.pointerType !== 'mouse') return;
        const box = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width;
        const y = (event.clientY - box.top) / box.height;
        event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - y) * 9}deg`);
        event.currentTarget.style.setProperty('--tilt-y', `${(x - 0.5) * 12}deg`);
        event.currentTarget.style.setProperty('--light-x', `${x * 100}%`);
        event.currentTarget.style.setProperty('--light-y', `${y * 100}%`);
      }} onPointerLeave={event => { event.currentTarget.removeAttribute('style'); }}>
        <button className="hud-tab" aria-expanded={selected === item.id} aria-controls={`hud-${item.id}`} onClick={() => setSelected(selected === item.id ? null : item.id)}>
          <span className="hud-dot" aria-hidden="true" /><span><small>{item.kind} · {item.status}</small><strong>{item.title}</strong></span><b aria-hidden="true">{selected === item.id ? '−' : '+'}</b>
        </button>
        {selected === item.id && <div id={`hud-${item.id}`} className="hud-detail">
          {item.image && <img src={item.image} alt="" loading="lazy" />}
          <p>{item.description}</p><button className="st-secondary" onClick={() => onOpen(item)}>Explore {item.title} ↗</button>
        </div>}
      </div>
    </article>)}
    </div>
  </div>;
}
