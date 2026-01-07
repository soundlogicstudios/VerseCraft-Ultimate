const mounted = new Map();

async function loadScreen(screenId) {
  return import(`../screens/${screenId}/${screenId}.js`);
}

export const screenManager = {
  mountEl: null,
  current: null,

  async init({ mountId, initialScreen }) {
    this.mountEl = document.getElementById(mountId);
    if (!this.mountEl) throw new Error(`mount element not found: ${mountId}`);
    await this.go(initialScreen);
  },

  async go(screenId, params = {}) {
    // unmount previous
    if (this.current && mounted.has(this.current)) {
      try { mounted.get(this.current).unmount?.(); } catch {}
    }

    // hard clear (no hidden screens)
    this.mountEl.innerHTML = '';

    // mount new
    const mod = await loadScreen(screenId);
    const api = await mod.createScreen({ mountEl: this.mountEl, screenManager: this, params });
    mounted.set(screenId, api);
    this.current = screenId;
    api.mount?.();
  }
};
