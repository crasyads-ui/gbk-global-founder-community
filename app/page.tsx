"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
const membershipTiers = {
  country_300: { scope: "Country", amount: "$300", badge: "COUNTRY FOUNDER", title: "Country Founder", benefits: ["Country founder networking","Local community participation","Approved founder marketing resources","Merchant and ecosystem connections"] },
  country_500: { scope: "Country", amount: "$500", badge: "COUNTRY GROWTH FOUNDER", title: "Country Growth Founder", benefits: ["Country founder networking","Community growth participation","Approved founder marketing resources","Merchant and ecosystem connections","Eligible country events"] },
  country_1000: { scope: "Country", amount: "$1,000", badge: "COUNTRY LEADERSHIP FOUNDER", title: "Country Leadership Founder", benefits: ["Country founder networking","Community leadership participation","Approved founder marketing resources","Merchant and ecosystem connections","Eligible country events and campaigns"] },
  global_3000: { scope: "Global", amount: "$3,000", badge: "GLOBAL FOUNDER", title: "Global Founder", benefits: ["International founder networking","Cross-country collaboration","Eligible global events","Approved ecosystem and marketing resources","Merchant and ecosystem connections"] },
  global_5000: { scope: "Global", amount: "$5,000", badge: "GLOBAL GROWTH FOUNDER", title: "Global Growth Founder", benefits: ["International founder networking","Cross-country collaboration","Global campaigns and events","Approved ecosystem and marketing resources","Merchant and ecosystem connections"] },
  global_10000: { scope: "Global", amount: "$10,000", badge: "GLOBAL LEADERSHIP FOUNDER", title: "Global Leadership Founder", benefits: ["International founder networking","Cross-country collaboration","Global founder events","Approved ecosystem and marketing resources","Merchant and ecosystem connections","Founder leadership recognition"] },
} as const;

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
  const [wallet, setWallet] = useState("");
  const [walletStatus, setWalletStatus] = useState("Not connected");
  const [profileSaved, setProfileSaved] = useState(false);
  const [membershipRecord, setMembershipRecord] = useState<any>(null);
  const [referralCode, setReferralCode] = useState("");
  const [selectedTier, setSelectedTier] = useState<keyof typeof membershipTiers | null>(null);
  const [txHash, setTxHash] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("Not submitted");
  const [membershipLoading, setMembershipLoading] = useState(false);
  const walletConnectProviderRef = useRef<any>(null);

  type EthereumProvider = {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on?: (event: string, handler: (...args: unknown[]) => void) => void;
    removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
  };

  useEffect(() => {
    const ethereum = (window as Window & { ethereum?: EthereumProvider }).ethereum;
    const saved = window.localStorage.getItem("gbkFounderWallet");
    if (saved) {
      setWallet(saved);
      setWalletStatus("Connected");
    }

    if (!ethereum?.on) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = Array.isArray(args[0]) ? args[0] as string[] : [];
      const address = accounts[0];
      if (address) {
        setWallet(address);
        window.localStorage.setItem("gbkFounderWallet", address);
        setWalletStatus("Connected");
      } else {
        setWallet("");
        setWalletStatus("Not connected");
        window.localStorage.removeItem("gbkFounderWallet");
      }
    };

    const handleChainChanged = () => {
      setWalletStatus("Connected · network changed");
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  useEffect(() => {
    if (wallet) void refreshMembershipStatus(wallet);
  }, [wallet]);

  async function ensureBscNetwork(provider: EthereumProvider) {
    try {
      const chainId = await provider.request({ method: "eth_chainId" }) as string;
      if (chainId?.toLowerCase() === "0x38") return;
    } catch {}

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      });
    } catch (switchError) {
      const code = typeof switchError === "object" && switchError !== null && "code" in switchError
        ? (switchError as { code?: number }).code
        : undefined;
      if (code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x38",
            chainName: "BNB Smart Chain",
            nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com/"],
          }],
        });
      } else {
        throw switchError;
      }
    }
  }

  async function connectWalletConnect() {
    setWalletStatus("Opening wallet selector…");
    const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
    let provider = walletConnectProviderRef.current;

    if (!provider) {
      provider = await EthereumProvider.init({
        projectId: "19d21bb0657b8a691c0ea8f4976ce26e",
        optionalChains: [56],
        showQrModal: true,
        rpcMap: { 56: "https://bsc-dataseed.binance.org/" },
        metadata: {
          name: "GBK Global Founder Community",
          description: "GBK Founder Community on BNB Smart Chain",
          url: "https://founder.gbkai.com",
          icons: ["https://founder.gbkai.com/favicon.ico"],
        },
      });
      walletConnectProviderRef.current = provider;

      provider.on("accountsChanged", (accounts: string[]) => {
        const address = accounts?.[0];
        if (address) {
          setWallet(address);
          window.localStorage.setItem("gbkFounderWallet", address);
          setWalletStatus("Connected");
        } else {
          setWallet("");
          setWalletStatus("Not connected");
          window.localStorage.removeItem("gbkFounderWallet");
        }
      });
      provider.on("chainChanged", () => setWalletStatus("Connected · network changed"));
      provider.on("disconnect", () => {
        setWallet("");
        setWalletStatus("Not connected");
        window.localStorage.removeItem("gbkFounderWallet");
      });
    }

    if (!provider.session) {
      await provider.connect();
    }

    const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
    const address = accounts?.[0];
    if (!address) throw new Error("No wallet account returned");
    await ensureBscNetwork(provider);

    setWallet(address);
    window.localStorage.setItem("gbkFounderWallet", address);
    setWalletStatus("Connected");
  }

  async function connectWallet() {
    const ethereum = (window as Window & { ethereum?: EthereumProvider }).ethereum;

    try {
      setWalletStatus("Connecting…");
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" }) as string[];
        const address = accounts?.[0];
        if (!address) throw new Error("No wallet account returned");
        await ensureBscNetwork(ethereum);
        setWallet(address);
        window.localStorage.setItem("gbkFounderWallet", address);
        setWalletStatus("Connected");
        return;
      }

      await connectWalletConnect();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Wallet connection cancelled.";
      setWalletStatus(message);
    }
  }

  async function disconnectWallet() {
    try {
      if (walletConnectProviderRef.current?.session) {
        await walletConnectProviderRef.current.disconnect();
      }
    } catch {}
    setWallet("");
    setWalletStatus("Not connected");
    window.localStorage.removeItem("gbkFounderWallet");
  }

  const SUPABASE_URL = "https://yjwgnapymqetxvksqacd.supabase.co";
  const SUPABASE_KEY = "sb_publishable_Y3n5bVO3xveBnyt4LKbCPg_f5ilMSuz";

  async function founderApi(body: Record<string, unknown>) {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/gbk-founder-membership`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.ok === false) throw new Error(data?.error || "Founder verification request failed");
    return data;
  }

  async function refreshMembershipStatus(address = wallet) {
    if (!address) return;
    setMembershipLoading(true);
    try {
      const data = await founderApi({ action: "status", wallet: address });
      setMembershipRecord(data.memberships?.[0] || null);
    } catch (error) {
      setVerificationStatus(error instanceof Error ? error.message : "Membership status unavailable");
    } finally {
      setMembershipLoading(false);
    }
  }

  async function verifyFounderTransaction() {
    if (!wallet) {
      setVerificationStatus("Connect your wallet first.");
      return;
    }
    if (!selectedTier) {
      setVerificationStatus("Choose a Founder membership level first.");
      return;
    }
    if (!/^0x[0-9a-fA-F]{64}$/.test(txHash.trim())) {
      setVerificationStatus("Enter a valid BSC transaction hash.");
      return;
    }
    setVerificationStatus("Checking BSC transaction…");
    try {
      const data = await founderApi({
        action: "verify-tx",
        wallet,
        tier: selectedTier,
        txHash: txHash.trim(),
        referralCode: referralCode.trim() || null,
      });
      if (data.membership) {
        setMembershipRecord(data.membership);
        setVerificationStatus("Founder membership verified ✓");
      } else {
        setVerificationStatus(data.message || "Transaction does not qualify yet.");
      }
    } catch (error) {
      setVerificationStatus(error instanceof Error ? error.message : "Verification failed");
    }
  }

  const shortWallet = wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : "";

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

        <section className="panel dailyRewardsPanel" id="daily-rewards">
          <div className="panelHead">
            <div><h3>🌍 GBK Buy • Hold • Daily Rewards</h3><p>Simple global explanation for eligible GBK holders.</p></div>
            <span className="badge">0.1%–0.9% DAILY</span>
          </div>
          <div className="dailyHero">
            <b>How it works</b>
            <strong>Buy GBK → Hold GBK → Receive additional GBK tokens automatically</strong>
            <small>Eligible holders can receive an automatic daily token-balance increase through the rebase mechanism, subject to the applicable protocol rules and activity.</small>
          </div>
          <div className="rebaseGrid">
            <div className="rebaseCard"><span>1</span><b>Buy GBK</b><small>Acquire GBK through a supported GBK swap route.</small></div>
            <div className="rebaseCard"><span>2</span><b>Hold GBK</b><small>Keep eligible GBK in a supported BNB Smart Chain wallet.</small></div>
            <div className="rebaseCard"><span>3</span><b>Daily Increase</b><small>Approximately 0.1%–0.9% additional GBK tokens per day, depending on applicable rules and activity.</small></div>
            <div className="rebaseCard"><span>4</span><b>Use Your GBK</b><small>GBK can be swapped or transferred subject to wallet, contract, liquidity and transaction conditions.</small></div>
          </div>
          <div className="dailyExamples">
            <div><b>10,000 GBK</b><span>0.1% → +10 GBK · 0.5% → +50 GBK · 0.9% → +90 GBK</span></div>
            <div><b>100,000 GBK</b><span>0.1% → +100 GBK · 0.5% → +500 GBK · 0.9% → +900 GBK</span></div>
            <div><b>1,000,000 GBK</b><span>0.1% → +1,000 GBK · 0.5% → +5,000 GBK · 0.9% → +9,000 GBK</span></div>
          </div>
          <div className="notice"><b>Global currency:</b> GBK rewards are additional GBK tokens, not INR or another fiat currency. Their market value can be viewed in USD, EUR, INR, AED, GBP and other currencies, but the market value is determined separately by GBK market conditions, supply, demand and market capitalization.</div>
          <div className="notice"><b>Important:</b> The 0.1%–0.9% range describes token quantity, not a guaranteed monetary return or guaranteed increase in market value. Actual results depend on the applicable GBK contract/protocol rules and activity.</div>
        </section>

        <section className="panel founderSeparatePanel" id="global-founder">
          <div className="panelHead">
            <div><h3>🏆 GBK Global Community Founder</h3><p>A separate community and ecosystem participation program — not part of the daily token-reward mechanism.</p></div>
            <span className="badge">SEPARATE PROGRAM</span>
          </div>
          <div className="separateGrid">
            <div className="separateCard"><b>Country Founder</b><strong>$300 · $500 · $1,000</strong><small>Country-level networking, local events, community participation and ecosystem initiatives.</small></div>
            <div className="separateCard"><b>Global Founder</b><strong>$3,000 · $5,000 · $10,000</strong><small>International founder networking, cross-country collaboration, global events and ecosystem initiatives.</small></div>
            <div className="separateCard"><b>Founder Participation</b><strong>Build • Connect • Participate</strong><small>Support communities, merchants, content, events and approved GBK ecosystem initiatives.</small></div>
          </div>
          <div className="notice"><b>Clear separation:</b> Holding GBK does not automatically make someone a Global Community Founder. Founder membership is a community/ecosystem participation program and does not promise token price appreciation, profits or guaranteed business results.</div>
        </section>

        <section className="panel swapConfirmationPanel" id="swap-confirmation">
          <div className="panelHead"><div><h3>🔄 Founder Membership On-Chain Verification</h3><p>Complete the selected membership amount through GBK Swap, then submit the BSC transaction hash.</p></div><span className="badge">LIVE VERIFICATION</span></div>
          <div className="swapFlow">
            <div className="swapStep"><span>1</span><b>Connect Wallet</b><small>Use the same BNB Smart Chain wallet for the membership purchase.</small></div>
            <div className="swapArrow">→</div>
            <div className="swapStep"><span>2</span><b>Complete Purchase</b><small>Complete the selected membership amount in USDT → GBK using the same wallet.</small></div>
            <div className="swapArrow">→</div>
            <div className="swapStep"><span>3</span><b>Verify</b><small>Backend checks the confirmed BSC transaction, sender, USDT spent and GBK received.</small></div>
          </div>
          <div className="confirmationCard">
            <div><b>Selected membership</b><strong>{selectedTier ? `${membershipTiers[selectedTier].title} · ${membershipTiers[selectedTier].amount}` : "Choose a membership level above"}</strong><small>Membership verification uses the selected USD threshold; no private key or seed phrase is requested.</small></div>
            <a className="primary" href="https://app.gbkai.com" target="_blank" rel="noreferrer">{selectedTier ? `Complete ${membershipTiers[selectedTier].amount} GBK Purchase ↗` : "Open GBK Swap ↗"}</a>
          </div>
          <div className="confirmationFields">
            <div><span>Verification status</span><b>{verificationStatus}</b></div>
            <div><span>Transaction hash</span><b>{txHash ? `${txHash.slice(0, 10)}…${txHash.slice(-8)}` : "Not submitted"}</b></div>
            <div><span>Wallet</span><b>{wallet ? shortWallet : "Connect wallet first"}</b></div>
            <div><span>Holding rule</span><b>Keep ≥ 50% of activation GBK baseline</b></div>
          </div>
          <div className="confirmationInputRow">
            <input value={txHash} onChange={(e) => setTxHash(e.target.value.trim())} placeholder="0x… BSC transaction hash" aria-label="BSC transaction hash" />
            <button className="primary" type="button" disabled={!wallet || !selectedTier || !txHash} onClick={verifyFounderTransaction}>Verify Transaction</button>
          </div>
          <div className="notice"><b>Automatic checks:</b> successful BSC receipt → connected wallet is the transaction sender → selected USDT threshold is met → GBK is received by the same wallet → activation GBK balance is recorded → Founder status is activated. The dashboard then checks the 50% holding rule. No seed phrase or private key is ever requested.</div>
        </section>

        <section className="panel membershipStatusPanel" id="membership-status">
          <div className="panelHead">
            <div><h3>🏅 Founder Membership Status</h3><p>Live status from the Founder verification backend.</p></div>
            <span className={`statusPill ${membershipRecord?.status === "active" ? "connected" : ""}`}>{membershipLoading ? "CHECKING…" : membershipRecord?.status === "active" ? "MEMBERSHIP ACTIVE" : "AWAITING VERIFICATION"}</span>
          </div>
          {membershipRecord ? (() => {
            const tier = membershipTiers[membershipRecord.tier_code as keyof typeof membershipTiers];
            const holdingActive = membershipRecord.holding_status === "active";
            return <div className="membershipDashboard">
              <div className="membershipIdentity"><span className="membershipBadge">🏅 {tier?.badge || "FOUNDER"}</span><strong>{tier?.title || membershipRecord.tier_code}</strong><small>{tier?.scope || "Founder"} · ${membershipRecord.price_usd}</small></div>
              <div className="membershipMeta"><div><span>Scope</span><b>{tier?.scope || "Founder"}</b></div><div><span>Verified Amount</span><b>${membershipRecord.price_usd}</b></div><div><span>GBK Baseline</span><b>{Number(membershipRecord.baseline_gbk_balance).toLocaleString()} GBK</b></div><div><span>Minimum Holding</span><b>{Number(membershipRecord.minimum_gbk_balance).toLocaleString()} GBK</b></div></div>
              <div className="membershipBenefits"><b>{holdingActive ? "Founder benefits active ✓" : "Founder benefits paused"}</b><span>Current GBK: {Number(membershipRecord.current_gbk_balance).toLocaleString()} GBK</span><span>Required: at least 50% of activation baseline</span>{(tier?.benefits || []).map(x=><span key={x}>{holdingActive ? "✓" : "⏸"} {x}</span>)}</div>
              <div className="notice"><b>50% holding rule:</b> activation baseline = {Number(membershipRecord.baseline_gbk_balance).toLocaleString()} GBK; minimum = {Number(membershipRecord.minimum_gbk_balance).toLocaleString()} GBK. Below the minimum, Founder benefits are paused; returning to the minimum reactivates them.</div>
            </div>;
          })() : <div className="membershipPending"><strong>Connect wallet → choose membership → complete qualifying GBK purchase → verify transaction</strong><span>The backend verifies the BSC transaction and records the original GBK balance at activation. Referral code is optional.</span><div className="tierPreview">{Object.values(membershipTiers).map(t=><div key={t.amount+t.title}><b>{t.title}</b><small>{t.scope} · {t.amount}</small></div>)}</div></div>}
          <div className="notice"><b>Security:</b> Never enter a seed phrase or private key. Only the public wallet address and confirmed BSC transaction hash are used for verification.</div>
        </section>

        <section className="panel founderCore" id="founder-core">
          <div className="panelHead"><div><h3>👤 Founder Core</h3><p>Connect your wallet and prepare your founder profile.</p></div><span className={`statusPill ${wallet ? "connected" : ""}`}>{wallet ? "WALLET CONNECTED" : "NOT CONNECTED"}</span></div>
          <div className="walletConnectBox">
            <div><b>{wallet ? `Connected: ${shortWallet}` : "Connect your BNB Smart Chain wallet"}</b><small>{wallet ? "Wallet connected. Founder membership still requires separate verification." : "Connect from a wallet app or from any normal browser using the secure WalletConnect selector. BNB Smart Chain is required."}</small></div>
            <div className="walletActions">{wallet ? <button className="hubBtn" type="button" onClick={disconnectWallet}>Disconnect</button> : <button className="primary" type="button" onClick={connectWallet}>🔗 Connect Wallet</button>}</div>
          </div>
          <div className="walletStatus">{walletStatus}</div>
          {!wallet && <div className="walletHint">🔐 Secure mobile connection: normal browsers can use WalletConnect to open a supported wallet.</div>}
          {wallet && (
            <div className="earnReferralBox">
              <div>
                <span className="earnBadge">WALLET CONNECTED</span>
                <b>💰 L1 / L2 Earn & Referral</b>
                <small>Use the same connected wallet on app.gbkai.com to open the GBK Earn & Referral area and access your eligible GBK referral activity.</small>
                <div className="earnLevels"><span><strong>L1</strong> 6%</span><span><strong>L2</strong> 2%</span></div>
              </div>
              <div className="earnActions">
                <a className="primary" href="https://app.gbkai.com" target="_blank" rel="noreferrer">Open Earn & Referral ↗</a>
                <a className="hubBtn" href="https://pancakeswap.finance" target="_blank" rel="noreferrer">PancakeSwap ↗</a>
              </div>
            </div>
          )}
          <div className="simpleFounderFlow">
            <div className="simpleStep"><span>1</span><b>Connect Wallet</b><small>Connect your BNB Smart Chain wallet.</small></div>
            <div className="simpleArrow">→</div>
            <div className="simpleStep"><span>2</span><b>Choose Membership</b><small>Select your Country or Global Founder level.</small></div>
            <div className="simpleArrow">→</div>
            <div className="simpleStep"><span>3</span><b>Pay & Verify</b><small>Confirm the transaction. Verification happens in the background.</small></div>
          </div>
          <div className="membershipQuickBuy">
            <div className="quickBuyHead"><div><b>⚡ Simple Founder Membership</b><small>Referral code is optional. Wallet connection is required before payment.</small></div><span className="badge">SIMPLE FLOW</span></div>
            <div className="referralInputRow">
              <input value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="Referral code (optional)" aria-label="Referral code optional" />
              <span>{referralCode ? "Referral recorded for onboarding" : "No referral code? Continue without it."}</span>
            </div>
            <div className="tierButtons">
              {(Object.entries(membershipTiers) as [keyof typeof membershipTiers, typeof membershipTiers[keyof typeof membershipTiers]][]).map(([key,tier]) => (
                <button key={key} type="button" className={selectedTier === key ? "tierButton selected" : "tierButton"} onClick={() => setSelectedTier(key)} disabled={!wallet}>
                  <b>{tier.title}</b><span>{tier.amount}</span>
                </button>
              ))}
            </div>
            <div className="quickBuyAction">
              <b>{!wallet ? "Connect wallet to continue" : selectedTier ? `Selected: ${membershipTiers[selectedTier].title} · ${membershipTiers[selectedTier].amount}` : "Choose a membership level"}</b>
              <button className="primary" type="button" disabled={!wallet || !selectedTier} onClick={() => { if (selectedTier) { setVerificationStatus("Payment route ready — complete the selected amount in GBK Swap."); window.open("https://app.gbkai.com", "_blank", "noopener,noreferrer"); document.getElementById("swap-confirmation")?.scrollIntoView({ behavior: "smooth" }); } }}>Continue to Payment →</button>
            </div>
          </div>
          <div className="coreGrid">
            <div className="coreCard"><b>1. Connect / Sign In</b><small>Connect your supported wallet to identify your Founder dashboard session.</small><button className="hubBtn" type="button" onClick={connectWallet}>{wallet ? "Wallet Connected ✓" : "Connect Wallet"}</button></div>
            <div className="coreCard"><b>2. Complete Profile</b><small>Name, country, city, preferred language, social links and founder focus.</small><button className="hubBtn" type="button" onClick={() => setProfileSaved(true)}>{profileSaved ? "Profile Saved ✓" : "Profile Setup"}</button></div>
            <div className="coreCard"><b>3. Membership</b><small>Country Founder: $300 / $500 / $1,000 · Global Founder: $3,000 / $5,000 / $10,000.</small><a href="#programs">View Programs →</a></div>
            <div className="coreCard"><b>4. Verification</b><small>Membership and founder status must be verified before badges or restricted benefits are activated.</small><span className="statusPill">VERIFICATION READY</span></div>
          </div>
          <div className="notice">Wallet connection supports injected BNB wallets and WalletConnect for normal mobile/desktop browsers. Membership verification is not automatic from wallet connection. A submitted transaction must be checked against the published membership payment rules before Founder status is activated.</div>
        </section>

        <section className="panel founderHub" id="founder-hub"><div className="panelHead"><div><h3>🚀 Founder Workspace</h3><p>Share GBK content, invite genuine community members and track your campaign activity.</p></div><span className="badge">FOUNDER TOOLS</span></div><div className="hubGrid"><div className="hubCard"><b>🔗 Your GBK Share Link</b><small>Use the official ecosystem entry point when sharing. Copy it once, then post through your own social accounts.</small><button className="hubBtn" onClick={() => navigator.clipboard?.writeText("https://app.gbkai.com")}>Copy GBK Link</button></div><div className="hubCard"><b>📣 Social Share</b><small>Share the GBK ecosystem through supported social platforms. Review content before posting.</small><div className="shareRow"><a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fapp.gbkai.com" target="_blank" rel="noreferrer">Facebook</a><a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fapp.gbkai.com&text=Explore%20the%20GBK%20ecosystem" target="_blank" rel="noreferrer">X</a><a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fapp.gbkai.com" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://wa.me/?text=Explore%20the%20GBK%20ecosystem%20https%3A%2F%2Fapp.gbkai.com" target="_blank" rel="noreferrer">WhatsApp</a></div></div><div className="hubCard"><b>🎬 Short Video Hub</b><small>Ready-to-share topics: What is GBK? · How GBK Swap works · Buy & Hold · AI Marketplace · Learn · Agri.</small><Link className="hubBtn" href="/tools">Open Content Studio →</Link></div><div className="hubCard"><b>📊 Founder Analytics</b><small>Track content reach, website visits, wallet connections, successful swaps and returning users once live analytics is connected.</small><Link className="hubBtn" href="/tools">Open Analytics →</Link></div></div></section>

        <section className="panel referralPanel" id="referrals"><div className="panelHead"><div><h3>🔗 Referral Benefits · app.gbkai.com</h3><p>Referral program participation through the GBK ecosystem.</p></div><span className="badge">L1 + L2</span></div><div className="refGrid"><div className="refCard"><span>L1</span><strong>6%</strong><p>Direct referral reward</p><small>Eligible activity only</small></div><div className="refCard"><span>L2</span><strong>2%</strong><p>Second-level referral reward</p><small>Eligible activity only</small></div><div className="refFlow"><b>Connect Wallet</b><i>→</i><b>Get Referral Link</b><i>→</i><b>Invite Genuine Users</b><i>→</i><b>Eligible Swap</b><i>→</i><b>Reward Recorded</b></div></div><div className="notice">Referral rewards are subject to app.gbkai.com program rules, eligibility, completed qualifying transactions and applicable terms. No guaranteed income. No self-referrals, duplicate/fake accounts or spam.</div><div className="refActions"><a href="https://app.gbkai.com" target="_blank" rel="noreferrer">Open app.gbkai.com ↗</a><a href="https://app.gbkai.com" target="_blank" rel="noreferrer">Get Referral Link ↗</a></div></section>

        <section className="panel anchorPanel" id="merchants"><h3>🏪 Merchant Ecosystem</h3><p>Connect with participating merchants and explore GBK marketplace opportunities.</p></section>
        <section className="panel anchorPanel" id="marketplace"><h3>✦ AI Marketplace</h3><p>Explore the GBK AI “Ask for Anything” marketplace for products, services and everyday needs.</p><a href="https://market.gbkai.com" target="_blank" rel="noreferrer">Open Marketplace ↗</a></section>

        <footer><span>GBK Global Founder Community</span><span>Built for transparent ecosystem participation · 2026</span></footer>
      </section>
    </main>
  );
}
