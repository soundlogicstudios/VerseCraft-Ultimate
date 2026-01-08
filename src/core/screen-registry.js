/**
 * screen-registry.js
 * Dynamically loads and registers all screen modules.
 */

export async function registerScreens(screenManager) {
  const screens = [
    'main-menu',
    'library',
    'character-global',
    'credits',
    'debug'
  ];

  for (const name of screens) {
    try {
      const module = await import(`../screens/${name}/${name}.js`);
      screenManager.register(name, module.default);
      console.log(`🧩 Screen loaded: ${name}`);
    } catch (err) {
      console.warn(`⚠️ Failed to load screen: ${name}`, err);
    }
  }
}
