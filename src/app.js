/**
 * ======================================================
 *  VerseCraft Ultimate - Main Application Controller
 *  Version: 2.7.7.2 (TOS Auto-Injector Patch)
 *  Description:
 *   - Initializes screens and hitboxes
 *   - Manages navigation flow
 *   - Integrates Debug Manager + Legacy Wrapper
 *   - Injects Terms of Service content reliably
 * ======================================================
 */

import { DebugManager } from "./debug/debug-manager.js";
import "./debug/legacy-wrapper.js";
import "./debug/debug-hitbox.js";

/* =====================================================
   GLOBAL CONSTANTS
   ===================================================== */
const APP_VERSION = "v2.7.7.2-UltimateAlign";
const TERMS_OF_SERVICE_TEXT = `
  <p><strong>Welcome to VerseCraft!</strong></p>
  <p>By continuing, you agree to the following terms:</p>
  <ol>
    <li>Your creative works remain your intellectual property.</li>
    <li>VerseCraft may store anonymized usage data to improve performance.</li>
    <li>You will refrain from submitting offensive or harmful content.</li>
    <li>All use of this platform is at your own risk.</li>
  </ol>
  <p>Tap <strong>Accept</strong> below to continue your adventure.</p>
`;

/* =====================================================
   SCREEN REGISTRY
   ===================================================== */
const SCREENS = [
  "splash",
  "tos",
  "menu",
  "settings",
  "library",
  "story",
];

/* =====================================================
   NAVIGATION UTILITIES
   ===================================================== */
let activeScreen = null;
export function go(screenId) {
  SCREENS.forEach((id) => {
    const el = document.getElementById(`screen-${id}`);
    if (el) el.classList.add("hidden");
  });

  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.remove("hidden");
    activeScreen = screenId;
    console.log(`[NAV] → ${screenId}`);
  } else {
    console.warn(`[NAV] Screen not found: ${screenId}`);
  }
}

export function currentScreen() {
  return activeScreen;
}

/* =====================================================
   HITBOX BINDINGS
   ===================================================== */
function bindHitboxes(map) {
  Object.entries(map).forEach(([id, handler]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", handler);
  });
}

/* =====================================================
   APPLICATION BOOT
   ===================================================== */
function boot() {
  console.log(
    `%cVerseCraft ${APP_VERSION} initializing...`,
    "color:cyan;font-weight:bold;"
  );

  DebugManager.init?.();

  bindHitboxes({
    hbSplashTap: () => {
      const tosText = document.getElementById("tosText");
      if (tosText && tosText.innerHTML.trim() === "") {
        tosText.innerHTML = TERMS_OF_SERVICE_TEXT;
      }
      go("tos");
    },

    hbTosAccept: () => go("menu"),
    hbMenuSettings: () => go("settings"),
    hbMenuLoad: () => go("library"),
    hbSettingsBack: () => go("menu"),
    hbLibraryBack: () => go("menu"),
    hbRow0: () => go("story"),
    hbStoryBack: () => go("library"),
  });

  // Set initial screen
  go("splash");

  console.log(`[BOOT] VerseCraft ${APP_VERSION} ready.`);
}

/* =====================================================
   TOS AUTO-INJECTOR PATCH
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  try {
    const tosContainer =
      document.getElementById("tosText") ||
      document.getElementById("tos-scroll-container");

    if (tosContainer && tosContainer.innerHTML.trim() === "") {
      tosContainer.innerHTML = TERMS_OF_SERVICE_TEXT;
      console.log("[TOS Injector] Auto-loaded Terms text on DOM ready.");
    } else {
      console.log("[TOS Injector] Terms text already populated.");
    }
  } catch (err) {
    console.error("[TOS Injector] Failed:", err);
  }
});

/* =====================================================
   INITIALIZE ONCE DOM IS READY
   ===================================================== */
window.addEventListener("DOMContentLoaded", boot, { once: true });

/* =====================================================
   EXPORTS
   ===================================================== */
export const VerseCraftApp = {
  version: APP_VERSION,
  go,
  currentScreen,
};
