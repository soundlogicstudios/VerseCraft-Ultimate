// VerseCraft v0.0.03-DEBUG1
// Stable build with Legacy Debug Wrapper + Diagnostic

import { initRouter, go } from "./router.js";
import { bindHitboxes } from "./input.js";
import { initDebug } from "./debug.js";
import "./debug/legacy-wrapper.js"; // Safe modular bridge

// ==============================
// Terms of Service content
// ==============================
const TERMS_OF_SERVICE_TEXT = `
<h2>VerseCraft Terms of Use</h2>
<p><strong>Effective Date:</strong> [Insert Date]</p>
<p>Welcome to VerseCraft! These Terms of Use (“Terms”) govern your use of the VerseCraft mobile app, website, and services (collectively, “Service”). By accessing or using the Service, you agree to these Terms.</p>
<h3>1. Eligibility</h3>
<ul><li>You must be at least 13 years old to use the Service.</li><li>Users under 18 must have parental consent.</li></ul>
<h3>2. Account Registration</h3>
<ul><li>You may need to create an account to access certain features.</li><li>Keep your login credentials secure; you are responsible for all activity under your account.</li><li>Notify VerseCraft immediately of any unauthorized use.</li></ul>
<h3>3. User Content</h3>
<ul><li>Users may submit stories, art, and other content (“User Content”).</li><li>By submitting User Content, you grant VerseCraft a worldwide, royalty-free, sublicensable, transferable license to display, distribute, modify, and monetize that content within the Service.</li><li>You retain ownership of your original content.</li></ul>
<h3>4. Prohibited Conduct</h3>
<ul><li>Post unlawful or infringing content.</li><li>Attempt to hack or interfere with the Service.</li><li>Use the Service commercially without permission.</li></ul>
<h3>5. Intellectual Property</h3>
<ul><li>All app content, branding, and software code is © [Year] VerseCraft LLC.</li></ul>
<h3>6. Subscriptions & Payments</h3>
<ul><li>Paid content is processed through platform app stores.</li></ul>
<h3>7. Termination</h3>
<ul><li>Accounts may be suspended for violations.</li></ul>
<h3>8. Disclaimers</h3>
<ul><li>The Service is provided “as is.”</li></ul>
<h3>9. Limitation of Liability</h3>
<ul><li>VerseCraft is not liable for damages to the extent permitted by law.</li></ul>
<h3>10. Governing Law</h3>
<ul><li>Governed by the laws of [State/Country].</li></ul>
<p><strong>Contact:</strong> support@versecraft.com</p>
`;

const VERSION = "0.0.03-DEBUG1";

function setFooter() {
  const el = document.getElementById("footer");
  if (!el) return;
  const btn = document.getElementById("btnDebug");
  el.textContent = `VerseCraft v${VERSION} • `;
  if (btn) el.appendChild(btn);
}

function boot() {
  setFooter();
  initRouter();

  bindHitboxes({
    hbSplashTap: () => {
      const tosText = document.getElementById("tosText");
      if (tosText && tosText.innerHTML.trim() === "") {
        tosText.innerHTML = TERMS_OF_SERVICE_TEXT;
      }
      go("tos");
    },
    hbTosAccept: () => go("menu"),
    hbMenuLoad: () => go("library"),
    hbMenuSettings: () => go("settings"),
    hbSettingsBack: () => go("menu"),
    hbSettingsClear: () => alert("Clear Save (placeholder)"),
    hbSettingsTheme: () => alert("Theme (placeholder)"),
    hbLibraryMenu: () => go("menu"),
    hbLibraryStore: () => alert("Store: Coming Soon"),
    hbRow0: () => go("story"),
    hbRow1: () => go("story"),
    hbRow2: () => go("story"),
    hbStoryBack: () => go("library"),
  });

  initDebug(); // start working debugger
  go("splash"); // default start
}

window.addEventListener("DOMContentLoaded", boot, { once: true });
