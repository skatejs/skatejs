(function() {
  'use strict';
  var events = {};
  var selectors = {};
  var listeners = {};
  var styles = document.createElement('style');
  var keyframes = document.createElement('style');
  var head = document.getElementsByTagName('head')[0];
  var startNames = ['animationstart', 'oAnimationStart', 'MSAnimationStart', 'webkitAnimationStart'];
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
  styles.type = keyframes.type = 'text/css';
  head.appendChild(styles);
  head.appendChild(keyframes);
  function fireInitListeners(event) {
    event.selector = (events[event.animationName] || {}).selector;
    (listeners[event.animationName] || []).forEach(function(module) {
      module.init(event.target);
    });
  }
  ;
  function makeModuleDestroyAndDeafen(selector, module) {
    var oldDestroy = module.destroy;
    module.destroy = function() {
      oldDestroy();
      return skate.destroy(selector, module);
    };
    return module;
  }
  function skate(selector, module) {
    var key = selectors[selector];
    var module = skate.module (module);
    makeModuleDestroyAndDeafen(selector, module);
    if (key) {
      ++events[key].count;
    } else {
      try {
        throw undefined;
      } catch (node) {
        key = selectors[selector] = 'SelectorListener-' + new Date().getTime();
        node = document.createTextNode('@' + (prefix.keyframes ? prefix.css: '') + 'keyframes ' + key + ' { from { clip: rect(1px, auto, auto, auto); } to { clip: rect(0px, auto, auto, auto); } }');
        keyframes.appendChild(node);
        styles.sheet.insertRule(selector + prefix.properties.replace(/SelectorListener/g, key), 0);
        events[key] = {
          count: 1,
          selector: selector,
          keyframe: node,
          rule: styles.sheet.cssRules[0]
        };
      }
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
  }
  ;
  skate.module = function(module) {
    if (typeof module === 'function') {
      module = {init: module};
    }
    if (!module.destroy) {
      module.destroy = function() {};
    }
    return module;
  };
  skate.destroy = function(selector, module) {
    var key = selectors[selector];
    var listener = listeners[key] || [];
    var index = listener.indexOf(module);
    if (index > - 1) {
      try {
        throw undefined;
      } catch (event) {
        event = events[selectors[selector]];
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
    }
    return skate;
  };
  window.skate = skate;
})();
