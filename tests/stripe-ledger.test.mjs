import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {Ledger} from '../server/ledger.mjs';
import {service,catalog,token,digest} from '../server/commerce.mjs';
test('PostgreSQL schema enforces invitations, expiry, capacity, preset selection and durable uniqueness',async()=>{
 const client=new PGlite();try{
 await client.exec(readFileSync(new URL('../server/schema.sql',import.meta.url),'utf8'));
 const ledger=new Ledger(client),s=service(catalog.find(x=>x.name==='Starter One-Page Website').id),invitation=token(),id=randomUUID();
 assert.equal(await ledger.prepareOrder(s,{invitation}),null);
 await client.query("INSERT INTO commerce_approvals(id,token_hash,service_id,phase,email,reviewed,scope,expires_at) VALUES($1,$2,$3,'purchase','test@example.invalid',true,'Reviewed scope',now()+interval '1 hour')",[id,digest(invitation),s.id]);
 await assert.rejects(ledger.prepareOrder(s,{invitation}),/capacity needs review/);
 await client.query("UPDATE commerce_capacity SET active=3,reviewed_at=now() WHERE name='websites'");
 await assert.rejects(ledger.prepareOrder(s,{invitation}),/capacity is full/);
 await client.query("UPDATE commerce_capacity SET active=1,reviewed_at=now() WHERE name='websites'");
 const order=await ledger.prepareOrder(s,{invitation});assert.equal((await ledger.prepareOrder(s,{invitation})).id,order.id);
 await ledger.attachSession(order.id,'cs_test');await ledger.recordState(order.id,'paid',null);await ledger.recordState(order.id,'pending',null);assert.equal((await ledger.findSession('cs_test')).state,'paid');
 const e=await client.query("INSERT INTO commerce_events(id) VALUES('evt_test') ON CONFLICT DO NOTHING RETURNING id");assert.equal(e.rows.length,1);assert.equal((await client.query("INSERT INTO commerce_events(id) VALUES('evt_test') ON CONFLICT DO NOTHING RETURNING id")).rows.length,0);
 await client.query('UPDATE commerce_approvals SET expires_at=now()-interval \'1 hour\' WHERE id=$1',[id]);assert.equal(await ledger.prepareOrder(s,{invitation}),null);
 const preset=service(catalog.find(x=>x.name==='BandLab Vocal Preset').id);await assert.rejects(ledger.prepareOrder(preset,{preset:'unknown'}),/Select an available/);
 await client.query("INSERT INTO commerce_presets VALUES('VG3',true)");assert.equal((await ledger.prepareOrder(preset,{preset:'VG3'})).preset,'VG3');
 const r=service(catalog.find(x=>x.name==='AI Receptionist Starter').id,'recurring'),t=token();
 await client.query("INSERT INTO commerce_approvals(id,token_hash,service_id,phase,email,reviewed,scope,expires_at) VALUES($1,$2,$3,'recurring','test@example.invalid',true,'Reviewed setup',now()+interval '1 hour')",[randomUUID(),digest(t),r.id]);assert.equal(await ledger.prepareOrder(r,{invitation:t}),null);
 }finally{await client.close();}
});
