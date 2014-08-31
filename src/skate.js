(function () {

  'use strict';

  // Lifecycle Triggers
  // ------------------

  /**
   * Triggers the entire element lifecycle if it's not being ignored.
   *
   * @param {Element} target The component element.
   * @param {Object} component The component data.
   *
   * @returns {undefined}
   */
  function triggerLifecycle (target, component) {
    if (getData(target, component.id + '.initialised')) {
      return;
    }

    setData(target, component.id + '.initialised', true);

    triggerReady(target, component, function () {
      triggerInsert(target, component);
    });
  }

  /**
   * Triggers the ready lifecycle callback.
   *
   * @param {Element} target The component element.
   * @param {Object} component The component data.
   * @param {Function} done The callback to execute when the lifecycle callback is finished.
   *
   * @returns {undefined}
   */
  function triggerReady (target, component, done) {
    var definedMultipleArgs = /^[^(]+\([^,)]+,/;
    done = done || function () {};

    if (getData(target, component.id + '.ready-called')) {
      return done();
    }

    setData(target, component.id + '.ready-called', true);

    if (component.template) {
      component.template(target);
    }

    inherit(target, component.prototype);
    addEventListeners(target, component);

    if (component.ready && definedMultipleArgs.test(component.ready)) {
      component.ready(target, done);
    } else if (component.ready) {
      component.ready(target);
      done();
    } else {
      done();
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
    if (!target.parentNode) {
      return;
    }

    if (getData(target, component.id + '.insert-called')) {
      return;
    }

    setData(target, component.id + '.insert-called', true);
    addClass(target, component.classname);

    if (component.insert) {
      component.insert(target);
    }

    addAttributeListeners(target, component);
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
    if (getData(target, component.id + '.remove-called')) {
      return;
    }

    setData(target, component.id + '.remove-called', true);

    if (component.remove) {
      component.remove(target);
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

    // In default web components, attribute changes aren't triggered for attributes that already exist on an element
    // when it is bound. This sucks when you want to reuse and separate code for attributes away from your lifecycle
    // callbacks. Skate will initialise each attribute calling the "insert" callback that already exists on the element.
    for (var a = 0; a < attrsLen; a++) {
      var attr = attrs[a];

      // If an attribute is removed during the enumeration, then we must ensure that each one still exists when it
      // comes time to action it.
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
        if (!delegate || matchesSelector.call(e.target, delegate)) {
          handler(target, e);
        }
      };
    }

    objEach(component.events, function (handler, name) {
      var evt = parseEvent(name);
      target.addEventListener(evt.name, makeHandler(handler, evt.delegate));
    });
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


  // Utilities
  // ---------

  /**
   * Adds data to the element.
   *
   * @param {Element} element The element to get data from.
   * @param {String} name The name of the data to return.
   *
   * @returns {Mixed}
   */
  function getData (element, name) {
    if (element.__SKATE_DATA) {
      return element.__SKATE_DATA[name];
    }
  }

  /**
   * Adds data to the element.
   *
   * @param {Element} element The element to apply data to.
   * @param {String} name The name of the data.
   * @param {Mixed} value The data value.
   *
   * @returns {undefined}
   */
  function setData (element, name, value) {
    if (!element.__SKATE_DATA) {
      element.__SKATE_DATA = {};
    }

    element.__SKATE_DATA[name] = value;
  }

  /**
   * Adds a class to the specified element.
   *
   * @param {Element} element The element to add the class to.
   * @param {String} classname The classname to add.
   *
   * @returns {undefined}
   */
  function addClass (element, classname) {
    if (element.classList) {
      element.classList.add(classname);
    } else {
      element.className += element.className ? ' ' + classname : classname;
    }
  }

  /**
   * Returns the class list for the specified element.
   *
   * @param {Element} element The element to get the class list for.
   *
   * @returns {ClassList | Array}
   */
  function getClassList (element) {
    var classList = element.classList;

    if (classList) {
      return classList;
    }

    var attrs = element.attributes;

    return (attrs['class'] && attrs['class'].nodeValue.split(/\s+/)) || [];
  }

  /**
   * Merges the second argument into the first.
   *
   * @param {Object} child The object to merge into.
   * @param {Object} parent The object to merge from.
   *
   * @returns {Object} Returns the child object.
   */
  function inherit (child, parent) {
    objEach(parent, function (member, name) {
      if (child[name] === undefined) {
        child[name] = member;
      }
    });

    return child;
  }

  /**
   * Checks {}.hasOwnProperty in a safe way.
   *
   * @param {Object} obj The object the property is on.
   * @param {String} key The object key to check.
   *
   * @returns {Boolean}
   */
  function hasOwn (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  /**
   * Traverses an object checking hasOwnProperty.
   *
   * @param {Object} obj The object to traverse.
   * @param {Function} fn The function to call for each item in the object.
   *
   * @returns {undefined}
   */
  function objEach (obj, fn) {
    for (var a in obj) {
      if (hasOwn(obj, a)) {
        fn(obj[a], a);
      }
    }
  }

  /**
   * Creates a constructor for the specified component.
   *
   * @param {Object} component The component information to use for generating the constructor.
   *
   * @returns {Function} The element constructor.
   */
  function makeElementConstructor (component) {
    function CustomElement () {
      var element = document.createElement(component.id);

      // Ensure the component prototype is up to date with the element's prototype. This ensures that overwriting the
      // element prototype still works.
      component.prototype = CustomElement.prototype;

      // If they use the constructor we don't have to wait until it's inserted.
      triggerReady(element, component);

      return element;
    }

    // This allows modifications to the element prototype propagate to the component prototype.
    CustomElement.prototype = component.prototype;

    return CustomElement;
  }

  /**
   * Returns whether or not the specified element has been selectively ignored.
   *
   * @param {Element} element The element to check and traverse up from.
   *
   * @returns {Boolean}
   */
  function getClosestIgnoredElement (element) {
    var parent = element;

    while (parent && parent !== document) {
      if (parent.hasAttribute(ATTR_IGNORE)) {
        return parent;
      }

      parent = parent.parentNode;
    }
  }

  /**
   * Returns a selector for the specified component based on the types given. If a negation selector is passed in then
   * it will append :not(negateWith) to the selector.
   *
   * @param {String} id The component ID.
   * @param {String} type The component type.
   * @param {String} negateWith The negation string, if any.
   *
   * @returns {String} The compiled selector.
   */
  function getSelectorForType (id, type, negateWith) {
    var isTag = type.indexOf(skate.types.TAG) > -1;
    var isAttr = type.indexOf(skate.types.ATTR) > -1;
    var isClass = type.indexOf(skate.types.CLASS) > -1;
    var selectors = [];

    negateWith = negateWith ? ':not(' + negateWith + ')' : '';

    if (isTag) {
      selectors.push(id + negateWith);
      selectors.push('[is=' + id + ']' + negateWith);
    }

    if (isAttr) {
      selectors.push('[' + id + ']' + negateWith);
    }

    if (isClass) {
      selectors.push('.' + id + negateWith);
    }

    return selectors.join(',');
  }

  /**
   * Returns whether or not the specified component can be bound using the specified type.
   *
   * @param {String} id The component ID.
   * @param {String} type The component type.
   *
   * @returns {Boolean}
   */
  function isComponentOfType (id, type) {
    return hasOwn(registry, id) && registry[id].type.indexOf(type) > -1;
  }

  /**
   * Finds direct children in the `sourceNode` that match the given selector.
   *
   * @param {Element} sourceNode The node to find the elements in.
   * @param {String} selector The selector to use. If not specified, all `childNodes` are returned.
   *
   * @returns {NodeList}
   */
  function findChildrenMatchingSelector (sourceNode, selector) {
    if (selector) {
      var found = sourceNode.querySelectorAll(selector);
      var foundLength = found.length;
      var filtered = [];

      for (var a = 0; a < foundLength; a++) {
        var node = found[a];

        if (node.parentNode === sourceNode) {
          filtered.push(node);
        }
      }

      return filtered;
    }

    return sourceNode.childNodes || [];
  }

  /**
   * Creates a document fragment from the specified DOM string. It ensures that if special nodes are passed in that
   * they are added to a valid parent node before importing to the document fragment.
   *
   * @param {String} domString The HTMl to create a fragment from.
   *
   * @returns {DocumentFragment}
   */
  function createFragmentFromString (domString) {
    var specialMap = {
        caption: 'table',
        dd: 'dl',
        dt: 'dl',
        li: 'ul',
        tbody: 'table',
        td: 'tr',
        thead: 'table',
        tr: 'tbody'
      };
    var tag = domString.match(/\s*<([^\s>]+)/);
    var frag = document.createDocumentFragment();
    var div = document.createElement(tag && specialMap[tag[1]] || 'div');

    div.innerHTML = domString;
    insertNodeList(frag, div.childNodes);

    return frag;
  }

  /**
   * Inserts the specified nodes into the given element.
   *
   * @param {Element} element The element to insert the nodes into.
   * @param {Enumerable} nodes The nodes to insert.
   *
   * @returns {undefined}
   */
  function insertNodeList (element, nodes) {
    var len = nodes.length;

    if (nodes && len) {
      for (var a = len - 1; a >= 0; a--) {
        var newNode = nodes[a];
        var reference = element.childNodes[0];

        if (reference) {
          element.insertBefore(newNode, reference);
        } else {
          element.appendChild(newNode);
        }
      }
    }
  }

  /**
   * Removes the nodes in the node list from the specified element.
   *
   * @param {HTMLElement} element The element to remove the nodes from.
   * @param {Enumerable} nodes The list of nodes to remove.
   *
   * @retruns {undefined}
   */
  function removeNodeList (element, nodes) {
    var len = nodes.length;

    if (nodes && len) {
      for (var a = 0; a < len; a++) {
        var node = nodes[a];
        element.removeChild(node);
      }
    }
  }

  /**
   * Returns whether or not the source element contains the target element. This is for browsers that don't support
   * Element.prototype.contains on an HTMLUnknownElement.
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
   * @param {DOMNodeList} elements The elements to trigger the remove lifecycle callback on.
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

      var childNodes = element.childNodes;

      removeElements(childNodes);
      skate.components(element).forEach(removeElementsRemover(element));
    }
  }

  /**
   * Makes a function that calls triggerRemove for the specified element's components.
   *
   * @param {Element} element The element to generate the remover for.
   *
   * @return {Function}
   */
  function removeElementsRemover (element) {
    return function (component) {
      triggerRemove(element, component);
    };
  }

  /**
   * Returns a function that will prevent more than one call in a single clock tick.
   *
   * @param {Function} fn The function to call.
   *
   * @returns {Function}
   */
  function debounce (fn) {
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
   * Initialises all valid elements in the document. Ensures that it does not happen more than once in the same
   * execution.
   *
   * @returns {undefined}
   */
  var initDocument = debounce(function () {
    initElement(document.getElementsByTagName('html')[0]);
  });



  // Constants
  // ---------

  var ATTR_CONTENT = 'data-skate-content';
  var ATTR_IGNORE = 'data-skate-ignore';
  var REGEX_WHITESPACE = /^[\s\r\n]*$/;



  // Global Variables
  // ----------------

  var elProto = window.HTMLElement.prototype;
  var elProtoContains = elProto.contains;
  var matchesSelector = (
      elProto.matches ||
      elProto.msMatchesSelector ||
      elProto.webkitMatchesSelector ||
      elProto.mozMatchesSelector ||
      elProto.oMatchesSelector
    );


  // The observer listening to document changes.
  var documentListener;

  // Whether or not DOMContentLoaded has been triggered.
  var domContentLoaded = false;

  // Stylesheet that contains rules for preventing certain components from showing when they're added to the DOM. This
  // is so that we can simulate calling a lifecycle callback before the element is added to the DOM which helps to
  // prevent any jank if the ready() callback modifies the element.
  var hiddenRules = document.createElement('style');

  // The skate component registry.
  var registry = {};



  // Mutation Observer "Polyfill"
  // ----------------------------
  //
  // This "polyfill" only polyfills what we need for Skate to function. It batches updates and does the bare minimum
  // during synchronous operation which make mutation event performance bearable. The rest is batched on the next tick.
  // Like mutation observers, each mutation is divided into sibling groups for each parent that had mutations. All
  // attribute mutations are batched into separate records regardless of the element they occured on.

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
        }

        function batchEvent (e) {
          var eTarget = e.target;

          // In some test environments, e.target has been nulled after the tests are done and a batch is still
          // processing.
          if (!eTarget) {
            return;
          }

          var eTargetParent = eTarget.parentNode;

          if (!canTriggerInsertOrRemove(eTargetParent)) {
            return;
          }

          if (lastBatchedElement && elementContains(lastBatchedElement, eTarget)) {
            return;
          }

          if (!lastBatchedRecord) {
            batchedRecords.push(lastBatchedRecord = newMutationRecord(eTargetParent));
          }

          if (eTargetParent) {
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
          return eTarget === target;
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
          // We keep track of the old length just in case attributes are modified within a handler.
          var len = attributeMutations.length;

          // Call the handler with the current modifications.
          that.callback(attributeMutations);

          // We remove only up to the current point just in case more modifications were queued.
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

            // We keep track of old values so that when IE incorrectly reports the old value we can ensure it is
            // actually correct.
            if (options.attributeOldValue) {
              attributeOldValueCache[eAttrName] = eNewValue;
            }

            batchAttributeMods();
          }
        };

        this.elements.push(observed);

        if (options.childList) {
          // TODO: Try using DOMSubtreeModified and diffing the children rather than using DOMNodeInserted and
          // eliminating nodes that aren't first children.
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



  // Public API
  // ----------

  /**
   * Creates a listener for the specified component.
   *
   * @param {String} id The ID of the component.
   * @param {Object | Function} component The component definition.
   *
   * @returns {Function} Function or constructor that creates a custom-element for the component.
   */
  function skate (id, component) {
    // Set any defaults that weren't passed.
    component = inherit(component || {}, skate.defaults);

    // Set the component ID for reference later.
    component.id = id;

    // Components of a particular type must be unique.
    if (hasOwn(registry, component.id)) {
      throw new Error('A component of type "' + component.type + '" with the ID of "' + id + '" already exists.');
    }

    // Set default template renderer for template strings.
    if (component.template && typeof component.template === 'string') {
      component.template = skate.template.html(component.template);
    }

    // If doing something that will modify the component's structure, ensure it's not displayed yet.
    if (component.ready || component.template) {
      hiddenRules.sheet.insertRule(
        getSelectorForType(component.id, component.type, '.' + component.classname) + '{display:none}',
        hiddenRules.sheet.cssRules.length
      );
    }

    // Register the component.
    registry[component.id] = component;

    // Ensure a call is queued for initialising the document if it's ready. We must initialise the entire document
    // rather than building a selector and using querySelectorAll() because we have to filter out elements which may
    // be ignored. On top of that, if calling skate() in sequence several times, querySelectorAll() can become slow
    // pretty quick. The call to initDocument() is debounced to ensure that it only happens once. In large DOMs this
    // ends up being faster. In small DOMs, the difference is negligible, but usually faster in most use-cases.
    if (domContentLoaded) {
      initDocument();
    }

    // Only make and return an element constructor if it can be used as a custom element.
    if (component.type.indexOf(skate.types.TAG) > -1) {
      return makeElementConstructor(component);
    }
  }

  /**
   * Returns the components for the specified element.
   *
   * @param {Element} element The element to get the components for.
   *
   * @returns {Array}
   */
  skate.components = function (element) {
    var attrs = element.attributes;
    var attrsLen = attrs.length;
    var components = [];
    var isAttr = attrs.is;
    var tag = isAttr && (isAttr.value || isAttr.nodeValue) || element.tagName.toLowerCase();

    if (isComponentOfType(tag, skate.types.TAG)) {
      components.push(registry[tag]);
    }

    for (var a = 0; a < attrsLen; a++) {
      var attr = attrs[a].nodeName;

      if (isComponentOfType(attr, skate.types.ATTR)) {
        components.push(registry[attr]);
      }
    }

    var classList = getClassList(element);
    var classListLen = classList.length;

    for (var b = 0; b < classListLen; b++) {
      var className = classList[b];

      if (isComponentOfType(className, skate.types.CLASS)) {
        components.push(registry[className]);
      }
    }

    return components;
  };

  /**
   * Stops listening for new elements. Generally this will only be used in testing.
   *
   * @returns {skate}
   */
  skate.destroy = function () {
    registry = {};
    return skate;
  };

  /**
   * Synchronously initialises the specified element or elements and descendants.
   *
   * @param {Mixed} nodes The node, or nodes to initialise. Can be anything: jQuery, DOMNodeList, DOMNode etc.
   *
   * @returns {skate}
   */
  skate.init = function (nodes) {
    if (typeof nodes.length === 'undefined') {
      nodes = [nodes];
    }

    initElements(nodes);

    return arguments[0];
  };

  /**
   * Default template renderers.
   *
   * @var {Object}
   */
  skate.template = {};

  /**
   * Default template renderer. Similar to ShadowDOM style templating where content is projected from the light DOM.
   *
   * Differences:
   *
   * - Uses a `data-skate-content` attribute instead of a `select` attribute.
   * - Attribute is applied to existing elements rather than the <content> element to prevent styling issues.
   * - Does not dynamically project modifications to the root custom element. You must affect each projection node.
   *
   * Usage:
   *
   *     skate('something', {
   *       template: skate.template.html('<my-html-template data-skate-content=".select-some-children"></my-html-template>')
   *     });
   *
   * @param {String} templateString The HTML template string to use.
   *
   * @returns {Function} The function for rendering the template.
   */
  skate.template.html = function (templateString) {
    var template = createFragmentFromString(templateString);
    var mutating = false;
    var contentMutationObserver = new MutationObserver(function (mutations) {
        // If we are mutating, it means that the content mutation observer previously ran and we shouldn't run this
        // set of mutations. Simply unflag and return.
        if (mutating) {
          mutating = false;
          return;
        }

        mutating = true;

        for (var a = 0; a < mutations.length; a++) {
          var mutation = mutations[a];
          var mutationTarget = mutation.target;
          var defaultContent = getData(mutationTarget, 'default-content');

          if (mutation.addedNodes) {
            removeNodeList(mutationTarget, defaultContent);
          }

          if (mutation.removedNodes && mutationTarget.innerHTML.match(REGEX_WHITESPACE)) {
            mutationTarget.innerHTML = '';
            insertNodeList(mutationTarget, defaultContent);
          }
        }
      });

    return function (target) {
      var targetFragment = createFragmentFromString(target.innerHTML);
      var targetTemplate = template.cloneNode(true);
      var contentNodes = targetTemplate.querySelectorAll('[' + ATTR_CONTENT + ']');
      var contentNodesLength = contentNodes.length;

      if (contentNodesLength) {
        for (var a = 0; a < contentNodesLength; a++) {
          var contentNode = contentNodes[a];
          var foundNodes = findChildrenMatchingSelector(targetFragment, contentNode.getAttribute(ATTR_CONTENT));

          // Save the default content so we can use it when all nodes are removed from the content.
          setData(contentNode, 'default-content', [].slice.call(contentNode.childNodes));

          // If any initial content is found we replace any content with them.
          if (foundNodes.length) {
            contentNode.innerHTML = '';
            insertNodeList(contentNode, foundNodes);
          }

          // Any further mutations will handle the display of the default content.
          contentMutationObserver.observe(contentNode, {
            childList: true
          });
        }
      }

      target.innerHTML = '';
      target.appendChild(targetTemplate);
    };
  };

  // Restriction type constants.
  skate.types = {
    ANY: 'act',
    ATTR: 'a',
    CLASS: 'c',
    NOATTR: 'ct',
    NOCLASS: 'at',
    NOTAG: 'ac',
    TAG: 't'
  };

  /**
   * Unregisters the specified component.
   *
   * @param {String} id The ID of the component to unregister.
   *
   * @returns {Skate}
   */
  skate.unregister = function (id) {
    delete registry[id];
    return skate;
  };

  // Makes checking the version easy when debugging.
  skate.version = '0.9.2';

  /**
   * The default options for a component.
   *
   * @var {Object}
   */
  skate.defaults = {
    // Attribute lifecycle callback or callbacks.
    attributes: false,

    // The classname to use when showing this component.
    classname: '__skate',

    // The events to manage the binding and unbinding of during the component's lifecycle.
    events: false,

    // The ID of the component. This is automatically set in the `skate()` function.
    id: '',

    // Properties and methods to add to each element.
    prototype: {},

    // The template to replace the content of the element with.
    template: false,

    // The type of bindings to allow.
    type: skate.types.ANY
  };



  // Global Setup
  // ------------

  // Rules that hide elements as they're inserted so that elements are hidden
  // prior to calling the ready callback to prevent FOUC if the component
  // modifies the element in which it is bound.
  document.getElementsByTagName('head')[0].appendChild(hiddenRules);

  // When the document is ready for manipulation, first initialise the document. This is the first time the document
  // is initialised. Each call to skate() before this does not trigger a document initialisation. After initialisation
  // for the first time, we add the document mutation observer to listen for further updates. We flag content as loaded
  // here because after this, each call to skate() *must* re-initialise the document.
  document.addEventListener('DOMContentLoaded', function () {
    // Ensure all elements are initialised before adding the mutation observer.
    initDocument();

    // Start listening right away.
    documentListener = new MutationObserver(function (mutations) {
      var mutationsLength = mutations.length;

      for (var a = 0; a < mutationsLength; a++) {
        var mutation = mutations[a];
        var addedNodes = mutation.addedNodes;
        var removedNodes = mutation.removedNodes;

        // Since siblings are batched together, we check the first node's parent node to see if it is ignored. If it
        // is then we don't process any added nodes. This prevents having to check every node.
        if (addedNodes && addedNodes.length && !getClosestIgnoredElement(addedNodes[0].parentNode)) {
          initElements(addedNodes);
        }

        // We can't check batched nodes here because they won't have a parent node.
        if (removedNodes && removedNodes.length) {
          removeElements(removedNodes);
        }
      }
    });

    documentListener.observe(document, {
      childList: true,
      subtree: true
    });

    // Flag as loaded so subsequent calls to skate() trigger a document initialisation.
    domContentLoaded = true;
  });



  // Exporting
  // ---------

  // Always export the global. We don't know how consumers are using it and what their environments are like. Doing
  // this affords them the flexibility of using it in an environment where module and non-module code may co-exist.
  window.skate = skate;

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return skate;
    });
  } else if (typeof exports === 'object') {
    module.exports = skate;
  }

})();
