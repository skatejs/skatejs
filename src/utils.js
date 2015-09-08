'use strict';

import {
  ATTR_IGNORE
} from './constants';

var DocumentFragment = window.DocumentFragment;
export var elementPrototype = window.HTMLElement.prototype;
var elementPrototypeContains = elementPrototype.contains;

/**
 * Checks {}.hasOwnProperty in a safe way.
 *
 * @param {Object} obj The object the property is on.
 * @param {String} key The object key to check.
 *
 * @returns {Boolean}
 */
export function hasOwn (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Camel-cases the specified string.
 *
 * @param {String} str The string to camel-case.
 *
 * @returns {String}
 */
export function camelCase (str) {
  return str.split(/-/g).map(function (str, index) {
    return index === 0 ? str : str[0].toUpperCase() + str.substring(1);
  }).join('');
}

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
export function elementContains (source, target) {
  // The document element does not have the contains method in IE.
  if (source === document && !source.contains) {
    return document.head.contains(target) || document.body.contains(target);
  }

  return source.contains ? source.contains(target) : elementPrototypeContains.call(source, target);
}

/**
 * Returns a function that will prevent more than one call in a single clock
 * tick.
 *
 * @param {Function} fn The function to call.
 *
 * @returns {Function}
 */
export function debounce (fn) {
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

/**
 * Returns whether or not the specified element has been selectively ignored.
 *
 * @param {Element} element The element to check and traverse up from.
 *
 * @returns {Boolean}
 */
export function getClosestIgnoredElement (element) {
  var parent = element;

  // e.g. document doesn't have a function hasAttribute; no need to go further up
  while (parent instanceof Element) {
    if (parent.hasAttribute(ATTR_IGNORE)) {
      return parent;
    }

    parent = parent.parentNode;
  }
}

/**
 * Merges the second argument into the first.
 *
 * @param {Object} child The object to merge into.
 * @param {Object} parent The object to merge from.
 * @param {Boolean} overwrite Whether or not to overwrite properties on the child.
 *
 * @returns {Object} Returns the child object.
 */
export function inherit (child, parent, overwrite) {
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

/**
 * Traverses an object checking hasOwnProperty.
 *
 * @param {Object} obj The object to traverse.
 * @param {Function} fn The function to call for each item in the object.
 *
 * @returns {undefined}
 */
export function objEach (obj, fn) {
  for (var a in obj) {
    if (hasOwn(obj, a)) {
      fn(obj[a], a);
    }
  }
}

export function supportsNativeCustomElements () {
  return typeof document.registerElement === 'function';
}

export function isValidNativeCustomElementName (name) {
  return name.indexOf('-') > 0;
}
