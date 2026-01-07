import { screenManager } from './screen-manager.js';
import { inputLock } from './input-lock.js';
import { stateStore } from './state-store.js';

inputLock.init();
stateStore.init();

screenManager.init({
  mountId: 'app',
  initialScreen: 'splash'
});
