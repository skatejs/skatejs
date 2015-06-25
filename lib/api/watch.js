(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/maybe-this', '../polyfill/mutation-observer'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/maybe-this'), require('../polyfill/mutation-observer'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.maybeThis, global.MutationObserver);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilMaybeThis, _polyfillMutationObserver) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _maybeThis = _interopRequireDefault(_utilMaybeThis);

  var _MutationObserver = _interopRequireDefault(_polyfillMutationObserver);

  // TODO: skate.watch() should not create a new observer if it doesn't have to.
  // TODO: Should we allow the watching of attributes?
  // TODO: Should we allow the watching of character data? If so, then the
  // polyfill will need to support this.
  module.exports = (0, _maybeThis['default'])(function (elem, callback) {
    var opts = arguments[2] === undefined ? {} : arguments[2];

    var observer = new _MutationObserver['default'](function (mutations) {
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
});