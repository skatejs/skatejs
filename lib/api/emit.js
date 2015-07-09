(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/maybe-this'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/maybe-this'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.maybeThis);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilMaybeThis) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _maybeThis = _interopRequireDefault(_utilMaybeThis);

  var CustomEvent = window.CustomEvent;

  if (CustomEvent) {
    try {
      new CustomEvent();
    } catch (e) {
      CustomEvent = undefined;
    }
  }

  function createCustomEvent(name, opts) {
    if (CustomEvent) {
      return new CustomEvent(name, opts);
    }

    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
    return e;
  }

  function emitOne(elem, name, opts) {
    /* jshint expr: true */
    opts.bubbles === undefined && (opts.bubbles = true);
    opts.cancelable === undefined && (opts.cancelable = true);
    return elem.dispatchEvent(createCustomEvent(name, opts));
  }

  module.exports = (0, _maybeThis['default'])(function (elem, name) {
    var opts = arguments[2] === undefined ? {} : arguments[2];

    var names = typeof name === 'string' ? name.split(' ') : name;
    return names.reduce(function (prev, curr) {
      if (!emitOne(elem, curr, opts)) {
        prev.push(curr);
      }
      return prev;
    }, []);
  });
});