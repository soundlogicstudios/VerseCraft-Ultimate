/**
 * debug-boot.js
 * VerseCraft Ultimate v2.7.9 - Modern Debug Boot
 */

import { DebugManagerInstance } from "./debug-manager.js";
import { VERSION } from "../constants.js";

console.info(`[VerseCraft Debug] Booting Ultimate Debug Suite v${VERSION}`);

window.DebugManager = DebugManagerInstance;

function initToggleButton() {
  const btn = document.createElement("div");
  btn.textContent = "⚙";
  btn.title = "Toggle Debug HUD";
  Object.assign(btn.style, {
    position: "fixed",
    bottom: "10px",
    right: "10px",
    background: "rgba(0,255,255,0.3)",
    color: "#000",
    fontSize: "18px",
    borderRadius: "50%",
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 999999
  });

  btn.addEventListener("click", () => DebugManagerInstance.toggle());
  document.body.appendChild(btn);
}

document.addEventListener("DOMContentLoaded", initToggleButton);
