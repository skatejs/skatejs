(function() {

  'use strict';


  // Global Variables
  // ----------------

  var head = document.getElementsByTagName('head')[0];
  var hiddenRules = document.createElement('style');
  var classname = '_skate';
  var skateAdapter = mutationObserverAdapter() || mutationEventAdapter();
  var domPrefixes = [
      'moz',
      'ms',
      'o',
      'webkit',
    ];
  var matchesSelector = (function() {
      var matcher = Element.prototype.matches;

      domPrefixes.some(function(prefix) {
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


  // Factory
  // -------

  function skate(id, component) {
    return new Skate(id, component);
  }

  // Default configuration.
  skate.defaults = {
    attributes: false,
    extend: {},
    listen: true
  };

  // All active instances.
  skate.listeners = [];

  // Initialises the elements against all skate instances.
  skate.init = function(elements) {
    eachNode(elements, function(node) {
      var nodeName = node.nodeName.toLowerCase();
      var listener = skate.listeners[nodeName];

      if (listener) {
        listener.init(node);
      }
    });

    return elements;
  };

  // Destroys all active instances.
  skate.destroy = function() {
    Object.keys(skate.listeners).forEach(function(key) {
      skate.listeners[key].deafen();
    });

    return skate;
  };

  // Inserts hide rules for the specified selector. This is useful if you pass
  // a matching function instead of a selector to `skate()`. If you pass a
  // function and specify a `ready()` callback, your element will not be hidden
  // because there was no selector that could be used to autohide them. Calling
  // this manually gets around that problem.
  skate.hide = function(selector) {
    var ensureHideRules = [
      'position: absolute !important',
      'clip: rect(0, 0, 0, 0)'
    ];

    hiddenRules.sheet.insertRule(
      appendSelector(selector, ':not(.' + classname + ')') + '{' + ensureHideRules.join(';') + '}',
      hiddenRules.sheet.cssRules.length
    );

    return skate;
  };

  // Finds listeners matching the specified node.
  skate.listener = function(element, callback) {
    var listener = skate.listeners[nodeName(element)];

    if (listener) {
      callback(listener);
    }

    return skate;
  };


  // Common Interface
  // ----------------

  function Skate(id, component) {
    // Can specify a function that defaults to the insert callback.
    if (typeof component === 'function') {
      component = {
        insert: component
      };
    }

    this.component = component
    this.id = id;

    inherit(this.component, skate.defaults);

    // Emulate the web components ready callback.
    if (this.component.ready) {
      skate.hide(this.id);
    }

    if (this.component.listen) {
      this.listen();
    }
  }

  Skate.prototype = {
    // Initialises an element, or elements.
    init: function(elements, force) {
      var that = this;

      eachNode(elements, function(element) {
        if (force || that.matches(element)) {
          triggerReady(that, element);
        }
      });

      return this;
    },

    // Returns whether or not the instance can be applied to the element.
    matches: function(element) {
      return nodeName(element) === this.id;
    },

    // Starts listening for new elements.
    listen: function() {
      if (skate.listeners[this.id]) {
        throw new Error('Listener for "' + this.id + '" already registered.');
      }

      skate.listeners[this.id] = this;
      this.init(document.querySelectorAll(this.id), true);

      return this;
    },

    // Stops listening for new elements.
    deafen: function() {
      delete skate.listeners[this.id];
      return this;
    }
  };


  // Lifecycle Triggers
  // ------------------

  // Triggers the ready callback and continues execution to the insert callback.
  function triggerReady(skate, target) {
    var definedMultipleArgs = /^[^(]+\([^,)]+,/;
    var readyFn = skate.component.ready;

    if (target.__skates && target.__skates.indexOf(skate) !== -1) {
      return;
    }

    if (!target.__skates) {
      target.__skates = [];
    }

    target.__skates.push(skate);

    // Extend element properties and methods with those provided.
    inherit(target, skate.component.extend);

    // If an async callback is defined make it async, sync or do nothing if no ready method is defined.
    if (readyFn && definedMultipleArgs.test(readyFn)) {
      readyFn(target, done);
    } else if (readyFn) {
      readyFn(target);
      done();
    } else {
      done();
    }

    // Async callback that continues execution.
    function done() {
      if (skate.component.attrs) {
        skateAdapter.addAttributeListener(skate, target);
      }

      triggerInsert(skate, target);
    }
  }

  // Triggers insert on the target.
  function triggerInsert(skate, target) {
    var insertFn = skate.component.insert;

    // Ensures that the element is no longer hidden.
    addClass(target, classname);

    if (insertFn) {
      insertFn(target);
    }
  }

  // Triggers remove on the target.
  function triggerRemove(target) {
    skate.listener(target, function(listener) {
      if (listener.component.attrs) {
        skateAdapter.removeAttributeListener(listener, target);
      }

      if (listener.component.remove) {
        listener.component.remove(target);
      }
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
        if (mutation.addedNodes) {
          skate.init(mutation.addedNodes);
        }

        if (mutation.removedNodes) {
          triggerRemove(mutation.removedNodes);
        }
      });
    });

    observer.observe(document, {
      childList: true,
      subtree: true
    });

    return {
      addAttributeListener: function(skate, element) {
        // We've gotta keep track of values because MutationObservers don't
        // seem to report this correctly.
        var lastValueCache = {};
        var obs = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            var name = mutation.attributeName;
            var attr = element.attributes[name];
            var lifecycle = skate.component.attrs[name];
            var oldValue;
            var newValue;

            if (!lifecycle) {
              return;
            }

            // `mutation.oldValue` doesn't exist sometimes.
            oldValue = lastValueCache[name];

            if (attr) {
              newValue = lastValueCache[name] = attr.nodeValue;
            }

            if (attr && oldValue === undefined && (lifecycle.init || lifecycle.update)) {
              (lifecycle.init || lifecycle.update)(element, newValue);
              return;
            }

            if (attr && oldValue !== undefined && lifecycle.update) {
              lifecycle.update(element, newValue, oldValue);
              return;
            }

            if (!attr && lifecycle.remove) {
              lifecycle.remove(element, oldValue);
              delete lastValueCache[name];
            }
          });
        });

        obs.observe(element, {
          attributes: true
        });
      },

      removeAttributeListener: function(skate, element) {

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
        lifecycle.update(element, e.newValue, e.prevValue);
      },

      // addition (init / update)
      2: function(lifecycle, element, e) {
        (lifecycle.init || lifecycle.update)(element, e.newValue);
      },

      // removal (remove)
      3: function(lifecycle, element, e) {
        lifecycle.remove(element, e.prevValue);
      }
    };

    return {
      addAttributeListener: function(skate, element) {
        element.addEventListener('DOMAttrModified', function(e) {
          var lifecycle = skate.component.attrs[e.attrName];

          if (lifecycle) {
            attrCallbacks[e.attrChange](lifecycle, element, e);
          }
        });
      },

      removeAttributeListener: function(skate, element) {

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

  // Appends the selector to the original selector or selectors.
  function appendSelector(original, addition) {
    var parts = splitSelector(original);

    parts.forEach(function(part, index) {
      parts[index] += addition;
    });

    return parts.join(',');
  }

  // Merges the second argument into the first.
  function inherit(base, from) {
    for (var a in from) {
      if (typeof base[a] === 'undefined') {
        base[a] = from[a];
      }
    }
  }

  // Splits a selector by commas.
  function splitSelector(selector) {
    var selectors = selector.split(',');

    selectors.forEach(function(item, index) {
      selectors[index] = item.replace(/^\s+/, '').replace(/\s+$/, '');
    });

    return selectors;
  }

  function isValidNode(node) {
    return node && node.nodeType && node.nodeType === 1;
  }

  function eachNode(items, fn) {
    items = makeEnumerable(items);

    for (var a = 0; a < items.length; a++) {
      var item = items[a];

      if (isValidNode(item)) {
        fn(item, a);
      }
    }
  }

  function nodeName(item) {
    return item.nodeName && item.nodeName.toLowerCase();
  }

  function makeEnumerable(item) {
    if (!item) {
      return [];
    }

    if (typeof item === 'string' || typeof item.length !== 'number') {
      return [item];
    }

    return item;
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
