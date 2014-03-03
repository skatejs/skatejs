(function() {

  'use strict';

  var isSetup = false;
  var domPrefixes = [
    'moz',
    'ms',
    'o',
    'webkit',
  ];


  var count = 0;
  var head = document.getElementsByTagName('head')[0];

  var keyframeRules = document.createElement('style');
  var animationRules = document.createElement('style');
  var hiddenRules = document.createElement('style');


  // Adapted from: http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating.
  //
  // Calls the specified function using `RequestAnimationFrame` and falls back to using `setTimeout`.
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


  function skate(selector, component) {
    return new Skate(selector, component);
  }


  function Skate(selector, component) {
    this.adapter = new DetectedAdapter(this);
    this.removeListener = false;
    this.removeRegistry = [];
    this.selector = selector;
    this.events = {
      ready: [],
      insert: [],
      remove: []
    };

    if (component) {
      this.add(component).listen();
    }
  }

  Skate.prototype = {
    add: function(component) {
      if (typeof component === 'function') {
        component = {
          ready: component
        }
      }

      for (var a in this.events) {
        if (this.events.hasOwnProperty(a) && component[a]) {
          this.on(a, component[a]);
        }
      }

      return this;
    },

    remove: function(component) {
      if (typeof component === 'function') {
        component = {
          ready: component
        }
      }

      for (var a in this.events) {
        if (this.events.hasOwnProperty(a) && component[a]) {
          this.off(a, component[a]);
        }
      }

      return this;
    },

    on: function(evt, fn) {
      var that = this;

      this.events[evt].push(fn);

      if (evt === 'remove' && !this.removeListener) {
        this.removeListener = timeout.repeat(function() {
          for (var a = that.removeRegistry.length - 1; a > -1; a--) {
            var el = that.removeRegistry[a];

            if (!el.parentNode) {
              that.removeRegistry.splice(a, 1);
              that.trigger('remove', el);
            }
          }
        });
      }

      return this;
    },

    off: function(evt, fn) {
      if (fn) {
        this.events[evt].splice(this.events[evt].indexOf(fn), 1);
      } else {
        this.events[evt] = [];
      }

      if (evt === 'remove' && !this.events['remove'].length) {
        timeout.end(this.removeListener);
      }

      return this;
    },

    listen: function() {
      this.adapter.listen();
      return this;
    },

    deafen: function() {
      this.adapter.deafen();

      if (this.removeListener) {
        timeout.end(this.removeListener);
      }

      return this;
    },

    trigger: function(evt, element) {
      if (evt === 'insert') {
        this.removeRegistry.push(element);
      }

      this.events[evt].forEach(function(fn) {
        fn(element);
      });

      return this;
    }
  };


  var instances = [];
  var animationEvents = ['animationstart', 'oAnimationStart', 'MSAnimationStart', 'webkitAnimationStart'];
  var animationNamePrefix = '__skate';
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


  function AnimationAdapter(skate) {
    this.skate = skate;
    this.events = {};
    this.listeners = {};
    this.selectors = {};
  }

  AnimationAdapter.prototype = {
    constructor: AnimationAdapter,

    listen: function() {
      instances.push(this);

      var index = keyframeRules.sheet.cssRules.length;
      var name = animationNamePrefix + index;
      var prefix = '-' + animationBrowserPrefix + '-';

      // We don't need any animation to happen, we only need the event to fire.
      keyframeRules.sheet.insertRule('@' + prefix + 'keyframes ' + name + '{from{opacity:1}to{opacity:1}}', index);
      animationRules.sheet.insertRule(this.skate.selector + '{' + prefix + 'animation:' + name + ' .01s}', index);
      hideBySelector(this.skate.selector);

      return this;
    },

    deafen: function() {
      var index = instances.indexOf(this);

      if (index !== -1) {
        instances.splice(index, 1);
        keyframeRules.sheet.deleteRule(keyframeRules.sheet.cssRules.item(index));
        animationRules.sheet.deleteRule(animationRules.sheet.cssRules.item(index));
      }

      return this;
    }
  }


  function handleAnimationEvent(e) {
    triggerReadyAndInsert(
      instances[e.animationName.replace(animationNamePrefix, '')],
      e.target
    );
  }

  function setUpAnimationAdapter() {
    animationRules.type = keyframeRules.type = 'text/css';

    head.appendChild(keyframeRules);
    head.appendChild(animationRules);

    animationEvents.forEach(function(evt) {
      document.addEventListener(evt, handleAnimationEvent, false);
    });
  }


  function MutationEventAdapter(skate) {
    this.skate = skate;
  }

  MutationEventAdapter.prototype = {
    constructor: MutationEventAdapter,

    listen: function() {
      var that = this;
      var existing = document.querySelectorAll(this.skate.selector);

      // IE doesn't handle the initial load correctly.
      for (var a = 0; a < existing.length; a++) {
        triggerReadyAndInsert(this, existing[a]);
      }

      // Handle elements added after initial load.
      document.addEventListener('DOMNodeInserted', function(e) {
        if (e.target.msMatchesSelector(that.skate.selector)) {
          triggerReadyAndInsert(that, e.target);
        }
      }, false);

      return this;
    },

    deafen: function() {
      return this;
    }
  };


  var triggeredNodes = [];

  function triggerReadyAndInsert(adapter, target) {
    if (triggeredNodes.indexOf(target) !== -1) {
      return;
    }

    triggeredNodes.push(target);
    adapter.skate.trigger('ready', target);
    target.setAttribute('data-skate', count++);
    adapter.skate.trigger('insert', target);
  }


  function hideBySelector(selector) {
    var selectorParts = selector.split(',');
      var ensureHideRules = [
        'height: 0 !important',
        'width: 0 !important',
        'overflow: hidden !important',
        'margin: 0 !important',
        'padding: 0 !important'
      ];

      for (var a in selectorParts) {
        selectorParts[a] += ':not([data-skate])';
      }

      hiddenRules.sheet.insertRule(
        selectorParts.join(',')
          + '{'
          + ensureHideRules.join(';')
          + '}',
        hiddenRules.sheet.cssRules.length
      );
  }


  // Detect which adapter we should use.
  var DetectedAdapter = (function() {
    return animationBrowserPrefix
      ? AnimationAdapter
      : MutationEventAdapter;
  }());


  // Only the animation adapter needs setup.
  if (DetectedAdapter === AnimationAdapter) {
    setUpAnimationAdapter();
  }


  // All adapters use the hidden rules.
  head.appendChild(hiddenRules);


  if (typeof define === 'function' && define.amd) {
    define('skate', function() {
      return skate;
    });
  } else {
    window.skate = skate;
  }

})();
