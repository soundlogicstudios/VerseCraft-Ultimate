export const inputLock = {
  init() {
    // allow scrolling ONLY inside regions explicitly marked as data-scroll="true"
    document.addEventListener('touchmove', (e) => {
      const t = e.target;
      const scrollHost = t && t.closest ? t.closest('[data-scroll="true"]') : null;
      if (!scrollHost) e.preventDefault();
    }, { passive: false });
  }
};
