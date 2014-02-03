(function(global) {
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
    var name = 'animation-name: skate !important;';
    var computed = window.getComputedStyle(document.documentElement, '');
    var pre = (Array.prototype.slice.call(computed).join('').match(/moz|webkit|ms/) || (computed.OLink === '' && ['o']))[0];
    return {
      css: '-' + pre + '-',
      properties: '{' + duration + name + '-' + pre + '-' + duration + '-' + pre + '-' + name + '}',
      keyframes: !!(window.CSSKeyframesRule || window[('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1] + 'CSSKeyframesRule'])
    };
  })();
  var supportsAnimation = (function() {
    var animationstring = 'animation';
    var domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
    var body = document.documentElement;
    var keyframeprefix = '';
    var prefix = '';
    if (body.style.animationName !== undefined) {
      return true;
    }
    for (var i = 0; i < domPrefixes.length; i++) {
      if (body.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
        prefix = domPrefixes[i];
        animationstring = prefix + 'Animation';
        keyframeprefix = '-' + prefix.toLowerCase() + '-';
        return true;
      }
    }
  })();
  if (supportsAnimation) {
    styles.type = keyframes.type = 'text/css';
    head.appendChild(styles);
    head.appendChild(keyframes);
  }
  function fireInitListeners(event) {
    event.selector = (events[event.animationName] || {}).selector;
    (listeners[event.animationName] || []).forEach(function(component) {
      component.init(event.target);
    });
  }
  ;
  function useCssKeyframes(selector, component) {
    var key = selectors[selector];
    if (key) {
      ++events[key].count;
    } else {
      try {
        throw undefined;
      } catch (node) {
        key = selectors[selector] = 'skate-' + keyframes.childNodes.length;
        node = document.createTextNode('@' + (prefix.keyframes ? prefix.css: '') + 'keyframes ' + key + ' { from { clip: rect(1px, auto, auto, auto); } to { clip: rect(0px, auto, auto, auto); } }');
        keyframes.appendChild(node);
        styles.sheet.insertRule(selector + prefix.properties.replace(/skate/g, key), 0);
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
    (listeners[key] = listeners[key] || []).push(component);
  }
  function useDeprecatedMutationEvents(selector, component) {
    var existing = document.querySelectorAll(selector);
    for (var a = 0; a < existing.length; a++) {
      component.init(existing[a]);
    }
    document.addEventListener('DOMNodeInserted', function(e) {
      component.init(e.target);
    }, false);
  }
  function makeComponent(selector, component) {
    if (typeof component === 'function') {
      component = {init: component};
    }
    if (!component.destroy) {
      component.destroy = function() {};
    }
    component.elements = function() {
      return Array.prototype.slice.call(document.querySelectorAll(selector) || []);
    };
    var oldDestroy = component.destroy;
    component.destroy = function() {
      oldDestroy();
      destroyBoundComponent(selector, component);
      return this;
    };
    return component;
  }
  ;
  function destroyBoundComponent(selector, component) {
    var key = selectors[selector];
    var listener = listeners[key] || [];
    var index = listener.indexOf(component);
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
  }
  ;
  global.skate = function(selector, component) {
    var component = makeComponent(selector, component);
    if (supportsAnimation) {
      useCssKeyframes(selector, component);
    } else {
      useDeprecatedMutationEvents(selector, component);
    }
    return component;
  };
})(window);
