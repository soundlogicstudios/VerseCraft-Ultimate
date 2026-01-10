/**
 * constants.js
 * v2.7.8-UltimateLifecycleDiag
 * Full replacement constants registry
 */

export const VERSION = 'v2.7.8-UltimateLifecycleDiag';

export const limits = {
  equipSlots: 3,
  carryCap: 20,
  maxItemNameChars: 24,
  maxSlotLabelChars: 14,
  maxToastChars: 42,
  globalTrophySlots: 3,
  visualMilestones: [5, 10, 15, 20, 25]
};

export const globalSkins = [
  'ancient-parchment',
  'balanced-astral-gold',
  'astral-violet',
  'astral-arcane',
  'wastelands-dust',
  'sterile-clean'
];

export const titleRarities = ['common', 'rare', 'epic', 'legendary'];

export const debug = {
  enabled: true,
  verbose: true,
  showHUD: true,
  safeMode: false
};

console.log(`🔧 [CONST] Loaded constants module ${VERSION}`);
