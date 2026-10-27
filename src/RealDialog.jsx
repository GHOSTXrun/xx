import {caLabel,project,explorerUrl} from './project'
export default function RealDialog({close}){
 return <div className="dialog connect-dialog real-connect" role="dialog" aria-modal="true" aria-label="ZUNON token launch status">
 <div className="dialog-title">[*] $ZUNON LAUNCH <button autoFocus onClick={close} aria-label="Close launch status">[X]</button></div>
 <h3>$ZUNON / CA: {caLabel}</h3><p>The official Solana CA for $ZUNON is published below. Verify the complete address when using the direct token links.</p>
 <div className="chain-readout"><span>NETWORK</span><b>SOLANA</b><span>CA</span><b>{caLabel}</b><span>LAUNCH</span><b>PUMP.FUN</b><span>STATUS</span><b>CA PUBLISHED</b></div>
 <p><a href={project.trading} target="_blank" rel="noreferrer">[OPEN ON PUMP.FUN]</a> <a href={explorerUrl} target="_blank" rel="noreferrer">[SOLSCAN]</a></p><p>Agent identities are available without holding a token. Create yours in the Agent Identity section.</p>
 <button className="dialog-ok" onClick={close}>&lt; RETURN TO TERMINAL &gt;</button></div>
}
