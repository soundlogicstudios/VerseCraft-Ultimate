/**
 * VerseCraft Debug Manager
 * v0.1 - Registers and displays active debug modules
 */

export const DebugManager = (() => {
  const modules = new Map();

  function register(name, version) {
    modules.set(name, version);
    updateHUD();
    console.log(
      `%c[${name}] registered with DebugManager (v${version})`,
      "color: cyan; font-weight: bold;"
    );
  }

  function updateHUD() {
    let hud = document.getElementById("debug-hud");
    if (!hud) {
      hud = document.createElement("div");
      hud.id = "debug-hud";
      hud.style.position = "fixed";
      hud.style.bottom = "6px";
      hud.style.left = "6px";
      hud.style.background = "rgba(0,0,0,0.65)";
      hud.style.color = "#0ff";
      hud.style.fontSize = "10px";
      hud.style.fontFamily = "monospace";
      hud.style.padding = "4px 6px";
      hud.style.borderRadius = "4px";
      hud.style.zIndex = "999999";
      hud.style.pointerEvents = "none";
      document.body.appendChild(hud);
    }
    hud.innerHTML = Array.from(modules.entries())
      .map(([name, version]) => `${name}: ${version}`)
      .join("<br>");
  }

  function list() {
    console.table(
      Array.from(modules.entries()).map(([name, version]) => ({
        Module: name,
        Version: version,
      }))
    );
  }

  return {
    register,
    list,
  };
})();