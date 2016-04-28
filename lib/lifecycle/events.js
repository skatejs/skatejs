(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/matches-selector'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/matches-selector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.matchesSelector);
    global.events = mod.exports;
  }
})(this, function (module, exports, _matchesSelector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = events;

  var _matchesSelector2 = _interopRequireDefault(_matchesSelector);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function readonly(obj, prop, val) {
    Object.defineProperty(obj, prop, {
      configurable: true,
      get: function get() {
        return val;
      }
    });
  }

  function parseEvent(e) {
    var indexOfSpace = e.indexOf(' ');
    var hasSpace = indexOfSpace > 0;
    var name = hasSpace ? e.substring(0, indexOfSpace) : e;
    var selector = hasSpace ? e.substring(indexOfSpace + 1) : '';
    return {
      name: name,
      selector: selector
    };
  }

  function makeDelegateHandler(elem, handler, parsed) {
    return function (e) {
      var current = e.target;
      var selector = parsed.selector;

      while (current && current !== elem.parentNode) {
        if ((0, _matchesSelector2.default)(current, selector)) {
          readonly(e, 'currentTarget', current);
          readonly(e, 'delegateTarget', elem);
          return handler(e);
        }

        current = current.parentNode;
      }
    };
  }

  function makeNormalHandler(elem, handler) {
    return function (e) {
      readonly(e, 'delegateTarget', elem);
      handler(e);
    };
  }

  function bindEvent(elem, event, handler) {
    var parsed = parseEvent(event);
    var name = parsed.name;
    var selector = parsed.selector;
    var capture = selector && (name === 'blur' || name === 'focus');
    handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
    elem.addEventListener(name, handler, capture);
  }

  function events(opts) {
    var events = opts.events || {};
    return function (elem) {
      for (var name in events) {
        bindEvent(elem, name, events[name].bind(elem));
      }
    };
  }

  module.exports = exports['default'];
});