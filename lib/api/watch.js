(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../polyfill/mutation-observer'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../polyfill/mutation-observer'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.MutationObserver);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _polyfillMutationObserver) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _MutationObserver = _interopRequireDefault(_polyfillMutationObserver);

  module.exports = function (elem, callback) {
    var opts = arguments[2] === undefined ? {} : arguments[2];

    var observer = new _MutationObserver['default'](function (mutations) {
      mutations.forEach(function (mutation) {
        callback(mutation.addedNodes || [], mutation.removedNodes || []);
      });
    });

    observer.observe(elem, {
      childList: true,
      subtree: opts.subtree
    });

    return observer;
  };
});