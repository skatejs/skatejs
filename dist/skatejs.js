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
    var namespace = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
  
    var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
    return namespace && (data[namespace] || (data[namespace] = {})) || data;
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
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilElementContains = __6f793202bae98770dbb2b598df7929ad;
  
  var _utilElementContains2 = _interopRequireDefault(_utilElementContains);
  
  var CustomEvent = window.CustomEvent;
  var hasBubbleOnDetachedElements = false;
  
  // Detect support for using the CustomElement constructor.
  if (CustomEvent) {
    try {
      new CustomEvent();
    } catch (e) {
      CustomEvent = undefined;
    }
  }
  
  // Common way for constructing a new custom event.
  function createCustomEvent(name) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  
    if (CustomEvent) {
      return new CustomEvent(name, opts);
    }
  
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
    return e;
  }
  
  // Detect whether or not bubbling is supported on detached elements. This is
  // non-standard, but Firefox allows it. In a web component world, this is
  // very useful for decoupled inter-component communication without relying on
  // DOM attachment, so we polyfill it.
  (function () {
    var parent = document.createElement('div');
    var child = document.createElement('div');
    parent.appendChild(child);
    parent.addEventListener('test', function () {
      return hasBubbleOnDetachedElements = true;
    });
    child.dispatchEvent(createCustomEvent('test', { bubbles: true }));
  })();
  
  function emitOne(elem, name, opts) {
    var cevent, status, isBubbling;
  
    /* jshint expr: true */
    opts.bubbles === undefined && (opts.bubbles = true);
    opts.cancelable === undefined && (opts.cancelable = true);
    cevent = createCustomEvent(name, opts);
    isBubbling = opts.bubbles;
    status = elem.dispatchEvent(cevent);
    elem = elem.parentNode;
  
    // Simulate bubbling if the browser doesn't support it on detached elements.
    if (isBubbling && !(0, _utilElementContains2['default'])(document, elem) && !hasBubbleOnDetachedElements) {
      (function () {
        var oldStopPropagation = cevent.stopPropagation;
  
        // Patch stopPropagation() to set isPropagationStopped because there's no
        // other way to tell if it was stopped.
        cevent.stopPropagation = function () {
          isBubbling = false;
          oldStopPropagation.call(cevent);
        };
  
        // Bubble.
        while (elem && isBubbling) {
          cevent.currentTarget = elem;
          if (elem.dispatchEvent(cevent) === false) {
            status = false;
          }
          elem = elem.parentNode;
        }
      })();
    }
  
    return status;
  }
  
  exports['default'] = function (elem, name) {
    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  
    var names = typeof name === 'string' ? name.split(' ') : name;
    return names.reduce(function (prev, curr) {
      if (!emitOne(elem, curr, opts)) {
        prev.push(curr);
      }
      return prev;
    }, []);
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/global/vars.js
__dd77578495c1d19b0e115627616ea63a = (function () {
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

// src/type/element.js
__43714db526496b3dd90353996f6dce09 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = {
    /* jshint expr: true */
    create: function create(opts) {
      var elem = document.createElement(opts['extends'] || opts.id);
      opts['extends'] && elem.setAttribute('is', opts.id);
      return elem;
    },
    filter: function filter(elem, defs) {
      var attrs = elem.attributes;
      var isAttr = attrs.is;
      var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
      var tagName = elem.tagName.toLowerCase();
      var definition = defs[isAttrValue || tagName];
  
      if (!definition) {
        return;
      }
  
      var tagToExtend = definition['extends'];
      if (isAttrValue) {
        if (tagName === tagToExtend) {
          return [definition];
        }
      } else if (!tagToExtend) {
        return [definition];
      }
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/global/registry.js
__9cff21a9f41cc9ecfe56139e1040c954 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _apiEmit = __639a0d2e0f8a90cd72e6197bdb481558;
  
  var _apiEmit2 = _interopRequireDefault(_apiEmit);
  
  var _vars = __dd77578495c1d19b0e115627616ea63a;
  
  var _vars2 = _interopRequireDefault(_vars);
  
  var _utilHasOwn = __6d7878404f872c72787f01cd3e06dd21;
  
  var _utilHasOwn2 = _interopRequireDefault(_utilHasOwn);
  
  var _typeElement = __43714db526496b3dd90353996f6dce09;
  
  var _typeElement2 = _interopRequireDefault(_typeElement);
  
  var definitions = {};
  var map = [];
  var types = [];
  
  exports['default'] = _vars2['default'].registerIfNotExists('registry', {
    get: function get(id) {
      return (0, _utilHasOwn2['default'])(definitions, id) && definitions[id];
    },
    set: function set(id, opts) {
      if (this.get(id)) {
        throw new Error('A Skate component with the name of "' + id + '" already exists.');
      }
  
      var type = opts.type || _typeElement2['default'];
      var typeIndex = types.indexOf(type);
  
      if (typeIndex === -1) {
        typeIndex = types.length;
        types.push(type);
        map[typeIndex] = {};
      }
  
      definitions[id] = opts;
      map[typeIndex][id] = opts;
      (0, _apiEmit2['default'])(document, '_skate-register', {
        bubbles: false,
        detail: opts
      });
  
      return this;
    },
    find: function find(elem) {
      var filtered = [];
      var typesLength = types.length;
  
      for (var a = 0; a < typesLength; a++) {
        filtered = filtered.concat(types[a].filter(elem, map[a]) || []);
      }
  
      return filtered;
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
  
  exports['default'] = function (element) {
    var attrs = element.attributes;
    return attrs && !!attrs['data-skate-ignore'];
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
  
  var Node = window.Node;
  
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
    if (!elems) {
      return;
    }
  
    if (elems instanceof Node) {
      elems = [elems];
    }
  
    var elemsLen = elems.length;
    for (var a = 0; a < elemsLen; a++) {
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
  
  var _globalRegistry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  function callAttachedOnDescendants(elem, id) {
    (0, _utilWalkTree2['default'])(elem.childNodes, function (child) {
      _globalRegistry2['default'].find(child).forEach(function (Ctor) {
        return Ctor.prototype.attachedCallback.call(child);
      });
    }, function (child) {
      return !(0, _utilData2['default'])(child, id).attached;
    });
  }
  
  exports['default'] = function (opts) {
    /* jshint expr: true */
    return function () {
      var info = (0, _utilData2['default'])(this, opts.id);
      var isNative = this.attachedCallback;
  
      if (info.attached) return;
      info.attached = true;
      info.detached = false;
  
      opts.attached.call(this);
      isNative || callAttachedOnDescendants(this, opts.id);
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

// src/api/events.js
__96707d121e85542c0149cb45072882a0 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilMatchesSelector = __365bd8b7bbfb2b50d6dbfd830f0aa927;
  
  var _utilMatchesSelector2 = _interopRequireDefault(_utilMatchesSelector);
  
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
        if ((0, _utilMatchesSelector2['default'])(current, selector)) {
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
  
  exports['default'] = function (elem, events) {
    Object.keys(events).forEach(function (name) {
      bindEvent(elem, name, events[name]);
    });
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
      return '' + one + dash + two.toLowerCase();
    });
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/api/properties.js
__ce1127ce6317283e8a42ce1bda4c6b09 = (function () {
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
  
  // TODO: Lean out option normalisation.
  function property(elem, name, prop) {
    var internalGetter, internalSetter, internalValue, isBoolean;
  
    // The property definition can be a function which is set as prop.type.
    if (typeof prop === 'object') {
      prop = (0, _utilAssignSafe2['default'])({}, prop);
    } else {
      prop = { type: prop };
    }
  
    // Normalise prop.attr to a dash-case version of the propertyName.
    if (prop.attr === true) {
      prop.attr = (0, _utilDashCase2['default'])(name);
    }
  
    // Normalise prop.type to a function.
    if (typeof prop.type !== 'function') {
      prop.type = function (val) {
        return val;
      };
    }
  
    // Normalise prop.init as a function bound to the element.
    if (prop.init !== undefined) {
      (function () {
        var value = prop.init;
        prop.init = typeof prop.init === 'function' ? prop.init : function () {
          return value;
        };
        prop.init = prop.init.bind(elem);
      })();
    }
  
    internalGetter = prop.get;
    internalSetter = prop.set;
    isBoolean = prop.type && prop.type === Boolean;
  
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
  
      // Don't do anything if the values are the same.
      if (newValue === oldValue) {
        return;
      }
  
      // We only store the value internally if a getter isn't specified.
      if (!internalGetter) {
        internalValue = newValue;
      }
  
      // We check first to see if we're already updating the property from
      // the attribute. If we are, then there's no need to update the attribute
      // especially because it would invoke an infinite loop.
      if (prop.attr && !info.updatingProperty) {
        info.updatingAttribute = true;
  
        if (isBoolean && internalValue) {
          this.setAttribute(prop.attr, '');
        } else if (internalValue == null || isBoolean && !internalValue) {
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
    };
  
    return prop;
  }
  
  function defineProperty(elem, name, prop) {
    // We don't need to scope the data to the component ID be cause if multiple
    // bindings on the same component define the same attribute, then they'd
    // conflict anyways.
    var info = (0, _utilData2['default'])(elem);
  
    if (!info.attributeToPropertyMap) {
      info.attributeToPropertyMap = {};
    }
  
    prop = property(elem, name, prop);
    Object.defineProperty(elem, name, prop);
  
    // This ensures that the corresponding attribute will know to update this
    // property when it is set.
    if (prop.attr) {
      info.attributeToPropertyMap[prop.attr] = name;
    }
  
    return function () {
      if (prop.attr && elem.hasAttribute(prop.attr)) {
        elem.attributeChangedCallback(prop.attr, null, elem.getAttribute(prop.attr));
      } else if (prop.init) {
        elem[name] = prop.init.call(this);
      }
    };
  }
  
  exports['default'] = function (elem, props) {
    var funcs = Object.keys(props).map(function (name) {
      return defineProperty(elem, name, props[name]);
    });
    return function () {
      var _this = this;
  
      funcs.forEach(function (func) {
        return func.call(_this);
      });
    };
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
  
  var _apiEvents = __96707d121e85542c0149cb45072882a0;
  
  var _apiEvents2 = _interopRequireDefault(_apiEvents);
  
  var _apiProperties = __ce1127ce6317283e8a42ce1bda4c6b09;
  
  var _apiProperties2 = _interopRequireDefault(_apiProperties);
  
  var _utilAssignSafe = __d9d26492984e649e5130081ad32bafd6;
  
  var _utilAssignSafe2 = _interopRequireDefault(_utilAssignSafe);
  
  var _utilData = __18291b0452e01f65cf28d6695040736a;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _utilProtos = __1d11a28624d684874cb270f137cc0122;
  
  var _utilProtos2 = _interopRequireDefault(_utilProtos);
  
  var _globalRegistry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  var elProto = window.Element.prototype;
  var oldSetAttribute = elProto.setAttribute;
  var oldRemoveAttribute = elProto.removeAttribute;
  
  function fnOr(fn) {
    var otherwise = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
  
    return typeof fn === 'function' ? fn : function () {
      return otherwise(this, fn);
    };
  }
  
  function applyPrototype(proto) {
    var prototypes = (0, _utilProtos2['default'])(proto);
    return function () {
      var _this = this;
  
      prototypes.forEach(function (proto) {
        if (!proto.isPrototypeOf(_this)) {
          (0, _utilAssignSafe2['default'])(_this, proto);
        }
      });
    };
  }
  
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
  
  function callCreatedOnDescendants(elem, id) {
    (0, _utilWalkTree2['default'])(elem.childNodes, function (child) {
      _globalRegistry2['default'].find(child).forEach(function (Ctor) {
        return Ctor.prototype.createdCallback.call(child);
      });
    }, function (child) {
      return !(0, _utilData2['default'])(child, id).created;
    });
  }
  
  function markAsResolved(elem, resolvedAttribute, unresolvedAttribute) {
    elem.removeAttribute(unresolvedAttribute);
    elem.setAttribute(resolvedAttribute, '');
  }
  
  exports['default'] = function (opts) {
    var created = fnOr(opts.created);
    var events = fnOr(opts.events, _apiEvents2['default']);
    var properties = fnOr(opts.properties, _apiProperties2['default']);
    var prototype = applyPrototype(opts.prototype);
    var ready = fnOr(opts.ready);
    var template = fnOr(opts.template);
  
    /* jshint expr: true */
    return function () {
      var initProps;
      var info = (0, _utilData2['default'])(this, opts.id);
      var isNative = this.createdCallback;
  
      // This ensures that this component cannot be triggered more than once on
      // this element. This is also for native so that we can force-init an
      // element and when the native callback is fired it can just be a no-op.
      if (info.created) return;
      info.created = true;
  
      // Ensure that attribute changes are propagated synchronously.
      isNative || patchAttributeMethods(this);
  
      // The inheriting of the prototype is the first thing to happen in native.
      isNative || prototype.call(this);
  
      // Bind events so we can catch them at the earliest point in the lifecycle.
      //
      // TODO Check to see if we need to delay execution of handlers until after
      // The ready lifecycle has been invoked so that we can make sure descendants
      // are initialised and ready just in case any code in the handlers tries to
      // pass on state.
      events.call(this);
  
      // Apply the template to the element.
      template.call(this);
  
      // The properties function returns a function that can be called to
      // initialise them on the element when appropriate.
      initProps = properties.call(this);
  
      // Call created() on the host. This may be called at any time, so no one
      // should not rely on descendants being initialised yet. This conforms with
      // native behaviour.
      created.call(this);
  
      // In both polyfill and native we force init all descendant components so
      // that we can ensure that created() and ready() have been called by the
      // time ready() is called on the parent / host.
      callCreatedOnDescendants(this, opts.id);
  
      // Now call ready. By this time, created() and ready () have been called on
      // all descendant components because we've forcefully done it above.
      ready.call(this);
  
      // We trigger all property handlers for properties that exist once all
      // descendants are ready for any incoming state updates. This will also
      // trigger changes for any attributes that are properties.
      initProps();
  
      // Resolve after everything in the created lifecycle has run. This is so
      // that whatever needs to be done before this can be done without FOUC.
      markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
    };
  };
  
  module.exports = exports['default'];
  
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
  
  var _globalRegistry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  exports['default'] = function (element) {
    var isInDom = (0, _utilElementContains2['default'])(document, element);
  
    (0, _utilWalkTree2['default'])(element, function (descendant) {
      var components = _globalRegistry2['default'].find(descendant);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        (0, _lifecycleCreated2['default'])(components[a]).call(descendant);
      }
  
      for (var a = 0; a < componentsLength; a++) {
        if (isInDom) {
          (0, _lifecycleAttached2['default'])(components[a]).call(descendant);
        }
      }
    });
  
    return element;
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
  
  var _globalRegistry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
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
  
  function fixIeNotAllowingInnerHTMLOnTableElements(tag, html) {
    var target = document.createElement('div');
    var levels = 0;
  
    while (tag) {
      html = '<' + tag + '>' + html + '</' + tag + '>';
      tag = specialMap[tag];
      ++levels;
    }
  
    target.innerHTML = html;
    for (var a = 0; a <= levels; a++) {
      target = target.firstElementChild;
    }
  
    return target;
  }
  
  function matchTag(dom) {
    var tag = dom.match(/\s*<([^\s>]+)/);
    return tag && tag[1];
  }
  
  function createFromHtml(html) {
    var tag = specialMap[matchTag(html)];
    var par = document.createElement(tag || 'div');
    par.innerHTML = html;
    return (0, _init2['default'])(par.firstElementChild || fixIeNotAllowingInnerHTMLOnTableElements(tag, html));
  }
  
  function createFromName(name) {
    var ctor = _globalRegistry2['default'].get(name);
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
    var callback = opts.attribute || function () {};
  
    /* jshint expr: true */
    return function (name, oldValue, newValue) {
      var info = (0, _utilData2['default'])(this);
      var attributeToPropertyMap = info.attributeToPropertyMap || {};
  
      callback.call(this, name, oldValue, newValue);
  
      // Ensure properties are notified of this change. We only do this if we're
      // not already updating the attribute from the property. This is so that
      // we don't invoke an infinite loop.
      if (attributeToPropertyMap[name] && !info.updatingAttribute) {
        info.updatingProperty = true;
        this[attributeToPropertyMap[name]] = newValue === null ? undefined : newValue;
        info.updatingProperty = false;
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
      var _this = this;
  
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      if (!called) {
        called = true;
        setTimeout(function () {
          called = false;
          fn.apply(_this, args);
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
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _typeElement = __43714db526496b3dd90353996f6dce09;
  
  var _typeElement2 = _interopRequireDefault(_typeElement);
  
  exports['default'] = {
    // Called when the element is attached to the document.
    attached: function attached() {},
  
    // Attribute lifecycle callback or callbacks.
    attributes: function attributes() {},
  
    // Called when the element is created.
    created: function created() {},
  
    // Called after all descendants have had "created" and "ready" invoked.
    ready: function ready() {},
  
    // Called when the element is detached from the document.
    detached: function detached() {},
  
    // The events to manage the binding and unbinding of during the definition's
    // lifecycle.
    events: {},
  
    // Restricts a particular definition to binding explicitly to an element with
    // a tag name that matches the specified value.
    'extends': '',
  
    // The ID of the definition. This is automatically set in the `skate()`
    // function.
    id: '',
  
    // The special Skate properties to define.
    properties: {},
  
    // Properties and methods to add to each element.
    prototype: {},
  
    // The attribute name to add after calling the created() callback.
    resolvedAttribute: 'resolved',
  
    // The template to replace the content of the element with.
    template: function template() {},
  
    // The type of bindings to allow.
    type: _typeElement2['default'],
  
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
  
  var _globalRegistry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  function callDetachedOnDescendants(elem, id) {
    (0, _utilWalkTree2['default'])(elem.childNodes, function (child) {
      _globalRegistry2['default'].find(child).forEach(function (Ctor) {
        return Ctor.prototype.detachedCallback.call(child);
      });
    }, function (child) {
      return !(0, _utilData2['default'])(child, id).detached;
    });
  }
  
  exports['default'] = function (opts) {
    /* jshint expr: true */
    return function () {
      var info = (0, _utilData2['default'])(this, opts.id);
      var isNative = this.detachedCallback;
  
      if (info.detached) return;
      info.detached = true;
      info.attached = false;
  
      opts.detached.call(this);
      isNative || callDetachedOnDescendants(this, opts.id);
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);

// src/global/document-observer.js
__d8200645c4d96aee6940034d9c030d1f = (function () {
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
  
  var _vars = __dd77578495c1d19b0e115627616ea63a;
  
  var _vars2 = _interopRequireDefault(_vars);
  
  var _utilIgnored = __092f8936e5006bddcb3baf24320a5a06;
  
  var _utilIgnored2 = _interopRequireDefault(_utilIgnored);
  
  var _registry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _registry2 = _interopRequireDefault(_registry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  var DocumentFragment = window.DocumentFragment;
  var MutationObserver = window.MutationObserver || window.SkateMutationObserver;
  
  function getClosestIgnoredElement(element) {
    var parent = element;
    while (parent && parent !== document && !(parent instanceof DocumentFragment)) {
      if ((0, _utilIgnored2['default'])(parent)) {
        return parent;
      }
      parent = parent.parentNode;
    }
  }
  
  function triggerAddedNodes(addedNodes) {
    (0, _utilWalkTree2['default'])(addedNodes, function (element) {
      var components = _registry2['default'].find(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        (0, _lifecycleCreated2['default'])(components[a]).call(element);
      }
  
      for (var a = 0; a < componentsLength; a++) {
        (0, _lifecycleAttached2['default'])(components[a]).call(element);
      }
    });
  }
  
  function triggerRemovedNodes(removedNodes) {
    (0, _utilWalkTree2['default'])(removedNodes, function (element) {
      var components = _registry2['default'].find(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        (0, _lifecycleDetached2['default'])(components[a]).call(element);
      }
    });
  }
  
  function documentObserverHandler(mutations) {
    var mutationsLength = mutations.length;
  
    for (var a = 0; a < mutationsLength; a++) {
      var addedNodes = mutations[a].addedNodes;
      var removedNodes = mutations[a].removedNodes;
  
      // Since siblings are batched together, we check the first node's parent
      // node to see if it is ignored. If it is then we don't process any added
      // nodes. This prevents having to check every node.
      if (addedNodes && addedNodes.length && !getClosestIgnoredElement(addedNodes[0].parentNode)) {
        triggerAddedNodes(addedNodes);
      }
  
      // We can't check batched nodes here because they won't have a parent node.
      if (removedNodes && removedNodes.length) {
        triggerRemovedNodes(removedNodes);
      }
    }
  }
  
  function createDocumentObserver() {
    var observer = new MutationObserver(documentObserverHandler);
    observer.observe(document, {
      childList: true,
      subtree: true
    });
    return observer;
  }
  
  exports['default'] = _vars2['default'].registerIfNotExists('observer', {
    observer: undefined,
    register: function register() {
      if (!this.observer) {
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

// src/util/element-constructor.js
__cdf80614962dbe37e0456f37c35fe468 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  exports['default'] = function (opts) {
    var type = opts.type;
  
    function CustomElement() {
      var element = type.create(opts);
  
      // Ensure the definition prototype is up to date with the element's
      // prototype. This ensures that overwriting the element prototype still
      // works.
      opts.prototype = CustomElement.prototype;
  
      // Initialises. This will always exist.
      opts.prototype.createdCallback.call(element);
  
      return element;
    }
  
    // This allows modifications to the element prototype propagate to the
    // definition prototype.
    CustomElement.prototype = opts.prototype;
  
    // Ensure the prototype has a non-enumerable constructor.
    Object.defineProperty(CustomElement.prototype, 'constructor', {
      enumerable: false,
      value: CustomElement
    });
  
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
  
  var _apiCreate = __1675a7174b713323cc232370699a2714;
  
  var _apiCreate2 = _interopRequireDefault(_apiCreate);
  
  var _apiEmit = __639a0d2e0f8a90cd72e6197bdb481558;
  
  var _apiEmit2 = _interopRequireDefault(_apiEmit);
  
  var _apiEvents = __96707d121e85542c0149cb45072882a0;
  
  var _apiEvents2 = _interopRequireDefault(_apiEvents);
  
  var _apiInit = __3add36046399fead5a83243849207ed7;
  
  var _apiInit2 = _interopRequireDefault(_apiInit);
  
  var _apiNoConflict = __82110da8eb4359fb9724f67f4a12febe;
  
  var _apiNoConflict2 = _interopRequireDefault(_apiNoConflict);
  
  var _apiProperties = __ce1127ce6317283e8a42ce1bda4c6b09;
  
  var _apiProperties2 = _interopRequireDefault(_apiProperties);
  
  var _apiVersion = __662bde51c096e9d79bf327311ea178e0;
  
  var _apiVersion2 = _interopRequireDefault(_apiVersion);
  
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
  
  var _globalDocumentObserver = __d8200645c4d96aee6940034d9c030d1f;
  
  var _globalDocumentObserver2 = _interopRequireDefault(_globalDocumentObserver);
  
  var _utilElementConstructor = __cdf80614962dbe37e0456f37c35fe468;
  
  var _utilElementConstructor2 = _interopRequireDefault(_utilElementConstructor);
  
  var _globalRegistry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _supportCustomElements = __c6f5e18624750ce93a74df6369c85ef0;
  
  var _supportCustomElements2 = _interopRequireDefault(_supportCustomElements);
  
  var _typeElement = __43714db526496b3dd90353996f6dce09;
  
  var _typeElement2 = _interopRequireDefault(_typeElement);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  var _supportValidCustomElement = __6e1dfed2b03894ef63a4b65d5038d223;
  
  var _supportValidCustomElement2 = _interopRequireDefault(_supportValidCustomElement);
  
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
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  
      return (0, _utilAssign2['default'])(new Ctor(), props);
    };
    CtorWrapper.prototype = Ctor.prototype;
    return CtorWrapper;
  }
  
  var HTMLElement = window.HTMLElement;
  var initDocument = (0, _utilDebounce2['default'])(function () {
    (0, _utilWalkTree2['default'])(document.documentElement.childNodes, function (element) {
      var components = _globalRegistry2['default'].find(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        (0, _lifecycleCreated2['default'])(components[a]).call(element);
      }
  
      for (var a = 0; a < componentsLength; a++) {
        (0, _lifecycleAttached2['default'])(components[a]).call(element);
      }
    });
  });
  
  function skate(id, userOptions) {
    var Ctor, CtorParent, isNative;
    var opts = makeOptions(userOptions);
  
    CtorParent = opts['extends'] ? document.createElement(opts['extends']).constructor : HTMLElement;
    isNative = opts.type === _typeElement2['default'] && (0, _supportCustomElements2['default'])() && (0, _supportValidCustomElement2['default'])(id);
  
    // Inherit from parent prototype.
    if (!CtorParent.prototype.isPrototypeOf(opts.prototype)) {
      opts.prototype = (0, _utilAssignSafe2['default'])(Object.create(CtorParent.prototype), opts.prototype);
    }
  
    // Native doesn't like if you pass a falsy value. Must be undefined.
    opts['extends'] = opts['extends'] || undefined;
  
    // Extend behaviour of existing callbacks.
    opts.prototype.createdCallback = (0, _lifecycleCreated2['default'])(opts);
    opts.prototype.attachedCallback = (0, _lifecycleAttached2['default'])(opts);
    opts.prototype.detachedCallback = (0, _lifecycleDetached2['default'])(opts);
    opts.prototype.attributeChangedCallback = (0, _lifecycleAttribute2['default'])(opts);
  
    // Ensure the ID can be retrieved from the options or constructor.
    opts.id = id;
  
    // Make a constructor for the definition.
    if (isNative) {
      Ctor = document.registerElement(id, opts);
    } else {
      Ctor = (0, _utilElementConstructor2['default'])(opts);
      initDocument();
      _globalDocumentObserver2['default'].register();
    }
  
    Ctor = makeNonNewableWrapper(Ctor);
    (0, _utilAssignSafe2['default'])(Ctor, opts);
    _globalRegistry2['default'].set(id, Ctor);
  
    return Ctor;
  }
  
  skate.create = _apiCreate2['default'];
  skate.emit = _apiEmit2['default'];
  skate.events = _apiEvents2['default'];
  skate.init = _apiInit2['default'];
  skate.noConflict = _apiNoConflict2['default'];
  skate.properties = _apiProperties2['default'];
  skate.version = _apiVersion2['default'];
  
  // Global
  window.skate = skate;
  
  // ES6
  exports['default'] = skate;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);