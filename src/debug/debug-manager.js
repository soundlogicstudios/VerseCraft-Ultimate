/**
 * debug-manager.js
 * VerseCraft Ultimate v2.7.9 - Unified Debug Manager
 */

import { VERSION } from "../constants.js";

class DebugManager {
  constructor() {
    this.active = false;
    this.currentScreen = "none";
    this.hud = null;
    this.initHUD();
    this.registerEvents();
  }

  initHUD() {
    this.hud = document.createElement("div");
    this.hud.id = "debug-hud";
    this.hud.style.position = "fixed";
    this.hud.style.bottom = "6px";
    this.hud.style.left = "6px";
    this.hud.style.zIndex = "999999";
    this.hud.style.fontFamily = "monospace";
    this.hud.style.fontSize = "11px";
    this.hud.style.color = "#00ffff";
    this.hud.style.background = "rgba(0,0,0,0.6)";
    this.hud.style.padding = "6px 10px";
    this.hud.style.borderRadius = "5px";
    this.hud.innerHTML = `HUD Waiting<br>Version ${VERSION}<br>Screen none`;
    document.body.appendChild(this.hud);
  }

  registerEvents() {
    window.addEventListener("screenChanged", (e) => {
      this.setScreen(e.detail.id);
    });
  }

  toggle() {
    this.active = !this.active;
    this.hud.style.display = this.active ? "block" : "none";
    console.log(`[DebugManager] HUD ${this.active ? "enabled" : "disabled"}`);
  }

  setScreen(screenId) {
    this.currentScreen = screenId;
    if (this.hud) {
      this.hud.innerHTML = `
        HUD Monitoring<br>
        Screen: ${screenId}<br>
        Version ${VERSION}
      `;
    }
  }
}

export const DebugManagerInstance = new DebugManager();

console.log(`[DebugManager] Loaded (${VERSION})`);
