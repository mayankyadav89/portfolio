/**
 * ============================================================================
 * ANIMATIONS & INTERACTION ENGINE — Mayank Yadav Founder Digital HQ
 * High-performance 2D-first, motion-rich, Web3-native interactive physics
 *
 * Features:
 *  1. Multi-Layer Context-Aware Custom Cursor with Magnetic Physics
 *  2. Interactive Hero Typography with Magnetic Displacement & Specular Sheen
 *  3. Procedural 3D Cryptographic Identity Glyph (HTML5 Canvas 3D Projection)
 *  4. Coherent Card 3D Tilt & Mouse Spotlight Sheen
 *  5. Web Audio API Tactile Sound Synthesizer
 *  6. 6 Meaningful Easter Eggs (Konami Code, 5-Click Logo, Console Art, etc.)
 *  7. Scroll Progress Bar & Active Section Waypoint Tracker
 *  8. Mobile Touch Physics & Battery-Friendly Lifecycle Observers
 * ============================================================================
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches && !('ontouchstart' in window);

  // Global Audio Synthesizer (Zero external dependencies)
  let audioCtx = null;
  function playTactileChime(type = 'copy') {
    if (prefersReducedMotion) return;
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      if (type === 'copy') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'unlock') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(960, now + 0.18);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      // Audio autoplay policy or unavailable — silent fallback
    }
  }

  // Expose sound synth to global window
  window.playTactileChime = playTactileChime;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initScrollProgressBar();
    initHeroMagneticTypography();
    initIdentity3DGlyph();

    if (isFinePointer && !prefersReducedMotion) {
      initCustomCursor();
      initCardTiltAndSpotlight();
      initAmbientOrbsParallax();
    }

    initSocialTooltips();
    initSkillTooltips();
    initStatCounters();
    initScrollAndTimelineEnhancements();
    initEasterEggsSuite();
    initDevToolsConsoleArt();
    initSectionWaypoints();
  }

  /* ==========================================================================
     1. SCROLL PROGRESS INDICATOR
     ========================================================================== */
  function initScrollProgressBar() {
    let progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress-bar';
      progressBar.className = 'scroll-progress-bar';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
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

  /* ==========================================================================
     2. MULTI-LAYER CONTEXT-AWARE CUSTOM CURSOR & MAGNETICS (Desktop Only)
     ========================================================================== */
  function initCustomCursor() {
    document.body.classList.add('custom-cursor-active');

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';

    const label = document.createElement('div');
    label.className = 'cursor-label';
    ring.appendChild(label);

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let dotX = -100;
    let dotY = -100;
    let magneticTarget = null;
    let currentLabelText = '';

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
      ring.classList.add('cursor-clicking');
    });

    window.addEventListener('mouseup', () => {
      ring.classList.remove('cursor-clicking');
    });

    function createClickRipple(x, y) {
      const ripple = document.createElement('div');
      ripple.className = 'cursor-click-ripple';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }

    function setCursorContext(contextClass, labelText = '', magneticEl = null) {
      // Remove previous context classes
      ring.className = 'cursor-ring active ' + (contextClass || '');
      dot.className = 'cursor-dot active ' + (contextClass ? 'dot-' + contextClass : '');

      if (labelText) {
        label.textContent = labelText;
        label.classList.add('visible');
      } else {
        label.classList.remove('visible');
        label.textContent = '';
      }

      currentLabelText = labelText;
      magneticTarget = magneticEl;
    }

    function clearCursorContext() {
      ring.className = 'cursor-ring active';
      dot.className = 'cursor-dot active';
      label.classList.remove('visible');
      label.textContent = '';
      if (magneticTarget) {
        resetMagneticElement(magneticTarget);
        magneticTarget = null;
      }
    }

    document.addEventListener('mouseover', (e) => {
      const target = e.target;

      // 1. 3D Canvas
      if (target.closest('#identity-glyph-canvas, .identity-glyph-canvas')) {
        setCursorContext('cursor-hover-canvas', 'ROTATE ⟳');
        return;
      }

      // 2. Terminal / Cmd palette trigger
      if (target.closest('.cmd-palette-btn, #terminal-trigger, .founder-terminal-trigger')) {
        setCursorContext('cursor-hover-terminal', 'TERMINAL ⌘K', target.closest('button, a'));
        return;
      }

      // 3. Copyable Elements
      if (target.closest('[data-copy-val], .conn-copy-btn, .conn-inline-copy-btn, .contact-copy-btn, .copy-btn')) {
        setCursorContext('cursor-hover-copy', 'COPY ❐', target.closest('.btn, button'));
        return;
      }

      // 4. External Portal links (MRIG / Rentro / GetNextIn / Koii / GitHub)
      const extLink = target.closest('a[target="_blank"], a[href^="http"]');
      if (extLink) {
        const href = extLink.getAttribute('href') || '';
        if (href.includes('rentro.mrig.tech') || href.includes('getnextin.mrig.tech') || href.includes('mrig.tech')) {
          setCursorContext('cursor-hover-portal', 'PORTAL ↗', extLink);
        } else {
          setCursorContext('cursor-hover-link', 'OPEN ↗', extLink);
        }
        return;
      }

      // 5. Project Showcase & Archive Cards
      const projectCard = target.closest('.product-showcase-card, .archive-project-card, .hat-product-card');
      if (projectCard) {
        setCursorContext('cursor-hover-project', 'EXPLORE →', null);
        return;
      }

      // 6. Capability & Principles Cards
      if (target.closest('.capability-item, .about-principles-card, .skill-matrix-card')) {
        setCursorContext('cursor-hover-card', '', null);
        return;
      }

      // 7. Buttons & CTAs
      const btn = target.closest('.btn, button, .nav-brand, .hq-logo');
      if (btn) {
        setCursorContext('cursor-hover-btn', '', btn);
        return;
      }

      // 8. General Navigation links
      if (target.closest('a, nav a, .footer-links-list a')) {
        setCursorContext('cursor-hover-link', '', null);
        return;
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target;
      if (target.closest('a, button, .btn, .product-showcase-card, .archive-project-card, .capability-item, .skill-matrix-card, #identity-glyph-canvas, .identity-glyph-canvas, [data-copy-val]')) {
        clearCursorContext();
      }
    });

    function applyMagneticPull(element, mX, mY) {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const elemCenterX = rect.left + rect.width / 2;
      const elemCenterY = rect.top + rect.height / 2;
      const distX = mX - elemCenterX;
      const distY = mY - elemCenterY;

      // Soft spring displacement limit
      const pullX = Math.max(Math.min(distX * 0.18, 14), -14);
      const pullY = Math.max(Math.min(distY * 0.18, 14), -14);
      element.style.transform = `translate(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px)`;
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
     3. INTERACTIVE HERO TYPOGRAPHY & MAGNETIC DISPLACEMENT
     ========================================================================== */
  function initHeroMagneticTypography() {
    const titleEl = document.querySelector('.hero-main-title');
    if (!titleEl) return;

    // Ensure accessible aria-label is set
    if (!titleEl.getAttribute('aria-label')) {
      titleEl.setAttribute('aria-label', titleEl.textContent.trim().replace(/\s+/g, ' '));
    }

    // Wrap letters non-destructively
    const firstSpan = titleEl.querySelector('[data-founder-first-name]') || titleEl.children[0];
    const lastSpan = titleEl.querySelector('[data-founder-last-name]') || titleEl.children[1];

    function wrapCharsInSpan(span) {
      if (!span || span.dataset.charsSplit === 'true') return;
      const text = span.textContent.trim();
      span.innerHTML = '';
      span.dataset.charsSplit = 'true';
      span.setAttribute('aria-hidden', 'true');

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const wrap = document.createElement('span');
        wrap.className = 'mag-char-wrap';
        wrap.dataset.char = char;

        const inner = document.createElement('span');
        inner.className = 'mag-char-inner';
        inner.textContent = char;

        wrap.appendChild(inner);
        span.appendChild(wrap);
      }
    }

    if (firstSpan) wrapCharsInSpan(firstSpan);
    if (lastSpan) wrapCharsInSpan(lastSpan);

    const charWraps = titleEl.querySelectorAll('.mag-char-wrap');
    if (!charWraps.length) return;

    // Track spring displacement states for each letter
    const charStates = Array.from(charWraps).map((el) => ({
      el: el.querySelector('.mag-char-inner') || el,
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      targetRotate: 0,
      currentRotate: 0
    }));

    let isHeroActive = false;
    let heroRaf = null;

    function updateTypographyPhysics() {
      let needsContinue = false;

      charStates.forEach((state) => {
        // Spring lerp
        state.currentX += (state.targetX - state.currentX) * 0.14;
        state.currentY += (state.targetY - state.currentY) * 0.14;
        state.currentRotate += (state.targetRotate - state.currentRotate) * 0.14;

        if (
          Math.abs(state.targetX - state.currentX) > 0.05 ||
          Math.abs(state.targetY - state.currentY) > 0.05 ||
          Math.abs(state.targetRotate - state.currentRotate) > 0.05
        ) {
          needsContinue = true;
        }

        state.el.style.transform = `translate3d(${state.currentX.toFixed(2)}px, ${state.currentY.toFixed(2)}px, 0) rotate(${state.currentRotate.toFixed(2)}deg)`;
      });

      if (needsContinue || isHeroActive) {
        heroRaf = requestAnimationFrame(updateTypographyPhysics);
      } else {
        heroRaf = null;
      }
    }

    function onHeroMouseMove(e) {
      if (prefersReducedMotion) return;
      isHeroActive = true;
      const mX = e.clientX;
      const mY = e.clientY;

      charWraps.forEach((wrap, idx) => {
        const rect = wrap.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const dx = mX - charCenterX;
        const dy = mY - charCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxProximity = 140;

        if (dist < maxProximity && dist > 0) {
          const force = (1 - dist / maxProximity);
          const angle = Math.atan2(dy, dx);
          // Displacement push
          charStates[idx].targetX = -Math.cos(angle) * force * 16;
          charStates[idx].targetY = -Math.sin(angle) * force * 16;
          charStates[idx].targetRotate = (dx > 0 ? -1 : 1) * force * 8;

          // Specular light angle
          const lightAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
          wrap.style.setProperty('--light-angle', `${lightAngle.toFixed(1)}deg`);
          wrap.classList.add('char-in-light');
        } else {
          charStates[idx].targetX = 0;
          charStates[idx].targetY = 0;
          charStates[idx].targetRotate = 0;
          wrap.classList.remove('char-in-light');
        }
      });

      if (!heroRaf) {
        heroRaf = requestAnimationFrame(updateTypographyPhysics);
      }
    }

    function onHeroMouseLeave() {
      isHeroActive = false;
      charStates.forEach((state) => {
        state.targetX = 0;
        state.targetY = 0;
        state.targetRotate = 0;
      });
      charWraps.forEach((wrap) => wrap.classList.remove('char-in-light'));
      if (!heroRaf) {
        heroRaf = requestAnimationFrame(updateTypographyPhysics);
      }
    }

    const heroSection = document.getElementById('hero') || titleEl.closest('section') || titleEl;
    heroSection.addEventListener('mousemove', onHeroMouseMove);
    heroSection.addEventListener('mouseleave', onHeroMouseLeave);

    // Touch support: Tap creates ripple on nearest character
    titleEl.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        onHeroMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        setTimeout(onHeroMouseLeave, 600);
      }
    }, { passive: true });
  }

  /* ==========================================================================
     4. LIGHTWEIGHT PROCEDURAL 3D IDENTITY GLYPH (Pure Canvas 3D Math)
     ========================================================================== */
  function initIdentity3DGlyph() {
    // Look for existing container or mount in the hero or header
    let mount = document.getElementById('identity-glyph-container') || document.querySelector('.identity-glyph-container');
    if (!mount) {
      const hatHeader = document.querySelector('.hat-header');
      if (hatHeader) {
        const glyphWrapper = document.createElement('div');
        glyphWrapper.id = 'identity-glyph-container';
        glyphWrapper.className = 'identity-glyph-container';
        glyphWrapper.setAttribute('title', 'Mayank Yadav 3D Identity Matrix — Drag to Rotate');
        hatHeader.appendChild(glyphWrapper);
        mount = glyphWrapper;
      }
    }

    if (!mount) return;

    let canvas = mount.querySelector('#identity-glyph-canvas') || mount.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'identity-glyph-canvas';
      canvas.className = 'identity-glyph-canvas';
      mount.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let size = 96;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let isVisible = true;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let rotX = 0.4;
    let rotY = 0.6;
    let rotZ = 0.1;
    let velX = 0.005;
    let velY = 0.008;

    function resize() {
      const rect = mount.getBoundingClientRect();
      size = Math.min(Math.max(rect.width || 96, 64), 160);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));

    // Define 3D Tesseract / Cryptographic Node Vertices
    // Outer cube & inner dual octahedron
    const radius = size * 0.32;
    const vertices = [
      // Outer Cube
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
      // Inner Octahedron core
      [0, -1.4, 0], [0, 1.4, 0], [-1.4, 0, 0], [1.4, 0, 0], [0, 0, -1.4], [0, 0, 1.4]
    ].map(v => ({ x: v[0] * radius * 0.65, y: v[1] * radius * 0.65, z: v[2] * radius * 0.65 }));

    const edges = [
      // Outer cube edges
      [0,1], [1,2], [2,3], [3,0],
      [4,5], [5,6], [6,7], [7,4],
      [0,4], [1,5], [2,6], [3,7],
      // Inner core cross-links
      [8,10], [8,11], [8,12], [8,13],
      [9,10], [9,11], [9,12], [9,13],
      [10,12], [12,11], [11,13], [13,10]
    ];

    // Orbiting Web3 Identity nodes
    const identityNodes = [
      { label: 'BASE', angle: 0, speed: 0.02, color: '#a78bfa', dist: radius * 1.05 },
      { label: 'EVM', angle: (Math.PI * 2) / 3, speed: 0.02, color: '#38bdf8', dist: radius * 1.05 },
      { label: 'MRIG', angle: (Math.PI * 4) / 3, speed: 0.02, color: '#34d399', dist: radius * 1.05 }
    ];

    function project(p, cx, cy, fov) {
      // Rotate around X
      let y1 = p.y * Math.cos(rotX) - p.z * Math.sin(rotX);
      let z1 = p.y * Math.sin(rotX) + p.z * Math.cos(rotX);
      // Rotate around Y
      let x2 = p.x * Math.cos(rotY) + z1 * Math.sin(rotY);
      let z2 = -p.x * Math.sin(rotY) + z1 * Math.cos(rotY);
      // Rotate around Z
      let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
      let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);

      const distance = 200;
      const scale = distance / (distance + z2);
      return {
        x: cx + x3 * scale,
        y: cy + y3 * scale,
        z: z2,
        scale
      };
    }

    function render3DGlyph() {
      if (!isVisible) return;

      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;

      // Inertia / Auto-rotation
      if (!isDragging) {
        rotX += velX;
        rotY += velY;
        velX *= 0.96;
        velY *= 0.96;
        if (Math.abs(velX) < 0.003) velX = 0.003;
        if (Math.abs(velY) < 0.006) velY = 0.006;
      }

      // Project vertices
      const projected = vertices.map(v => project(v, cx, cy, 200));

      // Draw edges
      ctx.lineWidth = 1.0;
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.12, Math.min(0.75, (avgZ + radius) / (radius * 2)));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        if (i >= 8 || j >= 8) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.9})`; // Cyan inner core
        } else {
          ctx.strokeStyle = `rgba(167, 139, 250, ${alpha * 0.7})`; // Violet outer
        }
        ctx.stroke();
      });

      // Draw vertices nodes
      projected.forEach((p, idx) => {
        const radiusNode = idx >= 8 ? 2.2 * p.scale : 1.6 * p.scale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(radiusNode, 0.8), 0, Math.PI * 2);
        ctx.fillStyle = idx >= 8 ? '#38bdf8' : '#a78bfa';
        ctx.shadowColor = idx >= 8 ? '#38bdf8' : '#a78bfa';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Orbiting Identity Coordinates
      identityNodes.forEach(node => {
        node.angle += node.speed;
        const nx = Math.cos(node.angle) * node.dist;
        const ny = Math.sin(node.angle) * node.dist * 0.4;
        const nz = Math.sin(node.angle) * node.dist;
        const p = project({ x: nx, y: ny, z: nz }, cx, cy, 200);

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.8 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (!prefersReducedMotion) {
        requestAnimationFrame(render3DGlyph);
      }
    }

    // Drag Interaction
    function onPointerDown(e) {
      isDragging = true;
      lastMouseX = e.clientX || (e.touches && e.touches[0].clientX);
      lastMouseY = e.clientY || (e.touches && e.touches[0].clientY);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const dx = clientX - lastMouseX;
      const dy = clientY - lastMouseY;

      velX = dy * 0.008;
      velY = dx * 0.008;
      rotX += velX;
      rotY += velY;

      lastMouseX = clientX;
      lastMouseY = clientY;
    }

    function onPointerUp() {
      isDragging = false;
    }

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    // IntersectionObserver for 0% CPU consumption when scrolled out
    const glyphObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !prefersReducedMotion) {
          requestAnimationFrame(render3DGlyph);
        }
      });
    }, { threshold: 0.1 });

    glyphObserver.observe(mount);

    if (!prefersReducedMotion) {
      requestAnimationFrame(render3DGlyph);
    } else {
      render3DGlyph();
    }
  }

  /* ==========================================================================
     5. 3D CARD TILT & MOUSE SPOTLIGHT SHEEN (Desktop Only)
     ========================================================================== */
  function initCardTiltAndSpotlight() {
    const cards = document.querySelectorAll(
      '.product-showcase-card, .hat-product-card, .capability-item, .skill-matrix-card, .archive-project-card, .timeline-content, .community-card, .metric-card, .social-channel-card, .about-principles-card, .conn-card, .build-card, .hero-architecture-terminal'
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

        const maxTilt = card.classList.contains('hero-architecture-terminal') ? 2.5 : 4.0;
        const tiltX = -percentY * maxTilt;
        const tiltY = percentX * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(4px)`;

        // Special GetNextIn neon icon parallax tilt
        const neonIcon = card.querySelector('.product-visual-app-icon, .getnextin-icon-glow');
        if (neonIcon) {
          neonIcon.style.transform = `translate3d(${(percentX * 10).toFixed(1)}px, ${(percentY * 10).toFixed(1)}px, 16px) scale(1.05)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.setProperty('--mouse-x', '-999px');
        card.style.setProperty('--mouse-y', '-999px');
        const neonIcon = card.querySelector('.product-visual-app-icon, .getnextin-icon-glow');
        if (neonIcon) neonIcon.style.transform = '';
        bounds = null;
      });
    });
  }

  /* ==========================================================================
     7. SOCIAL PLATFORM TOOLTIPS & MICRO-INTERACTIONS
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
     8. SCROLL-DRIVEN TIMELINE & STAGGERED REVEALS
     ========================================================================== */
  function initScrollAndTimelineEnhancements() {
    const gridContainers = document.querySelectorAll(
      '.metrics-strip, .projects-archive-grid, .venture-duo-grid, .skills-items-grid, .social-platforms-grid, .conn-cards-grid, .hero-stats-row'
    );

    gridContainers.forEach((grid) => {
      const items = grid.children;
      for (let i = 0; i < items.length; i++) {
        const delayClass = `reveal-delay-${Math.min((i % 5) + 1, 5)}`;
        items[i].classList.add(delayClass);
      }
    });

    const timelineItems = document.querySelectorAll('.timeline-item, .exp-ledger-row');
    if (timelineItems.length > 0) {
      const timelineObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        },
        { rootMargin: '-10% 0px -10% 0px', threshold: 0.2 }
      );

      timelineItems.forEach((item) => timelineObserver.observe(item));
    }
  }

  /* ==========================================================================
     9. AMBIENT ORBS PARALLAX
     ========================================================================== */
  function initAmbientOrbsParallax() {
    const heroBg = document.querySelector('.hero-bg') || document.querySelector('.editorial-hero');
    if (!heroBg) return;

    const orbs = document.querySelectorAll('.ambient-glow, .floating-orb');
    if (orbs.length === 0) return;

    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;

      orbs.forEach((orb, idx) => {
        const factor = (idx + 1) * 18;
        orb.style.transform = `translate(${normX * factor}px, ${normY * factor}px)`;
      });
    });
  }

  /* ==========================================================================
     10. STAT COUNTERS ANIMATION
     ========================================================================== */
  function initStatCounters() {
    const counters = document.querySelectorAll('.stat-count, .hero-stat-num');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const rawText = el.textContent.trim();
          const match = rawText.match(/^([0-9,.]+)(.*)$/);

          if (match) {
            const targetVal = parseFloat(match[1].replace(/,/g, ''));
            const suffix = match[2] || '';

            if (prefersReducedMotion || isNaN(targetVal)) {
              obs.unobserve(el);
              return;
            }

            let startTime = null;
            const duration = 1200;

            function countUp(timestamp) {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(ease * targetVal);

              el.textContent = current.toLocaleString() + (progress >= 1 ? suffix : '');

              if (progress < 1) {
                requestAnimationFrame(countUp);
              } else {
                el.textContent = targetVal.toLocaleString() + suffix;
              }
            }

            requestAnimationFrame(countUp);
            obs.unobserve(el);
          }
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((c) => observer.observe(c));
  }

  /* ==========================================================================
     11. SKILL TOOLTIPS
     ========================================================================== */
  function initSkillTooltips() {
    const skillSpans = document.querySelectorAll('.skill-tags span, .block-tech-tag, .product-card-tags span');
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
     12. 6 MEANINGFUL EASTER EGGS SUITE
     ========================================================================== */
  function initEasterEggsSuite() {
    // 1. Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiIndex = 0;

    window.addEventListener('keydown', (e) => {
      const key = e.key;
      if (key.toLowerCase() === konamiSequence[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
          konamiIndex = 0;
          triggerKonamiBeam();
        }
      } else {
        konamiIndex = 0;
      }
    });

    function triggerKonamiBeam() {
      playTactileChime('unlock');
      let beam = document.getElementById('konami-matrix-beam');
      if (!beam) {
        beam = document.createElement('div');
        beam.id = 'konami-matrix-beam';
        beam.className = 'konami-matrix-beam';
        beam.innerHTML = `
          <div class="konami-beam-inner">
            <div class="konami-beam-glitch">[FOUNDER MATRIX UNLOCKED: LEVEL 99 SYSTEM ARCHITECT]</div>
            <div class="konami-beam-sub">SYS_STATE: ALL REPOSITORIES VERIFIED &middot; MRIG / RENTRO / GETNEXTIN / CRYPTICARD</div>
          </div>
        `;
        document.body.appendChild(beam);
      }
      beam.classList.add('active');
      setTimeout(() => {
        beam.classList.remove('active');
      }, 4500);
    }

    // 2. 5-Click Brand Logo Surge
    const logoEl = document.querySelector('.nav-brand, .hq-logo');
    if (logoEl) {
      let clickCount = 0;
      let resetTimer = null;

      logoEl.addEventListener('click', (e) => {
        clickCount++;
        clearTimeout(resetTimer);
        if (clickCount === 5) {
          clickCount = 0;
          playTactileChime('unlock');
          logoEl.classList.add('brand-surge-spin');
          showToast('⚡ SYSTEM INTEGRITY 100% — BUILT BY MAYANK YADAV');
          setTimeout(() => logoEl.classList.remove('brand-surge-spin'), 1200);
        } else {
          resetTimer = setTimeout(() => { clickCount = 0; }, 1500);
        }
      });
    }

    // 3. Global Clipboard Copy Audio & Toast Trigger
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('[data-copy-val], .conn-copy-btn, .conn-inline-copy-btn, .contact-copy-btn');
      if (copyBtn) {
        playTactileChime('copy');
        const val = copyBtn.getAttribute('data-copy-val');
        if (val) {
          showToast(`Copied to clipboard: ${val.length > 28 ? val.substring(0, 26) + '…' : val} ✓`);
        }
      }
    });
  }

  function showToast(message) {
    let toast = document.getElementById('hq-global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'hq-global-toast';
      toast.className = 'hq-global-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  /* ==========================================================================
     13. DEVELOPER CONSOLE ART & VERIFIED COORDINATES
     ========================================================================== */
  function initDevToolsConsoleArt() {
    const stylesTitle = [
      'font-size: 14px',
      'font-family: monospace',
      'color: #a78bfa',
      'font-weight: bold',
      'background: #0f0f16',
      'padding: 8px 12px',
      'border: 1px solid #38bdf8',
      'border-radius: 4px'
    ].join(';');

    const stylesBody = [
      'font-size: 11px',
      'font-family: monospace',
      'color: #94a3b8',
      'line-height: 1.6'
    ].join(';');

    console.log(
      '%c MAYANK YADAV // FOUNDER & PRODUCT ARCHITECT %c\n\n' +
      '  Parent Ecosystem : MRIG (rentro.mrig.tech & getnextin.mrig.tech)\n' +
      '  Identity Protocol: Crypticard (crypticard.tech)\n' +
      '  Smart Accounts   : SVG AegisVault (ERC-4337 + WebAuthn Passkeys)\n' +
      '  Base / ENS       : Maayankyadav.base.eth\n' +
      '  EVM Address      : 0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e\n' +
      '  Solana Address   : EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX\n' +
      '  Official Inbox   : hello@itsmayank.me\n' +
      '  CLI Shortcut     : Press ` or ~ (backtick/tilde) to open Hacker Terminal\n' +
      '  Command Palette  : Press ⌘K or Ctrl+K\n',
      stylesTitle,
      stylesBody
    );
  }

  /* ==========================================================================
     14. ACTIVE NAVIGATION SECTION WAYPOINTS
     ========================================================================== */
  function initSectionWaypoints() {
    const navLinks = document.querySelectorAll('.nav-links-desktop a, .hq-nav-links a');
    const sections = document.querySelectorAll('section[id], main > section');
    if (!navLinks.length || !sections.length) return;

    function updateWaypoints() {
      const scrollPos = window.scrollY + 180;
      let currentSectionId = '';

      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (id && scrollPos >= top && scrollPos < top + height) {
          currentSectionId = id;
        }
      });

      if (currentSectionId) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${currentSectionId}`) {
            link.classList.add('active');
          } else if (href && href.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    }

    window.addEventListener('scroll', updateWaypoints, { passive: true });
    updateWaypoints();
  }

  /* ==========================================================================
     HELPER UTILITIES
     ========================================================================== */
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

})();
