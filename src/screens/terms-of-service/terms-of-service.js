/**
 * terms-of-service.js
 * v2.7.8-UltimateLifecycleDiag
 * Scroll-locked and frame-safe full replacement
 */

import { stateStore } from "../../core/state-store.js";

function assetUrl(relPath) {
  return new URL(relPath, import.meta.url).href;
}

export async function createScreen({ mountEl, screenManager }) {
  const bgUrl = assetUrl("../../assets/global/backgrounds/tos.png");

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <section class="screen terms-of-service" data-screen="terms-of-service" style="position:relative;overflow:hidden;">
      <div class="screen-bg" aria-hidden="true" 
           style="background:url('${bgUrl}') center/cover no-repeat;inset:0;position:absolute;"></div>

      <div class="tos-shell" style="position:relative;z-index:1;height:100%;display:flex;flex-direction:column;justify-content:space-between;">
        <header class="tos-header" style="text-align:center;margin-top:5vh;">
          <h1 class="tos-title">Terms of Service</h1>
        </header>

        <div class="tos-scroll" style="flex:1 1 auto;overflow:auto;-webkit-overflow-scrolling:touch;padding:2vh 5vw;background:rgba(0,0,0,0.45);margin:2vh auto;width:85%;border-radius:10px;">
          <p>Welcome to VerseCraft. By using this app, you agree to abide by all terms and conditions set forth in this document.</p>
          <p>The purpose of this app is to provide an interactive storytelling experience and community platform for creative projects.</p>
          <p>We collect minimal user data to enhance your experience. By continuing, you acknowledge these terms and consent to our policies.</p>
        </div>

        <div class="tos-actions" style="text-align:center;margin-bottom:5vh;">
          <button type="button" data-action="accept" id="hbTosAccept"
                  style="padding:1em 2em;border:none;border-radius:10px;background:rgba(255,255,255,0.1);color:#e8dcb0;font-family:Cinzel;font-size:1em;cursor:pointer;">
            Accept
          </button>
        </div>
      </div>
    </section>
  `;

  const el = wrapper.firstElementChild;

  const onClick = (e) => {
    const accept = e.target.closest("button[data-action='accept']");
    if (accept) {
      stateStore.set?.("tosAccepted", true);
      screenManager.go("main-menu");
    }
  };

  const lockScroll = () => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  };
  const unlockScroll = () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };

  return {
    mount() {
      mountEl.appendChild(el);
      el.addEventListener("click", onClick);
      lockScroll();
      console.log("✅ [TOS] Mounted and scroll locked");
    },
    unmount() {
      el.removeEventListener("click", onClick);
      unlockScroll();
      console.log("🔹 [TOS] Unmounted and scroll unlocked");
    }
  };
}
