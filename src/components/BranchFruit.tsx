import { useEffect, useRef } from 'react';
import { type World } from '../data/content';
import StarrFruit from './StarrFruit';
import { useExperience } from './Experience';
export default function BranchFruit({world,staticOnly=false}:{world:World;staticOnly?:boolean}){
 const anchor=useRef<HTMLDivElement>(null);const body=useRef<HTMLDivElement>(null);const {motion}=useExperience();
 useEffect(()=>{const parent=anchor.current?.closest<HTMLElement>('.st-world');const sculpture=body.current;if(!parent||!sculpture||!motion)return;
 let frame=0;const update=()=>{frame=0;const first=parent.querySelector('.branch-browse');if(!first)return;const top=first.getBoundingClientRect().top;const p=Math.max(0,Math.min(1,(innerHeight*.9-top)/(innerHeight*.55)));const nodes=Array.from(parent.querySelectorAll('.hud-node'));const near=nodes.reduce((a,b)=>Math.abs(b.getBoundingClientRect().top-innerHeight*.35)<Math.abs(a?.getBoundingClientRect().top-innerHeight*.35||Infinity)?b:a,nodes[0]);const index=Math.max(0,nodes.indexOf(near));sculpture.dataset.fruitProgress=String(p);sculpture.dataset.fruitOrbit=String(index*.7);
 if(p>0){const side=index%2?-.12:.88;sculpture.style.position='fixed';sculpture.style.left=`${side*100}%`;sculpture.style.top=`${42+Math.sin(index)*10}%`;sculpture.style.width='min(95vw, 1100px)';sculpture.style.height='min(95vw, 1100px)';sculpture.style.transform=`translate(-50%,-50%) scale(${1+p*.6})`;sculpture.style.opacity=String(.28);sculpture.style.pointerEvents='none';sculpture.classList.add('is-planet');}
 else{sculpture.removeAttribute('style');sculpture.classList.remove('is-planet')}
 };const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);update();return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);sculpture.removeAttribute('style');sculpture.classList.remove('is-planet')};
 },[world.id,motion]);return <div ref={anchor} className="branch-fruit-anchor"><div ref={body} className="branch-fruit" data-fruit-progress="0" data-fruit-orbit="0"><StarrFruit worldId={world.id} color={world.color} large staticOnly={staticOnly}/></div></div>;
}
