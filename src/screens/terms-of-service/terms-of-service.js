// src/screens/terms-of-service/terms-of-service.js
// ===========================================================
// Terms of Service Screen - Refactored for Layout Control v2.7.7.11
// ===========================================================

import { stateStore } from "../../core/state-store.js";

function assetUrl(relPathFromThisFile) {
  return new URL(relPathFromThisFile, import.meta.url).href;
}

export async function createScreen({ mountEl, screenManager }) {
  const bgUrl = assetUrl("../../assets/global/backgrounds/tos.png");

  // Construct the screen structure dynamically (minimal inline styles)
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <section class="screen terms-of-service" data-screen="terms-of-service">
      <!-- Background -->
      <div class="screen-bg" aria-hidden="true"
        style="
          background-image:url('${bgUrl}');
        ">
      </div>

      <!-- Shell for title, scroll area, and button -->
      <div class="tos-shell">
        <!-- Title -->
        <header class="tos-header">
          <h1 class="tos-title">Terms of Service</h1>
        </header>

        <!-- Scrollable Text Box -->
        <div class="tos-scroll">
          <p>Welcome to VerseCraft. By using this app, you agree to abide by all terms and conditions set forth in this document. The purpose of this app is to provide an interactive storytelling experience and community platform for creative projects.</p>
          <p>We collect minimal user data to enhance your experience. You may not use this service to distribute harmful or unlawful content. All narrative material remains property of its respective creators.</p>
          <p>By continuing, you acknowledge these terms and consent to our policies. Thank you for being part of VerseCraft.</p>
        </div>

        <!-- Accept Button -->
        <div class="tos-actions">
          <button id="hbTosAccept" type="button" data-action="accept" aria-label="Accept Terms">
            Accept
          </button>
        </div>
      </div>
    </section>
  `;

  const el = wrapper.firstElementChild;

  // ===========================================================
  // Interaction Logic
  // ===========================================================
  function onClick(e) {
    const accept = e.target.closest("button[data-action='accept']");
    if (accept) {
      // Store acceptance to skip next time
      stateStore.set?.("tosAccepted", true);
      screenManager.go("main-menu");
      return;
    }
  }

  // ===========================================================
  // Lifecycle Hooks
  // ===========================================================
  return {
    mount() {
      mountEl.appendChild(el);
      el.addEventListener("click", onClick);

      // Remove any global inset padding — Terms screen controls layout itself
      el.style.paddingTop = "0";
      el.style.paddingBottom = "0";
      el.style.marginTop = "0";
      el.style.marginBottom = "0";
      el.style.overflow = "hidden";
    },
    unmount() {
      el.removeEventListener("click", onClick);
    },
  };
}
