import { screenManager } from './screen-manager.js';
import { inputLock } from './input-lock.js';
import { stateStore } from './state-store.js';

function showBootError(message) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div style="
      position:fixed; inset:0;
      background:#000; color:#fff;
      display:grid; place-items:center;
      padding:24px;
      font: 14px/1.45 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    ">
      <div style="max-width:820px; width:100%;">
        <div style="font-size:18px; margin-bottom:10px;">Boot error</div>
        <pre style="
          white-space:pre-wrap; word-break:break-word;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.12);
          padding:12px 14px;
          border-radius:12px;
          margin:0;
        ">${String(message || 'Unknown error')}</pre>
        <div style="opacity:0.75; margin-top:10px;">
          Check these paths exist exactly:<br/>
          • src/core/screen-manager.js<br/>
          • src/core/input-lock.js<br/>
          • src/core/state-store.js<br/>
          • src/screens/splash/splash.js
        </div>
      </div>
    </div>
  `;
}

window.addEventListener('error', (e) => {
  showBootError(e?.error?.stack || e?.message || String(e));
});

window.addEventListener('unhandledrejection', (e) => {
  const r = e?.reason;
  showBootError(r?.stack || String(r));
});

(async () => {
  try {
    inputLock.init();
    stateStore.init();

    await screenManager.init({
      mountId: 'app',
      initialScreen: 'splash' // ✅ default screen is splash (tap to start)
    });

    // Boot success flag (if you’re using the watchdog in index.html)
    window.__vcBooted = true;
  } catch (err) {
    showBootError(err?.stack || String(err));
  }
})();