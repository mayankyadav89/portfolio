/**
 * ============================================================================
 * SKILLS DATA MODULE — Mayank Yadav Founder Digital HQ
 * Verified Comprehensive Skill Taxonomy & Architectural Capabilities
 * ============================================================================
 */
const SKILLS_DATA = {
  categories: [
    {
      id: "engineering",
      index: "01",
      name: "Engineering & Systems",
      headline: "Core Computer Science & Distributed Systems",
      description: "Rigorous computational foundation built through B.Tech CSE (AI/ML) and hands-on system development.",
      skills: [
        {
          name: "Python",
          context: "Core language for ML modeling, data analysis, automation scripts, and backend algorithmic logic.",
          tags: ["Algorithms", "Data Science", "Backend"]
        },
        {
          name: "SQL & Relational Databases",
          context: "Schema design, relational normalization, spatial query optimization, and complex joins in PostgreSQL.",
          tags: ["PostgreSQL", "Database Architecture"]
        },
        {
          name: "Data Structures & Algorithms",
          context: "Optimization of memory access, time complexity bounds, graph traversals, and indexing architectures.",
          tags: ["Computer Science", "Optimization"]
        },
        {
          name: "API Architecture & Microservices",
          context: "RESTful endpoints, webhook event listeners, rate limiting, and asynchronous job queues.",
          tags: ["REST APIs", "System Design"]
        },
        {
          name: "Git & Version Control",
          context: "Branching strategies, CI/CD integrations, code review pipelines, and open-source collaboration.",
          tags: ["DevOps", "GitHub"]
        },
        {
          name: "Linux & Operating Environments",
          context: "Shell scripting, server environment configuration, process monitoring, and background daemon execution.",
          tags: ["Systems", "CLI"]
        }
      ]
    },
    {
      id: "ai-ml",
      index: "02",
      name: "AI & Machine Learning",
      headline: "Applied Machine Learning & Evaluation Pipelines",
      description: "Academic CSE specialization combined with practical production AI systems in GetNextIn.",
      skills: [
        {
          name: "AI Screening Pipelines",
          context: "Architecting automated candidate technical assessment flows and multi-stage evaluation loops in GetNextIn.",
          tags: ["GetNextIn", "Pipelines"]
        },
        {
          name: "NLP & Semantic Evaluation",
          context: "Natural language processing for structured resume parsing, code comprehension, and candidate score synthesis.",
          tags: ["NLP", "Evaluation"]
        },
        {
          name: "Skill Verification Models",
          context: "Algorithmic competency scoring models mapping developer code artifacts to verified skill graphs.",
          tags: ["Verification", "Scoring"]
        },
        {
          name: "AI Developer Agents & Acceleration",
          context: "Integration of modern LLM reasoning agents (Claude, GPT, Gemini) into developer workflows and tooling.",
          tags: ["LLMs", "Productivity"]
        },
        {
          name: "Predictive Analytics & Modeling",
          context: "Statistical modeling, feature extraction, regression, and classification algorithms.",
          tags: ["Modeling", "Statistics"]
        },
        {
          name: "Applied Machine Learning Foundations",
          context: "Formal university coursework in supervised learning, unsupervised clustering, and neural network fundamentals.",
          tags: ["B.Tech Spec", "UIT RGPV"]
        }
      ]
    },
    {
      id: "web3-protocols",
      index: "03",
      name: "Web3 & Smart Protocols",
      headline: "Decentralized Infrastructure & Smart Account Engineering",
      description: "Pioneering self-sovereign identity and next-generation account abstraction protocols.",
      skills: [
        {
          name: "ERC-4337 Account Abstraction",
          context: "Smart contract accounts, UserOperations, Paymasters for gasless sponsorship, and bundler RPCs in SVG AegisVault.",
          tags: ["SVG AegisVault", "Base Sepolia"]
        },
        {
          name: "Passkeys & WebAuthn Biometrics",
          context: "Integrating secure enclave P-256 elliptic curve signatures for seedless biometric wallet authorization.",
          tags: ["Security", "WebAuthn"]
        },
        {
          name: "Solidity & Smart Contract Security",
          context: "Writing modular, gas-efficient EVM contracts, interface standards (ERC-20, ERC-721, ERC-4337), and access control.",
          tags: ["Solidity", "EVM"]
        },
        {
          name: "Decentralized Identifiers (DIDs & VCs)",
          context: "Self-sovereign digital identity architecture, verifiable credentials, and cryptographic proofs in Crypticard.",
          tags: ["Crypticard", "Identity"]
        },
        {
          name: "Zero-Knowledge Proofs (ZKP) Concepts",
          context: "Selective disclosure schemas allowing users to verify credentials without exposing private underlying data.",
          tags: ["Privacy", "Cryptography"]
        },
        {
          name: "Multi-Chain Ecosystems (EVM, Solana, Base)",
          context: "Cross-chain identity mapping, wallet integration (MetaMask, Phantom), and on-chain RPC communication.",
          tags: ["Base", "Solana", "EVM"]
        }
      ]
    },
    {
      id: "product-architecture",
      index: "04",
      name: "Product & Marketplace Architecture",
      headline: "End-to-End Product Design & Economic Systems",
      description: "Translating frontier tech into high-conversion workflows, unit economics, and marketplace liquidity.",
      skills: [
        {
          name: "Product Architecture & Roadmapping",
          context: "Defining product requirements, user flows, system boundaries, and milestone delivery for MRIG products.",
          tags: ["MRIG", "Product Strategy"]
        },
        {
          name: "Multi-Sided Marketplace Design",
          context: "Balancing supply-demand dynamics, asset liquidity curves, and host/renter onboarding in Rentro.",
          tags: ["Rentro", "Marketplaces"]
        },
        {
          name: "Escrow & Dispute Resolution Architecture",
          context: "Split escrow logic, multi-stage funds holding, automated release triggers, and damage deposit handling.",
          tags: ["Fintech", "Escrow"]
        },
        {
          name: "Dynamic Pricing Algorithms",
          context: "Yield management models adjusting physical asset rental pricing based on duration, demand, and season.",
          tags: ["Pricing", "Yield"]
        },
        {
          name: "User Research & Customer Discovery",
          context: "Conducting 50+ primary discovery interviews with asset owners and commercial fleet operators to validate pain points.",
          tags: ["Discovery", "User Interviews"]
        },
        {
          name: "Condition Verification Engine Design",
          context: "16-angle digital condition capture system with cryptographic timestamping for asset handover inspection.",
          tags: ["Verification", "Inspection"]
        }
      ]
    },
    {
      id: "venture-building",
      index: "05",
      name: "Venture & Ecosystem Building",
      headline: "Community Scaling, Developer Relations & Growth",
      description: "Proven track record scaling developer communities past 2,500+ members and executing ecosystem operations.",
      skills: [
        {
          name: "Community Architecture (2,500+ Members)",
          context: "Scaling and moderating active developer and node operator communities across Discord, X, and Telegram for Koii Network.",
          tags: ["Koii Network", "2,500+ Community"]
        },
        {
          name: "Developer Relations & Onboarding",
          context: "Designing developer documentation, onboarding funnels, technical office hours, and SDK integration guides.",
          tags: ["DevRel", "Developer Onboarding"]
        },
        {
          name: "Hackathon Technical Facilitation & Winner",
          context: "Unfold '23 top track bounty winner; technical facilitation and judging for Web3 hackathons and builder summits.",
          tags: ["Unfold '23", "Hackathons"]
        },
        {
          name: "Venture Due Diligence & Tokenomics",
          context: "Conducting protocol economic audits, token distribution modeling, and competitive intelligence at Victus Global.",
          tags: ["Victus Global", "Due Diligence"]
        },
        {
          name: "Strategic Ecosystem Partnerships",
          context: "Negotiating and executing partnerships across Web3 protocols, developer clubs, and university tech chapters.",
          tags: ["Partnerships", "Ecosystem"]
        },
        {
          name: "Technical Workshops & Public Speaking",
          context: "Delivering technical deep-dives on smart contracts, node networks, and decentralized protocols to developer audiences.",
          tags: ["Workshops", "Speaking"]
        }
      ]
    },
    {
      id: "tools-production",
      index: "06",
      name: "Tools & Production Stacks",
      headline: "Modern Full-Stack & Infrastructure Tooling",
      description: "Hands-on engineering tools used to build, test, and deploy responsive web and Web3 systems.",
      skills: [
        {
          name: "PostgreSQL & PostGIS Spatial Search",
          context: "Geospatial radius queries, spatial indexing (ST_DWithin), and high-efficiency geo-filtering in Rentro.",
          tags: ["PostGIS", "Geo-Search"]
        },
        {
          name: "Redis & Distributed Locking",
          context: "In-memory caching and 15-minute lease distributed locking to eliminate double-booking in asset rental checkouts.",
          tags: ["Redis", "Distributed Locks"]
        },
        {
          name: "Next.js 15 & Modern React",
          context: "Server Components, App Router, SSR/SSG caching, and fluid component architectures.",
          tags: ["Next.js 15", "Frontend"]
        },
        {
          name: "IBM Cognos BI & Data Warehousing",
          context: "IBM Certified Developer credential in Cognos 10 BI; data warehouse schema design, ETL, and OLAP modeling.",
          tags: ["IBM Certified", "Data Warehousing"]
        },
        {
          name: "Tailwind CSS & Design Systems",
          context: "Building modular, accessible design tokens, micro-interactions, and responsive layout systems.",
          tags: ["CSS Architecture", "Design Systems"]
        },
        {
          name: "Hardhat, Foundry & Web3 SDKs",
          context: "Smart contract compilation, local EVM testnets, unit test suites, and ethers.js / viem integrations.",
          tags: ["Hardhat", "Foundry", "viem"]
        }
      ]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.HQ_DATA = window.HQ_DATA || {};
  window.HQ_DATA.skills = SKILLS_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SKILLS_DATA;
}
