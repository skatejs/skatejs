(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './vars'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./vars'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.globals);
    global.registry = mod.exports;
  }
})(this, function (exports, module, _vars) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _globals = _interopRequireDefault(_vars);

  var definitions = {};
  var map = [];
  var types = [];

  module.exports = _globals['default'].registerIfNotExists('registry', {
    get: function get(name) {
      return Object.prototype.hasOwnProperty.call(definitions, name) && definitions[name];
    },
    set: function set(name, Ctor) {
      if (this.get(name)) {
        throw new Error('A Skate component with the name of "' + name + '" already exists.');
      }

      var type = Ctor.type;
      var typeIndex = types.indexOf(type);

      if (typeIndex === -1) {
        typeIndex = types.length;
        types.push(type);
        map[typeIndex] = {};
      }

      return definitions[name] = map[typeIndex][name] = Ctor;
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