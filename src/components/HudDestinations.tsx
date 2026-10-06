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
  const { motion } = useExperience();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    }), { threshold: 0.12 });
    root.current?.querySelectorAll('.hud-node').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);
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
  const enableTilt = async () => {
    if (tilt) { setTilt(false); return; }
    if (!('DeviceOrientationEvent' in window)) { setNotice('Phone tilt is unavailable in this browser.'); return; }
    try {
      const api = DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };
      if (api.requestPermission && await api.requestPermission() !== 'granted') { setNotice('Tilt permission was not granted. Touch navigation still works.'); return; }
      setTilt(true); setNotice('Tilt enabled. Gently move your phone to shift the light.');
    } catch { setNotice('Tilt is unavailable. Touch navigation still works.'); }
  };
  return <div ref={root} className={`hud-destinations ${motion ? 'has-motion' : ''}`}>
    <div className="hud-toolbar"><span>FOLLOW YOUR CURIOSITY</span><button disabled={!motion} aria-pressed={tilt} onClick={enableTilt}>{tilt ? 'Disable phone tilt' : 'Enable phone tilt'}</button></div>
    <p className="hud-notice" role="status">{notice}</p>
    <div className="hud-path" aria-hidden="true" />
    {items.map((item, index) => <article key={item.id} className="hud-node" style={{ '--node-index': index } as CSSProperties}>
      <span className="hud-coordinate" aria-hidden="true">{String(index + 1).padStart(2, '0')} /</span>
      <div className="hud-surface" onPointerMove={event => {
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
  </div>;
}
