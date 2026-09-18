/**
 * ============================================================================
 * RESUME MANAGEMENT SERVICE — Mayank Yadav Founder Digital HQ
 * Single-Superuser Secure Resume Management & Dynamic File Delivery Engine
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = __dirname;
const STORAGE_DIR = path.join(ROOT_DIR, 'storage', 'resume');
const VERSIONS_DIR = path.join(STORAGE_DIR, 'versions');
const METADATA_FILE = path.join(STORAGE_DIR, 'metadata.json');
const CURRENT_FILE = path.join(STORAGE_DIR, 'current.pdf');
const ADMIN_CONFIG_FILE = path.join(ROOT_DIR, 'storage', 'admin_config.json');

// Security Boundaries
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB limit
const ALLOWED_MIME_TYPES = ['application/pdf'];
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// In-Memory Active Sessions Store { token: { email, createdAt, expiresAt } }
const activeSessions = new Map();

// In-Memory IP Rate Limiter for Login { ip: { attempts, lockedUntil } }
const loginRateLimiter = new Map();

/**
 * Initialize storage folders and default files
 */
function initStorage() {
  if (!fs.existsSync(VERSIONS_DIR)) {
    fs.mkdirSync(VERSIONS_DIR, { recursive: true });
  }

  // Ensure metadata exists
  if (!fs.existsSync(METADATA_FILE)) {
    const defaultMeta = {
      activeVersionId: null,
      current: null,
      history: []
    };
    fs.writeFileSync(METADATA_FILE, JSON.stringify(defaultMeta, null, 2));
  }

  // Check if we need to ingest the initial resume from Downloads or existing current.pdf
  ingestInitialResumeIfAvailable();

  // Ensure admin config exists
  initAdminConfig();
}

/**
 * Hash password with scrypt
 */
function hashPassword(password, salt) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    hash: derivedKey.toString('hex'),
    salt: salt
  };
}

/**
 * Timing-safe password verification
 */
function verifyPassword(password, storedHash, salt) {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const storedBuf = Buffer.from(storedHash, 'hex');
    if (derivedKey.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(derivedKey, storedBuf);
  } catch (err) {
    return false;
  }
}

/**
 * Initialize Admin Configuration
 */
function initAdminConfig() {
  const adminEmail = process.env.ADMIN_EMAIL || 'hello@itsmayank.me';
  const rawAdminPassword = process.env.ADMIN_PASSWORD || 'Mayank@Founder2026!';

  if (!fs.existsSync(ADMIN_CONFIG_FILE)) {
    const hashed = hashPassword(rawAdminPassword);
    const config = {
      email: adminEmail,
      username: 'mayankyadav89',
      passwordHash: hashed.hash,
      salt: hashed.salt,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2));
  }
}

/**
 * Get Admin Config
 */
function getAdminConfig() {
  initAdminConfig();
  try {
    return JSON.parse(fs.readFileSync(ADMIN_CONFIG_FILE, 'utf8'));
  } catch (err) {
    return {
      email: 'hello@itsmayank.me',
      username: 'mayankyadav89'
    };
  }
}

/**
 * Ingest initial verified source resume if not already present
 */
function ingestInitialResumeIfAvailable() {
  if (fs.existsSync(CURRENT_FILE)) return;

  const candidatePaths = [
    'C:/Users/mayan/Downloads/Resume mayank yadav.pdf',
    path.join(ROOT_DIR, 'Resume mayank yadav.pdf'),
    path.join(ROOT_DIR, 'Resume_mayank_yadav.pdf')
  ];

  for (const srcPath of candidatePaths) {
    if (fs.existsSync(srcPath)) {
      try {
        const fileBuffer = fs.readFileSync(srcPath);
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        const stats = fs.statSync(srcPath);
        const versionId = 'v_' + Date.now();
        const storedFilename = 'Resume_Mayank_Yadav_Initial.pdf';
        const versionPath = path.join(VERSIONS_DIR, storedFilename);

        fs.writeFileSync(versionPath, fileBuffer);
        fs.writeFileSync(CURRENT_FILE, fileBuffer);

        const versionObj = {
          id: versionId,
          filename: 'Resume mayank yadav.pdf',
          storedFilename: storedFilename,
          size: stats.size,
          mimeType: 'application/pdf',
          uploadedAt: new Date().toISOString(),
          sha256: hash,
          versionNumber: 1,
          notes: 'Initial verified source resume'
        };

        const metadata = {
          activeVersionId: versionId,
          current: versionObj,
          history: [versionObj]
        };

        fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
        break;
      } catch (err) {
        console.error('[ResumeService] Initial ingestion error:', err);
      }
    }
  }
}

/**
 * Load Resume Metadata
 */
function getMetadata() {
  initStorage();
  try {
    const raw = fs.readFileSync(METADATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { activeVersionId: null, current: null, history: [] };
  }
}

/**
 * Save Resume Metadata
 */
function saveMetadata(meta) {
  fs.writeFileSync(METADATA_FILE, JSON.stringify(meta, null, 2));
}

/**
 * Get active resume file stream / buffer
 */
function getActiveResumeFile(versionId = null) {
  initStorage();
  const meta = getMetadata();

  if (versionId) {
    const target = (meta.history || []).find(v => v.id === versionId);
    if (target) {
      const storedPath = path.join(VERSIONS_DIR, target.storedFilename);
      if (fs.existsSync(storedPath)) {
        const stats = fs.statSync(storedPath);
        return {
          exists: true,
          path: storedPath,
          size: stats.size,
          metadata: target
        };
      }
    }
  }

  if (fs.existsSync(CURRENT_FILE)) {
    const stats = fs.statSync(CURRENT_FILE);
    return {
      exists: true,
      path: CURRENT_FILE,
      size: stats.size,
      metadata: meta.current || {
        filename: 'Mayank_Yadav_Resume.pdf',
        mimeType: 'application/pdf'
      }
    };
  }
  return { exists: false };
}

/**
 * Authenticate Superuser
 */
function authenticateAdmin(identifier, password, ip = '127.0.0.1') {
  const now = Date.now();
  const limiter = loginRateLimiter.get(ip) || { attempts: 0, lockedUntil: 0 };

  if (limiter.lockedUntil > now) {
    const minutesLeft = Math.ceil((limiter.lockedUntil - now) / 60000);
    return {
      success: false,
      error: `Too many failed login attempts. Locked for ${minutesLeft} more minute(s).`
    };
  }

  const config = getAdminConfig();
  const cleanId = (identifier || '').trim().toLowerCase();
  const isEmailMatch = cleanId === (config.email || '').toLowerCase();
  const isUserMatch = cleanId === (config.username || '').toLowerCase();

  if (!isEmailMatch && !isUserMatch) {
    limiter.attempts++;
    if (limiter.attempts >= MAX_LOGIN_ATTEMPTS) {
      limiter.lockedUntil = now + LOCKOUT_DURATION_MS;
    }
    loginRateLimiter.set(ip, limiter);
    return { success: false, error: 'Invalid superuser credentials.' };
  }

  const isPasswordValid = verifyPassword(password, config.passwordHash, config.salt);
  if (!isPasswordValid) {
    limiter.attempts++;
    if (limiter.attempts >= MAX_LOGIN_ATTEMPTS) {
      limiter.lockedUntil = now + LOCKOUT_DURATION_MS;
    }
    loginRateLimiter.set(ip, limiter);
    return { success: false, error: 'Invalid superuser credentials.' };
  }

  // Reset rate limiter on successful authentication
  loginRateLimiter.delete(ip);

  // Update last login
  config.lastLogin = new Date().toISOString();
  fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2));

  // Generate Session Token
  const token = crypto.randomBytes(32).toString('hex');
  const sessionData = {
    email: config.email,
    username: config.username,
    role: 'superuser',
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS
  };

  activeSessions.set(token, sessionData);

  return {
    success: true,
    token: token,
    user: {
      email: config.email,
      username: config.username,
      role: 'superuser'
    },
    expiresAt: sessionData.expiresAt
  };
}

/**
 * Validate Session Token
 */
function validateSession(token) {
  if (!token || typeof token !== 'string') return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return session;
}

/**
 * Invalidate Session (Logout)
 */
function revokeSession(token) {
  if (token) {
    activeSessions.delete(token);
  }
  return { success: true };
}

/**
 * Change Superuser Password
 */
function changeAdminPassword(token, currentPassword, newPassword) {
  const session = validateSession(token);
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }

  const config = getAdminConfig();
  if (!verifyPassword(currentPassword, config.passwordHash, config.salt)) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  const newHashed = hashPassword(newPassword);
  config.passwordHash = newHashed.hash;
  config.salt = newHashed.salt;
  config.passwordUpdatedAt = new Date().toISOString();

  fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2));
  return { success: true, message: 'Password updated successfully.' };
}

/**
 * Upload & Ingest New Resume PDF
 */
function uploadResume(fileBuffer, originalFilename, notes = '', setAsActive = true) {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    return { success: false, error: 'Invalid file payload.' };
  }

  if (fileBuffer.length > MAX_FILE_SIZE) {
    const sizeMb = (fileBuffer.length / (1024 * 1024)).toFixed(1);
    return { success: false, error: `File too large (${sizeMb} MB). Maximum size is 10 MB.` };
  }

  // Magic bytes inspection (%PDF-)
  const magic = fileBuffer.slice(0, 5).toString('ascii');
  if (!magic.startsWith('%PDF-')) {
    return { success: false, error: 'Invalid file format. Uploaded file is not a valid PDF document.' };
  }

  // Clean filename
  const cleanName = path.basename(originalFilename || 'Resume.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const versionId = 'v_' + timestamp;
  const storedFilename = `Resume_Mayank_Yadav_${timestamp}.pdf`;
  const versionPath = path.join(VERSIONS_DIR, storedFilename);

  // Calculate SHA-256
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  // Atomic write to versions directory
  fs.writeFileSync(versionPath, fileBuffer);

  const meta = getMetadata();
  const versionNumber = (meta.history && meta.history.length > 0) ? (meta.history[0].versionNumber || meta.history.length) + 1 : 1;

  const newVersion = {
    id: versionId,
    filename: cleanName,
    storedFilename: storedFilename,
    size: fileBuffer.length,
    mimeType: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    sha256: hash,
    versionNumber: versionNumber,
    notes: notes || `Uploaded on ${new Date().toLocaleDateString()}`
  };

  // If active, update current.pdf atomically
  if (setAsActive) {
    fs.writeFileSync(CURRENT_FILE, fileBuffer);
    meta.activeVersionId = versionId;
    meta.current = newVersion;
  }

  meta.history = meta.history || [];
  meta.history.unshift(newVersion);
  saveMetadata(meta);

  return {
    success: true,
    message: setAsActive ? 'New resume uploaded and set as active.' : 'Resume version uploaded as archive.',
    version: newVersion,
    activeVersionId: meta.activeVersionId
  };
}

/**
 * Set Existing Version as Active
 */
function setActiveVersion(versionId) {
  const meta = getMetadata();
  const target = (meta.history || []).find(v => v.id === versionId);

  if (!target) {
    return { success: false, error: 'Version not found in history.' };
  }

  const storedPath = path.join(VERSIONS_DIR, target.storedFilename);
  if (!fs.existsSync(storedPath)) {
    return { success: false, error: 'Physical PDF version file missing from disk.' };
  }

  // Copy to current.pdf
  fs.copyFileSync(storedPath, CURRENT_FILE);

  meta.activeVersionId = target.id;
  meta.current = target;
  saveMetadata(meta);

  return {
    success: true,
    message: `Version ${target.versionNumber || target.id} set as active.`,
    current: target
  };
}

/**
 * Delete Inactive Version
 */
function deleteVersion(versionId) {
  const meta = getMetadata();
  if (meta.activeVersionId === versionId) {
    return { success: false, error: 'Cannot delete the currently active resume version.' };
  }

  const idx = (meta.history || []).findIndex(v => v.id === versionId);
  if (idx === -1) {
    return { success: false, error: 'Version not found.' };
  }

  const target = meta.history[idx];
  const storedPath = path.join(VERSIONS_DIR, target.storedFilename);

  if (fs.existsSync(storedPath)) {
    try {
      fs.unlinkSync(storedPath);
    } catch (err) {
      console.warn('[ResumeService] File deletion warning:', err);
    }
  }

  meta.history.splice(idx, 1);
  saveMetadata(meta);

  return {
    success: true,
    message: 'Version deleted successfully.'
  };
}

/**
 * Get Full Admin Telemetry
 */
function getAdminTelemetry() {
  const meta = getMetadata();
  let totalBytes = 0;
  if (fs.existsSync(VERSIONS_DIR)) {
    const files = fs.readdirSync(VERSIONS_DIR);
    for (const f of files) {
      try {
        totalBytes += fs.statSync(path.join(VERSIONS_DIR, f)).size;
      } catch (e) {}
    }
  }

  return {
    activeVersion: meta.current,
    activeVersionId: meta.activeVersionId,
    history: meta.history || [],
    stats: {
      totalVersions: (meta.history || []).length,
      totalStorageBytes: totalBytes,
      storageDir: 'storage/resume/',
      isInitialized: true
    }
  };
}

// Export singleton interface
module.exports = {
  initStorage,
  getActiveResumeFile,
  getMetadata,
  authenticateAdmin,
  validateSession,
  revokeSession,
  changeAdminPassword,
  uploadResume,
  setActiveVersion,
  deleteVersion,
  getAdminTelemetry
};
