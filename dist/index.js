(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.skate = global.skate || {})));
}(this, function (exports) {

	var babelHelpers = {};
	babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	};

	babelHelpers.defineProperty = function (obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

	babelHelpers;


	function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports), module.exports; }

	var index = __commonjs(function (module) {
	'use strict';
	/* eslint-disable no-unused-vars */

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc'); // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
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

	var reservedNames = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];
	var customElementCriteria = ['contain at least one dash', 'not start with a dash', 'not be one of: ' + reservedNames.join(', ')];
	var definitions = {};

	var customElements = window.customElements || {
	  define: function define(name, Ctor) {
	    if (definitions[name]) {
	      throw new Error('A Skate component with the name of "' + name + '" already exists.');
	    }

	    // Screen non-native names and try and be more helpful than native.
	    if (name.indexOf('-') < 1 || reservedNames.indexOf(name) > -1) {
	      throw new Error(name + ' is not a valid custom element name. A custom element name must: ' + customElementCriteria.map(function (a) {
	        return '\n- ' + a;
	      }).join(''));
	    }

	    // Support legacy Blink.
	    if (document.registerElement) {
	      // Blink is picky about options.
	      var nativeDefinition = { prototype: Ctor.prototype };

	      // Only set extends if the user specified it otherwise Blink complains
	      // even if it's null.
	      if (Ctor.extends) {
	        nativeDefinition.extends = Ctor.extends;
	      }

	      document.registerElement(name, nativeDefinition);
	    }

	    // Actually register.
	    definitions[name] = Ctor;
	  },
	  get: function get(name) {
	    return definitions[name];
	  }
	};

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

	function findElementInRegistry (elem) {
	  var tagName = elem.tagName;

	  if (!tagName) {
	    return;
	  }

	  var tagNameLc = tagName.toLowerCase();
	  var tagNameDefinition = customElements.get(tagNameLc);

	  if (tagNameDefinition) {
	    return tagNameDefinition;
	  }

	  var isAttribute = elem.getAttribute('is');
	  var isAttributeDefinition = customElements.get(isAttribute);

	  if (isAttributeDefinition && isAttributeDefinition.extends === tagNameLc) {
	    return isAttributeDefinition;
	  }
	}

	var v0 = !!document.registerElement;
	var v1 = !!window.customElements;
	var polyfilled = !v0 && !v1;
	var shadowDomV0 = !!('createShadowRoot' in Element.prototype);
	var shadowDomV1 = !!('attachShadow' in Element.prototype);

	var support = {
	  v0: v0,
	  v1: v1,
	  polyfilled: polyfilled,
	  shadowDomV0: shadowDomV0,
	  shadowDomV1: shadowDomV1
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
	  if (!support.polyfilled) {
	    return;
	  }

	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  args.forEach(function (arg) {
	    var isInDom = utilElementContains(document, arg);

	    walkTree(arg, function (descendant) {
	      var component = findElementInRegistry(descendant);

	      if (component) {
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

	function create (name, props) {
	  var elem = void 0;
	  var Ctor = customElements.get(name);

	  if (Ctor) {
	    if (support.v1) {
	      elem = document.createElement(name, { is: Ctor.extends || null });
	    } else if (support.v0) {
	      elem = Ctor.extends ? document.createElement(Ctor.extends, name) : document.createElement(name);
	    } else {
	      if (Ctor.extends) {
	        elem = document.createElement(Ctor.extends);
	        elem.setAttribute('is', name);
	      } else {
	        elem = document.createElement(name);
	      }
	      init(elem);
	    }
	  } else {
	    elem = document.createElement(name);
	  }

	  return assign(elem, props);
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

	function createCustomEvent(name) {
	  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  if (CustomEvent) {
	    return new CustomEvent(name, opts);
	  }

	  var e = document.createEvent('CustomEvent');
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
	  var parent = document.createElement('div');
	  var child = document.createElement('div');
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
	    Object.defineProperty(cEvent, 'currentTarget', {
	      configurable: true,
	      get: function get() {
	        return currentElem;
	      }
	    });
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

	function data (element) {
	  var namespace = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	  var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
	  return namespace && (data[namespace] || (data[namespace] = {})) || data;
	}

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

	var isCustomElementsV0 = support.v0;
	var isCustomElementsV1 = support.v1;

	function attribute (Ctor) {
	  var attributeChanged = Ctor.attributeChanged;
	  var observedAttributes = Ctor.observedAttributes;


	  return function (name, oldValue, newValue) {
	    var elemData = data(this);

	    // Chrome legacy custom elements batch attribute changes in a microtask so
	    // so we have to tell it to emulate v1 behaviour by setting a unique
	    // unique attribute.
	    if (isCustomElementsV0 && name === '____can_start_triggering_now') {
	      elemData.canStartTriggeringNow = true;
	      return;
	    }

	    // We prevent legacy Chrome from ever triggering a change unless it's been
	    // flagged to do so using the unique attribute or explicitly told that it
	    // can via the property data.
	    if (isCustomElementsV0 && !elemData.canStartTriggeringNow) {
	      return;
	    }

	    // If native support for custom elements v1 exists, then it will natively
	    // do this check before calling the attributeChangedCallback.
	    if (!isCustomElementsV1 && observedAttributes.indexOf(name) === -1) {
	      return;
	    }

	    var propertyName = data(this, 'attributeLinks')[name];

	    if (propertyName) {
	      var propData = data(this, 'api/property/' + propertyName);

	      // This ensures a property set doesn't cause the attribute changed
	      // handler to run again once we set this flag. This only ever has a
	      // chance to run when you set an attribute, it then sets a property and
	      // then that causes the attribute to be set again.
	      if (propData.settingAttribute) {
	        return;
	      }

	      // Set this here so the next set to the attribute doesn't cause this
	      // handler to run a gain.
	      propData.settingAttribute = true;

	      // Sync up the property.
	      if (!propData.settingProperty) {
	        var propOpts = this.constructor.props[propertyName];
	        this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
	      }

	      // Allow this handler to run again.
	      propData.settingAttribute = false;
	    }

	    if (attributeChanged) {
	      attributeChanged(this, {
	        name: name,
	        newValue: newValue === null ? undefined : newValue,
	        oldValue: oldValue === null ? undefined : oldValue
	      });
	    }
	  };
	}

	var elProto = window.HTMLElement.prototype;
	var nativeMatchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;

	// Only IE9 has this msMatchesSelector bug, but best to detect it.
	var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call(document.createElement('div'), 'div');

	function matches (element, selector) {
	  if (hasNativeMatchesSelectorDetattachedBug) {
	    var clone = element.cloneNode();
	    document.createElement('div').appendChild(clone);
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
	        return handler(elem, e);
	      }
	      current = current.parentNode;
	    }
	  };
	}

	function makeNormalHandler(elem, handler) {
	  return function (e) {
	    readonly(e, 'delegateTarget', elem);
	    handler(elem, e);
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
	      bindEvent(elem, name, events[name]);
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

	var raf = window.requestAnimationFrame || setTimeout;
	function debounce (fn) {
	  var called = false;

	  return function () {
	    var _this = this;

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    if (!called) {
	      called = true;
	      raf(function () {
	        called = false;
	        fn.apply(_this, args);
	      });
	    }
	  };
	}

	function empty (val) {
	  return typeof val === 'undefined' || val === null;
	}

	// Symbol() wasn't transpiling properly.
	var $debounce = '____debouncedRender';

	function getDefaultValue(elem, name, opts) {
	  return typeof opts.default === 'function' ? opts.default(elem, { name: name }) : opts.default;
	}

	function getInitialValue(elem, name, opts) {
	  return typeof opts.initial === 'function' ? opts.initial(elem, { name: name }) : opts.initial;
	}

	function syncAttribute(elem, propertyName, attributeName, newValue, opts) {
	  if (!attributeName) {
	    return;
	  }

	  var serializedValue = opts.serialize(newValue);

	  if (empty(serializedValue)) {
	    elem.removeAttribute(attributeName);
	  } else {
	    elem.setAttribute(attributeName, serializedValue);
	  }
	}

	function createNativePropertyDefinition(name, opts) {
	  var prop = {
	    configurable: true,
	    enumerable: true
	  };

	  prop.created = function (elem) {
	    var propertyData = data(elem, 'api/property/' + name);
	    var attributeName = opts.attribute;
	    var initialValue = elem[name];

	    // Store property to attribute link information.
	    data(elem, 'attributeLinks')[attributeName] = name;
	    data(elem, 'propertyLinks')[name] = attributeName;

	    // Set up initial value if it wasn't specified.
	    if (empty(initialValue)) {
	      if (attributeName && elem.hasAttribute(attributeName)) {
	        initialValue = opts.deserialize(elem.getAttribute(attributeName));
	      } else if ('initial' in opts) {
	        initialValue = getInitialValue(elem, name, opts);
	      } else if ('default' in opts) {
	        initialValue = getDefaultValue(elem, name, opts);
	      }
	    }

	    // We must coerce the initial value just in case it wasn't already.
	    var internalValue = propertyData.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;

	    // Since the attribute handler sets the property if the property setting
	    // didn't invoke the attribute handler, we must ensure the property
	    // setter can't be invoked by the setting of the attribute here.
	    syncAttribute(elem, name, attributeName, internalValue, opts);
	  };

	  prop.get = function () {
	    var propertyData = data(this, 'api/property/' + name);
	    var internalValue = propertyData.internalValue;

	    if (typeof opts.get === 'function') {
	      return opts.get(this, { name: name, internalValue: internalValue });
	    }
	    return internalValue;
	  };

	  prop.render = function () {
	    var shouldUpdate = opts.render;
	    if (typeof shouldUpdate === 'undefined') {
	      return function (elem, data) {
	        return data.newValue !== data.oldValue;
	      };
	    }
	    if (typeof shouldUpdate === 'function') {
	      return shouldUpdate;
	    }
	    return function () {
	      return !!shouldUpdate;
	    };
	  }();

	  prop.set = function (newValue) {
	    var propData = data(this, 'api/property/' + name);

	    if (propData.settingProperty) {
	      return;
	    }

	    var attributeName = data(this, 'propertyLinks')[name];
	    var oldValue = propData.oldValue;


	    propData.settingProperty = true;

	    if (empty(newValue)) {
	      newValue = getDefaultValue(this, name, opts);
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
	        propData.settingProperty = false;
	        return;
	      }
	    }

	    propData.internalValue = newValue;
	    syncAttribute(this, name, attributeName, newValue, opts);

	    var changeData = { name: name, newValue: newValue, oldValue: oldValue };

	    if (typeof opts.set === 'function') {
	      opts.set(this, changeData);
	    }

	    // Re-render on property updates if the should-update check passes.
	    var hasRenderFn = this.constructor.render;
	    if (hasRenderFn && prop.render(this, changeData)) {
	      var deb = this[$debounce] || (this[$debounce] = debounce(this.constructor.renderer));
	      deb(this);
	    }

	    propData.settingProperty = false;
	    propData.oldValue = newValue;
	  };

	  return prop;
	}

	function propsInit (opts) {
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
	    var descriptor = Object.getOwnPropertyDescriptor(obj, name);
	    var isDinosaurBrowser = name !== 'arguments' && name !== 'caller' && 'value' in prop;
	    var isConfigurable = !descriptor || descriptor.configurable;
	    var isWritable = !descriptor || descriptor.writable;

	    if (isConfigurable) {
	      Object.defineProperty(obj, name, prop);
	    } else if (isDinosaurBrowser && isWritable) {
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

	var isPolyfilled = support.polyfilled;
	var isCustomElementsV0$1 = support.v0;
	var isCustomElementsV1$1 = support.v1;

	function ensurePropertyFunctions(opts) {
	  var props = opts.props;
	  var names = Object.keys(props || {});
	  return names.reduce(function (descriptors, descriptorName) {
	    descriptors[descriptorName] = props[descriptorName];
	    if (typeof descriptors[descriptorName] !== 'function') {
	      descriptors[descriptorName] = propsInit(descriptors[descriptorName]);
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

	function callAttributeChangedForEachAttribute(elem, observedAttributes) {
	  observedAttributes.forEach(function (name) {
	    var attr = elem.attributes[name];

	    // We don't call it for the defined attribute because that will have
	    // already called the handler via setAttribute().
	    if (attr) {
	      elem.attributeChangedCallback(name, null, attr.value);
	    }
	  });
	}

	function initialiseProps(elem, propertyDefinitions) {
	  Object.keys(propertyDefinitions).forEach(function (name) {
	    var prop = propertyDefinitions[name];
	    prop.created(elem);

	    // https://bugs.webkit.org/show_bug.cgi?id=49739
	    //
	    // When Webkit fixes that bug so that native property accessors can be
	    // retrieved, we can move defining the property to the prototype and away
	    // from having to do if for every instance as all other browsers support
	    // this.
	    Object.defineProperty(elem, name, prop);
	  });
	}

	function created (opts) {
	  var created = opts.created;
	  var definedAttribute = opts.definedAttribute;
	  var events$$ = opts.events;
	  var observedAttributes = opts.observedAttributes;
	  var props = opts.props;
	  var prototype$$ = opts.prototype;
	  var ready = opts.ready;
	  var renderer = opts.renderer;
	  var renderedAttribute = opts.renderedAttribute;

	  var applyEvents = events(opts);
	  var applyPrototype = prototype(opts);
	  var propertyFunctions = ensurePropertyFunctions(opts);

	  // Performance critical code!
	  return function () {
	    var elemData = data(this);
	    var propertyDefinitions = props ? ensurePropertyDefinitions(this, propertyFunctions) : null;
	    var readyCallbacks = elemData.readyCallbacks;

	    if (elemData.created) {
	      return;
	    }

	    elemData.created = true;

	    if (isPolyfilled && prototype$$) {
	      applyPrototype(this);
	    }

	    // Sets up properties, but does not invoke anything.
	    if (propertyDefinitions) {
	      initialiseProps(this, propertyDefinitions);
	    }

	    if (events$$) {
	      applyEvents(this);
	    }

	    if (created) {
	      created(this);
	    }

	    if (renderer && !this.hasAttribute(renderedAttribute)) {
	      renderer(this);
	    }

	    if (ready) {
	      ready(this);
	    }

	    // Defined attribute is last before notifying listeners.
	    if (!this.hasAttribute(definedAttribute)) {
	      this.setAttribute(definedAttribute, '');
	    }

	    // We trigger ready after we add the defined attribute.
	    if (readyCallbacks) {
	      readyCallbacks.forEach(function (cb) {
	        return cb();
	      });
	      elemData.readyCallbacks = null;
	    }

	    // In the early versions of the spec ("v0", only implemented by Blink) all
	    // calls to setAttribute() would queue a task to execute the attributeChangedCallback.
	    // However, no attributes that exist when the element is upgraded would queue
	    // a task.
	    //
	    // In Custom Elements v1, nothing is queued until after the constructor
	    // (createdCallback in v0) is invoked. After it is invoked, the
	    // attributeChangedCallback() is executed for all existing attributes. All
	    // subsequent calls behave as normal.
	    //
	    // Any attribute change before this point is a no-op. Anything after works
	    // as normal.
	    if (isCustomElementsV0$1) {
	      this.setAttribute('____can_start_triggering_now', '');
	      this.removeAttribute('____can_start_triggering_now');
	    }

	    // Make attribute sets synchronous for polyfill-land.
	    if (isPolyfilled) {
	      patchAttributeMethods(this);
	    }

	    // Emulate v1 attribute initialisation behaviour.
	    if (!isCustomElementsV1$1) {
	      // We force this flag to be true so that attributeChanged() actually gets
	      // called in Chrome v0.
	      elemData.canStartTriggeringNow = true;

	      // Force the change.
	      callAttributeChangedForEachAttribute(this, observedAttributes);

	      // Now we turn it off so that Chrome v0 doesn't trigger attributeChanged()
	      // until *after* it receives the set for "____can_start_triggering_now".
	      elemData.canStartTriggeringNow = false;
	    }
	  };
	}

	function dashCase (str) {
	  return str.split(/([A-Z])/).reduce(function (one, two, idx) {
	    var dash = !one || idx % 2 === 0 ? '' : '-';
	    return '' + one + dash + two.toLowerCase();
	  });
	}

	var nope = null;

	var defaults = {
	  attached: nope,
	  attribute: nope,
	  created: nope,
	  definedAttribute: 'defined',
	  render: nope,
	  detached: nope,
	  events: nope,
	  extends: nope,
	  props: nope,
	  prototype: {},
	  ready: nope,
	  renderedAttribute: 'rendered'
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

	var _window = window;
	var Element$1 = _window.Element;


	function getClosestIgnoredElement (element) {
	  var parent = element;
	  while (parent instanceof Element$1) {
	    if (ignored(parent)) {
	      return parent;
	    }
	    parent = parent.parentNode;
	  }
	}

	function triggerAddedNodes(addedNodes) {
	  walkTree(addedNodes, function (element) {
	    var component = findElementInRegistry(element);

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
	    var component = findElementInRegistry(element);

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

	function getAllPropertyDescriptors (obj) {
	  return protos(obj).reduce(function (result, proto) {
	    var descriptors = getOwnPropertyDescriptors(proto);
	    Object.getOwnPropertyNames(descriptors).reduce(function (result, name) {
	      result[name] = descriptors[name];
	      return result;
	    }, result);
	    return result;
	  }, {});
	}

	var incrementalDomCjs = __commonjs(function (module, exports) {
	/**
	 * @license
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	'use strict';

	/**
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	  * Keeps track whether or not we are in an attributes declaration (after
	  * elementOpenStart, but before elementOpenEnd).
	  * @type {boolean}
	  */

	var inAttributes = false;

	/**
	  * Keeps track whether or not we are in an element that should not have its
	  * children cleared.
	  * @type {boolean}
	  */
	var inSkip = false;

	/**
	 * Makes sure that there is a current patch context.
	 * @param {*} context
	 */
	var assertInPatch = function assertInPatch(context) {
	  if (!context) {
	    throw new Error('Cannot call currentElement() unless in patch');
	  }
	};

	/**
	* Makes sure that keyed Element matches the tag name provided.
	* @param {!string} nodeName The nodeName of the node that is being matched.
	* @param {string=} tag The tag name of the Element.
	* @param {?string=} key The key of the Element.
	*/
	var assertKeyedTagMatches = function assertKeyedTagMatches(nodeName, tag, key) {
	  if (nodeName !== tag) {
	    throw new Error('Was expecting node with key "' + key + '" to be a ' + tag + ', not a ' + nodeName + '.');
	  }
	};

	/**
	 * Makes sure that a patch closes every node that it opened.
	 * @param {?Node} openElement
	 * @param {!Node|!DocumentFragment} root
	 */
	var assertNoUnclosedTags = function assertNoUnclosedTags(openElement, root) {
	  if (openElement === root) {
	    return;
	  }

	  var currentElement = openElement;
	  var openTags = [];
	  while (currentElement && currentElement !== root) {
	    openTags.push(currentElement.nodeName.toLowerCase());
	    currentElement = currentElement.parentNode;
	  }

	  throw new Error('One or more tags were not closed:\n' + openTags.join('\n'));
	};

	/**
	 * Makes sure that the caller is not where attributes are expected.
	 * @param {string} functionName
	 */
	var assertNotInAttributes = function assertNotInAttributes(functionName) {
	  if (inAttributes) {
	    throw new Error(functionName + '() may not be called between ' + 'elementOpenStart() and elementOpenEnd().');
	  }
	};

	/**
	 * Makes sure that the caller is not inside an element that has declared skip.
	 * @param {string} functionName
	 */
	var assertNotInSkip = function assertNotInSkip(functionName) {
	  if (inSkip) {
	    throw new Error(functionName + '() may not be called inside an element ' + 'that has called skip().');
	  }
	};

	/**
	 * Makes sure that the caller is where attributes are expected.
	 * @param {string} functionName
	 */
	var assertInAttributes = function assertInAttributes(functionName) {
	  if (!inAttributes) {
	    throw new Error(functionName + '() must be called after ' + 'elementOpenStart().');
	  }
	};

	/**
	 * Makes sure the patch closes virtual attributes call
	 */
	var assertVirtualAttributesClosed = function assertVirtualAttributesClosed() {
	  if (inAttributes) {
	    throw new Error('elementOpenEnd() must be called after calling ' + 'elementOpenStart().');
	  }
	};

	/**
	  * Makes sure that placeholders have a key specified. Otherwise, conditional
	  * placeholders and conditional elements next to placeholders will cause
	  * placeholder elements to be re-used as non-placeholders and vice versa.
	  * @param {string} key
	  */
	var assertPlaceholderKeySpecified = function assertPlaceholderKeySpecified(key) {
	  if (!key) {
	    throw new Error('Placeholder elements must have a key specified.');
	  }
	};

	/**
	  * Makes sure that tags are correctly nested.
	  * @param {string} nodeName
	  * @param {string} tag
	  */
	var assertCloseMatchesOpenTag = function assertCloseMatchesOpenTag(nodeName, tag) {
	  if (nodeName !== tag) {
	    throw new Error('Received a call to close ' + tag + ' but ' + nodeName + ' was open.');
	  }
	};

	/**
	 * Makes sure that no children elements have been declared yet in the current
	 * element.
	 * @param {string} functionName
	 * @param {?Node} previousNode
	 */
	var assertNoChildrenDeclaredYet = function assertNoChildrenDeclaredYet(functionName, previousNode) {
	  if (previousNode !== null) {
	    throw new Error(functionName + '() must come before any child ' + 'declarations inside the current element.');
	  }
	};

	/**
	 * Updates the state of being in an attribute declaration.
	 * @param {boolean} value
	 * @return {boolean} the previous value.
	 */
	var setInAttributes = function setInAttributes(value) {
	  var previous = inAttributes;
	  inAttributes = value;
	  return previous;
	};

	/**
	 * Updates the state of being in a skip element.
	 * @param {boolean} value
	 * @return {boolean} the previous value.
	 */
	var setInSkip = function setInSkip(value) {
	  var previous = inSkip;
	  inSkip = value;
	  return previous;
	};

	/**
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/** */
	exports.notifications = {
	  /**
	   * Called after patch has compleated with any Nodes that have been created
	   * and added to the DOM.
	   * @type {?function(Array<!Node>)}
	   */
	  nodesCreated: null,

	  /**
	   * Called after patch has compleated with any Nodes that have been removed
	   * from the DOM.
	   * Note it's an applications responsibility to handle any childNodes.
	   * @type {?function(Array<!Node>)}
	   */
	  nodesDeleted: null
	};

	/**
	 * Keeps track of the state of a patch.
	 * @constructor
	 */
	function Context() {
	  /**
	   * @type {(Array<!Node>|undefined)}
	   */
	  this.created = exports.notifications.nodesCreated && [];

	  /**
	   * @type {(Array<!Node>|undefined)}
	   */
	  this.deleted = exports.notifications.nodesDeleted && [];
	}

	/**
	 * @param {!Node} node
	 */
	Context.prototype.markCreated = function (node) {
	  if (this.created) {
	    this.created.push(node);
	  }
	};

	/**
	 * @param {!Node} node
	 */
	Context.prototype.markDeleted = function (node) {
	  if (this.deleted) {
	    this.deleted.push(node);
	  }
	};

	/**
	 * Notifies about nodes that were created during the patch opearation.
	 */
	Context.prototype.notifyChanges = function () {
	  if (this.created && this.created.length > 0) {
	    exports.notifications.nodesCreated(this.created);
	  }

	  if (this.deleted && this.deleted.length > 0) {
	    exports.notifications.nodesDeleted(this.deleted);
	  }
	};

	/**
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * A cached reference to the hasOwnProperty function.
	 */
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * A cached reference to the create function.
	 */
	var create = Object.create;

	/**
	 * Used to prevent property collisions between our "map" and its prototype.
	 * @param {!Object<string, *>} map The map to check.
	 * @param {string} property The property to check.
	 * @return {boolean} Whether map has property.
	 */
	var has = function has(map, property) {
	  return hasOwnProperty.call(map, property);
	};

	/**
	 * Creates an map object without a prototype.
	 * @return {!Object}
	 */
	var createMap = function createMap() {
	  return create(null);
	};

	/**
	 * Keeps track of information needed to perform diffs for a given DOM node.
	 * @param {!string} nodeName
	 * @param {?string=} key
	 * @constructor
	 */
	function NodeData(nodeName, key) {
	  /**
	   * The attributes and their values.
	   * @const {!Object<string, *>}
	   */
	  this.attrs = createMap();

	  /**
	   * An array of attribute name/value pairs, used for quickly diffing the
	   * incomming attributes to see if the DOM node's attributes need to be
	   * updated.
	   * @const {Array<*>}
	   */
	  this.attrsArr = [];

	  /**
	   * The incoming attributes for this Node, before they are updated.
	   * @const {!Object<string, *>}
	   */
	  this.newAttrs = createMap();

	  /**
	   * The key used to identify this node, used to preserve DOM nodes when they
	   * move within their parent.
	   * @const
	   */
	  this.key = key;

	  /**
	   * Keeps track of children within this node by their key.
	   * {?Object<string, !Element>}
	   */
	  this.keyMap = null;

	  /**
	   * Whether or not the keyMap is currently valid.
	   * {boolean}
	   */
	  this.keyMapValid = true;

	  /**
	   * The node name for this node.
	   * @const {string}
	   */
	  this.nodeName = nodeName;

	  /**
	   * @type {?string}
	   */
	  this.text = null;
	}

	/**
	 * Initializes a NodeData object for a Node.
	 *
	 * @param {Node} node The node to initialize data for.
	 * @param {string} nodeName The node name of node.
	 * @param {?string=} key The key that identifies the node.
	 * @return {!NodeData} The newly initialized data object
	 */
	var initData = function initData(node, nodeName, key) {
	  var data = new NodeData(nodeName, key);
	  node['__incrementalDOMData'] = data;
	  return data;
	};

	/**
	 * Retrieves the NodeData object for a Node, creating it if necessary.
	 *
	 * @param {Node} node The node to retrieve the data for.
	 * @return {!NodeData} The NodeData for this Node.
	 */
	var getData = function getData(node) {
	  var data = node['__incrementalDOMData'];

	  if (!data) {
	    var nodeName = node.nodeName.toLowerCase();
	    var key = null;

	    if (node instanceof Element) {
	      key = node.getAttribute('key');
	    }

	    data = initData(node, nodeName, key);
	  }

	  return data;
	};

	/**
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	exports.symbols = {
	  default: '__default',

	  placeholder: '__placeholder'
	};

	/**
	 * Applies an attribute or property to a given Element. If the value is null
	 * or undefined, it is removed from the Element. Otherwise, the value is set
	 * as an attribute.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {?(boolean|number|string)=} value The attribute's value.
	 */
	exports.applyAttr = function (el, name, value) {
	  if (value == null) {
	    el.removeAttribute(name);
	  } else {
	    el.setAttribute(name, value);
	  }
	};

	/**
	 * Applies a property to a given Element.
	 * @param {!Element} el
	 * @param {string} name The property's name.
	 * @param {*} value The property's value.
	 */
	exports.applyProp = function (el, name, value) {
	  el[name] = value;
	};

	/**
	 * Applies a style to an Element. No vendor prefix expansion is done for
	 * property names/values.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {*} style The style to set. Either a string of css or an object
	 *     containing property-value pairs.
	 */
	var applyStyle = function applyStyle(el, name, style) {
	  if (typeof style === 'string') {
	    el.style.cssText = style;
	  } else {
	    el.style.cssText = '';
	    var elStyle = el.style;
	    var obj = /** @type {!Object<string,string>} */style;

	    for (var prop in obj) {
	      if (has(obj, prop)) {
	        elStyle[prop] = obj[prop];
	      }
	    }
	  }
	};

	/**
	 * Updates a single attribute on an Element.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {*} value The attribute's value. If the value is an object or
	 *     function it is set on the Element, otherwise, it is set as an HTML
	 *     attribute.
	 */
	var applyAttributeTyped = function applyAttributeTyped(el, name, value) {
	  var type = typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value);

	  if (type === 'object' || type === 'function') {
	    exports.applyProp(el, name, value);
	  } else {
	    exports.applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
	  }
	};

	/**
	 * Calls the appropriate attribute mutator for this attribute.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {*} value The attribute's value.
	 */
	var updateAttribute = function updateAttribute(el, name, value) {
	  var data = getData(el);
	  var attrs = data.attrs;

	  if (attrs[name] === value) {
	    return;
	  }

	  var mutator = exports.attributes[name] || exports.attributes[exports.symbols.default];
	  mutator(el, name, value);

	  attrs[name] = value;
	};

	/**
	 * A publicly mutable object to provide custom mutators for attributes.
	 * @const {!Object<string, function(!Element, string, *)>}
	 */
	exports.attributes = createMap();

	// Special generic mutator that's called for any attribute that does not
	// have a specific mutator.
	exports.attributes[exports.symbols.default] = applyAttributeTyped;

	exports.attributes[exports.symbols.placeholder] = function () {};

	exports.attributes['style'] = applyStyle;

	/**
	 * Gets the namespace to create an element (of a given tag) in.
	 * @param {string} tag The tag to get the namespace for.
	 * @param {?Node} parent
	 * @return {?string} The namespace to create the tag in.
	 */
	var getNamespaceForTag = function getNamespaceForTag(tag, parent) {
	  if (tag === 'svg') {
	    return 'http://www.w3.org/2000/svg';
	  }

	  if (getData(parent).nodeName === 'foreignObject') {
	    return null;
	  }

	  return parent.namespaceURI;
	};

	/**
	 * Creates an Element.
	 * @param {Document} doc The document with which to create the Element.
	 * @param {?Node} parent
	 * @param {string} tag The tag for the Element.
	 * @param {?string=} key A key to identify the Element.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element.
	 * @return {!Element}
	 */
	var createElement = function createElement(doc, parent, tag, key, statics) {
	  var namespace = getNamespaceForTag(tag, parent);
	  var el;

	  if (namespace) {
	    el = doc.createElementNS(namespace, tag);
	  } else {
	    el = doc.createElement(tag);
	  }

	  initData(el, tag, key);

	  if (statics) {
	    for (var i = 0; i < statics.length; i += 2) {
	      updateAttribute(el, /** @type {!string}*/statics[i], statics[i + 1]);
	    }
	  }

	  return el;
	};

	/**
	 * Creates a Text Node.
	 * @param {Document} doc The document with which to create the Element.
	 * @return {!Text}
	 */
	var createText = function createText(doc) {
	  var node = doc.createTextNode('');
	  initData(node, '#text', null);
	  return node;
	};

	/**
	 * Creates a mapping that can be used to look up children using a key.
	 * @param {?Node} el
	 * @return {!Object<string, !Element>} A mapping of keys to the children of the
	 *     Element.
	 */
	var createKeyMap = function createKeyMap(el) {
	  var map = createMap();
	  var children = el.children;
	  var count = children.length;

	  for (var i = 0; i < count; i += 1) {
	    var child = children[i];
	    var key = getData(child).key;

	    if (key) {
	      map[key] = child;
	    }
	  }

	  return map;
	};

	/**
	 * Retrieves the mapping of key to child node for a given Element, creating it
	 * if necessary.
	 * @param {?Node} el
	 * @return {!Object<string, !Node>} A mapping of keys to child Elements
	 */
	var getKeyMap = function getKeyMap(el) {
	  var data = getData(el);

	  if (!data.keyMap) {
	    data.keyMap = createKeyMap(el);
	  }

	  return data.keyMap;
	};

	/**
	 * Retrieves a child from the parent with the given key.
	 * @param {?Node} parent
	 * @param {?string=} key
	 * @return {?Node} The child corresponding to the key.
	 */
	var getChild = function getChild(parent, key) {
	  return key ? getKeyMap(parent)[key] : null;
	};

	/**
	 * Registers an element as being a child. The parent will keep track of the
	 * child using the key. The child can be retrieved using the same key using
	 * getKeyMap. The provided key should be unique within the parent Element.
	 * @param {?Node} parent The parent of child.
	 * @param {string} key A key to identify the child with.
	 * @param {!Node} child The child to register.
	 */
	var registerChild = function registerChild(parent, key, child) {
	  getKeyMap(parent)[key] = child;
	};

	/** @type {?Context} */
	var context = null;

	/** @type {?Node} */
	var currentNode;

	/** @type {?Node} */
	var currentParent;

	/** @type {?Node} */
	var previousNode;

	/** @type {?Element|?DocumentFragment} */
	var root;

	/** @type {?Document} */
	var doc;

	/**
	 * Patches the document starting at el with the provided function. This function
	 * may be called during an existing patch operation.
	 * @param {!Element|!DocumentFragment} node The Element or Document
	 *     to patch.
	 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
	 *     calls that describe the DOM.
	 * @param {T=} data An argument passed to fn to represent DOM state.
	 * @template T
	 */
	exports.patch = function (node, fn, data) {
	  var prevContext = context;
	  var prevRoot = root;
	  var prevDoc = doc;
	  var prevCurrentNode = currentNode;
	  var prevCurrentParent = currentParent;
	  var prevPreviousNode = previousNode;
	  var previousInAttributes = false;
	  var previousInSkip = false;

	  context = new Context();
	  root = node;
	  doc = node.ownerDocument;
	  currentNode = node;
	  currentParent = null;
	  previousNode = null;

	  if (process.env.NODE_ENV !== 'production') {
	    previousInAttributes = setInAttributes(false);
	    previousInSkip = setInSkip(false);
	  }

	  enterNode();
	  fn(data);
	  exitNode();

	  if (process.env.NODE_ENV !== 'production') {
	    assertVirtualAttributesClosed();
	    assertNoUnclosedTags(previousNode, node);
	    setInAttributes(previousInAttributes);
	    setInSkip(previousInSkip);
	  }

	  context.notifyChanges();

	  context = prevContext;
	  root = prevRoot;
	  doc = prevDoc;
	  currentNode = prevCurrentNode;
	  currentParent = prevCurrentParent;
	  previousNode = prevPreviousNode;
	};

	/**
	 * Checks whether or not the current node matches the specified nodeName and
	 * key.
	 *
	 * @param {?string} nodeName The nodeName for this node.
	 * @param {?string=} key An optional key that identifies a node.
	 * @return {boolean} True if the node matches, false otherwise.
	 */
	var matches = function matches(nodeName, key) {
	  var data = getData(currentNode);

	  // Key check is done using double equals as we want to treat a null key the
	  // same as undefined. This should be okay as the only values allowed are
	  // strings, null and undefined so the == semantics are not too weird.
	  return nodeName === data.nodeName && key == data.key;
	};

	/**
	 * Aligns the virtual Element definition with the actual DOM, moving the
	 * corresponding DOM node to the correct location or creating it if necessary.
	 * @param {string} nodeName For an Element, this should be a valid tag string.
	 *     For a Text, this should be #text.
	 * @param {?string=} key The key used to identify this element.
	 * @param {?Array<*>=} statics For an Element, this should be an array of
	 *     name-value pairs.
	 */
	var alignWithDOM = function alignWithDOM(nodeName, key, statics) {
	  if (currentNode && matches(nodeName, key)) {
	    return;
	  }

	  var node;

	  // Check to see if the node has moved within the parent.
	  if (key) {
	    node = getChild(currentParent, key);
	    if (node && process.env.NODE_ENV !== 'production') {
	      assertKeyedTagMatches(getData(node).nodeName, nodeName, key);
	    }
	  }

	  // Create the node if it doesn't exist.
	  if (!node) {
	    if (nodeName === '#text') {
	      node = createText(doc);
	    } else {
	      node = createElement(doc, currentParent, nodeName, key, statics);
	    }

	    if (key) {
	      registerChild(currentParent, key, node);
	    }

	    context.markCreated(node);
	  }

	  // If the node has a key, remove it from the DOM to prevent a large number
	  // of re-orders in the case that it moved far or was completely removed.
	  // Since we hold on to a reference through the keyMap, we can always add it
	  // back.
	  if (currentNode && getData(currentNode).key) {
	    currentParent.replaceChild(node, currentNode);
	    getData(currentParent).keyMapValid = false;
	  } else {
	    currentParent.insertBefore(node, currentNode);
	  }

	  currentNode = node;
	};

	/**
	 * Clears out any unvisited Nodes, as the corresponding virtual element
	 * functions were never called for them.
	 */
	var clearUnvisitedDOM = function clearUnvisitedDOM() {
	  var node = currentParent;
	  var data = getData(node);
	  var keyMap = data.keyMap;
	  var keyMapValid = data.keyMapValid;
	  var child = node.lastChild;
	  var key;

	  if (child === previousNode && keyMapValid) {
	    return;
	  }

	  if (data.attrs[exports.symbols.placeholder] && node !== root) {
	    return;
	  }

	  while (child !== previousNode) {
	    node.removeChild(child);
	    context.markDeleted( /** @type {!Node}*/child);

	    key = getData(child).key;
	    if (key) {
	      delete keyMap[key];
	    }
	    child = node.lastChild;
	  }

	  // Clean the keyMap, removing any unusued keys.
	  if (!keyMapValid) {
	    for (key in keyMap) {
	      child = keyMap[key];
	      if (child.parentNode !== node) {
	        context.markDeleted(child);
	        delete keyMap[key];
	      }
	    }

	    data.keyMapValid = true;
	  }
	};

	/**
	 * Changes to the first child of the current node.
	 */
	var enterNode = function enterNode() {
	  currentParent = currentNode;
	  currentNode = currentNode.firstChild;
	  previousNode = null;
	};

	/**
	 * Changes to the next sibling of the current node.
	 */
	var nextNode = function nextNode() {
	  previousNode = currentNode;
	  currentNode = currentNode.nextSibling;
	};

	/**
	 * Changes to the parent of the current node, removing any unvisited children.
	 */
	var exitNode = function exitNode() {
	  clearUnvisitedDOM();

	  previousNode = currentParent;
	  currentNode = currentParent.nextSibling;
	  currentParent = currentParent.parentNode;
	};

	/**
	 * Makes sure that the current node is an Element with a matching tagName and
	 * key.
	 *
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @return {!Element} The corresponding Element.
	 */
	var _elementOpen = function _elementOpen(tag, key, statics) {
	  alignWithDOM(tag, key, statics);
	  enterNode();
	  return (/** @type {!Element} */currentParent
	  );
	};

	/**
	 * Closes the currently open Element, removing any unvisited children if
	 * necessary.
	 *
	 * @return {!Element} The corresponding Element.
	 */
	var _elementClose = function _elementClose() {
	  if (process.env.NODE_ENV !== 'production') {
	    setInSkip(false);
	  }

	  exitNode();
	  return (/** @type {!Element} */previousNode
	  );
	};

	/**
	 * Makes sure the current node is a Text node and creates a Text node if it is
	 * not.
	 *
	 * @return {!Text} The corresponding Text Node.
	 */
	var _text = function _text() {
	  alignWithDOM('#text', null, null);
	  nextNode();
	  return (/** @type {!Text} */previousNode
	  );
	};

	/**
	 * Gets the current Element being patched.
	 * @return {!Element}
	 */
	exports.currentElement = function () {
	  if (process.env.NODE_ENV !== 'production') {
	    assertInPatch(context);
	    assertNotInAttributes('currentElement');
	  }
	  return (/** @type {!Element} */currentParent
	  );
	};

	/**
	 * Skips the children in a subtree, allowing an Element to be closed without
	 * clearing out the children.
	 */
	exports.skip = function () {
	  if (process.env.NODE_ENV !== 'production') {
	    assertNoChildrenDeclaredYet('skip', previousNode);
	    setInSkip(true);
	  }
	  previousNode = currentParent.lastChild;
	};

	/**
	 * The offset in the virtual element declaration where the attributes are
	 * specified.
	 * @const
	 */
	var ATTRIBUTES_OFFSET = 3;

	/**
	 * Builds an array of arguments for use with elementOpenStart, attr and
	 * elementOpenEnd.
	 * @const {Array<*>}
	 */
	var argsBuilder = [];

	/**
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	exports.elementOpen = function (tag, key, statics, var_args) {
	  if (process.env.NODE_ENV !== 'production') {
	    assertNotInAttributes('elementOpen');
	    assertNotInSkip('elementOpen');
	  }

	  var node = _elementOpen(tag, key, statics);
	  var data = getData(node);

	  /*
	   * Checks to see if one or more attributes have changed for a given Element.
	   * When no attributes have changed, this is much faster than checking each
	   * individual argument. When attributes have changed, the overhead of this is
	   * minimal.
	   */
	  var attrsArr = data.attrsArr;
	  var newAttrs = data.newAttrs;
	  var attrsChanged = false;
	  var i = ATTRIBUTES_OFFSET;
	  var j = 0;

	  for (; i < arguments.length; i += 1, j += 1) {
	    if (attrsArr[j] !== arguments[i]) {
	      attrsChanged = true;
	      break;
	    }
	  }

	  for (; i < arguments.length; i += 1, j += 1) {
	    attrsArr[j] = arguments[i];
	  }

	  if (j < attrsArr.length) {
	    attrsChanged = true;
	    attrsArr.length = j;
	  }

	  /*
	   * Actually perform the attribute update.
	   */
	  if (attrsChanged) {
	    for (i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
	      newAttrs[arguments[i]] = arguments[i + 1];
	    }

	    for (var attr in newAttrs) {
	      updateAttribute(node, attr, newAttrs[attr]);
	      newAttrs[attr] = undefined;
	    }
	  }

	  return node;
	};

	/**
	 * Declares a virtual Element at the current location in the document. This
	 * corresponds to an opening tag and a elementClose tag is required. This is
	 * like elementOpen, but the attributes are defined using the attr function
	 * rather than being passed as arguments. Must be folllowed by 0 or more calls
	 * to attr, then a call to elementOpenEnd.
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 */
	exports.elementOpenStart = function (tag, key, statics) {
	  if (process.env.NODE_ENV !== 'production') {
	    assertNotInAttributes('elementOpenStart');
	    setInAttributes(true);
	  }

	  argsBuilder[0] = tag;
	  argsBuilder[1] = key;
	  argsBuilder[2] = statics;
	};

	/***
	 * Defines a virtual attribute at this point of the DOM. This is only valid
	 * when called between elementOpenStart and elementOpenEnd.
	 *
	 * @param {string} name
	 * @param {*} value
	 */
	exports.attr = function (name, value) {
	  if (process.env.NODE_ENV !== 'production') {
	    assertInAttributes('attr');
	  }

	  argsBuilder.push(name, value);
	};

	/**
	 * Closes an open tag started with elementOpenStart.
	 * @return {!Element} The corresponding Element.
	 */
	exports.elementOpenEnd = function () {
	  if (process.env.NODE_ENV !== 'production') {
	    assertInAttributes('elementOpenEnd');
	    setInAttributes(false);
	  }

	  var node = exports.elementOpen.apply(null, argsBuilder);
	  argsBuilder.length = 0;
	  return node;
	};

	/**
	 * Closes an open virtual Element.
	 *
	 * @param {string} tag The element's tag.
	 * @return {!Element} The corresponding Element.
	 */
	exports.elementClose = function (tag) {
	  if (process.env.NODE_ENV !== 'production') {
	    assertNotInAttributes('elementClose');
	  }

	  var node = _elementClose();

	  if (process.env.NODE_ENV !== 'production') {
	    assertCloseMatchesOpenTag(getData(node).nodeName, tag);
	  }

	  return node;
	};

	/**
	 * Declares a virtual Element at the current location in the document that has
	 * no children.
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	exports.elementVoid = function (tag, key, statics, var_args) {
	  var node = exports.elementOpen.apply(null, arguments);
	  exports.elementClose.apply(null, arguments);
	  return node;
	};

	/**
	 * Declares a virtual Element at the current location in the document that is a
	 * placeholder element. Children of this Element can be manually managed and
	 * will not be cleared by the library.
	 *
	 * A key must be specified to make sure that this node is correctly preserved
	 * across all conditionals.
	 *
	 * @param {string} tag The element's tag.
	 * @param {string} key The key used to identify this element.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	exports.elementPlaceholder = function (tag, key, statics, var_args) {
	  if (process.env.NODE_ENV !== 'production') {
	    assertPlaceholderKeySpecified(key);
	  }

	  exports.elementOpen.apply(null, arguments);
	  exports.skip();
	  return exports.elementClose.apply(null, arguments);
	};

	/**
	 * Declares a virtual Text at this point in the document.
	 *
	 * @param {string|number|boolean} value The value of the Text.
	 * @param {...(function((string|number|boolean)):string)} var_args
	 *     Functions to format the value which are called only when the value has
	 *     changed.
	 * @return {!Text} The corresponding text node.
	 */
	exports.text = function (value, var_args) {
	  if (process.env.NODE_ENV !== 'production') {
	    assertNotInAttributes('text');
	    assertNotInSkip('text');
	  }

	  var node = _text();
	  var data = getData(node);

	  if (data.text !== value) {
	    data.text = /** @type {string} */value;

	    var formatted = value;
	    for (var i = 1; i < arguments.length; i += 1) {
	      formatted = arguments[i](formatted);
	    }

	    node.data = formatted;
	  }

	  return node;
	};
	});

	var incrementalDomCjs$1 = (incrementalDomCjs && typeof incrementalDomCjs === 'object' && 'default' in incrementalDomCjs ? incrementalDomCjs['default'] : incrementalDomCjs);
	var text$1 = incrementalDomCjs.text;
	var elementPlaceholder = incrementalDomCjs.elementPlaceholder;
	var elementVoid = incrementalDomCjs.elementVoid;
	var elementClose$1 = incrementalDomCjs.elementClose;
	var elementOpenEnd$1 = incrementalDomCjs.elementOpenEnd;
	var attr$1 = incrementalDomCjs.attr;
	var elementOpenStart$1 = incrementalDomCjs.elementOpenStart;
	var elementOpen$1 = incrementalDomCjs.elementOpen;
	var skip$1 = incrementalDomCjs.skip;
	var currentElement = incrementalDomCjs.currentElement;
	var patch$1 = incrementalDomCjs.patch;
	var attributes$1 = incrementalDomCjs.attributes;
	var applyProp$1 = incrementalDomCjs.applyProp;
	var applyAttr = incrementalDomCjs.applyAttr;
	var symbols$1 = incrementalDomCjs.symbols;
	var notifications = incrementalDomCjs.notifications;

var IncrementalDOM = Object.freeze({
	  default: incrementalDomCjs$1,
	  text: text$1,
	  elementPlaceholder: elementPlaceholder,
	  elementVoid: elementVoid,
	  elementClose: elementClose$1,
	  elementOpenEnd: elementOpenEnd$1,
	  attr: attr$1,
	  elementOpenStart: elementOpenStart$1,
	  elementOpen: elementOpen$1,
	  skip: skip$1,
	  currentElement: currentElement,
	  patch: patch$1,
	  attributes: attributes$1,
	  applyProp: applyProp$1,
	  applyAttr: applyAttr,
	  symbols: symbols$1,
	  notifications: notifications
	});

	// Could import these, but we have to import all of IncrementalDOM anyways so
	// that we can export our configured IncrementalDOM.
	var applyProp = applyProp$1;
	var attr = attr$1;
	var attributes = attributes$1;
	var elementClose = elementClose$1;
	var elementOpen = elementOpen$1;
	var elementOpenEnd = elementOpenEnd$1;
	var elementOpenStart = elementOpenStart$1;
	var skip = skip$1;
	var symbols = symbols$1;
	var text = text$1;

	// Specify an environment for iDOM in case we haven't yet.

	if (typeof process === 'undefined') {
	  /* eslint no-undef: 0 */
	  process = { env: { NODE_ENV: 'production' } };
	}

	var applyDefault = attributes[symbols.default];
	var factories = {};

	// Attributes that are not handled by Incremental DOM.
	attributes.key = attributes.skip = attributes.statics = function () {};

	// Attributes that *must* be set via a property on all elements.
	attributes.checked = attributes.className = attributes.disabled = attributes.value = applyProp;

	// Default attribute applicator.
	attributes[symbols.default] = function (elem, name, value) {
	  // Boolean false values should not set attributes at all.
	  if (value === false) {
	    return;
	  }

	  // Custom element properties should be set as properties.
	  var props = elem.constructor.props;
	  if (props && name in props) {
	    return applyProp(elem, name, value);
	  }

	  // Handle built-in and custom events.
	  if (name.indexOf('on') === 0) {
	    return name in elem ? applyProp(elem, name, value) : applyEvent(elem, name.substring(2), name, value);
	  }

	  // Fallback to default IncrementalDOM behaviour.
	  applyDefault(elem, name, value);
	};

	// Adds or removes an event listener for an element.
	function applyEvent(elem, ename, name, value) {
	  var events = elem.__events;

	  if (!events) {
	    events = elem.__events = {};
	  }

	  var eFunc = events[ename];

	  // Remove old listener so they don't double up.
	  if (eFunc) {
	    elem.removeEventListener(ename, eFunc);
	  }

	  // Bind new listener.
	  if (value) {
	    elem.addEventListener(ename, events[ename] = function (e) {
	      if (this === e.target) {
	        value.call(this, e);
	      }
	    });
	  }
	}

	// Creates a factory and returns it.
	function bind(tname) {
	  var shouldBeContentTag = tname === 'slot' && !support.shadowDomV1 && support.shadowDomV0;

	  // Abstract Shadow DOM V0 <content> behind Shadow DOM V1 <slot>.
	  if (shouldBeContentTag) {
	    tname = 'content';
	  }

	  return factories[tname] = function (attrs, chren) {
	    if (attrs && (typeof attrs === 'undefined' ? 'undefined' : babelHelpers.typeof(attrs)) === 'object') {
	      // Abstract Shadow DOM V0 <content> behind Shadow DOM V1 <slot>.
	      if (shouldBeContentTag && attrs.name) {
	        attrs.select = '[slot="' + attrs.name + '"]';
	        delete attrs.slot;
	      }

	      elementOpenStart(tname, attrs.key, attrs.statics);
	      for (var _a in attrs) {
	        attr(_a, attrs[_a]);
	      }
	      elementOpenEnd();
	    } else {
	      elementOpen(tname);
	      chren = attrs;
	      attrs = {};
	    }

	    if (attrs.skip) {
	      skip();
	    } else {
	      var chrenType = typeof chren === 'undefined' ? 'undefined' : babelHelpers.typeof(chren);
	      if (chrenType === 'function') {
	        chren();
	      } else if (chrenType === 'string' || chrenType === 'number') {
	        text(chren);
	      }
	    }

	    return elementClose(tname);
	  };
	}

	// The default function requries a tag name.
	function create$1(tname, attrs, chren) {
	  // Allow a component constructor to be passed in.
	  if (typeof tname === 'function') {
	    tname = tname.id || tname.name;
	  }
	  // Return the cached factory or create a new one and return it.
	  return (factories[tname] || bind(tname))(attrs, chren);
	}

	// Create factories for all HTML elements except for ones that match keywords
	// such as "var".
	var a = bind('a');
	var abbr = bind('abbr');
	var address = bind('address');
	var area = bind('area');
	var article = bind('article');
	var aside = bind('aside');
	var audio = bind('audio');
	var b = bind('b');
	var base = bind('base');
	var bdi = bind('bdi');
	var bdo = bind('bdo');
	var bgsound = bind('bgsound');
	var blockquote = bind('blockquote');
	var body$1 = bind('body');
	var br = bind('br');
	var button = bind('button');
	var canvas = bind('canvas');
	var caption = bind('caption');
	var cite = bind('cite');
	var code = bind('code');
	var col = bind('col');
	var colgroup = bind('colgroup');
	var command = bind('command');
	var content = bind('content');
	var data$1 = bind('data');
	var datalist = bind('datalist');
	var dd = bind('dd');
	var del = bind('del');
	var details = bind('details');
	var dfn = bind('dfn');
	var dialog = bind('dialog');
	var div = bind('div');
	var dl = bind('dl');
	var dt = bind('dt');
	var element = bind('element');
	var em = bind('em');
	var embed = bind('embed');
	var fieldset = bind('fieldset');
	var figcaption = bind('figcaption');
	var figure = bind('figure');
	var font = bind('font');
	var footer = bind('footer');
	var form = bind('form');
	var h1 = bind('h1');
	var h2 = bind('h2');
	var h3 = bind('h3');
	var h4 = bind('h4');
	var h5 = bind('h5');
	var h6 = bind('h6');
	var head$1 = bind('head');
	var header = bind('header');
	var hgroup = bind('hgroup');
	var hr = bind('hr');
	var html = bind('html');
	var i = bind('i');
	var iframe = bind('iframe');
	var image = bind('image');
	var img = bind('img');
	var input = bind('input');
	var ins = bind('ins');
	var kbd = bind('kbd');
	var keygen = bind('keygen');
	var label = bind('label');
	var legend = bind('legend');
	var li = bind('li');
	var link = bind('link');
	var main = bind('main');
	var map = bind('map');
	var mark = bind('mark');
	var marquee = bind('marquee');
	var menu = bind('menu');
	var menuitem = bind('menuitem');
	var meta = bind('meta');
	var meter = bind('meter');
	var multicol = bind('multicol');
	var nav = bind('nav');
	var nobr = bind('nobr');
	var noembed = bind('noembed');
	var noframes = bind('noframes');
	var noscript = bind('noscript');
	var object = bind('object');
	var ol = bind('ol');
	var optgroup = bind('optgroup');
	var option = bind('option');
	var output = bind('output');
	var p = bind('p');
	var param = bind('param');
	var picture = bind('picture');
	var pre = bind('pre');
	var progress = bind('progress');
	var q = bind('q');
	var rp = bind('rp');
	var rt = bind('rt');
	var rtc = bind('rtc');
	var ruby = bind('ruby');
	var s = bind('s');
	var samp = bind('samp');
	var script = bind('script');
	var section = bind('section');
	var select = bind('select');
	var shadow = bind('shadow');
	var slot = bind('slot');
	var small = bind('small');
	var source = bind('source');
	var span = bind('span');
	var strong = bind('strong');
	var style = bind('style');
	var sub = bind('sub');
	var summary = bind('summary');
	var sup = bind('sup');
	var table = bind('table');
	var tbody = bind('tbody');
	var td = bind('td');
	var template = bind('template');
	var textarea = bind('textarea');
	var tfoot = bind('tfoot');
	var th = bind('th');
	var thead = bind('thead');
	var time = bind('time');
	var title = bind('title');
	var tr = bind('tr');
	var track = bind('track');
	var u = bind('u');
	var ul = bind('ul');
	var video = bind('video');
	var wbr = bind('wbr');

var vdomElements = Object.freeze({
	  default: create$1,
	  text: text,
	  IncrementalDOM: IncrementalDOM,
	  a: a,
	  abbr: abbr,
	  address: address,
	  area: area,
	  article: article,
	  aside: aside,
	  audio: audio,
	  b: b,
	  base: base,
	  bdi: bdi,
	  bdo: bdo,
	  bgsound: bgsound,
	  blockquote: blockquote,
	  body: body$1,
	  br: br,
	  button: button,
	  canvas: canvas,
	  caption: caption,
	  cite: cite,
	  code: code,
	  col: col,
	  colgroup: colgroup,
	  command: command,
	  content: content,
	  data: data$1,
	  datalist: datalist,
	  dd: dd,
	  del: del,
	  details: details,
	  dfn: dfn,
	  dialog: dialog,
	  div: div,
	  dl: dl,
	  dt: dt,
	  element: element,
	  em: em,
	  embed: embed,
	  fieldset: fieldset,
	  figcaption: figcaption,
	  figure: figure,
	  font: font,
	  footer: footer,
	  form: form,
	  h1: h1,
	  h2: h2,
	  h3: h3,
	  h4: h4,
	  h5: h5,
	  h6: h6,
	  head: head$1,
	  header: header,
	  hgroup: hgroup,
	  hr: hr,
	  html: html,
	  i: i,
	  iframe: iframe,
	  image: image,
	  img: img,
	  input: input,
	  ins: ins,
	  kbd: kbd,
	  keygen: keygen,
	  label: label,
	  legend: legend,
	  li: li,
	  link: link,
	  main: main,
	  map: map,
	  mark: mark,
	  marquee: marquee,
	  menu: menu,
	  menuitem: menuitem,
	  meta: meta,
	  meter: meter,
	  multicol: multicol,
	  nav: nav,
	  nobr: nobr,
	  noembed: noembed,
	  noframes: noframes,
	  noscript: noscript,
	  object: object,
	  ol: ol,
	  optgroup: optgroup,
	  option: option,
	  output: output,
	  p: p,
	  param: param,
	  picture: picture,
	  pre: pre,
	  progress: progress,
	  q: q,
	  rp: rp,
	  rt: rt,
	  rtc: rtc,
	  ruby: ruby,
	  s: s,
	  samp: samp,
	  script: script,
	  section: section,
	  select: select,
	  shadow: shadow,
	  slot: slot,
	  small: small,
	  source: source,
	  span: span,
	  strong: strong,
	  style: style,
	  sub: sub,
	  summary: summary,
	  sup: sup,
	  table: table,
	  tbody: tbody,
	  td: td,
	  template: template,
	  textarea: textarea,
	  tfoot: tfoot,
	  th: th,
	  thead: thead,
	  time: time,
	  title: title,
	  tr: tr,
	  track: track,
	  u: u,
	  ul: ul,
	  video: video,
	  wbr: wbr
	});

	var shadowRoot = '____shadow_root';

var symbols$2 = Object.freeze({
		shadowRoot: shadowRoot
	});

	var patch = patch$1;


	function render (opts) {
	  var internalRenderer = opts.render;
	  return function (elem) {
	    if (!internalRenderer) {
	      return;
	    }

	    if (!elem[shadowRoot]) {
	      var sr = void 0;
	      if (elem.attachShadow) {
	        sr = elem.attachShadow({ mode: 'open' });
	      } else if (elem.createShadowRoot) {
	        sr = elem.createShadowRoot();
	      } else {
	        sr = elem;
	      }
	      elem[shadowRoot] = sr;
	    }

	    patch(elem[shadowRoot], internalRenderer, elem);
	  };
	}

	var HTMLElement = window.HTMLElement;

	// A function that initialises the document once in a given event loop.
	var initDocument = debounce(function () {
	  walkTree(document.documentElement.childNodes, function (element) {
	    var component = customElements.get(element.tagName.toLowerCase());

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
	function createConstructor(name, opts) {
	  var func = create.bind(null, name);

	  // Assigning defaults gives a predictable definition and prevents us from
	  // having to do defaults checks everywhere.
	  assign(func, defaults);

	  // Inherit all options. This takes into account object literals as well as
	  // ES2015 classes that may have inherited static props which would not be
	  // considered "own".
	  utilDefineProperties(func, getAllPropertyDescriptors(opts));

	  return func;
	}

	function addConstructorInformation(name, Ctor) {
	  fixedProp(Ctor.prototype, 'constructor', Ctor);
	  fixedProp(Ctor, 'id', name);

	  // In native, the function name is the same as the custom element name, but
	  // WebKit prevents this from being defined. We do this where possible and
	  // still define `id` for cross-browser compatibility.
	  var nameProp = Object.getOwnPropertyDescriptor(Ctor, 'name');
	  if (nameProp && nameProp.configurable) {
	    fixedProp(Ctor, 'name', name);
	  }
	}

	// Ensures linked properties that have linked attributes are pre-formatted to
	// the attribute name in which they are linked.
	function ensureLinkedAttributesAreFormatted(opts) {
	  var observedAttributes = opts.observedAttributes;
	  var props = opts.props;


	  if (!props) {
	    return;
	  }

	  Object.keys(props).forEach(function (name) {
	    var prop = props[name];
	    var attr = prop.attribute;
	    if (attr) {
	      // Ensure the property is updated.
	      var linkedAttr = prop.attribute = attr === true ? dashCase(name) : attr;

	      // Automatically observe the attribute since they're linked from the
	      // attributeChangedCallback.
	      if (observedAttributes.indexOf(linkedAttr) === -1) {
	        observedAttributes.push(linkedAttr);
	      }
	    }
	  });
	}

	// The main skate() function.
	function skate (name, opts) {
	  // Ensure the observed attributes are initialised.
	  opts.observedAttributes = opts.observedAttributes || [];

	  // Ensure the render function render's using Incremental DOM.
	  opts.renderer = render(opts);

	  var Ctor = createConstructor(name, opts);
	  addConstructorInformation(name, Ctor);
	  ensureLinkedAttributesAreFormatted(Ctor);

	  // If the options don't inherit a native element prototype, we ensure it does
	  // because native requires you explicitly do this. Here we solve the common
	  // use case by defaulting to HTMLElement.prototype.
	  if (!HTMLElement.prototype.isPrototypeOf(Ctor.prototype) && !SVGElement.prototype.isPrototypeOf(Ctor.prototype)) {
	    var proto = (Ctor.extends ? document.createElement(Ctor.extends).constructor : HTMLElement).prototype;
	    Ctor.prototype = Object.create(proto, getOwnPropertyDescriptors(Ctor.prototype));
	  }

	  // We assign native callbacks to handle the callbacks specified in the
	  // Skate definition. This allows us to abstract away any changes that may
	  // occur in the spec.
	  assign(Ctor.prototype, {
	    createdCallback: created(Ctor),
	    attachedCallback: attached(Ctor),
	    detachedCallback: detached(Ctor),
	    attributeChangedCallback: attribute(Ctor)
	  });

	  // In polyfill land we must emulate what the browser would normally do in
	  // native.
	  if (support.polyfilled) {
	    initDocument();
	    documentObserver.register();
	  }

	  customElements.define(name, Ctor);
	  return customElements.get(name);
	}

	function factory (opts) {
	  return function (name) {
	    return skate(name, opts);
	  };
	}

	var _window$1 = window;
	var Node$1 = _window$1.Node;
	var NodeList = _window$1.NodeList;

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
	    } else if (node instanceof Node$1) {
	      init(node);
	    }

	    if (node) {
	      frag.appendChild(node);
	    }

	    return frag;
	  }, document.createDocumentFragment());
	}

	function get(elem) {
	  var props = elem.constructor.props;
	  var state = {};
	  for (var key in props) {
	    var val = elem[key];
	    if (typeof val !== 'undefined') {
	      state[key] = val;
	    }
	  }
	  return state;
	}

	function set(elem, newState) {
	  var renderer = elem.constructor.renderer;
	  assign(elem, newState);
	  if (renderer) {
	    renderer(elem);
	  }
	}

	function state (elem, newState) {
	  return typeof newState === 'undefined' ? get(elem) : set(elem, newState);
	}

	function getValue(elem) {
	  var type = elem.type;
	  if (type === 'checkbox' || type === 'radio') {
	    return elem.checked ? elem.value || true : false;
	  }
	  return elem.value;
	}

	function link$1 (elem, target) {
	  return function (e) {
	    var value = getValue(e.target);
	    var localTarget = target || e.target.name || 'value';

	    if (localTarget.indexOf('.') > -1) {
	      var parts = localTarget.split('.');
	      var firstPart = parts[0];
	      var propName = parts.pop();
	      var obj = parts.reduce(function (prev, curr) {
	        return prev && prev[curr];
	      }, elem);

	      obj[propName || e.target.name] = value;
	      state(elem, babelHelpers.defineProperty({}, firstPart, elem[firstPart]));
	    } else {
	      state(elem, babelHelpers.defineProperty({}, localTarget, value));
	    }
	  };
	}

	var propArray = {
	  coerce: function coerce(val) {
	    return Array.isArray(val) ? val : [val];
	  },
	  default: function _default() {
	    return [];
	  },
	  deserialize: JSON.parse,
	  serialize: JSON.stringify
	};

	var propBoolean = {
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

	var alwaysUndefinedIfEmpty = function alwaysUndefinedIfEmpty(val) {
	  return empty(val) ? undefined : Number(val);
	};

	var propNumber = {
	  coerce: alwaysUndefinedIfEmpty,
	  deserialize: alwaysUndefinedIfEmpty,
	  serialize: alwaysUndefinedIfEmpty
	};

	var alwaysUndefinedIfEmpty$1 = function alwaysUndefinedIfEmpty(val) {
	  return empty(val) ? undefined : String(val);
	};

	var propString = {
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

	var array = prop(propArray);
	var boolean = prop(propBoolean);
	var number = prop(propNumber);
	var string = prop(propString);

var props = Object.freeze({
	  default: prop,
	  array: array,
	  boolean: boolean,
	  number: number,
	  string: string
	});

	function ready(element) {
	  var component = findElementInRegistry(element);
	  return component && data(element).created;
	}

	function ready$1 (elements, callback) {
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

	var version = '0.15.3';

	assign(prop, props);
	assign(create$1, vdomElements);

	var previousGlobal = window.skate;
	exports.noConflict = function () {
	  window.skate = previousGlobal;
	  return this;
	};
	exports.version = '0.15.3';

	exports['default'] = skate;
	exports.create = create;
	exports.emit = emit;
	exports.factory = factory;
	exports.fragment = fragment;
	exports.init = init;
	exports.link = link$1;
	exports.prop = prop;
	exports.ready = ready$1;
	exports.skate = skate;
	exports.state = state;
	exports.symbols = symbols$2;
	exports.vdom = create$1;
	exports.version = version;

}));
//# sourceMappingURL=index.js.map