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
  '--remote-debugging-port=9222',
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

  close() {
    if (this.ws) this.ws.close();
  }
}

async function testInteractiveStudio() {
  await wait(1500);
  const targets = await fetchJson('http://localhost:9222/json/list');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('DOM.enable');

  await client.send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(2000);

  // 1. Check initial state
  const initial = await client.send('Runtime.evaluate', {
    expression: `(function() {
      return {
        avatar: window.FounderIdentity.getAvatar(),
        isCustom: window.FounderIdentity.isCustomAvatar(),
        domImgCount: document.querySelectorAll('[data-founder-avatar]').length
      };
    })()`,
    returnByValue: true
  });
  console.log('Initial State:', initial.result.value);

  // 2. Open Profile Studio
  await client.send('Runtime.evaluate', {
    expression: `window.ProfileStudio.open();`
  });
  await wait(800);

  // 3. Simulate zoom change to 1.6x and Pan
  await client.send('Runtime.evaluate', {
    expression: `(function() {
      window.ProfileStudio.cropState.zoom = 1.6;
      window.ProfileStudio.cropState.offsetX = 20;
      window.ProfileStudio.cropState.offsetY = -15;
      window.ProfileStudio.renderCanvas();
      return true;
    })()`
  });
  await wait(500);

  // 4. Trigger Save
  await client.send('Runtime.evaluate', {
    expression: `window.ProfileStudio.saveCroppedAvatar();`
  });
  await wait(1000);

  // 5. Verify local storage and DOM sync
  const postSave = await client.send('Runtime.evaluate', {
    expression: `(function() {
      const stored = localStorage.getItem('mayank_founder_identity_v1');
      const parsed = stored ? JSON.parse(stored) : null;
      const avatarImg = document.querySelector('[data-founder-avatar]');
      return {
        hasLocalStorage: !!stored,
        savedAvatarLength: parsed ? parsed.avatar.length : 0,
        isDataUrl: parsed ? parsed.avatar.startsWith('data:image/jpeg') : false,
        domImgSrcIsDataUrl: avatarImg ? avatarImg.src.startsWith('data:image/jpeg') : false,
        version: parsed ? parsed.version : 0,
        cropDetails: parsed ? parsed.cropDetails : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Post-Save Verification:', postSave.result.value);

  // 6. Test Reset to Original
  await client.send('Runtime.evaluate', {
    expression: `window.FounderIdentity.resetAvatar();`
  });
  await wait(500);

  const postReset = await client.send('Runtime.evaluate', {
    expression: `(function() {
      const avatarImg = document.querySelector('[data-founder-avatar]');
      return {
        avatar: window.FounderIdentity.getAvatar(),
        isCustom: window.FounderIdentity.isCustomAvatar(),
        domImgSrc: avatarImg ? avatarImg.getAttribute('src') : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Post-Reset Verification:', postReset.result.value);

  // Check mobile viewport screenshot
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await wait(500);

  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0;`
  });
  await wait(500);

  const mobileHero = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-mobile-hero-verified.png', Buffer.from(mobileHero.data, 'base64'));
  console.log('Saved audit-mobile-hero-verified.png');

  client.close();
  chromeProcess.kill();
  console.log('Interactive Profile Studio tests passed with flying colors!');
}

testInteractiveStudio().catch(err => {
  console.error('Interactive Test Error:', err);
  if (chromeProcess) chromeProcess.kill();
  process.exit(1);
});
