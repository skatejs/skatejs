const { createElement: h } = require('React');
const { renderToString } = require('react-dom/server');
const Shadow = require('.');

const Hello = ({ children }) =>
  h('div', {
    children: h('sk-shadow', {
      children: ['Hello, ', h('slot', { children }), '!']
    })
  });

const App = () => h(Hello, { children: 'World' });

const str = renderToString(h(App));

// <div data-reactroot=""><sk-shadow>Hello, <slot>World</slot>!</sk-shadow></div>
console.log(str);
