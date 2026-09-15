/**
 * ============================================================================
 * SKILLS DATA MODULE — Mayank Yadav Founder Digital HQ
 * ============================================================================
 */
const SKILLS_DATA = {
  categories: [
    {
      id: "frontier-tech",
      name: "Frontier Engineering & Web3 Architecture",
      icon: "cpu",
      skills: [
        { name: "AI & Machine Learning", level: "Architecture", note: "Neural pipelines, AI workflows, predictive models" },
        { name: "Blockchain & Distributed Ledgers", level: "Advanced", note: "EVM consensus, state machines, protocol design" },
        { name: "ERC-4337 Account Abstraction", level: "Specialized", note: "Smart accounts, Paymasters, Passkeys, Bundlers" },
        { name: "Smart Contracts & Solidity", level: "Core", note: "Security patterns, modular architecture, token standards" },
        { name: "Decentralized Identifiers (DIDs & VCs)", level: "Specialized", note: "Self-sovereign identity, verifiable attestations" },
        { name: "Ethereum, Base & L2 Ecosystems", level: "Advanced", note: "Base Sepolia, Polygon, EVM scaling layers" },
        { name: "Solana Ecosystem", level: "Core", note: "High-throughput architecture & ecosystem tools" },
        { name: "Node Operations & Infrastructure", level: "Operational", note: "Distributed compute, validator acquisition" },
        { name: "Web3 Wallets & WebAuthn", level: "Advanced", note: "Passkey biometric auth, MetaMask, Phantom" },
        { name: "Python & Data Structures", level: "Core", note: "Algorithms, analytics scripting, ML modeling" },
        { name: "SQL & Relational Databases", level: "Core", note: "Schema design, query optimization, data warehouses" },
        { name: "Git & Version Architecture", level: "Standard", note: "CI workflows, branch management, OSS collaboration" }
      ]
    },
    {
      id: "product-strategy",
      name: "Founder Strategy & Product Management",
      icon: "layers",
      skills: [
        { name: "Product Architecture & Roadmapping", level: "Founder", note: "Translating frontier tech into user workflows" },
        { name: "Multi-Sided Marketplace Design", level: "Specialized", note: "Supply-demand balance, liquidity, escrow safety" },
        { name: "Go-to-Market Strategy (GTM)", level: "Expert", note: "Developer & user acquisition, regional positioning" },
        { name: "User Research & Customer Discovery", level: "Expert", note: "Primary founder interviews, feedback synthesis" },
        { name: "Tokenomics & Economic Modeling", level: "Advanced", note: "Incentive mechanisms, staking, sustainability" },
        { name: "Venture Due Diligence", level: "Analytical", note: "Protocol auditing, competitor benchmarking" },
        { name: "Pricing Strategy & Unit Economics", level: "Strategic", note: "Margin modeling, fee extraction, scalability" },
        { name: "Business Model Validation", level: "Founder", note: "MVP hypotheses, market testing, validation loops" }
      ]
    },
    {
      id: "growth-leadership",
      name: "Ecosystem Growth & Operations",
      icon: "network",
      skills: [
        { name: "Community Architecture (2,500+)", level: "Proven", note: "Discord, Telegram & X community engineering" },
        { name: "Developer Relations & Onboarding", level: "Expert", note: "Hackathon mentoring, docs, developer funnels" },
        { name: "Strategic Ecosystem Partnerships", level: "Proven", note: "Web3 alliances, cross-protocol integrations" },
        { name: "Hackathon & Event Operations", level: "Proven", note: "ETHGlobal, IBW, regional tech meetups" },
        { name: "Technical Public Speaking", level: "Active", note: "Workshops, panels, ecosystem demonstrations" },
        { name: "Operational Workflow Optimization", level: "Executive", note: "Cross-functional execution, task automation" }
      ]
    },
    {
      id: "tools-stack",
      name: "Tools & Operating Environment",
      icon: "terminal",
      skills: [
        { name: "Modern Code & Dev Tools", level: "Proficient", note: "VS Code, Postman, Git, Chrome DevTools" },
        { name: "AI Acceleration Stacks", level: "Power User", note: "Claude, ChatGPT, Gemini, AI developer agents" },
        { name: "Productivity & Knowledge Graphs", level: "Advanced", note: "Notion workspaces, Canva design systems" },
        { name: "Communication Infrastructure", level: "Operational", note: "Discord Bot setups, Telegram Bots, X Automation" }
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
