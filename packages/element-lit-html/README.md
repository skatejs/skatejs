# element-lit-html

SkateJS renderer for [LitHTML](https://github.com/PolymerLabs/lit-html).

## Install

```sh
npm i @skatejs/element-lit-html lit-html
```

## Usage

```js
import Component from '@skatejs/element-lit-html';
import { html } from 'lit-html';

class Hello extends Component {
  render() {
    return html`Hello, <slot></slot>!`;
  }
}

customElements.define('x-hello', Hello);
```

```html
<x-hello>World</x-hello>
```
