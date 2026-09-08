/**
 * ============================================================================
 * ANIMATIONS ENGINE (Restored to Classic Aesthetic & Mobile Optimized)
 * Mayank Yadav Portfolio
 * Features:
 *  1. Web3 / AI Network Particle System (Hero Canvas with touch & mouse support)
 *  2. Custom Smart Interactive Cursor (Desktop-only, Magnetic, Context-aware)
 *  3. Dynamic 3D Card Tilt & Mouse Spotlight Sheen (Desktop)
 *  4. Social Platform Tooltips & Micro-interactions
 *  5. Scroll-driven Timeline & Staggered Reveal Enhancements
 *  6. Mobile Touch Optimizations & Performance (Reduced counts, Battery friendly)
 * ============================================================================
 */

(function () {
  'use strict';

  // Check user motion preference and pointer type
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches && !('ontouchstart' in window);

  // Initialize on DOM ready
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

    // Pointer coordinates in hero (supports both mouse and touch)
    const pointer = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      radius: window.innerWidth < 768 ? 110 : 150,
      active: false
    };

    // Mobile-optimized particle count
    function getParticleCount() {
      const w = window.innerWidth;
      if (w < 480) return 18; // Super lightweight on phones
      if (w < 768) return 28; // Lightweight on tablets
      if (w < 1200) return 50;
      return 65;
    }

    // Color palette for nodes & data packets
    const nodeColors = [
      { r: 167, g: 139, b: 250 }, // Purple (#a78bfa)
      { r: 129, g: 140, b: 248 }, // Indigo (#818cf8)
      { r: 56,  g: 189, b: 248 }, // Cyan (#38bdf8)
      { r: 52,  g: 211, b: 153 }  // Emerald (#34d399)
    ];

    let particles = [];
    let pulses = []; // Travelling data signals between connected nodes

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : (Math.random() < 0.5 ? -10 : height + 10);
        this.baseX = this.x;
        this.baseY = this.y;

        // Slow ambient velocities
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;

        // Visual properties
        this.radius = Math.random() * 1.6 + 1.1;
        this.baseRadius = this.radius;
        this.color = nodeColors[Math.floor(Math.random() * nodeColors.length)];
        this.alpha = Math.random() * 0.4 + 0.28;
        this.baseAlpha = this.alpha;

        // Breathing pulse phase
        this.pulseAngle = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        // Floating motion
        this.x += this.vx;
        this.y += this.vy;

        // Pulse size & glow
        this.pulseAngle += this.pulseSpeed;
        this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 0.4;

        // Boundary wrapping
        if (this.x < -20) this.x = width + 20;
        else if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        else if (this.y > height + 20) this.y = -20;

        // Pointer (mouse or touch) gentle interaction
        if (pointer.active) {
          const dx = pointer.x - this.x;
          const dy = pointer.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < pointer.radius && dist > 0) {
            const force = (pointer.radius - dist) / pointer.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.6;
            this.y -= Math.sin(angle) * force * 1.6;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.fill();

        // Subtle glow halo for larger nodes
        if (this.radius > 1.8) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.12})`;
          ctx.fill();
        }
      }
    }

    // Packet / Data Pulse travelling between two nodes
    class DataPulse {
      constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.progress = 0;
        this.speed = Math.random() * 0.015 + 0.008;
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
        ctx.arc(currX, currY, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.85)`;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
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

    // Desktop Mouse Tracking
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
      pointer.active = true;
    });

    hero.addEventListener('mouseleave', () => {
      pointer.active = false;
    });

    // Mobile Touch Tracking (passive for 60fps smooth scrolling)
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

    // Spawn occasional data signal packet between connected nodes
    let lastPulseTime = 0;
    function maybeSpawnPulse(now) {
      const maxPulses = window.innerWidth < 768 ? 4 : 10;
      if (now - lastPulseTime > 450 && pulses.length < maxPulses && particles.length > 2) {
        lastPulseTime = now;
        const idx1 = Math.floor(Math.random() * particles.length);
        const p1 = particles[idx1];
        // Find a nearby particle
        for (let j = 0; j < particles.length; j++) {
          if (idx1 === j) continue;
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = window.innerWidth < 768 ? 100 : 130;
          if (dist < maxDist) {
            pulses.push(new DataPulse(p1, p2));
            break;
          }
        }
      }
    }

    // Animation Loop
    function animate(timestamp) {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth pointer lerp
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * 0.15;
        pointer.y += (pointer.targetY - pointer.y) * 0.15;
      }

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      // Draw Connections (Network Graph Lines)
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
            const alpha = (1 - dist / maxConnectionDistance) * 0.2;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Update & Draw Data Pulses
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

    // Pause when Hero is out of viewport
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.05 });

    heroObserver.observe(hero);

    // Pause on tab visibility change
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden && isElementInViewport(hero);
      if (isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(animate);
      }
    });

    // Start initial frame
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

    // Create cursor DOM elements
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

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!dot.classList.contains('active')) {
        dot.classList.add('active');
        ring.classList.add('active');
      }
    });

    // Mouse leave window
    document.addEventListener('mouseleave', () => {
      dot.classList.remove('active');
      ring.classList.remove('active');
    });

    // Click feedback ripple
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

    // Attach hover state handlers with event delegation for performance
    const interactiveSelectors = {
      link: 'a, nav a, .nav-logo, .project-link, .footer-links a',
      btn: '.btn, button, .nav-toggle, input[type="submit"]',
      card: '.build-card, .project-card, .timeline-content, .community-card, .edu-card, .cert-card',
      social: '.social-icon-link'
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

    // Magnetic pull helper for buttons
    function applyMagneticPull(element, mouseX, mouseY) {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const elemCenterX = rect.left + rect.width / 2;
      const elemCenterY = rect.top + rect.height / 2;
      const distX = mouseX - elemCenterX;
      const distY = mouseY - elemCenterY;

      // Subtle translation (max 5px)
      const pullX = distX * 0.18;
      const pullY = distY * 0.18;
      element.style.transform = `translate(${pullX}px, ${pullY}px)`;
    }

    function resetMagneticElement(element) {
      if (!element) return;
      element.style.transform = '';
    }

    // Cursor Smooth Follow Loop
    function renderCursor() {
      // Instant dot
      dotX = mouseX;
      dotY = mouseY;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';

      // Magnetic snap or smooth lerp for ring
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
      '.build-card, .project-card, .timeline-content, .community-card, .edu-card, .cert-card'
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

        // Set CSS custom variables for radial spotlight
        card.style.setProperty('--mouse-x', `${mouseX}px`);
        card.style.setProperty('--mouse-y', `${mouseY}px`);

        // Subtle 3D tilt calculation
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const percentX = (mouseX - centerX) / centerX;
        const percentY = (mouseY - centerY) / centerY;

        const maxTilt = 4.5; // subtle tilt angle in degrees
        const tiltX = -percentY * maxTilt;
        const tiltY = percentX * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(4px)`;
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

    const platformLabels = {
      'mailto:hello@itsmayank.me': 'Email Mayank',
      'https://github.com/mayankyadav89': 'GitHub Profile',
      'https://www.linkedin.com/in/mayankyadav89/': 'LinkedIn Profile',
      'https://x.com/maayankavy07': 'X (Twitter)',
      'https://instagram.com/itsmayank.me': 'Instagram',
      'https://www.facebook.com/itsmayank.me': 'Facebook',
      'https://farcaster.xyz/mayankyadav': 'Farcaster',
      'https://www.reddit.com/u/maayankaydav/s/fWLZXcJXma': 'Reddit Profile',
      'https://discord.com/users/MAYANKYADAV': 'Discord Community',
      'Location': 'Bhopal, MP, India'
    };

    socialLinks.forEach((link) => {
      if (link.querySelector('.social-tooltip')) return;

      let labelText = link.getAttribute('aria-label') || '';
      const href = link.getAttribute('href');

      if (href && platformLabels[href]) {
        labelText = platformLabels[href];
      } else if (link.classList.contains('social-icon-link--static')) {
        labelText = 'Bhopal, MP, India';
      }

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
    // Add staggered delay classes to grid cards for cascade reveal
    const gridContainers = document.querySelectorAll(
      '.building-grid, .projects-grid, .community-grid, .skills-grid, .social-grid, .education-grid'
    );

    gridContainers.forEach((grid) => {
      const items = grid.children;
      for (let i = 0; i < items.length; i++) {
        const delayClass = `reveal-delay-${Math.min((i % 5) + 1, 5)}`;
        items[i].classList.add(delayClass);
      }
    });

    // Timeline item active highlight when scrolled into center of screen
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

    // Inject ambient floating orbs if not present
    if (!heroBg.querySelector('.floating-orb')) {
      const orb1 = document.createElement('div');
      orb1.className = 'floating-orb orb-1';
      const orb2 = document.createElement('div');
      orb2.className = 'floating-orb orb-2';
      const orb3 = document.createElement('div');
      orb3.className = 'floating-orb orb-3';

      heroBg.appendChild(orb1);
      heroBg.appendChild(orb2);
      heroBg.appendChild(orb3);
    }

    if (isFinePointer && !prefersReducedMotion) {
      const orbs = heroBg.querySelectorAll('.floating-orb');
      const hero = document.getElementById('hero');

      if (hero && orbs.length > 0) {
        hero.addEventListener('mousemove', (e) => {
          const rect = hero.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;

          orbs.forEach((orb, idx) => {
            const factor = (idx + 1) * 20;
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

        // Subtle 2.5D content parallax
        heroContent.style.transform = `translate(${(normX * 6).toFixed(2)}px, ${(normY * 6).toFixed(2)}px)`;

        // Name proximity detection
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
     9. REAL STATS / NUMBER COUNT-UP ANIMATION
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
            // Ease out cubic
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
     10. TECH STACK & SKILL TOOLTIPS
     ========================================================================== */
  function initSkillTooltips() {
    const skillSpans = document.querySelectorAll('.skill-tags span');
    if (!skillSpans.length) return;

    const skillMap = {
      'Python (Basic)': 'Data & ML Fundamentals',
      'SQL (Basic)': 'Database Management & Queries',
      'Git': 'Version Control System',
      'GitHub': 'Collaboration & Open Source',
      'AI/ML Fundamentals': 'Core ML & Neural Networks',
      'Blockchain & Web3 Fundamentals': 'Decentralized Systems & Protocols',
      'Smart Contracts': 'Solidity & EVM Architecture',
      'Ethereum': 'Smart Accounts & EVM',
      'Solana': 'High-Performance Web3 Ecosystem',
      'Polygon': 'Scalable Ethereum L2',
      'Base': 'Base Sepolia & Account Abstraction',
      'Node Operations': 'Node User Acquisition & Onboarding',
      'Web3 Wallets': 'MetaMask, Phantom & Passkeys',
      'MetaMask': 'EVM Wallet Integration',
      'Phantom': 'Solana & Multi-chain Wallet',
      'Business Development': 'Partnerships & Ecosystem Growth',
      'Product Strategy': 'Roadmaps, MVP & User Journeys',
      'Market Research': 'User Research & Competitor Analysis',
      'User Research': 'Customer Interviews & Personas',
      'Go-to-Market Strategy': 'GTM Roadmaps & Adoption',
      'Partnerships': 'Web3 & Industry Collaborations',
      'Community Building': 'Channel Growth & Engagement',
      'Community Growth': '2,500+ Member Communities',
      'Operations': 'Day-to-day Operations Management',
      'Project Management': 'Milestones & Delivery',
      'Stakeholder Management': 'Cross-functional Coordination',
      'Event Management': 'ETHGlobal, IBW & Hackathons',
      'Public Speaking': 'Workshops & Presentations',
      'Customer Support': 'User Onboarding & Support',
      'User Onboarding': 'Developer & Attendee Onboarding',
      'Issue Resolution': 'User Problem Solving',
      'Customer Communication': 'Community Channels & Support',
      'Community Support': 'Discord, Telegram & X Support',
      'Workflow Management': 'Process Optimization',
      'Process Improvement': 'Operational Efficiency',
      'Problem Solving': 'Systems & Technical Solutions',
      'Notion': 'Product Docs & Knowledge Base',
      'Canva': 'Visual Assets & Pitch Decks',
      'Postman': 'API Testing & Debugging',
      'VS Code': 'Code Editor & Dev Environment',
      'ChatGPT': 'AI-Assisted Workflows',
      'Claude': 'AI-Assisted Architecture & Code',
      'Gemini': 'Multimodal AI Workflows',
      'Discord': 'Community Moderation & Channels',
      'Telegram': 'Community Channels & Announcements',
      'Microsoft Office': 'Productivity & Analysis',
      'Google Workspace': 'Collaboration & Cloud Docs',
      'Hindi — Native': 'Native Language',
      'English — Professional Working Proficiency': 'Professional Working Proficiency'
    };

    skillSpans.forEach((span) => {
      if (span.querySelector('.skill-tooltip')) return;
      const text = span.textContent.trim();
      const tip = skillMap[text];
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
    const navLogo = document.querySelector('.nav-logo');
    if (!navLogo) return;

    let toast = document.getElementById('easter-egg-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'easter-egg-toast';
      toast.className = 'easter-egg-toast';
      toast.innerHTML = '<span>⚡</span> <span>Still building &middot; Turning ideas into systems.</span>';
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

  /* ==========================================================================
     UTILITY FUNCTIONS
     ========================================================================== */
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
