/**
 * ============================================================================
 * CONNECTIONS & SOCIAL DATA MODULE — Mayank Yadav Founder Digital HQ
 * Verified Multi-Ecosystem Digital Identity & Network Directory
 * ============================================================================
 */
const CONNECTIONS_DATA = {
  ecosystems: [
    {
      id: "code-dev",
      category: "Engineering & Code Repositories",
      description: "Production codebases, smart contracts, open-source repositories, and hackathon prototypes.",
      items: [
        {
          id: "github",
          platform: "GitHub",
          handle: "mayankyadav89",
          url: "https://github.com/mayankyadav89",
          type: "code",
          context: "Production architectures, SVG AegisVault ERC-4337, open-source libraries & repositories.",
          badge: "OSS & Repositories",
          badgeType: "violet",
          canCopy: false,
          isExternal: true
        },
        {
          id: "devfolio",
          platform: "Devfolio",
          handle: "@Mayankyadav",
          url: "https://devfolio.co/@Mayankyadav",
          type: "hackathon",
          context: "Builder track submissions, hackathon portfolios, and Unfold '23 top track bounty winner projects.",
          badge: "Hackathon Builder",
          badgeType: "emerald",
          canCopy: false,
          isExternal: true
        }
      ]
    },
    {
      id: "onchain-web3",
      category: "Verified On-Chain & Web3 Identity",
      description: "Cryptographic identities, smart accounts, and verified multi-chain addresses.",
      items: [
        {
          id: "ens-base",
          platform: "Base / ENS",
          handle: "Maayankyadav.base.eth",
          displayValue: "Maayankyadav.base.eth",
          rawValue: "Maayankyadav.base.eth",
          url: "https://basescan.org/name/Maayankyadav.base.eth",
          type: "web3-name",
          context: "Primary Layer-2 Base on-chain resolution handle and identity name.",
          badge: "Base ENS Name",
          badgeType: "cyan",
          canCopy: true,
          isExternal: true
        },
        {
          id: "evm-address",
          platform: "Ethereum / EVM",
          handle: "0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e",
          displayValue: "0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e",
          shortValue: "0x8b99...2b7e",
          rawValue: "0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e",
          url: "https://etherscan.io/address/0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e",
          type: "evm",
          context: "Ethereum mainnet, Layer-2s (Base, Arbitrum, Optimism) & smart contract deployments.",
          badge: "EVM Multi-Chain",
          badgeType: "violet",
          canCopy: true,
          isExternal: true
        },
        {
          id: "solana-address",
          platform: "Solana",
          handle: "EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX",
          displayValue: "EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX",
          shortValue: "EjpY...tpbX",
          rawValue: "EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX",
          url: "https://solscan.io/account/EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX",
          type: "solana",
          context: "High-throughput Solana program interactions and ecosystem account.",
          badge: "Solana Network",
          badgeType: "emerald",
          canCopy: true,
          isExternal: true
        },
        {
          id: "btc-taproot",
          platform: "Bitcoin Taproot",
          handle: "Bc1pe5f0hrr0er7gd3zha0wknlw45x5mu4y5mzw87clqzjprg0mtfp0qh9y2dq",
          displayValue: "Bc1pe5f0hrr0er7gd3zha0wknlw45x5mu4y5mzw87clqzjprg0mtfp0qh9y2dq",
          shortValue: "Bc1p...y2dq",
          rawValue: "Bc1pe5f0hrr0er7gd3zha0wknlw45x5mu4y5mzw87clqzjprg0mtfp0qh9y2dq",
          url: "https://mempool.space/address/Bc1pe5f0hrr0er7gd3zha0wknlw45x5mu4y5mzw87clqzjprg0mtfp0qh9y2dq",
          type: "bitcoin",
          context: "Schnorr signature & Taproot cryptographic identity on Bitcoin network.",
          badge: "Taproot / BTC",
          badgeType: "amber",
          canCopy: true,
          isExternal: true
        }
      ]
    },
    {
      id: "social-network",
      category: "Professional & Network Channels",
      description: "Direct founder communications, ecosystem updates, and builder communities.",
      items: [
        {
          id: "linkedin",
          platform: "LinkedIn",
          handle: "mayankyadav89",
          url: "https://www.linkedin.com/in/mayankyadav89/",
          type: "professional",
          context: "Founder milestones, venture updates, and executive collaborations.",
          badge: "Executive Network",
          badgeType: "cyan",
          canCopy: false,
          isExternal: true
        },
        {
          id: "x-twitter",
          platform: "X / Twitter",
          handle: "@maayankavy07",
          url: "https://x.com/maayankavy07",
          type: "social",
          context: "Frontier thoughts on AI career tech, physical asset tokenization & Web3.",
          badge: "Frontier Discourse",
          badgeType: "violet",
          canCopy: false,
          isExternal: true
        },
        {
          id: "farcaster",
          platform: "Farcaster",
          handle: "mayankyadav",
          url: "https://farcaster.xyz/mayankyadav",
          type: "web3-social",
          context: "Decentralized social protocol network and builder channel on Base.",
          badge: "Farcaster Web3",
          badgeType: "indigo",
          canCopy: false,
          isExternal: true
        },
        {
          id: "discord",
          platform: "Discord",
          handle: "MAYANKYADAV",
          url: "https://discord.com/users/MAYANKYADAV",
          type: "community",
          context: "Direct real-time technical conversations & community channels (2,500+ members).",
          badge: "2,500+ Community",
          badgeType: "emerald",
          canCopy: true,
          rawValue: "MAYANKYADAV",
          isExternal: true
        },
        {
          id: "email",
          platform: "Direct Founder Line",
          handle: "hello@itsmayank.me",
          url: "mailto:hello@itsmayank.me",
          type: "direct-mail",
          context: "Official venture inquiries, strategic partnerships, and technical collaboration.",
          badge: "Direct Contact",
          badgeType: "violet",
          canCopy: true,
          rawValue: "hello@itsmayank.me",
          isExternal: false
        }
      ]
    }
  ]
};

const SOCIAL_DATA = CONNECTIONS_DATA.ecosystems.flatMap(e => e.items);

if (typeof window !== 'undefined') {
  window.HQ_DATA = window.HQ_DATA || {};
  window.HQ_DATA.connections = CONNECTIONS_DATA;
  window.HQ_DATA.social = SOCIAL_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONNECTIONS_DATA, SOCIAL_DATA };
}
