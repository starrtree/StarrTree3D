// Operator-only CLI. Never expose this command as an HTTP endpoint.
import {randomUUID} from 'node:crypto';
import {config,service,token,digest} from '../server/commerce.mjs';
import {transaction,database} from '../server/ledger.mjs';
const [serviceId,email,phase='purchase',...scopeParts]=process.argv.slice(2);
const cfg=config(),s=service(serviceId,phase),scope=scopeParts.join(' ');
if(!s.approval || !email?.includes('@') || scope.length<20)throw Error('Usage: node --env-file=.env.local scripts/issue-test-invitation.mjs PRODUCT EMAIL purchase|recurring "Reviewed scope and Calendar/capacity confirmation; for recurring include SETUP_DELIVERED"');
if(phase==='recurring'&&!scope.includes('SETUP_DELIVERED'))throw Error('Confirm setup delivery before inviting monthly service');
const invitation=token();
try{await transaction(async(db,client)=>{if(s.capacity){const c=(await client.query('SELECT * FROM commerce_capacity WHERE name=$1',[s.capacity])).rows[0];if(!c||c.active===null||c.active>=c.maximum||Date.now()-new Date(c.reviewed_at).getTime()>7*86400000)throw Error('Review capacity before issuing invitation');}
await client.query('INSERT INTO commerce_approvals(id,token_hash,service_id,phase,email,scope,reviewed,setup_delivered,expires_at) VALUES($1,$2,$3,$4,$5,$6,true,$7,now()+interval \'24 hours\')',[randomUUID(),digest(invitation),s.id,phase,email,scope,phase==='recurring']);});
console.log(`${cfg.origin}/#/pay?${new URLSearchParams({service:s.id,phase,invitation})}`);
}finally{await database().end();}
