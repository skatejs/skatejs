(function () {

  'use strict';



  // Lifecycle Triggers
  // ------------------

  function getLifecycleFlag (target, component, name) {
    return getData(target, component.id + ':lifecycle:' + name);
  }

  function setLifecycleFlag (target, component, name, value) {
    setData(target, component.id + ':lifecycle:' + name, !!value);
  }

  function ensureLifecycleFlag (target, component, name) {
    if (getLifecycleFlag(target, component, name)) {
      return true;
    }
    setLifecycleFlag(target, component, name, true);
    return false;
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

    if (component.template) {
      component.template(target);
    }

    inherit(target, component.prototype);
    addEventListeners(target, component);

    if (component.ready) {
      component.ready(target);
    }

    addAttributeListeners(target, component);
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

    return element;
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
   * @param {Object} component The component information to use for generating
   *                           the constructor.
   *
   * @returns {Function} The element constructor.
   */
  function makeElementConstructor (component) {
    function CustomElement () {
      var element;
      var tagToExtend = component.extends;
      var componentId = component.id;

      if (tagToExtend) {
        element = document.createElement(tagToExtend);
        element.setAttribute('is', componentId);
      } else {
        element = document.createElement(componentId);
      }

      // Ensure the component prototype is up to date with the element's
      // prototype. This ensures that overwriting the element prototype still
      // works.
      component.prototype = CustomElement.prototype;

      // If they use the constructor we don't have to wait until it's inserted.
      triggerReady(element, component);

      return element;
    }

    // This allows modifications to the element prototype propagate to the
    // component prototype.
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
  function getSelectorForType (id, type, tagToExtend, negateWith) {
    var isTag = type.indexOf(skate.types.TAG) > -1;
    var isAttr = type.indexOf(skate.types.ATTR) > -1;
    var isClass = type.indexOf(skate.types.CLASS) > -1;
    var selectors = [];

    negateWith = negateWith ? ':not(' + negateWith + ')' : '';


    if (isTag) {
      if (tagToExtend) {
        selectors.push('[is=' + id + ']' + negateWith);
      } else {
        selectors.push(id + negateWith);
      }
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
   * Returns whether or not the specified component can be bound using the
   * specified type.
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
   * @param {String} selector The selector to use. If not specified, all
   *                          `childNodes` are returned.
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

    return [].slice.call(sourceNode.childNodes) || [];
  }

  /**
   * Creates a document fragment from the specified DOM string. It ensures that
   * if special nodes are passed in that they are added to a valid parent node
   * before importing to the document fragment.
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

    var frag = document.createDocumentFragment();
    var tag = domString.match(/\s*<([^\s>]+)/);
    var div = document.createElement(tag && specialMap[tag[1]] || 'div');

    div.innerHTML = domString;

    while (div.childNodes.length) {
      frag.appendChild(div.childNodes[0]);
    }

    return frag;
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
   * Returns a function that will prevent more than one call in a single clock
   * tick.
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
   * Initialises all valid elements in the document. Ensures that it does not
   * happen more than once in the same execution.
   *
   * @returns {undefined}
   */
  var initDocument = debounce(function () {
    initElement(document.getElementsByTagName('html')[0]);
  });



  // Constants
  // ---------

  var ATTR_IGNORE = 'data-skate-ignore';



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

  // Stylesheet that contains rules for preventing certain components from
  // showing when they're added to the DOM. This is so that we can simulate
  // calling a lifecycle callback before the element is added to the DOM which
  // helps to prevent any jank if the ready() callback modifies the element.
  var hiddenRules = document.createElement('style');

  // The skate component registry.
  var registry = {};



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
   * @returns {Function} Constructor that returns a custom element.
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

    // If doing something that will modify the component's structure, ensure
    // it's not displayed yet.
    if (component.ready || component.template) {
      hiddenRules.sheet.insertRule(
        getSelectorForType(component.id, component.type, component.extends, '.' + component.classname) + '{display:none}',
        hiddenRules.sheet.cssRules.length
      );
    }

    // Register the component.
    registry[component.id] = component;

    // Ensure a call is queued for initialising the document if it's ready. We
    // must initialise the entire document rather than building a selector and
    // using querySelectorAll() because we have to filter out elements which may
    // be ignored. On top of that, if calling skate() in sequence several times,
    // querySelectorAll() can become slow pretty quick. The call to
    // initDocument() is debounced to ensure that it only happens once. In large
    // DOMs this ends up being faster. In small DOMs, the difference is
    // negligible, but usually faster in most use-cases.
    if (domContentLoaded) {
      initDocument();
    }

    // Only make and return an element constructor if it can be used as a custom
    // element.
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
    var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
    var tag = element.tagName.toLowerCase();
    var isAttrOrTag = isAttrValue || tag;
    var component;
    var tagToExtend;

    if (isComponentOfType(isAttrOrTag, skate.types.TAG)) {
      component = registry[isAttrOrTag];
      tagToExtend = component.extends;

      if (isAttrValue) {
        if (tag === tagToExtend) {
          components.push(component);
        }
      } else if (!tagToExtend) {
        components.push(component);
      }
    }

    for (var a = 0; a < attrsLen; a++) {
      var attr = attrs[a].nodeName;

      if (isComponentOfType(attr, skate.types.ATTR)) {
        component = registry[attr];
        tagToExtend = component.extends;

        if (!tagToExtend || tag === tagToExtend) {
          components.push(component);
        }
      }
    }

    var classList = getClassList(element);
    var classListLen = classList.length;

    for (var b = 0; b < classListLen; b++) {
      var className = classList[b];

      if (isComponentOfType(className, skate.types.CLASS)) {
        component = registry[className];
        tagToExtend = component.extends;

        if (!tagToExtend || tag === tagToExtend) {
          components.push(component);
        }
      }
    }

    return components;
  };

  /**
   * Stops listening for new elements. Generally this will only be used in
   * testing.
   *
   * @returns {skate}
   */
  skate.destroy = function () {
    registry = {};
    return skate;
  };

  /**
   * Synchronously initialises the specified element or elements and
   * descendants.
   *
   * @param {Mixed} nodes The node, or nodes to initialise. Can be anything:
   *                      jQuery, DOMNodeList, DOMNode, selector etc.
   *
   * @returns {skate}
   */
  skate.init = function (nodes) {
    if (!nodes) {
      return;
    }

    if (typeof nodes === 'string') {
      nodes = document.querySelectorAll(nodes);
    }

    initElements(typeof nodes.length === 'undefined' ? [nodes] : nodes);

    return nodes;
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
  skate.version = '0.10.0';

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

    // The events to manage the binding and unbinding of during the component's
    // lifecycle.
    events: false,

    // Restricts a particular component to binding explicitly to an element with
    // a tag name that matches the specified value.
    extends: '',

    // The ID of the component. This is automatically set in the `skate()`
    // function.
    id: '',

    // Properties and methods to add to each element.
    prototype: {},

    // The template to replace the content of the element with.
    template: false,

    // The type of bindings to allow.
    type: skate.types.ANY
  };



  // Templating
  // ----------

  var DocumentFragment = window.DocumentFragment;

  function getNodesBetween (startNode, endNode) {
    var nodes = [];
    var nextNode = startNode.nextSibling;

    while (nextNode !== endNode) {
      nodes.push(nextNode);
      nextNode = nextNode.nextSibling;
    }

    return nodes;
  }

  /**
   * Returns an object with methods and properties that can be used to wrap an
   * element so that it behaves similar to a shadow root.
   *
   * @param {HTMLElement} element The original element to wrap.
   *
   * @returns {Object}
   */
  function htmlTemplateParentWrapper (element) {
    var contentNodes = getData(element, 'content');
    var contentNodesLen = contentNodes.length;

    return {
      childNodes: {
        get: function () {
          var nodes = [];

          for (var a = 0; a < contentNodesLen; a++) {
            var contentNode = contentNodes[a];

            if (contentNode.isDefault) {
              continue;
            }

            nodes = nodes.concat(getNodesBetween(contentNode.startNode, contentNode.endNode));
          }

          return nodes;
        }
      },

      firstChild: {
        get: function () {
          var childNodes = this.childNodes;
          return childNodes.length && childNodes[0] || null;
        }
      },

      innerHTML: {
        get: function () {
          var html = '';
          var childNodes = this.childNodes;
          var childNodesLen = childNodes.length;

          for (var a = 0; a < childNodesLen; a++) {
            var childNode = childNodes[a];
            html += childNode.outerHTML || childNode.textContent;
          }

          return html;
        },
        set: function (html) {
          var targetFragment = createFragmentFromString(html);

          for (var a = 0; a < contentNodesLen; a++) {
            var contentNode = contentNodes[a];
            var childNodes = getNodesBetween(contentNode.startNode, contentNode.endNode);

            // Remove all nodes (including default content).
            for (var b = 0; b < childNodes.length; b++) {
              var childNode = childNodes[b];
              childNode.parentNode.removeChild(childNode);
            }

            var foundNodes = findChildrenMatchingSelector(targetFragment, contentNode.selector);

            // Add any matched nodes from the given HTML.
            for (var c = 0; c < foundNodes.length; c++) {
              contentNode.container.insertBefore(foundNodes[c], contentNode.endNode);
            }

            // If no nodes were found, set the default content.
            if (foundNodes.length) {
              removeDefaultContent(contentNode);
            } else {
              addDefaultContent(contentNode);
            }
          }
        }
      },

      lastChild: {
        get: function () {
          for (var a = contentNodesLen - 1; a > -1; a--) {
            var contentNode = contentNodes[a];

            if (contentNode.isDefault) {
              continue;
            }

            var childNodes = this.childNodes;
            var childNodesLen = childNodes.length;

            return childNodes[childNodesLen - 1];
          }

          return null;
        }
      },

      outerHTML: {
        get: function () {
          var name = this.tagName.toLowerCase();
          var html = '<' + name;
          var attrs = this.attributes;

          if (attrs) {
            var attrsLength = attrs.length;

            for (var a = 0; a < attrsLength; a++) {
              var attr = attrs[a];
              html += ' ' + attr.nodeName + '="' + attr.nodeValue + '"';
            }
          }

          html += '>';
          html += this.innerHTML;
          html += '</' + name + '>';

          return html;
        }
      },

      textContent: {
        get: function () {
          var textContent = '';
          var childNodes = this.childNodes;
          var childNodesLength = this.childNodes.length;

          for (var a = 0; a < childNodesLength; a++) {
            textContent += childNodes[a].textContent;
          }

          return textContent;
        },
        set: function (textContent) {
          var acceptsTextContent;

          // Removes all nodes (including default content).
          this.innerHTML = '';

          // Find the first content node without a selector.
          for (var a = 0; a < contentNodesLen; a++) {
            var contentNode = contentNodes[a];

            if (!contentNode.selector) {
              acceptsTextContent = contentNode;
              break;
            }
          }

          // There may be no content nodes that accept text content.
          if (acceptsTextContent) {
            if (textContent) {
              removeDefaultContent(acceptsTextContent);
              acceptsTextContent.container.insertBefore(document.createTextNode(textContent), acceptsTextContent.endNode);
            } else {
              addDefaultContent(acceptsTextContent);
            }
          }
        }
      },

      appendChild: function (node) {
        if (node instanceof DocumentFragment) {
          var fragChildNodes = node.childNodes;

          if (fragChildNodes) {
            var fragChildNodesLength = fragChildNodes.length;

            for (var a = 0; a < fragChildNodesLength; a++) {
              this.appendChild(fragChildNodes[a]);
            }
          }

          return this;
        }

        for (var b = 0; b < contentNodesLen; b++) {
          var contentNode = contentNodes[b];
          var contentSelector = contentNode.selector;

          if (!contentSelector || matchesSelector.call(node, contentSelector)) {
            removeDefaultContent(contentNode);
            contentNode.endNode.parentNode.insertBefore(node, contentNode.endNode);
            break;
          }
        }

        return this;
      },

      insertAdjacentHTML: function (where, html) {
        if (where === 'afterbegin') {
          this.insertBefore(createFragmentFromString(html), this.childNodes[0]);
        } else if (where === 'beforeend') {
          this.appendChild(createFragmentFromString(html));
        } else {
          element.insertAdjacentHTML(where, html);
        }

        return this;
      },

      insertBefore: function (node, referenceNode) {
        // If no reference node is supplied, we append. This also means that we
        // don't need to add / remove any default content because either there
        // aren't any nodes or appendChild will handle it.
        if (!referenceNode) {
          return this.appendChild(node);
        }

        // Handle document fragments.
        if (node instanceof DocumentFragment) {
          var fragChildNodes = node.childNodes;

          if (fragChildNodes) {
            var fragChildNodesLength = fragChildNodes.length;

            for (var a = 0; a < fragChildNodesLength; a++) {
              this.insertBefore(fragChildNodes[a], referenceNode);
            }
          }

          return this;
        }

        var hasFoundReferenceNode = false;

        // There's no reason to handle default content add / remove because:
        // 1. If no reference node is supplied, appendChild handles it.
        // 2. If a reference node is supplied, there already is content.
        // 3. If a reference node is invalid, an exception is thrown, but also
        //    it's state would not change even if it wasn't.
        mainLoop:
        for (var b = 0; b < contentNodesLen; b++) {
          var contentNode = contentNodes[b];
          var betweenNodes = getNodesBetween(contentNode.startNode, contentNode.endNode);
          var betweenNodesLen = betweenNodes.length;

          for (var c = 0; c < betweenNodesLen; c++) {
            var betweenNode = betweenNodes[c];

            if (betweenNode === referenceNode) {
              hasFoundReferenceNode = true;
            }

            if (hasFoundReferenceNode) {
              var selector = contentNode.selector;

              if (!selector || matchesSelector.call(node, selector)) {
                betweenNode.parentNode.insertBefore(node, betweenNode);
                break mainLoop;
              }
            }
          }
        }

        // If no reference node was found as a child node of the element we must
        // throw an error. This works for both no child nodes, or if the
        // reference wasn't found to be a child node.
        if (!hasFoundReferenceNode) {
          throw new Error('DOMException 8: The node before which the new node is to be inserted is not a child of this node.');
        }

        return node;
      },

      removeChild: function (childNode) {
        var removed = false;

        for (var a = 0; a < contentNodesLen; a++) {
          var contentNode = contentNodes[a];

          if (contentNode.container === childNode.parentNode) {
            contentNode.container.removeChild(childNode);
            removed = true;
            break;
          }

          if (contentNode.startNode.nextSibling === contentNode.endNode) {
            addDefaultContent(contentNode);
          }
        }

        if (!removed) {
          throw new Error('DOMException 8: The node in which you are trying to remove is not a child of this node.');
        }

        return childNode;
      },

      replaceChild: function (newChild, oldChild) {
        for (var a = 0; a < contentNodesLen; a++) {
          var contentNode = contentNodes[a];

          if (contentNode.container === oldChild.parentNode) {
            contentNode.container.replaceChild(newChild, oldChild);
            break;
          }
        }

        return this;
      }
    };
  }

  /**
   * Adds the default content if no content exists.
   *
   * @param {Object} content The content data.
   *
   * @returns {undefined}
   */
  function addDefaultContent (content) {
    var nodes = content.defaultNodes;
    var nodesLen = nodes.length;

    for (var a = 0; a < nodesLen; a++) {
      content.container.insertBefore(nodes[a], content.endNode);
    }

    content.isDefault = true;
  }

  /**
   * Removes the default content if it exists.
   *
   * @param {Object} content The content data.
   *
   * @returns {undefined}
   */
  function removeDefaultContent (content) {
    var nodes = content.defaultNodes;
    var nodesLen = nodes.length;

    for (var a = 0; a < nodesLen; a++) {
      var node = nodes[a];
      node.parentNode.removeChild(node);
    }

    content.isDefault = false;
  }

  /**
   * Makes a constructor for the specified element that passes instanceof
   * checks which is configurable.
   *
   * @param {Node} node The node to create a fake constructor for.
   *
   * @return {Object}
   */
  function makeInstanceOf (node) {
    var Ctor = function(){};
    Ctor.prototype = document.createElement(node.tagName);
    return new Ctor();
  }

  /**
   * Returns a property definition that just proxies to the original element
   * property.
   *
   * @param {Node} node The node to proxy to.
   * @param {String} name The name of the property.
   */
  function createProxyProperty (node, name) {
    return {
      get: function () {
        return node[name];
      },
      set: function (value) {
        node[name] = value;
      }
    };
  }

  /**
   * Wraps the specified element with the given wrapper.
   *
   * @param {Object} wrapper The methods and properties to wrap.
   *
   * @returns {Node}
   */
  function wrapNodeWith (node, wrapper) {
    // Copies all base properties and methods.
    // Doing this also makes instanceof calls work.
    var wrapped = makeInstanceOf(node);

    // Copy or proxy all (enumerable and non-enumerable) properties.
    Object.getOwnPropertyNames(node).forEach(function (name) {
      Object.defineProperty(
        wrapped,
        name,
        name in wrapper ? wrapper[name] : createProxyProperty(node, name)
      );
    });

    // Ensure all wrapper methods are bound and all inherited methods affect
    // the main element.
    for (var name in wrapped) {
      if (wrapped[name] && wrapped[name].bind) {
        wrapped[name] = name in wrapper ? wrapper[name] : node[name].bind(node);
      }
    }

    return wrapped;
  }

  /**
   * Caches information about the content nodes.
   *
   * @param {Node} node The node to cache content information about.
   *
   * @returns {undefined}
   */
  function cacheContentData (node) {
    var contentNodes = node.getElementsByTagName('content');
    var contentNodesLen = contentNodes && contentNodes.length;

    if (contentNodesLen) {
      var contentData = [];

      while (contentNodes.length) {
        var contentNode = contentNodes[0];
        var parentNode = contentNode.parentNode;
        var startNode = document.createComment('');
        var endNode = document.createComment('');

        contentData.push({
          container: parentNode,
          contentNode: contentNode,
          defaultNodes: [].slice.call(contentNode.childNodes),
          endNode: endNode,
          isDefault: true,
          selector: contentNode.getAttribute('select'),
          startNode: startNode
        });

        parentNode.replaceChild(endNode, contentNode);
        parentNode.insertBefore(startNode, endNode);
      }

      setData(node, 'content', contentData);
    }
  }

  /**
   * Default template renderers.
   *
   * @var {Object}
   */
  skate.template = {};

  /**
   * Default template renderer. Similar to ShadowDOM style templating where
   * content is projected from the light DOM.
   *
   * Differences:
   *
   * - Uses a `data-skate-content` attribute instead of a `select` attribute.
   * - Attribute is applied to existing elements rather than the <content>
   *   element to prevent styling issues.
   * - Does not dynamically project modifications to the root custom element.
   *   You must affect each projection node.
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
    return function (target) {
      var initialHtml = target.innerHTML;

      target.innerHTML = templateString;
      cacheContentData(target);

      if (initialHtml) {
        skate.template.html.wrap(target).innerHTML = initialHtml;
      }
    };
  };

  /**
   * Wraps the element in an object that has methods which can be used to
   * manipulate the content similar to if it were delcared as the shadow root.
   *
   * @param {Node} node The node to wrap.
   *
   * @returns {Object}
   */
  skate.template.html.wrap = function (node) {
    return getData(node, 'content') ?
      wrapNodeWith(node, htmlTemplateParentWrapper(node)) :
      node;
  };



  // Global Setup
  // ------------

  // Rules that hide elements as they're inserted so that elements are hidden
  // prior to calling the ready callback to prevent FOUC if the component
  // modifies the element in which it is bound.
  document.getElementsByTagName('head')[0].appendChild(hiddenRules);

  // Ensure all elements are initialised before adding the mutation observer.
  initDocument();

  // Add a mutation observer and start listening right away.
  documentListener = new MutationObserver(function (mutations) {
    var mutationsLength = mutations.length;

    for (var a = 0; a < mutationsLength; a++) {
      var mutation = mutations[a];
      var addedNodes = mutation.addedNodes;
      var removedNodes = mutation.removedNodes;

      // Since siblings are batched together, we check the first node's parent
      // node to see if it is ignored. If it is then we don't process any added
      // nodes. This prevents having to check every node.
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

  // We flag content as loaded here because after this, each call to skate()
  // *must* re-initialise the document.
  document.addEventListener('DOMContentLoaded', function () {
    domContentLoaded = true;
  });



  // Exporting
  // ---------

  // Always export the global. We don't know how consumers are using it and what
  // their environments are like. Doing this affords them the flexibility of
  // using it in an environment where module and non-module code may co-exist.
  window.skate = skate;

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return skate;
    });
  } else if (typeof module === 'object') {
    module.exports = skate;
  }

})();
