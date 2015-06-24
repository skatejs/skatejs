(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './chain', '../util/matches-selector'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./chain'), require('../util/matches-selector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiChain, global.matchesSelector);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _chain, _utilMatchesSelector) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiChain = _interopRequireDefault(_chain);

  var _matchesSelector = _interopRequireDefault(_utilMatchesSelector);

  function parseEvent(e) {
    var parts = e.split(' ');
    return {
      name: parts.shift(),
      delegate: parts.join(' ')
    };
  }

  function makeDelegateHandler(elem, handler, delegate) {
    return function (e) {
      var current = e.target;
      while (current && current !== elem.parentNode) {
        if ((0, _matchesSelector['default'])(current, delegate)) {
          e.delegateTarget = current;
          return handler(e);
        }

        current = current.parentNode;
      }
    };
  }

  function makeNormalHandler(elem, handler) {
    return function (e) {
      e.delegateTarget = e.currentTarget;
      handler(e);
    };
  }

  function bindEvent(elem, event, handler) {
    var _parseEvent = parseEvent(event);

    var name = _parseEvent.name;
    var delegate = _parseEvent.delegate;

    var capture = delegate && (name === 'blur' || name === 'focus');
    handler = (0, _apiChain['default'])(handler).bind(elem);
    handler = delegate ? makeDelegateHandler(elem, handler, delegate) : makeNormalHandler(elem, handler);
    elem.addEventListener(name, handler, capture);
  }

  function bindEvents(elem, events) {
    Object.keys(events).forEach(function (name) {
      bindEvent(elem, name, events[name]);
    });
  }

  module.exports = function (elem, events, handler) {
    if (typeof events === 'string') {
      bindEvent(elem, events, handler);
    } else {
      bindEvents(elem, events || {});
    }
  };
});