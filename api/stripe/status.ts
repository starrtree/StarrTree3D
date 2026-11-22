import {digest} from '../../server/commerce.mjs';
import {syncOrder} from '../../server/commerce.mjs';
import {transaction,rateLimit} from '../../server/ledger.mjs';
import {runtime,post,respond,failure,type Request,type Response} from '../../server/runtime.js';
export default async function handler(req:Request,res:Response){
 try{const {stripe,origin,account}=runtime();if(!post(req,res,origin))return;
 const ip=String(req.headers['x-vercel-forwarded-for']||req.socket.remoteAddress||'unknown').split(',')[0];
 if(!await rateLimit(digest('status'+ip)))return respond(res,429,{error:'Please wait before trying again.'});
 const access=req.body?.access;if(typeof access!=='string'||!/^[a-f0-9]{64}$/.test(access))return respond(res,404,{error:'Order not found'});
 const result=await transaction(async db=>{const order=await db.findAccess(access);if(!order?.session_id)return null;
 const state=await syncOrder(stripe,db,order,account);return {state,fulfillment:'manual_review',message:state==='paid'?'Test payment verified. StarrTree will review intake or send your private Calendar booking invitation. No real service was purchased.':'Payment is not verified as paid. No booking or delivery is confirmed.'};});
 return respond(res,result?200:404,result||{error:'Order not found'});
 }catch(error){return failure(res,error);}
}
