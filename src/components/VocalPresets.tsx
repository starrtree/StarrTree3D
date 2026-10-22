import { vocalPresets } from '../data/presets';
export default function VocalPresets(){return <section className="vocal-presets" aria-label="BandLab Vocal Presets">
 <h2>BandLab Vocal Presets</h2><p>Two free starters: kp for main vocals and Ad Libs (light) for layers. Paid preset delivery follows manual payment verification; TEST checkout does not deliver presets automatically.</p>
 {['Main Vocals','Adlibs'].map(category=><div key={category}><h3>{category}</h3><ul>{vocalPresets.filter(p=>p.category===category).map(p=><li key={p.name}>{p.free?<a href={p.url} target="_blank" rel="noopener noreferrer">{p.name} · Free ↗</a>:<span>{p.name} <small>· Paid · manual delivery</small></span>}</li>)}</ul></div>)}
 </section>}
