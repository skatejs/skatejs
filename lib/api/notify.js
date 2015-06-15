(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './emit'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./emit'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiEmit);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _emit) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiEmit = _interopRequireDefault(_emit);

  /* jshint expr: true */

  module.exports = function (elem, name) {
    var detail = arguments[2] === undefined ? {} : arguments[2];

    // Notifications must *always* have:
    // - name
    // - newValue
    // - oldValue
    // but may contain other information.
    detail.name = name;
    detail.newValue === undefined && (detail.newValue = elem[name]);
    detail.oldValue === undefined && (detail.oldValue = elem[name]);

    // Always fire a generic event. These don't bubble because dependencies can
    // be placed on specific events. If that is done, then the dependency will
    // trigger a generic event for the element. Bubbling would cause children
    // to falsely notify parents.
    (0, _apiEmit['default'])(elem, 'skate.property', {
      bubbles: false,
      cancelable: false,
      detail: detail
    });

    // Fire specific event. This event bubbles so that parents can listen for
    // changes in children.
    (0, _apiEmit['default'])(elem, 'skate.property.' + name, {
      bubbles: true,
      cancelable: false,
      detail: detail
    });
  };
});