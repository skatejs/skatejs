(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/chain', '../util/matches-selector'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/chain'), require('../util/matches-selector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.chain, global.matchesSelector);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilChain, _utilMatchesSelector) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _chain = _interopRequireDefault(_utilChain);

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
      while (current && current !== document && current !== elem.parentNode) {
        if ((0, _matchesSelector['default'])(current, delegate)) {
          return handler(elem, e, current);
        }
        current = current.parentNode;
      }
    };
  }

  function makeNormalHandler(elem, handler) {
    return function (e) {
      handler(elem, e, elem);
    };
  }

  module.exports = function (elem, evts) {
    Object.keys(evts || {}).forEach(function (evt) {
      var handler = (0, _chain['default'])(evts[evt]);

      var _parseEvent = parseEvent(evt);

      var name = _parseEvent.name;
      var delegate = _parseEvent.delegate;

      elem.addEventListener(name, delegate ? makeDelegateHandler(elem, handler, delegate) : makeNormalHandler(elem, handler), delegate && (name === 'blur' || name === 'focus'));
    });
  };
});