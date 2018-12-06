const fs = require('fs');
const path = require('path');
const { expose } = require('./util');

// Copy current window globals over to the main global before we overwrite
// window with global, making mutations to either happen on both.
Object.getOwnPropertyNames(window).forEach(name => {
  global[name] = window[name];
});

// We must do this in order to make mutations to ether affect the other.
window = global;

// Expose all DOM interfaces.
fs
  .readdirSync(path.join(__dirname, 'dom'))
  .filter(file => file.indexOf('.') > -1)
  .forEach(file => {
    expose(file.replace('.js', ''), require(path.join(__dirname, 'dom', file)));
  });

// Order dependent.
window.location = new Location();
window.history = new History();

// Not order dependent.
window.__handlers = {};
window.addEventListener = Element.prototype.addEventListener.bind(window);
window.cancelAnimationFrame = id => clearTimeout(id);
window.customElements = new CustomElementRegistry();
window.dispatchEvent = Element.prototype.dispatchEvent.bind(window);
window.navigator = new Navigator();
window.removeEventListener = Element.prototype.removeEventListener.bind(window);
window.requestAnimationFrame = fn => setTimeout(fn);
window.scrollTo = () => {};
