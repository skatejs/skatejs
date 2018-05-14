# skatejs/renderer-snabbdom

> SkateJS renderer for [Snabbdom](https://github.com/snabbdom/snabbdom)

## Install

```sh
npm install @skatejs/renderer-snabbdom snabbdom skatejs
```

## Usage

`skatejs/renderer-snabbdom` exports a factory function that creates a renderer mixin. It accepts as argument an array
of snabbdom modules

```js
import { props, withComponent } from 'skatejs';
import createRenderer from '@skatejs/renderer-snabbdom';
import h from 'snabbdom/h';

// configure the renderer with the required modules
const withSnabbdom = createRenderer([
  require('snabbdom/modules/attributes').default,
  require('snabbdom/modules/eventlisteners').default,
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/dataset').default
]);

class WcHello extends withComponent(withSnabbdom()) {
  static props = {
    name: props.string
  };
  render({ name }) {
    return h('div', `Hello, ${name}!`);
  }
}

customElements.define('wc-hello', WcHello);
```

It's possible to use JSX syntax through [Snabbdom-pragma](https://github.com/Swizz/snabbdom-pragma)
