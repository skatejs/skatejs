// node_modules/object-assign/index.js
(typeof window === 'undefined' ? global : window).__353aa4e211d787df44ab978a5a75c249 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  /* eslint-disable no-unused-vars */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  
  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}
  
  	return Object(val);
  }
  
  module.exports = Object.assign || function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;
  
  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);
  
  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}
  
  		if (Object.getOwnPropertySymbols) {
  			symbols = Object.getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}
  
  	return to;
  };
  
  
  return module.exports;
}).call(this);
// src/util/element-contains.js
(typeof window === 'undefined' ? global : window).__6bcfe03fbc2ab82779544fc025f526c8 = (function () {
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
// src/global/vars.js
(typeof window === 'undefined' ? global : window).__6445636516e326f883c0d0977f200342 = (function () {
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
// src/global/registry.js
(typeof window === 'undefined' ? global : window).__c5a0afa9d0578d167d0227b32abc8a92 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _vars = __6445636516e326f883c0d0977f200342;
  
  var _vars2 = _interopRequireDefault(_vars);
  
  var definitions = {};
  var map = [];
  var types = [];
  
  exports['default'] = _vars2['default'].registerIfNotExists('registry', {
    get: function get(name) {
      return Object.prototype.hasOwnProperty.call(definitions, name) && definitions[name];
    },
    set: function set(name, Ctor) {
      if (this.get(name)) {
        throw new Error('A Skate component with the name of "' + name + '" already exists.');
      }
  
      var type = Ctor.type;
      var typeIndex = types.indexOf(type);
  
      if (typeIndex === -1) {
        typeIndex = types.length;
        types.push(type);
        map[typeIndex] = {};
      }
  
      return definitions[name] = map[typeIndex][name] = Ctor;
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
(typeof window === 'undefined' ? global : window).__bb3ef9633325c0145428d55035ddc402 = (function () {
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
(typeof window === 'undefined' ? global : window).__e2f97b0e142d4a2a3414fbe5e42af13c = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _ignored = __bb3ef9633325c0145428d55035ddc402;
  
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
(typeof window === 'undefined' ? global : window).__295960f0bb6206a012930328aa94c78e = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilElementContains = __6bcfe03fbc2ab82779544fc025f526c8;
  
  var _utilElementContains2 = _interopRequireDefault(_utilElementContains);
  
  var _globalRegistry = __c5a0afa9d0578d167d0227b32abc8a92;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _utilWalkTree = __e2f97b0e142d4a2a3414fbe5e42af13c;
  
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
// src/api/create.js
(typeof window === 'undefined' ? global : window).__f6f65a565c709b69651c25a4f54ac7f4 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _objectAssign = __353aa4e211d787df44ab978a5a75c249;
  
  var _objectAssign2 = _interopRequireDefault(_objectAssign);
  
  var _init = __295960f0bb6206a012930328aa94c78e;
  
  var _init2 = _interopRequireDefault(_init);
  
  var _globalRegistry = __c5a0afa9d0578d167d0227b32abc8a92;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  exports['default'] = function (name, props) {
    var Ctor = _globalRegistry2['default'].get(name);
    var elem = Ctor ? Ctor.type.create(Ctor) : document.createElement(name);
    Ctor && Ctor.isNative || (0, _init2['default'])(elem);
    return (0, _objectAssign2['default'])(elem, props);
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/emit.js
(typeof window === 'undefined' ? global : window).__0c127fafef24938352a5d4a34240ab22 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilElementContains = __6bcfe03fbc2ab82779544fc025f526c8;
  
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
  
  function dispatch(elem, cEvent) {
    if (!elem.disabled) {
      return elem.dispatchEvent(cEvent);
    }
    cEvent.isPropagationStopped = true;
  }
  
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
    Object.defineProperty(cEvent, 'target', { get: function get() {
        return elem;
      } });
    while (currentElem && !cEvent.isPropagationStopped) {
      cEvent.currentTarget = currentElem;
      if (dispatch(currentElem, cEvent) === false) {
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
  
    return shouldSimulateBubbling ? simulateBubbling(elem, cEvent) : dispatch(elem, cEvent);
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
// src/api/fragment.js
(typeof window === 'undefined' ? global : window).__30ef055188e7cce79873fd664b95ed66 = (function () {
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
  
  var _init = __295960f0bb6206a012930328aa94c78e;
  
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
// src/api/properties/boolean.js
(typeof window === 'undefined' ? global : window).__e3fbdf17ae63cdc3bc2282d28716fb4e = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = {
    coerce: function coerce(value) {
      return !!value;
    },
    'default': false,
    deserialize: function deserialize(value) {
      return !(value === null);
    },
    serialize: function serialize(value) {
      return value ? '' : undefined;
    }
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/util/empty.js
(typeof window === 'undefined' ? global : window).__acefb2d348c3a44c55302feebd03913a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  exports['default'] = function (val) {
    return typeof val === 'undefined' || val === null;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/properties/number.js
(typeof window === 'undefined' ? global : window).__5e134b91fd19518c6c7155f513e1dc5a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilEmpty = __acefb2d348c3a44c55302feebd03913a;
  
  var _utilEmpty2 = _interopRequireDefault(_utilEmpty);
  
  var alwaysUndefinedIfEmpty = function alwaysUndefinedIfEmpty(val) {
    return (0, _utilEmpty2['default'])(val) ? undefined : Number(val);
  };
  
  exports['default'] = {
    coerce: alwaysUndefinedIfEmpty,
    deserialize: alwaysUndefinedIfEmpty,
    serialize: alwaysUndefinedIfEmpty
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/properties/string.js
(typeof window === 'undefined' ? global : window).__3968e95fd5ba48185f983320cfa3c18a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilEmpty = __acefb2d348c3a44c55302feebd03913a;
  
  var _utilEmpty2 = _interopRequireDefault(_utilEmpty);
  
  var alwaysUndefinedIfEmpty = function alwaysUndefinedIfEmpty(val) {
    return (0, _utilEmpty2['default'])(val) ? undefined : String(val);
  };
  
  exports['default'] = {
    coerce: alwaysUndefinedIfEmpty,
    deserialize: alwaysUndefinedIfEmpty,
    serialize: alwaysUndefinedIfEmpty
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/properties/index.js
(typeof window === 'undefined' ? global : window).__1b8cf8e3600b24b489bc028ad27a1d0a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _objectAssign = __353aa4e211d787df44ab978a5a75c249;
  
  var _objectAssign2 = _interopRequireDefault(_objectAssign);
  
  var _boolean = __e3fbdf17ae63cdc3bc2282d28716fb4e;
  
  var _boolean2 = _interopRequireDefault(_boolean);
  
  var _number = __5e134b91fd19518c6c7155f513e1dc5a;
  
  var _number2 = _interopRequireDefault(_number);
  
  var _string = __3968e95fd5ba48185f983320cfa3c18a;
  
  var _string2 = _interopRequireDefault(_string);
  
  function prop(def) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      args.unshift({}, def);
      return _objectAssign2['default'].apply(null, args);
    };
  }
  
  exports['default'] = {
    boolean: prop(_boolean2['default']),
    number: prop(_number2['default']),
    string: prop(_string2['default'])
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/util/data.js
(typeof window === 'undefined' ? global : window).__fddcb3c02b4880b7bd627c13683f751e = (function () {
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
// src/api/ready.js
(typeof window === 'undefined' ? global : window).__d9609519601942f0f3cf03e89f529414 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilData = __fddcb3c02b4880b7bd627c13683f751e;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _globalRegistry = __c5a0afa9d0578d167d0227b32abc8a92;
  
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
(typeof window === 'undefined' ? global : window).__d3b6720cadecc04a64d1d31598cb6700 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _fragment = __30ef055188e7cce79873fd664b95ed66;
  
  var _fragment2 = _interopRequireDefault(_fragment);
  
  exports['default'] = function (render) {
    return function (elem) {
      var rendered = render(elem);
      while (elem.childNodes.length) {
        elem.removeChild(elem.childNodes[0]);
      }
      elem.appendChild((0, _fragment2['default'])(rendered));
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/api/render/index.js
(typeof window === 'undefined' ? global : window).__44a0ab908423d46dece58ae14502d6a5 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _html = __d3b6720cadecc04a64d1d31598cb6700;
  
  var _html2 = _interopRequireDefault(_html);
  
  var _globalRegistry = __c5a0afa9d0578d167d0227b32abc8a92;
  
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
(typeof window === 'undefined' ? global : window).__e114dc9788d86bf6bce98549a964cc66 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports['default'] = '0.15.2';
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/lifecycle/attached.js
(typeof window === 'undefined' ? global : window).__d3cc4f73de07fed8af79602fe760a6bc = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilData = __fddcb3c02b4880b7bd627c13683f751e;
  
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
(typeof window === 'undefined' ? global : window).__3e5a047746044557f4a235875daca69d = (function () {
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
(typeof window === 'undefined' ? global : window).__1b645af1f01d5843552ff3567eb9ab4e = (function () {
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
(typeof window === 'undefined' ? global : window).__d0e4ee96089c15c32644554db9ec60d2 = (function () {
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
  
  var _utilMatchesSelector = __1b645af1f01d5843552ff3567eb9ab4e;
  
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
(typeof window === 'undefined' ? global : window).__2ca0253fd576ba2cf3b4b1d6c1d66993 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = patchAttributeMethods;
  
  function patchAttributeMethods(elem) {
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
// src/util/dash-case.js
(typeof window === 'undefined' ? global : window).__4cbfe4fe19a10b341b105765bb9a7022 = (function () {
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
// src/lifecycle/properties-init.js
(typeof window === 'undefined' ? global : window).__f80727be0f20ba37792d8e543f70fa55 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _objectAssign = __353aa4e211d787df44ab978a5a75c249;
  
  var _objectAssign2 = _interopRequireDefault(_objectAssign);
  
  var _utilDashCase = __4cbfe4fe19a10b341b105765bb9a7022;
  
  var _utilDashCase2 = _interopRequireDefault(_utilDashCase);
  
  var _utilData = __fddcb3c02b4880b7bd627c13683f751e;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _utilEmpty = __acefb2d348c3a44c55302feebd03913a;
  
  var _utilEmpty2 = _interopRequireDefault(_utilEmpty);
  
  var _window$Element$prototype = window.Element.prototype;
  var removeAttribute = _window$Element$prototype.removeAttribute;
  var setAttribute = _window$Element$prototype.setAttribute;
  
  function getData(elem, name) {
    return (0, _utilData2['default'])(elem, 'api/property/' + name);
  }
  
  function getDataForAttribute(elem, name) {
    return getData(elem, getData(elem, name).linkedProperty);
  }
  
  function getLinkedAttribute(name, attr) {
    return attr === true ? (0, _utilDashCase2['default'])(name) : attr;
  }
  
  function createNativePropertyDefinition(name, opts) {
    var prop = {
      configurable: true,
      enumerable: true
    };
  
    prop.created = function (elem, initialValue) {
      var info = getData(elem, name);
      info.linkedAttribute = getLinkedAttribute(name, opts.attribute);
      info.opts = opts;
      info.updatingProperty = false;
  
      // Ensure we can get the info from inside the attribute methods.
      getData(elem, info.linkedAttribute).linkedProperty = name;
  
      if (typeof opts['default'] === 'function') {
        info.defaultValue = opts['default'](elem);
      } else if (!(0, _utilEmpty2['default'])(opts['default'])) {
        info.defaultValue = opts['default'];
      }
  
      // TODO Refactor to be cleaner.
      //
      // We only override removeAttribute and setAttribute once. This means that
      // if you define 10 properties, they still only get overridden once. For
      // this reason, we must re-get info / opts from within the property methods
      // since the functions aren't recreated for each scope.
      if (info.linkedAttribute) {
        if (!info.attributeMap) {
          info.attributeMap = {};
  
          elem.removeAttribute = function (attrName) {
            var info = getDataForAttribute(this, attrName);
  
            if (!info.linkedAttribute) {
              return removeAttribute.call(this, attrName);
            }
  
            var prop = info.attributeMap[attrName];
            var serializedValue = info.opts.serialize(info.defaultValue);
            info.updatingAttribute = true;
  
            if ((0, _utilEmpty2['default'])(serializedValue)) {
              removeAttribute.call(this, attrName);
            } else {
              setAttribute.call(this, attrName, serializedValue);
            }
  
            if (prop) {
              elem[prop] = undefined;
            }
  
            info.updatingAttribute = false;
          };
  
          elem.setAttribute = function (attrName, attrValue) {
            var info = getDataForAttribute(this, attrName);
  
            if (!info.linkedAttribute) {
              return setAttribute.call(this, attrName, attrValue);
            }
  
            var prop = info.attributeMap[attrName];
            info.updatingAttribute = true;
            setAttribute.call(this, attrName, attrValue);
  
            if (prop) {
              elem[prop] = info.opts.deserialize(attrValue);
            }
  
            info.updatingAttribute = false;
          };
        }
  
        info.attributeMap[info.linkedAttribute] = name;
      }
  
      // Set up initial value if it wasn't specified.
      if ((0, _utilEmpty2['default'])(initialValue)) {
        if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
          initialValue = opts.deserialize(elem.getAttribute(info.linkedAttribute));
        } else {
          initialValue = info.defaultValue;
        }
      }
  
      // We must coerce the initial value just in case it wasn't already.
      info.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;
  
      // User-defined created callback.
      if (typeof opts.created === 'function') {
        opts.created(elem, initialValue);
      }
    };
  
    prop.get = function () {
      var info = getData(this, name);
      var internalValue = info.internalValue;
  
      if (opts.get) {
        return opts.get(this, { name: name, internalValue: internalValue });
      }
  
      return internalValue;
    };
  
    prop.init = function () {
      var init = getData(this, name).internalValue;
      this[name] = (0, _utilEmpty2['default'])(init) ? this[name] : init;
    };
  
    prop.set = function (newValue) {
      var info = getData(this, name);
      var oldValue = info.oldValue;
  
      if (info.updatingProperty) {
        return;
      }
  
      info.updatingProperty = true;
  
      if ((0, _utilEmpty2['default'])(newValue)) {
        newValue = info.defaultValue;
      }
  
      if (typeof opts.coerce === 'function') {
        newValue = opts.coerce(newValue);
      }
  
      info.internalValue = newValue;
  
      if (info.linkedAttribute && !info.updatingAttribute) {
        var serializedValue = opts.serialize(newValue);
        if ((0, _utilEmpty2['default'])(serializedValue)) {
          removeAttribute.call(this, info.linkedAttribute);
        } else {
          setAttribute.call(this, info.linkedAttribute, serializedValue);
        }
      }
  
      if (typeof opts.set === 'function') {
        opts.set(this, { name: name, newValue: newValue, oldValue: oldValue });
      }
  
      info.oldValue = newValue;
      info.updatingProperty = false;
    };
  
    return prop;
  }
  
  exports['default'] = function (opts) {
    opts = opts || {};
  
    if (typeof opts === 'function') {
      opts = { coerce: opts };
    }
  
    return function (name) {
      return createNativePropertyDefinition(name, (0, _objectAssign2['default'])({
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
// src/lifecycle/properties-created.js
(typeof window === 'undefined' ? global : window).__7e8c742bba498070c4e3b453732b9dcb = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = propertiesApply;
  
  function propertiesApply(elem, properties) {
    Object.keys(properties).forEach(function (name) {
      var prop = properties[name];
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
(typeof window === 'undefined' ? global : window).__5906290820d179e0a48c43d6b0ac92b3 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = propertiesApply;
  
  function propertiesApply(elem, properties) {
    Object.keys(properties).forEach(function (name) {
      properties[name].init.call(elem);
    });
  }
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);
// src/util/protos.js
(typeof window === 'undefined' ? global : window).__262f1dced81ad25a69692fc69f59732d = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  exports["default"] = function (proto) {
    var chains = [];
    while (proto) {
      chains.push(proto);
      proto = Object.getPrototypeOf(proto);
    }
    chains.reverse();
    return chains;
  };
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);
// src/util/define-properties.js
(typeof window === 'undefined' ? global : window).__02e13fbc76a00a14ff4b4f07a6813e3c = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  exports['default'] = function (obj, props) {
    Object.keys(props).forEach(function (name) {
      var prop = props[name];
      var descrptor = Object.getOwnPropertyDescriptor(obj, name);
      var isDinosaurBrowser = name !== 'arguments' && name !== 'caller' && 'value' in prop;
      var isConfigurable = !descrptor || descrptor.configurable;
  
      if (isConfigurable) {
        Object.defineProperty(obj, name, prop);
      } else if (isDinosaurBrowser) {
        obj[name] = prop.value;
      }
    });
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/util/get-own-property-descriptors.js
(typeof window === 'undefined' ? global : window).__5e949ee5969d09b1ffa9f8fff91381bc = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  exports["default"] = function (obj) {
    return Object.getOwnPropertyNames(obj).reduce(function (prev, curr) {
      prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
      return prev;
    }, {});
  };
  
  module.exports = exports["default"];
  
  return module.exports;
}).call(this);
// src/lifecycle/prototype.js
(typeof window === 'undefined' ? global : window).__049ac63cba0d3113b9ceb8b5142addc0 = (function () {
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
  
  var _utilProtos = __262f1dced81ad25a69692fc69f59732d;
  
  var _utilProtos2 = _interopRequireDefault(_utilProtos);
  
  var _utilDefineProperties = __02e13fbc76a00a14ff4b4f07a6813e3c;
  
  var _utilDefineProperties2 = _interopRequireDefault(_utilDefineProperties);
  
  var _utilGetOwnPropertyDescriptors = __5e949ee5969d09b1ffa9f8fff91381bc;
  
  var _utilGetOwnPropertyDescriptors2 = _interopRequireDefault(_utilGetOwnPropertyDescriptors);
  
  function prototype(opts) {
    var prototypes = (0, _utilProtos2['default'])(opts.prototype);
    return function (elem) {
      prototypes.forEach(function (proto) {
        if (!proto.isPrototypeOf(elem)) {
          (0, _utilDefineProperties2['default'])(elem, (0, _utilGetOwnPropertyDescriptors2['default'])(proto));
        }
      });
    };
  }
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/lifecycle/resolve.js
(typeof window === 'undefined' ? global : window).__b7dcfb78eb4ebfd5d6daafcb1014d2e2 = (function () {
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
(typeof window === 'undefined' ? global : window).__54c1621d9a7829fe88fdc4b9d3386051 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilData = __fddcb3c02b4880b7bd627c13683f751e;
  
  var _utilData2 = _interopRequireDefault(_utilData);
  
  var _apiEmit = __0c127fafef24938352a5d4a34240ab22;
  
  var _apiEmit2 = _interopRequireDefault(_apiEmit);
  
  var _events = __d0e4ee96089c15c32644554db9ec60d2;
  
  var _events2 = _interopRequireDefault(_events);
  
  var _patchAttributeMethods = __2ca0253fd576ba2cf3b4b1d6c1d66993;
  
  var _patchAttributeMethods2 = _interopRequireDefault(_patchAttributeMethods);
  
  var _propertiesInit = __f80727be0f20ba37792d8e543f70fa55;
  
  var _propertiesInit2 = _interopRequireDefault(_propertiesInit);
  
  var _propertiesCreated = __7e8c742bba498070c4e3b453732b9dcb;
  
  var _propertiesCreated2 = _interopRequireDefault(_propertiesCreated);
  
  var _propertiesReady = __5906290820d179e0a48c43d6b0ac92b3;
  
  var _propertiesReady2 = _interopRequireDefault(_propertiesReady);
  
  var _prototype = __049ac63cba0d3113b9ceb8b5142addc0;
  
  var _prototype2 = _interopRequireDefault(_prototype);
  
  var _resolve = __b7dcfb78eb4ebfd5d6daafcb1014d2e2;
  
  var _resolve2 = _interopRequireDefault(_resolve);
  
  var readyEventName = 'skate.ready';
  var readyEventOptions = { bubbles: false, cancelable: false };
  
  // TODO Remove this when we no longer support the legacy definitions and only
  // support a superset of a native property definition.
  function ensurePropertyFunctions(opts) {
    var properties = opts.properties;
    var names = Object.keys(properties || {});
    return names.reduce(function (descriptors, descriptorName) {
      descriptors[descriptorName] = opts.properties[descriptorName];
      if (typeof descriptors[descriptorName] !== 'function') {
        descriptors[descriptorName] = (0, _propertiesInit2['default'])(descriptors[descriptorName]);
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
  
  exports['default'] = function (opts) {
    var applyEvents = (0, _events2['default'])(opts);
    var applyPrototype = (0, _prototype2['default'])(opts);
    var propertyFunctions = ensurePropertyFunctions(opts);
  
    return function () {
      var info = (0, _utilData2['default'])(this, 'lifecycle/' + opts.id);
      var native = opts.isNative;
      var resolved = this.hasAttribute('resolved');
  
      if (info.created) return;
      info.created = true;
      var propertyDefinitions = ensurePropertyDefinitions(this, propertyFunctions);
  
      native || opts.attribute && (0, _patchAttributeMethods2['default'])(this);
      native || opts.prototype && applyPrototype(this);
      opts.properties && (0, _propertiesCreated2['default'])(this, propertyDefinitions);
      opts.events && applyEvents(this);
      opts.created && opts.created(this);
      resolved || opts.render && opts.render(this);
      opts.properties && (0, _propertiesReady2['default'])(this, propertyDefinitions);
      opts.ready && opts.ready(this);
      (0, _apiEmit2['default'])(this, readyEventName, readyEventOptions);
      resolved || (0, _resolve2['default'])(this, opts);
    };
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/type/element.js
(typeof window === 'undefined' ? global : window).__defe6124e9b33e8efda86549fb8c3d4e = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var documentCreateElement = document.createElement.bind(document);
  
  exports['default'] = {
    create: function create(Ctor) {
      var elem = Ctor['extends'] ? documentCreateElement(Ctor['extends'], Ctor.id) : documentCreateElement(Ctor.id);
      !Ctor.isNative && Ctor['extends'] && elem.setAttribute('is', Ctor.id);
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
// src/defaults.js
(typeof window === 'undefined' ? global : window).__3d21be0f26fe51bf369a576ea360130a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _typeElement = __defe6124e9b33e8efda86549fb8c3d4e;
  
  var _typeElement2 = _interopRequireDefault(_typeElement);
  
  var noop = function noop() {};
  
  exports['default'] = {
    attached: noop,
    attribute: noop,
    created: noop,
    render: noop,
    detached: noop,
    events: {},
    'extends': '',
    properties: {},
    prototype: {},
    resolvedAttribute: 'resolved',
    ready: noop,
    type: _typeElement2['default'],
    unresolvedAttribute: 'unresolved'
  };
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/lifecycle/detached.js
(typeof window === 'undefined' ? global : window).__9e5131b8efe6e3f893afb506c0e9f6dd = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _utilData = __fddcb3c02b4880b7bd627c13683f751e;
  
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
// src/fix/ie/innerhtml.js
(typeof window === 'undefined' ? global : window).__bf69e90fa3cafde48d1f65a1a53e2485 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  var isIeUntil10 = /MSIE/.test(navigator.userAgent);
  var isIe11 = /Trident/.test(navigator.userAgent);
  var isIe = isIeUntil10 || isIe11;
  var elementPrototype = window.HTMLElement.prototype;
  
  // ! This walkTree method differs from the implementation in ../../utils/walk-tree
  // It invokes the callback only for the children, not the passed node and the second parameter to the callback is the parent node
  function walkTree(node, cb) {
    var childNodes = node.childNodes;
  
    if (!childNodes) {
      return;
    }
  
    var childNodesLen = childNodes.length;
  
    for (var a = 0; a < childNodesLen; a++) {
      var childNode = childNodes[a];
      cb(childNode, node);
      walkTree(childNode, cb);
    }
  }
  
  function fixInnerHTML() {
    var originalInnerHTML = Object.getOwnPropertyDescriptor(elementPrototype, 'innerHTML');
  
    var get = function get() {
      return originalInnerHTML.get.call(this);
    };
    get._hasBeenEnhanced = true;
  
    // This redefines the innerHTML property so that we can ensure that events
    // are properly triggered.
    Object.defineProperty(elementPrototype, 'innerHTML', {
      get: get,
      set: function set(html) {
        walkTree(this, function (node, parentNode) {
          var mutationEvent = document.createEvent('MutationEvent');
          mutationEvent.initMutationEvent('DOMNodeRemoved', true, false, parentNode, null, null, null, null);
          node.dispatchEvent(mutationEvent);
        });
        originalInnerHTML.set.call(this, html);
      }
    });
  }
  
  if (isIe) {
    // IE 9-11
    var propertyDescriptor = Object.getOwnPropertyDescriptor(elementPrototype, 'innerHTML');
    var hasBeenEnhanced = !!propertyDescriptor && propertyDescriptor.get._hasBeenEnhanced;
  
    if (!hasBeenEnhanced) {
      if (isIe11) {
        // IE11's native MutationObserver needs some help as well :()
        window.MutationObserver = window.JsMutationObserver || window.MutationObserver;
      }
  
      fixInnerHTML();
    }
  }
  
  return module.exports;
}).call(this);
// src/util/get-closest-ignored-element.js
(typeof window === 'undefined' ? global : window).__c38c053e1d22e9ff50d3d968700a6de1 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _ignored = __bb3ef9633325c0145428d55035ddc402;
  
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
(typeof window === 'undefined' ? global : window).__642b6fb02cb7b38d92af73ced537a047 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  __bf69e90fa3cafde48d1f65a1a53e2485;
  
  var _utilGetClosestIgnoredElement = __c38c053e1d22e9ff50d3d968700a6de1;
  
  var _utilGetClosestIgnoredElement2 = _interopRequireDefault(_utilGetClosestIgnoredElement);
  
  var _vars = __6445636516e326f883c0d0977f200342;
  
  var _vars2 = _interopRequireDefault(_vars);
  
  var _registry = __c5a0afa9d0578d167d0227b32abc8a92;
  
  var _registry2 = _interopRequireDefault(_registry);
  
  var _utilWalkTree = __e2f97b0e142d4a2a3414fbe5e42af13c;
  
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
  
  function createMutationObserver() {
    var MutationObserver = window.MutationObserver;
  
    if (!MutationObserver) {
      throw new Error('Mutation Observers are not supported by this browser. Skate requires them in order to polyfill the behaviour of Custom Elements. If you want to support this browser you should include a Mutation Observer polyfill before Skate.');
    }
    return new MutationObserver(documentObserverHandler);
  }
  
  function createDocumentObserver() {
    var observer = createMutationObserver();
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
(typeof window === 'undefined' ? global : window).__7a36184f760d61c8bc3f16577d94b0b9 = (function () {
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
// src/util/get-all-property-descriptors.js
(typeof window === 'undefined' ? global : window).__dcfd6539aecccaad588317845f326723 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _getOwnPropertyDescriptors = __5e949ee5969d09b1ffa9f8fff91381bc;
  
  var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);
  
  var _protos = __262f1dced81ad25a69692fc69f59732d;
  
  var _protos2 = _interopRequireDefault(_protos);
  
  exports['default'] = function (obj) {
    return (0, _protos2['default'])(obj).reduce(function (result, proto) {
      var descriptors = (0, _getOwnPropertyDescriptors2['default'])(proto);
      Object.getOwnPropertyNames(descriptors).reduce(function (result, name) {
        result[name] = descriptors[name];
        return result;
      }, result);
      return result;
    }, {});
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/util/debounce.js
(typeof window === 'undefined' ? global : window).__2246bedffa3c6c358d1e7d4eefa41ff6 = (function () {
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
// src/support/valid-custom-element.js
(typeof window === 'undefined' ? global : window).__be9e5f0e8117957ab7b1f3806c43c773 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  exports['default'] = function (name) {
    var reservedNames = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];
  
    return name.indexOf('-') > 0 && name.toLowerCase() === name && reservedNames.indexOf(name) < 0;
  };
  
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/index.js
(typeof window === 'undefined' ? global : window).__eeb207d478d1ed06f9c138dd4b3ad0f1 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _apiCreate = __f6f65a565c709b69651c25a4f54ac7f4;
  
  var _apiCreate2 = _interopRequireDefault(_apiCreate);
  
  var _apiEmit = __0c127fafef24938352a5d4a34240ab22;
  
  var _apiEmit2 = _interopRequireDefault(_apiEmit);
  
  var _apiFragment = __30ef055188e7cce79873fd664b95ed66;
  
  var _apiFragment2 = _interopRequireDefault(_apiFragment);
  
  var _apiInit = __295960f0bb6206a012930328aa94c78e;
  
  var _apiInit2 = _interopRequireDefault(_apiInit);
  
  var _apiPropertiesIndex = __1b8cf8e3600b24b489bc028ad27a1d0a;
  
  var _apiPropertiesIndex2 = _interopRequireDefault(_apiPropertiesIndex);
  
  var _apiReady = __d9609519601942f0f3cf03e89f529414;
  
  var _apiReady2 = _interopRequireDefault(_apiReady);
  
  var _apiRenderIndex = __44a0ab908423d46dece58ae14502d6a5;
  
  var _apiRenderIndex2 = _interopRequireDefault(_apiRenderIndex);
  
  var _apiVersion = __e114dc9788d86bf6bce98549a964cc66;
  
  var _apiVersion2 = _interopRequireDefault(_apiVersion);
  
  var _objectAssign = __353aa4e211d787df44ab978a5a75c249;
  
  var _objectAssign2 = _interopRequireDefault(_objectAssign);
  
  var _lifecycleAttached = __d3cc4f73de07fed8af79602fe760a6bc;
  
  var _lifecycleAttached2 = _interopRequireDefault(_lifecycleAttached);
  
  var _lifecycleAttribute = __3e5a047746044557f4a235875daca69d;
  
  var _lifecycleAttribute2 = _interopRequireDefault(_lifecycleAttribute);
  
  var _lifecycleCreated = __54c1621d9a7829fe88fdc4b9d3386051;
  
  var _lifecycleCreated2 = _interopRequireDefault(_lifecycleCreated);
  
  var _defaults = __3d21be0f26fe51bf369a576ea360130a;
  
  var _defaults2 = _interopRequireDefault(_defaults);
  
  var _lifecycleDetached = __9e5131b8efe6e3f893afb506c0e9f6dd;
  
  var _lifecycleDetached2 = _interopRequireDefault(_lifecycleDetached);
  
  var _globalDocumentObserver = __642b6fb02cb7b38d92af73ced537a047;
  
  var _globalDocumentObserver2 = _interopRequireDefault(_globalDocumentObserver);
  
  var _globalRegistry = __c5a0afa9d0578d167d0227b32abc8a92;
  
  var _globalRegistry2 = _interopRequireDefault(_globalRegistry);
  
  var _supportCustomElements = __7a36184f760d61c8bc3f16577d94b0b9;
  
  var _supportCustomElements2 = _interopRequireDefault(_supportCustomElements);
  
  var _typeElement = __defe6124e9b33e8efda86549fb8c3d4e;
  
  var _typeElement2 = _interopRequireDefault(_typeElement);
  
  var _utilGetAllPropertyDescriptors = __dcfd6539aecccaad588317845f326723;
  
  var _utilGetAllPropertyDescriptors2 = _interopRequireDefault(_utilGetAllPropertyDescriptors);
  
  var _utilGetOwnPropertyDescriptors = __5e949ee5969d09b1ffa9f8fff91381bc;
  
  var _utilGetOwnPropertyDescriptors2 = _interopRequireDefault(_utilGetOwnPropertyDescriptors);
  
  var _utilDebounce = __2246bedffa3c6c358d1e7d4eefa41ff6;
  
  var _utilDebounce2 = _interopRequireDefault(_utilDebounce);
  
  var _utilDefineProperties = __02e13fbc76a00a14ff4b4f07a6813e3c;
  
  var _utilDefineProperties2 = _interopRequireDefault(_utilDefineProperties);
  
  var _utilWalkTree = __e2f97b0e142d4a2a3414fbe5e42af13c;
  
  var _utilWalkTree2 = _interopRequireDefault(_utilWalkTree);
  
  var _supportValidCustomElement = __be9e5f0e8117957ab7b1f3806c43c773;
  
  var _supportValidCustomElement2 = _interopRequireDefault(_supportValidCustomElement);
  
  var HTMLElement = window.HTMLElement;
  
  // A function that initialises the document once in a given event loop.
  var initDocument = (0, _utilDebounce2['default'])(function () {
    // For performance in older browsers, we use:
    //
    // - childNodes instead of children
    // - for instead of forEach
    (0, _utilWalkTree2['default'])(document.documentElement.childNodes, function (element) {
      var components = _globalRegistry2['default'].find(element);
      var componentsLength = components.length;
  
      // Created callbacks are called first.
      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.createdCallback.call(element);
      }
  
      // Attached callbacks are called separately because this emulates how
      // native works internally.
      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.attachedCallback.call(element);
      }
    });
  });
  
  // Creates a configurable, non-writable, non-enumerable property.
  function fixedProp(obj, name, value) {
    Object.defineProperty(obj, name, {
      configurable: true,
      enumerable: false, value: value,
      writable: false
    });
  }
  
  // Makes a function / constructor that can be called as either.
  function makeCtor(name, opts) {
    var func = _apiCreate2['default'].bind(null, name);
  
    // Assigning defaults gives a predictable definition and prevents us from
    // having to do defaults checks everywhere.
    (0, _objectAssign2['default'])(func, _defaults2['default']);
  
    // Inherit all options. This takes into account object literals as well as
    // ES2015 classes that may have inherited static props which would not be
    // considered "own".
    (0, _utilDefineProperties2['default'])(func, (0, _utilGetAllPropertyDescriptors2['default'])(opts));
  
    // Fixed info.
    fixedProp(func.prototype, 'constructor', func);
    fixedProp(func, 'id', name);
    fixedProp(func, 'isNative', func.type === _typeElement2['default'] && (0, _supportCustomElements2['default'])() && (0, _supportValidCustomElement2['default'])(name));
  
    // *sigh* WebKit
    //
    // In native, the function name is the same as the custom element name, but
    // WebKit prevents this from being defined. We do this where possible and
    // still define `id` for cross-browser compatibility.
    var nameProp = Object.getOwnPropertyDescriptor(func, 'name');
    if (nameProp && nameProp.configurable) {
      fixedProp(func, 'name', name);
    }
  
    return func;
  }
  
  // The main skate() function.
  function skate(name, opts) {
    var Ctor = makeCtor(name, opts);
    var proto = (Ctor['extends'] ? document.createElement(Ctor['extends']).constructor : HTMLElement).prototype;
  
    // If the options don't inherit a native element prototype, we ensure it does
    // because native unnecessarily requires you explicitly do this.
    if (!proto.isPrototypeOf(Ctor.prototype)) {
      Ctor.prototype = Object.create(proto, (0, _utilGetOwnPropertyDescriptors2['default'])(Ctor.prototype));
    }
  
    // We not assign native callbacks to handle the callbacks specified in the
    // Skate definition. This allows us to abstract away any changes that may
    // occur in the spec.
    Ctor.prototype.createdCallback = (0, _lifecycleCreated2['default'])(Ctor);
    Ctor.prototype.attachedCallback = (0, _lifecycleAttached2['default'])(Ctor);
    Ctor.prototype.detachedCallback = (0, _lifecycleDetached2['default'])(Ctor);
    Ctor.prototype.attributeChangedCallback = (0, _lifecycleAttribute2['default'])(Ctor);
  
    // In native, we have to massage the definition so that the browser doesn't
    // spit out errors for a malformed definition. In polyfill land we must
    // emulate what the browser would normally do in native.
    if (Ctor.isNative) {
      var nativeDefinition = { prototype: Ctor.prototype };
      Ctor['extends'] && (nativeDefinition['extends'] = Ctor['extends']);
      document.registerElement(name, nativeDefinition);
    } else {
      initDocument();
      _globalDocumentObserver2['default'].register();
    }
  
    // We keep our own registry since we can't access the native one.
    return _globalRegistry2['default'].set(name, Ctor);
  }
  
  // Public API.
  skate.create = _apiCreate2['default'];
  skate.emit = _apiEmit2['default'];
  skate.fragment = _apiFragment2['default'];
  skate.init = _apiInit2['default'];
  skate.properties = _apiPropertiesIndex2['default'];
  skate.ready = _apiReady2['default'];
  skate.render = _apiRenderIndex2['default'];
  skate.version = _apiVersion2['default'];
  
  exports['default'] = skate;
  module.exports = exports['default'];
  
  return module.exports;
}).call(this);
// src/global.js
(typeof window === 'undefined' ? global : window).__6f1e0a99f09eeb789067ebb09baea08b = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  'use strict';
  
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
  
  var _index = __eeb207d478d1ed06f9c138dd4b3ad0f1;
  
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