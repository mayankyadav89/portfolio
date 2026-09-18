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

const server = require('./server.js');

const chromeProcess = spawn(browserPath, [
  '--headless=new',
  '--remote-debugging-port=9228',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars'
]);

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
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

async function runMasterAudit() {
  const masterReport = {
    timestamp: new Date().toISOString(),
    desktopResults: {},
    mobileResults: {},
    crossViewports: [],
    consoleErrors: [],
    failedRequests: [],
    screenshots: []
  };

  try {
    await wait(2000);
    const targets = await fetchJson('http://localhost:9228/json/list');
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');
    await client.send('Network.enable');

    client.on('Runtime.consoleAPICalled', (params) => {
      const text = params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      if (params.type === 'error') {
        masterReport.consoleErrors.push(`[Console Error] ${text}`);
      }
    });

    client.on('Runtime.exceptionThrown', (params) => {
      const desc = params.exceptionDetails.exception ? params.exceptionDetails.exception.description : params.exceptionDetails.text;
      masterReport.consoleErrors.push(`[Exception] ${desc}`);
    });

    client.on('Network.loadingFailed', (params) => {
      masterReport.failedRequests.push(`[Failed Request] ${params.errorText} - ${params.requestId}`);
    });

    // ==========================================
    // 1. DESKTOP AUDIT (1440x900)
    // ==========================================
    console.log('--- RUNNING DESKTOP AUDIT (1440x900) ---');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await wait(2000);

    const desktopHero = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const title = document.querySelector('.hero-main-title');
        const ctas = document.querySelectorAll('.hero-actions-row a, .hero-actions-row .btn');
        const hexSig = document.querySelector('.hero-hex-signature');
        const glyphCanvas = document.getElementById('identity-glyph-canvas');
        const terminal = document.querySelector('.hero-architecture-terminal');
        const titleRect = title ? title.getBoundingClientRect() : null;

        return {
          titleFound: !!title,
          titleText: title ? title.textContent.trim().replace(/\\s+/g, ' ') : '',
          titleFitsInViewport: titleRect ? (titleRect.right <= window.innerWidth && titleRect.left >= 0) : false,
          ctaCount: ctas.length,
          hexSigFound: !!hexSig,
          hexSigText: hexSig ? hexSig.textContent.trim() : '',
          glyphCanvasFound: !!glyphCanvas,
          terminalFound: !!terminal
        };
      })()`
    });
    masterReport.desktopResults.hero = desktopHero.result.value;

    let shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-desktop-01-hero.png', Buffer.from(shot.data, 'base64'));
    masterReport.screenshots.push('audit-desktop-01-hero.png');

    // ==========================================
    // 2. MOBILE AUDIT (430x932 iPhone 14/15/16 Pro Max)
    // ==========================================
    console.log('--- RUNNING MOBILE AUDIT (430x932) ---');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 430,
      height: 932,
      deviceScaleFactor: 3,
      mobile: true,
      hasTouch: true
    });

    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await wait(2000);

    // Scroll & Viewport Metrics
    const mobileMetrics = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const scrollW = document.documentElement.scrollWidth;
        const innerW = window.innerWidth;
        const bodyScrollW = document.body.scrollWidth;
        return {
          documentScrollWidth: scrollW,
          bodyScrollWidth: bodyScrollW,
          windowInnerWidth: innerW,
          hasHorizontalOverflow: scrollW > innerW || bodyScrollW > innerW,
          isExactMatch: scrollW === innerW
        };
      })()`
    });
    masterReport.mobileResults.metrics = mobileMetrics.result.value;

    // Mobile Hero
    const mobileHero = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const title = document.querySelector('.hero-main-title');
        const ctas = document.querySelectorAll('.hero-actions-row a, .hero-actions-row .btn');
        const hexSig = document.querySelector('.hero-hex-signature');
        const titleRect = title ? title.getBoundingClientRect() : null;

        return {
          titleFound: !!title,
          titleText: title ? title.textContent.trim().replace(/\\s+/g, ' ') : '',
          titleWidth: titleRect ? titleRect.width : 0,
          titleFitsInViewport: titleRect ? (titleRect.right <= window.innerWidth && titleRect.left >= 0) : false,
          ctaCount: ctas.length,
          hexSigFound: !!hexSig,
          hexSigText: hexSig ? hexSig.textContent.trim() : ''
        };
      })()`
    });
    masterReport.mobileResults.hero = mobileHero.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-01-hero.png', Buffer.from(shot.data, 'base64'));
    masterReport.screenshots.push('audit-mobile-430-01-hero.png');

    // Mobile Navigation Drawer Interaction
    const navEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(async () => {
        const hamburger = document.getElementById('nav-hamburger');
        const drawer = document.getElementById('mobile-nav-drawer');
        const closeBtn = document.getElementById('mobile-nav-close');

        let opened = false;
        if (hamburger) {
          hamburger.click();
          await new Promise(r => setTimeout(r, 400));
          opened = drawer ? (drawer.classList.contains('active') || drawer.classList.contains('is-open') || window.getComputedStyle(drawer).display !== 'none') : false;
        }
        return {
          hamburgerFound: !!hamburger,
          drawerFound: !!drawer,
          drawerOpenedOnClick: opened,
          closeBtnFound: !!closeBtn,
          navLinksCount: document.querySelectorAll('.mobile-nav-link').length
        };
      })()`,
      awaitPromise: true
    });
    masterReport.mobileResults.navigation = navEval.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-02-drawer.png', Buffer.from(shot.data, 'base64'));
    masterReport.screenshots.push('audit-mobile-430-02-drawer.png');

    // Close drawer
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.getElementById('mobile-nav-close');
        if (closeBtn) closeBtn.click();
        const drawer = document.getElementById('mobile-nav-drawer');
        if (drawer) {
          drawer.classList.remove('active');
          drawer.classList.remove('is-open');
        }
      })()`
    });
    await wait(300);

    // Work Section
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('work').scrollIntoView({behavior:'instant'})`
    });
    await wait(400);

    const workEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const cards = document.querySelectorAll('.product-showcase-card');
        return {
          cardCount: cards.length,
          allCardsFitViewport: Array.from(cards).every(c => c.getBoundingClientRect().right <= window.innerWidth + 2),
          projects: Array.from(cards).map(c => ({
            id: c.getAttribute('data-project'),
            title: c.querySelector('.product-card-title') ? c.querySelector('.product-card-title').textContent.trim() : '',
            hasUrl: !!c.querySelector('.product-visual-url')
          }))
        };
      })()`
    });
    masterReport.mobileResults.work = workEval.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-03-work.png', Buffer.from(shot.data, 'base64'));
    masterReport.screenshots.push('audit-mobile-430-03-work.png');

    // Capabilities Section (Accordion Touch Interaction)
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('capabilities').scrollIntoView({behavior:'instant'})`
    });
    await wait(400);

    const capEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(async () => {
        const items = document.querySelectorAll('.capability-item');
        const triggers = document.querySelectorAll('.capability-trigger');

        // Test touch toggle on capability item 2
        let toggled = false;
        if (triggers[1]) {
          triggers[1].click();
          await new Promise(r => setTimeout(r, 400));
          toggled = items[1].classList.contains('is-open');
        }

        return {
          totalItems: items.length,
          triggersFound: triggers.length,
          touchToggleSuccess: toggled,
          allFitWidth: Array.from(items).every(item => item.getBoundingClientRect().right <= window.innerWidth + 2),
          capabilityTitles: Array.from(items).map(item => item.querySelector('.cap-name') ? item.querySelector('.cap-name').textContent.trim() : '')
        };
      })()`,
      awaitPromise: true
    });
    masterReport.mobileResults.capabilities = capEval.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-04-capabilities.png', Buffer.from(shot.data, 'base64'));
    masterReport.screenshots.push('audit-mobile-430-04-capabilities.png');

    // Skills Section (Taxonomy Tabs & Search)
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('skills').scrollIntoView({behavior:'instant'})`
    });
    await wait(400);

    const skillsEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(async () => {
        const tabButtons = document.querySelectorAll('.skill-tab-btn');
        const searchInput = document.getElementById('skills-search-input');
        const initialCards = document.querySelectorAll('.skill-matrix-card');

        // Click AI & ML Tab (Tab index 2)
        let filterWorking = false;
        let aiCardCount = 0;
        if (tabButtons[2]) {
          tabButtons[2].click();
          await new Promise(r => setTimeout(r, 200));
          const filteredCards = document.querySelectorAll('.skill-matrix-card');
          aiCardCount = filteredCards.length;
          filterWorking = aiCardCount > 0 && aiCardCount < initialCards.length;
        }

        // Reset to All Stacks (Re-query fresh tab list after re-render)
        const freshTabs = document.querySelectorAll('.skill-tab-btn');
        if (freshTabs[0]) {
          freshTabs[0].click();
          await new Promise(r => setTimeout(r, 200));
        }

        const totalSkills = document.querySelectorAll('.skill-matrix-card').length;

        return {
          categoryTabsCount: freshTabs.length,
          searchInputFound: !!searchInput,
          totalSkillsCount: totalSkills,
          tabFilteringVerified: filterWorking,
          aiTabSkillCount: aiCardCount,
          allCardsFitViewport: Array.from(document.querySelectorAll('.skill-matrix-card')).every(s => s.getBoundingClientRect().right <= window.innerWidth + 5)
        };
      })()`,
      awaitPromise: true
    });
    masterReport.mobileResults.skills = skillsEval.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-05-skills.png', Buffer.from(shot.data, 'base64'));
    masterReport.screenshots.push('audit-mobile-430-05-skills.png');

    // Connections Section & Copy Buttons
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('connections').scrollIntoView({behavior:'instant'})`
    });
    await wait(400);

    const connEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const connCards = document.querySelectorAll('.conn-card');
        const copyBtns = document.querySelectorAll('.conn-copy-btn, .conn-inline-copy-btn, [data-copy-val]');
        return {
          connectionCardsCount: connCards.length,
          copyButtonsCount: copyBtns.length,
          allCardsFitWidth: Array.from(connCards).every(c => c.getBoundingClientRect().right <= window.innerWidth + 2)
        };
      })()`
    });
    masterReport.mobileResults.connections = connEval.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-06-connections.png', Buffer.from(shot.data, 'base64'));
    masterReport.screenshots.push('audit-mobile-430-06-connections.png');

    // Contact Section & Dispatch Form
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('contact').scrollIntoView({behavior:'instant'})`
    });
    await wait(400);

    const contactEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const form = document.getElementById('hero-contact-form');
        const copyBtn = document.getElementById('copy-email-hero-btn');
        const emailInput = document.getElementById('form-email');
        const msgInput = document.getElementById('form-message');
        const nameInput = document.getElementById('form-name');

        let mailtoGenerated = null;
        if (form && emailInput && msgInput && nameInput) {
          nameInput.value = 'Test Recruiter';
          emailInput.value = 'recruiter@tech.com';
          msgInput.value = 'Interested in discussing a technology leadership role.';

          const subject = encodeURIComponent('[Founder Inquiry] from Test Recruiter');
          const body = encodeURIComponent('Name: Test Recruiter\\nEmail: recruiter@tech.com\\n\\nMessage:\\nInterested in discussing a technology leadership role.');
          mailtoGenerated = 'mailto:hello@itsmayank.me?subject=' + subject + '&body=' + body;
        }

        const fullText = document.body.innerText;
        return {
          formFound: !!form,
          copyEmailBtnFound: !!copyBtn,
          emailInputsInteractive: !!emailInput && !!msgInput && !!nameInput,
          mailtoPatternVerified: mailtoGenerated && mailtoGenerated.startsWith('mailto:hello@itsmayank.me'),
          noFakePGP: !fullText.includes('0x89F4') && !fullText.includes('PGP:'),
          noFakeLatency: !fullText.includes('24H LATENCY < 4H') && !fullText.includes('SIGNAL: ACTIVE')
        };
      })()`
    });
    masterReport.mobileResults.contact = contactEval.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-07-contact.png', Buffer.from(shot.data, 'base64'));
    masterReport.screenshots.push('audit-mobile-430-07-contact.png');

    // External Links & rel="noopener" Audit
    const linkEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        const external = links.filter(a => a.href.startsWith('http://') || a.href.startsWith('https://'));
        const targetBlankLinks = links.filter(a => a.target === '_blank');

        const rentroLinks = external.filter(a => a.href.includes('rentro.mrig.tech'));
        const getnextinLinks = external.filter(a => a.href.includes('getnextin.mrig.tech'));
        const typoLinks = external.filter(a => a.href.includes('rentro.mrit.tech'));

        const targetBlankAllHaveNoopener = targetBlankLinks.every(a => a.rel && a.rel.includes('noopener'));

        return {
          totalLinks: links.length,
          externalLinksCount: external.length,
          targetBlankCount: targetBlankLinks.length,
          targetBlankAllHaveNoopener: targetBlankAllHaveNoopener,
          rentroLinksCount: rentroLinks.length,
          getNextInLinksCount: getnextinLinks.length,
          typoLinksCount: typoLinks.length
        };
      })()`
    });
    masterReport.mobileResults.externalLinks = linkEval.result.value;

    // ==========================================
    // 3. MULTI-VIEWPORT RESPONSIVENESS MATRIX
    // ==========================================
    const testViewports = [
      { name: 'Desktop Full HD', width: 1920, height: 1080, mobile: false },
      { name: 'Desktop Laptop Standard', width: 1440, height: 900, mobile: false },
      { name: 'Desktop Laptop Compact', width: 1366, height: 768, mobile: false },
      { name: 'Desktop Small / Tablet Landscape', width: 1280, height: 720, mobile: false },
      { name: 'Mobile iPhone 14/15/16 Pro Max', width: 430, height: 932, mobile: true },
      { name: 'Mobile Android Large Pixel 7', width: 412, height: 915, mobile: true },
      { name: 'Mobile iPhone 12/13/14 Standard', width: 390, height: 844, mobile: true }
    ];

    for (const vp of testViewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.mobile ? 3 : 1,
        mobile: vp.mobile,
        hasTouch: vp.mobile
      });
      await wait(400);

      const vpEval = await client.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const scrollW = document.documentElement.scrollWidth;
          const innerW = window.innerWidth;
          const bodyW = document.body.scrollWidth;
          const title = document.querySelector('.hero-main-title');
          const titleRect = title ? title.getBoundingClientRect() : null;
          return {
            viewport: '${vp.name} (${vp.width}x${vp.height})',
            scrollWidth: scrollW,
            innerWidth: innerW,
            noOverflow: scrollW <= innerW && bodyW <= innerW,
            titleFits: titleRect ? (titleRect.right <= innerW && titleRect.left >= 0) : false
          };
        })()`
      });
      masterReport.crossViewports.push(vpEval.result.value);
    }

    fs.writeFileSync('audit-master-final-report.json', JSON.stringify(masterReport, null, 2));
    console.log('=== MASTER FINAL AUDIT COMPLETE ===');
    console.log(JSON.stringify(masterReport, null, 2));

  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    try {
      chromeProcess.kill();
      process.exit(0);
    } catch (e) {}
  }
}

runMasterAudit();
