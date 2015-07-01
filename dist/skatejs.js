// src/api/chain.js
__4f25f0faaaf0c53e145c08c5d91c9c2b = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = chain;
  
  function chain() {
    var _this = this;
  
    for (var _len = arguments.length, cbs = Array(_len), _key = 0; _key < _len; _key++) {
      cbs[_key] = arguments[_key];
    }
  
    // Optimisation so that it doesn't wrap at all if you've only passed in a
    // single function.
    if (cbs.length === 1 && typeof cbs[0] === "function") {
      return cbs[0];
    }
  
    cbs = cbs.filter(Boolean).map(function (cb) {
      // Strings point to a function on the context passed to the proxy fn.
      if (typeof cb === "string") {
        return function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
  
          if (typeof this[cb] === "function") {
            this[cb].apply(this, args);
          }
        };
      }
  
      // Arrays are passed through and object values become an array of values.
      if (typeof cb === "object") {
        cb = Array.isArray(cb) ? cb : Object.keys(cb).map(function (key) {
          return cb[key];
        });
        return chain.apply(_this, cb);
      }
  
      return cb;
    });
  
    return function () {
      var _this2 = this;
  
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
  
      cbs.forEach(function (cb) {
        return cb.apply(_this2, args);
      });
      return this;
    };
  }
  
  return module.exports;
}).call(this);

// src/util/assign.js
__d48ab0568b1578e9cac74e66baa6d3e7 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (child) {
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
  
  return module.exports;
}).call(this);

// src/util/data.js
__18291b0452e01f65cf28d6695040736a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (element) {
    var namespace = arguments[1] === undefined ? "" : arguments[1];
  
    var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
    return namespace && (data[namespace] || (data[namespace] = {})) || data;
  };
  
  return module.exports;
}).call(this);

// src/type/element.js
__43714db526496b3dd90353996f6dce09 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = {
    /* jshint expr: true */
    create: function create(opts) {
      var elem = document.createElement(opts["extends"] || opts.id);
      opts["extends"] && elem.setAttribute("is", opts.id);
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
  
      var tagToExtend = definition["extends"];
      if (isAttrValue) {
        if (tagName === tagToExtend) {
          return [definition];
        }
      } else if (!tagToExtend) {
        return [definition];
      }
    }
  };
  
  return module.exports;
}).call(this);

// src/types.js
__f0f0b5ec3aafaccda9fbadea235a9902 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var typeElement = _interopRequire(__43714db526496b3dd90353996f6dce09);
  
  module.exports = {
    element: typeElement
  };
  
  return module.exports;
}).call(this);

// src/global/vars.js
__dd77578495c1d19b0e115627616ea63a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
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
  
  module.exports = window.__skate0;
  
  return module.exports;
}).call(this);

// src/util/has-own.js
__6d7878404f872c72787f01cd3e06dd21 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
  
  return module.exports;
}).call(this);

// src/global/registry.js
__9cff21a9f41cc9ecfe56139e1040c954 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var types = _interopRequire(__f0f0b5ec3aafaccda9fbadea235a9902);
  
  var globals = _interopRequire(__dd77578495c1d19b0e115627616ea63a);
  
  var hasOwn = _interopRequire(__6d7878404f872c72787f01cd3e06dd21);
  
  var definitions = {};
  var definitionsPerType = {};
  
  module.exports = globals.registerIfNotExists("registry", {
    get: function get(id) {
      return hasOwn(definitions, id) && definitions[id];
    },
    set: function set(id, opts) {
      if (this.get(id)) {
        throw new Error("A Skate component with the name of \"" + id + "\" already exists.");
      }
  
      if (!types[opts.type]) {
        throw new Error("Cannot register \"" + id + "\" because there is no registered type for \"" + opts.type + "\". Please make sure you've registered a type handler using skate.type().");
      }
  
      var type = opts.type;
      definitions[id] = opts;
      definitionsPerType[type] || (definitionsPerType[type] = {});
      definitionsPerType[type][id] = opts;
      return this;
    },
    find: function find(elem) {
      var defs = [];
  
      // By traversing through the keys of definitionsPerType, we only use the
      // use the types that all our registered components need rather than all
      // registered types. This means if you have element, attribute and class
      // types registered, but you've only registered components that use the
      // element type, you don't incur the overhead of checking against all
      // types.
      for (var type in definitionsPerType) {
        defs = defs.concat(types[type].filter(elem, definitionsPerType[type]) || []);
      }
      return defs;
    }
  });
  
  return module.exports;
}).call(this);

// src/util/ignored.js
__092f8936e5006bddcb3baf24320a5a06 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (element) {
    var attrs = element.attributes;
    return attrs && !!attrs["data-skate-ignore"];
  };
  
  return module.exports;
}).call(this);

// src/util/walk-tree.js
__164e5750c20526cb74a9e443b730eeff = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var ignored = _interopRequire(__092f8936e5006bddcb3baf24320a5a06);
  
  function walk(elem, fn, filter) {
    if (elem.nodeType !== 1 || ignored(elem) || filter && filter(elem) === false) {
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
  
  module.exports = function (elems, fn, filter) {
    if (elems.length === undefined) {
      elems = [elems];
    }
  
    for (var a = 0; a < elems.length; a++) {
      walk(elems[a], fn, filter);
    }
  };
  
  return module.exports;
}).call(this);

// src/lifecycle/attached.js
__2b55a083f45c9ef157662a1dc1674218 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var apiChain = _interopRequire(__4f25f0faaaf0c53e145c08c5d91c9c2b);
  
  var data = _interopRequire(__18291b0452e01f65cf28d6695040736a);
  
  var registry = _interopRequire(__9cff21a9f41cc9ecfe56139e1040c954);
  
  var walkTree = _interopRequire(__164e5750c20526cb74a9e443b730eeff);
  
  function callAttachedOnDescendants(elem, id) {
    walkTree(elem.childNodes, function (child) {
      registry.find(child).forEach(function (Ctor) {
        return Ctor.prototype.attachedCallback.call(child);
      });
    }, function (child) {
      return !data(child, id).attached;
    });
  }
  
  module.exports = function (opts) {
    /* jshint expr: true */
    return function () {
      var info = data(this, opts.id);
      var isNative = this.attachedCallback;
  
      if (info.attached) {
        return;
      }
  
      info.attached = true;
      apiChain(opts.attached).call(this);
      isNative || callAttachedOnDescendants(this, opts.id);
      info.detached = false;
    };
  };
  
  return module.exports;
}).call(this);

// src/util/matches-selector.js
__365bd8b7bbfb2b50d6dbfd830f0aa927 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var elProto = window.HTMLElement.prototype;
  var nativeMatchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;
  
  // Only IE9 has this msMatchesSelector bug, but best to detect it.
  var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call(document.createElement("div"), "div");
  
  module.exports = function (element, selector) {
    if (hasNativeMatchesSelectorDetattachedBug) {
      var clone = element.cloneNode();
      document.createElement("div").appendChild(clone);
      return nativeMatchesSelector.call(clone, selector);
    }
    return nativeMatchesSelector.call(element, selector);
  };
  
  return module.exports;
}).call(this);

// src/util/maybe-this.js
__3a71a6ff9ecf4b5639833a53ddd3f993 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (fn) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      return args[0] && args[0].nodeType ? fn.apply(this, args) : function () {
        return fn.apply(window, [this].concat(args));
      };
    };
  };
  
  return module.exports;
}).call(this);

// src/api/event.js
__6bf39bed4ad969dbb83d42a8ba2be197 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var apiChain = _interopRequire(__4f25f0faaaf0c53e145c08c5d91c9c2b);
  
  var matches = _interopRequire(__365bd8b7bbfb2b50d6dbfd830f0aa927);
  
  var maybeThis = _interopRequire(__3a71a6ff9ecf4b5639833a53ddd3f993);
  
  function parseEvent(e) {
    var parts = e.split(" ");
    var name = parts.shift();
    var selector = parts.join(" ").trim();
    return {
      name: name,
      isAny: selector[0] === "*",
      isChild: selector[0] === ">",
      selector: selector
    };
  }
  
  function makeDelegateHandler(elem, handler, parsed) {
    return function (e) {
      var current = e.target;
      var selector = parsed.selector;
  
      // Any descendant.
      if (parsed.isAny) {
        e.delegateTarget = current;
        return handler(e);
      }
  
      // Specific children.
      if (parsed.isChild) {
        selector = "" + elem.tagName + " " + selector;
      }
  
      // Specific descendants.
      while (current && current !== elem.parentNode) {
        if (matches(current, selector)) {
          e.delegateTarget = current;
          return handler(e);
        }
        current = current.parentNode;
      }
    };
  }
  
  function makeNormalHandler(elem, handler) {
    return function (e) {
      if (e.target === elem) {
        e.delegateTarget = elem;
        handler(e);
      }
    };
  }
  
  function bindEvent(elem, event, handler) {
    var parsed = parseEvent(event);
    var name = parsed.name;
    var selector = parsed.selector;
  
    var capture = selector && (name === "blur" || name === "focus");
    handler = apiChain(handler).bind(elem);
    handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
    elem.addEventListener(name, handler, capture);
  }
  
  function bindEvents(elem, events) {
    Object.keys(events).forEach(function (name) {
      bindEvent(elem, name, events[name]);
    });
  }
  
  module.exports = maybeThis(function (elem, events, handler) {
    if (typeof events === "string") {
      bindEvent(elem, events, handler);
    } else if (Array.isArray(events)) {
      events.forEach(function (e) {
        return bindEvent(elem, e, handler);
      });
    } else {
      bindEvents(elem, events || {});
    }
  });
  
  return module.exports;
}).call(this);

// src/util/assign-safe.js
__d9d26492984e649e5130081ad32bafd6 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (child) {
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
  
  return module.exports;
}).call(this);

// src/util/dash-case.js
__0cd264077c1ca567539d11e826d3c00e = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (str) {
    return str.split(/([A-Z])/).reduce(function (one, two, idx) {
      var dash = !one || idx % 2 === 0 ? "" : "-";
      return "" + one + "" + dash + "" + two.toLowerCase();
    });
  };
  
  return module.exports;
}).call(this);

// src/api/emit.js
__639a0d2e0f8a90cd72e6197bdb481558 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var maybeThis = _interopRequire(__3a71a6ff9ecf4b5639833a53ddd3f993);
  
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
  
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
    return e;
  }
  
  function emitOne(elem, name, opts) {
    /* jshint expr: true */
    opts.bubbles === undefined && (opts.bubbles = true);
    opts.cancelable === undefined && (opts.cancelable = true);
    return elem.dispatchEvent(createCustomEvent(name, opts));
  }
  
  module.exports = maybeThis(function (elem, name) {
    var opts = arguments[2] === undefined ? {} : arguments[2];
  
    var names = typeof name === "string" ? name.split(" ") : name;
    return names.reduce(function (prev, curr) {
      if (!emitOne(elem, curr, opts)) {
        prev.push(curr);
      }
      return prev;
    }, []);
  });
  
  return module.exports;
}).call(this);

// src/api/notify.js
__9c53d0b55c601bcd876ca0d265bb297a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var maybeThis = _interopRequire(__3a71a6ff9ecf4b5639833a53ddd3f993);
  
  var emit = _interopRequire(__639a0d2e0f8a90cd72e6197bdb481558);
  
  /* jshint expr: true */
  module.exports = maybeThis(function (elem, name) {
    var detail = arguments[2] === undefined ? {} : arguments[2];
  
    // Notifications must *always* have:
    // - name
    // - newValue
    // - oldValue
    // but may contain other information.
    detail.name = name;
    detail.newValue === detail.newValue === undefined ? elem[name] : detail.newValue;
    detail.oldValue === detail.oldValue === undefined ? elem[name] : detail.oldValue;
  
    emit(elem, ["skate.property", "skate.property." + name], {
      detail: detail
    });
  });
  
  return module.exports;
}).call(this);

// src/api/property.js
__f57aa4e0179bb8c6b45d999112238add = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var assignSafe = _interopRequire(__d9d26492984e649e5130081ad32bafd6);
  
  var dashCase = _interopRequire(__0cd264077c1ca567539d11e826d3c00e);
  
  var data = _interopRequire(__18291b0452e01f65cf28d6695040736a);
  
  var maybeThis = _interopRequire(__3a71a6ff9ecf4b5639833a53ddd3f993);
  
  var notify = _interopRequire(__9c53d0b55c601bcd876ca0d265bb297a);
  
  // TODO: Lean out option normalisation.
  function property(name, prop) {
    var internalGetter, internalSetter, internalValue, isBoolean;
  
    if (typeof prop === "object") {
      prop = assignSafe({}, prop);
    } else {
      prop = { type: prop };
    }
  
    if (prop.attr === true) {
      prop.attr = dashCase(name);
    }
  
    if (prop.notify === undefined) {
      prop.notify = true;
    }
  
    if (typeof prop.type !== "function") {
      prop.type = function (val) {
        return val;
      };
    }
  
    if (prop.init !== undefined && typeof prop.init !== "function") {
      (function () {
        var value = prop.init;
        prop.init = function () {
          return value;
        };
      })();
    }
  
    internalGetter = prop.get;
    internalSetter = prop.set;
    isBoolean = prop.type && prop.type === Boolean;
  
    prop.get = function () {
      return internalGetter ? internalGetter.apply(this) : internalValue;
    };
  
    prop.set = function (value) {
      var info = data(this);
  
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
          this.setAttribute(prop.attr, "");
        } else if (internalValue == null || isBoolean && !internalValue) {
          this.removeAttribute(prop.attr, "");
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
        notify(this, name, {
          newValue: newValue,
          oldValue: oldValue
        });
      }
    };
  
    return prop;
  }
  
  function defineProperty(elem, name, prop) {
    // We don't need to scope the data to the component ID be cause if multiple
    // bindings on the same component define the same attribute, then they'd
    // conflict anyways.
    var info = data(elem);
  
    if (!info.attributeToPropertyMap) {
      info.attributeToPropertyMap = {};
    }
  
    prop = property(name, prop);
    Object.defineProperty(elem, name, prop);
  
    // TODO: What happens if the setter does something with a descendant that
    // may not exist yet?
    //
    // Initialise the value if a initial value was provided. Attributes that exist
    // on the element should trump any default values that are provided.
    if (prop.init && (!prop.attr || !elem.hasAttribute(prop.attr))) {
      elem[name] = prop.init.call(elem);
    }
  
    // This ensures that the corresponding attribute will know to update this
    // property when it is set.
    if (prop.attr) {
      info.attributeToPropertyMap[prop.attr] = name;
    }
  }
  
  function defineProperties(elem, props) {
    Object.keys(props).forEach(function (name) {
      defineProperty(elem, name, props[name]);
    });
  }
  
  module.exports = maybeThis(function (elem) {
    var props = arguments[1] === undefined ? {} : arguments[1];
    var prop = arguments[2] === undefined ? {} : arguments[2];
  
    if (typeof props === "string") {
      defineProperty(elem, props, prop);
    } else {
      defineProperties(elem, props);
    }
  });
  
  return module.exports;
}).call(this);

// src/util/protos.js
__1d11a28624d684874cb270f137cc0122 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (proto) {
    var chains = [proto];
    /* jshint boss: true */
    while (proto = Object.getPrototypeOf(proto)) {
      chains.push(proto);
    }
    chains.reverse();
    return chains;
  };
  
  return module.exports;
}).call(this);

// src/lifecycle/created.js
__fe1aef0db5b664068b470b21f7c754a5 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var apiChain = _interopRequire(__4f25f0faaaf0c53e145c08c5d91c9c2b);
  
  var apiEvent = _interopRequire(__6bf39bed4ad969dbb83d42a8ba2be197);
  
  var apiProperty = _interopRequire(__f57aa4e0179bb8c6b45d999112238add);
  
  var assignSafe = _interopRequire(__d9d26492984e649e5130081ad32bafd6);
  
  var data = _interopRequire(__18291b0452e01f65cf28d6695040736a);
  
  var protos = _interopRequire(__1d11a28624d684874cb270f137cc0122);
  
  var registry = _interopRequire(__9cff21a9f41cc9ecfe56139e1040c954);
  
  var walkTree = _interopRequire(__164e5750c20526cb74a9e443b730eeff);
  
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
  
  function markAsResolved(elem, resolvedAttribute, unresolvedAttribute) {
    elem.removeAttribute(unresolvedAttribute);
    elem.setAttribute(resolvedAttribute, "");
  }
  
  function callCreatedOnDescendants(elem, id) {
    walkTree(elem.childNodes, function (child) {
      registry.find(child).forEach(function (Ctor) {
        return Ctor.prototype.createdCallback.call(child);
      });
    }, function (child) {
      return !data(child, id).created;
    });
  }
  
  function fnOrApi(fn, api) {
    return typeof fn === "function" ? fn : api(fn);
  }
  
  function applyPrototype(proto) {
    var prototypes = protos(proto);
    return function () {
      var _this = this;
  
      prototypes.forEach(function (proto) {
        if (!proto.isPrototypeOf(_this)) {
          assignSafe(_this, proto);
        }
      });
    };
  }
  
  module.exports = function (opts) {
    var created = apiChain(opts.created);
    var events = fnOrApi(opts.events, apiEvent);
    var properties = fnOrApi(opts.properties, apiProperty);
    var prototype = applyPrototype(opts.prototype);
    var template = apiChain(opts.template);
  
    /* jshint expr: true */
    return function () {
      var info = data(this, opts.id);
      var isNative = this.createdCallback;
  
      if (info.created) {
        return;
      }
  
      info.created = true;
      isNative || prototype.call(this);
      isNative || patchAttributeMethods(this);
      template.call(this);
      properties.call(this);
      events.call(this);
      created.call(this);
      isNative || callCreatedOnDescendants(this, opts.id);
      triggerAttributesCreated(this);
      markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
    };
  };
  
  return module.exports;
}).call(this);

// src/util/element-contains.js
__6f793202bae98770dbb2b598df7929ad = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var elementPrototype = window.HTMLElement.prototype;
  var elementPrototypeContains = elementPrototype.contains;
  
  module.exports = function (source, target) {
    // The document element does not have the contains method in IE.
    if (source === document && !source.contains) {
      return document.head.contains(target) || document.body.contains(target);
    }
  
    return source.contains ? source.contains(target) : elementPrototypeContains.call(source, target);
  };
  
  return module.exports;
}).call(this);

// src/api/init.js
__3add36046399fead5a83243849207ed7 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var attached = _interopRequire(__2b55a083f45c9ef157662a1dc1674218);
  
  var created = _interopRequire(__fe1aef0db5b664068b470b21f7c754a5);
  
  var elementContains = _interopRequire(__6f793202bae98770dbb2b598df7929ad);
  
  var registry = _interopRequire(__9cff21a9f41cc9ecfe56139e1040c954);
  
  var walkTree = _interopRequire(__164e5750c20526cb74a9e443b730eeff);
  
  var HTMLElement = window.HTMLElement;
  
  module.exports = function (nodes) {
    var nodesToUse = nodes;
  
    if (!nodes) {
      return nodes;
    }
  
    if (typeof nodes === "string") {
      nodesToUse = nodes = document.querySelectorAll(nodes);
    } else if (nodes instanceof HTMLElement) {
      nodesToUse = [nodes];
    }
  
    walkTree(nodesToUse, function (element) {
      var components = registry.find(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        created(components[a]).call(element);
      }
  
      for (var a = 0; a < componentsLength; a++) {
        if (elementContains(document, element)) {
          attached(components[a]).call(element);
        }
      }
    });
  
    return nodes;
  };
  
  return module.exports;
}).call(this);

// src/api/create.js
__1675a7174b713323cc232370699a2714 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var assign = _interopRequire(__d48ab0568b1578e9cac74e66baa6d3e7);
  
  var init = _interopRequire(__3add36046399fead5a83243849207ed7);
  
  var registry = _interopRequire(__9cff21a9f41cc9ecfe56139e1040c954);
  
  var specialMap = {
    caption: "table",
    dd: "dl",
    dt: "dl",
    li: "ul",
    tbody: "table",
    td: "tr",
    thead: "table",
    tr: "tbody"
  };
  
  function matchTag(dom) {
    var tag = dom.match(/\s*<([^\s>]+)/);
    return tag && tag[1];
  }
  
  function createFromHtml(html) {
    var par = document.createElement(specialMap[matchTag(html)] || "div");
    par.innerHTML = html;
    return init(par.firstElementChild);
  }
  
  function createFromName(name) {
    var ctor = registry.get(name);
    return ctor && ctor() || document.createElement(name);
  }
  
  module.exports = function (name, props) {
    name = name.trim();
    return assign(name[0] === "<" ? createFromHtml(name) : createFromName(name), props);
  };
  
  return module.exports;
}).call(this);

// src/api/no-conflict.js
__82110da8eb4359fb9724f67f4a12febe = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var previousSkate = window.skate;
  
  module.exports = function () {
    window.skate = previousSkate;
    return this;
  };
  
  return module.exports;
}).call(this);

// src/api/ready.js
__83ca289f5309abef55c338a9f7a22385 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (callback) {
    callback = callback.bind(this);
    if (document.readyState === "complete") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  };
  
  return module.exports;
}).call(this);

// src/api/template.js
__aa055221e174d0eee59fde807667fa69 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
  
    return function () {
      this.innerHTML = args.join("");
    };
  };
  
  return module.exports;
}).call(this);

// src/api/type.js
__df5112248641660374a4ff3deedcb65e = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var types = _interopRequire(__f0f0b5ec3aafaccda9fbadea235a9902);
  
  module.exports = function (name, type) {
    types[name] = type;
  };
  
  return module.exports;
}).call(this);

// src/api/version.js
__662bde51c096e9d79bf327311ea178e0 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = "0.13.2";
  
  return module.exports;
}).call(this);

// src/api/watch.js
__4390c5a519e11ff146587075b0e7abac = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var maybeThis = _interopRequire(__3a71a6ff9ecf4b5639833a53ddd3f993);
  
  var MutationObserver = window.MutationObserver;
  
  // TODO: skate.watch() should not create a new observer if it doesn't have to.
  // TODO: Should we allow the watching of attributes?
  // TODO: Should we allow the watching of character data? If so, then the
  // polyfill will need to support this.
  module.exports = maybeThis(function (elem, callback) {
    var opts = arguments[2] === undefined ? {} : arguments[2];
  
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        callback.call(elem, mutation.addedNodes || [], mutation.removedNodes || []);
      });
    });
  
    observer.observe(elem, {
      childList: true,
      subtree: opts.subtree
    });
  
    return observer;
  });
  
  return module.exports;
}).call(this);

// src/lifecycle/attribute.js
__9f17962f9aa326a94ed3e5d6f6b172e6 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var apiChain = _interopRequire(__4f25f0faaaf0c53e145c08c5d91c9c2b);
  
  var data = _interopRequire(__18291b0452e01f65cf28d6695040736a);
  
  module.exports = function (opts) {
    var callback = apiChain(opts.attribute);
  
    /* jshint expr: true */
    return function (name, oldValue, newValue) {
      var info = data(this);
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
  
  return module.exports;
}).call(this);

// src/util/debounce.js
__afcda96357b2c6b7e23ccb9ac8b92f43 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (fn) {
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
  
  return module.exports;
}).call(this);

// src/defaults.js
__46b087e8c15b2e0ebc2c4d4cbc36d975 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = {
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
    "extends": undefined,
  
    // The ID of the definition. This is automatically set in the `skate()`
    // function.
    id: "",
  
    // Properties and methods to add to each element.
    prototype: {},
  
    // The attribute name to add after calling the created() callback.
    resolvedAttribute: "resolved",
  
    // The template to replace the content of the element with.
    template: undefined,
  
    // The type of bindings to allow.
    type: "element",
  
    // The attribute name to remove after calling the created() callback.
    unresolvedAttribute: "unresolved"
  };
  
  return module.exports;
}).call(this);

// src/lifecycle/detached.js
__8e93439e8a566d1586c9903a75a6a785 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var apiChain = _interopRequire(__4f25f0faaaf0c53e145c08c5d91c9c2b);
  
  var data = _interopRequire(__18291b0452e01f65cf28d6695040736a);
  
  var registry = _interopRequire(__9cff21a9f41cc9ecfe56139e1040c954);
  
  var walkTree = _interopRequire(__164e5750c20526cb74a9e443b730eeff);
  
  function callDetachedOnDescendants(elem, id) {
    walkTree(elem.childNodes, function (child) {
      registry.find(child).forEach(function (Ctor) {
        return Ctor.prototype.detachedCallback.call(child);
      });
    }, function (child) {
      return !data(child, id).detached;
    });
  }
  
  module.exports = function (opts) {
    /* jshint expr: true */
    return function () {
      var info = data(this, opts.id);
      var isNative = this.detachedCallback;
  
      if (info.detached) {
        return;
      }
  
      info.detached = true;
      apiChain(opts.detached).call(this);
      isNative || callDetachedOnDescendants(this, opts.id);
      info.attached = false;
    };
  };
  
  return module.exports;
}).call(this);

// src/global/document-observer.js
__d8200645c4d96aee6940034d9c030d1f = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var apiWatch = _interopRequire(__4390c5a519e11ff146587075b0e7abac);
  
  var attached = _interopRequire(__2b55a083f45c9ef157662a1dc1674218);
  
  var created = _interopRequire(__fe1aef0db5b664068b470b21f7c754a5);
  
  var detached = _interopRequire(__8e93439e8a566d1586c9903a75a6a785);
  
  var globals = _interopRequire(__dd77578495c1d19b0e115627616ea63a);
  
  var ignored = _interopRequire(__092f8936e5006bddcb3baf24320a5a06);
  
  var registry = _interopRequire(__9cff21a9f41cc9ecfe56139e1040c954);
  
  var walkTree = _interopRequire(__164e5750c20526cb74a9e443b730eeff);
  
  var DocumentFragment = window.DocumentFragment;
  
  function getClosestIgnoredElement(element) {
    var parent = element;
  
    while (parent && parent !== document && !(parent instanceof DocumentFragment)) {
      if (ignored(parent)) {
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
      walkTree(addedNodes, function (element) {
        var components = registry.find(element);
        var componentsLength = components.length;
  
        for (var a = 0; a < componentsLength; a++) {
          created(components[a]).call(element);
        }
  
        for (var a = 0; a < componentsLength; a++) {
          attached(components[a]).call(element);
        }
      });
    }
  
    // We can't check batched nodes here because they won't have a parent node.
    if (removedNodes.length) {
      walkTree(removedNodes, function (element) {
        var components = registry.find(element);
        var componentsLength = components.length;
  
        for (var a = 0; a < componentsLength; a++) {
          detached(components[a]).call(element);
        }
      });
    }
  }
  
  module.exports = globals.registerIfNotExists("observer", {
    observer: undefined,
    register: function register() {
      if (!this.observer) {
        this.observer = apiWatch(document, documentObserverHandler, { subtree: true });
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
  
  return module.exports;
}).call(this);

// src/util/element-constructor.js
__cdf80614962dbe37e0456f37c35fe468 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var types = _interopRequire(__f0f0b5ec3aafaccda9fbadea235a9902);
  
  module.exports = function (opts) {
    var type = types[opts.type];
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
    Object.defineProperty(CustomElement.prototype, "constructor", {
      enumerable: false,
      value: CustomElement
    });
  
    return CustomElement;
  };
  
  return module.exports;
}).call(this);

// src/support/custom-elements.js
__c6f5e18624750ce93a74df6369c85ef0 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function () {
    return typeof document.registerElement === "function";
  };
  
  return module.exports;
}).call(this);

// src/support/valid-custom-element.js
__6e1dfed2b03894ef63a4b65d5038d223 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (name) {
    return name.indexOf("-") > 0;
  };
  
  return module.exports;
}).call(this);

// src/index.js
__abb93179bdc0236a6e77d3eae07c991c = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var apiChain = _interopRequire(__4f25f0faaaf0c53e145c08c5d91c9c2b);
  
  var apiCreate = _interopRequire(__1675a7174b713323cc232370699a2714);
  
  var apiEmit = _interopRequire(__639a0d2e0f8a90cd72e6197bdb481558);
  
  var apiEvent = _interopRequire(__6bf39bed4ad969dbb83d42a8ba2be197);
  
  var apiInit = _interopRequire(__3add36046399fead5a83243849207ed7);
  
  var apiNoConflict = _interopRequire(__82110da8eb4359fb9724f67f4a12febe);
  
  var apiNotify = _interopRequire(__9c53d0b55c601bcd876ca0d265bb297a);
  
  var apiProperty = _interopRequire(__f57aa4e0179bb8c6b45d999112238add);
  
  var apiReady = _interopRequire(__83ca289f5309abef55c338a9f7a22385);
  
  var apiTemplate = _interopRequire(__aa055221e174d0eee59fde807667fa69);
  
  var apiType = _interopRequire(__df5112248641660374a4ff3deedcb65e);
  
  var apiVersion = _interopRequire(__662bde51c096e9d79bf327311ea178e0);
  
  var apiWatch = _interopRequire(__4390c5a519e11ff146587075b0e7abac);
  
  var assign = _interopRequire(__d48ab0568b1578e9cac74e66baa6d3e7);
  
  var assignSafe = _interopRequire(__d9d26492984e649e5130081ad32bafd6);
  
  var attached = _interopRequire(__2b55a083f45c9ef157662a1dc1674218);
  
  var attribute = _interopRequire(__9f17962f9aa326a94ed3e5d6f6b172e6);
  
  var created = _interopRequire(__fe1aef0db5b664068b470b21f7c754a5);
  
  var debounce = _interopRequire(__afcda96357b2c6b7e23ccb9ac8b92f43);
  
  var defaults = _interopRequire(__46b087e8c15b2e0ebc2c4d4cbc36d975);
  
  var detached = _interopRequire(__8e93439e8a566d1586c9903a75a6a785);
  
  var documentObserver = _interopRequire(__d8200645c4d96aee6940034d9c030d1f);
  
  var elementConstructor = _interopRequire(__cdf80614962dbe37e0456f37c35fe468);
  
  var registry = _interopRequire(__9cff21a9f41cc9ecfe56139e1040c954);
  
  var supportsCustomElements = _interopRequire(__c6f5e18624750ce93a74df6369c85ef0);
  
  var walkTree = _interopRequire(__164e5750c20526cb74a9e443b730eeff);
  
  var validCustomElement = _interopRequire(__6e1dfed2b03894ef63a4b65d5038d223);
  
  function initDocument() {
    walkTree(document.documentElement.childNodes, function (element) {
      var components = registry.find(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        created(components[a]).call(element);
      }
  
      for (var a = 0; a < componentsLength; a++) {
        attached(components[a]).call(element);
      }
    });
  }
  
  function initDocumentWhenReady() {
    apiReady(initDocument);
  }
  
  function makeOptions(userOptions) {
    var options = assignSafe({}, defaults);
  
    // Copy over all standard options if the user has defined them.
    for (var _name in defaults) {
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
  
      return assign(new Ctor(), props);
    };
    CtorWrapper.prototype = Ctor.prototype;
    return CtorWrapper;
  }
  
  var debouncedInitDocumentWhenReady = debounce(initDocumentWhenReady);
  var HTMLElement = window.HTMLElement;
  
  function skate(id, userOptions) {
    var Ctor, CtorParent, isNative;
    var opts = makeOptions(userOptions);
  
    CtorParent = opts["extends"] ? document.createElement(opts["extends"]).constructor : HTMLElement;
    isNative = opts.type === "element" && supportsCustomElements() && validCustomElement(id);
  
    // Inherit from parent prototype.
    if (!CtorParent.prototype.isPrototypeOf(opts.prototype)) {
      opts.prototype = assignSafe(Object.create(CtorParent.prototype), opts.prototype);
    }
  
    // Extend behaviour of existing callbacks.
    opts.prototype.createdCallback = created(opts);
    opts.prototype.attachedCallback = attached(opts);
    opts.prototype.detachedCallback = detached(opts);
    opts.prototype.attributeChangedCallback = attribute(opts);
  
    // Ensure the ID can be retrieved from the options or constructor.
    opts.id = id;
  
    // Make a constructor for the definition.
    if (isNative) {
      Ctor = document.registerElement(id, opts);
    } else {
      Ctor = elementConstructor(opts);
      debouncedInitDocumentWhenReady();
      documentObserver.register();
    }
  
    Ctor = makeNonNewableWrapper(Ctor);
    assignSafe(Ctor, opts);
    registry.set(id, Ctor);
  
    return Ctor;
  }
  
  skate.chain = apiChain;
  skate.create = apiCreate;
  skate.emit = apiEmit;
  skate.event = apiEvent;
  skate.init = apiInit;
  skate.noConflict = apiNoConflict;
  skate.notify = apiNotify;
  skate.property = apiProperty;
  skate.ready = apiReady;
  skate.template = apiTemplate;
  skate.type = apiType;
  skate.version = apiVersion;
  skate.watch = apiWatch;
  
  // Global
  window.skate = skate;
  
  // ES6
  module.exports = skate;
  
  return module.exports;
}).call(this);