import {useState} from 'react'
import {project,caLabel} from './project'
export default function OfficialInfo(){
 const [notice,setNotice]=useState('')
 async function copy(){try{await navigator.clipboard.writeText(project.ca);setNotice('CA copied.')}catch{setNotice('Select the address below to copy it.')}}
 const links=[['GitHub',project.repository],['X / Twitter',project.x],['Community',project.community],['Trade $ZUNON',project.trading]]
 return <section className="official-section" id="official" aria-label="Official project information">
  <div><span className="eyebrow">OFFICIAL PROJECT INFORMATION</span><h2>$ZUNON / SOLANA</h2><p>The project community token. Pump.fun launch planned.</p></div>
  <div className="official-ca"><span>OFFICIAL CA</span><strong>{caLabel}</strong>{project.ca?<button onClick={copy}>Copy address</button>:<span>Awaiting announcement</span>}</div>
  <div className="official-links">{links.map(([label,url])=>url?<a key={label} href={url} target="_blank" rel="noreferrer">{label} ↗</a>:<span key={label}>{label}<small>TO BE ANNOUNCED</small></span>)}</div>
  <p className="official-note">No official token address is published yet. Token utilities, rewards and governance have not been implemented.</p>
  {notice&&<p role="status">{notice}</p>}
 </section>
}
