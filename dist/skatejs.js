// src/constants.js
__22848e6eb5ddd68722bf2a03dc73e10d = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var ATTR_IGNORE = 'data-skate-ignore';
  exports.ATTR_IGNORE = ATTR_IGNORE;
  var EVENT_PREFIX = 'skate-property-';
  exports.EVENT_PREFIX = EVENT_PREFIX;
  var TYPE_ATTRIBUTE = 'attribute';
  exports.TYPE_ATTRIBUTE = TYPE_ATTRIBUTE;
  var TYPE_CLASSNAME = 'classname';
  exports.TYPE_CLASSNAME = TYPE_CLASSNAME;
  var TYPE_ELEMENT = 'element';
  exports.TYPE_ELEMENT = TYPE_ELEMENT;
  
  return module.exports;
}).call(this);

// src/globals.js
__906dce814f2e16e7f80d2aa958aa9ac6 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  if (!window.__skate0) {
    window.__skate0 = {
      registerIfNotExists: function registerIfNotExists(name, value) {
        if (!this[name]) {
          this[name] = value;
        }
  
        return this[name];
      }
    };
  }
  
  exports["default"] = window.__skate0;
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);

// src/util/has-own.js
__6d7878404f872c72787f01cd3e06dd21 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  exports["default"] = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);

// src/polyfill/registry.js
__270cb854b3681e4b614f772d24705d53 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _constants = __22848e6eb5ddd68722bf2a03dc73e10d;
  
  var _globals = __906dce814f2e16e7f80d2aa958aa9ac6;
  
  var _globals2 = _interopRequireDefault(_globals);
  
  var _utilHasOwn = __6d7878404f872c72787f01cd3e06dd21;
  
  var _utilHasOwn2 = _interopRequireDefault(_utilHasOwn);
  
  function getClassList(element) {
    var classList = element.classList;
  
    if (classList) {
      return classList;
    }
  
    var attrs = element.attributes;
  
    return attrs['class'] && attrs['class'].nodeValue.split(/\s+/) || [];
  }
  
  exports['default'] = _globals2['default'].registerIfNotExists('registry', {
    definitions: {},
  
    get: function get(id) {
      return (0, _utilHasOwn2['default'])(this.definitions, id) && this.definitions[id];
    },
  
    set: function set(id, definition) {
      if ((0, _utilHasOwn2['default'])(this.definitions, id)) {
        throw new Error('A component definition of type "' + definition.type + '" with the ID of "' + id + '" already exists.');
      }
      this.definitions[id] = definition;
      return this;
    },
  
    isType: function isType(id, type) {
      var def = this.get(id);
      return def && def.type === type;
    },
  
    getForElement: function getForElement(element) {
      var attrs = element.attributes;
      var attrsLen = attrs.length;
      var definitions = [];
      var isAttr = attrs.is;
      var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
      var tag = element.tagName.toLowerCase();
      var isAttrOrTag = isAttrValue || tag;
      var definition;
      var tagToExtend;
  
      if (this.isType(isAttrOrTag, _constants.TYPE_ELEMENT)) {
        definition = this.definitions[isAttrOrTag];
        tagToExtend = definition['extends'];
  
        if (isAttrValue) {
          if (tag === tagToExtend) {
            definitions.push(definition);
          }
        } else if (!tagToExtend) {
          definitions.push(definition);
        }
      }
  
      for (var a = 0; a < attrsLen; a++) {
        var attr = attrs[a].nodeName;
  
        if (this.isType(attr, _constants.TYPE_ATTRIBUTE)) {
          definition = this.definitions[attr];
          tagToExtend = definition['extends'];
  
          if (!tagToExtend || tag === tagToExtend) {
            definitions.push(definition);
          }
        }
      }
  
      var classList = getClassList(element);
      var classListLen = classList.length;
  
      for (var b = 0; b < classListLen; b++) {
        var className = classList[b];
  
        if (this.isType(className, _constants.TYPE_CLASSNAME)) {
          definition = this.definitions[className];
          tagToExtend = definition['extends'];
  
          if (!tagToExtend || tag === tagToExtend) {
            definitions.push(definition);
          }
        }
      }
  
      return definitions;
    }
  });
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/api/create.js
__1675a7174b713323cc232370699a2714 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _polyfillRegistry = __270cb854b3681e4b614f772d24705d53;
  
  var _polyfillRegistry2 = _interopRequireDefault(_polyfillRegistry);
  
  exports['default'] = function (name) {
    var Ctor = _polyfillRegistry2['default'].get(name);
    return Ctor && new Ctor() || document.createElement(name);
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/data.js
__18291b0452e01f65cf28d6695040736a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  exports['default'] = function (element) {
    var namespace = arguments[1] === undefined ? '' : arguments[1];
  
    var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
    return namespace && (data[namespace] || (data[namespace] = {})) || data;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/ignored.js
__092f8936e5006bddcb3baf24320a5a06 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _constants = __22848e6eb5ddd68722bf2a03dc73e10d;
  
  exports['default'] = function (element) {
    var attrs = element.attributes;
    return attrs && !!attrs[_constants.ATTR_IGNORE];
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/walk-tree.js
__164e5750c20526cb74a9e443b730eeff = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _ignored = __092f8936e5006bddcb3baf24320a5a06;
  
  var _ignored2 = _interopRequireDefault(_ignored);
  
  function walk(elem, fn, filter) {
    if (elem.nodeType !== 1 || (0, _ignored2['default'])(elem) || filter && filter(elem) === false) {
      return;
    }
  
    var chren = elem.childNodes;
    var child = chren && chren[0];
  
    fn(elem);
    while (child) {
      walk(child, fn, filter);
      child = child.nextSibling;
    }
  }
  
  exports['default'] = function (elems, fn, filter) {
    if (elems.length === undefined) {
      elems = [elems];
    }
  
    for (var a = 0; a < elems.length; a++) {
      walk(elems[a], fn, filter);
    }
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/lifecycle/attached.js
__2b55a083f45c9ef157662a1dc1674218 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilData = __18291b0452e01f65cf28d6695040736a;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _polyfillRegistry = __270cb854b3681e4b614f772d24705d53;
  
  var _polyfillRegistry2 = _interopRequireDefault(_polyfillRegistry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  exports['default'] = function (opts) {
    return function () {
      var elem = this;
      var info = (0, _utilData2['default'])(elem, opts.id);
  
      if (info.attached) {
        return;
      }
  
      if (!elem.attachedCallback) {
        (0, _utilWalkTree2['default'])(elem.childNodes, function (elem) {
          _polyfillRegistry2['default'].getForElement(elem).forEach(function (Ctor) {
            return Ctor.prototype.createdCallback.call(elem);
          });
        }, function (elem) {
          return !(0, _utilData2['default'])(elem, opts.id).attached;
        });
      }
  
      info.attached = true;
      if (opts.attached) {
        opts.attached(elem);
      }
      info.detached = false;
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/assign.js
__d48ab0568b1578e9cac74e66baa6d3e7 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  exports["default"] = function (child) {
    for (var _len = arguments.length, parents = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      parents[_key - 1] = arguments[_key];
    }
  
    parents.forEach(function (parent) {
      Object.getOwnPropertyNames(parent).forEach(function (name) {
        var childDesc = Object.getOwnPropertyDescriptor(child, name);
        if (!childDesc || childDesc.configurable) {
          Object.defineProperty(child, name, Object.getOwnPropertyDescriptor(parent, name));
        }
      });
    });
    return child;
  };
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);

// src/util/chain.js
__233ca7c3eccc5d0b7863e069d525eab7 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = chain;
  
  function chain() {
    for (var _len = arguments.length, cbs = Array(_len), _key = 0; _key < _len; _key++) {
      cbs[_key] = arguments[_key];
    }
  
    cbs = cbs.filter(Boolean).map(function (cb) {
      return typeof cb === 'object' ? chain.apply(null, cb) : cb;
    });
  
    return function () {
      var _this = this;
  
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
  
      cbs.forEach(function (cb) {
        return cb.apply(_this, args);
      });
    };
  }
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/matches-selector.js
__365bd8b7bbfb2b50d6dbfd830f0aa927 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var elProto = window.HTMLElement.prototype;
  var nativeMatchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;
  
  // Only IE9 has this msMatchesSelector bug, but best to detect it.
  var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call(document.createElement('div'), 'div');
  
  exports['default'] = function (element, selector) {
    if (hasNativeMatchesSelectorDetattachedBug) {
      var clone = element.cloneNode();
      document.createElement('div').appendChild(clone);
      return nativeMatchesSelector.call(clone, selector);
    }
    return nativeMatchesSelector.call(element, selector);
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/lifecycle/events.js
__d48fcc3ecf3585518bbce659c1ba4116 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilChain = __233ca7c3eccc5d0b7863e069d525eab7;
  
  var _utilChain2 = _interopRequireDefault(_utilChain);
  
  var _utilMatchesSelector = __365bd8b7bbfb2b50d6dbfd830f0aa927;
  
  var _utilMatchesSelector2 = _interopRequireDefault(_utilMatchesSelector);
  
  var isShadowSelectorRegex = /(::shadow|\/deep\/)/;
  var ShadowRoot = window.ShadowRoot;
  
  function parseEvent(e) {
    var parts = e.split(' ');
    return {
      name: parts.shift(),
      delegate: parts.join(' ')
    };
  }
  
  function makeDelegateHandler(elem, handler, delegate) {
    var isShadowSelector = isShadowSelectorRegex.test(delegate);
    return function (e) {
      var current = isShadowSelector ? e.path[0] : e.target;
      while (current && current !== document && current !== elem.parentNode) {
        if ((0, _utilMatchesSelector2['default'])(current, delegate)) {
          return handler(elem, e, current);
        }
  
        current = current.parentNode;
  
        if (current && ShadowRoot && current instanceof ShadowRoot) {
          current = current.host;
        }
      }
    };
  }
  
  function makeNormalHandler(elem, handler) {
    return function (e) {
      handler(elem, e, elem);
    };
  }
  
  exports['default'] = function (elem, evts) {
    Object.keys(evts || {}).forEach(function (evt) {
      var handler = (0, _utilChain2['default'])(evts[evt]);
  
      var _parseEvent = parseEvent(evt);
  
      var name = _parseEvent.name;
      var delegate = _parseEvent.delegate;
  
      elem.addEventListener(name, delegate ? makeDelegateHandler(elem, handler, delegate) : makeNormalHandler(elem, handler), delegate && (name === 'blur' || name === 'focus'));
    });
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/dash-case.js
__0cd264077c1ca567539d11e826d3c00e = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  exports['default'] = function (str) {
    return str.split(/([A-Z])/).reduce(function (one, two, idx) {
      var dash = !one || idx % 2 === 0 ? '' : '-';
      return '' + one + '' + dash + '' + two.toLowerCase();
    });
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/lifecycle/notify.js
__0f623056f5caba5978dc609003737a10 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _constants = __22848e6eb5ddd68722bf2a03dc73e10d;
  
  exports['default'] = function (elem, name) {
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent('' + _constants.EVENT_PREFIX + '' + name, false, false, undefined);
    elem.dispatchEvent(e);
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/lifecycle/property.js
__5fe98810c40e8fe796b072491d45fcc6 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilDashCase = __0cd264077c1ca567539d11e826d3c00e;
  
  var _utilDashCase2 = _interopRequireDefault(_utilDashCase);
  
  var _notify2 = __0f623056f5caba5978dc609003737a10;
  
  var _notify3 = _interopRequireDefault(_notify2);
  
  exports['default'] = function (name, prop) {
    if (typeof prop !== 'object') {
      prop = { type: prop };
    }
  
    var _attribute = prop.attr;
    var _coerce = prop.type || function (val) {
      return val;
    };
    var _dependencies = prop.deps || [];
    var _getter = prop.get;
    var _isBoolean = prop.type && prop.type === Boolean;
    var _notify = prop.notify;
    var _setter = prop.set;
    var _value;
  
    if (_attribute === true) {
      _attribute = (0, _utilDashCase2['default'])(name);
    }
  
    return {
      get: function get() {
        var _this = this;
  
        if (_getter) {
          return _getter.apply(this, _dependencies.map(function (dep) {
            return _this[dep];
          }));
        }
  
        if (_attribute) {
          return _isBoolean ? this.hasAttribute(_attribute) : _coerce(this.getAttribute(_attribute));
        }
  
        return _value;
      },
  
      set: function set(value) {
        _value = _coerce(value);
  
        if (_attribute) {
          if (_isBoolean && _value) {
            this.setAttribute(_attribute, '');
          } else if (_isBoolean && !_value) {
            this.removeAttribute(_attribute, '');
          } else {
            this.setAttribute(_attribute, _value);
          }
        }
  
        if (_setter) {
          _setter.call(this, _value);
        }
  
        if (_notify) {
          (0, _notify3['default'])(this, name);
        }
      }
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/lifecycle/properties.js
__dc805244a3f10da2e05ae57781968d52 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _constants = __22848e6eb5ddd68722bf2a03dc73e10d;
  
  var _utilDashCase = __0cd264077c1ca567539d11e826d3c00e;
  
  var _utilDashCase2 = _interopRequireDefault(_utilDashCase);
  
  var _utilData = __18291b0452e01f65cf28d6695040736a;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _notify = __0f623056f5caba5978dc609003737a10;
  
  var _notify2 = _interopRequireDefault(_notify);
  
  var _property = __5fe98810c40e8fe796b072491d45fcc6;
  
  var _property2 = _interopRequireDefault(_property);
  
  exports['default'] = function (elem) {
    var props = arguments[1] === undefined ? {} : arguments[1];
  
    var attributeToPropertyMap = (0, _utilData2['default'])(elem).attributeToPropertyMap = {};
  
    Object.keys(props).forEach(function (name) {
      var prop = props[name];
  
      if (!prop) {
        return;
      }
  
      Object.defineProperty(elem, name, (0, _property2['default'])(name, prop));
  
      if (prop.attr) {
        attributeToPropertyMap[(0, _utilDashCase2['default'])(name)] = name;
      }
  
      if (typeof prop.value === 'function') {
        elem[name] = prop.value();
      } else if (typeof prop.value !== 'undefined') {
        elem[name] = prop.value;
      }
  
      (prop.deps || []).forEach(function (dependency) {
        return elem.addEventListener('' + _constants.EVENT_PREFIX + '' + dependency, _notify2['default'].bind(null, elem, name));
      });
    });
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/protos.js
__1d11a28624d684874cb270f137cc0122 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  exports["default"] = function (proto) {
    var chains = [proto];
    /* jshint boss: true */
    while (proto = Object.getPrototypeOf(proto)) {
      chains.push(proto);
    }
    chains.reverse();
    return chains;
  };
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);

// src/lifecycle/created.js
__fe1aef0db5b664068b470b21f7c754a5 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilAssign = __d48ab0568b1578e9cac74e66baa6d3e7;
  
  var _utilAssign2 = _interopRequireDefault(_utilAssign);
  
  var _utilData = __18291b0452e01f65cf28d6695040736a;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _events = __d48fcc3ecf3585518bbce659c1ba4116;
  
  var _events2 = _interopRequireDefault(_events);
  
  var _properties = __dc805244a3f10da2e05ae57781968d52;
  
  var _properties2 = _interopRequireDefault(_properties);
  
  var _utilProtos = __1d11a28624d684874cb270f137cc0122;
  
  var _utilProtos2 = _interopRequireDefault(_utilProtos);
  
  var _polyfillRegistry = __270cb854b3681e4b614f772d24705d53;
  
  var _polyfillRegistry2 = _interopRequireDefault(_polyfillRegistry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
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
  
  function applyPrototype(elem, opts) {
    (0, _utilProtos2['default'])(opts.prototype).forEach(function (proto) {
      if (!proto.isPrototypeOf(elem)) {
        (0, _utilAssign2['default'])(elem, proto);
      }
    });
  }
  
  function template(elem, opts) {
    if (opts.template && !elem.hasAttribute(opts.resolvedAttribute)) {
      opts.template(elem);
    }
  }
  
  function callCreatedOnDescendants(elem, opts) {
    (0, _utilWalkTree2['default'])(elem.childNodes, function (elem) {
      _polyfillRegistry2['default'].getForElement(elem).forEach(function (Ctor) {
        return Ctor.prototype.createdCallback.call(elem);
      });
    }, function (elem) {
      return !(0, _utilData2['default'])(elem, opts.id).created;
    });
  }
  
  function callCreated(elem, opts) {
    if (opts.created) {
      opts.created(elem);
    }
  }
  
  exports['default'] = function (opts) {
    /* jshint expr: true */
    return function () {
      var info = (0, _utilData2['default'])(this, opts.id);
      var isNative = this.createdCallback;
  
      if (info.created) {
        return;
      }
  
      info.created = true;
      isNative || applyPrototype(this, opts);
      (0, _properties2['default'])(this, opts.properties);
      template(this, opts);
      isNative || callCreatedOnDescendants(this, opts);
      isNative || patchAttributeMethods(this);
      (0, _events2['default'])(this, opts.events);
      initAttributes(this, opts.attributes);
      callCreated(this, opts);
      triggerAttributesCreated(this);
      markAsResolved(this, opts);
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/element-contains.js
__6f793202bae98770dbb2b598df7929ad = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var elementPrototype = window.HTMLElement.prototype;
  var elementPrototypeContains = elementPrototype.contains;
  
  exports["default"] = function (source, target) {
    // The document element does not have the contains method in IE.
    if (source === document && !source.contains) {
      return document.head.contains(target) || document.body.contains(target);
    }
  
    return source.contains ? source.contains(target) : elementPrototypeContains.call(source, target);
  };
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);

// src/api/init.js
__3add36046399fead5a83243849207ed7 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _lifecycleAttached = __2b55a083f45c9ef157662a1dc1674218;
  
  var _lifecycleAttached2 = _interopRequireDefault(_lifecycleAttached);
  
  var _lifecycleCreated = __fe1aef0db5b664068b470b21f7c754a5;
  
  var _lifecycleCreated2 = _interopRequireDefault(_lifecycleCreated);
  
  var _utilElementContains = __6f793202bae98770dbb2b598df7929ad;
  
  var _utilElementContains2 = _interopRequireDefault(_utilElementContains);
  
  var _polyfillRegistry = __270cb854b3681e4b614f772d24705d53;
  
  var _polyfillRegistry2 = _interopRequireDefault(_polyfillRegistry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  var HTMLElement = window.HTMLElement;
  
  exports['default'] = function (nodes) {
    var nodesToUse = nodes;
  
    if (!nodes) {
      return nodes;
    }
  
    if (typeof nodes === 'string') {
      nodesToUse = nodes = document.querySelectorAll(nodes);
    } else if (nodes instanceof HTMLElement) {
      nodesToUse = [nodes];
    }
  
    (0, _utilWalkTree2['default'])(nodesToUse, function (element) {
      var components = _polyfillRegistry2['default'].getForElement(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        (0, _lifecycleCreated2['default'])(components[a]).call(element);
      }
  
      for (var a = 0; a < componentsLength; a++) {
        if ((0, _utilElementContains2['default'])(document, element)) {
          (0, _lifecycleAttached2['default'])(components[a]).call(element);
        }
      }
    });
  
    return nodes;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/api/no-conflict.js
__82110da8eb4359fb9724f67f4a12febe = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var previousSkate = window.skate;
  
  exports["default"] = function () {
    window.skate = previousSkate;
    return this;
  };
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);

// src/api/type.js
__df5112248641660374a4ff3deedcb65e = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _constants = __22848e6eb5ddd68722bf2a03dc73e10d;
  
  exports['default'] = {
    ATTRIBUTE: _constants.TYPE_ATTRIBUTE,
    CLASSNAME: _constants.TYPE_CLASSNAME,
    ELEMENT: _constants.TYPE_ELEMENT
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/api/version.js
__662bde51c096e9d79bf327311ea178e0 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = '0.13.2';
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/lifecycle/attributes.js
__3339c2eaf2c9e70f911dc8b9c3de6522 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilChain = __233ca7c3eccc5d0b7863e069d525eab7;
  
  var _utilChain2 = _interopRequireDefault(_utilChain);
  
  var _utilData = __18291b0452e01f65cf28d6695040736a;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _notify = __0f623056f5caba5978dc609003737a10;
  
  var _notify2 = _interopRequireDefault(_notify);
  
  var _utilProtos = __1d11a28624d684874cb270f137cc0122;
  
  var _utilProtos2 = _interopRequireDefault(_utilProtos);
  
  var lifecycleNames = ['created', 'updated', 'removed'];
  
  function validLifecycles(obj) {
    return (0, _utilProtos2['default'])(obj || {}).reduce(function (prev, curr) {
      return prev.concat(Object.getOwnPropertyNames(curr));
    }, []).filter(function (key, idx, arr) {
      return arr.lastIndexOf(key) === idx;
    }).filter(function (key) {
      return lifecycleNames.some(function (val) {
        return key.indexOf(val) !== -1;
      });
    });
  }
  
  function resolveType(oldValue, newValue) {
    var newValueIsString = typeof newValue === 'string';
    var oldValueIsString = typeof oldValue === 'string';
  
    if (!oldValueIsString && newValueIsString) {
      return 'created';
    } else if (oldValueIsString && newValueIsString) {
      return 'updated';
    } else if (oldValueIsString && !newValueIsString) {
      return 'removed';
    }
  }
  
  function makeSpecificCallback(types) {
    if (typeof types === 'function') {
      return types;
    }
  
    var map = validLifecycles(types).reduce(function (obj, unsplit) {
      return unsplit.split(' ').reduce(function (obj, split) {
        (obj[split] = obj[split] || []).push(unsplit);
        return obj;
      }, obj);
    }, {});
  
    return function (elem, diff) {
      (map[diff.type] || []).forEach(function (cb) {
        types[cb](elem, diff);
      });
    };
  }
  
  function makeGlobalCallback(attrs) {
    if (typeof attrs === 'function') {
      return attrs;
    }
  
    var fns = Object.keys(attrs || {}).reduce(function (prev, curr) {
      prev[curr] = makeSpecificCallback(attrs[curr]);
      return prev;
    }, {});
  
    return function (elem, diff) {
      (0, _utilChain2['default'])(fns[diff.name]).call(this, elem, diff);
    };
  }
  
  exports['default'] = function (opts) {
    var callback = makeGlobalCallback(opts.attributes);
    return function (name, oldValue, newValue) {
      var attributeToPropertyMap = (0, _utilData2['default'])(this).attributeToPropertyMap;
  
      callback(this, {
        name: name,
        newValue: newValue === undefined ? null : newValue,
        oldValue: oldValue === undefined ? null : oldValue,
        type: resolveType(oldValue, newValue)
      });
  
      // Ensure properties are notified of this change.
      if (attributeToPropertyMap[name]) {
        (0, _notify2['default'])(this, attributeToPropertyMap[name]);
      }
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/debounce.js
__afcda96357b2c6b7e23ccb9ac8b92f43 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  exports["default"] = function (fn) {
    var called = false;
  
    return function () {
      if (!called) {
        called = true;
        setTimeout(function () {
          called = false;
          fn();
        }, 1);
      }
    };
  };
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);

// src/defaults.js
__46b087e8c15b2e0ebc2c4d4cbc36d975 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _constants = __22848e6eb5ddd68722bf2a03dc73e10d;
  
  exports['default'] = {
    // Called when the element is attached to the document.
    attached: function attached() {},
  
    // Attribute lifecycle callback or callbacks.
    attributes: undefined,
  
    // Called when the element is created.
    created: function created() {},
  
    // Called when the element is detached from the document.
    detached: function detached() {},
  
    // The events to manage the binding and unbinding of during the definition's
    // lifecycle.
    events: undefined,
  
    // Restricts a particular definition to binding explicitly to an element with
    // a tag name that matches the specified value.
    'extends': undefined,
  
    // The ID of the definition. This is automatically set in the `skate()`
    // function.
    id: '',
  
    // Properties and methods to add to each element.
    prototype: {},
  
    // The attribute name to add after calling the created() callback.
    resolvedAttribute: 'resolved',
  
    // The template to replace the content of the element with.
    template: undefined,
  
    // The type of bindings to allow.
    type: _constants.TYPE_ELEMENT,
  
    // The attribute name to remove after calling the created() callback.
    unresolvedAttribute: 'unresolved'
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/lifecycle/detached.js
__8e93439e8a566d1586c9903a75a6a785 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilData = __18291b0452e01f65cf28d6695040736a;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _polyfillRegistry = __270cb854b3681e4b614f772d24705d53;
  
  var _polyfillRegistry2 = _interopRequireDefault(_polyfillRegistry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  exports['default'] = function (opts) {
    return function () {
      var elem = this;
      var info = (0, _utilData2['default'])(elem, opts.id);
  
      if (info.detached) {
        return;
      }
  
      if (!elem.attachedCallback) {
        (0, _utilWalkTree2['default'])(elem.childNodes, function (elem) {
          _polyfillRegistry2['default'].getForElement(elem).forEach(function (Ctor) {
            return Ctor.prototype.createdCallback.call(elem);
          });
        }, function (elem) {
          return !(0, _utilData2['default'])(elem, opts.id).attached;
        });
      }
  
      info.detached = true;
      if (opts.detached) {
        opts.detached(elem);
      }
      info.attached = false;
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/obj-each.js
__aa16eea962f403b3d0a38c93350a466d = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _hasOwn = __6d7878404f872c72787f01cd3e06dd21;
  
  var _hasOwn2 = _interopRequireDefault(_hasOwn);
  
  exports['default'] = function (obj, fn) {
    for (var a in obj) {
      if ((0, _hasOwn2['default'])(obj, a)) {
        fn(obj[a], a);
      }
    }
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/polyfill/mutation-observer.js
__fcd21ac78247116a0bdde5374b0c4641 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilDebounce = __afcda96357b2c6b7e23ccb9ac8b92f43;
  
  var _utilDebounce2 = _interopRequireDefault(_utilDebounce);
  
  var _utilElementContains = __6f793202bae98770dbb2b598df7929ad;
  
  var _utilElementContains2 = _interopRequireDefault(_utilElementContains);
  
  var _utilObjEach = __aa16eea962f403b3d0a38c93350a466d;
  
  var _utilObjEach2 = _interopRequireDefault(_utilObjEach);
  
  var Attr = window.Attr;
  var elementPrototype = window.HTMLElement.prototype;
  var NativeMutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
  var isFixingIe = false;
  var isIe = window.navigator.userAgent.indexOf('Trident') > -1;
  
  /**
   * Creates a new mutation record.
   *
   * @param {Element} target The HTML element that was affected.
   * @param {String} type The type of mutation.
   *
   * @returns {Object}
   */
  function newMutationRecord(target, type) {
    return {
      addedNodes: null,
      attributeName: null,
      attributeNamespace: null,
      nextSibling: null,
      oldValue: null,
      previousSibling: null,
      removedNodes: null,
      target: target,
      type: type || 'childList'
    };
  }
  
  /**
   * Takes an element and recursively saves it's tree structure on each element so
   * that they can be restored later after IE screws things up.
   *
   * @param {Node} node The node to save the tree for.
   *
   * @returns {undefined}
   */
  function walkTree(node, cb) {
    var childNodes = node.childNodes;
  
    if (!childNodes) {
      return;
    }
  
    var childNodesLen = childNodes.length;
  
    for (var a = 0; a < childNodesLen; a++) {
      var childNode = childNodes[a];
      cb(childNode);
      walkTree(childNode, cb);
    }
  }
  
  // Mutation Observer "Polyfill"
  // ----------------------------
  
  /**
   * This "polyfill" only polyfills what we need for Skate to function. It
   * batches updates and does the bare minimum during synchronous operation
   * which make mutation event performance bearable. The rest is batched on the
   * next tick. Like mutation observers, each mutation is divided into sibling
   * groups for each parent that had mutations. All attribute mutations are
   * batched into separate records regardless of the element they occured on.
   *
   * @param {Function} callback The callback to execute with the mutation info.
   *
   * @returns {undefined}
   */
  function MutationObserver(callback) {
    if (NativeMutationObserver && !isFixingIe) {
      return new NativeMutationObserver(callback);
    }
  
    this.callback = callback;
    this.elements = [];
  }
  
  /**
   * IE 11 has a bug that prevents descendant nodes from being reported as removed
   * to a mutation observer in IE 11 if an ancestor node's innerHTML is reset.
   * This same bug also happens when using Mutation Events in IE 9 / 10. Because of
   * this, we must ensure that observers and events get triggered properly on
   * those descendant nodes. In order to do this we have to override `innerHTML`
   * and then manually trigger an event.
   *
   * See: https://connect.microsoft.com/IE/feedback/details/817132/ie-11-childnodes-are-missing-from-mutationobserver-mutations-removednodes-after-setting-innerhtml
   *
   * @returns {undefined}
   */
  MutationObserver.fixIe = function () {
    // Fix once only if we need to.
    if (!isIe || isFixingIe) {
      return;
    }
  
    // We have to call the old innerHTML getter and setter.
    var oldInnerHTML = Object.getOwnPropertyDescriptor(elementPrototype, 'innerHTML');
  
    // This redefines the innerHTML property so that we can ensure that events
    // are properly triggered.
    Object.defineProperty(elementPrototype, 'innerHTML', {
      get: function get() {
        return oldInnerHTML.get.call(this);
      },
      set: function set(html) {
        walkTree(this, function (node) {
          var mutationEvent = document.createEvent('MutationEvent');
          mutationEvent.initMutationEvent('DOMNodeRemoved', true, false, null, null, null, null, null);
          node.dispatchEvent(mutationEvent);
        });
  
        oldInnerHTML.set.call(this, html);
      }
    });
  
    // Flag so the polyfill is used for all subsequent Mutation Observer objects.
    isFixingIe = true;
  };
  
  Object.defineProperty(MutationObserver, 'isFixingIe', {
    get: function get() {
      return isFixingIe;
    }
  });
  
  MutationObserver.prototype = {
    observe: function observe(target, options) {
      function addEventToBatch(e) {
        batchedEvents.push(e);
        batchEvents();
      }
  
      function batchEvent(e) {
        var eTarget = e.target;
  
        // In some test environments, e.target has been nulled after the tests
        // are done and a batch is still processing.
        if (!eTarget) {
          return;
        }
  
        var eType = e.type;
        var eTargetParent = eTarget.parentNode;
  
        if (!canTriggerInsertOrRemove(eTargetParent)) {
          return;
        }
  
        // The same bug that affects IE 11 also affects IE 9 / 10 with Mutation
        // Events.
        //
        // IE 11 bug: https://connect.microsoft.com/IE/feedback/details/817132/ie-11-childnodes-are-missing-from-mutationobserver-mutations-removednodes-after-setting-innerhtml
        var shouldWorkAroundIeRemoveBug = isFixingIe && eType === 'DOMNodeRemoved';
        var isDescendant = lastBatchedElement && lastBatchedElement.nodeType === 1 && (0, _utilElementContains2['default'])(lastBatchedElement, eTarget);
  
        // This checks to see if the element is contained in the last batched
        // element. If it is, then we don't batch it because elements are
        // batched into first-children of a given parent. However, IE is (of
        // course) an exception to this and destroys the DOM tree heirarchy
        // before the callback gets fired if the element was removed. Because of
        // this, we have to let through all descendants that had the event
        // triggered on it.
        if (!shouldWorkAroundIeRemoveBug && isDescendant) {
          return;
        }
  
        if (!lastBatchedRecord || lastBatchedRecord.target !== eTargetParent) {
          batchedRecords.push(lastBatchedRecord = newMutationRecord(eTargetParent));
        }
  
        if (eType === 'DOMNodeInserted') {
          if (!lastBatchedRecord.addedNodes) {
            lastBatchedRecord.addedNodes = [];
          }
  
          lastBatchedRecord.addedNodes.push(eTarget);
        } else {
          if (!lastBatchedRecord.removedNodes) {
            lastBatchedRecord.removedNodes = [];
          }
  
          lastBatchedRecord.removedNodes.push(eTarget);
        }
  
        lastBatchedElement = eTarget;
      }
  
      function canTriggerAttributeModification(eTarget) {
        return options.attributes && (options.subtree || eTarget === target);
      }
  
      function canTriggerInsertOrRemove(eTargetParent) {
        return options.childList && (options.subtree || eTargetParent === target);
      }
  
      var that = this;
  
      // Batching insert and remove.
      var lastBatchedElement;
      var lastBatchedRecord;
      var batchedEvents = [];
      var batchedRecords = [];
      var batchEvents = (0, _utilDebounce2['default'])(function () {
        var batchedEventsLen = batchedEvents.length;
  
        for (var a = 0; a < batchedEventsLen; a++) {
          batchEvent(batchedEvents[a]);
        }
  
        that.callback(batchedRecords);
        batchedEvents = [];
        batchedRecords = [];
        lastBatchedElement = undefined;
        lastBatchedRecord = undefined;
      });
  
      // Batching attributes.
      var attributeOldValueCache = {};
      var attributeMutations = [];
      var batchAttributeMods = (0, _utilDebounce2['default'])(function () {
        // We keep track of the old length just in case attributes are
        // modified within a handler.
        var len = attributeMutations.length;
  
        // Call the handler with the current modifications.
        that.callback(attributeMutations);
  
        // We remove only up to the current point just in case more
        // modifications were queued.
        attributeMutations.splice(0, len);
      });
  
      var observed = {
        target: target,
        options: options,
        insertHandler: addEventToBatch,
        removeHandler: addEventToBatch,
        attributeHandler: function attributeHandler(e) {
          var eTarget = e.target;
  
          if (!(e.relatedNode instanceof Attr)) {
            // IE10 fires two mutation events for attributes, one with the
            // target as the relatedNode, and one where it's the attribute.
            //
            // Re: relatedNode, "In the case of the DOMAttrModified event
            // it indicates the Attr node which was modified, added, or
            // removed." [1]
            //
            // [1]: https://msdn.microsoft.com/en-us/library/ff943606%28v=vs.85%29.aspx
            return;
          }
  
          if (!canTriggerAttributeModification(eTarget)) {
            return;
          }
  
          var eAttrName = e.attrName;
          var ePrevValue = e.prevValue;
          var eNewValue = e.newValue;
          var record = newMutationRecord(eTarget, 'attributes');
          record.attributeName = eAttrName;
  
          if (options.attributeOldValue) {
            record.oldValue = attributeOldValueCache[eAttrName] || ePrevValue || null;
          }
  
          attributeMutations.push(record);
  
          // We keep track of old values so that when IE incorrectly reports
          // the old value we can ensure it is actually correct.
          if (options.attributeOldValue) {
            attributeOldValueCache[eAttrName] = eNewValue;
          }
  
          batchAttributeMods();
        }
      };
  
      this.elements.push(observed);
  
      if (options.childList) {
        target.addEventListener('DOMNodeInserted', observed.insertHandler);
        target.addEventListener('DOMNodeRemoved', observed.removeHandler);
      }
  
      if (options.attributes) {
        target.addEventListener('DOMAttrModified', observed.attributeHandler);
      }
  
      return this;
    },
  
    disconnect: function disconnect() {
      (0, _utilObjEach2['default'])(this.elements, function (observed) {
        observed.target.removeEventListener('DOMNodeInserted', observed.insertHandler);
        observed.target.removeEventListener('DOMNodeRemoved', observed.removeHandler);
        observed.target.removeEventListener('DOMAttrModified', observed.attributeHandler);
      });
  
      this.elements = [];
  
      return this;
    }
  };
  
  exports['default'] = MutationObserver;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/polyfill/document-observer.js
__53affcee25439c12726058fee7f75787 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _lifecycleAttached = __2b55a083f45c9ef157662a1dc1674218;
  
  var _lifecycleAttached2 = _interopRequireDefault(_lifecycleAttached);
  
  var _lifecycleCreated = __fe1aef0db5b664068b470b21f7c754a5;
  
  var _lifecycleCreated2 = _interopRequireDefault(_lifecycleCreated);
  
  var _lifecycleDetached = __8e93439e8a566d1586c9903a75a6a785;
  
  var _lifecycleDetached2 = _interopRequireDefault(_lifecycleDetached);
  
  var _globals = __906dce814f2e16e7f80d2aa958aa9ac6;
  
  var _globals2 = _interopRequireDefault(_globals);
  
  var _utilIgnored = __092f8936e5006bddcb3baf24320a5a06;
  
  var _utilIgnored2 = _interopRequireDefault(_utilIgnored);
  
  var _mutationObserver = __fcd21ac78247116a0bdde5374b0c4641;
  
  var _mutationObserver2 = _interopRequireDefault(_mutationObserver);
  
  var _registry = __270cb854b3681e4b614f772d24705d53;
  
  var _registry2 = _interopRequireDefault(_registry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  var DocumentFragment = window.DocumentFragment;
  
  function getClosestIgnoredElement(element) {
    var parent = element;
  
    while (parent && parent !== document && !(parent instanceof DocumentFragment)) {
      if ((0, _utilIgnored2['default'])(parent)) {
        return parent;
      }
  
      parent = parent.parentNode;
    }
  }
  
  function documentObserverHandler(mutations) {
    var mutationsLen = mutations.length;
  
    for (var a = 0; a < mutationsLen; a++) {
      var mutation = mutations[a];
      var addedNodes = mutation.addedNodes;
      var removedNodes = mutation.removedNodes;
  
      // Since siblings are batched together, we check the first node's parent
      // node to see if it is ignored. If it is then we don't process any added
      // nodes. This prevents having to check every node.
      if (addedNodes && addedNodes.length && !getClosestIgnoredElement(addedNodes[0].parentNode)) {
        (0, _utilWalkTree2['default'])(addedNodes, function (element) {
          var components = _registry2['default'].getForElement(element);
          var componentsLength = components.length;
  
          for (var _a = 0; _a < componentsLength; _a++) {
            (0, _lifecycleCreated2['default'])(components[_a]).call(element);
          }
  
          for (var _a2 = 0; _a2 < componentsLength; _a2++) {
            (0, _lifecycleAttached2['default'])(components[_a2]).call(element);
          }
        });
      }
  
      // We can't check batched nodes here because they won't have a parent node.
      if (removedNodes && removedNodes.length) {
        (0, _utilWalkTree2['default'])(removedNodes, function (element) {
          var components = _registry2['default'].getForElement(element);
          var componentsLength = components.length;
  
          for (var _a3 = 0; _a3 < componentsLength; _a3++) {
            (0, _lifecycleDetached2['default'])(components[_a3]).call(element);
          }
        });
      }
    }
  }
  
  function createDocumentObserver() {
    var observer = new _mutationObserver2['default'](documentObserverHandler);
  
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  
    return observer;
  }
  
  exports['default'] = _globals2['default'].registerIfNotExists('observer', {
    observer: undefined,
    register: function register() {
      if (!this.observer) {
        _mutationObserver2['default'].fixIe();
        this.observer = createDocumentObserver();
      }
  
      return this;
    },
    unregister: function unregister() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = undefined;
      }
  
      return this;
    }
  });
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/polyfill/element-constructor.js
__2a9c84628af99934db58f308e303b691 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  var _constants = __22848e6eb5ddd68722bf2a03dc73e10d;
  
  var DEFAULT_ELEMENT = 'div';
  
  function createElement(options) {
    var element;
    var id = options.id;
    var parent = options['extends'];
    var type = options.type;
  
    // Allow all types of components to be constructed.
    if (type === _constants.TYPE_ELEMENT) {
      element = document.createElement(parent || id);
      if (parent) {
        element.setAttribute('is', id);
      }
    } else {
      element = document.createElement(parent || DEFAULT_ELEMENT);
  
      if (type === _constants.TYPE_ATTRIBUTE) {
        element.setAttribute(id, '');
      } else if (type === _constants.TYPE_CLASSNAME) {
        element.className = id;
      }
    }
  
    return element;
  }
  
  exports['default'] = function (options) {
    function CustomElement() {
      var element = createElement(options);
  
      // Ensure the definition prototype is up to date with the element's
      // prototype. This ensures that overwriting the element prototype still
      // works.
      options.prototype = CustomElement.prototype;
  
      // Initialises. This will always exist.
      options.prototype.createdCallback.call(element);
  
      return element;
    }
  
    // This allows modifications to the element prototype propagate to the
    // definition prototype.
    CustomElement.prototype = options.prototype;
  
    return CustomElement;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/support/custom-elements.js
__c6f5e18624750ce93a74df6369c85ef0 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  exports['default'] = function () {
    return typeof document.registerElement === 'function';
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/support/valid-custom-element.js
__6e1dfed2b03894ef63a4b65d5038d223 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  exports['default'] = function (name) {
    return name.indexOf('-') > 0;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/index.js
__abb93179bdc0236a6e77d3eae07c991c = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _constants = __22848e6eb5ddd68722bf2a03dc73e10d;
  
  var _apiCreate = __1675a7174b713323cc232370699a2714;
  
  var _apiCreate2 = _interopRequireDefault(_apiCreate);
  
  var _apiInit = __3add36046399fead5a83243849207ed7;
  
  var _apiInit2 = _interopRequireDefault(_apiInit);
  
  var _apiNoConflict = __82110da8eb4359fb9724f67f4a12febe;
  
  var _apiNoConflict2 = _interopRequireDefault(_apiNoConflict);
  
  var _apiType = __df5112248641660374a4ff3deedcb65e;
  
  var _apiType2 = _interopRequireDefault(_apiType);
  
  var _apiVersion = __662bde51c096e9d79bf327311ea178e0;
  
  var _apiVersion2 = _interopRequireDefault(_apiVersion);
  
  var _utilAssign = __d48ab0568b1578e9cac74e66baa6d3e7;
  
  var _utilAssign2 = _interopRequireDefault(_utilAssign);
  
  var _lifecycleAttached = __2b55a083f45c9ef157662a1dc1674218;
  
  var _lifecycleAttached2 = _interopRequireDefault(_lifecycleAttached);
  
  var _lifecycleAttributes = __3339c2eaf2c9e70f911dc8b9c3de6522;
  
  var _lifecycleAttributes2 = _interopRequireDefault(_lifecycleAttributes);
  
  var _lifecycleCreated = __fe1aef0db5b664068b470b21f7c754a5;
  
  var _lifecycleCreated2 = _interopRequireDefault(_lifecycleCreated);
  
  var _utilDashCase = __0cd264077c1ca567539d11e826d3c00e;
  
  var _utilDashCase2 = _interopRequireDefault(_utilDashCase);
  
  var _utilDebounce = __afcda96357b2c6b7e23ccb9ac8b92f43;
  
  var _utilDebounce2 = _interopRequireDefault(_utilDebounce);
  
  var _defaults = __46b087e8c15b2e0ebc2c4d4cbc36d975;
  
  var _defaults2 = _interopRequireDefault(_defaults);
  
  var _lifecycleDetached = __8e93439e8a566d1586c9903a75a6a785;
  
  var _lifecycleDetached2 = _interopRequireDefault(_lifecycleDetached);
  
  var _polyfillDocumentObserver = __53affcee25439c12726058fee7f75787;
  
  var _polyfillDocumentObserver2 = _interopRequireDefault(_polyfillDocumentObserver);
  
  var _polyfillElementConstructor = __2a9c84628af99934db58f308e303b691;
  
  var _polyfillElementConstructor2 = _interopRequireDefault(_polyfillElementConstructor);
  
  var _polyfillRegistry = __270cb854b3681e4b614f772d24705d53;
  
  var _polyfillRegistry2 = _interopRequireDefault(_polyfillRegistry);
  
  var _supportCustomElements = __c6f5e18624750ce93a74df6369c85ef0;
  
  var _supportCustomElements2 = _interopRequireDefault(_supportCustomElements);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  var _supportValidCustomElement = __6e1dfed2b03894ef63a4b65d5038d223;
  
  var _supportValidCustomElement2 = _interopRequireDefault(_supportValidCustomElement);
  
  function initDocument() {
    (0, _utilWalkTree2['default'])(document.documentElement.childNodes, function (element) {
      var components = _polyfillRegistry2['default'].getForElement(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        (0, _lifecycleCreated2['default'])(components[a]).call(element);
      }
  
      for (var a = 0; a < componentsLength; a++) {
        (0, _lifecycleAttached2['default'])(components[a]).call(element);
      }
    });
  }
  
  function initDocumentWhenReady() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initDocument();
    } else {
      document.addEventListener('DOMContentLoaded', initDocument);
    }
  }
  
  function dashCaseAttributeNames(options) {
    for (var _name in options.attributes) {
      var dashCasedName = (0, _utilDashCase2['default'])(_name);
  
      // We only need to define a new attribute if the name is actually different.
      if (_name !== dashCasedName) {
        options.attributes[dashCasedName] = options.attributes[_name];
  
        // We define a non-enumerable property that links the camelCased version
        // to the dash-cased version just in case it's referred to in either form.
        // It is non-enumerable so that there are no duplicate names attributes
        // during enumeration and that the ones that are enumerable are the
        // dash-cased versions.
        Object.defineProperty(options.attributes, _name, {
          enumerable: false,
          get: function get() {
            return options.attributes[dashCasedName];
          }
        });
      }
    }
  }
  
  function makeOptions(userOptions) {
    var options = (0, _utilAssign2['default'])({}, _defaults2['default']);
  
    // Copy over all standard options if the user has defined them.
    for (var _name2 in _defaults2['default']) {
      if (userOptions[_name2] !== undefined) {
        options[_name2] = userOptions[_name2];
      }
    }
  
    // Copy over non-standard options.
    for (var _name3 in userOptions) {
      options[_name3] = userOptions[_name3];
    }
  
    dashCaseAttributeNames(options);
  
    return options;
  }
  
  var debouncedInitDocumentWhenReady = (0, _utilDebounce2['default'])(initDocumentWhenReady);
  var HTMLElement = window.HTMLElement;
  
  function skate(id, userOptions) {
    var Ctor, CtorParent, isElement, isNative;
    var options = makeOptions(userOptions);
  
    CtorParent = options['extends'] ? document.createElement(options['extends']).constructor : HTMLElement;
    isElement = options.type === _constants.TYPE_ELEMENT;
    isNative = isElement && (0, _supportCustomElements2['default'])() && (0, _supportValidCustomElement2['default'])(id);
  
    // Inherit from parent prototype.
    if (!CtorParent.prototype.isPrototypeOf(options.prototype)) {
      options.prototype = (0, _utilAssign2['default'])(Object.create(CtorParent.prototype), options.prototype);
    }
  
    // Extend behaviour of existing callbacks.
    options.prototype.createdCallback = (0, _lifecycleCreated2['default'])(options);
    options.prototype.attachedCallback = (0, _lifecycleAttached2['default'])(options);
    options.prototype.detachedCallback = (0, _lifecycleDetached2['default'])(options);
    options.prototype.attributeChangedCallback = (0, _lifecycleAttributes2['default'])(options);
    Object.defineProperty(options, 'id', {
      configurable: false,
      value: id,
      writable: false
    });
  
    // Make a constructor for the definition.
    if (isNative) {
      Ctor = document.registerElement(id, options);
    } else {
      Ctor = (0, _polyfillElementConstructor2['default'])(options);
      debouncedInitDocumentWhenReady();
      _polyfillDocumentObserver2['default'].register();
    }
  
    (0, _utilAssign2['default'])(Ctor, options);
    _polyfillRegistry2['default'].set(id, Ctor);
    Object.defineProperty(Ctor.prototype, 'constructor', {
      enumerable: false,
      value: Ctor
    });
  
    return Ctor;
  }
  
  skate.create = _apiCreate2['default'];
  skate.init = _apiInit2['default'];
  skate.noConflict = _apiNoConflict2['default'];
  skate.type = _apiType2['default'];
  skate.version = _apiVersion2['default'];
  
  // Global
  window.skate = skate;
  
  // ES6
  exports['default'] = skate;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);