export default function RealDialog({type,close}){
 const wallet=type==='connect'
 return <div className="dialog connect-dialog real-connect" role="dialog" aria-modal="true" aria-label={wallet?'Solana wallet status':'ZUNON token launch status'}>
 <div className="dialog-title">[*] {wallet?'SOLANA WALLET':'$ZUNON LAUNCH'} <button onClick={close}>[X]</button></div>
 <h3>{wallet?'SOLANA WALLET / COMING SOON':'$ZUNON / CA: TBA'}</h3>
 <p>{wallet?'Solana wallet access and Agent identity are in development. No wallet connection or signature is requested in this public build.':'The ZUNON project token is planned for launch on Pump.fun, on Solana. The official CA and direct token link have not been announced yet.'}</p>
 <div className="chain-readout"><span>NETWORK</span><b>SOLANA</b><span>CA</span><b>TBA</b><span>LAUNCH</span><b>PUMP.FUN / PLANNED</b><span>STATUS</span><b>{wallet?'IN DEVELOPMENT':'PRE-LAUNCH'}</b></div>
 <button className="dialog-ok" onClick={close}>&lt; RETURN TO TERMINAL &gt;</button>
 </div>
}
