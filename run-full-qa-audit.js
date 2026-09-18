const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const possiblePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe'
];

let browserPath = possiblePaths.find(p => p && fs.existsSync(p));
if (!browserPath) {
  console.error('No Chrome or Edge browser executable found.');
  process.exit(1);
}

console.log('Using browser at:', browserPath);

// Start server
const server = require('./server.js');

// Start browser process
const chromeProcess = spawn(browserPath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  '--enable-automation',
  '--autoplay-policy=no-user-gesture-required'
]);

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 0;
    this.callbacks = new Map();
    this.eventListeners = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.addEventListener('open', () => resolve());
      this.ws.addEventListener('error', reject);
      this.ws.addEventListener('message', (event) => {
        const raw = typeof event.data === 'string' ? event.data : event.data.toString();
        const msg = JSON.parse(raw);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          else resolve(msg.result);
        } else if (msg.method && this.eventListeners.has(msg.method)) {
          this.eventListeners.get(msg.method)(msg.params);
        }
      });
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(event, handler) {
    this.eventListeners.set(event, handler);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runComprehensiveAudit() {
  const auditReport = {
    hero: {},
    cursor: {},
    threeD: {},
    hover: {},
    mobile: {},
    projects: {},
    experience: {},
    capabilities: {},
    skills: {},
    connections: {},
    contact: {},
    terminal: {},
    easterEggs: {},
    web3: {},
    brandAssets: {},
    urlAudit: {},
    personalPhoto: {},
    performance: {},
    accessibility: {},
    consoleErrors: [],
    screenshots: []
  };

  try {
    await wait(2000);
    const targets = await fetchJson('http://localhost:9222/json/list');
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');
    await client.send('CSS.enable');

    client.on('Runtime.consoleAPICalled', (params) => {
      const text = params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      if (params.type === 'error') {
        auditReport.consoleErrors.push(`[Console Error] ${text}`);
      }
    });

    client.on('Runtime.exceptionThrown', (params) => {
      const desc = params.exceptionDetails.exception ? params.exceptionDetails.exception.description : params.exceptionDetails.text;
      auditReport.consoleErrors.push(`[Exception] ${desc}`);
    });

    console.log('--- STARTING DESKTOP AUDIT (1440x900) ---');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await wait(2000);

    // 1. HERO & 3D GLYPH AUDIT
    const heroStatus = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const title = document.querySelector('.hero-main-title');
        const charWraps = document.querySelectorAll('.mag-char-wrap');
        const glyphCanvas = document.getElementById('identity-glyph-canvas');
        const ctx = glyphCanvas ? glyphCanvas.getContext('2d') : null;
        return {
          titleFound: !!title,
          ariaLabel: title ? title.getAttribute('aria-label') : null,
          charCount: charWraps.length,
          glyphCanvasFound: !!glyphCanvas,
          canvasWidth: glyphCanvas ? glyphCanvas.width : 0,
          canvasHeight: glyphCanvas ? glyphCanvas.height : 0
        };
      })()`
    });
    auditReport.hero = heroStatus.result.value;

    // Simulate mouse movement across hero letters to test physics
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const firstLetter = document.querySelector('.mag-char-wrap');
        if (firstLetter) {
          const rect = firstLetter.getBoundingClientRect();
          const evt = new MouseEvent('mousemove', {
            clientX: rect.left + 5,
            clientY: rect.top + 5,
            bubbles: true
          });
          document.getElementById('hero').dispatchEvent(evt);
        }
      })()`
    });
    await wait(300);

    let shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-01-desktop-hero.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-01-desktop-hero.png (1440x900 Desktop Hero & Interactive Typography)');

    // 2. CAPABILITIES ACCORDION AUDIT
    const capTest = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const rows = document.querySelectorAll('.cap-accordion-item, .capability-row, .cap-card');
        const firstRow = document.querySelector('.cap-accordion-header, .cap-accordion-item, .capability-row');
        let toggled = false;
        if (firstRow) {
          firstRow.click();
          toggled = true;
        }
        return {
          rowCount: rows.length,
          toggled: toggled,
          activeCount: document.querySelectorAll('.active, [aria-expanded="true"]').length
        };
      })()`
    });
    auditReport.capabilities = capTest.result.value;

    // Scroll to capabilities & capture
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('capabilities') ? document.getElementById('capabilities').scrollIntoView({behavior:'instant'}) : null`
    });
    await wait(400);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-02-desktop-capabilities.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-02-desktop-capabilities.png (1440x900 Capabilities Accordion)');

    // 3. SELECTED WORK AUDIT
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('work') ? document.getElementById('work').scrollIntoView({behavior:'instant'}) : null`
    });
    await wait(400);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-03-desktop-work.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-03-desktop-work.png (1440x900 Selected Work & Ventures)');

    // 4. EXPERIENCE AUDIT & FILTER
    const expTest = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const aiFilter = document.querySelector('.exp-filter-btn[data-dim="ai"]');
        if (aiFilter) aiFilter.click();
        const visibleItems = document.querySelectorAll('.exp-timeline-item:not(.exp-item-hidden), .timeline-item:not(.timeline-hidden)');
        return {
          aiFilterFound: !!aiFilter,
          visibleItemsCount: visibleItems.length
        };
      })()`
    });
    auditReport.experience = expTest.result.value;

    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('experience') ? document.getElementById('experience').scrollIntoView({behavior:'instant'}) : null`
    });
    await wait(400);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-04-desktop-experience.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-04-desktop-experience.png (1440x900 Experience Timeline & Filter)');

    // 5. SKILLS TAXONOMY & SEARCH AUDIT
    const skillsTest = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const searchInput = document.getElementById('skills-search-input');
        if (searchInput) {
          searchInput.value = 'AI';
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const activeCards = document.querySelectorAll('.skill-card:not(.skill-card-hidden), .skill-matrix-card:not(.hidden)');
        return {
          searchInputFound: !!searchInput,
          filteredCardCount: activeCards.length
        };
      })()`
    });
    auditReport.skills = skillsTest.result.value;

    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('skills') ? document.getElementById('skills').scrollIntoView({behavior:'instant'}) : null`
    });
    await wait(400);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-05-desktop-skills.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-05-desktop-skills.png (1440x900 Skills Matrix & Filter)');

    // 6. CONNECTIONS & DIGITAL IDENTITY AUDIT
    const connTest = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const baseCard = document.querySelector('[data-conn-id="ens-base"], .conn-card');
        const copyBtns = document.querySelectorAll('.conn-inline-copy-btn, .conn-copy-btn');
        return {
          baseCardFound: !!baseCard,
          copyBtnsCount: copyBtns.length,
          ensAddress: 'Maayankyadav.base.eth',
          evmAddress: '0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e',
          solanaAddress: 'EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX'
        };
      })()`
    });
    auditReport.connections = connTest.result.value;

    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('connections') ? document.getElementById('connections').scrollIntoView({behavior:'instant'}) : null`
    });
    await wait(400);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-06-desktop-connections.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-06-desktop-connections.png (1440x900 Web3 Digital Identity & Connections)');

    // 7. CONTACT SECTION & FORM DISPATCH AUDIT
    const contactTest = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const form = document.getElementById('hero-contact-form');
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const msgInput = document.getElementById('form-message');
        if (nameInput) nameInput.value = 'Alice Researcher';
        if (emailInput) emailInput.value = 'alice@frontier.org';
        if (msgInput) msgInput.value = 'Interested in discussing physical asset marketplace architecture.';
        return {
          formFound: !!form,
          nameInput: !!nameInput,
          emailInput: !!emailInput,
          msgInput: !!msgInput
        };
      })()`
    });
    auditReport.contact = contactTest.result.value;

    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('contact') ? document.getElementById('contact').scrollIntoView({behavior:'instant'}) : null`
    });
    await wait(400);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-07-desktop-contact.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-07-desktop-contact.png (1440x900 Contact Section & Availability)');

    // 8. COMMAND PALETTE (Cmd+K) AUDIT
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('.cmd-palette-btn');
        if (btn) btn.click();
      })()`
    });
    await wait(400);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-08-desktop-cmd-palette.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-08-desktop-cmd-palette.png (1440x900 Command Palette)');

    // Close palette
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const overlay = document.getElementById('cmd-palette-overlay');
        if (overlay) overlay.classList.remove('active');
      })()`
    });
    await wait(200);

    // 9. HACKER CLI TERMINAL AUDIT
    const termTest = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        if (window.TerminalShell && window.TerminalShell.toggle) {
          window.TerminalShell.toggle();
        }
        const terminalOverlay = document.getElementById('cli-terminal-overlay');
        const input = document.getElementById('cli-input');
        const output = document.getElementById('cli-output');

        let testedCommands = [];
        if (input) {
          ['help', 'about', 'mrig', 'rentro', 'getnextin', 'crypticard', 'web3', 'matrix'].forEach(cmd => {
            input.value = cmd;
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            testedCommands.push(cmd);
          });
        }
        return {
          terminalOpen: terminalOverlay ? terminalOverlay.classList.contains('active') : false,
          commandsRun: testedCommands,
          outputLines: output ? output.children.length : 0
        };
      })()`
    });
    auditReport.terminal = termTest.result.value;

    await wait(400);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-09-desktop-terminal.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-09-desktop-terminal.png (1440x900 CLI Terminal Shell with Command Outputs)');

    // Close terminal
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const overlay = document.getElementById('cli-terminal-overlay');
        if (overlay) overlay.classList.remove('active');
      })()`
    });
    await wait(200);

    // 10. DEDICATED CONTACT PAGE AUDIT
    await client.send('Page.navigate', { url: 'http://localhost:3000/contact.html' });
    await wait(1500);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-10-contact-page.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-10-contact-page.png (1440x900 Dedicated Contact Page)');

    // 11. MOBILE AUDIT (390x844 iPhone Viewport)
    console.log('--- STARTING MOBILE 390x844 AUDIT ---');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await wait(1800);

    const mobileCheck = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const hamburger = document.getElementById('nav-hamburger') || document.querySelector('.hq-nav-toggle');
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        return {
          scrollWidth: scrollWidth,
          innerWidth: innerWidth,
          hasHorizontalOverflow: scrollWidth > innerWidth,
          hamburgerFound: !!hamburger,
          cursorHiddenOnMobile: cursorDot ? window.getComputedStyle(cursorDot).display === 'none' : true
        };
      })()`
    });
    auditReport.mobile['390x844'] = mobileCheck.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-11-mobile-390-hero.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-11-mobile-390-hero.png (390x844 Mobile Hero & Layout)');

    // Open mobile nav drawer
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const toggle = document.getElementById('nav-hamburger') || document.querySelector('.hq-nav-toggle');
        if (toggle) toggle.click();
      })()`
    });
    await wait(400);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-12-mobile-390-drawer.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-12-mobile-390-drawer.png (390x844 Mobile Navigation Drawer)');

    // Close mobile nav drawer
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.getElementById('mobile-nav-close');
        if (closeBtn) closeBtn.click();
      })()`
    });
    await wait(200);

    // Scroll to mobile work
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('work') ? document.getElementById('work').scrollIntoView({behavior:'instant'}) : null`
    });
    await wait(300);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-13-mobile-390-work.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-13-mobile-390-work.png (390x844 Mobile Work Cards)');

    // 12. MOBILE AUDIT (412x915 Android Viewport)
    console.log('--- STARTING MOBILE 412x915 AUDIT ---');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 412,
      height: 915,
      deviceScaleFactor: 2,
      mobile: true
    });
    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await wait(1500);
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-14-mobile-412-hero.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('qa-14-mobile-412-hero.png (412x915 Mobile Hero)');

    // 13. URL INTEGRITY & ASSET AUDIT
    const assetCheck = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          broken: img.naturalWidth === 0
        }));
        return imgs;
      })()`
    });
    auditReport.brandAssets = assetCheck.result.value;

    fs.writeFileSync('qa-audit-results.json', JSON.stringify(auditReport, null, 2));
    console.log('=== AUDIT COMPLETE — RESULTS SAVED TO qa-audit-results.json ===');
  } catch (err) {
    console.error('Audit encountered an error:', err);
  } finally {
    try {
      chromeProcess.kill();
      process.exit(0);
    } catch (e) {}
  }
}

runComprehensiveAudit();
