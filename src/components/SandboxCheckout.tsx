import {useState} from 'react';
import {commerceApiEnabled} from './PaymentPage';
export default function SandboxCheckout({serviceId,presetRequired=false}:{serviceId:string;presetRequired?:boolean}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[preset,setPreset]=useState('');
 if(!commerceApiEnabled)return null;
 return <div>{presetRequired&&<label>Approved paid preset name<input value={preset} onChange={e=>setPreset(e.target.value)} maxLength={100}/></label>}<button type="button" className="commerce-action" disabled={busy} onClick={async()=>{setBusy(true);setError('');try{const res=await fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({serviceId,...(presetRequired?{preset}:{})})});const data=await res.json();if(!res.ok)throw Error(data.error);if(new URL(data.url).origin!=='https://checkout.stripe.com')throw Error('Invalid checkout URL');location.assign(data.url);}catch(e){setError(e instanceof Error?e.message:'Unable to open checkout');setBusy(false);}}}>{busy?'Opening…':'Buy · Verified Test Checkout'}</button><p role="status">{error}</p></div>;
}
