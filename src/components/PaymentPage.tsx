import {useEffect,useState} from 'react';
export const commerceApiEnabled=import.meta.env.VITE_COMMERCE_API_ENABLED==='true';
export default function PaymentPage(){
 const params=new URLSearchParams(location.hash.split('?')[1]||'');
 const access=location.hash.startsWith('#payment=')?location.hash.slice(9):null;
 const [message,setMessage]=useState(access?'Checking test payment with Stripe…':'Your approved test checkout invitation. Payment does not reserve production time or a Calendar slot.');
 const [busy,setBusy]=useState(false);
 async function call(path:string,body:unknown){const res=await fetch(`/api/stripe/${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await res.json();if(!res.ok)throw Error(data.error||'Payment service unavailable');return data;}
 async function check(){setBusy(true);try{const data=await call('status',{access});setMessage(data.message);}catch(e){setMessage(e instanceof Error?e.message:'Unable to verify payment.');}finally{setBusy(false);}}
 useEffect(()=>{if(access&&commerceApiEnabled)void check();},[]);
 async function checkout(){setBusy(true);try{const data=await call('checkout',{serviceId:params.get('service'),phase:params.get('phase')||'purchase',invitation:params.get('invitation')});const url=new URL(data.url);if(url.origin!=='https://checkout.stripe.com')throw Error('Invalid checkout URL');location.assign(url.href);}catch(e){setMessage(e instanceof Error?e.message:'Unable to open checkout.');setBusy(false);}}
 return <main className="commerce-catalog" style={{maxWidth:720,margin:'5rem auto',padding:'1.5rem'}}><h1>StarrTree · Test checkout</h1><p>TEST MODE ONLY · No real purchase or confirmed booking.</p><p role="status">{commerceApiEnabled?message:'Verified sandbox checkout is not enabled yet. Contact StarrTree for the manual test flow.'}</p>{commerceApiEnabled&&<button className="commerce-action" disabled={busy} onClick={()=>void(access?check():checkout())}>{busy?'Please wait…':access?'Check payment status':'Continue to Stripe test checkout'}</button>}<p>After verified payment, StarrTree reviews intake and sends any private Google Calendar booking invitation. No automatic delivery is promised.</p><a href="mailto:hello@starrtree.org?subject=Sandbox%20checkout%20follow-up">Request next steps</a><p><a href="#/">Return to StarrTree</a></p></main>;
}
