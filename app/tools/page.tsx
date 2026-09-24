"use client";

import Link from "next/link";

const tools = [
  ["Swap Assistant", "Learn the GBK swap flow, wallet connection and transaction status.", "↔"],
  ["AI Marketplace", "Ask for products, services, travel, local businesses and everyday needs.", "✦"],
  ["Founder Calculator", "Explore membership paths, referral milestones and community progress.", "◈"],
  ["Founder Social Hub", "Upload and share approved short videos, posts and campaign materials.", "▶"],
  ["Digital Marketing Academy", "Learn SEO, social media, short-video marketing, AI content and analytics.", "📣"],
  ["Content Studio", "Create approved GBK educational and community content.", "✎"],
  ["Community Analytics", "Track visits, wallet connections, swaps, referrals and participation.", "▥"],
  ["Merchant Toolkit", "Resources for merchants joining the GBK ecosystem.", "▦"],
  ["Free Multilingual Learn", "Open learn.gbkai.com for free language learning, speaking practice and AI feedback.", "🌐"],
  ["Learn Hub", "Courses, guides and practical blockchain + AI lessons.", "◉"],
  ["Event Center", "Discover founder events, register and track participation.", "◎"],
];

export default function Tools() {
  return (
    <main className="featurePage">
      <header className="featureHeader">
        <Link href="/" className="back">← Dashboard</Link>
        <span className="pill">GBK ECOSYSTEM</span>
        <h1>Founder Tools &amp; Learning Hub</h1>
        <p>Practical tools, free education, digital marketing, content sharing and founder participation in one place.</p>
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
          <span className="pill">LEARN • CREATE • SHARE • PARTICIPATE</span>
          <h2>Build a stronger Founder Community.</h2>
          <p>Founders can learn, create approved content, share short videos, participate in events and explore the wider GBK ecosystem.</p>
        </div>
        <div className="heroBtns">
          <Link href="/learn" className="secondary">Learning Academy →</Link>
          <Link href="/events" className="primary">Explore Events →</Link>
        </div>
      </section>
    </main>
  );
}
