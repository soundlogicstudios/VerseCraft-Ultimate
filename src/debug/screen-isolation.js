/**
 * VerseCraft Debug Screen Isolation Module
 * v2.7 – Ensures only active screen hitboxes are shown
 */

console.log("%c[ScreenIsolation] Loaded", "color: cyan; font-weight: bold;");

export const ScreenIsolation = (() => {
  const ACTIVE_CLASS = "active";
  const DEBUG_CLASS = "debug";
  const SCREEN_SELECTOR = "section[id^='screen-']";
  const HITBOX_SELECTOR = "button[id^='hb']";

  let currentScreen = null;

  function detectActiveScreen() {
    const active = document.querySelector(`${SCREEN_SELECTOR}.${ACTIVE_CLASS}`);
    currentScreen = active ? active.id : "(none)";
    return active;
  }

  function updateVisibility() {
    if (!document.body.classList.contains(DEBUG_CLASS)) return;

    const active = detectActiveScreen();
    const hitboxes = document.querySelectorAll(HITBOX_SELECTOR);

    hitboxes.forEach((hb) => {
      const parentSection = hb.closest(SCREEN_SELECTOR);
      if (!parentSection) return;

      if (parentSection === active) {
        hb.style.display = "block";
        hb.style.opacity = "1";
        hb.style.pointerEvents = "auto";
      } else {
        hb.style.display = "none";
        hb.style.opacity = "0.1";
        hb.style.pointerEvents = "none";
      }
    });

    console.log(
      `%c[ScreenIsolation] Active: ${currentScreen}`,
      "color: lime; font-weight: bold;"
    );
  }

  function monitorScreens() {
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains(DEBUG_CLASS)) updateVisibility();
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class"],
    });

    // Fallback timer (in case of animations or lazy transitions)
    setInterval(() => {
      if (document.body.classList.contains(DEBUG_CLASS)) updateVisibility();
    }, 1000);
  }

  function init() {
    detectActiveScreen();
    monitorScreens();
    console.log("%c[ScreenIsolation] Initialized", "color: yellow;");
  }

  return { init, updateVisibility };
})();