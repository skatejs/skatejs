(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign', '../util/camel-case', '../util/data', './events', '../util/has-own', '../util/matches-selector', '../util/obj-each'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign'), require('../util/camel-case'), require('../util/data'), require('./events'), require('../util/has-own'), require('../util/matches-selector'), require('../util/obj-each'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.camelCase, global.data, global.events, global.hasOwn, global.matchesSelector, global.objEach);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilAssign, _utilCamelCase, _utilData, _events, _utilHasOwn, _utilMatchesSelector, _utilObjEach) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_utilAssign);

  var _camelCase = _interopRequireDefault(_utilCamelCase);

  var _data = _interopRequireDefault(_utilData);

  var _events2 = _interopRequireDefault(_events);

  var _hasOwn = _interopRequireDefault(_utilHasOwn);

  var _matchesSelector = _interopRequireDefault(_utilMatchesSelector);

  var _objEach = _interopRequireDefault(_utilObjEach);

  var elProto = window.Element.prototype;
  var oldSetAttribute = elProto.setAttribute;
  var oldRemoveAttribute = elProto.removeAttribute;

  function getPrototypes(proto) {
    var chains = [proto];
    /* jshint boss: true */
    while (proto = Object.getPrototypeOf(proto)) {
      chains.push(proto);
    }
    chains.reverse();
    return chains;
  }

  function patchAttributeMethods(elem) {
    elem.setAttribute = function (name, newValue) {
      var oldValue = this.getAttribute(name);
      oldSetAttribute.call(elem, name, newValue);
      elem.attributeChangedCallback(name, String(newValue), oldValue);
    };

    elem.removeAttribute = function (name) {
      var oldValue = this.getAttribute(name);
      oldRemoveAttribute.call(elem, name);
      elem.attributeChangedCallback(name, null, oldValue);
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
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = elem.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var attr = _step.value;

        elem.attributeChangedCallback(attr.nodeName, attr.value || attr.nodeValue, null);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
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

  module.exports = function (options) {
    return function () {
      var native;
      var element = this;
      var targetData = (0, _data['default'])(element, options.id);

      if (targetData.created) {
        return;
      }

      targetData.created = true;
      native = !!element.createCallback;

      // Native custom elements automatically inherit the prototype. We apply
      // the user defined prototype directly to the element instance if not.
      // Skate will always add lifecycle callbacks to the definition. If native
      // custom elements are being used, one of these will already be on the
      // element. If not, then we are initialising via non-native means.
      if (!native) {
        getPrototypes(options.prototype).forEach(function (proto) {
          if (!proto.isPrototypeOf(element)) {
            (0, _assign['default'])(element, proto);
          }
        });
      }

      // We use the unresolved / resolved attributes to flag whether or not the
      // element has been templated or not.
      if (options.template && !element.hasAttribute(options.resolvedAttribute)) {
        options.template(element);
      }

      markAsResolved(element, options);
      (0, _events2['default'])(element, options.events);

      if (!native) {
        patchAttributeMethods(element);
      }

      linkProperties(element, options.attributes);
      initAttributes(element, options.attributes);

      if (options.created) {
        options.created(element);
      }

      triggerAttributesCreated(element);
    };
  };
});