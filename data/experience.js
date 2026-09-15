/**
 * ============================================================================
 * EXPERIENCE DATA MODULE — Mayank Yadav Founder Digital HQ
 * ============================================================================
 */
const EXPERIENCE_DATA = [
  {
    id: "mrig-founder",
    role: "Founder & Chief Executive Officer",
    organization: "MRIG",
    domain: "mrig.tech",
    period: "2026 — Present",
    location: "Bhopal, India & Global",
    type: "Full-Time / Venture Leadership",
    badge: "Active Startup",
    summary: "Architecting the foundational platform for physical asset monetization and AI-driven human capital infrastructure.",
    highlights: [
      "Conceptualized and spearheading Rentro ('Amazon of Physical Assets') and GetNextIn (AI Recruitment Ecosystem).",
      "Directing comprehensive product strategy, unit economics validation, and multi-sided marketplace architecture.",
      "Conducting extensive primary user research across consumers, fleet operators, enterprise asset managers, and hiring leads.",
      "Developing institutional partnership channels and long-term liquidity and underwriting protocols.",
      "Managing end-to-end technical product roadmaps and cross-functional operations."
    ],
    skills: ["Venture Leadership", "Product Architecture", "Marketplace Economics", "AI Integration", "GTM Strategy"]
  },
  {
    id: "crypticard-founder",
    role: "Founder & CEO",
    organization: "Crypticard",
    period: "2024 — 2026",
    location: "Hybrid / Remote",
    type: "Venture Leadership",
    badge: "Web3 Startup",
    summary: "Spearheaded the research, ideation, and strategic development of a decentralized identity and verifiable credential protocol.",
    highlights: [
      "Formulated core DID architecture, zero-knowledge credential schemas, and cross-chain identity framework.",
      "Orchestrated product ideation, market validation interviews with Web3 developers, and ecosystem positioning.",
      "Designed the comprehensive multi-year technical roadmap and tokenomics model.",
      "Initiated strategic alignment and partnership discussions across leading EVM and Layer-2 ecosystems."
    ],
    skills: ["Decentralized Identity", "Verifiable Credentials", "Zero-Knowledge Concepts", "Web3 Strategy", "Tokenomics"]
  },
  {
    id: "koii-bd",
    role: "India Lead — Business Development & Ecosystem Growth",
    organization: "Koii Network",
    period: "2024 — 2025",
    location: "Remote / Global",
    type: "Ecosystem Leadership",
    badge: "Decentralized Compute",
    summary: "Expanded regional adoption and node operator community across the Indian subcontinent for a high-throughput decentralized computing protocol.",
    highlights: [
      "Built, moderated, and scaled a 2,500+ active developer and node operator community across Discord, Telegram, and X.",
      "Spearheaded node user acquisition campaigns resulting in substantial regional computing capacity growth.",
      "Established strategic relationships with premier university technical chapters, Web3 developer guilds, and startup incubators.",
      "Represented and organized hackathon tracks, workshops, and technical onboarding sessions in major tech hubs.",
      "Collaborated directly with global core leadership on localized GTM and developer incentives."
    ],
    skills: ["Community Architecture (2500+)", "Node Acquisition", "Developer Relations", "Ecosystem Growth", "Hackathon Operations"]
  },
  {
    id: "victus-global",
    role: "Business Development & Web3 Research Analyst",
    organization: "Victus Global",
    period: "2024 — 2025",
    location: "Remote",
    type: "Research & BD",
    badge: "Venture Analytics",
    summary: "Conducted fundamental due diligence, token economic evaluations, and strategic market mapping for emerging decentralized protocols.",
    highlights: [
      "Analyzed early-stage protocol architectures, token distribution schedules, and liquidity models.",
      "Authored due diligence summaries and technical risk assessments for venture evaluation.",
      "Supported outreach and syndicate relationship management across global Web3 accelerators."
    ],
    skills: ["Tokenomics Analysis", "Protocol Due Diligence", "Market Intelligence", "Venture Research"]
  }
];

const COMMUNITY_DATA = [
  {
    id: "dgi",
    name: "Decentralized Guild India",
    role: "Core Member & Ecosystem Contributor",
    period: "2024 — 2025",
    desc: "Active leadership contributor driving grassroots Web3 developer adoption, mentoring engineers making the transition from Web2 to decentralized systems, and organizing technical community events across India."
  },
  {
    id: "hackathons-events",
    name: "ETHGlobal, IBW, W3C & Web3 Summits",
    role: "Ecosystem Contributor & Technical Facilitator",
    period: "2024 — 2025",
    desc: "Facilitated participant onboarding, technical track navigation, and ecosystem networking at premier international blockchain hackathons and conferences including ETHGlobal and India Blockchain Week (IBW)."
  },
  {
    id: "unfold-bounty",
    name: "Unfold 2023 Hackathon",
    role: "Bounty Winner",
    period: "2023",
    desc: "Won competitive track bounty by architecting and presenting novel Web3 application prototypes under rigorous hackathon time constraints."
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
