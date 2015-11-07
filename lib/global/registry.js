// src/global/registry.js
(typeof window === 'undefined' ? global : window).__9cff21a9f41cc9ecfe56139e1040c954 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  var defineDependencies = {
    "module": module,
    "exports": exports,
    "./vars": __dd77578495c1d19b0e115627616ea63a,
    "../util/has-own": __6d7878404f872c72787f01cd3e06dd21,
    "../type/element": __43714db526496b3dd90353996f6dce09
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
  }("__9cff21a9f41cc9ecfe56139e1040c954");
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
      global.registry = mod.exports;
    }
  })(this, function (exports) {
  
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
  
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { 'default': obj };
    }
  
    var _vars = __dd77578495c1d19b0e115627616ea63a;
  
    var _vars2 = _interopRequireDefault(_vars);
  
    var _utilHasOwn = __6d7878404f872c72787f01cd3e06dd21;
  
    var _utilHasOwn2 = _interopRequireDefault(_utilHasOwn);
  
    var _typeElement = __43714db526496b3dd90353996f6dce09;
  
    var _typeElement2 = _interopRequireDefault(_typeElement);
  
    var definitions = {};
    var map = [];
    var types = [];
  
    exports['default'] = _vars2['default'].registerIfNotExists('registry', {
      get: function get(id) {
        return (0, _utilHasOwn2['default'])(definitions, id) && definitions[id];
      },
      set: function set(id, opts) {
        if (this.get(id)) {
          throw new Error('A Skate component with the name of "' + id + '" already exists.');
        }
  
        var type = opts.type || _typeElement2['default'];
        var typeIndex = types.indexOf(type);
  
        if (typeIndex === -1) {
          typeIndex = types.length;
          types.push(type);
          map[typeIndex] = {};
        }
  
        definitions[id] = opts;
        map[typeIndex][id] = opts;
  
        return this;
      },
      find: function find(elem) {
        var filtered = [];
        var typesLength = types.length;
  
        for (var a = 0; a < typesLength; a++) {
          filtered = filtered.concat(types[a].filter(elem, map[a]) || []);
        }
  
        return filtered;
      }
    });
    module.exports = exports['default'];
  });
  
  return module.exports;
}).call(this);