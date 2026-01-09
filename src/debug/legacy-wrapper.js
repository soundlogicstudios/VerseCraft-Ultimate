/*
 * VerseCraft Ultimate - Legacy Wrapper
 * v2.7.6-UltimateDiag
 * Diagnostic-safe build for viewport alignment, safe-area padding, and scroll locking.
 * Compatible with Ultimate architecture.
 */

import { DebugManager } from "./debug-manager.js";

export class LegacyWrapper {
  constructor() {
    this.enabled = false;
    this.version = "v2.7.6-UltimateDiag";
    this.hud = null;
    this.gear = null;
    this.diagInterval = null;
  }

  init() {
    console.log(`[LegacyWrapper] Initializing ${this.version}`);
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
        background-color: black;
      }

      /* Respect iPhone safe areas */
      body {
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
        box-sizing: border-box;
      }

      /* Scroll unlock ONLY for ToS screen */
      #screen-tos, .screen-tos, #tosText {
        overflow-y: auto !important;
        touch-action: pan-y !important;
        height: calc(100% - env(safe-area-inset-bottom)) !important;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      /* Cyan hitbox outlines */
      body.debug-mode .hitbox,
      body.debug-mode [data-hitbox] {
        outline: 2px dashed rgba(0,255,255,0.8);
        position: relative;
        z-index: 9999;
        transform: translateX(calc(-1 * env(safe-area-inset-left)));
      }

      /* Debug HUD */
      #debugHUD {
        position: fixed;
        bottom: calc(6px + env(safe-area-inset-bottom));
        left: calc(8px + env(safe-area-inset-left));
        background: rgba(0,0,0,0.8);
        color: #00ffff;
        font-size: 11px;
        font-family: monospace;
        padding: 6px 10px;
        border-radius: 4px;
        z-index: 2147483646;
        pointer-events: none;
        text-shadow: 0 0 3px #000;
      }

      /* Gear icon for toggle */
      #debugGear {
        position: fixed;
        bottom: calc(6px + env(safe-area-inset-bottom));
        right: calc(10px + env(safe-area-inset-right));
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
    this.startDiagnostics();
    DebugManager.broadcast("onEnable");
  }

  deactivateDebug() {
    document.body.classList.remove("debug-mode");
    this.updateHUD("Debug disabled");
    this.unbindXY();
    this.stopDiagnostics();
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

  startDiagnostics() {
    this.stopDiagnostics();
    const hud = document.getElementById("debugHUD");
    const update = () => {
      if (!hud || !this.enabled) return;
      const vv = window.visualViewport;
      const sa = {
        top: getComputedStyle(document.body).getPropertyValue("padding-top"),
        bottom: getComputedStyle(document.body).getPropertyValue("padding-bottom"),
        left: getComputedStyle(document.body).getPropertyValue("padding-left"),
        right: getComputedStyle(document.body).getPropertyValue("padding-right")
      };
      hud.innerHTML += `<br>[Viewport] ${Math.round(vv.width)}×${Math.round(vv.height)}<br>
        offsetY:${Math.round(vv.offsetTop)} insetT:${sa.top.trim()} insetB:${sa.bottom.trim()}`;
    };
    this.diagInterval = setInterval(update, 1000);
  }

  stopDiagnostics() {
    if (this.diagInterval) {
      clearInterval(this.diagInterval);
      this.diagInterval = null;
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

/* Register globally for Ultimate architecture */
if (typeof window !== "undefined") {
  window.LegacyWrapper = new LegacyWrapper();
  window.addEventListener("DOMContentLoaded", () => {
    window.LegacyWrapper.init();
  });
}
