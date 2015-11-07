// src/util/walk-tree.js
(typeof window === 'undefined' ? global : window).__164e5750c20526cb74a9e443b730eeff = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  var defineDependencies = {
    "module": module,
    "exports": exports,
    "./ignored": __092f8936e5006bddcb3baf24320a5a06
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
  }("__164e5750c20526cb74a9e443b730eeff");
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
      global.walkTree = mod.exports;
    }
  })(this, function (exports) {
  
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
  
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { 'default': obj };
    }
  
    var _ignored = __092f8936e5006bddcb3baf24320a5a06;
  
    var _ignored2 = _interopRequireDefault(_ignored);
  
    var Node = window.Node;
  
    function walk(elem, fn) {
      if (elem.nodeType !== Node.ELEMENT_NODE || (0, _ignored2['default'])(elem)) {
        return;
      }
  
      var chren = elem.childNodes;
      var child = chren && chren[0];
  
      fn(elem);
      while (child) {
        walk(child, fn);
        child = child.nextSibling;
      }
    }
  
    exports['default'] = function (elems, fn) {
      if (!elems) {
        return;
      }
  
      if (elems instanceof Node) {
        elems = [elems];
      }
  
      for (var a = 0; a < elems.length; a++) {
        walk(elems[a], fn);
      }
    };
  
    module.exports = exports['default'];
  });
  
  return module.exports;
}).call(this);