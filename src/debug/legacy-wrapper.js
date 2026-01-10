/**
 * VerseCraft Ultimate – Legacy Wrapper
 * v2.7.7R2–UltimateAlignRefresh
 *
 * Restores functional HUD, adds auto-refresh loop for active screen detection,
 * and fixes invisible gear (absolute path + cyan fallback).
 * Maintains scroll lock, viewport insets, and DebugManager integration.
 */

import { DebugManager } from "./debug-manager.js";

export class LegacyWrapper {
  constructor() {
    this.enabled = false;
    this.version = "v2.7.7R2–UltimateAlignRefresh";
    this.hud = null;
    this.gear = null;
    this.diagInterval = null;
    this.insetCompensation = { top: 44, bottom: 31 };
  }

  init() {
    console.log(`[LegacyWrapper] Initializing ${this.version}`);
    this.injectCSS();
    this.createGear();
    this.createHUD();
    this.applySafeAreaAlignment();
    DebugManager.register("LegacyWrapper", this.version);
    this.updateHUD("[HUD ready]");
    this.startAutoHUD();
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
        width: 32px;
        height: 32px;
        background: url('/src/assets/debug/gear.svg') center/contain no-repeat, rgba(0,255,255,0.15);
        background-blend-mode: lighten;
        border: 1px solid cyan;
        border-radius: 50%;
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
        background: rgba(0,0,0,0.55);
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
      this.hud.textContent = `${text}\nScreen: ${this.getCurrentScreen()}\nVersion: ${this.version}\n[Viewport] ${window.innerWidth}×${window.innerHeight}\noffsetY:${window.scrollY} insetT:${this.insetCompensation.top}px insetB:${this.insetCompensation.bottom}px`;
    }
  }

  toggleDebug() {
    this.enabled = !this.enabled;
    const state = this.enabled ? "Enabled" : "Disabled";
    console.log(`[LegacyWrapper] Debug ${state}`);
    this.updateHUD(`[HUD] ${state}`);
    DebugManager.setActive(this.enabled);
  }

  startAutoHUD() {
    if (this.diagInterval) clearInterval(this.diagInterval);
    this.diagInterval = setInterval(() => {
      if (this.hud) this.updateHUD("[HUD monitoring]");
    }, 500);
  }

  applySafeAreaAlignment() {
    const body = document.body.style;
    body.position = "fixed";
    body.top = "0";
    body.left = "0";
    body.right = "0";
    body.bottom = "0";
    body.overflow = "hidden";
    body.height = "100%";
    body.width = "100%";
  }

  getCurrentScreen() {
    const active = document.querySelector("[data-screen].active");
    return active ? active.dataset.screen : "none";
  }
}

// Auto-init
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = new LegacyWrapper();
  wrapper.init();
  window.LegacyWrapper = wrapper;
});
