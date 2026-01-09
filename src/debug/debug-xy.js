/**
 * VerseCraft XY Debug Tool
 * v1.0 — Tap Coordinate Visualizer
 * Non-invasive touch marker system for measuring hitbox alignment
 */

console.log("%c[XY Debug] Loaded v1.0", "color: cyan; font-weight: bold;");

export const XYDebug = (() => {
  let active = false;
  let container = null;

  function createContainer() {
    container = document.createElement("div");
    container.id = "xyDebugOverlay";
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "2147483647",
      pointerEvents: "none",
    });
    document.body.appendChild(container);
  }

  function spawnMarker(x, y) {
    const marker = document.createElement("div");
    const label = document.createElement("div");

    Object.assign(marker.style, {
      position: "absolute",
      top: `${y - 4}px`,
      left: `${x - 4}px`,
      width: "8px",
      height: "8px",
      background: "rgba(255,0,0,0.8)",
      borderRadius: "50%",
      boxShadow: "0 0 6px rgba(255,0,0,0.7)",
      pointerEvents: "none",
    });

    Object.assign(label.style, {
      position: "absolute",
      top: `${y + 10}px`,
      left: `${x + 10}px`,
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#ff4444",
      background: "rgba(0,0,0,0.6)",
      padding: "2px 3px",
      borderRadius: "2px",
      pointerEvents: "none",
    });

    label.textContent = `(${x}, ${y})`;

    container.appendChild(marker);
    container.appendChild(label);

    console.log(`[XY] Tap at: ${x}px, ${y}px`);

    setTimeout(() => {
      marker.remove();
      label.remove();
    }, 2000);
  }

  function onTap(e) {
    if (!active) return;
    const touch = e.touches ? e.touches[0] : e;
    spawnMarker(touch.clientX, touch.clientY);
  }

  function enable() {
    if (active) return;
    if (!container) createContainer();
    active = true;
    document.addEventListener("touchstart", onTap);
    document.addEventListener("click", onTap);
    console.log("%c[XY Debug] Activated", "color: lime;");
  }

  function disable() {
    if (!active) return;
    active = false;
    document.removeEventListener("touchstart", onTap);
    document.removeEventListener("click", onTap);
    console.log("%c[XY Debug] Deactivated", "color: orange;");
    if (container) container.innerHTML = "";
  }

  return { enable, disable };
})();
