/**
 * ============================================================================
 * DATA LOADER & REGISTRY ENGINE — Mayank Yadav Founder Digital HQ
 * ============================================================================
 */
(function () {
  'use strict';

  window.HQ_DATA = window.HQ_DATA || {};

  const HQ = {
    getProfile() {
      return window.HQ_DATA.profile || null;
    },
    getProjects() {
      return window.HQ_DATA.projects || [];
    },
    getFeaturedProjects() {
      return (window.HQ_DATA.projects || []).filter(p => p.featured);
    },
    getProjectById(id) {
      return (window.HQ_DATA.projects || []).find(p => p.id === id) || null;
    },
    getExperience() {
      return window.HQ_DATA.experience || [];
    },
    getCommunity() {
      return window.HQ_DATA.community || [];
    },
    getSkills() {
      return window.HQ_DATA.skills || { categories: [] };
    },
    getSocial() {
      return window.HQ_DATA.social || [];
    },
    getBlocks() {
      return window.HQ_DATA.blocks || [];
    },
    getBlockByNumber(num) {
      return (window.HQ_DATA.blocks || []).find(b => b.blockNumber === num || b.blockId === num) || null;
    }
  };

  window.HQ = HQ;
})();
