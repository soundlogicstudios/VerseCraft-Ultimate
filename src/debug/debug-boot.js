/**
 * VerseCraft Debug Bootloader
 * v0.1
 * Ensures all debug modules load globally after DOM is ready
 */

window.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("%c[DebugBoot] Initializing Debug System...", "color: cyan");

    // Import manager first
    const { DebugManager } = await import("./debug-manager.js");

    // Load modules safely
    await import("./debug-overlay.js");
    await import("./debug-touch.js");
    await import("./debug-hitbox.js");

    // Log active modules
    if (DebugManager && typeof DebugManager.list === "function") {
      DebugManager.list();
    }

    console.log("%c[DebugBoot] All modules loaded successfully.", "color: lime");
  } catch (err) {
    console.error("[DebugBoot] Failed to load:", err);
  }
});