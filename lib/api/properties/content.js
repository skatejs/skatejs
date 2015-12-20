(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../../util/data', '../fragment'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../../util/data'), require('../fragment'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.data, global.fragment);
    global.content = mod.exports;
  }
})(this, function (exports, module, _utilData, _fragment) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _data = _interopRequireDefault(_utilData);

  var _fragment2 = _interopRequireDefault(_fragment);

  function normalize(node) {
    return node instanceof DocumentFragment ? [].slice.call(node.childNodes) : [node];
  }

  function mutate(elem, type, args) {
    var desc = (0, _data['default'])(elem).contentPropertyProjectee;
    desc && desc[type].apply(desc, args);
  }

  function update(elem, change) {
    return function (type, args) {
      mutate(elem, type, args);
      change && change(elem, type, args);
    };
  }

  function createDomArray(elem, update) {
    var childNodes = [];

    return Object.defineProperties({
      appendChild: function appendChild(newNode) {
        childNodes.push.apply(childNodes, normalize(newNode));
        update('appendChild', [newNode]);
        return newNode;
      },
      insertBefore: function insertBefore(newNode, referenceNode) {
        childNodes.splice.apply(null, [childNodes.indexOf(referenceNode), 0].concat(normalize(newNode)));
        update('insertBefore', [newNode, referenceNode]);
        return newNode;
      },
      removeChild: function removeChild(oldNode) {
        normalize(oldNode).forEach(function (oldNode) {
          childNodes.splice(childNodes.indexOf(oldNode), 1);
        });
        update('removeChild', [oldNode]);
        return oldNode;
      },
      replaceChild: function replaceChild(newNode, oldNode) {
        childNodes.splice.apply(null, [childNodes.indexOf(oldNode), 1].concat(normalize(newNode)));
        update('replaceChild', [newNode, oldNode]);
        return oldNode;
      }
    }, {
      childNodes: {
        get: function get() {
          return childNodes;
        },
        configurable: true,
        enumerable: true
      }
    });
  }

  module.exports = {
    created: function created(elem) {
      var eldata = (0, _data['default'])(elem);
      eldata.contentProperty = createDomArray(elem, update(elem, this.change));
      eldata.contentPropertyInitialState = [].slice.call(elem.childNodes);
      eldata.contentPropertyProjectee = this.selector ? elem.querySelector(this.selector) : null;
    },
    get: function get(elem) {
      return (0, _data['default'])(elem).contentProperty;
    },
    ready: function ready(elem) {
      var eldata = (0, _data['default'])(elem);
      eldata.contentProperty.appendChild((0, _fragment2['default'])(eldata.contentPropertyInitialState));
      delete eldata.contentPropertyInitialState;
    }
  };
});