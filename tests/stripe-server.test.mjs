import test from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
import {catalog,config,service,startCheckout,validatePrice,validateSession,processEvent,syncOrder} from '../server/commerce.mjs';
const env={STRIPE_MODE:'test',STRIPE_SECRET_KEY:'sk_test_fixture_only',STRIPE_ACCOUNT_ID:'acct_fixture',COMMERCE_DATABASE_URL:'postgres://fixture',COMMERCE_ORIGIN:'http://localhost:4173'};
const get=name=>catalog.find(x=>x.name===name);
function fixture(name,phase='purchase'){
 const s=service(get(name).id,phase), order={id:'order-fixture',email:'test@example.invalid',access_token:'a'.repeat(64),service_id:s.id,phase};
 const session={id:'cs_test_fixture',url:'https://checkout.stripe.com/c/pay/cs_test_fixture',livemode:false,mode:s.mode,currency:'usd',amount_total:s.amount,payment_status:'paid',status:'complete',client_reference_id:order.id,metadata:{order_id:order.id}};
 let created;
 const stripe={accounts:{retrieve:async()=>({id:env.STRIPE_ACCOUNT_ID})},prices:{retrieve:async()=>({id:s.price,product:s.id,active:true,livemode:false,currency:'usd',unit_amount:s.amount,recurring:s.mode==='subscription'?{interval:'month',interval_count:1}:null})},checkout:{sessions:{create:async(p,o)=>{created={p,o};return session;},retrieve:async()=>session,listLineItems:async()=>({has_more:false,data:[{price:{id:s.price},quantity:1,amount_total:s.amount}]})}}};
 const db={prepareOrder:async()=>order,attachSession:async()=>{},recordState:async()=>{},findOrder:async()=>null,findSession:async()=>({...order,session_id:session.id})};
 return {s,stripe,db,order,session,created:()=>created};
}
test('Missing configuration and live mode fail closed',()=>{
 assert.throws(()=>config({}));assert.throws(()=>config({...env,STRIPE_MODE:'live'}));assert.throws(()=>config({...env,STRIPE_SECRET_KEY:'sk_live_fixture'}));assert.throws(()=>config({...env,COMMERCE_ORIGIN:'http://example.com'}));assert.throws(()=>config({...env,COMMERCE_ORIGIN:'https://example.com/path'}));
});
for(const [label,name,amount,mode] of [['A','Poster / Flyer Design',12500,'payment'],['B','Custom GPT / AI Assistant Starter',25000,'payment'],['C','Website Care Plan',9900,'subscription'],['D','AI / Creative Tech Consultation',15000,'payment']]){
 test(`${label}: existing sandbox price, amount, mode and verified payment`,async()=>{
 const f=fixture(name);const r=await startCheckout({...f,env,body:{serviceId:f.s.id}});assert.match(r.url,/checkout.stripe.com/);assert.equal(f.s.amount,amount);assert.equal(f.created().p.mode,mode);assert.deepEqual(f.created().p.line_items,[{price:f.s.price,quantity:1}]);assert.equal(await validateSession(f.stripe,f.session,f.s,env.STRIPE_ACCOUNT_ID),'paid');assert.match(f.created().p.success_url,/#payment=/);assert.equal(f.created().o.idempotencyKey,f.order.id);
 });
}
test('Approval absence rejects deposit checkout; client cannot set amount or price',async()=>{
 const f=fixture('Custom GPT / AI Assistant Starter');f.db.prepareOrder=async()=>null;
 await assert.rejects(startCheckout({...f,env,body:{serviceId:f.s.id}}),/invitation/);
 await assert.rejects(startCheckout({...f,env,body:{serviceId:f.s.id,amount:1}}),/Unsupported/);
});
test('Server rejects wrong account and modified Stripe Price',async()=>{
 const f=fixture('Poster / Flyer Design');await assert.rejects(startCheckout({...f,env:{...env,STRIPE_ACCOUNT_ID:'wrong'},body:{serviceId:f.s.id}}),/Wrong sandbox/);
 const p=await f.stripe.prices.retrieve();for(const change of [{livemode:true},{unit_amount:1},{currency:'eur'},{product:'wrong'},{active:false}])assert.throws(()=>validatePrice({...p,...change},f.s));
});
test('Forged completion, wrong quantity/price and unpaid sessions cannot authorize fulfillment',async()=>{
 const f=fixture('Poster / Flyer Design');f.session.payment_status='unpaid';assert.equal(await validateSession(f.stripe,f.session,f.s,env.STRIPE_ACCOUNT_ID),'pending');
 f.session.status='expired';assert.equal(await validateSession(f.stripe,f.session,f.s,env.STRIPE_ACCOUNT_ID),'expired');
 f.stripe.checkout.sessions.listLineItems=async()=>({data:[{price:{id:f.s.price},quantity:2,amount_total:f.s.amount}],has_more:false});await assert.rejects(validateSession(f.stripe,f.session,f.s,env.STRIPE_ACCOUNT_ID),/line items/);
 f.session.client_reference_id='another-order';await assert.rejects(syncOrder(f.stripe,f.db,{...f.order,session_id:f.session.id},env.STRIPE_ACCOUNT_ID),/Order mismatch/);
});
test('Receptionist setup and monthly start stay separate; workshop and legacy studio stay quote-only',()=>{
 const s=get('AI Receptionist Starter');assert.equal(service(s.id).amount,95000);assert.equal(service(s.id).mode,'payment');assert.equal(service(s.id,'recurring').amount,19900);assert.equal(service(s.id,'recurring').mode,'subscription');
 assert.throws(()=>service(get('AI Workshop / Training').id));assert.throws(()=>service(get('Studio Recording Session').id));
});
test('Real SDK signature verification rejects tampered raw payload',()=>{
 const stripe=new Stripe('sk_test_fixture'),secret='whsec_fixture',payload=JSON.stringify({id:'evt_test',livemode:false});
 const header=stripe.webhooks.generateTestHeaderString({payload,secret});assert.equal(stripe.webhooks.constructEvent(payload,header,secret).id,'evt_test');assert.throws(()=>stripe.webhooks.constructEvent(payload+' ',header,secret));
});
test('Live webhook is rejected; untracked Payment Link is not auto-fulfilled',async()=>{
 const f=fixture('Poster / Flyer Design');await assert.rejects(processEvent({...f,event:{livemode:true},account:env.STRIPE_ACCOUNT_ID}),/Wrong event/);
 f.db.findSession=async()=>null;await processEvent({...f,event:{livemode:false,type:'checkout.session.completed',data:{object:f.session}},account:env.STRIPE_ACCOUNT_ID});
});
test('Out-of-order subscription event reads current Stripe state',async()=>{
 const f=fixture('Website Care Plan');let seen;f.stripe.subscriptions={retrieve:async()=>({livemode:false,status:'canceled'})};f.db.recordSubscription=async(id,state)=>seen={id,state};
 await processEvent({...f,event:{livemode:false,type:'customer.subscription.updated',data:{object:{object:'subscription',id:'sub_test',status:'active'}}},account:env.STRIPE_ACCOUNT_ID});assert.deepEqual(seen,{id:'sub_test',state:'canceled'});
});

test('Webhook recovers a paid order when delivery beats session attachment',async()=>{
 const f=fixture('Poster / Flyer Design');f.db.findSession=async()=>null;f.db.findOrder=async()=>f.order;let attached;
 f.db.attachSession=async(id,session)=>attached={id,session};
 await processEvent({...f,event:{livemode:false,type:'checkout.session.completed',data:{object:f.session}},account:env.STRIPE_ACCOUNT_ID});assert.deepEqual(attached,{id:f.order.id,session:f.session.id});
});
