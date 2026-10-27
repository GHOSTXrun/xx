const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
export const STORAGE_KEY = 'zunon.solana.identity.v1'
export const MAX_RECORD_SIZE = 16000

export function encode58(bytes) {
 let n=0n
 for(const byte of bytes)n=n*256n+BigInt(byte)
 let out=''
 while(n){out=alphabet[Number(n%58n)]+out;n/=58n}
 for(const byte of bytes){if(byte!==0)break;out='1'+out}
 return out
}
export function decode58(text) {
 if(typeof text!=='string'||text.length<32||text.length>44)throw Error('Invalid Solana wallet address.')
 let n=0n
 for(const char of text){const i=alphabet.indexOf(char);if(i<0)throw Error('Invalid Solana wallet address.');n=n*58n+BigInt(i)}
 const bytes=[]
 while(n){bytes.unshift(Number(n%256n));n/=256n}
 for(const char of text){if(char!=='1')break;bytes.unshift(0)}
 if(bytes.length!==32)throw Error('A Solana wallet must contain 32 bytes.')
 return new Uint8Array(bytes)
}
function text(value,max,label,required=true) {
 if(typeof value!=='string'||value.length>max||(required&&!value.trim())||/[\u0000-\u001f\u007f]/.test(value))throw Error('Invalid '+label+'.')
 return value.trim()
}
export function normalizeProfile(value) {
 if(!value||typeof value!=='object')throw Error('Agent profile is missing.')
 const name=text(value.name,48,'Agent name')
 const description=text(value.description,280,'description',false)
 const endpoint=text(value.endpoint,200,'Agent URL',false)
 if(endpoint){let u;try{u=new URL(endpoint)}catch{throw Error('Enter a valid HTTPS Agent URL.')}if(u.protocol!=='https:'||u.username||u.password)throw Error('Agent URL must use HTTPS without credentials.')}
 return {name,description,endpoint}
}
export function normalizePayload(p) {
 if(!p||p.schema!=='zunon-agent-identity/v1'||p.network!=='solana')throw Error('Unsupported identity format.')
 decode58(p.wallet)
 const profile=normalizeProfile(p.profile)
 const origin=text(p.origin,200,'signing origin')
 let u;try{u=new URL(origin)}catch{throw Error('Invalid signing origin.')}
 if(u.origin!==origin||!(u.protocol==='https:'||(u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname))))throw Error('Invalid signing origin.')
 if(typeof p.issuedAt!=='string'||!Number.isFinite(Date.parse(p.issuedAt))||new Date(p.issuedAt).toISOString()!==p.issuedAt||Date.parse(p.issuedAt)>Date.now()+300000)throw Error('Invalid signing date.')
 if(typeof p.nonce!=='string'||! /^[0-9a-f-]{36}$/.test(p.nonce))throw Error('Invalid identity nonce.')
 return {schema:p.schema,network:p.network,wallet:p.wallet,profile,origin,issuedAt:p.issuedAt,nonce:p.nonce}
}
export function createPayload(profile,wallet,origin) {
 return normalizePayload({schema:'zunon-agent-identity/v1',network:'solana',wallet,profile,origin,issuedAt:new Date().toISOString(),nonce:crypto.randomUUID()})
}
export function messageFor(payload) {
 return 'ZUNON Agent Identity\nSign this public Agent profile. This does not authorize a transaction or grant access to funds.\n\n'+JSON.stringify(normalizePayload(payload),null,2)
}
export function toBase64(bytes){return btoa(String.fromCharCode(...bytes))}
export function fromBase64(value){
 if(typeof value!=='string'||! /^[A-Za-z0-9+/]*={0,2}$/.test(value)||value.length>MAX_RECORD_SIZE)throw Error('Invalid encoded signature.')
 try{return Uint8Array.from(atob(value),c=>c.charCodeAt(0))}catch{throw Error('Invalid encoded signature.')}
}
export async function verifyRecord(input) {
 if(!input||JSON.stringify(input).length>MAX_RECORD_SIZE)throw Error('Identity file is too large.')
 const payload=normalizePayload(input.payload)
 const signature=fromBase64(input.signature)
 if(signature.length!==64)throw Error('Invalid signature length.')
 if(!globalThis.crypto?.subtle)throw Error('Signature verification needs a secure, modern browser.')
 let key
 try{key=await crypto.subtle.importKey('raw',decode58(payload.wallet),{name:'Ed25519'},false,['verify'])}catch{throw Error('This browser does not support Ed25519 verification. Please update your browser.')}
 if(!await crypto.subtle.verify('Ed25519',key,signature,new TextEncoder().encode(messageFor(payload))))throw Error('Signature verification failed. The profile or signature may have changed.')
 return {payload,signature:toBase64(signature)}
}
export async function parseRecord(source){
 if(typeof source!=='string'||source.length>MAX_RECORD_SIZE)throw Error('Identity file is too large.')
 let value;try{value=JSON.parse(source)}catch{throw Error('Choose a valid ZUNON identity JSON file.')}
 return verifyRecord(value)
}
export function shareHash(record){
 return '#agent='+toBase64(new TextEncoder().encode(JSON.stringify(record))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'')
}
export async function readShare(hash){
 const value=hash.slice(7)
 if(!hash.startsWith('#agent=')||value.length>MAX_RECORD_SIZE*2||! /^[A-Za-z0-9_-]+$/.test(value))throw Error('Invalid shared identity link.')
 const raw=value.replaceAll('-','+').replaceAll('_','/')
 return parseRecord(new TextDecoder('utf-8',{fatal:true}).decode(fromBase64(raw+'='.repeat((4-raw.length%4)%4))))
}
export function availableWallets(scope=globalThis) {
 const choices=[{id:'phantom',name:'Phantom',provider:scope.phantom?.solana||(scope.solana?.isPhantom?scope.solana:null)},{id:'backpack',name:'Backpack',provider:scope.backpack?.solana||scope.backpack||(scope.solana?.isBackpack?scope.solana:null)}]
 return choices.filter(x=>typeof x.provider?.connect==='function'&&typeof x.provider?.signMessage==='function')
}
