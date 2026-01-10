/**
 * screen-registry.js
 * v2.7.8-UltimateLifecycleDiag
 * Robust registration and diagnostics for all screens
 */

export async function registerScreens(screenManager) {
  console.log("🟠 [REGISTRY] Beginning screen registration...");

  const screens = [
    "splash",
    "terms-of-service",
    "main-menu",
    "library",
    "story",
    "settings",
    "character-global",
    "credits",
    "debug"
  ];

  let count = 0;

  for (const name of screens) {
    const path = `../screens/${name}/${name}.js`;
    try {
      const mod = await import(path);
      const factory = mod?.createScreen || mod?.default;
      if (typeof factory === "function") {
        screenManager.register(name, factory);
        console.log(`🧩 [REGISTRY] Registered screen: ${name}`);
        count++;
      } else {
        console.warn(`⚠️ [REGISTRY] Invalid export for ${name}`);
      }
    } catch (err) {
      console.error(`🚫 [REGISTRY] Failed loading ${name}`, err);
    }
  }

  console.log(`✅ [REGISTRY] Registered ${count}/${screens.length} screens`);
}
