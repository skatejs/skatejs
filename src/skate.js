'use strict';

import MutationObserver from './mutation-observer';
import {
  triggerReady
} from './lifecycle';
import {
  initDocument,
  initElements,
  removeElements
} from './init';
import {
  getClassList,
  getClosestIgnoredElement,
  getSelectorForType,
  hasOwn,
  inherit
} from './utils';

// The observer listening to document changes.
var documentListener;

// Whether or not DOMContentLoaded has been triggered.
var isDomContentLoaded = document.readyState === 'complete' ||
  document.readyState === 'loaded' ||
  document.readyState === 'interactive';

// Stylesheet that contains rules for preventing certain components from
// showing when they're added to the DOM. This is so that we can simulate
// calling a lifecycle callback before the element is added to the DOM which
// helps to prevent any jank if the ready() callback modifies the element.
var hiddenRules = document.createElement('style');

// Component registry.
var registry = {};

function createDocumentObserver () {
  return createMutationObserver(document);
}

function createMutationObserver (root) {
  var observer = new MutationObserver(function (mutations) {
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
  });

  // Observe after the DOM content has loaded.
  observer.observe(root, {
    childList: true,
    subtree: true
  });

  return observer;
}

/**
 * Returns whether or not the specified component can be bound using the
 * specified type.
 *
 * @param {String} id The component ID.
 * @param {String} type The component type.
 *
 * @returns {Boolean}
 */
function isComponentOfType (id, type) {
  return hasOwn(registry, id) && registry[id].type.indexOf(type) > -1;
}

/**
 * Creates a constructor for the specified component.
 *
 * @param {Object} component The component information to use for generating
 *                           the constructor.
 *
 * @returns {Function} The element constructor.
 */
function makeElementConstructor (component) {
  function CustomElement () {
    var element;
    var tagToExtend = component.extends;
    var componentId = component.id;

    if (tagToExtend) {
      element = document.createElement(tagToExtend);
      element.setAttribute('is', componentId);
    } else {
      element = document.createElement(componentId);
    }

    // Ensure the component prototype is up to date with the element's
    // prototype. This ensures that overwriting the element prototype still
    // works.
    component.prototype = CustomElement.prototype;

    // If they use the constructor we don't have to wait until it's inserted.
    triggerReady(element, component);

    return element;
  }

  // This allows modifications to the element prototype propagate to the
  // component prototype.
  CustomElement.prototype = component.prototype;

  return CustomElement;
}

// Public API
// ----------

/**
 * Creates a listener for the specified component.
 *
 * @param {String} id The ID of the component.
 * @param {Object | Function} component The component definition.
 *
 * @returns {Function} Constructor that returns a custom element.
 */
function skate (id, component) {
  // Set any defaults that weren't passed.
  component = inherit(component || {}, skate.defaults);

  // Set the component ID for reference later.
  component.id = id;

  // Components of a particular type must be unique.
  if (hasOwn(registry, component.id)) {
    throw new Error('A component of type "' + component.type + '" with the ID of "' + id + '" already exists.');
  }

  // If doing something that will modify the component's structure, ensure
  // it is hidden.
  if (component.ready || component.template) {
    hiddenRules.sheet.insertRule(
      getSelectorForType(component.id, component.type, component.extends, '.' + component.classname) + '{display:none}',
      hiddenRules.sheet.cssRules.length
    );
  }

  // Register the component.
  registry[component.id] = component;

  // Ensure a call is queued for initialising the document if it's ready. We
  // must initialise the entire document rather than building a selector and
  // using querySelectorAll() because we have to filter out elements which may
  // be ignored. On top of that, if calling skate() in sequence several times,
  // querySelectorAll() can become slow pretty quick. The call to
  // initDocument() is debounced to ensure that it only happens once. In large
  // DOMs this ends up being faster. In small DOMs, the difference is
  // negligible, but usually faster in most use-cases.
  if (isDomContentLoaded) {
    initDocument();
  }

  // Lazily initialise the document observer so we don't incur any overhead if
  // there's no component listeners.
  if (!documentListener) {
    documentListener = createDocumentObserver();
  }

  // Only make and return an element constructor if it can be used as a custom
  // element.
  if (component.type.indexOf(skate.types.TAG) > -1) {
    return makeElementConstructor(component);
  }
}

/**
 * Returns the components for the specified element.
 *
 * @param {Element} element The element to get the components for.
 *
 * @returns {Array}
 */
skate.components = function (element) {
  var attrs = element.attributes;
  var attrsLen = attrs.length;
  var components = [];
  var isAttr = attrs.is;
  var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
  var tag = element.tagName.toLowerCase();
  var isAttrOrTag = isAttrValue || tag;
  var component;
  var tagToExtend;

  if (isComponentOfType(isAttrOrTag, skate.types.TAG)) {
    component = registry[isAttrOrTag];
    tagToExtend = component.extends;

    if (isAttrValue) {
      if (tag === tagToExtend) {
        components.push(component);
      }
    } else if (!tagToExtend) {
      components.push(component);
    }
  }

  for (var a = 0; a < attrsLen; a++) {
    var attr = attrs[a].nodeName;

    if (isComponentOfType(attr, skate.types.ATTR)) {
      component = registry[attr];
      tagToExtend = component.extends;

      if (!tagToExtend || tag === tagToExtend) {
        components.push(component);
      }
    }
  }

  var classList = getClassList(element);
  var classListLen = classList.length;

  for (var b = 0; b < classListLen; b++) {
    var className = classList[b];

    if (isComponentOfType(className, skate.types.CLASS)) {
      component = registry[className];
      tagToExtend = component.extends;

      if (!tagToExtend || tag === tagToExtend) {
        components.push(component);
      }
    }
  }

  return components;
};

/**
 * Stops listening for new elements. Generally this will only be used in
 * testing.
 *
 * @returns {skate}
 */
skate.destroy = function () {
  if (documentListener) {
    documentListener.disconnect();
    documentListener = undefined;
  }

  registry = {};

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
 * Unregisters the specified component.
 *
 * @param {String} id The ID of the component to unregister.
 *
 * @returns {Skate}
 */
skate.unregister = function (id) {
  delete registry[id];
  return skate;
};

// Makes checking the version easy when debugging.
skate.version = '0.10.0';

/**
 * The default options for a component.
 *
 * @var {Object}
 */
skate.defaults = {
  // Attribute lifecycle callback or callbacks.
  attributes: undefined,

  // The classname to use when showing this component.
  classname: '__skate',

  // The events to manage the binding and unbinding of during the component's
  // lifecycle.
  events: undefined,

  // Restricts a particular component to binding explicitly to an element with
  // a tag name that matches the specified value.
  extends: '',

  // The ID of the component. This is automatically set in the `skate()`
  // function.
  id: '',

  // Properties and methods to add to each element.
  prototype: {},

  // The template to replace the content of the element with.
  template: undefined,

  // The type of bindings to allow.
  type: skate.types.ANY
};

// Global Setup
// ------------

// Rules that hide elements as they're inserted so that elements are hidden
// prior to calling the ready callback to prevent FOUC if the component
// modifies the element in which it is bound.
document.getElementsByTagName('head')[0].appendChild(hiddenRules);

// We flag content as loaded here because after this, each call to skate()
// *must* re-initialise the document.
if (isDomContentLoaded) {
  initDocument();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    initDocument();
    isDomContentLoaded = true;
  });
}

// Exporting
// ---------

// Always export the global. We don't know how consumers are using it and what
// their environments are like. Doing this affords them the flexibility of
// using it in an environment where module and non-module code may co-exist.
window.skate = skate;

// AMD or CommonJS
if (typeof define === 'function' && define.amd) {
  define(function () {
    return skate;
  });
} else if (typeof module === 'object') {
  module.exports = skate;
}

// ES6
export default skate;
