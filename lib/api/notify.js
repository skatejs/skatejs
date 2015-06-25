(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/maybe-this', './emit'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/maybe-this'), require('./emit'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.maybeThis, global.emit);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilMaybeThis, _emit) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _maybeThis = _interopRequireDefault(_utilMaybeThis);

  var _emit2 = _interopRequireDefault(_emit);

  /* jshint expr: true */
  module.exports = (0, _maybeThis['default'])(function (elem, name) {
    var detail = arguments[2] === undefined ? {} : arguments[2];

    // Notifications must *always* have:
    // - name
    // - newValue
    // - oldValue
    // but may contain other information.
    detail.name = name;
    detail.newValue === undefined && (detail.newValue = elem[name]);
    detail.oldValue === undefined && (detail.oldValue = elem[name]);

    (0, _emit2['default'])(elem, ['skate.property', 'skate.property.' + name], {
      detail: detail
    });
  });
});