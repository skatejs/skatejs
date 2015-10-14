(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../api/fragment'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../api/fragment'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.fragment);
    global.renderer = mod.exports;
  }
})(this, function (exports, module, _apiFragment) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _fragment = _interopRequireDefault(_apiFragment);

  function defaultRenderer(elem, opts) {
    while (elem.childNodes.length) {
      elem.removeChild(elem.childNodes[0]);
    }
    elem.appendChild((0, _fragment['default'])(opts.render(elem)));
  }

  module.exports = function (elem, opts) {
    if (opts.render) {
      if (opts.renderer) {
        opts.renderer(elem);
      } else {
        defaultRenderer(elem, opts);
      }
    }
  };
});