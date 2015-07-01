(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../util/maybe-this"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../util/maybe-this"));
  }
})(function (exports, module, _utilMaybeThis) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var maybeThis = _interopRequire(_utilMaybeThis);

  var MutationObserver = window.MutationObserver;

  // TODO: skate.watch() should not create a new observer if it doesn't have to.
  // TODO: Should we allow the watching of attributes?
  // TODO: Should we allow the watching of character data? If so, then the
  // polyfill will need to support this.
  module.exports = maybeThis(function (elem, callback) {
    var opts = arguments[2] === undefined ? {} : arguments[2];

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
});