# element-snabbdom

> SkateJS renderer for [Snabbdom](https://github.com/snabbdom/snabbdom)

## Install

```sh
npm i @skatejs/element-snabbdom snabbdom
```

## Usage

```js
import Component from '@skatejs/element-snabbdom';
import h from 'snabbdom/h';

class Hello extends Component {
  static modules = [
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/eventlisteners').default,
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/style').default,
    require('snabbdom/modules/dataset').default
  ];
  static props = {
    name: String
  };
  render() {
    return h('div', `Hello, ${this.name}!`);
  }
}

customElements.define('x-hello', Hello);
```

It's possible to use JSX via [snabbdom-pragma](https://github.com/Swizz/snabbdom-pragma)
