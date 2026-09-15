/**
 * ============================================================================
 * BLOCKCHAIN LIVING LEDGER ENGINE — Mayank Yadav Founder Digital HQ
 * Concept: GENESIS BLOCK -> BLOCK 001 -> BLOCK 002 -> BLOCK 003 -> CURRENT HEAD
 * ============================================================================
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initBlockchainLedger();
  });

  function initBlockchainLedger() {
    const container = document.getElementById('blockchain-stream-container');
    const ribbonContainer = document.getElementById('blockchain-ribbon-container');
    const searchInput = document.getElementById('ledger-search-input');
    if (!container) return;

    const blocks = (window.HQ && window.HQ.getBlocks) ? window.HQ.getBlocks() : [];
    if (!blocks.length) return;

    let activeFilter = 'ALL';
    let searchQuery = '';

    // Create Inspector Modal
    let inspectorOverlay = document.getElementById('inspector-overlay');
    if (!inspectorOverlay) {
      inspectorOverlay = document.createElement('div');
      inspectorOverlay.id = 'inspector-overlay';
      inspectorOverlay.className = 'inspector-overlay';
      inspectorOverlay.innerHTML = `
        <div class="inspector-modal" role="dialog" aria-modal="true" aria-label="Cryptographic Block Inspector">
          <div class="inspector-header">
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <span class="pulse-dot" style="background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan);"></span>
              <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--text-primary);" id="inspector-modal-title">CRYPTOGRAPHIC BLOCK INSPECTOR</span>
            </div>
            <button id="inspector-close-btn" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.25rem;">&times;</button>
          </div>
          <div class="inspector-body" id="inspector-modal-body"></div>
        </div>
      `;
      document.body.appendChild(inspectorOverlay);

      const closeBtn = inspectorOverlay.querySelector('#inspector-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          inspectorOverlay.classList.remove('active');
        });
      }

      inspectorOverlay.addEventListener('click', (e) => {
        if (e.target === inspectorOverlay) inspectorOverlay.classList.remove('active');
      });
    }

    function openInspector(block) {
      const modalTitle = inspectorOverlay.querySelector('#inspector-modal-title');
      const modalBody = inspectorOverlay.querySelector('#inspector-modal-body');
      if (!modalTitle || !modalBody) return;

      modalTitle.textContent = `INSPECTING ${block.blockId} // ${block.name.toUpperCase()}`;

      const inSubdir = window.location.pathname.includes('/projects/');
      let linkUrl = block.links ? block.links.caseStudy : null;
      if (linkUrl && inSubdir && !linkUrl.startsWith('http') && !linkUrl.startsWith('/')) {
        linkUrl = '../' + linkUrl;
      }

      modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.35rem; color: var(--text-primary);">${escapeHtml(block.title)}</h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6;">${escapeHtml(block.summary)}</p>
        </div>

        <div class="inspector-grid">
          <span class="inspector-key">Block Height:</span>
          <span class="inspector-val" style="color: var(--accent-cyan); font-weight: 700;">#${escapeHtml(block.blockNumber)} (${escapeHtml(block.blockId)})</span>

          <span class="inspector-key">Block Status:</span>
          <span class="inspector-val" style="color: var(--accent-emerald); font-weight: 600;">${escapeHtml(block.status)}</span>

          <span class="inspector-key">Current Hash:</span>
          <span class="inspector-val">${escapeHtml(block.hash)}</span>

          <span class="inspector-key">Previous Hash:</span>
          <span class="inspector-val">${escapeHtml(block.previousHash)}</span>

          <span class="inspector-key">Merkle Root:</span>
          <span class="inspector-val">${escapeHtml(block.merkleRoot || '0x4e7a892b1c3d5f7a...')}</span>

          <span class="inspector-key">Nonce:</span>
          <span class="inspector-val">${escapeHtml(block.nonce)}</span>

          <span class="inspector-key">Difficulty:</span>
          <span class="inspector-val">${escapeHtml(block.difficulty || '0x1b0404cb')}</span>

          <span class="inspector-key">Timestamp:</span>
          <span class="inspector-val">${escapeHtml(block.timestamp)}</span>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-violet); text-transform: uppercase; margin-bottom: 0.6rem;">// VERIFIED TRANSACTIONS &amp; DELIVERABLES</h4>
          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            ${(block.transactions || []).map(tx => `
              <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); padding: 0.4rem 0.65rem; border-radius: 4px;">
                ${escapeHtml(tx)}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-default); flex-wrap: wrap; gap: 0.75rem;">
          <button class="btn btn-secondary btn-sm" id="inspector-copy-hash-btn">
            <span>Copy Full Hash</span>
          </button>
          ${linkUrl ? `
            <a href="${linkUrl}" class="btn btn-primary btn-sm">
              <span>${escapeHtml(block.links.actionText || 'Open Deep Case Study →')}</span>
            </a>
          ` : ''}
        </div>
      `;

      const copyBtn = modalBody.querySelector('#inspector-copy-hash-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(block.hash).then(() => {
            const orig = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span style="color: var(--accent-emerald);">Copied!</span>';
            setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
          });
        });
      }

      inspectorOverlay.classList.add('active');
    }

    function renderRibbon() {
      if (!ribbonContainer) return;
      ribbonContainer.innerHTML = `
        <div class="blockchain-ribbon">
          ${blocks.map((b, idx) => `
            <div class="ribbon-node" data-id="${b.blockId}">
              <span class="ribbon-node-num">#${b.blockNumber}</span>
              <span class="ribbon-node-title">${escapeHtml(b.name)}</span>
            </div>
            ${idx < blocks.length - 1 ? `<span class="ribbon-node-arrow">&rarr;</span>` : ''}
          `).join('')}
        </div>
      `;

      ribbonContainer.querySelectorAll('.ribbon-node').forEach(node => {
        node.addEventListener('click', () => {
          const id = node.getAttribute('data-id');
          const target = blocks.find(b => b.blockId === id);
          if (target) openInspector(target);
        });
      });
    }

    function renderBlocks() {
      const filtered = blocks.filter(b => {
        let matchCat = true;
        if (activeFilter === 'STARTUP') matchCat = (b.type === 'VENTURE' || b.type === 'IDENTITY');
        else if (activeFilter === 'PROTOCOL') matchCat = (b.type === 'PROTOCOL');
        else if (activeFilter === 'MILESTONE') matchCat = (b.type === 'MILESTONE' || b.type === 'LEADERSHIP' || b.type === 'GENESIS');

        let matchQuery = true;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          matchQuery = b.title.toLowerCase().includes(q) ||
                       b.summary.toLowerCase().includes(q) ||
                       b.name.toLowerCase().includes(q) ||
                       (b.technologies || []).some(t => t.toLowerCase().includes(q));
        }

        return matchCat && matchQuery;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="padding: 3rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-default);">
            No blocks found matching "<span style="color: var(--text-primary);">${escapeHtml(searchQuery)}</span>" in this filter category.
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="blockchain-chain-line">
          <div class="blockchain-chain-packet"></div>
        </div>
      `;

      filtered.forEach((block) => {
        const isCurrentHead = block.blockId === 'CURRENT-HEAD';
        const nodeEl = document.createElement('div');
        nodeEl.className = `block-node ${isCurrentHead ? 'active-head' : ''}`;
        nodeEl.setAttribute('data-id', block.blockId);

        const techTagsHtml = (block.technologies || [])
          .map(t => `<span class="block-tech-tag">${escapeHtml(t)}</span>`)
          .join('');

        const txsHtml = (block.transactions || [])
          .map(tx => `<div class="block-tx-item">${escapeHtml(tx)}</div>`)
          .join('');

        const inSubdir = window.location.pathname.includes('/projects/');
        let linkUrl = block.links ? block.links.caseStudy : '#';
        if (linkUrl && inSubdir && !linkUrl.startsWith('http') && !linkUrl.startsWith('/')) {
          linkUrl = '../' + linkUrl;
        }

        const badgeClass = block.badgeColor ? `badge-${block.badgeColor}` : 'badge-violet';

        nodeEl.innerHTML = `
          <div class="block-node-left">
            <div class="block-badge-icon">
              <span class="block-num-label">${block.blockNumber === '006' ? 'HEAD' : 'BLK'}</span>
              <span class="block-num-val">${block.blockNumber}</span>
            </div>
          </div>
          <div class="block-card">
            <div class="block-card-header">
              <div class="block-title-group">
                <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                  <span class="badge ${badgeClass}">${escapeHtml(block.type)}</span>
                  <span class="badge" style="background: rgba(255,255,255,0.04); border-color: var(--border-subtle); color: var(--text-muted);">
                    ${escapeHtml(block.status)}
                  </span>
                </div>
                <h3>${escapeHtml(block.title)}</h3>
              </div>
              <button class="block-hash-chip" title="Click to copy block hash" data-hash="${block.hash}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span>${block.hash.substring(0, 10)}...${block.hash.substring(block.hash.length - 6)}</span>
              </button>
            </div>

            <div class="block-summary">${escapeHtml(block.summary)}</div>

            <div class="block-tech-tags">${techTagsHtml}</div>

            <div class="block-txs-list">${txsHtml}</div>

            <div class="block-action-bar">
              <button class="block-inspect-btn" data-id="${block.blockId}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>Cryptographic Inspection</span>
              </button>
              ${block.links ? `
                <a href="${linkUrl}" class="block-link">
                  <span>${escapeHtml(block.links.actionText || 'Inspect Block →')}</span>
                </a>
              ` : ''}
            </div>
          </div>
        `;

        container.appendChild(nodeEl);
      });

      // Bind copy hash event
      container.querySelectorAll('.block-hash-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const hash = btn.getAttribute('data-hash');
          navigator.clipboard.writeText(hash).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = `<span style="color: var(--accent-emerald);">Copied Hash!</span>`;
            setTimeout(() => {
              btn.innerHTML = originalText;
            }, 2000);
          });
        });
      });

      // Bind Inspect Button
      container.querySelectorAll('.block-inspect-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const id = btn.getAttribute('data-id');
          const target = blocks.find(b => b.blockId === id);
          if (target) openInspector(target);
        });
      });
    }

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.ledger-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter') || 'ALL';
        renderBlocks();
      });
    });

    // Search Input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderBlocks();
      });
    }

    renderRibbon();
    renderBlocks();

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }
})();
