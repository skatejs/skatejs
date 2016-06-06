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

	babelHelpers.classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
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

	babelHelpers.inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	babelHelpers.possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
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

	function empty (val) {
	  return typeof val === 'undefined' || val === null;
	}

	var alwaysUndefinedIfEmptyOrNumber = function alwaysUndefinedIfEmptyOrNumber(val) {
	  return empty(val) ? undefined : Number(val);
	};
	var alwaysUndefinedIfEmptyOrString = function alwaysUndefinedIfEmptyOrString(val) {
	  return empty(val) ? undefined : String(val);
	};

	function create(def) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    args.unshift({}, def);
	    return assign.apply(null, args);
	  };
	}

	var array = create({
	  coerce: function coerce(val) {
	    return Array.isArray(val) ? val : [val];
	  },
	  default: function _default() {
	    return [];
	  },
	  deserialize: JSON.parse,
	  serialize: JSON.stringify
	});

	var boolean = create({
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
	});

	var number = create({
	  coerce: alwaysUndefinedIfEmptyOrNumber,
	  deserialize: alwaysUndefinedIfEmptyOrNumber,
	  serialize: alwaysUndefinedIfEmptyOrNumber
	});

	var string = create({
	  coerce: alwaysUndefinedIfEmptyOrString,
	  deserialize: alwaysUndefinedIfEmptyOrString,
	  serialize: alwaysUndefinedIfEmptyOrString
	});

var prop = Object.freeze({
	  create: create,
	  array: array,
	  boolean: boolean,
	  number: number,
	  string: string
	});

	var events = '____events';
	var props = '____props';
	var renderer = '____renderer';
	var shadowRoot = '____shadowRoot';

var symbols = Object.freeze({
		events: events,
		props: props,
		renderer: renderer,
		shadowRoot: shadowRoot
	});

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
	var create$2 = Object.create;

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
	  return create$2(null);
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

	/** @const */
	var symbols$2 = {
	  default: '__default',

	  placeholder: '__placeholder'
	};

	/**
	 * @param {string} name
	 * @return {string|undefined} The namespace to use for the attribute.
	 */
	var getNamespace = function getNamespace(name) {
	  if (name.lastIndexOf('xml:', 0) === 0) {
	    return 'http://www.w3.org/XML/1998/namespace';
	  }

	  if (name.lastIndexOf('xlink:', 0) === 0) {
	    return 'http://www.w3.org/1999/xlink';
	  }
	};

	/**
	 * Applies an attribute or property to a given Element. If the value is null
	 * or undefined, it is removed from the Element. Otherwise, the value is set
	 * as an attribute.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {?(boolean|number|string)=} value The attribute's value.
	 */
	var applyAttr = function applyAttr(el, name, value) {
	  if (value == null) {
	    el.removeAttribute(name);
	  } else {
	    var attrNS = getNamespace(name);
	    if (attrNS) {
	      el.setAttributeNS(attrNS, name, value);
	    } else {
	      el.setAttribute(name, value);
	    }
	  }
	};

	/**
	 * Applies a property to a given Element.
	 * @param {!Element} el
	 * @param {string} name The property's name.
	 * @param {*} value The property's value.
	 */
	var applyProp$1 = function applyProp(el, name, value) {
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
	    applyProp$1(el, name, value);
	  } else {
	    applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
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

	  var mutator = attributes$1[name] || attributes$1[symbols$2.default];
	  mutator(el, name, value);

	  attrs[name] = value;
	};

	/**
	 * A publicly mutable object to provide custom mutators for attributes.
	 * @const {!Object<string, function(!Element, string, *)>}
	 */
	var attributes$1 = createMap();

	// Special generic mutator that's called for any attribute that does not
	// have a specific mutator.
	attributes$1[symbols$2.default] = applyAttributeTyped;

	attributes$1[symbols$2.placeholder] = function () {};

	attributes$1['style'] = applyStyle;

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
	  var el = void 0;

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
	  var child = el.firstElementChild;

	  while (child) {
	    var key = getData(child).key;

	    if (key) {
	      map[key] = child;
	    }

	    child = child.nextElementSibling;
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

	/** @const */
	var notifications = {
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
	  this.created = notifications.nodesCreated && [];

	  /**
	   * @type {(Array<!Node>|undefined)}
	   */
	  this.deleted = notifications.nodesDeleted && [];
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
	    notifications.nodesCreated(this.created);
	  }

	  if (this.deleted && this.deleted.length > 0) {
	    notifications.nodesDeleted(this.deleted);
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
	    throw new Error('Cannot call currentElement() unless in patch.');
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
	    throw new Error(functionName + '() can not be called between ' + 'elementOpenStart() and elementOpenEnd().');
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
	    throw new Error(functionName + '() can only be called after calling ' + 'elementOpenStart().');
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
	    throw new Error('elementPlaceholder() requires a key.');
	  }
	};

	/**
	  * Makes sure that tags are correctly nested.
	  * @param {string} nodeName
	  * @param {string} tag
	  */
	var assertCloseMatchesOpenTag = function assertCloseMatchesOpenTag(nodeName, tag) {
	  if (nodeName !== tag) {
	    throw new Error('Received a call to close "' + tag + '" but "' + nodeName + '" was open.');
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
	 * Checks that a call to patchOuter actually patched the element.
	 * @param {?Node} node The node requested to be patched.
	 * @param {?Node} currentNode The currentNode after the patch.
	 */
	var assertPatchElementNotEmpty = function assertPatchElementNotEmpty(node, currentNode) {
	  if (node === currentNode) {
	    throw new Error('There must be exactly one top level call corresponding ' + 'to the patched element.');
	  }
	};

	/**
	 * Checks that a call to patchOuter actually patched the element.
	 * @param {?Node} node The node requested to be patched.
	 * @param {?Node} previousNode The previousNode after the patch.
	 */
	var assertPatchElementNoExtras = function assertPatchElementNoExtras(node, previousNode) {
	  if (node !== previousNode) {
	    throw new Error('There must be exactly one top level call corresponding ' + 'to the patched element.');
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

	/** @type {?Context} */
	var context = null;

	/** @type {?Node} */
	var currentNode = void 0;

	/** @type {?Node} */
	var currentParent = void 0;

	/** @type {?Element|?DocumentFragment} */
	var root = void 0;

	/** @type {?Document} */
	var doc = void 0;

	/**
	 * Sets up and restores a patch context, running the patch function with the
	 * provided data.
	 * @param {!Element|!DocumentFragment} node The Element or Document
	 *     where the patch should start.
	 * @param {!function(T)} fn The patching function.
	 * @param {T=} data An argument passed to fn.
	 * @template T
	 */
	var runPatch = function runPatch(node, fn, data) {
	  var prevContext = context;
	  var prevRoot = root;
	  var prevDoc = doc;
	  var prevCurrentNode = currentNode;
	  var prevCurrentParent = currentParent;
	  var previousInAttributes = false;
	  var previousInSkip = false;

	  context = new Context();
	  root = node;
	  doc = node.ownerDocument;

	  if (process.env.NODE_ENV !== 'production') {
	    previousInAttributes = setInAttributes(false);
	    previousInSkip = setInSkip(false);
	  }

	  fn(data);

	  if (process.env.NODE_ENV !== 'production') {
	    assertVirtualAttributesClosed();
	    setInAttributes(previousInAttributes);
	    setInSkip(previousInSkip);
	  }

	  context.notifyChanges();

	  context = prevContext;
	  root = prevRoot;
	  doc = prevDoc;
	  currentNode = prevCurrentNode;
	  currentParent = prevCurrentParent;
	};

	/**
	 * Patches the document starting at node with the provided function. This
	 * function may be called during an existing patch operation.
	 * @param {!Element|!DocumentFragment} node The Element or Document
	 *     to patch.
	 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
	 *     calls that describe the DOM.
	 * @param {T=} data An argument passed to fn to represent DOM state.
	 * @template T
	 */
	var patch = function patchInner(node, fn, data) {
	  runPatch(node, function (data) {
	    currentNode = node;
	    currentParent = node.parentNode;

	    enterNode();
	    fn(data);
	    exitNode();

	    if (process.env.NODE_ENV !== 'production') {
	      assertNoUnclosedTags(currentNode, node);
	    }
	  }, data);
	};

	/**
	 * Patches an Element with the the provided function. Exactly one top level
	 * element call should be made corresponding to `node`.
	 * @param {!Element} node The Element where the patch should start.
	 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
	 *     calls that describe the DOM. This should have at most one top level
	 *     element call.
	 * @param {T=} data An argument passed to fn to represent DOM state.
	 * @template T
	 */
	var patchOuter = function patchOuter(node, fn, data) {
	  runPatch(node, function (data) {
	    currentNode = /** @type {!Element} */{ nextSibling: node };
	    currentParent = node.parentNode;

	    fn(data);

	    if (process.env.NODE_ENV !== 'production') {
	      assertPatchElementNotEmpty(node, currentNode.nextSibling);
	      assertPatchElementNoExtras(node, currentNode);
	    }
	  }, data);
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

	  var node = void 0;

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
	  var key = void 0;

	  if (child === currentNode && keyMapValid) {
	    return;
	  }

	  if (data.attrs[symbols$2.placeholder] && node !== root) {
	    if (process.env.NODE_ENV !== 'production') {
	      console.warn('symbols.placeholder will be removed in Incremental DOM' + ' 0.5 use skip() instead');
	    }
	    return;
	  }

	  while (child !== currentNode) {
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
	  currentNode = null;
	};

	/**
	 * Changes to the next sibling of the current node.
	 */
	var nextNode = function nextNode() {
	  if (currentNode) {
	    currentNode = currentNode.nextSibling;
	  } else {
	    currentNode = currentParent.firstChild;
	  }
	};

	/**
	 * Changes to the parent of the current node, removing any unvisited children.
	 */
	var exitNode = function exitNode() {
	  clearUnvisitedDOM();

	  currentNode = currentParent;
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
	var coreElementOpen = function elementOpen(tag, key, statics) {
	  nextNode();
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
	var coreElementClose = function elementClose() {
	  if (process.env.NODE_ENV !== 'production') {
	    setInSkip(false);
	  }

	  exitNode();
	  return (/** @type {!Element} */currentNode
	  );
	};

	/**
	 * Makes sure the current node is a Text node and creates a Text node if it is
	 * not.
	 *
	 * @return {!Text} The corresponding Text Node.
	 */
	var coreText = function text() {
	  nextNode();
	  alignWithDOM('#text', null, null);
	  return (/** @type {!Text} */currentNode
	  );
	};

	/**
	 * Gets the current Element being patched.
	 * @return {!Element}
	 */
	var currentElement = function currentElement() {
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
	var skip$1 = function skip() {
	  if (process.env.NODE_ENV !== 'production') {
	    assertNoChildrenDeclaredYet('skip', currentNode);
	    setInSkip(true);
	  }
	  currentNode = currentParent.lastChild;
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
	 * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	var elementOpen$1 = function elementOpen(tag, key, statics, const_args) {
	  if (process.env.NODE_ENV !== 'production') {
	    assertNotInAttributes('elementOpen');
	    assertNotInSkip('elementOpen');
	  }

	  var node = coreElementOpen(tag, key, statics);
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

	    for (var _attr in newAttrs) {
	      updateAttribute(node, _attr, newAttrs[_attr]);
	      newAttrs[_attr] = undefined;
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
	var elementOpenStart$1 = function elementOpenStart(tag, key, statics) {
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
	var attr$1 = function attr(name, value) {
	  if (process.env.NODE_ENV !== 'production') {
	    assertInAttributes('attr');
	  }

	  argsBuilder.push(name, value);
	};

	/**
	 * Closes an open tag started with elementOpenStart.
	 * @return {!Element} The corresponding Element.
	 */
	var elementOpenEnd$1 = function elementOpenEnd() {
	  if (process.env.NODE_ENV !== 'production') {
	    assertInAttributes('elementOpenEnd');
	    setInAttributes(false);
	  }

	  var node = elementOpen$1.apply(null, argsBuilder);
	  argsBuilder.length = 0;
	  return node;
	};

	/**
	 * Closes an open virtual Element.
	 *
	 * @param {string} tag The element's tag.
	 * @return {!Element} The corresponding Element.
	 */
	var elementClose$1 = function elementClose(tag) {
	  if (process.env.NODE_ENV !== 'production') {
	    assertNotInAttributes('elementClose');
	  }

	  var node = coreElementClose();

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
	 * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	var elementVoid = function elementVoid(tag, key, statics, const_args) {
	  var node = elementOpen$1.apply(null, arguments);
	  elementClose$1.apply(null, arguments);
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
	 * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	var elementPlaceholder = function elementPlaceholder(tag, key, statics, const_args) {
	  if (process.env.NODE_ENV !== 'production') {
	    assertPlaceholderKeySpecified(key);
	    console.warn('elementPlaceholder will be removed in Incremental DOM 0.5' + ' use skip() instead');
	  }

	  elementOpen$1.apply(null, arguments);
	  skip$1();
	  return elementClose$1.apply(null, arguments);
	};

	/**
	 * Declares a virtual Text at this point in the document.
	 *
	 * @param {string|number|boolean} value The value of the Text.
	 * @param {...(function((string|number|boolean)):string)} const_args
	 *     Functions to format the value which are called only when the value has
	 *     changed.
	 * @return {!Text} The corresponding text node.
	 */
	var text$1 = function text(value, const_args) {
	  if (process.env.NODE_ENV !== 'production') {
	    assertNotInAttributes('text');
	    assertNotInSkip('text');
	  }

	  var node = coreText();
	  var data = getData(node);

	  if (data.text !== value) {
	    data.text = /** @type {string} */value;

	    var formatted = value;
	    for (var i = 1; i < arguments.length; i += 1) {
	      /*
	       * Call the formatter function directly to prevent leaking arguments.
	       * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
	       */
	      var fn = arguments[i];
	      formatted = fn(formatted);
	    }

	    node.data = formatted;
	  }

	  return node;
	};



	var IncrementalDOM = Object.freeze({
		patch: patch,
		patchInner: patch,
		patchOuter: patchOuter,
		currentElement: currentElement,
		skip: skip$1,
		elementVoid: elementVoid,
		elementOpenStart: elementOpenStart$1,
		elementOpenEnd: elementOpenEnd$1,
		elementOpen: elementOpen$1,
		elementClose: elementClose$1,
		elementPlaceholder: elementPlaceholder,
		text: text$1,
		attr: attr$1,
		symbols: symbols$2,
		attributes: attributes$1,
		applyAttr: applyAttr,
		applyProp: applyProp$1,
		notifications: notifications
	});

	var customElementsV1 = 'customElements' in window;
	var shadowDomV0 = 'createShadowRoot' in Element.prototype;
	var shadowDomV1 = 'attachShadow' in Element.prototype;

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
	var symbols$1 = symbols$2;
	var text = text$1;

	// Specify an environment for iDOM in case we haven't yet.

	if (typeof process === 'undefined') {
	  /* eslint no-undef: 0 */
	  process = { env: { NODE_ENV: 'production' } };
	}

	var applyDefault = attributes[symbols$1.default];
	var factories = {};

	// Attributes that are not handled by Incremental DOM.
	attributes.key = attributes.skip = attributes.statics = function () {};

	// Attributes that *must* be set via a property on all elements.
	attributes.checked = attributes.className = attributes.disabled = attributes.value = applyProp;

	// Default attribute applicator.
	attributes[symbols$1.default] = function (elem, name, value) {
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
	  var shouldBeContentTag = tname === 'slot' && !shadowDomV1 && shadowDomV0;

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
	var body = bind('body');
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
	var data = bind('data');
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
	var head = bind('head');
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

var vdom = Object.freeze({
	  create: create$1,
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
	  body: body,
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
	  data: data,
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
	  head: head,
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

	function data$1 (element) {
	  var namespace = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	  var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
	  return namespace && (data[namespace] || (data[namespace] = {})) || data;
	}

	function attributeChanged (Ctor) {
	  var attributeChanged = Ctor.attributeChanged;


	  return function (name, oldValue, newValue) {
	    var propertyName = data$1(this, 'attributeLinks')[name];

	    if (propertyName) {
	      var propData = data$1(this, 'api/property/' + propertyName);

	      // This ensures a property set doesn't cause the attribute changed
	      // handler to run again once we set this flag. This only ever has a
	      // chance to run when you set an attribute, it then sets a property and
	      // then that causes the attribute to be set again.
	      if (propData.syncingAttribute) {
	        propData.syncingAttribute = false;
	        return;
	      }

	      // Sync up the property.
	      var propOpts = this.constructor.props[propertyName];
	      propData.settingAttribute = true;
	      this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
	    }

	    if (attributeChanged) {
	      attributeChanged(this, { name: name, newValue: newValue, oldValue: oldValue });
	    }
	  };
	}

	var Component = function (_HTMLElement) {
	  babelHelpers.inherits(Component, _HTMLElement);

	  function Component() {
	    babelHelpers.classCallCheck(this, Component);

	    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Component).call(this));

	    var elemData = data$1(_this);
	    var readyCallbacks = elemData.readyCallbacks;
	    var Ctor = _this.constructor;
	    var _this$constructor = _this.constructor;
	    var definedAttribute = _this$constructor.definedAttribute;
	    var events$$ = _this$constructor.events;
	    var created = _this$constructor.created;
	    var props$$ = _this$constructor.props;
	    var ready = _this$constructor.ready;
	    var renderedAttribute = _this$constructor.renderedAttribute;

	    var renderer$$ = Ctor[renderer];

	    if (elemData.created) {
	      return babelHelpers.possibleConstructorReturn(_this);
	    }

	    elemData.created = true;

	    if (props$$) {
	      Ctor[props](_this);
	    }

	    if (events$$) {
	      Ctor[events](_this);
	    }

	    if (created) {
	      created(_this);
	    }

	    if (renderer$$ && !_this.hasAttribute(renderedAttribute)) {
	      renderer$$(_this);
	    }

	    if (ready) {
	      ready(_this);
	    }

	    if (!_this.hasAttribute(definedAttribute)) {
	      _this.setAttribute(definedAttribute, '');
	    }

	    if (readyCallbacks) {
	      readyCallbacks.forEach(function (cb) {
	        return cb(_this);
	      });
	      delete elemData.readyCallbacks;
	    }
	    return _this;
	  }

	  return Component;
	}(HTMLElement);

	Component.definedAttribute = 'defined';
	Component.events = {};
	Component.extends = null;
	Component.observedAttributes = [];
	Component.props = {};
	Component.renderedAttribute = 'rendered';

	var elProto = window.HTMLElement.prototype;
	var nativeMatchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;

	// Only IE9 has this msMatchesSelector bug, but best to detect it.
	var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call(document.createElement('div'), 'div');

	function matches$1 (element, selector) {
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
	    var current = e.path ? e.path[0] : e.target;
	    var selector = parsed.selector;
	    while (current && current !== elem.parentNode) {
	      if (matches$1(current, selector)) {
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

	function events$1(opts) {
	  var events = opts.events || {};
	  return function (elem) {
	    for (var name in events) {
	      bindEvent(elem, name, events[name]);
	    }
	  };
	}

	var patch$1 = patch;


	function createRenderer (Ctor) {
	  var render = Ctor.render;


	  return function (elem) {
	    if (!render) {
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

	    patch$1(elem[shadowRoot], render, elem);
	  };
	}

	function dashCase (str) {
	  return str.split(/([A-Z])/).reduce(function (one, two, idx) {
	    var dash = !one || idx % 2 === 0 ? '' : '-';
	    return '' + one + dash + two.toLowerCase();
	  });
	}

	function getOwnPropertyDescriptors (obj) {
	  return Object.getOwnPropertyNames(obj || {}).reduce(function (prev, curr) {
	    prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
	    return prev;
	  }, {});
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

	function getAllPropertyDescriptors (obj) {
	  return protos(obj || {}).reduce(function (result, proto) {
	    var descriptors = getOwnPropertyDescriptors(proto);
	    Object.getOwnPropertyNames(descriptors).reduce(function (result, name) {
	      result[name] = descriptors[name];
	      return result;
	    }, result);
	    return result;
	  }, {});
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

	function emit (elem, name) {
	  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  /* jshint expr: true */
	  opts.bubbles === undefined && (opts.bubbles = true);
	  opts.cancelable === undefined && (opts.cancelable = true);
	  return elem.disabled ? true : elem.dispatchEvent(createCustomEvent(name, opts));
	}

	// Symbol() wasn't transpiling properly.
	var $debounce = '____debouncedRender';

	function getDefaultValue(elem, name, opts) {
	  return typeof opts.default === 'function' ? opts.default(elem, { name: name }) : opts.default;
	}

	function getInitialValue(elem, name, opts) {
	  return typeof opts.initial === 'function' ? opts.initial(elem, { name: name }) : opts.initial;
	}

	function createNativePropertyDefinition(name, opts) {
	  var prop = {
	    configurable: true,
	    enumerable: true
	  };

	  prop.created = function (elem) {
	    var propData = data$1(elem, 'api/property/' + name);
	    var attributeName = opts.attribute;
	    var initialValue = elem[name];
	    var shouldSyncAttribute = false;

	    // Store property to attribute link information.
	    data$1(elem, 'attributeLinks')[attributeName] = name;
	    data$1(elem, 'propertyLinks')[name] = attributeName;

	    // Set up initial value if it wasn't specified.
	    if (empty(initialValue)) {
	      if (attributeName && elem.hasAttribute(attributeName)) {
	        initialValue = opts.deserialize(elem.getAttribute(attributeName));
	      } else if ('initial' in opts) {
	        initialValue = getInitialValue(elem, name, opts);
	        shouldSyncAttribute = true;
	      } else if ('default' in opts) {
	        initialValue = getDefaultValue(elem, name, opts);
	      }
	    }

	    if (shouldSyncAttribute) {
	      prop.set.call(elem, initialValue);
	    } else {
	      propData.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;
	    }
	  };

	  prop.get = function () {
	    var propData = data$1(this, 'api/property/' + name);
	    var internalValue = propData.internalValue;

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
	    var propData = data$1(this, 'api/property/' + name);
	    var oldValue = propData.oldValue;

	    var shouldRemoveAttribute = false;

	    if (empty(oldValue)) {
	      oldValue = null;
	    }

	    if (empty(newValue)) {
	      newValue = getDefaultValue(this, name, opts);
	      shouldRemoveAttribute = true;
	    }

	    if (typeof opts.coerce === 'function') {
	      newValue = opts.coerce(newValue);
	    }

	    var propertyHasChanged = newValue !== oldValue;
	    if (propertyHasChanged && opts.event) {
	      var canceled = !emit(this, String(opts.event), {
	        bubbles: false,
	        detail: { name: name, oldValue: oldValue, newValue: newValue }
	      });

	      if (canceled) {
	        return;
	      }
	    }

	    propData.internalValue = newValue;

	    var changeData = { name: name, newValue: newValue, oldValue: oldValue };

	    if (typeof opts.set === 'function') {
	      opts.set(this, changeData);
	    }

	    // Re-render on property updates if the should-update check passes.
	    if (prop.render(this, changeData)) {
	      var deb = this[$debounce] || (this[$debounce] = debounce(this.constructor[renderer]));
	      deb(this);
	    }

	    propData.oldValue = newValue;

	    // Link up the attribute.
	    var attributeName = data$1(this, 'propertyLinks')[name];
	    if (attributeName && !propData.settingAttribute) {
	      var serializedValue = opts.serialize(newValue);
	      propData.syncingAttribute = true;
	      if (shouldRemoveAttribute || empty(serializedValue)) {
	        this.removeAttribute(attributeName);
	      } else {
	        this.setAttribute(attributeName, serializedValue);
	      }
	    }

	    // Allow the attribute to be linked again.
	    propData.settingAttribute = false;
	  };

	  return prop;
	}

	function initProps (opts) {
	  opts = opts || {};

	  if (typeof opts === 'function') {
	    opts = { coerce: opts };
	  }

	  return function (name) {
	    return createNativePropertyDefinition(name, assign({
	      default: null,
	      deserialize: function deserialize(value) {
	        return value;
	      },
	      serialize: function serialize(value) {
	        return value;
	      }
	    }, opts));
	  };
	}

	// Ensures that definitions passed as part of the constructor are functions
	// that return property definitions used on the element.
	function ensurePropertyFunctions(Ctor) {
	  var props = Ctor.props;
	  var names = Object.keys(props || {});
	  return names.reduce(function (descriptors, descriptorName) {
	    descriptors[descriptorName] = props[descriptorName];
	    if (typeof descriptors[descriptorName] !== 'function') {
	      descriptors[descriptorName] = initProps(descriptors[descriptorName]);
	    }
	    return descriptors;
	  }, {});
	}

	// Ensures the property definitions are transformed to objects that can be used
	// to create properties on the element.
	function ensurePropertyDefinitions(Ctor) {
	  var props = ensurePropertyFunctions(Ctor);
	  return Object.keys(props).reduce(function (descriptors, descriptorName) {
	    descriptors[descriptorName] = props[descriptorName](descriptorName);
	    return descriptors;
	  }, {});
	}

	// Makes a function / constructor for the custom element that automates the
	// boilerplate of ensuring the parent constructor is called first and ensures
	// that the element is returned at the end.
	function createConstructor(name, Ctor) {
	  if ((typeof Ctor === 'undefined' ? 'undefined' : babelHelpers.typeof(Ctor)) === 'object') {
	    var opts = getAllPropertyDescriptors(Ctor);
	    var prot = getOwnPropertyDescriptors(Ctor.prototype);

	    // The prototype is non-configurable, so we remove it before it tries to
	    // define it.
	    delete opts.prototype;

	    Ctor = function (_Component) {
	      babelHelpers.inherits(Ctor, _Component);

	      function Ctor() {
	        babelHelpers.classCallCheck(this, Ctor);
	        return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Ctor).apply(this, arguments));
	      }

	      return Ctor;
	    }(Component);

	    Object.defineProperties(Ctor, opts);
	    Object.defineProperties(Ctor.prototype, prot);
	  }

	  Ctor.prototype.attributeChangedCallback = attributeChanged(Ctor);
	  Ctor.prototype.connectedCallback = function () {
	    Ctor.attached && Ctor.attached(this);
	  };
	  Ctor.prototype.disconnectedCallback = function () {
	    Ctor.detached && Ctor.detached(this);
	  };

	  // WebKit currently doesn't allow you to overwrite "name" so we have to use
	  // "id" for cross-browser compat right now.
	  Object.defineProperty(Ctor, 'id', { value: name });

	  // We do set "name" in browsers that support it, though.
	  if (Object.getOwnPropertyDescriptor(Ctor, 'name').configurable) {
	    Object.defineProperty(Ctor, 'name', { value: name });
	  }

	  return Ctor;
	}

	// Ensures linked properties that have linked attributes are pre-formatted to
	// the attribute name in which they are linked.
	function formatLinkedAttributes(Ctor) {
	  var observedAttributes = Ctor.observedAttributes;
	  var props = Ctor.props;


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

	  Ctor.observedAttributes = observedAttributes;
	}

	function createInitProps(Ctor) {
	  var props = ensurePropertyDefinitions(Ctor);

	  return function (elem) {
	    if (!props) {
	      return;
	    }

	    Object.keys(props).forEach(function (name) {
	      var prop = props[name];
	      prop.created(elem);

	      // https://bugs.webkit.org/show_bug.cgi?id=49739
	      //
	      // When Webkit fixes that bug so that native property accessors can be
	      // retrieved, we can move defining the property to the prototype and away
	      // from having to do if for every instance as all other browsers support
	      // this.
	      Object.defineProperty(elem, name, prop);
	    });
	  };
	}

	function define (name, Ctor) {
	  Ctor = createConstructor(name, Ctor);
	  formatLinkedAttributes(Ctor);
	  Ctor[events] = events$1(Ctor);
	  Ctor[props] = createInitProps(Ctor);
	  Ctor[renderer] = createRenderer(Ctor);
	  if (customElementsV1) {
	    window.customElements.define(name, Ctor);
	    return window.customElements.get(name);
	  } else {
	    throw new Error('Skate requires custom element v1 support. Please include a polyfill for this browser.');
	  }
	}

	function factory (opts) {
	  return function (name) {
	    return define(name, opts);
	  };
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
	  assign(elem, newState);
	  if (elem.constructor.render) {
	    elem.constructor[renderer](elem);
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

	function ready (elem, done) {
	  var info = data$1(elem);
	  if (info.created) {
	    done(elem);
	  } else if (info.readyCallbacks) {
	    info.readyCallbacks.push(done);
	  } else {
	    info.readyCallbacks = [done];
	  }
	}

	var version = '0.15.3';

	var previousGlobal = window.skate;
	exports.noConflict = function () {
	  window.skate = previousGlobal;
	  return this;
	};
	exports.version = '0.15.3';

	exports.define = define;
	exports.emit = emit;
	exports.factory = factory;
	exports.link = link$1;
	exports.prop = prop;
	exports.ready = ready;
	exports.state = state;
	exports.symbols = symbols;
	exports.vdom = vdom;
	exports.version = version;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map