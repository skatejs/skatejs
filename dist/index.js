(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.skatejs = factory());
}(this, function () {

	function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports), module.exports; }

	var index = __commonjs(function (module) {
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

	var assign = (index && typeof index === 'object' && 'default' in index ? index['default'] : index);

	// Just in case native document.createElement() was overridden, we ensure we're
	// using the native one so that we're not bogged down by any polyfills.
	var createElement = Document.prototype.createElement.bind(document);

	var _document = document;
	var body = _document.body;
	var head = _document.head;

	var elementPrototype = window.HTMLElement.prototype;
	var elementPrototypeContains = elementPrototype.contains;

	function utilElementContains (source, target) {
	  // The document element does not have the contains method in IE.
	  if (source === document && !source.contains) {
	    return head.contains(target) || body.contains(target);
	  }
	  return source.contains ? source.contains(target) : elementPrototypeContains.call(source, target);
	}

	var definitions = {};
	var map = [];
	var types = [];
	var hasOwn = Object.prototype.hasOwnProperty;

	var registry = {
	  get: function get(name) {
	    return hasOwn.call(definitions, name) && definitions[name];
	  },
	  set: function set(name, Ctor) {
	    if (this.get(name)) {
	      throw new Error("A Skate component with the name of \"" + name + "\" already exists.");
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
	    var typesLength = types.length;
	    for (var a = 0; a < typesLength; a++) {
	      var reduced = types[a].reduce(elem, map[a]);
	      if (reduced) {
	        return reduced;
	      }
	    }
	  }
	};

	function ignored (element) {
	  var attrs = element.attributes;
	  return attrs && !!attrs['data-skate-ignore'];
	}

	var Node = window.Node;

	function walk(elem, fn) {
	  if (elem.nodeType !== Node.ELEMENT_NODE || ignored(elem)) {
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

	function walkTree (elems, fn) {
	  if (!elems) {
	    return;
	  }

	  if (elems instanceof Node) {
	    elems = [elems];
	  }

	  for (var a = 0; a < elems.length; a++) {
	    walk(elems[a], fn);
	  }
	}

	function init () {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  args.forEach(function (arg) {
	    var isInDom = utilElementContains(document, arg);
	    walkTree(arg, function (descendant) {
	      var component = registry.find(descendant);
	      if (component && !component.isNative) {
	        if (component.prototype.createdCallback) {
	          component.prototype.createdCallback.call(descendant);
	        }

	        if (isInDom && component.prototype.attachedCallback) {
	          isInDom && component.prototype.attachedCallback.call(descendant);
	        }
	      }
	    });
	  });
	}

	function apiCreate (name, props) {
	  var Ctor = registry.get(name);
	  var elem = Ctor ? Ctor.type.create(Ctor) : createElement(name);
	  Ctor && init(elem);
	  return assign(elem, props);
	}

	var createEvent = Document.prototype.createEvent.bind(document);

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

	function createCustomEvent(name) {
	  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  if (CustomEvent) {
	    return new CustomEvent(name, opts);
	  }

	  var e = createEvent('CustomEvent');
	  e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
	  return e;
	}

	function dispatch(elem, cEvent) {
	  if (!elem.disabled) {
	    return elem.dispatchEvent(cEvent);
	  }
	  cEvent.isPropagationStopped = true;
	}

	var hasBubbleOnDetachedElements = function () {
	  var parent = createElement('div');
	  var child = createElement('div');
	  var hasBubbleOnDetachedElements = false;
	  parent.appendChild(child);
	  parent.addEventListener('test', function () {
	    return hasBubbleOnDetachedElements = true;
	  });
	  child.dispatchEvent(createCustomEvent('test', { bubbles: true }));
	  return hasBubbleOnDetachedElements;
	}();

	function createReadableStopPropagation(oldStopPropagation) {
	  return function () {
	    this.isPropagationStopped = true;
	    oldStopPropagation.call(this);
	  };
	}

	function simulateBubbling(elem, cEvent) {
	  var didPreventDefault = void 0;
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
	  shouldSimulateBubbling = opts.bubbles && !hasBubbleOnDetachedElements && !utilElementContains(document, elem);

	  return shouldSimulateBubbling ? simulateBubbling(elem, cEvent) : dispatch(elem, cEvent);
	}

	function emit (elem, name) {
	  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var names = typeof name === 'string' ? name.split(' ') : name;
	  return names.reduce(function (prev, curr) {
	    if (emitOne(elem, curr, opts) === false) {
	      prev.push(curr);
	    }
	    return prev;
	  }, []);
	}

	var createDocumentFragment = Document.prototype.createDocumentFragment.bind(document);

	var _window = window;
	var Node$1 = _window.Node;
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
	  var container = createElement('div');
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
	    } else if (node instanceof Node$1) {
	      init(node);
	    }

	    if (node) {
	      frag.appendChild(node);
	    }

	    return frag;
	  }, createDocumentFragment());
	}

	var boolean = {
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

	function empty (val) {
	  return typeof val === 'undefined' || val === null;
	}

	var alwaysUndefinedIfEmpty = function alwaysUndefinedIfEmpty(val) {
	  return empty(val) ? undefined : Number(val);
	};

	var number = {
	  coerce: alwaysUndefinedIfEmpty,
	  deserialize: alwaysUndefinedIfEmpty,
	  serialize: alwaysUndefinedIfEmpty
	};

	var alwaysUndefinedIfEmpty$1 = function alwaysUndefinedIfEmpty(val) {
	  return empty(val) ? undefined : String(val);
	};

	var string = {
	  coerce: alwaysUndefinedIfEmpty$1,
	  deserialize: alwaysUndefinedIfEmpty$1,
	  serialize: alwaysUndefinedIfEmpty$1
	};

	function prop(def) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    args.unshift({}, def);
	    return assign.apply(null, args);
	  };
	}

	var apiProperties = {
	  boolean: prop(boolean),
	  number: prop(number),
	  string: prop(string)
	};

	function data (element) {
	  var namespace = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	  var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
	  return namespace && (data[namespace] || (data[namespace] = {})) || data;
	}

	function ready(element) {
	  var component = registry.find(element);
	  return component && data(element).created;
	}

	function apiReady (elements, callback) {
	  var collection = elements.length === undefined ? [elements] : elements;
	  var collectionLength = collection.length;
	  var readyCount = 0;

	  function callbackIfReady() {
	    ++readyCount;
	    if (readyCount === collectionLength) {
	      callback(elements);
	    }
	  }

	  for (var a = 0; a < collectionLength; a++) {
	    var elem = collection[a];

	    if (ready(elem)) {
	      callbackIfReady();
	    } else {
	      var info = data(elem);
	      if (info.readyCallbacks) {
	        info.readyCallbacks.push(callbackIfReady);
	      } else {
	        info.readyCallbacks = [callbackIfReady];
	      }
	    }
	  }
	}

	function apiRender (elem) {
	  var component = registry.find(elem);
	  if (component && component.render) {
	    component.render(elem);
	  }
	}

	var apiVersion = '0.15.3';

	function attached (opts) {
	  var attached = opts.attached;

	  return attached ? function () {
	    var info = data(this);
	    if (info.attached) return;
	    info.attached = true;
	    info.detached = false;
	    attached(this);
	  } : undefined;
	}

	function attribute (opts) {
	  var attribute = opts.attribute;


	  if (typeof attribute !== 'function') {
	    return;
	  }

	  return function (name, oldValue, newValue) {
	    attribute(this, {
	      name: name,
	      newValue: newValue === null ? undefined : newValue,
	      oldValue: oldValue === null ? undefined : oldValue
	    });
	  };
	}

	var elProto = window.HTMLElement.prototype;
	var nativeMatchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;

	// Only IE9 has this msMatchesSelector bug, but best to detect it.
	var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call(createElement('div'), 'div');

	function matches (element, selector) {
	  if (hasNativeMatchesSelectorDetattachedBug) {
	    var clone = element.cloneNode();
	    createElement('div').appendChild(clone);
	    return nativeMatchesSelector.call(clone, selector);
	  }
	  return nativeMatchesSelector.call(element, selector);
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
	  var indexOfSpace = e.indexOf(' ');
	  var hasSpace = indexOfSpace > 0;
	  var name = hasSpace ? e.substring(0, indexOfSpace) : e;
	  var selector = hasSpace ? e.substring(indexOfSpace + 1) : '';
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
	  var events = opts.events || {};
	  return function (elem) {
	    for (var name in events) {
	      bindEvent(elem, name, events[name].bind(elem));
	    }
	  };
	}

	function patchAttributeMethods(elem) {
	  var removeAttribute = elem.removeAttribute;
	  var setAttribute = elem.setAttribute;


	  elem.removeAttribute = function (name) {
	    var oldValue = this.getAttribute(name);
	    removeAttribute.call(elem, name);
	    if (elem.attributeChangedCallback) {
	      elem.attributeChangedCallback(name, oldValue, null);
	    }
	  };

	  elem.setAttribute = function (name, newValue) {
	    var oldValue = this.getAttribute(name);
	    setAttribute.call(elem, name, newValue);
	    if (elem.attributeChangedCallback) {
	      elem.attributeChangedCallback(name, oldValue, String(newValue));
	    }
	  };
	}

	function dashCase (str) {
	  return str.split(/([A-Z])/).reduce(function (one, two, idx) {
	    var dash = !one || idx % 2 === 0 ? '' : '-';
	    return '' + one + dash + two.toLowerCase();
	  });
	}

	var _window$Element$proto = window.Element.prototype;
	var removeAttribute = _window$Element$proto.removeAttribute;
	var setAttribute = _window$Element$proto.setAttribute;


	function getData(elem, name) {
	  return data(elem, 'api/property/' + name);
	}

	function getDataForAttribute(elem, name) {
	  return getData(elem, getData(elem, name).linkedProperty);
	}

	function getLinkedAttribute(name, attr) {
	  return attr === true ? dashCase(name) : attr;
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

	    if (typeof opts.default === 'function') {
	      info.defaultValue = opts.default(elem, { name: name });
	    } else if (!empty(opts.default)) {
	      info.defaultValue = opts.default;
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

	          if (empty(serializedValue)) {
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
	    if (empty(initialValue)) {
	      if (info.linkedAttribute && elem.hasAttribute(info.linkedAttribute)) {
	        initialValue = opts.deserialize(elem.getAttribute(info.linkedAttribute));
	      } else {
	        initialValue = info.defaultValue;
	      }
	    }

	    // We must coerce the initial value just in case it wasn't already.
	    var internalValue = info.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;

	    // User-defined created callback.
	    if (typeof opts.created === 'function') {
	      opts.created(elem, { name: name, internalValue: internalValue });
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

	  prop.initial = function (elem) {
	    return typeof opts.initial === 'function' ? opts.initial(elem, { name: name }) : elem[name];
	  };

	  prop.ready = function (elem) {
	    var initial = getData(elem, name).internalValue;
	    elem[name] = empty(initial) ? this.initial(elem) : initial;
	  };

	  prop.set = function (newValue) {
	    var info = getData(this, name);
	    var oldValue = info.oldValue;

	    if (info.updatingProperty) {
	      return;
	    }

	    info.updatingProperty = true;

	    if (empty(newValue)) {
	      newValue = info.defaultValue;
	    }

	    if (typeof opts.coerce === 'function') {
	      newValue = opts.coerce(newValue);
	    }

	    var propertyHasChanged = newValue !== oldValue;
	    if (propertyHasChanged && opts.event) {
	      var cancelledEvents = emit(this, String(opts.event), {
	        bubbles: false,
	        cancelable: true,
	        detail: { name: name, oldValue: oldValue, newValue: newValue }
	      });

	      if (cancelledEvents.length > 0) {
	        return;
	      }
	    }

	    info.internalValue = newValue;

	    if (info.linkedAttribute && !info.updatingAttribute) {
	      var serializedValue = opts.serialize(newValue);
	      if (empty(serializedValue)) {
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

	function propertiesInit (opts) {
	  opts = opts || {};

	  if (typeof opts === 'function') {
	    opts = { coerce: opts };
	  }

	  return function (name) {
	    return createNativePropertyDefinition(name, assign({
	      deserialize: function deserialize(value) {
	        return value;
	      },
	      serialize: function serialize(value) {
	        return value;
	      }
	    }, opts));
	  };
	}

	function propertiesApply(elem, properties) {
	  Object.keys(properties).forEach(function (name) {
	    var prop = properties[name];
	    var initialValue = prop.initial(elem);

	    // https://bugs.webkit.org/show_bug.cgi?id=49739
	    //
	    // When Webkit fixes that bug so that native property accessors can be
	    // retrieved, we can move defining the property to the prototype and away
	    // from having to do if for every instance as all other browsers support
	    // this.
	    Object.defineProperty(elem, name, prop);

	    // This will still be needed to do any setup for the property if it needs
	    // any information from the element.
	    //
	    // Once that bug is fixed, the initial value being passed as the second
	    // argument to prop.created() can use the overridden property definition to
	    // get the initial value.
	    prop.created(elem, initialValue);
	  });
	}

	function propertiesApply$1(elem, properties) {
	  Object.keys(properties).forEach(function (name) {
	    properties[name].ready(elem);
	  });
	}

	function protos (proto) {
	  var chains = [];
	  while (proto) {
	    chains.push(proto);
	    proto = Object.getPrototypeOf(proto);
	  }
	  chains.reverse();
	  return chains;
	}

	function utilDefineProperties (obj, props) {
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
	}

	function getOwnPropertyDescriptors (obj) {
	  return Object.getOwnPropertyNames(obj).reduce(function (prev, curr) {
	    prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
	    return prev;
	  }, {});
	}

	function prototype(opts) {
	  var prototypes = protos(opts.prototype);
	  return function (elem) {
	    prototypes.forEach(function (proto) {
	      if (!proto.isPrototypeOf(elem)) {
	        utilDefineProperties(elem, getOwnPropertyDescriptors(proto));
	      }
	    });
	  };
	}

	function resolve(elem, opts) {
	  elem.removeAttribute(opts.unresolvedAttribute);
	  elem.setAttribute(opts.resolvedAttribute, '');
	}

	// TODO Remove this when we no longer support the legacy definitions and only
	// support a superset of a native property definition.
	function ensurePropertyFunctions(opts) {
	  var properties = opts.properties;
	  var names = Object.keys(properties || {});
	  return names.reduce(function (descriptors, descriptorName) {
	    descriptors[descriptorName] = opts.properties[descriptorName];
	    if (typeof descriptors[descriptorName] !== 'function') {
	      descriptors[descriptorName] = propertiesInit(descriptors[descriptorName]);
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

	function created (opts) {
	  var attribute = opts.attribute;
	  var created = opts.created;
	  var events$$ = opts.events;
	  var isNative = opts.isNative;
	  var properties = opts.properties;
	  var prototype$$ = opts.prototype;
	  var ready = opts.ready;
	  var render = opts.render;
	  var resolvedAttribute = opts.resolvedAttribute;

	  var applyEvents = events(opts);
	  var applyPrototype = prototype(opts);
	  var propertyFunctions = ensurePropertyFunctions(opts);

	  // Performance critical code!
	  return function () {
	    var info = data(this);
	    var resolved = this.hasAttribute(resolvedAttribute);
	    var propertyDefinitions = properties ? ensurePropertyDefinitions(this, propertyFunctions) : null;
	    var readyCallbacks = info.readyCallbacks;

	    if (info.created) {
	      return;
	    }

	    info.created = true;

	    if (!isNative) {
	      if (attribute) {
	        patchAttributeMethods(this);
	      }

	      if (prototype$$) {
	        applyPrototype(this);
	      }
	    }

	    if (propertyDefinitions) {
	      propertiesApply(this, propertyDefinitions);
	    }

	    if (events$$) {
	      applyEvents(this);
	    }

	    if (created) {
	      created(this);
	    }

	    if (render && !resolved) {
	      render(this);
	    }

	    if (propertyDefinitions) {
	      propertiesApply$1(this, propertyDefinitions);
	    }

	    if (ready) {
	      ready(this);
	    }

	    if (readyCallbacks) {
	      readyCallbacks.forEach(function (cb) {
	        return cb();
	      });
	      info.readyCallbacks = null;
	    }

	    if (!resolved) {
	      resolve(this, opts);
	    }
	  };
	}

	var re = Document.prototype.registerElement;
	var registerElement = re && re.bind(document);

	var reservedNames = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];
	var customElementCriteria = ['contain at least one dash', 'not start with a dash', 'not be one of: ' + reservedNames.join(', ')];

	var type = {
	  create: function create(Ctor) {
	    var elem = Ctor.extends ? createElement(Ctor.extends, Ctor.id) : createElement(Ctor.id);
	    if (!Ctor.isNative && Ctor.extends) {
	      elem.setAttribute('is', Ctor.id);
	    }
	    return elem;
	  },
	  reduce: function reduce(elem, defs) {
	    var tagName = elem.tagName;
	    var tagNameLc = tagName && tagName.toLowerCase();
	    if (tagNameLc in defs) {
	      return defs[tagNameLc];
	    }

	    var attributes = elem.attributes;
	    var isAttributeNode = attributes && attributes.is;
	    var isAttributeValue = isAttributeNode && isAttributeNode.value;
	    if (isAttributeValue in defs) {
	      return defs[isAttributeValue];
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
	      registerElement(name, nativeDefinition);
	    }
	  }
	};

	var nope = null;

	var defaults = {
	  attached: nope,
	  attribute: nope,
	  created: nope,
	  render: nope,
	  detached: nope,
	  events: nope,
	  extends: nope,
	  properties: nope,
	  prototype: {},
	  resolvedAttribute: 'resolved',
	  ready: nope,
	  type: type,
	  unresolvedAttribute: 'unresolved'
	};

	function detached (opts) {
	  var detached = opts.detached;

	  return detached ? function () {
	    var info = data(this);
	    if (info.detached) return;
	    info.detached = true;
	    info.attached = false;
	    detached(this);
	  } : undefined;
	}

	var isIeUntil10 = /MSIE/.test(navigator.userAgent);
	var isIe11 = /Trident/.test(navigator.userAgent);
	var isIe = isIeUntil10 || isIe11;
	var elementPrototype$1 = window.HTMLElement.prototype;

	// ! This walkTree method differs from the implementation in ../../utils/walk-tree
	// It invokes the callback only for the children, not the passed node and the second parameter to the callback is the parent node
	function walkTree$1(node, cb) {
	  var childNodes = node.childNodes;

	  if (!childNodes) {
	    return;
	  }

	  var childNodesLen = childNodes.length;

	  for (var a = 0; a < childNodesLen; a++) {
	    var childNode = childNodes[a];
	    cb(childNode, node);
	    walkTree$1(childNode, cb);
	  }
	}

	function fixInnerHTML() {
	  var originalInnerHTML = Object.getOwnPropertyDescriptor(elementPrototype$1, 'innerHTML');

	  var get = function get() {
	    return originalInnerHTML.get.call(this);
	  };
	  get._hasBeenEnhanced = true;

	  // This redefines the innerHTML property so that we can ensure that events
	  // are properly triggered.
	  Object.defineProperty(elementPrototype$1, 'innerHTML', {
	    get: get,
	    set: function set(html) {
	      walkTree$1(this, function (node, parentNode) {
	        var mutationEvent = createEvent('MutationEvent');
	        mutationEvent.initMutationEvent('DOMNodeRemoved', true, false, parentNode, null, null, null, null);
	        node.dispatchEvent(mutationEvent);
	      });
	      originalInnerHTML.set.call(this, html);
	    }
	  });
	}

	if (isIe) {
	  // IE 9-11
	  var propertyDescriptor = Object.getOwnPropertyDescriptor(elementPrototype$1, 'innerHTML');
	  var hasBeenEnhanced = !!propertyDescriptor && propertyDescriptor.get._hasBeenEnhanced;

	  if (!hasBeenEnhanced) {
	    if (isIe11) {
	      // IE11's native MutationObserver needs some help as well :()
	      window.MutationObserver = window.JsMutationObserver || window.MutationObserver;
	    }

	    fixInnerHTML();
	  }
	}

	var _window$1 = window;
	var Element = _window$1.Element;


	function getClosestIgnoredElement (element) {
	  var parent = element;
	  while (parent instanceof Element) {
	    if (ignored(parent)) {
	      return parent;
	    }
	    parent = parent.parentNode;
	  }
	}

	function triggerAddedNodes(addedNodes) {
	  walkTree(addedNodes, function (element) {
	    var component = registry.find(element);
	    if (component) {
	      if (component.prototype.createdCallback) {
	        component.prototype.createdCallback.call(element);
	      }

	      if (component.prototype.attachedCallback) {
	        component.prototype.attachedCallback.call(element);
	      }
	    }
	  });
	}

	function triggerRemovedNodes(removedNodes) {
	  walkTree(removedNodes, function (element) {
	    var component = registry.find(element);
	    if (component && component.prototype.detachedCallback) {
	      component.prototype.detachedCallback.call(element);
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

	var documentObserver = {
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
	};

	function utilGetAllPropertyDescriptors (obj) {
	  return protos(obj).reduce(function (result, proto) {
	    var descriptors = getOwnPropertyDescriptors(proto);
	    Object.getOwnPropertyNames(descriptors).reduce(function (result, name) {
	      result[name] = descriptors[name];
	      return result;
	    }, result);
	    return result;
	  }, {});
	}

	function utilDebounce (fn) {
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
	}

	var HTMLElement = window.HTMLElement;

	// A function that initialises the document once in a given event loop.
	var initDocument = utilDebounce(function () {
	  walkTree(document.documentElement.childNodes, function (element) {
	    var component = registry.find(element);
	    if (component) {
	      if (component.prototype.createdCallback) {
	        component.prototype.createdCallback.call(element);
	      }

	      if (component.prototype.attachedCallback) {
	        component.prototype.attachedCallback.call(element);
	      }
	    }
	  });
	});

	// Creates a configurable, non-writable, non-enumerable property.
	function fixedProp(obj, name, value) {
	  Object.defineProperty(obj, name, {
	    configurable: true,
	    enumerable: false,
	    value: value,
	    writable: false
	  });
	}

	// Makes a function / constructor that can be called as either.
	function makeCtor(name, opts) {
	  var func = apiCreate.bind(null, name);

	  // Assigning defaults gives a predictable definition and prevents us from
	  // having to do defaults checks everywhere.
	  assign(func, defaults);

	  // Inherit all options. This takes into account object literals as well as
	  // ES2015 classes that may have inherited static props which would not be
	  // considered "own".
	  utilDefineProperties(func, utilGetAllPropertyDescriptors(opts));

	  // Fixed info.
	  fixedProp(func.prototype, 'constructor', func);
	  fixedProp(func, 'id', name);
	  fixedProp(func, 'isNative', func.type === type && registerElement);

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

	  // If the options don't inherit a native element prototype, we ensure it does
	  // because native requires you explicitly do this. Here we solve the common
	  // use case by defaulting to HTMLElement.prototype.
	  if (!HTMLElement.prototype.isPrototypeOf(Ctor.prototype) && !SVGElement.prototype.isPrototypeOf(Ctor.prototype)) {
	    var proto = (Ctor.extends ? createElement(Ctor.extends).constructor : HTMLElement).prototype;
	    Ctor.prototype = Object.create(proto, getOwnPropertyDescriptors(Ctor.prototype));
	  }

	  // We not assign native callbacks to handle the callbacks specified in the
	  // Skate definition. This allows us to abstract away any changes that may
	  // occur in the spec.
	  Ctor.prototype.createdCallback = created(Ctor);
	  Ctor.prototype.attachedCallback = attached(Ctor);
	  Ctor.prototype.detachedCallback = detached(Ctor);
	  Ctor.prototype.attributeChangedCallback = attribute(Ctor);

	  // In polyfill land we must emulate what the browser would normally do in
	  // native.
	  if (!Ctor.isNative) {
	    initDocument();
	    documentObserver.register();
	  }

	  // Call register hook. We could put this in the registry, but since the
	  // registry is shared across versions, we try and churn that as little as
	  // possible. It's fine here for now.
	  var type = Ctor.type;
	  if (type.register) {
	    type.register(Ctor);
	  }

	  // We keep our own registry since we can't access the native one.
	  return registry.set(name, Ctor);
	}

	// Public API.
	skate.create = apiCreate;
	skate.emit = emit;
	skate.fragment = fragment;
	skate.init = init;
	skate.properties = apiProperties;
	skate.ready = apiReady;
	skate.render = apiRender;
	skate.version = apiVersion;

	var previousGlobal = window.skate;
	skate.noConflict = function noConflict() {
	  window.skate = previousGlobal;
	  return this;
	};
	window.skate = skate;

	return skate;

}));
//# sourceMappingURL=index.js.map