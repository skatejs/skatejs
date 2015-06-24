(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/debounce', '../util/element-contains', '../util/obj-each'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/debounce'), require('../util/element-contains'), require('../util/obj-each'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.debounce, global.elementContains, global.objEach);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilDebounce, _utilElementContains, _utilObjEach) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _debounce = _interopRequireDefault(_utilDebounce);

  var _elementContains = _interopRequireDefault(_utilElementContains);

  var _objEach = _interopRequireDefault(_utilObjEach);

  var Attr = window.Attr;
  var elementPrototype = window.HTMLElement.prototype;
  var NativeMutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
  var isFixingIe = false;
  var isIe = window.navigator.userAgent.indexOf('Trident') > -1;

  /**
   * Creates a new mutation record.
   *
   * @param {Element} target The HTML element that was affected.
   * @param {String} type The type of mutation.
   *
   * @returns {Object}
   */
  function newMutationRecord(target, type) {
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
  function walkTree(node, cb) {
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

  /**
   * This "polyfill" only polyfills what we need for Skate to function. It
   * batches updates and does the bare minimum during synchronous operation
   * which make mutation event performance bearable. The rest is batched on the
   * next tick. Like mutation observers, each mutation is divided into sibling
   * groups for each parent that had mutations. All attribute mutations are
   * batched into separate records regardless of the element they occured on.
   *
   * @param {Function} callback The callback to execute with the mutation info.
   *
   * @returns {undefined}
   */
  function MutationObserver(callback) {
    if (NativeMutationObserver && !isFixingIe) {
      return new NativeMutationObserver(callback);
    }

    this.callback = callback;
    this.elements = [];
  }

  MutationObserver.prototype = {
    observe: function observe(target, options) {
      function addEventToBatch(e) {
        batchedEvents.push(e);
        batchEvents();
      }

      function batchEvent(e) {
        var eTarget = e.target;

        // In some test environments, e.target has been nulled after the tests
        // are done and a batch is still processing.
        if (!eTarget) {
          return;
        }

        var eType = e.type;
        var eTargetParent = eType === 'DOMNodeInserted' || eType === 'DOMNodeRemoved' ? e.relatedNode : eTarget.parentNode;

        if (!canTriggerInsertOrRemove(eTargetParent)) {
          return;
        }

        // The same bug that affects IE 11 also affects IE 9 / 10 with Mutation
        // Events.
        //
        // IE 11 bug: https://connect.microsoft.com/IE/feedback/details/817132/ie-11-childnodes-are-missing-from-mutationobserver-mutations-removednodes-after-setting-innerhtml
        var shouldWorkAroundIeRemoveBug = isFixingIe && eType === 'DOMNodeRemoved';
        var isDescendant = lastBatchedElement && lastBatchedElement.nodeType === 1 && (0, _elementContains['default'])(lastBatchedElement, eTarget);

        // This checks to see if the element is contained in the last batched
        // element. If it is, then we don't batch it because elements are
        // batched into first-children of a given parent. However, IE is (of
        // course) an exception to this and destroys the DOM tree heirarchy
        // before the callback gets fired if the element was removed. Because of
        // this, we have to let through all descendants that had the event
        // triggered on it.
        if (!shouldWorkAroundIeRemoveBug && isDescendant) {
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
          if (!lastBatchedRecord.removedNodes) {
            lastBatchedRecord.removedNodes = [];
          }

          lastBatchedRecord.removedNodes.push(eTarget);
        }

        lastBatchedElement = eTarget;
      }

      function canTriggerAttributeModification(eTarget) {
        return options.attributes && (options.subtree || eTarget === target);
      }

      function canTriggerInsertOrRemove(eTargetParent) {
        return options.childList && (options.subtree || eTargetParent === target);
      }

      var that = this;

      // Batching insert and remove.
      var lastBatchedElement;
      var lastBatchedRecord;
      var batchedEvents = [];
      var batchedRecords = [];
      var batchEvents = (0, _debounce['default'])(function () {
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
      var batchAttributeMods = (0, _debounce['default'])(function () {
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
        attributeHandler: function attributeHandler(e) {
          var eTarget = e.target;

          if (!(e.relatedNode instanceof Attr)) {
            // IE10 fires two mutation events for attributes, one with the
            // target as the relatedNode, and one where it's the attribute.
            //
            // Re: relatedNode, "In the case of the DOMAttrModified event
            // it indicates the Attr node which was modified, added, or
            // removed." [1]
            //
            // [1]: https://msdn.microsoft.com/en-us/library/ff943606%28v=vs.85%29.aspx
            return;
          }

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

    disconnect: function disconnect() {
      (0, _objEach['default'])(this.elements, function (observed) {
        observed.target.removeEventListener('DOMNodeInserted', observed.insertHandler);
        observed.target.removeEventListener('DOMNodeRemoved', observed.removeHandler);
        observed.target.removeEventListener('DOMAttrModified', observed.attributeHandler);
      });

      this.elements = [];

      return this;
    }
  };

  // Fix IE because IE.
  (function () {
    if (!isIe) {
      return;
    }

    // We have to call the old innerHTML getter and setter.
    var oldInnerHTML = Object.getOwnPropertyDescriptor(elementPrototype, 'innerHTML');

    // This redefines the innerHTML property so that we can ensure that events
    // are properly triggered.
    Object.defineProperty(elementPrototype, 'innerHTML', {
      get: function get() {
        return oldInnerHTML.get.call(this);
      },
      set: function set(html) {
        walkTree(this, function (node) {
          var mutationEvent = document.createEvent('MutationEvent');
          mutationEvent.initMutationEvent('DOMNodeRemoved', true, false, null, null, null, null, null);
          node.dispatchEvent(mutationEvent);
        });

        oldInnerHTML.set.call(this, html);
      }
    });

    // Flag so the polyfill is used for all subsequent Mutation Observer objects.
    isFixingIe = true;
  })();

  module.exports = MutationObserver;
});