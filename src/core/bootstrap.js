import { screenManager } from './screen-manager.js';
import { inputLock } from './input-lock.js';
import { stateStore } from './state-store.js';

function showBootError(message) {
  try {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
      <
