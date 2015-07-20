(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/matches-selector', '../util/maybe-this'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/matches-selector'), require('../util/maybe-this'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.matches, global.maybeThis);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilMatchesSelector, _utilMaybeThis) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _matches = _interopRequireDefault(_utilMatchesSelector);

  var _maybeThis = _interopRequireDefault(_utilMaybeThis);

  function parseEvent(e) {
    var parts = e.split(' ');
    var name = parts.shift();
    var selector = parts.join(' ').trim();
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
        if ((0, _matches['default'])(current, selector)) {
          e.delegateTarget = current;
          return handler(e);
        }
        current = current.parentNode;
      }
    };
  }

  function makeNormalHandler(elem, handler) {
    return function (e) {
      e.delegateTarget = elem;
      handler(e);
    };
  }

  function bindEvent(elem, event, handler) {
    var parsed = parseEvent(event);
    var name = parsed.name;
    var selector = parsed.selector;

    var capture = selector && (name === 'blur' || name === 'focus');
    handler = handler.bind(elem);
    handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
    elem.addEventListener(name, handler, capture);
  }

  function bindEvents(elem, events) {
    Object.keys(events).forEach(function (name) {
      bindEvent(elem, name, events[name]);
    });
  }

  module.exports = (0, _maybeThis['default'])(function (elem, events, handler) {
    if (typeof events === 'string') {
      bindEvent(elem, events, handler);
    } else if (Array.isArray(events)) {
      events.forEach(function (e) {
        return bindEvent(elem, e, handler);
      });
    } else {
      bindEvents(elem, events || {});
    }
  });
});