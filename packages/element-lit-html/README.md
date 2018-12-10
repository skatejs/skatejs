# element-lit-html

SkateJS renderer for [LitHTML](https://github.com/PolymerLabs/lit-html).

## Install

```sh
npm i @skatejs/element-lit-html lit-html
```

## Usage

```js
import Element, { h } from '@skatejs/element-lit-html';

class Hello extends Element {
  render() {
    return h`Hello, <slot></slot>!`;
  }
}

customElements.define('x-hello', Hello);
```

```html
<x-hello>World</x-hello>
```
