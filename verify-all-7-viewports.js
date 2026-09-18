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
  '--remote-debugging-port=9230',
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

  close() {
    if (this.ws) this.ws.close();
  }
}

const VIEWPORTS = [
  { name: 'desktop-1280x720', width: 1280, height: 720, mobile: false },
  { name: 'desktop-1366x768', width: 1366, height: 768, mobile: false },
  { name: 'desktop-1440x900', width: 1440, height: 900, mobile: false },
  { name: 'desktop-1920x1080', width: 1920, height: 1080, mobile: false },
  { name: 'mobile-390x844', width: 390, height: 844, mobile: true },
  { name: 'mobile-412x915', width: 412, height: 915, mobile: true },
  { name: 'mobile-430x932', width: 430, height: 932, mobile: true }
];

const CHECKPOINTS = [100, 500, 1000, 2000];

async function runMasterAudit() {
  const finalReport = {
    timestamp: new Date().toISOString(),
    viewports: {},
    consoleErrors: [],
    networkFailures: [],
    reducedMotionVerification: {}
  };

  try {
    await wait(2000);
    const targets = await fetchJson('http://localhost:9230/json/list');
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');
    await client.send('Log.enable');
    await client.send('Network.enable');

    client.eventListeners.set('Runtime.exceptionThrown', (params) => {
      finalReport.consoleErrors.push({
        type: 'exception',
        description: params.exceptionDetails.text,
        stack: params.exceptionDetails.exception ? params.exceptionDetails.exception.description : null
      });
    });

    client.eventListeners.set('Log.entryAdded', (params) => {
      if (params.entry.level === 'error') {
        finalReport.consoleErrors.push({
          type: 'log_error',
          text: params.entry.text,
          url: params.entry.url
        });
      }
    });

    client.eventListeners.set('Network.responseReceived', (params) => {
      if (params.response.status >= 400) {
        finalReport.networkFailures.push({
          url: params.response.url,
          status: params.response.status,
          statusText: params.response.statusText
        });
      }
    });

    for (const vp of VIEWPORTS) {
      console.log(`Testing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      finalReport.viewports[vp.name] = {
        config: vp,
        checkpoints: {}
      };

      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      if (vp.mobile) {
        await client.send('Emulation.setTouchEmulationEnabled', { enabled: true });
      } else {
        await client.send('Emulation.setTouchEmulationEnabled', { enabled: false });
      }

      // Fresh navigation & reload
      await client.send('Page.navigate', { url: 'http://localhost:3000/?t=' + Date.now() });

      let elapsed = 0;
      for (const cp of CHECKPOINTS) {
        const toWait = cp - elapsed;
        await wait(toWait);
        elapsed = cp;

        const evalRes = await client.send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            const hero = document.getElementById('hero');
            const heroText = document.querySelector('.hero-editorial-text');
            const heroVisual = document.querySelector('.hero-editorial-visual');
            const title = document.querySelector('.hero-main-title');
            const pitch = document.querySelector('.hero-pitch');
            const ctas = document.querySelector('.hero-actions-row');
            const stats = document.querySelector('.hero-stats-row');
            const body = document.body;
            const docEl = document.documentElement;

            function inspectEl(el) {
              if (!el) return { exists: false };
              const s = window.getComputedStyle(el);
              const r = el.getBoundingClientRect();
              return {
                exists: true,
                display: s.display,
                visibility: s.visibility,
                opacity: parseFloat(s.opacity),
                transform: s.transform,
                rect: {
                  top: Math.round(r.top),
                  left: Math.round(r.left),
                  width: Math.round(r.width),
                  height: Math.round(r.height),
                  bottom: Math.round(r.bottom),
                  right: Math.round(r.right)
                },
                textLength: el.innerText ? el.innerText.trim().length : 0,
                textSnippet: el.innerText ? el.innerText.trim().slice(0, 60).replace(/\\s+/g, ' ') : ''
              };
            }

            const heroData = inspectEl(hero);
            const titleData = inspectEl(title);
            const pitchData = inspectEl(pitch);
            const ctasData = inspectEl(ctas);
            const statsData = inspectEl(stats);
            const heroTextData = inspectEl(heroText);
            const heroVisualData = inspectEl(heroVisual);

            const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
            const clientWidth = docEl.clientWidth;
            const hasHorizontalOverflow = scrollWidth > clientWidth + 2;

            const isTitleInViewport = titleData.exists && titleData.rect.top >= 0 && titleData.rect.top < window.innerHeight && titleData.rect.left >= 0 && titleData.rect.right <= window.innerWidth + 5;

            const isHeroPopulated = heroData.exists && heroData.opacity > 0 && heroData.visibility !== 'hidden' && heroData.display !== 'none' && titleData.exists && titleData.textLength > 0 && pitchData.exists && pitchData.textLength > 0;

            return {
              checkpointMs: ${cp},
              isHeroPopulated,
              isTitleInViewport,
              hasHorizontalOverflow,
              hero: heroData,
              title: titleData,
              pitch: pitchData,
              ctas: ctasData,
              stats: statsData,
              heroText: heroTextData,
              heroVisual: heroVisualData
            };
          })()`
        });

        finalReport.viewports[vp.name].checkpoints[cp] = evalRes.result.value;
      }

      // Screenshot at 2000ms
      const shot = await client.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`audit-vp-${vp.name}.png`, Buffer.from(shot.data, 'base64'));
    }

    // Test reduced motion mode
    console.log('Testing prefers-reduced-motion: reduce...');
    await client.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await client.send('Page.navigate', { url: 'http://localhost:3000/?reduced=1' });
    await wait(500);

    const reducedRes = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const hero = document.getElementById('hero');
        const title = document.querySelector('.hero-main-title');
        const s = window.getComputedStyle(hero);
        const st = window.getComputedStyle(title);
        return {
          heroDisplay: s.display,
          heroVisibility: s.visibility,
          heroOpacity: s.opacity,
          titleText: title ? title.innerText.replace(/\\s+/g, ' ') : '',
          cursorDotDisplay: window.getComputedStyle(document.querySelector('.cursor-dot') || document.body).display
        };
      })()`
    });
    finalReport.reducedMotionVerification = reducedRes.result.value;

    fs.writeFileSync('audit-7-viewports-result.json', JSON.stringify(finalReport, null, 2));
    console.log('Audit complete! Results saved to audit-7-viewports-result.json');

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
