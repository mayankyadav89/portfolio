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
  '--remote-debugging-port=9229',
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

async function debugHero() {
  try {
    await wait(2000);
    const targets = await fetchJson('http://localhost:9229/json/list');
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Navigating to http://localhost:3000/...');
    await client.send('Page.navigate', { url: 'http://localhost:3000/' });

    const checkpoints = [50, 100, 250, 500, 1000, 2000];
    for (const cp of checkpoints) {
      await wait(cp === 50 ? 50 : (cp - checkpoints[checkpoints.indexOf(cp) - 1]));

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
          const canvas = document.getElementById('hero-canvas');
          const glyph = document.getElementById('identity-glyph-canvas');

          function getInfo(el, name) {
            if (!el) return { name, exists: false };
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return {
              name,
              exists: true,
              display: style.display,
              visibility: style.visibility,
              opacity: style.opacity,
              zIndex: style.zIndex,
              position: style.position,
              transform: style.transform,
              rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height, bottom: rect.bottom, right: rect.right },
              innerHTMLSnippet: el.innerHTML.slice(0, 100),
              innerText: el.innerText ? el.innerText.slice(0, 80).replace(/\\s+/g, ' ') : ''
            };
          }

          return {
            timestamp: ${cp},
            hero: getInfo(hero, 'hero'),
            heroText: getInfo(heroText, 'heroText'),
            heroVisual: getInfo(heroVisual, 'heroVisual'),
            title: getInfo(title, 'title'),
            pitch: getInfo(pitch, 'pitch'),
            ctas: getInfo(ctas, 'ctas'),
            stats: getInfo(stats, 'stats'),
            canvas: getInfo(canvas, 'canvas'),
            glyph: getInfo(glyph, 'glyph')
          };
        })()`
      });

      console.log('=== CHECKPOINT ' + cp + 'ms ===');
      console.log(JSON.stringify(evalRes.result.value, null, 2));

      let shot = await client.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('debug-hero-' + cp + 'ms.png', Buffer.from(shot.data, 'base64'));
    }

  } catch (err) {
    console.error('Debug failed:', err);
  } finally {
    try {
      chromeProcess.kill();
      process.exit(0);
    } catch (e) {}
  }
}

debugHero();
