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

  function skate(selector, component) {
    return new Skate(selector, component);
  }

  // Default configuration.
  skate.defaults = {
    extend: {},
    listen: true
  };

  // All active instances.
  skate.instances = [];

  // Initialises the elements against all skate instances.
  skate.init = function(elements) {
    skate.instances.forEach(function(instance) {
      instance.init(elements);
    });

    return skate;
  };

  // Destroys all active instances.
  skate.destroy = function() {
    for (var a = skate.instances.length - 1; a >= 0; a--) {
      skate.instances[a].deafen();
    }

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

  // Finds instances matching the specified node.
  skate.find = function(element) {
    var instances = [];

    skate.instances.forEach(function(instance) {
      if (instance.matches(element)) {
        instances.push(instance);
      }
    });

    return instances;
  };


  // Common Interface
  // ----------------

  function Skate(matcher, component) {
    // Can specify a function that defaults to the insert callback.
    if (typeof component === 'function') {
      component = {
        insert: function(){}
      };
    }

    this.component = component
    this.elements = [];
    this.matcher = matcher;

    inherit(this.component, skate.defaults);

    // Emulate the web components ready callback.
    if (this.component.ready && typeof this.matcher === 'string') {
      skate.hide(this.matcher);
    }

    if (this.component.listen) {
      this.listen();
    }
  }

  Skate.prototype = {
    // Initialises an element, or elements.
    init: function(elements, force) {
      // Defaults to using the current selector, or elements if the selector is
      // not a string. This is because a matching function can be provided
      // instead of a selector.
      if (typeof elements === 'undefined') {
        elements = document.querySelectorAll(typeof this.matcher === 'string' ? this.matcher : '*');
      }

      if (elements.nodeType === 1) {
        initElement(this, elements, force);
      } else if (typeof elements === 'string') {
        initSelector(this, elements, force);
      } else if (typeof elements.length === 'number') {
        initTraversable(this, elements, force);
      }

      return this;
    },

    // Returns whether or not the instance can be applied to the element.
    matches: function(element) {
      return typeof this.matcher === 'function' ?
        this.matcher(element) :
        matchesSelector(element, this.matcher);
    },

    // Starts listening for new elements.
    listen: function() {
      if (skate.instances.indexOf(this) === -1) {
        skate.instances.push(this);
        this.init();
      }

      return this;
    },

    // Stops listening for new elements.
    deafen: function() {
      if (skate.instances.indexOf(this) !== -1) {
        skate.instances.splice(skate.instances.indexOf(this), 1);
      }

      return this;
    }
  };


  // Initialisers
  // ------------

  // Initialises an element directly by searching for any matching components.
  function initElement(skate, element, force) {
    if (force || skate.matches(element)) {
      triggerReady(skate, element);
    }
  }

  // Initialises elements matching the specified selector.
  function initSelector(skate, selector, force) {
    initTraversable(skate, document.querySelectorAll(selector), force);
  }

  // Initialises anything that is enumerable / traversable.
  function initTraversable(skate, elements, force) {
    [].slice.call(elements).forEach(function(element) {
      initElement(skate, element, force);
    });
  }


  // Lifecycle Triggers
  // ------------------

  // Triggers the ready callback and continues execution to the insert callback.
  function triggerReady(skate, target) {
    var definedMultipleArgs = /^[^(]+\([^,)]+,/;
    var readyFn = skate.component.ready;

    // If it's already been setup, don't do anything.
    if (skate.elements.indexOf(target) > -1) {
      return;
    }

    // Adds to the list of registered elements so the remove check knows which elements to check.
    skate.elements.push(target);

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
    skate.find(target).forEach(function(inst) {
      if (inst.component.remove) {
        inst.component.remove(target);
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
        skate.init(mutation.addedNodes);

        if (mutation.removedNodes) {
          [].slice.call(mutation.removedNodes).forEach(function(removedNode) {
            triggerRemove(removedNode);
          });
        }
      });
    });

    observer.observe(document, {
      childList: true,
      subtree: true
    });

    return true;
  }


  // Mutation Events Adapter
  // -----------------------

  function mutationEventAdapter() {
    document.addEventListener('DOMNodeInserted', function(e) {
      skate.init(e.target);
    });

    document.addEventListener('DOMNodeRemoved', function(e) {
      triggerRemove(e.target);
    });

    return true;
  }


  // Utilities
  // ---------

  // Adds the specified class to the element.
  function addClass(element, classname) {
    if (element.classList) {
      element.classList.add(classname);
    } else {
      element.className +=  ' ' + classname;
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
