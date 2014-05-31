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
    if (skateComponents[id]) {
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
    // Set to `{...}` of `attrName: `{ init: ..., update: ..., remove: ... }` to listen to specific attributes.
    attributes: false,

    // The classname to use when showing this component.
    classname: '__skate',

    // Whether or not to start listening right away.
    listen: true,

    // Properties and methods to add to each element.
    prototype: {},

    // The type of bindings to allow.
    type: skate.types.ANY
  };

  /**
   * Stops listening for new elements. Generally this will only be used in testing.
   *
   * @returns {skate}
   */
  skate.destroy = function () {
    documentObserver.disconnect();
    documentObserver = undefined;
    skateComponents = {};
    return skate;
  };

  /**
   * Synchronously initialises the specified element or elements.
   *
   * @param {Element | Traversable} elements The element or elements to init.
   *
   * @returns {skate}
   */
  skate.init = function (elements) {
    eachElement(elements, function (element) {
      for (var possibleId in possibleIds(element)) {
        if (possibleId in skateComponents) {
          triggerLifecycle(possibleId, skateComponents[possibleId], element);
        }
      }

      skate.init(element.children);
    });

    return skate;
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
            if (data(element, id + '.ready-called')) {
              callback(element);
            } else {
              var callbacks = data(element, id + '.when-callbacks');

              if (!callbacks) {
                callbacks = [];
              }

              callbacks.push(callback);
              data(element, id + '.when-callbacks', callbacks);
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
    triggerReady(id, component, target, function (replaceWith) {
      if (!replaceWith) {
        return triggerInsert(id, component, target);
      }

      if (replaceWith === target || !target.parentNode) {
        return;
      }

      // A placeholder for replacing the current element.
      var comment = document.createComment('placeholder');

      // Replace the target with the placeholder.
      target.parentNode.insertBefore(comment, target);
      target.parentNode.removeChild(target);

      // Handle HTML.
      if (typeof replaceWith === 'string') {
        var div = document.createElement('div');
        div.innerHTML = replaceWith;
        replaceWith = div.children;
      }

      // Place each item before the comment in sequence.
      eachElement(replaceWith, function (element) {
        comment.parentNode.insertBefore(element, comment);
      });

      // Cleanup.
      comment.parentNode.removeChild(comment);
    });
  }

  // Triggers the ready callback and continues execution to the insert callback.
  function triggerReady (id, component, target, done) {
    var definedMultipleArgs = /^[^(]+\([^,)]+,/;
    var readyFn = component.ready;
    done = done || function () {};

    if (data(target, id + '.ready-called')) {
      return done();
    }

    data(target, id + '.ready-called', true);
    inherit(target, component.prototype);
    addEventListeners(id, target, component.events);
    triggerWhenCallbacks(target, id);

    if (readyFn && definedMultipleArgs.test(readyFn)) {
      readyFn(target, done);
    } else if (readyFn) {
      done(readyFn(target));
    } else {
      done();
    }
  }

  // Triggers insert on the target.
  function triggerInsert (id, component, target) {
    var insertFn = component.insert;

    if (data(target, id + '.insert-called')) {
      return;
    }

    if (!target.parentNode) {
      return;
    }

    data(target, id + '.insert-called', true);
    triggerAttributes(id, component, target);
    addClass(target, component.classname);

    if (insertFn) {
      insertFn(target);
    }
  }

  // Triggers remove on the target.
  function triggerRemove (id, component, target) {
    if (data(target, id + '.remove-called')) {
      return;
    }

    data(target, id + '.remove-called', true);
    removeEventListeners(id, target, component.events);

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

  // Initialises and binds attribute handlers.
  function triggerAttributes (id, component, target) {
    if (!component.attributes || data(target, id + '.attributes-called')) {
      return;
    }

    data(target, id + '.attributes-called', true);

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

    function makeHandler (handler) {
      return function (e) {
        handler(target, e);
      };
    }

    for (var a in events) {
      if (events.hasOwnProperty(a)) {
        var handler = makeHandler(events[a]);
        data(target, id + '.event.' + a, handler);
        target.addEventListener(a, handler);
      }
    }
  }

  function removeEventListeners (id, target, events) {
    if (typeof events !== 'object') {
      return;
    }

    for (var a in events) {
      if (events.hasOwnProperty(a)) {
        target.removeEventListener(a, data(target, id + '.event.' + a));
        removeData(target, id + '.event.' + a);
      }
    }
  }

  function triggerWhenCallbacks (target, id) {
    var callbacks = data(target, id + '.when-callbacks');

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

  function data (element, name, value) {
    if (value === undefined) {
      return element.__SKATE_DATA && element.__SKATE_DATA[name];
    }

    if (!element.__SKATE_DATA) {
      element.__SKATE_DATA = {};
    }

    element.__SKATE_DATA[name] = value;

    return element;
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
    var ids = data(element, 'possible-ids');

    if (ids) {
      return ids;
    }

    var tag = element.tagName.toLowerCase();

    ids = {};
    ids[tag] = tag;

    for (var a = 0; a < element.attributes.length; a++) {
      var name = element.attributes[a].nodeName;
      ids[name] = name;
    }

    var classname = '';

    if (typeof element.className === 'string') {
      classname = element.className;
    } else {
      classname = element.getAttribute('class') || '';
    }

    classname.split(' ').forEach(function (id) {
      if (id) {
        ids[id] = id;
      }
    });

    data(element, 'possible-ids', ids);

    return ids;
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

      triggerReady(id, component, element);

      return element;
    }

    CustomElement.existing = function (within) {
      return (within || document).querySelectorAll(selector);
    };

    CustomElement.selector = function () {
      return selector;
    };

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

  if (typeof define === 'function' && define.amd) {
    define('skate', [], function () {
      return skate;
    });
  } else {
    window.skate = skate;
  }

})();
