import {digest} from '../../server/commerce.mjs';
import {startCheckout} from '../../server/commerce.mjs';
import {transaction,rateLimit} from '../../server/ledger.mjs';
import {runtime,post,respond,failure,type Request,type Response} from '../../server/runtime.js';
export default async function handler(req:Request,res:Response){
 try{const {stripe,origin}=runtime();if(!post(req,res,origin))return;
 const ip=String(req.headers['x-vercel-forwarded-for']||req.socket.remoteAddress||'unknown').split(',')[0];
 if(!await rateLimit(digest('checkout'+ip)))return respond(res,429,{error:'Please wait before trying again.'});
 if(!req.body || typeof req.body!=='object' || Array.isArray(req.body) || JSON.stringify(req.body).length>4096)return respond(res,400,{error:'Invalid request'});
 const db={prepareOrder:(s:any,body:any)=>transaction(ledger=>ledger.prepareOrder(s,body)),attachSession:(id:string,session:string)=>transaction(ledger=>ledger.attachSession(id,session))};
 const result=await startCheckout({stripe,db,env:process.env,body:req.body});return respond(res,200,result);
 }catch(error){return failure(res,error);}
}
