/**
 * Heavily inspired by https://github.com/csuwildcat/SelectorListener.
 */
(function() {

  'use strict';

  var domPrefixes = [
    'khtml',
    'moz',
    'ms',
    'o',
    'webkit',
  ];

  function skate(selector) {
    return new Skate(selector);
  }


  function Skate(selector) {
    this.selector = selector;
    this.events = {
      ready: [],
      insert: [],
      remove: []
    };

    if (CssKeyframeAdapter.supported) {
      this.adapter = new CssKeyframeAdapter(this);
    } else {
      this.adapter = new MutationEventAdapter(this);
    }

    this.listen();
  }

  Skate.prototype = {
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

    trigger: function(evt, data) {
      this.events[evt].forEach(function(fn) {
        fn(data);
      });

      return this;
    }
  };


  function CssKeyframeAdapter(component) {
    ++CssKeyframeAdapter.count;
    this.events = {};
    this.listeners = {};
    this.selectors = {};
    abstractAdapter(this, component);
  }

  CssKeyframeAdapter.count = 0;
  CssKeyframeAdapter.head = document.getElementsByTagName('head')[0];
  CssKeyframeAdapter.keyframes = document.createElement('style');
  CssKeyframeAdapter.animations = document.createElement('style');
  CssKeyframeAdapter.events = ['animationstart', 'oAnimationStart', 'MSAnimationStart', 'webkitAnimationStart'];

  CssKeyframeAdapter.prefix = function() {
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
  };

  CssKeyframeAdapter.cssPrefix = function() {
    var prefix = CssKeyframeAdapter.prefix();
    return prefix ? '-' + prefix + '-' : '';
  };

  CssKeyframeAdapter.supported = function() {
    return typeof CssKeyframeAdapter.prefix() === 'string';
  };

  CssKeyframeAdapter.prototype = {
    constructor: CssKeyframeAdapter,

    listen: function() {
      var that = this;
      var ctor = this.constructor;
      var index = ctor.count - 1;
      var cssPrefix = ctor.cssPrefix();
      var animationName = '__skate' + ctor.count;
      var keyframeRule = '@'
        + cssPrefix
        + 'keyframes '
        + animationName
        + ' { from { opacity: 0; } to { opacity: 1; } }';
      var animationRule = this.component.selector
        + '{'
        + cssPrefix
        + 'animation:'
        + animationName
        + ' .01s;}';

      ctor.keyframes.sheet.insertRule(keyframeRule, index);
      ctor.animations.sheet.insertRule(animationRule, index);
      ctor.events.forEach(function(e) {
        document.addEventListener(e, that.triggerInsert, false);
      });

      return this;
    },

    deafen: function() {
      var that = this;
      var key = this.selectors[this.selector];
      var listener = this.listeners[key] || [];
      var index = listener.indexOf(handler);

      if (index > -1) {
        var event = this.events[key];
        --event.count;

        if (!event.count) {
          styles.sheet.deleteRule(styles.sheet.cssRules.item(event.rule));
          keyframes.removeChild(event.keyframe);

          delete this.events[key];
          delete this.selectors[selector];
        }

        --this.listeners.count;
        listener.splice(index, 1);

        if (!this.listeners.count) {
          this.constructor.events.forEach(function(name) {
            document.removeEventListener(name, that.triggerInsert, false);
          });
        }
      }

      return this;
    }
  }


  function MutationEventAdapter(component) {
    abstractAdapter(this, component);
  }

  MutationEventAdapter.prototype = {
    listen: function() {
      var existing = document.querySelectorAll(this.component.selector);

      // IE doesn't handle existing events correctly.
      for (var a = 0; a < existing.length; a++) {
        this.component.trigger('insert', (existing[a]));
      }

      document.addEventListener('DOMNodeInserted', function(e) {
        if (e.target.msMatchesSelector(this.component.selector)) {
          this.component.trigger('insert', e.target);
        }
      }, false);

      return this;
    },

    deafen: function() {
      return this;
    }
  };


  function abstractAdapter(adapter, component) {
    adapter.component = component;

    adapter.triggerReady = function(e) {
      return component.trigger('ready', e.target);
    };

    adapter.triggerInsert = function(e) {
      return component.trigger('insert', e.target);
    };

    adapter.triggerRemove = function(e) {
      return component.trigger('remove', e.target);
    };
  }


  if (CssKeyframeAdapter.supported) {
    CssKeyframeAdapter.keyframes.type = CssKeyframeAdapter.animations.type = 'text/css';
    CssKeyframeAdapter.head.appendChild(CssKeyframeAdapter.keyframes);
    CssKeyframeAdapter.head.appendChild(CssKeyframeAdapter.animations);
  }


  if (typeof define === 'function' && define.amd) {
    define('skate', function() {
      return skate;
    });
  } else {
    window.skate = skate;
  }

})();
