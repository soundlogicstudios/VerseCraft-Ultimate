/**
 * Debug Hitbox / Coordinate Tracker
 * v0.1.1 - Stable scaffold
 */

import { DebugManager } from "./debug-manager.js";
const MODULE_NAME = "Hitbox Tracker";
const VERSION = "v0.1.1";

DebugManager.register(MODULE_NAME, VERSION);

document.addEventListener("DOMContentLoaded", () => {
  let enabled = true;

  const crosshair = document.createElement("div");
  const label = document.createElement("div");

  // Crosshair
  crosshair.style.position = "fixed";
  crosshair.style.width = "15px";
  crosshair.style.height = "15px";
  crosshair.style.border = "1px solid rgba(0,255,0,0.8)";
  crosshair.style.borderRadius = "50%";
  crosshair.style.pointerEvents = "none";
  crosshair.style.zIndex = "999998";

  // Label
  label.style.position = "fixed";
  label.style.background = "rgba(0,0,0,0.7)";
  label.style.color = "#00ff00";
  label.style.fontSize = "10px";
  label.style.fontFamily = "monospace";
  label.style.padding = "2px 4px";
  label.style.borderRadius = "3px";
  label.style.pointerEvents = "none";
  label.style.zIndex = "999999";

  document.body.appendChild(crosshair);
  document.body.appendChild(label);

  function update(x, y) {
    crosshair.style.left = `${x - 7}px`;
    crosshair.style.top = `${y - 7}px`;
    label.style.left = `${x + 12}px`;
    label.style.top = `${y + 12}px`;
    label.textContent = `x:${Math.round(x)} y:${Math.round(y)}`;
  }

  function handleMove(e) {
    if (!enabled) return;
    const t = e.touches?.[0] ?? e;
    update(t.clientX, t.clientY);
  }

  document.addEventListener("mousemove", handleMove);
  document.addEventListener("touchmove", handleMove);

  window.DebugHitbox = {
    enable() { enabled = true; console.log("[Hitbox Tracker] Enabled"); },
    disable() { enabled = false; console.log("[Hitbox Tracker] Disabled"); },
    toggle() { enabled = !enabled; console.log(`[Hitbox Tracker] ${enabled ? "Enabled" : "Disabled"}`); },
    version: VERSION,
  };

  console.log(`%c[${MODULE_NAME}] ${VERSION} active`, "color: lime; font-weight: bold;");
});
})();
