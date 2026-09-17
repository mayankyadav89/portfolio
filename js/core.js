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
  });

  /* ===== Navbar Scroll Effects ===== */
  function initNavScroll() {
    const nav = document.querySelector('.hq-navbar');
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 40) {
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
    const toggle = document.querySelector('.hq-nav-toggle');
    const links = document.querySelector('.hq-nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
      const expanded = links.classList.contains('active');
      toggle.setAttribute('aria-expanded', expanded);
    });

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
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
            <input type="text" id="cmd-input" class="cmd-input" placeholder="Type a command or search (e.g. MRIG, Genesis, Contact)..." autocomplete="off" spellcheck="false" />
          </div>
          <div class="cmd-results" id="cmd-results"></div>
          <div class="cmd-footer">
            <div class="cmd-shortcuts">
              <span><kbd class="cmd-key">&uarr;&darr;</kbd> Navigate</span>
              <span><kbd class="cmd-key">&crarr;</kbd> Open</span>
              <span><kbd class="cmd-key">ESC</kbd> Close</span>
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

    // Search Index Data
    const searchIndex = [
      { title: "Home / Founder Digital HQ", category: "Navigation", badge: "Page", url: "index.html" },
      { title: "MRIG Ecosystem (Parent Architecture)", category: "Case Study", badge: "Ecosystem", url: "projects/mrig.html" },
      { title: "Rentro: Physical Asset Marketplace (rentro.mrig.tech)", category: "Product", badge: "Marketplace", url: "https://rentro.mrig.tech", external: true },
      { title: "GetNextIn: AI Career Platform (getnextin.mrig.tech)", category: "Product", badge: "AI Platform", url: "https://getnextin.mrig.tech", external: true },
      { title: "Crypticard: Decentralized Identity", category: "Case Study", badge: "Web3", url: "projects/crypticard.html" },
      { title: "SVG AegisVault: ERC-4337 Smart Account", category: "Case Study", badge: "Protocol", url: "projects/svg-aegisvault.html" },
      { title: "Ecoties: Green Tech Ledger", category: "Case Study", badge: "Concept", url: "projects/ecoties.html" },
      { title: "About Mayank Yadav & Philosophy", category: "Navigation", badge: "Story", url: "about.html" },
      { title: "All Projects & Archive", category: "Navigation", badge: "Archive", url: "projects.html" },
      { title: "Experience & Track Record", category: "Navigation", badge: "Leadership", url: "experience.html" },
      { title: "Technical Skills & Matrix", category: "Navigation", badge: "Skills", url: "skills.html" },
      { title: "Direct Contact & Encrypted Hub", category: "Navigation", badge: "Contact", url: "contact.html" },
      { title: "Founder Dossier / CV", category: "Navigation", badge: "CV", url: "resume.html" },
      { title: "Genesis Block (#000)", category: "Living Ledger", badge: "Milestone", url: "index.html#ledger" },
      { title: "GitHub: @mayankyadav89", category: "Social", badge: "OSS", url: "https://github.com/mayankyadav89", external: true },
      { title: "LinkedIn: @mayankyadav89", category: "Social", badge: "Network", url: "https://www.linkedin.com/in/mayankyadav89/", external: true },
      { title: "X / Twitter: @maayankavy07", category: "Social", badge: "Updates", url: "https://x.com/maayankavy07", external: true },
      { title: "Farcaster: @mayankyadav", category: "Social", badge: "Web3", url: "https://farcaster.xyz/mayankyadav", external: true }
    ];

    function openPalette() {
      overlay.classList.add('active');
      input.value = '';
      input.focus();
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
})();
