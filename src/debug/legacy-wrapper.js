/**
 * VerseCraft Legacy Debug Wrapper
 * v2.7.3-PILLRESTORE
 * - Restores always-visible Debug Pill
 * - Adds 2-finger double-tap shortcut
 * - Keeps pointer and isolation logic intact
 */

console.log("%c[LegacyWrapper] Initializing...", "color: cyan; font-weight: bold;");
import { initDebug } from "../debug.js";
import { ScreenIsolation } from "./screen-isolation.js";

export const LegacyDebug = (() => {
  let initialized = false;
  let hud;
  let pill;

  function injectDebugCSS() {
    const style = document.createElement("style");
    style.id = "legacy-debug-style";
    style.textContent = `
      body.debug [data-hitbox],
      body.debug .hitbox,
      body.debug button[id^='hb'] {
        outline: 2px dashed rgba(0,255,255,0.9) !important;
        border: 1px solid rgba(0,255,255,0.6) !important;
        outline-offset: -2px !important;
        z-index: 2147483647 !important;
        pointer-events: auto !important;
        animation: dbgPulse 1.5s ease-in-out infinite alternate;
      }

      @keyframes dbgPulse {
        0% { border-color: rgba(0,255,255,0.3); }
        100% { border-color: rgba(0,255,255,1); }
      }

      body.debug .screen,
      body.debug .screen.active,
      body.debug main.screens {
        pointer-events: none !important;
      }

      #debugHUD {
        position: fixed;
        bottom: 32px;
        left: 8px;
        background: rgba(0,0,0,0.7);
        color: #0ff;
        font-family: monospace;
        font-size: 10px;
        padding: 4px 6px;
        border-radius: 3px;
        z-index: 2147483647;
        pointer-events: none;
        white-space: pre-line;
      }

      #debugBadge {
        position: fixed;
        bottom: 80px;
        right: 10px;
        background: rgba(0,0,0,0.75);
        color: #0ff;
        font-family: monospace;
        font-size: 10px;
        padding: 4px 6px;
        border-radius: 3px;
        z-index: 2147483647;
        pointer-events: none;
      }

      #btnDebug {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid rgba(0,255,255,0.5);
        background: rgba(0,0,0,0.6);
        color: #0ff;
        font-size: 20px;
        font-weight: bold;
        z-index: 2147483647;
        text-align: center;
        line-height: 46px;
        cursor: pointer;
        pointer-events: auto;
      }
      #btnDebug:active {
        background: rgba(0,255,255,0.2);
      }
    `;
    document.head.appendChild(style);
    console.log("[LegacyWrapper] CSS injected v2.7.3-PILLRESTORE");
  }

  function injectHUD() {
    hud = document.createElement("div");
    hud.id = "debugHUD";
    hud.textContent = "HUD: waiting...";
    document.body.appendChild(hud);
  }

  function injectPill() {
    pill = document.getElementById("btnDebug");
    if (!pill) {
      pill = document.createElement("div");
      pill.id = "btnDebug";
      pill.textContent = "⚙️";
      document.body.appendChild(pill);
    }
    pill.addEventListener("click", toggleDebug);
  }

  function resetPointerEvents() {
    const screens = document.querySelectorAll(".screen, .screen.active, main.screens, .hitbox");
    screens.forEach(el => el.style.pointerEvents = "auto");
    void document.body.offsetHeight;
    console.log("%c[PointerFix] Pointer events reset", "color: lime;");
  }

  function toggleDebug() {
    const isActive = document.body.classList.toggle("debug");
    hud.textContent = isActive ? "HUD: Debug ENABLED" : "HUD: Debug DISABLED";
    if (isActive) ScreenIsolation.updateVisibility();
    else resetPointerEvents();
    console.log("%c[LegacyWrapper] Debug " + (isActive ? "ENABLED" : "DISABLED"), "color: yellow;");
  }

  function enableTouchXY() {
    document.addEventListener("touchstart", (e) => {
      const debugOn = document.body.classList.contains("debug");
      const t = e.touches[0];
      const el = document.elementFromPoint(t.clientX, t.clientY);
      if (!debugOn) return;

      if (el) {
        const section = el.closest("section[id^='screen-']");
        hud.textContent =
          `[XY] (${Math.round(t.clientX)}, ${Math.round(t.clientY)})\n` +
          `Tag: ${el.tagName}\n` +
          `ID: ${el.id || "(none)"}\n` +
          `Class: ${el.className || "(none)"}\n` +
          `Screen: ${section?.id || "(none)"}`;
        if (el.id?.startsWith("hb")) el.click();
      }
    });
  }

  function enableGestureShortcut() {
    let lastTap = 0;
    document.addEventListener("touchend", (e) => {
      if (e.touches.length === 0 && e.changedTouches.length === 2) {
        const now = Date.now();
        if (now - lastTap < 400) {
          toggleDebug();
        }
        lastTap = now;
      }
    });
  }

  function start() {
    if (initialized) return;
    try {
      initDebug();
      injectDebugCSS();
      injectHUD();
      injectPill();
      enableTouchXY();
      enableGestureShortcut();
      ScreenIsolation.init();
      initialized = true;

      console.log("%c[LegacyWrapper] Debug wrapper active.", "color: lime;");

      const badge = document.createElement("div");
      badge.id = "debugBadge";
      badge.innerText = "🧭 Debug Active v2.7.3-PILLRESTORE";
      document.body.appendChild(badge);
    } catch (err) {
      console.error("[LegacyWrapper] Failed:", err);
    }
  }

  window.addEventListener("DOMContentLoaded", start, { once: true });
})();