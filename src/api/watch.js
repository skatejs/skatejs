import MutationObserver from '../polyfill/mutation-observer';

export default function (elem, callback) {
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      callback(mutation.addedNodes || [], mutation.removedNodes || []);
    });
  });

  observer.observe(elem, {
    childList: true
  });

  return observer;
}
