import type { CSSProperties } from 'react';
/** SVG paths stay outside the letter faces so the title remains readable. */
export default function TitleBotany(){return <svg className="title-botany" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true">
  <g className="title-roots">
    <path pathLength="1" d="M500 180C420 205 300 178 205 191S65 206 4 175M500 180C590 205 710 178 800 191S940 206 996 175M470 188Q430 199 427 218M350 193Q310 204 290 214M530 188Q565 204 570 219M650 193Q686 204 710 217"/>
    <path pathLength="1" d="M205 191C105 187 43 171 27 120S19 45 105 23M800 191C905 187 957 171 973 120S980 45 895 23M105 23Q225 0 340 22M895 23Q780 0 660 22"/>
  </g>
  <g className="title-leaves">{[[42,125,-35],[25,82,15],[60,38,-25],[155,20,20],[260,14,-15],[958,125,35],[975,82,-15],[940,38,25],[845,20,-20],[740,14,15],[178,194,-25],[823,194,25]].map(([x,y,a],i)=><path key={i} style={{'--leaf-delay':`${i*45}ms`} as CSSProperties} transform={`translate(${x} ${y}) rotate(${a})`} d="M0 0Q-25-26-32-8Q-24 12 0 0Z"/>)}</g>
</svg>}
