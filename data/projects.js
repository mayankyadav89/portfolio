/**
 * ============================================================================
 * PROJECTS DATA MODULE — Mayank Yadav Founder Digital HQ
 * ============================================================================
 */
const PROJECTS_DATA = [
  {
    id: "rentro",
    name: "Rentro",
    featured: true,
    role: "Founder & Product Architect",
    year: "2026 — Present",
    stage: "Actively Building / MVP Staging",
    category: "Physical Asset Marketplace (Product under MRIG)",
    tagline: "Rent Anything. Earn Anytime",
    oneLiner: "Physical asset marketplace transforming underutilized mobility, commercial fleets, and equipment into liquid yield.",
    summary: "Rentro is the verified physical asset marketplace built under parent company MRIG. Starting with mobility fleets in commercial corridors before expanding to machinery, Rentro provides 16-angle condition verification, dynamic pricing, and escrow settlements.",
    parentEcosystem: "MRIG Ecosystem",
    links: {
      website: "https://rentro.mrig.tech",
      caseStudy: "projects/mrig.html",
      github: "https://github.com/mayankyadav89"
    },
    techStack: [
      "Next.js 15",
      "PostGIS Radius Search",
      "Redis Distributed Locks (15-min TTL)",
      "16-Angle Handover Engine",
      "Razorpay Split Escrow",
      "DigiLocker KYC"
    ]
  },
  {
    id: "getnextin",
    name: "GetNextIn",
    featured: true,
    role: "Founder & Product Architect",
    year: "2026 — Present",
    stage: "Building / Staging",
    category: "AI Career & Skill Platform (Product under MRIG)",
    tagline: "AI-Powered Technical Assessment & Talent Matching",
    oneLiner: "Intelligent career infrastructure combining automated technical screening, skill verification, and precision workforce pipelines.",
    summary: "GetNextIn is an AI-driven recruitment and candidate skill assessment platform incubated under MRIG Ecosystem. It automates technical evaluations, portfolio validation, and precision talent matching for engineering teams.",
    parentEcosystem: "MRIG Ecosystem",
    links: {
      website: "https://getnextin.mrig.tech",
      caseStudy: "projects/mrig.html",
      github: "https://github.com/mayankyadav89"
    },
    techStack: [
      "AI Screening Pipeline",
      "Skill Verification Models",
      "NLP Evaluation Engine",
      "Precision Matching Engine"
    ]
  },
  {
    id: "mrig",
    name: "MRIG Ecosystem",
    featured: false,
    role: "Founder & CEO",
    year: "2026 — Present",
    stage: "Parent Ecosystem Entity",
    category: "Parent Company & Asset Infrastructure",
    tagline: "Parent Company housing Rentro & GetNextIn",
    oneLiner: "Parent entity and shared architecture housing physical asset marketplace Rentro and AI platform GetNextIn.",
    summary: "MRIG is the parent company and ecosystem entity that incubates and houses specialized venture products: Rentro (physical asset marketplace) and GetNextIn (AI career engine).",
    links: {
      caseStudy: "projects/mrig.html",
      website: "https://rentro.mrig.tech",
      portalAlt: "https://getnextin.mrig.tech",
      github: "https://github.com/mayankyadav89"
    },
    subProducts: [
      {
        name: "Rentro",
        domain: "rentro.mrig.tech",
        title: "Physical Asset Marketplace",
        desc: "A unified platform to rent and monetize underutilized physical assets with trust-minimized escrow and dynamic condition verification."
      },
      {
        name: "GetNextIn",
        domain: "getnextin.mrig.tech",
        title: "AI Career & Recruitment Platform",
        desc: "Intelligent hiring infrastructure combining AI screening, verified credential evaluation, and precision talent matching."
      }
    ],
    techStack: [
      "Parent Ecosystem Architecture",
      "Asset Infrastructure",
      "Multi-Product Venture Model"
    ]
  },
  {
    id: "crypticard",
    name: "Crypticard",
    featured: true,
    role: "Founder & CEO",
    year: "2024 — 2026",
    stage: "Early-Stage Concept / R&D",
    category: "Decentralized Digital Identity & Verifiable Credentials",
    tagline: "Self-Sovereign Identity for the Web3 Era",
    oneLiner: "Decentralized identity protocol allowing users to cryptographically verify credentials and reputations without centralized custody.",
    summary: "Crypticard engineered a unified cryptographic passport empowering users to own their cross-chain credentials, KYC attestations, and verifiable reputation metrics without surrendering privacy.",
    links: {
      caseStudy: "projects/crypticard.html",
      github: "https://github.com/mayankyadav89"
    },
    techStack: [
      "Decentralized Identifiers (DIDs)",
      "Verifiable Credentials (VCs)",
      "Zero-Knowledge Proofs",
      "EVM & Solana Compatibility",
      "Solidity",
      "IPFS"
    ],
    features: [
      "Self-sovereign cryptographic key management with zero central honeypots",
      "Composable on-chain identity schema compatible with multi-chain dApps",
      "Privacy-preserving age & jurisdiction verification via selective disclosure",
      "Sybil-resistant reputation scoring for DAOs and Web3 ecosystems"
    ]
  },
  {
    id: "svg-aegisvault",
    name: "SVG AegisVault",
    featured: true,
    role: "Architect & Lead Developer",
    year: "2024 — 2025",
    stage: "Experimental Smart Wallet",
    category: "Account Abstraction & Web3 Security",
    tagline: "ERC-4337 Hybrid Smart Account with Passkey Auth",
    oneLiner: "Experimental hybrid smart account exploring passkey-based WebAuthn authentication, ERC-4337 bundlers, and gas sponsorship on Base Sepolia.",
    summary: "SVG AegisVault represents a deep exploration into ERC-4337 account abstraction. It removes seed-phrase vulnerabilities by marrying secure hardware enclaves (TouchID/FaceID) with programmable smart accounts.",
    links: {
      caseStudy: "projects/svg-aegisvault.html",
      github: "https://github.com/mayankyadav89/svg-aegisvault"
    },
    techStack: [
      "ERC-4337 Account Abstraction",
      "WebAuthn / Passkeys",
      "Solidity Smart Contracts",
      "Base Sepolia Network",
      "Paymaster Gas Sponsorship",
      "UserOperation Bundling"
    ],
    features: [
      "Seedless onboarding via device-native biometric WebAuthn credentials",
      "Paymaster architecture enabling sponsored gasless transactions",
      "Modular session keys for pre-approved micro-transactions",
      "Multi-signature social recovery modules eliminating single-point account loss"
    ]
  },
  {
    id: "ecoties",
    name: "Ecoties",
    featured: false,
    role: "Founder & Ideator",
    year: "2023 — 2024",
    stage: "Idea & Strategic Concept",
    category: "Green Tech & Sustainability Ledger",
    tagline: "Verifiable Environmental Impact Infrastructure",
    oneLiner: "Conceptual platform exploring transparent ecological impact tracking, green bond tokenization, and circular economy incentives.",
    summary: "Ecoties emerged as a strategic investigation into how decentralized ledgers can verify sustainability claims, prevent greenwashing, and tokenize localized environmental initiatives.",
    links: {
      caseStudy: "projects/ecoties.html",
      github: "https://github.com/mayankyadav89"
    },
    techStack: [
      "Carbon Credit Tokenization",
      "IoT Verification Feeds",
      "Circular Economy Incentives",
      "Transparent Ledger"
    ],
    features: [
      "Immutable auditing for sustainability and carbon offset claims",
      "Incentive structures for community-level green initiatives",
      "Data ingestion frameworks for IoT environmental sensor validation"
    ]
  }
];

if (typeof window !== 'undefined') {
  window.HQ_DATA = window.HQ_DATA || {};
  window.HQ_DATA.projects = PROJECTS_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PROJECTS_DATA;
}
