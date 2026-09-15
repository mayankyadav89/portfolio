/**
 * ============================================================================
 * SOCIAL DATA MODULE — Mayank Yadav Founder Digital HQ
 * ============================================================================
 */
const SOCIAL_DATA = [
  {
    id: "email",
    platform: "Direct Founder Line",
    handle: "hello@itsmayank.me",
    url: "mailto:hello@itsmayank.me",
    type: "communication",
    verified: true,
    badge: "Official Inquiries",
    icon: "mail"
  },
  {
    id: "github",
    platform: "GitHub",
    handle: "mayankyadav89",
    url: "https://github.com/mayankyadav89",
    type: "code",
    verified: true,
    badge: "Repositories & OSS",
    icon: "github"
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    handle: "mayankyadav89",
    url: "https://www.linkedin.com/in/mayankyadav89/",
    type: "professional",
    verified: true,
    badge: "Founder Network",
    icon: "linkedin"
  },
  {
    id: "x",
    platform: "X / Twitter",
    handle: "@maayankavy07",
    url: "https://x.com/maayankavy07",
    type: "social",
    verified: true,
    badge: "Frontier Thoughts & Web3",
    icon: "x"
  },
  {
    id: "farcaster",
    platform: "Farcaster",
    handle: "mayankyadav",
    url: "https://farcaster.xyz/mayankyadav",
    type: "web3",
    verified: true,
    badge: "Decentralized Social",
    icon: "farcaster"
  },
  {
    id: "discord",
    platform: "Discord",
    handle: "MAYANKYADAV",
    url: "https://discord.com/users/MAYANKYADAV",
    type: "community",
    verified: true,
    badge: "Community Hub (2.5K+)",
    icon: "discord"
  },
  {
    id: "instagram",
    platform: "Instagram",
    handle: "itsmayank.me",
    url: "https://instagram.com/itsmayank.me",
    type: "social",
    verified: true,
    badge: "Personal & Creative",
    icon: "instagram"
  },
  {
    id: "facebook",
    platform: "Facebook",
    handle: "itsmayank.me",
    url: "https://www.facebook.com/itsmayank.me",
    type: "social",
    verified: true,
    badge: "Ecosystem Connect",
    icon: "facebook"
  },
  {
    id: "reddit",
    platform: "Reddit",
    handle: "maayankaydav",
    url: "https://www.reddit.com/u/maayankaydav/s/fWLZXcJXma",
    type: "social",
    verified: true,
    badge: "Discussions & Forums",
    icon: "reddit"
  }
];

if (typeof window !== 'undefined') {
  window.HQ_DATA = window.HQ_DATA || {};
  window.HQ_DATA.social = SOCIAL_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SOCIAL_DATA;
}
