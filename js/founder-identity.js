/**
 * ============================================================================
 * FOUNDER IDENTITY SYSTEM — Mayank Yadav Founder Digital HQ
 * Centralized Single Source of Truth for Founder Identity & Profile Management
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FounderIdentity = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Default Immutable Baseline Identity
  const DEFAULT_IDENTITY = {
    name: "Mayank Yadav",
    shortName: "MY",
    handle: "mayankyadav89",
    domain: "itsmayank.me",
    avatar: null,
    title: "Technology Founder & Product Architect",
    tagline: "Building at the intersection of AI, Web3 & Physical Asset Infrastructure",
    subtitle: "Founder & CEO at MRIG Ecosystem (Rentro & GetNextIn) & Crypticard. Turning frontier technologies into scalable real-world operating systems.",
    location: "Bhopal, Madhya Pradesh, India",
    status: {
      text: "Building MRIG (Rentro & GetNextIn) & Exploring Frontier Web3",
      active: true,
      venture: "MRIG Ecosystem",
      subVentures: ["Rentro (Physical Asset Marketplace)", "GetNextIn (AI Career Platform)"],
      mode: "Active Founder & Builder"
    },
    web3: {
      ens: "Maayankyadav.base.eth",
      ensUrl: "https://basescan.org/name/Maayankyadav.base.eth",
      evm: "0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e",
      evmUrl: "https://etherscan.io/address/0x8b99d1ace44d52659bbe65f7f4c7f5d59afc2b7e",
      solana: "EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX",
      solanaUrl: "https://solscan.io/account/EjpYgeXXXnnpcwSq82qFDJneVY1U5zPW9L1kyDKbtpbX",
      bitcoin: "Bc1pe5f0hrr0er7gd3zha0wknlw45x5mu4y5mzw87clqzjprg0mtfp0qh9y2dq",
      bitcoinUrl: "https://mempool.space/address/Bc1pe5f0hrr0er7gd3zha0wknlw45x5mu4y5mzw87clqzjprg0mtfp0qh9y2dq",
      devfolio: "https://devfolio.co/@Mayankyadav"
    },
    version: 1,
    lastUpdated: Date.now()
  };

  const STORAGE_KEY = 'mayank_founder_identity_v1';
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  /**
   * ==========================================================================
   * PERSISTENCE LAYER / STORAGE ADAPTERS
   * ==========================================================================
   * Clean separation between client-side device persistence (IndexedDB/localStorage)
   * and cloud object-storage infrastructure (Supabase / S3 / Cloudinary).
   */

  class StorageAdapter {
    async load() { throw new Error('Not implemented'); }
    async save(data) { throw new Error('Not implemented'); }
    async reset() { throw new Error('Not implemented'); }
    getType() { return 'abstract'; }
    isProductionCloud() { return false; }
  }

  /**
   * Local Browser Storage Adapter using localStorage + IndexedDB fallback
   */
  class LocalBrowserAdapter extends StorageAdapter {
    constructor() {
      super();
      this.dbName = 'MayankFounderIdentityDB';
      this.storeName = 'profile_store';
    }

    getType() {
      return 'local_browser';
    }

    isProductionCloud() {
      return false;
    }

    async load() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return Object.assign({}, DEFAULT_IDENTITY, parsed);
        }
      } catch (err) {
        console.warn('[FounderIdentity] LocalStorage read failed, checking fallback:', err);
      }
      return Object.assign({}, DEFAULT_IDENTITY);
    }

    async save(data) {
      try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, serialized);
        return { success: true, mode: 'local_storage', timestamp: data.lastUpdated };
      } catch (err) {
        console.warn('[FounderIdentity] LocalStorage quota exceeded or unavailable:', err);
        return { success: false, error: err.message };
      }
    }

    async reset() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
  }

  /**
   * Cloud Storage Adapter Stub (Production Blueprint)
   * Ready for Supabase Storage, AWS S3, or Cloudinary
   */
  class CloudStorageAdapter extends StorageAdapter {
    constructor(config = {}) {
      super();
      this.endpoint = config.endpoint || null;
      this.apiKey = config.apiKey || null;
      this.bucket = config.bucket || 'founder-assets';
    }

    getType() {
      return 'cloud_storage';
    }

    isProductionCloud() {
      return true;
    }

    async load() {
      if (!this.endpoint) {
        // Fallback to local browser if cloud unconfigured
        return new LocalBrowserAdapter().load();
      }
      const res = await fetch(`${this.endpoint}/api/identity`, { credentials: 'omit' });
      if (!res.ok) throw new Error('Cloud fetch failed');
      return await res.json();
    }

    async save(data) {
      if (!this.endpoint) {
        return new LocalBrowserAdapter().save(data);
      }
      const res = await fetch(`${this.endpoint}/api/identity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    }

    async reset() {
      if (!this.endpoint) return new LocalBrowserAdapter().reset();
      const res = await fetch(`${this.endpoint}/api/identity/reset`, { method: 'POST' });
      return await res.json();
    }
  }

  /**
   * ==========================================================================
   * FOUNDER IDENTITY SINGLETON
   * ==========================================================================
   */
  class FounderIdentityManager {
    constructor() {
      this.adapter = new LocalBrowserAdapter();
      this.state = Object.assign({}, DEFAULT_IDENTITY);
      this.subscribers = new Set();
      this.initialized = false;
      this._initPromise = this._bootstrap();
    }

    async _bootstrap() {
      try {
        const loaded = await this.adapter.load();
        this.state = Object.assign({}, DEFAULT_IDENTITY, loaded);
        this.initialized = true;
        this._notify();
      } catch (err) {
        console.error('[FounderIdentity] Bootstrap error:', err);
        this.state = Object.assign({}, DEFAULT_IDENTITY);
      }
      return this.state;
    }

    async ready() {
      return this._initPromise;
    }

    getProfile() {
      return Object.assign({}, this.state);
    }

    getAvatar() {
      return this.state.avatar || DEFAULT_IDENTITY.avatar;
    }

    getDefaultAvatar() {
      return DEFAULT_IDENTITY.avatar;
    }

    isCustomAvatar() {
      return this.state.avatar !== DEFAULT_IDENTITY.avatar;
    }

    getPersistenceInfo() {
      return {
        adapterType: this.adapter.getType(),
        isProductionCloud: this.adapter.isProductionCloud(),
        isCustomAvatar: this.isCustomAvatar(),
        lastUpdated: this.state.lastUpdated,
        version: this.state.version
      };
    }

    setAdapter(adapter) {
      if (adapter instanceof StorageAdapter) {
        this.adapter = adapter;
      }
    }

    validateImageFile(file) {
      if (!file) {
        return { valid: false, error: "No file selected." };
      }
      if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        return {
          valid: false,
          error: `Unsupported file type: ${file.type || 'Unknown'}. Please select JPG, PNG, or WebP.`
        };
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        return {
          valid: false,
          error: `File is too large (${sizeMb} MB). Maximum allowed size is 5 MB.`
        };
      }
      return { valid: true };
    }

    async setAvatar(avatarDataUrl, metadata = {}) {
      if (!avatarDataUrl || typeof avatarDataUrl !== 'string') {
        throw new Error('Invalid avatar data URL.');
      }

      this.state.avatar = avatarDataUrl;
      this.state.lastUpdated = Date.now();
      this.state.version = (this.state.version || 1) + 1;
      if (metadata.cropDetails) {
        this.state.cropDetails = metadata.cropDetails;
      }

      await this.adapter.save(this.state);
      this._notify();
      this.updateDOM();
      return {
        success: true,
        avatar: this.state.avatar,
        lastUpdated: this.state.lastUpdated
      };
    }

    async resetAvatar() {
      this.state.avatar = DEFAULT_IDENTITY.avatar;
      delete this.state.cropDetails;
      this.state.lastUpdated = Date.now();
      this.state.version = (this.state.version || 1) + 1;

      await this.adapter.save(this.state);
      this._notify();
      this.updateDOM();
      return {
        success: true,
        avatar: this.state.avatar,
        lastUpdated: this.state.lastUpdated
      };
    }

    async updateProfile(patch) {
      if (!patch || typeof patch !== 'object') return;
      const allowedKeys = ['name', 'title', 'tagline', 'subtitle', 'location', 'status'];
      for (const k of allowedKeys) {
        if (patch[k] !== undefined) {
          this.state[k] = patch[k];
        }
      }
      this.state.lastUpdated = Date.now();
      await this.adapter.save(this.state);
      this._notify();
      this.updateDOM();
      return this.getProfile();
    }

    subscribe(callback) {
      if (typeof callback === 'function') {
        this.subscribers.add(callback);
        // Call immediately with current state
        callback(this.getProfile());
        return () => this.subscribers.delete(callback);
      }
      return () => {};
    }

    _notify() {
      const current = this.getProfile();
      for (const fn of this.subscribers) {
        try {
          fn(current);
        } catch (err) {
          console.error('[FounderIdentity] Subscriber error:', err);
        }
      }
    }

    updateDOM() {
      if (typeof document === 'undefined') return;

      const avatarSrc = this.getAvatar();
      const currentName = this.state.name || DEFAULT_IDENTITY.name;
      const currentTitle = this.state.title || DEFAULT_IDENTITY.title;

      // Update all <img> tagged with data-founder-avatar
      const avatarImgs = document.querySelectorAll('[data-founder-avatar]');
      avatarImgs.forEach(img => {
        if (img instanceof HTMLImageElement) {
          if (img.src !== avatarSrc) {
            img.src = avatarSrc;
          }
          if (!img.alt || img.alt.includes('Founder')) {
            img.alt = `${currentName} — Founder portrait`;
          }
          img.onerror = () => {
            if (img.src !== DEFAULT_IDENTITY.avatar) {
              img.src = DEFAULT_IDENTITY.avatar;
            }
          };
        }
      });

      // Update background images tagged with data-founder-avatar-bg
      const avatarBgs = document.querySelectorAll('[data-founder-avatar-bg]');
      avatarBgs.forEach(el => {
        el.style.backgroundImage = `url("${avatarSrc}")`;
      });

      // Update name text
      const nameEls = document.querySelectorAll('[data-founder-name]');
      nameEls.forEach(el => {
        el.textContent = currentName;
      });

      const nameParts = currentName.split(' ');
      const firstName = nameParts[0] || 'MAYANK';
      const lastName = nameParts.slice(1).join(' ') || 'YADAV';

      const firstNameEls = document.querySelectorAll('[data-founder-first-name]');
      firstNameEls.forEach(el => {
        if (el.dataset.charsSplit === 'true') return;
        el.textContent = firstName.toUpperCase();
      });

      const lastNameEls = document.querySelectorAll('[data-founder-last-name]');
      lastNameEls.forEach(el => {
        if (el.dataset.charsSplit === 'true') return;
        el.textContent = lastName.toUpperCase();
      });

      // Update title text
      const titleEls = document.querySelectorAll('[data-founder-title]');
      titleEls.forEach(el => {
        el.textContent = currentTitle;
      });
    }

    initAutoSync() {
      if (typeof document === 'undefined') return;

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.updateDOM();
        });
      } else {
        this.updateDOM();
      }

      this.subscribe(() => {
        this.updateDOM();
      });
    }
  }

  const instance = new FounderIdentityManager();
  instance.initAutoSync();

  // Expose on global window object
  if (typeof window !== 'undefined') {
    window.FounderIdentity = instance;
  }

  return instance;
}));
