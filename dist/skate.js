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
// src/global/vars.js
__dd77578495c1d19b0e115627616ea63a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var VERSION = '__skate_0_14_0';
  
  if (!window[VERSION]) {
    window[VERSION] = {
      registerIfNotExists: function registerIfNotExists(name, value) {
        return this[name] || (this[name] = value);
      }
    };
  }
  
  exports['default'] = window[VERSION];
  module.exports = exports['default'];
  
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
    create: function create(opts) {
      var elem = document.createElement(opts['extends'] || opts.id);
      opts['extends'] && elem.setAttribute('is', opts.id);
      return elem;
    },
    filter: function filter(elem, defs) {
      var attrs = elem.attributes;
      var isAttr = attrs.is;
      var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
      var tagName = (elem.tagName || elem.localName).toLowerCase();
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
  
  var _globalRegistry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  exports['default'] = function (name, props) {
    var trimmedName = name.trim();
    var constructor = _globalRegistry2['default'].get(trimmedName);
    return constructor ? constructor(props) : (0, _utilAssign2['default'])(document.createElement(trimmedName), props);
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
  
  var CustomEvent = (function (CustomEvent) {
    if (CustomEvent) {
      try {
        new CustomEvent();
      } catch (e) {
        return undefined;
      }
    }
    return CustomEvent;
  })(window.CustomEvent);
  
  var hasBubbleOnDetachedElements = (function () {
    var parent = document.createElement('div');
    var child = document.createElement('div');
    var hasBubbleOnDetachedElements = false;
    parent.appendChild(child);
    parent.addEventListener('test', function () {
      return hasBubbleOnDetachedElements = true;
    });
    child.dispatchEvent(createCustomEvent('test', { bubbles: true }));
    return hasBubbleOnDetachedElements;
  })();
  
  function createCustomEvent(name) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  
    if (CustomEvent) {
      return new CustomEvent(name, opts);
    }
  
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
    return e;
  }
  
  function createReadableStopPropagation(oldStopPropagation) {
    return function () {
      this.isPropagationStopped = true;
      oldStopPropagation.call(this);
    };
  }
  
  function simulateBubbling(elem, cEvent) {
    var didPreventDefault = undefined;
    var currentElem = elem;
    cEvent.stopPropagation = createReadableStopPropagation(cEvent.stopPropagation);
    Object.defineProperty(cEvent, 'target', { value: elem });
    while (currentElem && !cEvent.isPropagationStopped) {
      cEvent.currentTarget = currentElem;
      if (currentElem.dispatchEvent(cEvent) === false) {
        didPreventDefault = false;
      }
      currentElem = currentElem.parentNode;
    }
    return didPreventDefault;
  }
  
  function emitOne(elem, name, opts) {
    var cEvent, shouldSimulateBubbling;
  
    /* jshint expr: true */
    opts.bubbles === undefined && (opts.bubbles = true);
    opts.cancelable === undefined && (opts.cancelable = true);
    cEvent = createCustomEvent(name, opts);
    shouldSimulateBubbling = opts.bubbles && !hasBubbleOnDetachedElements && !(0, _utilElementContains2['default'])(document, elem);
  
    return shouldSimulateBubbling ? simulateBubbling(elem, cEvent) : elem.dispatchEvent(cEvent);
  }
  
  exports['default'] = function (elem, name) {
    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  
    var names = typeof name === 'string' ? name.split(' ') : name;
    return names.reduce(function (prev, curr) {
      if (emitOne(elem, curr, opts) === false) {
        prev.push(curr);
      }
      return prev;
    }, []);
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
  
  function walk(elem, fn) {
    if (elem.nodeType !== Node.ELEMENT_NODE || (0, _ignored2['default'])(elem)) {
      return;
    }
  
    var chren = elem.childNodes;
    var child = chren && chren[0];
  
    fn(elem);
    while (child) {
      walk(child, fn);
      child = child.nextSibling;
    }
  }
  
  exports['default'] = function (elems, fn) {
    if (!elems) {
      return;
    }
  
    if (elems instanceof Node) {
      elems = [elems];
    }
  
    for (var a = 0; a < elems.length; a++) {
      walk(elems[a], fn);
    }
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
  
  var _utilElementContains = __6f793202bae98770dbb2b598df7929ad;
  
  var _utilElementContains2 = _interopRequireDefault(_utilElementContains);
  
  var _globalRegistry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  exports['default'] = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
  
    args.forEach(function (arg) {
      var isInDom = (0, _utilElementContains2['default'])(document, arg);
      (0, _utilWalkTree2['default'])(arg, function (descendant) {
        var components = _globalRegistry2['default'].find(descendant);
        var componentsLength = components.length;
  
        for (var a = 0; a < componentsLength; a++) {
          components[a].prototype.createdCallback.call(descendant);
        }
  
        for (var a = 0; a < componentsLength; a++) {
          if (isInDom) {
            components[a].prototype.attachedCallback.call(descendant);
          }
        }
      });
    });
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/fragment.js
__ef86f48ff9050407fed1e142d9fe2629 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = fragment;
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _init = __3add36046399fead5a83243849207ed7;
  
  var _init2 = _interopRequireDefault(_init);
  
  var Node = window.Node;
  var NodeList = window.NodeList;
  
  var slice = Array.prototype.slice;
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
  
  function resolveParent(tag, html) {
    var container = document.createElement('div');
    var levels = 0;
    var parentTag = specialMap[tag];
  
    while (parentTag) {
      html = '<' + parentTag + '>' + html + '</' + parentTag + '>';
      ++levels;
      parentTag = specialMap[parentTag];
    }
  
    container.innerHTML = html;
  
    var parent = container;
    for (var a = 0; a < levels; a++) {
      parent = parent.firstElementChild;
    }
    return parent;
  }
  
  function resolveTag(html) {
    var tag = html.match(/^<([^\s>]+)/);
    return tag && tag[1];
  }
  
  function resolveHtml(html) {
    return resolveParent(resolveTag(html), html);
  }
  
  function fragment() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
  
    return args.reduce(function (frag, node) {
      if (typeof node === 'string') {
        node = fragment.apply(null, slice.call(resolveHtml(node).childNodes));
      } else if (node instanceof NodeList || Array.isArray(node)) {
        node = fragment.apply(null, slice.call(node));
      } else if (node instanceof Node) {
        (0, _init2['default'])(node);
      }
  
      if (node) {
        frag.appendChild(node);
      }
  
      return frag;
    }, document.createDocumentFragment());
  }
  
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
      return '' + one + dash + two.toLowerCase();
    });
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
    var namespace = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
  
    var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
    return namespace && (data[namespace] || (data[namespace] = {})) || data;
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
  
  var _utilAssign = __d48ab0568b1578e9cac74e66baa6d3e7;
  
  var _utilAssign2 = _interopRequireDefault(_utilAssign);
  
  var _utilDashCase = __0cd264077c1ca567539d11e826d3c00e;
  
  var _utilDashCase2 = _interopRequireDefault(_utilDashCase);
  
  var _utilData = __18291b0452e01f65cf28d6695040736a;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  // TODO Split apart createNativePropertyDefinition function.
  
  function getLinkedAttribute(name, attr) {
    return attr === true ? (0, _utilDashCase2['default'])(name) : attr;
  }
  
  function createNativePropertyDefinition(name, opts) {
    var prop = {
      configurable: true,
      enumerable: true
    };
  
    prop.created = function (elem, initialValue) {
      var info = (0, _utilData2['default'])(elem, 'api/property/' + name);
      info.linkedAttribute = getLinkedAttribute(name, opts.attribute);
      info.removeAttribute = elem.removeAttribute;
      info.setAttribute = elem.setAttribute;
      info.updatingProperty = false;
  
      if (typeof opts['default'] === 'function') {
        info.defaultValue = opts['default'](elem);
      } else if (opts['default'] !== undefined) {
        info.defaultValue = opts['default'];
      }
  
      // TODO Refactor
      if (info.linkedAttribute) {
        if (!info.attributeMap) {
          info.attributeMap = {};
  
          elem.removeAttribute = function (attrName) {
            info.updatingAttribute = true;
            info.removeAttribute.call(this, attrName);
  
            if (attrName in info.attributeMap) {
              var propertyName = info.attributeMap[attrName];
              elem[propertyName] = undefined;
            }
  
            info.updatingAttribute = false;
          };
  
          elem.setAttribute = function (attrName, attrValue) {
            info.updatingAttribute = true;
            info.setAttribute.call(this, attrName, attrValue);
  
            if (attrName in info.attributeMap) {
              var propertyName = info.attributeMap[attrName];
              attrValue = String(attrValue);
              elem[propertyName] = opts.deserialize(attrValue);
            }
  
            info.updatingAttribute = false;
          };
        }
  
        info.attributeMap[info.linkedAttribute] = name;
      }
  
      if (initialValue === undefined) {
        if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
          var attributeValue = elem.getAttribute(info.linkedAttribute);
          initialValue = opts.deserialize(attributeValue);
        } else {
          initialValue = info.defaultValue;
        }
      }
  
      info.internalValue = initialValue;
    };
  
    prop.get = function () {
      var info = (0, _utilData2['default'])(this, 'api/property/' + name);
  
      if (opts.get) {
        return opts.get(this);
      }
  
      return info.internalValue;
    };
  
    prop.set = function (newValue) {
      var info = (0, _utilData2['default'])(this, 'api/property/' + name);
      var oldValue = undefined;
  
      if (info.updatingProperty) {
        return;
      }
  
      info.updatingProperty = true;
  
      if (info.hasBeenSetOnce) {
        oldValue = this[name];
      } else {
        oldValue = undefined;
        info.hasBeenSetOnce = true;
      }
  
      if (opts.type) {
        newValue = opts.type(newValue);
      }
  
      if (!opts.get) {
        info.internalValue = typeof newValue === 'undefined' ? info.defaultValue : newValue;
      }
  
      if (info.linkedAttribute && !info.updatingAttribute) {
        var serializedValue = opts.serialize(newValue);
        if (serializedValue === undefined) {
          info.removeAttribute.call(this, info.linkedAttribute);
        } else {
          info.setAttribute.call(this, info.linkedAttribute, serializedValue);
        }
      }
  
      var changeData = {
        name: name,
        newValue: newValue,
        oldValue: oldValue
      };
  
      if (typeof opts.set === 'function') {
        opts.set(this, changeData);
      }
  
      info.updatingProperty = false;
    };
  
    return prop;
  }
  
  exports['default'] = function (opts) {
    opts = opts || {};
  
    if (typeof opts === 'function') {
      opts = { type: opts };
    }
  
    return function (name) {
      return createNativePropertyDefinition(name, (0, _utilAssign2['default'])({
        deserialize: function deserialize(value) {
          return value;
        },
        serialize: function serialize(value) {
          return value;
        }
      }, opts));
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/property/boolean.js
__ceb223b354343ac9f009816425363726 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = {
    'default': false,
    deserialize: function deserialize(value) {
      return !(value === null);
    },
    serialize: function serialize(value) {
      return value ? '' : undefined;
    },
    type: function type(value) {
      return !!value;
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/property/float.js
__1eefbd388455cbf61d2082ee22acadca = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = {
    "default": 0,
    serialize: String,
    deserialize: parseFloat,
    type: parseFloat
  };
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);
// src/api/property/number.js
__360a03d396e00a10ad74a76ba72f9d83 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = {
    "default": 0,
    serialize: String,
    deserialize: Number,
    type: Number
  };
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);
// src/api/property/string.js
__b0d0e2f7f4af4b006d134d92ec6375b9 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = {
    'default': '',
    deserialize: String,
    serialize: String,
    type: String
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/property/index.js
__8e32f3287770e2db0e284f8ed6cd72cf = (function () {
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
  
  var _lifecycleProperty = __5fe98810c40e8fe796b072491d45fcc6;
  
  var _lifecycleProperty2 = _interopRequireDefault(_lifecycleProperty);
  
  var _boolean = __ceb223b354343ac9f009816425363726;
  
  var _boolean2 = _interopRequireDefault(_boolean);
  
  var _float = __1eefbd388455cbf61d2082ee22acadca;
  
  var _float2 = _interopRequireDefault(_float);
  
  var _number = __360a03d396e00a10ad74a76ba72f9d83;
  
  var _number2 = _interopRequireDefault(_number);
  
  var _string = __b0d0e2f7f4af4b006d134d92ec6375b9;
  
  var _string2 = _interopRequireDefault(_string);
  
  function prop(type) {
    return function (opts) {
      return (0, _lifecycleProperty2['default'])((0, _utilAssign2['default'])({
        attribute: true
      }, type, opts));
    };
  }
  
  exports['default'] = {
    boolean: prop(_boolean2['default']),
    float: prop(_float2['default']),
    number: prop(_number2['default']),
    string: prop(_string2['default'])
  };
  module.exports = exports['default'];
  
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
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilData = __18291b0452e01f65cf28d6695040736a;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _globalRegistry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  function ready(element) {
    var components = _globalRegistry2['default'].find(element);
    var componentsLength = components.length;
    for (var a = 0; a < componentsLength; a++) {
      if (!(0, _utilData2['default'])(element, 'lifecycle/' + components[a].id).created) {
        return false;
      }
    }
    return true;
  }
  
  exports['default'] = function (elements, callback) {
    var collection = elements.length === undefined ? [elements] : elements;
    var collectionLength = collection.length;
    var readyCount = 0;
  
    function callbackIfReady() {
      if (readyCount === collectionLength) {
        callback(elements);
      }
    }
  
    for (var a = 0; a < collectionLength; a++) {
      var elem = collection[a];
  
      if (ready(elem)) {
        ++readyCount;
      } else {
        // skate.ready is only fired if the element has not been initialised yet.
        elem.addEventListener('skate.ready', function () {
          ++readyCount;
          callbackIfReady();
        });
      }
    }
  
    // If the elements are all ready by this time that means nothing was ever
    // bound to skate.ready above.
    callbackIfReady();
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/render/html.js
__094bf660ba7ebd6f4b14ca8053e00764 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _fragment = __ef86f48ff9050407fed1e142d9fe2629;
  
  var _fragment2 = _interopRequireDefault(_fragment);
  
  exports['default'] = function (render) {
    return function (elem) {
      while (elem.childNodes.length) {
        elem.removeChild(elem.childNodes[0]);
      }
      elem.appendChild((0, _fragment2['default'])(render(elem)));
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/render/index.js
__d31d2ff71da7095bf8886568461d8537 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _html = __094bf660ba7ebd6f4b14ca8053e00764;
  
  var _html2 = _interopRequireDefault(_html);
  
  var _globalRegistry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  function render(elem) {
    _globalRegistry2['default'].find(elem).forEach(function (component) {
      return component.render && component.render(elem);
    });
  }
  
  render.html = _html2['default'];
  
  exports['default'] = render;
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
  
  exports['default'] = function (opts) {
    return function () {
      var info = (0, _utilData2['default'])(this, 'lifecycle/' + opts.id);
      if (info.attached) return;
      info.attached = true;
      info.detached = false;
      opts.attached(this);
    };
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
  var noop = function noop() {};
  
  exports['default'] = function (opts) {
    var callback = opts.attribute;
  
    if (typeof callback !== 'function') {
      return noop;
    }
  
    return function (name, oldValue, newValue) {
      callback(this, {
        name: name,
        newValue: newValue === null ? undefined : newValue,
        oldValue: oldValue === null ? undefined : oldValue
      });
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
  exports['default'] = events;
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilMatchesSelector = __365bd8b7bbfb2b50d6dbfd830f0aa927;
  
  var _utilMatchesSelector2 = _interopRequireDefault(_utilMatchesSelector);
  
  function readonly(obj, prop, val) {
    Object.defineProperty(obj, prop, {
      configurable: true,
      get: function get() {
        return val;
      }
    });
  }
  
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
          readonly(e, 'currentTarget', current);
          readonly(e, 'delegateTarget', elem);
          return handler(e);
        }
        current = current.parentNode;
      }
    };
  }
  
  function makeNormalHandler(elem, handler) {
    return function (e) {
      readonly(e, 'delegateTarget', elem);
      handler(e);
    };
  }
  
  function bindEvent(elem, event, handler) {
    var parsed = parseEvent(event);
    var name = parsed.name;
    var selector = parsed.selector;
  
    var capture = selector && (name === 'blur' || name === 'focus');
    handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
    elem.addEventListener(name, handler, capture);
  }
  
  function events(opts) {
    var events = opts.events;
    return function (elem) {
      Object.keys(events).forEach(function (name) {
        bindEvent(elem, name, events[name].bind(elem));
      });
    };
  }
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/lifecycle/patch-attribute-methods.js
__cbc0eefc77aa7d958ec51e53ef2568fc = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = patchAttributeMethods;
  
  function patchAttributeMethods(elem, opts) {
    if (opts.isNative) {
      return;
    }
  
    var removeAttribute = elem.removeAttribute;
    var setAttribute = elem.setAttribute;
  
    elem.removeAttribute = function (name) {
      var oldValue = this.getAttribute(name);
      removeAttribute.call(elem, name);
      elem.attributeChangedCallback(name, oldValue, null);
    };
  
    elem.setAttribute = function (name, newValue) {
      var oldValue = this.getAttribute(name);
      setAttribute.call(elem, name, newValue);
      elem.attributeChangedCallback(name, oldValue, String(newValue));
    };
  }
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);
// src/lifecycle/properties-created.js
__a66903f10d803226e4691dfa301c4f3e = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = propertiesApply;
  
  function propertiesApply(elem, props) {
    Object.keys(props).forEach(function (name) {
      var prop = props[name];
      var initialValue = elem[name];
  
      // https://bugs.webkit.org/show_bug.cgi?id=49739
      //
      // When Webkit fixes that bug so that native property we can move defining
      // the property to the prototype and away from having to do if for every
      // instance since all other browsers support accessing native property
      // getters / setters.
      Object.defineProperty(elem, name, prop);
  
      // This will still be needed to do any setup for the property if it needs
      // any information from the element.
      //
      // Once that bug is fixed, the initial value being passed as the second
      // argument to prop.created() can use the overridden property definition to
      // get the initial value.
      prop.created && prop.created(elem, initialValue);
    });
  }
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);
// src/lifecycle/properties-ready.js
__06885fcc635bf6a67cb67ec77a6e8b17 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = propertiesApply;
  
  function propertiesApply(elem, props) {
    Object.keys(props).forEach(function (name) {
      var prop = props[name];
      prop.set && prop.set.call(elem, elem[name]);
    });
  }
  
  module.exports = exports["default"];
  
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
// src/lifecycle/prototype.js
__7ba2ecf93401318a8fb40e4b0fe295ea = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = prototype;
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilAssignSafe = __d9d26492984e649e5130081ad32bafd6;
  
  var _utilAssignSafe2 = _interopRequireDefault(_utilAssignSafe);
  
  var _utilProtos = __1d11a28624d684874cb270f137cc0122;
  
  var _utilProtos2 = _interopRequireDefault(_utilProtos);
  
  function prototype(opts) {
    if (opts.isNative) {
      return function () {};
    }
  
    var prototypes = (0, _utilProtos2['default'])(opts.prototype);
    return function (elem) {
      prototypes.forEach(function (proto) {
        if (!proto.isPrototypeOf(elem)) {
          (0, _utilAssignSafe2['default'])(elem, proto);
        }
      });
    };
  }
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/lifecycle/resolve.js
__4b4eecf91d77990b080189047604b709 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = resolve;
  
  function resolve(elem, opts) {
    elem.removeAttribute(opts.unresolvedAttribute);
    elem.setAttribute(opts.resolvedAttribute, '');
  }
  
  module.exports = exports['default'];
  
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
  
  var _utilData = __18291b0452e01f65cf28d6695040736a;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _apiEmit = __639a0d2e0f8a90cd72e6197bdb481558;
  
  var _apiEmit2 = _interopRequireDefault(_apiEmit);
  
  var _events = __d48fcc3ecf3585518bbce659c1ba4116;
  
  var _events2 = _interopRequireDefault(_events);
  
  var _patchAttributeMethods = __cbc0eefc77aa7d958ec51e53ef2568fc;
  
  var _patchAttributeMethods2 = _interopRequireDefault(_patchAttributeMethods);
  
  var _property = __5fe98810c40e8fe796b072491d45fcc6;
  
  var _property2 = _interopRequireDefault(_property);
  
  var _propertiesCreated = __a66903f10d803226e4691dfa301c4f3e;
  
  var _propertiesCreated2 = _interopRequireDefault(_propertiesCreated);
  
  var _propertiesReady = __06885fcc635bf6a67cb67ec77a6e8b17;
  
  var _propertiesReady2 = _interopRequireDefault(_propertiesReady);
  
  var _prototype = __7ba2ecf93401318a8fb40e4b0fe295ea;
  
  var _prototype2 = _interopRequireDefault(_prototype);
  
  var _resolve = __4b4eecf91d77990b080189047604b709;
  
  var _resolve2 = _interopRequireDefault(_resolve);
  
  // TODO Remove this when we no longer support the legacy definitions and only
  // support a superset of a native property definition.
  function ensurePropertyFunctions(opts) {
    var props = opts.properties;
    var names = Object.keys(props || {});
    return names.reduce(function (descriptors, descriptorName) {
      descriptors[descriptorName] = opts.properties[descriptorName];
      if (typeof descriptors[descriptorName] !== 'function') {
        descriptors[descriptorName] = (0, _property2['default'])(descriptors[descriptorName]);
      }
      return descriptors;
    }, {});
  }
  
  function ensurePropertyDefinitions(elem, propertyFunctions) {
    return Object.keys(propertyFunctions || {}).reduce(function (descriptors, descriptorName) {
      descriptors[descriptorName] = propertyFunctions[descriptorName](descriptorName);
      return descriptors;
    }, {});
  }
  
  function notifyReady(elem) {
    (0, _apiEmit2['default'])(elem, 'skate.ready', {
      bubbles: false,
      cancelable: false
    });
  }
  
  function renderIfNotResolved(elem, opts) {
    if (opts.render && !elem.hasAttribute(opts.resolvedAttribute)) {
      opts.render(elem);
    }
  }
  
  exports['default'] = function (opts) {
    var applyEvents = (0, _events2['default'])(opts);
    var applyPrototype = (0, _prototype2['default'])(opts);
    var propertyFunctions = ensurePropertyFunctions(opts);
  
    return function () {
      var info = (0, _utilData2['default'])(this, 'lifecycle/' + opts.id);
      var propertyDefinitions = undefined;
  
      if (info.created) return;
      info.created = true;
      propertyDefinitions = ensurePropertyDefinitions(this, propertyFunctions);
  
      (0, _patchAttributeMethods2['default'])(this, opts);
      applyPrototype(this);
      (0, _propertiesCreated2['default'])(this, propertyDefinitions);
      applyEvents(this);
      opts.created && opts.created(this);
      renderIfNotResolved(this, opts);
      (0, _propertiesReady2['default'])(this, propertyDefinitions);
      opts.ready && opts.ready(this);
      notifyReady(this);
      (0, _resolve2['default'])(this, opts);
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
    attribute: function attribute() {},
  
    // Called when the element is created after all descendants have had it
    // called on them.
    created: function created() {},
  
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
  
    // Called after all lifecycle callbacks have been called.
    ready: function ready() {},
  
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
  
  exports['default'] = function (opts) {
    return function () {
      var info = (0, _utilData2['default'])(this, 'lifecycle/' + opts.id);
      if (info.detached) return;
      info.detached = true;
      info.attached = false;
      opts.detached(this);
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/util/get-closest-ignored-element.js
__a56dab24700df352eb84caec3fe615e5 = (function () {
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
  
  var Element = window.Element;
  
  exports['default'] = function (element) {
    var parent = element;
    while (parent instanceof Element) {
      if ((0, _ignored2['default'])(parent)) {
        return parent;
      }
      parent = parent.parentNode;
    }
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
  
  var _vars = __dd77578495c1d19b0e115627616ea63a;
  
  var _vars2 = _interopRequireDefault(_vars);
  
  var _utilGetClosestIgnoredElement = __a56dab24700df352eb84caec3fe615e5;
  
  var _utilGetClosestIgnoredElement2 = _interopRequireDefault(_utilGetClosestIgnoredElement);
  
  var _registry = __9cff21a9f41cc9ecfe56139e1040c954;
  
  var _registry2 = _interopRequireDefault(_registry);
  
  var _utilWalkTree = __164e5750c20526cb74a9e443b730eeff;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  function triggerAddedNodes(addedNodes) {
    (0, _utilWalkTree2['default'])(addedNodes, function (element) {
      var components = _registry2['default'].find(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.createdCallback.call(element);
      }
  
      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.attachedCallback.call(element);
      }
    });
  }
  
  function triggerRemovedNodes(removedNodes) {
    (0, _utilWalkTree2['default'])(removedNodes, function (element) {
      var components = _registry2['default'].find(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.detachedCallback.call(element);
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
      if (addedNodes && addedNodes.length && !(0, _utilGetClosestIgnoredElement2['default'])(addedNodes[0].parentNode)) {
        triggerAddedNodes(addedNodes);
      }
  
      // We can't check batched nodes here because they won't have a parent node.
      if (removedNodes && removedNodes.length) {
        triggerRemovedNodes(removedNodes);
      }
    }
  }
  
  function createDocumentObserver() {
    var observer = new window.MutationObserver(documentObserverHandler);
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
  
  var _apiFragment = __ef86f48ff9050407fed1e142d9fe2629;
  
  var _apiFragment2 = _interopRequireDefault(_apiFragment);
  
  var _apiInit = __3add36046399fead5a83243849207ed7;
  
  var _apiInit2 = _interopRequireDefault(_apiInit);
  
  var _apiPropertyIndex = __8e32f3287770e2db0e284f8ed6cd72cf;
  
  var _apiPropertyIndex2 = _interopRequireDefault(_apiPropertyIndex);
  
  var _apiReady = __83ca289f5309abef55c338a9f7a22385;
  
  var _apiReady2 = _interopRequireDefault(_apiReady);
  
  var _apiRenderIndex = __d31d2ff71da7095bf8886568461d8537;
  
  var _apiRenderIndex2 = _interopRequireDefault(_apiRenderIndex);
  
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
    function CtorWrapper() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  
      return (0, _utilAssign2['default'])(new Ctor(), props);
    }
  
    // Copy prototype.
    CtorWrapper.prototype = Ctor.prototype;
  
    // Ensure a non-enumerable constructor property exists.
    Object.defineProperty(Ctor.prototype, 'constructor', {
      enumerable: false,
      value: CtorWrapper
    });
  
    return CtorWrapper;
  }
  
  function polyfillElementConstructor(opts) {
    var type = opts.type;
    function CustomElement() {
      var element = type.create(opts);
      opts.prototype.createdCallback.call(element);
      return element;
    }
    CustomElement.prototype = opts.prototype;
    return CustomElement;
  }
  
  var HTMLElement = window.HTMLElement;
  var initDocument = (0, _utilDebounce2['default'])(function () {
    (0, _utilWalkTree2['default'])(document.documentElement.childNodes, function (element) {
      var components = _globalRegistry2['default'].find(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.createdCallback.call(element);
      }
  
      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.attachedCallback.call(element);
      }
    });
  });
  
  function skate(id, userOptions) {
    var Ctor = undefined,
        parentProto = undefined;
    var opts = makeOptions(userOptions);
  
    opts.id = id;
    opts.isNative = opts.type === _typeElement2['default'] && (0, _supportCustomElements2['default'])() && (0, _supportValidCustomElement2['default'])(id);
    parentProto = (opts['extends'] ? document.createElement(opts['extends']).constructor : HTMLElement).prototype;
  
    // Inherit from parent prototype.
    if (!parentProto.isPrototypeOf(opts.prototype)) {
      opts.prototype = (0, _utilAssignSafe2['default'])(Object.create(parentProto), opts.prototype);
    }
  
    // Make custom definition conform to native.
    opts.prototype.createdCallback = (0, _lifecycleCreated2['default'])(opts);
    opts.prototype.attachedCallback = (0, _lifecycleAttached2['default'])(opts);
    opts.prototype.detachedCallback = (0, _lifecycleDetached2['default'])(opts);
    opts.prototype.attributeChangedCallback = (0, _lifecycleAttribute2['default'])(opts);
  
    // Make a constructor for the definition.
    if (opts.isNative) {
      Ctor = document.registerElement(id, {
        'extends': opts['extends'] || undefined,
        prototype: opts.prototype
      });
    } else {
      Ctor = polyfillElementConstructor(opts);
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
  skate.fragment = _apiFragment2['default'];
  skate.init = _apiInit2['default'];
  skate.property = _apiPropertyIndex2['default'];
  skate.ready = _apiReady2['default'];
  skate.render = _apiRenderIndex2['default'];
  skate.version = _apiVersion2['default'];
  
  exports['default'] = skate;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/global.js
__9a43120147a4f5a325d55b702c284d36 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _index = __abb93179bdc0236a6e77d3eae07c991c;
  
  var _index2 = _interopRequireDefault(_index);
  
  var previousSkate = window.skate;
  function noConflict() {
    window.skate = previousSkate;
    return this;
  }
  
  _index2['default'].noConflict = noConflict;
  window.skate = _index2['default'];
  
  exports['default'] = _index2['default'];
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);