import test from 'node:test'
import assert from 'node:assert/strict'
import {availableWallets,createPayload,decode58,encode58,messageFor,normalizeProfile,parseRecord,readShare,shareHash,toBase64,verifyRecord} from '../src/identity.mjs'
async function fixture(){
 const keys=await crypto.subtle.generateKey('Ed25519',true,['sign','verify'])
 const wallet=encode58(new Uint8Array(await crypto.subtle.exportKey('raw',keys.publicKey)))
 const payload=createPayload({name:'Atlas',description:'Solana research',endpoint:'https://example.com/agent'},wallet,'https://ghostxrun.github.io')
 const signature=toBase64(new Uint8Array(await crypto.subtle.sign('Ed25519',keys.privateKey,new TextEncoder().encode(messageFor(payload)))))
 return {payload,signature}
}
test('signed profile verifies after JSON export/import and sharing',async()=>{
 const record=await fixture()
 assert.deepEqual(await verifyRecord(record),record)
 assert.deepEqual(await parseRecord(JSON.stringify(record)),record)
 assert.deepEqual(await readShare(shareHash(record)),record)
})
test('changed identity claims and wrong signing keys invalidate proof',async()=>{
 const original=await fixture()
 for(const mutate of [
  r=>{r.payload.profile.name='Impostor'},r=>{r.payload.profile.description='Altered'},
  r=>{r.payload.profile.endpoint='https://attacker.example'},r=>{r.payload.origin='https://attacker.example'},
  r=>{r.payload.issuedAt='2026-01-01T00:00:00.000Z'},r=>{r.payload.nonce=crypto.randomUUID()},
 ]){const changed=structuredClone(original);mutate(changed);await assert.rejects(()=>verifyRecord(changed),/verification failed/)}
 const other=await fixture()
 await assert.rejects(()=>verifyRecord({...original,payload:{...original.payload,wallet:other.payload.wallet}}),/verification failed/)
})
test('malformed, oversized, wrong-chain and invalid-signature records fail',async()=>{
 const record=await fixture()
 await assert.rejects(()=>parseRecord('{bad'),/valid ZUNON/)
 await assert.rejects(()=>parseRecord('x'.repeat(17000)),/too large/)
 await assert.rejects(()=>verifyRecord({...record,payload:{...record.payload,network:'ethereum'}}),/Unsupported/)
 await assert.rejects(()=>verifyRecord({...record,signature:toBase64(new Uint8Array(63))}),/length/)
 await assert.rejects(()=>readShare('#agent=invalid~'),/Invalid/)
})
test('validates addresses and profile limits, rejects executable URLs',()=>{
 const raw=new Uint8Array(32);raw[31]=1
 assert.deepEqual(decode58(encode58(raw)),raw)
 assert.throws(()=>decode58('0'.repeat(44)),/Invalid/)
 assert.throws(()=>decode58('1'.repeat(33)),/32 bytes/)
 assert.throws(()=>normalizeProfile({name:'',description:'',endpoint:''}),/name/)
 assert.throws(()=>normalizeProfile({name:'X'.repeat(49),description:'',endpoint:''}),/name/)
 for(const endpoint of ['javascript:alert(1)','http://example.com','https://user:password@example.com'])
  assert.throws(()=>normalizeProfile({name:'Agent',description:'',endpoint}),/HTTPS/)
 assert.deepEqual(normalizeProfile({name:' Agent ',description:'hello',endpoint:''}),{name:'Agent',description:'hello',endpoint:''})
})
test('offers only supported injected wallets with message-signing support',()=>{
 const provider={connect(){},signMessage(){}}
 assert.deepEqual(availableWallets({phantom:{solana:provider},solflare:provider}).map(w=>w.id),['phantom','solflare'])
 assert.deepEqual(availableWallets({solana:{connect(){}}}),[])
})
