(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../util/element-contains'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../util/element-contains'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.elementContains);
    global.emit = mod.exports;
  }
})(this, function (exports, _elementContains) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elem, name) {
    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var names = typeof name === 'string' ? name.split(' ') : name;
    return names.reduce(function (prev, curr) {
      if (emitOne(elem, curr, opts) === false) {
        prev.push(curr);
      }
      return prev;
    }, []);
  };

  var _elementContains2 = _interopRequireDefault(_elementContains);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var CustomEvent = function (CustomEvent) {
    if (CustomEvent) {
      try {
        new CustomEvent();
      } catch (e) {
        return undefined;
      }
    }

    return CustomEvent;
  }(window.CustomEvent);

  function dispatch(elem, cEvent) {
    if (!elem.disabled) {
      return elem.dispatchEvent(cEvent);
    }

    cEvent.isPropagationStopped = true;
  }

  var hasBubbleOnDetachedElements = function () {
    var parent = document.createElement('div');
    var child = document.createElement('div');
    var hasBubbleOnDetachedElements = false;
    parent.appendChild(child);
    parent.addEventListener('test', function () {
      return hasBubbleOnDetachedElements = true;
    });
    child.dispatchEvent(createCustomEvent('test', {
      bubbles: true
    }));
    return hasBubbleOnDetachedElements;
  }();

  function createCustomEvent(name) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (CustomEvent) {
      return new CustomEvent(name, opts);
    }

    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
    return e;
  }

  function createReadableStopPropagation(oldStopPropagation) {
    return function () {
      this.isPropagationStopped = true;
      oldStopPropagation.call(this);
    };
  }

  function simulateBubbling(elem, cEvent) {
    var didPreventDefault = undefined;
    var currentElem = elem;
    cEvent.stopPropagation = createReadableStopPropagation(cEvent.stopPropagation);
    Object.defineProperty(cEvent, 'target', {
      get: function get() {
        return elem;
      }
    });

    while (currentElem && !cEvent.isPropagationStopped) {
      cEvent.currentTarget = currentElem;

      if (dispatch(currentElem, cEvent) === false) {
        didPreventDefault = false;
      }

      currentElem = currentElem.parentNode;
    }

    return didPreventDefault;
  }

  function emitOne(elem, name, opts) {
    var cEvent, shouldSimulateBubbling;
    opts.bubbles === undefined && (opts.bubbles = true);
    opts.cancelable === undefined && (opts.cancelable = true);
    cEvent = createCustomEvent(name, opts);
    shouldSimulateBubbling = opts.bubbles && !hasBubbleOnDetachedElements && !(0, _elementContains2.default)(document, elem);
    return shouldSimulateBubbling ? simulateBubbling(elem, cEvent) : dispatch(elem, cEvent);
  }
});