"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SWAP_URL = "https://swap.gbkai.com";
const EARN_URL = "https://app.gbkai.com/#earn";
const SUPABASE_URL = "https://yjwgnapymqetxvksqacd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Y3n5bVO3xveBnyt4LKbCPg_f5ilMSuz";
const LOYALTY_API_URL = `${SUPABASE_URL}/functions/v1/loyalty-api`;
const loyaltyBusinessCategories = ["Hotels & Resorts","Restaurants & Cafés","Stores & Supermarkets","Groceries & Supermarkets","Fashion & Apparel","Electronics","Pharmacies & Health Stores","Salons & Beauty","AC Repair","Plumbing & Electrical","Home Services","Automotive & EV","Travel Agencies","Flights & Holidays","Taxis & Transport","Parcel & Logistics","Education & Courses","Spoken English","Healthcare & Clinics","Real Estate","Agriculture & Farm Services","IT & Web Development","Digital Marketing","Events & Weddings","Fitness & Sports","Professional Services","Local Shops","Wholesale & Distribution","Manufacturing","Construction","Cleaning Services","Pet Services"];

const nav = [
  ["Overview", "/", "⌂"],
  ["Founders", "#programs", "♙"],
  ["GBK Swap", SWAP_URL, "↔"],
  ["Referrals", "#referrals", "◎"],
  ["Merchants", "#merchants", "▦"],
  ["Claim Verification", "#business-claims", "🛡️"],
  ["AI Marketplace", "#marketplace", "✦"],
  ["Learn", "/learn", "◈"],
  ["Agri", "https://agri.gbkai.com", "♧"],
  ["Events", "/events", "◉"],
  ["Campaigns", "/tools", "◌"],
  ["Downloads", "#downloads", "▣"],
];

const stats = [
  ["Global Founders", "170", "International network"],
  ["Country Founders", "530", "Across active markets"],
  ["Active Communities", "24", "Local + online"],
  ["Successful Swaps", "3,284", "Recent activity"],
];

const countries = [["🇮🇳","India","184"],["🇦🇪","UAE","96"],["🇺🇸","USA","74"],["🇧🇷","Brazil","61"],["🇻🇳","Vietnam","48"]];
const countryOptions = [["🇮🇳","India"],["🇦🇪","UAE"],["🇺🇸","USA"],["🇧🇷","Brazil"],["🇻🇳","Vietnam"],["🇬🇧","United Kingdom"],["🇨🇦","Canada"],["🇦🇺","Australia"],["🇸🇬","Singapore"],["🇲🇾","Malaysia"],["🇮🇩","Indonesia"],["🇹🇭","Thailand"],["🇵🇭","Philippines"],["🇩🇪","Germany"],["🇫🇷","France"],["🇯🇵","Japan"],["🇰🇷","South Korea"],["🇿🇦","South Africa"],["🇳🇬","Nigeria"],["🇰🇪","Kenya"],["🇲🇽","Mexico"],["🇳🇱","Netherlands"],["🇮🇹","Italy"],["🇪🇸","Spain"],["🇧🇩","Bangladesh"],["🇵🇰","Pakistan"],["🇱🇰","Sri Lanka"],["🇳🇵","Nepal"],["🇸🇦","Saudi Arabia"],["🇶🇦","Qatar"]] as const;
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
  const [selectedCountry, setSelectedCountry] = useState("");
  const [membershipRecord, setMembershipRecord] = useState<any>(null);
  const [referralCode, setReferralCode] = useState("");
  const [founderReferralCode, setFounderReferralCode] = useState("");
  const [selectedTier, setSelectedTier] = useState<keyof typeof membershipTiers | null>(null);
  const [txHash, setTxHash] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("Not submitted");
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [businessQuery, setBusinessQuery] = useState("");
  const [businessCountry, setBusinessCountry] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessResults, setBusinessResults] = useState<any[]>([]);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [businessError, setBusinessError] = useState("");
  const [referralCopied, setReferralCopied] = useState(false);
  const [loyaltyAccessToken, setLoyaltyAccessToken] = useState("");
  const [loyaltyConnected, setLoyaltyConnected] = useState(false);
  const [loyaltySyncStatus, setLoyaltySyncStatus] = useState("Not connected to GBK Loyalty");
  const [founderNetwork, setFounderNetwork] = useState<{users:any[];businesses:any[]}>({users:[],businesses:[]});
  const [founderUserName, setFounderUserName] = useState("");
  const [founderUserContact, setFounderUserContact] = useState("");
  const [founderUserCountry, setFounderUserCountry] = useState("");
  const [founderBusinessName, setFounderBusinessName] = useState("");
  const [founderBusinessOwner, setFounderBusinessOwner] = useState("");
  const [founderBusinessContact, setFounderBusinessContact] = useState("");
  const [founderBusinessCity, setFounderBusinessCity] = useState("");
  const [founderBusinessCountry, setFounderBusinessCountry] = useState("");
  const [founderBusinessCategory, setFounderBusinessCategory] = useState("Restaurants & Cafés");
  const [founderBusinessOffer, setFounderBusinessOffer] = useState("10%");
  const [founderBusinessAddress, setFounderBusinessAddress] = useState("");
  const [founderBusinessWebsite, setFounderBusinessWebsite] = useState("");
  const [networkBusy, setNetworkBusy] = useState(false);
  const [claimRequests, setClaimRequests] = useState<any[]>([]);
  const [claimBusy, setClaimBusy] = useState(false);
  const walletConnectProviderRef = useRef<any>(null);

  type EthereumProvider = {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on?: (event: string, handler: (...args: unknown[]) => void) => void;
    removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
  };

  useEffect(() => {
    const ethereum = (window as Window & { ethereum?: EthereumProvider }).ethereum;
    const savedCountry = window.localStorage.getItem("gbkFounderCountry");
    if (savedCountry) setSelectedCountry(savedCountry);
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
    if (wallet) {
      void refreshMembershipStatus(wallet);
      void syncLoyaltyNetwork(wallet);
    }
  }, [wallet, selectedCountry]);

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

  async function founderApi(body: Record<string, unknown>) {
    const res = await fetch("/api/founder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.ok === false) throw new Error(data?.error || "Founder verification request failed");
    return data;
  }

  async function loyaltyRequest(token:string, action:string, body:Record<string, unknown> = {}) {
    const res = await fetch(LOYALTY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ action, ...body }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.error) throw new Error(data?.error || "GBK Loyalty request failed");
    return data;
  }

  async function createLoyaltyAnonymousSession() {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({}),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.access_token) throw new Error(data?.msg || data?.error_description || "GBK Loyalty sign-in failed");
    window.localStorage.setItem("gbkFounderLoyaltyAccessToken", data.access_token);
    setLoyaltyAccessToken(data.access_token);
    return data.access_token as string;
  }

  async function getLoyaltySession(address:string) {
    let token = loyaltyAccessToken || window.localStorage.getItem("gbkFounderLoyaltyAccessToken") || "";
    if (token) {
      try {
        const current = await loyaltyRequest(token, "my_data", {});
        const currentWallet = String(current?.profile?.wallet_address || "").toLowerCase();
        if (!currentWallet || currentWallet === address.toLowerCase()) return token;
      } catch {}
    }
    token = await createLoyaltyAnonymousSession();
    return token;
  }

  async function loadClaimRequests(address = wallet) {
    if (!address) return;
    try {
      const token = await getLoyaltySession(address);
      const data = await loyaltyRequest(token, "claim_queue", {});
      setClaimRequests(data.claims || []);
    } catch (error) {
      setLoyaltySyncStatus(error instanceof Error ? error.message : "Claim queue could not be loaded");
    }
  }

  async function decideClaim(claimId:string, decision:"APPROVE"|"REJECT") {
    if (!wallet) return;
    setClaimBusy(true);
    try {
      const token = await getLoyaltySession(wallet);
      await loyaltyRequest(token, "claim_decision", { claim_id: claimId, decision });
      await loadClaimRequests(wallet);
      setLoyaltySyncStatus(decision === "APPROVE" ? "Claim approved ✓" : "Claim rejected");
    } catch (error) {
      setLoyaltySyncStatus(error instanceof Error ? error.message : "Claim decision failed");
    } finally {
      setClaimBusy(false);
    }
  }

  async function syncLoyaltyNetwork(address = wallet) {
    if (!address) return;
    setNetworkBusy(true);
    setLoyaltySyncStatus("Connecting Founder dashboard to GBK Loyalty…");
    try {
      const token = await getLoyaltySession(address);
      await loyaltyRequest(token, "profile_upsert", {
        role: "founder",
        full_name: "GBK Founder",
        country: selectedCountry || null,
        wallet_address: address,
      });

      let synced:any = null;
      try {
        synced = await loyaltyRequest(token, "founder_sync_verified_membership", {
          country: selectedCountry || null,
        });
      } catch (syncError) {
        // If Loyalty already has this wallet marked verified, keep using that
        // verified Founder record instead of blocking the Founder dashboard.
        const status = await loyaltyRequest(token, "founder_status", {});
        if (!status?.founder?.founder_verified) throw syncError;
        synced = { founder: status.founder, founderReferralCode: status.founder.founder_referral_code || "" };
      }

      const network = await loyaltyRequest(token, "founder_network", {});
      const claims = await loyaltyRequest(token, "claim_queue", {});
      setFounderNetwork({ users: network.users || [], businesses: network.businesses || [] });
      setClaimRequests(claims.claims || []);
      setFounderReferralCode(synced.founderReferralCode || synced.founder?.founder_referral_code || "");
      setLoyaltyConnected(true);
      setLoyaltySyncStatus(`Connected ✓ · ${(network.users || []).length} users · ${(network.businesses || []).length} businesses · Claims ${(claims.claims || []).length}`);
    } catch (error) {
      setLoyaltyConnected(false);
      setLoyaltySyncStatus(error instanceof Error ? error.message : "GBK Loyalty connection failed");
    } finally {
      setNetworkBusy(false);
    }
  }

  async function addFounderNetworkUser() {
    if (!wallet) return setLoyaltySyncStatus("Connect your Founder wallet first.");
    setNetworkBusy(true);
    try {
      const token = await getLoyaltySession(wallet);
      const targetCountry = (founderUserCountry || selectedCountry || window.localStorage.getItem("gbkFounderCountry") || "").trim();
      if (!founderUserName.trim() || !founderUserContact.trim() || !targetCountry || targetCountry === "Global") {
        throw new Error("Select your Founder country first, then enter user name and mobile/email.");
      }
      await loyaltyRequest(token, "profile_upsert", {
        role: "founder",
        full_name: "GBK Founder",
        country: targetCountry,
        wallet_address: wallet,
      });
      await loyaltyRequest(token, "founder_add_user", {
        referred_name: founderUserName.trim(),
        referred_email: founderUserContact.includes("@") ? founderUserContact.trim() : null,
        referred_phone: founderUserContact.includes("@") ? null : founderUserContact.trim(),
        country: targetCountry,
      });
      setFounderUserName(""); setFounderUserContact(""); setFounderUserCountry("");
      setLoyaltySyncStatus("User added to your GBK Loyalty Founder network ✓");
      await syncLoyaltyNetwork(wallet);
    } catch (error) {
      setLoyaltySyncStatus(error instanceof Error ? error.message : "User could not be added");
      setNetworkBusy(false);
    }
  }

  async function addFounderNetworkBusiness() {
    if (!wallet) return setLoyaltySyncStatus("Connect your Founder wallet first.");
    setNetworkBusy(true);
    try {
      // Make the Add Business button self-healing: if the dashboard was opened
      // before Loyalty finished syncing, connect first and then submit.
      if (!loyaltyConnected) {
        await syncLoyaltyNetwork(wallet);
      }
      const token = await getLoyaltySession(wallet);
      const targetCountry = (founderBusinessCountry || selectedCountry || window.localStorage.getItem("gbkFounderCountry") || "").trim();
      if (!founderBusinessName.trim() || !founderBusinessCity.trim() || !targetCountry || targetCountry === "Global") {
        throw new Error("Select your Founder country first, then enter business name and city.");
      }
      await loyaltyRequest(token, "profile_upsert", {
        role: "founder",
        full_name: "GBK Founder",
        country: targetCountry,
        wallet_address: wallet,
      });
      await loyaltyRequest(token, "founder_add_business", {
        business_name: founderBusinessName.trim(),
        owner_name: founderBusinessOwner.trim() || null,
        phone: founderBusinessContact.includes("@") ? null : founderBusinessContact.trim() || null,
        email: founderBusinessContact.includes("@") ? founderBusinessContact.trim() : null,
        category: founderBusinessCategory,
        country: targetCountry,
        city: founderBusinessCity.trim(),
        address: founderBusinessAddress.trim() || null,
        website: founderBusinessWebsite.trim() || null,
        loyalty_offer_percent: Number(founderBusinessOffer.replace("%","")),
      });
      setFounderBusinessName(""); setFounderBusinessOwner(""); setFounderBusinessContact(""); setFounderBusinessCity(""); setFounderBusinessCountry(""); setFounderBusinessAddress(""); setFounderBusinessWebsite("");
      setLoyaltySyncStatus("Business added to your GBK Loyalty network ✓ · owner activation is still required before public listing");
      await syncLoyaltyNetwork(wallet);
    } catch (error) {
      setLoyaltySyncStatus(error instanceof Error ? error.message : "Business could not be added");
      setNetworkBusy(false);
    }
  }

  async function refreshMembershipStatus(address = wallet) {
    if (!address) return;
    setMembershipLoading(true);
    try {
      const data = await founderApi({ action: "status", wallet: address });
      const activeMembership = data.memberships?.[0] || null;
      setMembershipRecord(activeMembership);
      setFounderReferralCode(data.founderReferralCode || "");
      if (activeMembership?.status === "active") {
        setVerificationStatus("Founder membership already verified ✓");
        setTxHash(activeMembership.tx_hash || "");
      }
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
        setFounderReferralCode(data.founderReferralCode || "");
        setVerificationStatus("Founder membership verified ✓");
      } else {
        setVerificationStatus(data.message || "Transaction does not qualify yet.");
      }
    } catch (error) {
      setVerificationStatus(error instanceof Error ? error.message : "Verification failed");
    }
  }

  const shortWallet = wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : "";
  const countryMatch = countryOptions.find(([, name]) => name === selectedCountry);
  const countryFlag = countryMatch?.[0] || "🏳️";
  const countryName = countryMatch?.[1] || "Country";
  const referralLink = wallet ? `https://app.gbkai.com/?ref=${wallet}` : "";

  async function searchBusinesses(overrides: { query?: string; country?: string; city?: string; category?: string } = {}) {
    setBusinessLoading(true);
    setBusinessError("");
    try {
      const params = new URLSearchParams();
      const query = overrides.query ?? businessQuery;
      const country = overrides.country ?? businessCountry;
      const city = overrides.city ?? businessCity;
      const category = overrides.category ?? businessCategory;
      if (query.trim()) params.set("q", query.trim());
      if (country.trim()) params.set("country", country.trim());
      if (city.trim()) params.set("city", city.trim());
      if (category.trim()) params.set("category", category.trim());
      const res = await fetch(`/api/businesses?${params.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Business search unavailable.");
      setBusinessResults(data.businesses || []);
    } catch (error) {
      setBusinessError(error instanceof Error ? error.message : "Business search unavailable.");
      setBusinessResults([]);
    } finally {
      setBusinessLoading(false);
    }
  }

  async function copyReferralLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setReferralCopied(true);
      window.setTimeout(() => setReferralCopied(false), 1800);
    } catch {
      setReferralCopied(false);
    }
  }

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
          <div className="topWallet">
            <Link className="workspaceTopBtn" href="/workspace">👑 Founder Workspace</Link>
            {wallet ? <button className="hubBtn" type="button" onClick={disconnectWallet}>✓ {shortWallet}</button> : <button className="primary" type="button" onClick={connectWallet}>🔗 Connect Wallet</button>}
          </div>
        </header>

<section className="panel founderHub" id="founder-workspace">
          <div className="panelHead">
            <div><h3>👑 Founder Workspace</h3><p>Your main workspace for Founder benefits, business activity and GBK ecosystem tools.</p></div>
            <span className="badge">FOUNDER WORKSPACE</span>
          </div>
          <div className="hubGrid">
            <div className="hubCard"><b>🏠 Founder Home</b><small>Return to your Founder dashboard and membership status.</small><a className="hubBtn" href="#membership-status">Open Dashboard →</a></div>
            <div className="hubCard"><b>🏪 Business Listings</b><small>Search approved businesses and open the business listing area.</small><a className="hubBtn" href="#business-listings">Open Directory →</a></div>
            <div className="hubCard"><b>👥 User Opportunities</b><small>Explore current founder, merchant and community opportunities when available.</small><a className="hubBtn" href="#growth-hub">View Opportunities →</a></div>
            <div className="hubCard"><b>📚 Learn</b><small>Spoken English, multilingual learning and digital skills.</small><a className="hubBtn" href="https://learn.gbkai.com" target="_blank" rel="noreferrer">Open Learn ↗</a></div>
            <div className="hubCard"><b>📣 Digital Marketing</b><small>Marketing and content resources for founders and businesses.</small><a className="hubBtn" href="https://market.gbkai.com" target="_blank" rel="noreferrer">Open Marketing ↗</a></div>
            <div className="hubCard"><b>🪙 GBK Loyalty</b><small>Connect with the GBK merchant loyalty ecosystem.</small><a className="hubBtn" href="https://loyalty.gbkai.com" target="_blank" rel="noreferrer">Open Loyalty ↗</a></div>
            <div className="hubCard"><b>🛠️ AI Tools</b><small>Business, productivity and AI tools across the GBK ecosystem.</small><a className="hubBtn" href="https://tools.gbkai.com" target="_blank" rel="noreferrer">Open AI Tools ↗</a></div>
            <div className="hubCard"><b>🛒 AI Marketplace</b><small>Explore products, services and everyday needs through the marketplace.</small><a className="hubBtn" href="https://market.gbkai.com" target="_blank" rel="noreferrer">Open Marketplace ↗</a></div>
            <div className="hubCard"><b>🎟️ Events</b><small>View Founder community events and ecosystem activities.</small><Link className="hubBtn" href="/events">Open Events →</Link></div>
            <div className="hubCard"><b>📊 My Activity</b><small>Use the Founder tools and activity sections below to review your participation.</small><a className="hubBtn" href="#founder-hub">Open Activity →</a></div>
            <div className="hubCard"><b>🔗 Social Share</b><small>Share the official GBK ecosystem through your social channels.</small><a className="hubBtn" href="#founder-hub">Open Share Tools →</a></div>
            <div className="hubCard"><b>🔄 GBK Swap</b><small>Open the supported GBK swap route when you need to buy or use GBK.</small><a className="hubBtn" href="https://swap.gbkai.com" target="_blank" rel="noreferrer">Open GBK Swap ↗</a></div>
          </div>
          <div className="notice"><b>Workspace access:</b> this dashboard links to the currently available GBK ecosystem tools. Business listing access, leads and other opportunities remain subject to the applicable program rules and availability.</div>
        </section>

        <div className="hero">
          <div>
            <div className="pill">● COMMUNITY PLATFORM</div>
            <h2>GBK: Blockchain + AI +<br/><em>Real-World Utility</em></h2>
            <p>Connect founders, merchants, builders and communities across countries while exploring the GBK ecosystem.</p>
            <div className="heroBtns"><a className="secondary" href="#install">📲 Add to Home Screen</a>
              <a className="primary" href={SWAP_URL} target="_blank" rel="noreferrer">↔ Swap GBK Easily ↗</a>
              <a className="secondary" href="#benefits">View Founder Benefits</a>
              <a className="secondary" href="/api/gbk-future-guide">📄 Download 10-Page GBK Guide — Pattaya</a>
            </div>
          </div>
          <div className="heroOrb"><div className="orb">GBK</div><span>GLOBAL<br/>NETWORK</span></div>
        </div>

        <div className="stats">{stats.map(([a,b,c])=><div className="stat" key={a}><span>{a}</span><strong>{b}</strong><small>{c}</small></div>)}</div>

        <section className="ecosystemLanding" id="ecosystem">
          <div className="ecosystemLandingHead">
            <div>
              <div className="pill">● FOR EVERYONE</div>
              <h2>🌍 GBK Community Ecosystem</h2>
              <p>One simple path for token holders, users, founders and businesses: <b>Hold → Use → Build → Connect → Grow.</b></p>
            </div>
            <div className="ecosystemTag">GLOBAL ECOSYSTEM</div>
          </div>
          <div className="ecosystemCards">
            <a className="ecoCard ecoToken" href="#daily-rewards">
              <span className="ecoIcon">🪙</span><div><b>HOLD GBK</b><small>Token holders can explore the applicable GBK token-reward mechanism and ecosystem utilities.</small></div><strong>Explore →</strong>
            </a>
            <a className="ecoCard ecoSwap" href={SWAP_URL} target="_blank" rel="noreferrer">
              <span className="ecoIcon">🔄</span><div><b>USE GBK</b><small>Open the supported GBK swap and ecosystem application.</small></div><strong>Open →</strong>
            </a>
            <a className="ecoCard ecoFounder" href="#global-founder">
              <span className="ecoIcon">👑</span><div><b>BUILD WITH GBK</b><small>Country and Global Founder participation for community and ecosystem development.</small></div><strong>Explore →</strong>
            </a>
            <a className="ecoCard ecoMerchant" href="#merchants">
              <span className="ecoIcon">🏪</span><div><b>CONNECT BUSINESSES</b><small>Help genuine merchants and service providers enter the GBK network.</small></div><strong>Connect →</strong>
            </a>
            <a className="ecoCard ecoMarket" href="https://market.gbkai.com" target="_blank" rel="noreferrer">
              <span className="ecoIcon">🤖</span><div><b>AI MARKETPLACE</b><small>Ask for products, services and everyday needs through the marketplace vision.</small></div><strong>Ask AI →</strong>
            </a>
            <a className="ecoCard ecoLearn" href="https://learn.gbkai.com" target="_blank" rel="noreferrer">
              <span className="ecoIcon">📚</span><div><b>LEARN</b><small>Multilingual learning, spoken English and digital skills.</small></div><strong>Learn →</strong>
            </a>
            <a className="ecoCard ecoAgri" href="https://agri.gbkai.com" target="_blank" rel="noreferrer">
              <span className="ecoIcon">🌾</span><div><b>AI AGRI</b><small>Explore agricultural AI tools and information services.</small></div><strong>Explore →</strong>
            </a>
            <a className="ecoCard ecoCommunity" href="#founder-hub">
              <span className="ecoIcon">🌎</span><div><b>JOIN THE NETWORK</b><small>Participate in content, events, merchant initiatives and community activities.</small></div><strong>Join →</strong>
            </a>
          </div>
          <div className="ecosystemFlow">
            <span>HOLDERS</span><i>→</i><span>USERS</span><i>→</i><span>FOUNDERS</span><i>→</i><span>MERCHANTS</span><i>→</i><span>MARKETPLACE</span><i>→</i><span>GLOBAL COMMUNITY</span>
          </div>
          <div className="notice"><b>Clear separation:</b> Token-holder rewards, Founder membership, referral rewards and marketplace participation are separate program components. Each follows its own current rules and conditions.</div>
          <div className="ecosystemDownload">
            <div><b>📘 GBK Future Ecosystem Guide — Pattaya</b><small>Updated 10-page guide covering the GBK vision, token holder journey, official contract, Swap, AI Marketplace, Founder program, Learn, Agri, community strategy and roadmap.</small></div>
            <a className="primary" href="/api/gbk-future-guide">Download PDF ↗</a>
          </div>
        </section>

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

        <section className="panel swapConfirmationPanel" id="swap-confirmation" style={{display: membershipRecord?.status === "active" ? "none" : undefined}}>
          <div className="stepLabel"><span>3</span><div><b>Pay & Verify Your Membership</b><small>Complete the selected amount through GBK Swap, then return here and submit the BSC transaction hash.</small></div></div>
          <div className="panelHead"><div><h3>🔄 BSC Membership Verification</h3><p>Your connected wallet, selected membership and confirmed transaction are checked before activation.</p></div><span className="badge">LIVE VERIFICATION</span></div>
          <div className="swapFlow">
            <div className="swapStep"><span>1</span><b>Connect Wallet</b><small>Use the same BNB Smart Chain wallet for the membership purchase.</small></div>
            <div className="swapArrow">→</div>
            <div className="swapStep"><span>2</span><b>Complete Purchase</b><small>Complete the selected membership amount in USDT → GBK using the same wallet.</small></div>
            <div className="swapArrow">→</div>
            <div className="swapStep"><span>3</span><b>Verify</b><small>Backend checks the confirmed BSC transaction, sender, USDT spent and GBK received.</small></div>
          </div>
          <div className="confirmationCard">
            <div><b>Selected membership</b><strong>{selectedTier ? `${membershipTiers[selectedTier].title} · ${membershipTiers[selectedTier].amount}` : "Choose a membership level above"}</strong><small>Membership verification uses the selected USD threshold; no private key or seed phrase is requested.</small></div>
            <a className="primary" href={SWAP_URL} target="_blank" rel="noreferrer">{selectedTier ? `Continue to GBK Swap ↗` : "Open GBK Swap ↗"}</a>
          </div>
          {membershipRecord?.status === "active" ? <div className="notice"><b>✓ Already verified:</b> This Founder membership is active. No new transaction submission or purchase is required. The existing Founder membership can now be connected to GBK Loyalty.</div> : null}
          <div className="confirmationFields">
            <div><span>Verification status</span><b>{verificationStatus}</b></div>
            <div><span>Transaction hash</span><b>{txHash ? `${txHash.slice(0, 10)}…${txHash.slice(-8)}` : "Not submitted"}</b></div>
            <div><span>Wallet</span><b>{wallet ? shortWallet : "Connect wallet first"}</b></div>
            <div><span>Holding rule</span><b>Keep ≥ 50% of activation GBK baseline</b></div>
          </div>
          {membershipRecord?.status !== "active" && <div className="verifyBox"><label>BSC transaction hash</label>
          <div className="confirmationInputRow">
            <input value={txHash} onChange={(e) => setTxHash(e.target.value.trim())} placeholder="Paste your 0x… transaction hash" aria-label="BSC transaction hash" />
            <button className="primary" type="button" disabled={!wallet || !selectedTier || !txHash} onClick={verifyFounderTransaction}>Verify Membership →</button>
          </div></div>}
          <div className="notice"><b>Automatic checks:</b> successful BSC receipt → connected wallet is the transaction sender → selected USDT threshold is met → GBK is received by the same wallet → activation GBK balance is recorded → Founder status is activated. The dashboard then checks the 50% holding rule. No seed phrase or private key is ever requested.</div>
        </section>

                <section className="panel" id="founder-country-selection">
          <div className="panelHead">
            <div>
              <h3>🌍 Founder Country</h3>
              <p>Select the country for your Founder network and local customer/merchant registration.</p>
            </div>
            <span className="badge">REQUIRED FOR COUNTRY FOUNDER</span>
          </div>
          <div className="coreCard" style={{padding:18}}>
            <label style={{display:"block",fontWeight:700,marginBottom:8}}>Your Founder country</label>
            <select value={selectedCountry} onChange={e=>{const value=e.target.value;setSelectedCountry(value);window.localStorage.setItem("gbkFounderCountry",value);setLoyaltySyncStatus(value ? `Founder country set to ${value} ✓` : "Founder country not selected");}} style={{width:"100%",minHeight:52,fontSize:16}}>
              <option value="">Select your country</option>
              {countryOptions.map(([flag,name])=><option key={name} value={name}>{flag} {name}</option>)}
            </select>
            <small style={{display:"block",marginTop:8}}>Choose your assigned country before adding customers or new merchants. Your selection is saved on this device.</small>
          </div>
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
              <div className="membershipIdentity"><span className="membershipBadge">{tier?.scope === "Country" ? countryFlag : "🌍"} {tier?.badge || "FOUNDER"}</span><strong>{tier?.title || membershipRecord.tier_code}</strong><small>{tier?.scope === "Country" ? `${countryName} · ${membershipRecord.price_usd}` : `Global · ${membershipRecord.price_usd}`}</small></div>
              <div className="membershipMeta"><div><span>Scope</span><b>{tier?.scope || "Founder"}</b></div><div><span>Verified Amount</span><b>${membershipRecord.price_usd}</b></div><div><span>GBK Baseline</span><b>{Number(membershipRecord.baseline_gbk_balance).toLocaleString()} GBK</b></div><div><span>Minimum Holding</span><b>{Number(membershipRecord.minimum_gbk_balance).toLocaleString()} GBK</b></div></div>
              <div className="membershipBenefits"><b>{holdingActive ? "Founder benefits active ✓" : "Founder benefits paused"}</b><span>Current GBK: {Number(membershipRecord.current_gbk_balance).toLocaleString()} GBK</span><span>Required: at least 50% of activation baseline</span>{(tier?.benefits || []).map(x=><span key={x}>{holdingActive ? "✓" : "⏸"} {x}</span>)}</div>
              <div className="notice"><b>50% holding rule:</b> activation baseline = {Number(membershipRecord.baseline_gbk_balance).toLocaleString()} GBK; minimum = {Number(membershipRecord.minimum_gbk_balance).toLocaleString()} GBK. Below the minimum, Founder benefits are paused; returning to the minimum reactivates them.</div>
            </div>;
          })() : <div className="membershipPending"><strong>Connect wallet → choose membership → complete qualifying GBK purchase → verify transaction</strong><span>The backend verifies the BSC transaction and records the original GBK balance at activation. A referral is not required for the Founder membership purchase.</span><div className="tierPreview">{Object.values(membershipTiers).map(t=><div key={t.amount+t.title}><b>{t.title}</b><small>{t.scope} · {t.amount}</small></div>)}</div></div>}
          <div className="notice"><b>Security:</b> Never enter a seed phrase or private key. Only the public wallet address and confirmed BSC transaction hash are used for verification.</div>
        </section>

        

        <section className="panel founderNetworkPanel" id="founder-referral-network">
          <div className="panelHead">
            <div><h3>👥 Founder Referral Network</h3><p>Founder dashboard ↔ GBK Loyalty — add users and businesses without leaving your Founder workspace.</p></div>
            <span className="badge">CONNECTED</span>
          </div>

          <div className="founderNetworkHero">
            <div>
              <span>YOUR FOUNDER BUSINESS REFERRAL CODE</span>
              <strong>{founderReferralCode || (wallet ? "Syncing from GBK Loyalty…" : "Connect and verify your Founder wallet")}</strong>
              <small>{loyaltySyncStatus}</small>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button className="hubBtn" type="button" disabled={!founderReferralCode} onClick={async()=>{if(!founderReferralCode)return;try{await navigator.clipboard.writeText(founderReferralCode);setReferralCopied(true);window.setTimeout(()=>setReferralCopied(false),1800)}catch{}}}>{referralCopied ? "✓ Copied" : "Copy Code"}</button>
              <button className="primary" type="button" disabled={!wallet||networkBusy} onClick={()=>void syncLoyaltyNetwork(wallet)}>{networkBusy ? "Syncing…" : "↻ Sync Loyalty"}</button>
            </div>
          </div>

          <div className="notice" style={{marginTop:16}}><b>Founder country:</b> <select style={{marginLeft:8}} value={selectedCountry} onChange={e=>{setSelectedCountry(e.target.value);window.localStorage.setItem("gbkFounderCountry",e.target.value);}}><option value="">Select country</option>{countryOptions.map(([flag,name])=><option key={name} value={name}>{flag} {name}</option>)}</select><small style={{display:"block",marginTop:6}}>Required for Country Founder customer and merchant registration.</small></div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginTop:16}}>
            <div className="coreCard" style={{padding:18}}>
              <div style={{fontSize:26}}>👤</div>
              <b>Add User to My Network</b>
              <small>Country Founders can add users in their assigned country. Global Founders can add users globally by selecting a country.</small>
              <input style={{marginTop:10}} value={founderUserName} onChange={e=>setFounderUserName(e.target.value)} placeholder="User full name"/>
              <input value={founderUserContact} onChange={e=>setFounderUserContact(e.target.value)} placeholder="Mobile or email"/>
              <select value={founderUserCountry || selectedCountry} onChange={e=>setFounderUserCountry(e.target.value)}><option value="">Select country</option>{countryOptions.map(([flag,name])=><option key={name} value={name}>{flag} {name}</option>)}</select>
              <button className="primary" type="button" disabled={!loyaltyConnected||networkBusy} onClick={()=>void addFounderNetworkUser()}>{networkBusy ? "Saving…" : "＋ Add User"}</button>
            </div>

            <div className="coreCard" style={{padding:18}}>
              <div style={{fontSize:26}}>🏢</div>
              <b>Add Business to My Network</b>
              <small>Businesses appear in your Founder network immediately. Owner activation and funding are required before customer-facing activation.</small>
              <input style={{marginTop:10}} value={founderBusinessName} onChange={e=>setFounderBusinessName(e.target.value)} placeholder="Business name"/>
              <select value={founderBusinessCategory} onChange={e=>setFounderBusinessCategory(e.target.value)}>{loyaltyBusinessCategories.map(x=><option key={x}>{x}</option>)}</select>
              <input value={founderBusinessOwner} onChange={e=>setFounderBusinessOwner(e.target.value)} placeholder="Owner / contact name"/>
              <input value={founderBusinessContact} onChange={e=>setFounderBusinessContact(e.target.value)} placeholder="Mobile or email"/>
              <input value={founderBusinessCity} onChange={e=>setFounderBusinessCity(e.target.value)} placeholder="City"/>
              <select value={founderBusinessCountry || selectedCountry} onChange={e=>setFounderBusinessCountry(e.target.value)}><option value="">Select country</option>{countryOptions.map(([flag,name])=><option key={name} value={name}>{flag} {name}</option>)}</select>
              <input value={founderBusinessAddress} onChange={e=>setFounderBusinessAddress(e.target.value)} placeholder="Address"/>
              <input value={founderBusinessWebsite} onChange={e=>setFounderBusinessWebsite(e.target.value)} placeholder="Website (optional)"/>
              <select value={founderBusinessOffer} onChange={e=>setFounderBusinessOffer(e.target.value)}><option>5%</option><option>10%</option><option>15%</option><option>20%</option></select>
              <button className="primary" type="button" disabled={!loyaltyConnected||networkBusy} onClick={()=>void addFounderNetworkBusiness()}>{networkBusy ? "Saving…" : "＋ Add Business"}</button>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginTop:16}}>
            <div className="offerPreview">
              <b>👤 My User Referrals ({founderNetwork.users.length})</b>
              {founderNetwork.users.length===0 ? <span>No users added yet.</span> : founderNetwork.users.slice(0,20).map((u:any)=><div key={u.id} style={{display:"flex",justifyContent:"space-between",gap:10,padding:"9px 0",borderBottom:"1px solid #e5e7eb"}}><strong>{u.referred_name}</strong><span>{u.country} · {u.status}</span></div>)}
            </div>
            <div className="offerPreview">
              <b>🏢 My Business Referrals ({founderNetwork.businesses.length})</b>
              {founderNetwork.businesses.length===0 ? <span>No businesses added yet.</span> : founderNetwork.businesses.slice(0,20).map((b:any)=><div key={b.id} style={{display:"flex",justifyContent:"space-between",gap:10,padding:"9px 0",borderBottom:"1px solid #e5e7eb"}}><strong>{b.business_name}</strong><span>{b.city}, {b.country} · {b.listing_status || "PENDING"}</span></div>)}
            </div>
          </div>

          <div className="founderNetworkFlow">
            <span>FOUNDER</span><i>→</i><span>USER / BUSINESS</span><i>→</i><span>GBK LOYALTY</span><i>→</i><span>QUALIFYING ACTIVITY</span>
          </div>
          <div className="notice"><b>Connection rules:</b> Founder membership is verified from the existing Founder membership record for the connected wallet. No new purchase is required. Business registration remains open to everyone; Founder attribution applies when the business is linked to the verified Founder. Country Founder referrals remain country-restricted.</div>
        </section>

        <section className="panel founderBenefits" id="founder-benefits">
          <div className="panelHead">
            <div><h3>👑 Founder Benefits — 3 Core Benefits</h3><p>Holding rewards, Founder referrals, and Business Loyalty participation.</p></div>
            <span className="badge">CORE BENEFITS</span>
          </div>
          <div className="benefitGrid">
            <article className="benefitCard">
              <span className="benefitNumber">01</span>
              <div className="benefitIcon">🪙</div>
              <h4>GBK Holding Benefit</h4>
              <p>Eligible Founder members can hold GBK in a BNB Smart Chain compatible wallet and participate in the applicable additional GBK reward program.</p>
              <strong>0.7%–6.3% additional rewards*</strong>
              <small>Rate and eligibility depend on the active Founder program rules and tier. GBK remains in your own wallet.</small>
            </article>
            <article className="benefitCard">
              <span className="benefitNumber">02</span>
              <div className="benefitIcon">🔗</div>
              <h4>Founder Referral Benefit</h4>
              <p>Refer genuine users to the GBK ecosystem through the separate referral program on app.gbkai.com.</p>
              <div className="benefitStats"><b>L1 <em>6%</em></b><b>L2 <em>2%</em></b></div>
              <a className="hubBtn" href={EARN_URL} target="_blank" rel="noreferrer">Open Earn Dashboard ↗</a>
              <small>Referral rewards apply only to qualifying activity under the active program rules.</small>
            </article>
            <article className="benefitCard">
              <span className="benefitNumber">03</span>
              <div className="benefitIcon">🏢</div>
              <h4>Business Referral + Loyalty</h4>
              <p>Refer businesses to GBK Loyalty. A business can also register directly; the Founder relationship applies only when the business uses the Founder referral code.</p>
              <strong>20% of the loyalty reward pool*</strong>
              <small>For qualifying orders from a linked business. This is 20% of the reward pool, not 20% of the customer's purchase amount.</small>
              <div className="referralCodeMini"><span>Your business referral code</span><b>{founderReferralCode || (wallet ? "Available after Founder verification" : "Connect and verify your Founder wallet")}</b></div>
            </article>
          </div>
          <div className="benefitExample">
            <div><b>📊 Illustrative business example</b><span>10 referred businesses × 100 qualifying orders/day = 1,000 qualifying orders/day.</span></div>
            <p>If an example order is ₹1,000 and the merchant offers 10% loyalty, the reward pool is ₹100 equivalent and the Founder allocation is 20% of that pool = ₹20 equivalent/order. Actual results vary with merchant offers, qualifying orders, GBK price, minimum thresholds and settlement.</p>
          </div>
          <div className="notice"><b>* Program terms:</b> Reward rates, eligibility, qualifying activity and settlement conditions are subject to the active GBK program rules. Examples are illustrative and do not guarantee income, customers, sales, profits or returns.</div>
        </section>

        <section className="panel founderGrowthHub" id="growth-hub">
  <div className="panelHead">
    <div><h3>🚀 Founder Growth Hub</h3><p>Tools, learning and eligible business opportunities included with Founder participation.</p></div>
    <span className="badge">FOUNDER BENEFITS</span>
  </div>
  <div className="growthIntro">
    <b>Build skills. Find leads. Grow your business.</b>
    <span>Founder benefits and lead opportunities vary by membership level and current program availability. Revenue is not guaranteed.</span>
  </div>
  <div className="growthTools">
    <a href="https://tools.gbkai.com" target="_blank" rel="noreferrer"><b>🛠️ AI & Business Tools</b><small>AI productivity, business, content and everyday digital tools.</small><strong>Open Tools →</strong></a>
    <a href="https://learn.gbkai.com" target="_blank" rel="noreferrer"><b>🌍 Learn Languages</b><small>Spoken English, multilingual learning, pronunciation and digital skills.</small><strong>Start Learning →</strong></a>
    <a href="https://market.gbkai.com" target="_blank" rel="noreferrer"><b>📣 Digital Marketing</b><small>Content, promotion and digital marketing resources for founders and businesses.</small><strong>Explore →</strong></a>
  </div>
  <div className="leadTitle"><b>Founder Leads & Business Opportunities</b><small>Membership level determines the applicable access, priority and campaign participation.</small></div>
  <div className="leadGrid">
    <div><span>COUNTRY</span><b>$300</b><small>Starter founder tools, learning access and eligible local lead opportunities.</small></div>
    <div><span>COUNTRY</span><b>$500</b><small>Expanded tools, learning resources and eligible local campaign/lead opportunities.</small></div>
    <div><span>COUNTRY</span><b>$1,000</b><small>Advanced founder resources and eligible higher-priority country opportunities.</small></div>
    <div><span>GLOBAL</span><b>$3,000</b><small>Global tools, learning and eligible cross-country lead opportunities.</small></div>
    <div><span>GLOBAL</span><b>$5,000</b><small>Expanded global campaigns, tools and eligible business lead opportunities.</small></div>
    <div><span>GLOBAL</span><b>$10,000</b><small>Highest Founder program access, global campaigns and eligible priority opportunities.</small></div>
  </div>
  <div className="notice"><b>Important:</b> Leads and business opportunities depend on actual users, merchants, campaigns and program availability. Founder membership does not guarantee customers, sales, profit or revenue.</div>
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
            <>
              <div className="earnReferralBox">
                <div>
                  <span className="earnBadge">WALLET CONNECTED</span>
                  <b>💰 L1 / L2 Referral Rewards</b>
                  <small>Founder membership purchases use GBK Swap without a referral. L1/L2 referral rewards are available separately through app.gbkai.com.</small>
                  <div className="earnLevels"><span><strong>L1</strong> 6%</span><span><strong>L2</strong> 2%</span></div>
                </div>
                <div className="earnActions">
                  <a className="primary" href={SWAP_URL} target="_blank" rel="noreferrer">Open GBK Swap ↗</a>
                  <a className="hubBtn" href={EARN_URL} target="_blank" rel="noreferrer">Earn Dashboard ↗</a>
                </div>
              </div>
              <div className="founderReferralLinkBox">
                <div className="founderReferralTitle">👥 Your referral link</div>
                <div className="founderReferralUrl">{referralLink}</div>
                <button className="primary founderCopyReferral" type="button" onClick={copyReferralLink}>
                  {referralCopied ? "✓ COPIED" : "COPY REFERRAL LINK"}
                </button>
              </div>
            </>
          )}
          <div className="simpleFounderFlow">
            <div className="simpleStep"><span>1</span><b>Connect Wallet</b><small>Connect your BNB Smart Chain wallet.</small></div>
            <div className="simpleArrow">→</div>
            <div className="simpleStep"><span>2</span><b>Choose Membership</b><small>Select your Country or Global Founder level.</small></div>
            <div className="simpleArrow">→</div>
            <div className="simpleStep"><span>3</span><b>Pay & Verify</b><small>Confirm the transaction. Verification happens in the background.</small></div>
          </div>
          <div className="membershipQuickBuy" style={{display: membershipRecord?.status === "active" ? "none" : undefined}}>
            <div className="stepLabel"><span>2</span><div><b>Choose Your Founder Membership</b><small>Select one membership level. Your selection will be used for the payment and BSC verification.</small></div></div>
            <div className="quickBuyHead"><div><b>Founder Membership</b><small>Referral code is not required for Founder membership. Use GBK Swap for the membership purchase.</small></div><span className="badge">6 LEVELS</span></div>
            <div className="referralInputRow">
              <input value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="Referral code (optional)" aria-label="Referral code optional" />
              <span>{referralCode ? "Referral recorded for onboarding" : "No referral is required. Continue directly to GBK Swap."}</span>
            </div>
            <div className="tierGroup"><div className="tierGroupTitle"><span>🇺🇳</span><div><b>Country Founder</b><small>For country-level community participation</small></div></div>
            <div className="tierButtons countryTiers">
              {(Object.entries(membershipTiers).filter(([key]) => key.startsWith("country_")) as [keyof typeof membershipTiers, typeof membershipTiers[keyof typeof membershipTiers]][]).map(([key,tier]) => (
                <button key={key} type="button" className={selectedTier === key ? "tierButton selected" : "tierButton"} onClick={() => setSelectedTier(key)} disabled={!wallet}>
                  <span className="tierScope">{tier.scope}</span><b>{tier.title}</b><strong>{tier.amount}</strong>
                </button>
              ))}
            </div></div>
            <div className="tierGroup"><div className="tierGroupTitle"><span>🌍</span><div><b>Global Founder</b><small>For international and cross-country participation</small></div></div>
            <div className="tierButtons globalTiers">
              {(Object.entries(membershipTiers).filter(([key]) => key.startsWith("global_")) as [keyof typeof membershipTiers, typeof membershipTiers[keyof typeof membershipTiers]][]).map(([key,tier]) => (
                <button key={key} type="button" className={selectedTier === key ? "tierButton selected" : "tierButton"} onClick={() => setSelectedTier(key)} disabled={!wallet}>
                  <span className="tierScope">{tier.scope}</span><b>{tier.title}</b><strong>{tier.amount}</strong>
                </button>
              ))}
            </div></div>
            <div className="quickBuyAction">
              <b>{!wallet ? "Connect wallet to continue" : selectedTier ? `Selected: ${membershipTiers[selectedTier].title} · ${membershipTiers[selectedTier].amount}` : "Choose a membership level"}</b>
              <button className="primary" type="button" disabled={!wallet || !selectedTier} onClick={() => { if (selectedTier) { setVerificationStatus("GBK Swap route ready — complete the selected amount with Auto Slippage."); window.open(SWAP_URL, "_blank", "noopener,noreferrer"); document.getElementById("swap-confirmation")?.scrollIntoView({ behavior: "smooth" }); } }}>Continue to Payment →</button>
            </div>
          </div>
          <div className="coreGrid">
            <div className="coreCard"><b>1. Connect / Sign In</b><small>Connect your supported wallet to identify your Founder dashboard session.</small><button className="hubBtn" type="button" onClick={connectWallet}>{wallet ? "Wallet Connected ✓" : "Connect Wallet"}</button></div>
            <div className="coreCard"><b>2. Complete Profile</b><small>Select your country so your Country Founder membership shows the correct flag and country name.</small><select className="countrySelect" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} aria-label="Founder country"><option value="">Select country</option>{countryOptions.map(([flag,name]) => <option key={name} value={name}>{flag} {name}</option>)}</select><button className="hubBtn" type="button" onClick={() => { if (selectedCountry) { window.localStorage.setItem("gbkFounderCountry", selectedCountry); setProfileSaved(true); } }}>{profileSaved ? "Profile Saved ✓" : "Save Country"}</button></div>
            <div className="coreCard"><b>3. Membership</b><small>Country Founder: $300 / $500 / $1,000 · Global Founder: $3,000 / $5,000 / $10,000.</small><a href="#programs">View Programs →</a></div>
            <div className="coreCard"><b>4. Verification</b><small>Membership and founder status must be verified before badges or restricted benefits are activated.</small><span className="statusPill">VERIFICATION READY</span></div>
          </div>
          <div className="notice">Wallet connection supports injected BNB wallets and WalletConnect for normal mobile/desktop browsers. Membership verification is not automatic from wallet connection. A submitted transaction must be checked against the published membership payment rules before Founder status is activated.</div>
        </section>

        <section className="panel downloadPanel" id="downloads">
          <div className="panelHead">
            <div>
              <h3>📚 GBK Downloads</h3>
              <p>Official ecosystem guides and resources for Founder Community members and GBK users.</p>
            </div>
            <span className="badge">RESOURCES</span>
          </div>
          <div className="downloadHero">
            <div>
              <b>📘 GBK Global Ecosystem Guide</b>
              <p>Future vision, token-holder journey, Swap, AI Marketplace, Founder & Merchant growth, Learn, Agri, community strategy and roadmap.</p>
              <small>PDF guide · Cover + 10 ecosystem sections</small>
            </div>
            <a className="primary" href="/api/gbk-future-guide">Download PDF ↗</a>
          </div>
        </section>

        <section className="panel founderHub" id="founder-hub"><div className="panelHead"><div><h3>🚀 Founder Workspace</h3><p>Share GBK content, invite genuine community members and track your campaign activity.</p></div><span className="badge">FOUNDER TOOLS</span></div><div className="hubGrid"><div className="hubCard"><b>🔗 Your GBK Share Link</b><small>Use the official ecosystem entry point when sharing. Copy it once, then post through your own social accounts.</small><button className="hubBtn" onClick={() => navigator.clipboard?.writeText("https://app.gbkai.com")}>Copy GBK Link</button></div><div className="hubCard"><b>📣 Social Share</b><small>Share the GBK ecosystem through supported social platforms. Review content before posting.</small><div className="shareRow"><a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fapp.gbkai.com" target="_blank" rel="noreferrer">Facebook</a><a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fapp.gbkai.com&text=Explore%20the%20GBK%20ecosystem" target="_blank" rel="noreferrer">X</a><a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fapp.gbkai.com" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://wa.me/?text=Explore%20the%20GBK%20ecosystem%20https%3A%2F%2Fapp.gbkai.com" target="_blank" rel="noreferrer">WhatsApp</a></div></div><div className="hubCard"><b>🎬 Short Video Hub</b><small>Ready-to-share topics: What is GBK? · How GBK Swap works · Buy & Hold · AI Marketplace · Learn · Agri.</small><Link className="hubBtn" href="/tools">Open Content Studio →</Link></div><div className="hubCard"><b>📊 Founder Analytics</b><small>Track content reach, website visits, wallet connections, successful swaps and returning users once live analytics is connected.</small><Link className="hubBtn" href="/tools">Open Analytics →</Link></div></div></section>

        <section className="panel referralPanel" id="referrals"><div className="panelHead"><div><h3>🔗 Referral Benefits · app.gbkai.com</h3><p>Referral program participation through the GBK ecosystem.</p></div><span className="badge">L1 + L2</span></div><div className="refGrid"><div className="refCard"><span>L1</span><strong>6%</strong><p>Direct referral reward</p><small>Eligible activity only</small></div><div className="refCard"><span>L2</span><strong>2%</strong><p>Second-level referral reward</p><small>Eligible activity only</small></div><div className="refFlow"><b>Connect Wallet</b><i>→</i><b>Get Referral Link</b><i>→</i><b>Invite Genuine Users</b><i>→</i><b>Eligible Swap</b><i>→</i><b>Reward Recorded</b></div></div><div className="notice">Referral rewards are subject to app.gbkai.com program rules, eligibility, completed qualifying transactions and applicable terms. No guaranteed income. No self-referrals, duplicate/fake accounts or spam.</div><div className="refActions"><a href={SWAP_URL} target="_blank" rel="noreferrer">Open GBK Swap ↗</a><a href={EARN_URL} target="_blank" rel="noreferrer">Open Earn ↗</a></div></section>

        <section className="panel businessClaims" id="business-claims">
          <div className="panelHead"><div><h3>🛡️ Business Claim Verification</h3><p>Verify owner or authorized-representative claims before merchant setup.</p></div><span className="badge">{claimRequests.length} PENDING</span></div>
          {claimRequests.length ? <div className="directoryResults">{claimRequests.map((claim) => (
            <article className="businessResult" key={claim.id}>
              <div className="businessLogo">🏪</div>
              <div>
                <b>{claim.suggestion?.business_name || "Business claim"}</b>
                <span>{[claim.suggestion?.category, claim.suggestion?.city, claim.suggestion?.country].filter(Boolean).join(" · ")}</span>
                <small><strong>Claimant:</strong> {claim.claimant_name || "—"} · <strong>Contact:</strong> {claim.claimant_contact || "—"}</small>
                <div className="businessLinks">
                  <em>🟡 Pending verification</em>
                  <button className="hubBtn" type="button" disabled={claimBusy} onClick={() => void decideClaim(claim.id,"APPROVE")}>✓ Approve Claim</button>
                  <button className="hubBtn" type="button" disabled={claimBusy} onClick={() => void decideClaim(claim.id,"REJECT")}>Reject</button>
                </div>
              </div>
            </article>
          ))}</div> : <div className="directoryEmpty"><b>No pending business claims</b><span>New owner claims will appear here after submission.</span></div>}
          <div className="notice">Approval verifies the claim request only. The merchant must still connect a Merchant GBK Wallet, complete setup and activate before rewards can run.</div>
        </section>

        <section className="panel businessDirectory" id="business-listings">
          <div className="panelHead"><div><h3>🔎 Global Business Directory</h3><p>Search approved GBK business listings by name, service, category, country or city.</p></div><span className="badge">SEARCH</span></div>
          <div className="directorySearch">
            <input value={businessQuery} onChange={(e) => setBusinessQuery(e.target.value)} placeholder="Search business, service or product" aria-label="Search business" />
            <input value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} placeholder="Category" aria-label="Business category" />
            <input value={businessCountry} onChange={(e) => setBusinessCountry(e.target.value)} placeholder="Country" aria-label="Business country" />
            <input value={businessCity} onChange={(e) => setBusinessCity(e.target.value)} placeholder="City" aria-label="Business city" />
            <button className="primary" type="button" onClick={() => void searchBusinesses()}>{businessLoading ? "Searching…" : "Search Businesses →"}</button>
          </div>
          <div className="directoryExamples"><span>Try:</span><button type="button" onClick={() => {setBusinessQuery("AC repair");setBusinessCity("Hyderabad");setBusinessCountry("India");void searchBusinesses({query:"AC repair",city:"Hyderabad",country:"India"});}}>AC repair · Hyderabad</button><button type="button" onClick={() => {setBusinessCategory("Restaurant");void searchBusinesses({category:"Restaurant"});}}>Restaurants</button><button type="button" onClick={() => {setBusinessCategory("Real Estate");void searchBusinesses({category:"Real Estate"});}}>Real Estate</button><button type="button" onClick={() => {setBusinessQuery("website");void searchBusinesses({query:"website"});}}>Website Services</button></div>
          {businessError && <div className="notice"><b>Search:</b> {businessError}</div>}
          <div className="directoryResults">{businessResults.length ? businessResults.map((business) => (
            <article className="businessResult" key={business.id}>
              <div className="businessLogo">{business.logo_url ? <img src={business.logo_url} alt="" /> : "🏪"}</div>
              <div><b>{business.business_name}</b><span>{business.category || "Business"} · {[business.city,business.country].filter(Boolean).join(", ")}</span><small>{business.description || "Approved GBK business listing."}</small><div className="businessLinks">{business.website && <a href={business.website} target="_blank" rel="noreferrer">Website ↗</a>}{business.phone && <a href={`tel:${business.phone}`}>Contact</a>}{business.loyalty_status === "ACTIVE" && <em>🪙 GBK Loyalty</em>}</div></div>
            </article>
          )) : <div className="directoryEmpty"><b>Search the GBK business network</b><span>Only approved ACTIVE listings are shown here.</span></div>}</div>
          <div className="directoryFooter"><a className="primary" href="https://loyalty.gbkai.com" target="_blank" rel="noreferrer">🏪 Add / Manage Business ↗</a><small>Business submissions are reviewed before becoming searchable. Listing access does not guarantee customers, sales or revenue.</small></div>
        </section>

        <section className="panel anchorPanel" id="merchants"><h3>🏪 Merchant Ecosystem</h3><p>Connect with participating merchants and explore GBK marketplace opportunities.</p></section>
        <section className="panel anchorPanel" id="marketplace"><h3>✦ AI Marketplace</h3><p>Explore the GBK AI “Ask for Anything” marketplace for products, services and everyday needs.</p><a href="https://market.gbkai.com" target="_blank" rel="noreferrer">Open Marketplace ↗</a></section>

        <footer><span>GBK Global Founder Community</span><span>Built for transparent ecosystem participation · 2026</span></footer>
      </section>
    </main>
  );
}