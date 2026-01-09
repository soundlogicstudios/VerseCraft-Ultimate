/*
 * VerseCraft Ultimate - Legacy Wrapper
 * v2.7.7-UltimateAlign
 * Alignment stabilization patch for iOS PWA + Web.
 * Corrects viewport offset, safe area insets, and restores consistent frame alignment.
 */

import { DebugManager } from "./debug-manager.js";

export class LegacyWrapper {
  constructor() {
    this.enabled = false;
    this.version = "v2.7.7-UltimateAlign";
    this.hud = null;
    this.gear = null;
    this.diagInterval = null;
    this.insetCompensation = { top: 0, bottom: 0 };
  }

  init() {
    console.log(`[LegacyWrapper] Initializing ${this.version}`);
    this.injectCSS();
    this.createGear();
    this.createHUD();
    this.applySafeAreaAlignment();
    DebugManager.register("LegacyWrapper", this.version);
    this.updateHUD("HUD ready");
  }

  injectCSS() {
    if (document.getElementById("debug-style")) return;
    const style = document.createElement("style");
    style.id = "debug-style";
    style.textContent = `
      html, body {
        overflow: hidden !important;
        height: 100%;
        margin: 0;
        padding: 0;
        touch-action: none;
        background-color: black;
        box-sizing: border-box;
      }

      /* Safe area aware body */
      body {
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
      }

      /* Terms of Service gets scroll unlock */
      #screen-tos, .screen-tos, #tosText {
        overflow-y: auto !important;
        touch-action: pan-y !important;
        -webkit-overflow-scrolling: touch;
        height: calc(100% - env(safe-area-inset-bottom));
      }

      /* Cyan hitbox outlines */
      body.debug-mode .hitbox,
      body.debug-mode [data-hitbox] {
        outline: 2px dashed rgba(0,255,255,0.85);
        position: relative;
        z-index: 9999;
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

      /* Gear icon */
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
    this.hud.textContent = "HUD loading…";
    document.body.appendChild(this.hud);
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) this.activateDebug();
    else this.deactivateDebug();
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
      const saTop = parseFloat(getComputedStyle(document.body).getPropertyValue("padding-top")) || 0;
      const saBottom = parseFloat(getComputedStyle(document.body).getPropertyValue("padding-bottom")) || 0;
      hud.innerHTML += `<br>[Viewport] ${Math.round(vv.width)}×${Math.round(vv.height)}<br>
        offsetY:${Math.round(vv.offsetTop)} insetT:${saTop}px insetB:${saBottom}px`;
    };
    this.diagInterval = setInterval(update, 1000);
  }

  stopDiagnostics() {
    if (this.diagInterval) {
      clearInterval(this.diagInterval);
      this.diagInterval = null;
    }
  }

  applySafeAreaAlignment() {
    const vv = window.visualViewport;
    const body = document.body;
    const insetT = parseFloat(getComputedStyle(body).getPropertyValue("padding-top")) || 0;
    const insetB = parseFloat(getComputedStyle(body).getPropertyValue("padding-bottom")) || 0;

    // Adaptive fix: when safe-area insets are detected, normalize frame scale
    if (insetT > 0 || insetB > 0) {
      this.insetCompensation.top = insetT;
      this.insetCompensation.bottom = insetB;
      const root = document.getElementById("app") || document.body;
      root.style.transform = `translateY(${-(insetT / 2)}px)`;
      root.style.height = `calc(100% - ${insetT + insetB}px)`;
      console.log(`[LegacyWrapper] Safe-area compensation applied (T:${insetT}px, B:${insetB}px)`);
    } else {
      console.log("[LegacyWrapper] No safe-area compensation needed.");
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

/* Register globally */
if (typeof window !== "undefined") {
  window.LegacyWrapper = new LegacyWrapper();
  window.addEventListener("DOMContentLoaded", () => {
    window.LegacyWrapper.init();
  });
}
