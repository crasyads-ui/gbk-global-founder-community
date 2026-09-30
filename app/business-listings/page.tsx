"use client";

import { useState } from "react";
import Link from "next/link";

type Business = {
  id: string;
  business_name: string;
  category?: string;
  city?: string;
  country?: string;
  description?: string;
  logo_url?: string;
  website?: string;
  phone?: string;
  maps_url?: string;
  loyalty_status?: string;
  listing_type?: "ACTIVE" | "UNCLAIMED";
  unclaimed?: boolean;
};

export default function BusinessListingsPage() {
  const [query,setQuery]=useState("");
  const [results,setResults]=useState<Business[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [searched,setSearched]=useState(false);

  async function search() {
    setLoading(true); setError(""); setSearched(true);
    try {
      const p=new URLSearchParams();
      if(query.trim()) p.set("q",query.trim());
      const res=await fetch(`/api/businesses?${p.toString()}`,{cache:"no-store"});
      const data=await res.json().catch(()=>({}));
      if(!res.ok || !data.ok) throw new Error(data.error || "Business search unavailable.");
      setResults(data.businesses || []);
    } catch(e) {
      setResults([]); setError(e instanceof Error ? e.message : "Business search unavailable.");
    } finally { setLoading(false); }
  }

  return <main style={{minHeight:"100vh",background:"linear-gradient(135deg,#f8fbff,#f5f3ff)",padding:"20px 14px 50px",fontFamily:"Arial,sans-serif",color:"#172554"}}>
    <div style={{maxWidth:1080,margin:"0 auto"}}>
      <Link href="/workspace" style={{display:"inline-block",marginBottom:16,color:"#2563eb",fontWeight:800,textDecoration:"none"}}>← Founder Workspace</Link>
      <section style={{background:"#fff",border:"1px solid #dbe4f0",borderRadius:24,padding:22,boxShadow:"0 18px 50px rgba(37,99,235,.10)"}}>
        <div style={{fontSize:12,letterSpacing:2,color:"#7c3aed",fontWeight:900}}>BUSINESS MANAGEMENT</div>
        <h1 style={{fontSize:32,margin:"8px 0"}}>🌍 Global Business Directory</h1>
        <p style={{color:"#64748b",lineHeight:1.5}}>Search by business name, category or city. Active businesses and approved unclaimed listings are shown together.</p>

        <div style={{display:"flex",gap:10,marginTop:18}}>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter") void search();}}
            placeholder="🔎 Search Businesses"
            style={{flex:1,padding:15,border:"1px solid #dbe4f0",borderRadius:12,fontSize:16}}
          />
          <button onClick={()=>void search()} style={{padding:"14px 18px",border:0,borderRadius:12,background:"#7c3aed",color:"#fff",fontWeight:900,fontSize:16}}>
            {loading ? "Searching…" : "Search"}
          </button>
        </div>

        {error && <div style={{marginTop:14,padding:12,borderRadius:12,background:"#fff7ed",color:"#9a3412"}}><b>Search:</b> {error}</div>}

        <div style={{display:"grid",gap:12,marginTop:18}}>
          {results.map(b=><article key={`${b.listing_type}-${b.id}`} style={{display:"flex",gap:14,padding:16,border:"1px solid #e2e8f0",borderRadius:16}}>
            <div style={{width:54,height:54,borderRadius:14,display:"grid",placeItems:"center",background:"#f5f3ff",fontSize:25,flexShrink:0}}>
              {b.logo_url?<img src={b.logo_url} alt="" style={{width:54,height:54,objectFit:"cover",borderRadius:14}}/>:"🏪"}
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <b style={{fontSize:18}}>{b.business_name}</b>
                <span style={{padding:"4px 8px",borderRadius:999,fontSize:12,fontWeight:900}}>
                  {b.listing_type==="UNCLAIMED" ? "🟡 UNCLAIMED" : "🟢 ACTIVE"}
                </span>
              </div>
              <div style={{color:"#64748b",marginTop:4}}>{b.category || "Business"} · {[b.city,b.country].filter(Boolean).join(", ")}</div>
              <small style={{display:"block",color:"#64748b",marginTop:5}}>{b.description || "GBK business listing."}</small>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:8}}>
                {b.website&&<a href={b.website} target="_blank" rel="noreferrer">Website ↗</a>}
                {b.maps_url&&<a href={b.maps_url} target="_blank" rel="noreferrer">Map ↗</a>}
                {b.phone&&<a href={`tel:${b.phone}`}>Contact</a>}
                {b.listing_type==="UNCLAIMED"
                  ? <Link href={`/business-listings/claim?id=${encodeURIComponent(b.id)}`} style={{fontWeight:900,color:"#7c3aed"}}>Claim This Business →</Link>
                  : <span>🪙 GBK Loyalty Active</span>}
              </div>
            </div>
          </article>)}

          {!results.length && !searched && <div style={{padding:22,textAlign:"center",border:"1px dashed #cbd5e1",borderRadius:16,color:"#64748b"}}><b style={{display:"block",color:"#172554"}}>Search the GBK business network</b>Enter a business name, category or city.</div>}
          {!results.length && searched && !error && <div style={{padding:22,textAlign:"center",border:"1px dashed #cbd5e1",borderRadius:16,color:"#64748b"}}>No matching business found.</div>}
        </div>

        <div style={{marginTop:18,paddingTop:16,borderTop:"1px solid #e2e8f0"}}>
          <a href="https://loyalty.gbkai.com" target="_blank" rel="noreferrer" style={{display:"inline-block",padding:"12px 15px",borderRadius:12,background:"#7c3aed",color:"#fff",fontWeight:900,textDecoration:"none"}}>🏪 Add / Manage Business ↗</a>
        </div>
      </section>
    </div>
  </main>;
}
