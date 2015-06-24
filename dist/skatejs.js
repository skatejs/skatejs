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
  var TYPE_ATTRIBUTE = 'attribute';
  exports.TYPE_ATTRIBUTE = TYPE_ATTRIBUTE;
  var TYPE_CLASSNAME = 'classname';
  exports.TYPE_CLASSNAME = TYPE_CLASSNAME;
  var TYPE_ELEMENT = 'element';
  exports.TYPE_ELEMENT = TYPE_ELEMENT;
  
  return module.exports;
}).call(this);

// src/api/chain.js
__4f25f0faaaf0c53e145c08c5d91c9c2b = (function () {
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
    var _this = this;
  
    for (var _len = arguments.length, cbs = Array(_len), _key = 0; _key < _len; _key++) {
      cbs[_key] = arguments[_key];
    }
  
    cbs = cbs.filter(Boolean).map(function (cb) {
      // Strings point to a function on the context passed to the proxy fn.
      if (typeof cb === 'string') {
        return function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
  
          if (typeof this[cb] === 'function') {
            this[cb].apply(this, args);
          }
        };
      }
  
      // Arrays are passed through and object values become an array of values.
      if (typeof cb === 'object') {
        cb = Array.isArray(cb) ? cb : Object.keys(cb).map(function (key) {
          return cb[key];
        });
        return chain.apply(_this, cb);
      }
  
      return cb;
    });
  
    return function () {
      var _this2 = this;
  
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
  
      cbs.forEach(function (cb) {
        return cb.apply(_this2, args);
      });
      return this;
    };
  }
  
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
      return Object.keys(parent || {}).forEach(function (name) {
        return child[name] = parent[name];
      });
    });
    return child;
  };
  
  module.exports = exports["default"];
  
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
  
  function callAttachedOnDescendants(elem, opts) {
    (0, _utilWalkTree2['default'])(elem.childNodes, function (elem) {
      _polyfillRegistry2['default'].getForElement(elem).forEach(function (Ctor) {
        return Ctor.prototype.createdCallback.call(elem);
      });
    }, function (elem) {
      return !(0, _utilData2['default'])(elem, opts.id).attached;
    });
  }
  
  function callAttached(elem, opts) {
    if (opts.attached) {
      opts.attached.call(elem);
    }
  }
  
  exports['default'] = function (opts) {
    /* jshint expr: true */
    return function () {
      var info = (0, _utilData2['default'])(this, opts.id);
      var isNative = this.attachedCallback;
  
      if (info.attached) {
        return;
      }
  
      isNative || callAttachedOnDescendants(this, opts);
      info.attached = true;
      callAttached(this, opts);
      info.detached = false;
    };
  };
  
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

// src/api/event.js
__6bf39bed4ad969dbb83d42a8ba2be197 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _chain = __4f25f0faaaf0c53e145c08c5d91c9c2b;
  
  var _chain2 = _interopRequireDefault(_chain);
  
  var _utilMatchesSelector = __365bd8b7bbfb2b50d6dbfd830f0aa927;
  
  var _utilMatchesSelector2 = _interopRequireDefault(_utilMatchesSelector);
  
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
        if ((0, _utilMatchesSelector2['default'])(current, delegate)) {
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
    handler = (0, _chain2['default'])(handler).bind(elem);
    handler = delegate ? makeDelegateHandler(elem, handler, delegate) : makeNormalHandler(elem, handler);
    elem.addEventListener(name, handler, capture);
  }
  
  function bindEvents(elem, events) {
    Object.keys(events).forEach(function (name) {
      bindEvent(elem, name, events[name]);
    });
  }
  
  exports['default'] = function (elem, events, handler) {
    if (typeof events === 'string') {
      bindEvent(elem, events, handler);
    } else {
      bindEvents(elem, events || {});
    }
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/util/assign-safe.js
__d9d26492984e649e5130081ad32bafd6 = (function () {
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
      Object.getOwnPropertyNames(parent || {}).forEach(function (name) {
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

// src/api/emit.js
__639a0d2e0f8a90cd72e6197bdb481558 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var CustomEvent = window.CustomEvent;
  
  if (CustomEvent) {
    try {
      new CustomEvent();
    } catch (e) {
      CustomEvent = undefined;
    }
  }
  
  function createCustomEvent(name, opts) {
    if (CustomEvent) {
      return new CustomEvent(name, opts);
    }
  
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
    return e;
  }
  
  function emitOne(elem, name, opts) {
    /* jshint expr: true */
    opts.bubbles === undefined && (opts.bubbles = true);
    opts.cancelable === undefined && (opts.cancelable = true);
    return elem.dispatchEvent(createCustomEvent(name, opts));
  }
  
  function emitAll(elem, name, opts) {
    var names = typeof name === 'string' ? name.split(' ') : name;
    return names.reduce(function (prev, curr) {
      if (!emitOne(elem, curr, opts)) {
        prev.push(curr);
      }
      return prev;
    }, []);
  }
  
  function emitFn(name, opts) {
    return function () {
      return emitAll(this, name, opts);
    };
  }
  
  exports['default'] = function (elem) {
    var name = arguments[1] === undefined ? {} : arguments[1];
    var opts = arguments[2] === undefined ? {} : arguments[2];
  
    return typeof elem === 'string' ? emitFn(elem, name) : emitAll(elem, name, opts);
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/api/property.js
__f57aa4e0179bb8c6b45d999112238add = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilAssignSafe = __d9d26492984e649e5130081ad32bafd6;
  
  var _utilAssignSafe2 = _interopRequireDefault(_utilAssignSafe);
  
  var _utilDashCase = __0cd264077c1ca567539d11e826d3c00e;
  
  var _utilDashCase2 = _interopRequireDefault(_utilDashCase);
  
  var _utilData = __18291b0452e01f65cf28d6695040736a;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _emit = __639a0d2e0f8a90cd72e6197bdb481558;
  
  var _emit2 = _interopRequireDefault(_emit);
  
  /* jshint expr: true */
  function notify(elem, notifyName, propName) {
    var detail = arguments[3] === undefined ? {} : arguments[3];
  
    // Notifications must *always* have:
    // - name
    // - newValue
    // - oldValue
    // but may contain other information.
    detail.name = propName;
    detail.newValue === undefined && (detail.newValue = elem[propName]);
    detail.oldValue === undefined && (detail.oldValue = elem[propName]);
  
    (0, _emit2['default'])(elem, notifyName, {
      bubbles: true,
      cancelable: false,
      detail: detail
    });
  }
  
  function property(name, prop) {
    var internalGetter, internalSetter, internalValue, isBoolean;
  
    if (typeof prop === 'object') {
      prop = (0, _utilAssignSafe2['default'])({}, prop);
    } else {
      prop = { type: prop };
    }
  
    if (prop.attr === true) {
      prop.attr = (0, _utilDashCase2['default'])(name);
    }
  
    if (typeof prop.deps === 'string') {
      prop.deps = prop.deps.split(' ');
    }
  
    if (!Array.isArray(prop.deps)) {
      prop.deps = [];
    }
  
    if (prop.notify === undefined) {
      prop.notify = true;
    }
  
    if (prop.notify === true) {
      prop.notify = 'skate.property';
    }
  
    if (typeof prop.type !== 'function') {
      prop.type = function (val) {
        return val;
      };
    }
  
    internalGetter = prop.get;
    internalSetter = prop.set;
    isBoolean = prop.type && prop.type === Boolean;
    delete prop.value;
  
    prop.get = function () {
      return internalGetter ? internalGetter.apply(this) : internalValue;
    };
  
    prop.set = function (value) {
      var info = (0, _utilData2['default'])(this);
  
      // If the property is being updated and it is a boolean we must just check
      // if the attribute exists because "" is true for a boolean attribute.
      if (info.updatingProperty && isBoolean) {
        value = this.hasAttribute(prop.attr);
      }
  
      // We report both new and old values;
      var newValue = prop.type(value);
      var oldValue = this[name];
  
      // Regardless of any options, we store the value internally.
      internalValue = newValue;
  
      // We check first to see if we're already updating the property from
      // the attribute. If we are, then there's no need to update the attribute
      // especially because it would invoke an infinite loop.
      if (prop.attr && !info.updatingProperty) {
        info.updatingAttribute = true;
  
        if (isBoolean && internalValue) {
          this.setAttribute(prop.attr, '');
        } else if (isBoolean && !internalValue) {
          this.removeAttribute(prop.attr, '');
        } else {
          this.setAttribute(prop.attr, internalValue);
        }
  
        info.updatingAttribute = false;
      }
  
      // A setter is responsible for setting its own value. We still store the
      // value internally because the default getter may still be used to return
      // that value. Even if it's not, we use it to reference the old value which
      // is useful information for the setter.
      if (internalSetter) {
        internalSetter.call(this, newValue, oldValue);
      }
  
      if (prop.notify) {
        notify(this, prop.notify, name, {
          newValue: newValue,
          oldValue: oldValue
        });
      }
    };
  
    return prop;
  }
  
  function makePropertyHandler(elem, name, depPath, depName) {
    return function (e) {
      if (depName !== e.detail.name) {
        return;
      }
  
      var target = elem;
  
      // Resolve the dependency element from the dependecy path. If no path
      // exists, this will continue to be the main element. If the path
      // points to a non-element, then it's a no-op.
      depPath.forEach(function (part) {
        target = elem && elem[part];
      });
  
      // If the event bubbled, ensure that it doesn't call any handlers for
      // the same property on main element.
      if (elem !== e.target) {
        e.stopImmediatePropagation();
      }
  
      // Only notify of changes if the main element, or the element matched by
      // the dependency path, matches the target that triggered the event.
      if (target === e.target) {
        // We get and set the property so that logic in the getter and setter
        // get invoked. When the setter is invoked, it automatically notifies
        // any dependencies.
        elem[name] = elem[name];
      }
    };
  }
  
  function defineProperty(elem, name, prop) {
    // We don't need to scope the data to the component ID be cause if multiple
    // bindings on the same component define the same attribute, then they'd
    // conflict anyways.
    var info = (0, _utilData2['default'])(elem);
    var value = prop && prop.value !== 'undefined' ? prop.value : undefined;
  
    if (!info.attributeToPropertyMap) {
      info.attributeToPropertyMap = {};
    }
  
    prop = property(name, prop);
    Object.defineProperty(elem, name, prop);
  
    // Initialise the value if a initial value was provided. Attributes that exist
    // on the element should trump any default values that are provided.
    if (value !== undefined && (!prop.attr || !elem.hasAttribute(prop.attr))) {
      elem[name] = typeof value === 'function' ? value.call(elem) : value;
    }
  
    // This ensures that the corresponding attribute will know to update this
    // property when it is set.
    if (prop.attr) {
      info.attributeToPropertyMap[prop.attr] = name;
    }
  
    // If you aren't notifying of property changes, then dependencies aren't
    // listened to.
    if (prop.notify) {
      prop.deps.forEach(function (dep) {
        var depPath = dep.split('.');
        var depName = depPath.pop();
        elem.addEventListener(prop.notify, makePropertyHandler(elem, name, depPath, depName));
      });
    }
  }
  
  function defineProperties(elem, props) {
    Object.keys(props).forEach(function (name) {
      defineProperty(elem, name, props[name]);
    });
  }
  
  exports['default'] = function (elem) {
    var props = arguments[1] === undefined ? {} : arguments[1];
    var prop = arguments[2] === undefined ? {} : arguments[2];
  
    if (typeof props === 'string') {
      defineProperty(elem, props, prop);
    } else {
      defineProperties(elem, props);
    }
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
  
  var _apiEvent = __6bf39bed4ad969dbb83d42a8ba2be197;
  
  var _apiEvent2 = _interopRequireDefault(_apiEvent);
  
  var _apiProperty = __f57aa4e0179bb8c6b45d999112238add;
  
  var _apiProperty2 = _interopRequireDefault(_apiProperty);
  
  var _utilAssignSafe = __d9d26492984e649e5130081ad32bafd6;
  
  var _utilAssignSafe2 = _interopRequireDefault(_utilAssignSafe);
  
  var _utilData = __18291b0452e01f65cf28d6695040736a;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
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
    var attrsLength = attrs.length;
    for (var a = 0; a < attrsLength; a++) {
      var attr = attrs[a];
      elem.attributeChangedCallback(attr.name, null, attr.value);
    }
  }
  
  function markAsResolved(elem, opts) {
    elem.removeAttribute(opts.unresolvedAttribute);
    elem.setAttribute(opts.resolvedAttribute, '');
  }
  
  function applyPrototype(elem, opts) {
    (0, _utilProtos2['default'])(opts.prototype).forEach(function (proto) {
      if (!proto.isPrototypeOf(elem)) {
        (0, _utilAssignSafe2['default'])(elem, proto);
      }
    });
  }
  
  function template(elem, opts) {
    if (opts.template && !elem.hasAttribute(opts.resolvedAttribute)) {
      opts.template.call(elem);
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
      opts.created.call(elem);
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
      (0, _apiProperty2['default'])(this, opts.properties);
      template(this, opts);
      isNative || callCreatedOnDescendants(this, opts);
      isNative || patchAttributeMethods(this);
      (0, _apiEvent2['default'])(this, opts.events);
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
  
  var _utilAssign = __d48ab0568b1578e9cac74e66baa6d3e7;
  
  var _utilAssign2 = _interopRequireDefault(_utilAssign);
  
  var _init = __3add36046399fead5a83243849207ed7;
  
  var _init2 = _interopRequireDefault(_init);
  
  var _polyfillRegistry = __270cb854b3681e4b614f772d24705d53;
  
  var _polyfillRegistry2 = _interopRequireDefault(_polyfillRegistry);
  
  var specialMap = {
    caption: 'table',
    dd: 'dl',
    dt: 'dl',
    li: 'ul',
    tbody: 'table',
    td: 'tr',
    thead: 'table',
    tr: 'tbody'
  };
  
  function matchTag(dom) {
    var tag = dom.match(/\s*<([^\s>]+)/);
    return tag && tag[1] || 'div';
  }
  
  function resolveCorrectTagParents(tag) {
    var mapped;
    var parent = document.createElement(tag);
  
    while (mapped = specialMap[parent.tagName.toLowerCase()]) {
      var tempParent = document.createElement(mapped);
      tempParent.appendChild(parent);
      parent = tempParent;
    }
  
    return parent;
  }
  
  function createFromHtml(html) {
    var par = resolveCorrectTagParents(matchTag(html));
    par.innerHTML = html;
    return (0, _init2['default'])(par.firstElementChild);
  }
  
  function createFromName(name) {
    var ctor = _polyfillRegistry2['default'].get(name);
    return ctor && ctor() || document.createElement(name);
  }
  
  exports['default'] = function (name, props) {
    name = name.trim();
    return (0, _utilAssign2['default'])(name[0] === '<' ? createFromHtml(name) : createFromName(name), props);
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

// src/api/ready.js
__83ca289f5309abef55c338a9f7a22385 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  exports['default'] = function (callback) {
    if (document.readyState === 'complete') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  };
  
  module.exports = exports['default'];
  
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
        var eTargetParent = eType === 'DOMNodeInserted' || eType === 'DOMNodeRemoved' ? e.relatedNode : eTarget.parentNode;
  
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
  
  // Fix IE because IE.
  (function () {
    if (!isIe) {
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
  })();
  
  exports['default'] = MutationObserver;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/api/watch.js
__4390c5a519e11ff146587075b0e7abac = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _polyfillMutationObserver = __fcd21ac78247116a0bdde5374b0c4641;
  
  var _polyfillMutationObserver2 = _interopRequireDefault(_polyfillMutationObserver);
  
  exports['default'] = function (elem, callback) {
    var opts = arguments[2] === undefined ? {} : arguments[2];
  
    var observer = new _polyfillMutationObserver2['default'](function (mutations) {
      mutations.forEach(function (mutation) {
        callback(mutation.addedNodes || [], mutation.removedNodes || []);
      });
    });
  
    observer.observe(elem, {
      childList: true,
      subtree: opts.subtree
    });
  
    return observer;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/lifecycle/attribute.js
__9f17962f9aa326a94ed3e5d6f6b172e6 = (function () {
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
  
  exports['default'] = function (opts) {
    var callback = opts.attribute;
  
    /* jshint expr: true */
    return function (name, oldValue, newValue) {
      var info = (0, _utilData2['default'])(this);
      var attributeToPropertyMap = info.attributeToPropertyMap || {};
  
      // Only call a callback if one was specified.
      typeof callback === 'function' && callback.call(this, name, oldValue, newValue);
  
      // Ensure properties are notified of this change. We only do this if we're
      // not already updating the attribute from the property. This is so that
      // we don't invoke an infinite loop.
      if (attributeToPropertyMap[name] && !info.updatingAttribute) {
        info.updatingProperty = true;
        this[attributeToPropertyMap[name]] = newValue;
        info.updatingProperty = false;
      }
    };
  };
  
  module.exports = exports['default'];
  
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
  
  function callDetachedOnDescendants(elem, opts) {
    (0, _utilWalkTree2['default'])(elem.childNodes, function (elem) {
      _polyfillRegistry2['default'].getForElement(elem).forEach(function (Ctor) {
        return Ctor.prototype.createdCallback.call(elem);
      });
    }, function (elem) {
      return !(0, _utilData2['default'])(elem, opts.id).detached;
    });
  }
  
  function callDetached(elem, opts) {
    if (opts.detached) {
      opts.detached.call(elem);
    }
  }
  
  exports['default'] = function (opts) {
    /* jshint expr: true */
    return function () {
      var info = (0, _utilData2['default'])(this, opts.id);
      var isNative = this.detachedCallback;
  
      if (info.detached) {
        return;
      }
  
      isNative || callDetachedOnDescendants(this, opts);
      info.detached = true;
      callDetached(this, opts);
      info.attached = false;
    };
  };
  
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
  
  var _apiWatch = __4390c5a519e11ff146587075b0e7abac;
  
  var _apiWatch2 = _interopRequireDefault(_apiWatch);
  
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
  
  function documentObserverHandler(addedNodes, removedNodes) {
    // Since siblings are batched together, we check the first node's parent
    // node to see if it is ignored. If it is then we don't process any added
    // nodes. This prevents having to check every node.
    if (addedNodes.length && !getClosestIgnoredElement(addedNodes[0].parentNode)) {
      (0, _utilWalkTree2['default'])(addedNodes, function (element) {
        var components = _registry2['default'].getForElement(element);
        var componentsLength = components.length;
  
        for (var a = 0; a < componentsLength; a++) {
          (0, _lifecycleCreated2['default'])(components[a]).call(element);
        }
  
        for (var a = 0; a < componentsLength; a++) {
          (0, _lifecycleAttached2['default'])(components[a]).call(element);
        }
      });
    }
  
    // We can't check batched nodes here because they won't have a parent node.
    if (removedNodes.length) {
      (0, _utilWalkTree2['default'])(removedNodes, function (element) {
        var components = _registry2['default'].getForElement(element);
        var componentsLength = components.length;
  
        for (var a = 0; a < componentsLength; a++) {
          (0, _lifecycleDetached2['default'])(components[a]).call(element);
        }
      });
    }
  }
  
  exports['default'] = _globals2['default'].registerIfNotExists('observer', {
    observer: undefined,
    register: function register() {
      if (!this.observer) {
        this.observer = (0, _apiWatch2['default'])(document, documentObserverHandler, { subtree: true });
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
  
  var _apiChain = __4f25f0faaaf0c53e145c08c5d91c9c2b;
  
  var _apiChain2 = _interopRequireDefault(_apiChain);
  
  var _apiCreate = __1675a7174b713323cc232370699a2714;
  
  var _apiCreate2 = _interopRequireDefault(_apiCreate);
  
  var _apiEmit = __639a0d2e0f8a90cd72e6197bdb481558;
  
  var _apiEmit2 = _interopRequireDefault(_apiEmit);
  
  var _apiEvent = __6bf39bed4ad969dbb83d42a8ba2be197;
  
  var _apiEvent2 = _interopRequireDefault(_apiEvent);
  
  var _apiInit = __3add36046399fead5a83243849207ed7;
  
  var _apiInit2 = _interopRequireDefault(_apiInit);
  
  var _apiNoConflict = __82110da8eb4359fb9724f67f4a12febe;
  
  var _apiNoConflict2 = _interopRequireDefault(_apiNoConflict);
  
  var _apiProperty = __f57aa4e0179bb8c6b45d999112238add;
  
  var _apiProperty2 = _interopRequireDefault(_apiProperty);
  
  var _apiReady = __83ca289f5309abef55c338a9f7a22385;
  
  var _apiReady2 = _interopRequireDefault(_apiReady);
  
  var _apiType = __df5112248641660374a4ff3deedcb65e;
  
  var _apiType2 = _interopRequireDefault(_apiType);
  
  var _apiVersion = __662bde51c096e9d79bf327311ea178e0;
  
  var _apiVersion2 = _interopRequireDefault(_apiVersion);
  
  var _apiWatch = __4390c5a519e11ff146587075b0e7abac;
  
  var _apiWatch2 = _interopRequireDefault(_apiWatch);
  
  var _utilAssign = __d48ab0568b1578e9cac74e66baa6d3e7;
  
  var _utilAssign2 = _interopRequireDefault(_utilAssign);
  
  var _utilAssignSafe = __d9d26492984e649e5130081ad32bafd6;
  
  var _utilAssignSafe2 = _interopRequireDefault(_utilAssignSafe);
  
  var _lifecycleAttached = __2b55a083f45c9ef157662a1dc1674218;
  
  var _lifecycleAttached2 = _interopRequireDefault(_lifecycleAttached);
  
  var _lifecycleAttribute = __9f17962f9aa326a94ed3e5d6f6b172e6;
  
  var _lifecycleAttribute2 = _interopRequireDefault(_lifecycleAttribute);
  
  var _lifecycleCreated = __fe1aef0db5b664068b470b21f7c754a5;
  
  var _lifecycleCreated2 = _interopRequireDefault(_lifecycleCreated);
  
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
    (0, _apiReady2['default'])(initDocument);
  }
  
  function makeOptions(userOptions) {
    var options = (0, _utilAssignSafe2['default'])({}, _defaults2['default']);
  
    // Copy over all standard options if the user has defined them.
    for (var _name in _defaults2['default']) {
      if (userOptions[_name] !== undefined) {
        options[_name] = userOptions[_name];
      }
    }
  
    // Copy over non-standard options.
    for (var _name2 in userOptions) {
      options[_name2] = userOptions[_name2];
    }
  
    return options;
  }
  
  function makeNonNewableWrapper(Ctor) {
    var CtorWrapper = function CtorWrapper() {
      var props = arguments[0] === undefined ? {} : arguments[0];
  
      return (0, _utilAssign2['default'])(new Ctor(), props);
    };
    CtorWrapper.prototype = Ctor.prototype;
    return CtorWrapper;
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
      options.prototype = (0, _utilAssignSafe2['default'])(Object.create(CtorParent.prototype), options.prototype);
    }
  
    // Extend behaviour of existing callbacks.
    options.prototype.createdCallback = (0, _lifecycleCreated2['default'])(options);
    options.prototype.attachedCallback = (0, _lifecycleAttached2['default'])(options);
    options.prototype.detachedCallback = (0, _lifecycleDetached2['default'])(options);
    options.prototype.attributeChangedCallback = (0, _lifecycleAttribute2['default'])(options);
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
  
    Ctor = makeNonNewableWrapper(Ctor);
    (0, _utilAssignSafe2['default'])(Ctor, options);
    _polyfillRegistry2['default'].set(id, Ctor);
    Object.defineProperty(Ctor.prototype, 'constructor', {
      enumerable: false,
      value: Ctor
    });
  
    return Ctor;
  }
  
  skate.chain = _apiChain2['default'];
  skate.create = _apiCreate2['default'];
  skate.emit = _apiEmit2['default'];
  skate.event = _apiEvent2['default'];
  skate.init = _apiInit2['default'];
  skate.noConflict = _apiNoConflict2['default'];
  skate.property = _apiProperty2['default'];
  skate.ready = _apiReady2['default'];
  skate.type = _apiType2['default'];
  skate.version = _apiVersion2['default'];
  skate.watch = _apiWatch2['default'];
  
  // Global
  window.skate = skate;
  
  // ES6
  exports['default'] = skate;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);