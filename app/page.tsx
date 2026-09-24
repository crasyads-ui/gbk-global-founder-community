"use client";

import Link from "next/link";

const nav = [
  ["Overview", "/", "⌂"],
  ["Founders", "#programs", "♙"],
  ["GBK Swap", "https://app.gbkai.com", "↔"],
  ["Referrals", "#referrals", "◎"],
  ["Merchants", "#merchants", "▦"],
  ["AI Marketplace", "#marketplace", "✦"],
  ["Learn", "/learn", "◈"],
  ["Agri", "https://agri.gbkai.com", "♧"],
  ["Events", "/events", "◉"],
  ["Campaigns", "/tools", "◌"],
];

const stats = [
  ["Global Founders", "170", "International network"],
  ["Country Founders", "530", "Across active markets"],
  ["Active Communities", "24", "Local + online"],
  ["Successful Swaps", "3,284", "Recent activity"],
];

const countries = [["🇮🇳","India","184"],["🇦🇪","UAE","96"],["🇺🇸","USA","74"],["🇧🇷","Brazil","61"],["🇻🇳","Vietnam","48"]];
const benefits = [
  "International founder networking",
  "Cross-country collaboration opportunities",
  "Global founder meetings, forums and eligible events",
  "Access to approved ecosystem and marketing resources",
  "Connect with merchants, businesses and ecosystem participants",
  "Participation in GBK AI Marketplace, Learn, Agri and merchant initiatives",
  "Community growth, referral and campaign participation subject to eligibility",
  "Founder profile / community recognition subject to program rules",
];

function NavItem({ item }: { item: string[] }) {
  const [label, href, icon] = item;
  const external = href.startsWith("http");
  const className = "nav";
  return external ? (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      <span className="navicon">{icon}</span>{label}
    </a>
  ) : href.startsWith("#") ? (
    <a className={className} href={href}><span className="navicon">{icon}</span>{label}</a>
  ) : (
    <Link className={className} href={href}><span className="navicon">{icon}</span>{label}</Link>
  );
}

export default function Home() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">GBK</div><div><b>GBK Global</b><span>Founder Community</span></div></div>
        <nav>{nav.map((item) => <NavItem key={item[0]} item={item} />)}</nav>
        <div className="sideCard">
          <small>GLOBAL COMMUNITY</small><strong>Build. Connect. Participate.</strong>
          <p>Blockchain + AI + real-world utility.</p>
          <Link className="outline" href="/learn">Founder Guide →</Link>
        </div>
      </aside>

      <section className="content">
        <header className="top">
          <div><div className="crumb">GBK ECOSYSTEM / FOUNDER COMMUNITY</div><h1>Founder Dashboard</h1><p>Coordinate global founders, community growth and ecosystem participation.</p></div>
        </header>

        <div className="hero">
          <div>
            <div className="pill">● COMMUNITY PLATFORM</div>
            <h2>GBK: Blockchain + AI +<br/><em>Real-World Utility</em></h2>
            <p>Connect founders, merchants, builders and communities across countries while exploring the GBK ecosystem.</p>
            <div className="heroBtns"><a className="secondary" href="#install">📲 Add to Home Screen</a>
              <a className="primary" href="https://app.gbkai.com" target="_blank" rel="noreferrer">↔ Swap GBK Easily ↗</a>
              <a className="secondary" href="#benefits">View Founder Benefits</a>
            </div>
          </div>
          <div className="heroOrb"><div className="orb">GBK</div><span>GLOBAL<br/>NETWORK</span></div>
        </div>

        <div className="stats">{stats.map(([a,b,c])=><div className="stat" key={a}><span>{a}</span><strong>{b}</strong><small>{c}</small></div>)}</div>

        <div className="grid2">
          <section className="panel funnel"><div className="panelHead"><div><h3>Community Growth Funnel</h3><p>Illustrative campaign metrics.</p></div><button className="mini">90 Days ▾</button></div>
            {[["Content reach","100K","100%"],["Website visits","10K","72%"],["Wallet connections","500","44%"],["Successful swaps","200+","31%"],["Returning users","128","21%"]].map(([a,b,w])=><div className="frow" key={a}><div><span>{a}</span><b>{b}</b></div><div className="bar"><i style={{width:w}}/></div></div>)}
          </section>
          <section className="panel"><div className="panelHead"><div><h3>Swap Activity</h3><p>Illustrative campaign dashboard metrics.</p></div><span className="live">● DEMO</span></div><div className="chart"><div className="y"><span>500</span><span>300</span><span>100</span><span>0</span></div><div className="bars">{[34,48,42,67,55,72,63,88,75,94,81,100].map((h,i)=><i key={i} style={{height:h+"%"}}/>)}</div></div><div className="chartFoot"><span>12-week illustration</span><strong>Not live data</strong></div></section>
        </div>

        <div className="grid3">
          <section className="panel"><div className="panelHead"><div><h3>Country Communities</h3><p>Illustrative founder network</p></div><button className="link">View all</button></div>{countries.map(([flag,name,num])=><div className="country" key={name}><span className="flag">{flag}</span><div><b>{name}</b><small>Founder community</small></div><strong>{num}</strong><span className="arrow">›</span></div>)}</section>
          <section className="panel" id="programs"><div className="panelHead"><div><h3>Founder Programs</h3><p>Participation paths</p></div></div><div className="program"><span className="programIcon">⌁</span><div><b>Country Founder</b><small>$300 · $500 · $1,000 membership options</small></div><a href="#benefits">Open →</a></div><div className="program"><span className="programIcon">✦</span><div><b>Global Founder</b><small>$3,000 · $5,000 · $10,000 membership options</small></div><a href="#benefits">Open →</a></div><div className="notice">Membership is for community and ecosystem participation. Benefits and access are subject to published terms.</div></section>
          <section className="panel"><div className="panelHead"><div><h3>Quick Actions</h3><p>Common founder workflows</p></div></div><div className="actions"><a href="https://app.gbkai.com" target="_blank" rel="noreferrer">↔ <span>Open GBK Swap</span><b>→</b></a><a href="#merchants">▦ <span>Find Merchants</span><b>→</b></a><a href="#marketplace">✦ <span>Ask AI Marketplace</span><b>→</b></a><Link href="/events">◉ <span>Global Events</span><b>→</b></Link></div></section>
        </div>

        <section className="panel benefitsPanel" id="benefits"><div className="panelHead"><div><h3>🌐 Global Founder Community Benefits</h3><p>Designed for international networking, collaboration and active ecosystem participation.</p></div><span className="badge">GLOBAL FOUNDER</span></div><div className="benefitGrid">{benefits.map((b,i)=><div className="benefit" key={b}><span>{["◈","◎","◉","✦","♧","◇","↗","★"][i]}</span><div><b>{b}</b><small>Subject to eligibility, availability and published program terms.</small></div></div>)}</div><div className="notice">Global Founder membership is a community/ecosystem participation program. It does not promise token price appreciation, profits or guaranteed business results.</div></section>

        <section className="panel installPanel" id="install"><div className="panelHead"><div><h3>📲 Install GBK Founder</h3><p>Add this website to your phone home screen for quick access.</p></div><span className="badge">PWA</span></div><div className="installGrid"><div><b>Android</b><small>Open the site in Chrome → browser menu → Add to Home screen.</small></div><div><b>iPhone</b><small>Open in Safari → Share → Add to Home Screen.</small></div></div></section>

        <section className="panel rebasePanel" id="rebase">
          <div className="panelHead"><div><h3>🔄 GBK Buy & Hold · Automatic Token Increase</h3><p>Hold eligible GBK and receive additional GBK tokens through the rebase mechanism.</p></div><span className="badge">~3%–27% / MONTH</span></div>
          <div className="rebaseGrid">
            <div className="rebaseCard"><span>1</span><b>Buy GBK</b><small>Acquire GBK through the supported swap route.</small></div>
            <div className="rebaseCard"><span>2</span><b>Hold GBK</b><small>Keep eligible GBK in your supported BNB Smart Chain wallet.</small></div>
            <div className="rebaseCard"><span>3</span><b>Automatic Rebase</b><small>The token balance can increase automatically according to applicable protocol rules and activity.</small></div>
            <div className="rebaseCard"><span>4</span><b>More GBK Tokens</b><small>The bonus is additional GBK tokens, not a separate reward token.</small></div>
          </div>
          <div className="rebaseExample"><b>Illustrative example:</b> 100,000 GBK + 10% rebase = 110,000 GBK. The monthly percentage varies; approximately 3%–27% is the stated range. Token quantity and market value are separate. GBK price depends on market supply, demand and market capitalization.</div>
          <div className="notice">The 3%–27% range is presented as a variable token-balance increase, not a guaranteed monetary return or guaranteed market-value increase. Actual results depend on the applicable GBK contract/protocol rules and activity.</div>
        </section>

        <section className="panel founderCore" id="founder-core"><div className="panelHead"><div><h3>👤 Founder Core</h3><p>Start here to build your founder profile and participation record.</p></div><span className="badge">CORE</span></div><div className="coreGrid"><div className="coreCard"><b>1. Connect / Sign In</b><small>Connect your supported wallet or use the available sign-in flow.</small><a href="https://app.gbkai.com" target="_blank" rel="noreferrer">Open GBK App ↗</a></div><div className="coreCard"><b>2. Complete Profile</b><small>Name, country, city, preferred language, social links and founder focus.</small><button className="hubBtn" type="button">Profile Setup</button></div><div className="coreCard"><b>3. Membership</b><small>Country Founder: $300 / $500 / $1,000 · Global Founder: $3,000 / $5,000 / $10,000.</small><a href="#programs">View Programs →</a></div><div className="coreCard"><b>4. Verification</b><small>Membership and founder status should be verified before badges or restricted benefits are activated.</small><span className="statusPill">VERIFICATION READY</span></div></div><div className="notice">Membership is community/ecosystem participation. Prices, eligibility, verification and benefits should follow the published program terms.</div></section>

        <section className="panel founderHub" id="founder-hub"><div className="panelHead"><div><h3>🚀 Founder Workspace</h3><p>Share GBK content, invite genuine community members and track your campaign activity.</p></div><span className="badge">FOUNDER TOOLS</span></div><div className="hubGrid"><div className="hubCard"><b>🔗 Your GBK Share Link</b><small>Use the official ecosystem entry point when sharing. Copy it once, then post through your own social accounts.</small><button className="hubBtn" onClick={() => navigator.clipboard?.writeText("https://app.gbkai.com")}>Copy GBK Link</button></div><div className="hubCard"><b>📣 Social Share</b><small>Share the GBK ecosystem through supported social platforms. Review content before posting.</small><div className="shareRow"><a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fapp.gbkai.com" target="_blank" rel="noreferrer">Facebook</a><a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fapp.gbkai.com&text=Explore%20the%20GBK%20ecosystem" target="_blank" rel="noreferrer">X</a><a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fapp.gbkai.com" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://wa.me/?text=Explore%20the%20GBK%20ecosystem%20https%3A%2F%2Fapp.gbkai.com" target="_blank" rel="noreferrer">WhatsApp</a></div></div><div className="hubCard"><b>🎬 Short Video Hub</b><small>Ready-to-share topics: What is GBK? · How GBK Swap works · Buy & Hold · AI Marketplace · Learn · Agri.</small><Link className="hubBtn" href="/tools">Open Content Studio →</Link></div><div className="hubCard"><b>📊 Founder Analytics</b><small>Track content reach, website visits, wallet connections, successful swaps and returning users once live analytics is connected.</small><Link className="hubBtn" href="/tools">Open Analytics →</Link></div></div></section>

        <section className="panel referralPanel" id="referrals"><div className="panelHead"><div><h3>🔗 Referral Benefits · app.gbkai.com</h3><p>Referral program participation through the GBK ecosystem.</p></div><span className="badge">L1 + L2</span></div><div className="refGrid"><div className="refCard"><span>L1</span><strong>6%</strong><p>Direct referral reward</p><small>Eligible activity only</small></div><div className="refCard"><span>L2</span><strong>2%</strong><p>Second-level referral reward</p><small>Eligible activity only</small></div><div className="refFlow"><b>Connect Wallet</b><i>→</i><b>Get Referral Link</b><i>→</i><b>Invite Genuine Users</b><i>→</i><b>Eligible Swap</b><i>→</i><b>Reward Recorded</b></div></div><div className="notice">Referral rewards are subject to app.gbkai.com program rules, eligibility, completed qualifying transactions and applicable terms. No guaranteed income. No self-referrals, duplicate/fake accounts or spam.</div><div className="refActions"><a href="https://app.gbkai.com" target="_blank" rel="noreferrer">Open app.gbkai.com ↗</a><a href="https://app.gbkai.com" target="_blank" rel="noreferrer">Get Referral Link ↗</a></div></section>

        <section className="panel anchorPanel" id="merchants"><h3>🏪 Merchant Ecosystem</h3><p>Connect with participating merchants and explore GBK marketplace opportunities.</p></section>
        <section className="panel anchorPanel" id="marketplace"><h3>✦ AI Marketplace</h3><p>Explore the GBK AI “Ask for Anything” marketplace for products, services and everyday needs.</p><a href="https://market.gbkai.com" target="_blank" rel="noreferrer">Open Marketplace ↗</a></section>

        <footer><span>GBK Global Founder Community</span><span>Built for transparent ecosystem participation · 2026</span></footer>
      </section>
    </main>
  );
}
