// src/util/assign.js
__034bba69dcb153979512026016cf1267 = (function () {
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
// src/util/create-from-html.js
__24eba7325ef5a9f7f75206fb859ab1a6 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
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
  
  function matchTag(html) {
    var tag = html.match(/\s*<([^\s>]+)/);
    return tag && tag[1];
  }
  
  exports['default'] = function (html) {
    var tag = matchTag(html);
    return resolveParent(tag, html);
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/util/data.js
__215a8daa4eb986b5b259ae208d9c9fa8 = (function () {
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
// src/global/vars.js
__3cdb322c13e5f095322724d97745c78d = (function () {
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
__a3c1195d526c44e03da4d6f6b70aff26 = (function () {
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
__44cb5bdcedde6a1b8f3c44a130afb60d = (function () {
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
__d8c0f1f68b71a61c30d7eda3f51cfe0b = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _vars = __3cdb322c13e5f095322724d97745c78d;
  
  var _vars2 = _interopRequireDefault(_vars);
  
  var _utilHasOwn = __a3c1195d526c44e03da4d6f6b70aff26;
  
  var _utilHasOwn2 = _interopRequireDefault(_utilHasOwn);
  
  var _typeElement = __44cb5bdcedde6a1b8f3c44a130afb60d;
  
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
// src/util/ignored.js
__a98c758213a5d57f5a988f42fd802b8c = (function () {
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
__9df260836a1b1d605c5ddac24aa13917 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _ignored = __a98c758213a5d57f5a988f42fd802b8c;
  
  var _ignored2 = _interopRequireDefault(_ignored);
  
  var Node = window.Node;
  
  function walk(elem, fn, filter) {
    if (elem.nodeType !== Node.ELEMENT_NODE || (0, _ignored2['default'])(elem) || filter && filter(elem) === false) {
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
  
    for (var a = 0; a < elems.length; a++) {
      walk(elems[a], fn, filter);
    }
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/lifecycle/attached.js
__aa947a1b83f4a10799f11f619b8e037f = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilData = __215a8daa4eb986b5b259ae208d9c9fa8;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _globalRegistry = __d8c0f1f68b71a61c30d7eda3f51cfe0b;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _utilWalkTree = __9df260836a1b1d605c5ddac24aa13917;
  
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
    return function () {
      var info = (0, _utilData2['default'])(this, opts.id);
      if (info.attached) return;
      info.attached = true;
      info.detached = false;
  
      callAttachedOnDescendants(this, opts.id);
      opts.attached.call(this);
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/util/assign-safe.js
__4733e4a8b9f5d8208f57d623f6613f6c = (function () {
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
// src/util/matches-selector.js
__a4bdc06d804802a393d090d796049981 = (function () {
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
__73a6c7ed1240e78c2a48fbfdc3e261a9 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilMatchesSelector = __a4bdc06d804802a393d090d796049981;
  
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
    handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
    elem.addEventListener(name, handler, capture);
  }
  
  exports['default'] = function (events) {
    var _this = this;
  
    Object.keys(events).forEach(function (name) {
      return bindEvent(_this, name, events[name].bind(_this));
    });
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/util/dash-case.js
__1a93c060999bff3e855758dad2704fa7 = (function () {
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
// src/util/element-contains.js
__97773fd81209e6f33120b08affbe7b0e = (function () {
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
__b359927dfc87426749e0a1725c399b3f = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilElementContains = __97773fd81209e6f33120b08affbe7b0e;
  
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
    var didPreventDefault;
    cEvent.stopPropagation = createReadableStopPropagation(cEvent.stopPropagation);
    while (elem && !cEvent.isPropagationStopped) {
      cEvent.currentTarget = elem;
      if (elem.dispatchEvent(cEvent) === false) {
        didPreventDefault = false;
      }
      elem = elem.parentNode;
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
// src/lifecycle/properties.js
__9203e13b6f36ca26b469289752199c39 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilAssignSafe = __4733e4a8b9f5d8208f57d623f6613f6c;
  
  var _utilAssignSafe2 = _interopRequireDefault(_utilAssignSafe);
  
  var _utilDashCase = __1a93c060999bff3e855758dad2704fa7;
  
  var _utilDashCase2 = _interopRequireDefault(_utilDashCase);
  
  var _utilData = __215a8daa4eb986b5b259ae208d9c9fa8;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _apiEmit = __b359927dfc87426749e0a1725c399b3f;
  
  var _apiEmit2 = _interopRequireDefault(_apiEmit);
  
  function isEmpty(value) {
    return value == null;
  }
  
  function property(name, prop) {
    var internalValue = undefined;
    var isBoolean = prop.type === Boolean;
  
    if (typeof prop.init === 'function') {
      internalValue = prop.init();
    } else if (prop.init !== undefined) {
      internalValue = prop.init;
    }
  
    prop.get = function () {
      return internalValue;
    };
  
    prop.set = function (value) {
      var info = (0, _utilData2['default'])(this);
  
      if (isEmpty(value) && prop.attr && !info.updatingProperty) {
        this.removeAttribute(prop.attr);
        return;
      }
  
      // If the property is being updated and it is a boolean we must just check
      // if the attribute exists because "" is true for a boolean attribute.
      if (info.updatingProperty && isBoolean) {
        value = this.hasAttribute(prop.attr);
      }
  
      // We report both new and old values;
      var newValue = prop.type ? prop.type(value) : value;
      var oldValue = internalValue;
      internalValue = newValue;
  
      // Don't do anything if the values are the same.
      if (newValue === oldValue) {
        return;
      }
  
      // We check first to see if we're already updating the property from
      // the attribute. If we are, then there's no need to update the attribute
      // especially because it would invoke an infinite loop.
      if (prop.attr && !info.updatingProperty) {
        info.updatingAttribute = true;
  
        if (isBoolean && internalValue) {
          this.setAttribute(prop.attr, '');
        } else if (isEmpty(internalValue) || isBoolean && !internalValue) {
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
      if (prop.update) {
        prop.update.call(this, newValue, oldValue);
      }
  
      // If we are emitting notify the element of the change.
      if (prop.emit) {
        (0, _apiEmit2['default'])(this, prop.emit, {
          bubbles: false,
          cancelable: false,
          detail: {
            name: name,
            newValue: newValue,
            oldValue: oldValue
          }
        });
      }
    };
  
    return prop;
  }
  
  function defineProperty(elem, name) {
    var properties = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  
    var initialValue = undefined;
    var info = (0, _utilData2['default'])(elem);
  
    if (!info.attributeToPropertyMap) {
      info.attributeToPropertyMap = {};
    }
  
    var prop = typeof properties === 'function' ? { type: properties } : (0, _utilAssignSafe2['default'])({}, properties);
  
    if (prop.attr) {
      if (prop.attr === true) {
        prop.attr = (0, _utilDashCase2['default'])(name);
      }
      info.attributeToPropertyMap[prop.attr] = name;
    }
  
    if (prop.attr && elem.hasAttribute(prop.attr)) {
      initialValue = elem.getAttribute(prop.attr);
    } else {
      initialValue = elem[name];
    }
  
    if (prop.emit === true) {
      prop.emit = 'skate.property';
    }
  
    if (initialValue !== undefined) {
      prop.init = initialValue;
    }
  
    if (prop.type) {
      prop.init = prop.type === Boolean && prop.init === '' || prop.type(prop.init);
    }
  
    prop = property(name, prop);
    Object.defineProperty(elem, name, prop);
  }
  
  exports['default'] = function (props) {
    var _this = this;
  
    Object.keys(props).forEach(function (name) {
      return defineProperty(_this, name, props[name]);
    });
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/util/protos.js
__045fd6618a25021574f48d1649f7d6d4 = (function () {
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
// src/lifecycle/render.js
__a76faf89d78dc88949edae6dca2a3fc3 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = lifecycleRender;
  
  function lifecycleRender(elem, opts) {
    var temp = opts.render;
    if (temp && !elem.hasAttribute(opts.resolvedAttribute)) {
      temp.call(elem);
    }
  }
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);
// src/lifecycle/created.js
__1f947a75fdbe7749687fe46bf6e1d60e = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilAssignSafe = __4733e4a8b9f5d8208f57d623f6613f6c;
  
  var _utilAssignSafe2 = _interopRequireDefault(_utilAssignSafe);
  
  var _utilData = __215a8daa4eb986b5b259ae208d9c9fa8;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _events = __73a6c7ed1240e78c2a48fbfdc3e261a9;
  
  var _events2 = _interopRequireDefault(_events);
  
  var _properties = __9203e13b6f36ca26b469289752199c39;
  
  var _properties2 = _interopRequireDefault(_properties);
  
  var _utilProtos = __045fd6618a25021574f48d1649f7d6d4;
  
  var _utilProtos2 = _interopRequireDefault(_utilProtos);
  
  var _globalRegistry = __d8c0f1f68b71a61c30d7eda3f51cfe0b;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _render = __a76faf89d78dc88949edae6dca2a3fc3;
  
  var _render2 = _interopRequireDefault(_render);
  
  var _utilWalkTree = __9df260836a1b1d605c5ddac24aa13917;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  var elProto = window.Element.prototype;
  var oldSetAttribute = elProto.setAttribute;
  var oldRemoveAttribute = elProto.removeAttribute;
  
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
  
  function createCallUpdateOnProperties(opts) {
    var props = opts.properties || {};
    var names = Object.keys(props);
    return function (elem) {
      names.forEach(function (name) {
        var prop = props[name];
        var update = prop && prop.update;
        var val = elem[name];
        if (prop && prop.type) {
          val = prop.type === Boolean && elem.hasAttribute(typeof prop.attr === 'string' ? prop.attr : name) || prop.type(val);
        }
        update && update.call(elem, val);
      });
    };
  }
  
  function markAsResolved(elem, resolvedAttribute, unresolvedAttribute) {
    elem.removeAttribute(unresolvedAttribute);
    elem.setAttribute(resolvedAttribute, '');
  }
  
  exports['default'] = function (opts) {
    var created = opts.created;
    var isNative = opts.isNative;
    var callUpdateOnProperties = createCallUpdateOnProperties(opts);
    var prototype = applyPrototype(opts.prototype);
    var ready = opts.ready;
  
    return function () {
      var info = (0, _utilData2['default'])(this, opts.id);
      var isResolved = this.hasAttribute(opts.resolvedAttribute);
  
      if (info.created) return;
      info.created = true;
  
      isNative || patchAttributeMethods(this);
      isNative || prototype.call(this);
      opts.created && created.call(this);
      _properties2['default'].call(this, opts.properties);
      _events2['default'].call(this, opts.events);
      (0, _render2['default'])(this, opts);
      callCreatedOnDescendants(this, opts.id);
      callUpdateOnProperties(this);
      opts.ready && ready.call(this);
      isResolved || markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/init.js
__06e29e46909e467d7e2981534433c718 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _lifecycleAttached = __aa947a1b83f4a10799f11f619b8e037f;
  
  var _lifecycleAttached2 = _interopRequireDefault(_lifecycleAttached);
  
  var _lifecycleCreated = __1f947a75fdbe7749687fe46bf6e1d60e;
  
  var _lifecycleCreated2 = _interopRequireDefault(_lifecycleCreated);
  
  var _utilElementContains = __97773fd81209e6f33120b08affbe7b0e;
  
  var _utilElementContains2 = _interopRequireDefault(_utilElementContains);
  
  var _globalRegistry = __d8c0f1f68b71a61c30d7eda3f51cfe0b;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _utilWalkTree = __9df260836a1b1d605c5ddac24aa13917;
  
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
__5aebd7b360f6035fcb5eae3cf167aa0c = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilAssign = __034bba69dcb153979512026016cf1267;
  
  var _utilAssign2 = _interopRequireDefault(_utilAssign);
  
  var _utilCreateFromHtml = __24eba7325ef5a9f7f75206fb859ab1a6;
  
  var _utilCreateFromHtml2 = _interopRequireDefault(_utilCreateFromHtml);
  
  var _init = __06e29e46909e467d7e2981534433c718;
  
  var _init2 = _interopRequireDefault(_init);
  
  var _globalRegistry = __d8c0f1f68b71a61c30d7eda3f51cfe0b;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  function createFromName(name) {
    var ctor = _globalRegistry2['default'].get(name);
    return ctor && ctor() || document.createElement(name);
  }
  
  exports['default'] = function (name, props) {
    name = name.trim();
    return (0, _utilAssign2['default'])(name[0] === '<' ? (0, _init2['default'])((0, _utilCreateFromHtml2['default'])(name).firstElementChild) : createFromName(name), props);
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/fragment.js
__b52416022c1e1bb0b8d0e9a0d4f9b47b = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _init = __06e29e46909e467d7e2981534433c718;
  
  var _init2 = _interopRequireDefault(_init);
  
  var _utilCreateFromHtml = __24eba7325ef5a9f7f75206fb859ab1a6;
  
  var _utilCreateFromHtml2 = _interopRequireDefault(_utilCreateFromHtml);
  
  var DocumentFragmentPrototype = DocumentFragment.prototype;
  var slice = Array.prototype.slice;
  
  function decorateFragmentMethods(frag) {
    frag.appendChild = function (el) {
      return DocumentFragmentPrototype.appendChild.call(this, (0, _init2['default'])(el));
    };
  
    frag.insertBefore = function (el, beforeEl) {
      return DocumentFragmentPrototype.insertBefore.call(this, (0, _init2['default'])(el), beforeEl);
    };
  
    frag.replaceChild = function (el, replacedEl) {
      return DocumentFragmentPrototype.replaceChild.call(this, (0, _init2['default'])(el), replacedEl);
    };
  
    frag.cloneNode = function () {
      var clone = DocumentFragmentPrototype.cloneNode.apply(this, arguments);
      decorateFragmentMethods(clone);
      var children = slice.call(clone.childNodes);
      for (var i = 0; i < children.length; i++) {
        (0, _init2['default'])(children[i]);
      }
      return clone;
    };
  }
  
  exports['default'] = function (html) {
    var frag = document.createDocumentFragment();
    decorateFragmentMethods(frag);
    if (typeof html === 'string') {
      var par = (0, _utilCreateFromHtml2['default'])(html);
      while (par.firstElementChild) {
        frag.appendChild(par.firstElementChild);
      }
    }
    return frag;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/version.js
__d7460f0e422a37e1a7fc24ec178e4d71 = (function () {
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
__63c1f23fc5efbc0955d713fed60ee665 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilData = __215a8daa4eb986b5b259ae208d9c9fa8;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  exports['default'] = function (opts) {
    var callback = opts.attribute || function () {};
  
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
__b549e9c39bdd678050fb5dddb32f9781 = (function () {
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
__645440f8123d3f52f948ad81734055e9 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _typeElement = __44cb5bdcedde6a1b8f3c44a130afb60d;
  
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
__45656e87bb6d0fdcb19110dccb365d03 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilData = __215a8daa4eb986b5b259ae208d9c9fa8;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _globalRegistry = __d8c0f1f68b71a61c30d7eda3f51cfe0b;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _utilWalkTree = __9df260836a1b1d605c5ddac24aa13917;
  
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
    return function () {
      var info = (0, _utilData2['default'])(this, opts.id);
      if (info.detached) return;
      info.detached = true;
      info.attached = false;
  
      callDetachedOnDescendants(this, opts.id);
      opts.detached.call(this);
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/util/get-closest-ignored-element.js
__be4cf76d43d442cf553a377fd4406fa8 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _ignored = __a98c758213a5d57f5a988f42fd802b8c;
  
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
__98461b36e4f8a93b23b917015ba8e013 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _vars = __3cdb322c13e5f095322724d97745c78d;
  
  var _vars2 = _interopRequireDefault(_vars);
  
  var _utilGetClosestIgnoredElement = __be4cf76d43d442cf553a377fd4406fa8;
  
  var _utilGetClosestIgnoredElement2 = _interopRequireDefault(_utilGetClosestIgnoredElement);
  
  var _registry = __d8c0f1f68b71a61c30d7eda3f51cfe0b;
  
  var _registry2 = _interopRequireDefault(_registry);
  
  var _utilWalkTree = __9df260836a1b1d605c5ddac24aa13917;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  var MutationObserver = window.MutationObserver || window.SkateMutationObserver;
  
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
__e7294cbe499255967719a22237dce52b = (function () {
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
__26dfb5025c821c9d8bfe394e6ecc76df = (function () {
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
__fd7d0a0f6a811a4f7337fd79efac02fc = (function () {
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
__463caf43c0e7b4d3b58c86b511303fa0 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _apiCreate = __5aebd7b360f6035fcb5eae3cf167aa0c;
  
  var _apiCreate2 = _interopRequireDefault(_apiCreate);
  
  var _apiEmit = __b359927dfc87426749e0a1725c399b3f;
  
  var _apiEmit2 = _interopRequireDefault(_apiEmit);
  
  var _apiFragment = __b52416022c1e1bb0b8d0e9a0d4f9b47b;
  
  var _apiFragment2 = _interopRequireDefault(_apiFragment);
  
  var _apiInit = __06e29e46909e467d7e2981534433c718;
  
  var _apiInit2 = _interopRequireDefault(_apiInit);
  
  var _apiVersion = __d7460f0e422a37e1a7fc24ec178e4d71;
  
  var _apiVersion2 = _interopRequireDefault(_apiVersion);
  
  var _utilAssign = __034bba69dcb153979512026016cf1267;
  
  var _utilAssign2 = _interopRequireDefault(_utilAssign);
  
  var _utilAssignSafe = __4733e4a8b9f5d8208f57d623f6613f6c;
  
  var _utilAssignSafe2 = _interopRequireDefault(_utilAssignSafe);
  
  var _lifecycleAttached = __aa947a1b83f4a10799f11f619b8e037f;
  
  var _lifecycleAttached2 = _interopRequireDefault(_lifecycleAttached);
  
  var _lifecycleAttribute = __63c1f23fc5efbc0955d713fed60ee665;
  
  var _lifecycleAttribute2 = _interopRequireDefault(_lifecycleAttribute);
  
  var _lifecycleCreated = __1f947a75fdbe7749687fe46bf6e1d60e;
  
  var _lifecycleCreated2 = _interopRequireDefault(_lifecycleCreated);
  
  var _utilDebounce = __b549e9c39bdd678050fb5dddb32f9781;
  
  var _utilDebounce2 = _interopRequireDefault(_utilDebounce);
  
  var _defaults = __645440f8123d3f52f948ad81734055e9;
  
  var _defaults2 = _interopRequireDefault(_defaults);
  
  var _lifecycleDetached = __45656e87bb6d0fdcb19110dccb365d03;
  
  var _lifecycleDetached2 = _interopRequireDefault(_lifecycleDetached);
  
  var _globalDocumentObserver = __98461b36e4f8a93b23b917015ba8e013;
  
  var _globalDocumentObserver2 = _interopRequireDefault(_globalDocumentObserver);
  
  var _utilElementConstructor = __e7294cbe499255967719a22237dce52b;
  
  var _utilElementConstructor2 = _interopRequireDefault(_utilElementConstructor);
  
  var _globalRegistry = __d8c0f1f68b71a61c30d7eda3f51cfe0b;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _supportCustomElements = __26dfb5025c821c9d8bfe394e6ecc76df;
  
  var _supportCustomElements2 = _interopRequireDefault(_supportCustomElements);
  
  var _typeElement = __44cb5bdcedde6a1b8f3c44a130afb60d;
  
  var _typeElement2 = _interopRequireDefault(_typeElement);
  
  var _utilWalkTree = __9df260836a1b1d605c5ddac24aa13917;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  var _supportValidCustomElement = __fd7d0a0f6a811a4f7337fd79efac02fc;
  
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
    var Ctor = undefined,
        CtorParent = undefined;
    var opts = makeOptions(userOptions);
  
    opts.id = id;
    opts.isNative = opts.type === _typeElement2['default'] && (0, _supportCustomElements2['default'])() && (0, _supportValidCustomElement2['default'])(id);
    CtorParent = opts['extends'] ? document.createElement(opts['extends']).constructor : HTMLElement;
  
    // Inherit from parent prototype.
    if (!CtorParent.prototype.isPrototypeOf(opts.prototype)) {
      opts.prototype = (0, _utilAssignSafe2['default'])(Object.create(CtorParent.prototype), opts.prototype);
    }
  
    // Extend behaviour of existing callbacks.
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
  skate.fragment = _apiFragment2['default'];
  skate.init = _apiInit2['default'];
  skate.version = _apiVersion2['default'];
  
  // ES6
  exports['default'] = skate;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/global.js
__99361808da1b0f6b886d6f11257e7232 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _index = __463caf43c0e7b4d3b58c86b511303fa0;
  
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