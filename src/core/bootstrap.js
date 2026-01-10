/**
 * bootstrap.js
 * VerseCraft Ultimate v2.7.9 - Full Replacement
 */

import { VERSION, DEBUG_PATH } from "./constants.js";
import { screenManager } from "./screen-manager.js";

async function initApp() {
  console.group(`[VerseCraft] Booting v${VERSION}`);

  const appRoot = document.getElementById("app");
  if (!appRoot) {
    console.error("[VerseCraft] Fatal: missing <div id='app'> container.");
    console.groupEnd();
    return;
  }

  // Clean up container and lock scroll
  appRoot.innerHTML = "";
  document.body.style.overflow = "hidden";

  // Debug system loader
  try {
    if (
      location.pathname.includes(DEBUG_PATH) ||
      window.location.href.includes("?debug=true")
    ) {
      console.info("[VerseCraft] Debug mode detected – loading Ultimate Debug Suite...");
      await import("./debug/debug-boot.js");
    } else {
      console.info("[VerseCraft] Running in normal mode (debug off).");
    }
  } catch (err) {
    console.warn("[VerseCraft] Debug system could not be loaded:", err);
  }

  // Initialize first screen
  try {
    console.info("[VerseCraft] Initializing first screen (splash)...");
    await screenManager.go("splash");
  } catch (err) {
    console.error("[VerseCraft] ScreenManager failed to initialize splash:", err);
  }

  // Global error handlers
  window.addEventListener("error", (e) => {
    console.error("[VerseCraft] Global error:", e.message, e.filename, e.lineno);
  });

  window.addEventListener("unhandledrejection", (e) => {
    console.error("[VerseCraft] Unhandled promise rejection:", e.reason);
  });

  console.info(`[VerseCraft] ✅ Initialization complete (v${VERSION})`);
  console.groupEnd();
}

// Main entrypoint
document.addEventListener("DOMContentLoaded", () => {
  try {
    initApp();
  } catch (err) {
    console.error("[VerseCraft] Bootstrap initialization failed:", err);
  }
});
