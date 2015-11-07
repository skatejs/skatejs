// src/api/create.js
(typeof window === 'undefined' ? global : window).__1675a7174b713323cc232370699a2714 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  var defineDependencies = {
    "module": module,
    "exports": exports,
    "../util/assign": __d48ab0568b1578e9cac74e66baa6d3e7,
    "../global/registry": __9cff21a9f41cc9ecfe56139e1040c954
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
  }("__1675a7174b713323cc232370699a2714");
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
      global.create = mod.exports;
    }
  })(this, function (exports) {
  
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
  
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { 'default': obj };
    }
  
    var _utilAssign = __d48ab0568b1578e9cac74e66baa6d3e7;
  
    var _utilAssign2 = _interopRequireDefault(_utilAssign);
  
    var _globalRegistry = __9cff21a9f41cc9ecfe56139e1040c954;
  
    var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
    exports['default'] = function (name, properties) {
      var trimmedName = name.trim();
      var constructor = _globalRegistry2['default'].get(trimmedName);
      return constructor ? constructor(properties) : (0, _utilAssign2['default'])(document.createElement(trimmedName), properties);
    };
  
    module.exports = exports['default'];
  });
  
  return module.exports;
}).call(this);