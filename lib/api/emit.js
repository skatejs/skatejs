(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.unknown = mod.exports;
  }
})(this, function (exports, module) {
  /* jshint expr: true */
  'use strict';

  function emit(name, opts) {
    var e = document.createEvent('CustomEvent');
    opts.bubbles === undefined && (opts.bubbles = true);
    opts.cancelable === undefined && (opts.cancelable = true);
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
    return this.dispatchEvent(e);
  }

  module.exports = function (elem, name) {
    var opts = arguments[2] === undefined ? {} : arguments[2];

    (name.split && name.split(' ') || []).forEach(emit.bind(elem, name, opts));
    return this;
  };
});