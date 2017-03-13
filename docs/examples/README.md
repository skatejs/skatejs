## Examples

The following are some simple examples to get you started with Skate.

- [Counter](#counter)

---

### Counter

The following is a simple counter that increments the count for every second that passes.

```js
/** @jsx h */

import { Component, h, prop } from 'skatejs';

const sym = Symbol();

customElements.define('x-counter', class extends Component {
  static get props () {
    return {
      count: prop.number
    };
  }
  connectedCallback () {
    super.connectedCallback();
    this[sym] = setInterval(() => ++this.count, 1000);
  }
  disconnectedCallback () {
    super.disconnectedCallback();
    clearInterval(this[sym]);
  }
  renderCallback ({ count }) {
    return <div>Count {count}</div>;
  }
});
```

To use this, all you'd need to do in your HTML somewhere is:

```html
<x-counter count="1"></x-counter>
```

**Live Example:**

[Live Example](https://jsfiddle.net/hotell/L1otg3Lb/)
