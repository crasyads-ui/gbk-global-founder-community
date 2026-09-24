"use client";

import Link from "next/link";

const courses = [
  ["01", "Blockchain Basics", "Wallets, networks, tokens, transactions and security."],
  ["02", "GBK Ecosystem", "Understand GBK Swap, AI Marketplace, Learn, Agri and merchant utilities."],
  ["03", "How to Use GBK Swap", "Connect a supported wallet, review the transaction and verify the result."],
  ["04", "AI & Web3", "Practical AI concepts and how AI can support Web3 products."],
  ["05", "Founder Community", "Community building, ethical referrals, events and collaboration."],
  ["06", "Merchant Adoption", "How businesses can explore digital payments and marketplace participation."],
  ["07", "Digital Marketing Fundamentals", "Build a foundation in content, social media, SEO and campaign planning."],
  ["08", "Short-Video Marketing", "Plan educational short videos, hooks, captions and responsible calls to action."],
  ["09", "AI Content Creation", "Use AI to plan, draft, translate and improve educational marketing content."],
  ["10", "Social Media Marketing", "Learn practical approaches for YouTube, Instagram, Facebook, X and LinkedIn."],
  ["11", "SEO & Analytics", "Understand search visibility, links, tracking and conversion measurement."],
  ["12", "Community & Referral Marketing", "Learn ethical community growth, referral attribution and anti-spam practices."],
];

export default function Learn() {
  return (
    <main className="featurePage">
      <header className="featureHeader">
        <Link href="/" className="back">← Dashboard</Link>
        <span className="pill">GBK LEARN • FREE</span>
        <h1>Learning &amp; Education</h1>
        <p>Practical blockchain, AI and digital marketing education for founders and the wider community.</p>
      </header>

      <section className="learningBanner">
        <div>
          <span className="pill">🌐 FREE MULTILINGUAL LEARNING</span>
          <h2>Learn languages and build digital skills at learn.gbkai.com.</h2>
          <p>Free multilingual language learning, speaking practice and AI-assisted feedback can serve the wider global community—not only founders.</p>
        </div>
        <a href="https://learn.gbkai.com" target="_blank" rel="noreferrer">Open learn.gbkai.com →</a>
      </section>

      <section className="courseGrid">
        {courses.map(([n, t, d]) => (
          <article className="course" key={n}>
            <span>{n}</span>
            <h2>{t}</h2>
            <p>{d}</p>
            <button>Start lesson →</button>
          </article>
        ))}
      </section>

      <div className="notice large">
        Education is informational. Members should independently review transaction details, fees, eligibility and published program terms before participating.
      </div>
    </main>
  );
}
