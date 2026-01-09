/**
 * screen-registry.js
 * Dynamically loads and registers all screens.
 * v2.7.8-UltimateLifecycleDiag prep
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
      screenManager.register(name, module.createScreen);
      console.log(`🧩 Screen loaded: ${name}`);
    } catch (err) {
      console.warn(`⚠️ Failed to load screen: ${name}`, err);
    }
  }
}
