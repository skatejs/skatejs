(function () {

  'use strict';


  // The rules used to hide elements during the ready lifecycle callback.
  var hiddenRules = document.createElement('style');


  // Observers
  // ---------

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
        var item = {
          target: target,
          options: options,
          insertHandler: function (e) {
            if (!canTriggerInsertOrRemove(e)) {
              return;
            }

            that.callback([
              mutationRecord(e, {
                addedNodes: [e.target]
              })
            ]);
          },
          removeHandler: function (e) {
            if (!canTriggerInsertOrRemove(e)) {
              return;
            }

            that.callback([
              mutationRecord(e, {
                removedNodes: [e.target]
              })
            ]);
          },
          attributeHandler: function (e) {
            if (!canTriggerAttributeModification(e)) {
              return;
            }

            that.callback([
              mutationRecord(e, {
                attributeName: e.attrName,
                oldValue: options.attributeOldValue ? (attributeOldValueCache[e.attrName] || e.prevValue || null) : null,
                type: 'attributes'
              })
            ]);

            // We keep track of old values so that when IE incorrectly reports the old value we can ensure it is
            // actually correct.
            if (options.attributeOldValue) {
              attributeOldValueCache[e.attrName] = e.newValue;
            }
          }
        };

        this.elements.push(item);

        if (options.childList) {
          target.addEventListener('DOMSubtreeModified', item.insertHandler);
          target.addEventListener('DOMNodeRemoved', item.removeHandler);
        }

        if (options.attributes) {
          target.addEventListener('DOMAttrModified', item.attributeHandler);
        }

        return this;

        function canTriggerInsertOrRemove (e) {
          return options.childList && (options.subtree || e.target.parentNode === target);
        }

        function canTriggerAttributeModification (e) {
          return e.target === target;
        }

        function mutationRecord (e, merge) {
          return inherit(merge, {
            addedNodes: null,
            attributeName: null,
            attributeNamespace: null,
            nextSibling: e.target.nextSibling,
            oldValue: null,
            previousSibling: e.target.previousSibling,
            removedNodes: null,
            target: e.target,
            type: 'childList'
          });
        }
      },

      disconnect: function () {
        for (var a in this.elements) {
          var item = this.elements[a];
          item.target.removeEventListener('DOMSubtreeModified', item.insertHandler);
          item.target.removeEventListener('DOMNodeRemoved', item.removeHandler);
          item.target.removeEventListener('DOMAttrModified', item.attributeHandler);
        }

        this.elements = [];

        return this;
      }
    };
  }


  // Public API
  // ----------

  var documentObserver;
  var skateComponents = {};

  /**
   * Creates a listener for the specified component.
   *
   * @param {String} id The ID of the component.
   * @param {Object | Function} component The component definition.
   *
   * @returns {Function} Function or constructor that creates a custom-element for the component.
   */
  function skate (id, component) {
    if (skate.exists(id)) {
      throw new Error('A component with the ID of "' + id + '" already exists.');
    }

    if (!documentObserver) {
      documentObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          skate.init(mutation.addedNodes);
          triggerRemoveAll(mutation.removedNodes);
        });
      });

      documentObserver.observe(document, {
        childList: true,
        subtree: true
      });
    }

    if (!component) {
      component = {};
    }

    if (typeof component === 'function') {
      component = {
        insert: component
      };
    }

    inherit(component, skate.defaults);

    var Element = makeElementConstructor(id, component);

    if (component.ready) {
      hiddenRules.sheet.insertRule(
        id + ':not(.' + component.classname + '),' +
        '[' + id + ']:not(.' + component.classname + '),' +
        '.' + id + ':not(.' + component.classname + '){display:none}',
        hiddenRules.sheet.cssRules.length
      );
    }

    var existing = Element.existing();

    for (var a = 0; a < existing.length; a++) {
      triggerLifecycle(id, component, existing[a]);
    }

    skateComponents[id] = component;

    return Element;
  }

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

  // Default configuration.
  skate.defaults = {
    // Attribute lifecycle callback or callbacks.
    attributes: false,

    // The classname to use when showing this component.
    classname: '__skate',

    // The events to manage the binding and unbinding of during the component's lifecycle.
    events: false,

    // Properties and methods to add to each element.
    prototype: {},

    // The template to replace the content of the element with.
    template: '',

    // The type of bindings to allow.
    type: skate.types.ANY
  };

  /**
   * Stops listening for new elements. Generally this will only be used in testing.
   *
   * @returns {skate}
   */
  skate.destroy = function () {
    if (documentObserver) {
      documentObserver.disconnect();
      documentObserver = undefined;
    }

    skateComponents = {};

    return skate;
  };

  /**
   * Synchronously initialises the specified element or elements and descendants.
   *
   * @param {Element | Traversable} elements The element or elements to init.
   *
   * @returns {skate}
   */
  skate.init = function (elements) {
    eachElement(elements, function (element) {
      for (var possibleId in possibleIds(element)) {
        triggerLifecycle(possibleId, skateComponents[possibleId], element);
      }

      // Should be refactored to run against a flat list of descendants.
      skate.init(element.children);
    });

    return skate;
  };

  /**
   * Checks whether or not a component with the specified id exists.
   *
   * @param {String} id The ID of the component to check for.
   *
   * @returns {Boolean}
   */
  skate.exists = function (id) {
    return Object.prototype.hasOwnProperty.call(skateComponents, id);
  }

  /**
   * Unregisters the specified component.
   *
   * @param {String} id The ID of the component to unregister.
   *
   * @returns {Skate}
   */
  skate.unregister = function (id) {
    delete skateComponents[id];
    return;
  };

  /**
   * Creates a new mutation observer for the specified element.
   *
   * @param {Function} callback The callback to execute for the observer.
   *
   * @returns {MutationObserver}
   */
  skate.watch = function (callback) {
    return new MutationObserver(callback);
  };

  /**
   * Executes a callback when an element is initialised as a particular component.
   *
   * @param {HTMLElement} element The element to listen to.
   *
   * @returns {Object}
   */
  skate.when = function (element) {
    return {
      /**
       * Sets the id of the component to listen for on the element.
       *
       * @param {String} id The id of the component to listen for.
       *
       * @returns {Object}
       */
      is: function (id) {
        return {
          /**
           * Executes the specified callback when an element is initialised with a particular component.
           *
           * @param {Function} callback The callback to execute.
           *
           * @returns {Object}
           */
          then: function (callback) {
            if (getData(element, id + '.ready-called')) {
              callback(element);
            } else {
              var callbacks = getData(element, id + '.when-callbacks');

              if (!callbacks) {
                callbacks = [];
              }

              callbacks.push(callback);
              setData(element, id + '.when-callbacks', callbacks);
            }

            return this;
          }
        };
      }
    };
  };


  // Lifecycle Triggers
  // ------------------

  // Triggers the entire lifecycle.
  function triggerLifecycle (id, component, target) {
    triggerReady(id, component, target, function () {
      triggerInsert(id, component, target);
    });
  }

  // Triggers the ready callback and continues execution to the insert callback.
  function triggerReady (id, component, target, done) {
    var definedMultipleArgs = /^[^(]+\([^,)]+,/;
    done = done || function () {};

    if (getData(target, id + '.ready-called')) {
      return done();
    }

    setData(target, id + '.ready-called', true);
    inherit(target, component.prototype);
    applyTemplate(id, component, target);
    addEventListeners(id, target, component.events);
    triggerWhenCallbacks(target, id);

    if (component.ready && definedMultipleArgs.test(component.ready)) {
      component.ready(target, done);
    } else if (component.ready) {
      component.ready(target);
      done();
    } else {
      done();
    }
  }

  // Triggers insert on the target.
  function triggerInsert (id, component, target) {
    if (getData(target, id + '.insert-called')) {
      return;
    }

    if (!target.parentNode) {
      return;
    }

    setData(target, id + '.insert-called', true);
    addClass(target, component.classname);

    if (component.insert) {
      component.insert(target);
    }

    triggerAttributes(id, component, target);
  }

  // Triggers remove on the target.
  function triggerRemove (id, component, target) {
    if (getData(target, id + '.remove-called')) {
      return;
    }

    setData(target, id + '.remove-called', true);

    if (component.remove) {
      component.remove(target);
    }
  }

  // Triggers the remove callbacks of the specified elements and their descendants.
  function triggerRemoveAll (elements) {
    eachElement(elements, function (element) {
      triggerRemoveAll(element.children);
      for (var possibleId in possibleIds(element)) {
        if (possibleId in skateComponents) {
          triggerRemove(possibleId, skateComponents[possibleId], element);
        }
      }
    });
  }

  // Sets the content of the element to the template that was specified.
  function applyTemplate (id, component, target) {
    // Noop if a falsy value is given.
    if (!component.template) {
      return;
    }

    var content = target.innerHTML;

    if (typeof component.template === 'function') {
      component.template(target);
    } else if (typeof component.template === 'string') {
      target.innerHTML = component.template;
    }

    // Content elements are placeholders for user content.
    var contentElements = target.querySelectorAll('content');

    // If there aren't any we don't do anything.
    if (!contentElements || !contentElements.length) {
      return;
    }

    // Create DOM nodes from the user content.
    var contentFragment = document.createElement('div');
    contentFragment.innerHTML = content;

    // Replace each content element with elements they select. If they don't specify which elements they want to
    // represent, then they get everything.
    for (var a = 0; a < contentElements.length; a++) {
      var contentElement = contentElements[a];
      var selectorFilter = contentElement.getAttribute('select');

      // If we are filtering based on a selector, only allow first children to be selected. Use `.children` because
      // we don't care about text nodes when filtering. If we aren't filtering, then we use `.childNodes` so that text
      // nodes are moved, as well.
      if (selectorFilter) {
        for (var b = 0; b < contentFragment.children.length; b++) {
          var contentFragmentChild = contentFragment.children[b];

          if (matchesSelector(contentFragmentChild, selectorFilter)) {
            contentElement.parentNode.insertBefore(contentFragmentChild, contentElement);
          }
        }
      } else {
        for (var c = 0; c < contentFragment.childNodes.length; c++) {
          contentElement.parentNode.insertBefore(contentFragment.childNodes[c], contentElement);
        }
      }

      contentElement.parentNode.removeChild(contentElement);
    }
  }

  // Initialises and binds attribute handlers.
  function triggerAttributes (id, component, target) {
    if (!component.attributes || getData(target, id + '.attributes-called')) {
      return;
    }

    setData(target, id + '.attributes-called', true);

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

  function addEventListeners (id, target, events) {
    if (typeof events !== 'object') {
      return;
    }

    function makeHandler (handler, delegate) {
      return function (e) {
        if (!delegate || matchesSelector(e.target, delegate)) {
          handler(target, e);
        }
      };
    }

    for (var a in events) {
      if (events.hasOwnProperty(a)) {
        var e = parseEvent(a);
        target.addEventListener(e.name, makeHandler(events[a], e.delegate));
      }
    }
  }

  function parseEvent (e) {
    var parts = e.split(' ', 2);
    return {
      name: parts[0],
      delegate: parts[1]
    };
  }

  function triggerWhenCallbacks (target, id) {
    var callbacks = getData(target, id + '.when-callbacks');

    if (!callbacks) {
      return;
    }

    callbacks.forEach(function (callback) {
      callback(target);
    });

    // Cleaning up extra callbacks will help
    // prevent possible memory leaks.
    removeData(target, id + '.when-callbacks');
  }


  // Utilities
  // ---------

  function getData (element, name) {
    if (element.__SKATE_DATA) {
      return element.__SKATE_DATA[name];
    }
  }

  function setData (element, name, value) {
    if (!element.__SKATE_DATA) {
      element.__SKATE_DATA = {};
    }

    element.__SKATE_DATA[name] = value;
  }

  function removeData (element, name) {
    if (element.__SKATE_DATA && element.__SKATE_DATA[name]) {
      delete element.__SKATE_DATA[name];
    }
  }

  // Adds the specified class to the element.
  function addClass (element, classname) {
    if (element.classList) {
      element.classList.add(classname);
    } else {
      element.className += element.className ? ' ' + classname : classname;
    }
  }

  // Returns a class list from the specified element.
  function getClassList (element) {
    return element.classList || (element.getAttribute('class') && element.getAttribute('class').split(/\s+/)) || [];
  }

  // Calls the specified callback for each element.
  function eachElement (elements, callback) {
    if (!elements) {
      return;
    }

    if (elements.nodeType) {
      if (elements.nodeType === 1) {
        elements = [elements];
      } else {
        return;
      }
    }

    if (!elements.length) {
      return;
    }

    for (var a = 0; a < elements.length; a++) {
      if (elements[a] && elements[a].nodeType === 1) {
        callback(elements[a], a);
      }
    }
  }

  // Returns the possible ids from an element.
  function possibleIds (element) {
    var ids = {};

    var tag = element.tagName.toLowerCase();
    if (isComponentOfType(tag, skate.types.TAG)) {
      ids[tag] = tag;
    }

    for (var a = 0; a < element.attributes.length; a++) {
      var attribute = element.attributes[a].nodeName;
      if (isComponentOfType(attribute, skate.types.ATTR)) {
        ids[attribute] = attribute;
      }
    }

    var classes = getClassList(element);
    for (var b = 0; b < classes.length; b++) {
      var classname = classes[b];
      if (isComponentOfType(classname, skate.types.CLASS)) {
        ids[classname] = classname;
      }
    }

    return ids;
  }

  function isComponentOfType (id, type) {
    return skate.exists(id) && skateComponents[id].type.indexOf(type) > -1;
  }

  function matchesSelector (el, selector) {
    return (el.matches || el.msMatchesSelector || el.webkitMatchesSelector || el.mozMatchesSelector || el.oMatchesSelector).call(el, selector);
  }

  // Merges the second argument into the first.
  function inherit (child, parent) {
    for (var prop in parent) {
      if (child[prop] === undefined) {
        child[prop] = parent[prop];
      }
    }

    return child;
  }

  // Creates a constructor for the specified component.
  function makeElementConstructor (id, component) {
    var isTag = component.type.indexOf(skate.types.TAG) > -1;
    var isAttr = component.type.indexOf(skate.types.ATTR) > -1;
    var isClass = component.type.indexOf(skate.types.CLASS) > -1;
    var selector = (function () {
        var selectors = [];

        if (isTag) {
          selectors.push(id);
        }

        if (isAttr) {
          selectors.push('[' + id + ']');
        }

        if (isClass) {
          selectors.push('.' + id);
        }

        return selectors.join(', ');
      }());

    function CustomElement () {
      if (!isTag) {
        throw new Error('Cannot construct "' + id + '" as a custom element.');
      }

      var element = document.createElement(id);

      // Ensure the component prototype is up to date with the element's prototype. This ensures that overwriting the
      // element prototype still works.
      component.prototype = CustomElement.prototype;

      triggerReady(id, component, element);

      return element;
    }

    CustomElement.existing = function (within) {
      return (within || document).querySelectorAll(selector);
    };

    CustomElement.selector = function () {
      return selector;
    };

    // This allows modifications to the element prototype propagate to the component prototype.
    CustomElement.prototype = component.prototype;

    return CustomElement;
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
