(function() {

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
  var matchesSelector = (function() {
      var matcher = Element.prototype.matches;

      ['moz', 'ms', 'o', 'webkit'].some(function(prefix) {
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

  // The adapter we are using according to the capabilities of the environment.
  var skateAdapter = mutationObserverAdapter() || mutationEventAdapter();

  // The property to use when checking if the element has already been initialised.
  var isReadyTriggeredProperty = '_skate_ready_triggered';

  // The property to use when checking if the element's insert callback has been executed.
  var isInsertTriggeredProperty = '_skate_insert_triggered';


  // Factory
  // -------

  function skate(id, component) {
    // The listener is what controls the lifecycle of the element.
    var listener = new Skate(id, component);

    // For easy instantiation.
    var constructor = function() {
      var element = document.createElement(id);
      listener.init(element, true);
      return element;
    };

    // If you need access to the listener.
    constructor.listener = listener;

    // The skate factory returns the element constructor.
    return constructor;
  }

  // Restriction type constants.
  skate.types = {
    ANY: 'act',
    ATTR: 'a',
    CLASS: 'c',
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

  // Initialises the elements against all skate instances.
  skate.init = function(elements) {
    eachElement(elements, function(element) {
      skate.listeners(element).forEach(function(listener) {
        listener.init(element);
      });
    });

    return elements;
  };

  // Destroys all active instances.
  skate.destroy = function() {
    Object.keys(skates).forEach(function(key) {
      skates[key].deafen();
    });

    return skate;
  };

  // Finds listeners matching the specified node.
  skate.listeners = function(element) {
    var listeners = [];
    var tag = elementComponentIdFromTag(element);
    var attrs = elementComponentIdsFromAttrs(element);
    var classes = elementComponentIdsFromClasses(element);

    // Tag overrides attributes.
    if (tag && skates[tag]) {
      listeners.push(skates[tag]);
    }

    // Attributes override classes.
    attrs.concat(classes).forEach(function(id) {
      if (skates[id]) {
        listeners.push(skates[id]);
      }
    });

    return listeners;
  };


  // Common Interface
  // ----------------

  function Skate(id, component) {
    if (!component) {
      component = {};
    }

    // Can specify a function that defaults to the insert callback.
    if (typeof component === 'function') {
      component = {
        insert: component
      };
    }

    this.component = component
    this.id = id;

    inherit(this.component, skate.defaults);

    if (this.component.ready) {
      hideById(this.id);
    }

    if (this.component.listen) {
      this.listen();
    }
  }

  Skate.prototype = {
    // Initialises one or more elements.
    init: function(elements) {
      var that = this;

      eachElement(elements, function(element) {
        validateType(that, element);
        triggerLifecycle(that, element);
      });

      return this;
    },

    // Starts listening for new elements.
    listen: function() {
      if (skates[this.id]) {
        throw new Error('Listener for "' + this.id + '" already registered.');
      }

      skates[this.id] = this;
      this.init(this.id);

      return this;
    },

    // Stops listening for new elements.
    deafen: function() {
      delete skates[this.id];
      return this;
    }
  };


  // Lifecycle Triggers
  // ------------------

  // Triggers the entire lifecycle.
  function triggerLifecycle(instance, target) {
    triggerReady(instance, target, function() {
      triggerInsert(instance, target);
    });
  }

  // Triggers the ready callback and continues execution to the insert callback.
  function triggerReady(instance, target, done) {
    var definedMultipleArgs = /^[^(]+\([^,)]+,/;
    var component = instance.component;
    var readyFn = component.ready;
    done = done || function(){};

    // Make sure the tracker is registered.
    if (!target[isReadyTriggeredProperty]) {
      target[isReadyTriggeredProperty] = [];
    }

    // If it's already been triggered, skip.
    if (target[isReadyTriggeredProperty].indexOf(instance.id) > -1) {
      return done();
    }

    // Set as ready.
    target[isReadyTriggeredProperty].push(instance.id);

    // Extend element properties and methods with those provided.
    inherit(target, component.extend);

    // Bind attribute listeners if supplied.
    if (component.attrs) {
      skateAdapter.addAttributeListener(target, component.attrs);
    }

    // If an async callback is defined make it async, sync or do nothing if no ready method is defined.
    if (readyFn && definedMultipleArgs.test(readyFn)) {
      readyFn(target, done);
    } else if (readyFn) {
      readyFn(target);
      done();
    } else {
      done();
    }
  }

  // Triggers insert on the target.
  function triggerInsert(instance, target) {
    var component = instance.component;
    var insertFn = component.insert;

    // Make sure the tracker is registered.
    if (!target[isInsertTriggeredProperty]) {
      target[isInsertTriggeredProperty] = [];
    }

    // If it's already been triggered, skip.
    if (target[isInsertTriggeredProperty].indexOf(instance.id) > -1) {
      return;
    }

    // If it's not in the document we shouldn't trigger it.
    if (!document.documentElement.contains(target)) {
      return;
    }

    // Set as inserted.
    target[isInsertTriggeredProperty].push(instance.id);

    // Ensures that the element is no longer hidden.
    addClass(target, classname);

    if (insertFn) {
      insertFn(target);
    }
  }

  // Triggers remove on the target.
  function triggerRemove(elements) {
    eachElement(elements, function(element) {
      skate.listeners(element).forEach(function(listener) {
        if (listener.component.attrs) {
          skateAdapter.removeAttributeListener(listener, element);
        }

        if (listener.component.remove) {
          listener.component.remove(element);
        }
      });
    });
  }


  // MutationObserver Adapter
  // ------------------------

  function mutationObserverAdapter() {
    var MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;

    if (!MutationObserver) {
      return;
    }

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length) {
          skate.init(mutation.addedNodes);
        }

        if (mutation.removedNodes && mutation.removedNodes.length) {
          triggerRemove(mutation.removedNodes);
        }
      });
    });

    observer.observe(document, {
      childList: true,
      subtree: true
    });

    return {
      addAttributeListener: function(element, attributes) {
        function init (lifecycle, element, newValue) {
          (lifecycle.init || lifecycle.update || lifecycle)(element, newValue);
        }

        function update (lifecycle, element, newValue, oldValue) {
          (lifecycle.update || lifecycle)(element, newValue, oldValue);
        }

        function remove (lifecycle, element, oldValue) {
          lifecycle.remove(element, oldValue);
          delete lastValueCache[name];
        }

        // We've gotta keep track of values because MutationObservers don't
        // seem to report this correctly.
        var lastValueCache = {};
        var obs = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            var name = mutation.attributeName;
            var attr = element.attributes[name];
            var lifecycle = attributes[name];
            var oldValue;
            var newValue;

            if (!lifecycle) {
              return;
            }

            // `mutation.oldValue` doesn't exist sometimes.
            oldValue = lastValueCache[name];

            // Only set a new value if the attribute exists.
            if (attr) {
              newValue = lastValueCache[name] = attr.nodeValue;
            }

            // `init()` or `update()` callback.
            if (attr && oldValue === undefined && (lifecycle.init || lifecycle.update || lifecycle)) {
              return init(lifecycle, element, newValue);
            }

            // `update()` callback.
            if (attr && oldValue !== undefined && (lifecycle.update || lifecycle)) {
              return update(lifecycle, element, newValue, oldValue);
            }

            // `remove()` callback.
            if (!attr && lifecycle.remove) {
              return remove(lifecycle, element, oldValue);
            }
          });
        });

        obs.observe(element, {
          attributes: true
        });

        // Now trigger init on each attribute.
        for (var a = 0; a < element.attributes.length; a++) {
          var attribute = element.attributes[a];
          var lifecycle = attributes[attribute.nodeName];

          if (lifecycle) {
            init(lifecycle, element, attribute.nodeValue);
          }
        }
      },

      removeAttributeListener: function(element) {

      }
    };
  }


  // Mutation Events Adapter
  // -----------------------

  function mutationEventAdapter() {
    var attributeListeners = [];

    document.addEventListener('DOMNodeInserted', function(e) {
      skate.init(e.target);
    });

    document.addEventListener('DOMNodeRemoved', function(e) {
      triggerRemove(e.target);
    });

    var attrCallbacks = {
      // modification (update)
      1: function(lifecycle, element, e) {
        (lifecycle.update || lifecycle)(element, e.newValue, e.prevValue);
      },

      // addition (init / update)
      2: function(lifecycle, element, e) {
        (lifecycle.init || lifecycle.update || lifecycle)(element, e.newValue);
      },

      // removal (remove)
      3: function(lifecycle, element, e) {
        if (lifecycle.remove) {
          lifecycle.remove(element, e.prevValue);
        }
      }
    };

    return {
      addAttributeListener: function(element, attributes) {
        element.addEventListener('DOMAttrModified', function(e) {
          var lifecycle = attributes[e.attrName];

          if (lifecycle) {
            attrCallbacks[e.attrChange](lifecycle, element, e);
          }
        });

        // Now trigger init on each attribute.
        for (var a = 0; a < element.attributes.length; a++) {
          var attribute = element.attributes[a];
          var lifecycle = attributes[attribute.nodeName];

          if (lifecycle) {
            attrCallbacks[2](lifecycle, element, {
              newValue: attribute.nodeValue
            });
          }
        }
      },

      removeAttributeListener: function(element) {

      }
    };
  }


  // Utilities
  // ---------

  // Adds the specified class to the element.
  function addClass(element, classname) {
    if (element.classList) {
      element.classList.add(classname);
    } else {
      element.className += ' ' + classname;
    }
  }

  // Calls the specified callback for each element.
  function eachElement(elements, callback) {
    if (elements.nodeType) {
      elements = [elements];
    } else if (typeof elements === 'string') {
      elements = document.querySelectorAll(selector(elements));
    }

    for (var a = 0; a < elements.length; a++) {
      if (elements[a].nodeType === 1) {
        callback(elements[a], a);
      }
    }
  }

  // Returns the component id from the tag name.
  function elementComponentIdFromTag(element) {
    return (element.tagName || '').toLowerCase();
  }

  // Returns the component ids from the component attribute or class names.
  function elementComponentIdsFromAttrs(element) {
    return [].map.call(element.attributes || [], function (attr) {
      return attr.nodeName;
    });
  }

  // Returns the component ids from the component class attribute.
  function elementComponentIdsFromClasses(element) {
    return (element.className || '').split(' ');
  }

  // Adds a rule to hide the specified component by its id.
  function hideById(id) {
    hiddenRules.sheet.insertRule(
      negateSelector(id) + '{display:none}',
      hiddenRules.sheet.cssRules.length
    );
  }

  // Merges the second argument into the first.
  function inherit(base, from) {
    for (var a in from) {
      if (typeof base[a] === 'undefined') {
        base[a] = from[a];
      }
    }
  }

  // Returns the outer HTML of the specified element.
  function outerHtml (element) {
    return document.createElement('div').appendChild(element.cloneNode(true)).parentNode.innerHTML;
  }

  // Returns a negated selector for the specified component.
  function negateSelector(id) {
    return selectors(id).map(function(selector) {
      return selector + ':not(.' + classname + ')';
    });
  }

  // Generates a selector for all possible bindings of a component id.
  function selector(id) {
    return selectors(id).join(', ');
  }

  // Returns an array of selectors for the specified component.
  function selectors(id) {
    return [id, '[' + id + ']', '.' + id];
  }

  // Validates the element against the compoonent type.
  function validateType(instance, element) {
    var type;
    var types = {};
    var restrictions = {};

    types[skate.types.ATTR] = 'an attribute';
    types[skate.types.CLASS] = 'a class';
    types[skate.types.TAG] = 'a tag';

    restrictions[skate.types.ATTR] = 'attributes';
    restrictions[skate.types.CLASS] = 'classes';
    restrictions[skate.types.NOTAG] = 'attributes or classes';
    restrictions[skate.types.TAG] = 'tags';

    if (element.tagName.toLowerCase() === instance.id) {
      type = skate.types.TAG;
    } else if (element.hasAttribute(instance.id)) {
      type = skate.types.ATTR;
    } else if (element.className.split(' ').indexOf(instance.id) > -1) {
      type = skate.types.CLASS;
    }

    if (instance.component.type.indexOf(type) === -1) {
      throw new Error('Component "' + instance.id + '" was bound using ' + types[type] + ' and is restricted to using ' + restrictions[instance.component.type] + '. Element: ' + outerHtml(element));
    }
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
    define('skate', function() {
      return skate;
    });
  } else {
    window.skate = skate;
  }

})();
