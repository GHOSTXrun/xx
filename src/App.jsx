import {useEffect,useState} from 'react'
import AgentIdentity from './AgentIdentity'
import OfficialInfo from './OfficialInfo'
import VerifiedMarket from './VerifiedMarket'
import LiveRulesPanel from './LiveRulesPanel'
import LiveForum from './LiveForum'
import RealDialog from './RealDialog'
import {caLabel} from './project'

const go=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})
export default function App(){
 const [overlay,setOverlay]=useState('')
 const [mono,setMono]=useState(false)
 const [clock,setClock]=useState(new Date())
 const [command,setCommand]=useState('')
 const [output,setOutput]=useState(['ZUNON/OS READY / SOLANA / CA: '+caLabel])
 useEffect(()=>{const timer=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(timer)},[])
 useEffect(()=>{
  const handler=e=>{
   if(e.key==='Escape'){setOverlay('');return}
   if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return
   const routes={F1:'market',F3:'access',F4:'rules',F5:'forum',F6:'official'}
   if(routes[e.key]){e.preventDefault();go(routes[e.key])}
   if(e.key==='F2'){e.preventDefault();setOverlay('launch')}
   if(e.key==='F8'){e.preventDefault();setMono(v=>!v)}
  }
  addEventListener('keydown',handler);return()=>removeEventListener('keydown',handler)
 },[])
 function run(e){
  e.preventDefault()
  const cmd=command.trim().toLowerCase()
  if(!cmd)return
  const routes={market:'market',connect:'access',identity:'access',rules:'rules',forum:'forum',official:'official',roadmap:'roadmap'}
  let response=''
  if(routes[cmd]){go(routes[cmd]);response='Opened '+routes[cmd]}
  else if(cmd==='launch'){setOverlay('launch');response='Token launch status'}
  else if(cmd==='status')response='SOLANA / CA: '+caLabel+' / AGENT IDENTITY AVAILABLE'
  else if(cmd==='mono'){setMono(v=>!v);response='Display mode changed'}
  else if(cmd==='clear'){setOutput([]);setCommand('');return}
  else response=cmd==='help'?'MARKET IDENTITY CONNECT LAUNCH RULES FORUM OFFICIAL ROADMAP STATUS MONO CLEAR':'Unknown command. Type HELP.'
  setOutput(v=>[...v,'> '+cmd,response].slice(-3));setCommand('')
 }
 return <div className={'terminal-os '+(mono?'mono':'')}><div className="crt-glass"/><div className="machine">
  <div className="bios-line"><span>ZUNON BIOS / 2026</span><span>NETWORK: SOLANA</span><b>{clock.toLocaleTimeString('en-GB',{hour12:false})}</b></div>
  <header className="app-title"><span>ZN</span><b>ZUNON/OS</b><em>Solana Agent Terminal</em><i aria-hidden="true">[-] [ ] [X]</i></header>
  <nav className="menu-bar" aria-label="Main navigation">
   <button onClick={()=>go('market')}>PROJECT</button>
   <button className="wallet-nav" onClick={()=>go('access')}>CREATE AGENT ID</button>
   <button onClick={()=>setOverlay('launch')}>TOKEN / CA: {caLabel}</button>
   <button onClick={()=>go('roadmap')}>ROADMAP</button>
   <button onClick={()=>go('forum')}>BBS</button>
   <button onClick={()=>go('official')}>OFFICIAL LINKS</button><span>SOLANA</span>
  </nav>
  <section className="launch-hero">
   <div><span className="eyebrow">SOLANA / AGENT IDENTITY & COORDINATION</span><h1>A terminal for<br/>the agent economy.</h1><p>Give your Agent a wallet-backed identity. Create a signed profile, share its proof and join a network built around Solana.</p>
   <div className="hero-actions"><button className="primary-action" onClick={()=>go('access')}>Create your Agent ID →</button><button onClick={()=>go('official')}>$ZUNON / CA: {caLabel}</button></div></div>
   <div className="hero-terminal" aria-label="Product availability"><span>ZUNON://SYSTEM_STATUS</span><p><b>[AVAILABLE]</b> Signed Agent identities</p><p><b>[AVAILABLE]</b> Export & share profiles</p><p><em>[BUILDING]</em> Signed community board</p><p><em>[PLANNED]</em> Solana activity registry</p><footer>01 WALLET → 02 PROFILE → 03 SIGNATURE</footer></div>
  </section>
  <OfficialInfo/>
  <AgentIdentity/>
  <div className="location"><b>C:&#92;ZUNON&#92;PROJECT&gt;</b><span>PUBLIC PROJECT OVERVIEW</span></div>
  <div className="workspace product-workspace triple-workspace" id="market"><VerifiedMarket/></div>
  <section className="roadmap-section" id="roadmap">
   <span className="eyebrow">BUILD IN PUBLIC</span><h2>One working step at a time.</h2>
   <div className="roadmap-grid"><article><span>01 / AVAILABLE</span><h3>Identity</h3><p>Connect Phantom or Solflare, sign an Agent profile, verify the proof and share it.</p></article><article><span>02 / IN DEVELOPMENT</span><h3>Coordination</h3><p>A signed development board for Agent research, integration notes and builder conversations.</p></article><article><span>03 / PLANNED</span><h3>Onchain activity</h3><p>Connect Solana activity to Agent profiles with transaction evidence and clear attribution.</p></article></div>
  </section>
  <div className="info-row"><LiveRulesPanel/></div>
  <LiveForum/>
  <footer className="terminal-footer">
   <form className="prompt" onSubmit={run}><label htmlFor="terminal-command">C:&#92;ZUNON&gt;</label><input id="terminal-command" value={command} onChange={e=>setCommand(e.target.value)} autoComplete="off" spellCheck="false" placeholder="Type HELP"/><span>_</span></form>
   <div className="output-line" aria-live="polite">{output.map((line,i)=><span key={i}>{line}</span>)}</div>
   <div className="fkeys"><button onClick={()=>go('market')}><i>F1</i>Project</button><button onClick={()=>setOverlay('launch')}><i>F2</i>Token</button><button onClick={()=>go('access')}><i>F3</i>Identity</button><button onClick={()=>go('rules')}><i>F4</i>Notes</button><button onClick={()=>go('forum')}><i>F5</i>BBS</button><button onClick={()=>go('official')}><i>F6</i>Official</button><button onClick={()=>setMono(v=>!v)}><i>F8</i>Display</button></div>
   <div className="statusline"><span>SOLANA</span><span>CA: {caLabel}</span><span>IDENTITY AVAILABLE</span><b>ZUNON / BUILD IN PUBLIC</b></div>
  </footer>
  {overlay&&<div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)setOverlay('')}}><RealDialog type={overlay} close={()=>setOverlay('')}/></div>}
 </div></div>
}
