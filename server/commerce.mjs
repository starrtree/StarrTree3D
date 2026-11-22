import { createHash, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
export const catalog = JSON.parse(readFileSync(new URL('../app/commerce-catalog.json', import.meta.url)));
const amounts = {"prod_VJ1NQKFYO8npob": 37500, "prod_VJ1OdYp4vIasak": 75000, "prod_VJ1OOBkSgTknq0": 75000, "prod_VJ1OvIgnlsz6FR": 9900, "prod_VJ1OztN65i55mv": 15000, "prod_VJ1PaSZ4fDrpke": 30000, "prod_VJ1PflO45sDTGU": 45000, "prod_VJ1Ph6qBjJes0a": 12500, "prod_VJ1PU4tWPFnjiw": 25000, "prod_VJ1PqpP9AwI9hI": 19900, "prod_VJ1PfCK3nMWXTE": 25000, "prod_VJ1PA2sVSXUswo": 75000, "prod_VJ1PfymguBhIn2": 12000, "prod_VJ1PfSiyyPiLgF": 7500, "prod_VJ1Q0LFoFxb9hC": 3000, "prod_VJ1QPr9b7beXTg": 5000, "prod_VJ1QZHUlEK0bwX": 15000, "prod_VJ1QybXL9BGtlB": 15000, "prod_VJ1QYUlEhTzh36": 50000};
export const digest = token => createHash('sha256').update(token).digest('hex');
export const token = () => randomBytes(32).toString('hex');
export class PaymentError extends Error { constructor(message, status=400) { super(message); this.status=status; } }
export function config(env=process.env) {
  if(env.STRIPE_MODE !== 'test' || !/^sk_test_/.test(env.STRIPE_SECRET_KEY || '') || !env.COMMERCE_DATABASE_URL || !env.STRIPE_ACCOUNT_ID || !env.COMMERCE_ORIGIN) throw new PaymentError('Sandbox checkout is not configured.',503);
  const origin = new URL(env.COMMERCE_ORIGIN);
  if(origin.origin !== env.COMMERCE_ORIGIN || (origin.protocol !== 'https:' && origin.hostname !== 'localhost' && origin.hostname !== '127.0.0.1')) throw new PaymentError('Invalid checkout origin.',503);
  return { origin: origin.origin, account:env.STRIPE_ACCOUNT_ID };
}
export function service(id, phase='purchase') {
  const index=catalog.findIndex(x=>x.id===id), item=catalog[index];
  if(!item || item.name==='AI Workshop / Training' || item.name==='Studio Recording Session') throw new PaymentError('This offering requires a custom quote.');
  if(!['purchase','recurring'].includes(phase) || (phase==='recurring' && !item.setupPriceId)) throw new PaymentError('Invalid payment phase.');
  return { ...item, phase, price:item.setupPriceId && phase==='purchase' ? item.setupPriceId : item.priceId,
    amount:item.setupPriceId && phase==='purchase' ? 95000 : amounts[item.id],
    mode:item.model==='Recurring monthly' || phase==='recurring' ? 'subscription':'payment',
    approval:item.model!=='One-time direct purchase',
    capacity:phase==='recurring' ? null : item.capacity };
}
export function validatePrice(price,s) {
  if(price.livemode!==false || !price.active || price.product!==s.id || price.id!==s.price || price.currency!=='usd' || price.unit_amount!==s.amount || (s.mode==='subscription' ? price.recurring?.interval!=='month' || price.recurring?.interval_count!==1 : Boolean(price.recurring))) throw new PaymentError('Sandbox price validation failed.',503);
}
export async function validateSession(stripe,session,s,account) {
  const identity=await stripe.accounts.retrieve();
  if(identity.id!==account || session.livemode!==false || session.mode!==s.mode || session.currency!=='usd') throw new PaymentError('Payment configuration mismatch.',400);
  const lines=await stripe.checkout.sessions.listLineItems(session.id,{limit:2});
  if(lines.has_more || lines.data.length!==1 || lines.data[0].price?.id!==s.price || lines.data[0].quantity!==1 || lines.data[0].amount_total!==s.amount || session.amount_total!==s.amount) throw new PaymentError('Payment line items do not match.',400);
  return session.payment_status==='paid' ? 'paid' : session.status==='expired' ? 'expired' : 'pending';
}
export async function startCheckout({stripe,db,env,body}) {
  const {origin,account}=config(env), s=service(body.serviceId,body.phase);
  if(Object.keys(body).some(k=>!['serviceId','phase','invitation','preset'].includes(k))) throw new PaymentError('Unsupported checkout input.');
  const identity=await stripe.accounts.retrieve(); if(identity.id!==account) throw new PaymentError('Wrong sandbox account.',503);
  validatePrice(await stripe.prices.retrieve(s.price),s);
  // Every order gets a durable record before Stripe is called. Retries with an invitation reuse it.
  let order=await db.prepareOrder(s,body);
  if(!order) throw new PaymentError('A valid StarrTree invitation is required.',403);
  if(!order.session_id && order.created_at && Date.now()-new Date(order.created_at).getTime()>23*3600000) throw new PaymentError("Checkout invitation needs reissuing.",409);
  if(order.session_id) {
    const existing=await stripe.checkout.sessions.retrieve(order.session_id);
    if(existing.livemode!==false || existing.status!=='open' || !existing.url?.startsWith('https://checkout.stripe.com/')) throw new PaymentError('This checkout has already finished. Contact StarrTree.',409);
    return {url:existing.url};
  }
  const session=await stripe.checkout.sessions.create({mode:s.mode,line_items:[{price:s.price,quantity:1}],
    customer_email:order.email || undefined,client_reference_id:order.id,metadata:{order_id:order.id,service_id:s.id,phase:s.phase},
    success_url:`${origin}/?commerce=return#payment=${order.access_token}`,
    cancel_url:`${origin}/?commerce=cancel#payment=${order.access_token}`,
    ...(order.preset ? {custom_text:{submit:{message:`Selected preset: ${order.preset}. Manual delivery follows verified test payment; no real service is purchased.`}}}:{})
  },{idempotencyKey:order.id});
  if(session.livemode!==false || !session.url?.startsWith('https://checkout.stripe.com/')) throw new PaymentError('Invalid sandbox checkout.',503);
  await db.attachSession(order.id,session.id);
  return {url:session.url};
}
export async function syncOrder(stripe,db,order,account) {
  const session=await stripe.checkout.sessions.retrieve(order.session_id);
  if(session.client_reference_id!==order.id || session.metadata?.order_id!==order.id) throw new PaymentError('Order mismatch.');
  const state=await validateSession(stripe,session,service(order.service_id,order.phase),account);
  await db.recordState(order.id,state,session.subscription);
  return state;
}
export async function processEvent({stripe,db,event,account}) {
  const identity=await stripe.accounts.retrieve();
  if(identity.id!==account || event.livemode!==false || (event.account && event.account!==account)) throw new PaymentError('Wrong event environment.');
  if(event.type.startsWith('checkout.session.')) {
    let order=await db.findSession(event.data.object.id);
    if(!order && event.data.object.metadata?.order_id) {
      const pending=await db.findOrder(event.data.object.metadata.order_id);
      if(pending && !pending.session_id && event.data.object.client_reference_id===pending.id) {
        const current=await stripe.checkout.sessions.retrieve(event.data.object.id);
        await validateSession(stripe,current,service(pending.service_id,pending.phase),account);
        await db.attachSession(pending.id,current.id);
        order={...pending,session_id:current.id};
      }
    }
    if(!order) return; // Existing Payment Links remain manually verified; no guessed order ownership.
    await syncOrder(stripe,db,order,account);
  } else if(event.type.startsWith('customer.subscription.') || event.type==='invoice.paid' || event.type==='invoice.payment_failed') {
    const obj=event.data.object;
    const id=obj.object==='subscription' ? obj.id : obj.parent?.subscription_details?.subscription;
    if(typeof id==='string') {
      const current=await stripe.subscriptions.retrieve(id);
      if(current.livemode!==false) throw new PaymentError('Wrong subscription environment.');
      await db.recordSubscription(id,current.status);
    }
  }
}
