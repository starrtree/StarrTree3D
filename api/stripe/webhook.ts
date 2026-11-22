import {processEvent} from '../../server/commerce.mjs';
import {transaction} from '../../server/ledger.mjs';
import {runtime,respond,failure,type Request,type Response} from '../../server/runtime.js';
export const config={api:{bodyParser:false}};
export default async function handler(req:Request,res:Response){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return respond(res,405,{error:'Method not allowed'});}
 try{const {stripe,account}=runtime();const secret=process.env.STRIPE_WEBHOOK_SECRET;
 if(!secret?.startsWith('whsec_'))return respond(res,503,{error:'Sandbox webhook not configured'});
 const signature=req.headers['stripe-signature'];if(typeof signature!=='string')return respond(res,400,{error:'Signature required'});
 const chunks:Buffer[]=[];let size=0;for await(const chunk of req){const b=Buffer.from(chunk);size+=b.length;if(size>1024*1024)return respond(res,413,{error:'Request too large'});chunks.push(b);}
 let event;try{event=stripe.webhooks.constructEvent(Buffer.concat(chunks),signature,secret);}catch{return respond(res,400,{error:'Invalid signature'});}
 await transaction(async(db,client)=>{const claimed=await client.query('INSERT INTO commerce_events(id) VALUES($1) ON CONFLICT DO NOTHING RETURNING id',[event.id]);if(!claimed.rows.length)return;await processEvent({stripe,db,event,account});});
 return respond(res,200,{received:true});
 }catch(error){return failure(res,error);}
}
