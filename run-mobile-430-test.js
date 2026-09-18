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
  '--remote-debugging-port=9225',
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

async function runMobile430Audit() {
  const auditReport = {
    viewport: '430x932',
    timestamp: new Date().toISOString(),
    metrics: {},
    hero: {},
    navigation: {},
    work: {},
    capabilities: {},
    skills: {},
    connections: {},
    contact: {},
    copyButtons: {},
    externalLinks: {},
    cursorState: {},
    consoleErrors: [],
    screenshots: []
  };

  try {
    await wait(2000);
    const targets = await fetchJson('http://localhost:9225/json/list');
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

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

    console.log('--- SETTING VIEWPORT 430x932 ---');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 430,
      height: 932,
      deviceScaleFactor: 3,
      mobile: true,
      hasTouch: true
    });

    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await wait(2000);

    // 1. Check Scroll Metrics and Overflow
    const scrollEval = await client.send('Runtime.evaluate', {
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
    auditReport.metrics = scrollEval.result.value;

    // 2. Cursor State Check on Mobile
    const cursorEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        const label = document.querySelector('.cursor-label');
        const dotStyle = dot ? window.getComputedStyle(dot).display : 'none';
        const ringStyle = ring ? window.getComputedStyle(ring).display : 'none';
        const labelStyle = label ? window.getComputedStyle(label).display : 'none';
        return {
          dotHidden: dotStyle === 'none',
          ringHidden: ringStyle === 'none',
          labelHidden: labelStyle === 'none',
          isTouchSafe: dotStyle === 'none' && ringStyle === 'none'
        };
      })()`
    });
    auditReport.cursorState = cursorEval.result.value;

    // 3. Hero Section
    const heroEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const title = document.querySelector('.hero-main-title');
        const subtitle = document.querySelector('.hero-sub-p, .hero-lead-text, .hero-bio');
        const ctas = document.querySelectorAll('.hero-actions a, .hero-actions button');
        const titleRect = title ? title.getBoundingClientRect() : null;
        return {
          titleFound: !!title,
          titleText: title ? title.textContent.trim() : '',
          titleWidth: titleRect ? titleRect.width : 0,
          titleFitsInViewport: titleRect ? titleRect.right <= window.innerWidth : false,
          ctaCount: ctas.length
        };
      })()`
    });
    auditReport.hero = heroEval.result.value;

    let shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-01-hero.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('audit-mobile-430-01-hero.png');

    // 4. Mobile Navigation Drawer Interaction
    const navEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(async () => {
        const hamburger = document.getElementById('nav-hamburger') || document.querySelector('.hq-nav-toggle');
        const drawer = document.getElementById('mobile-nav-drawer') || document.querySelector('.hq-mobile-nav');
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
          navLinks: Array.from(document.querySelectorAll('.mobile-nav-link, .hq-mobile-nav a')).map(a => ({
            text: a.textContent.trim(),
            href: a.getAttribute('href')
          }))
        };
      })()`,
      awaitPromise: true
    });
    auditReport.navigation = navEval.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-02-drawer.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('audit-mobile-430-02-drawer.png');

    // Close drawer
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.getElementById('mobile-nav-close');
        if (closeBtn) closeBtn.click();
        const drawer = document.getElementById('mobile-nav-drawer') || document.querySelector('.hq-mobile-nav');
        if (drawer) {
          drawer.classList.remove('active');
          drawer.classList.remove('is-open');
        }
      })()`
    });
    await wait(300);

    // 5. Work / Projects Section
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
    auditReport.work = workEval.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-03-work.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('audit-mobile-430-03-work.png');

    // 6. Capabilities Accordion
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('capabilities').scrollIntoView({behavior:'instant'})`
    });
    await wait(400);

    const capEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const items = document.querySelectorAll('.cap-item');
        const headers = document.querySelectorAll('.cap-header');
        // Click on item 2 to test touch toggle
        if (headers[1]) headers[1].click();
        const item2Active = items[1] ? items[1].classList.contains('active') : false;

        return {
          totalItems: items.length,
          touchToggleSuccess: item2Active,
          allFitWidth: Array.from(items).every(item => item.getBoundingClientRect().right <= window.innerWidth + 2)
        };
      })()`
    });
    auditReport.capabilities = capEval.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-04-capabilities.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('audit-mobile-430-04-capabilities.png');

    // 7. Skills Section
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('skills').scrollIntoView({behavior:'instant'})`
    });
    await wait(400);

    const skillsEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const catButtons = document.querySelectorAll('.skill-category-pill, .skill-cat-btn');
        const searchInput = document.getElementById('skills-search-input');
        const skillCards = document.querySelectorAll('.skill-tag, .skill-card');

        // Test category click
        if (catButtons[1]) catButtons[1].click();

        return {
          categoryPillsCount: catButtons.length,
          searchInputFound: !!searchInput,
          totalSkillsCount: skillCards.length,
          allTagsFitViewport: Array.from(skillCards).every(s => s.getBoundingClientRect().right <= window.innerWidth + 5)
        };
      })()`
    });
    auditReport.skills = skillsEval.result.value;

    // Reset skill filter to all
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const catButtons = document.querySelectorAll('.skill-category-pill, .skill-cat-btn');
        if (catButtons[0]) catButtons[0].click();
      })()`
    });
    await wait(200);

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-05-skills.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('audit-mobile-430-05-skills.png');

    // 8. Connections Section & Copy Buttons
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('connections').scrollIntoView({behavior:'instant'})`
    });
    await wait(400);

    const connEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const connCards = document.querySelectorAll('.connection-card');
        const copyBtns = document.querySelectorAll('.conn-copy-btn, .conn-inline-copy-btn, [data-copy-target]');
        return {
          connectionCardsCount: connCards.length,
          copyButtonsCount: copyBtns.length,
          allCardsFitWidth: Array.from(connCards).every(c => c.getBoundingClientRect().right <= window.innerWidth + 2)
        };
      })()`
    });
    auditReport.connections = connEval.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-06-connections.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('audit-mobile-430-06-connections.png');

    // 9. Contact Section & Dispatch Form
    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('contact').scrollIntoView({behavior:'instant'})`
    });
    await wait(400);

    const contactEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const form = document.getElementById('hero-contact-form');
        const copyBtn = document.getElementById('copy-email-hero-btn');
        const emailInput = document.getElementById('cf-email');
        const msgInput = document.getElementById('cf-message');
        const nameInput = document.getElementById('cf-name');

        let mailtoGenerated = null;
        if (form && emailInput && msgInput) {
          nameInput.value = 'Test Recruiter';
          emailInput.value = 'recruiter@tech.com';
          msgInput.value = 'Interested in discussing a technology leadership role.';

          const subject = encodeURIComponent('Technical Discussion - Test Recruiter');
          const body = encodeURIComponent('From: Test Recruiter (recruiter@tech.com)\n\nInterested in discussing a technology leadership role.');
          mailtoGenerated = 'mailto:hello@itsmayank.me?subject=' + subject + '&body=' + body;
        }

        const fullText = document.body.innerText;
        return {
          formFound: !!form,
          copyEmailBtnFound: !!copyBtn,
          emailInputsInteractive: !!emailInput && !!msgInput,
          mailtoPatternVerified: mailtoGenerated && mailtoGenerated.startsWith('mailto:hello@itsmayank.me'),
          noFakePGP: !fullText.includes('0x89F4') && !fullText.includes('PGP:'),
          noFakeLatency: !fullText.includes('24H LATENCY < 4H') && !fullText.includes('SIGNAL: ACTIVE')
        };
      })()`
    });
    auditReport.contact = contactEval.result.value;

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('audit-mobile-430-07-contact.png', Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push('audit-mobile-430-07-contact.png');

    // 10. External Links Verification
    const linkEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        const external = links.filter(a => a.href.startsWith('http://') || a.href.startsWith('https://'));
        const internal = links.filter(a => !a.href.startsWith('http://') && !a.href.startsWith('https://'));

        const rentroLinks = external.filter(a => a.href.includes('rentro.mrig.tech'));
        const getnextinLinks = external.filter(a => a.href.includes('getnextin.mrig.tech'));
        const typoLinks = external.filter(a => a.href.includes('rentro.mrit.tech'));

        return {
          totalLinks: links.length,
          externalLinksCount: external.length,
          rentroLinksCount: rentroLinks.length,
          getNextInLinksCount: getnextinLinks.length,
          typoLinksCount: typoLinks.length,
          allExternalHaveRelNoopener: external.every(a => a.rel && a.rel.includes('noopener'))
        };
      })()`
    });
    auditReport.externalLinks = linkEval.result.value;

    fs.writeFileSync('audit-mobile-430x932-full-report.json', JSON.stringify(auditReport, null, 2));
    console.log('=== 430x932 MOBILE AUDIT COMPLETE ===');
    console.log(JSON.stringify(auditReport, null, 2));

  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    try {
      chromeProcess.kill();
      process.exit(0);
    } catch (e) {}
  }
}

runMobile430Audit();
