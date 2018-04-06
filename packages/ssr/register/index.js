// We patch this so Undom can't make any unconfigurable props.
const { defineProperty, defineProperties } = Object;
Object.defineProperty = function(obj, key, def) {
  def.configurable = true;
  return defineProperty.call(Object, obj, key, def);
};
Object.defineProperties = function(obj, def) {
  Object.keys(def).forEach(key => (def[key].configurable = true));
  return defineProperties.call(Object, obj, def);
};

// We require the base Undom implementation first so we can use any interfaces
// it's already exposed.
require('undom/register');

const { prop } = require('./util');

// We can now require our stuff.
const { Event } = require('./Event');
const { expose } = require('./util');

// Globals.
require('./window');
require('./document');

// Custom interfaces.
expose('ClassList');
expose('Comment');
expose('CSSStyleSheet');
expose('CustomElementRegistry');
expose('CustomEvent');
expose('DocumentFragment');
expose('Element');
expose('Event');
expose('History');
expose('HTMLElement');
expose('Location');
expose('MouseEvent');
expose('MutationObserver');
expose('MutationRecord');
expose('Navigator');
expose('Node');
expose('NodeFilter');
expose('StyleSheet');
expose('Worker');

Object.defineProperty = defineProperty
Object.defineProperties = defineProperties

// Startup.
document.readyState = 'interactive';
document.dispatchEvent(new Event('DOMContentLoaded'));
document.readyState = 'complete';
dispatchEvent(new Event('load'));
