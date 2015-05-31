(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign', '../util/camel-case', '../util/data', './events', '../util/has-own', '../util/protos', '../polyfill/registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign'), require('../util/camel-case'), require('../util/data'), require('./events'), require('../util/has-own'), require('../util/protos'), require('../polyfill/registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.camelCase, global.data, global.events, global.hasOwn, global.protos, global.registry, global.walkTree);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilAssign, _utilCamelCase, _utilData, _events, _utilHasOwn, _utilProtos, _polyfillRegistry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_utilAssign);

  var _camelCase = _interopRequireDefault(_utilCamelCase);

  var _data = _interopRequireDefault(_utilData);

  var _events2 = _interopRequireDefault(_events);

  var _hasOwn = _interopRequireDefault(_utilHasOwn);

  var _protos = _interopRequireDefault(_utilProtos);

  var _registry = _interopRequireDefault(_polyfillRegistry);

  var _walkTree = _interopRequireDefault(_utilWalkTree);

  var elProto = window.Element.prototype;
  var oldSetAttribute = elProto.setAttribute;
  var oldRemoveAttribute = elProto.removeAttribute;

  function patchAttributeMethods(elem) {
    elem.setAttribute = function (name, newValue) {
      var oldValue = this.getAttribute(name);
      oldSetAttribute.call(elem, name, newValue);
      elem.attributeChangedCallback(name, oldValue, String(newValue));
    };

    elem.removeAttribute = function (name) {
      var oldValue = this.getAttribute(name);
      oldRemoveAttribute.call(elem, name);
      elem.attributeChangedCallback(name, oldValue, null);
    };
  }

  function defineAttributeProperty(elem, attr) {
    Object.defineProperty(elem, (0, _camelCase['default'])(attr), {
      get: function get() {
        return this.getAttribute(attr);
      },
      set: function set(value) {
        return value === undefined ? this.removeAttribute(attr) : this.setAttribute(attr, value);
      }
    });
  }

  function linkProperties(elem) {
    var attrs = arguments[1] === undefined ? {} : arguments[1];

    for (var attr in attrs) {
      if ((0, _hasOwn['default'])(attrs, attr) && elem[attr] === undefined) {
        defineAttributeProperty(elem, attr);
      }
    }
  }

  function triggerAttributesCreated(elem) {
    var attrs = elem.attributes;
    for (var attr in attrs) {
      attr = attrs[attr];
      elem.attributeChangedCallback(attr.nodeName, null, attr.value || attr.nodeValue);
    }
  }

  function markAsResolved(elem, opts) {
    elem.removeAttribute(opts.unresolvedAttribute);
    elem.setAttribute(opts.resolvedAttribute, '');
  }

  function initAttributes(elem) {
    var attrs = arguments[1] === undefined ? {} : arguments[1];

    Object.keys(attrs).forEach(function (name) {
      var attr = attrs[name];
      if (attr && attr.value && !elem.hasAttribute(name)) {
        var value = attr.value;
        value = typeof value === 'function' ? value(elem) : value;
        elem.setAttribute(name, value);
      }
    });
  }

  module.exports = function (opts) {
    return function () {
      var isNative;
      var elem = this;
      var info = (0, _data['default'])(elem, opts.id);

      if (info.created) {
        return;
      }

      info.created = true;
      isNative = !!elem.createdCallback;

      // Native custom elements automatically inherit the prototype. We apply
      // the user defined prototype directly to the element instance if not.
      // Skate will always add lifecycle callbacks to the definition. If native
      // custom elements are being used, one of these will already be on the
      // element. If not, then we are initialising via non-native means.
      if (!isNative) {
        (0, _protos['default'])(opts.prototype).forEach(function (proto) {
          if (!proto.isPrototypeOf(elem)) {
            (0, _assign['default'])(elem, proto);
          }
        });
      }

      // We use the unresolved / resolved attributes to flag whether or not the
      // element has been templated or not.
      if (opts.template && !elem.hasAttribute(opts.resolvedAttribute)) {
        opts.template(elem);
      }

      // Native custom elements initialise descendants before the current node.
      if (!isNative) {
        (0, _walkTree['default'])(elem.childNodes, function (elem) {
          _registry['default'].getForElement(elem).forEach(function (Ctor) {
            return Ctor.prototype.createdCallback.call(elem);
          });
        }, function (elem) {
          return !(0, _data['default'])(elem, opts.id).created;
        });
      }

      if (!isNative) {
        patchAttributeMethods(elem);
      }

      (0, _events2['default'])(elem, opts.events);
      linkProperties(elem, opts.attributes);
      initAttributes(elem, opts.attributes);

      if (opts.created) {
        opts.created(elem);
      }

      triggerAttributesCreated(elem);
      markAsResolved(elem, opts);
    };
  };
});