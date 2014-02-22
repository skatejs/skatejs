(function() {

  'use strict';

  var isSetup = false;
  var domPrefixes = [
    'khtml',
    'moz',
    'ms',
    'o',
    'webkit',
  ];


  var head = document.getElementsByTagName('head')[0];


  function skate(selector, component) {
    return new Skate(selector, component);
  }


  function Skate(selector, component) {
    this.selector = selector;
    this.events = {
      ready: [],
      insert: [],
      remove: []
    };

    if (CssKeyframeAdapter.supported()) {
      this.adapter = new CssKeyframeAdapter(this);
    } else {
      this.adapter = new MutationEventAdapter(this);
    }

    if (!isSetup) {
      isSetup = true;
      this.adapter.constructor.setup();
    }

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

    trigger: function(evt, element, done) {
      this.events[evt].forEach(function(fn) {
        fn(element, done || function(){});
      });

      return this;
    }
  };


  function CssKeyframeAdapter(skate) {
    this.skate = skate;
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
    CssKeyframeAdapter.animations.type = CssKeyframeAdapter.keyframes.type = 'text/css';

    head.appendChild(CssKeyframeAdapter.keyframes);
    head.appendChild(CssKeyframeAdapter.animations);

    CssKeyframeAdapter.events.forEach(function(evt) {
      document.addEventListener(evt, CssKeyframeAdapter.handler, false);
    });
  };

  CssKeyframeAdapter.handler = function(e) {
    triggerReadyAndInsert(
      CssKeyframeAdapter.instances[e.animationName.replace(CssKeyframeAdapter.id, '')],
      e.target
    );
  };

  CssKeyframeAdapter.prototype = {
    constructor: CssKeyframeAdapter,

    listen: function() {
      CssKeyframeAdapter.instances.push(this);

      var index = CssKeyframeAdapter.instances.indexOf(this);
      var name = this.constructor.id + index;
      var prefix = this.constructor.cssPrefix();

      this.constructor.keyframes.sheet.insertRule('@' + prefix + 'keyframes ' + name + '{from{opacity:1}to{opacity:1}}', index);
      this.constructor.animations.sheet.insertRule(this.skate.selector + '{' + prefix + 'animation:' + name + ' .01s}', index);

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


  function MutationEventAdapter(skate) {
    this.skate = skate;
  }

  MutationEventAdapter.setup = function() {

  };

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
    var parent = target.parentNode;
    var placeholder = document.createComment('');

    if (triggeredNodes.indexOf(target) !== -1) {
      return;
    }

    triggeredNodes.push(target);
    parent.insertBefore(placeholder, target);
    parent.removeChild(target);

    adapter.skate.trigger('ready', target, function(newTarget) {
      parent.insertBefore(newTarget || target, placeholder);
      adapter.skate.trigger('insert', target);
      parent.removeChild(placeholder);
    });
  }


  if (typeof define === 'function' && define.amd) {
    define('skate', function() {
      return skate;
    });
  } else {
    window.skate = skate;
  }

})();
