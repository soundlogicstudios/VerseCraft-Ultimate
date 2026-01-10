/**
 * screen-manager.js
 * v2.7.8-UltimateLifecycleDiag
 * Tracks mounted screens with lifecycle diagnostics
 */

const mounted = new Map();

async function loadScreen(screenId) {
  return import(`../screens/${screenId}/${screenId}.js`);
}

export const screenManager = {
  mountEl: null,
  current: null,

  async init({ mountId, initialScreen }) {
    this.mountEl = document.getElementById(mountId);
    if (!this.mountEl) throw new Error(`Mount element not found: ${mountId}`);
    await this.go(initialScreen);
  },

  async go(screenId, params = {}) {
    console.log(`➡️ [MANAGER] go(${screenId})`);

    if (this.current && mounted.has(this.current)) {
      try {
        mounted.get(this.current).unmount?.();
        console.log(`🔹 [MANAGER] Unmounted: ${this.current}`);
      } catch (err) {
        console.warn(`⚠️ [MANAGER] Error unmounting ${this.current}`, err);
      }
    }

    this.mountEl.innerHTML = "";

    try {
      const mod = await loadScreen(screenId);
      const api =
        typeof mod.createScreen === "function"
          ? await mod.createScreen({ mountEl: this.mountEl, screenManager: this, params })
          : typeof mod.default === "function"
          ? await mod.default({ mountEl: this.mountEl, screenManager: this, params })
          : null;

      if (api) {
        mounted.set(screenId, api);
        this.current = screenId;
        api.mount?.();
        console.log(`✅ [MANAGER] Mounted screen: ${screenId}`);
      } else {
        console.warn(`⚠️ [MANAGER] Screen ${screenId} missing createScreen/default export`);
      }
    } catch (err) {
      console.error(`❌ [MANAGER] Failed to load ${screenId}`, err);
    }
  }
};
