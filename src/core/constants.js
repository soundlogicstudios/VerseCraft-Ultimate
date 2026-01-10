/**
 * constants.js
 * VerseCraft Ultimate v2.7.9 - Unified Constants
 */

export const APP_NAME = "VerseCraft Ultimate";
export const VERSION = "2.7.9-Ultimate";
export const DEBUG_MODE = true; // Toggle for forced debug HUD visibility
export const DEBUG_PATH = "/debug"; // Path trigger for debug boot

export const SCREEN_IDS = {
  SPLASH: "splash",
  TERMS: "terms-of-service",
  MENU: "main-menu",
  SETTINGS: "settings",
  LIBRARY: "library",
  STORY: "story"
};

console.info(`[${APP_NAME}] Constants loaded – version ${VERSION}`);
