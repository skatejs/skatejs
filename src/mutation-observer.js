'use strict';

import {
  debounce,
  objEach
} from './utils';

var elProto = window.HTMLElement.prototype;
var elProtoContains = elProto.contains;
var isIe = window.navigator.userAgent.indexOf('MSIE') > -1;
var isRestoring = false;

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
function elementContains (source, target) {
  if (source.nodeType !== 1) {
    return false;
  }

  return source.contains ? source.contains(target) : elProtoContains.call(source, target);
}

/**
 * Creates a new mutation record.
 *
 * @param {Element} target The HTML element that was affected.
 * @param {String} type The type of mutation.
 *
 * @returns {Object}
 */
function newMutationRecord (target, type) {
  return {
    addedNodes: null,
    attributeName: null,
    attributeNamespace: null,
    nextSibling: null,
    oldValue: null,
    previousSibling: null,
    removedNodes: null,
    target: target,
    type: type || 'childList'
  };
}

/**
 * Takes an element and recursively saves it's tree structure on each element so
 * that they can be restored later after IE screws things up.
 *
 * @param {Node} node The node to save the tree for.
 *
 * @returns {undefined}
 */
function saveDescendants (node) {
  var childNodes = node.childNodes;

  if (!childNodes) {
    return;
  }

  var childNodesLen = childNodes.length;
  var savedDescendants = node.__savedDescendants = [];

  for (var a = 0; a < childNodesLen; a++) {
    var childNode = childNodes[a];
    savedDescendants.push(childNode);
    saveDescendants(childNode);
  }
}

/**
 * Restores the descendant tree for the specified element with the nodes that
 * were saved in a prior call to `saveDescendants()`.
 *
 * @param {Node} node The node to restore the tree for.
 *
 * @returns {undefined}
 */
function restoreDescendants (node) {
  var saved = node.__savedDescendants;

  if (!saved) {
    return;
  }

  isRestoring = true;
  var savedLen = saved.length;

  for (var a = 0; a < savedLen; a++) {
    var desc = saved[a];

    // IE for some reason doesn't keep text nodes in their original form
    // (re-appending them fails) so we have to recreate them. It's important to
    // note at this point that we can't just restore element nodes because we
    // can't make assumptions about which nodes the callback cares about.
    if (desc.nodeType === 3) {
      desc = document.createTextNode(desc);
    }

    restoreDescendants(desc);
    node.appendChild(desc);
  }

  node.__savedDescendants = undefined;
  isRestoring = false;
}

// Mutation Observer "Polyfill"
// ----------------------------
//
// This "polyfill" only polyfills what we need for Skate to function. It
// batches updates and does the bare minimum during synchronous operation
// which make mutation event performance bearable. The rest is batched on the
// next tick. Like mutation observers, each mutation is divided into sibling
// groups for each parent that had mutations. All attribute mutations are
// batched into separate records regardless of the element they occured on.

// Normalise the mutation observer constructor.
var MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;

// Polyfill only the parts of Mutation Observer that we need.
if (!MutationObserver) {
  MutationObserver = function (callback) {
    this.callback = callback;
    this.elements = [];
  };

  MutationObserver.prototype = {
    observe: function (target, options) {
      function addEventToBatch (e) {
        batchedEvents.push(e);
        batchEvents();

        // We save the current tree state so that we can restore it after IE
        // mistakenly removes the nodes before the callback is fired. This is
        // currently a bug in IE 11 Mutation Observers and is also a bug in
        // IE 9/10 MutationEvents only if delaying the execution of the callback
        // using setTimeout(fn, 1) as we do to polyfill Mutation Observers and
        // keep the event execution from blocking.
        if (isIe && e.type === 'DOMNodeRemoved') {
          saveDescendants(e.target);
        }
      }

      function batchEvent (e) {
        // Don't execute any events if we are restoring nodes. We only have to
        // check a flag because events are synchronous and will only be true
        // while we are restoring. Any other nodes that trigger an event will
        // be queued either before or after.
        if (isRestoring) {
          return;
        }

        var eTarget = e.target;

        // In some test environments, e.target has been nulled after the tests
        // are done and a batch is still processing.
        if (!eTarget) {
          return;
        }

        var eType = e.type;
        var eTargetParent = eTarget.parentNode;

        if (!canTriggerInsertOrRemove(eTargetParent)) {
          return;
        }

        if (lastBatchedElement && elementContains(lastBatchedElement, eTarget)) {
          return;
        }

        if (!lastBatchedRecord || lastBatchedRecord.target !== eTargetParent) {
          batchedRecords.push(lastBatchedRecord = newMutationRecord(eTargetParent));
        }

        if (eType === 'DOMNodeInserted') {
          if (!lastBatchedRecord.addedNodes) {
            lastBatchedRecord.addedNodes = [];
          }

          lastBatchedRecord.addedNodes.push(eTarget);
        } else {
          // IE may have screwed up the descendants. At this point we must
          // ensure the node tree is restored.
          if (isIe) {
            restoreDescendants(eTarget);
          }

          if (!lastBatchedRecord.removedNodes) {
            lastBatchedRecord.removedNodes = [];
          }

          lastBatchedRecord.removedNodes.push(eTarget);
        }

        lastBatchedElement = eTarget;
      }

      function canTriggerAttributeModification (eTarget) {
        return options.attributes && (options.subtree || eTarget === target);
      }

      function canTriggerInsertOrRemove (eTargetParent) {
        return options.childList && (options.subtree || eTargetParent === target);
      }

      var that = this;

      // Batching insert and remove.
      var lastBatchedElement;
      var lastBatchedRecord;
      var batchedEvents = [];
      var batchedRecords = [];
      var batchEvents = debounce(function () {
          var batchedEventsLen = batchedEvents.length;

          for (var a = 0; a < batchedEventsLen; a++) {
            batchEvent(batchedEvents[a]);
          }

          that.callback(batchedRecords);
          batchedEvents = [];
          batchedRecords = [];
          lastBatchedElement = undefined;
          lastBatchedRecord = undefined;
        });

      // Batching attributes.
      var attributeOldValueCache = {};
      var attributeMutations = [];
      var batchAttributeMods = debounce(function () {
        // We keep track of the old length just in case attributes are
        // modified within a handler.
        var len = attributeMutations.length;

        // Call the handler with the current modifications.
        that.callback(attributeMutations);

        // We remove only up to the current point just in case more
        // modifications were queued.
        attributeMutations.splice(0, len);
      });

      var observed = {
        target: target,
        options: options,
        insertHandler: addEventToBatch,
        removeHandler: addEventToBatch,
        attributeHandler: function (e) {
          var eTarget = e.target;

          if (!canTriggerAttributeModification(eTarget)) {
            return;
          }

          var eAttrName = e.attrName;
          var ePrevValue = e.prevValue;
          var eNewValue = e.newValue;
          var record = newMutationRecord(eTarget, 'attributes');
          record.attributeName = eAttrName;

          if (options.attributeOldValue) {
            record.oldValue = attributeOldValueCache[eAttrName] || ePrevValue || null;
          }

          attributeMutations.push(record);

          // We keep track of old values so that when IE incorrectly reports
          // the old value we can ensure it is actually correct.
          if (options.attributeOldValue) {
            attributeOldValueCache[eAttrName] = eNewValue;
          }

          batchAttributeMods();
        }
      };

      this.elements.push(observed);

      if (options.childList) {
        target.addEventListener('DOMNodeInserted', observed.insertHandler);
        target.addEventListener('DOMNodeRemoved', observed.removeHandler);
      }

      if (options.attributes) {
        target.addEventListener('DOMAttrModified', observed.attributeHandler);
      }

      return this;
    },

    disconnect: function () {
      objEach(this.elements, function (observed) {
        observed.target.removeEventListener('DOMNodeInserted', observed.insertHandler);
        observed.target.removeEventListener('DOMNodeRemoved', observed.removeHandler);
        observed.target.removeEventListener('DOMAttrModified', observed.attributeHandler);
      });

      this.elements = [];

      return this;
    }
  };
}

export default MutationObserver;
