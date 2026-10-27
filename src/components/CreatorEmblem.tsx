import { useEffect, useRef, useState, type CSSProperties } from 'react';
const particles = Array.from({length:18},(_,i)=>({ '--burst-x':`${Math.cos(i*Math.PI/9)*(65+i%3*18)}px`, '--burst-y':`${Math.sin(i*Math.PI/9)*(65+i%3*18)}px` }) as CSSProperties);
export default function CreatorEmblem({onOpen}:{onOpen:()=>void}) {
  const [burst,setBurst]=useState(false);
  const timer=useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  const open=()=>{if(burst)return;setBurst(true);timer.current=setTimeout(()=>{setBurst(false);onOpen();},420);};
  return <button className={`creator-emblem ${burst?'is-bursting':''}`} onClick={open} aria-label="Meet StarrX, the Creator">
    <svg viewBox="0 0 160 180" aria-hidden="true"><path d="M80 12 12 164 80 116 148 164 80 12ZM55 68H105M38 106 148 164M122 106 12 164" /></svg>
    <span>STARRX<small>THE CREATOR</small></span>
    <i className="creator-burst" aria-hidden="true">{particles.map((style,i)=><b key={i} style={style}/>)}</i>
  </button>;
}
