/**
 * ============================================================================
 * PROFILE STUDIO CONTROLLER — Mayank Yadav Founder Digital HQ
 * Interactive Canvas Image Editor & Portrait Identity Management Surface
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ProfileStudio = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class ProfileStudioController {
    constructor() {
      this.isOpen = false;
      this.currentImage = null; // HTMLImageElement
      this.currentFile = null;
      this.cropState = {
        zoom: 1.0,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        initialOffsetX: 0,
        initialOffsetY: 0
      };

      this.dom = {};
      this._boundEvents = false;
      this.init();
    }

    init() {
      if (typeof document === 'undefined') return;

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this._buildDOM());
      } else {
        this._buildDOM();
      }
    }

    _buildDOM() {
      if (document.getElementById('profile-studio-overlay')) return;

      const overlay = document.createElement('div');
      overlay.id = 'profile-studio-overlay';
      overlay.className = 'studio-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Founder Identity Studio');

      overlay.innerHTML = `
        <div class="studio-modal">
          <!-- Header -->
          <div class="studio-header">
            <div class="studio-title-group">
              <div class="studio-badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <h2 class="studio-title">Founder Identity Studio</h2>
                <div class="studio-subtitle">Manage Founder Portrait & Spatial Identity</div>
              </div>
            </div>
            <button class="studio-close-btn" id="studio-btn-close" aria-label="Close Studio">&times;</button>
          </div>

          <!-- Body -->
          <div class="studio-body">
            <!-- Left Workspace -->
            <div class="studio-workspace">
              <div class="studio-canvas-container" id="studio-canvas-container">
                <canvas class="studio-editor-canvas" id="studio-editor-canvas"></canvas>
                <div class="studio-crop-mask" id="studio-crop-mask"></div>
                <div class="studio-dropzone-empty" id="studio-dropzone-empty">
                  <div class="studio-dropzone-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <div class="studio-dropzone-text">Click "Change Photo" or Drag & Drop Image</div>
                  <div class="studio-dropzone-hint">Supports JPG, PNG, WebP up to 5MB</div>
                </div>
              </div>

              <!-- Controls -->
              <div class="studio-controls">
                <div class="studio-control-row">
                  <span class="studio-control-label">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                    Zoom & Scale
                  </span>
                  <div class="studio-slider-wrapper">
                    <input type="range" class="studio-zoom-slider" id="studio-zoom-slider" min="0.5" max="3.0" step="0.05" value="1.0">
                    <span class="studio-zoom-value" id="studio-zoom-val">1.0x</span>
                  </div>
                </div>
                <div class="studio-control-row" style="margin-top: 4px;">
                  <button type="button" class="studio-btn studio-btn-secondary" id="studio-btn-recenter" style="padding: 0.4rem 0.8rem; font-size: 0.76rem;">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
                    Center Portrait
                  </button>
                  <span style="font-size: 0.72rem; color: #71717a;">Drag canvas to reposition</span>
                </div>
              </div>
            </div>

            <!-- Right Sidebar -->
            <div class="studio-sidebar">
              <div class="studio-preview-card">
                <div class="studio-preview-label">Live Spatial Preview</div>
                <div class="studio-preview-frame">
                  <img src="assets/founder-mayank.png" alt="Crop preview" class="studio-preview-img" id="studio-preview-img">
                </div>
                <div class="studio-file-info" id="studio-file-info">
                  <div class="studio-info-row"><span>Source:</span> <span class="studio-info-val" id="info-source">Default Asset</span></div>
                  <div class="studio-info-row"><span>Format:</span> <span class="studio-info-val" id="info-format">PNG / 3:4</span></div>
                  <div class="studio-info-row"><span>Target Aspect:</span> <span class="studio-info-val">3:4 Portrait</span></div>
                </div>
              </div>

              <!-- Upload Actions -->
              <div class="studio-upload-actions">
                <input type="file" id="studio-file-input" class="studio-file-input" accept="image/jpeg,image/png,image/webp">
                <button type="button" class="studio-btn studio-btn-secondary" id="studio-btn-choose">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Choose New Photo
                </button>
              </div>

              <!-- Persistence Info -->
              <div class="studio-storage-notice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div>
                  <strong>Local Client Persistence</strong>
                  <div style="font-size: 0.68rem; margin-top: 2px;">Identity updates are cached in browser storage. Modular interface is ready for S3 / Cloudinary cloud sync.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="studio-footer">
            <div class="studio-footer-left">
              <button type="button" class="studio-btn studio-btn-ghost" id="studio-btn-reset">
                Reset to Original Photo
              </button>
            </div>
            <div class="studio-footer-right">
              <button type="button" class="studio-btn studio-btn-secondary" id="studio-btn-cancel">
                Cancel
              </button>
              <button type="button" class="studio-btn studio-btn-primary" id="studio-btn-save">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Apply & Save Photo
              </button>
            </div>
          </div>
        </div>
      `;

      // Toast element
      const toast = document.createElement('div');
      toast.id = 'studio-toast';
      toast.className = 'studio-toast';
      toast.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span id="studio-toast-msg">Founder photo updated successfully!</span>
      `;

      document.body.appendChild(overlay);
      document.body.appendChild(toast);

      this._cacheDOM();
      this._bindEvents();
    }

    _cacheDOM() {
      this.dom = {
        overlay: document.getElementById('profile-studio-overlay'),
        btnClose: document.getElementById('studio-btn-close'),
        btnCancel: document.getElementById('studio-btn-cancel'),
        btnSave: document.getElementById('studio-btn-save'),
        btnChoose: document.getElementById('studio-btn-choose'),
        btnReset: document.getElementById('studio-btn-reset'),
        btnRecenter: document.getElementById('studio-btn-recenter'),
        fileInput: document.getElementById('studio-file-input'),
        container: document.getElementById('studio-canvas-container'),
        canvas: document.getElementById('studio-editor-canvas'),
        cropMask: document.getElementById('studio-crop-mask'),
        dropzoneEmpty: document.getElementById('studio-dropzone-empty'),
        zoomSlider: document.getElementById('studio-zoom-slider'),
        zoomVal: document.getElementById('studio-zoom-val'),
        previewImg: document.getElementById('studio-preview-img'),
        infoSource: document.getElementById('info-source'),
        infoFormat: document.getElementById('info-format'),
        toast: document.getElementById('studio-toast'),
        toastMsg: document.getElementById('studio-toast-msg')
      };
    }

    _bindEvents() {
      if (this._boundEvents) return;
      this._boundEvents = true;

      // Close actions
      this.dom.btnClose.addEventListener('click', () => this.close());
      this.dom.btnCancel.addEventListener('click', () => this.close());
      this.dom.overlay.addEventListener('click', (e) => {
        if (e.target === this.dom.overlay) this.close();
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
        // Shift + P opens studio
        if (e.shiftKey && (e.key === 'P' || e.key === 'p') && !this.isOpen) {
          const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
          if (activeTag !== 'input' && activeTag !== 'textarea') {
            e.preventDefault();
            this.open();
          }
        }
      });

      // File selection
      this.dom.btnChoose.addEventListener('click', () => this.dom.fileInput.click());
      this.dom.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.loadFile(e.target.files[0]);
        }
      });

      // Drag and drop onto container
      ['dragenter', 'dragover'].forEach(name => {
        this.dom.container.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.dom.container.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach(name => {
        this.dom.container.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.dom.container.classList.remove('drag-over');
        });
      });

      this.dom.container.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.loadFile(e.dataTransfer.files[0]);
        }
      });

      // Zoom slider
      this.dom.zoomSlider.addEventListener('input', (e) => {
        this.cropState.zoom = parseFloat(e.target.value);
        this.dom.zoomVal.textContent = `${this.cropState.zoom.toFixed(1)}x`;
        this.renderCanvas();
      });

      // Mouse wheel zoom over container
      this.dom.container.addEventListener('wheel', (e) => {
        if (!this.currentImage) return;
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        this.cropState.zoom = Math.min(3.0, Math.max(0.5, this.cropState.zoom + delta));
        this.dom.zoomSlider.value = this.cropState.zoom;
        this.dom.zoomVal.textContent = `${this.cropState.zoom.toFixed(1)}x`;
        this.renderCanvas();
      }, { passive: false });

      // Pan dragging on container
      this.dom.container.addEventListener('mousedown', (e) => {
        if (!this.currentImage) return;
        this.cropState.isDragging = true;
        this.cropState.dragStartX = e.clientX;
        this.cropState.dragStartY = e.clientY;
        this.cropState.initialOffsetX = this.cropState.offsetX;
        this.cropState.initialOffsetY = this.cropState.offsetY;
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.cropState.isDragging || !this.currentImage) return;
        const dx = e.clientX - this.cropState.dragStartX;
        const dy = e.clientY - this.cropState.dragStartY;
        this.cropState.offsetX = this.cropState.initialOffsetX + dx;
        this.cropState.offsetY = this.cropState.initialOffsetY + dy;
        this.renderCanvas();
      });

      window.addEventListener('mouseup', () => {
        this.cropState.isDragging = false;
      });

      // Recenter button
      this.dom.btnRecenter.addEventListener('click', () => {
        this.cropState.zoom = 1.0;
        this.cropState.offsetX = 0;
        this.cropState.offsetY = 0;
        this.dom.zoomSlider.value = 1.0;
        this.dom.zoomVal.textContent = '1.0x';
        this.renderCanvas();
      });

      // Reset button
      this.dom.btnReset.addEventListener('click', async () => {
        if (window.FounderIdentity) {
          await window.FounderIdentity.resetAvatar();
          this.loadDefaultImage();
          this.showToast('Reset identity avatar.');
        }
      });

      // Save button
      this.dom.btnSave.addEventListener('click', async () => {
        await this.saveCroppedAvatar();
      });

      // Delegate click for any button with [data-open-profile-studio]
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-profile-studio]');
        if (trigger) {
          e.preventDefault();
          this.open();
        }
      });
    }

    open() {
      if (!this.dom.overlay) this._buildDOM();
      this.isOpen = true;
      this.dom.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Load active avatar from FounderIdentity
      const activeAvatar = window.FounderIdentity ? window.FounderIdentity.getAvatar() : 'assets/founder-mayank.png';
      this.loadImageFromUrl(activeAvatar, 'Active Profile Photo');
    }

    close() {
      if (!this.dom.overlay) return;
      this.isOpen = false;
      this.dom.overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    showToast(message) {
      if (!this.dom.toast) return;
      this.dom.toastMsg.textContent = message;
      this.dom.toast.classList.add('visible');
      setTimeout(() => {
        this.dom.toast.classList.remove('visible');
      }, 3500);
    }

    loadFile(file) {
      if (window.FounderIdentity) {
        const check = window.FounderIdentity.validateImageFile(file);
        if (!check.valid) {
          alert(check.error);
          return;
        }
      }

      this.currentFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.loadImageFromUrl(e.target.result, file.name || 'Uploaded Photo');
      };
      reader.readAsDataURL(file);
    }

    loadImageFromUrl(url, label = 'Current Photo') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.currentImage = img;
        this.cropState.zoom = 1.0;
        this.cropState.offsetX = 0;
        this.cropState.offsetY = 0;
        this.dom.zoomSlider.value = 1.0;
        this.dom.zoomVal.textContent = '1.0x';
        this.dom.dropzoneEmpty.style.display = 'none';
        this.dom.infoSource.textContent = label;
        this.dom.infoFormat.textContent = `${img.naturalWidth} × ${img.naturalHeight}px`;

        this.renderCanvas();
      };
      img.onerror = () => {
        console.warn('[ProfileStudio] Image load failed:', url);
        this.loadDefaultImage();
      };
      img.src = url;
    }

    loadDefaultImage() {
      const def = window.FounderIdentity ? window.FounderIdentity.getDefaultAvatar() : null;
      if (def) {
        this.loadImageFromUrl(def, 'Default Asset');
      }
    }

    renderCanvas() {
      if (!this.currentImage || !this.dom.canvas || !this.dom.container) return;

      const canvas = this.dom.canvas;
      const ctx = canvas.getContext('2d');
      const containerRect = this.dom.container.getBoundingClientRect();

      const width = containerRect.width || 440;
      const height = containerRect.height || 330;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      // Draw background pattern
      ctx.fillStyle = '#07070c';
      ctx.fillRect(0, 0, width, height);

      // Calculate base scale to fit inside container
      const img = this.currentImage;
      const hRatio = (height * 0.85) / img.naturalHeight;
      const wRatio = (width * 0.85) / img.naturalWidth;
      const baseScale = Math.min(hRatio, wRatio);

      const effectiveScale = baseScale * this.cropState.zoom;
      const drawWidth = img.naturalWidth * effectiveScale;
      const drawHeight = img.naturalHeight * effectiveScale;

      const centerX = (width - drawWidth) / 2 + this.cropState.offsetX;
      const centerY = (height - drawHeight) / 2 + this.cropState.offsetY;

      ctx.drawImage(img, centerX, centerY, drawWidth, drawHeight);

      // Generate Live Preview for sidebar (3:4 ratio)
      this.updatePreviewCrop(width, height, centerX, centerY, drawWidth, drawHeight);
    }

    updatePreviewCrop(cw, ch, imgX, imgY, imgW, imgH) {
      if (!this.dom.previewImg || !this.dom.cropMask) return;

      const maskRect = this.dom.cropMask.getBoundingClientRect();
      const containerRect = this.dom.container.getBoundingClientRect();

      // Mask position relative to container
      const mx = maskRect.left - containerRect.left;
      const my = maskRect.top - containerRect.top;
      const mw = maskRect.width;
      const mh = maskRect.height;

      // Create an offscreen canvas for export
      const offscreen = document.createElement('canvas');
      offscreen.width = 440;
      offscreen.height = 587; // 3:4 portrait
      const oCtx = offscreen.getContext('2d');

      oCtx.fillStyle = '#050508';
      oCtx.fillRect(0, 0, offscreen.width, offscreen.height);

      // Map container coordinates to offscreen canvas
      const scaleX = offscreen.width / mw;
      const scaleY = offscreen.height / mh;

      const srcOffX = (imgX - mx) * scaleX;
      const srcOffY = (imgY - my) * scaleY;
      const srcW = imgW * scaleX;
      const srcH = imgH * scaleY;

      oCtx.drawImage(this.currentImage, srcOffX, srcOffY, srcW, srcH);

      const previewDataUrl = offscreen.toDataURL('image/jpeg', 0.92);
      this.dom.previewImg.src = previewDataUrl;
      this._lastExportDataUrl = previewDataUrl;
    }

    async saveCroppedAvatar() {
      if (!this._lastExportDataUrl) {
        alert('Please choose or adjust an image first.');
        return;
      }

      if (window.FounderIdentity) {
        await window.FounderIdentity.setAvatar(this._lastExportDataUrl, {
          cropDetails: {
            zoom: this.cropState.zoom,
            offsetX: this.cropState.offsetX,
            offsetY: this.cropState.offsetY,
            timestamp: Date.now()
          }
        });

        this.showToast('Founder profile photo updated & applied across universe!');
        setTimeout(() => this.close(), 600);
      }
    }
  }

  const instance = new ProfileStudioController();

  if (typeof window !== 'undefined') {
    window.ProfileStudio = instance;
  }

  return instance;
}));
