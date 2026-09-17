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

async function capture() {
  await wait(1500);
  const targets = await fetchJson('http://localhost:9223/json/list');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');

  // Desktop 1440
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  await client.send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(1800);

  // Capture GetNextIn & Rentro
  await client.send('Runtime.evaluate', {
    expression: `document.querySelector('[data-exp-id="getnextin-product"]').scrollIntoView({behavior: 'instant', block: 'center'})`
  });
  await wait(300);
  let s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-exp-getnextin-rentro.png', Buffer.from(s.data, 'base64'));

  // Capture Crypticard, Koii, Victus
  await client.send('Runtime.evaluate', {
    expression: `document.querySelector('[data-exp-id="crypticard-core"]').scrollIntoView({behavior: 'instant', block: 'center'})`
  });
  await wait(300);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-exp-crypticard-koii.png', Buffer.from(s.data, 'base64'));

  // Capture Koii & Victus & Community
  await client.send('Runtime.evaluate', {
    expression: `document.querySelector('[data-exp-id="victus-research"]').scrollIntoView({behavior: 'instant', block: 'center'})`
  });
  await wait(300);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-exp-victus-community.png', Buffer.from(s.data, 'base64'));

  // Also check projects.html
  await client.send('Page.navigate', { url: 'http://localhost:3000/projects.html' });
  await wait(1500);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-projects-page.png', Buffer.from(s.data, 'base64'));

  client.close();
  chromeProcess.kill();
  console.log('Capture completed successfully');
}

capture().catch(err => {
  console.error(err);
  if (chromeProcess) chromeProcess.kill();
  process.exit(1);
});
