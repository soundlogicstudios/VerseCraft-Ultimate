// src/screens/terms-of-service/terms-of-service.js
import { stateStore } from '../../core/state-store.js';

function assetUrl(relPathFromThisFile) {
  return new URL(relPathFromThisFile, import.meta.url).href;
}

const TERMS_TEXT = `VerseCraft Terms of Use
Effective Date: [Insert Date]

Welcome to VerseCraft! These Terms of Use (“Terms”) govern your use of the VerseCraft mobile app, website, and services (collectively, “Service”). By accessing or using the Service, you agree to these Terms.

1. Eligibility
• You must be at least 13 years old to use the Service.
• Users under 18 must have parental consent.

2. Account Registration
• You may need to create an account to access certain features.
• Keep your login credentials secure; you are responsible for all activity under your account.

3. User Content
• Users may submit stories, art, and other content.
• By submitting content, you grant VerseCraft a license to display and distribute it.

4. Prohibited Conduct
• No unlawful or abusive content.
• No hacking, exploitation, or interference.

5. Termination
• Accounts may be terminated for violations.

6. Disclaimers
• Service provided “as is.”

7. Governing Law
• Governed by applicable law.
`;

export async function createScreen({ mountEl, screenManager }) {
  const bgPrimary = assetUrl('../../assets/global/backgrounds/tos.png');
  const bgFallback = assetUrl('../../assets/global/backgrounds/tos-screen.png');

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <section class="screen terms-of-service"
      style="position:relative; width:100%; height:100%; overflow:hidden;">

      <!-- Background -->
      <img data-role="bg"
        style="
          position:absolute; inset:0;
          width:100%; height:100%;
          object-fit:cover;
          pointer-events:none;
        "
      />

      <!-- TERMS PANEL (Phase A) -->
      <div data-role="tos-panel"
        style="
          position:absolute;
          left:8%;
          right:8%;
          top:10%;        /* ⬆ moved upward */
          bottom:24%;
          padding:18px 18px;

          overflow:hidden;
          white-space:pre-wrap;

          background:rgba(0,0,0,0.82);   /* ⬅ black panel */
          color:rgba(255,255,255,0.95);  /* ⬅ white text */

          border-radius:16px;
          font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        ">
      </div>

      <!-- ACCEPT HITBOX -->
      <button data-action="accept"
        aria-label="Accept Terms"
        style="
          position:absolute;
          left:8%;
          right:8%;
          bottom:6%;
          height:14%;
          background:transparent;
          border:none;
        ">
      </button>
    </section>
  `;

  const el = wrapper.firstElementChild;
  const bgEl = el.querySelector('[data-role="bg"]');
  const panelEl = el.querySelector('[data-role="tos-panel]') || el.querySelector('[data-role="tos-panel"]');

  panelEl.textContent = TERMS_TEXT;

  let triedFallback = false;
  bgEl.onerror = () => {
    if (triedFallback) return;
    triedFallback = true;
    bgEl.src = bgFallback;
  };
  bgEl.src = bgPrimary;

  function onClick(e) {
    if (!e.target.closest('[data-action="accept"]')) return;
    stateStore.set?.('tosAccepted', true);
    screenManager.go('main-menu');
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
