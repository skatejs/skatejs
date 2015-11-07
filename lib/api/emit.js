// src/api/emit.js
(typeof window === 'undefined' ? global : window).__639a0d2e0f8a90cd72e6197bdb481558 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  var defineDependencies = {
    "module": module,
    "exports": exports,
    "../util/element-contains": __6f793202bae98770dbb2b598df7929ad
  };
  var define = function defineReplacementWrapper(generatedModuleName) {
    return function defineReplacement(name, deps, func) {
      var root = (typeof window === 'undefined' ? global : window);
      var defineGlobal = root.define;
      var rval;
      var type;
  
      func = [func, deps, name].filter(function (cur) {
        return typeof cur === 'function';
      })[0];
      deps = [deps, name, []].filter(Array.isArray)[0];
      rval = func.apply(null, deps.map(function (value) {
        return defineDependencies[value];
      }));
      type = typeof rval;
  
      // Support existing AMD libs.
      if (typeof defineGlobal === 'function') {
        // Almond always expects a name so resolve one (#29).
        defineGlobal(typeof name === 'string' ? name : generatedModuleName, deps, func);
      }
  
      // Some processors like Babel don't check to make sure that the module value
      // is not a primitive before calling Object.defineProperty() on it. We ensure
      // it is an instance so that it can.
      if (type === 'string') {
        rval = String(rval);
      } else if (type === 'number') {
        rval = Number(rval);
      } else if (type === 'boolean') {
        rval = Boolean(rval);
      }
  
      // Reset the exports to the defined module. This is how we convert AMD to
      // CommonJS and ensures both can either co-exist, or be used separately. We
      // only set it if it is not defined because there is no object representation
      // of undefined, thus calling Object.defineProperty() on it would fail.
      if (rval !== undefined) {
        exports = module.exports = rval;
      }
    };
  }("__639a0d2e0f8a90cd72e6197bdb481558");
  define.amd = true;
  
  (function (global, factory) {
    if (typeof define === 'function' && define.amd) {
      define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports);
      global.emit = mod.exports;
    }
  })(this, function (exports) {
  
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
  
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { 'default': obj };
    }
  
    var _utilElementContains = __6f793202bae98770dbb2b598df7929ad;
  
    var _utilElementContains2 = _interopRequireDefault(_utilElementContains);
  
    var CustomEvent = (function (CustomEvent) {
      if (CustomEvent) {
        try {
          new CustomEvent();
        } catch (e) {
          return undefined;
        }
      }
      return CustomEvent;
    })(window.CustomEvent);
  
    var hasBubbleOnDetachedElements = (function () {
      var parent = document.createElement('div');
      var child = document.createElement('div');
      var hasBubbleOnDetachedElements = false;
      parent.appendChild(child);
      parent.addEventListener('test', function () {
        return hasBubbleOnDetachedElements = true;
      });
      child.dispatchEvent(createCustomEvent('test', { bubbles: true }));
      return hasBubbleOnDetachedElements;
    })();
  
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
      Object.defineProperty(cEvent, 'target', { value: elem });
      while (currentElem && !cEvent.isPropagationStopped) {
        cEvent.currentTarget = currentElem;
        if (currentElem.dispatchEvent(cEvent) === false) {
          didPreventDefault = false;
        }
        currentElem = currentElem.parentNode;
      }
      return didPreventDefault;
    }
  
    function emitOne(elem, name, opts) {
      var cEvent, shouldSimulateBubbling;
  
      /* jshint expr: true */
      opts.bubbles === undefined && (opts.bubbles = true);
      opts.cancelable === undefined && (opts.cancelable = true);
      cEvent = createCustomEvent(name, opts);
      shouldSimulateBubbling = opts.bubbles && !hasBubbleOnDetachedElements && !(0, _utilElementContains2['default'])(document, elem);
  
      return shouldSimulateBubbling ? simulateBubbling(elem, cEvent) : elem.dispatchEvent(cEvent);
    }
  
    exports['default'] = function (elem, name) {
      var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  
      var names = typeof name === 'string' ? name.split(' ') : name;
      return names.reduce(function (prev, curr) {
        if (emitOne(elem, curr, opts) === false) {
          prev.push(curr);
        }
        return prev;
      }, []);
    };
  
    module.exports = exports['default'];
  });
  
  return module.exports;
}).call(this);