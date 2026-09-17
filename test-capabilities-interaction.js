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
  '--remote-debugging-port=9224',
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

async function runTest() {
  await wait(1500);
  const targets = await fetchJson('http://localhost:9224/json/list');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  const consoleLogs = [];
  const pageErrors = [];

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('DOM.enable');

  client.on('Runtime.consoleAPICalled', (params) => {
    const text = params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
    consoleLogs.push(`[Console ${params.type}] ${text}`);
    if (params.type === 'error') pageErrors.push(text);
  });

  client.on('Runtime.exceptionThrown', (params) => {
    const desc = params.exceptionDetails.exception ? params.exceptionDetails.exception.description : params.exceptionDetails.text;
    pageErrors.push(`[Exception] ${desc}`);
  });

  // Desktop 1440x900
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  await client.send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(1500);

  // Scroll to capabilities section
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('capabilities').scrollIntoView({behavior: 'instant'})`
  });
  await wait(400);

  // 1. Initial Closed State Screenshot
  let s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-cap-01-closed.png', Buffer.from(s.data, 'base64'));

  // 2. Click capability 01 (Product Architecture & Strategy) anywhere on row
  const click01 = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn01 = document.getElementById('cap-btn-cap-01');
        if (btn01) {
          btn01.click();
          return {
            clicked: true,
            ariaExpanded: btn01.getAttribute('aria-expanded'),
            parentHasIsOpen: btn01.closest('.capability-item').classList.contains('is-open')
          };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });
  console.log('Step 1 - Click Row 01:', click01.result.value);
  await wait(400);

  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-cap-02-open-01.png', Buffer.from(s.data, 'base64'));

  // 3. Click Capability 02 Arrow directly (AI & Machine Learning)
  const click02Arrow = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const arrow02 = document.querySelector('.capability-item[data-cap-id="cap-02"] .cap-arrow-wrapper') || document.getElementById('cap-btn-cap-02');
        if (arrow02) {
          arrow02.click();
          const btn01 = document.getElementById('cap-btn-cap-01');
          const btn02 = document.getElementById('cap-btn-cap-02');
          return {
            clickedArrow02: true,
            btn01AriaExpanded: btn01.getAttribute('aria-expanded'),
            btn02AriaExpanded: btn02.getAttribute('aria-expanded'),
            btn01IsOpen: btn01.closest('.capability-item').classList.contains('is-open'),
            btn02IsOpen: btn02.closest('.capability-item').classList.contains('is-open')
          };
        }
        return { clickedArrow02: false };
      })()
    `,
    returnByValue: true
  });
  console.log('Step 2 - Click Arrow 02 (Accordion Accord):', click02Arrow.result.value);
  await wait(400);

  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-cap-03-open-02.png', Buffer.from(s.data, 'base64'));

  // 4. Test Keyboard interaction on Capability 03 (Web3 Protocol)
  const kbTest03 = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn03 = document.getElementById('cap-btn-cap-03');
        btn03.focus();
        // Trigger click event as keyboard Enter does on buttons
        btn03.click();
        return {
          btn03Focused: document.activeElement === btn03,
          btn03AriaExpanded: btn03.getAttribute('aria-expanded'),
          btn03IsOpen: btn03.closest('.capability-item').classList.contains('is-open')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Step 3 - Keyboard Enter on Cap 03:', kbTest03.result.value);
  await wait(400);

  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-cap-04-open-03.png', Buffer.from(s.data, 'base64'));

  // 5. Test Cap 04 (Marketplace Design) and Cap 05 (Ecosystem)
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('cap-btn-cap-04').click()`
  });
  await wait(350);

  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-cap-05-open-04.png', Buffer.from(s.data, 'base64'));

  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('cap-btn-cap-05').click()`
  });
  await wait(350);

  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-cap-06-open-05.png', Buffer.from(s.data, 'base64'));

  // 6. Mobile 390x844 Audit
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await wait(400);

  // Scroll to capabilities on mobile
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('capabilities').scrollIntoView({behavior: 'instant'})`
  });
  await wait(300);

  // Tap Cap 01 on mobile
  await client.send('Runtime.evaluate', {
    expression: `document.getElementById('cap-btn-cap-01').click()`
  });
  await wait(400);

  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-mobile-cap-01-open.png', Buffer.from(s.data, 'base64'));

  // Also check 412x915 and 430x932
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 412,
    height: 915,
    deviceScaleFactor: 2,
    mobile: true
  });
  await wait(300);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-mobile-412-cap.png', Buffer.from(s.data, 'base64'));

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 430,
    height: 932,
    deviceScaleFactor: 2,
    mobile: true
  });
  await wait(300);
  s = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('audit-mobile-430-cap.png', Buffer.from(s.data, 'base64'));

  // Summary Report
  console.log('=== CAPABILITIES INTERACTION TEST COMPLETE ===');
  console.log('Total Console Messages:', consoleLogs.length);
  console.log('Total Errors/Exceptions:', pageErrors.length);
  if (pageErrors.length > 0) {
    console.error('Page Errors:', pageErrors);
  }

  client.close();
  chromeProcess.kill();
}

runTest().catch(err => {
  console.error('Test Failed:', err);
  if (chromeProcess) chromeProcess.kill();
  process.exit(1);
});
