import { globalSkins } from './constants.js';

const STORAGE_KEY = 'versecraft_state_v1';

const defaultState = () => ({
  global: {
    playerName: 'player',
    activeTitle: null,
    ownedTitles: [],
    level: 1,
    skin: globalSkins[0],
    trophiesOwned: [],
    trophiesEquipped: [null, null, null],
    currency: { coins: 0 }
  },
  runtime: {
    debugEnabled: false,
    tosAccepted: false
  }
});

function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}

export const stateStore = {
  state: null,

  init() {
    const base = defaultState();
    const saved = safeParse(localStorage.getItem(STORAGE_KEY) || 'null');

    // We only persist a small, safe subset until the full save system exists.
    if (saved && typeof saved === 'object') {
      if (saved.runtime && typeof saved.runtime === 'object') {
        if (typeof saved.runtime.tosAccepted === 'boolean') base.runtime.tosAccepted = saved.runtime.tosAccepted;
      }
    }

    this.state = base;
  },

  reset() {
    this.state = defaultState();
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  },

  get(key) {
    if (!this.state) return undefined;
    if (key === 'tosAccepted') return !!this.state.runtime?.tosAccepted;
    return this.state[key];
  },

  set(key, value) {
    if (!this.state) this.init();
    if (key === 'tosAccepted') {
      this.state.runtime.tosAccepted = !!value;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ runtime: { tosAccepted: this.state.runtime.tosAccepted } }));
      } catch {}
      return;
    }
    // Future: support other keys
    this.state[key] = value;
  }
};
