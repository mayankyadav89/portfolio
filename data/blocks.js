/**
 * ============================================================================
 * BLOCKCHAIN LIVING LEDGER & 3D SPATIAL GALAXY DATA MODULE
 * Mayank Yadav Founder Digital Headquarters
 * ============================================================================
 * Structured milestone data for the 3D WebGL Blockchain Universe & Cryptographic HUD.
 * Coordinates (x, y, z) define the cinematic spatial constellation in 3D space.
 */
const BLOCKS_DATA = [
  {
    blockNumber: "000",
    blockId: "BLOCK-000",
    name: "Genesis Core",
    category: "Founder Identity",
    type: "GENESIS",
    title: "Mayank Yadav — Founder Genesis Core",
    subtitle: "Technology Founder & Product Architect",
    timestamp: "2021 — Active",
    hash: "0x8f3c7a92b01e4d58a1c3e7f2b904d6a8e1b5c3a7f920d4e6c8a1b3e5f7a9c2d1",
    previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    merkleRoot: "0x4e7a892b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f",
    nonce: 1048576,
    difficulty: "Foundational",
    status: "Verified Identity Core",
    badgeColor: "violet",
    colorHex: 0xa78bfa,
    position3D: { x: -28, y: 4, z: -2 },
    shape: "hologram_core",
    summary: "Operating at the convergence of Artificial Intelligence, Web3 architectures, and physical asset infrastructure. Founder & CEO of MRIG Ecosystem (Rentro & GetNextIn) and Crypticard.",
    technologies: ["AI/ML Systems", "Web3 Architectures", "Physical Asset Infrastructure", "Startup Strategy", "Distributed Systems"],
    founderIdentity: {
      role: "Founder & Product Architect",
      focus: "AI, Web3, Physical Asset Infrastructure, Startups",
      image: null,
      ens: "Maayankyadav.base.eth",
      ensUrl: "https://basescan.org/name/Maayankyadav.base.eth",
      evm: "0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e",
      solana: "EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX",
      bitcoin: "Bc1pe5f0hrr0er7gd3zha0wknlw45x5mu4y5mzw87clqzjprg0mtfp0qh9y2dq",
      devfolio: "https://devfolio.co/@Mayankyadav"
    },
    metrics: {
      role: "Founder & CEO",
      ventures: "MRIG & Crypticard",
      community: "2,500+ Web3 Builders",
      accolades: "Unfold '23 Winner"
    },
    transactions: [
      "Genesis digital identity and founder operating baseline initiated",
      "Specialized in AI/ML & distributed system design",
      "Founded MRIG Ecosystem (Rentro & GetNextIn) & Crypticard"
    ],
    connections: ["BLOCK-001", "BLOCK-002", "BLOCK-004"],
    links: {
      caseStudy: "about.html",
      actionText: "Explore Founder Dossier →"
    }
  },
  {
    blockNumber: "001",
    blockId: "BLOCK-001",
    name: "Engineering Foundation",
    category: "Academic & Tech Foundation",
    type: "FOUNDATION",
    title: "AI & Computer Science Engineering",
    subtitle: "B.Tech CSE AI/ML — UIT RGPV",
    timestamp: "2021 — 2026",
    hash: "0x1a8f3c7e92b01d4a58a1c3e7f2b904d6a8e1b5c3a7f920d4e6c8a1b3e5f7a9c2",
    previousHash: "0x8f3c7a92b01e4d58a1c3e7f2b904d6a8e1b5c3a7f920d4e6c8a1b3e5f7a9c2d1",
    merkleRoot: "0x6f1c2d3e4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d",
    nonce: 1948203,
    difficulty: "Academic Standard",
    status: "Verified Academic",
    badgeColor: "cyan",
    colorHex: 0x38bdf8,
    position3D: { x: -16, y: 20, z: -10 },
    shape: "crystal_cube",
    summary: "B.Tech in Computer Science & Engineering with formal specialization in Artificial Intelligence & Machine Learning at UIT RGPV. IBM Certified Developer — Cognos 10 BI Data Warehouses.",
    technologies: ["AI/ML Algorithms", "Neural Networks", "Data Structures & Algorithms", "Python", "Database Architecture"],
    metrics: {
      institution: "UIT RGPV (Bhopal, India)",
      specialization: "AI & Machine Learning",
      certification: "IBM Cognos BI Developer",
      stage: "Core Engineering Foundation"
    },
    transactions: [
      "Rigorous study in Artificial Intelligence, ML, neural models, and algorithms",
      "Completed IBM Cognos BI data warehousing certification",
      "Engineered foundational backend and data processing pipelines"
    ],
    connections: ["BLOCK-000", "BLOCK-002"],
    links: {
      caseStudy: "about.html",
      actionText: "View Academic Background →"
    }
  },
  {
    blockNumber: "002",
    blockId: "BLOCK-002",
    name: "Web3 Ecosystem",
    category: "Ecosystem Growth & Accolades",
    type: "ECOSYSTEM",
    title: "Koii Network India Lead & Hackathon Bounty",
    subtitle: "2,500+ Community Builder & Unfold '23 Winner",
    timestamp: "2023 — 2025",
    hash: "0x5e7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a",
    previousHash: "0x1a8f3c7e92b01d4a58a1c3e7f2b904d6a8e1b5c3a7f920d4e6c8a1b3e5f7a9c2",
    merkleRoot: "0x2c4e6a8b0d1f3e5a7c9b1d3f5e7a9c1b3d5f7e9a1c3b5d7f9e1a3c5b7d9f1e3a",
    nonce: 3810492,
    difficulty: "Competitive",
    status: "Verified Track Record",
    badgeColor: "amber",
    colorHex: 0xfbbf24,
    position3D: { x: -4, y: 10, z: -18 },
    shape: "network_node",
    summary: "Led India Business Development for Koii Network, scaling an active 2,500+ developer and node operator community. Awarded official track bounty at Unfold '23 Hackathon. Conducted due diligence at Victus Global.",
    technologies: ["Compute Nodes", "Community Architecture", "Developer Relations", "Due Diligence", "Solidity"],
    metrics: {
      role: "India Lead — BD (Koii)",
      community: "2,500+ Members (Discord/X/TG)",
      hackathon: "Unfold '23 Bounty Winner",
      stage: "Ecosystem Leadership"
    },
    transactions: [
      "Scaled 2,500+ member developer community across Discord, Telegram & X",
      "Won competitive smart contract track bounty at Unfold '23 Hackathon",
      "Conducted protocol due diligence and tokenomics research at Victus Global"
    ],
    connections: ["BLOCK-001", "BLOCK-003", "BLOCK-004"],
    links: {
      caseStudy: "experience.html",
      actionText: "Inspect Leadership Track Record →"
    }
  },
  {
    blockNumber: "003",
    blockId: "BLOCK-003",
    name: "Crypticard",
    category: "Decentralized Identity Protocol",
    type: "IDENTITY_PROTOCOL",
    title: "Crypticard: Self-Sovereign Identity",
    subtitle: "W3C DID & Verifiable Credentials",
    timestamp: "2024 — 2026",
    hash: "0x3a9f1b2c4d6e8f0a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a",
    previousHash: "0x5e7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a",
    merkleRoot: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    nonce: 2491028,
    difficulty: "Startup R&D",
    status: "Early-Stage Concept / R&D",
    badgeColor: "emerald",
    colorHex: 0x34d399,
    position3D: { x: 8, y: 19, z: -8 },
    shape: "identity_prism",
    summary: "Founded Crypticard as CEO. Designed self-sovereign digital identity credential schemas, Soulbound attestations, zero-knowledge verification frameworks, and conducted 40+ user interviews with Web3 developers.",
    technologies: ["W3C DIDs", "Verifiable Credentials", "Zero-Knowledge Proofs", "Solidity", "IPFS", "EVM"],
    metrics: {
      role: "Founder & CEO",
      validation: "40+ Web3 Developer Interviews",
      architecture: "W3C DID & VC Framework",
      stage: "Concept Validation & Architecture"
    },
    transactions: [
      "Architected decentralized identity schemas & selective disclosure models",
      "Conducted 40+ interviews with Web3 developers & DAO contributors",
      "Created tokenless reputation and verifiable credential specifications"
    ],
    connections: ["BLOCK-002", "BLOCK-004"],
    links: {
      caseStudy: "projects/crypticard.html",
      actionText: "Read Crypticard Case Study →",
      github: "https://github.com/mayankyadav89"
    }
  },
  {
    blockNumber: "004",
    blockId: "BLOCK-004",
    name: "MRIG Ecosystem",
    category: "Parent Ecosystem Entity",
    type: "PARENT_ENTITY",
    title: "MRIG Ecosystem (Parent Entity)",
    subtitle: "Parent Company & Ecosystem Entity",
    timestamp: "2026 — Present",
    hash: "0x9c3d5e7f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f1a3b5c7d",
    previousHash: "0x3a9f1b2c4d6e8f0a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a",
    merkleRoot: "0x1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e",
    nonce: 5829104,
    difficulty: "Ecosystem Core",
    status: "Parent Ecosystem Entity",
    badgeColor: "amber",
    colorHex: 0xf59e0b,
    position3D: { x: 4, y: -4, z: -4 },
    shape: "parent_nexus",
    summary: "MRIG is the parent company and ecosystem entity housing physical asset marketplace Rentro (rentro.mrig.tech) and AI career platform GetNextIn (getnextin.mrig.tech).",
    technologies: ["Parent Ecosystem Architecture", "Asset Infrastructure", "Multi-Product Venture Model"],
    metrics: {
      role: "Founder & CEO",
      entityType: "Parent Holding & Ecosystem",
      incubatedProducts: "Rentro & GetNextIn",
      stage: "Parent Entity"
    },
    transactions: [
      "Formulated MRIG parent ecosystem structure",
      "Incubated Rentro (physical asset marketplace) and GetNextIn (AI career engine)",
      "Established shared architectural standards across child ventures"
    ],
    connections: ["BLOCK-000", "BLOCK-005", "BLOCK-006"],
    links: {
      caseStudy: "projects/mrig.html",
      actionText: "Inspect MRIG Ecosystem Architecture →",
      external: "https://rentro.mrig.tech"
    }
  },
  {
    blockNumber: "005",
    blockId: "BLOCK-005",
    name: "Rentro",
    category: "Physical Asset Marketplace",
    type: "PRODUCT_MARKETPLACE",
    title: "Rentro by MRIG: Physical Asset Marketplace",
    subtitle: "Product under MRIG — 'Rent Anything. Earn Anytime'",
    timestamp: "2026 — Present",
    hash: "0x2e4f6a8c0e2b4d6f8a0c2e4f6a8c0e2b4d6f8a0c2e4f6a8c0e2b4d6f8a0c2e4f",
    previousHash: "0x9c3d5e7f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f1a3b5c7d",
    merkleRoot: "0x7a9c1e3f5b7d9f1a3c5e7a9c1e3f5b7d9f1a3c5e7a9c1e3f5b7d9f1a3c5e7a9c",
    nonce: 6492019,
    difficulty: "Marketplace Execution",
    status: "Actively Building / MVP Staging",
    badgeColor: "violet",
    colorHex: 0xa855f7,
    parentEcosystem: "MRIG Ecosystem",
    position3D: { x: 22, y: -10, z: 10 },
    shape: "marketplace_cube",
    summary: "Rentro is MRIG's verified physical asset marketplace starting with high-demand mobility and commercial transport fleets before expanding to machinery, construction, and agricultural equipment. Tagline: 'Rent Anything. Earn Anytime'.",
    technologies: ["Next.js 15", "PostGIS Radius Search", "Redis Locks (15-min TTL)", "16-Angle Handover Engine", "Razorpay Split Escrow", "DigiLocker KYC"],
    metrics: {
      role: "Founder & CEO",
      unitEconomics: "21.4% Net CM1 per 3-Day Commercial Booking",
      corridor: "Indore — Bhopal — Ujjain Commercial Corridor",
      primaryUrl: "https://rentro.mrig.tech",
      stage: "MVP Production Staging"
    },
    transactions: [
      "Engineered 16-angle timestamped, GPS-watermarked photo handover protocol",
      "Architected PostgreSQL polymorphic JSONB/EAV schema for commercial fleets",
      "Designed concurrency-safe Redis distributed booking locks with 15-min TTL",
      "Integrated Razorpay / Cashfree split escrow with instant pre-auth deposit release"
    ],
    connections: ["BLOCK-004", "BLOCK-007"],
    links: {
      caseStudy: "projects/mrig.html",
      actionText: "View Rentro Case Study →",
      external: "https://rentro.mrig.tech",
      externalLabel: "Launch Rentro Portal (rentro.mrig.tech) ↗"
    }
  },
  {
    blockNumber: "006",
    blockId: "BLOCK-006",
    name: "GetNextIn",
    category: "AI Career & Skill Platform",
    type: "AI_PLATFORM",
    title: "GetNextIn: AI Career & Skill Engine",
    subtitle: "AI Platform under MRIG",
    timestamp: "2026 — Present",
    hash: "0x4b6d8f0a2c4e6a8c0e2b4d6f8a0c2e4f6a8c0e2b4d6f8a0c2e4f6a8c0e2b4d6f",
    previousHash: "0x9c3d5e7f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f1a3b5c7d",
    merkleRoot: "0x5c7e9a1b3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a",
    nonce: 7920148,
    difficulty: "AI System Architecture",
    status: "Building / Staging",
    badgeColor: "cyan",
    colorHex: 0x06b6d4,
    parentEcosystem: "MRIG Ecosystem",
    position3D: { x: 18, y: 9, z: -18 },
    shape: "ai_mesh",
    summary: "GetNextIn is an AI-powered recruitment and candidate skill assessment platform under MRIG. Automates technical evaluation, algorithmic matching, and precision workforce pipelines.",
    technologies: ["AI Screening Pipeline", "Skill Verification Models", "NLP Evaluation", "Precision Matching Engine"],
    metrics: {
      role: "Founder & CEO",
      parent: "MRIG Ecosystem",
      primaryUrl: "https://getnextin.mrig.tech",
      stage: "Active Product Staging"
    },
    transactions: [
      "Architected AI-driven candidate technical screening & verification workflows",
      "Engineered automated skill scoring and portfolio validation engine",
      "Connected precision talent matching pipelines to high-growth tech teams"
    ],
    connections: ["BLOCK-004", "BLOCK-007"],
    links: {
      caseStudy: "projects/mrig.html",
      actionText: "Explore MRIG Ecosystem Projects →",
      external: "https://getnextin.mrig.tech",
      externalLabel: "Launch GetNextIn Portal (getnextin.mrig.tech) ↗"
    }
  },
  {
    blockNumber: "007",
    blockId: "BLOCK-007",
    name: "SVG AegisVault",
    category: "Smart Account Protocol",
    type: "PROTOCOL_ACTIVE",
    title: "SVG AegisVault: ERC-4337 Smart Account",
    subtitle: "Passkey WebAuthn Hybrid Smart Account",
    timestamp: "2024 — 2025",
    hash: "0x7b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c",
    previousHash: "0x2e4f6a8c0e2b4d6f8a0c2e4f6a8c0e2b4d6f8a0c2e4f6a8c0e2b4d6f8a0c2e4f",
    merkleRoot: "0x8e1b3c5d7f9a1c3b5d7f9a1c3b5d7f9a1c3b5d7f9a1c3b5d7f9a1c3b5d7f9a1c",
    nonce: 4920184,
    difficulty: "EVM Account Abstraction",
    status: "Open Source / Base Sepolia",
    badgeColor: "emerald",
    colorHex: 0x10b981,
    position3D: { x: 36, y: -1, z: -2 },
    shape: "vault_polyhedron",
    summary: "Experimental hybrid smart account wallet on Base Sepolia. Implemented ERC-4337 Account Abstraction, Passkey (WebAuthn) hardware signature verification, Paymaster gas sponsorship, and modular session recovery.",
    technologies: ["ERC-4337", "WebAuthn / Passkeys", "Solidity", "Base Sepolia", "Paymasters", "Bundlers"],
    metrics: {
      repository: "github.com/mayankyadav89/svg-aegisvault",
      network: "Base Sepolia",
      authMethod: "Passkey WebAuthn (secp256r1)",
      stage: "Open Source Proof-of-Concept"
    },
    transactions: [
      "Deployed ERC-4337 smart account contracts on Base Sepolia",
      "Integrated WebAuthn biometric passkey authentication (secp256r1)",
      "Configured UserOperation bundling and Paymaster gasless execution"
    ],
    connections: ["BLOCK-005", "BLOCK-006", "BLOCK-HEAD"],
    links: {
      caseStudy: "projects/svg-aegisvault.html",
      actionText: "View Smart Account Architecture →",
      external: "https://github.com/mayankyadav89/svg-aegisvault"
    }
  },
  {
    blockNumber: "HEAD",
    blockId: "BLOCK-HEAD",
    name: "Active Head",
    category: "Living System & Frontier",
    type: "FOUNDER_HEAD",
    title: "Mayank Yadav — Active Founder State",
    subtitle: "Real-Time Founder Operating System",
    timestamp: "Real-Time / 2026",
    hash: "0x7f4e92a10c85b63d7e12f4890a3c572b89d41e6c38290fa5b4c192e873d61a4f",
    previousHash: "0x7b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c3d5f7a9b1c",
    merkleRoot: "0x3b5d7f9a1c3e5a7c9b1d3f5e7a9c1b3d5f7e9a1c3b5d7f9e1a3c5b7d9f1e3a5b",
    nonce: 9948201,
    difficulty: "Active Execution",
    status: "Active Head / Building",
    badgeColor: "emerald",
    colorHex: 0x34d399,
    position3D: { x: 46, y: -7, z: 6 },
    shape: "pulsing_singularity",
    summary: "Continuously executing at the intersection of AI, Web3, and real-world physical systems. Building products that unlock latent capital and bring economic utility to the frontier.",
    technologies: ["AI Systems", "Physical Asset Marketplaces", "ERC-4337", "Distributed Ledgers"],
    metrics: {
      status: "Actively Building",
      primaryFocus: "MRIG (Rentro & GetNextIn)",
      location: "Bhopal, MP, India",
      stage: "Founder Operating State"
    },
    transactions: [
      "Staging Rentro commercial fleet MVP corridor and GetNextIn screening engines",
      "Synthesizing next-gen Web3 & AI architectural frameworks",
      "Open to strategic founder collaborations & early seed discussions"
    ],
    connections: ["BLOCK-007"],
    links: {
      caseStudy: "contact.html",
      actionText: "Establish Direct Contact →"
    }
  }
];

if (typeof window !== 'undefined') {
  window.HQ_DATA = window.HQ_DATA || {};
  window.HQ_DATA.blocks = BLOCKS_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BLOCKS_DATA;
}
