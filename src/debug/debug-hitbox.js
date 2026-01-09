/**
 * VerseCraft Ultimate
 * Debug Hitbox / Coordinate Tracker + Mapping Table
 * v1.1 - Merged Scaffold
 *
 * Combines the live XY tracker with a coordinate map for controlled hitbox tuning.
 */

import { DebugManager } from "./debug-manager.js";
const MODULE_NAME = "Hitbox Tracker";
const VERSION = "v1.1-Merged";

DebugManager.register(MODULE_NAME, VERSION);

document.addEventListener("DOMContentLoaded", () => {
  let enabled = true;

  /* =====================================================
     LIVE XY TRACKER
     ===================================================== */
  const crosshair = document.createElement("div");
  const label = document.createElement("div");

  // Crosshair style
  crosshair.style.position = "fixed";
  crosshair.style.width = "15px";
  crosshair.style.height = "15px";
  crosshair.style.border = "1px solid rgba(0,255,0,0.8)";
  crosshair.style.borderRadius = "50%";
  crosshair.style.pointerEvents = "none";
  crosshair.style.zIndex = "999998";

  // Label style
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

  /* =====================================================
     STATIC HITBOX MAP — for alignment and visual tuning
     ===================================================== */
  export const HITBOX_MAP = {
    hbSplashTap: { x: 220, y: 650, w: 323, h: 110 },
    hbTosAccept: { x: 180, y: 530, w: 323, h: 110 },
    hbMenuLoad: { x: 250, y: 420, w: 280, h: 90 },
    hbMenuSettings: { x: 260, y: 540, w: 280, h: 90 },
    hbRow0: { x: 180, y: 350, w: 320, h: 100 },
    hbRow1: { x: 180, y: 490, w: 320, h: 100 },
    hbStoryBack: { x: 140, y: 720, w: 200, h: 80 },
  };

  /* =====================================================
     HITBOX VISUALIZER — optional cyan outlines for verification
     ===================================================== */
  function renderHitboxes() {
    Object.entries(HITBOX_MAP).forEach(([id, box]) => {
      const outline = document.createElement("div");
      outline.style.position = "absolute";
      outline.style.left = `${box.x}px`;
      outline.style.top = `${box.y}px`;
      outline.style.width = `${box.w}px`;
      outline.style.height = `${box.h}px`;
      outline.style.border = "1px dashed rgba(0,255,255,0.8)";
      outline.style.zIndex = "999997";
      outline.style.pointerEvents = "none";
      outline.dataset.hitbox = id;
      document.body.appendChild(outline);
    });
  }

  // Draw hitboxes only when Debug mode is on
  if (document.body.classList.contains("debug-mode")) {
    renderHitboxes();
  }

  /* =====================================================
     PUBLIC API
     ===================================================== */
  window.DebugHitbox = {
    enable() {
      enabled = true;
      console.log("[Hitbox Tracker] Enabled");
    },
    disable() {
      enabled = false;
      console.log("[Hitbox Tracker] Disabled");
    },
    toggle() {
      enabled = !enabled;
      console.log(`[Hitbox Tracker] ${enabled ? "Enabled" : "Disabled"}`);
    },
    version: VERSION,
    renderHitboxes,
  };

  console.log(`%c[${MODULE_NAME}] ${VERSION} active`, "color: lime; font-weight: bold;");
});
