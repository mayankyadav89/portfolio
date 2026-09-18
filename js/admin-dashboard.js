/**
 * ============================================================================
 * ADMIN RESUME CONTROLLER — Mayank Yadav Founder Digital HQ
 * Superuser Authorization & Dynamic Resume Lifecycle Management
 * ============================================================================
 */

(function () {
  'use strict';

  // DOM Elements
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const loginForm = document.getElementById('admin-login-form');
  const loginIdentifier = document.getElementById('login-identifier');
  const loginPassword = document.getElementById('login-password');
  const loginSubmitBtn = document.getElementById('login-submit-btn');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const alertBanner = document.getElementById('admin-alert');

  const activeFilename = document.getElementById('active-filename');
  const activeSize = document.getElementById('active-size');
  const activeUpdated = document.getElementById('active-updated');
  const activeVersion = document.getElementById('active-version');
  const activeChecksum = document.getElementById('active-checksum');

  const uploadForm = document.getElementById('resume-upload-form');
  const dropzone = document.getElementById('pdf-dropzone');
  const fileInput = document.getElementById('pdf-file-input');
  const filePreview = document.getElementById('file-preview');
  const previewFilename = document.getElementById('preview-filename');
  const previewFilesize = document.getElementById('preview-filesize');
  const uploadNotes = document.getElementById('upload-notes');
  const setActiveCheckbox = document.getElementById('set-active-checkbox');
  const uploadSubmitBtn = document.getElementById('upload-submit-btn');
  const historyTableBody = document.getElementById('history-table-body');
  const versionCountBadge = document.getElementById('version-count-badge');

  let selectedFile = null;
  let authToken = null;

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    bindEvents();
  });

  function showAlert(msg, type = 'error') {
    if (!alertBanner) return;
    alertBanner.textContent = msg;
    alertBanner.className = `alert-banner ${type}`;
    alertBanner.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function hideAlert() {
    if (!alertBanner) return;
    alertBanner.style.display = 'none';
  }

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function formatDate(isoStr) {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoStr;
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Session Check
  async function checkSession() {
    try {
      const res = await fetch('/api/admin/session', {
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
      });
      const data = await res.json();
      if (data.authenticated) {
        showDashboard();
        loadTelemetry();
      } else {
        showLogin();
      }
    } catch (err) {
      console.error('[Admin] Session check error:', err);
      showLogin();
    }
  }

  function showLogin() {
    if (loginSection) loginSection.style.display = 'block';
    if (dashboardSection) dashboardSection.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    hideAlert();
  }

  function showDashboard() {
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    hideAlert();
  }

  // Bind UI Events
  function bindEvents() {
    // Login Form Submit
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.innerHTML = '<span>Authenticating...</span>';

        try {
          const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identifier: loginIdentifier.value.trim(),
              password: loginPassword.value
            })
          });

          const data = await res.json();
          if (data.success) {
            authToken = data.token;
            loginForm.reset();
            showDashboard();
            loadTelemetry();
            showAlert('Authenticated successfully as superuser.', 'success');
          } else {
            showAlert(data.error || 'Authentication failed. Invalid credentials.');
          }
        } catch (err) {
          showAlert('Network or server connection error: ' + err.message);
        } finally {
          loginSubmitBtn.disabled = false;
          loginSubmitBtn.innerHTML = '<span>Authenticate &rarr;</span>';
        }
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await fetch('/api/admin/logout', {
            method: 'POST',
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
          });
        } catch (e) {}
        authToken = null;
        showLogin();
        showAlert('Logged out successfully.', 'success');
      });
    }

    // Dropzone Click
    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      // Drag & Drop
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('dragover');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length > 0) {
          handleFileSelect(dt.files[0]);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
          handleFileSelect(fileInput.files[0]);
        }
      });
    }

    // Upload Form Submit
    if (uploadForm) {
      uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedFile) {
          showAlert('Please select a PDF file first.');
          return;
        }

        hideAlert();
        uploadSubmitBtn.disabled = true;
        uploadSubmitBtn.innerHTML = '<span>Encoding &amp; Uploading PDF...</span>';

        try {
          const reader = new FileReader();
          reader.onload = async () => {
            const base64Data = reader.result;
            const res = await fetch('/api/admin/resume/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
              },
              body: JSON.stringify({
                filename: selectedFile.name,
                fileData: base64Data,
                notes: uploadNotes.value.trim(),
                setAsActive: setActiveCheckbox.checked
              })
            });

            const data = await res.json();
            if (data.success) {
              showAlert(data.message || 'Resume uploaded and set as active.', 'success');
              resetUploadForm();
              loadTelemetry();
            } else {
              showAlert(data.error || 'Upload failed.');
            }
            uploadSubmitBtn.disabled = false;
            uploadSubmitBtn.innerHTML = '<span>Upload &amp; Set Active &rarr;</span>';
          };
          reader.onerror = () => {
            showAlert('Failed to read file.');
            uploadSubmitBtn.disabled = false;
            uploadSubmitBtn.innerHTML = '<span>Upload &amp; Set Active &rarr;</span>';
          };
          reader.readAsDataURL(selectedFile);
        } catch (err) {
          showAlert('Upload failed: ' + err.message);
          uploadSubmitBtn.disabled = false;
          uploadSubmitBtn.innerHTML = '<span>Upload &amp; Set Active &rarr;</span>';
        }
      });
    }
  }

  function handleFileSelect(file) {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showAlert('Invalid file type. Please select a valid PDF file (.pdf).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showAlert(`File is too large (${formatBytes(file.size)}). Max allowed is 10 MB.`);
      return;
    }

    selectedFile = file;
    hideAlert();

    if (filePreview && previewFilename && previewFilesize) {
      previewFilename.textContent = file.name;
      previewFilesize.textContent = formatBytes(file.size);
      filePreview.style.display = 'block';
    }

    if (uploadSubmitBtn) {
      uploadSubmitBtn.disabled = false;
    }
  }

  function resetUploadForm() {
    selectedFile = null;
    if (fileInput) fileInput.value = '';
    if (uploadNotes) uploadNotes.value = '';
    if (filePreview) filePreview.style.display = 'none';
    if (uploadSubmitBtn) uploadSubmitBtn.disabled = true;
  }

  // Load Telemetry & History
  async function loadTelemetry() {
    try {
      const res = await fetch('/api/admin/resume', {
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
      });
      const resData = await res.json();

      if (!resData.success) {
        if (res.status === 401) {
          showLogin();
          return;
        }
        showAlert(resData.error || 'Failed to load telemetry.');
        return;
      }

      const { activeVersion: active, history, activeVersionId } = resData.data;

      // Update Active Card
      if (active) {
        activeFilename.textContent = active.filename || '—';
        activeSize.textContent = formatBytes(active.size);
        activeUpdated.textContent = formatDate(active.uploadedAt);
        activeVersion.textContent = `v${active.versionNumber || 1}`;
        activeChecksum.textContent = active.sha256 || '—';
      } else {
        activeFilename.textContent = 'No active resume';
      }

      if (versionCountBadge) {
        versionCountBadge.textContent = `${history.length} version${history.length === 1 ? '' : 's'}`;
      }

      // Render History Table
      renderHistoryTable(history, activeVersionId);
    } catch (err) {
      console.error('[Admin] Telemetry error:', err);
      showAlert('Failed to refresh data: ' + err.message);
    }
  }

  function renderHistoryTable(history, activeVersionId) {
    if (!historyTableBody) return;

    if (!history || history.length === 0) {
      historyTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No resume versions found.
          </td>
        </tr>
      `;
      return;
    }

    let rowsHtml = '';
    history.forEach((ver) => {
      const isActive = ver.id === activeVersionId;
      const statusBadge = isActive
        ? `<span class="active-badge"><span class="active-pulse-dot"></span> ACTIVE</span>`
        : `<span style="color: var(--text-muted); font-size: 0.75rem; font-family: var(--font-mono);">ARCHIVED</span>`;

      const checksumShort = ver.sha256 ? `${ver.sha256.slice(0, 10)}...${ver.sha256.slice(-6)}` : '—';

      rowsHtml += `
        <tr>
          <td><strong style="color: var(--accent-violet);">v${escapeHtml(ver.versionNumber || 1)}</strong></td>
          <td>
            <div style="font-weight: 600; color: #ffffff;">${escapeHtml(ver.filename)}</div>
            ${ver.notes ? `<div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(ver.notes)}</div>` : ''}
          </td>
          <td style="font-family: var(--font-mono); font-size: 0.8rem;">${formatBytes(ver.size)}</td>
          <td style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${formatDate(ver.uploadedAt)}</td>
          <td>
            <code style="font-size: 0.72rem; color: var(--accent-cyan); background: rgba(56, 189, 248, 0.08); padding: 0.15rem 0.35rem; border-radius: 4px;" title="${escapeHtml(ver.sha256)}">
              ${checksumShort}
            </code>
          </td>
          <td>${statusBadge}</td>
          <td>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              ${!isActive ? `
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.adminSetVersionActive('${escapeHtml(ver.id)}')" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;">
                  <span>Set Active</span>
                </button>
              ` : ''}
              <button type="button" class="btn btn-outline btn-sm" onclick="window.adminDownloadVersion('${escapeHtml(ver.id)}')" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" title="Download PDF">
                <span>&darr;</span>
              </button>
              ${!isActive ? `
                <button type="button" class="btn btn-outline btn-sm" onclick="window.adminDeleteVersion('${escapeHtml(ver.id)}')" style="font-size: 0.72rem; padding: 0.25rem 0.5rem; color: #fca5a5; border-color: rgba(244,63,94,0.3);" title="Delete Version">
                  <span>&times;</span>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    });

    historyTableBody.innerHTML = rowsHtml;
  }

  // Global Actions for table buttons
  window.adminSetVersionActive = async function (versionId) {
    if (!confirm('Are you sure you want to set this version as the live public resume?')) return;
    try {
      const res = await fetch('/api/admin/resume/set-active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({ versionId })
      });
      const data = await res.json();
      if (data.success) {
        showAlert(data.message || 'Active version updated.', 'success');
        loadTelemetry();
      } else {
        showAlert(data.error || 'Failed to switch active version.');
      }
    } catch (err) {
      showAlert('Request failed: ' + err.message);
    }
  };

  window.adminDeleteVersion = async function (versionId) {
    if (!confirm('Are you sure you want to permanently delete this archived version?')) return;
    try {
      const res = await fetch('/api/admin/resume/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({ versionId })
      });
      const data = await res.json();
      if (data.success) {
        showAlert('Version deleted.', 'success');
        loadTelemetry();
      } else {
        showAlert(data.error || 'Failed to delete version.');
      }
    } catch (err) {
      showAlert('Request failed: ' + err.message);
    }
  };

  window.adminDownloadVersion = function (versionId) {
    // Open direct download
    window.open(`/api/resume/download?v=${encodeURIComponent(versionId)}`, '_blank');
  };

})();
