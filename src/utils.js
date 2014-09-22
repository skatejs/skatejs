'use strict';

import {
  ATTR_IGNORE
} from './constants';

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
 * Adds a class to the specified element.
 *
 * @param {Element} element The element to add the class to.
 * @param {String} newClass The classname to add.
 *
 * @returns {undefined}
 */
export function addClass (element, newClass) {
  // Modern JS engines.
  if (element.classList) {
    element.classList.add(newClass);
  // Legacy JS engines.
  } else if (hasOwn(element, 'className')) {
    element.className += element.className ? ' ' + newClass : newClass;
  // SVG elements.
  } else {
    var oldClass = element.getAttribute('class');
    element.setAttribute('class', oldClass ? oldClass + ' ' + newClass : newClass);
  }
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
 * Returns the class list for the specified element.
 *
 * @param {Element} element The element to get the class list for.
 *
 * @returns {ClassList | Array}
 */
export function getClassList (element) {
  var classList = element.classList;

  if (classList) {
    return classList;
  }

  var attrs = element.attributes;

  return (attrs['class'] && attrs['class'].nodeValue.split(/\s+/)) || [];
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

  while (parent && parent !== document) {
    if (parent.hasAttribute(ATTR_IGNORE)) {
      return parent;
    }

    parent = parent.parentNode;
  }
}

/**
 * Returns a selector for the specified component based on the types given.
 * If a negation selector is passed in then it will append :not(negateWith) to
 *  the selector.
 *
 * @param {String} id The component ID.
 * @param {String} type The component type.
 * @param {String} tagToExtend The tag the component is extending, if any.
 * @param {String} negateWith The negation string, if any.
 *
 * @returns {String} The compiled selector.
 */
export function getSelectorForType (id, type, tagToExtend, negateWith) {
  var isTag = type.indexOf(skate.types.TAG) > -1;
  var isAttr = type.indexOf(skate.types.ATTR) > -1;
  var isClass = type.indexOf(skate.types.CLASS) > -1;
  var selectors = [];

  tagToExtend = tagToExtend || '';
  negateWith = negateWith ? ':not(' + negateWith + ')' : '';

  if (isTag) {
    if (tagToExtend) {
      selectors.push(tagToExtend + '[is=' + id + ']' + negateWith);
    } else {
      selectors.push(id + negateWith);
    }
  }

  if (isAttr) {
    selectors.push(tagToExtend + '[' + id + ']' + negateWith);
  }

  if (isClass) {
    selectors.push(tagToExtend + '.' + id + negateWith);
  }

  return selectors.join(',');
}

/**
 * Merges the second argument into the first.
 *
 * @param {Object} child The object to merge into.
 * @param {Object} parent The object to merge from.
 *
 * @returns {Object} Returns the child object.
 */
export function inherit (child, parent) {
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
