/**
 * VerseCraft Ultimate – Legacy Wrapper
 * v2.7.8–UltimateLifecycleDiag (Phase 1)
 *
 * Diagnostic HUD, Debug toggle, and version synchronization.
 * Replaces static versioning and removes inset compensation logic.
 */

import { DebugManager } from "./debug-manager.js";
import { APP_VERSION } from "../core/constants.js";

export class LegacyWrapper {
  constructor() {
    this.enabled = false;
    this.version = APP_VERSION || "v2.7.8–UltimateLifecycleDiag";
    this.hud = null;
    this.gear = null;
    this.diagInterval = null;

    // Removed hard-coded inset compensation; handled by viewport-lock.js instead.
    this.insetCompensation = { top: 0, bottom: 0 };
  }

  init() {
    console.log(`[LegacyWrapper] Initializing v${this.version}`);
    this.injectCSS();
    this.createGear();
    this.createHUD();
    DebugManager.register("LegacyWrapper", this.version);
    this.updateHUD("[HUD ready]");
  }

  injectCSS() {
    if (document.getElementById("debug-style")) return;

    const style = document.createElement("style");
    style.id = "debug-style";
    style.textContent = `
      #debug-gear {
        position: fixed;
        bottom: 12px;
        right: 12px;
        width: 28px;
        height: 28px;
        background: url('../assets/debug/gear.svg') center/contain no-repeat;
        cursor: pointer;
        z-index: 9999;
      }
      #debug-hud {
        position: fixed;
        bottom: 12px;
        left: 12px;
        font-family: monospace;
        font-size: 11px;
        color: cyan;
        background: rgba(0,0,0,0.5);
        padding: 4px 6px;
        border-radius: 4px;
        z-index: 9998;
        pointer-events: none;
        white-space: pre-line;
      }
    `;
    document.head.appendChild(style);
  }

  createGear() {
    this.gear = document.createElement("div");
    this.gear.id = "debug-gear";
    this.gear.addEventListener("click", () => this.toggleDebug());
    document.body.appendChild(this.gear);
  }

  createHUD() {
    this.hud = document.createElement("div");
    this.hud.id = "debug-hud";
    this.hud.textContent = `[HUD] Initializing...\nVersion: ${this.version}`;
    document.body.appendChild(this.hud);
  }

  updateHUD(text) {
    if (this.hud) {
      this.hud.textContent = `${text}\nVersion: ${this.version}`;
    }
  }

  toggleDebug() {
    this.enabled = !this.enabled;
    const state = this.enabled ? "Enabled" : "Disabled";
    console.log(`[LegacyWrapper] Debug ${state}`);
    this.updateHUD(`[HUD] ${state}`);
    DebugManager.setActive(this.enabled);
  }
}

// Auto-init when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = new LegacyWrapper();
  wrapper.init();
  window.LegacyWrapper = wrapper;
});
