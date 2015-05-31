(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/data', '../polyfill/registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/data'), require('../polyfill/registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.data, global.registry, global.walkTree);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilData, _polyfillRegistry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _data = _interopRequireDefault(_utilData);

  var _registry = _interopRequireDefault(_polyfillRegistry);

  var _walkTree = _interopRequireDefault(_utilWalkTree);

  module.exports = function (opts) {
    return function () {
      var elem = this;
      var info = (0, _data['default'])(elem, opts.id);

      if (info.detached) {
        return;
      }

      if (!elem.attachedCallback) {
        (0, _walkTree['default'])(elem.childNodes, function (elem) {
          _registry['default'].getForElement(elem).forEach(function (Ctor) {
            return Ctor.prototype.createdCallback.call(elem);
          });
        }, function (elem) {
          return !(0, _data['default'])(elem, opts.id).attached;
        });
      }

      info.detached = true;
      if (opts.detached) {
        opts.detached(elem);
      }
      info.attached = false;
    };
  };
});