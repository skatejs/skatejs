const fs = require('fs');
const path = require('path');
const { expose } = require('./util');

// Emulate window global.
global.window = global;

// Expose all DOM interfaces.
fs.readdirSync(path.join(__dirname, 'dom'))
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
