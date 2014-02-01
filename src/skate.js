/**
 * Heavily inspired by https://github.com/csuwildcat/SelectorListener.
 */
(function() {

  'use strict';

  var events = {};
  var selectors = {};
  var listeners = {};

  var styles = document.createElement('style');
  var keyframes = document.createElement('style');
  var head = document.getElementsByTagName('head')[0];

  var startNames = [
    'animationstart',
    'oAnimationStart',
    'MSAnimationStart',
    'webkitAnimationStart'
  ];

  var prefix = (function() {
      var duration = 'animation-duration: 0.01s;';
      var name = 'animation-name: SelectorListener !important;';
      var computed = window.getComputedStyle(document.documentElement, '');
      var pre = (Array.prototype.slice.call(computed).join('').match(/moz|webkit|ms/) || (computed.OLink === '' && ['o']))[0];

      return {
        css: '-' + pre + '-',
        properties: '{' + duration + name + '-' + pre + '-' + duration + '-' + pre + '-' + name + '}',
        keyframes: !!(window.CSSKeyframesRule || window[('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1] + 'CSSKeyframesRule'])
      };
    })();


  // Set up listener animations.
  styles.type = keyframes.type = 'text/css';
  head.appendChild(styles);
  head.appendChild(keyframes);


  // Initialises an element from listeners.
  function fireInitListeners(event) {
    event.selector = (events[event.animationName] || {}).selector;

    (listeners[event.animationName] || []).forEach(function(module) {
      module.init(event.target);
    });
  };


  // Alters the destroy method so that it also destroys the listener.
  function makeModuleDestroyAndDeafen(selector, module) {
    var oldDestroy = module.destroy;
    module.destroy = function() {
      oldDestroy();
      return skate.destroy(selector, module);
    };
    return module;
  }


  // Binds the specified module to the selected elements.
  function skate(selector, module) {
    var key = selectors[selector];
    var module = skate.module(module);

    makeModuleDestroyAndDeafen(selector, module);

    if (key) {
      ++events[key].count;
    } else {
      key = selectors[selector] = 'SelectorListener-' + new Date().getTime();
      let node = document.createTextNode('@'
        + (prefix.keyframes ? prefix.css : '')
        + 'keyframes '
        + key
        + ' { from { clip: rect(1px, auto, auto, auto); } to { clip: rect(0px, auto, auto, auto); } }'
      );

      keyframes.appendChild(node);
      styles.sheet.insertRule(selector + prefix.properties.replace(/SelectorListener/g, key), 0);

      events[key] = {
        count: 1,
        selector: selector,
        keyframe: node,
        rule: styles.sheet.cssRules[0]
      };
    }

    if (listeners.count) {
      ++listeners.count;
    } else {
      listeners.count = 1;

      startNames.forEach(function(name) {
        document.addEventListener(name, fireInitListeners, false);
      }, this);
    }

    (listeners[key] = listeners[key] || []).push(module);

    return module;
  };

  // Ensures a module implments a given interface.
  skate.module = function(module) {
    // A function passed in becomes the init method.
    if (typeof module === 'function') {
      module = {
        init: module
      };
    }

    // All modules should have a destroy method.
    if (!module.destroy) {
      module.destroy = function(){};
    }

    return module;
  };

  // Destroys the specified module for the given selector.
  skate.destroy = function(selector, module) {
    var key = selectors[selector];
    var listener = listeners[key] || [];
    var index = listener.indexOf(module);

    if (index > -1) {
      let event = events[selectors[selector]];
      --event.count;

      if (!event.count) {
        styles.sheet.deleteRule(styles.sheet.cssRules.item(event.rule));
        keyframes.removeChild(event.keyframe);

        delete events[key];
        delete selectors[selector];
      }

      --listeners.count;
      listener.splice(index, 1);

      if (!listeners.count) {
        startNames.forEach(function(name) {
          document.removeEventListener(name, fireInitListeners, false);
        }, this);
      }
    }

    return skate;
  };


  // Globals FTW!
  window.skate = skate;

})();