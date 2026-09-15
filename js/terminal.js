/**
 * ============================================================================
 * INTERACTIVE FOUNDER CLI TERMINAL — Mayank Yadav Founder Digital HQ
 * ============================================================================
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initTerminal();
  });

  function initTerminal() {
    const terminalEl = document.getElementById('founder-terminal');
    if (!terminalEl) return;

    const outputEl = terminalEl.querySelector('.terminal-output');
    const inputEl = terminalEl.querySelector('.terminal-input');
    if (!outputEl || !inputEl) return;

    let history = [];
    let historyIndex = -1;

    // Command registry
    const commands = {
      help: () => [
        { type: 'accent', text: 'Mayank Yadav Founder OS — Interactive Shell Commands:' },
        { type: 'dim', text: '  mrig       - Deep-dive into MRIG (Rentro & GetNextIn physical asset ecosystem)' },
        { type: 'dim', text: '  bio        - Founder overview, engineering background & operating principles' },
        { type: 'dim', text: '  projects   - Output directory of active ventures & smart contracts' },
        { type: 'dim', text: '  stack      - Technical architecture, AI/ML pipelines & Web3 standards' },
        { type: 'dim', text: '  ledger     - Query Living Blockchain Ledger block heights & hashes' },
        { type: 'dim', text: '  contact    - Retrieve direct founder communication line & PGP identity' },
        { type: 'dim', text: '  cat <file> - Read system files (e.g. `cat vision.txt`, `cat genesis.hex`)' },
        { type: 'dim', text: '  clear      - Clear terminal screen' }
      ],
      bio: () => [
        { type: 'accent', text: 'MAYANK YADAV — FOUNDER & PRODUCT ARCHITECT' },
        { type: 'text', text: 'Focus: AI, Web3 & Real-World Physical Asset Infrastructure.' },
        { type: 'text', text: 'Founder & CEO at MRIG (Rentro & GetNextIn) and Crypticard.' },
        { type: 'dim', text: 'Education: B.Tech CSE (AI & ML) at UIT RGPV, Bhopal, India.' },
        { type: 'success', text: 'Status: Actively building & unlocking latent capital in real-world assets.' }
      ],
      mrig: () => [
        { type: 'accent', text: 'MRIG: "The Amazon of Physical Assets"' },
        { type: 'text', text: 'Flagship dual-engine ecosystem unlocking multi-trillion dollar asset liquidity.' },
        { type: 'cyan', text: '▸ Rentro (rentro.mrig.tech): Rent, buy, sell, finance & insure physical assets.' },
        { type: 'cyan', text: '▸ GetNextIn (getnextin.mrig.tech): AI candidate screening & verifiable career matchmaking.' },
        { type: 'dim', text: 'Explore full 10-part case study at /projects/mrig.html' }
      ],
      projects: () => [
        { type: 'accent', text: 'ACTIVE VENTURES & ARCHITECTURAL REPOSITORIES:' },
        { type: 'text', text: '1. MRIG (Building)            - Physical Asset Marketplace (Rentro & GetNextIn)' },
        { type: 'text', text: '2. Crypticard (R&D)          - Decentralized Digital Identity & Verifiable Credentials' },
        { type: 'text', text: '3. SVG AegisVault (OSS)       - ERC-4337 Smart Account with WebAuthn Passkeys on Base Sepolia' },
        { type: 'text', text: '4. Ecoties (Concept)          - Ecological Provenance & Carbon Offset Ledger' },
        { type: 'dim', text: 'GitHub: https://github.com/mayankyadav89' }
      ],
      stack: () => [
        { type: 'accent', text: 'TECHNICAL CAPABILITY & FRONTIER STACK:' },
        { type: 'text', text: '• AI / ML: Neural Architectures, ML Pipelines, Semantic Matching, Python' },
        { type: 'text', text: '• Web3 / Protocol: ERC-4337 Account Abstraction, Solidity, Base Sepolia, EVM, Solana' },
        { type: 'text', text: '• Product: Marketplace Economics, Multi-Sided Escrow, GTM Roadmaps, User Research' },
        { type: 'text', text: '• Leadership: Community Architecture (2,500+ builders), Node Acquisition, BD' }
      ],
      ledger: () => [
        { type: 'accent', text: 'LIVING BLOCKCHAIN LEDGER STATE:' },
        { type: 'dim', text: 'BLOCK 000 | GENESIS   | 0x8f3c...c2d1 | AI/ML & Engineering Initiation' },
        { type: 'dim', text: 'BLOCK 001 | STARTUP   | 0x9c3d...5c7d | MRIG Ecosystem (Rentro & GetNextIn)' },
        { type: 'dim', text: 'BLOCK 002 | IDENTITY  | 0x3a9f...5f7a | Crypticard Decentralized Identity' },
        { type: 'dim', text: 'BLOCK 003 | PROTOCOL  | 0x7b1c...9b1c | SVG AegisVault ERC-4337 Smart Account' },
        { type: 'dim', text: 'BLOCK 004 | GROWTH    | 0x5e7a...5f7a | Koii India BD & 2,500+ Community' },
        { type: 'success', text: 'HEAD 005  | MINING    | 0x7f4e...1a4f | Mayank Yadav Founder OS (Live Head)' }
      ],
      contact: () => [
        { type: 'accent', text: 'FOUNDER DIRECT COMMUNICATION HUB:' },
        { type: 'text', text: '• Official Email: hello@itsmayank.me' },
        { type: 'text', text: '• X / Twitter:    https://x.com/maayankavy07' },
        { type: 'text', text: '• LinkedIn:       https://www.linkedin.com/in/mayankyadav89/' },
        { type: 'text', text: '• Farcaster:      https://farcaster.xyz/mayankyadav' },
        { type: 'text', text: '• Location:       Bhopal, Madhya Pradesh, India (IST / UTC+05:30)' }
      ],
      cat: (arg) => {
        if (!arg || arg === 'vision.txt') {
          return [
            { type: 'accent', text: '=== VISION.TXT ===' },
            { type: 'text', text: '"The next wave of technological value will not come from speculative digital assets, but from using intelligent algorithms and decentralized ledgers to eliminate capital friction in the physical world."' },
            { type: 'dim', text: '— Mayank Yadav, Founder & Product Architect' }
          ];
        } else if (arg === 'genesis.hex') {
          return [
            { type: 'dim', text: '0x47454e455349533a204149202620435320456e67696e656572696e6720496e6974696174696f6e2e204275696c64696e672073797374656d732074686174206c6173742e' }
          ];
        }
        return [
          { type: 'dim', text: `cat: ${arg}: No such file or directory. Try 'cat vision.txt'` }
        ];
      }
    };

    function appendLine(text, type = 'text') {
      const lineEl = document.createElement('div');
      lineEl.className = `terminal-line ${type}`;
      lineEl.textContent = text;
      outputEl.appendChild(lineEl);
    }

    function handleCommand(rawInput) {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      history.push(trimmed);
      historyIndex = history.length;

      appendLine(`mayank@founder-hq:~$ ${trimmed}`, 'prompt-echo');

      const parts = trimmed.split(' ');
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');

      if (cmd === 'clear') {
        outputEl.innerHTML = '';
        return;
      }

      if (commands[cmd]) {
        const lines = typeof commands[cmd] === 'function' ? commands[cmd](arg) : commands[cmd];
        lines.forEach(line => appendLine(line.text, line.type));
      } else {
        appendLine(`Command not found: "${cmd}". Type "help" for active commands.`, 'dim');
      }

      terminalEl.querySelector('.terminal-body').scrollTop = terminalEl.querySelector('.terminal-body').scrollHeight;
    }

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

    terminalEl.addEventListener('click', () => {
      inputEl.focus();
    });
  }
})();
