import pg from 'pg';
import {randomUUID} from 'node:crypto';
import {digest,token,PaymentError} from './commerce.mjs';
let pool;
export function database() {
  if(!process.env.COMMERCE_DATABASE_URL) throw new PaymentError('Sandbox ledger is not configured.',503);
  return pool ||= new pg.Pool({connectionString:process.env.COMMERCE_DATABASE_URL,max:2,connectionTimeoutMillis:5000,options:"-c search_path=starrtree_commerce"});
}
export class Ledger {
  constructor(client) {this.client=client;}
  async prepareOrder(s,body) {
    let approval;
    if(s.approval) {
      if(typeof body.invitation!=='string' || !/^[a-f0-9]{64}$/.test(body.invitation)) return null;
      approval=(await this.client.query('SELECT * FROM commerce_approvals WHERE token_hash=$1 AND service_id=$2 AND phase=$3 AND expires_at>now() FOR UPDATE',[digest(body.invitation),s.id,s.phase])).rows[0];
      if(!approval || !approval.reviewed || (s.phase==='recurring' && !approval.setup_delivered)) return null;
      const prior=(await this.client.query('SELECT * FROM commerce_orders WHERE approval_id=$1',[approval.id])).rows[0];
      if(prior) return prior;
    }
    if(s.capacity) {
      const cap=(await this.client.query('SELECT * FROM commerce_capacity WHERE name=$1 FOR UPDATE',[s.capacity])).rows[0];
      if(!cap || cap.active===null || new Date(cap.reviewed_at).getTime()<Date.now()-7*86400000) throw new PaymentError('Request Next Opening: capacity needs review.',409);
      if(cap.active>=cap.maximum) throw new PaymentError('Join Project Queue: capacity is full.',409);
    }
    let preset=null;
    if(s.name==='BandLab Vocal Preset') {
      // Approved paid selection names are supplied by the operator; never accept a URL from the client.
      const choices=(await this.client.query('SELECT name FROM commerce_presets WHERE name=$1 AND active=true',[body.preset])).rows;
      if(!choices.length) throw new PaymentError('Select an available paid preset.');
      preset=choices[0].name;
    }
    const result=await this.client.query('INSERT INTO commerce_orders(id,service_id,phase,approval_id,email,access_token,preset) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',[randomUUID(),s.id,s.phase,approval?.id||null,approval?.email||null,token(),preset]);
    return result.rows[0];
  }
  async attachSession(id,session) {await this.client.query('UPDATE commerce_orders SET session_id=$2 WHERE id=$1',[id,session]);}
  async findOrder(id) {if(!/^[a-f0-9-]{36}$/.test(id))return null;return (await this.client.query('SELECT * FROM commerce_orders WHERE id=$1 FOR UPDATE',[id])).rows[0];}
  async findSession(session) {return (await this.client.query('SELECT * FROM commerce_orders WHERE session_id=$1',[session])).rows[0];}
  async findAccess(access) {return (await this.client.query('SELECT * FROM commerce_orders WHERE access_token=$1',[access])).rows[0];}
  async recordState(id,state,subscription) {await this.client.query("UPDATE commerce_orders SET state=CASE WHEN state='paid' THEN state ELSE $2 END, subscription_id=COALESCE(subscription_id,$3), updated_at=now() WHERE id=$1",[id,state,typeof subscription==='string'?subscription:null]);}
  async recordSubscription(id,state) {await this.client.query('UPDATE commerce_orders SET subscription_status=$2,updated_at=now() WHERE subscription_id=$1',[id,state]);}
}
/** @template T @param {(ledger: Ledger, client: import("pg").PoolClient) => Promise<T>} fn @returns {Promise<T>} */
export async function transaction(fn) {
 const client=await database().connect();
 try {await client.query('BEGIN'); const value=await fn(new Ledger(client),client); await client.query('COMMIT'); return value;}
 catch(error) {await client.query('ROLLBACK'); throw error;} finally {client.release();}
}
export async function rateLimit(key,maximum=20) {
 return transaction(async(_db,client)=>{
  const {rows}=await client.query(`INSERT INTO commerce_rate_limits(key) VALUES($1)
   ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN commerce_rate_limits.window_start<now()-interval '1 minute' THEN 1 ELSE commerce_rate_limits.hits+1 END,
   window_start=CASE WHEN commerce_rate_limits.window_start<now()-interval '1 minute' THEN now() ELSE commerce_rate_limits.window_start END RETURNING hits`,[key]);
  return rows[0].hits<=maximum;
 });
}
