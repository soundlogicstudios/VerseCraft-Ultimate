import './character-global.css';

export async function createScreen({ mountEl, screenManager }) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<section class="screen character-global" data-screen="character-global">
  <div class="screen-bg" aria-hidden="true"></div>
  <div class="screen-ui">
    <h1 class="screen-title">Character Global</h1>
    <p class="screen-note">placeholder screen. replace with pre-rendered background + hitboxes.</p>
    <div class="screen-actions">
      <button type="button" data-action="next">next</button>
    </div>
  </div>
</section>
`;
  const el = wrapper.firstElementChild;

  function onClick(e) {
    const btn = e.target.closest('button[data-action="next"]');
    if (!btn) return;
    screenManager.go('settings');
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
