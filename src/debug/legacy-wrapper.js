/*
 * VerseCraft Legacy Wrapper - MicroPatch v2.9.1-PointerFix
 * Fixes: Navigation lock, scroll freeze, ghost overlays.
 */

import { DebugManager } from "./debug-manager.js";

export class LegacyWrapper {
  constructor() {
    this.enabled = false;
    this.hud = null;
    this.gear = null;
    this.version = "v2.9.1-PointerFix";
  }

  init() {
    this.createGear();
    this.createHUD();
    DebugManager.register("LegacyWrapper", this.version);
    this.updateHUD("HUD waiting...");
  }

  createGear() {
    if (this.gear) return;
    this.gear = document.createElement("div");
    this.gear.id = "debugGear";
    this.gear.textContent = "⚙️";
    Object.assign(this.gear.style, {
      position: "fixed",
      bottom: "6px",
      right: "10px",
      fontSize: "22px",
      cursor: "pointer",
      zIndex: "999999",
      userSelect: "none",
    });
    this.gear.addEventListener("click", () => this.toggle());
    document.body.appendChild(this.gear);
  }

  createHUD() {
    if (document.getElementById("debugHUD")) return;
    this.hud = document.createElement("div");
    this.hud.id = "debugHUD";
    Object.assign(this.hud.style, {
      position: "fixed",
      bottom: "6px",
      left: "8px",
      background: "rgba(0,0,0,0.65)",
      color: "#0ff",
      fontSize: "11px",
      fontFamily: "monospace",
      padding: "4px 8px",
      borderRadius: "4px",
      zIndex: "999998",
      pointerEvents: "none",
    });
    document.body.appendChild(this.hud);
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.activateDebug();
    } else {
      this.deactivateDebug();
    }
  }

  activateDebug() {
    document.body.classList.add("debug-mode");
    this.updateHUD("Debug enabled");

    // Enable XY tracking
    document.addEventListener("touchstart", this.onTouchStart, { passive: true });

    // Allow hitbox inspection but preserve scroll/navigation
    const active = document.querySelector(".screen.active");
    if (active) {
      active.style.pointerEvents = "auto";
      active.style.overflow = "auto";
    }

    DebugManager.broadcast("onEnable");
  }

  deactivateDebug() {
    document.body.classList.remove("debug-mode");
    this.updateHUD("Debug disabled");

    // Remove all debug overlay elements
    document.querySelectorAll(".debug-hitbox-layer, .debug-xy-overlay, .debug-touch-pointer")
      .forEach(el => el.remove());

    // Restore full navigation and scroll
    const active = document.querySelector(".screen.active");
    if (active) {
      active.style.pointerEvents = "auto";
      active.style.overflow = "auto";
    }

    // Remove XY listener to prevent duplicates
    document.removeEventListener("touchstart", this.onTouchStart);

    DebugManager.broadcast("onDisable");
  }

  onTouchStart(e) {
    if (!window.LegacyWrapper?.enabled) return;
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const section = el?.closest(".screen");
    const hud = document.getElementById("debugHUD");
    if (!hud) return;
    hud.innerHTML = `[XY] (${Math.round(t.clientX)}, ${Math.round(t.clientY)})<br>
      Tag: ${el?.tagName || "(none)"}<br>
      ID: ${el?.id || "(none)"}<br>
      Screen: ${section?.id || "(none)"}`;
  }

  updateHUD(status) {
    const hudEl = document.getElementById("debugHUD");
    if (!hudEl) return;
    hudEl.innerHTML = `[HUD] ${status}<br>
      Screen: ${window.activeScreen || "none"}<br>
      Version: ${this.version}`;
  }
}

window.LegacyWrapper = new LegacyWrapper();
window.addEventListener("DOMContentLoaded", () => {
  window.LegacyWrapper.init();
});
