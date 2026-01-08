/**
 * bootstrap.js
 * Handles initialization, dependency loading, and error safety.
 */

import { ScreenManager } from './screen-manager.js';
import { StateStore } from './state-store.js';
import { registerScreens } from './screen-registry.js';

export class Bootstrap {
  static async init() {
    try {
      console.log('🚀 VerseCraft Engine initializing...');

      await new Promise((resolve) => {
        if (document.readyState === 'complete' || document.readyState === 'interactive')
          resolve();
        else
          document.addEventListener('DOMContentLoaded', resolve);
      });

      const state = new StateStore();
      const screens = new ScreenManager(state);

      await registerScreens(screens);

      screens.load('main-menu');

      console.log('✅ VerseCraft successfully initialized.');
    } catch (err) {
      console.error('❌ Engine failed to initialize:', err);
      document.body.innerHTML = `<div style="color:red;padding:2em;font-family:sans-serif">
        <h2>VerseCraft Engine Error</h2>
        <p>${err.message}</p>
      </div>`;
    }
  }
}

Bootstrap.init();
