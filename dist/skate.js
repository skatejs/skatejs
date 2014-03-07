(function() {

  'use strict';


  var head = document.getElementsByTagName('head')[0];
  var keyframeRules = document.createElement('style');
  var animationRules = document.createElement('style');
  var hiddenRules = document.createElement('style');
  var cssClassName = '__skate';
  var domPrefixes = [
    'moz',
    'ms',
    'o',
    'webkit',
  ];


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
    this.selector = selector;
    this.adapter = new DetectedAdapter(selector);
    this.listening = false;
    this.removeListener = null;
    this.elements = [];

    if (typeof component === 'function') {
      component = {
        ready: component
      };
    }

    if (component.listen === undefined) {
      component.listen = true;
    }

    this.component = component;

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
        triggerReady(that, target);
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
    var ready = skate.component.ready;
    var definedMultipleArgs = /^[^(]+\([^,)]+,/;

    if (ready && definedMultipleArgs.test(ready)) {
      ready(target, done);
    } else if (ready) {
      ready(target);
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

      triggerInserted(skate, target);
    }
  }

  function triggerInserted(skate, target) {
    showElement(target);
    skate.elements.push(target);

    if (skate.component.inserted) {
      skate.component.inserted(target);
    }
  }


  var animationCount = 0;
  var animationEvents = ['animationstart', 'oAnimationStart', 'MSAnimationStart', 'webkitAnimationStart'];
  var animationNamePrefix = '__skate';
  var animationTriggers = {};
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


  function AnimationAdapter(selector) {
    this.index = null;
    this.name = null;
    this.selector = selector;
    hideElements(this.selector);
  }

  AnimationAdapter.prototype = {
    constructor: AnimationAdapter,

    listen: function(trigger) {
      // We have to keep track where this index exists so that it can unbind
      // itself at a later point if necessary.
      this.index = animationCount;

      // We must keep track of the name so that the trigger can be removed
      // from its mapping when deafened.
      this.name = animationNamePrefix + animationCount;

      // We have to keep track of the triggers so the global animation event
      // trigger knows which one to fire based on the animation name since
      // we have access to that on the event object.
      animationTriggers[this.name] = trigger;

      // We don't need any animation to happen, we only need the event to fire
      // so using opacity 1 for both to and from is ok.
      keyframeRules.sheet.insertRule('@' + animationCssPrefix + 'keyframes ' + this.name + '{from{opacity:1}to{opacity:1}}', this.index);

      // We trigger the animation for the shortest amount of time possible
      // to reduce any possible unwanted animations and to reduce resource
      // usage.
      animationRules.sheet.insertRule(this.selector + '{' + animationCssPrefix + 'animation:' + this.name + ' .01s}', this.index);

      // We must increment in order to
      ++animationCount;

      return this;
    },

    deafen: function() {
      keyframeRules.sheet.deleteRule(keyframeRules.sheet.cssRules.item(this.index));
      animationRules.sheet.deleteRule(animationRules.sheet.cssRules.item(this.index));

      delete animationTriggers[this.name];

      this.index = null;
      this.name = null;

      --animationCount;

      return this;
    }
  }


  function MutationEventAdapter(selector) {
    this.listener = null;
    this.selector = selector;
    hideElements(selector);
  }

  MutationEventAdapter.prototype = {
    constructor: MutationEventAdapter,

    listen: function(trigger) {
      var that = this;
      var existing = document.querySelectorAll(this.selector);

      // We must remember the listener in order to unbind it.
      this.listener = function(e) {
        if (e.target.msMatchesSelector(that.selector)) {
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


  function hideElements(selector) {
    var selectorParts = selector.split(',');
    var ensureHideRules = [
      'height: 0 !important',
      'width: 0 !important',
      'overflow: hidden !important',
      'margin: 0 !important',
      'padding: 0 !important'
    ];

    for (var a in selectorParts) {
      selectorParts[a] += ':not(.' + cssClassName + ')';
    }

    hiddenRules.sheet.insertRule(
      selectorParts.join(',')
        + '{'
        + ensureHideRules.join(';')
        + '}',
      hiddenRules.sheet.cssRules.length
    );
  }

  function showElement(element) {
    element.className += ' ' + cssClassName;
  }


  function setUpAnimationAdapter() {
    head.appendChild(keyframeRules);
    head.appendChild(animationRules);
    animationEvents.forEach(function(evt) {
      document.addEventListener(evt, function(e) {
        animationTriggers[e.animationName](e.target);
      }, false);
    });
  }


  var DetectedAdapter = (function() {
    return animationBrowserPrefix === false
      ? MutationEventAdapter
      : AnimationAdapter;
  }());


  if (DetectedAdapter === AnimationAdapter) {
    setUpAnimationAdapter();
  }


  head.appendChild(hiddenRules);


  if (typeof define === 'function' && define.amd) {
    define('skate', function() {
      return skate;
    });
  } else {
    window.skate = skate;
  }

})();
