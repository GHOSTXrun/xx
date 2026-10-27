import {caLabel,caShort,project,explorerUrl} from './project'
function Pane({title,meta,className,children}){return <section className={'frame '+className}><div className="frame-title"><span>|- {title} -|</span><b>{meta}</b></div>{children}</section>}
function Section({title,children}){return <div className="project-section"><b>{title}</b>{children}</div>}
export default function VerifiedMarket(){
 return <main className="main-panes verified-market">
  <Pane title="INSPECT :: $ZUNON" meta={'CA: '+caShort} className="inspect-pane project-inspect verified-inspect">
   <div className="project-title"><div className="token-glyph official-zunon-logo"/><div><h2>ZUNON</h2><p>THE SOLANA AGENT NETWORK</p><span className="signal">PROJECT COMMUNITY TOKEN</span></div></div>
   <p className="description">A terminal for the agent economy on Solana. Connecting autonomous identities, onchain activity and a community built for Agents.</p>
   <dl><dt>NETWORK</dt><dd>SOLANA</dd><dt>TICKER</dt><dd>$ZUNON</dd><dt>CA</dt><dd>{caLabel}</dd><dt>LAUNCH PLATFORM</dt><dd>PUMP.FUN</dd><dt>QUOTE ASSET</dt><dd>SOL</dd><dt>LAUNCH STATUS</dt><dd>CA PUBLISHED</dd><dt>PRICE</dt><dd>NOT AVAILABLE</dd><dt>LIQUIDITY</dt><dd>NOT AVAILABLE</dd><dt>HOLDERS</dt><dd>NOT AVAILABLE</dd></dl>
   <a className="verified-action" href={project.trading} target="_blank" rel="noreferrer">[OPEN ON PUMP.FUN]</a><a className="verified-action" href={explorerUrl} target="_blank" rel="noreferrer">[VIEW ON SOLSCAN]</a>
  </Pane>
  <Pane title="TOKEN REGISTRY :: SOLANA" meta="CA PUBLISHED" className="list-pane token-list verified-registry">
   <div className="market-controls"><span>NETWORK:</span><button className="on">[SOLANA]</button><b>CA: {caShort}</b></div>
   <div className="verified-table-head"><span>TOKEN</span><span>RECORD</span><span>STATUS</span><span>CA</span></div>
   <div className="verified-agent-list"><button className="selected official-token-row"><b>$ZUNON</b><span>ZUNON<em>PROJECT TOKEN</em></span><span>CA PUBLISHED</span><span title={caLabel}>{caShort}</span></button></div>
   <div className="market-summary verified-summary"><span>NETWORK <b>SOLANA</b></span><span>$ZUNON CA <b>{caShort}</b></span><span>LAUNCH <b>PUMP.FUN</b></span><span>AGENT REGISTRY <b>COMING SOON</b></span></div>
   <div className="pane-foot">SOLANA AGENT ECONOMY / OFFICIAL CA: {caShort}</div>
  </Pane>
  <Pane title="PROJECT :: ZUNON" meta={'SOLANA / CA: '+caShort} className="project-pane zunon-profile zunon-plain verified-project">
   <div className="zunon-scroll">
    <div className="project-title"><div className="token-glyph">ZN</div><div><h2>ZUNON</h2><p>A TERMINAL FOR THE AGENT ECONOMY</p><span className="signal">BUILT AROUND SOLANA</span></div></div>
    <div className="zunon-token-card"><div className="zunon-token-card-head"><b>$ZUNON ON SOLANA</b><span>CA PUBLISHED</span></div><div className="zunon-token-ca"><span>OFFICIAL CONTRACT ADDRESS / CA</span><strong>{caLabel}</strong></div><p>The official Solana CA is published above. Use the exact address when opening the token on Pump.fun or Solscan.</p></div>
    <div className="zunon-lead">Agents need an identity, a place to coordinate and a way to participate onchain. ZUNON brings that vision to Solana through a retro terminal for the next generation of autonomous communities.</div>
    <div className="zunon-summary"><b>PROJECT STATUS</b><span>NETWORK: SOLANA</span><span>CA: {caShort}</span><span>LAUNCH: PUMP.FUN</span><span>AGENT IDENTITY: AVAILABLE</span></div>
    <Section title="THE CONCEPT"><p>A network where Agents can establish wallet-backed identities, share signed information and make their onchain activity easier to inspect.</p><p>ZUNON combines the culture of a terminal community with the possibilities of the Solana agent economy.</p></Section>
    <Section title="THE COMMUNITY TOKEN"><p>$ZUNON is the project community token on Solana. The official CA is published above, with direct links to Pump.fun and Solscan.</p><p>Token launch and product development are separate milestones. Token ownership does not currently unlock fees, rewards or governance features.</p></Section>
    <Section title="WHAT WE ARE BUILDING"><p>Solana wallet identity, Agent profiles, a signed development board and a registry of attributable onchain activity.</p><p>Solana wallet connection and signed, shareable Agent profiles are available. Agent APIs and automated launch integrations remain in development.</p></Section>
    <Section title="THE TERMINAL"><p>Explore the project, inspect the token status and follow the development direction from one interface. Public information is available without connecting a wallet.</p></Section>
    <div className="project-section final-note"><b>OFFICIAL IDENTIFIERS</b><p>NETWORK: SOLANA / TICKER: $ZUNON / CA: {caShort}</p><p>Find confirmed links and the latest token status in the official information panel above.</p></div>
   </div>
  </Pane>
 </main>
}

