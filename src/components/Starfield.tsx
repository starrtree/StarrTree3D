import { useEffect, useRef } from 'react';
import { useExperience } from './Experience';
export default function Starfield({className=''}:{className?:string}){
 const ref=useRef<HTMLCanvasElement>(null);const {motion}=useExperience();
 useEffect(()=>{const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
 let frame=0;let angle=0;let last=0;
 const stars=Array.from({length:innerWidth<700?85:170},(_,i)=>{const t=Math.abs((Math.sin(i*127.1+17)*43758.5453)%1)*Math.PI*2;const z=((i*73)%211)/211;return{x:Math.cos(t)*(0.25+z)*1.6,y:Math.sin(t)*(0.2+z),z:z*2-1,size:i%17===0?1.4:0.6,phase:i*2.3}});
 const draw=(now:number)=>{const dt=last&&now?Math.max(0,Math.min((now-last)/1000,.05)):0;last=now;if(motion&&!document.hidden)angle+=dt*.009;ctx.clearRect(0,0,canvas.width,canvas.height);const dpr=Math.min(devicePixelRatio,1.5);
 for(const s of stars){const x=s.x*Math.cos(angle)-s.z*Math.sin(angle);const z=s.x*Math.sin(angle)+s.z*Math.cos(angle);const depth=2.8+z;const px=canvas.width/2+x/depth*canvas.width;const py=canvas.height/2+s.y/depth*canvas.height;const twinkle=motion ? .75+.25*Math.sin(now*.0012+s.phase):1;const radius=s.size*dpr*(1.3-z*.25);ctx.fillStyle=`rgba(230,240,255,${(.25+(1-z)*.18)*twinkle})`;ctx.beginPath();ctx.arc(px,py,radius,0,Math.PI*2);ctx.fill();if(s.size>1){ctx.fillStyle=`rgba(230,240,255,${.13*twinkle})`;ctx.fillRect(px-radius*4,py-.3*dpr,radius*8,.6*dpr);ctx.fillRect(px-.3*dpr,py-radius*4,.6*dpr,radius*8)}}
 if(motion&&now>0)frame=requestAnimationFrame(draw)};
 const resize=()=>{const box=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.max(1,box.width*dpr);canvas.height=Math.max(1,box.height*dpr);draw(0)};
 const observer=new ResizeObserver(resize);observer.observe(canvas);resize();if(motion)frame=requestAnimationFrame(draw);
 return()=>{cancelAnimationFrame(frame);observer.disconnect()};
 },[motion]);return <canvas ref={ref} className={`cosmic-starfield ${className}`} aria-hidden="true"/>;
}
