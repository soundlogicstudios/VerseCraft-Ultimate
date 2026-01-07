// Splash screen module
// IMPORTANT: Do not import CSS from here. GitHub Pages will treat CSS as a JS module request and fail.

export async function createScreen({ mountEl, screenManager }) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
<section class="screen splash" data-screen="splash">
  <div class="screen-bg" aria-hidden="true"></div>

  <!-- Invisible full-screen hitbox (tweak via CSS later) -->
  <button id="hbSplashStart" class="hitbox" type="button" aria-label="Tap to start"></button>
</section>
`;

  const el = wrapper.firstElementChild;

  function onClick(e) {
    const btn = e.target.closest('#hbSplashStart');
    if (!btn) return;
    // Default funnel: Splash -> Terms of Service
    screenManager.go('terms-of-service');
  }

  return {
    mount() {
      mountEl.appendChild(el);
      el.addEventListener('click', onClick);
      el.addEventListener('touchend', onClick, { passive: true });
    },
    unmount() {
      el.removeEventListener('click', onClick);
      el.removeEventListener('touchend', onClick);
    }
  };
}
