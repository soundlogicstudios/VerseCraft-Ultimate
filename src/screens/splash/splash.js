// src/screens/splash/splash.js
import { stateStore } from '../../core/state-store.js';

function assetUrl(relPathFromThisFile) {
  return new URL(relPathFromThisFile, import.meta.url).href;
}

export async function createScreen({ mountEl, screenManager }) {
  // IMPORTANT: this resolves relative to this file:
  // src/screens/splash/splash.js -> ../../assets/global/backgrounds/splash.png
  const bgUrl = assetUrl('../../assets/global/backgrounds/splash.png');

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <section class="screen splash" data-screen="splash" style="position:relative; width:100%; height:100%;">
      <!-- Background -->
      <div class="screen-bg" aria-hidden="true"
        style="
          position:absolute; inset:0;
          background-image:url('${bgUrl}');
          background-size:cover;
          background-position:center;
          background-repeat:no-repeat;
        ">
      </div>

      <!-- Optional: Transparent hitbox for Tap to Start -->
      <button type="button" data-action="tap-to-start" aria-label="Tap to Start"
        style="
          position:absolute;
          left:0; right:0;
          bottom:0;
          height:22%;
          background:transparent;
          border:0;
          padding:0;
          margin:0;
          cursor:pointer;
          -webkit-tap-highlight-color: transparent;
        ">
      </button>
    </section>
  `;

  const el = wrapper.firstElementChild;

  function onTap() {
    const accepted = !!stateStore.get?.('tosAccepted');
    if (accepted) {
      screenManager.go('main-menu');
    } else {
      screenManager.go('terms-of-service');
    }
  }

  return {
    mount() {
      mountEl.appendChild(el);

      // Whole screen taps also work (nice for testing)
      el.addEventListener('click', (e) => {
        const hit = e.target.closest('button[data-action="tap-to-start"]');
        if (hit) onTap();
      });

      // Fallback: tapping anywhere triggers (comment out if you only want button area)
      el.addEventListener('click', (e) => {
        if (e.target.closest('button[data-action="tap-to-start"]')) return;
        onTap();
      });
    },
    unmount() {
      // no-op (listeners are on element; element is destroyed by screenManager hard-clear)
    }
  };
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
