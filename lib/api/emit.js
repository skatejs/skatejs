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
  'use strict';

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

  function emitAll(elem, name, opts) {
    var names = typeof name === 'string' ? name.split(' ') : name;
    return names.reduce(function (prev, curr) {
      if (!emitOne(elem, curr, opts)) {
        prev.push(curr);
      }
      return prev;
    }, []);
  }

  function emitFn(name, opts) {
    return function () {
      return emitAll(this, name, opts);
    };
  }

  module.exports = function (elem) {
    var name = arguments[1] === undefined ? {} : arguments[1];
    var opts = arguments[2] === undefined ? {} : arguments[2];

    return typeof elem === 'string' ? emitFn(elem, name) : emitAll(elem, name, opts);
  };
});