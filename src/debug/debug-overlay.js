/**
 * Debug Overlay Injector (inside #app)
 * v0.2 - guaranteed visible in VerseCraft DOM
 * Creates a dedicated overlay container anchored to #app
 */

window.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (!app) {
    console.error("[DebugOverlay] ❌ Could not find #app element!");
    return;
  }

  // Create debug container inside #app
  const overlay = document.createElement("div");
  overlay.id = "debug-overlay";
  Object.assign(overlay.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "999999999", // way above anything else
    pointerEvents: "none", // don't block gameplay
  });

  // Diagnostic text
  const banner = document.createElement("div");
  banner.innerText = "🧭 DEBUG OVERLAY ACTIVE (inside #app)";
  Object.assign(banner.style, {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "rgba(0,0,0,0.7)",
    color: "#0f0",
    fontFamily: "monospace",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "4px",
  });

  overlay.appendChild(banner);
  app.appendChild(overlay);

  // Expose overlay for other debug modules to use
  window.__DEBUG_OVERLAY__ = overlay;

  console.log("[DebugOverlay] ✅ Injected inside #app");
});