(function () {
'use strict';
var $___46__46__47_src_47_constants__ = (function() {
  "use strict";
  var __moduleName = "../src/constants";
  'use strict';
  var ATTR_IGNORE = 'data-skate-ignore';
  return {get ATTR_IGNORE() {
      return ATTR_IGNORE;
    }};
})();
var $___46__46__47_src_47_data__ = (function() {
  "use strict";
  var __moduleName = "../src/data";
  'use strict';
  var $__default = {
    get: function(element, name) {
      if (element.__SKATE_DATA) {
        return element.__SKATE_DATA[name];
      }
    },
    set: function(element, name, value) {
      if (!element.__SKATE_DATA) {
        element.__SKATE_DATA = {};
      }
      element.__SKATE_DATA[name] = value;
      return element;
    }
  };
  return {get default() {
      return $__default;
    }};
})();
var $___46__46__47_src_47_utils__ = (function() {
  "use strict";
  var __moduleName = "../src/utils";
  'use strict';
  var ATTR_IGNORE = ($___46__46__47_src_47_constants__).ATTR_IGNORE;
  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  function debounce(fn) {
    var called = false;
    return function() {
      if (!called) {
        called = true;
        setTimeout(function() {
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
  function inherit(child, parent) {
    var names = Object.getOwnPropertyNames(parent);
    var namesLen = names.length;
    for (var a = 0; a < namesLen; a++) {
      var name = names[a];
      if (child[name] === undefined) {
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
  return {
    get hasOwn() {
      return hasOwn;
    },
    get debounce() {
      return debounce;
    },
    get getClosestIgnoredElement() {
      return getClosestIgnoredElement;
    },
    get inherit() {
      return inherit;
    },
    get objEach() {
      return objEach;
    }
  };
})();
var $___46__46__47_src_47_mutation_45_observer__ = (function() {
  "use strict";
  var __moduleName = "../src/mutation-observer";
  'use strict';
  var $__1 = $___46__46__47_src_47_utils__,
      debounce = $__1.debounce,
      objEach = $__1.objEach;
  var elProto = window.HTMLElement.prototype;
  var elProtoContains = window.HTMLElement.prototype.contains;
  var NativeMutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
  var isFixingIe = false;
  var isIe = window.navigator.userAgent.indexOf('Trident') > -1;
  function elementContains(source, target) {
    if (source.nodeType !== 1) {
      return false;
    }
    return source.contains ? source.contains(target) : elProtoContains.call(source, target);
  }
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
      type: type || 'childList'
    };
  }
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
  function MutationObserver(callback) {
    if (NativeMutationObserver && !isFixingIe) {
      return new NativeMutationObserver(callback);
    }
    this.callback = callback;
    this.elements = [];
  }
  MutationObserver.fixIe = function() {
    if (!isIe || isFixingIe) {
      return;
    }
    var oldInnerHtml = Object.getOwnPropertyDescriptor(elProto, 'innerHTML');
    Object.defineProperty(elProto, 'innerHTML', {
      get: function() {
        return oldInnerHtml.get.call(this);
      },
      set: function(html) {
        walkTree(this, function(node) {
          var mutationEvent = document.createEvent('MutationEvent');
          mutationEvent.initMutationEvent('DOMNodeRemoved', true, false, null, null, null, null, null);
          node.dispatchEvent(mutationEvent);
        });
        oldInnerHtml.set.call(this, html);
      }
    });
    isFixingIe = true;
  };
  Object.defineProperty(MutationObserver, 'isFixingIe', {get: function() {
      return isFixingIe;
    }});
  MutationObserver.prototype = {
    observe: function(target, options) {
      function addEventToBatch(e) {
        batchedEvents.push(e);
        batchEvents();
      }
      function batchEvent(e) {
        var eTarget = e.target;
        if (!eTarget) {
          return;
        }
        var eType = e.type;
        var eTargetParent = eTarget.parentNode;
        if (!canTriggerInsertOrRemove(eTargetParent)) {
          return;
        }
        var shouldWorkAroundIeRemoveBug = isFixingIe && eType === 'DOMNodeRemoved';
        var isDescendant = lastBatchedElement && elementContains(lastBatchedElement, eTarget);
        if (!shouldWorkAroundIeRemoveBug && isDescendant) {
          return;
        }
        if (!lastBatchedRecord || lastBatchedRecord.target !== eTargetParent) {
          batchedRecords.push(lastBatchedRecord = newMutationRecord(eTargetParent));
        }
        if (eType === 'DOMNodeInserted') {
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
      var lastBatchedElement;
      var lastBatchedRecord;
      var batchedEvents = [];
      var batchedRecords = [];
      var batchEvents = debounce(function() {
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
      var attributeOldValueCache = {};
      var attributeMutations = [];
      var batchAttributeMods = debounce(function() {
        var len = attributeMutations.length;
        that.callback(attributeMutations);
        attributeMutations.splice(0, len);
      });
      var observed = {
        target: target,
        options: options,
        insertHandler: addEventToBatch,
        removeHandler: addEventToBatch,
        attributeHandler: function(e) {
          var eTarget = e.target;
          if (!canTriggerAttributeModification(eTarget)) {
            return;
          }
          var eAttrName = e.attrName;
          var ePrevValue = e.prevValue;
          var eNewValue = e.newValue;
          var record = newMutationRecord(eTarget, 'attributes');
          record.attributeName = eAttrName;
          if (options.attributeOldValue) {
            record.oldValue = attributeOldValueCache[eAttrName] || ePrevValue || null;
          }
          attributeMutations.push(record);
          if (options.attributeOldValue) {
            attributeOldValueCache[eAttrName] = eNewValue;
          }
          batchAttributeMods();
        }
      };
      this.elements.push(observed);
      if (options.childList) {
        target.addEventListener('DOMNodeInserted', observed.insertHandler);
        target.addEventListener('DOMNodeRemoved', observed.removeHandler);
      }
      if (options.attributes) {
        target.addEventListener('DOMAttrModified', observed.attributeHandler);
      }
      return this;
    },
    disconnect: function() {
      objEach(this.elements, function(observed) {
        observed.target.removeEventListener('DOMNodeInserted', observed.insertHandler);
        observed.target.removeEventListener('DOMNodeRemoved', observed.removeHandler);
        observed.target.removeEventListener('DOMAttrModified', observed.attributeHandler);
      });
      this.elements = [];
      return this;
    }
  };
  var $__default = MutationObserver;
  return {get default() {
      return $__default;
    }};
})();
var $___46__46__47_src_47_lifecycle__ = (function() {
  "use strict";
  var __moduleName = "../src/lifecycle";
  'use strict';
  var data = ($___46__46__47_src_47_data__).default;
  var MutationObserver = ($___46__46__47_src_47_mutation_45_observer__).default;
  var $__4 = $___46__46__47_src_47_utils__,
      inherit = $__4.inherit,
      objEach = $__4.objEach;
  var elProto = window.HTMLElement.prototype;
  var matchesSelector = (elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector);
  function getLifecycleFlag(target, component, name) {
    return data.get(target, component.id + ':lifecycle:' + name);
  }
  function setLifecycleFlag(target, component, name, value) {
    data.set(target, component.id + ':lifecycle:' + name, !!value);
  }
  function ensureLifecycleFlag(target, component, name) {
    if (getLifecycleFlag(target, component, name)) {
      return true;
    }
    setLifecycleFlag(target, component, name, true);
    return false;
  }
  function parseEvent(e) {
    var parts = e.split(' ');
    return {
      name: parts.shift(),
      delegate: parts.join(' ')
    };
  }
  function addAttributeListeners(target, component) {
    function triggerCallback(type, name, newValue, oldValue) {
      var callback;
      if (component.attributes && component.attributes[name] && typeof component.attributes[name][type] === 'function') {
        callback = component.attributes[name][type];
      } else if (component.attributes && typeof component.attributes[name] === 'function') {
        callback = component.attributes[name];
      } else if (typeof component.attributes === 'function') {
        callback = component.attributes;
      }
      if (callback) {
        callback(target, {
          type: type,
          name: name,
          newValue: newValue,
          oldValue: oldValue
        });
      }
    }
    var attrs = target.attributes;
    var attrsLen = attrs.length;
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        var type;
        var name = mutation.attributeName;
        var attr = attrs[name];
        if (attr && mutation.oldValue === null) {
          type = 'insert';
        } else if (attr && mutation.oldValue !== null) {
          type = 'update';
        } else if (!attr) {
          type = 'remove';
        }
        triggerCallback(type, name, attr ? (attr.value || attr.nodeValue) : undefined, mutation.oldValue);
      });
    });
    observer.observe(target, {
      attributes: true,
      attributeOldValue: true
    });
    for (var a = 0; a < attrsLen; a++) {
      var attr = attrs[a];
      if (attr) {
        triggerCallback('insert', attr.nodeName, (attr.value || attr.nodeValue));
      }
    }
  }
  function addEventListeners(target, component) {
    if (typeof component.events !== 'object') {
      return;
    }
    function makeHandler(handler, delegate) {
      return function(e) {
        if (!delegate) {
          return handler(target, e, target);
        }
        var current = e.target;
        while (current && current !== document && current !== target) {
          if (matchesSelector.call(current, delegate)) {
            return handler(target, e, current);
          }
          current = current.parentNode;
        }
      };
    }
    objEach(component.events, function(handler, name) {
      var evt = parseEvent(name);
      target.addEventListener(evt.name, makeHandler(handler, evt.delegate));
    });
  }
  function triggerReady(target, component) {
    if (ensureLifecycleFlag(target, component, 'ready')) {
      return;
    }
    inherit(target, component.prototype);
    if (component.template) {
      component.template(target);
    }
    addEventListeners(target, component);
    addAttributeListeners(target, component);
    if (component.ready) {
      component.ready(target);
    }
  }
  function triggerInsert(target, component) {
    if (ensureLifecycleFlag(target, component, 'insert')) {
      return;
    }
    target.removeAttribute(component.unresolvedAttribute);
    target.setAttribute(component.resolvedAttribute, '');
    if (component.insert) {
      component.insert(target);
    }
  }
  function triggerRemove(target, component) {
    if (component.remove) {
      component.remove(target);
    }
    setLifecycleFlag(target, component, 'insert', false);
  }
  function triggerLifecycle(target, component) {
    triggerReady(target, component);
    triggerInsert(target, component);
  }
  ;
  return {
    get triggerLifecycle() {
      return triggerLifecycle;
    },
    get triggerReady() {
      return triggerReady;
    },
    get triggerRemove() {
      return triggerRemove;
    }
  };
})();
var $___46__46__47_src_47_registry__ = (function() {
  "use strict";
  var __moduleName = "../src/registry";
  'use strict';
  var hasOwn = ($___46__46__47_src_47_utils__).hasOwn;
  if (!window.__skateDefinitions) {
    window.__skateDefinitions = {};
  }
  function getClassList(element) {
    var classList = element.classList;
    if (classList) {
      return classList;
    }
    var attrs = element.attributes;
    return (attrs['class'] && attrs['class'].nodeValue.split(/\s+/)) || [];
  }
  function isDefinitionOfType(id, type) {
    return hasOwn(window.__skateDefinitions, id) && window.__skateDefinitions[id].type.indexOf(type) > -1;
  }
  var $__default = {
    clear: function() {
      window.__skateDefinitions = {};
      return this;
    },
    getForElement: function(element) {
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
        definition = window.__skateDefinitions[isAttrOrTag];
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
          definition = window.__skateDefinitions[attr];
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
          definition = window.__skateDefinitions[className];
          tagToExtend = definition.extends;
          if (!tagToExtend || tag === tagToExtend) {
            definitions.push(definition);
          }
        }
      }
      return definitions;
    },
    has: function(id) {
      return hasOwn(window.__skateDefinitions, id);
    },
    set: function(id, definition) {
      if (this.has(id)) {
        throw new Error('A definition of type "' + definition.type + '" with the ID of "' + id + '" already exists.');
      }
      window.__skateDefinitions[id] = definition;
      return this;
    },
    remove: function(id) {
      if (this.has(id)) {
        delete window.__skateDefinitions[id];
      }
      return this;
    }
  };
  return {get default() {
      return $__default;
    }};
})();
var $___46__46__47_src_47_version__ = (function() {
  "use strict";
  var __moduleName = "../src/version";
  var $__default = '0.10.2';
  return {get default() {
      return $__default;
    }};
})();
var $___46__46__47_src_47_skate__ = (function() {
  "use strict";
  var __moduleName = "../src/skate";
  'use strict';
  var MutationObserver = ($___46__46__47_src_47_mutation_45_observer__).default;
  var registry = ($___46__46__47_src_47_registry__).default;
  var version = ($___46__46__47_src_47_version__).default;
  var ATTR_IGNORE = ($___46__46__47_src_47_constants__).ATTR_IGNORE;
  var $__10 = $___46__46__47_src_47_lifecycle__,
      triggerLifecycle = $__10.triggerLifecycle,
      triggerReady = $__10.triggerReady,
      triggerRemove = $__10.triggerRemove;
  var $__11 = $___46__46__47_src_47_utils__,
      debounce = $__11.debounce,
      getClosestIgnoredElement = $__11.getClosestIgnoredElement,
      inherit = $__11.inherit;
  var documentObserver;
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
        triggerRemove(element, definitions[b]);
      }
    }
  }
  var initDocument = debounce(function() {
    initElements(document.getElementsByTagName('html'));
  });
  function mutationObserverHandler(mutations) {
    var mutationsLength = mutations.length;
    for (var a = 0; a < mutationsLength; a++) {
      var mutation = mutations[a];
      var addedNodes = mutation.addedNodes;
      var removedNodes = mutation.removedNodes;
      if (addedNodes && addedNodes.length && !getClosestIgnoredElement(addedNodes[0].parentNode)) {
        initElements(addedNodes);
      }
      if (removedNodes && removedNodes.length) {
        removeElements(removedNodes);
      }
    }
  }
  function createMutationObserver(root) {
    var observer = new MutationObserver(mutationObserverHandler);
    observer.observe(root, {
      childList: true,
      subtree: true
    });
    return observer;
  }
  function destroyDocumentObserver() {
    if (documentObserver) {
      documentObserver.disconnect();
      documentObserver = undefined;
    }
  }
  function makeElementConstructor(definition) {
    function CustomElement() {
      var element;
      var tagToExtend = definition.extends;
      var definitionId = definition.id;
      if (tagToExtend) {
        element = document.createElement(tagToExtend);
        element.setAttribute('is', definitionId);
      } else {
        element = document.createElement(definitionId);
      }
      definition.prototype = CustomElement.prototype;
      triggerReady(element, definition);
      return element;
    }
    CustomElement.prototype = definition.prototype;
    return CustomElement;
  }
  function skate(id, definition) {
    definition = inherit(definition || {}, skate.defaults);
    definition.id = id;
    if (registry.has(definition.id)) {
      throw new Error('A definition of type "' + definition.type + '" with the ID of "' + id + '" already exists.');
    }
    registry.set(definition.id, definition);
    if (definition.remove && !MutationObserver.isFixingIe) {
      MutationObserver.fixIe();
      destroyDocumentObserver();
    }
    initDocument();
    if (!documentObserver) {
      documentObserver = createMutationObserver(document);
    }
    if (definition.type.indexOf(skate.types.TAG) > -1) {
      return makeElementConstructor(definition);
    }
  }
  skate.destroy = function() {
    destroyDocumentObserver();
    registry.clear();
    return skate;
  };
  skate.init = function(nodes) {
    if (!nodes) {
      return;
    }
    if (typeof nodes === 'string') {
      nodes = document.querySelectorAll(nodes);
    }
    initElements(typeof nodes.length === 'undefined' ? [nodes] : nodes);
    return nodes;
  };
  skate.types = {
    ANY: 'act',
    ATTR: 'a',
    CLASS: 'c',
    NOATTR: 'ct',
    NOCLASS: 'at',
    NOTAG: 'ac',
    TAG: 't'
  };
  skate.unregister = function(id) {
    delete registry.remove(id);
    return skate;
  };
  skate.version = version;
  skate.defaults = {
    attributes: undefined,
    events: undefined,
    extends: '',
    id: '',
    prototype: {},
    resolvedAttribute: 'resolved',
    template: undefined,
    type: skate.types.ANY,
    unresolvedAttribute: 'unresolved'
  };
  window.skate = skate;
  if (typeof define === 'function') {
    define(function() {
      return skate;
    });
  }
  if (typeof module === 'object') {
    module.exports = skate;
  }
  var $__default = skate;
  return {get default() {
      return $__default;
    }};
})();

}());
