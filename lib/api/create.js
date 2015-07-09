(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign', './init', '../global/registry'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign'), require('./init'), require('../global/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.init, global.registry);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilAssign, _init, _globalRegistry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_utilAssign);

  var _init2 = _interopRequireDefault(_init);

  var _registry = _interopRequireDefault(_globalRegistry);

  var specialMap = {
    caption: 'table',
    dd: 'dl',
    dt: 'dl',
    li: 'ul',
    tbody: 'table',
    td: 'tr',
    thead: 'table',
    tr: 'tbody'
  };

  function matchTag(dom) {
    var tag = dom.match(/\s*<([^\s>]+)/);
    return tag && tag[1];
  }

  function createFromHtml(html) {
    var par = document.createElement(specialMap[matchTag(html)] || 'div');
    par.innerHTML = html;
    return (0, _init2['default'])(par.firstElementChild);
  }

  function createFromName(name) {
    var ctor = _registry['default'].get(name);
    return ctor && ctor() || document.createElement(name);
  }

  module.exports = function (name, props) {
    name = name.trim();
    return (0, _assign['default'])(name[0] === '<' ? createFromHtml(name) : createFromName(name), props);
  };
});