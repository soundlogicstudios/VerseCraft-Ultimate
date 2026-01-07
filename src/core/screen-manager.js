const mounted = new Map();

async function loadScreen(screenId) {
  // screen-manager.js is at /src/core/ so ../screens/... resolves to /src/screens/...
  try {
    return await import(`../screens/${screenId}/${screenId}.js`);
  } catch (err) {
    throw new Error(
      `Failed to load screen "${screenId}". Expected: src/screens/${screenId}/${screenId}.js\n` +
      (err?.message || String(err))
    );
  }
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
    if (!this.mountEl) throw new Error('screenManager not initialized (mountEl is null)');

    // unmount previous
    if (this.current && mounted.has(this.current)) {
      try { mounted.get(this.current).unmount?.(); } catch {}
      // always remove old API so re-entering is fresh
      mounted.delete(this.current);
    }

    // hard clear (no hidden screens)
    this.mountEl.innerHTML = '';

    // mount new
    const mod = await loadScreen(screenId);
    if (!mod?.createScreen) {
      throw new Error(`Screen module "${screenId}" did not export createScreen(...)`);
    }

    const api = await mod.createScreen({ mountEl: this.mountEl, screenManager: this, params });
    mounted.set(screenId, api);
    this.current = screenId;

    api?.mount?.();
  }
};
