'use strict';

import data from './data';
import {
  debounce,
  objEach
} from './utils';

var elProto = window.HTMLElement.prototype;
var elProtoContains = window.HTMLElement.prototype.contains;
var MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
var isIe = window.navigator.userAgent.indexOf('Trident') > -1;
var supportsNative = !!MutationObserver;

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
function walkTree (node, cb) {
  var childNodes = node.childNodes;

  if (!childNodes) {
    return;
  }

  var childNodesLen = childNodes.length;

  for (var a = 0; a < childNodesLen; a++) {
    var childNode = childNodes[a];
    cb(childNode);
    walkTree(childNode, cb);
  }
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

// Polyfill only the parts of Mutation Observer that we need.
if (!MutationObserver) {
  if (isIe) {
    var oldInnerHtml = Object.getOwnPropertyDescriptor(elProto, 'innerHTML');

    Object.defineProperty(elProto, 'innerHTML', {
      get: function () {
        return oldInnerHtml.get.call(this);
      },
      set: function (html) {
        walkTree(this, function (node) {
          var mutationEvent = document.createEvent('MutationEvent');
          mutationEvent.initMutationEvent('DOMNodeRemoved', true, false, null, null, null, null, null);
          node.dispatchEvent(mutationEvent);
        });

        oldInnerHtml.set.call(this, html);
      }
    });
  }

  MutationObserver = function (callback) {
    this.callback = callback;
    this.elements = [];
  };

  MutationObserver.prototype = {
    observe: function (target, options) {
      function addEventToBatch (e) {
        batchedEvents.push(e);
        batchEvents();
      }

      function batchEvent (e) {
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
          //return;
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
