/**
 * ============================================================================
 * SKILLS TAXONOMY EXPLORER — Mayank Yadav Founder Digital HQ
 * Dynamic Skills Matrix with Search, Category Filter & Bi-Directional Cross-Highlighting
 * ============================================================================
 */

(function () {
  'use strict';

  class SkillsExplorer {
    constructor() {
      this.container = document.getElementById('skills-explorer-root');
      this.data = (window.HQ_DATA && window.HQ_DATA.skills) ? window.HQ_DATA.skills : (typeof SKILLS_DATA !== 'undefined' ? SKILLS_DATA : null);
      this.activeCategoryId = 'all';
      this.searchQuery = '';
      this.init();
    }

    init() {
      if (!this.container) return;
      if (!this.data) return;

      this.render();
      this.bindEvents();
      this.setupCrossHighlighting();
    }

    render() {
      const categories = this.data.categories || [];
      const totalSkillsCount = categories.reduce((acc, cat) => acc + (cat.skills ? cat.skills.length : 0), 0);

      let html = `
        <div class="skills-explorer-container">
          <!-- Search & Filter Controls -->
          <div class="skills-controls-bar" style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
            <div class="skills-tab-list" role="tablist" aria-label="Skills Categories" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <button type="button" class="skill-tab-btn ${this.activeCategoryId === 'all' ? 'active' : ''}" data-cat-id="all" role="tab" aria-selected="${this.activeCategoryId === 'all'}">
                <span class="tab-idx">00</span>
                <span class="tab-label">All Stacks (${totalSkillsCount})</span>
              </button>
      `;

      categories.forEach(cat => {
        const isActive = this.activeCategoryId === cat.id;
        const count = cat.skills ? cat.skills.length : 0;
        html += `
          <button type="button" class="skill-tab-btn ${isActive ? 'active' : ''}" data-cat-id="${cat.id}" role="tab" aria-selected="${isActive}">
            <span class="tab-idx">${cat.index}</span>
            <span class="tab-label">${cat.name} (${count})</span>
          </button>
        `;
      });

      html += `
            </div>
            <div class="skills-search-wrapper" style="position: relative; min-width: 220px; flex: 1; max-width: 320px;">
              <input type="text" id="skills-search-input" class="skills-search-input" placeholder="Filter competencies (e.g. PostGIS, NLP)..." value="${escapeHtml(this.searchQuery)}" style="width: 100%; background: rgba(15, 15, 22, 0.7); border: 1px solid rgba(167, 139, 250, 0.25); border-radius: 20px; padding: 0.45rem 1rem 0.45rem 2rem; color: #fff; font-size: 0.8rem; font-family: var(--font-mono, monospace); outline: none;" />
              <svg style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 13px; height: 13px; color: var(--text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>

          <!-- Skills Display Grid -->
          <div class="skills-content-area" id="skills-content-area">
      `;

      const q = this.searchQuery.toLowerCase().trim();
      let displayCategories = this.activeCategoryId === 'all'
        ? categories
        : categories.filter(c => c.id === this.activeCategoryId);

      let totalRendered = 0;

      displayCategories.forEach(cat => {
        let skills = cat.skills || [];
        if (q) {
          skills = skills.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.context.toLowerCase().includes(q) ||
            (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
          );
        }

        if (skills.length === 0 && q) return;

        totalRendered += skills.length;

        html += `
          <div class="skills-category-group" data-category="${cat.id}">
            <div class="skills-group-header">
              <div class="skills-group-index">${cat.index}</div>
              <div class="skills-group-text">
                <h3 class="skills-group-title">${cat.name}</h3>
                <div class="skills-group-headline">${cat.headline}</div>
                <p class="skills-group-desc">${cat.description}</p>
              </div>
            </div>

            <div class="skills-matrix-cards-grid">
        `;

        skills.forEach(skill => {
          const tagsHtml = (skill.tags || []).map(t => `<span class="skill-pill-tag">${escapeHtml(t)}</span>`).join('');
          const relatedTarget = getRelatedTarget(skill.name, skill.tags);
          html += `
            <div class="skill-matrix-card" tabindex="0" data-skill-name="${escapeHtml(skill.name)}" data-target-entity="${relatedTarget}">
              <div class="smc-header">
                <div class="smc-title">${escapeHtml(skill.name)}</div>
                <span class="smc-marker">&middot;</span>
              </div>
              <p class="smc-context">${escapeHtml(skill.context)}</p>
              <div class="smc-tags-row">${tagsHtml}</div>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      if (totalRendered === 0) {
        html += `
          <div style="padding: 3rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
            No technical skills found matching "<span style="color: var(--text-primary);">${escapeHtml(this.searchQuery)}</span>".
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;

      this.container.innerHTML = html;

      // Keep focus on search input if user was typing
      const searchInput = this.container.querySelector('#skills-search-input');
      if (searchInput && this.searchQuery) {
        searchInput.focus();
        searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
      }
    }

    bindEvents() {
      // Tab switching
      this.container.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.skill-tab-btn');
        if (tabBtn) {
          const catId = tabBtn.getAttribute('data-cat-id');
          if (catId && catId !== this.activeCategoryId) {
            this.activeCategoryId = catId;
            this.render();
            this.bindSearchEvent();
          }
        }
      });

      this.bindSearchEvent();
    }

    bindSearchEvent() {
      const searchInput = this.container.querySelector('#skills-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value;
          this.render();
          this.bindSearchEvent();
        });
      }
    }

    setupCrossHighlighting() {
      this.container.addEventListener('mouseenter', (e) => {
        const card = e.target.closest('.skill-matrix-card');
        if (!card) return;
        const target = card.getAttribute('data-target-entity');
        if (target) {
          highlightTargetEntity(target, true);
        }
      }, true);

      this.container.addEventListener('mouseleave', (e) => {
        const card = e.target.closest('.skill-matrix-card');
        if (!card) return;
        const target = card.getAttribute('data-target-entity');
        if (target) {
          highlightTargetEntity(target, false);
        }
      }, true);
    }
  }

  function getRelatedTarget(skillName, tags = []) {
    const combined = (skillName + ' ' + tags.join(' ')).toLowerCase();
    if (combined.includes('rentro') || combined.includes('postgis') || combined.includes('redis') || combined.includes('marketplace') || combined.includes('escrow')) {
      return 'rentro';
    }
    if (combined.includes('getnextin') || combined.includes('nlp') || combined.includes('screening') || combined.includes('verification model')) {
      return 'getnextin';
    }
    if (combined.includes('crypticard') || combined.includes('did') || combined.includes('zkp') || combined.includes('credential')) {
      return 'crypticard';
    }
    if (combined.includes('svg') || combined.includes('aegis') || combined.includes('4337') || combined.includes('passkey')) {
      return 'svg-aegisvault';
    }
    if (combined.includes('koii')) {
      return 'koii';
    }
    if (combined.includes('victus')) {
      return 'victus';
    }
    return '';
  }

  function highlightTargetEntity(entityKey, activate) {
    if (!entityKey) return;
    const projectCards = document.querySelectorAll(`[data-project="${entityKey}"], [data-entity="${entityKey}"], #project-${entityKey}, .card-${entityKey}`);
    projectCards.forEach(el => {
      if (activate) {
        el.classList.add('cross-highlight-active');
      } else {
        el.classList.remove('cross-highlight-active');
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  document.addEventListener('DOMContentLoaded', () => {
    new SkillsExplorer();
  });
})();
