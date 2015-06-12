import MutationObserver from '../polyfill/mutation-observer';

export default function (elem, callback, opts) {
  var opts = opts || {};
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      callback(mutation.addedNodes || [], mutation.removedNodes || []);
    });
  });

  if (opts.childList === undefined) {
    opts.childList = true;
  }

  observer.observe(elem, opts);
  return observer;
}
