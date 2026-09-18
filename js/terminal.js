/**
 * ============================================================================
 * INTERACTIVE FOUNDER CLI TERMINAL — Mayank Yadav Founder Digital HQ
 * Features:
 *  - Global overlay activated by backtick (`) or tilde (~) key anywhere
 *  - High-signal command registry (mrig, rentro, getnextin, web3, skills, etc.)
 *  - Command history navigation (Up / Down arrows)
 *  - Audio feedback integration via Web Audio synthesizer
 * ============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initGlobalTerminal();
  });

  function initGlobalTerminal() {
    let terminalOverlay = document.getElementById('founder-cli-overlay');

    if (!terminalOverlay) {
      terminalOverlay = document.createElement('div');
      terminalOverlay.id = 'founder-cli-overlay';
      terminalOverlay.className = 'founder-cli-overlay';
      terminalOverlay.innerHTML = `
        <div class="founder-cli-window" role="dialog" aria-modal="true" aria-label="Founder CLI Shell">
          <div class="cli-titlebar">
            <div class="cli-dots">
              <button type="button" class="cli-dot red" id="cli-close-btn" aria-label="Close Terminal"></button>
              <span class="cli-dot yellow"></span>
              <span class="cli-dot green"></span>
            </div>
            <div class="cli-title">mayank@founder-hq:~ (Founder OS v2.5 // CLI)</div>
            <div class="cli-status-indicator">
              <span class="cli-pulse"></span>
              <span>ONLINE</span>
            </div>
          </div>
          <div class="cli-body" id="cli-body">
            <div class="cli-output" id="cli-output">
              <div class="cli-line accent">MAYANK YADAV FOUNDER OS // HACKER SHELL v2.5</div>
              <div class="cli-line dim">Type <span class="cli-cmd-highlight">help</span> for active commands &middot; Press <span class="cli-cmd-highlight">ESC</span> or <span class="cli-cmd-highlight">~</span> to exit.</div>
              <div class="cli-line dim">--------------------------------------------------</div>
            </div>
            <div class="cli-input-row">
              <span class="cli-prompt">mayank@founder-hq:~$</span>
              <input type="text" id="cli-input" class="cli-input" autocomplete="off" spellcheck="false" autofocus />
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(terminalOverlay);
    }

    const outputEl = terminalOverlay.querySelector('#cli-output');
    const inputEl = terminalOverlay.querySelector('#cli-input');
    const bodyEl = terminalOverlay.querySelector('#cli-body');
    const closeBtn = terminalOverlay.querySelector('#cli-close-btn');

    let history = [];
    let historyIndex = -1;

    const commands = {
      help: () => [
        { type: 'accent', text: 'Mayank Yadav Founder OS — Interactive Shell Commands:' },
        { type: 'dim', text: '  mrig       - Inspect MRIG Ecosystem (Parent Venture & Shared Core)' },
        { type: 'dim', text: '  rentro     - Inspect Rentro ("Rent Anything. Earn Anytime" - rentro.mrig.tech)' },
        { type: 'dim', text: '  getnextin  - Inspect GetNextIn (AI Career Platform - getnextin.mrig.tech)' },
        { type: 'dim', text: '  web3       - Display verified cryptographic identity & multi-chain endpoints' },
        { type: 'dim', text: '  about      - Founder background, AI & ML engineering & operating principles' },
        { type: 'dim', text: '  skills     - Technical stack, PostGIS, ERC-4337, AI Screening & NLP' },
        { type: 'dim', text: '  resume     - Download or inspect the active official resume (PDF)' },
        { type: 'dim', text: '  projects   - Directory of venture architectures & smart account protocols' },
        { type: 'dim', text: '  contact    - Official founder endpoints, direct email line & socials' },
        { type: 'dim', text: '  matrix     - Ecosystem directory & cryptographic identity matrix' },
        { type: 'dim', text: '  clear      - Clear terminal screen' },
        { type: 'dim', text: '  exit       - Close terminal shell' }
      ],
      about: () => [
        { type: 'accent', text: 'MAYANK YADAV — FOUNDER & PRODUCT ARCHITECT' },
        { type: 'text', text: 'Focus: Artificial Intelligence, Web3 Protocols & Physical Asset Infrastructure.' },
        { type: 'text', text: 'Founder & CEO at MRIG Ecosystem housing Rentro (rentro.mrig.tech) & GetNextIn (getnextin.mrig.tech).' },
        { type: 'dim', text: 'Academic Background: B.Tech CSE in Artificial Intelligence & Machine Learning at UIT RGPV.' },
        { type: 'success', text: 'Core Principle: Systems Over Gimmicks. Building durable, real-world utility.' }
      ],
      bio: () => commands.about(),
      mrig: () => [
        { type: 'accent', text: 'MRIG ECOSYSTEM // PARENT VENTURE INFRASTRUCTURE' },
        { type: 'text', text: 'Parent company entity providing shared technology core, escrow governance, and venture architecture.' },
        { type: 'cyan', text: '▸ Rentro (rentro.mrig.tech)   : Physical Asset Marketplace ("Rent Anything. Earn Anytime")' },
        { type: 'cyan', text: '▸ GetNextIn (getnextin.mrig.tech): AI Career Platform & Skill Verification Engine' },
        { type: 'dim', text: 'Inspect architecture case study at /projects/mrig.html' }
      ],
      rentro: () => [
        { type: 'accent', text: 'RENTRO BY MRIG // PHYSICAL ASSET MARKETPLACE' },
        { type: 'text', text: 'Tagline: "Rent Anything. Earn Anytime"' },
        { type: 'text', text: 'Verified commercial mobility & transport fleet rentals with 16-angle digital handover & split escrow.' },
        { type: 'cyan', text: 'Live Web Portal: https://rentro.mrig.tech' },
        { type: 'dim', text: 'Stack: Next.js 15, PostGIS Radius Indexing, Redis Locks (15-min TTL), Split Escrow.' }
      ],
      getnextin: () => [
        { type: 'accent', text: 'GETNEXTIN BY MRIG // AI CAREER PLATFORM' },
        { type: 'text', text: 'Tagline: "YOUR NEXT OPPORTUNITY AWAITS"' },
        { type: 'text', text: 'AI-driven candidate screening, skill verification models, and precision talent matching.' },
        { type: 'cyan', text: 'Live Web Portal: https://getnextin.mrig.tech' },
        { type: 'dim', text: 'Stack: AI Screening Pipelines, NLP Evaluation Models, Competency Graphs.' }
      ],
      crypticard: () => [
        { type: 'accent', text: 'CRYPTICARD // DECENTRALIZED DIGITAL IDENTITY PROTOCOL' },
        { type: 'text', text: 'Self-sovereign cryptographic passport empowering users with portable credentials & ZK reputation.' },
        { type: 'text', text: 'Tagline: "SPEND • EARN • OWN"' },
        { type: 'dim', text: 'Case Study: /projects/crypticard.html' }
      ],
      web3: () => [
        { type: 'accent', text: 'VERIFIED CRYPTOGRAPHIC DIGITAL IDENTITY:' },
        { type: 'cyan', text: '• ENS / Base     : Maayankyadav.base.eth' },
        { type: 'cyan', text: '• Ethereum / EVM : 0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e' },
        { type: 'cyan', text: '• Solana         : EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX' },
        { type: 'cyan', text: '• Bitcoin Taproot: Bc1pe5f0hrr0er7gd3zha0wknlw45x5mu4y5mzw87clqzjprg0mtfp0qh9y2dq' },
        { type: 'dim', text: '• Devfolio       : https://devfolio.co/@Mayankyadav' }
      ],
      identity: () => commands.web3(),
      skills: () => [
        { type: 'accent', text: 'CORE ARCHITECTURAL COMPETENCIES & STACK:' },
        { type: 'text', text: '• AI / ML       : Screening Pipelines, Skill Verification, NLP Comprehension, Python' },
        { type: 'text', text: '• Web3 & Crypto : ERC-4337 Smart Accounts, Solidity, Base Sepolia, WebAuthn Passkeys' },
        { type: 'text', text: '• Systems & DB  : PostGIS Spatial Queries, Redis Distributed Locks, Next.js 15, PostgreSQL' },
        { type: 'text', text: '• Leadership    : Community Architecture (2,500+ builders), Node Acquisition, Venture GTM' }
      ],
      stack: () => commands.skills(),
      resume: () => {
        window.open('/api/resume/download', '_blank');
        return [
          { type: 'accent', text: 'MAYANK YADAV // OFFICIAL RESUME' },
          { type: 'cyan', text: '▸ Triggering download for active PDF: /api/resume/download' },
          { type: 'text', text: '• Verified Track Record: MRIG (Rentro & GetNextIn), Crypticard, Koii Network, Victus Global' },
          { type: 'text', text: '• Education: B.Tech CSE (AI & ML) at UIT RGPV Bhopal' },
          { type: 'dim', text: '• Online Dossier: /resume.html' }
        ];
      },
      cv: () => commands.resume(),
      projects: () => [
        { type: 'accent', text: 'VENTURE DIRECTORY & PROTOCOLS:' },
        { type: 'text', text: '1. Rentro (rentro.mrig.tech)       - Physical Asset Marketplace (Live)' },
        { type: 'text', text: '2. GetNextIn (getnextin.mrig.tech)  - AI Career & Skill Platform (Live)' },
        { type: 'text', text: '3. MRIG Ecosystem (mrig.tech)      - Parent Venture Architecture' },
        { type: 'text', text: '4. Crypticard (crypticard.tech)     - Decentralized Digital Identity (Protocol R&D)' },
        { type: 'text', text: '5. SVG AegisVault                   - ERC-4337 Hybrid Smart Account with Passkeys' },
        { type: 'dim', text: 'GitHub: https://github.com/mayankyadav89' }
      ],
      contact: () => [
        { type: 'accent', text: 'FOUNDER DIRECT COMMUNICATION LINE:' },
        { type: 'cyan', text: '• Official Email : hello@itsmayank.me' },
        { type: 'text', text: '• X / Twitter    : https://x.com/maayankyadav07' },
        { type: 'text', text: '• LinkedIn       : https://www.linkedin.com/in/mayankyadav89/' },
        { type: 'text', text: '• Farcaster      : https://farcaster.xyz/mayankyadav' },
        { type: 'dim', text: '• Location       : Bhopal, Madhya Pradesh, India & Global Remote (UTC+05:30)' }
      ],
      matrix: () => [
        { type: 'accent', text: '=== VERIFIED ECOSYSTEM & DIGITAL IDENTITY ===' },
        { type: 'success', text: 'EVM: 0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e' },
        { type: 'success', text: 'BASE: Maayankyadav.base.eth' },
        { type: 'cyan', text: 'MRIG PARENT ECOSYSTEM: mrig.tech' },
        { type: 'cyan', text: 'RENTRO PORTAL: rentro.mrig.tech' },
        { type: 'cyan', text: 'GETNEXTIN PORTAL: getnextin.mrig.tech' },
        { type: 'dim', text: 'LOCATION: Bhopal, MP, India (UTC+05:30)' }
      ]
    };

    function appendLine(text, type = 'text') {
      const lineEl = document.createElement('div');
      lineEl.className = `cli-line ${type}`;
      lineEl.innerHTML = text;
      outputEl.appendChild(lineEl);
    }

    function handleCommand(rawInput) {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      history.push(trimmed);
      historyIndex = history.length;

      appendLine(`<span class="cli-prompt-echo">mayank@founder-hq:~$</span> ${escapeHtml(trimmed)}`, 'prompt-echo');

      if (window.playTactileChime) {
        window.playTactileChime('click');
      }

      const parts = trimmed.split(' ');
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');

      if (cmd === 'clear') {
        outputEl.innerHTML = '';
        return;
      }

      if (cmd === 'exit' || cmd === 'close' || cmd === 'quit') {
        closeTerminal();
        return;
      }

      if (commands[cmd]) {
        const lines = typeof commands[cmd] === 'function' ? commands[cmd](arg) : commands[cmd];
        lines.forEach(line => appendLine(line.text, line.type));
      } else {
        appendLine(`Command not found: "<span style="color:#ef4444;">${escapeHtml(cmd)}</span>". Type <span class="cli-cmd-highlight">help</span> for active commands.`, 'dim');
      }

      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    function openTerminal() {
      terminalOverlay.classList.add('active');
      inputEl.value = '';
      setTimeout(() => inputEl.focus(), 50);
      if (window.playTactileChime) window.playTactileChime('click');
    }

    function closeTerminal() {
      terminalOverlay.classList.remove('active');
    }

    // Expose global open/close
    window.openFounderTerminal = openTerminal;
    window.closeFounderTerminal = closeTerminal;

    // Toggle on Backtick / Tilde key (outside input fields)
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if ((e.key === '`' || e.key === '~') && (!isInput || terminalOverlay.classList.contains('active'))) {
        e.preventDefault();
        if (terminalOverlay.classList.contains('active')) {
          closeTerminal();
        } else {
          openTerminal();
        }
      } else if (e.key === 'Escape' && terminalOverlay.classList.contains('active')) {
        closeTerminal();
      }
    });

    closeBtn.addEventListener('click', closeTerminal);

    terminalOverlay.addEventListener('click', (e) => {
      if (e.target === terminalOverlay) closeTerminal();
      else inputEl.focus();
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = inputEl.value;
        inputEl.value = '';
        handleCommand(val);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length > 0 && historyIndex > 0) {
          historyIndex--;
          inputEl.value = history[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (history.length > 0 && historyIndex < history.length - 1) {
          historyIndex++;
          inputEl.value = history[historyIndex];
        } else {
          historyIndex = history.length;
          inputEl.value = '';
        }
      }
    });

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }
})();
