/**
 * ============================================================================
 * CONNECTIONS & EXPERIENCE INTERACTIVE CONTROLLER — Mayank Yadav Digital HQ
 * Bespoke 2D Editorial Directory & Multi-Dimensional Experience Architecture
 * ============================================================================
 */

(function () {
  'use strict';

  // ===== EXPERIENCE MATRIX COMPONENT =====
  class ExperienceController {
    constructor() {
      this.container = document.getElementById('experience-root') || document.querySelector('.experience-timeline');
      this.data = window.HQ_DATA && window.HQ_DATA.experience ? window.HQ_DATA.experience : (typeof EXPERIENCE_DATA !== 'undefined' ? EXPERIENCE_DATA : []);
      this.communityData = window.HQ_DATA && window.HQ_DATA.community ? window.HQ_DATA.community : (typeof COMMUNITY_DATA !== 'undefined' ? COMMUNITY_DATA : []);
      this.activeDimension = 'all';
      this.init();
    }

    init() {
      if (!this.container) return;
      this.render();
      this.bindEvents();
    }

    render() {
      const filtered = this.activeDimension === 'all'
        ? this.data
        : this.data.filter(item => {
            const dims = (item.dimensions || []).map(d => d.toLowerCase());
            if (this.activeDimension === 'ai') return dims.some(d => d.includes('ai') || d.includes('nlp') || d.includes('machine'));
            if (this.activeDimension === 'marketplace') return dims.some(d => d.includes('marketplace') || d.includes('spatial') || d.includes('escrow'));
            if (this.activeDimension === 'web3') return dims.some(d => d.includes('web3') || d.includes('identity') || d.includes('zk') || d.includes('tokenomics'));
            if (this.activeDimension === 'ecosystem') return dims.some(d => d.includes('community') || d.includes('bd') || d.includes('growth') || d.includes('leadership'));
            return true;
          });

      let html = `
        <div class="exp-interactive-container">
          <!-- Dimension Filter Navigation -->
          <div class="exp-filters-bar" role="tablist" aria-label="Filter experience by dimension">
            <button type="button" class="exp-filter-btn ${this.activeDimension === 'all' ? 'active' : ''}" data-dim="all" role="tab" aria-selected="${this.activeDimension === 'all'}">
              <span>All Dimensions (${this.data.length})</span>
            </button>
            <button type="button" class="exp-filter-btn ${this.activeDimension === 'ai' ? 'active' : ''}" data-dim="ai" role="tab" aria-selected="${this.activeDimension === 'ai'}">
              <span class="dim-dot cyan"></span>
              <span>AI &amp; Systems</span>
            </button>
            <button type="button" class="exp-filter-btn ${this.activeDimension === 'marketplace' ? 'active' : ''}" data-dim="marketplace" role="tab" aria-selected="${this.activeDimension === 'marketplace'}">
              <span class="dim-dot emerald"></span>
              <span>Marketplaces</span>
            </button>
            <button type="button" class="exp-filter-btn ${this.activeDimension === 'web3' ? 'active' : ''}" data-dim="web3" role="tab" aria-selected="${this.activeDimension === 'web3'}">
              <span class="dim-dot violet"></span>
              <span>Web3 &amp; Identity</span>
            </button>
            <button type="button" class="exp-filter-btn ${this.activeDimension === 'ecosystem' ? 'active' : ''}" data-dim="ecosystem" role="tab" aria-selected="${this.activeDimension === 'ecosystem'}">
              <span class="dim-dot amber"></span>
              <span>Ecosystem &amp; BD</span>
            </button>
          </div>

          <!-- Experience Items List -->
          <div class="exp-ledger-list">
      `;

      filtered.forEach(item => {
        const isGetNextIn = item.id === 'getnextin-product';
        const isMRIG = item.id === 'mrig-core';
        const isRentro = item.id === 'rentro-product';
        const isCrypticard = item.id === 'crypticard-core';
        const isKoii = item.id === 'koii-leadership';
        const isVictus = item.id === 'victus-research';

        const dimensionsHtml = (item.dimensions || []).map(dim => `<span class="exp-dim-tag">${dim}</span>`).join('');
        const highlightsHtml = (item.highlights || []).map(h => `<li>${h}</li>`).join('');
        const linksHtml = (item.links || []).map(link => `
          <a href="${link.url}" ${link.internal ? '' : 'target="_blank" rel="noopener noreferrer"'} class="btn ${link.url.includes('mrig.tech') || link.internal ? 'btn-primary' : 'btn-outline'} btn-sm">
            <span>${link.label}</span>
          </a>
        `).join('');

        let visualAnchor = '';
        if (isGetNextIn) {
          visualAnchor = `
            <div class="exp-visual-anchor getnextin-anchor" title="GetNextIn AI Product">
              <img src="assets/getnextin-icon.png" alt="GetNextIn Product Icon" class="exp-product-icon getnextin-icon-glow" width="48" height="48" loading="lazy">
            </div>
          `;
        } else if (isMRIG) {
          visualAnchor = `
            <div class="exp-visual-anchor mrig-anchor" title="MRIG Parent Ecosystem">
              <img src="assets/mrig-emblem.png" alt="MRIG Emblem" class="exp-product-icon" width="48" height="48" loading="lazy">
            </div>
          `;
        } else if (isRentro) {
          visualAnchor = `
            <div class="exp-visual-anchor rentro-anchor" title="Rentro Marketplace">
              <img src="assets/rentro-icon.png" alt="Rentro App Icon" class="exp-product-icon rentro-icon-glow" width="48" height="48" loading="lazy">
            </div>
          `;
        } else if (isCrypticard) {
          visualAnchor = `
            <div class="exp-visual-anchor crypticard-anchor" title="Crypticard Web3 Identity">
              <img src="assets/crypticard-icon.png" alt="Crypticard App Icon" class="exp-product-icon crypticard-icon-glow" width="48" height="48" loading="lazy">
            </div>
          `;
        } else if (isKoii) {
          visualAnchor = `
            <div class="exp-visual-anchor koii-anchor" title="Koii Network">
              <img src="assets/koii-logo.png" alt="Koii Network Logo" class="exp-product-icon koii-icon-glow" width="48" height="48" loading="lazy">
            </div>
          `;
        } else if (isVictus) {
          visualAnchor = `
            <div class="exp-visual-anchor victus-anchor" title="Victus Global">
              <img src="assets/victus-logo.png" alt="Victus Global Logo" class="exp-product-icon victus-icon-glow" width="48" height="48" loading="lazy">
            </div>
          `;
        } else {
          visualAnchor = `
            <div class="exp-visual-anchor generic-anchor">
              <span class="exp-index-num">${item.index}</span>
            </div>
          `;
        }

        html += `
          <article class="exp-ledger-row ${isGetNextIn ? 'exp-row-highlight' : ''}" data-exp-id="${item.id}" tabindex="0">
            <div class="exp-ledger-left">
              ${visualAnchor}
              <div class="exp-header-meta">
                <div class="exp-org-row">
                  <span class="exp-org-title">${item.organization}</span>
                  ${item.parentEntity ? `<span class="exp-parent-tag">${item.parentEntity}</span>` : ''}
                  ${item.badge ? `<span class="badge badge-${item.badgeType || 'violet'}">${item.badge}</span>` : ''}
                </div>
                <h3 class="exp-role-name">${item.role}</h3>
                <div class="exp-timeline-period">${item.period} &middot; ${item.location}</div>
              </div>
            </div>

            <div class="exp-ledger-body">
              <p class="exp-headline-lead">${item.headline}</p>
              <ul class="exp-highlights-list">
                ${highlightsHtml}
              </ul>
              <div class="exp-dimensions-row">
                <span class="exp-dim-label">Dimensions:</span>
                ${dimensionsHtml}
              </div>
              ${linksHtml ? `<div class="exp-actions-strip">${linksHtml}</div>` : ''}
            </div>
          </article>
        `;
      });

      html += `
          </div>

          <!-- Community & Hackathon Track Strip -->
          <div class="exp-community-card">
            <div class="exp-comm-header">
              <div class="exp-comm-badge">COMMUNITY &amp; HACKATHONS</div>
              <h4 class="exp-comm-title">Ecosystem Contributions &amp; Track Wins</h4>
            </div>
            <div class="exp-comm-grid">
      `;

      this.communityData.forEach(c => {
        html += `
          <div class="exp-comm-item">
            <div class="exp-comm-item-header">
              <span class="exp-comm-name">${c.name}</span>
              <span class="exp-comm-year">${c.period}</span>
            </div>
            <div class="exp-comm-role">${c.role}</div>
            <p class="exp-comm-desc">${c.desc}</p>
          </div>
        `;
      });

      html += `
            </div>
          </div>
        </div>
      `;

      this.container.innerHTML = html;
    }

    bindEvents() {
      this.container.addEventListener('click', (e) => {
        const btn = e.target.closest('.exp-filter-btn');
        if (btn) {
          const dim = btn.getAttribute('data-dim');
          if (dim && dim !== this.activeDimension) {
            this.activeDimension = dim;
            this.render();
          }
        }
      });
    }
  }

  // ===== CONNECTIONS DIRECTORY COMPONENT =====
  class ConnectionsController {
    constructor() {
      this.container = document.getElementById('connections-root') || document.querySelector('.web3-address-grid');
      this.data = window.HQ_DATA && window.HQ_DATA.connections ? window.HQ_DATA.connections : (typeof CONNECTIONS_DATA !== 'undefined' ? CONNECTIONS_DATA : null);
      this.init();
    }

    init() {
      if (!this.container || !this.data) return;
      this.render();
      this.bindCopyEvents();
    }

    render() {
      const ecosystems = this.data.ecosystems || [];

      let html = `
        <div class="connections-directory-wrapper">
      `;

      ecosystems.forEach(group => {
        html += `
          <div class="conn-group-block">
            <div class="conn-group-header">
              <div class="conn-group-info">
                <h3 class="conn-group-title">${group.category}</h3>
                <p class="conn-group-desc">${group.description}</p>
              </div>
            </div>

            <div class="conn-cards-grid">
        `;

        group.items.forEach(item => {
          const isAddress = !!item.shortValue;
          const displayHandle = isAddress ? (item.shortValue || item.handle) : item.handle;

          html += `
            <div class="conn-card ${item.canCopy ? 'conn-card--copyable' : ''}" data-conn-id="${item.id}" tabindex="0">
              <div class="conn-card-top">
                <div class="conn-platform-meta">
                  <span class="conn-platform-name">${item.platform}</span>
                  ${item.badge ? `<span class="badge badge-${item.badgeType || 'violet'}">${item.badge}</span>` : ''}
                </div>
                <div class="conn-action-icons">
                  ${item.url ? `
                    <a href="${item.url}" ${item.isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="conn-icon-btn conn-link-btn" title="Open ${item.platform} (external link)" aria-label="Open ${item.platform}">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  ` : ''}
                  ${item.canCopy ? `
                    <button type="button" class="conn-icon-btn conn-copy-btn" data-copy-val="${item.rawValue || item.handle}" title="Copy ${item.platform} identity" aria-label="Copy ${item.platform} identity">
                      <svg class="copy-icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      <span class="copy-status-text" aria-live="polite"></span>
                    </button>
                  ` : ''}
                </div>
              </div>

              <div class="conn-identity-row">
                <span class="conn-identity-handle ${isAddress ? 'conn-handle-mono' : ''}" title="${item.rawValue || item.handle}">${displayHandle}</span>
              </div>

              <p class="conn-context-desc">${item.context}</p>

              <div class="conn-card-footer">
                ${item.canCopy ? `
                  <button type="button" class="conn-text-action conn-inline-copy-btn" data-copy-val="${item.rawValue || item.handle}">
                    <span class="action-label">Click to Copy</span>
                    <span class="action-feedback">Copied! ✓</span>
                  </button>
                ` : ''}
                ${item.url ? `
                  <a href="${item.url}" ${item.isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="conn-text-action conn-inline-link">
                    <span>Visit Profile &nearr;</span>
                  </a>
                ` : ''}
              </div>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      html += `
        </div>
      `;

      this.container.innerHTML = html;
    }

    bindCopyEvents() {
      this.container.addEventListener('click', (e) => {
        const copyTrigger = e.target.closest('.conn-copy-btn, .conn-inline-copy-btn');
        if (copyTrigger) {
          e.preventDefault();
          e.stopPropagation();
          const val = copyTrigger.getAttribute('data-copy-val');
          if (val) {
            this.copyToClipboard(val, copyTrigger);
          }
        }
      });
    }

    copyToClipboard(text, triggerEl) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showCopiedState(triggerEl);
        }).catch(() => {
          this.fallbackCopy(text, triggerEl);
        });
      } else {
        this.fallbackCopy(text, triggerEl);
      }
    }

    fallbackCopy(text, triggerEl) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this.showCopiedState(triggerEl);
      } catch (err) {
        console.warn('Clipboard copy failed', err);
      }
    }

    showCopiedState(triggerEl) {
      const card = triggerEl.closest('.conn-card');
      if (!card) return;

      card.classList.add('copied-active');
      const feedback = card.querySelector('.action-feedback');
      const statusText = card.querySelector('.copy-status-text');

      if (feedback) feedback.textContent = 'Copied to clipboard! ✓';
      if (statusText) statusText.textContent = 'Copied';

      setTimeout(() => {
        card.classList.remove('copied-active');
        if (statusText) statusText.textContent = '';
      }, 2200);
    }
  }

  // Initialize both on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    new ExperienceController();
    new ConnectionsController();
  });
})();
