'use strict';

import data from './data';
import MutationObserver from './mutation-observer';
import {
  addClass,
  inherit,
  objEach
} from './utils';

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

var elProto = window.HTMLElement.prototype;
var matchesSelector = (
    elProto.matches ||
    elProto.msMatchesSelector ||
    elProto.webkitMatchesSelector ||
    elProto.mozMatchesSelector ||
    elProto.oMatchesSelector
  );

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
 * Triggers the entire element lifecycle if it's not being ignored.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function triggerLifecycle (target, component) {
  triggerReady(target, component);
  triggerInsert(target, component);
}

/**
 * Triggers the ready lifecycle callback.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function triggerReady (target, component) {
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

/**
 * Triggers the insert lifecycle callback.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function triggerInsert (target, component) {
  if (ensureLifecycleFlag(target, component, 'insert')) {
    return;
  }

  addClass(target, component.classname);

  if (component.insert) {
    component.insert(target);
  }
}

/**
 * Triggers the remove lifecycle callback.
 *
 * @param {Element} target The component element.
 * @param {Object} component The component data.
 *
 * @returns {undefined}
 */
function triggerRemove (target, component) {
  if (component.remove) {
    component.remove(target);
    setLifecycleFlag(target, component, 'insert', false);
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

  // In default web components, attribute changes aren't triggered for
  // attributes that already exist on an element when it is bound. This sucks
  // when you want to reuse and separate code for attributes away from your
  // lifecycle callbacks. Skate will initialise each attribute calling the
  // "insert" callback that already exists on the element.
  for (var a = 0; a < attrsLen; a++) {
    var attr = attrs[a];

    // If an attribute is removed during the enumeration, then we must ensure
    // that each one still exists when it comes time to action it.
    if (attr) {
      triggerCallback('insert', attr.nodeName, (attr.value || attr.nodeValue));
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

      while (current && current !== document && current !== target) {
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

export {
  triggerLifecycle,
  triggerReady,
  triggerRemove
};
