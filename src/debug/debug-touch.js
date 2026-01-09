/**
 * Touch Debugger Overlay (with on-screen version badge)
 * v1.2 - Non-invasive modular debugger
 */

(function () {
  const VERSION = "v1.2";
  import { DebugManager } from "./debug-manager.js";
DebugManager.register("Touch Debugger", VERSION);
  const MODULE_NAME = "Touch Debugger";

  const DEBUG_COLOR = "rgba(255, 0, 0, 0.7)";
  const DEBUG_LABEL_COLOR = "rgba(255,255,255,0.9)";
  const DEBUG_RADIUS = 12;
  const FADE_DURATION = 1200;
  const MAX_MARKERS = 10;

  let markers = [];
  let enabled = window.DEBUG_TOUCH ?? true;

  function createMarker(x, y, label) {
    if (!enabled) return;

    const marker = document.createElement("div");
    marker.style.position = "fixed";
    marker.style.left = `${x - DEBUG_RADIUS}px`;
    marker.style.top = `${y - DEBUG_RADIUS}px`;
    marker.style.width = `${DEBUG_RADIUS * 2}px`;
    marker.style.height = `${DEBUG_RADIUS * 2}px`;
    marker.style.borderRadius = "50%";
    marker.style.background = DEBUG_COLOR;
    marker.style.zIndex = "999999";
    marker.style.pointerEvents = "none";
    marker.style.transition = `opacity ${FADE_DURATION}ms ease-out`;
    marker.style.opacity = "1";

    // Label
    if (label) {
      const text = document.createElement("div");
      text.innerText = label;
      text.style.position = "absolute";
      text.style.left = "16px";
      text.style.top = "0";
      text.style.fontSize = "10px";
      text.style.fontFamily = "monospace";
      text.style.color = DEBUG_LABEL_COLOR;
      text.style.background = "rgba(0,0,0,0.6)";
      text.style.padding = "2px 4px";
      text.style.borderRadius = "3px";
      text.style.whiteSpace = "nowrap";
      text.style.pointerEvents = "none";
      marker.appendChild(text);
    }

    document.body.appendChild(marker);
    markers.push(marker);

    if (markers.length > MAX_MARKERS) {
      const old = markers.shift();
      old.remove();
    }

    // Fade out
    setTimeout(() => (marker.style.opacity = "0"), 50);
    setTimeout(() => marker.remove(), FADE_DURATION + 50);
  }

  function handleTouch(e) {
    if (!enabled) return;
    const touches = e.touches?.length ? e.touches : [e];
    for (const t of touches) {
      const el = document.elementFromPoint(t.clientX, t.clientY);
      const label = el
        ? `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${el.className ? "." + el.className.replace(/\s+/g, ".") : ""}`
        : "unknown";
      createMarker(t.clientX, t.clientY, label);
    }
  }

  document.addEventListener("touchstart", handleTouch);
  document.addEventListener("click", handleTouch);

  // 🔹 Add on-screen version badge
  function showVersionBadge() {
    const badge = document.createElement("div");
    badge.innerText = `${MODULE_NAME} ${VERSION}`;
    badge.id = "debug-version-badge";
    badge.style.position = "fixed";
    badge.style.bottom = "6px";
    badge.style.right = "6px";
    badge.style.padding = "4px 8px";
    badge.style.background = "rgba(0,0,0,0.7)";
    badge.style.color = "#00ff00";
    badge.style.fontSize = "10px";
    badge.style.fontFamily = "monospace";
    badge.style.borderRadius = "4px";
    badge.style.zIndex = "999999";
    badge.style.pointerEvents = "none";
    badge.style.userSelect = "none";
    document.body.appendChild(badge);
  }

  window.DebugTouch = {
    enable() {
      enabled = true;
      console.log(`[${MODULE_NAME}] Enabled`);
    },
    disable() {
      enabled = false;
      console.log(`[${MODULE_NAME}] Disabled`);
    },
    toggle() {
      enabled = !enabled;
      console.log(`[${MODULE_NAME}] ${enabled ? "Enabled" : "Disabled"}`);
    },
    version: VERSION,
  };

  console.log(
    `%c[${MODULE_NAME}] ${VERSION} active`,
    "color: red; font-weight: bold;"
  );

  if (document.readyState !== "loading") showVersionBadge();
  else document.addEventListener("DOMContentLoaded", showVersionBadge);
})();
