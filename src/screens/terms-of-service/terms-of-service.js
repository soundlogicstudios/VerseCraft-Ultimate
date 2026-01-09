// src/screens/terms-of-service/terms-of-service.js
// ===========================================================
// Terms of Service Screen – Full Replacement v2.7.7.12
// ===========================================================

import { stateStore } from "../../core/state-store.js";

function assetUrl(relPathFromThisFile) {
  return new URL(relPathFromThisFile, import.meta.url).href;
}

export async function createScreen({ mountEl, screenManager }) {
  const bgUrl = assetUrl("../../assets/global/backgrounds/tos.png");

  // ===========================================================
  // 1. Build Markup
  // ===========================================================
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <section class="screen terms-of-service" data-screen="terms-of-service">
      <!-- Background -->
      <div class="screen-bg" aria-hidden="true"
        style="background-image:url('${bgUrl}');">
      </div>

      <!-- Shell -->
      <div class="tos-shell">
        <!-- Header -->
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
  // 2. Interaction Logic
  // ===========================================================
  function onClick(e) {
    const accept = e.target.closest("button[data-action='accept']");
    if (accept) {
      stateStore.set?.("tosAccepted", true);
      screenManager.go("main-menu");
      return;
    }
  }

  // ===========================================================
  // 3. Scroll Lock Utilities
  // ===========================================================
  function lockScroll() {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  // ===========================================================
  // 4. Lifecycle Hooks
  // ===========================================================
  return {
    mount() {
      mountEl.appendChild(el);
      el.addEventListener("click", onClick);

      // Neutralize global safe-area insets
      el.style.paddingTop = "0";
      el.style.paddingBottom = "0";
      el.style.marginTop = "0";
      el.style.marginBottom = "0";
      el.style.overflow = "hidden";

      // Lock the viewport scroll for this screen
      lockScroll();
    },

    unmount() {
      el.removeEventListener("click", onClick);
      // Restore normal scroll
      unlockScroll();
    },
  };
}
