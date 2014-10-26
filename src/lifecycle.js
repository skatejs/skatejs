'use strict';

import {
  ATTR_IGNORE
} from './constants';
import data from './data';
import MutationObserver from './mutation-observer';
import registry from './registry';
import {
  hasOwn,
  inherit,
  objEach
} from './utils';

var elProto = window.HTMLElement.prototype;
var matchesSelector = (
    elProto.matches ||
    elProto.msMatchesSelector ||
    elProto.webkitMatchesSelector ||
    elProto.mozMatchesSelector ||
    elProto.oMatchesSelector
  );

function getLifecycleFlag (target, component, name) {
  return data.get(target, component.id + ':lifecycle:' + name);
}

function setLifecycleFlag (target, component, name, value) {
  data.set(target, component.id + ':lifecycle:' + name, !!value);
}

function ensureLifecycleFlag (target, component, name) {
  if (getLifecycleFlag(target, component, name)) {
    return true;
  }
  setLifecycleFlag(target, component, name, true);
  return false;
}

/**
 * Parses an event definition and returns information about it.
 *
 * @param {String} e The event to parse.
 *
 * @returns {Object]}
 */
function parseEvent (e) {
  var parts = e.split(' ');
  return {
    name: parts.shift(),
    delegate: parts.join(' ')
  };
}

function camelCase (str) {
  return str.split(/-/g).map(function (str, index) {
    return index === 0 ? str : str[0].toUpperCase() + str.substring(1);
  }).join('');
}

function defineAttributeProperty (target, attribute) {
  Object.defineProperty(target, camelCase(attribute), {
    get: function () {
      return this.getAttribute(attribute);
    },
    set: function (value) {
      this.setAttribute(attribute, value);
    }
  });
}

function initAttributes (target, component) {
  var componentAttributes = component.attributes;

  if (typeof componentAttributes !== 'object') {
    return;
  }

  for (var attribute in componentAttributes) {
    if (hasOwn(componentAttributes, attribute) && hasOwn(componentAttributes[attribute], 'init')) {
      target.setAttribute(attribute, componentAttributes[attribute].init);
    }
  }
}

function addAttributeToPropertyLinks (target, component) {
  var componentAttributes = component.attributes;

  if (typeof componentAttributes !== 'object') {
    return;
  }

  for (var attribute in componentAttributes) {
    if (hasOwn(componentAttributes, attribute) && !hasOwn(target, attribute)) {
      defineAttributeProperty(target, attribute);
    }
  }
}

/**
 * Binds attribute listeners for the specified attribute handlers.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function addAttributeListeners (target, component) {
  function triggerCallback (type, name, newValue, oldValue) {
    var callback;

    if (component.attributes && component.attributes[name] && typeof component.attributes[name][type] === 'function') {
      callback = component.attributes[name][type];
    } else if (component.attributes && typeof component.attributes[name] === 'function') {
      callback = component.attributes[name];
    } else if (typeof component.attributes === 'function') {
      callback = component.attributes;
    }

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

  var attrs = target.attributes;
  var attrsLen = attrs.length;
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var type;
      var name = mutation.attributeName;
      var attr = attrs[name];

      if (attr && mutation.oldValue === null) {
        type = 'created';
      } else if (attr && mutation.oldValue !== null) {
        type = 'updated';
      } else if (!attr) {
        type = 'removed';
      }

      triggerCallback(type, name, attr ? (attr.value || attr.nodeValue) : undefined, mutation.oldValue);
    });
  });

  observer.observe(target, {
    attributes: true,
    attributeOldValue: true
  });

  initAttributes(target, component);
  addAttributeToPropertyLinks(target, component);

  // In default web components, attribute changes aren't triggered for
  // attributes that already exist on an element when it is bound. This sucks
  // when you want to reuse and separate code for attributes away from your
  // lifecycle callbacks. Skate will initialise each attribute by calling the
  // created callback for the attributes that already exist on the element.
  for (var a = 0; a < attrsLen; a++) {
    var attr = attrs[a];

    // If an attribute is removed during the enumeration, then we must ensure
    // that each one still exists when it comes time to action it.
    if (attr) {
      triggerCallback('created', attr.nodeName, (attr.value || attr.nodeValue));
    }
  }
}

/**
 * Binds event listeners for the specified event handlers.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function addEventListeners (target, component) {
  if (typeof component.events !== 'object') {
    return;
  }

  function makeHandler (handler, delegate) {
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
    target.addEventListener(evt.name, makeHandler(handler, evt.delegate));
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
function triggerCreated (target, component) {
  if (ensureLifecycleFlag(target, component, 'created')) {
    return;
  }

  inherit(target, component.prototype);

  if (component.template) {
    component.template(target);
  }

  addEventListeners(target, component);
  addAttributeListeners(target, component);

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
function triggerAttached (target, component) {
  if (ensureLifecycleFlag(target, component, 'attached')) {
    return;
  }

  target.removeAttribute(component.unresolvedAttribute);
  target.setAttribute(component.resolvedAttribute, '');

  if (component.attached) {
    component.attached(target);
  }
}

/**
 * Triggers the detached lifecycle callback.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function triggerDetached (target, component) {
  if (component.detached) {
    component.detached(target);
  }

  setLifecycleFlag(target, component, 'attached', false);
}

/**
 * Triggers the entire element lifecycle if it's not being ignored.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function triggerLifecycle (target, component) {
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
      triggerDetached(element, definitions[b]);
    }
  }
}

export {
  triggerCreated,
  initElements,
  removeElements
};
