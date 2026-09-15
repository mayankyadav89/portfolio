/**
 * ============================================================================
 * INTERACTIVE BEHAVIORS & UI COORDINATOR — Mayank Yadav Founder Digital HQ
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero Dynamic Typewriter Effect
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const phrases = [
      'Physical Asset Marketplaces',
      'Artificial Intelligence & ML',
      'ERC-4337 Smart Accounts',
      'Frontier Systems & Startups'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const current = phrases[phraseIndex];
      typedEl.textContent = current.substring(0, charIndex);

      if (!isDeleting && charIndex < current.length) {
        charIndex++;
        setTimeout(typeEffect, 65);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 30);
      } else if (!isDeleting) {
        isDeleting = true;
        setTimeout(typeEffect, 1900);
      } else {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeEffect, 400);
      }
    }
    typeEffect();
  }

  // 2. Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll(
    '.about-content, .build-card, .project-card, .timeline-item, ' +
    '.community-card, .skill-group, .achievement-item, .edu-card, ' +
    '.cert-card, .books-content, .interests-tags, .contact-grid, .social-grid, ' +
    '.metric-card, .venture-hero-card, .skills-category-block, .archive-project-card'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach(el => observer.observe(el));

  // 3. Contact Form Submission Feedback
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span>Dispatch Sent Successfully!</span>';
      btn.style.background = 'var(--accent-emerald)';
      btn.style.borderColor = 'var(--accent-emerald)';
      btn.style.boxShadow = '0 0 20px var(--accent-emerald-glow)';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
        form.reset();
      }, 3500);
    });
  }
});
