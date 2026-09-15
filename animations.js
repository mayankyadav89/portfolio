/**
 * ============================================================================
 * ANIMATIONS ENGINE — Mayank Yadav Founder Digital HQ
 * Features:
 *  1. Web3 / AI Network Particle System (Canvas with touch & mouse support)
 *  2. Custom Smart Interactive Cursor (Desktop-only, Magnetic, Context-aware)
 *  3. Dynamic 3D Card Tilt & Mouse Spotlight Sheen (Desktop)
 *  4. Social Platform Tooltips & Micro-interactions
 *  5. Scroll-driven Timeline & Staggered Reveal Enhancements
 *  6. Mobile Touch Optimizations & Performance (Battery friendly)
 * ============================================================================
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches && !('ontouchstart' in window);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initScrollProgressBar();
    initHeroParticles();
    initHeroInteractive();
    if (isFinePointer && !prefersReducedMotion) {
      initCustomCursor();
      initCardTiltAndSpotlight();
    }
    initSocialTooltips();
    initSkillTooltips();
    initStatCounters();
    initScrollAndTimelineEnhancements();
    initAmbientOrbsParallax();
    initEasterEgg();
  }

  /* ==========================================================================
     1. HERO NETWORK PARTICLE SYSTEM (Canvas)
     ========================================================================== */
  function initHeroParticles() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    let canvas = document.getElementById('hero-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'hero-canvas';
      canvas.className = 'hero-canvas';
      const heroBg = hero.querySelector('.hero-bg') || hero;
      heroBg.insertBefore(canvas, heroBg.firstChild);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = hero.offsetWidth);
    let height = (canvas.height = hero.offsetHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let isVisible = true;
    let animationFrameId = null;

    const pointer = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      radius: window.innerWidth < 768 ? 110 : 160,
      active: false
    };

    function getParticleCount() {
      const w = window.innerWidth;
      if (w < 480) return 20;
      if (w < 768) return 30;
      if (w < 1200) return 55;
      return 70;
    }

    const nodeColors = [
      { r: 167, g: 139, b: 250 }, // Violet (#a78bfa)
      { r: 129, g: 140, b: 248 }, // Indigo (#818cf8)
      { r: 56,  g: 189, b: 248 }, // Cyan (#38bdf8)
      { r: 52,  g: 211, b: 153 }  // Emerald (#34d399)
    ];

    let particles = [];
    let pulses = [];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : (Math.random() < 0.5 ? -10 : height + 10);
        this.baseX = this.x;
        this.baseY = this.y;

        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;

        this.radius = Math.random() * 1.7 + 1.1;
        this.baseRadius = this.radius;
        this.color = nodeColors[Math.floor(Math.random() * nodeColors.length)];
        this.alpha = Math.random() * 0.4 + 0.3;
        this.baseAlpha = this.alpha;

        this.pulseAngle = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        this.pulseAngle += this.pulseSpeed;
        this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 0.45;

        if (this.x < -20) this.x = width + 20;
        else if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        else if (this.y > height + 20) this.y = -20;

        if (pointer.active) {
          const dx = pointer.x - this.x;
          const dy = pointer.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < pointer.radius && dist > 0) {
            const force = (pointer.radius - dist) / pointer.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.8;
            this.y -= Math.sin(angle) * force * 1.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.fill();

        if (this.radius > 1.8) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.14})`;
          ctx.fill();
        }
      }
    }

    class DataPulse {
      constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.progress = 0;
        this.speed = Math.random() * 0.016 + 0.009;
        this.color = p1.color;
      }

      update() {
        this.progress += this.speed;
      }

      draw() {
        if (this.progress > 1) return;
        const currX = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
        const currY = this.p1.y + (this.p2.y - this.p1.y) * this.progress;

        ctx.beginPath();
        ctx.arc(currX, currY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.9)`;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.85)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function resize() {
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.scale(dpr, dpr);

      const count = getParticleCount();
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
      pulses = [];
    }

    resize();
    window.addEventListener('resize', debounce(resize, 150));

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
      pointer.active = true;
    });

    hero.addEventListener('mouseleave', () => {
      pointer.active = false;
    });

    hero.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = hero.getBoundingClientRect();
        pointer.targetX = e.touches[0].clientX - rect.left;
        pointer.targetY = e.touches[0].clientY - rect.top;
        pointer.active = true;
      }
    }, { passive: true });

    hero.addEventListener('touchend', () => {
      pointer.active = false;
    }, { passive: true });

    let lastPulseTime = 0;
    function maybeSpawnPulse(now) {
      const maxPulses = window.innerWidth < 768 ? 4 : 10;
      if (now - lastPulseTime > 400 && pulses.length < maxPulses && particles.length > 2) {
        lastPulseTime = now;
        const idx1 = Math.floor(Math.random() * particles.length);
        const p1 = particles[idx1];
        for (let j = 0; j < particles.length; j++) {
          if (idx1 === j) continue;
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = window.innerWidth < 768 ? 100 : 135;
          if (dist < maxDist) {
            pulses.push(new DataPulse(p1, p2));
            break;
          }
        }
      }
    }

    function animate(timestamp) {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * 0.15;
        pointer.y += (pointer.targetY - pointer.y) * 0.15;
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      const maxConnectionDistance = window.innerWidth < 768 ? 100 : 135;
      ctx.lineWidth = 0.75;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            const alpha = (1 - dist / maxConnectionDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      maybeSpawnPulse(timestamp);
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.update();
        pulse.draw();
        if (pulse.progress > 1) {
          pulses.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.05 });

    heroObserver.observe(hero);

    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden && isElementInViewport(hero);
      if (isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(animate);
      }
    });

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      animate(0);
    }
  }

  /* ==========================================================================
     2. CUSTOM INTERACTIVE CURSOR SYSTEM (Desktop Only)
     ========================================================================== */
  function initCustomCursor() {
    document.body.classList.add('custom-cursor-active');

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let dotX = -100;
    let dotY = -100;
    let magneticTarget = null;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!dot.classList.contains('active')) {
        dot.classList.add('active');
        ring.classList.add('active');
      }
    });

    document.addEventListener('mouseleave', () => {
      dot.classList.remove('active');
      ring.classList.remove('active');
    });

    window.addEventListener('mousedown', (e) => {
      createClickRipple(e.clientX, e.clientY);
      ring.style.transform = 'translate(-50%, -50%) scale(0.85)';
    });

    window.addEventListener('mouseup', () => {
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    function createClickRipple(x, y) {
      const ripple = document.createElement('div');
      ripple.className = 'cursor-click-ripple';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }

    const interactiveSelectors = {
      link: 'a, nav a, .hq-logo, .block-link, .footer-links-list a',
      btn: '.btn, button, .hq-nav-toggle, .cmd-palette-btn, .ledger-filter-btn',
      card: '.build-card, .block-card, .archive-project-card, .venture-hero-card, .venture-sub-card, .timeline-content, .community-card, .skill-matrix-card',
      social: '.social-channel-card, .social-icon-link'
    };

    document.addEventListener('mouseover', (e) => {
      const target = e.target;

      if (target.closest(interactiveSelectors.social)) {
        document.body.classList.add('cursor-hover-social');
        magneticTarget = target.closest(interactiveSelectors.social);
      } else if (target.closest(interactiveSelectors.btn)) {
        document.body.classList.add('cursor-hover-btn');
        magneticTarget = target.closest(interactiveSelectors.btn);
      } else if (target.closest(interactiveSelectors.link)) {
        document.body.classList.add('cursor-hover-link');
      } else if (target.closest(interactiveSelectors.card)) {
        document.body.classList.add('cursor-hover-card');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target;

      if (target.closest(interactiveSelectors.social)) {
        document.body.classList.remove('cursor-hover-social');
        if (magneticTarget) resetMagneticElement(magneticTarget);
        magneticTarget = null;
      } else if (target.closest(interactiveSelectors.btn)) {
        document.body.classList.remove('cursor-hover-btn');
        if (magneticTarget) resetMagneticElement(magneticTarget);
        magneticTarget = null;
      } else if (target.closest(interactiveSelectors.link)) {
        document.body.classList.remove('cursor-hover-link');
      } else if (target.closest(interactiveSelectors.card)) {
        document.body.classList.remove('cursor-hover-card');
      }
    });

    function applyMagneticPull(element, mouseX, mouseY) {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const elemCenterX = rect.left + rect.width / 2;
      const elemCenterY = rect.top + rect.height / 2;
      const distX = mouseX - elemCenterX;
      const distY = mouseY - elemCenterY;

      const pullX = distX * 0.16;
      const pullY = distY * 0.16;
      element.style.transform = `translate(${pullX}px, ${pullY}px)`;
    }

    function resetMagneticElement(element) {
      if (!element) return;
      element.style.transform = '';
    }

    function renderCursor() {
      dotX = mouseX;
      dotY = mouseY;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';

      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;

        ringX += (targetCenterX - ringX) * 0.22;
        ringY += (targetCenterY - ringY) * 0.22;

        applyMagneticPull(magneticTarget, mouseX, mouseY);
      } else {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
      }

      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      requestAnimationFrame(renderCursor);
    }

    requestAnimationFrame(renderCursor);
  }

  /* ==========================================================================
     3. 3D CARD TILT & MOUSE SPOTLIGHT SHEEN (Desktop Only)
     ========================================================================== */
  function initCardTiltAndSpotlight() {
    const cards = document.querySelectorAll(
      '.build-card, .block-card, .archive-project-card, .venture-hero-card, .venture-sub-card, .timeline-content, .community-card, .metric-card, .skill-matrix-card, .social-channel-card'
    );

    cards.forEach((card) => {
      let bounds = null;

      function updateBounds() {
        bounds = card.getBoundingClientRect();
      }

      card.addEventListener('mouseenter', () => {
        updateBounds();
      });

      card.addEventListener('mousemove', (e) => {
        if (!bounds) updateBounds();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        card.style.setProperty('--mouse-x', `${mouseX}px`);
        card.style.setProperty('--mouse-y', `${mouseY}px`);

        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const percentX = (mouseX - centerX) / centerX;
        const percentY = (mouseY - centerY) / centerY;

        const maxTilt = 4.0;
        const tiltX = -percentY * maxTilt;
        const tiltY = percentX * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(3px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.setProperty('--mouse-x', '-999px');
        card.style.setProperty('--mouse-y', '-999px');
        bounds = null;
      });
    });
  }

  /* ==========================================================================
     4. SOCIAL PLATFORM TOOLTIPS & MICRO-INTERACTIONS
     ========================================================================== */
  function initSocialTooltips() {
    const socialLinks = document.querySelectorAll('.social-icon-link');
    socialLinks.forEach((link) => {
      if (link.querySelector('.social-tooltip')) return;
      const labelText = link.getAttribute('aria-label') || '';
      if (labelText) {
        const tooltip = document.createElement('span');
        tooltip.className = 'social-tooltip';
        tooltip.textContent = labelText;
        link.appendChild(tooltip);
      }
    });
  }

  /* ==========================================================================
     5. SCROLL-DRIVEN TIMELINE & STAGGERED REVEALS
     ========================================================================== */
  function initScrollAndTimelineEnhancements() {
    const gridContainers = document.querySelectorAll(
      '.metrics-strip, .projects-archive-grid, .venture-duo-grid, .skills-items-grid, .social-platforms-grid'
    );

    gridContainers.forEach((grid) => {
      const items = grid.children;
      for (let i = 0; i < items.length; i++) {
        const delayClass = `reveal-delay-${Math.min((i % 5) + 1, 5)}`;
        items[i].classList.add(delayClass);
      }
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
      const timelineObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            } else {
              entry.target.classList.remove('in-view');
            }
          });
        },
        { rootMargin: '-20% 0px -20% 0px', threshold: 0.3 }
      );

      timelineItems.forEach((item) => timelineObserver.observe(item));
    }
  }

  /* ==========================================================================
     6. AMBIENT ORBS PARALLAX
     ========================================================================== */
  function initAmbientOrbsParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    if (isFinePointer && !prefersReducedMotion) {
      const orbs = heroBg.querySelectorAll('.floating-orb');
      const hero = document.getElementById('hero');

      if (hero && orbs.length > 0) {
        hero.addEventListener('mousemove', (e) => {
          const rect = hero.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;

          orbs.forEach((orb, idx) => {
            const factor = (idx + 1) * 22;
            orb.style.transform = `translate(${normX * factor}px, ${normY * factor}px)`;
          });
        });

        hero.addEventListener('mouseleave', () => {
          orbs.forEach((orb) => {
            orb.style.transform = '';
          });
        });
      }
    }
  }

  /* ==========================================================================
     7. SCROLL PROGRESS INDICATOR
     ========================================================================== */
  function initScrollProgressBar() {
    const progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) return;

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

  /* ==========================================================================
     8. INTERACTIVE HERO ENHANCEMENTS
     ========================================================================== */
  function initHeroInteractive() {
    const hero = document.getElementById('hero');
    const heroContent = hero ? hero.querySelector('.hero-content') : null;
    const heroName = hero ? hero.querySelector('.hero-name') : null;
    if (!hero || !heroContent || !heroName) return;

    if (isFinePointer && !prefersReducedMotion) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        heroContent.style.transform = `translate(${(normX * 6).toFixed(2)}px, ${(normY * 6).toFixed(2)}px)`;

        const nameRect = heroName.getBoundingClientRect();
        const nameCenterX = nameRect.left + nameRect.width / 2;
        const nameCenterY = nameRect.top + nameRect.height / 2;
        const dist = Math.hypot(e.clientX - nameCenterX, e.clientY - nameCenterY);

        if (dist < 180) {
          heroName.classList.add('proximity-glow');
        } else {
          heroName.classList.remove('proximity-glow');
        }
      });

      hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = '';
        heroName.classList.remove('proximity-glow');
      });
    }
  }

  /* ==========================================================================
     9. STAT COUNTERS ANIMATION
     ========================================================================== */
  function initStatCounters() {
    const counters = document.querySelectorAll('.stat-count');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          if (isNaN(target)) return;

          if (prefersReducedMotion) {
            el.textContent = target.toLocaleString() + suffix;
            obs.unobserve(el);
            return;
          }

          let startTime = null;
          const duration = 1200;

          function countUp(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * target);

            el.textContent = current.toLocaleString() + (progress >= 1 ? suffix : '');

            if (progress < 1) {
              requestAnimationFrame(countUp);
            } else {
              el.textContent = target.toLocaleString() + suffix;
            }
          }

          requestAnimationFrame(countUp);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((c) => observer.observe(c));
  }

  /* ==========================================================================
     10. SKILL TOOLTIPS
     ========================================================================== */
  function initSkillTooltips() {
    const skillSpans = document.querySelectorAll('.skill-tags span, .block-tech-tag');
    skillSpans.forEach((span) => {
      if (span.querySelector('.skill-tooltip')) return;
      const text = span.textContent.trim();
      const tip = span.getAttribute('data-note') || '';
      if (tip) {
        const tooltip = document.createElement('span');
        tooltip.className = 'skill-tooltip';
        tooltip.textContent = tip;
        span.appendChild(tooltip);
      }
    });
  }

  /* ==========================================================================
     11. SUBTLE FOUNDER EASTER EGG
     ========================================================================== */
  function initEasterEgg() {
    const navLogo = document.querySelector('.hq-logo');
    if (!navLogo) return;

    let toast = document.getElementById('easter-egg-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'easter-egg-toast';
      toast.className = 'easter-egg-toast';
      toast.innerHTML = '<span>⚡</span> <span>Mayank Yadav Founder OS &middot; Still Building.</span>';
      document.body.appendChild(toast);
    }

    let hideTimeout = null;
    navLogo.addEventListener('click', (e) => {
      clearTimeout(hideTimeout);
      toast.classList.add('show');
      hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    });
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.bottom >= 0 &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }
})();
