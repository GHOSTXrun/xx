import {useEffect,useRef,useState} from 'react'
import {availableWallets,createPayload,messageFor,normalizeProfile,parseRecord,readShare,shareHash,STORAGE_KEY,toBase64,verifyRecord,MAX_RECORD_SIZE} from './identity.mjs'

const empty={name:'',description:'',endpoint:''}
export default function AgentIdentity(){
 const [wallets,setWallets]=useState([])
 const [choice,setChoice]=useState('')
 const [wallet,setWallet]=useState('')
 const [form,setForm]=useState(empty)
 const [record,setRecord]=useState(null)
 const [busy,setBusy]=useState(false)
 const [notice,setNotice]=useState('')
 const [error,setError]=useState('')
 const [preview,setPreview]=useState(null)
 const providerRef=useRef(null)
 const cleanupRef=useRef(()=>{})
 const epoch=useRef(0)
 const fileRef=useRef(null)
 const formRef=useRef(form)
 formRef.current=form

 function detect(){
  const list=availableWallets(window)
  setWallets(list)
  setChoice(current=>list.some(w=>w.id===current)?current:list[0]?.id||'')
 }
 useEffect(()=>{
  let active=true
  detect()
  const timer=setInterval(detect,2000)
  async function restore(){
   const version=epoch.current
   try{
    const shared=location.hash.startsWith('#agent=')
    const saved=shared?null:localStorage.getItem(STORAGE_KEY)
    if(!shared&&!saved)return
    const result=await(shared?readShare(location.hash):parseRecord(saved))
    if(active&&version===epoch.current){setRecord(result);setForm(result.payload.profile);setNotice(shared?'Shared profile signature verified.':'Saved profile signature verified.')}
   }catch(cause){if(active&&version===epoch.current)setError(cause.message)}
  }
  restore()
  const onHash=()=>{if(location.hash.startsWith('#agent=')){epoch.current++;setPreview(null);restore()}}
  addEventListener('hashchange',onHash)
  return()=>{active=false;epoch.current++;clearInterval(timer);removeEventListener('hashchange',onHash);cleanupRef.current()}
 },[])

 async function connect(id){
  setChoice(id)
  setBusy(true);setError('');setNotice('');setPreview(null);epoch.current++
  try{
   const provider=availableWallets(window).find(w=>w.id===id)?.provider
   if(!provider)throw Error('Open this page in the Phantom or Backpack wallet browser, or install its browser extension. Then refresh wallet detection.')
   await provider.connect()
   if(!provider.publicKey)throw Error('The wallet did not return an address.')
   cleanupRef.current()
   providerRef.current=provider
   setWallet(provider.publicKey.toString())
   const changed=()=>{
    epoch.current++;setPreview(null)
    setWallet(provider.publicKey?.toString()||'')
    setNotice('Wallet changed. Review your profile before signing.')
   }
   const disconnected=()=>{epoch.current++;setWallet('');setPreview(null);providerRef.current=null}
   provider.on?.('accountChanged',changed)
   provider.on?.('disconnect',disconnected)
   cleanupRef.current=()=>{provider.removeListener?.('accountChanged',changed);provider.removeListener?.('disconnect',disconnected)}
  }catch(cause){setError(cause.code===4001?'Wallet connection cancelled.':cause.message||'Could not connect wallet.')}
  finally{setBusy(false)}
 }
 async function disconnect(){
  epoch.current++;setPreview(null);cleanupRef.current()
  const provider=providerRef.current;providerRef.current=null;setWallet('')
  try{await provider?.disconnect?.()}catch{setNotice('Wallet detached from this page.')}
 }
 function edit(key,value){epoch.current++;setForm(current=>({...current,[key]:value}));setPreview(null);setNotice('');setError('')}
 function prepare(event){
  event.preventDefault();setError('');setNotice('')
  try{
   if(!wallet||!providerRef.current)throw Error('Connect a Solana wallet first.')
   const payload=createPayload(form,wallet,location.origin)
   setPreview(payload)
  }catch(cause){setError(cause.message)}
 }
 async function sign(){
  setBusy(true);setError('');setNotice('')
  const version=epoch.current
  try{
   const provider=providerRef.current
   if(!preview||!provider||provider.publicKey?.toString()!==preview.wallet)throw Error('Wallet changed. Review the message again.')
   const result=await provider.signMessage(new TextEncoder().encode(messageFor(preview)),'utf8')
   if(version!==epoch.current||provider.publicKey?.toString()!==preview.wallet)throw Error('Profile or wallet changed while signing. Please review again.')
   const signature=result.signature instanceof Uint8Array?result.signature:Uint8Array.from(result.signature||result)
   const verified=await verifyRecord({payload:preview,signature:toBase64(signature)})
   if(version!==epoch.current)throw Error('Profile changed during verification. Please try again.')
   setRecord(verified);setPreview(null);setNotice('Signature verified. Your Agent identity card is ready.')
   try{localStorage.setItem(STORAGE_KEY,JSON.stringify(verified))}catch{setNotice('Signature verified. Browser storage is unavailable; export your identity to keep a copy.')}
  }catch(cause){setError(cause.code===4001?'Signature cancelled. No profile was created.':cause.message||'Unable to sign this profile.')}
  finally{setBusy(false)}
 }
 async function importFile(event){
  const file=event.target.files?.[0];event.target.value=''
  if(!file)return
  setBusy(true);setError('');setNotice('');setPreview(null)
  const version=++epoch.current
  try{
   if(file.size>MAX_RECORD_SIZE)throw Error('Identity JSON must be smaller than 16 KB.')
   const verified=await parseRecord(await file.text())
   if(version!==epoch.current)return
   setRecord(verified);setForm(verified.payload.profile);setNotice('Imported identity signature verified. Export to retain a copy.')
  }catch(cause){setError(cause.message)}
  finally{setBusy(false)}
 }
 function download(){
  const url=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json'}))
  const a=document.createElement('a');a.href=url;a.download='zunon-agent-identity.json';a.click()
  setTimeout(()=>URL.revokeObjectURL(url),1000)
 }
 async function copyLink(){
  try{await navigator.clipboard.writeText(location.origin+location.pathname+shareHash(record));setNotice('Public profile link copied. Anyone with this link can read the signed profile.')}
  catch{setError('Clipboard unavailable. Export the JSON identity instead.')}
 }
 function clear(){
  epoch.current++;setRecord(null);setPreview(null);setForm(empty);setError('');setNotice('Local profile cleared.')
  try{localStorage.removeItem(STORAGE_KEY)}catch{}
  if(location.hash.startsWith('#agent='))history.replaceState(null,'',location.pathname+location.search+'#access')
 }
 const dirty=record&&JSON.stringify(record.payload.profile)!==JSON.stringify((()=>{try{return normalizeProfile(form)}catch{return form}})())
 return <section className="frame identity-section" id="access">
  <div className="frame-title"><span>|- AGENT IDENTITY :: SOLANA -|</span><b>AVAILABLE</b></div>
  <div className="identity-intro"><span className="eyebrow">01 / CREATE YOUR AGENT ID</span><h2>A wallet. An identity. A signed record.</h2><p>Connect a Solana wallet, describe your Agent and sign its public profile. Export the proof or share a link anyone can verify.</p></div>
  <div className="identity-grid">
   <form className="identity-form" onSubmit={prepare}>
    <div className="wallet-picker" aria-label="Supported Solana wallets">{['backpack','phantom'].map(id=><button key={id} type="button" className={'wallet-choice '+id+(wallet&&choice===id?' connected':'')} disabled={busy||!!wallet} onClick={()=>connect(id)}><WalletIcon kind={id}/><span>{id==='backpack'?'Connect Backpack':'Connect Phantom'}<small>{wallet&&choice===id?'CONNECTED':wallets.some(w=>w.id===id)?'DETECTED':'EXTENSION / IN-APP BROWSER'}</small></span></button>)}</div>
    {wallet&&<button type="button" disabled={busy} onClick={disconnect}>Disconnect</button>}
    <p className="wallet-address">{wallet||'Only Backpack and Phantom are supported. On mobile, open this site inside your wallet browser.'}</p>
    {!wallets.length&&<div className="wallet-help"><button type="button" onClick={detect}>Detect wallets again</button><a href="https://backpack.app/download" target="_blank" rel="noreferrer">Get Backpack ↗</a><a href="https://phantom.com/download" target="_blank" rel="noreferrer">Get Phantom ↗</a></div>}
    <label>AGENT NAME<input required maxLength={48} value={form.name} disabled={busy} onChange={e=>edit('name',e.target.value)} placeholder="e.g. Atlas Research Agent"/></label>
    <label>WHAT DOES YOUR AGENT DO?<textarea maxLength={280} value={form.description} disabled={busy} onChange={e=>edit('description',e.target.value)} placeholder="Describe its role and capabilities."/><small>{form.description.length}/280</small></label>
    <label>AGENT URL / OPTIONAL<input type="url" maxLength={200} value={form.endpoint} disabled={busy} onChange={e=>edit('endpoint',e.target.value)} placeholder="https://your-agent.example"/></label>
    <p className="identity-note">Your profile, wallet address and signing origin are public when shared. Signatures attest to wallet control, not Agent autonomy.</p>
    <button className="primary-action" disabled={busy||!wallet} type="submit">Review identity message →</button>
    {preview&&<div className="message-preview"><b>REVIEW EXACT SIGNING MESSAGE</b><pre>{messageFor(preview)}</pre><p>This requests a message signature. It does not submit a transaction.</p><button className="primary-action" type="button" disabled={busy} onClick={sign}>{busy?'Waiting for wallet…':'Sign & verify identity'}</button><button type="button" disabled={busy} onClick={()=>setPreview(null)}>Cancel</button></div>}
   </form>
   <div className="identity-result">
    {record?<article className="agent-card">
     <div className="card-top"><span>ZUNON / AGENT ID</span><b>SIGNATURE VERIFIED</b></div>
     <div className="agent-avatar" aria-hidden="true">{record.payload.profile.name.slice(0,2).toUpperCase()}</div>
     <h3>{record.payload.profile.name}</h3><p>{record.payload.profile.description||'No description supplied.'}</p>
     <dl><dt>NETWORK</dt><dd>SOLANA</dd><dt>WALLET</dt><dd>{record.payload.wallet}</dd><dt>SIGNED AT</dt><dd>{new Date(record.payload.issuedAt).toLocaleString()}</dd><dt>SIGNING ORIGIN</dt><dd>{record.payload.origin}</dd>{record.payload.profile.endpoint&&<><dt>AGENT URL</dt><dd><a href={record.payload.profile.endpoint} target="_blank" rel="noreferrer">{record.payload.profile.endpoint} ↗</a></dd></>}</dl>
     {dirty&&<p className="identity-warning">Draft changed. This card still shows the last signed profile. Sign again to update it.</p>}
     <p className="identity-note">This is a portable signed profile, not an onchain registration or verification of the Agent's claims. Linked Agent URLs are supplied by the signer.</p>
     <div className="identity-actions"><button type="button" disabled={busy} onClick={download}>Export JSON ↓</button><button type="button" disabled={busy} onClick={copyLink}>Copy public link ↗</button></div>
    </article>:<div className="identity-empty"><div aria-hidden="true">[ AGENT_ID ]</div><h3>Your Agent starts here.</h3><p>Connect → Describe → Sign → Share</p><p>No token or transaction fee is required to create this signed profile.</p></div>}
    <div className="identity-actions"><input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={importFile}/><button type="button" disabled={busy} onClick={()=>fileRef.current?.click()}>Import & verify JSON</button>{record&&<button type="button" disabled={busy} onClick={clear}>Clear local profile</button>}</div>
    <p className="identity-note">Profiles are saved in this browser after signing. Shared links carry the signed profile; there is no public profile database yet.</p>
   </div>
  </div>
  <div className="identity-feedback" aria-live="polite" role="status">{busy&&<p>Wallet operation or verification in progress…</p>}{notice&&<p>{notice}</p>}{error&&<p role="alert" className="identity-error">{error}</p>}</div>
 </section>
}

function WalletIcon({kind}){
 return kind==='backpack'?<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="2"/><rect x="5" y="7" width="14" height="15" rx="4" fill="currentColor"/><path d="M8 14h8M8 17h8M9 10h6" stroke="#170c0f" strokeWidth="1.5"/></svg>:<svg width="25" height="24" viewBox="0 0 25 24" aria-hidden="true"><path d="M4 20c-1.8 0-2.8-1.5-2-3.7C4.2 8.9 8.1 4 15 4c5 0 8 2.6 8 6.8 0 4.7-3.8 9.2-6.5 9.2-1.4 0-1.8-.8-1.6-2-1.1 1.4-2.3 2-3.5 2-1.3 0-1.7-.8-1.5-2-1.7 1.4-3.5 2-5.9 2Z" fill="currentColor"/><ellipse cx="14" cy="10.5" rx="1" ry="1.5" fill="#201b2c"/><ellipse cx="18" cy="10.5" rx="1" ry="1.5" fill="#201b2c"/></svg>
}
