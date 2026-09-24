"use client";

import Link from "next/link";

const tools = [
  ["Swap Assistant", "Learn the GBK swap flow, wallet connection and transaction status.", "↔"],
  ["AI Marketplace", "Ask for products, services, travel, local businesses and everyday needs.", "✦"],
  ["Founder Calculator", "Explore membership paths, referral milestones and community progress.", "◈"],
  ["Content Studio", "Create approved GBK educational and community content.", "✎"],
  ["Community Analytics", "Track visits, wallet connections, swaps, referrals and participation.", "▥"],
  ["Merchant Toolkit", "Resources for merchants joining the GBK ecosystem.", "▦"],
  ["Learn Hub", "Courses, guides and practical blockchain + AI lessons.", "◉"],
  ["Event Center", "Discover founder events, register and track participation.", "◎"],
];

export default function Tools() {
  return (
    <main className="featurePage">
      <header className="featureHeader">
        <Link href="/" className="back">← Dashboard</Link>
        <span className="pill">GBK ECOSYSTEM</span>
        <h1>Tools &amp; Learning Hub</h1>
        <p>One place for practical tools, education and founder participation.</p>
      </header>

      <section className="featureGrid">
        {tools.map(([title, desc, icon]) => (
          <article className="featureCard" key={title}>
            <div className="featureIcon">{icon}</div>
            <h2>{title}</h2>
            <p>{desc}</p>
            <button>Open →</button>
          </article>
        ))}
      </section>

      <section className="learningBanner">
        <div>
          <span className="pill">LEARN • BUILD • PARTICIPATE</span>
          <h2>Turn every founder into a knowledgeable ecosystem participant.</h2>
          <p>
            Short lessons, practical guides, events and approved resources help
            members understand the technology before participating.
          </p>
        </div>
        <Link href="/events">Explore Events →</Link>
      </section>
    </main>
  );
}
