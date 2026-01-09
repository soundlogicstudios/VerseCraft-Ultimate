/*
 * VerseCraft Legacy Wrapper
 * v2.7.4-LockFix
 * Purpose: restore stable navigation, scroll lock, and debug gear icon.
 */

import { DebugManager } from "./debug-manager.js";

export class LegacyWrapper {
  constructor() {
    this.enabled = false;
    this.version = "v2.7.4-LockFix";
    this.hud = null;
    this.gear = null;
  }

  init() {
    this.injectCSS();
    this.createGear();
    this.createHUD();
    DebugManager.register("LegacyWrapper", this.version);
    this.updateHUD("HUD waiting…");
  }

  injectCSS() {
    if (document.getElementById("debug-style")) return;
    const style = document.createElement("style");
    style.id = "debug-style";
    style.textContent = `
      html, body {
        overflow: hidden !important;
        height: 100%;
        touch-action: none;
      }

      /* Only Terms of Service scrolls */
      #screen-tos, .screen-tos, #tosText {
        overflow-y: auto !important;
        touch-action: pan-y !important;
      }

      body.debug-mode .hitbox,
      body.debug-mode [data-hitbox] {
        outline: 2px dashed rgba(0,255,255,0.8);
        position: relative;
        z-index: 9999;
      }

      #debugHUD {
        position: fixed;
        bottom: 6px;
        left: 8px;
        background: rgba(0,0,0,0.65);
        color: #0ff;
        font-size: 11px;
        font-family: monospace;
        padding: 4px 8px;
        border-radius: 4px;
        z-index: 2147483646;
        pointer-events: none;
      }

      #debugGear {
        position: fixed;
        bottom: 6px;
        right: 10px;
        font-size: 22px;
        cursor: pointer;
        z-index: 2147483647;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  }

  createGear() {
    if (this.gear) return;
    this.gear = document.createElement("div");
    this.gear.id = "debugGear";
    this.gear.textContent = "⚙️";
    this.gear.addEventListener("click", () => this.toggle());
    document.body.appendChild(this.gear);
  }

  createHUD() {
    if (document.getElementById("debugHUD")) return;
    this.hud = document.createElement("div");
    this.hud.id = "debugHUD";
    this.hud.textContent = "HUD waiting…";
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
    this.bindXY();
    DebugManager.broadcast("onEnable");
  }

  deactivateDebug() {
    document.body.classList.remove("debug-mode");
    this.updateHUD("Debug disabled");
    this.unbindXY();
    DebugManager.broadcast("onDisable");
  }

  bindXY() {
    if (this.xyHandler) return;
    this.xyHandler = (e) => {
      if (!this.enabled) return;
      const t = e.touches ? e.touches[0] : e;
      const el = document.elementFromPoint(t.clientX, t.clientY);
      const section = el?.closest(".screen");
      const hud = document.getElementById("debugHUD");
      if (!hud) return;
      hud.innerHTML = `[XY] (${Math.round(t.clientX)}, ${Math.round(t.clientY)})<br>
        Tag: ${el.tagName}<br>
        ID: ${el.id || "(none)"}<br>
        Screen: ${section?.id || "(none)"}<br>
        Version: ${this.version}`;
    };
    document.addEventListener("touchstart", this.xyHandler, { passive: true });
  }

  unbindXY() {
    if (this.xyHandler) {
      document.removeEventListener("touchstart", this.xyHandler);
      this.xyHandler = null;
    }
  }

  updateHUD(status) {
    const hud = document.getElementById("debugHUD");
    if (!hud) return;
    hud.innerHTML = `[HUD] ${status}<br>
      Screen: ${window.activeScreen || "none"}<br>
      Version: ${this.version}`;
  }
}

window.LegacyWrapper = new LegacyWrapper();
window.addEventListener("DOMContentLoaded", () => {
  window.LegacyWrapper.init();
});
