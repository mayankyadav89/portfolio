/**
 * ============================================================================
 * PROFILE DATA MODULE — Mayank Yadav Founder Digital HQ
 * ============================================================================
 */
const PROFILE_DATA = {
  identity: {
    name: "Mayank Yadav",
    shortName: "MY",
    handle: "mayankyadav89",
    domain: "itsmayank.me",
    title: "Founder & Product Architect",
    tagline: "Building at the intersection of AI, Web3 & Physical Asset Infrastructure",
    subtitle: "Founder & CEO at MRIG (Rentro & GetNextIn) & Crypticard. Turning frontier technologies into scalable real-world operating systems.",
    location: "Bhopal, Madhya Pradesh, India",
    status: {
      text: "Building the Amazon of Physical Assets & AI Career Infrastructure",
      active: true,
      venture: "MRIG",
      subVentures: ["Rentro", "GetNextIn"],
      mode: "Active Builder"
    },
    metrics: [
      { label: "Active Ventures", value: "2", sub: "MRIG & Crypticard" },
      { label: "Web3 Community Built", value: "2,500+", sub: "Discord, X & Telegram" },
      { label: "Hackathon Bounties", value: "Unfold '23", sub: "Top Technical Track" },
      { label: "Engineering Spec", value: "AI & ML", sub: "B.Tech CSE UIT RGPV" }
    ]
  },
  bio: {
    lead: "Mayank Yadav is a technology founder and computer science engineer dedicated to architecting systems that unlock economic utility through emerging technology.",
    story: [
      "Operating at the convergence of Artificial Intelligence, Machine Learning, and Web3 architectures, Mayank designs products that bridge digital infrastructure with physical economies.",
      "As Founder & CEO of MRIG, he is pioneering the physical asset marketplace model with Rentro (unlocking underutilized physical assets) and GetNextIn (AI-driven recruitment and skill verification ecosystem).",
      "Previously, Mayank founded Crypticard (decentralized digital identity), led India Business Development for Koii Network scaling user adoption, and researched tokenomics and due diligence with Victus Global."
    ],
    principles: [
      {
        title: "Systems Over Gimmicks",
        desc: "Build durable, real-world utility. Technology must solve tangible friction points rather than chasing speculative hype."
      },
      {
        title: "Frontier Integration",
        desc: "Leverage the compounding synergy of Artificial Intelligence and decentralized ledgers to create transparent, trust-minimized ecosystems."
      },
      {
        title: "Execution Rigor",
        desc: "Bridge vision and reality through meticulous product architecture, customer validation, and relentless iteration."
      },
      {
        title: "Ecosystem Stewardship",
        desc: "Cultivate high-signal developer and builder communities that foster open collaboration and permissionless innovation."
      }
    ]
  },
  education: {
    degree: "Bachelor of Technology — Computer Science & Engineering",
    specialization: "Artificial Intelligence & Machine Learning",
    institution: "University Institute of Technology, RGPV (Bhopal, India)",
    period: "2021 — 2026",
    cgpa: "6.69 / 10",
    coursework: [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Operating Systems",
      "Computer Networks",
      "Applied Statistics & Probability"
    ]
  },
  certifications: [
    {
      title: "IBM Certified Developer — Cognos 10 BI Data Warehouses",
      issuer: "Cognitive Class / IBM",
      date: "January 2024",
      skills: ["Data Warehousing", "Business Intelligence", "Analytics Architecture"]
    }
  ],
  writings: {
    status: "Currently Writing & Publishing",
    focus: "Explorations on decentralized systems, physical asset liquidity, AI agent workflows, and startup mental models.",
    currentDraft: "The Liquidity of Things: How Decentralized Infrastructure Powers Physical Asset Marketplaces"
  }
};

if (typeof window !== 'undefined') {
  window.HQ_DATA = window.HQ_DATA || {};
  window.HQ_DATA.profile = PROFILE_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PROFILE_DATA;
}
