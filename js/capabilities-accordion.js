/**
 * ============================================================================
 * CAPABILITIES INTERACTIVE ACCORDION CONTROLLER — Mayank Yadav Digital HQ
 * Fully Accessible, Smooth Animated Editorial Capability Expansion Matrix
 * ============================================================================
 */

(function () {
  'use strict';

  class CapabilitiesController {
    constructor() {
      this.container = document.getElementById('capabilities-accordion') || document.querySelector('.capabilities-list');
      this.data = window.HQ_DATA && window.HQ_DATA.capabilities
        ? window.HQ_DATA.capabilities
        : (typeof CAPABILITIES_DATA !== 'undefined' ? CAPABILITIES_DATA : []);
      this.openId = null; // Currently open capability item ID
      this.init();
    }

    init() {
      if (!this.container || !this.data || this.data.length === 0) return;
      this.render();
      this.bindEvents();
    }

    render() {
      let html = '';

      this.data.forEach((item, index) => {
        const isOpen = this.openId === item.id;
        const skillsHtml = (item.skills || []).map(s => `<span class="cap-skill-pill">${s}</span>`).join('');
        const techHtml = (item.technologies || []).map(t => `<span class="cap-tech-pill">${t}</span>`).join('');
        const workLinksHtml = (item.relatedWork || []).map(w => `
          <a href="${w.url}" ${w.isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="cap-work-card">
            <div class="cap-work-info">
              <span class="cap-work-title">${w.name}</span>
              <span class="cap-work-sub">${w.role}</span>
            </div>
            <span class="cap-work-arrow" aria-hidden="true">${w.isExternal ? '&nearr;' : '&rarr;'}</span>
          </a>
        `).join('');

        html += `
          <div class="capability-item ${isOpen ? 'is-open' : ''}" data-cap-id="${item.id}">
            <button
              type="button"
              class="capability-trigger"
              id="cap-btn-${item.id}"
              aria-expanded="${isOpen ? 'true' : 'false'}"
              aria-controls="cap-panel-${item.id}"
              aria-label="${item.title} — ${isOpen ? 'Collapse details' : 'Expand details'}"
            >
              <div class="cap-left-group">
                <span class="cap-index">${item.index}</span>
                <div class="cap-header-content">
                  <h3 class="cap-name">${item.title}</h3>
                  <p class="cap-desc">${item.tagline}</p>
                </div>
              </div>

              <div class="cap-arrow-wrapper" aria-hidden="true">
                <svg class="cap-arrow-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </button>

            <div
              class="capability-panel-wrapper"
              id="cap-panel-${item.id}"
              role="region"
              aria-labelledby="cap-btn-${item.id}"
              ${isOpen ? '' : 'hidden'}
            >
              <div class="capability-panel-inner">
                <div class="cap-expansion-divider"></div>
                <div class="cap-expansion-grid">
                  <!-- Focus / Deep Context -->
                  <div class="cap-expansion-section cap-focus-section">
                    <span class="cap-section-eyebrow">
                      <span class="cap-dot ${item.accentDot || 'violet'}"></span>
                      ARCHITECTURAL FOCUS &amp; SCOPE
                    </span>
                    <p class="cap-focus-text">${item.focus}</p>
                  </div>

                  <!-- Two-Column Meta: Skills & Technologies -->
                  <div class="cap-expansion-columns">
                    <div class="cap-expansion-section">
                      <span class="cap-section-eyebrow">VERIFIED CAPABILITIES &amp; METHODS</span>
                      <div class="cap-pills-list">
                        ${skillsHtml}
                      </div>
                    </div>

                    ${item.technologies && item.technologies.length > 0 ? `
                      <div class="cap-expansion-section">
                        <span class="cap-section-eyebrow">CORE SYSTEMS &amp; TOOLING</span>
                        <div class="cap-pills-list">
                          ${techHtml}
                        </div>
                      </div>
                    ` : ''}
                  </div>

                  <!-- Related Ventures & Real Work -->
                  ${workLinksHtml ? `
                    <div class="cap-expansion-section cap-work-section">
                      <span class="cap-section-eyebrow">CONNECTED VENTURES &amp; IMPLEMENTATIONS</span>
                      <div class="cap-work-grid">
                        ${workLinksHtml}
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        `;
      });

      this.container.innerHTML = html;
    }

    bindEvents() {
      // Event delegation for clicks on the entire capability trigger
      this.container.addEventListener('click', (e) => {
        const trigger = e.target.closest('.capability-trigger');
        if (trigger) {
          e.preventDefault();
          const capItem = trigger.closest('.capability-item');
          if (capItem) {
            const capId = capItem.getAttribute('data-cap-id');
            this.toggle(capId);
          }
        }
      });

      // Keyboard navigation (Arrow Up/Down, Home, End)
      this.container.addEventListener('keydown', (e) => {
        const triggers = Array.from(this.container.querySelectorAll('.capability-trigger'));
        const currentTrigger = document.activeElement.closest('.capability-trigger');
        if (!currentTrigger) return;

        const currentIndex = triggers.indexOf(currentTrigger);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % triggers.length;
          triggers[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + triggers.length) % triggers.length;
          triggers[prevIndex].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          triggers[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          triggers[triggers.length - 1].focus();
        }
      });
    }

    toggle(capId) {
      if (this.openId === capId) {
        // Close current
        this.openId = null;
      } else {
        // Open new
        this.openId = capId;
      }

      // Update DOM states smoothly
      const allItems = this.container.querySelectorAll('.capability-item');
      allItems.forEach(item => {
        const id = item.getAttribute('data-cap-id');
        const trigger = item.querySelector('.capability-trigger');
        const panel = item.querySelector('.capability-panel-wrapper');
        const isCurrentOpen = this.openId === id;

        if (isCurrentOpen) {
          item.classList.add('is-open');
          if (trigger) {
            trigger.setAttribute('aria-expanded', 'true');
            const title = item.querySelector('.cap-name')?.textContent || '';
            trigger.setAttribute('aria-label', `${title} — Collapse details`);
          }
          if (panel) {
            panel.removeAttribute('hidden');
          }
        } else {
          item.classList.remove('is-open');
          if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            const title = item.querySelector('.cap-name')?.textContent || '';
            trigger.setAttribute('aria-label', `${title} — Expand details`);
          }
          if (panel) {
            // Wait for transition to end before setting hidden attribute
            setTimeout(() => {
              if (!item.classList.contains('is-open')) {
                panel.setAttribute('hidden', '');
              }
            }, 350);
          }
        }
      });
    }
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    new CapabilitiesController();
  });
})();
