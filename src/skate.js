(function() {

  'use strict';


  // Global Variables
  // ----------------

  var head = document.getElementsByTagName('head')[0];
  var hiddenRules = document.createElement('style');
  var classname = 'skate';
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


  // `requestAnimationFrame` Polyfill
  // --------------------------------

  var timeout = (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame;
    }

    for (var x = 0; x < vendors.length; ++x) {
      var method = vendors[x] + 'RequestAnimationFrame';

      if (typeof window[method] === 'function') {
        return window[method];
      }
    }

    if (!window.requestAnimationFrame) {
      return function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        },  timeToCall);

        lastTime = currTime + timeToCall;

        return id;
      };
    }
  }());

  // Ends a timeout started with `timeout`.
  timeout.end = (function() {
    if (window.cancelAnimationFrame) {
      return window.cancelAnimationFrame;
    }

    return function(id) {
      clearTimeout(id);
    };
  })();

  // Repeats the specified `fn` until `timeout` is ended.
  timeout.repeat = function(fn) {
    var call = function() {
      fn();
      return timeout(call);
    };

    return call();
  };


  // Factory
  // -------

  function skate(selector, component) {
    if (!selector) {
      return;
    }

    if (selector.nodeType === 1) {
      return initElement(selector);
    }

    if (typeof selector === 'string' && arguments.length === 1) {
      return initSelector(selector);
    }

    if (typeof selector !== 'string' && typeof selector.length === 'number') {
      return initTraversable(selector);
    }

    return new Skate(selector, component);
  }

  // Default configuration.
  skate.defaults = {
    extend: {},
    listen: true
  };

  // All active instances.
  skate.instances = [];

  // Destroys all active instances.
  skate.destroy = function() {
    for (var a = skate.instances.length - 1; a >= 0; a--) {
      skate.instances[a].deafen();
    }

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
    this.component = component
    this.elements = [];
    this.matcher = matcher;

    inherit(this.component, skate.defaults);

    if (this.component.ready && typeof this.matcher === 'string') {
      hideElementsBySelector(this.matcher);
    }

    if (this.component.listen) {
      this.listen();
    }
  }

  Skate.prototype = {
    matches: function(element) {
      return typeof this.matcher === 'function' ?
        this.matcher(element) :
        matchesSelector(element, this.matcher);
    },

    // Starts listening for new elements.
    listen: function() {
      if (skate.instances.indexOf(this) === -1) {
        skate.instances.push(this);
        initSelectorOrAll(this.matcher);
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
  function initElement(el) {
    skate.instances.forEach(function(inst) {
      if (inst.matches(el)) {
        triggerReady(inst, el);
      }
    });

    return el;
  }

  // Initialises elements matching the specified selector.
  function initSelector(sel) {
    return initTraversable(document.querySelectorAll(sel));
  }

  // Initialises using the selector if a string otherwise all elements in the DOM.
  function initSelectorOrAll(selector) {
    if (typeof selector === 'string') {
      return initSelector(selector);
    }

    return initTraversable(document.all);
  }

  // Initialises anything that is enumerable / traversable.
  function initTraversable(els) {
    return [].slice.call(els).forEach(function(el) {
      initElement(el);
    });
  }


  // Lifecycle Triggers
  // ------------------

  // Triggers the ready callback and continues execution to the insert callback.
  function triggerReady(skate, target) {
    var definedMultipleArgs = /^[^(]+\([^,)]+,/;
    var readyFn = skate.component.ready;
    var elementIndex = skate.elements.length;

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
        skate(mutation.addedNodes);

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
      initElement(e.target);
    });

    document.addEventListener('DOMNodeRemoved', function(e) {
      triggerRemove(e.target);
    });

    return true;
  }


  // Utilities
  // ---------

  function hideElementsBySelector(selector) {
    var ensureHideRules = [
      'position: absolute !important',
      'clip: rect(0, 0, 0, 0)'
    ];

    hiddenRules.sheet.insertRule(
      appendSelector(selector, ':not(.' + classname + ')') + '{' + ensureHideRules.join(';') + '}',
      hiddenRules.sheet.cssRules.length
    );
  }

  function splitSelector(selector) {
    var selectors = selector.split(',');

    selectors.forEach(function(item, index) {
      selectors[index] = item.replace(/^\s+/, '').replace(/\s+$/, '');
    });

    return selectors;
  }

  function addClass(element, classname) {
    if (element.classList) {
      element.classList.add(classname);
    } else {
      element.className +=  ' ' + classname;
    }
  }

  function appendSelector(original, addition) {
    var parts = splitSelector(original);

    parts.forEach(function(part, index) {
      parts[index] += addition;
    });

    return parts.join(',');
  }

  function inherit(base, from) {
    for (var a in from) {
      if (typeof base[a] === 'undefined') {
        base[a] = from[a];
      }
    }
  }


  // Global Setup
  // ------------

  // Detect the adapter to use.
  var skateAdapter = mutationObserverAdapter() || mutationEventAdapter()

  // Rules that hide elements during the lifecycle callbacks.
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
