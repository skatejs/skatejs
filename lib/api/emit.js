(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/element-contains'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/element-contains'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.utilElementContains);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilElementContains) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _utilElementContains2 = _interopRequireDefault(_utilElementContains);

  var CustomEvent = window.CustomEvent;
  var hasBubbleOnDetachedElements = false;

  // Detect support for using the CustomElement constructor.
  if (CustomEvent) {
    try {
      new CustomEvent();
    } catch (e) {
      CustomEvent = undefined;
    }
  }

  // Common way for constructing a new custom event.
  function createCustomEvent(name) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (CustomEvent) {
      return new CustomEvent(name, opts);
    }

    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
    return e;
  }

  // Detect whether or not bubbling is supported on detached elements. This is
  // non-standard, but Firefox allows it. In a web component world, this is
  // very useful for decoupled inter-component communication without relying on
  // DOM attachment, so we polyfill it.
  (function () {
    var parent = document.createElement('div');
    var child = document.createElement('div');
    parent.appendChild(child);
    parent.addEventListener('test', function () {
      return hasBubbleOnDetachedElements = true;
    });
    child.dispatchEvent(createCustomEvent('test', { bubbles: true }));
  })();

  function emitOne(elem, name, opts) {
    var cevent, status, isBubbling;

    /* jshint expr: true */
    opts.bubbles === undefined && (opts.bubbles = true);
    opts.cancelable === undefined && (opts.cancelable = true);
    cevent = createCustomEvent(name, opts);
    isBubbling = opts.bubbles;
    status = elem.dispatchEvent(cevent);
    elem = elem.parentNode;

    // Simulate bubbling if the browser doesn't support it on detached elements.
    if (isBubbling && !(0, _utilElementContains2['default'])(document, elem) && !hasBubbleOnDetachedElements) {
      (function () {
        var oldStopPropagation = cevent.stopPropagation;

        // Patch stopPropagation() to set isPropagationStopped because there's no
        // other way to tell if it was stopped.
        cevent.stopPropagation = function () {
          isBubbling = false;
          oldStopPropagation.call(cevent);
        };

        // Bubble.
        while (elem && isBubbling) {
          cevent.currentTarget = elem;
          if (elem.dispatchEvent(cevent) === false) {
            status = false;
          }
          elem = elem.parentNode;
        }
      })();
    }

    return status;
  }

  module.exports = function (elem, name) {
    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var names = typeof name === 'string' ? name.split(' ') : name;
    return names.reduce(function (prev, curr) {
      if (!emitOne(elem, curr, opts)) {
        prev.push(curr);
      }
      return prev;
    }, []);
  };
});