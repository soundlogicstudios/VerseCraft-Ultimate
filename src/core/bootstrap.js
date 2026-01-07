import { screenManager } from './screen-manager.js';
import { inputLock } from './input-lock.js';
import { stateStore } from './state-store.js';

function hasDebugFlag() {
  try {
    const u = new URL(window.location.href);
    const v = u.searchParams.get('debug');
    return v === '1' || v === 'true';
  } catch {
    return false;
  }
}

function createDebugOverlay() {
  const root = document.getElementById('debug-overlay-root');
  if (!root) return null;

  const wrap = document.createElement('div');
  wrap.style.cssText = [
    'position:fixed',
    'left:10px',
    'right:10px',
    'top:10px',
    'z-index:999999',
    'pointer-events:auto',
    'font:12px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif'
  ].join(';');

  wrap.innerHTML = `
    <div style="
      background:rgba(0,0,0,0.65);
      border:1px solid rgba(255,255,255,0.18);
      border-radius:14px;
      padding:10px 12px;
      backdrop-filter: blur(6px);
      color:#fff;
    ">
      <div style="display:flex; gap:8px; align-items:center; justify-content:space-between;">
        <div style="font-weight:700; letter-spacing:0.2px;">VerseCraft Debug</div>
        <div style="display:flex; gap:8px;">
          <button id="vcDbgCopy" type="button" style="
            font:inherit; color:#fff;
            background:rgba(255,255,255,0.12);
            border:1px solid rgba(255,255,255,0.22);
            border-radius:10px;
            padding:6px 10px;
          ">Copy Report</button>
          <button id="vcDbgHide" type="button" style="
            font:inherit; color:#fff;
            background:rgba(255,255,255,0.08);
            border:1px solid rgba(255,255,255,0.18);
            border-radius:10px;
            padding:6px 10px;
          ">Hide</button>
        </div>
      </div>
      <div id="vcDbgBody" style="margin-top:8px; white-space:pre-wrap; word-break:break-word; opacity:0.95;"></div>
    </div>
  `;

  root.appendChild(wrap);

  const body = wrap.querySelector('#vcDbgBody');
  const btnCopy = wrap.querySelector('#vcDbgCopy');
  const btnHide = wrap.querySelector('#vcDbgHide');

  function render(reportText) {
    if (body) body.textContent = reportText;
  }

  async function copy(reportText) {
    try {
      await navigator.clipboard.writeText(reportText);
      if (btnCopy) btnCopy.textContent = 'Copied';
      setTimeout(() => { if (btnCopy) btnCopy.textContent = 'Copy Report'; }, 900);
    } catch {
      // iOS Safari clipboard can fail if not HTTPS or not a direct gesture
      if (btnCopy) btnCopy.textContent = 'Copy Failed';
      setTimeout(() => { if (btnCopy) btnCopy.textContent = 'Copy Report'; }, 1200);
    }
  }

  btnCopy?.addEventListener('click', () => {
    copy(window.__vcLastReport || '(no report yet)');
  });

  btnHide?.addEventListener('click', () => {
    wrap.style.display = 'none';
  });

  return { render };
}

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
          Add <code style="opacity:0.9;">?debug=1</code> to the URL for a copyable boot report.
        </div>
      </div>
    </div>
  `;
}

function buildReport(extra = '') {
  const base = document.querySelector('base')?.getAttribute('href') || '(none)';
  const url = window.location.href;
  const tosAccepted = String(!!stateStore.get?.('tosAccepted'));
  const currentScreen = screenManager.current || '(none)';

  const lines = [
    `URL: ${url}`,
    `base href: ${base}`,
    `current screen: ${currentScreen}`,
    `tosAccepted: ${tosAccepted}`,
    `userAgent: ${navigator.userAgent}`,
    extra ? `\n${extra}` : ''
  ].filter(Boolean);

  return lines.join('\n');
}

window.addEventListener('error', (e) => {
  showBootError(e?.error?.stack || e?.message || String(e));
});

window.addEventListener('unhandledrejection', (e) => {
  const r = e?.reason;
  showBootError(r?.stack || String(r));
});

(async () => {
  const debugEnabled = hasDebugFlag();
  const dbg = debugEnabled ? createDebugOverlay() : null;

  try {
    inputLock.init();
    stateStore.init();

    // IMPORTANT: Once ToS is accepted, user never sees splash or ToS again.
    const initialScreen = stateStore.get?.('tosAccepted') ? 'main-menu' : 'splash';

    // Patch screenManager.go to keep a tiny event log for debug reports.
    const origGo = screenManager.go.bind(screenManager);
    screenManager.go = async (screenId, params = {}) => {
      if (debugEnabled) {
        window.__vcLastReport = buildReport(`go(): ${screenId}`);
        dbg?.render?.(window.__vcLastReport);
      }
      return origGo(screenId, params);
    };

    await screenManager.init({
      mountId: 'app',
      initialScreen
    });

    window.__vcBooted = true;

    if (debugEnabled) {
      window.__vcLastReport = buildReport('boot: success');
      dbg?.render?.(window.__vcLastReport);
    }
  } catch (err) {
    if (debugEnabled) {
      window.__vcLastReport = buildReport(`boot: ERROR\n${err?.stack || String(err)}`);
      dbg?.render?.(window.__vcLastReport);
    }
    showBootError(err?.stack || String(err));
  }
})();
