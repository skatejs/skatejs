'use strict';

import MutationObserver from './mutation-observer';
import registry from './registry';
import version from './version';

import {
    ATTR_IGNORE
  } from './constants';
import {
    triggerLifecycle,
    triggerReady,
    triggerRemove
  } from './lifecycle';
import {
    debounce,
    getClosestIgnoredElement,
    inherit
  } from './utils';

// The observer listening to document changes.
var documentObserver;

/**
 * Initialises a set of elements.
 *
 * @param {DOMNodeList | Array} elements A traversable set of elements.
 *
 * @returns {undefined}
 */
function initElements (elements) {
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
function removeElements (elements) {
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

/**
 * Initialises all valid elements in the document. Ensures that it does not
 * happen more than once in the same execution.
 *
 * @returns {undefined}
 */
var initDocument = debounce(function () {
  initElements(document.getElementsByTagName('html'));
});

/**
 * The mutation observer handler.
 *
 * @param {Array} mutations The mutations to handle.
 *
 * @returns {undefined}
 */
function mutationObserverHandler (mutations) {
  var mutationsLength = mutations.length;

  for (var a = 0; a < mutationsLength; a++) {
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
 * specified root element.
 *
 * @param {Element} root The element to observe.
 *
 * @returns {MutationObserver}
 */
function createMutationObserver (root) {
  var observer = new MutationObserver(mutationObserverHandler);

  // Observe after the DOM content has loaded.
  observer.observe(root, {
    childList: true,
    subtree: true
  });

  return observer;
}

/**
 * Disconnects the document observer and undefine it.
 *
 * @returns {undefined}
 */
function destroyDocumentObserver () {
  if (documentObserver) {
    documentObserver.disconnect();
    documentObserver = undefined;
  }
}

/**
 * Creates a constructor for the specified definition.
 *
 * @param {Object} definition The definition information to use for generating the constructor.
 *
 * @returns {Function} The element constructor.
 */
function makeElementConstructor (definition) {
  function CustomElement () {
    var element;
    var tagToExtend = definition.extends;
    var definitionId = definition.id;

    if (tagToExtend) {
      element = document.createElement(tagToExtend);
      element.setAttribute('is', definitionId);
    } else {
      element = document.createElement(definitionId);
    }

    // Ensure the definition prototype is up to date with the element's
    // prototype. This ensures that overwriting the element prototype still
    // works.
    definition.prototype = CustomElement.prototype;

    // If they use the constructor we don't have to wait until it's inserted.
    triggerReady(element, definition);

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
function skate (id, definition) {
  // Set any defaults that weren't passed.
  definition = inherit(definition || {}, skate.defaults);

  // Set the definition ID for reference later.
  definition.id = id;

  // Definitions of a particular type must be unique.
  if (registry.has(definition.id)) {
    throw new Error('A definition of type "' + definition.type + '" with the ID of "' + id + '" already exists.');
  }

  // Register the definition.
  registry.set(definition.id, definition);

  // IE has issues with reporting removedNodes correctly. See the polyfill for
  // details. If we fix IE, we must also re-define the documentObserver.
  if (definition.remove && !MutationObserver.isFixingIe) {
    MutationObserver.fixIe();
    destroyDocumentObserver();
  }

  // Initialise existing elements.
  initDocument();

  // Lazily initialise the document observer so we don't incur any overhead if
  // there's no definition listeners.
  if (!documentObserver) {
    documentObserver = createMutationObserver(document);
  }

  // Only make and return an element constructor if it can be used as a custom
  // element.
  if (definition.type.indexOf(skate.types.TAG) > -1) {
    return makeElementConstructor(definition);
  }
}

/**
 * Stops listening for new elements. Generally this will only be used in
 * testing.
 *
 * @returns {skate}
 */
skate.destroy = function () {
  destroyDocumentObserver();
  registry.clear();
  return skate;
};

/**
 * Synchronously initialises the specified element or elements and
 * descendants.
 *
 * @param {Mixed} nodes The node, or nodes to initialise. Can be anything:
 *                      jQuery, DOMNodeList, DOMNode, selector etc.
 *
 * @returns {skate}
 */
skate.init = function (nodes) {
  if (!nodes) {
    return;
  }

  if (typeof nodes === 'string') {
    nodes = document.querySelectorAll(nodes);
  }

  initElements(typeof nodes.length === 'undefined' ? [nodes] : nodes);

  return nodes;
};

// Restriction type constants.
skate.types = {
  ANY: 'act',
  ATTR: 'a',
  CLASS: 'c',
  NOATTR: 'ct',
  NOCLASS: 'at',
  NOTAG: 'ac',
  TAG: 't'
};

/**
 * Unregisters the specified definition.
 *
 * @param {String} id The ID of the definition to unregister.
 *
 * @returns {Skate}
 */
skate.unregister = function (id) {
  delete registry.remove(id);
  return skate;
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
  extends: '',

  // The ID of the definition. This is automatically set in the `skate()`
  // function.
  id: '',

  // Properties and methods to add to each element.
  prototype: {},

  // The attribute name to add after calling the ready() callback.
  resolvedAttribute: 'resolved',

  // The template to replace the content of the element with.
  template: undefined,

  // The type of bindings to allow.
  type: skate.types.ANY,

  // The attribute name to remove after calling the ready() callback.
  unresolvedAttribute: 'unresolved'
};

// Exporting
// ---------

// Always export the global. We don't know how consumers are using it and what
// their environments are like. Doing this affords them the flexibility of
// using it in an environment where module and non-module code may co-exist.
window.skate = skate;

// AMD
if (typeof define === 'function') {
  define(function () {
    return skate;
  });
}

// CommonJS
if (typeof module === 'object') {
  module.exports = skate;
}

// ES6
export default skate;
