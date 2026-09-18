/**
 * ============================================================================
 * SERVER & RESUME MANAGEMENT SYSTEM — Mayank Yadav Founder Digital HQ
 * Run with: node server.js
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const resumeService = require('./resume-service');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// Initialize Resume and Storage Engine
resumeService.initStorage();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

/**
 * Helper: Parse JSON Body
 */
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 20 * 1024 * 1024) { // 20 MB max payload
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Helper: Send JSON Response
 */
function sendJson(res, statusCode, data, extraHeaders = {}) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  }, extraHeaders));
  res.end(payload);
}

/**
 * Helper: Extract Bearer Token or Session Cookie
 */
function extractToken(req) {
  // Check Authorization Header
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  // Check Cookies
  const cookieHeader = req.headers['cookie'] || '';
  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const c of cookies) {
    if (c.startsWith('session_token=')) {
      return decodeURIComponent(c.slice('session_token='.length));
    }
  }
  return null;
}

/**
 * Helper: Get Client IP
 */
function getClientIp(req) {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
}

/**
 * Main HTTP Request Handler
 */
const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('?');
  const reqPath = decodeURI(urlParts[0]);
  const clientIp = getClientIp(req);

  // Handle CORS Pre-flight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // =========================================================================
  // 1. PUBLIC RESUME DOWNLOAD & METADATA ENDPOINTS
  // =========================================================================
  if (reqPath === '/api/resume/download' || reqPath === '/resume/download' || reqPath === '/resume.pdf') {
    const query = urlParts[1] ? new URLSearchParams(urlParts[1]) : new URLSearchParams();
    const versionId = query.get('v');
    const resume = resumeService.getActiveResumeFile(versionId);
    if (!resume.exists) {
      sendJson(res, 404, { success: false, error: 'No active resume document is currently published.' });
      return;
    }

    const downloadFilename = (resume.metadata && resume.metadata.filename)
      ? resume.metadata.filename.replace(/[^a-zA-Z0-9._-]/g, '_')
      : 'Mayank_Yadav_Resume.pdf';

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': resume.size,
      'Content-Disposition': `inline; filename="${downloadFilename}"`,
      'Cache-Control': 'public, max-age=60, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(resume.path);
    stream.pipe(res);
    return;
  }

  if (reqPath === '/api/resume/active' || reqPath === '/api/resume/metadata') {
    const meta = resumeService.getMetadata();
    if (!meta.current) {
      sendJson(res, 404, { success: false, error: 'No active resume is available.' });
      return;
    }
    sendJson(res, 200, {
      success: true,
      resume: {
        id: meta.current.id,
        filename: meta.current.filename,
        size: meta.current.size,
        uploadedAt: meta.current.uploadedAt,
        sha256: meta.current.sha256,
        versionNumber: meta.current.versionNumber,
        downloadUrl: '/api/resume/download'
      }
    });
    return;
  }

  // =========================================================================
  // 2. ADMIN AUTHENTICATION ENDPOINTS
  // =========================================================================
  if (reqPath === '/api/admin/login' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { identifier, password } = body;

      if (!identifier || !password) {
        sendJson(res, 400, { success: false, error: 'Identifier and password are required.' });
        return;
      }

      const result = resumeService.authenticateAdmin(identifier, password, clientIp);
      if (!result.success) {
        sendJson(res, 401, result);
        return;
      }

      // Set secure cookie
      const cookieVal = `session_token=${encodeURIComponent(result.token)}; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400`;
      sendJson(res, 200, result, { 'Set-Cookie': cookieVal });
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message || 'Malformed request.' });
    }
    return;
  }

  if (reqPath === '/api/admin/session' && req.method === 'GET') {
    const token = extractToken(req);
    const session = resumeService.validateSession(token);
    if (!session) {
      sendJson(res, 200, { authenticated: false });
      return;
    }
    sendJson(res, 200, {
      authenticated: true,
      user: {
        email: session.email,
        username: session.username,
        role: session.role
      },
      expiresAt: session.expiresAt
    });
    return;
  }

  if (reqPath === '/api/admin/logout' && req.method === 'POST') {
    const token = extractToken(req);
    resumeService.revokeSession(token);
    const expiredCookie = `session_token=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0`;
    sendJson(res, 200, { success: true, message: 'Logged out successfully.' }, { 'Set-Cookie': expiredCookie });
    return;
  }

  // =========================================================================
  // 3. ADMIN PROTECTED MUTATION ENDPOINTS (Strict Superuser Authorization)
  // =========================================================================
  if (reqPath.startsWith('/api/admin/')) {
    const token = extractToken(req);
    const session = resumeService.validateSession(token);

    if (!session || session.role !== 'superuser') {
      sendJson(res, 401, {
        success: false,
        error: 'Unauthorized. Superuser credentials required.'
      });
      return;
    }

    if (reqPath === '/api/admin/resume' && req.method === 'GET') {
      const telemetry = resumeService.getAdminTelemetry();
      sendJson(res, 200, { success: true, data: telemetry });
      return;
    }

    if (reqPath === '/api/admin/resume/upload' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const { filename, fileData, notes, setAsActive } = body;

        if (!fileData) {
          sendJson(res, 400, { success: false, error: 'File data is required.' });
          return;
        }

        // Parse base64
        let base64Content = fileData;
        if (base64Content.includes('base64,')) {
          base64Content = base64Content.split('base64,')[1];
        }

        const fileBuffer = Buffer.from(base64Content, 'base64');
        const uploadResult = resumeService.uploadResume(
          fileBuffer,
          filename || 'Resume_Mayank_Yadav.pdf',
          notes || '',
          setAsActive !== false
        );

        if (!uploadResult.success) {
          sendJson(res, 400, uploadResult);
          return;
        }

        sendJson(res, 200, uploadResult);
      } catch (err) {
        sendJson(res, 500, { success: false, error: err.message || 'File upload failed.' });
      }
      return;
    }

    if (reqPath === '/api/admin/resume/set-active' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const { versionId } = body;
        if (!versionId) {
          sendJson(res, 400, { success: false, error: 'versionId is required.' });
          return;
        }
        const setResult = resumeService.setActiveVersion(versionId);
        sendJson(res, setResult.success ? 200 : 400, setResult);
      } catch (err) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return;
    }

    if (reqPath === '/api/admin/resume/delete' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const { versionId } = body;
        if (!versionId) {
          sendJson(res, 400, { success: false, error: 'versionId is required.' });
          return;
        }
        const delResult = resumeService.deleteVersion(versionId);
        sendJson(res, delResult.success ? 200 : 400, delResult);
      } catch (err) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return;
    }

    if (reqPath === '/api/admin/change-password' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const { currentPassword, newPassword } = body;
        const passResult = resumeService.changeAdminPassword(token, currentPassword, newPassword);
        sendJson(res, passResult.success ? 200 : 400, passResult);
      } catch (err) {
        sendJson(res, 500, { success: false, error: err.message });
      }
      return;
    }

    sendJson(res, 404, { success: false, error: 'Admin API endpoint not found.' });
    return;
  }

  // =========================================================================
  // 4. ADMIN INTERFACE ROUTE (with noindex headers)
  // =========================================================================
  if (reqPath === '/admin' || reqPath === '/admin/' || reqPath === '/admin/resume' || reqPath === '/admin.html') {
    const adminHtmlPath = path.join(PUBLIC_DIR, 'admin.html');
    if (!fs.existsSync(adminHtmlPath)) {
      sendJson(res, 404, { error: 'Admin interface template not found.' });
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    });
    fs.createReadStream(adminHtmlPath).pipe(res);
    return;
  }

  // =========================================================================
  // 5. STATIC ASSET SERVING WITH SECURITY GUARDS
  // =========================================================================
  let safePath = reqPath;
  if (safePath === '/' || safePath === '') safePath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, safePath);

  // Path Traversal Guard
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(path.normalize(PUBLIC_DIR))) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 Forbidden</h1>');
    return;
  }

  fs.stat(normalizedPath, (err, stats) => {
    if (err) {
      // Try appending .html
      const htmlPath = normalizedPath + '.html';
      if (fs.existsSync(htmlPath)) {
        serveStaticFile(res, htmlPath);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<h1>404 Not Found</h1><p>The requested path was not found on this server.</p>`);
      }
      return;
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(normalizedPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        serveStaticFile(res, indexPath);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<h1>404 Not Found</h1><p>Directory index not found.</p>`);
      }
      return;
    }

    serveStaticFile(res, normalizedPath);
  });
});

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
    'Access-Control-Allow-Origin': '*'
  });
  fs.createReadStream(filePath).pipe(res);
}

// Start HTTP Server
server.listen(PORT, () => {
  console.log(`\n⚡ Mayank Yadav Founder Digital HQ running at: http://localhost:${PORT}`);
  console.log(`🔒 Resume Management Service initialized.`);
  console.log(`📄 Active Resume Download: http://localhost:${PORT}/api/resume/download`);
  console.log(`🛡️  Admin Dashboard: http://localhost:${PORT}/admin\n`);
});
