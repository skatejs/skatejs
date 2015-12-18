(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../fragment'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../fragment'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.fragment);
    global.content = mod.exports;
  }
})(this, function (exports, module, _fragment) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _fragment2 = _interopRequireDefault(_fragment);

  function createDomArray(initialState, onUpdate) {
    var childNodes = [].slice.call(initialState);
    var onUpdateFn = typeof onUpdate === 'function' ? onUpdate : function () {};

    return Object.defineProperties({
      appendChild: function appendChild(child) {
        childNodes.push(child);
        onUpdateFn();
      },
      removeChild: function removeChild(child) {
        var index = childNodes.indexOf(child);
        index > -1 && childNodes.splice(index, 1);
        onUpdateFn();
        return this;
      },
      replaceChild: function replaceChild(newChild, oldChild) {
        var index = childNodes.indexOf(oldChild);
        childNodes.splice(index, 1, newChild);
        onUpdateFn();
        return this;
      }
    }, {
      childNodes: {
        get: function get() {
          return childNodes;
        },
        configurable: true,
        enumerable: true
      },
      value: {
        get: function get() {
          return childNodes.length ? childNodes : '';
        },
        configurable: true,
        enumerable: true
      }
    });
  }

  module.exports = {
    created: function created(elem) {
      elem.__content = createDomArray(elem.childNodes, this.change.bind(null, elem));
    },
    get: function get(elem) {
      return elem.__content;
    },
    set: function set(elem, data) {
      if (data.newValue !== elem.__content) {
        while (elem.__content.childNodes.length) {
          elem.__content.childNodes.removeChild(elem.__content.childNodes[0]);
        }
        elem.__content.appendChild((0, _fragment2['default'])(data.newValue));
      }
    }
  };
});