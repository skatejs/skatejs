const render = require('../node');
const skate = require('../lib');

skate('x-hello', {
  properties: {
    innerHTML: null,
    textContent: null
  },
  render (elem) {
    return `Hello, <x-text yell>${elem.textContent}</x-text>!`;
  }
});

skate('x-text', {
  properties: {
    textContent: null,
    yell: skate.property.boolean({ attribute: true })
  },
  render (elem) {
    return `<span>${elem.yell ? elem.textContent.toUpperCase() : elem.textContent}</span>`;
  }
});

/* eslint no-console: 0 */
console.log(render('<x-hello>World</x-hello>'));
