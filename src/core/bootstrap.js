/**
 * bootstrap.js
 * v2.7.8-UltimateLifecycleDiag
 * Handles initialization sequence and diagnostics
 */

import { screenManager } from "./screen-manager.js";
import { registerScreens } from "./screen-registry.js";

(async function bootstrap() {
  try {
    console.log("🚀 [BOOTSTRAP] VerseCraft initializing...");

    await new Promise((resolve) => {
      if (document.readyState === "complete" || document.readyState === "interactive")
        resolve();
      else document.addEventListener("DOMContentLoaded", resolve);
    });

    const mountId = "screens";
    await registerScreens(screenManager);
    await screenManager.init({ mountId, initialScreen: "splash" });

    console.log("✅ [BOOTSTRAP] Initialization complete.");
  } catch (err) {
    console.error("❌ [BOOTSTRAP] Critical failure:", err);
    document.body.innerHTML = `<div style="color:red;padding:2em;font-family:sans-serif">
      <h2>VerseCraft Engine Error</h2>
      <p>${err.message}</p>
    </div>`;
  }
})();
