(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign', '../util/create-from-html', './init', '../global/registry'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign'), require('../util/create-from-html'), require('./init'), require('../global/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.createFromHtml, global.init, global.registry);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilAssign, _utilCreateFromHtml, _init, _globalRegistry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_utilAssign);

  var _createFromHtml = _interopRequireDefault(_utilCreateFromHtml);

  var _init2 = _interopRequireDefault(_init);

  var _registry = _interopRequireDefault(_globalRegistry);

  function createFromName(name) {
    var ctor = _registry['default'].get(name);
    return ctor && ctor() || document.createElement(name);
  }

  module.exports = function (name, props) {
    name = name.trim();
    return (0, _assign['default'])(name[0] === '<' ? (0, _init2['default'])((0, _createFromHtml['default'])(name).firstElementChild) : createFromName(name), props);
  };
});