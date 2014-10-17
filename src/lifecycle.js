'use strict';

import data from './data';
import MutationObserver from './mutation-observer';
import {
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

export {
  triggerLifecycle,
  triggerCreated,
  triggerDetached
};
