(function () {

  'use strict';



  // Constants
  // ---------

  var ATTR_CONTENT = 'data-skate-content';
  var ATTR_IGNORE = 'data-skate-ignore';
  var TYPE_ATTR = 'attribute';
  var TYPE_CLASS = 'class';
  var TYPE_TAG = 'tag';



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

  // The timeout associated with a call to initDocument() to prevent subsequent calls.
  var initDocumentTimeout;

  // The skate component registry.
  var registry = {};
  registry[TYPE_ATTR] = {};
  registry[TYPE_CLASS] = {};
  registry[TYPE_TAG] = {};



  // Observers
  // ---------

  var ElementMap = function () {
    this.map = [];
  };

  ElementMap.prototype = {
    clear: function () {
      this.map = [];
      return this;
    },

    get: function (element) {
      var index = this.index(element);

      if (index > -1) {
        return this.map[index];
      }
    },

    index: function (element) {
      var index = getData(element, 'element-map-index');

      if (index > -1) {
        return index;
      }

      return -1;
    },

    items: function () {
      return this.map;
    },

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
        var that = this;
        var attributeOldValueCache = {};

        var map = new ElementMap();
        var timeout;
        var lastInsertParent;
        var lastRemoveParent;
        var lastAttributeParent;

        var item = {
          target: target,
          options: options,
          insertHandler: function (e) {
            if (!canTriggerInsertOrRemove(e)) {
              return;
            }

            if (lastInsertParent && lastInsertParent.contains(e.target)) {
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

            lastInsertParent = parent;

            batch();
          },
          removeHandler: function (e) {
            if (!canTriggerInsertOrRemove(e)) {
              return;
            }

            if (lastRemoveParent && lastRemoveParent.contains(e.target)) {
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

            lastRemoveParent = parent;

            batch();
          },
          attributeHandler: function (e) {
            if (!canTriggerAttributeModification(e)) {
              return;
            }

            var record = newMutationRecord();
            record.attributeName = e.attrName,
            record.oldValue = options.attributeOldValue ? (attributeOldValueCache[e.attrName] || e.prevValue || null) : null,
            record.type = 'attributes'

            that.callback([record]);

            // We keep track of old values so that when IE incorrectly reports the old value we can ensure it is
            // actually correct.
            if (options.attributeOldValue) {
              attributeOldValueCache[e.attrName] = e.newValue;
            }
          }
        };

        this.elements.push(item);

        if (options.childList) {
          target.addEventListener('DOMNodeInserted', item.insertHandler);
          target.addEventListener('DOMNodeRemoved', item.removeHandler);
        }

        if (options.attributes) {
          target.addEventListener('DOMAttrModified', item.attributeHandler);
        }

        return this;

        function batch () {
          clearTimeout(timeout);

          timeout = setTimeout(function () {
            that.callback(map.items());
            map.clear();
            lastInsertParent = undefined;
            lastRemoveParent = undefined;
          }, 1);
        }

        function canTriggerInsertOrRemove (e) {
          return options.childList && (options.subtree || e.target.parentNode === target);
        }

        function canTriggerAttributeModification (e) {
          return e.target === target;
        }
      },

      disconnect: function () {
        objEach(this.elements, function (item) {
          item.target.removeEventListener('DOMSubtreeModified', item.insertHandler);
          item.target.removeEventListener('DOMNodeRemoved', item.removeHandler);
          item.target.removeEventListener('DOMAttrModified', item.attributeHandler);
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
    inherit(component, skate.defaults);

    // Components of a particular type must be unique.
    if (hasOwn(registry[component.type], id)) {
      throw new Error('A component of type "' + component.type + '" with the ID of "' + id + '" already exists.');
    }

    // Set the component ID for reference later.
    component.id = id;

    // Set default template renderer for template strings.
    if (component.template && typeof component.template === 'string') {
      component.template = skate.template[component.renderer](component.template);
    }

    // Register the component.
    registry[component.type][component.id] = component;

    // If doing something on ready, ensure the element is hidden. If not, we don't need to care.
    if (component.ready) {
      hiddenRules.sheet.insertRule(
        getSelectorForType(id, component.type, '.' + component.classname) + '{display:none}',
        hiddenRules.sheet.cssRules.length
      );
    }

    // Ensure existing elements are initialised.
    initDocument();

    // Ensure the document is being listened to.
    initDocumentListener();

    // Only make and return an element constructor if it can be used as a custom element.
    if (component.type === skate.types.TAG) {
      return makeElementConstructor(id, component);
    }
  }

  // Makes checking the version easy when debugging.
  skate.version = '0.9.0';

  // Restriction type constants.
  skate.types = {
    ATTR: TYPE_ATTR,
    CLASS: TYPE_CLASS,
    TAG: TYPE_TAG
  };

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

    // The default template renderer.
    renderer: 'html',

    // The template to replace the content of the element with.
    template: false,

    // The type of bindings to allow.
    type: skate.types.TAG
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

  /**
   * Returns the components for the specified element.
   *
   * @param {Element} element The element to get the components for.
   *
   * @returns {Array}
   */
  skate.components = function (element) {
    var attrs = element.attributes;
    var attrsLength = attrs.length;
    var components = [];
    var tag = attrs.is && attrs.is.nodeValue || element.tagName.toLowerCase();

    if (hasOwn(registry[TYPE_TAG], tag)) {
      return [registry[TYPE_TAG][tag]];
    }

    for (var a = 0; a < attrsLength; a++) {
      var attr = attrs[a].nodeValue;

      if (hasOwn(registry[TYPE_ATTR], attr)) {
        components.push(registry[TYPE_ATTR][attr]);
      }
    }

    if (components.length) {
      return components;
    }

    var classList = getClassList(element);
    var classListLength = classList.length;

    for (var b = 0; b < classListLength; b++) {
      var className = classList[b];

      if (hasOwn(registry[TYPE_CLASS], className)) {
        components.push(registry[TYPE_CLASS][className]);
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
    documentListener = undefined;
    registry[TYPE_ATTR] = {};
    registry[TYPE_CLASS] = {};
    registry[TYPE_TAG] = {};
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
      return skate;
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

    return skate;
  };

  /**
   * Unregisters the specified component.
   *
   * @param {String} id The ID of the component to unregister.
   *
   * @returns {Skate}
   */
  skate.unregister = function (id) {
    objEach(registry, function (type) {
      delete type[id];
    });

    return skate;
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
    var newTarget;
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

    triggerAttributes(target, component);
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
  function triggerAttributes (target, component) {
    if (!component.attributes || getData(target, component.id + '.attributes-called')) {
      return;
    }

    setData(target, component.id + '.attributes-called', true);

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        var type;
        var name = mutation.attributeName;
        var attr = target.attributes[name];

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

    // We must initialise each attribute.
    for (var a = 0; a < target.attributes.length; a++) {
      var attr = target.attributes[a];
      triggerCallback('insert', attr.nodeName, attr.nodeValue);
    }

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
      if (isElementIgnored(parent)) {
        return parent;
      }

      parent = parent.parentNode;
    }
  }

  /**
   * Returns whether or not the element is ignored.
   *
   * @param {Element} element The element to check.
   *
   * @returns {Boolean}
   */
  function isElementIgnored (element) {
    var attrs = element.attributes;
    return attrs && attrs[ATTR_IGNORE];
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
    var negateWith = negateWith ? ':not(' + negateWith + ')' : '';
    var selectors = [];

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
    if (nodes && nodes.length) {
      for (var a = nodes.length - 1; a >= 0; a--) {
        if (element.childNodes[0]) {
          element.insertBefore(nodes[a], element.childNodes[0]);
        } else {
          element.appendChild(nodes[a]);
        }
      }
    }
  }

  /**
   * Initialises the head and body.
   *
   * @returns {undefined}
   */
  function initDocument () {
    if (!domUpdated) {
      return;
    }

    if (initDocumentTimeout) {
      clearTimeout(initDocumentTimeout);
    }

    initDocumentTimeout = setTimeout(function () {
      domUpdated = false;

      var childNodes = document.getElementsByTagName('html')[0].childNodes;

      if (childNodes) {
        initElements(childNodes);
      }
    }, 1);
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
      skate.components(element).forEach(function (component) {
        triggerRemove(element, component);
      });
    }
  }

  /**
   * Initialises the main listener using mutation obserers.
   *
   * @returns {undefined}
   */
  function initDocumentListener () {
    if (documentListener) {
      return;
    }

    documentListener = new MutationObserver(function (mutations) {
      domUpdated = true;

      mutations.forEach(function (mutation) {
        if (mutation.addedNodes) {
          if (!getClosestIgnoredElement(mutation.addedNodes[0])) {
            initElements(mutation.addedNodes);
          }
        }

        if (mutation.removedNodes) {
          removeElements(mutation.removedNodes);
        }
      });
    });

    documentListener.observe(document, {
      childList: true,
      subtree: true
    });
  }



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
