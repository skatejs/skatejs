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
 * Filters out invalid nodes for a document tree walker.
 *
 * @param {DOMNode} node The node to filter.
 *
 * @returns {Integer}
 */
function treeWalkerFilter (node) {
  var attrs = node.attributes;
  return attrs && attrs[ATTR_IGNORE] ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
}

/**
 * Initialises a single element and its descendants.
 *
 * @param {HTMLElement} element The element tree to initialise.
 *
 * @returns {undefined}
 */
function initElement (element) {
  if (element.nodeType !== 1 || element.attributes[ATTR_IGNORE]) {
    return;
  }

  var walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, treeWalkerFilter, true);
  var currentNodeComponents = skate.components(element);
  var currentNodeComponentsLength = currentNodeComponents.length;

  for (var a = 0; a < currentNodeComponentsLength; a++) {
    triggerLifecycle(element, currentNodeComponents[a]);
  }

  while (walker.nextNode()) {
    var walkerNode = walker.currentNode;
    var walkerNodeComponents = skate.components(walkerNode);
    var walkerNodeComponentsLength = walkerNodeComponents.length;

    for (var b = 0; b < walkerNodeComponentsLength; b++) {
      triggerLifecycle(walkerNode, walkerNodeComponents[b]);
    }
  }
}

/**
 * Initialises a set of elements.
 *
 * @param {DOMNodeList | Array} elements A traversable set of elements.
 *
 * @returns {undefined}
 */
function initElements (elements) {
  var len = elements.length;

  for (var a = 0; a < len; a++) {
    initElement(elements[a]);
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
  initElement(document.getElementsByTagName('html')[0]);
});



export {
  initDocument,
  initElements,
  removeElements
};
