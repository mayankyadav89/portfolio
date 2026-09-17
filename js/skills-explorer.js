/**
 * ============================================================================
 * SKILLS TAXONOMY EXPLORER — Mayank Yadav Founder Digital HQ
 * 100% Custom Interactive Typographic Skills Matrix
 * ============================================================================
 */

(function () {
  'use strict';

  class SkillsExplorer {
    constructor() {
      this.container = document.getElementById('skills-explorer-root');
      this.data = window.HQ_DATA && window.HQ_DATA.skills ? window.HQ_DATA.skills : null;
      this.activeCategoryId = 'all'; // default: 'all' or 'engineering'
      this.searchQuery = '';
      this.init();
    }

    init() {
      if (!this.container) return;

      if (!this.data) {
        if (typeof SKILLS_DATA !== 'undefined') {
          this.data = SKILLS_DATA;
        } else {
          return;
        }
      }

      this.render();
      this.bindEvents();
    }

    render() {
      const categories = this.data.categories || [];
      const totalSkillsCount = categories.reduce((acc, cat) => acc + (cat.skills ? cat.skills.length : 0), 0);

      // Build HTML
      let html = `
        <div class="skills-explorer-container">
          <!-- Control Strip: Category Tabs & Metrics -->
          <div class="skills-nav-strip">
            <div class="skills-tab-list" role="tablist" aria-label="Skills Categories">
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
          </div>

          <!-- Skills Display Grid -->
          <div class="skills-content-area" id="skills-content-area">
      `;

      const displayCategories = this.activeCategoryId === 'all'
        ? categories
        : categories.filter(c => c.id === this.activeCategoryId);

      displayCategories.forEach(cat => {
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

        (cat.skills || []).forEach((skill, sIdx) => {
          const tagsHtml = (skill.tags || []).map(t => `<span class="skill-pill-tag">${t}</span>`).join('');
          html += `
            <div class="skill-matrix-card" tabindex="0" data-skill-name="${skill.name}">
              <div class="smc-header">
                <div class="smc-title">${skill.name}</div>
                <span class="smc-marker">&middot;</span>
              </div>
              <p class="smc-context">${skill.context}</p>
              <div class="smc-tags-row">${tagsHtml}</div>
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
        </div>
      `;

      this.container.innerHTML = html;
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
          }
        }
      });

      // Keyboard navigation for tabs
      this.container.addEventListener('keydown', (e) => {
        const currentTab = document.activeElement;
        if (currentTab && currentTab.classList.contains('skill-tab-btn')) {
          const tabs = Array.from(this.container.querySelectorAll('.skill-tab-btn'));
          const idx = tabs.indexOf(currentTab);
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const next = tabs[(idx + 1) % tabs.length];
            next.focus();
            next.click();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
            prev.focus();
            prev.click();
          }
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new SkillsExplorer();
  });
})();
