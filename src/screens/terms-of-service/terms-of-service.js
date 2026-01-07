// src/screens/terms-of-service/terms-of-service.js
import { stateStore } from '../../core/state-store.js';

function assetUrl(relPathFromThisFile) {
  return new URL(relPathFromThisFile, import.meta.url).href;
}

// PHASE A: render Terms text in center panel (NOT scrollable yet)
const TERMS_TEXT = `VerseCraft Terms of Use
Effective Date: [Insert Date]

Welcome to VerseCraft! These Terms of Use (“Terms”) govern your use of the VerseCraft mobile app, website, and services (collectively, “Service”). By accessing or using the Service, you agree to these Terms.

1. Eligibility
• You must be at least 13 years old to use the Service.
• Users under 18 must have parental consent.

2. Account Registration
• You may need to create an account to access certain features.
• Keep your login credentials secure; you are responsible for all activity under your account.
• Notify VerseCraft immediately of any unauthorized use.

3. User Content
• Users may submit stories, art, and other content (“User Content”).
• By submitting User Content, you grant VerseCraft a worldwide, royalty-free, sublicensable, transferable license to display, distribute, modify, and monetize that content within the Service.
• You retain ownership of your original content, but you represent that you have all necessary rights to grant this license.

4. Prohibited Conduct
You agree not to:
• Post content that is unlawful, obscene, or infringes third-party rights.
• Attempt to hack or interfere with the Service.
• Use the Service for commercial purposes without explicit permission.

5. Intellectual Property
• All app content, branding, and software code is © [Year] VerseCraft LLC.
• You may not copy, modify, or redistribute VerseCraft intellectual property without permission.

6. Subscriptions & Payments
• Paid content or subscriptions are processed through the app stores (iOS/Android).
• Refunds are subject to store policies.

7. Termination
• VerseCraft may suspend or terminate accounts for violations of these Terms.
• Upon termination, your access to paid content or user submissions may be revoked.

8. Disclaimers
• The Service is provided “as is.”
• VerseCraft is not responsible for technical errors, downtime, or user disputes.

9. Limitation of Liability
• To the maximum extent allowed by law, VerseCraft is not liable for damages arising from use of the Service.

10. Governing Law
• These Terms are governed by the laws of [State/Country].

Contact: [support@versecraft.com]
`;

export async function createScreen({ mountEl, screenManager }) {
  // Try primary path first, fallback to tos-screen.png if needed.
  const bgPrimary = assetUrl('../../assets/global/backgrounds/tos.png');
  const bgFallback = assetUrl('../../assets/global/backgrounds/tos-screen.png');

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <section class="screen terms-of-service" data-screen="terms-of-service"
      style="position:relative; width:100%; height:100%; overflow:hidden;">

      <!-- Background image (img so we can fallback on error) -->
      <img data-role="bg"
        alt=""
        style="
          position:absolute; inset:0;
          width:100%; height:100%;
          object-fit:cover;
          object-position:center;
          user-select:none;
          -webkit-user-drag:none;
          pointer-events:none;
        "
      />

      <!-- Center panel text (Phase A: NOT scrollable) -->
      <div data-role="tos-panel"
        style="
          position:absolute;
          left:10%;
          right:10%;
          top:18%;
          bottom:26%;
          padding:14px 14px;
          overflow:hidden; /* Phase A: no scroll */
          white-space:pre-wrap;
          word-break:break-word;

          /* readable overlay while still letting the art show */
          background:rgba(255,255,255,0.78);
          border-radius:14px;

          font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color: rgba(0,0,0,0.88);
        "></div>

      <!-- ACCEPT hitbox (transparent, matches your existing flow) -->
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
    </section>
  `;

  const el = wrapper.firstElementChild;
  const bgEl = el.querySelector('[data-role="bg"]');
  const panelEl = el.querySelector('[data-role="tos-panel"]');

  // Set Terms text
  panelEl.textContent = TERMS_TEXT;

  // Background with fallback
  let triedFallback = false;
  function setBg(src) {
    bgEl.src = src;
  }
  function onBgError() {
    if (triedFallback) return;
    triedFallback = true;
    setBg(bgFallback);
  }
  bgEl.addEventListener('error', onBgError);
  setBg(bgPrimary);

  function onClick(e) {
    const accept = e.target.closest('button[data-action="accept"]');
    if (!accept) return;

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
      bgEl.removeEventListener('error', onBgError);
      el.remove();
    }
  };
}
