const div = document.createElement('div');
const reqCustomElements = require.context('../node_modules/webcomponents.js/src/CustomElements/v1', true, /^.*\.js$/);
const reqNamedSlots = require.context('../node_modules/skatejs-named-slots/dist', true, /^.*\.js$/);
const reqTests = require.context('./unit', true, /^.*\.js$/);

if (!document.registerElement && !window.customElements) {
  reqCustomElements('./CustomElements.js');
}

if (!div.createShadowRoot && !div.attachShadow) {
  reqNamedSlots('./index.js');
}

require('./boot');
reqTests.keys().map(reqTests);

