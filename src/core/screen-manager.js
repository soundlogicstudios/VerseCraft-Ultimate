/**
 * screen-manager.js
 * VerseCraft Ultimate v2.7.9 - Full Screen Lifecycle + Debug Integration
 *
 * Handles dynamic screen creation, transitions, teardown, and scroll-locking.
 * Emits debug events to the Ultimate Debug Suite (DebugManager).
 */

import { SCREEN_IDS } from "./constants.js";

export class ScreenManager {
  constructor() {
    this.currentScreen = null;
    this.activeInstance = null;
    this.appRoot = document.getElementById("app");

    if (!this.appRoot) {
      console.error("[ScreenManager] Fatal: #app element missing.");
    } else {
      console.info("[ScreenManager] Initialized.");
    }
  }

  /**
   * Dynamically import and mount a new screen
   * @param {string} screenId
   */
  async go(screenId) {
    try {
      console.group(`[ScreenManager] Switching to ${screenId}`);

      // Prevent double loading the same screen
      if (this.currentScreen === screenId) {
        console.info(`[ScreenManager] Screen "${screenId}" is already active.`);
        console.groupEnd();
        return;
      }

      // Unmount the previous screen cleanly
      if (this.activeInstance && typeof this.activeInstance.unmount === "function") {
        console.info(`[ScreenManager] Unmounting screen: ${this.currentScreen}`);
        try {
          this.activeInstance.unmount();
        } catch (err) {
          console.warn("[ScreenManager] Error during unmount:", err);
        }
        this.appRoot.innerHTML = ""; // clear DOM for next screen
      }

      this.currentScreen = screenId;

      // 🔧 Dispatch lifecycle event for DebugManager
      window.dispatchEvent(
        new CustomEvent("screenChanged", {
          detail: { id: screenId },
        })
      );

      // Apply scroll lock by default
      document.body.style.overflow = "hidden";

      // Load target screen
      const module = await import(`./screens/${screenId}/${screenId}.js`);
      if (!module.createScreen) {
        throw new Error(`Screen "${screenId}" missing createScreen() export.`);
      }

      // Create and mount new screen instance
      const screen = await module.createScreen({
        mountEl: this.appRoot,
        screenManager: this,
      });

      if (screen && typeof screen.mount === "function") {
        console.info(`[ScreenManager] Mounting screen: ${screenId}`);
        screen.mount();
        this.activeInstance = screen;
      } else {
        throw new Error(`Screen "${screenId}" is invalid or missing mount().`);
      }

      console.groupEnd();
    } catch (error) {
      console.error("[ScreenManager] Failed to load screen:", error);
      console.groupEnd();

      // Optional: route to fallback splash screen
      if (screenId !== SCREEN_IDS.SPLASH) {
        console.warn("[ScreenManager] Attempting fallback to splash screen...");
        this.go(SCREEN_IDS.SPLASH);
      }
    }
  }

  /**
   * Force-refresh the current screen (for debug use or soft reloads)
   */
  async reload() {
    if (!this.currentScreen) return;
    const screenId = this.currentScreen;
    console.info(`[ScreenManager] Reloading ${screenId}...`);
    await this.go(screenId);
  }

  /**
   * Soft transition to another screen with fade (optional cosmetic effect)
   * This can be extended later to add animations.
   */
  async transition(screenId) {
    const root = this.appRoot;
    if (!root) return;

    root.style.opacity = "0";
    await new Promise((resolve) => setTimeout(resolve, 150));
    await this.go(screenId);
    await new Promise((resolve) => setTimeout(resolve, 100));
    root.style.opacity = "1";
  }

  /**
   * Returns the currently active screen ID
   * @returns {string|null}
   */
  getActiveScreen() {
    return this.currentScreen;
  }
}

// Singleton export
export const screenManager = new ScreenManager();

// Debug log
console.info("[ScreenManager] Ready and awaiting first screen load.");
