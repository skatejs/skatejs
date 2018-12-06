# element-hyperhtml

SkateJS renderer for [HyperHTML](https://github.com/WebReflection/hyperHTML).

## Install

```sh
npm install @skatejs/element-hyperhtml hyperhtml
```

## Usage

```js
import Component from '@skatejs/element-hyperhtml';

class Hello extends Component {
  render(html) {
    return html`Hello, <slot />!`;
  }
}

customElements.define('x-hello', Hello);
```

```html
<x-hello>World</x-hello>
```
