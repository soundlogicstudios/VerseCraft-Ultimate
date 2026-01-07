// src/screens/terms-of-service/terms-of-service.js
import { stateStore } from '../../core/state-store.js';

function assetUrl(relPathFromThisFile) {
  return new URL(relPathFromThisFile, import.meta.url).href;
}

export async function createScreen({ mountEl, screenManager }) {
  const bgUrl = assetUrl('../../assets/global/backgrounds/tos.png');

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <section class="screen terms-of-service" data-screen="terms-of-service"
      style="position:relative; width:100%; height:100%;">

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

      <!-- ACCEPT hitbox (transparent) -->
      <button type="button" data-action="accept" aria-label="Accept Terms of Service"
        style="
          position:absolute;
          left:8%;
          right:8%;
          bottom:6%;
          height:14%;
          background:transparent;
          border:0;
          padding:0;
          margin:0;
          cursor:pointer;
          -webkit-tap-highlight-color: transparent;
        ">
      </button>

      <!-- Optional: Back / Decline hitbox (disabled for now) -->
      <!--
      <button type="button" data-action="back" aria-label="Back"
        style="position:absolute; left:3%; top:3%; width:20%; height:10%; background:transparent; border:0;">
      </button>
      -->
    </section>
  `;

  const el = wrapper.firstElementChild;

  function onClick(e) {
    const accept = e.target.closest('button[data-action="accept"]');
    if (accept) {
      // Persist the flag so Splash/ToS never appear again
      stateStore.set?.('tosAccepted', true);

      // Route to menu (or login later)
      screenManager.go('main-menu');
      return;
    }

    const back = e.target.closest('button[data-action="back"]');
    if (back) {
      screenManager.go('splash');
    }
  }

  return {
    mount() {
      mountEl.appendChild(el);
      el.addEventListener('click', onClick);
    },
    unmount() {
      el.removeEventListener('click', onClick);
    }
  };
}
