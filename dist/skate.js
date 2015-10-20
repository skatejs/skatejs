// src/constants.js
__724634c9149913f1fb43f8ebd813ad28 = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });var ATTR_IGNORE = "data-skate-ignore";
  exports.ATTR_IGNORE = ATTR_IGNORE;
  var TYPE_ATTRIBUTE = "a";
  exports.TYPE_ATTRIBUTE = TYPE_ATTRIBUTE;
  var TYPE_CLASSNAME = "c";
  exports.TYPE_CLASSNAME = TYPE_CLASSNAME;
  var TYPE_ELEMENT = "t";
  exports.TYPE_ELEMENT = TYPE_ELEMENT;
  
  return module.exports
}).call(this);

// src/globals.js
__3a98c4f9598cb5ea30ccb64feef9d3ef = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  
  if (!window.__skate) {
    window.__skate = {
      observer: undefined,
      registry: {}
    };
  }
  
  module.exports = window.__skate;
  
  return module.exports
}).call(this);

// src/data.js
__354c5e8734c8b447da1d3e8399d816b2 = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  
  module.exports = function (element) {
    var namespace = arguments[1] === undefined ? "" : arguments[1];
  
    var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
    return namespace && (data[namespace] || (data[namespace] = {})) || data;
  };
  
  return module.exports
}).call(this);

// src/mutation-observer.js
__a0dd52a9bf0c67f149b6843846f244ea = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  
  (function (self) {
    // Atlassian: added IIFE
    /**
     * @license
     * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
     */
    // @version 0.7.15
    if (typeof WeakMap === "undefined") {
      (function () {
        var defineProperty = Object.defineProperty;
        var counter = Date.now() % 1000000000;
        var WeakMap = function WeakMap() {
          this.name = "__st" + (Math.random() * 1000000000 >>> 0) + (counter++ + "__");
        };
        WeakMap.prototype = {
          set: function set(key, value) {
            var entry = key[this.name];
            if (entry && entry[0] === key) entry[1] = value;else defineProperty(key, this.name, {
              value: [key, value],
              writable: true
            });
            return this;
          },
          get: function get(key) {
            var entry;
            return (entry = key[this.name]) && entry[0] === key ? entry[1] : undefined;
          },
          "delete": function _delete(key) {
            var entry = key[this.name];
            if (!entry || entry[0] !== key) {
              return false;
            }entry[0] = entry[1] = undefined;
            return true;
          },
          has: function has(key) {
            var entry = key[this.name];
            if (!entry) {
              return false;
            }return entry[0] === key;
          }
        };
        window.WeakMap = WeakMap;
      })();
    }
  
    (function (global) {
      if (global.JsMutationObserver) {
        return;
      }
      var registrationsTable = new WeakMap();
      var setImmediate;
      if (/Trident|Edge/.test(navigator.userAgent)) {
        setImmediate = setTimeout;
      } else if (window.setImmediate) {
        setImmediate = window.setImmediate;
      } else {
        var setImmediateQueue = [];
        var sentinel = String(Math.random());
        window.addEventListener("message", function (e) {
          if (e.data === sentinel) {
            var queue = setImmediateQueue;
            setImmediateQueue = [];
            queue.forEach(function (func) {
              func();
            });
          }
        });
        setImmediate = function (func) {
          setImmediateQueue.push(func);
          window.postMessage(sentinel, "*");
        };
      }
      var isScheduled = false;
      var scheduledObservers = [];
      function scheduleCallback(observer) {
        scheduledObservers.push(observer);
        if (!isScheduled) {
          isScheduled = true;
          setImmediate(dispatchCallbacks);
        }
      }
      function wrapIfNeeded(node) {
        return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(node) || node;
      }
      function dispatchCallbacks() {
        isScheduled = false;
        var observers = scheduledObservers;
        scheduledObservers = [];
        observers.sort(function (o1, o2) {
          return o1.uid_ - o2.uid_;
        });
        var anyNonEmpty = false;
        observers.forEach(function (observer) {
          var queue = observer.takeRecords();
          removeTransientObserversFor(observer);
          if (queue.length) {
            observer.callback_(queue, observer);
            anyNonEmpty = true;
          }
        });
        if (anyNonEmpty) dispatchCallbacks();
      }
      function removeTransientObserversFor(observer) {
        observer.nodes_.forEach(function (node) {
          var registrations = registrationsTable.get(node);
          if (!registrations) return;
          registrations.forEach(function (registration) {
            if (registration.observer === observer) registration.removeTransientObservers();
          });
        });
      }
      function forEachAncestorAndObserverEnqueueRecord(target, callback) {
        for (var node = target; node; node = node.parentNode) {
          var registrations = registrationsTable.get(node);
          if (registrations) {
            for (var j = 0; j < registrations.length; j++) {
              var registration = registrations[j];
              var options = registration.options;
              if (node !== target && !options.subtree) continue;
              var record = callback(options);
              if (record) registration.enqueue(record);
            }
          }
        }
      }
      var uidCounter = 0;
      function JsMutationObserver(callback) {
        this.callback_ = callback;
        this.nodes_ = [];
        this.records_ = [];
        this.uid_ = ++uidCounter;
      }
      JsMutationObserver.prototype = {
        observe: function observe(target, options) {
          target = wrapIfNeeded(target);
          if (!options.childList && !options.attributes && !options.characterData || options.attributeOldValue && !options.attributes || options.attributeFilter && options.attributeFilter.length && !options.attributes || options.characterDataOldValue && !options.characterData) {
            throw new SyntaxError();
          }
          var registrations = registrationsTable.get(target);
          if (!registrations) registrationsTable.set(target, registrations = []);
          var registration;
          for (var i = 0; i < registrations.length; i++) {
            if (registrations[i].observer === this) {
              registration = registrations[i];
              registration.removeListeners();
              registration.options = options;
              break;
            }
          }
          if (!registration) {
            registration = new Registration(this, target, options);
            registrations.push(registration);
            this.nodes_.push(target);
          }
          registration.addListeners();
        },
        disconnect: function disconnect() {
          this.nodes_.forEach(function (node) {
            var registrations = registrationsTable.get(node);
            for (var i = 0; i < registrations.length; i++) {
              var registration = registrations[i];
              if (registration.observer === this) {
                registration.removeListeners();
                registrations.splice(i, 1);
                break;
              }
            }
          }, this);
          this.records_ = [];
        },
        takeRecords: function takeRecords() {
          var copyOfRecords = this.records_;
          this.records_ = [];
          return copyOfRecords;
        }
      };
      function MutationRecord(type, target) {
        this.type = type;
        this.target = target;
        this.addedNodes = [];
        this.removedNodes = [];
        this.previousSibling = null;
        this.nextSibling = null;
        this.attributeName = null;
        this.attributeNamespace = null;
        this.oldValue = null;
      }
      function copyMutationRecord(original) {
        var record = new MutationRecord(original.type, original.target);
        record.addedNodes = original.addedNodes.slice();
        record.removedNodes = original.removedNodes.slice();
        record.previousSibling = original.previousSibling;
        record.nextSibling = original.nextSibling;
        record.attributeName = original.attributeName;
        record.attributeNamespace = original.attributeNamespace;
        record.oldValue = original.oldValue;
        return record;
      }
      var currentRecord, recordWithOldValue;
      function getRecord(type, target) {
        return currentRecord = new MutationRecord(type, target);
      }
      function getRecordWithOldValue(oldValue) {
        if (recordWithOldValue) {
          return recordWithOldValue;
        }recordWithOldValue = copyMutationRecord(currentRecord);
        recordWithOldValue.oldValue = oldValue;
        return recordWithOldValue;
      }
      function clearRecords() {
        currentRecord = recordWithOldValue = undefined;
      }
      function recordRepresentsCurrentMutation(record) {
        return record === recordWithOldValue || record === currentRecord;
      }
      function selectRecord(lastRecord, newRecord) {
        if (lastRecord === newRecord) {
          return lastRecord;
        }if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord)) {
          return recordWithOldValue;
        }return null;
      }
      function Registration(observer, target, options) {
        this.observer = observer;
        this.target = target;
        this.options = options;
        this.transientObservedNodes = [];
      }
      Registration.prototype = {
        enqueue: function enqueue(record) {
          var records = this.observer.records_;
          var length = records.length;
          if (records.length > 0) {
            var lastRecord = records[length - 1];
            var recordToReplaceLast = selectRecord(lastRecord, record);
            if (recordToReplaceLast) {
              records[length - 1] = recordToReplaceLast;
              return;
            }
          } else {
            scheduleCallback(this.observer);
          }
          records[length] = record;
        },
        addListeners: function addListeners() {
          this.addListeners_(this.target);
        },
        addListeners_: function addListeners_(node) {
          var options = this.options;
          if (options.attributes) node.addEventListener("DOMAttrModified", this, true);
          if (options.characterData) node.addEventListener("DOMCharacterDataModified", this, true);
          if (options.childList) node.addEventListener("DOMNodeInserted", this, true);
          if (options.childList || options.subtree) node.addEventListener("DOMNodeRemoved", this, true);
        },
        removeListeners: function removeListeners() {
          this.removeListeners_(this.target);
        },
        removeListeners_: function removeListeners_(node) {
          var options = this.options;
          if (options.attributes) node.removeEventListener("DOMAttrModified", this, true);
          if (options.characterData) node.removeEventListener("DOMCharacterDataModified", this, true);
          if (options.childList) node.removeEventListener("DOMNodeInserted", this, true);
          if (options.childList || options.subtree) node.removeEventListener("DOMNodeRemoved", this, true);
        },
        addTransientObserver: function addTransientObserver(node) {
          if (node === this.target) {
            return;
          }this.addListeners_(node);
          this.transientObservedNodes.push(node);
          var registrations = registrationsTable.get(node);
          if (!registrations) registrationsTable.set(node, registrations = []);
          registrations.push(this);
        },
        removeTransientObservers: function removeTransientObservers() {
          var transientObservedNodes = this.transientObservedNodes;
          this.transientObservedNodes = [];
          transientObservedNodes.forEach(function (node) {
            this.removeListeners_(node);
            var registrations = registrationsTable.get(node);
            for (var i = 0; i < registrations.length; i++) {
              if (registrations[i] === this) {
                registrations.splice(i, 1);
                break;
              }
            }
          }, this);
        },
        handleEvent: function handleEvent(e) {
          e.stopImmediatePropagation();
          switch (e.type) {
            case "DOMAttrModified":
              var name = e.attrName;
              var namespace = e.relatedNode.namespaceURI;
              var target = e.target;
              var record = new getRecord("attributes", target);
              record.attributeName = name;
              record.attributeNamespace = namespace;
              var oldValue = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
              forEachAncestorAndObserverEnqueueRecord(target, function (options) {
                if (!options.attributes) return;
                if (options.attributeFilter && options.attributeFilter.length && options.attributeFilter.indexOf(name) === -1 && options.attributeFilter.indexOf(namespace) === -1) {
                  return;
                }
                if (options.attributeOldValue) return getRecordWithOldValue(oldValue);
                return record;
              });
              break;
  
            case "DOMCharacterDataModified":
              var target = e.target;
              var record = getRecord("characterData", target);
              var oldValue = e.prevValue;
              forEachAncestorAndObserverEnqueueRecord(target, function (options) {
                if (!options.characterData) return;
                if (options.characterDataOldValue) return getRecordWithOldValue(oldValue);
                return record;
              });
              break;
  
            case "DOMNodeRemoved":
              this.addTransientObserver(e.target);
  
            case "DOMNodeInserted":
              var changedNode = e.target;
              var addedNodes, removedNodes;
              if (e.type === "DOMNodeInserted") {
                addedNodes = [changedNode];
                removedNodes = [];
              } else {
                addedNodes = [];
                removedNodes = [changedNode];
              }
              var previousSibling = changedNode.previousSibling;
              var nextSibling = changedNode.nextSibling;
              var record = getRecord("childList", e.target.parentNode);
              record.addedNodes = addedNodes;
              record.removedNodes = removedNodes;
              record.previousSibling = previousSibling;
              record.nextSibling = nextSibling;
              forEachAncestorAndObserverEnqueueRecord(e.relatedNode, function (options) {
                if (!options.childList) return;
                return record;
              });
          }
          clearRecords();
        }
      };
      global.JsMutationObserver = JsMutationObserver;
      if (!global.MutationObserver) {
        global.MutationObserver = JsMutationObserver;
        JsMutationObserver._isPolyfilled = true;
      }
    })(self);
  })(window); // Atlassian: added IIFE
  
  return module.exports
}).call(this);

// src/utils.js
__be20d0d72414feb56785eb40e436cbe2 = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  
  
  
  /**
   * Checks {}.hasOwnProperty in a safe way.
   *
   * @param {Object} obj The object the property is on.
   * @param {String} key The object key to check.
   *
   * @returns {Boolean}
   */exports.hasOwn = hasOwn;
  
  /**
   * Camel-cases the specified string.
   *
   * @param {String} str The string to camel-case.
   *
   * @returns {String}
   */
  exports.camelCase = camelCase;
  
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
  exports.elementContains = elementContains;
  
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });var ATTR_IGNORE = __724634c9149913f1fb43f8ebd813ad28.ATTR_IGNORE;
  
  var DocumentFragment = window.DocumentFragment;
  var elementPrototype = window.HTMLElement.prototype;
  exports.elementPrototype = elementPrototype;
  var elementPrototypeContains = elementPrototype.contains;
  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  
  function camelCase(str) {
    return str.split(/-/g).map(function (str, index) {
      return index === 0 ? str : str[0].toUpperCase() + str.substring(1);
    }).join("");
  }
  
  function elementContains(source, target) {
    // The document element does not have the contains method in IE.
    if (source === document && !source.contains) {
      return document.head.contains(target) || document.body.contains(target);
    }
  
    return source.contains ? source.contains(target) : elementPrototypeContains.call(source, target);
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
  
    // e.g. document doesn't have a function hasAttribute; no need to go further up
    while (parent instanceof Element) {
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
  
  function isValidNativeCustomElementName(name) {
    return name.indexOf("-") > 0;
  }
  
  return module.exports
}).call(this);

// src/registry.js
__83e0987e30891762847ca873089362f3 = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var _constants = __724634c9149913f1fb43f8ebd813ad28;
  
  var TYPE_ATTRIBUTE = _constants.TYPE_ATTRIBUTE;
  var TYPE_CLASSNAME = _constants.TYPE_CLASSNAME;
  var TYPE_ELEMENT = _constants.TYPE_ELEMENT;
  
  var globals = _interopRequire(__3a98c4f9598cb5ea30ccb64feef9d3ef);
  
  var _utils = __be20d0d72414feb56785eb40e436cbe2;
  
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
    clear: function clear() {
      globals.registry = {};
      return this;
    },
  
    get: function get(id) {
      return hasOwn(globals.registry, id) && globals.registry[id];
    },
  
    getForElement: function getForElement(element) {
      var attrs = element.attributes;
      var attrsLen = attrs.length;
      var definitions = [];
      var isAttr = attrs.is;
      var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
  
      // Using localName as fallback for edge cases when processing <object> tag that is used
      // as inteface to NPAPI plugin.
      var tag = (element.tagName || element.localName).toLowerCase();
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
  
    isType: function isType(id, type) {
      var def = this.get(id);
      return def && def.type === type;
    },
  
    isNativeCustomElement: function isNativeCustomElement(id) {
      return supportsNativeCustomElements() && this.isType(id, TYPE_ELEMENT) && isValidNativeCustomElementName(id);
    },
  
    set: function set(id, definition) {
      if (hasOwn(globals.registry, id)) {
        throw new Error("A component definition of type \"" + definition.type + "\" with the ID of \"" + id + "\" already exists.");
      }
  
      globals.registry[id] = definition;
  
      return this;
    }
  };
  
  return module.exports
}).call(this);

// src/lifecycle.js
__e8f06267f4f16972372badf2e3d0aba5 = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });var ATTR_IGNORE = __724634c9149913f1fb43f8ebd813ad28.ATTR_IGNORE;
  
  var data = _interopRequire(__354c5e8734c8b447da1d3e8399d816b2);
  
  __a0dd52a9bf0c67f149b6843846f244ea;
  
  var registry = _interopRequire(__83e0987e30891762847ca873089362f3);
  
  var _utils = __be20d0d72414feb56785eb40e436cbe2;
  
  var camelCase = _utils.camelCase;
  var elementContains = _utils.elementContains;
  var hasOwn = _utils.hasOwn;
  var inherit = _utils.inherit;
  var objEach = _utils.objEach;
  var Node = window.Node;
  
  var elProto = window.HTMLElement.prototype;
  var nativeMatchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;
  // Only IE9 has this msMatchesSelector bug, but best to detect it.
  var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call(document.createElement("div"), "div");
  var matchesSelector = function matchesSelector(element, selector) {
    if (hasNativeMatchesSelectorDetattachedBug) {
      var clone = element.cloneNode();
      document.createElement("div").appendChild(clone);
      return nativeMatchesSelector.call(clone, selector);
    }
    return nativeMatchesSelector.call(element, selector);
  };
  
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
  function defineAttributeProperty(target, attribute, property) {
    Object.defineProperty(target, property, {
      get: function get() {
        return this.getAttribute(attribute);
      },
      set: function set(value) {
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
      var property = camelCase(attribute);
      if (hasOwn(componentAttributes, attribute) && !hasOwn(target, property)) {
        defineAttributeProperty(target, attribute, property);
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
  
    var observer = new window.MutationObserver(function (mutations) {
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
          if (matchesSelector(current, delegate)) {
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
  
    if (!elementContains(document, target)) {
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
    // [CATION] Don't cache elements length! Components initialization could append nodes
    // as siblings (see label's element behaviour for example) and this could lead to problems with
    // components placed at the end of processing childNodes because they will change they index
    // position and get out of cached value range.
    for (var a = 0; a < elements.length; a++) {
      var element = elements[a];
  
      if (element.nodeType !== Node.ELEMENT_NODE || element.attributes[ATTR_IGNORE]) {
        continue;
      }
  
      var currentNodeDefinitions = registry.getForElement(element);
      var currentNodeDefinitionsLength = currentNodeDefinitions.length;
  
      for (var b = 0; b < currentNodeDefinitionsLength; b++) {
        triggerLifecycle(element, currentNodeDefinitions[b]);
      }
  
      // When <object> tag is used to expose NPAPI api to js may have different behaviour then other
      // tags. One of those differences is that it's childNodes can be undefined.
      var elementChildNodes = element.childNodes || [];
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
    // Don't cache `childNodes` length. For more info see description in `initElements` function.
    for (var a = 0; a < elements.length; a++) {
      var element = elements[a];
  
      if (element.nodeType !== Node.ELEMENT_NODE) {
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
  
  return module.exports
}).call(this);

// src/document-observer.js
__ecf86e5efec0eb80abec667d595d90da = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var globals = _interopRequire(__3a98c4f9598cb5ea30ccb64feef9d3ef);
  
  var _lifecycle = __e8f06267f4f16972372badf2e3d0aba5;
  
  var initElements = _lifecycle.initElements;
  var removeElements = _lifecycle.removeElements;
  
  __a0dd52a9bf0c67f149b6843846f244ea;
  
  var getClosestIgnoredElement = __be20d0d72414feb56785eb40e436cbe2.getClosestIgnoredElement;
  
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
    var observer = new window.MutationObserver(documentObserverHandler);
  
    // Observe after the DOM content has loaded.
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  
    return observer;
  }
  
  module.exports = {
    register: function register(fixIe) {
      // IE has issues with reporting removedNodes correctly. See the polyfill for
      // details. If we fix IE, we must also re-define the document observer.
      if (fixIe) {
        this.unregister();
      }
  
      if (!globals.observer) {
        globals.observer = createDocumentObserver();
      }
  
      return this;
    },
  
    unregister: function unregister() {
      if (globals.observer) {
        globals.observer.disconnect();
        globals.observer = undefined;
      }
  
      return this;
    }
  };
  
  return module.exports
}).call(this);

// src/version.js
__299ad4a84aec4d82016b954edf692edb = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  
  module.exports = "0.13.13";
  
  return module.exports
}).call(this);

// src/skate.js
__de441a6b64570d579a941766dc14a048 = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var _constants = __724634c9149913f1fb43f8ebd813ad28;
  
  var TYPE_ATTRIBUTE = _constants.TYPE_ATTRIBUTE;
  var TYPE_CLASSNAME = _constants.TYPE_CLASSNAME;
  var TYPE_ELEMENT = _constants.TYPE_ELEMENT;
  
  var documentObserver = _interopRequire(__ecf86e5efec0eb80abec667d595d90da);
  
  var _lifecycle = __e8f06267f4f16972372badf2e3d0aba5;
  
  var triggerCreated = _lifecycle.triggerCreated;
  var triggerAttached = _lifecycle.triggerAttached;
  var triggerDetached = _lifecycle.triggerDetached;
  var triggerAttributeChanged = _lifecycle.triggerAttributeChanged;
  var initElements = _lifecycle.initElements;
  
  var registry = _interopRequire(__83e0987e30891762847ca873089362f3);
  
  var _utils = __be20d0d72414feb56785eb40e436cbe2;
  
  var debounce = _utils.debounce;
  var inherit = _utils.inherit;
  
  var version = _interopRequire(__299ad4a84aec4d82016b954edf692edb);
  
  var HTMLElement = window.HTMLElement;
  
  // IE <= 10 can fire "interactive" too early (#243).
  var isOldIE = !!document.attachEvent; // attachEvent was removed in IE11.
  
  function isReady() {
    if (isOldIE) {
      return document.readyState === "complete";
    } else {
      return document.readyState === "interactive" || document.readyState === "complete";
    }
  }
  
  /**
   * Initialises all valid elements in the document. Ensures that it does not
   * happen more than once in the same execution, and that it happens after the DOM is ready.
   *
   * @returns {undefined}
   */
  var initDocument = debounce(function () {
    var initialiseSkateElementsOnDomLoad = function initialiseSkateElementsOnDomLoad() {
      initElements(document.documentElement.childNodes);
    };
    if (isReady()) {
      initialiseSkateElementsOnDomLoad();
    } else {
      if (isOldIE) {
        window.addEventListener("load", initialiseSkateElementsOnDomLoad);
      } else {
        document.addEventListener("DOMContentLoaded", initialiseSkateElementsOnDomLoad);
      }
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
          createdCallback: function createdCallback() {
            triggerCreated(this, definition);
          },
          attachedCallback: function attachedCallback() {
            triggerAttached(this, definition);
          },
          detachedCallback: function detachedCallback() {
            triggerDetached(this, definition);
          },
          attributeChangedCallback: function attributeChangedCallback(name, oldValue, newValue) {
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
    documentObserver.register(!!definition.detached);
  
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
  
  var previousSkate = window.skate;
  skate.noConflict = function () {
    window.skate = previousSkate;
    return skate;
  };
  
  // Global
  window.skate = skate;
  
  // ES6
  module.exports = skate;
  
  return module.exports
}).call(this);