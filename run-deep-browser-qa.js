const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const possiblePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe'
];

let browserPath = possiblePaths.find(p => p && fs.existsSync(p));

const chromeProcess = spawn(browserPath, [
  '--headless=new',
  '--remote-debugging-port=9223',
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

async function deepAudit() {
  try {
    await wait(2000);
    const targets = await fetchJson('http://localhost:9223/json/list');
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    const consoleLogs = [];
    client.on('Runtime.consoleAPICalled', (params) => {
      const text = params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      consoleLogs.push({ type: params.type, text });
    });

    console.log('--- AUDITING INDEX.HTML AT 1440x900 ---');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await wait(2500);

    // Scroll to bottom gradually to trigger all lazy image loads and observer hooks
    await client.send('Runtime.evaluate', {
      expression: `(async () => {
        const distance = 400;
        const delay = 100;
        while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
          document.scrollingElement.scrollBy(0, distance);
          await new Promise(r => setTimeout(r, delay));
        }
        await new Promise(r => setTimeout(r, 800));
        window.scrollTo(0, 0);
      })()`,
      awaitPromise: true
    });
    await wait(1200);

    // Deep inspect each dynamic section
    const auditData = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const results = {};

        // 1. Hero Magnetic Typography
        const heroTitle = document.querySelector('.hero-main-title');
        const magChars = document.querySelectorAll('.mag-char-wrap');
        const glyphCanvas = document.getElementById('identity-glyph-canvas');
        results.hero = {
          titleAriaLabel: heroTitle ? heroTitle.getAttribute('aria-label') : null,
          magCharsCount: magChars.length,
          chars: Array.from(magChars).map(c => c.textContent.trim()),
          glyphCanvas: {
            exists: !!glyphCanvas,
            width: glyphCanvas ? glyphCanvas.width : 0,
            height: glyphCanvas ? glyphCanvas.height : 0
          }
        };

        // 2. Capabilities Accordion
        const capRoot = document.getElementById('capabilities-accordion');
        const capItems = document.querySelectorAll('.cap-item');
        results.capabilities = {
          rootExists: !!capRoot,
          itemCount: capItems.length,
          items: Array.from(capItems).map(item => ({
            num: item.querySelector('.cap-num') ? item.querySelector('.cap-num').textContent : '',
            title: item.querySelector('.cap-title') ? item.querySelector('.cap-title').textContent : '',
            hasBody: !!item.querySelector('.cap-body'),
            isExpanded: item.classList.contains('active') || item.getAttribute('aria-expanded') === 'true'
          }))
        };

        // 3. Work Section & Cards
        const workCards = document.querySelectorAll('.product-showcase-card');
        results.work = {
          count: workCards.length,
          projects: Array.from(workCards).map(card => ({
            id: card.getAttribute('data-project'),
            title: card.querySelector('.product-card-title') ? card.querySelector('.product-card-title').textContent : '',
            hasSpotlightEffect: card.classList.contains('spotlight-card') || card.style.getPropertyValue('--mouse-x') !== undefined,
            tags: Array.from(card.querySelectorAll('.product-card-tags span')).map(t => t.textContent)
          }))
        };

        // 4. Experience Ledger
        const expRoot = document.getElementById('experience-root');
        const expCards = document.querySelectorAll('.exp-card');
        const expFilters = document.querySelectorAll('.exp-filter-pill');
        results.experience = {
          rootExists: !!expRoot,
          cardCount: expCards.length,
          filterCount: expFilters.length,
          filters: Array.from(expFilters).map(f => f.getAttribute('data-dimension') || f.textContent.trim()),
          roles: Array.from(expCards).map(c => ({
            role: c.querySelector('.exp-role') ? c.querySelector('.exp-role').textContent : '',
            org: c.querySelector('.exp-org') ? c.querySelector('.exp-org').textContent : '',
            period: c.querySelector('.exp-period') ? c.querySelector('.exp-period').textContent : ''
          }))
        };

        // 5. Skills Matrix Explorer
        const skillsRoot = document.getElementById('skills-explorer-root');
        const skillCategories = document.querySelectorAll('.skill-category-pill, .skill-cat-btn');
        const skillTags = document.querySelectorAll('.skill-tag');
        results.skills = {
          rootExists: !!skillsRoot,
          categoryCount: skillCategories.length,
          tagCount: skillTags.length,
          tagsSample: Array.from(skillTags).slice(0, 8).map(t => t.textContent.trim()),
          hasSearch: !!document.getElementById('skills-search-input')
        };

        // 6. Connections & Digital Identity
        const connRoot = document.getElementById('connections-root');
        const connCards = document.querySelectorAll('.connection-card');
        results.connections = {
          rootExists: !!connRoot,
          cardCount: connCards.length,
          identities: Array.from(connCards).map(c => ({
            name: c.querySelector('.conn-name') ? c.querySelector('.conn-name').textContent : '',
            value: c.querySelector('.conn-value') ? c.querySelector('.conn-value').textContent : ''
          }))
        };

        // 7. Contact Section Form & Telemetry
        const contactForm = document.getElementById('hero-contact-form');
        const copyBtn = document.getElementById('copy-email-hero-btn');
        results.contact = {
          formExists: !!contactForm,
          copyEmailBtnExists: !!copyBtn,
          operatingBaseRendered: document.body.innerText.includes('Bhopal, MP, India (UTC+05:30)'),
          noFakePGPRendered: !document.body.innerText.includes('0x89F4') && !document.body.innerText.includes('PGP verification: 0x89F4...B021'),
          noFakeLatencyRendered: !document.body.innerText.includes('24H LATENCY < 4H')
        };

        // 8. Brand Assets (naturalWidth / naturalHeight check)
        const allImgs = Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.getAttribute('src'),
          alt: img.getAttribute('alt'),
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          loaded: img.complete && img.naturalWidth > 0
        }));
        results.images = allImgs;

        // 9. Check Personal Photos (Zero founder face photos)
        const personalPhotoInDOM = Array.from(document.querySelectorAll('img')).some(img =>
          (img.src && img.src.includes('founder-mayank.png')) ||
          (img.alt && img.alt.toLowerCase().includes('portrait')) ||
          (img.alt && img.alt.toLowerCase().includes('photo of mayank'))
        );
        results.personalPhotoInDOM = personalPhotoInDOM;

        return results;
      })()`
    });

    console.log('AUDIT DATA:', JSON.stringify(auditData.result.value, null, 2));
    fs.writeFileSync('qa-deep-audit-data.json', JSON.stringify({
      data: auditData.result.value,
      logs: consoleLogs
    }, null, 2));

    // Test Accordion click
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const firstCap = document.querySelector('.cap-header');
        if (firstCap) firstCap.click();
      })()`
    });
    await wait(300);

    // Test Skills Search
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('skills-search-input');
        if (input) {
          input.value = 'PostGIS';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()`
    });
    await wait(300);

    // Capture screenshot of filtered skills
    let shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-deep-skills-filtered.png', Buffer.from(shot.data, 'base64'));

    // Test Terminal Shell Execution
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        if (window.openFounderTerminal) window.openFounderTerminal();
        const input = document.getElementById('cli-input');
        if (input) {
          input.value = 'matrix';
          input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }
      })()`
    });
    await wait(400);

    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('qa-deep-terminal-matrix.png', Buffer.from(shot.data, 'base64'));

    console.log('--- AUDITING ALL SECONDARY ROUTES ---');
    const routes = ['about.html', 'projects.html', 'experience.html', 'skills.html', 'contact.html'];
    const routeResults = {};

    for (const route of routes) {
      await client.send('Page.navigate', { url: `http://localhost:3000/${route}` });
      await wait(1200);
      const res = await client.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const title = document.title;
          const nav = !!document.querySelector('.hq-navbar');
          const footer = !!document.querySelector('footer, .hq-footer');
          const personalPhoto = Array.from(document.querySelectorAll('img')).some(img =>
            (img.src && img.src.includes('founder-mayank.png')) ||
            (img.alt && img.alt.toLowerCase().includes('portrait'))
          );
          const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth === 0).length;
          return { title, nav, footer, personalPhoto, brokenImages };
        })()`
      });
      routeResults[route] = res.result.value;
    }

    fs.writeFileSync('qa-routes-audit.json', JSON.stringify(routeResults, null, 2));
    console.log('ROUTES AUDIT:', JSON.stringify(routeResults, null, 2));

  } catch (err) {
    console.error('Deep audit failed:', err);
  } finally {
    try {
      chromeProcess.kill();
    } catch (e) {}
  }
}

deepAudit();
