import {caLabel} from './project'
export default function RealDialog({close}){
 return <div className="dialog connect-dialog real-connect" role="dialog" aria-modal="true" aria-label="ZUNON token launch status">
 <div className="dialog-title">[*] $ZUNON LAUNCH <button autoFocus onClick={close} aria-label="Close launch status">[X]</button></div>
 <h3>$ZUNON / CA: {caLabel}</h3><p>The ZUNON project community token is planned for Pump.fun on Solana. The official CA and direct token link are awaiting announcement.</p>
 <div className="chain-readout"><span>NETWORK</span><b>SOLANA</b><span>CA</span><b>{caLabel}</b><span>LAUNCH</span><b>PUMP.FUN / PLANNED</b><span>STATUS</span><b>PRE-LAUNCH</b></div>
 <p>Agent identities are available without holding a token. Create yours in the Agent Identity section.</p>
 <button className="dialog-ok" onClick={close}>&lt; RETURN TO TERMINAL &gt;</button></div>
}
