'use strict';

import documentObserver from './document-observer';
import {
  triggerCreated,
  triggerAttached,
  triggerDetached,
  triggerAttributeChanged,
  initElements
} from './lifecycle';
import registry from './registry';
import {
  debounce,
  inherit,
  supportsNativeCustomElements
} from './utils';
import version from './version';

/**
 * Initialises all valid elements in the document. Ensures that it does not
 * happen more than once in the same execution, and that it happens after the DOM is ready.
 *
 * @returns {undefined}
 */
var initDocument = debounce(function () {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initElements(document.documentElement.childNodes);
  } else {
    document.addEventListener('DOMContentLoaded', function initialiseSkateElementsOnDomLoad() {
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
function skate (id, definition) {
  definition = inherit(definition || {}, skate.defaults);
  definition.id = id;

  registry.set(id, definition);

  var customElementConstructor;
  var isCustomElementExclusive = definition.type === skate.types.TAG;
  var isCustomElementInclusive = isCustomElementExclusive || definition.type.indexOf(skate.types.TAG) > -1;
  var isValidNativeCustomElementId = id.indexOf('-') > 0;

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

  if (typeof nodes === 'string') {
    nodesToUse = nodes = document.querySelectorAll(nodes);
  } else if (nodes instanceof window.HTMLElement) {
    nodesToUse = [nodes];
  }

  initElements(nodesToUse);

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
  id: '',

  // Properties and methods to add to each element.
  prototype: {},

  // The attribute name to add after calling the created() callback.
  resolvedAttribute: 'resolved',

  // The template to replace the content of the element with.
  template: undefined,

  // The type of bindings to allow.
  type: skate.types.ANY,

  // The attribute name to remove after calling the created() callback.
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
if (typeof exports === 'object') {
  exports.default = skate;
}

// ES6
export default skate;
