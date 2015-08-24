// src/util/assign.js
__1d39a4f1c887ce649ab75b6b1f153962 = (function () {
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
__fddcb3c02b4880b7bd627c13683f751e = (function () {
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

// src/global/vars.js
__6445636516e326f883c0d0977f200342 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var VERSION = "__skate_0_14_0";
  
  if (!window[VERSION]) {
    window[VERSION] = {
      registerIfNotExists: function registerIfNotExists(name, value) {
        return this[name] || (this[name] = value);
      }
    };
  }
  
  module.exports = window[VERSION];
  
  return module.exports;
}).call(this);

// src/util/has-own.js
__89592619bf87939454679b7daef68854 = (function () {
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

// src/type/element.js
__defe6124e9b33e8efda86549fb8c3d4e = (function () {
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
      var tagName = (elem.tagName || elem.localName).toLowerCase();
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

// src/global/registry.js
__c5a0afa9d0578d167d0227b32abc8a92 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var globals = _interopRequire(__6445636516e326f883c0d0977f200342);
  
  var hasOwn = _interopRequire(__89592619bf87939454679b7daef68854);
  
  var typeElement = _interopRequire(__defe6124e9b33e8efda86549fb8c3d4e);
  
  var definitions = {};
  var map = [];
  var types = [];
  
  module.exports = globals.registerIfNotExists("registry", {
    get: function get(id) {
      return hasOwn(definitions, id) && definitions[id];
    },
    set: function set(id, opts) {
      if (this.get(id)) {
        throw new Error("A Skate component with the name of \"" + id + "\" already exists.");
      }
  
      var type = opts.type || typeElement;
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
  
  return module.exports;
}).call(this);

// src/util/ignored.js
__bb3ef9633325c0145428d55035ddc402 = (function () {
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
__e2f97b0e142d4a2a3414fbe5e42af13c = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var ignored = _interopRequire(__bb3ef9633325c0145428d55035ddc402);
  
  var Node = window.Node;
  
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
  
  return module.exports;
}).call(this);

// src/lifecycle/attached.js
__d3cc4f73de07fed8af79602fe760a6bc = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var data = _interopRequire(__fddcb3c02b4880b7bd627c13683f751e);
  
  var registry = _interopRequire(__c5a0afa9d0578d167d0227b32abc8a92);
  
  var walkTree = _interopRequire(__e2f97b0e142d4a2a3414fbe5e42af13c);
  
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
  
      if (info.attached) return;
      info.attached = true;
      info.detached = false;
  
      callAttachedOnDescendants(this, opts.id);
      opts.attached.call(this);
    };
  };
  
  return module.exports;
}).call(this);

// src/util/assign-safe.js
__88fe330eb212bd3871a091e9e1e4ec88 = (function () {
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

// src/util/matches-selector.js
__1b645af1f01d5843552ff3567eb9ab4e = (function () {
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

// src/lifecycle/events.js
__d0e4ee96089c15c32644554db9ec60d2 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var matches = _interopRequire(__1b645af1f01d5843552ff3567eb9ab4e);
  
  function parseEvent(e) {
    var parts = e.split(" ");
    var name = parts.shift();
    var selector = parts.join(" ").trim();
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
      e.delegateTarget = elem;
      handler(e);
    };
  }
  
  function bindEvent(elem, event, handler) {
    var parsed = parseEvent(event);
    var name = parsed.name;
    var selector = parsed.selector;
  
    var capture = selector && (name === "blur" || name === "focus");
    handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
    elem.addEventListener(name, handler, capture);
  }
  
  module.exports = function (elem, events) {
    var queue = [];
    var ready = false;
  
    Object.keys(events).forEach(function (name) {
      var handler = events[name].bind(elem);
      bindEvent(elem, name, function (e) {
        if (ready) {
          handler(e);
        } else {
          queue.push(handler.bind(elem, e));
        }
      });
    });
  
    return function () {
      ready = true;
      queue.forEach(function (handler) {
        return handler();
      });
      queue = [];
    };
  };
  
  return module.exports;
}).call(this);

// src/util/dash-case.js
__4cbfe4fe19a10b341b105765bb9a7022 = (function () {
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

// src/lifecycle/properties.js
__1fe19f7e3788adf71df63941d0461d6d = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var assignSafe = _interopRequire(__88fe330eb212bd3871a091e9e1e4ec88);
  
  var dashCase = _interopRequire(__4cbfe4fe19a10b341b105765bb9a7022);
  
  var data = _interopRequire(__fddcb3c02b4880b7bd627c13683f751e);
  
  function normaliseProp(prop) {
    if (typeof prop === "object") {
      prop = assignSafe({}, prop);
    } else {
      prop = { type: prop };
    }
    return prop;
  }
  
  function normaliseAttr(prop, name) {
    var attr = prop.attr;
    return attr === true ? dashCase(name) : attr;
  }
  
  function normaliseInit(prop, elem) {
    var init = prop.init;
    if (init !== undefined) {
      (function () {
        var value = init;
        init = typeof init === "function" ? init : function () {
          return value;
        };
        init = init.bind(elem);
      })();
    }
    return init;
  }
  
  function normaliseType(prop) {
    var type = prop.type;
    return typeof type !== "function" ? function (val) {
      return val;
    } : type;
  }
  
  function property(elem, name, prop) {
    var internalGetter, internalSetter, internalValue, isBoolean;
  
    prop = normaliseProp(prop);
    prop.attr = normaliseAttr(prop, name);
    prop.init = normaliseInit(prop, elem);
    prop.type = normaliseType(prop);
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
  
  module.exports = function (elem, props) {
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
  
  return module.exports;
}).call(this);

// src/util/protos.js
__262f1dced81ad25a69692fc69f59732d = (function () {
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
__54c1621d9a7829fe88fdc4b9d3386051 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var assignSafe = _interopRequire(__88fe330eb212bd3871a091e9e1e4ec88);
  
  var data = _interopRequire(__fddcb3c02b4880b7bd627c13683f751e);
  
  var lifecycleEvents = _interopRequire(__d0e4ee96089c15c32644554db9ec60d2);
  
  var lifecycleProperties = _interopRequire(__1fe19f7e3788adf71df63941d0461d6d);
  
  var protos = _interopRequire(__262f1dced81ad25a69692fc69f59732d);
  
  var registry = _interopRequire(__c5a0afa9d0578d167d0227b32abc8a92);
  
  var walkTree = _interopRequire(__e2f97b0e142d4a2a3414fbe5e42af13c);
  
  var elProto = window.Element.prototype;
  var oldSetAttribute = elProto.setAttribute;
  var oldRemoveAttribute = elProto.removeAttribute;
  
  function fnOr(fn) {
    var otherwise = arguments[1] === undefined ? function () {} : arguments[1];
  
    return typeof fn === "function" ? fn : function () {
      return otherwise(this, fn);
    };
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
    walkTree(elem.childNodes, function (child) {
      registry.find(child).forEach(function (Ctor) {
        return Ctor.prototype.createdCallback.call(child);
      });
    }, function (child) {
      return !data(child, id).created;
    });
  }
  
  function markAsResolved(elem, resolvedAttribute, unresolvedAttribute) {
    elem.removeAttribute(unresolvedAttribute);
    elem.setAttribute(resolvedAttribute, "");
  }
  
  module.exports = function (opts) {
    var created = fnOr(opts.created);
    var events = fnOr(opts.events, lifecycleEvents);
    var properties = fnOr(opts.properties, lifecycleProperties);
    var prototype = applyPrototype(opts.prototype);
    var template = fnOr(opts.template);
  
    /* jshint expr: true */
    return function () {
      var initEvents, initProps;
      var info = data(this, opts.id);
      var isNative = this.createdCallback;
      var isResolved = this.hasAttribute(opts.resolvedAttribute);
  
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
      // Any events that happen between here and when `initEvents()` is called
      // are queued up and not invoked until `initEvents()` is actually called.
      // This allows us to ensure that everything is set up before we actually
      // handle the events.
      initEvents = events.call(this);
  
      // The properties function returns a function that can be called to
      // initialise them on the element when appropriate. We bind property
      // handlers before calling any of the lifecycle handlers, but don't
      // actually initialise their values until after lifecycle callbacks have
      // been invoked.
      initProps = properties.call(this);
  
      // Apply the template to the element. In native, this may cause whatever
      // descendants are in the template (including existing innerHTML) to be
      // upgraded synchronously.
      //
      // We only template if the "resolved" attribute doesn't exist on the element
      // so that the developer can render server-side and only bind behaveiour
      // client-side.
      isResolved || template.call(this);
  
      // In both polyfill and native we force init all descendant components so
      // that we can ensure that created() has been called on all descendants
      // by the time it's called on the host.
      callCreatedOnDescendants(this, opts.id);
  
      // We trigger all property handlers for properties that exist once all
      // descendants are ready for any incoming state updates. This will also
      // trigger changes for any attributes that are properties.
      initProps();
  
      // Call created() on the host. If you properly declare your dependencies
      // (i.e., element-x needs element-y, you load element-y before element-x),
      // then you can assume that this created callback will be executed after
      // all descendant components' created callbacks have been executed.
      created.call(this);
  
      // We trigger all event handlers that have queued up so that nothing has
      // been lost since they were bound. This is done after initialising
      // properties because events may depend on initialised values. Any events
      // triggered from property initialisation will be queued up and initialised
      // here.
      initEvents();
  
      // Resolve after everything in the created lifecycle has run. This is so
      // that whatever needs to be done before this can be done without FOUC.
      //
      // We only need to do this if it's not resolved.
      isResolved || markAsResolved(this, opts.resolvedAttribute, opts.unresolvedAttribute);
    };
  };
  
  return module.exports;
}).call(this);

// src/util/element-contains.js
__6bcfe03fbc2ab82779544fc025f526c8 = (function () {
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
__295960f0bb6206a012930328aa94c78e = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var attached = _interopRequire(__d3cc4f73de07fed8af79602fe760a6bc);
  
  var created = _interopRequire(__54c1621d9a7829fe88fdc4b9d3386051);
  
  var elementContains = _interopRequire(__6bcfe03fbc2ab82779544fc025f526c8);
  
  var registry = _interopRequire(__c5a0afa9d0578d167d0227b32abc8a92);
  
  var walkTree = _interopRequire(__e2f97b0e142d4a2a3414fbe5e42af13c);
  
  module.exports = function (element) {
    var isInDom = elementContains(document, element);
  
    walkTree(element, function (descendant) {
      var components = registry.find(descendant);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        created(components[a]).call(descendant);
      }
  
      for (var a = 0; a < componentsLength; a++) {
        if (isInDom) {
          attached(components[a]).call(descendant);
        }
      }
    });
  
    return element;
  };
  
  return module.exports;
}).call(this);

// src/api/create.js
__f6f65a565c709b69651c25a4f54ac7f4 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var assign = _interopRequire(__1d39a4f1c887ce649ab75b6b1f153962);
  
  var init = _interopRequire(__295960f0bb6206a012930328aa94c78e);
  
  var registry = _interopRequire(__c5a0afa9d0578d167d0227b32abc8a92);
  
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
  
  function fixIeNotAllowingInnerHTMLOnTableElements(tag, html) {
    var target = document.createElement("div");
    var levels = 0;
  
    while (tag) {
      html = "<" + tag + ">" + html + "</" + tag + ">";
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
    var par = document.createElement(tag || "div");
    par.innerHTML = html;
    return init(par.firstElementChild || fixIeNotAllowingInnerHTMLOnTableElements(tag, html));
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

// src/api/emit.js
__0c127fafef24938352a5d4a34240ab22 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var utilElementContains = _interopRequire(__6bcfe03fbc2ab82779544fc025f526c8);
  
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
    var parent = document.createElement("div");
    var child = document.createElement("div");
    var hasBubbleOnDetachedElements = false;
    parent.appendChild(child);
    parent.addEventListener("test", function () {
      return hasBubbleOnDetachedElements = true;
    });
    child.dispatchEvent(createCustomEvent("test", { bubbles: true }));
    return hasBubbleOnDetachedElements;
  })();
  
  function createCustomEvent(name) {
    var opts = arguments[1] === undefined ? {} : arguments[1];
  
    if (CustomEvent) {
      return new CustomEvent(name, opts);
    }
  
    var e = document.createEvent("CustomEvent");
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
    shouldSimulateBubbling = opts.bubbles && !hasBubbleOnDetachedElements && !utilElementContains(document, elem);
  
    return shouldSimulateBubbling ? simulateBubbling(elem, cEvent) : elem.dispatchEvent(cEvent);
  }
  
  module.exports = function (elem, name) {
    var opts = arguments[2] === undefined ? {} : arguments[2];
  
    var names = typeof name === "string" ? name.split(" ") : name;
    return names.reduce(function (prev, curr) {
      if (emitOne(elem, curr, opts) === false) {
        prev.push(curr);
      }
      return prev;
    }, []);
  };
  
  return module.exports;
}).call(this);

// src/api/no-conflict.js
__cedb77b126a12407b5ce7137e9494374 = (function () {
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

// src/api/version.js
__e114dc9788d86bf6bce98549a964cc66 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = "0.13.2";
  
  return module.exports;
}).call(this);

// src/lifecycle/attribute.js
__3e5a047746044557f4a235875daca69d = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var data = _interopRequire(__fddcb3c02b4880b7bd627c13683f751e);
  
  module.exports = function (opts) {
    var callback = opts.attribute || function () {};
  
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
__2246bedffa3c6c358d1e7d4eefa41ff6 = (function () {
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
__3d21be0f26fe51bf369a576ea360130a = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var typeElement = _interopRequire(__defe6124e9b33e8efda86549fb8c3d4e);
  
  module.exports = {
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
    "extends": "",
  
    // The ID of the definition. This is automatically set in the `skate()`
    // function.
    id: "",
  
    // The special Skate properties to define.
    properties: {},
  
    // Properties and methods to add to each element.
    prototype: {},
  
    // The attribute name to add after calling the created() callback.
    resolvedAttribute: "resolved",
  
    // The template to replace the content of the element with.
    template: function template() {},
  
    // The type of bindings to allow.
    type: typeElement,
  
    // The attribute name to remove after calling the created() callback.
    unresolvedAttribute: "unresolved"
  };
  
  return module.exports;
}).call(this);

// src/lifecycle/detached.js
__9e5131b8efe6e3f893afb506c0e9f6dd = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var data = _interopRequire(__fddcb3c02b4880b7bd627c13683f751e);
  
  var registry = _interopRequire(__c5a0afa9d0578d167d0227b32abc8a92);
  
  var walkTree = _interopRequire(__e2f97b0e142d4a2a3414fbe5e42af13c);
  
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
  
      if (info.detached) return;
      info.detached = true;
      info.attached = false;
  
      callDetachedOnDescendants(this, opts.id);
      opts.detached.call(this);
    };
  };
  
  return module.exports;
}).call(this);

// src/global/document-observer.js
__642b6fb02cb7b38d92af73ced537a047 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var attached = _interopRequire(__d3cc4f73de07fed8af79602fe760a6bc);
  
  var created = _interopRequire(__54c1621d9a7829fe88fdc4b9d3386051);
  
  var detached = _interopRequire(__9e5131b8efe6e3f893afb506c0e9f6dd);
  
  var globals = _interopRequire(__6445636516e326f883c0d0977f200342);
  
  var ignored = _interopRequire(__bb3ef9633325c0145428d55035ddc402);
  
  var registry = _interopRequire(__c5a0afa9d0578d167d0227b32abc8a92);
  
  var walkTree = _interopRequire(__e2f97b0e142d4a2a3414fbe5e42af13c);
  
  var DocumentFragment = window.DocumentFragment;
  var MutationObserver = window.MutationObserver || window.SkateMutationObserver;
  
  function getClosestIgnoredElement(element) {
    var parent = element;
    while (parent && parent !== document && !(parent instanceof DocumentFragment)) {
      if (ignored(parent)) {
        return parent;
      }
      parent = parent.parentNode;
    }
  }
  
  function triggerAddedNodes(addedNodes) {
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
  
  function triggerRemovedNodes(removedNodes) {
    walkTree(removedNodes, function (element) {
      var components = registry.find(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        detached(components[a]).call(element);
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
  
  module.exports = globals.registerIfNotExists("observer", {
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
  
  return module.exports;
}).call(this);

// src/util/element-constructor.js
__020e3776f97f5a9923591b66949769d9 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  module.exports = function (opts) {
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
    Object.defineProperty(CustomElement.prototype, "constructor", {
      enumerable: false,
      value: CustomElement
    });
  
    return CustomElement;
  };
  
  return module.exports;
}).call(this);

// src/support/custom-elements.js
__7a36184f760d61c8bc3f16577d94b0b9 = (function () {
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
__be9e5f0e8117957ab7b1f3806c43c773 = (function () {
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
__eeb207d478d1ed06f9c138dd4b3ad0f1 = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var apiCreate = _interopRequire(__f6f65a565c709b69651c25a4f54ac7f4);
  
  var apiEmit = _interopRequire(__0c127fafef24938352a5d4a34240ab22);
  
  var apiInit = _interopRequire(__295960f0bb6206a012930328aa94c78e);
  
  var apiNoConflict = _interopRequire(__cedb77b126a12407b5ce7137e9494374);
  
  var apiVersion = _interopRequire(__e114dc9788d86bf6bce98549a964cc66);
  
  var assign = _interopRequire(__1d39a4f1c887ce649ab75b6b1f153962);
  
  var assignSafe = _interopRequire(__88fe330eb212bd3871a091e9e1e4ec88);
  
  var attached = _interopRequire(__d3cc4f73de07fed8af79602fe760a6bc);
  
  var attribute = _interopRequire(__3e5a047746044557f4a235875daca69d);
  
  var created = _interopRequire(__54c1621d9a7829fe88fdc4b9d3386051);
  
  var debounce = _interopRequire(__2246bedffa3c6c358d1e7d4eefa41ff6);
  
  var defaults = _interopRequire(__3d21be0f26fe51bf369a576ea360130a);
  
  var detached = _interopRequire(__9e5131b8efe6e3f893afb506c0e9f6dd);
  
  var documentObserver = _interopRequire(__642b6fb02cb7b38d92af73ced537a047);
  
  var elementConstructor = _interopRequire(__020e3776f97f5a9923591b66949769d9);
  
  var registry = _interopRequire(__c5a0afa9d0578d167d0227b32abc8a92);
  
  var supportsCustomElements = _interopRequire(__7a36184f760d61c8bc3f16577d94b0b9);
  
  var typeElement = _interopRequire(__defe6124e9b33e8efda86549fb8c3d4e);
  
  var utilWalkTree = _interopRequire(__e2f97b0e142d4a2a3414fbe5e42af13c);
  
  var validCustomElement = _interopRequire(__be9e5f0e8117957ab7b1f3806c43c773);
  
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
  
  var HTMLElement = window.HTMLElement;
  var initDocument = debounce(function () {
    utilWalkTree(document.documentElement.childNodes, function (element) {
      var components = registry.find(element);
      var componentsLength = components.length;
  
      for (var a = 0; a < componentsLength; a++) {
        created(components[a]).call(element);
      }
  
      for (var a = 0; a < componentsLength; a++) {
        attached(components[a]).call(element);
      }
    });
  });
  
  function skate(id, userOptions) {
    var Ctor, CtorParent, isNative;
    var opts = makeOptions(userOptions);
  
    CtorParent = opts["extends"] ? document.createElement(opts["extends"]).constructor : HTMLElement;
    isNative = opts.type === typeElement && supportsCustomElements() && validCustomElement(id);
  
    // Inherit from parent prototype.
    if (!CtorParent.prototype.isPrototypeOf(opts.prototype)) {
      opts.prototype = assignSafe(Object.create(CtorParent.prototype), opts.prototype);
    }
  
    // Native doesn't like if you pass a falsy value. Must be undefined.
    opts["extends"] = opts["extends"] || undefined;
  
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
      initDocument();
      documentObserver.register();
    }
  
    Ctor = makeNonNewableWrapper(Ctor);
    assignSafe(Ctor, opts);
    registry.set(id, Ctor);
  
    return Ctor;
  }
  
  skate.create = apiCreate;
  skate.emit = apiEmit;
  skate.init = apiInit;
  skate.noConflict = apiNoConflict;
  skate.version = apiVersion;
  
  // ES6
  module.exports = skate;
  
  return module.exports;
}).call(this);

// src/global.js
__6f1e0a99f09eeb789067ebb09baea08b = (function () {
  var module = {
    exports: {}
  };
  var exports = module.exports;
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var skate = _interopRequire(__eeb207d478d1ed06f9c138dd4b3ad0f1);
  
  window.skate = skate;
  
  return module.exports;
}).call(this);