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
  var keyframes = document.createElement('style');
  var animations = document.createElement('style');


  function skate(selector, component) {
    return new Skate(selector, component);
  }


  function Skate(selector, component) {
    this.adapter = new DetectedAdapter(this);
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
      this.events[evt].push(fn);
      return this;
    },

    off: function(evt, fn) {
      if (fn) {
        this.events[evt].splice(this.events[evt].indexOf(fn), 1);
      } else {
        this.events[evt] = [];
      }

      return this;
    },

    listen: function() {
      this.adapter.listen();
      return this;
    },

    deafen: function() {
      this.adapter.deafen();
      return this;
    },

    trigger: function(evt, element) {
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

      var index = instances.indexOf(this);
      var name = animationNamePrefix + index;
      var prefix = '-' + animationBrowserPrefix + '-';

      // We don't need any animation to happen, we only need the event to fire.
      keyframes.sheet.insertRule('@' + prefix + 'keyframes ' + name + '{from{opacity:1}to{opacity:1}}', index);
      animations.sheet.insertRule(this.skate.selector + '{' + prefix + 'animation:' + name + ' .01s}', index);

      // Initially hide all elements.
      var selectorParts = this.skate.selector.split(',');
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

      animations.sheet.insertRule(
        selectorParts.join(',')
          + '{'
          + ensureHideRules.join(';')
          + '}',
        index
      );

      return this;
    },

    deafen: function() {
      var index = instances.indexOf(this);

      if (index !== -1) {
        instances.splice(index, 1);
        keyframes.sheet.deleteRule(keyframes.sheet.cssRules.item(index));
        animations.sheet.deleteRule(animations.sheet.cssRules.item(index));
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
    animations.type = keyframes.type = 'text/css';

    head.appendChild(keyframes);
    head.appendChild(animations);

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
        this.skate.trigger('ready', existing[a]);
        this.skate.trigger('insert', existing[a]);
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


  var DetectedAdapter = (function() {
    return animationBrowserPrefix
      ? AnimationAdapter
      : MutationEventAdapter;
  }());


  if (DetectedAdapter === AnimationAdapter) {
    setUpAnimationAdapter();
  }


  if (typeof define === 'function' && define.amd) {
    define('skate', function() {
      return skate;
    });
  } else {
    window.skate = skate;
  }

})();
