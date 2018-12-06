# element-snabbdom

> SkateJS renderer for [Snabbdom](https://github.com/snabbdom/snabbdom)

## Install

```sh
npm i @skatejs/element-snabbdom snabbdom
```

## Usage

```js
import Element, { h } from '@skatejs/element-snabbdom';

class Hello extends Element {
  static modules = [
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/eventlisteners').default,
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/style').default,
    require('snabbdom/modules/dataset').default
  ];
  render() {
    return h('div', `Hello, `, h('slot'), '!');
  }
}

customElements.define('x-hello', Hello);
```

It's possible to use JSX via [snabbdom-pragma](https://github.com/Swizz/snabbdom-pragma).
