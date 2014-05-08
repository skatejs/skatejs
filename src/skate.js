(function () {

  'use strict';


  // Scope Variables
  // ---------------

  // Reference to the head of the document where `hiddenRules` are inserted.
  var head = document.getElementsByTagName('head')[0];

  // The rules used to hide elements during the ready lifecycle callback.
  var hiddenRules = document.createElement('style');

  // The classname used to emulate element visibility between ready / insert.
  var classname = '_skate';

  // Element.prototype.matches polyfill as a function.
  var matchesSelector = (function () {
      var matcher = Element.prototype.matches;

      ['moz', 'ms', 'o', 'webkit'].some(function (prefix) {
        var method = prefix + 'MatchesSelector';

        if (Element.prototype[method]) {
          matcher = method;
          return true;
        }
      });

      return function (element, selector) {
        return element && element.nodeType === 1 && element[matcher](selector);
      };
    }());

  // All active instances.
  var skates = [];

  // The property to use when checking if the element's ready callback has been executed.
  var isReadyTriggeredProperty = '_skate_ready_triggered';

  // The property to use when checking if the element's insert callback has been executed.
  var isInsertTriggeredProperty = '_skate_insert_triggered';

  // The property to use when checking if the element is blacklisted.
  var isBlacklistedProperty = '_skate_blacklisted';


  // Observers
  // ---------

  // Normalise the mutaiton observer constructor.
  var MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;

  // MutationObserver Adapter
  // ------------------------

  var mutationObserverAdapter = {
    addElementListener: function (element, callback) {
      var options = {};
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          for (var a = 0; a < mutation.addedNodes.length; a++) {
            callback('insert', mutation.addedNodes[a]);
          }

          for (var b = 0; b < mutation.removedNodes.length; b++) {
            callback('remove', mutation.removedNodes[b]);
          }
        });
      });

      observer.observe(element, {
        childList: true,
        subtree: true
      });

      return observer;
    },
    addAttributeListener: function (element, callback) {
      if (!element.__skate_attributes) {
        element.__skate_attributes = {};
      }

      var obs = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          var type;
          var newValue;
          var name = mutation.attributeName;
          var attr = element.attributes[name];
          var oldValue = element.__skate_attributes[name];

          if (attr) {
            newValue = element.__skate_attributes[name] = attr.nodeValue;
          }

          if (attr && oldValue === undefined) {
            type = 'insert';
          } else if (attr && oldValue !== undefined) {
            type = 'update';
          } else if (!attr) {
            type = 'remove';
            delete element.__skate_attributes[name];
          }

          callback(type, name, newValue, oldValue);
        });
      });

      obs.observe(element, {
        attributes: true
      });
    }
  };


  // Mutation Events Adapter
  // -----------------------

  var mutationEventAdapter = {
    addElementListener: function (element, callback) {
      element.addEventListener('DOMNodeInserted', function (e) {
        callback('insert', e.target);
      });

      element.addEventListener('DOMSubtreeModified', function (e) {
        callback('insert', e.target);
      });

      element.addEventListener('DOMNodeRemoved', function (e) {
        callback('remove', e.target);
      });
    },
    addAttributeListener: function (element, callback) {
      var map = {
        1: 'update',
        2: 'insert',
        3: 'remove'
      };

      element.addEventListener('DOMAttrModified', function (e) {
        callback(map[e.attrChange], e.attrName, e.newValue, e.prevValue);
      });
    }
  };

  // The adapter we are using according to the capabilities of the environment.
  var skateAdapter = MutationObserver ? mutationObserverAdapter : mutationEventAdapter;


  // Watcher
  // -------

  function Watcher (element, options) {
    var that = this;
    options = options || { children: true };
    this.stack = [];

    if (options.children || options.descendants) {
      skateAdapter.addElementListener(element, function (type, descendant) {
        if (descendant.nodeType !== 1) {
          return;
        }

        for (var a in elementPossibleIds(descendant)) {
          that.fire(a + '.' + type, {
            element: descendant
          });
        }
      });
    }

    if (options.attributes) {
      skateAdapter.addAttributeListener(element, function (type, name, newValue, oldValue) {
        that.fire(name + '.' + type, {
          element: element,
          name: name,
          newValue: newValue,
          oldValue: oldValue
        });
      });
    }
  }

  Watcher.prototype = {
    on: function (name, callback) {
      if (!this.stack[name]) {
        this.stack[name] = [];
      }

      this.stack[name].push(callback);

      return this;
    },

    one: function (name, callback) {
      var that = this;
      return this.on(name, function (data) {
        callback(data);
        that.off(name);
      });
    },

    off: function (name, callback) {
      if (!this.stack[name]) {
        return this;
      }

      if (callback) {
        var index = this.stack[name].indexOf(callback);

        if (index > -1) {
          this.stack[name].splice(index, 1);
        }
      } else {
        this.stack[name] = [];
      }

      return this;
    },

    fire: function (name, data) {
      if (!this.stack[name]) {
        return this;
      }

      this.stack[name].forEach(function (callback) {
        callback(data);
      });

      return this;
    },

    destroy: function () {
      this.stack = [];
      return this;
    }
  };


  // Public API
  // ----------

  var documentWatcher;

  function skate (id, component) {
    if (!documentWatcher) {
      documentWatcher = new Watcher(document, {
        descendants: true
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

    if (component.ready) {
      hiddenRules.sheet.insertRule(
        id + ':not(.' + component.classname + '),' +
        '[' + id + ']:not(.' + component.classname + '),' +
        '.' + id + ':not(.' + component.classname + '){display:none}',
        hiddenRules.sheet.cssRules.length
      );
    }

    var existing = document.querySelectorAll(elementSelectorFromId(id));

    for (var a = 0; a < existing.length; a++) {
      if (!existing[a][isBlacklistedProperty]) {
        triggerLifecycle(id, component, existing[a]);
      }
    }

    documentWatcher.on(id + '.insert', function (data) {
      if (!data.element[isBlacklistedProperty]) {
        triggerLifecycle(id, component, data.element);
      }
    });

    documentWatcher.on(id + '.remove', function (data) {
      if (component.remove) {
        component.remove(data.element);
      }
    });

    return function () {
      var element = document.createElement(id);
      triggerReady(id, component, element);
      return element;
    };
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

    // Properties and methods to add to each element.
    extend: {},

    // Whether or not to start listening right away.
    listen: true,

    // The type of bindings to allow.
    type: skate.types.ANY
  };

  /**
   * Synchronously initialises the specified element or elements.
   *
   * @param {Element | Traversable} elements The element or elements to init.
   *
   * @return {skate}
   */
  skate.init = function (elements) {
    eachElement(elements, function (element) {
      for (var a in elementPossibleIds(element)) {
        documentWatcher.fire(a + '.insert', {
          element: element
        });
      }
    });

    return skate;
  };

  /**
   * Stops listening.
   *
   * @return {skate}
   */
  skate.destroy = function () {
    documentWatcher.destroy();
    return skate;
  };

  /**
   * Ensures the passed element or elements aren't initialised.
   *
   * @param {Element | Traversable} elements The element or elements to blacklist.
   * @param {Boolean} andDescendants Whether or not to blacklist element descendants.
   *
   * @return {skate}
   */
  skate.blacklist = function (elements, andDescendants) {
    if (andDescendants === undefined) {
      andDescendants = true;
    }

    eachElement(elements, function (element) {
      element[isBlacklistedProperty] = true;

      if (andDescendants) {
        skate.blacklist(element.children, true);
      }
    });

    return skate;
  };

  /**
   * Ensures the passed element or elements aren't blacklisted.
   *
   * @param {Element | Traversable} elements The element or elements to blacklist.
   * @param {Boolean} andDescendants Whether or not to whitelist element descendants.
   *
   * @return {skate}
   */
  skate.whitelist = function (elements, andDescendants) {
    if (andDescendants === undefined) {
      andDescendants = true;
    }

    eachElement(elements, function (element) {
      delete element[isBlacklistedProperty];

      if (andDescendants) {
        skate.whitelist(element.children, true);
      }
    });

    return skate;
  };

  /**
   * Creates a new watcher for the specified element.
   *
   * @param {Element} element The element to watch.
   * @param {Object} options The options to use for watching.
   *
   * @return {Watcher}
   */
  skate.watch = function (element, options) {
    return new Watcher(element, options);
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
    done = done || function (){};

    if (alreadyCalled('ready', id, target)) {
      return done();
    }

    flagCalled('ready', id, target);
    inherit(target, component.extend);

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

    if (alreadyCalled('insert', id, target)) {
      return;
    }

    if (!document.documentElement.contains(target)) {
      return;
    }

    flagCalled('insert', id, target);
    triggerAttributes(id, component, target);
    addClass(target, classname);

    if (insertFn) {
      insertFn(target);
    }
  }

  // Initialises and binds attribute handlers.
  function triggerAttributes(id, component, target) {
    if (!component.attributes) {
      return;
    }

    if (alreadyCalled('attributes', id, target)) {
      return;
    }

    flagCalled('attributes', id, target);

    var watcher = new Watcher(target, {
      attributes: true
    });

    for (var attributeName in component.attributes) {
      var attributeDefinition = component.attributes[attributeName];

      if (typeof attributeDefinition === 'function') {
        attributeDefinition = {
          update: attributeDefinition
        };
      }

      if (!attributeDefinition.insert && attributeDefinition.update) {
        attributeDefinition.insert = attributeDefinition.update;
      }

      if (attributeDefinition.insert && target.hasAttribute(attributeName)) {
        attributeDefinition.insert({
          element: target,
          name: attributeName,
          newValue: target.getAttribute(attributeName)
        });
      }

      for (var attributeHandlerName in attributeDefinition) {
        watcher.on(attributeName + '.' + attributeHandlerName, attributeDefinition[attributeHandlerName]);
      }
    }
  }

  function alreadyCalled(type, id, target) {
    return target.__skate_already_called &&
      target.__skate_already_called[type] &&
      target.__skate_already_called[type][id];
  }

  function flagCalled(type, id, target) {
    if (!target.__skate_already_called) {
      target.__skate_already_called = {};
    }

    if (!target.__skate_already_called[type]) {
      target.__skate_already_called[type] = {};
    }

    target.__skate_already_called[type][id] = id;
  }


  // Utilities
  // ---------

  // Returns whether or not the specified listener controls the given type.
  function listenerControlsType (listener, type) {
    return listener.component.type.indexOf(type) > -1;
  }

  // Merges the second argument into the first.
  function inherit (base, from) {
    for (var a in from) {
      if (typeof base[a] === 'undefined') {
        base[a] = from[a];
      }
    }
  }


  // Element Identifier Helpers
  // --------------------------

  function elementPossibleIds (element) {
    var ids = {};
    var tag = element.tagName.toLowerCase();

    ids[tag] = tag;

    for (var a = 0; a < element.attributes.length; a++) {
      var name = element.attributes[a].nodeName;
      ids[name] = name;
    }

    element.className.split(' ').forEach(function (id) {
      if (id) {
        ids[id] = id;
      }
    });

    return ids;
  }

  // Returns the component id from the tag name.
  function elementComponentIdFromTag (element) {
    return (element.tagName || '').toLowerCase();
  }

  // Returns the component ids from the component attribute or class names.
  function elementComponentIdsFromAttrs (element) {
    return [].map.call(element.attributes || [], function (attr) {
      return attr.nodeName;
    });
  }

  // Returns the component ids from the component class attribute.
  function elementComponentIdsFromClasses (element) {
    return (element.className || '').split(' ');
  }


  // Element Manipulation Helpers
  // ----------------------------

  function elementSelectorFromId (id) {
    return id + ', [' + id + '], .' + id;
  }

  // Adds the specified class to the element.
  function addClass (element, classname) {
    if (element.classList) {
      element.classList.add(classname);
    } else {
      element.className += ' ' + classname;
    }
  }


  // Element Traversal Helpers
  // -------------------------

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

  // Executes the callback for each descendant of each element.
  function eachDescendant (elements, callback) {
    eachElement(elements, function (element) {
      eachElement(element.children, function (child) {
        callback(child);
        eachDescendant(child, callback);
      });
    });
  }


  // Stylistic Helpers
  // -----------------

  // Adds a rule to hide the specified component by its id.
  function hideByListener (listener) {
    hiddenRules.sheet.insertRule(
      negateListenerSelector(listener) + '{display:none}',
      hiddenRules.sheet.cssRules.length
    );
  }

  // Returns a negated selector for the specified component.
  function negateListenerSelector (listener) {
    return listenerSelectors(listener).map(function (selector) {
      return selector + ':not(.' + classname + ')';
    });
  }

  // Generates a selector for all possible bindings of a component id.
  function listenerSelector (listener) {
    return selectors(listener).join(', ');
  }

  // Returns an array of selectors for the specified component.
  function listenerSelectors (listener) {
    var parts = [];

    if (listenerControlsType(listener, skate.types.TAG)) {
      parts.push(listener.id);
    }

    if (listenerControlsType(listener, skate.types.ATTR)) {
      parts.push('[' + listener.id + ']');
    }

    if (listenerControlsType(listener, skate.types.CLASS)) {
      parts.push('.' + listener.id);
    }

    return parts;
  }


  // Global Setup
  // ------------

  // Rules that hide elements as they're inserted so that elements are hidden
  // prior to calling the ready callback to prevent FOUC if the component
  // modifies the element in which it is bound.
  head.appendChild(hiddenRules);


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
