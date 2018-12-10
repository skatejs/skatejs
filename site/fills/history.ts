const oldPushState = window.history.pushState;
const oldReplaceState = window.history.replaceState;
window.history.pushState = function(...args) {
  oldPushState.call(this, ...args);
  window.dispatchEvent(new Event('pushstate'));
};
window.history.replaceState = function(...args) {
  oldReplaceState.call(this, ...args);
  window.dispatchEvent(new Event('replacestate'));
};
