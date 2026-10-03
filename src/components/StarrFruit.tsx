import { Component, Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import { Mesh, MeshPhysicalMaterial } from 'three';
import { fruitAssets, type FruitWorldId } from '../data/assets';

type Props = {worldId:string;color:string;large?:boolean;staticOnly?:boolean};
class VisualBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(){this.props.onFailure();}
 render(){return this.state.failed?null:this.props.children;}
}
function OpticalModel({id,color,onReady}:{id:FruitWorldId;color:string;onReady:()=>void}) {
 const {scene}=useGLTF(fruitAssets[id].model);
 const model=useMemo(()=>{
  const copy=scene.clone(true);
  copy.traverse(node=>{if(node instanceof Mesh){
   const core=/energy|nucleus|connection|aperture|inner/i.test(node.name);
   node.material=new MeshPhysicalMaterial({color:core?color:'#dcecff',roughness:core?.25:.09,metalness:.10,transmission:core?0:.84,thickness:.4,ior:1.46,iridescence:core?0:1,iridescenceIOR:1.32,iridescenceThicknessRange:[180,600],clearcoat:1,emissive:color,emissiveIntensity:core?.7:.025});
  }});
  return copy;
 },[scene,color]);
 useEffect(()=>{onReady();return()=>{model.traverse(node=>{if(node instanceof Mesh){const m=node.material;if(!Array.isArray(m))m.dispose();}});};},[model,onReady]);
 return <primitive object={model}/>;
}
/** Decorative sculpture only. Navigation, words, purchase controls stay in HTML. */
export default function StarrFruit({worldId,color,large=false,staticOnly=false}:Props){
 const id=(worldId in fruitAssets?worldId:'music') as FruitWorldId;
 const [reduced,setReduced]=useState(true);
 const [enabled,setEnabled]=useState(false);
 const [ready,setReady]=useState(false);
 const [failed,setFailed]=useState(false);
 const markReady=useCallback(()=>setReady(true),[]);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 useEffect(()=>{setReady(false);setEnabled(false);setFailed(false);},[id]);
 const show3D=large&&enabled&&!staticOnly&&!reduced&&!failed;
 return <div className={`starrfruit ${large?'starrfruit-large':''}`} style={{position:'relative',width:'100%',height:'100%',minHeight:large?260:100,isolation:'isolate'}}>
  <div aria-hidden="true" style={{position:'absolute',inset:'10%',background:`radial-gradient(ellipse,${color}24,transparent 65%)`,filter:'blur(12px)'}}/>
  <img src={fruitAssets[id].poster} alt="" aria-hidden="true" width="640" height="640" loading={large?'eager':'lazy'} style={{display:'block',width:'100%',height:'100%',objectFit:'contain',position:'relative',opacity:show3D&&ready?0:1,filter:`drop-shadow(0 0 20px ${color}22)`}}/>
  {show3D&&<div aria-hidden="true" style={{position:'absolute',inset:0}}><VisualBoundary onFailure={()=>setFailed(true)}><Canvas dpr={[1,1.5]} frameloop="demand" camera={{position:[.35,2.25,6.5],fov:36}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} fallback={null} onCreated={({gl})=>{gl.domElement.addEventListener('webglcontextlost',()=>setFailed(true),{once:true});}}><ambientLight intensity={.6}/><directionalLight position={[3,5,4]} intensity={3}/><pointLight position={[-2,1,3]} color={color} intensity={7}/><Suspense fallback={null}><OpticalModel id={id} color={color} onReady={markReady}/><Environment resolution={128}><Lightformer position={[-3,3,4]} scale={[3,5,1]} intensity={3}/><Lightformer position={[3,1,-2]} scale={[2,4,1]} color={color} intensity={5}/></Environment></Suspense></Canvas></VisualBoundary></div>}
  {large&&!staticOnly&&!reduced&&!failed&&<button className="fruit-view-toggle" onClick={()=>setEnabled(v=>!v)} style={{position:'absolute',bottom:4,left:'50%',transform:'translateX(-50%)',zIndex:2,fontSize:11,padding:'7px 12px',border:'1px solid #ffffff30',borderRadius:20,background:'#080d1de0',color:'#e5e9ff',whiteSpace:'nowrap'}} aria-pressed={enabled}>{enabled?'Use still image':'View optical 3D'}</button>}
 </div>;
}
