# element-react

SkateJS renderer for [React](https://reactjs.org/).

## Install

```sh
npm i @skatejs/element-react react react-dom
```

## Usage

```js
import Element, { h } from '@skatejs/element-react';

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
