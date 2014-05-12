(function () {

  'use strict';


  // The rules used to hide elements during the ready lifecycle callback.
  var hiddenRules = document.createElement('style');


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
      var callbacks = data(element, 'attribute-callbacks');
      if (callbacks) {
        return callbacks.push(callback);
      }

      callbacks = [callback];
      data(element, 'attribute-callbacks', callbacks);

      var cache = data(element, 'attribute-cache');
      if (!cache) {
        cache = {};
        data(element, 'attribute-cache', cache);
      }

      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          var type;
          var newValue;
          var name = mutation.attributeName;
          var attr = element.attributes[name];
          var oldValue = cache[name];

          if (attr) {
            newValue = cache[name] = attr.nodeValue;
          } else {
            delete cache[name];
          }

          if (attr && newValue !== undefined && oldValue === undefined) {
            type = 'insert';
          } else if (attr && newValue !== undefined && oldValue !== undefined) {
            type = 'update';
          } else if (!attr && newValue === undefined && oldValue !== undefined) {
            type = 'remove';
          }

          callbacks.forEach(function (callback) {
            callback(type, name, newValue, oldValue);
          });
        });
      });

      observer.observe(element, {
        attributes: true
      });
    }
  };


  // Mutation Events Adapter
  // -----------------------

  var mutationEventAdapter = {
    addElementListener: function (element, callback) {
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
        if (descendant.nodeType === 1) {
          fireElements(type, descendant, options.descendants);
        }
      });
    }

    if (options.attributes) {
      skateAdapter.addAttributeListener(element, function (type, name, newValue, oldValue) {
        that.fire(name + '.' + type, {
          target: element,
          attribute: name,
          newValue: newValue,
          oldValue: oldValue
        });
      });
    }

    function fireElements(type, elements, recurse) {
      eachElement(elements, function (element) {
        for (var a in possibleIds(element)) {
          that.fire(a + '.' + type, {
            target: element
          });
        }

        if (options.children || options.descendants) {
          fireElements(type, element.children, recurse);
        }
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

  /**
   * Creates a listener for the specified component.
   *
   * @param {String} id The ID of the component.
   * @param {Object | Function} component The component definition.
   *
   * @return {Function} Function or constructor that creates a custom-element for the component.
   */
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

    documentWatcher.on(id + '.insert', function (e) {
      triggerLifecycle(id, component, e.target);
    });

    documentWatcher.on(id + '.remove', function (e) {
      triggerRemove(id, component, e.target);
    });

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
      data(element, 'blacklisted', true);

      if (andDescendants) {
        skate.blacklist(element.children, true);
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
   * Synchronously initialises the specified element or elements.
   *
   * @param {Element | Traversable} elements The element or elements to init.
   *
   * @return {skate}
   */
  skate.init = function (elements) {
    eachElement(elements, function (element) {
      for (var a in possibleIds(element)) {
        documentWatcher.fire(a + '.insert', {
          target: element
        });
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
      data(element, 'blacklisted', undefined);

      if (andDescendants) {
        skate.whitelist(element.children, true);
      }
    });

    return skate;
  };


  // Lifecycle Triggers
  // ------------------

  // Triggers the entire lifecycle.
  function triggerLifecycle (id, component, target) {
    if (data(target, 'blacklisted')) {
      return;
    }

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

    if (data(target, id + '.ready-called')) {
      return done();
    }

    data(target, id + '.ready-called', true);
    inherit(target, component.prototype);

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
  function triggerRemove(id, component, target) {
    if (component.remove && !data(target, 'blacklisted') && !data(target, id + '.remove-called')) {
      data(target, id + '.remove-called', true);
      component.remove(target);
    }
  }

  // Initialises and binds attribute handlers.
  function triggerAttributes(id, component, target) {
    if (!component.attributes) {
      return;
    }

    if (data(target, id + '.attributes-called')) {
      return;
    }

    data(target, id + '.attributes-called', true);

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

      watcher.on(attributeName + '.insert', createAttributeInsertHandler(attributeDefinition));
      watcher.on(attributeName + '.update', attributeDefinition.update);
      watcher.on(attributeName + '.remove', createAttributeRemoveHandler(attributeDefinition));

      // Force the insert to trigger.
      if (attributeDefinition.insert && target.getAttribute(attributeName)) {
        // Mutation observers don't trigger the insert unless set after adding.
        if (MutationObserver) {
          target.setAttribute(attributeName, target.getAttribute(attributeName));
        // Mutation events do trigger an insert but only if the attribute is different.
        // We fire this to ensure that the insert is called but must check in the handler
        // to make sure that it hasn't been triggered.
        } else {
          watcher.fire(attributeName + '.insert', {
            target: target,
            attribute: attributeName,
            newValue: target.getAttribute(attributeName)
          });
        }
      }
    }
  }

  function createAttributeInsertHandler (definition) {
    return function (e) {
      if (!data(e.target, 'attribute.insert-called')) {
        data(e.target, 'attribute.insert-called', true);
        definition.insert(e);
      }
    }
  }

  function createAttributeRemoveHandler (definition) {
    return function (e) {
      data(e.target, 'attribute.insert-called', false);
      definition.remove(e);
    }
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

    element.className.split(' ').forEach(function (id) {
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
    var ctor = function () {
        if (!isTag) {
          throw new Error('Cannot construct "' + id + '" as a custom element.');
        }

        var element = document.createElement(id);
        triggerReady(id, component, element);
        return element;
      };

    ctor.existing = function (within) {
      return (within || document).querySelectorAll(ctor.selector());
    };

    ctor.selector = function () {
      return selector;
    };

    return ctor;
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
