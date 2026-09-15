/**
 * ============================================================================
 * CASE STUDY CONTROLLER & TOC ENGINE — Mayank Yadav Founder Digital HQ
 * ============================================================================
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initTableOfContents();
    initReadingProgressBar();
  });

  function initTableOfContents() {
    const tocList = document.querySelector('.cs-toc-list');
    const sections = document.querySelectorAll('.cs-section');
    if (!tocList || !sections.length) return;

    // Track active section on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocList.querySelectorAll('.cs-toc-link').forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(sec => observer.observe(sec));
  }

  function initReadingProgressBar() {
    let progressBar = document.getElementById('reading-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'reading-progress-bar';
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--accent-violet), var(--accent-cyan));
        z-index: 99999;
        width: 0%;
        transition: width 0.05s ease-out;
        pointer-events: none;
      `;
      document.body.appendChild(progressBar);
    }

    function updateProgress() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(Math.max((window.scrollY / scrollHeight) * 100, 0), 100);
        progressBar.style.width = progress.toFixed(2) + '%';
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }
})();
