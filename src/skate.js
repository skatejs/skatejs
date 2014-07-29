(function () {

  'use strict';



  // Constants
  // ---------

  var ATTR_CONTENT = 'data-skate-content';
  var ATTR_IGNORE = 'data-skate-ignore';



  // Global Variables
  // ----------------

  // Stylesheet that contains rules for preventing certain components from showing when they're added to the DOM. This
  // is so that we can simulate calling a lifecycle callback before the element is added to the DOM which helps to
  // prevent any jank if the ready() callback modifies the element.
  var hiddenRules = document.createElement('style');

  // The observer listening to document changes.
  var documentListener;

  // Whether or not the DOM has been updated. Default to `true` so the first call to `initDocument()` works.
  var domUpdated = true;

  // The skate component registry.
  var registry = {};



  // Element Map
  // -----------

  /**
   * Kinda like a weak map, but specifically for elements and is more performant that polyfillying ES6 the WeakMap just
   * for this one purpose.
   *
   * @var {Function}
   */
  var ElementMap = function () {
    this.map = [];
  };

  ElementMap.prototype = {
    /**
     * Clears the element mapping.
     *
     * @returns {ElementMap}
     */
    clear: function () {
      this.map = [];
      return this;
    },

    /**
     * Returns the value stored against the specified element.
     *
     * @param {Element} element The element to get the value for.
     *
     * @returns {Mixed}
     */
    get: function (element) {
      var index = this.index(element);

      if (index > -1) {
        return this.map[index];
      }
    },

    /**
     * Returns the index for the element or -1 if it doesn't exist in the map.
     *
     * @param {Element} element The element to get the index for.
     *
     * @returns {Integer}
     */
    index: function (element) {
      var index = getData(element, 'element-map-index');

      if (index > -1) {
        return index;
      }

      return -1;
    },

    /**
     * Returns the values stored for each element.
     *
     * @returns {Array}
     */
    items: function () {
      return this.map;
    },

    /**
     * Sets a value for the given element.
     *
     * @param {Element} element The element to store the value against.
     * @Param {Mixed} value The value to store.
     *
     * @returns {ElementMap}
     */
    set: function (element, value) {
      var index = this.index(element);

      if (index > -1) {
        this.map[index] = value;
      } else {
        setData(element, 'element-map-index', this.map.length);
        this.map.push(value);
      }

      return this;
    }
  };



  // Mutation Observer "Polyfill"
  // ----------------------------
  //
  // TODO: Try using DOMSubtree modified and diffing the children rather than using DOMNodeInserted and eliminating
  // nodes that aren't first children.
  //
  // TODO: Share more code between the insertHandler and the removeHandler.
  //
  // This "polyfill" only polyfills what we need for Skate to function. It batches updates and does the bare minimum
  // during synchronous operation which make mutation event performance bearable. The rest is batched on the next tick.
  // Like mutation observers, each mutation is divided into sibling groups for each parent that had mutations. All
  // attribute mutations are batched into separate records regardless of the element they occured on.

  // Normalise the mutaiton observer constructor.
  var MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;

  // Polyfill only the parts of Mutation Observer that we need.
  if (!MutationObserver) {
    MutationObserver = function (callback) {
      this.callback = callback;
      this.elements = [];
    };

    MutationObserver.prototype = {
      observe: function (target, options) {
        function canTriggerInsertOrRemove (e) {
          return options.childList && (options.subtree || e.target.parentNode === target);
        }

        function canTriggerAttributeModification (e) {
          return e.target === target;
        }

        var batchInsertRemove = debounce(function () {
          that.callback(map.items());
          map.clear();
          lastInserted = undefined;
          lastRemoved = undefined;
        });

        var batchAttributeMods = debounce(function () {
          // We keep track of the old length just in case attributes are modified within a handler.
          var len = attributeMutations.length;

          // Call the handler with the current modifications.
          that.callback(attributeMutations);

          // We remove only up to the current point just in case more modifications were queued.
          attributeMutations.splice(0, len);
        });

        var that = this;
        var attributeOldValueCache = {};
        var map = new ElementMap();

        var lastInserted;
        var lastRemoved;
        var attributeMutations = [];

        var observed = {
          target: target,
          options: options,
          insertHandler: function (e) {
            if (!canTriggerInsertOrRemove(e)) {
              return;
            }

            if (lastInserted && lastInserted.contains(e.target)) {
              return;
            }

            var parent = e.target.parentNode;
            var record = map.get(parent);

            if (record) {
              if (!record.addedNodes) {
                record.addedNodes = [];
              }

              record.addedNodes.push(e.target);
            } else {
              record = newMutationRecord(parent);
              record.addedNodes = [];

              record.addedNodes.push(e.target);
              map.set(parent, record);
            }

            lastInserted = parent;

            batchInsertRemove();
          },
          removeHandler: function (e) {
            if (!canTriggerInsertOrRemove(e)) {
              return;
            }

            if (lastRemoved && lastRemoved.contains(e.target)) {
              return;
            }

            var parent = e.target.parentNode;
            var record = map.get(parent);

            if (record) {
              if (!record.removedNodes) {
                record.removedNodes = [];
              }

              record.removedNodes.push(e.target);
            } else {
              record = newMutationRecord(parent);
              record.removedNodes = [];

              record.removedNodes.push(e.target);
              map.set(parent, record);
            }

            lastRemoved = e.target;

            batchInsertRemove();
          },
          attributeHandler: function (e) {
            if (!canTriggerAttributeModification(e)) {
              return;
            }

            var record = newMutationRecord(e.target, 'attributes');
            record.attributeName = e.attrName;

            if (options.attributeOldValue) {
              record.oldValue = attributeOldValueCache[e.attrName] || e.prevValue || null;
            }

            attributeMutations.push(record);

            // We keep track of old values so that when IE incorrectly reports the old value we can ensure it is
            // actually correct.
            if (options.attributeOldValue) {
              attributeOldValueCache[e.attrName] = e.newValue;
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
          observed.target.removeEventListener('DOMSubtreeModified', observed.insertHandler);
          observed.target.removeEventListener('DOMNodeRemoved', observed.removeHandler);
          observed.target.removeEventListener('DOMAttrModified', observed.attributeHandler);
        });

        this.elements = [];

        return this;
      }
    };
  }

  /**
   * Creates a new mutation record with better defaults.
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
        getSelectorForType(id, component.type, '.' + component.classname) + '{display:none}',
        hiddenRules.sheet.cssRules.length
      );
    }

    // Register the component.
    registry[component.id] = component;

    // Ensure existing elements are initialised.
    initDocument();

    // Ensure the document is being listened to.
    initDocumentListener();

    // Only make and return an element constructor if it can be used as a custom element.
    if (component.type.indexOf(skate.types.TAG) > -1) {
      return makeElementConstructor(id, component);
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
    var tag = attrs.is && attrs.is.nodeValue || element.tagName.toLowerCase();

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
    if (documentListener) {
      documentListener.disconnect();
      documentListener = undefined;
    }

    registry = {};

    return skate;
  };

  /**
   * Synchronously initialises the specified element or elements and descendants.
   *
   * @param {Element} elements The element or elements to init.
   *
   * @returns {skate}
   */
  skate.init = function (element) {
    if (element.hasAttribute(ATTR_IGNORE)) {
      return element;
    }

    // We only initialise each element once.
    if (!getData(element, 'initialised')) {
      skate.components(element).forEach(function (component) {
        triggerLifecycle(element, component);
      });

      // Flag as initialised.
      setData(element, 'initialised', true);
    }

    // Go down the tree.
    initElements(element.childNodes);

    return element;
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
    var contentMutationObserver = new MutationObserver(function (mutations) {
        for (var a = 0; a < mutations.length; a++) {
          var mutation = mutations[a];

          if (!mutation.target.children.length) {
            mutation.target.innerHTML = getData(mutation.target, 'default-content');
          }
        }
      });

    return function (target) {
      var targetFragment = createFragmentFromString(target.innerHTML);
      var targetTemplate = template.cloneNode(true);
      var contentNodes = targetTemplate.querySelectorAll('[' + ATTR_CONTENT + ']');
      var hasContentNodes = contentNodes && contentNodes.length;

      if (hasContentNodes) {
        for (var a = 0; a < contentNodes.length; a++) {
          var contentNode = contentNodes[a];
          var foundNodes = findChildrenMatchingSelector(targetFragment, contentNode.getAttribute(ATTR_CONTENT));

          // Save the default content so we can use it when all nodes are removed from the content.
          setData(contentNode, 'default-content', contentNode.innerHTML);

          if (foundNodes && foundNodes.length) {
            contentNode.innerHTML = '';
            insertNodeList(contentNode, foundNodes);
          }

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
  skate.version = '0.9.0';

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
    triggerReady(target, component, function () {
      setData(target, component.id + '.ready-done', true);
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

    if (getData(target, component.id + '.ready-started')) {
      return done();
    }

    setData(target, component.id + '.ready-started', true);

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

    if (!getData(target, component.id + '.ready-done')) {
      return;
    }

    if (getData(target, component.id + '.insert-started')) {
      return;
    }

    setData(target, component.id + '.insert-started', true);
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

    if (!component.attributes || getData(target, component.id + '.attributes-called')) {
      return;
    }

    setData(target, component.id + '.attributes-called', true);

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

        triggerCallback(type, name, attr ? attr.nodeValue : undefined, mutation.oldValue);
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
      triggerCallback('insert', attr.nodeName, attr.nodeValue);
    }
  }

  function addEventListeners (target, component) {
    if (typeof component.events !== 'object') {
      return;
    }

    function makeHandler (handler, delegate) {
      return function (e) {
        if (!delegate || matchesSelector(e.target, delegate)) {
          handler(target, e);
        }
      };
    }

    objEach(component.events, function (handler, name) {
      var evt = parseEvent(name);
      target.addEventListener(evt.name, makeHandler(handler, evt.delegate));
    });
  }

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
   * Returns whether or not the element matches the specified selector.
   *
   * @param {Element} el The element to check.
   * @param {String} selector The selector to check the element against.
   *
   * @returns {Boolean}
   */
  function matchesSelector (el, selector) {
    return (el.matches || el.msMatchesSelector || el.webkitMatchesSelector || el.mozMatchesSelector || el.oMatchesSelector).call(el, selector);
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
   * @param {String} id The ID to make the constructor for.
   * @param {Object} component The component information to use for generating the constructor.
   *
   * @returns {Function} The element constructor.
   */
  function makeElementConstructor (id, component) {
    function CustomElement () {
      var element = document.createElement(id);

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

    if (negateWith) {
      negateWith = ':not(' + negateWith + ')';
    }

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
    var foundNodes = selector ? sourceNode.querySelectorAll(selector) : sourceNode.childNodes;

    return [].filter.call(foundNodes, function (foundNode) {
      return foundNode.parentNode === sourceNode;
    });
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
   * @param {NodeList} nodes The nodes to insert.
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
   * Initialises a set of elements.
   *
   * @param {DOMNodeList | Array} elements A traversable set of elements.
   *
   * @returns {undefined}
   */
  function initElements (elements) {
    var len = elements.length;

    for (var a = 0; a < len; a++) {
      var element = elements[a];

      if (element.nodeType !== 1) {
        continue;
      }

      skate.init(element);
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
      skate.components(element).forEach(removeElemensRemover(element));
    }
  }

  /**
   * Makes a function that calls triggerRemove for the specified element's components.
   *
   * @param {Element} element The element to generate the remover for.
   *
   * @return {Function}
   */
  function removeElemensRemover (element) {
    return function (component) {
      triggerRemove(element, component);
    };
  }

  /**
   * Initialises the main listener using mutation obserers.
   *
   * @returns {undefined}
   */
  function initDocumentListener () {
    // We only need one document listener.
    if (documentListener) {
      return;
    }

    documentListener = new MutationObserver(function (mutations) {
      domUpdated = true;

      mutations.forEach(function (mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length) {
          // Since siblings are batched together, we check the first node's parent node to see if it is ignored. If it
          // is then we don't process any added nodes. This prevents having to check every node.
          if (!getClosestIgnoredElement(mutation.addedNodes[0].parentNode)) {
            initElements(mutation.addedNodes);
          }
        }

        if (mutation.removedNodes && mutation.removedNodes.length) {
          // We can't check batched nodes here because they won't have a parent node.
          removeElements(mutation.removedNodes);
        }
      });
    });

    documentListener.observe(document, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Returns a function that will prevent more than one call in a single clock cycle.
   *
   * @param {Function} fn The function to call.
   *
   * @returns {Function}
   */
  function debounce (fn) {
    var timeout;

    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(fn, 1);
    };
  }

  /**
   * Initialises the head and body.
   *
   * @returns {undefined}
   */
  var initDocument = debounce(function () {
    if (!domUpdated) {
      return;
    }

    var childNodes = document.getElementsByTagName('html')[0].childNodes;

    if (childNodes) {
      initElements(childNodes);
    }
  });



  // Global Setup
  // ------------

  // Rules that hide elements as they're inserted so that elements are hidden
  // prior to calling the ready callback to prevent FOUC if the component
  // modifies the element in which it is bound.
  document.getElementsByTagName('head')[0].appendChild(hiddenRules);



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
