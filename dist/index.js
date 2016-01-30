(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.skatejs = factory());
}(this, function () {

	var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
	function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

	var ignored = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.ignored = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (element) {
	    var attrs = element.attributes;
	    return attrs && !!attrs['data-skate-ignore'];
	  };

	  module.exports = exports['default'];
	});
	});

	var require$$0$5 = (ignored && typeof ignored === 'object' && 'default' in ignored ? ignored['default'] : ignored);

	var walkTree = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', './ignored'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$0$5);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.ignored);
	    global.walkTree = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _ignored) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (elems, fn) {
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

	  var _ignored2 = _interopRequireDefault(_ignored);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var Node = window.Node;

	  function walk(elem, fn) {
	    if (elem.nodeType !== Node.ELEMENT_NODE || (0, _ignored2.default)(elem)) {
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

	  module.exports = exports['default'];
	});
	});

	var require$$0$1 = (walkTree && typeof walkTree === 'object' && 'default' in walkTree ? walkTree['default'] : walkTree);

	var defineProperties = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.defineProperties = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (obj, props) {
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
	});
	});

	var require$$1 = (defineProperties && typeof defineProperties === 'object' && 'default' in defineProperties ? defineProperties['default'] : defineProperties);

	var debounce = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["module", "exports"], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.debounce = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  "use strict";

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (fn) {
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

	  module.exports = exports['default'];
	});
	});

	var require$$2 = (debounce && typeof debounce === 'object' && 'default' in debounce ? debounce['default'] : debounce);

	var getOwnPropertyDescriptors = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["module", "exports"], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.getOwnPropertyDescriptors = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  "use strict";

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (obj) {
	    return Object.getOwnPropertyNames(obj).reduce(function (prev, curr) {
	      prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
	      return prev;
	    }, {});
	  };

	  module.exports = exports['default'];
	});
	});

	var require$$0$2 = (getOwnPropertyDescriptors && typeof getOwnPropertyDescriptors === 'object' && 'default' in getOwnPropertyDescriptors ? getOwnPropertyDescriptors['default'] : getOwnPropertyDescriptors);

	var protos = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["module", "exports"], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.protos = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  "use strict";

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (proto) {
	    var chains = [];
	    while (proto) {
	      chains.push(proto);
	      proto = Object.getPrototypeOf(proto);
	    }
	    chains.reverse();
	    return chains;
	  };

	  module.exports = exports['default'];
	});
	});

	var require$$2$1 = (protos && typeof protos === 'object' && 'default' in protos ? protos['default'] : protos);

	var getAllPropertyDescriptors = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', './get-own-property-descriptors', './protos'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$0$2, require$$2$1);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.getOwnPropertyDescriptors, global.protos);
	    global.getAllPropertyDescriptors = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _getOwnPropertyDescriptors, _protos) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (obj) {
	    return (0, _protos2.default)(obj).reduce(function (result, proto) {
	      var descriptors = (0, _getOwnPropertyDescriptors2.default)(proto);
	      Object.getOwnPropertyNames(descriptors).reduce(function (result, name) {
	        result[name] = descriptors[name];
	        return result;
	      }, result);
	      return result;
	    }, {});
	  };

	  var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);

	  var _protos2 = _interopRequireDefault(_protos);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$4 = (getAllPropertyDescriptors && typeof getAllPropertyDescriptors === 'object' && 'default' in getAllPropertyDescriptors ? getAllPropertyDescriptors['default'] : getAllPropertyDescriptors);

	var element = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.element = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  var documentCreateElement = document.createElement.bind(document);
	  var reservedNames = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];
	  var customElementCriteria = ['contain at least one dash', 'not start with a dash', 'not be one of: ' + reservedNames.join(', ')];
	  exports.default = {
	    create: function create(Ctor) {
	      var elem = Ctor.extends ? documentCreateElement(Ctor.extends, Ctor.id) : documentCreateElement(Ctor.id);
	      if (!Ctor.isNative && Ctor.extends) {
	        elem.setAttribute('is', Ctor.id);
	      }
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

	      var tagToExtend = definition.extends;
	      if (isAttrValue) {
	        if (tagName === tagToExtend) {
	          return [definition];
	        }
	      } else if (!tagToExtend) {
	        return [definition];
	      }
	    },
	    register: function register(Ctor) {
	      var name = Ctor.id;

	      // Screen non-native names and try and be more helpful than native.
	      if (name.indexOf('-') < 1 || reservedNames.indexOf(name) > -1) {
	        throw new Error(name + ' is not a valid custom element name. A custom element name must: ' + customElementCriteria.map(function (a) {
	          return '\n- ' + a;
	        }).join(''));
	      }

	      // In native, we have to massage the definition so that the browser doesn't
	      // spit out errors for a malformed definition.
	      if (Ctor.isNative) {
	        var nativeDefinition = { prototype: Ctor.prototype };
	        Ctor.extends && (nativeDefinition.extends = Ctor.extends);
	        document.registerElement(name, nativeDefinition);
	      }
	    }
	  };
	  module.exports = exports['default'];
	});
	});

	var require$$0$3 = (element && typeof element === 'object' && 'default' in element ? element['default'] : element);

	var vars = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.vars = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
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

	  exports.default = window[VERSION];
	  module.exports = exports['default'];
	});
	});

	var require$$3 = (vars && typeof vars === 'object' && 'default' in vars ? vars['default'] : vars);

	var registry = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', './vars'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$3);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.vars);
	    global.registry = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _vars) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _vars2 = _interopRequireDefault(_vars);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var definitions = {};
	  var map = [];
	  var types = [];
	  exports.default = _vars2.default.registerIfNotExists('registry', {
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
	});
	});

	var require$$0$4 = (registry && typeof registry === 'object' && 'default' in registry ? registry['default'] : registry);

	var innerhtml = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define([], factory);
	  } else if (typeof exports !== "undefined") {
	    factory();
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory();
	    global.innerhtml = mod.exports;
	  }
	})(__commonjs_global, function () {
	  'use strict';

	  var isIeUntil10 = /MSIE/.test(navigator.userAgent);
	  var isIe11 = /Trident/.test(navigator.userAgent);
	  var isIe = isIeUntil10 || isIe11;
	  var elementPrototype = window.HTMLElement.prototype;

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
	    var propertyDescriptor = Object.getOwnPropertyDescriptor(elementPrototype, 'innerHTML');
	    var hasBeenEnhanced = !!propertyDescriptor && propertyDescriptor.get._hasBeenEnhanced;

	    if (!hasBeenEnhanced) {
	      if (isIe11) {
	        window.MutationObserver = window.JsMutationObserver || window.MutationObserver;
	      }

	      fixInnerHTML();
	    }
	  }
	});
	});

	var require$$0$6 = (innerhtml && typeof innerhtml === 'object' && 'default' in innerhtml ? innerhtml['default'] : innerhtml);

	var getClosestIgnoredElement = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', './ignored'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$0$5);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.ignored);
	    global.getClosestIgnoredElement = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _ignored) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (element) {
	    var parent = element;
	    while (parent instanceof Element) {
	      if ((0, _ignored2.default)(parent)) {
	        return parent;
	      }
	      parent = parent.parentNode;
	    }
	  };

	  var _ignored2 = _interopRequireDefault(_ignored);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var _window = window;
	  var Element = _window.Element;
	  module.exports = exports['default'];
	});
	});

	var require$$4$1 = (getClosestIgnoredElement && typeof getClosestIgnoredElement === 'object' && 'default' in getClosestIgnoredElement ? getClosestIgnoredElement['default'] : getClosestIgnoredElement);

	var documentObserver = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../util/get-closest-ignored-element', './vars', './registry', '../util/walk-tree', '../fix/ie/innerhtml'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$4$1, require$$3, require$$0$4, require$$0$1, require$$0$6);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.getClosestIgnoredElement, global.vars, global.registry, global.walkTree, global.innerhtml);
	    global.documentObserver = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _getClosestIgnoredElement, _vars, _registry, _walkTree) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _getClosestIgnoredElement2 = _interopRequireDefault(_getClosestIgnoredElement);

	  var _vars2 = _interopRequireDefault(_vars);

	  var _registry2 = _interopRequireDefault(_registry);

	  var _walkTree2 = _interopRequireDefault(_walkTree);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function triggerAddedNodes(addedNodes) {
	    (0, _walkTree2.default)(addedNodes, function (element) {
	      var components = _registry2.default.find(element);

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
	    (0, _walkTree2.default)(removedNodes, function (element) {
	      var components = _registry2.default.find(element);

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

	      if (addedNodes && addedNodes.length && !(0, _getClosestIgnoredElement2.default)(addedNodes[0].parentNode)) {
	        triggerAddedNodes(addedNodes);
	      }

	      if (removedNodes && removedNodes.length) {
	        triggerRemovedNodes(removedNodes);
	      }
	    }
	  }

	  function createMutationObserver() {
	    var _window = window;
	    var MutationObserver = _window.MutationObserver;

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

	  exports.default = _vars2.default.registerIfNotExists('observer', {
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
	});
	});

	var require$$7 = (documentObserver && typeof documentObserver === 'object' && 'default' in documentObserver ? documentObserver['default'] : documentObserver);

	var data = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.data = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (element) {
	    var namespace = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	    var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
	    return namespace && (data[namespace] || (data[namespace] = {})) || data;
	  };

	  module.exports = exports['default'];
	});
	});

	var require$$1$2 = (data && typeof data === 'object' && 'default' in data ? data['default'] : data);

	var detached = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../util/data'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$1$2);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.data);
	    global.detached = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _data) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (opts) {
	    return function () {
	      var info = (0, _data2.default)(this, 'lifecycle/' + opts.id);
	      if (info.detached) return;
	      info.detached = true;
	      info.attached = false;
	      opts.detached(this);
	    };
	  };

	  var _data2 = _interopRequireDefault(_data);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$8 = (detached && typeof detached === 'object' && 'default' in detached ? detached['default'] : detached);

	var defaults = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', './type/element'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$0$3);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.element);
	    global.defaults = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _element) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _element2 = _interopRequireDefault(_element);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var noop = function noop() {};

	  exports.default = {
	    attached: noop,
	    attribute: noop,
	    created: noop,
	    render: noop,
	    detached: noop,
	    events: {},
	    extends: '',
	    properties: {},
	    prototype: {},
	    resolvedAttribute: 'resolved',
	    ready: noop,
	    type: _element2.default,
	    unresolvedAttribute: 'unresolved'
	  };
	  module.exports = exports['default'];
	});
	});

	var require$$9 = (defaults && typeof defaults === 'object' && 'default' in defaults ? defaults['default'] : defaults);

	var resolve = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.resolve = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = resolve;

	  function resolve(elem, opts) {
	    elem.removeAttribute(opts.unresolvedAttribute);
	    elem.setAttribute(opts.resolvedAttribute, '');
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$0$7 = (resolve && typeof resolve === 'object' && 'default' in resolve ? resolve['default'] : resolve);

	var prototype = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../util/protos', '../util/define-properties', '../util/get-own-property-descriptors'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$2$1, require$$1, require$$0$2);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.protos, global.defineProperties, global.getOwnPropertyDescriptors);
	    global.prototype = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _protos, _defineProperties, _getOwnPropertyDescriptors) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = prototype;

	  var _protos2 = _interopRequireDefault(_protos);

	  var _defineProperties2 = _interopRequireDefault(_defineProperties);

	  var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function prototype(opts) {
	    var prototypes = (0, _protos2.default)(opts.prototype);
	    return function (elem) {
	      prototypes.forEach(function (proto) {
	        if (!proto.isPrototypeOf(elem)) {
	          (0, _defineProperties2.default)(elem, (0, _getOwnPropertyDescriptors2.default)(proto));
	        }
	      });
	    };
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$1$3 = (prototype && typeof prototype === 'object' && 'default' in prototype ? prototype['default'] : prototype);

	var propertiesReady = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["module", "exports"], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.propertiesReady = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  "use strict";

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = propertiesApply;

	  function propertiesApply(elem, properties) {
	    Object.keys(properties).forEach(function (name) {
	      properties[name].ready(elem);
	    });
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$2$2 = (propertiesReady && typeof propertiesReady === 'object' && 'default' in propertiesReady ? propertiesReady['default'] : propertiesReady);

	var propertiesCreated = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["module", "exports"], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.propertiesCreated = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  "use strict";

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = propertiesApply;

	  function propertiesApply(elem, properties) {
	    Object.keys(properties).forEach(function (name) {
	      var prop = properties[name];
	      var initialValue = prop.initial(elem);
	      Object.defineProperty(elem, name, prop);
	      prop.created(elem, initialValue);
	    });
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$3$1 = (propertiesCreated && typeof propertiesCreated === 'object' && 'default' in propertiesCreated ? propertiesCreated['default'] : propertiesCreated);

	var empty = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.empty = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (val) {
	    return typeof val === 'undefined' || val === null;
	  };

	  module.exports = exports['default'];
	});
	});

	var require$$0$10 = (empty && typeof empty === 'object' && 'default' in empty ? empty['default'] : empty);

	var dashCase = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.dashCase = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (str) {
	    return str.split(/([A-Z])/).reduce(function (one, two, idx) {
	      var dash = !one || idx % 2 === 0 ? '' : '-';
	      return '' + one + dash + two.toLowerCase();
	    });
	  };

	  module.exports = exports['default'];
	});
	});

	var require$$2$4 = (dashCase && typeof dashCase === 'object' && 'default' in dashCase ? dashCase['default'] : dashCase);

	var index$2 = __commonjs(function (module) {
	/* eslint-disable no-unused-vars */
	'use strict';
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
	});

	var require$$3$2 = (index$2 && typeof index$2 === 'object' && 'default' in index$2 ? index$2['default'] : index$2);

	var propertiesInit = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', 'object-assign', '../util/dash-case', '../util/data', '../util/empty'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$3$2, require$$2$4, require$$1$2, require$$0$10);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.objectAssign, global.dashCase, global.data, global.empty);
	    global.propertiesInit = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _objectAssign, _dashCase, _data, _empty) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (opts) {
	    opts = opts || {};

	    if (typeof opts === 'function') {
	      opts = { coerce: opts };
	    }

	    return function (name) {
	      return createNativePropertyDefinition(name, (0, _objectAssign2.default)({
	        deserialize: function deserialize(value) {
	          return value;
	        },
	        serialize: function serialize(value) {
	          return value;
	        }
	      }, opts));
	    };
	  };

	  var _objectAssign2 = _interopRequireDefault(_objectAssign);

	  var _dashCase2 = _interopRequireDefault(_dashCase);

	  var _data2 = _interopRequireDefault(_data);

	  var _empty2 = _interopRequireDefault(_empty);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var _window$Element$proto = window.Element.prototype;
	  var removeAttribute = _window$Element$proto.removeAttribute;
	  var setAttribute = _window$Element$proto.setAttribute;

	  function getData(elem, name) {
	    return (0, _data2.default)(elem, 'api/property/' + name);
	  }

	  function getDataForAttribute(elem, name) {
	    return getData(elem, getData(elem, name).linkedProperty);
	  }

	  function getLinkedAttribute(name, attr) {
	    return attr === true ? (0, _dashCase2.default)(name) : attr;
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
	      getData(elem, info.linkedAttribute).linkedProperty = name;

	      if (typeof opts.default === 'function') {
	        info.defaultValue = opts.default(elem, {
	          name: name
	        });
	      } else if (!(0, _empty2.default)(opts.default)) {
	        info.defaultValue = opts.default;
	      }

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

	            if ((0, _empty2.default)(serializedValue)) {
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

	      if ((0, _empty2.default)(initialValue)) {
	        if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
	          initialValue = opts.deserialize(elem.getAttribute(info.linkedAttribute));
	        } else {
	          initialValue = info.defaultValue;
	        }
	      }

	      var internalValue = info.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;

	      if (typeof opts.created === 'function') {
	        opts.created(elem, {
	          name: name,
	          internalValue: internalValue
	        });
	      }
	    };

	    prop.get = function () {
	      var info = getData(this, name);
	      var internalValue = info.internalValue;

	      if (opts.get) {
	        return opts.get(this, {
	          name: name,
	          internalValue: internalValue
	        });
	      }

	      return internalValue;
	    };

	    prop.initial = function (elem) {
	      return typeof opts.initial === 'function' ? opts.initial(elem, {
	        name: name
	      }) : elem[name];
	    };

	    prop.ready = function (elem) {
	      var initial = getData(elem, name).internalValue;
	      elem[name] = (0, _empty2.default)(initial) ? this.initial(elem) : initial;
	    };

	    prop.set = function (newValue) {
	      var info = getData(this, name);
	      var oldValue = info.oldValue;

	      if (info.updatingProperty) {
	        return;
	      }

	      info.updatingProperty = true;

	      if ((0, _empty2.default)(newValue)) {
	        newValue = info.defaultValue;
	      }

	      if (typeof opts.coerce === 'function') {
	        newValue = opts.coerce(newValue);
	      }

	      info.internalValue = newValue;

	      if (info.linkedAttribute && !info.updatingAttribute) {
	        var serializedValue = opts.serialize(newValue);

	        if ((0, _empty2.default)(serializedValue)) {
	          removeAttribute.call(this, info.linkedAttribute);
	        } else {
	          setAttribute.call(this, info.linkedAttribute, serializedValue);
	        }
	      }

	      if (typeof opts.set === 'function') {
	        opts.set(this, {
	          name: name,
	          newValue: newValue,
	          oldValue: oldValue
	        });
	      }

	      info.oldValue = newValue;
	      info.updatingProperty = false;
	    };

	    return prop;
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$4$2 = (propertiesInit && typeof propertiesInit === 'object' && 'default' in propertiesInit ? propertiesInit['default'] : propertiesInit);

	var patchAttributeMethods = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["module", "exports"], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.patchAttributeMethods = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  "use strict";

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = patchAttributeMethods;

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

	  module.exports = exports['default'];
	});
	});

	var require$$5 = (patchAttributeMethods && typeof patchAttributeMethods === 'object' && 'default' in patchAttributeMethods ? patchAttributeMethods['default'] : patchAttributeMethods);

	var matchesSelector = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.matchesSelector = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (element, selector) {
	    if (hasNativeMatchesSelectorDetattachedBug) {
	      var clone = element.cloneNode();
	      document.createElement('div').appendChild(clone);
	      return nativeMatchesSelector.call(clone, selector);
	    }
	    return nativeMatchesSelector.call(element, selector);
	  };

	  var elProto = window.HTMLElement.prototype;
	  var nativeMatchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;
	  var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call(document.createElement('div'), 'div');
	  module.exports = exports['default'];
	});
	});

	var require$$0$11 = (matchesSelector && typeof matchesSelector === 'object' && 'default' in matchesSelector ? matchesSelector['default'] : matchesSelector);

	var events = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../util/matches-selector'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$0$11);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.matchesSelector);
	    global.events = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _matchesSelector) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = events;

	  var _matchesSelector2 = _interopRequireDefault(_matchesSelector);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

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
	        if ((0, _matchesSelector2.default)(current, selector)) {
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
	});
	});

	var require$$6 = (events && typeof events === 'object' && 'default' in events ? events['default'] : events);

	var elementContains = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(["module", "exports"], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.elementContains = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  "use strict";

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (source, target) {
	    // The document element does not have the contains method in IE.
	    if (source === document && !source.contains) {
	      return document.head.contains(target) || document.body.contains(target);
	    }

	    return source.contains ? source.contains(target) : elementPrototypeContains.call(source, target);
	  };

	  var elementPrototype = window.HTMLElement.prototype;
	  var elementPrototypeContains = elementPrototype.contains;
	  module.exports = exports['default'];
	});
	});

	var require$$0$9 = (elementContains && typeof elementContains === 'object' && 'default' in elementContains ? elementContains['default'] : elementContains);

	var emit = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../util/element-contains'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$0$9);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.elementContains);
	    global.emit = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _elementContains) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (elem, name) {
	    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    var names = typeof name === 'string' ? name.split(' ') : name;
	    return names.reduce(function (prev, curr) {
	      if (emitOne(elem, curr, opts) === false) {
	        prev.push(curr);
	      }
	      return prev;
	    }, []);
	  };

	  var _elementContains2 = _interopRequireDefault(_elementContains);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var CustomEvent = function (CustomEvent) {
	    if (CustomEvent) {
	      try {
	        new CustomEvent();
	      } catch (e) {
	        return undefined;
	      }
	    }

	    return CustomEvent;
	  }(window.CustomEvent);

	  function dispatch(elem, cEvent) {
	    if (!elem.disabled) {
	      return elem.dispatchEvent(cEvent);
	    }

	    cEvent.isPropagationStopped = true;
	  }

	  var hasBubbleOnDetachedElements = function () {
	    var parent = document.createElement('div');
	    var child = document.createElement('div');
	    var hasBubbleOnDetachedElements = false;
	    parent.appendChild(child);
	    parent.addEventListener('test', function () {
	      return hasBubbleOnDetachedElements = true;
	    });
	    child.dispatchEvent(createCustomEvent('test', {
	      bubbles: true
	    }));
	    return hasBubbleOnDetachedElements;
	  }();

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
	    Object.defineProperty(cEvent, 'target', {
	      get: function get() {
	        return elem;
	      }
	    });

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
	    opts.bubbles === undefined && (opts.bubbles = true);
	    opts.cancelable === undefined && (opts.cancelable = true);
	    cEvent = createCustomEvent(name, opts);
	    shouldSimulateBubbling = opts.bubbles && !hasBubbleOnDetachedElements && !(0, _elementContains2.default)(document, elem);
	    return shouldSimulateBubbling ? simulateBubbling(elem, cEvent) : dispatch(elem, cEvent);
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$7$1 = (emit && typeof emit === 'object' && 'default' in emit ? emit['default'] : emit);

	var created = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../util/data', '../api/emit', './events', './patch-attribute-methods', './properties-init', './properties-created', './properties-ready', './prototype', './resolve'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$1$2, require$$7$1, require$$6, require$$5, require$$4$2, require$$3$1, require$$2$2, require$$1$3, require$$0$7);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.data, global.emit, global.events, global.patchAttributeMethods, global.propertiesInit, global.propertiesCreated, global.propertiesReady, global.prototype, global.resolve);
	    global.created = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _data, _emit, _events, _patchAttributeMethods, _propertiesInit, _propertiesCreated, _propertiesReady, _prototype, _resolve) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (opts) {
	    var applyEvents = (0, _events2.default)(opts);
	    var applyPrototype = (0, _prototype2.default)(opts);
	    var propertyFunctions = ensurePropertyFunctions(opts);

	    return function () {
	      var info = (0, _data2.default)(this, 'lifecycle/' + opts.id);
	      var native = opts.isNative;
	      var resolved = this.hasAttribute('resolved');

	      if (info.created) return;
	      info.created = true;
	      var propertyDefinitions = ensurePropertyDefinitions(this, propertyFunctions);

	      native || opts.attribute && (0, _patchAttributeMethods2.default)(this);
	      native || opts.prototype && applyPrototype(this);
	      opts.properties && (0, _propertiesCreated2.default)(this, propertyDefinitions);
	      opts.events && applyEvents(this);
	      opts.created && opts.created(this);
	      resolved || opts.render && opts.render(this);
	      opts.properties && (0, _propertiesReady2.default)(this, propertyDefinitions);
	      opts.ready && opts.ready(this);
	      (0, _emit2.default)(this, readyEventName, readyEventOptions);
	      resolved || (0, _resolve2.default)(this, opts);
	    };
	  };

	  var _data2 = _interopRequireDefault(_data);

	  var _emit2 = _interopRequireDefault(_emit);

	  var _events2 = _interopRequireDefault(_events);

	  var _patchAttributeMethods2 = _interopRequireDefault(_patchAttributeMethods);

	  var _propertiesInit2 = _interopRequireDefault(_propertiesInit);

	  var _propertiesCreated2 = _interopRequireDefault(_propertiesCreated);

	  var _propertiesReady2 = _interopRequireDefault(_propertiesReady);

	  var _prototype2 = _interopRequireDefault(_prototype);

	  var _resolve2 = _interopRequireDefault(_resolve);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var readyEventName = 'skate.ready';
	  var readyEventOptions = {
	    bubbles: false,
	    cancelable: false
	  };

	  function ensurePropertyFunctions(opts) {
	    var properties = opts.properties;
	    var names = Object.keys(properties || {});
	    return names.reduce(function (descriptors, descriptorName) {
	      descriptors[descriptorName] = opts.properties[descriptorName];

	      if (typeof descriptors[descriptorName] !== 'function') {
	        descriptors[descriptorName] = (0, _propertiesInit2.default)(descriptors[descriptorName]);
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

	  module.exports = exports['default'];
	});
	});

	var require$$10 = (created && typeof created === 'object' && 'default' in created ? created['default'] : created);

	var attribute = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.attribute = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (opts) {
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

	  var noop = function noop() {};

	  module.exports = exports['default'];
	});
	});

	var require$$11 = (attribute && typeof attribute === 'object' && 'default' in attribute ? attribute['default'] : attribute);

	var attached = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../util/data'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$1$2);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.data);
	    global.attached = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _data) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (opts) {
	    return function () {
	      var info = (0, _data2.default)(this, 'lifecycle/' + opts.id);
	      if (info.attached) return;
	      info.attached = true;
	      info.detached = false;
	      opts.attached(this);
	    };
	  };

	  var _data2 = _interopRequireDefault(_data);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$12 = (attached && typeof attached === 'object' && 'default' in attached ? attached['default'] : attached);

	var version = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.version = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = '0.15.2';
	  module.exports = exports['default'];
	});
	});

	var require$$14 = (version && typeof version === 'object' && 'default' in version ? version['default'] : version);

	var render = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../shared/registry'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$0$4);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.registry);
	    global.render = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _registry) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (elem) {
	    _registry2.default.find(elem).forEach(function (component) {
	      return component.render && component.render(elem);
	    });
	  };

	  var _registry2 = _interopRequireDefault(_registry);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$15 = (render && typeof render === 'object' && 'default' in render ? render['default'] : render);

	var ready = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../util/data', '../shared/registry'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$1$2, require$$0$4);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.data, global.registry);
	    global.ready = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _data, _registry) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (elements, callback) {
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

	  var _data2 = _interopRequireDefault(_data);

	  var _registry2 = _interopRequireDefault(_registry);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function ready(element) {
	    var components = _registry2.default.find(element);

	    var componentsLength = components.length;

	    for (var a = 0; a < componentsLength; a++) {
	      if (!(0, _data2.default)(element, 'lifecycle/' + components[a].id).created) {
	        return false;
	      }
	    }

	    return true;
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$16 = (ready && typeof ready === 'object' && 'default' in ready ? ready['default'] : ready);

	var string = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../../util/empty'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$0$10);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.empty);
	    global.string = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _empty) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _empty2 = _interopRequireDefault(_empty);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var alwaysUndefinedIfEmpty = function alwaysUndefinedIfEmpty(val) {
	    return (0, _empty2.default)(val) ? undefined : String(val);
	  };

	  exports.default = {
	    coerce: alwaysUndefinedIfEmpty,
	    deserialize: alwaysUndefinedIfEmpty,
	    serialize: alwaysUndefinedIfEmpty
	  };
	  module.exports = exports['default'];
	});
	});

	var require$$0$8 = (string && typeof string === 'object' && 'default' in string ? string['default'] : string);

	var number = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../../util/empty'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$0$10);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.empty);
	    global.number = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _empty) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _empty2 = _interopRequireDefault(_empty);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var alwaysUndefinedIfEmpty = function alwaysUndefinedIfEmpty(val) {
	    return (0, _empty2.default)(val) ? undefined : Number(val);
	  };

	  exports.default = {
	    coerce: alwaysUndefinedIfEmpty,
	    deserialize: alwaysUndefinedIfEmpty,
	    serialize: alwaysUndefinedIfEmpty
	  };
	  module.exports = exports['default'];
	});
	});

	var require$$1$4 = (number && typeof number === 'object' && 'default' in number ? number['default'] : number);

	var boolean = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.boolean = mod.exports;
	  }
	})(__commonjs_global, function (module, exports) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = {
	    coerce: function coerce(value) {
	      return !!value;
	    },
	    default: false,
	    deserialize: function deserialize(value) {
	      return !(value === null);
	    },
	    serialize: function serialize(value) {
	      return value ? '' : undefined;
	    }
	  };
	  module.exports = exports['default'];
	});
	});

	var require$$2$3 = (boolean && typeof boolean === 'object' && 'default' in boolean ? boolean['default'] : boolean);

	var index$1 = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', 'object-assign', './boolean', './number', './string'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$3$2, require$$2$3, require$$1$4, require$$0$8);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.objectAssign, global.boolean, global.number, global.string);
	    global.index = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _objectAssign, _boolean, _number, _string) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _objectAssign2 = _interopRequireDefault(_objectAssign);

	  var _boolean2 = _interopRequireDefault(_boolean);

	  var _number2 = _interopRequireDefault(_number);

	  var _string2 = _interopRequireDefault(_string);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function prop(def) {
	    return function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      args.unshift({}, def);
	      return _objectAssign2.default.apply(null, args);
	    };
	  }

	  exports.default = {
	    boolean: prop(_boolean2.default),
	    number: prop(_number2.default),
	    string: prop(_string2.default)
	  };
	  module.exports = exports['default'];
	});
	});

	var require$$17 = (index$1 && typeof index$1 === 'object' && 'default' in index$1 ? index$1['default'] : index$1);

	var init = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../util/element-contains', '../shared/registry', '../util/walk-tree'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$0$9, require$$0$4, require$$0$1);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.elementContains, global.registry, global.walkTree);
	    global.init = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _elementContains, _registry, _walkTree) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    args.forEach(function (arg) {
	      var isInDom = (0, _elementContains2.default)(document, arg);
	      (0, _walkTree2.default)(arg, function (descendant) {
	        var components = _registry2.default.find(descendant);
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

	  var _elementContains2 = _interopRequireDefault(_elementContains);

	  var _registry2 = _interopRequireDefault(_registry);

	  var _walkTree2 = _interopRequireDefault(_walkTree);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$1$1 = (init && typeof init === 'object' && 'default' in init ? init['default'] : init);

	var fragment = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', './init'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$1$1);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.init);
	    global.fragment = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _init) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = fragment;

	  var _init2 = _interopRequireDefault(_init);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var _window = window;
	  var Node = _window.Node;
	  var NodeList = _window.NodeList;
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
	        (0, _init2.default)(node);
	      }

	      if (node) {
	        frag.appendChild(node);
	      }

	      return frag;
	    }, document.createDocumentFragment());
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$19 = (fragment && typeof fragment === 'object' && 'default' in fragment ? fragment['default'] : fragment);

	var create = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', 'object-assign', './init', '../shared/registry'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$3$2, require$$1$1, require$$0$4);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.objectAssign, global.init, global.registry);
	    global.create = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _objectAssign, _init, _registry) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (name, props) {
	    var Ctor = _registry2.default.get(name);
	    var elem = Ctor ? Ctor.type.create(Ctor) : document.createElement(name);
	    Ctor && Ctor.isNative || (0, _init2.default)(elem);
	    return (0, _objectAssign2.default)(elem, props);
	  };

	  var _objectAssign2 = _interopRequireDefault(_objectAssign);

	  var _init2 = _interopRequireDefault(_init);

	  var _registry2 = _interopRequireDefault(_registry);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  module.exports = exports['default'];
	});
	});

	var require$$21 = (create && typeof create === 'object' && 'default' in create ? create['default'] : create);

	var index = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', './api/create', './api/emit', './api/fragment', './api/init', './api/properties/index', './api/ready', './api/render', './api/version', 'object-assign', './lifecycle/attached', './lifecycle/attribute', './lifecycle/created', './defaults', './lifecycle/detached', './shared/document-observer', './shared/registry', './type/element', './util/get-all-property-descriptors', './util/get-own-property-descriptors', './util/debounce', './util/define-properties', './util/walk-tree'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$21, require$$7$1, require$$19, require$$1$1, require$$17, require$$16, require$$15, require$$14, require$$3$2, require$$12, require$$11, require$$10, require$$9, require$$8, require$$7, require$$0$4, require$$0$3, require$$4, require$$0$2, require$$2, require$$1, require$$0$1);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.create, global.emit, global.fragment, global.init, global.index, global.ready, global.render, global.version, global.objectAssign, global.attached, global.attribute, global.created, global.defaults, global.detached, global.documentObserver, global.registry, global.element, global.getAllPropertyDescriptors, global.getOwnPropertyDescriptors, global.debounce, global.defineProperties, global.walkTree);
	    global.index = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _create, _emit, _fragment, _init, _index, _ready, _render, _version, _objectAssign, _attached, _attribute, _created, _defaults, _detached, _documentObserver, _registry, _element, _getAllPropertyDescriptors, _getOwnPropertyDescriptors, _debounce, _defineProperties, _walkTree) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _create2 = _interopRequireDefault(_create);

	  var _emit2 = _interopRequireDefault(_emit);

	  var _fragment2 = _interopRequireDefault(_fragment);

	  var _init2 = _interopRequireDefault(_init);

	  var _index2 = _interopRequireDefault(_index);

	  var _ready2 = _interopRequireDefault(_ready);

	  var _render2 = _interopRequireDefault(_render);

	  var _version2 = _interopRequireDefault(_version);

	  var _objectAssign2 = _interopRequireDefault(_objectAssign);

	  var _attached2 = _interopRequireDefault(_attached);

	  var _attribute2 = _interopRequireDefault(_attribute);

	  var _created2 = _interopRequireDefault(_created);

	  var _defaults2 = _interopRequireDefault(_defaults);

	  var _detached2 = _interopRequireDefault(_detached);

	  var _documentObserver2 = _interopRequireDefault(_documentObserver);

	  var _registry2 = _interopRequireDefault(_registry);

	  var _element2 = _interopRequireDefault(_element);

	  var _getAllPropertyDescriptors2 = _interopRequireDefault(_getAllPropertyDescriptors);

	  var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);

	  var _debounce2 = _interopRequireDefault(_debounce);

	  var _defineProperties2 = _interopRequireDefault(_defineProperties);

	  var _walkTree2 = _interopRequireDefault(_walkTree);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var HTMLElement = window.HTMLElement;
	  var initDocument = (0, _debounce2.default)(function () {
	    (0, _walkTree2.default)(document.documentElement.childNodes, function (element) {
	      var components = _registry2.default.find(element);

	      var componentsLength = components.length;

	      for (var a = 0; a < componentsLength; a++) {
	        components[a].prototype.createdCallback.call(element);
	      }

	      for (var a = 0; a < componentsLength; a++) {
	        components[a].prototype.attachedCallback.call(element);
	      }
	    });
	  });

	  function fixedProp(obj, name, value) {
	    Object.defineProperty(obj, name, {
	      configurable: true,
	      enumerable: false,
	      value: value,
	      writable: false
	    });
	  }

	  function makeCtor(name, opts) {
	    var func = _create2.default.bind(null, name);

	    (0, _objectAssign2.default)(func, _defaults2.default);
	    (0, _defineProperties2.default)(func, (0, _getAllPropertyDescriptors2.default)(opts));
	    fixedProp(func.prototype, 'constructor', func);
	    fixedProp(func, 'id', name);
	    fixedProp(func, 'isNative', func.type === _element2.default && document.registerElement);
	    var nameProp = Object.getOwnPropertyDescriptor(func, 'name');

	    if (nameProp && nameProp.configurable) {
	      fixedProp(func, 'name', name);
	    }

	    return func;
	  }

	  function skate(name, opts) {
	    var Ctor = makeCtor(name, opts);
	    var proto = (Ctor.extends ? document.createElement(Ctor.extends).constructor : HTMLElement).prototype;

	    if (!proto.isPrototypeOf(Ctor.prototype)) {
	      Ctor.prototype = Object.create(proto, (0, _getOwnPropertyDescriptors2.default)(Ctor.prototype));
	    }

	    Ctor.prototype.createdCallback = (0, _created2.default)(Ctor);
	    Ctor.prototype.attachedCallback = (0, _attached2.default)(Ctor);
	    Ctor.prototype.detachedCallback = (0, _detached2.default)(Ctor);
	    Ctor.prototype.attributeChangedCallback = (0, _attribute2.default)(Ctor);

	    if (!Ctor.isNative) {
	      initDocument();

	      _documentObserver2.default.register();
	    }

	    var type = Ctor.type;

	    if (type.register) {
	      type.register(Ctor);
	    }

	    return _registry2.default.set(name, Ctor);
	  }

	  skate.create = _create2.default;
	  skate.emit = _emit2.default;
	  skate.fragment = _fragment2.default;
	  skate.init = _init2.default;
	  skate.properties = _index2.default;
	  skate.ready = _ready2.default;
	  skate.render = _render2.default;
	  skate.version = _version2.default;
	  exports.default = skate;
	  module.exports = exports['default'];
	});
	});

	var require$$0 = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

	var global = __commonjs(function (module, exports, global) {
	(function (global, factory) {
	  if (typeof define === "function" && define.amd) {
	    define(['module', 'exports', '../lib/index.js'], factory);
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports, require$$0);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports, global.index);
	    global.global = mod.exports;
	  }
	})(__commonjs_global, function (module, exports, _index) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _index2 = _interopRequireDefault(_index);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  var previousGlobal = window.skate;

	  _index2.default.noConflict = function noConflict() {
	    window.skate = previousGlobal;
	    return this;
	  };

	  window.skate = _index2.default;
	  exports.default = _index2.default;
	  module.exports = exports['default'];
	});
	});

	var global$1 = (global && typeof global === 'object' && 'default' in global ? global['default'] : global);

	return global$1;

}));
//# sourceMappingURL=index.js.map