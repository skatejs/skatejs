# element-preact

SkateJS renderer for [Preact](https://preactjs.com/).

## Install

```sh
npm i @skatejs/element-preact preact
```

## Usage

```js
import Element, { h } from '@skatejs/element-preact';

class Hello extends Element {
  render() {
    return (
      <span>
        Hello, <slot />!
      </span>
    );
  }
}

customElements.define('x-hello', Hello);
```

```html
<x-hello>World</x-hello>
```
