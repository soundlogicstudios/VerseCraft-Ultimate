/**
 * screen-registry.js
 * v2.7.8-UltimateLifecycleDiag
 * Dynamically loads and registers all screens safely.
 */

export async function registerScreens(screenManager) {
  const screens = [
    'splash',
    'terms-of-service',
    'main-menu',
    'library',
    'story',
    'settings',
    'character-global',
    'credits',
    'debug'
  ];

  for (const name of screens) {
    try {
      const module = await import(`../screens/${name}/${name}.js`);
      const factory = module?.createScreen || module?.default;

      if (typeof factory === 'function') {
        screenManager.register(name, factory);
        console.log(`🧩 Screen registered: ${name}`);
      } else {
        console.warn(`⚠️ ${name} has no valid export (createScreen or default).`);
      }
    } catch (err) {
      console.warn(`🚫 Failed to load or register screen: ${name}`, err);
    }
  }

  console.log('✅ Screen registration complete.');
}
