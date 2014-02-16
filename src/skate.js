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
    this.component = component;
    this.events = {};
    this.listeners = {};
    this.selectors = {};
  }

  CssKeyframeAdapter.instances = [];
  CssKeyframeAdapter.id = '__skate';
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

  CssKeyframeAdapter.setup = function() {
    var head = document.getElementsByTagName('head')[0];

    CssKeyframeAdapter.animations.type = CssKeyframeAdapter.keyframes.type = 'text/css';
    head.appendChild(CssKeyframeAdapter.keyframes);
    head.appendChild(CssKeyframeAdapter.animations);
    CssKeyframeAdapter.events.forEach(function(evt) {
      document.addEventListener(evt, CssKeyframeAdapter.handler, false);
    });
  };

  CssKeyframeAdapter.handler = function(e) {
    var index = e.animationName.replace(CssKeyframeAdapter.id, '');
    CssKeyframeAdapter.instances[index].component.trigger('insert', e.target);
  };

  CssKeyframeAdapter.prototype = {
    constructor: CssKeyframeAdapter,

    listen: function() {
      CssKeyframeAdapter.instances.push(this);

      var index = CssKeyframeAdapter.instances.indexOf(this);
      var name = this.constructor.id + index;
      var prefix = this.constructor.cssPrefix();


      this.constructor.keyframes.sheet.insertRule('@' + prefix + 'keyframes ' + name + '{from{opacity:0;}to{opacity:1;}}', index);
      this.constructor.animations.sheet.insertRule(this.component.selector + '{' + prefix + 'animation:' + name + ' .01s;}', index);

      return this;
    },

    deafen: function() {
      var index = CssKeyframeAdapter.instances.indexOf(this);

      CssKeyframeAdapter.splice(index, 1);
      this.constructor.keyframes.sheet.deleteRule(this.constructor.keyframes.sheet.cssRules.item(index));
      this.constructor.animations.sheet.deleteRule(this.constructor.animations.sheet.cssRules.item(index));

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


  if (CssKeyframeAdapter.supported()) {
    CssKeyframeAdapter.setup();
  }


  if (typeof define === 'function' && define.amd) {
    define('skate', function() {
      return skate;
    });
  } else {
    window.skate = skate;
  }

})();
