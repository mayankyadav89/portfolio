/**
 * ============================================================================
 * CORE CONTROLLER & COMMAND PALETTE (Cmd+K) — Mayank Yadav Founder Digital HQ
 * ============================================================================
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initMobileNav();
    initCommandPalette();
    initSmoothAnchors();
    initContactForms();
  });

  /* ===== Navbar Scroll Effects ===== */
  function initNavScroll() {
    const nav = document.querySelector('.hq-navbar') || document.getElementById('hq-navbar');
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 30) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===== Mobile Nav Drawer ===== */
  function initMobileNav() {
    const toggle = document.querySelector('.hq-nav-toggle') || document.getElementById('nav-hamburger');
    const links = document.querySelector('.hq-nav-links') || document.getElementById('mobile-nav-drawer');
    const closeBtn = document.getElementById('mobile-nav-close');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
      links.classList.toggle('open');
      const expanded = links.classList.contains('active') || links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        links.classList.remove('active');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ===== Command Palette (Cmd + K / Ctrl + K) ===== */
  function initCommandPalette() {
    let overlay = document.getElementById('cmd-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'cmd-overlay';
      overlay.className = 'cmd-overlay';
      overlay.innerHTML = `
        <div class="cmd-modal" role="dialog" aria-modal="true" aria-label="Command Palette">
          <div class="cmd-header">
            <svg class="cmd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="cmd-input" class="cmd-input" placeholder="Type a command or search (e.g. Rentro, CLI, Base ENS, Contact)..." autocomplete="off" spellcheck="false" />
          </div>
          <div class="cmd-results" id="cmd-results"></div>
          <div class="cmd-footer">
            <div class="cmd-shortcuts">
              <span><kbd class="cmd-key">&uarr;&darr;</kbd> Navigate</span>
              <span><kbd class="cmd-key">&crarr;</kbd> Select</span>
              <span><kbd class="cmd-key">ESC</kbd> Close</span>
              <span><kbd class="cmd-key">~</kbd> CLI Shell</span>
            </div>
            <span>Founder HQ v2.5</span>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const input = overlay.querySelector('#cmd-input');
    const resultsContainer = overlay.querySelector('#cmd-results');
    if (!input || !resultsContainer) return;

    let selectedIndex = 0;
    let items = [];

    // Comprehensive Verified Search Index Data
    const searchIndex = [
      { title: "Download Official Resume (PDF)", category: "Actions", badge: "PDF", url: "/api/resume/download", external: true },
      { title: "Founder Profile & Executive Dossier", category: "Navigation", badge: "Dossier", url: "resume.html" },
      { title: "Open Hacker CLI Terminal (~ / backtick)", category: "System Commands", badge: "CLI Shell", action: "terminal" },
      { title: "Copy Founder Email: hello@itsmayank.me", category: "Actions", badge: "Copy", action: "copy-email" },
      { title: "Rentro: Physical Asset Marketplace (rentro.mrig.tech)", category: "Ventures", badge: "Product", url: "https://rentro.mrig.tech", external: true },
      { title: "GetNextIn: AI Career & Skill Platform (getnextin.mrig.tech)", category: "Ventures", badge: "AI Engine", url: "https://getnextin.mrig.tech", external: true },
      { title: "MRIG Ecosystem Architecture & Core", category: "Ventures", badge: "Case Study", url: "projects/mrig.html" },
      { title: "Crypticard: Decentralized Digital Identity", category: "Protocols", badge: "Case Study", url: "projects/crypticard.html" },
      { title: "SVG AegisVault: ERC-4337 Smart Account", category: "Protocols", badge: "OSS", url: "projects/svg-aegisvault.html" },
      { title: "Base ENS: Maayankyadav.base.eth", category: "Web3 Identity", badge: "On-Chain", url: "https://basescan.org/name/Maayankyadav.base.eth", external: true },
      { title: "EVM Address (0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e)", category: "Web3 Identity", badge: "Copy", action: "copy-evm" },
      { title: "Solana Address (EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX)", category: "Web3 Identity", badge: "Copy", action: "copy-sol" },
      { title: "Home / Founder Digital HQ", category: "Navigation", badge: "HQ", url: "index.html" },
      { title: "About Mayank Yadav & Philosophy", category: "Navigation", badge: "Story", url: "about.html" },
      { title: "All Projects & Architecture Archive", category: "Navigation", badge: "Archive", url: "projects.html" },
      { title: "Experience & Track Record", category: "Navigation", badge: "Leadership", url: "experience.html" },
      { title: "Technical Skills & Competency Matrix", category: "Navigation", badge: "Skills", url: "skills.html" },
      { title: "Direct Contact & Encrypted Hub", category: "Navigation", badge: "Contact", url: "contact.html" },
      { title: "Koii Network (India BD Lead - 2,500+ Community)", category: "Experience", badge: "Leadership", url: "https://koii.network", external: true },
      { title: "Victus Global (Web3 Venture & Protocol Due Diligence)", category: "Experience", badge: "Advisory", url: "https://victusglobal.com", external: true },
      { title: "GitHub: @mayankyadav89", category: "Channels", badge: "OSS", url: "https://github.com/mayankyadav89", external: true },
      { title: "LinkedIn: @mayankyadav89", category: "Channels", badge: "Executive", url: "https://www.linkedin.com/in/mayankyadav89/", external: true },
      { title: "X / Twitter: @maayankyadav07", category: "Channels", badge: "Updates", url: "https://x.com/maayankyadav07", external: true },
      { title: "Devfolio Profile: @Mayankyadav", category: "Channels", badge: "Hackathons", url: "https://devfolio.co/@Mayankyadav", external: true }
    ];

    function openPalette() {
      overlay.classList.add('active');
      input.value = '';
      setTimeout(() => input.focus(), 40);
      renderResults('');
    }

    function closePalette() {
      overlay.classList.remove('active');
    }

    function renderResults(query) {
      const q = query.toLowerCase().trim();
      const filtered = q === '' ? searchIndex : searchIndex.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
      );

      items = filtered;
      selectedIndex = 0;

      if (filtered.length === 0) {
        resultsContainer.innerHTML = `
          <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
            No commands or case studies found matching "<span style="color: var(--text-primary);">${escapeHtml(query)}</span>"
          </div>
        `;
        return;
      }

      const groups = {};
      filtered.forEach((item, index) => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push({ ...item, globalIndex: index });
      });

      let html = '';
      for (const [cat, groupItems] of Object.entries(groups)) {
        html += `<div class="cmd-group-title">${cat}</div>`;
        groupItems.forEach(item => {
          const isSelected = item.globalIndex === selectedIndex ? 'selected' : '';
          html += `
            <div class="cmd-item ${isSelected}" data-index="${item.globalIndex}">
              <div class="cmd-item-left">
                <span class="cmd-item-title">${item.title}</span>
              </div>
              <span class="cmd-item-badge">${item.badge}</span>
            </div>
          `;
        });
      }
      resultsContainer.innerHTML = html;

      resultsContainer.querySelectorAll('.cmd-item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.getAttribute('data-index'), 10);
          executeAction(items[idx]);
        });
      });
    }

    function executeAction(item) {
      if (!item) return;
      closePalette();

      if (item.action === 'terminal') {
        if (window.openFounderTerminal) {
          window.openFounderTerminal();
        }
        return;
      }

      if (item.action === 'copy-email') {
        copyText('hello@itsmayank.me', 'Founder email (hello@itsmayank.me)');
        return;
      }

      if (item.action === 'copy-evm') {
        copyText('0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e', 'EVM Address');
        return;
      }

      if (item.action === 'copy-sol') {
        copyText('EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX', 'Solana Address');
        return;
      }

      if (item.external) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else {
        const inSubdir = window.location.pathname.includes('/projects/');
        let targetUrl = item.url;
        if (inSubdir && !targetUrl.startsWith('http') && !targetUrl.startsWith('/')) {
          targetUrl = '../' + targetUrl;
        }
        window.location.href = targetUrl;
      }
    }

    function copyText(text, label) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          if (window.playTactileChime) window.playTactileChime('copy');
          showToastFeedback(`Copied ${label} to clipboard! ✓`);
        });
      }
    }

    function showToastFeedback(msg) {
      let toast = document.getElementById('hq-global-toast');
      if (toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
      }
    }

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (overlay.classList.contains('active')) {
          closePalette();
        } else {
          openPalette();
        }
      } else if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closePalette();
      }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePalette();
    });

    document.querySelectorAll('.cmd-palette-btn').forEach(btn => {
      btn.addEventListener('click', openPalette);
    });

    input.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length > 0) {
          selectedIndex = (selectedIndex + 1) % items.length;
          updateSelection();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length > 0) {
          selectedIndex = (selectedIndex - 1 + items.length) % items.length;
          updateSelection();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedIndex]) {
          executeAction(items[selectedIndex]);
        }
      }
    });

    function updateSelection() {
      resultsContainer.querySelectorAll('.cmd-item').forEach(el => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        if (idx === selectedIndex) {
          el.classList.add('selected');
          el.scrollIntoView({ block: 'nearest' });
        } else {
          el.classList.remove('selected');
        }
      });
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }

  /* ===== Smooth Anchor Scrolling ===== */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ===== Contact Form Mailto Dispatcher ===== */
  function initContactForms() {
    const forms = [
      document.getElementById('hero-contact-form'),
      document.getElementById('contact-form')
    ].filter(Boolean);

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('#form-name, #contact-name, input[name="name"]');
        const emailInput = form.querySelector('#form-email, #contact-email, input[name="email"]');
        const messageInput = form.querySelector('#form-message, #contact-message, textarea[name="message"]');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) return;

        const subject = encodeURIComponent(`Inquiry from ${name} via Founder HQ`);
        const body = encodeURIComponent(`Hi Mayank,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`);
        const mailtoUrl = `mailto:hello@itsmayank.me?subject=${subject}&body=${body}`;

        showToastFeedback('Opening your email client to dispatch to hello@itsmayank.me...');
        if (window.playTactileChime) window.playTactileChime('unlock');

        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 300);
      });
    });

    // Wire up one-click copy email buttons
    document.querySelectorAll('#copy-email-hero-btn, #contact-copy-email-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        copyText('hello@itsmayank.me', 'Founder email (hello@itsmayank.me)');
      });
    });
  }
})();
