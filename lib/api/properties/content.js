(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'object-assign', '../../util/data'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('object-assign'), require('../../util/data'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.data);
    global.content = mod.exports;
  }
})(this, function (exports, module, _objectAssign, _utilData) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var _assign = _interopRequireDefault(_objectAssign);

  var _data = _interopRequireDefault(_utilData);

  var MutationObserver = window.MutationObserver;

  if (!MutationObserver) {
    throw new Error('Usage of the content property requires MutationObserver support.');
  }

  // Calls the `change` callback if it's defined.
  function change(el, cb) {
    cb = cb || function () {};
    return function (mo) {
      cb(el, mo.addedNodes || [], mo.removedNodes || []);
    };
  }

  // Creates a fake node for usage before the element is rendered so that the way
  // of accessing the value of the content node does not change at any point
  // during the rendering process. This is basically syntanctic sugar for not
  // having to do something like:
  //
  //     elem.content && elem.content.value
  //
  // In your `render` function. Instead, you can just do:
  //
  //     elem.content.value
  //
  // This is to get around having to know about the implementation details which
  // vary depending on if we're in native or polyfilled custom element land.
  function createFakeNode(name) {
    return Object.defineProperties({}, _defineProperty({}, name, {
      get: function get() {
        return null;
      },
      configurable: true,
      enumerable: true
    }));
  }

  // Creates a real node so that the renering process can attach nodes to it.
  function createRealNode(elem, name, selector) {
    var node = selector ? elem.querySelector(selector) : document.createElement('div');
    Object.defineProperty(node, name, {
      get: function get() {
        var ch = this.childNodes;
        return ch && ch.length ? [].slice.call(ch) : null;
      }
    });
    return node;
  }

  // Sets initial content for the specified node.
  function init(node, nodes) {
    for (var a = 0; a < nodes.length; a++) {
      node.appendChild(nodes[a]);
    }
  }

  module.exports = function () {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    opts = (0, _assign['default'])({
      accessor: 'nodes',
      change: function change() {},
      selector: ''
    }, opts);
    return {
      created: function created(el) {
        var info = (0, _data['default'])(el);
        info.contentNode = createFakeNode(opts.accessor);
        info.initialState = [].slice.call(el.childNodes);
      },
      get: function get(el) {
        return (0, _data['default'])(el).contentNode;
      },
      ready: function ready(elem) {
        var info = (0, _data['default'])(elem);
        var observer = new MutationObserver(change(elem, opts.change));
        info.contentNode = createRealNode(elem, opts.accessor, opts.selector);
        init(info.contentNode, info.initialState);
        observer.observe(info.contentNode, { childList: true });
      }
    };
  };
});