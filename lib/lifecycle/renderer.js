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

  module.exports = renderer;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _fragment = _interopRequireDefault(_apiFragment);

  var defaultRenderer = function defaultRenderer(elem, render) {
    while (elem.childNodes.length) {
      elem.removeChild(elem.childNodes[0]);
    }
    elem.appendChild((0, _fragment['default'])(render()));
  };

  function renderer(opts) {
    var render = opts.render ? opts.render : null;
    var renderer = opts.renderer ? opts.renderer.bind(opts) : defaultRenderer;
    var resolvedAttribute = opts.resolvedAttribute;

    return function (elem) {
      if (render && !elem.hasAttribute(resolvedAttribute)) {
        renderer(elem, render.bind(opts, elem));
      }
    };
  }
});