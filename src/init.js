'use strict';

import {
  debounce
} from './utils';
import {
  ATTR_IGNORE
} from './constants';
import {
  triggerLifecycle,
  triggerRemove
} from './lifecycle';

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

    var currentNodeComponents = skate.components(element);
    var currentNodeComponentsLength = currentNodeComponents.length;

    for (var b = 0; b < currentNodeComponentsLength; b++) {
      triggerLifecycle(element, currentNodeComponents[b]);
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

    var components = skate.components(element);
    var componentsLen = components.length;

    for (var b = 0; b < componentsLen; b++) {
      triggerRemove(element, components[b]);
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

export {
  initDocument,
  initElements,
  removeElements
};
