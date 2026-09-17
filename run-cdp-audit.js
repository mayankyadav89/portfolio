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

const chromeProcess = spawn(browserPath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  '--enable-automation'
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

async function runAudit() {
  await wait(1500);
  const targets = await fetchJson('http://localhost:9222/json/list');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  const consoleLogs = [];
  const pageErrors = [];

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('DOM.enable');
  await client.send('CSS.enable');

  client.on('Runtime.consoleAPICalled', (params) => {
    const text = params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
    consoleLogs.push(`[Console ${params.type}] ${text}`);
    if (params.type === 'error') pageErrors.push(text);
  });

  client.on('Runtime.exceptionThrown', (params) => {
    const desc = params.exceptionDetails.exception ? params.exceptionDetails.exception.description : params.exceptionDetails.text;
    pageErrors.push(`[Exception] ${desc}`);
  });

  await client.send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(2000);

  // Desktop 1440x900
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });
  await wait(600);

  // Screenshot Desktop Hero
  let s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-desktop-01-hero.png', Buffer.from(s.data, 'base64'));

  // Scroll to Selected Work
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('work').scrollIntoView({behavior: 'instant'})`
  });
  await wait(400);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-desktop-02-work.png', Buffer.from(s.data, 'base64'));

  // Scroll to Capabilities & About
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('capabilities').scrollIntoView({behavior: 'instant'})`
  });
  await wait(400);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-desktop-03-capabilities.png', Buffer.from(s.data, 'base64'));

  // Scroll to Experience Section
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('experience').scrollIntoView({behavior: 'instant'})`
  });
  await wait(500);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-desktop-04-experience.png', Buffer.from(s.data, 'base64'));

  // Test Experience Filter Interaction: Click AI & Systems
  await client.send('Runtime.evaluate', {
    expression: `
      const aiExpFilter = document.querySelector('.exp-filter-btn[data-dim="ai"]');
      if (aiExpFilter) aiExpFilter.click();
    `
  });
  await wait(400);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-desktop-04b-experience-ai-filter.png', Buffer.from(s.data, 'base64'));

  // Reset Experience Filter back to All
  await client.send('Runtime.evaluate', {
    expression: `
      const allExpFilter = document.querySelector('.exp-filter-btn[data-dim="all"]');
      if (allExpFilter) allExpFilter.click();
    `
  });
  await wait(300);

  // Scroll to Skills Section
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('skills').scrollIntoView({behavior: 'instant'})`
  });
  await wait(400);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-desktop-05-skills-all.png', Buffer.from(s.data, 'base64'));

  // Click AI & Machine Learning tab in Skills Explorer
  await client.send('Runtime.evaluate', {
    expression: `
      const aiTab = document.querySelector('.skill-tab-btn[data-cat-id="ai-ml"]');
      if (aiTab) aiTab.click();
    `
  });
  await wait(400);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-desktop-06-skills-ai-tab.png', Buffer.from(s.data, 'base64'));

  // Scroll to Connections Section
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('connections').scrollIntoView({behavior: 'instant'})`
  });
  await wait(500);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-desktop-07-connections.png', Buffer.from(s.data, 'base64'));

  // Test Copy interaction feedback on Base ENS / EVM card
  await client.send('Runtime.evaluate', {
    expression: `
      const copyBtn = document.querySelector('.conn-card[data-conn-id="ens-base"] .conn-inline-copy-btn') || document.querySelector('.conn-inline-copy-btn');
      if (copyBtn) copyBtn.click();
    `
  });
  await wait(200);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-desktop-08-connections-copied.png', Buffer.from(s.data, 'base64'));

  // Mobile 390x844 Viewport Audit
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await client.send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(1200);

  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-mobile-01-hero.png', Buffer.from(s.data, 'base64'));

  // Scroll to mobile work
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('work').scrollIntoView({behavior: 'instant'})`
  });
  await wait(400);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-mobile-02-work.png', Buffer.from(s.data, 'base64'));

  // Scroll to mobile experience
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('experience').scrollIntoView({behavior: 'instant'})`
  });
  await wait(400);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-mobile-03-experience.png', Buffer.from(s.data, 'base64'));

  // Scroll to mobile skills
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('skills').scrollIntoView({behavior: 'instant'})`
  });
  await wait(400);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-mobile-04-skills.png', Buffer.from(s.data, 'base64'));

  // Scroll to mobile connections
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('connections').scrollIntoView({behavior: 'instant'})`
  });
  await wait(400);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-mobile-05-connections.png', Buffer.from(s.data, 'base64'));

  // Check DOM integrity
  const domStats = await client.send('Runtime.evaluate', {
    expression: `
      ({
        totalExpLedgerRows: document.querySelectorAll('.exp-ledger-row').length,
        totalExpFilterButtons: document.querySelectorAll('.exp-filter-btn').length,
        totalConnCards: document.querySelectorAll('.conn-card').length,
        totalConnGroups: document.querySelectorAll('.conn-group-block').length,
        totalSkillsCards: document.querySelectorAll('.skill-matrix-card').length,
        totalSkillTabs: document.querySelectorAll('.skill-tab-btn').length,
        hasGetNextInIcon: !!document.querySelector('.getnextin-icon-glow'),
        hasMrigEmblem: !!document.querySelector('.mrig-anchor img'),
        hasRentroIcon: !!document.querySelector('.rentro-icon-glow'),
        hasCrypticardIcon: !!document.querySelector('.crypticard-icon-glow'),
        hasKoiiIcon: !!document.querySelector('.koii-icon-glow'),
        hasVictusIcon: !!document.querySelector('.victus-icon-glow'),
        hasPersonalPhoto: !!document.querySelector('img[src*="1000347520"]'),
        nameText: document.querySelector('.hero-display-title')?.textContent?.trim()
      })
    `,
    returnByValue: true
  });

  console.log('--- AUDIT COMPLETE ---');
  console.log('DOM Evaluation:', JSON.stringify(domStats.result.value, null, 2));
  console.log('Total Console Messages:', consoleLogs.length);
  console.log('Total Errors/Exceptions:', pageErrors.length);
  if (pageErrors.length > 0) {
    console.error('Errors found:', pageErrors);
  }

  client.close();
  chromeProcess.kill();
}

runAudit().catch(err => {
  console.error('Audit Failure:', err);
  if (chromeProcess) chromeProcess.kill();
  process.exit(1);
});
