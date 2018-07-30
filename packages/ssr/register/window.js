const { CustomElementRegistry } = require('./CustomElementRegistry');
const { Element } = require('./Element');
const { History } = require('./History');
const { Location } = require('./Location');
const { Navigator } = require('./Navigator');

const ElPr = Element.prototype;

// Copy current window globals over to the main global before we overwrite
// window with global, making mutations to either happen on both.
Object.getOwnPropertyNames(window).forEach(name => {
  global[name] = window[name];
});

// We must do this in order to make mutations to ether affect the other.
window = global;

// Order dependent.
window.location = new Location();
window.history = new History();

// Not order dependent.
window.__handlers = {};
window.addEventListener = ElPr.addEventListener.bind(window);
window.cancelAnimationFrame = id => clearTimeout(id);
window.customElements = new CustomElementRegistry();
window.dispatchEvent = ElPr.dispatchEvent.bind(window);
window.navigator = new Navigator();
window.removeEventListener = ElPr.removeEventListener.bind(window);
window.requestAnimationFrame = fn => setTimeout(fn);
window.scrollTo = () => {};
