"use client";

import Link from "next/link";

const cards = [
  ["🏠","Founder Home","Return to your Founder dashboard and membership status.","/"],
  ["🏪","Business Listings","Search approved businesses and services in the GBK network.","/#business-listings"],
  ["👥","User Opportunities","Explore current founder, merchant and community opportunities.","/#growth-hub"],
  ["📚","Learn","Spoken English, multilingual learning and digital skills.","https://learn.gbkai.com"],
  ["📣","Digital Marketing","Marketing and content resources for founders and businesses.","https://market.gbkai.com"],
  ["🪙","GBK Loyalty","Connect with the GBK merchant loyalty ecosystem.","https://loyalty.gbkai.com"],
  ["🛠️","AI Tools","Business, productivity and AI tools.","https://tools.gbkai.com"],
  ["🛒","AI Marketplace","Explore products, services and everyday needs.","https://market.gbkai.com"],
  ["🎟️","Events","Founder community events and ecosystem activities.","/events"],
  ["📊","My Activity","Review your Founder participation and available tools.","/#founder-hub"],
  ["🔗","Social Share","Share the official GBK ecosystem.","/#founder-hub"],
  ["🔄","GBK Swap","Open the supported GBK swap route.","https://swap.gbkai.com"],
] as const;

export default function FounderWorkspace() {
  return (
    <main style={{minHeight:"100vh",background:"linear-gradient(135deg,#f8fbff,#f5f3ff)",padding:"20px 14px 40px",fontFamily:"Arial,sans-serif",color:"#172554"}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <Link href="/" style={{display:"inline-block",marginBottom:16,color:"#2563eb",fontWeight:800,textDecoration:"none"}}>← Founder Dashboard</Link>
        <section style={{background:"#fff",border:"1px solid #dbe4f0",borderRadius:24,padding:22,boxShadow:"0 18px 50px rgba(37,99,235,.10)"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:12,letterSpacing:2,color:"#64748b",fontWeight:800}}>GBK FOUNDER COMMUNITY</div>
              <h1 style={{fontSize:30,margin:"8px 0 6px"}}>👑 Founder Workspace</h1>
              <p style={{margin:0,color:"#64748b",lineHeight:1.5}}>Your dedicated workspace for Founder benefits, business activity and GBK ecosystem tools.</p>
            </div>
            <span style={{background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff",padding:"9px 13px",borderRadius:999,fontSize:11,fontWeight:900}}>FOUNDER WORKSPACE</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12,marginTop:22}}>
            {cards.map(([icon,title,desc,href]) => {
              const external=href.startsWith("http");
              const body=<><div style={{fontSize:25}}>{icon}</div><b style={{fontSize:16}}>{title}</b><small style={{color:"#64748b",lineHeight:1.45,flex:1}}>{desc}</small><strong style={{color:"#2563eb",fontSize:12}}>{external?"Open ↗":"Open →"}</strong></>;
              return external ? <a key={title} href={href} target="_blank" rel="noreferrer" style={{display:"flex",flexDirection:"column",gap:8,padding:16,minHeight:145,border:"1px solid #e1e8f2",borderRadius:17,textDecoration:"none",color:"#172554",background:"#fff"}}>{body}</a> : <Link key={title} href={href} style={{display:"flex",flexDirection:"column",gap:8,padding:16,minHeight:145,border:"1px solid #e1e8f2",borderRadius:17,textDecoration:"none",color:"#172554",background:"#fff"}}>{body}</Link>;
            })}
          </div>
          <section style={{marginTop:18,padding:18,borderRadius:18,border:"2px solid #c4b5fd",background:"linear-gradient(135deg,#faf5ff,#ffffff)"}}>
            <div style={{fontSize:12,letterSpacing:1.5,color:"#7c3aed",fontWeight:900}}>BUSINESS MANAGEMENT</div>
            <h2 style={{margin:"6px 0 5px",fontSize:22}}>🏪 Business Listings Workspace</h2>
            <p style={{margin:"0 0 14px",color:"#64748b",lineHeight:1.5}}>Manage the Founder business network without changing the customer-facing active-merchant search.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10}}>
              <Link href="/#business-listings" style={{padding:"13px 14px",borderRadius:12,background:"#7c3aed",color:"#fff",fontWeight:900,textDecoration:"none"}}>🔎 Business Directory →</Link>
              <Link href="/#founder-referral-network" style={{padding:"13px 14px",borderRadius:12,background:"#fff",border:"1px solid #ddd6fe",color:"#5b21b6",fontWeight:900,textDecoration:"none"}}>＋ Add / Manage Business →</Link>
              <a href="https://loyalty.gbkai.com" target="_blank" rel="noreferrer" style={{padding:"13px 14px",borderRadius:12,background:"#fff",border:"1px solid #ddd6fe",color:"#5b21b6",fontWeight:900,textDecoration:"none"}}>🛡️ Merchant / Claim Flow ↗</a>
            </div>
            <small style={{display:"block",marginTop:12,color:"#64748b"}}>Owner claim approval happens through the GBK Loyalty review flow. Activation still requires owner verification, payment details, wallet connection, terms and GBK funding.</small>
          </section>

          <div style={{marginTop:18,padding:14,borderRadius:14,background:"#f8fafc",border:"1px solid #eef2f7",color:"#64748b",fontSize:12,lineHeight:1.5}}>
            Workspace links use the currently available GBK ecosystem services. Business listing access, leads and other opportunities remain subject to applicable program rules and availability.
          </div>
        </section>
      </div>
    </main>
  );
}
