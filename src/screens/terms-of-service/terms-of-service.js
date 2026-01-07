export async function createScreen({ mountEl, screenManager }) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <section class="screen terms-of-service" data-screen="terms-of-service">
      <div class="screen-bg" aria-hidden="true"></div>

      <div class="tos-shell">
        <header class="tos-header">
          <h1 class="tos-title">Terms of Service</h1>
        </header>

        <div class="tos-scroll" role="region" aria-label="Terms of Service Text">
          <div class="tos-text" id="tosText">
            <p><strong>VerseCraft Terms of Use</strong></p>
            <p><strong>Effective Date:</strong> [Insert Date]</p>
            <p>Welcome to VerseCraft! These Terms of Use (“Terms”) govern your use of the VerseCraft mobile app, website, and services (collectively, “Service”). By accessing or using the Service, you agree to these Terms.</p>

            <h2>1. Eligibility</h2>
            <ul>
              <li>You must be at least 13 years old to use the Service.</li>
              <li>Users under 18 must have parental consent.</li>
            </ul>

            <h2>2. Account Registration</h2>
            <ul>
              <li>You may need to create an account to access certain features.</li>
              <li>Keep your login credentials secure; you are responsible for all activity under your account.</li>
              <li>Notify VerseCraft immediately of any unauthorized use.</li>
            </ul>

            <h2>3. User Content</h2>
            <ul>
              <li>Users may submit stories, art, and other content (“User Content”).</li>
              <li>By submitting User Content, you grant VerseCraft a worldwide, royalty-free, sublicensable, transferable license to display, distribute, modify, and monetize that content within the Service.</li>
              <li>You retain ownership of your original content, but you represent that you have all necessary rights to grant this license.</li>
            </ul>

            <h2>4. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Post content that is unlawful, obscene, or infringes third-party rights.</li>
              <li>Attempt to hack or interfere with the Service.</li>
              <li>Use the Service for commercial purposes without explicit permission.</li>
            </ul>

            <h2>5. Intellectual Property</h2>
            <ul>
              <li>All app content, branding, and software code is © [Year] VerseCraft LLC.</li>
              <li>You may not copy, modify, or redistribute VerseCraft intellectual property without permission.</li>
            </ul>

            <h2>6. Subscriptions &amp; Payments</h2>
            <ul>
              <li>Paid content or subscriptions are processed through the app stores (iOS/Android).</li>
              <li>Refunds are subject to store policies.</li>
            </ul>

            <h2>7. Termination</h2>
            <ul>
              <li>VerseCraft may suspend or terminate accounts for violations of these Terms.</li>
              <li>Upon termination, your access to paid content or user submissions may be revoked.</li>
            </ul>

            <h2>8. Disclaimers</h2>
            <ul>
              <li>The Service is provided “as is.”</li>
              <li>VerseCraft is not responsible for technical errors, downtime, or user disputes.</li>
            </ul>

            <h2>9. Limitation of Liability</h2>
            <p>To the maximum extent allowed by law, VerseCraft is not liable for damages arising from use of the Service.</p>

            <h2>10. Governing Law</h2>
            <p>These Terms are governed by the laws of [State/Country].</p>

            <p><strong>Contact:</strong> [support@versecraft.com]</p>
          </div>
        </div>

        <div class="tos-actions">
          <button type="button" class="tos-accept" data-action="accept">Accept</button>
        </div>
      </div>
    </section>
  `;

  const el = wrapper.firstElementChild;

  function onClick(e) {
    const accept = e.target.closest('button[data-action="accept"]');
    if (!accept) return;
    // After accept, go to main menu (change ID to your real menu screen id)
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
