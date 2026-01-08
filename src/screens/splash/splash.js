// src/screens/splash/splash.js
function assetUrl(relPathFromThisFile) {
  return new URL(relPathFromThisFile, import.meta.url).href;
}

export async function createScreen({ mountEl, screenManager }) {
  // Path from this file:
  // src/screens/splash/splash.js -> ../../assets/global/backgrounds/splash.png
  const bgUrl = assetUrl('../../assets/global/backgrounds/splash.png');

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <section data-screen="splash"
      style="position:relative; width:100%; height:100%;">

      <div aria-hidden="true"
        style="
          position:absolute; inset:0;
          background-image:url('${bgUrl}');
          background-size:cover;
          background-position:center;
          background-repeat:no-repeat;
        "></div>

      <!-- Big tap zone at bottom -->
      <button type="button" data-action="tap"
        aria-label="Tap to Start"
        style="
          position:absolute; left:0; right:0; bottom:0;
          height:22%;
          background:transparent; border:0; padding:0; margin:0;
          -webkit-tap-highlight-color: transparent;
        "></button>

      <!-- Tiny visible proof marker (delete later) -->
      <div style="
        position:absolute; left:10px; top:10px;
        padding:6px 10px; border-radius:10px;
        background:rgba(0,0,0,0.45);
        color:#fff; font: 12px/1.2 system-ui;
      ">SPLASH LOADED</div>
    </section>
  `;

  const el = wrapper.firstElementChild;

  function onClick(e) {
    const hit = e.target.closest('button[data-action="tap"]');
    if (!hit) return;
    screenManager.go('terms-of-service');
  }

  return {
    mount() {
      mountEl.appendChild(el);
      el.addEventListener('click', onClick);
    },
    unmount() {
      el.removeEventListener('click', onClick);
      el.remove();
    }
  };
}
