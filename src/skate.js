(function () {

  'use strict';


  // The rules used to hide elements during the ready lifecycle callback.
  var hiddenRules = document.createElement('style');


  // Observers
  // ---------

  // Normalise the mutaiton observer constructor.
  var MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;

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
   * @return {Function} Function or constructor that creates a custom-element for the component.
   */
  function skate (id, component) {
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
   * @return {skate}
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
   * @return {MutationObserver}
   */
  skate.watch = function (callback) {
    return new MutationObserver(callback);
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
    done = done || function () {};

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
  function triggerRemove (id, component, target) {
    if (component.remove && !data(target, 'blacklisted') && !data(target, id + '.remove-called')) {
      data(target, id + '.remove-called', true);
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
        var name = mutation.attributeName;
        var attr = target.attributes[name];
        var lifecycle = component.attributes[name];

        if (!lifecycle) {
          return;
        }

        if (attr && mutation.oldValue === null && (lifecycle.insert || lifecycle.update || lifecycle)) {
          insert(lifecycle, target, attr.nodeValue);
        } else if (attr && mutation.oldValue !== null && (lifecycle.update || lifecycle)) {
          update(lifecycle, target, attr.nodeValue, mutation.oldValue);
        } else if (!attr && lifecycle.remove) {
          remove(lifecycle, target, mutation.oldValue);
        }
      });
    });

    observer.observe(target, {
      attributes: true,
      attributeOldValue: true
    });

    // Now trigger init on each attribute.
    for (var a = 0; a < target.attributes.length; a++) {
      var attribute = target.attributes[a];
      var lifecycle = component.attributes[attribute.nodeName];

      if (lifecycle) {
        insert(lifecycle, target, attribute.nodeValue);
      }
    }

    function insert (lifecycle, element, newValue) {
      (lifecycle.insert || lifecycle.update || lifecycle)(element, newValue);
    }

    function update (lifecycle, element, newValue, oldValue) {
      (lifecycle.update || lifecycle)(element, newValue, oldValue);
    }

    function remove (lifecycle, element, oldValue) {
      lifecycle.remove(element, oldValue);
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
