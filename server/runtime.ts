import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {config,PaymentError} from './commerce.mjs';
export type Request=VercelRequest;
export type Response=VercelResponse;
export function runtime(){const cfg=config(); return {...cfg,stripe:new Stripe(process.env.STRIPE_SECRET_KEY!)};}
export function respond(res:Response,status:number,body:unknown){res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');return res.status(status).json(body);}
export function failure(res:Response,error:unknown){return respond(res,error instanceof PaymentError?error.status:503,{error:error instanceof PaymentError?error.message:'Sandbox payment service unavailable. Contact StarrTree.'});}
export function post(req:Request,res:Response,origin:string){
 if(req.method!=='POST'){res.setHeader('Allow','POST');respond(res,405,{error:'Method not allowed'});return false;}
 if(req.headers.origin!==origin){respond(res,403,{error:'Invalid origin'});return false;}
 if(!req.headers['content-type']?.startsWith('application/json')){respond(res,415,{error:'JSON required'});return false;}
 return true;
}
