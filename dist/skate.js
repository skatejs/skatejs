(function() {

  'use strict';


  // Global Variables
  // ----------------

  var head = document.getElementsByTagName('head')[0];
  var keyframeRules = document.createElement('style');
  var animationRules = document.createElement('style');
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
        return element[matcher](selector);
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
    var cancel = window.cancelAnimationFrame || clearTimeout;
    return function(id) {
      cancel(id);
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
    extend: true,
    listen: true
  };

  // All active instances.
  skate.instances = [];

  // Destroys all active instances.
  skate.destroy = function() {
    for (var a = skate.instances.length - 1; a >= 0; a--) {
      skate.instances[a].destroy();
    }

    return skate;
  };


  // Common Interface
  // ----------------

  // Methods that should not be added to an element instance if exteding.
  var blacklist = Object.keys(skate.defaults);
  blacklist.concat(['ready', 'insert', 'remove']);

  function Skate(selector, component) {
    skate.instances.push(this);

    this.adapter = new DetectedAdapter(this);
    this.elements = [];
    this.listening = false;
    this.removeListener = null;
    this.selector = selector;

    if (typeof component === 'function') {
      component = {
        insert: component
      };
    }

    inherit(this.component = component, skate.defaults);

    if (component.ready) {
      hideElementsBySelector(selector);
    }

    if (component.listen) {
      this.listen();
    }
  }

  Skate.prototype = {
    // Starts listening for new elements.
    listen: function() {
      if (this.listening) {
        return this;
      }

      var that = this;

      this.listening = true;
      this.adapter.listen(function(target) {
        triggerReady(that, target);
      });

      if (this.component.remove) {
        this.removeListener = timeout.repeat(function() {
          for (var a = that.elements.length - 1; a > -1; a--) {
            var el = that.elements[a];

            if (!el.parentNode) {
              that.elements.splice(a, 1);
              that.component.remove.call(el);
            }
          }
        });
      }

      return this;
    },

    // Stops listening for new elements.
    deafen: function() {
      if (!this.listening) {
        return this;
      }

      this.adapter.deafen();
      this.listening = false;

      if (this.removeListener) {
        timeout.end(this.removeListener);
      }

      return this;
    },

    // Deafens and destroys the instance.
    destroy: function() {
      this.deafen();
      skate.instances.splice(skate.instances.indexOf(this), 1);
    }
  };

  function initTraversable(els) {
    return [].slice.call(els).forEach(function(el) {
      initElement(el);
    });
  }

  // Initialises an element directly by searching for any matching components.
  function initElement(el) {
    skate.instances.forEach(function(inst) {
      if (matchesSelector(el, inst.selector)) {
        triggerReady(inst, el);
      }
    });

    return el;
  }

  // Initialises elements matching the specified selector.
  function initSelector(sel) {
    return initTraversable(document.querySelectorAll(sel));
  }

  // Triggers the ready callback and continues execution to the insert callback.
  function triggerReady(skate, target) {
    var hasArgs = /^[^(]+\([^)]+\)/;
    var readyFn = skate.component.ready;
    var elementIndex = skate.elements.length;

    // If it's already been setup, don't do anything.
    if (skate.elements.indexOf(target) > -1) {
      return;
    }

    // Adds to the list of registered elements so the remove check knows which elements to check.
    skate.elements.push(target);

    // Inherit all non-special methods and properties.
    inherit(target, skate.component, blacklist);

    // If an async callback is defined make it async, sync or do nothing if no ready method is defined.
    if (readyFn && hasArgs.test(readyFn)) {
      readyFn.call(target, done);
    } else if (readyFn) {
      readyFn.call(target);
      done();
    } else {
      done();
    }

    // Async callback that continues execution.
    function done(element) {
      if (element) {
        // Replace the existing element in th registry with the new one.
        skate.elements.splice(elementIndex, 1, target);

        // Replace the existing element in the DOM.
        target.parentNode.insertBefore(element, target);
        target.parentNode.removeChild(target);

        // We must extend the new element.
        inherit(target = element, skate.component, blacklist);
      }

      triggerInsert(skate, target);
    }
  }

  function triggerInsert(skate, target) {
    var insertFn = skate.component.insert;

    // Ensures that the element is no longer hidden.
    addClass(target, classname);

    if (insertFn) {
      insertFn.call(target);
    }
  }


  // Animation Adapter
  // -----------------

  var animationEvents = ['animationstart', 'oAnimationStart', 'MSAnimationStart', 'webkitAnimationStart'];
  var animationName = '__skate';
  var animationBrowserPrefix = (function() {
    var css = document.documentElement.style;
    var prefix = false;

    if (typeof css.animation !== 'undefined') {
      return '';
    }

    domPrefixes.some(function(domPrefix) {
      if (typeof css[domPrefix + 'Animation'] !== 'undefined') {
        prefix = domPrefix;
        return true;
      }
    });

    return prefix;
  }());
  var animationCssPrefix = animationBrowserPrefix ? '-' + animationBrowserPrefix + '-' : '';
  var animationSelectors = [];

  function AnimationAdapter(skate) {
    this.listener = null;
    this.id = classname + '-' + Math.random().toString().replace('0.', '');
    this.skate = skate;
  }

  AnimationAdapter.prototype = {
    constructor: AnimationAdapter,

    listen: function(trigger) {
      var that = this;
      var existing = document.querySelectorAll(appendSelector(this.skate.selector, '.skate:not(.' + this.id + ')'));

      this.listener = function(e) {
        if (e.animationName !== animationName) {
          return;
        }

        if (matchesSelector(e.target, that.skate.selector)) {
          addClass(e.target, that.id);
          trigger(e.target);
        }
      };

      for (var a = 0; a < existing.length; a++) {
        this.listener({
          animationName: animationName,
          target: existing[a]
        });
      }

      animationEvents.forEach(function(evt) {
        document.addEventListener(evt, that.listener, false);
      });

      splitSelector(this.skate.selector).forEach(function(item, index) {
        if (animationSelectors.indexOf(item) === -1) {
          animationSelectors.push(item);
        }
      });

      animationBuildRules();

      return this;
    },

    deafen: function() {
      var that = this;

      animationEvents.forEach(function(evt) {
        document.removeEventListener(evt, that.listener, false);
      });

      this.listener = null;

      splitSelector(this.skate.selector).forEach(function(item) {
        var index = animationSelectors.indexOf(item);

        if (index !== -1) {
          animationSelectors.splice(index, 1);
        }
      });

      animationBuildRules();

      return this;
    }
  };

  function animationBuildRules() {
    animationRules.innerHTML = animationSelectors.join(',') + '{' + animationCssPrefix + 'animation: ' + animationName + ' .01s}';
  }

  function animationSetup() {
    head.appendChild(keyframeRules);
    head.appendChild(animationRules);
    keyframeRules.innerHTML = '@' + animationCssPrefix + 'keyframes ' + animationName + '{from{opacity:1}to{opacity:1}}';
  }


  // Mutation Events Adapter
  // -----------------------

  function MutationEventAdapter(skate) {
    this.listener = null;
    this.skate = skate;
  }

  MutationEventAdapter.prototype = {
    constructor: MutationEventAdapter,

    listen: function(trigger) {
      var that = this;
      var existing = document.querySelectorAll(this.skate.selector);

      // We must remember the listener in order to unbind it.
      this.listener = function(e) {
        if (e.target.msMatchesSelector && e.target.msMatchesSelector(that.skate.selector)) {
          trigger(e.target);
        }
      };

      // IE doesn't handle the initial load correctly.
      for (var a = 0; a < existing.length; a++) {
        this.listener({ target: existing[a] });
      }

      // Handle elements added after initial load.
      document.addEventListener('DOMSubtreeModified', this.listener);

      return this;
    },

    deafen: function() {
      document.removeEventListener('DOMSubtreeModified', this.listener);
      this.listener = null;

      return this;
    }
  };


  // Utilities
  // ---------

  function hideElementsBySelector(selector) {
    var ensureHideRules = [
      'position: absolute !important',
      'clip: rect(0, 0, 0, 0)'
    ];

    hiddenRules.sheet.insertRule(
      appendSelector(selector, ':not(.' + classname + ')') +
        '{' +
        ensureHideRules.join(';') +
        '}',
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

  function inherit(base, from, blacklist) {
    for (var a in from) {
      if (blacklist && blacklist.indexOf(a) > -1) {
        continue;
      }

      if (typeof base[a] === 'undefined') {
        base[a] = from[a];
      }
    }
  }


  // Global Setup
  // ------------

  var DetectedAdapter = (function() {
    return animationBrowserPrefix === false ?
      MutationEventAdapter :
      AnimationAdapter;
  }());

  if (DetectedAdapter === AnimationAdapter) {
    animationSetup();
  }

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
