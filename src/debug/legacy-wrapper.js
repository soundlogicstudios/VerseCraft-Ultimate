/*
 * VerseCraft Legacy Wrapper
 * v2.9.4-SafeFrameRestore
 * Fixes frame squish on Terms of Service by exempting its screen
 * from global overflow lock while maintaining debug calibration.
 */

import { DebugManager } from "./debug-manager.js";

export class LegacyWrapper {
  constructor() {
    this.enabled = false;
    this.hud = null;
    this.gear = null;
    this.version = "v2.9.4-SafeFrameRestore";
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
      /* Cyan outlines for hitboxes */
      body.debug-mode .hitbox,
      body.debug-mode [data-hitbox] {
        outline: 2px dashed rgba(0,255,255,0.9);
        border: 1px solid rgba(0,255,255,0.6);
        outline-offset: -2px;
        z-index: 99998;
        pointer-events: auto;
        animation: dbgPulse 1.5s ease-in-out infinite alternate;
      }

      @keyframes dbgPulse {
        0% { border-color: rgba(0,255,255,0.3); }
        100% { border-color: rgba(0,255,255,1); }
      }

      html, body {
        overflow: hidden !important; /* Stage lock */
        height: 100%;
        touch-action: none;
      }

      /* ✅ Exception: Allow full rendering + scroll for TOS */
      #screen-tos, #screen-terms, .screen-tos {
        overflow: auto !important;
        touch-action: pan-y;
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
        line-height: 1.3em;
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
    this.lockStage();
    DebugManager.broadcast("onEnable");
  }

  deactivateDebug() {
    document.body.classList.remove("debug-mode");
    this.updateHUD("Debug disabled");
    this.unbindXY();
    this.cleanupOverlays();
    this.lockStage();
    DebugManager.broadcast("onDisable");
  }

  bindXY() {
    if (this.xyHandler) return;
    this.xyHandler = (e) => {
      if (!this.enabled) return;
      const t = e.touches ? e.touches[0] : e;
      const el = document.elementFromPoint(t.clientX, t.clientY);
      if (!el) return;
      const section = el.closest(".screen");
      const hud = document.getElementById("debugHUD");
      if (!hud) return;
      hud.innerHTML = `[XY] (${Math.round(t.clientX)}, ${Math.round(t.clientY)})<br>
        Tag: ${el.tagName}<br>
        ID: ${el.id || "(none)"}<br>
        Screen: ${section?.id || "(none)"}`;
    };
    document.addEventListener("touchstart", this.xyHandler, { passive: true });
  }

  unbindXY() {
    if (this.xyHandler) {
      document.removeEventListener("touchstart", this.xyHandler);
      this.xyHandler = null;
    }
  }

  cleanupOverlays() {
    document.querySelectorAll(".debug-hitbox-layer, .debug-touch-pointer, .debug-xy-overlay")
      .forEach(el => el.remove());
  }

  lockStage() {
    // Lock every screen EXCEPT the Terms of Service
    document.querySelectorAll(".screen").forEach(s => {
      if (s.id === "screen-tos" || s.classList.contains("screen-tos") || s.id === "screen-terms") {
        s.style.overflow = "auto";
        s.style.touchAction = "pan-y";
      } else {
        s.style.overflow = "hidden";
        s.style.touchAction = "none";
      }
      s.style.pointerEvents = "auto";
    });
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
