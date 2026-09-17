/**
 * ============================================================================
 * EXPERIENCE DATA MODULE — Mayank Yadav Founder Digital HQ
 * Verified Leadership, Venture Building & Professional Roles
 * ============================================================================
 */
const EXPERIENCE_DATA = [
  {
    id: "mrig-core",
    index: "01",
    role: "Founder & Chief Executive Officer",
    organization: "MRIG Ecosystem",
    entityType: "Parent Venture Ecosystem",
    domain: "mrig.tech",
    period: "2026 — Present",
    location: "Bhopal, India & Global",
    badge: "Parent Ecosystem Core",
    badgeType: "violet",
    icon: "assets/mrig-emblem.png",
    accentColor: "#a78bfa",
    headline: "Directing the parent company infrastructure, escrow governance, and shared technology core powering specialized venture platforms.",
    summary: "MRIG is the parent company entity established to incubate, govern, and scale focused product platforms: Rentro (physical asset marketplace, rentro.mrig.tech) and GetNextIn (AI career & technical screening engine, getnextin.mrig.tech).",
    dimensions: ["Venture Leadership", "Product Architecture", "Marketplace Economics", "AI Systems", "GTM Strategy"],
    highlights: [
      "Directing parent technology architecture housing Rentro (rentro.mrig.tech) and GetNextIn (getnextin.mrig.tech).",
      "Formulating multi-sided marketplace unit economics, capital allocation models, and shared cryptographic identity layers.",
      "Conducting 50+ discovery interviews across equipment owners, commercial fleet operators, and hiring managers.",
      "Managing end-to-end technical roadmaps, institutional partnerships, and platform operations."
    ],
    links: [
      { label: "MRIG Architecture Case Study", url: "projects/mrig.html", internal: true },
      { label: "Rentro Portal (rentro.mrig.tech) ↗", url: "https://rentro.mrig.tech", internal: false },
      { label: "GetNextIn Portal (getnextin.mrig.tech) ↗", url: "https://getnextin.mrig.tech", internal: false }
    ]
  },
  {
    id: "getnextin-product",
    index: "02",
    role: "Founder & Product Architect",
    organization: "GetNextIn",
    parentEntity: "Product under MRIG",
    domain: "getnextin.mrig.tech",
    period: "2026 — Present",
    location: "Bhopal, India & Remote",
    badge: "AI Career Platform",
    badgeType: "cyan",
    icon: "assets/getnextin-icon.png",
    accentColor: "#38bdf8",
    headline: "Architecting automated candidate technical evaluation, skill verification models, and precision talent matching.",
    summary: "GetNextIn is an AI career platform incubated under MRIG Ecosystem. It replaces keyword-matching resumes with structured technical evaluations, verified skill taxonomies, and high-signal matching pipelines for engineering teams. Tagline: 'YOUR NEXT OPPORTUNITY AWAITS'.",
    dimensions: ["AI / Machine Learning", "NLP Evaluation", "Skill Verification", "Product Architecture", "Pipelines"],
    highlights: [
      "Architecting multi-stage candidate assessment flows using NLP to evaluate technical comprehension and code quality.",
      "Designed skill verification models mapping real-world engineering artifacts into verified competency graphs.",
      "Building precision talent matching engines connecting verified high-signal developers with prospective engineering teams.",
      "Leading customer discovery with technical recruiters, engineering leaders, and software candidates."
    ],
    links: [
      { label: "Visit getnextin.mrig.tech ↗", url: "https://getnextin.mrig.tech", internal: false },
      { label: "Architecture Case Study", url: "projects/mrig.html", internal: true }
    ]
  },
  {
    id: "rentro-product",
    index: "03",
    role: "Founder & Product Architect",
    organization: "Rentro",
    parentEntity: "Product under MRIG",
    domain: "rentro.mrig.tech",
    period: "2026 — Present",
    location: "Bhopal, India & Regional Corridors",
    badge: "Asset Marketplace",
    badgeType: "amber",
    icon: "assets/rentro-icon.png",
    accentColor: "#f97316",
    headline: "Unlocking latent liquidity in commercial fleets, machinery, and equipment through trust-minimized marketplace infrastructure.",
    summary: "Rentro is the verified physical asset marketplace built under MRIG. It transforms idle machinery and mobility fleets into liquid yield through dynamic pricing, 16-angle condition verification, and collateralized escrow.",
    dimensions: ["Marketplace Architecture", "PostGIS Spatial Search", "Split Escrow", "Dynamic Pricing", "Redis Locks"],
    highlights: [
      "Formulated 16-angle digital condition inspection system with cryptographic timestamping for dispute-free handover verification.",
      "Designed Redis-backed distributed locking with 15-minute lease hold to prevent double-booking collisions during checkout.",
      "Implemented PostGIS ST_DWithin geospatial radius indexing for sub-50ms local asset discovery.",
      "Modeled marketplace unit economics targeting sustainable operator take-rates and split escrow settlements."
    ],
    links: [
      { label: "Visit rentro.mrig.tech ↗", url: "https://rentro.mrig.tech", internal: false },
      { label: "Ecosystem Case Study", url: "projects/mrig.html", internal: true }
    ]
  },
  {
    id: "crypticard-core",
    index: "04",
    role: "Founder & CEO",
    organization: "Crypticard",
    entityType: "Web3 Startup / Protocol",
    domain: "crypticard.tech",
    period: "2024 — 2026",
    location: "Hybrid / Remote",
    badge: "Web3 Protocol",
    badgeType: "emerald",
    icon: "assets/crypticard-icon.png",
    accentColor: "#10b981",
    headline: "Pioneering self-sovereign cryptographic digital identity, verifiable credentials, and privacy-preserving reputation.",
    summary: "Crypticard researched and architected a decentralized identity protocol enabling users to own their cross-chain credentials, KYC attestations, and verifiable reputation metrics without centralized custodian lock-in. Tagline: 'SPEND • EARN • OWN'.",
    dimensions: ["Decentralized Identity", "Verifiable Credentials", "Zero-Knowledge Proofs", "Tokenomics", "Multi-Chain EVM/Solana"],
    highlights: [
      "Formulated core DID architecture, selective disclosure ZK schemas, and multi-chain identity anchoring.",
      "Designed comprehensive multi-year technical roadmap, governance model, and protocol token economics.",
      "Conducted developer validation interviews across Web3 ecosystems to refine credential interoperability.",
      "Spearheaded technical architecture presentations and early ecosystem alignment discussions."
    ],
    links: [
      { label: "Crypticard Protocol Case Study ↗", url: "projects/crypticard.html", internal: true }
    ]
  },
  {
    id: "koii-leadership",
    index: "05",
    role: "India Lead, Business Development",
    organization: "Koii Network",
    entityType: "Decentralized Compute Protocol",
    domain: "koii.network",
    period: "2024 — 2025",
    location: "Remote / Global",
    badge: "Ecosystem Leadership",
    badgeType: "cyan",
    icon: "assets/koii-logo.png",
    accentColor: "#3b82f6",
    headline: "Scaling decentralized computing node adoption and developer ecosystems across the Indian subcontinent.",
    summary: "Expanded regional adoption and node operator network for Koii Network's high-throughput decentralized computing protocol, bridging grassroots builders with scalable compute infrastructure.",
    dimensions: ["Community Architecture (2,500+)", "Developer Relations", "Node Acquisition", "Hackathon Operations", "Strategic BD"],
    highlights: [
      "Built, moderated, and scaled an active 2,500+ developer and node operator community across Discord, Telegram, and X.",
      "Spearheaded localized node acquisition campaigns driving substantial regional compute capacity onboarding.",
      "Established strategic relationships with university tech chapters, Web3 builder clubs, and startup incubators.",
      "Organized and technically facilitated hackathon tracks, builder workshops, and node onboarding sessions."
    ],
    links: [
      { label: "Visit koii.network ↗", url: "https://koii.network", internal: false }
    ]
  },
  {
    id: "victus-research",
    index: "06",
    role: "Business Development & Research Analyst",
    organization: "Victus Global",
    entityType: "Web3 Venture & Advisory",
    domain: "victusglobal.com",
    period: "2024 / 2025",
    location: "Remote",
    badge: "Venture Analytics",
    badgeType: "emerald",
    icon: "assets/victus-logo.png",
    accentColor: "#05d69e",
    headline: "Conducting protocol due diligence, token economic evaluations, and decentralized market intelligence.",
    summary: "Analyzed early-stage decentralized protocol architectures, token distribution schedules, and liquidity dynamics to inform strategic ecosystem evaluations.",
    dimensions: ["Tokenomics Modeling", "Protocol Due Diligence", "Market Intelligence", "Venture Analytics"],
    highlights: [
      "Evaluated protocol mechanics, smart contract parameters, emission curves, and economic vulnerability vectors.",
      "Authored rigorous due diligence briefings and market mapping reports for syndicate partners.",
      "Supported ecosystem outreach and partnership research across global Web3 accelerators."
    ],
    links: [
      { label: "Visit victusglobal.com ↗", url: "https://victusglobal.com", internal: false }
    ]
  }
];

const COMMUNITY_DATA = [
  {
    id: "unfold-23",
    name: "Unfold 2023 Hackathon",
    role: "Track Bounty Winner",
    period: "2023",
    badge: "Hackathon Winner",
    desc: "Won competitive track bounty by architecting and presenting novel Web3 application prototypes under rigorous hackathon time constraints."
  },
  {
    id: "dgi",
    name: "Decentralized Guild India",
    role: "Core Member & Ecosystem Contributor",
    period: "2024 — 2025",
    badge: "Builder Guild",
    desc: "Active contributor driving grassroots Web3 developer adoption, mentoring engineers transitioning to decentralized systems, and organizing technical community meetups."
  },
  {
    id: "hackathons-global",
    name: "ETHGlobal, IBW & Web3 Summits",
    role: "Technical Facilitator & Ecosystem Contributor",
    period: "2024 — 2025",
    badge: "Global Summits",
    desc: "Facilitated participant technical onboarding, track navigation, and ecosystem networking at premier international blockchain hackathons including ETHGlobal and India Blockchain Week."
  }
];

if (typeof window !== 'undefined') {
  window.HQ_DATA = window.HQ_DATA || {};
  window.HQ_DATA.experience = EXPERIENCE_DATA;
  window.HQ_DATA.community = COMMUNITY_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EXPERIENCE_DATA, COMMUNITY_DATA };
}
