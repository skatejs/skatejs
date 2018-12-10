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

const { expose } = require('./util');

// Startup.
require('./window');
const Document = require('./dom/Document');

// window.document.
expose('document', new Document());

// Fast-track this since we're in node.
document.readyState = 'interactive';
document.dispatchEvent(new Event('DOMContentLoaded'));
document.readyState = 'complete';

dispatchEvent(new Event('load'));
