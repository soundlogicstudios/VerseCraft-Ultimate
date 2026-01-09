/*
 * VerseCraft Legacy Wrapper
 * v2.9.5-CalibrateHUD
 * Adds visual calibration overlay for each hitbox:
 *  - Corner markers (cyan)
 *  - Label showing ID + size
 *  - Keeps scroll locked globally except TOS
 */

import { DebugManager } from "./debug-manager.js";

export class LegacyWrapper {
  constructor() {
    this.enabled = false;
    this.version = "v2.9.5-CalibrateHUD";
    this.hud = null;
    this.gear = null;
    this.labelOverlays = [];
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

      #screen-tos, #screen-terms, .screen-tos {
        overflow: auto !important;
        touch-action: pan-y;
      }

      body.debug-mode .hitbox,
      body.debug-mode [data-hitbox] {
        outline: 2px dashed rgba(0,255,255,0.9);
        border: 1px solid rgba(0,255,255,0.6);
        outline-offset: -2px;
        position: relative;
        z-index: 99997;
        animation: dbgPulse 1.5s ease-in-out infinite alternate;
      }

      @keyframes dbgPulse {
        0% { border-color: rgba(0,255,255,0.3); }
        100% { border-color: rgba(0,255,255,1); }
      }

      .calib-label {
        position: absolute;
        background: rgba(0,0,0,0.7);
        color: #0ff;
        font-size: 9px;
        font-family: monospace;
        border-radius: 2px;
        padding: 2px 3px;
        z-index: 99998;
        pointer-events: none;
      }

      .corner-marker {
        position: absolute;
        width: 6px;
        height: 6px;
        border: 1px solid #0ff;
        background: rgba(0,255,255,0.2);
        z-index: 99999;
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
    this.drawCalibrationOverlays();
    DebugManager.broadcast("onEnable");
  }

  deactivateDebug() {
    document.body.classList.remove("debug-mode");
    this.updateHUD("Debug disabled");
    this.unbindXY();
    this.removeCalibrationOverlays();
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

  drawCalibrationOverlays() {
    this.removeCalibrationOverlays();
    const hitboxes = document.querySelectorAll(".hitbox, [data-hitbox]");
    hitboxes.forEach((box, index) => {
      const rect = box.getBoundingClientRect();

      // Label
      const label = document.createElement("div");
      label.className = "calib-label";
      label.textContent = `${index}: ${box.id || "(unnamed)"} ${Math.round(rect.width)}×${Math.round(rect.height)}`;
      label.style.left = `${rect.left + 4}px`;
      label.style.top = `${rect.top - 12}px`;
      document.body.appendChild(label);
      this.labelOverlays.push(label);

      // Corner markers
      const corners = [
        [rect.left, rect.top],
        [rect.right - 6, rect.top],
        [rect.left, rect.bottom - 6],
        [rect.right - 6, rect.bottom - 6],
      ];
      corners.forEach(([x, y]) => {
        const mark = document.createElement("div");
        mark.className = "corner-marker";
        mark.style.left = `${x}px`;
        mark.style.top = `${y}px`;
        document.body.appendChild(mark);
        this.labelOverlays.push(mark);
      });
    });
  }

  removeCalibrationOverlays() {
    this.labelOverlays.forEach(el => el.remove());
    this.labelOverlays = [];
  }
}

window.LegacyWrapper = new LegacyWrapper();
window.addEventListener("DOMContentLoaded", () => {
  window.LegacyWrapper.init();
});
