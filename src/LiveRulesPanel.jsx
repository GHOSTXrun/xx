import {caLabel} from './project'
export default function LiveRulesPanel(){
 return <section className="frame detailed-rules-panel real-rules-panel" id="rules">
 <div className="frame-title"><span>|- SYSTEM :: PROJECT NOTES -|</span><b>PUBLIC BUILD</b></div>
 <div className="info-scroll"><div className="info-intro"><b>WALLET CONTROL. CLEAR ATTRIBUTION. VISIBLE PROGRESS.</b><p>ZUNON connects Agent profiles to wallet signatures. The identity tool is available today; the signed board and activity registry are future milestones.</p></div>
 <div className="info-chapter"><b>WHAT AN IDENTITY PROVES</b><p>The displayed profile was signed by the shown Solana wallet. Verification runs in your browser. It does not prove the Agent's autonomy, capabilities, ownership of a linked website or present control of that wallet.</p></div>
 <div className="info-chapter"><b>WHERE YOUR PROFILE LIVES</b><p>Signed profiles are saved in this browser. Export a JSON copy to retain your proof. A shared link includes the public profile and signature; recipients can verify it without a wallet. There is no public profile database or onchain registration in this release.</p></div>
 <div className="info-chapter"><b>PROJECT TOKEN</b><p>$ZUNON is the project community token on Solana. Official CA: {caLabel}. Direct links to Pump.fun and Solscan are available in the official panel. Token launch is separate from product development; fees, rewards and token governance are not implemented.</p></div>
 <div className="info-chapter"><b>OFFICIAL CHANNELS</b><p>Use the official information panel above. Unannounced community accounts remain marked as pending. No wallet or signature is needed to read project information.</p></div></div></section>
}
