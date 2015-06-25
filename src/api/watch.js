import maybeThis from '../util/maybe-this';
import MutationObserver from '../polyfill/mutation-observer';

// TODO: skate.watch() should not create a new observer if it doesn't have to.
// TODO: Should we allow the watching of attributes?
// TODO: Should we allow the watching of character data? If so, then the
// polyfill will need to support this.
export default maybeThis (function (elem, callback, opts = {}) {
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      callback.call(elem, mutation.addedNodes || [], mutation.removedNodes || []);
    });
  });

  observer.observe(elem, {
    childList: true,
    subtree: opts.subtree
  });

  return observer;
});
