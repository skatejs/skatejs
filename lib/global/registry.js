(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../api/emit', './vars', '../util/has-own', '../type/element'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../api/emit'), require('./vars'), require('../util/has-own'), require('../type/element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiEmit, global.globals, global.hasOwn, global.typeElement);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _apiEmit, _vars, _utilHasOwn, _typeElement) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiEmit2 = _interopRequireDefault(_apiEmit);

  var _globals = _interopRequireDefault(_vars);

  var _hasOwn = _interopRequireDefault(_utilHasOwn);

  var _typeElement2 = _interopRequireDefault(_typeElement);

  var definitions = {};
  var map = [];
  var types = [];

  module.exports = _globals['default'].registerIfNotExists('registry', {
    get: function get(id) {
      return (0, _hasOwn['default'])(definitions, id) && definitions[id];
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
      (0, _apiEmit2['default'])(document, '_skate-register', {
        bubbles: false,
        detail: opts
      });

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
});