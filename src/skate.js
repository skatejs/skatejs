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
        }
      });

      return function (element, selector) {
        return element[matcher](selector);
      };
    }());
  var ensureHideRules = [
      'height: 0 !important',
      'width: 0 !important',
      'overflow: hidden !important',
      'margin: 0 !important',
      'padding: 0 !important'
    ];


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
    return new Skate(selector, component);
  }

  skate.defaults = {
    extend: true,
    listen: true
  };


  // Common Interface
  // ----------------

  function Skate(selector, component) {
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
    listen: function() {
      if (this.listening) {
        return this;
      }

      var that = this;

      this.listening = true;
      this.adapter.listen(function(target) {
        timeout(function() {
          triggerReady(that, target);
        });
      });

      if (this.component.removed) {
        this.removeListener = timeout.repeat(function() {
          for (var a = that.elements.length - 1; a > -1; a--) {
            var el = that.elements[a];

            if (!el.parentNode) {
              that.elements.splice(a, 1);
              that.component.removed(el);
            }
          }
        });
      }

      return this;
    },

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
    }
  };

  function triggerReady(skate, target) {
    var definedMultipleArgs = /^[^(]+\([^,)]+,/;

    inherit(target, skate.component);

    if (target.ready && definedMultipleArgs.test(target.ready)) {
      target.ready(target, done);
    } else if (target.ready) {
      target.ready(target);
      done();
    } else {
      done();
    }

    function done(element) {
      if (element) {
        target.parentNode.insertBefore(element, target);
        target.parentNode.removeChild(target);
        target = element;
      }

      triggerInsert(skate, target);
    }
  }

  function triggerInsert(skate, target) {
    addClass(target, classname);
    skate.elements.push(target);

    if (skate.component.insert) {
      skate.component.insert(target);
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
        if (e.target.msMatchesSelector(that.skate.selector)) {
          trigger(e.target);
        }
      };

      // IE doesn't handle the initial load correctly.
      for (var a = 0; a < existing.length; a++) {
        this.listener({ target: existing[a] });
      }

      // Handle elements added after initial load.
      document.addEventListener('DOMNodeInserted', this.listener, false);

      return this;
    },

    deafen: function() {
      document.removeEventListener('DOMNodeInserted', this.listener);
      this.listener = null;

      return this;
    }
  };


  // Utilities
  // ---------

  function hideElementsBySelector(selector) {
    var ensureHideRules = [
      'height: 0 !important',
      'width: 0 !important',
      'overflow: hidden !important',
      'margin: 0 !important',
      'padding: 0 !important'
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
      element.className += classname;
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
