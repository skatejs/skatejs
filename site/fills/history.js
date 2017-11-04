import { emit } from 'skatejs';

const oldPushState = window.history.pushState;
const oldReplaceState = window.history.replaceState;
window.history.pushState = function(...args) {
  oldPushState.call(this, ...args);
  emit(window, 'pushstate');
};
window.history.replaceState = function(...args) {
  oldReplaceState.call(this, ...args);
  emit(window, 'replacestate');
};
