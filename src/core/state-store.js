import { globalSkins } from './constants.js';

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
  runtime: { debugEnabled: false }
});

export const stateStore = {
  state: null,
  init() { this.state = defaultState(); },
  reset() { this.state = defaultState(); }
};
