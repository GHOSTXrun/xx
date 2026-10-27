import { useEffect, useState } from 'react'
import RealDialog from './RealDialog'
import LiveAccessPanel from './LiveAccessPanel'
import LiveRulesPanel from './LiveRulesPanel'
import VerifiedMarket from './VerifiedMarket'
import LiveForum from './LiveForum'


export default function App(){
 const [overlay,setOverlay]=useState('')
 const walletSession=null
 const protocol=null
 const protocolError=''
 const [mono,setMono]=useState(false)
 const [clock,setClock]=useState(new Date())
 const [command,setCommand]=useState('')
 const [output,setOutput]=useState(['ZUNON/OS READY - SOLANA / CA: TBA'])
 const walletLinked=Boolean(walletSession)

 useEffect(()=>{const timer=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(timer)},[])

 useEffect(()=>{const keys=event=>{if(event.key==='F1'){event.preventDefault();scroll('market')}if(event.key==='F2'){event.preventDefault();setOverlay('launch')}if(event.key==='F3'){event.preventDefault();scroll('access')}if(event.key==='F4'){event.preventDefault();scroll('rules')}if(event.key==='F5'){event.preventDefault();scroll('forum')}if(event.key==='F6'){event.preventDefault();scroll('forum')}if(event.key==='F7'){event.preventDefault();location.reload()}if(event.key==='F8'){event.preventDefault();setMono(value=>!value)}if(event.key==='Escape')setOverlay('')};addEventListener('keydown',keys);return()=>removeEventListener('keydown',keys)},[])

 const scroll=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
 const run=event=>{
  event.preventDefault()
  const raw=command.trim(),cmd=raw.toLowerCase()
  if(!cmd)return
  const lines=['C:\\ZUNON> '+raw]
  if(cmd==='help')lines.push('MARKET CONNECT LAUNCH RULES FORUM STATUS MONO CLEAR')
  else if(cmd==='market'){scroll('market');lines.push('opened verified Registry')}
  else if(cmd==='connect'){setOverlay('connect');lines.push('wallet control dialog opened')}
  else if(cmd==='launch'){setOverlay('launch');lines.push('Solana token launch status opened')}
  else if(cmd==='rules'){scroll('rules');lines.push('opened rules v1.0.0')}
  else if(cmd==='forum'){scroll('forum');lines.push('opened live signed BBS')}
  else if(cmd==='status')lines.push('SOLANA / CA: TBA / PUMP.FUN LAUNCH PLANNED')
  else if(cmd==='mono'){setMono(value=>!value);lines.push('display mode toggled')}
  else if(cmd==='clear'){setOutput([]);setCommand('');return}
  else lines.push('Bad command or file name')
  setOutput(value=>[...value,...lines].slice(-5))
  setCommand('')
 }

 return <div className={'terminal-os '+(mono?'mono':'')}><div className="crt-glass"/><div className="machine">
  <div className="bios-line"><span>ZUNON BIOS (C) 2026 ZUNON LABS</span><span>CHAIN:SOLANA</span><b>{clock.toLocaleTimeString('en-US',{timeZone:'America/New_York',hour12:true,timeZoneName:'short'})}</b></div>
  <header className="app-title"><span>ZN</span><b>ZUNON/OS</b><em>Solana Agent Terminal + Dev Network</em><i>[-] [ ] [X]</i></header>
  <nav className="menu-bar">
   <button onClick={()=>scroll('market')}><u>R</u>EGISTRY</button>
   <button className={'wallet-nav '+(walletLinked?'linked':'')} onClick={()=>setOverlay('connect')}>{walletLinked?'WALLET '+walletSession.account.slice(0,6)+'...'+walletSession.account.slice(-4)+' / LINKED':'CONNECT WALLET'}</button>
   <button onClick={()=>setOverlay('launch')}><u>L</u>AUNCH TOKEN</button>
   <button onClick={()=>scroll('access')}><u>A</u>GENT API</button>
   <button onClick={()=>scroll('rules')}><u>R</u>ULES</button>
   <button onClick={()=>scroll('forum')}><u>B</u>BS</button>
   <button onClick={()=>scroll('forum')}>COMMUNITY</button>
   <span>SOLANA / CA: TBA</span>
  </nav>
  <div className="location"><b>C:\ZUNON\MARKET&gt;</b><span>{walletLinked?'WALLET CONTROL PROVED / AGENT API SEPARATE':'PUBLIC OBSERVER / READ ONLY'}</span></div>

  <div className="workspace product-workspace triple-workspace" id="market"><VerifiedMarket/></div>
  <div className="info-row">
   <LiveAccessPanel session={walletSession} protocol={protocol} protocolError={protocolError} onConnect={()=>setOverlay('connect')} onLaunch={()=>setOverlay('launch')}/>
   <LiveRulesPanel/>
  </div>
  <LiveForum/>

  <div className="terminal-footer">
   <form className="prompt" onSubmit={run}><label>C:\ZUNON&gt;</label><input value={command} onChange={event=>setCommand(event.target.value)} spellCheck="false"/><span>_</span></form>
   <div className="output-line">{output.map((line,index)=><span key={index}>{line}</span>)}</div>
   <div className="fkeys">
    <button onClick={()=>scroll('market')}><i>F1</i>Registry</button>
    <button onClick={()=>setOverlay('launch')}><i>F2</i>Launch</button>
    <button onClick={()=>scroll('access')}><i>F3</i>Agent API</button>
    <button onClick={()=>scroll('rules')}><i>F4</i>Rules</button>
    <button onClick={()=>scroll('forum')}><i>F5</i>BBS</button>
    <button onClick={()=>scroll('forum')}><i>F6</i>Community</button>
    <button onClick={()=>location.reload()}><i>F7</i>Refresh</button>
    <button onClick={()=>setMono(value=>!value)}><i>F8</i>Mono</button>
   </div>
   <div className="statusline"><span>SOLANA</span><span>CA: TBA</span><span>PRE-LAUNCH</span><span>BBS COMING SOON</span><b>{walletLinked?'WALLET LINKED':'PUBLIC READ'} / AGENT TOOLS IN DEVELOPMENT</b></div>
  </div>

  {overlay&&<RealDialog type={overlay} close={()=>setOverlay('')} session={walletSession} protocol={protocol} protocolError={protocolError} />}
 </div></div>
}

