/**
 * ============================================================================
 * PROJECTS DATA MODULE — Mayank Yadav Founder Digital HQ
 * ============================================================================
 */
const PROJECTS_DATA = [
  {
    id: "mrig",
    name: "MRIG",
    featured: true,
    role: "Founder & CEO",
    year: "2026 — Present",
    stage: "Active Startup / Building",
    category: "Physical Asset Marketplace & AI Infrastructure",
    tagline: "The Amazon of Physical Assets",
    oneLiner: "Pioneering the lifecycle infrastructure for underutilized real-world physical assets and AI-powered workforce intelligence.",
    summary: "MRIG is a multi-tier technology ecosystem addressing capital inefficiency and asset illiquidity. Through flagship products Rentro (physical asset marketplace) and GetNextIn (AI career ecosystem), MRIG unlocks latent economic potential across consumer and enterprise markets.",
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
        title: "Physical Asset Marketplace Lifecycle",
        desc: "A unified platform to rent, buy, sell, finance, and insure underutilized physical assets with trust-minimized escrow and dynamic verification.",
        workflow: ["Asset Intake", "Verification", "Smart Escrow", "Dynamic Rental / Trade", "Insurance Layer", "Settlement"]
      },
      {
        name: "GetNextIn",
        domain: "getnextin.mrig.tech",
        title: "AI-Powered Career & Recruitment Ecosystem",
        desc: "Intelligent hiring infrastructure combining AI screening, verified credential evaluation, interview automation, and precision talent matching.",
        workflow: ["Candidate Profile", "AI Skill Assessment", "Algorithmic Match", "Simulated Interview", "Verification", "Direct Onboarding"]
      }
    ],
    techStack: [
      "AI/ML Pipelines",
      "Dynamic Pricing Algorithms",
      "Smart Contract Escrow",
      "Asset Lifecycle Graph",
      "Identity Verification",
      "Distributed Cloud"
    ],
    deepSections: {
      origin: "Modern economies suffer from massive capital lockup: trillions of dollars in high-utility physical machinery, vehicles, equipment, and consumer hardware sit idle over 80% of their operational lifespan. MRIG was founded to unlock this trapped capital.",
      problem: "Fragmented rental markets, lack of standardized asset insurance, untrusted P2P escrow, high friction in asset financing, and opaque verification systems prevent physical assets from achieving fluid transactional velocity.",
      solution: "A full-stack ecosystem offering end-to-end asset lifecycle governance: onboarding verification, dynamic algorithmic pricing, collateralized escrow, micro-insurance underwriting, and frictionless liquidity channels.",
      marketplaceModel: "Multi-sided network facilitating P2P and B2B asset transactions. Suppliers earn recurring yield on owned inventory while demand-side participants gain flexible on-demand access without capex burdens.",
      businessModel: "Commission on successful transactions, value-added financing & insurance brokerage, premium enterprise inventory management APIs, and institutional verification fees.",
      roadmap: [
        { phase: "Phase 1: Architecture & Validation", milestone: "Completed in-depth market interviews, user journey mapping, and core MVP workflow definition." },
        { phase: "Phase 2: Pilot Deployment", milestone: "Targeted rollout of Rentro marketplace beta and GetNextIn candidate assessment modules across priority metropolitan nodes." },
        { phase: "Phase 3: Liquidity & Financial Layer", milestone: "Integration of real-world asset financing, automated damage insurance protocols, and multi-asset cross-border settlement." },
        { phase: "Phase 4: Global Physical Asset Network", milestone: "Scaling into an open physical asset protocol powering enterprise supply chains and sovereign sharing economies." }
      ]
    }
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
