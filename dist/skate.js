(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* (The MIT License)
 *
 * Copyright (c) 2012 Brandon Benvie <http://bbenvie.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the 'Software'), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included with all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY  CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Original WeakMap implementation by Gozala @ https://gist.github.com/1269991
// Updated and bugfixed by Raynos @ https://gist.github.com/1638059
// Expanded by Benvie @ https://github.com/Benvie/harmony-collections

void function(global, undefined_, undefined){
  var getProps = Object.getOwnPropertyNames,
      defProp  = Object.defineProperty,
      toSource = Function.prototype.toString,
      create   = Object.create,
      hasOwn   = Object.prototype.hasOwnProperty,
      funcName = /^\n?function\s?(\w*)?_?\(/;


  function define(object, key, value){
    if (typeof key === 'function') {
      value = key;
      key = nameOf(value).replace(/_$/, '');
    }
    return defProp(object, key, { configurable: true, writable: true, value: value });
  }

  function nameOf(func){
    return typeof func !== 'function'
          ? '' : 'name' in func
          ? func.name : toSource.call(func).match(funcName)[1];
  }

  // ############
  // ### Data ###
  // ############

  var Data = (function(){
    var dataDesc = { value: { writable: true, value: undefined } },
        datalock = 'return function(k){if(k===s)return l}',
        uids     = create(null),

        createUID = function(){
          var key = Math.random().toString(36).slice(2);
          return key in uids ? createUID() : uids[key] = key;
        },

        globalID = createUID(),

        storage = function(obj){
          if (hasOwn.call(obj, globalID))
            return obj[globalID];

          if (!Object.isExtensible(obj))
            throw new TypeError("Object must be extensible");

          var store = create(null);
          defProp(obj, globalID, { value: store });
          return store;
        };

    // common per-object storage area made visible by patching getOwnPropertyNames'
    define(Object, function getOwnPropertyNames(obj){
      var props = getProps(obj);
      if (hasOwn.call(obj, globalID))
        props.splice(props.indexOf(globalID), 1);
      return props;
    });

    function Data(){
      var puid = createUID(),
          secret = {};

      this.unlock = function(obj){
        var store = storage(obj);
        if (hasOwn.call(store, puid))
          return store[puid](secret);

        var data = create(null, dataDesc);
        defProp(store, puid, {
          value: new Function('s', 'l', datalock)(secret, data)
        });
        return data;
      }
    }

    define(Data.prototype, function get(o){ return this.unlock(o).value });
    define(Data.prototype, function set(o, v){ this.unlock(o).value = v });

    return Data;
  }());


  var WM = (function(data){
    var validate = function(key){
      if (key == null || typeof key !== 'object' && typeof key !== 'function')
        throw new TypeError("Invalid WeakMap key");
    }

    var wrap = function(collection, value){
      var store = data.unlock(collection);
      if (store.value)
        throw new TypeError("Object is already a WeakMap");
      store.value = value;
    }

    var unwrap = function(collection){
      var storage = data.unlock(collection).value;
      if (!storage)
        throw new TypeError("WeakMap is not generic");
      return storage;
    }

    var initialize = function(weakmap, iterable){
      if (iterable !== null && typeof iterable === 'object' && typeof iterable.forEach === 'function') {
        iterable.forEach(function(item, i){
          if (item instanceof Array && item.length === 2)
            set.call(weakmap, iterable[i][0], iterable[i][1]);
        });
      }
    }


    function WeakMap(iterable){
      if (this === global || this == null || this === WeakMap.prototype)
        return new WeakMap(iterable);

      wrap(this, new Data);
      initialize(this, iterable);
    }

    function get(key){
      validate(key);
      var value = unwrap(this).get(key);
      return value === undefined_ ? undefined : value;
    }

    function set(key, value){
      validate(key);
      // store a token for explicit undefined so that "has" works correctly
      unwrap(this).set(key, value === undefined ? undefined_ : value);
    }

    function has(key){
      validate(key);
      return unwrap(this).get(key) !== undefined;
    }

    function delete_(key){
      validate(key);
      var data = unwrap(this),
          had = data.get(key) !== undefined;
      data.set(key, undefined);
      return had;
    }

    function toString(){
      unwrap(this);
      return '[object WeakMap]';
    }

    try {
      var src = ('return '+delete_).replace('e_', '\\u0065'),
          del = new Function('unwrap', 'validate', src)(unwrap, validate);
    } catch (e) {
      var del = delete_;
    }

    var src = (''+Object).split('Object');
    var stringifier = function toString(){
      return src[0] + nameOf(this) + src[1];
    };

    define(stringifier, stringifier);

    var prep = { __proto__: [] } instanceof Array
      ? function(f){ f.__proto__ = stringifier }
      : function(f){ define(f, stringifier) };

    prep(WeakMap);

    [toString, get, set, has, del].forEach(function(method){
      define(WeakMap.prototype, method);
      prep(method);
    });

    return WeakMap;
  }(new Data));

  var defaultCreator = Object.create
    ? function(){ return Object.create(null) }
    : function(){ return {} };

  function createStorage(creator){
    var weakmap = new WM;
    creator || (creator = defaultCreator);

    function storage(object, value){
      if (value || arguments.length === 2) {
        weakmap.set(object, value);
      } else {
        value = weakmap.get(object);
        if (value === undefined) {
          value = creator(object);
          weakmap.set(object, value);
        }
      }
      return value;
    }

    return storage;
  }


  if (typeof module !== 'undefined') {
    module.exports = WM;
  } else if (typeof exports !== 'undefined') {
    exports.WeakMap = WM;
  } else if (!('WeakMap' in global)) {
    global.WeakMap = WM;
  }

  WM.createStorage = createStorage;
  if (global.WeakMap)
    global.WeakMap.createStorage = createStorage;
}((0, eval)('this'));

},{}],2:[function(require,module,exports){
"use strict";

var ATTR_IGNORE = exports.ATTR_IGNORE = "data-skate-ignore";
},{}],3:[function(require,module,exports){
"use strict";

require('../node_modules/weakmap/weakmap');

var map = new WeakMap();

exports.default = function (element) {
  var data = map.get(element);

  if (!data) {
    data = {};
    map.set(element, data);
  }

  return {
    get: function (name) {
      return data[name];
    },

    set: function (name, value) {
      data[name] = value;
      return this;
    }
  };
};
},{"../node_modules/weakmap/weakmap":1}],4:[function(require,module,exports){
"use strict";

var globals = require('./globals').default;
var initElements = require('./lifecycle').initElements;
var removeElements = require('./lifecycle').removeElements;
var MutationObserver = require('./mutation-observer').default;
var getClosestIgnoredElement = require('./utils').getClosestIgnoredElement;

/**
 * The document observer handler.
 *
 * @param {Array} mutations The mutations to handle.
 *
 * @returns {undefined}
 */
function documentObserverHandler(mutations) {
  var mutationsLen = mutations.length;

  for (var a = 0; a < mutationsLen; a++) {
    var mutation = mutations[a];
    var addedNodes = mutation.addedNodes;
    var removedNodes = mutation.removedNodes;

    // Since siblings are batched together, we check the first node's parent
    // node to see if it is ignored. If it is then we don't process any added
    // nodes. This prevents having to check every node.
    if (addedNodes && addedNodes.length && !getClosestIgnoredElement(addedNodes[0].parentNode)) {
      initElements(addedNodes);
    }

    // We can't check batched nodes here because they won't have a parent node.
    if (removedNodes && removedNodes.length) {
      removeElements(removedNodes);
    }
  }
}

/**
 * Creates a new mutation observer for listening to Skate definitions for the
 * document.
 *
 * @param {Element} root The element to observe.
 *
 * @returns {MutationObserver}
 */
function createDocumentObserver() {
  var observer = new MutationObserver(documentObserverHandler);

  // Observe after the DOM content has loaded.
  observer.observe(document, {
    childList: true,
    subtree: true
  });

  return observer;
}

exports.default = {
  register: function (fixIe) {
    // IE has issues with reporting removedNodes correctly. See the polyfill for
    // details. If we fix IE, we must also re-define the document observer.
    if (fixIe) {
      MutationObserver.fixIe();
      this.unregister();
    }

    if (!globals.observer) {
      globals.observer = createDocumentObserver();
    }

    return this;
  },

  unregister: function () {
    if (globals.observer) {
      globals.observer.disconnect();
      globals.observer = undefined;
    }

    return this;
  }
};
},{"./globals":5,"./lifecycle":6,"./mutation-observer":7,"./utils":10}],5:[function(require,module,exports){
"use strict";

if (!window.__skate) {
  window.__skate = {
    observer: undefined,
    registry: {}
  };
}

exports.default = window.__skate;
},{}],6:[function(require,module,exports){
"use strict";

var ATTR_IGNORE = require('./constants').ATTR_IGNORE;
var data = require('./data').default;
var MutationObserver = require('./mutation-observer').default;
var registry = require('./registry').default;
var camelCase = require('./utils').camelCase;
var hasOwn = require('./utils').hasOwn;
var inherit = require('./utils').inherit;
var objEach = require('./utils').objEach;
var supportsNativeCustomElements = require('./utils').supportsNativeCustomElements;

var elProto = window.HTMLElement.prototype;
var matchesSelector = (elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector);

/**
 * Parses an event definition and returns information about it.
 *
 * @param {String} e The event to parse.
 *
 * @returns {Object]}
 */
function parseEvent(e) {
  var parts = e.split(" ");
  return {
    name: parts.shift(),
    delegate: parts.join(" ")
  };
}

/**
 * Sets the defined attributes to their default values, if specified.
 *
 * @param {Element} target The web component element.
 * @param {Object} component The web component definition.
 *
 * @returns {undefined}
 */
function initAttributes(target, component) {
  var componentAttributes = component.attributes;

  if (typeof componentAttributes !== "object") {
    return;
  }

  for (var attribute in componentAttributes) {
    if (hasOwn(componentAttributes, attribute) && hasOwn(componentAttributes[attribute], "value") && !target.hasAttribute(attribute)) {
      var value = componentAttributes[attribute].value;
      value = typeof value === "function" ? value(target) : value;
      target.setAttribute(attribute, value);
    }
  }
}

/**
 * Defines a property that proxies the specified attribute.
 *
 * @param {Element} target The web component element.
 * @param {String} attribute The attribute name to proxy.
 *
 * @returns {undefined}
 */
function defineAttributeProperty(target, attribute) {
  Object.defineProperty(target, camelCase(attribute), {
    get: function () {
      return this.getAttribute(attribute);
    },
    set: function (value) {
      if (value === undefined) {
        this.removeAttribute(attribute);
      } else {
        this.setAttribute(attribute, value);
      }
    }
  });
}

/**
 * Adds links from attributes to properties.
 *
 * @param {Element} target The web component element.
 * @param {Object} component The web component definition.
 *
 * @returns {undefined}
 */
function addAttributeToPropertyLinks(target, component) {
  var componentAttributes = component.attributes;

  if (typeof componentAttributes !== "object") {
    return;
  }

  for (var attribute in componentAttributes) {
    if (hasOwn(componentAttributes, attribute) && !hasOwn(target, attribute)) {
      defineAttributeProperty(target, attribute);
    }
  }
}

function triggerAttributeChanged(target, component, data) {
  var callback;
  var type;
  var name = data.name;
  var newValue = data.newValue;
  var oldValue = data.oldValue;
  var newValueIsString = typeof newValue === "string";
  var oldValueIsString = typeof oldValue === "string";
  var attrs = component.attributes;
  var specific = attrs && attrs[name];

  if (!oldValueIsString && newValueIsString) {
    type = "created";
  } else if (oldValueIsString && newValueIsString) {
    type = "updated";
  } else if (oldValueIsString && !newValueIsString) {
    type = "removed";
  }

  if (specific && typeof specific[type] === "function") {
    callback = specific[type];
  } else if (specific && typeof specific.fallback === "function") {
    callback = specific.fallback;
  } else if (typeof specific === "function") {
    callback = specific;
  } else if (typeof attrs === "function") {
    callback = attrs;
  }

  // Ensure values are null if undefined.
  newValue = newValue === undefined ? null : newValue;
  oldValue = oldValue === undefined ? null : oldValue;

  // There may still not be a callback.
  if (callback) {
    callback(target, {
      type: type,
      name: name,
      newValue: newValue,
      oldValue: oldValue
    });
  }
}

function triggerAttributesCreated(target, component) {
  var a;
  var attrs = target.attributes;
  var attrsCopy = [];
  var attrsLen = attrs.length;

  for (a = 0; a < attrsLen; a++) {
    attrsCopy.push(attrs[a]);
  }

  // In default web components, attribute changes aren't triggered for
  // attributes that already exist on an element when it is bound. This sucks
  // when you want to reuse and separate code for attributes away from your
  // lifecycle callbacks. Skate will initialise each attribute by calling the
  // created callback for the attributes that already exist on the element.
  for (a = 0; a < attrsLen; a++) {
    var attr = attrsCopy[a];
    triggerAttributeChanged(target, component, {
      name: attr.nodeName,
      newValue: attr.value || attr.nodeValue
    });
  }
}

function addAttributeListeners(target, component) {
  var attrs = target.attributes;

  if (!component.attributes || supportsNativeCustomElements()) {
    return;
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var name = mutation.attributeName;
      var attr = attrs[name];

      triggerAttributeChanged(target, component, {
        name: name,
        newValue: attr && (attr.value || attr.nodeValue),
        oldValue: mutation.oldValue
      });
    });
  });

  observer.observe(target, {
    attributes: true,
    attributeOldValue: true
  });
}

/**
 * Binds event listeners for the specified event handlers.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function addEventListeners(target, component) {
  if (typeof component.events !== "object") {
    return;
  }

  function makeHandler(handler, delegate) {
    return function (e) {
      // If we're not delegating, trigger directly on the component element.
      if (!delegate) {
        return handler(target, e, target);
      }

      // If we're delegating, but the target doesn't match, then we've have
      // to go up the tree until we find a matching ancestor or stop at the
      // component element, or document. If a matching ancestor is found, the
      // handler is triggered on it.
      var current = e.target;

      while (current && current !== document && current !== target.parentNode) {
        if (matchesSelector.call(current, delegate)) {
          return handler(target, e, current);
        }

        current = current.parentNode;
      }
    };
  }

  objEach(component.events, function (handler, name) {
    var evt = parseEvent(name);
    var useCapture = !!evt.delegate && (evt.name === "blur" || evt.name === "focus");
    target.addEventListener(evt.name, makeHandler(handler, evt.delegate), useCapture);
  });
}

/**
 * Triggers the created lifecycle callback.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function triggerCreated(target, component) {
  var targetData = data(target);

  if (targetData.get("created")) {
    return;
  }

  targetData.set("created", true);

  // TODO: This doesn't need to happen if using native.
  inherit(target, component.prototype, true);

  // We use the unresolved / resolved attributes to flag whether or not the
  // element has been templated or not.
  if (component.template && !targetData.get("templated")) {
    component.template(target);
    targetData.set("templated", true);
  }

  addEventListeners(target, component);
  addAttributeListeners(target, component);
  addAttributeToPropertyLinks(target, component);
  initAttributes(target, component);
  triggerAttributesCreated(target, component);

  if (component.created) {
    component.created(target);
  }
}

/**
 * Triggers the attached lifecycle callback.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function triggerAttached(target, component) {
  var targetData = data(target);

  if (targetData.get("attached")) {
    return;
  }

  if (!document.contains(target)) {
    return;
  }

  targetData.set("attached", true);
  target.removeAttribute(component.unresolvedAttribute);
  target.setAttribute(component.resolvedAttribute, "");

  if (component.attached) {
    component.attached(target);
  }

  targetData.set("detached", false);
}

/**
 * Triggers the detached lifecycle callback.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function triggerDetached(target, component) {
  var targetData = data(target);

  if (targetData.get("detached")) {
    return;
  }

  targetData.set("detached", true);

  if (component.detached) {
    component.detached(target);
  }

  targetData.set("attached", false);
}

/**
 * Triggers the entire element lifecycle if it's not being ignored.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function triggerLifecycle(target, component) {
  triggerCreated(target, component);
  triggerAttached(target, component);
}

/**
 * Initialises a set of elements.
 *
 * @param {DOMNodeList | Array} elements A traversable set of elements.
 *
 * @returns {undefined}
 */
function initElements(elements) {
  var elementsLen = elements.length;

  for (var a = 0; a < elementsLen; a++) {
    var element = elements[a];

    if (element.nodeType !== 1 || element.attributes[ATTR_IGNORE]) {
      continue;
    }

    var currentNodeDefinitions = registry.getForElement(element);
    var currentNodeDefinitionsLength = currentNodeDefinitions.length;

    for (var b = 0; b < currentNodeDefinitionsLength; b++) {
      triggerLifecycle(element, currentNodeDefinitions[b]);
    }

    var elementChildNodes = element.childNodes;
    var elementChildNodesLen = elementChildNodes.length;

    if (elementChildNodesLen) {
      initElements(elementChildNodes);
    }
  }
}

/**
 * Triggers the remove lifecycle callback on all of the elements.
 *
 * @param {DOMNodeList} elements The elements to trigger the remove lifecycle
 * callback on.
 *
 * @returns {undefined}
 */
function removeElements(elements) {
  var len = elements.length;

  for (var a = 0; a < len; a++) {
    var element = elements[a];

    if (element.nodeType !== 1) {
      continue;
    }

    removeElements(element.childNodes);

    var definitions = registry.getForElement(element);
    var definitionsLen = definitions.length;

    for (var b = 0; b < definitionsLen; b++) {
      triggerDetached(element, definitions[b]);
    }
  }
}

exports.initElements = initElements;
exports.removeElements = removeElements;
exports.triggerAttached = triggerAttached;
exports.triggerAttributeChanged = triggerAttributeChanged;
exports.triggerCreated = triggerCreated;
exports.triggerDetached = triggerDetached;
},{"./constants":2,"./data":3,"./mutation-observer":7,"./registry":8,"./utils":10}],7:[function(require,module,exports){
"use strict";

var debounce = require('./utils').debounce;
var objEach = require('./utils').objEach;

var elProto = window.HTMLElement.prototype;
var elProtoContains = window.HTMLElement.prototype.contains;
var NativeMutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
var isFixingIe = false;
var isIe = window.navigator.userAgent.indexOf("Trident") > -1;

/**
 * Returns whether or not the source element contains the target element.
 * This is for browsers that don't support Element.prototype.contains on an
 * HTMLUnknownElement.
 *
 * @param {HTMLElement} source The source element.
 * @param {HTMLElement} target The target element.
 *
 * @returns {Boolean}
 */
function elementContains(source, target) {
  if (source.nodeType !== 1) {
    return false;
  }

  return source.contains ? source.contains(target) : elProtoContains.call(source, target);
}

/**
 * Creates a new mutation record.
 *
 * @param {Element} target The HTML element that was affected.
 * @param {String} type The type of mutation.
 *
 * @returns {Object}
 */
function newMutationRecord(target, type) {
  return {
    addedNodes: null,
    attributeName: null,
    attributeNamespace: null,
    nextSibling: null,
    oldValue: null,
    previousSibling: null,
    removedNodes: null,
    target: target,
    type: type || "childList"
  };
}

/**
 * Takes an element and recursively saves it's tree structure on each element so
 * that they can be restored later after IE screws things up.
 *
 * @param {Node} node The node to save the tree for.
 *
 * @returns {undefined}
 */
function walkTree(node, cb) {
  var childNodes = node.childNodes;

  if (!childNodes) {
    return;
  }

  var childNodesLen = childNodes.length;

  for (var a = 0; a < childNodesLen; a++) {
    var childNode = childNodes[a];
    cb(childNode);
    walkTree(childNode, cb);
  }
}

// Mutation Observer "Polyfill"
// ----------------------------

/**
 * This "polyfill" only polyfills what we need for Skate to function. It
 * batches updates and does the bare minimum during synchronous operation
 * which make mutation event performance bearable. The rest is batched on the
 * next tick. Like mutation observers, each mutation is divided into sibling
 * groups for each parent that had mutations. All attribute mutations are
 * batched into separate records regardless of the element they occured on.
 *
 * @param {Function} callback The callback to execute with the mutation info.
 *
 * @returns {undefined}
 */
function MutationObserver(callback) {
  if (NativeMutationObserver && !isFixingIe) {
    return new NativeMutationObserver(callback);
  }

  this.callback = callback;
  this.elements = [];
}

/**
 * IE 11 has a bug that prevents descendant nodes from being reported as removed
 * to a mutation observer in IE 11 if an ancestor node's innerHTML is reset.
 * This same bug also happens when using Mutation Events in IE 9 / 10. Because of
 * this, we must ensure that observers and events get triggered properly on
 * those descendant nodes. In order to do this we have to override `innerHTML`
 * and then manually trigger an event.
 *
 * See: https://connect.microsoft.com/IE/feedback/details/817132/ie-11-childnodes-are-missing-from-mutationobserver-mutations-removednodes-after-setting-innerhtml
 *
 * @returns {undefined}
 */
MutationObserver.fixIe = function () {
  // Fix once only if we need to.
  if (!isIe || isFixingIe) {
    return;
  }

  // We have to call the old innerHTML getter and setter.
  var oldInnerHtml = Object.getOwnPropertyDescriptor(elProto, "innerHTML");

  // This redefines the innerHTML property so that we can ensure that events
  // are properly triggered.
  Object.defineProperty(elProto, "innerHTML", {
    get: function () {
      return oldInnerHtml.get.call(this);
    },
    set: function (html) {
      walkTree(this, function (node) {
        var mutationEvent = document.createEvent("MutationEvent");
        mutationEvent.initMutationEvent("DOMNodeRemoved", true, false, null, null, null, null, null);
        node.dispatchEvent(mutationEvent);
      });

      oldInnerHtml.set.call(this, html);
    }
  });

  // Flag so the polyfill is used for all subsequent Mutation Observer objects.
  isFixingIe = true;
};

Object.defineProperty(MutationObserver, "isFixingIe", {
  get: function () {
    return isFixingIe;
  }
});

MutationObserver.prototype = {
  observe: function (target, options) {
    function addEventToBatch(e) {
      batchedEvents.push(e);
      batchEvents();
    }

    function batchEvent(e) {
      var eTarget = e.target;

      // In some test environments, e.target has been nulled after the tests
      // are done and a batch is still processing.
      if (!eTarget) {
        return;
      }

      var eType = e.type;
      var eTargetParent = eTarget.parentNode;

      if (!canTriggerInsertOrRemove(eTargetParent)) {
        return;
      }

      // The same bug that affects IE 11 also affects IE 9 / 10 with Mutation
      // Events.
      //
      // IE 11 bug: https://connect.microsoft.com/IE/feedback/details/817132/ie-11-childnodes-are-missing-from-mutationobserver-mutations-removednodes-after-setting-innerhtml
      var shouldWorkAroundIeRemoveBug = isFixingIe && eType === "DOMNodeRemoved";
      var isDescendant = lastBatchedElement && elementContains(lastBatchedElement, eTarget);

      // This checks to see if the element is contained in the last batched
      // element. If it is, then we don't batch it because elements are
      // batched into first-children of a given parent. However, IE is (of
      // course) an exception to this and destroys the DOM tree heirarchy
      // before the callback gets fired if the element was removed. Because of
      // this, we have to let through all descendants that had the event
      // triggered on it.
      if (!shouldWorkAroundIeRemoveBug && isDescendant) {
        return;
      }

      if (!lastBatchedRecord || lastBatchedRecord.target !== eTargetParent) {
        batchedRecords.push(lastBatchedRecord = newMutationRecord(eTargetParent));
      }

      if (eType === "DOMNodeInserted") {
        if (!lastBatchedRecord.addedNodes) {
          lastBatchedRecord.addedNodes = [];
        }

        lastBatchedRecord.addedNodes.push(eTarget);
      } else {
        if (!lastBatchedRecord.removedNodes) {
          lastBatchedRecord.removedNodes = [];
        }

        lastBatchedRecord.removedNodes.push(eTarget);
      }

      lastBatchedElement = eTarget;
    }

    function canTriggerAttributeModification(eTarget) {
      return options.attributes && (options.subtree || eTarget === target);
    }

    function canTriggerInsertOrRemove(eTargetParent) {
      return options.childList && (options.subtree || eTargetParent === target);
    }

    var that = this;

    // Batching insert and remove.
    var lastBatchedElement;
    var lastBatchedRecord;
    var batchedEvents = [];
    var batchedRecords = [];
    var batchEvents = debounce(function () {
      var batchedEventsLen = batchedEvents.length;

      for (var a = 0; a < batchedEventsLen; a++) {
        batchEvent(batchedEvents[a]);
      }

      that.callback(batchedRecords);
      batchedEvents = [];
      batchedRecords = [];
      lastBatchedElement = undefined;
      lastBatchedRecord = undefined;
    });

    // Batching attributes.
    var attributeOldValueCache = {};
    var attributeMutations = [];
    var batchAttributeMods = debounce(function () {
      // We keep track of the old length just in case attributes are
      // modified within a handler.
      var len = attributeMutations.length;

      // Call the handler with the current modifications.
      that.callback(attributeMutations);

      // We remove only up to the current point just in case more
      // modifications were queued.
      attributeMutations.splice(0, len);
    });

    var observed = {
      target: target,
      options: options,
      insertHandler: addEventToBatch,
      removeHandler: addEventToBatch,
      attributeHandler: function (e) {
        var eTarget = e.target;

        if (!canTriggerAttributeModification(eTarget)) {
          return;
        }

        var eAttrName = e.attrName;
        var ePrevValue = e.prevValue;
        var eNewValue = e.newValue;
        var record = newMutationRecord(eTarget, "attributes");
        record.attributeName = eAttrName;

        if (options.attributeOldValue) {
          record.oldValue = attributeOldValueCache[eAttrName] || ePrevValue || null;
        }

        attributeMutations.push(record);

        // We keep track of old values so that when IE incorrectly reports
        // the old value we can ensure it is actually correct.
        if (options.attributeOldValue) {
          attributeOldValueCache[eAttrName] = eNewValue;
        }

        batchAttributeMods();
      }
    };

    this.elements.push(observed);

    if (options.childList) {
      target.addEventListener("DOMNodeInserted", observed.insertHandler);
      target.addEventListener("DOMNodeRemoved", observed.removeHandler);
    }

    if (options.attributes) {
      target.addEventListener("DOMAttrModified", observed.attributeHandler);
    }

    return this;
  },

  disconnect: function () {
    objEach(this.elements, function (observed) {
      observed.target.removeEventListener("DOMNodeInserted", observed.insertHandler);
      observed.target.removeEventListener("DOMNodeRemoved", observed.removeHandler);
      observed.target.removeEventListener("DOMAttrModified", observed.attributeHandler);
    });

    this.elements = [];

    return this;
  }
};

exports.default = MutationObserver;
},{"./utils":10}],8:[function(require,module,exports){
"use strict";

var globals = require('./globals').default;
var hasOwn = require('./utils').hasOwn;

/**
 * Returns the class list for the specified element.
 *
 * @param {Element} element The element to get the class list for.
 *
 * @returns {ClassList | Array}
 */
function getClassList(element) {
  var classList = element.classList;

  if (classList) {
    return classList;
  }

  var attrs = element.attributes;

  return (attrs["class"] && attrs["class"].nodeValue.split(/\s+/)) || [];
}

/**
 * Returns whether or not the specified definition can be bound using the
 * specified type.
 *
 * @param {String} id The definition ID.
 * @param {String} type The definition type.
 *
 * @returns {Boolean}
 */
function isDefinitionOfType(id, type) {
  return hasOwn(globals.registry, id) && globals.registry[id].type.indexOf(type) > -1;
}

exports.default = {
  clear: function () {
    globals.registry = {};
    return this;
  },

  getForElement: function (element) {
    var attrs = element.attributes;
    var attrsLen = attrs.length;
    var definitions = [];
    var isAttr = attrs.is;
    var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
    var tag = element.tagName.toLowerCase();
    var isAttrOrTag = isAttrValue || tag;
    var definition;
    var tagToExtend;

    if (isDefinitionOfType(isAttrOrTag, skate.types.TAG)) {
      definition = globals.registry[isAttrOrTag];
      tagToExtend = definition.extends;

      if (isAttrValue) {
        if (tag === tagToExtend) {
          definitions.push(definition);
        }
      } else if (!tagToExtend) {
        definitions.push(definition);
      }
    }

    for (var a = 0; a < attrsLen; a++) {
      var attr = attrs[a].nodeName;

      if (isDefinitionOfType(attr, skate.types.ATTR)) {
        definition = globals.registry[attr];
        tagToExtend = definition.extends;

        if (!tagToExtend || tag === tagToExtend) {
          definitions.push(definition);
        }
      }
    }

    var classList = getClassList(element);
    var classListLen = classList.length;

    for (var b = 0; b < classListLen; b++) {
      var className = classList[b];

      if (isDefinitionOfType(className, skate.types.CLASS)) {
        definition = globals.registry[className];
        tagToExtend = definition.extends;

        if (!tagToExtend || tag === tagToExtend) {
          definitions.push(definition);
        }
      }
    }

    return definitions;
  },

  set: function (id, definition) {
    if (hasOwn(globals.registry, id)) {
      throw new Error("A definition of type \"" + definition.type + "\" with the ID of \"" + id + "\" already exists.");
    }

    globals.registry[id] = definition;

    return this;
  }
};
},{"./globals":5,"./utils":10}],9:[function(require,module,exports){
"use strict";

var documentObserver = require('./document-observer').default;
var triggerCreated = require('./lifecycle').triggerCreated;
var triggerAttached = require('./lifecycle').triggerAttached;
var triggerDetached = require('./lifecycle').triggerDetached;
var triggerAttributeChanged = require('./lifecycle').triggerAttributeChanged;
var initElements = require('./lifecycle').initElements;
var registry = require('./registry').default;
var debounce = require('./utils').debounce;
var inherit = require('./utils').inherit;
var supportsNativeCustomElements = require('./utils').supportsNativeCustomElements;
var version = require('./version').default;

/**
 * Initialises all valid elements in the document. Ensures that it does not
 * happen more than once in the same execution, and that it happens after the DOM is ready.
 *
 * @returns {undefined}
 */
var initDocument = debounce(function () {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initElements(document.documentElement.childNodes);
  } else {
    document.addEventListener("DOMContentLoaded", function initialiseSkateElementsOnDomLoad() {
      initElements(document.documentElement.childNodes);
    });
  }
});

/**
 * Creates a constructor for the specified definition.
 *
 * @param {Object} definition The definition information to use for generating the constructor.
 *
 * @returns {Function} The element constructor.
 */
function makeElementConstructor(definition) {
  function CustomElement() {
    var element;
    var tagToExtend = definition.extends;
    var definitionId = definition.id;

    if (tagToExtend) {
      element = document.createElement(tagToExtend);
      element.setAttribute("is", definitionId);
    } else {
      element = document.createElement(definitionId);
    }

    // Ensure the definition prototype is up to date with the element's
    // prototype. This ensures that overwriting the element prototype still
    // works.
    definition.prototype = CustomElement.prototype;

    // If they use the constructor we don't have to wait until it's attached.
    triggerCreated(element, definition);

    return element;
  }

  // This allows modifications to the element prototype propagate to the
  // definition prototype.
  CustomElement.prototype = definition.prototype;

  return CustomElement;
}

// Public API
// ----------

/**
 * Creates a listener for the specified definition.
 *
 * @param {String} id The ID of the definition.
 * @param {Object | Function} definition The definition definition.
 *
 * @returns {Function} Constructor that returns a custom element.
 */
function skate(id, definition) {
  definition = inherit(definition || {}, skate.defaults);
  definition.id = id;

  registry.set(id, definition);

  var customElementConstructor;
  var isCustomElementExclusive = definition.type === skate.types.TAG;
  var isCustomElementInclusive = isCustomElementExclusive || definition.type.indexOf(skate.types.TAG) > -1;
  var isValidNativeCustomElementId = id.indexOf("-") > 0;

  if (supportsNativeCustomElements() && isCustomElementInclusive && isValidNativeCustomElementId) {
    var elementPrototype = definition.extends ? document.createElement(definition.extends).constructor.prototype : HTMLElement.prototype;
    if (!elementPrototype.isPrototypeOf(definition.prototype)) {
      definition.prototype = inherit(Object.create(elementPrototype), definition.prototype, true);
    }
    var options = {
      prototype: inherit(definition.prototype, {
        createdCallback: function () {
          triggerCreated(this, definition);
        },
        attachedCallback: function () {
          triggerAttached(this, definition);
        },
        detachedCallback: function () {
          triggerDetached(this, definition);
        },
        attributeChangedCallback: function (name, oldValue, newValue) {
          triggerAttributeChanged(this, definition, {
            name: name,
            oldValue: oldValue,
            newValue: newValue
          });
        }
      })
    };
    if (definition.extends) {
      options.extends = definition.extends;
    }
    customElementConstructor = document.registerElement(id, options);

    if (isCustomElementExclusive) {
      return customElementConstructor;
    }
  }

  initDocument();
  documentObserver.register(definition.remove);

  if (!customElementConstructor && isCustomElementInclusive) {
    customElementConstructor = makeElementConstructor(definition);
  }

  return customElementConstructor;
}

/**
 * Synchronously initialises the specified element or elements and descendants.
 *
 * @param {Mixed} nodes The node, or nodes to initialise. Can be anything:
 *                      jQuery, DOMNodeList, DOMNode, selector etc.
 *
 * @returns {skate}
 */
skate.init = function (nodes) {
  var nodesToUse = nodes;

  if (!nodes) {
    return nodes;
  }

  if (typeof nodes === "string") {
    nodesToUse = nodes = document.querySelectorAll(nodes);
  } else if (nodes instanceof window.HTMLElement) {
    nodesToUse = [nodes];
  }

  initElements(nodesToUse);

  return nodes;
};

// Restriction type constants.
skate.types = {
  ANY: "act",
  ATTR: "a",
  CLASS: "c",
  NOATTR: "ct",
  NOCLASS: "at",
  NOTAG: "ac",
  TAG: "t"
};

// Makes checking the version easy when debugging.
skate.version = version;

/**
 * The default options for a definition.
 *
 * @var {Object}
 */
skate.defaults = {
  // Attribute lifecycle callback or callbacks.
  attributes: undefined,

  // The events to manage the binding and unbinding of during the definition's
  // lifecycle.
  events: undefined,

  // Restricts a particular definition to binding explicitly to an element with
  // a tag name that matches the specified value.
  extends: undefined,

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
  type: skate.types.ANY,

  // The attribute name to remove after calling the created() callback.
  unresolvedAttribute: "unresolved"
};

// Exporting
// ---------

// Always export the global. We don't know how consumers are using it and what
// their environments are like. Doing this affords them the flexibility of
// using it in an environment where module and non-module code may co-exist.
window.skate = skate;

// AMD
if (typeof define === "function") {
  define(function () {
    return skate;
  });
}

// CommonJS
if (typeof exports === "object") {
  exports.default = skate;
}

exports.default = skate;
},{"./document-observer":4,"./lifecycle":6,"./registry":8,"./utils":10,"./version":11}],10:[function(require,module,exports){
"use strict";

exports.hasOwn = hasOwn;
exports.camelCase = camelCase;
exports.debounce = debounce;
exports.getClosestIgnoredElement = getClosestIgnoredElement;
exports.inherit = inherit;
exports.objEach = objEach;
exports.supportsNativeCustomElements = supportsNativeCustomElements;
"use strict";

var ATTR_IGNORE = require('./constants').ATTR_IGNORE;
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function camelCase(str) {
  return str.split(/-/g).map(function (str, index) {
    return index === 0 ? str : str[0].toUpperCase() + str.substring(1);
  }).join("");
}

function debounce(fn) {
  var called = false;

  return function () {
    if (!called) {
      called = true;
      setTimeout(function () {
        called = false;
        fn();
      }, 1);
    }
  };
}

function getClosestIgnoredElement(element) {
  var parent = element;

  while (parent && parent !== document) {
    if (parent.hasAttribute(ATTR_IGNORE)) {
      return parent;
    }

    parent = parent.parentNode;
  }
}

function inherit(child, parent, overwrite) {
  var names = Object.getOwnPropertyNames(parent);
  var namesLen = names.length;

  for (var a = 0; a < namesLen; a++) {
    var name = names[a];

    if (overwrite || child[name] === undefined) {
      var desc = Object.getOwnPropertyDescriptor(parent, name);
      var shouldDefineProps = desc.get || desc.set || !desc.writable || !desc.enumerable || !desc.configurable;

      if (shouldDefineProps) {
        Object.defineProperty(child, name, desc);
      } else {
        child[name] = parent[name];
      }
    }
  }

  return child;
}

function objEach(obj, fn) {
  for (var a in obj) {
    if (hasOwn(obj, a)) {
      fn(obj[a], a);
    }
  }
}

function supportsNativeCustomElements() {
  return typeof document.registerElement === "function";
}
},{"./constants":2}],11:[function(require,module,exports){
"use strict";

exports.default = "0.13.0";
},{}]},{},[9]);
