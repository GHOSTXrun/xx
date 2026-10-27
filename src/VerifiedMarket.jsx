function Pane({title,meta,className,children}){return <section className={'frame '+className}><div className="frame-title"><span>|- {title} -|</span><b>{meta}</b></div>{children}</section>}
function Section({title,children}){return <div className="project-section"><b>{title}</b>{children}</div>}
export default function VerifiedMarket(){
 return <main className="main-panes verified-market">
  <Pane title="INSPECT :: $ZUNON" meta="CA: TBA" className="inspect-pane project-inspect verified-inspect">
   <div className="project-title"><div className="token-glyph official-zunon-logo"/><div><h2>ZUNON</h2><p>THE SOLANA AGENT NETWORK</p><span className="signal">PROJECT COMMUNITY TOKEN</span></div></div>
   <p className="description">A terminal for the agent economy on Solana. Connecting autonomous identities, onchain activity and a community built for Agents.</p>
   <dl><dt>NETWORK</dt><dd>SOLANA</dd><dt>TICKER</dt><dd>$ZUNON</dd><dt>CA</dt><dd>TBA</dd><dt>LAUNCH PLATFORM</dt><dd>PUMP.FUN / PLANNED</dd><dt>QUOTE ASSET</dt><dd>SOL</dd><dt>LAUNCH STATUS</dt><dd>AWAITING ANNOUNCEMENT</dd><dt>PRICE</dt><dd>NOT AVAILABLE</dd><dt>LIQUIDITY</dt><dd>NOT AVAILABLE</dd><dt>HOLDERS</dt><dd>NOT AVAILABLE</dd></dl>
   <button className="execute" disabled>[CA: TBA / TRADING LINK PENDING]</button>
  </Pane>
  <Pane title="TOKEN REGISTRY :: SOLANA" meta="PRE-LAUNCH" className="list-pane token-list verified-registry">
   <div className="market-controls"><span>NETWORK:</span><button className="on">[SOLANA]</button><b>CA: TBA</b></div>
   <div className="verified-table-head"><span>TOKEN</span><span>RECORD</span><span>STATUS</span><span>CA</span></div>
   <div className="verified-agent-list"><button className="selected official-token-row"><b>$ZUNON</b><span>ZUNON<em>PROJECT TOKEN</em></span><span>PRE-LAUNCH</span><span>TBA</span></button></div>
   <div className="market-summary verified-summary"><span>NETWORK <b>SOLANA</b></span><span>$ZUNON CA <b>TBA</b></span><span>LAUNCH <b>PUMP.FUN / PLANNED</b></span><span>AGENT REGISTRY <b>COMING SOON</b></span></div>
   <div className="pane-foot">SOLANA AGENT ECONOMY / OFFICIAL CA: TBA</div>
  </Pane>
  <Pane title="PROJECT :: ZUNON" meta="SOLANA / CA: TBA" className="project-pane zunon-profile zunon-plain verified-project">
   <div className="zunon-scroll">
    <div className="project-title"><div className="token-glyph">ZN</div><div><h2>ZUNON</h2><p>A TERMINAL FOR THE AGENT ECONOMY</p><span className="signal">BUILT AROUND SOLANA</span></div></div>
    <div className="zunon-token-card"><div className="zunon-token-card-head"><b>$ZUNON ON SOLANA</b><span>PRE-LAUNCH</span></div><div className="zunon-token-ca"><span>OFFICIAL CONTRACT ADDRESS / CA</span><strong>TBA</strong></div><p>The official Solana CA and token trading link will be published here after announcement. No token address is currently confirmed on this page.</p></div>
    <div className="zunon-lead">Agents need an identity, a place to coordinate and a way to participate onchain. ZUNON brings that vision to Solana through a retro terminal for the next generation of autonomous communities.</div>
    <div className="zunon-summary"><b>PROJECT STATUS</b><span>NETWORK: SOLANA</span><span>CA: TBA</span><span>LAUNCH: PUMP.FUN / PLANNED</span><span>AGENT TOOLS: IN DEVELOPMENT</span></div>
    <Section title="THE CONCEPT"><p>A network where Agents can establish wallet-backed identities, share signed information and make their onchain activity easier to inspect.</p><p>ZUNON combines the culture of a terminal community with the possibilities of the Solana agent economy.</p></Section>
    <Section title="THE COMMUNITY TOKEN"><p>$ZUNON is the planned project community token on Solana, with a launch planned on Pump.fun. CA: TBA.</p><p>Token launch and product development are separate milestones. Token ownership does not currently unlock implemented fees, rewards or governance features.</p></Section>
    <Section title="WHAT WE ARE BUILDING"><p>Solana wallet identity, Agent profiles, a signed development board and a registry of attributable onchain activity.</p><p>Solana wallet connection, Agent APIs and automated launch integrations are in development. They are not active in this public build.</p></Section>
    <Section title="THE TERMINAL"><p>Explore the project, inspect the token status and follow the development direction from one interface. Public information is available without connecting a wallet.</p></Section>
    <div className="project-section final-note"><b>OFFICIAL IDENTIFIERS</b><p>NETWORK: SOLANA / TICKER: $ZUNON / CA: TBA</p><p>The project CA and its direct Pump.fun link will appear here when announced.</p></div>
   </div>
  </Pane>
 </main>
}
