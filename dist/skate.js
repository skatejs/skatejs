(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

var ATTR_IGNORE = exports.ATTR_IGNORE = "data-skate-ignore";
var TYPE_ATTRIBUTE = exports.TYPE_ATTRIBUTE = "a";
var TYPE_CLASSNAME = exports.TYPE_CLASSNAME = "c";
var TYPE_ELEMENT = exports.TYPE_ELEMENT = "t";
exports.__esModule = true;

},{}],2:[function(_dereq_,module,exports){
"use strict";

module.exports = function (element) {
  var namespace = arguments[1] === undefined ? "" : arguments[1];
  var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
  return namespace && (data[namespace] || (data[namespace] = {})) || data;
};

},{}],3:[function(_dereq_,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var globals = _interopRequire(_dereq_("./globals"));

var _lifecycle = _dereq_("./lifecycle");

var initElements = _lifecycle.initElements;
var removeElements = _lifecycle.removeElements;
var MutationObserver = _interopRequire(_dereq_("./mutation-observer"));

var getClosestIgnoredElement = _dereq_("./utils").getClosestIgnoredElement;


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

module.exports = {
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

},{"./globals":4,"./lifecycle":5,"./mutation-observer":6,"./utils":9}],4:[function(_dereq_,module,exports){
"use strict";

if (!window.__skate) {
  window.__skate = {
    observer: undefined,
    registry: {}
  };
}

module.exports = window.__skate;

},{}],5:[function(_dereq_,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var ATTR_IGNORE = _dereq_("./constants").ATTR_IGNORE;
var data = _interopRequire(_dereq_("./data"));

var MutationObserver = _interopRequire(_dereq_("./mutation-observer"));

var registry = _interopRequire(_dereq_("./registry"));

var _utils = _dereq_("./utils");

var camelCase = _utils.camelCase;
var hasOwn = _utils.hasOwn;
var inherit = _utils.inherit;
var objEach = _utils.objEach;


var elProto = window.HTMLElement.prototype;
var matchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;

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

  if (!component.attributes || registry.isNativeCustomElement(component.id)) {
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
  var targetData = data(target, component.id);

  if (targetData.created) {
    return;
  }

  targetData.created = true;

  // TODO: This doesn't need to happen if using native.
  inherit(target, component.prototype, true);

  // We use the unresolved / resolved attributes to flag whether or not the
  // element has been templated or not.
  if (component.template && !target.hasAttribute(component.resolvedAttribute)) {
    component.template(target);
  }

  target.removeAttribute(component.unresolvedAttribute);
  target.setAttribute(component.resolvedAttribute, "");
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
  var targetData = data(target, component.id);

  if (targetData.attached) {
    return;
  }

  if (!document.contains(target)) {
    return;
  }

  targetData.attached = true;

  if (component.attached) {
    component.attached(target);
  }

  targetData.detached = false;
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
  var targetData = data(target, component.id);

  if (targetData.detached) {
    return;
  }

  targetData.detached = true;

  if (component.detached) {
    component.detached(target);
  }

  targetData.attached = false;
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
exports.__esModule = true;

},{"./constants":1,"./data":2,"./mutation-observer":6,"./registry":7,"./utils":9}],6:[function(_dereq_,module,exports){
"use strict";

var _utils = _dereq_("./utils");

var debounce = _utils.debounce;
var objEach = _utils.objEach;


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

module.exports = MutationObserver;

},{"./utils":9}],7:[function(_dereq_,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _constants = _dereq_("./constants");

var TYPE_ATTRIBUTE = _constants.TYPE_ATTRIBUTE;
var TYPE_CLASSNAME = _constants.TYPE_CLASSNAME;
var TYPE_ELEMENT = _constants.TYPE_ELEMENT;
var globals = _interopRequire(_dereq_("./globals"));

var _utils = _dereq_("./utils");

var hasOwn = _utils.hasOwn;
var isValidNativeCustomElementName = _utils.isValidNativeCustomElementName;
var supportsNativeCustomElements = _utils.supportsNativeCustomElements;


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

  return attrs["class"] && attrs["class"].nodeValue.split(/\s+/) || [];
}

module.exports = {
  clear: function () {
    globals.registry = {};
    return this;
  },

  get: function (id) {
    return hasOwn(globals.registry, id) && globals.registry[id];
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

    if (this.isType(isAttrOrTag, TYPE_ELEMENT)) {
      definition = globals.registry[isAttrOrTag];
      tagToExtend = definition["extends"];

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

      if (this.isType(attr, TYPE_ATTRIBUTE)) {
        definition = globals.registry[attr];
        tagToExtend = definition["extends"];

        if (!tagToExtend || tag === tagToExtend) {
          definitions.push(definition);
        }
      }
    }

    var classList = getClassList(element);
    var classListLen = classList.length;

    for (var b = 0; b < classListLen; b++) {
      var className = classList[b];

      if (this.isType(className, TYPE_CLASSNAME)) {
        definition = globals.registry[className];
        tagToExtend = definition["extends"];

        if (!tagToExtend || tag === tagToExtend) {
          definitions.push(definition);
        }
      }
    }

    return definitions;
  },

  isType: function (id, type) {
    var def = this.get(id);
    return def && def.type === type;
  },

  isNativeCustomElement: function (id) {
    return supportsNativeCustomElements() && this.isType(id, TYPE_ELEMENT) && isValidNativeCustomElementName(id);
  },

  set: function (id, definition) {
    if (hasOwn(globals.registry, id)) {
      throw new Error("A component definition of type \"" + definition.type + "\" with the ID of \"" + id + "\" already exists.");
    }

    globals.registry[id] = definition;

    return this;
  }
};

},{"./constants":1,"./globals":4,"./utils":9}],8:[function(_dereq_,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _constants = _dereq_("./constants");

var TYPE_ATTRIBUTE = _constants.TYPE_ATTRIBUTE;
var TYPE_CLASSNAME = _constants.TYPE_CLASSNAME;
var TYPE_ELEMENT = _constants.TYPE_ELEMENT;
var documentObserver = _interopRequire(_dereq_("./document-observer"));

var _lifecycle = _dereq_("./lifecycle");

var triggerCreated = _lifecycle.triggerCreated;
var triggerAttached = _lifecycle.triggerAttached;
var triggerDetached = _lifecycle.triggerDetached;
var triggerAttributeChanged = _lifecycle.triggerAttributeChanged;
var initElements = _lifecycle.initElements;
var registry = _interopRequire(_dereq_("./registry"));

var _utils = _dereq_("./utils");

var debounce = _utils.debounce;
var inherit = _utils.inherit;
var supportsNativeCustomElements = _utils.supportsNativeCustomElements;
var version = _interopRequire(_dereq_("./version"));

var HTMLElement = window.HTMLElement;

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
    var tagToExtend = definition["extends"];
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
  // Just in case the definition is shared, we duplicate it so that internal
  // modifications to the original aren't shared.
  definition = inherit({}, definition);
  definition = inherit(definition, skate.defaults);
  definition.id = id;

  registry.set(id, definition);

  if (registry.isNativeCustomElement(id)) {
    var elementPrototype = definition["extends"] ? document.createElement(definition["extends"]).constructor.prototype : HTMLElement.prototype;

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

    if (definition["extends"]) {
      options["extends"] = definition["extends"];
    }

    return document.registerElement(id, options);
  }

  initDocument();
  documentObserver.register(definition.remove);

  if (registry.isType(id, TYPE_ELEMENT)) {
    return makeElementConstructor(definition);
  }
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
  } else if (nodes instanceof HTMLElement) {
    nodesToUse = [nodes];
  }

  initElements(nodesToUse);

  return nodes;
};

// Restriction type constants.
skate.type = {
  ATTRIBUTE: TYPE_ATTRIBUTE,
  CLASSNAME: TYPE_CLASSNAME,
  ELEMENT: TYPE_ELEMENT
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
  type: TYPE_ELEMENT,

  // The attribute name to remove after calling the created() callback.
  unresolvedAttribute: "unresolved"
};

// Exporting
// ---------

// Always export the global. We don't know how consumers are using it and what
// their environments are like. Doing this affords them the flexibility of
// using it in an environment where module and non-module code may co-exist.
window.skate = skate;

// This ensures that if Skate is transpiled to AMD / CJS from ES6 that it works.
skate["default"] = skate;

// AMD
if (typeof define === "function") {
  define(function () {
    return skate;
  });
}

// CommonJS
if (typeof exports === "object") {
  module.exports = skate;
}

// ES6
module.exports = skate;

},{"./constants":1,"./document-observer":3,"./lifecycle":5,"./registry":7,"./utils":9,"./version":10}],9:[function(_dereq_,module,exports){
"use strict";

/**
 * Checks {}.hasOwnProperty in a safe way.
 *
 * @param {Object} obj The object the property is on.
 * @param {String} key The object key to check.
 *
 * @returns {Boolean}
 */
exports.hasOwn = hasOwn;


/**
 * Camel-cases the specified string.
 *
 * @param {String} str The string to camel-case.
 *
 * @returns {String}
 */
exports.camelCase = camelCase;


/**
 * Returns a function that will prevent more than one call in a single clock
 * tick.
 *
 * @param {Function} fn The function to call.
 *
 * @returns {Function}
 */
exports.debounce = debounce;


/**
 * Returns whether or not the specified element has been selectively ignored.
 *
 * @param {Element} element The element to check and traverse up from.
 *
 * @returns {Boolean}
 */
exports.getClosestIgnoredElement = getClosestIgnoredElement;


/**
 * Merges the second argument into the first.
 *
 * @param {Object} child The object to merge into.
 * @param {Object} parent The object to merge from.
 * @param {Boolean} overwrite Whether or not to overwrite properties on the child.
 *
 * @returns {Object} Returns the child object.
 */
exports.inherit = inherit;


/**
 * Traverses an object checking hasOwnProperty.
 *
 * @param {Object} obj The object to traverse.
 * @param {Function} fn The function to call for each item in the object.
 *
 * @returns {undefined}
 */
exports.objEach = objEach;
exports.supportsNativeCustomElements = supportsNativeCustomElements;
exports.isValidNativeCustomElementName = isValidNativeCustomElementName;
var ATTR_IGNORE = _dereq_("./constants").ATTR_IGNORE;
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}function camelCase(str) {
  return str.split(/-/g).map(function (str, index) {
    return index === 0 ? str : str[0].toUpperCase() + str.substring(1);
  }).join("");
}function debounce(fn) {
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
}function getClosestIgnoredElement(element) {
  var parent = element;

  while (parent && parent !== document && !(parent instanceof DocumentFragment)) {
    if (parent.hasAttribute(ATTR_IGNORE)) {
      return parent;
    }

    parent = parent.parentNode;
  }
}function inherit(child, parent, overwrite) {
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
}function objEach(obj, fn) {
  for (var a in obj) {
    if (hasOwn(obj, a)) {
      fn(obj[a], a);
    }
  }
}

function supportsNativeCustomElements() {
  return typeof document.registerElement === "function";
}

function isValidNativeCustomElementName(name) {
  return name.indexOf("-") > 0;
}
exports.__esModule = true;

},{"./constants":1}],10:[function(_dereq_,module,exports){
"use strict";

module.exports = "0.13.0";

},{}]},{},[8]);
