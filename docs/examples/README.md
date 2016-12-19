## Examples

The following are some simple examples to get you started with Skate.

- [Counter](#counter)

---

### Counter

The following is a simple counter that increments the count for every second that passes.

```js
const sym = Symbol();

customElements.define('x-counter', class extends skate.Component {
  static get props () {
    return {
      // By declaring the property an attribute, we can now pass an initial value
      // for the count as part of the HTML.
      count: skate.prop.number({ attribute: true })
    };
  }
  connectedCallback () {
    // Ensure we call the parent.
    super.connectedCallback();

    // We use a symbol so we don't pollute the element's namespace.
    this[sym] = setInterval(() => ++this.count, 1000);
  }
  disconnectedCallback () {
    // Ensure we callback the parent.
    super.disconnectedCallback();

    // If we didn't clean up after ourselves, we'd continue to render
    // unnecessarily.
    clearInterval(this[sym]);
  }
  renderCallback () {
    // By separating the strings (and not using template literals or string
    // concatenation) it ensures the strings are diffed indepenedently. If
    // you select "Count" with your mouse, it will not deselect whenr endered.
    return skate.h('div', 'Count ', this.count);
  }
});
```

To use this, all you'd need to do in your HTML somewhere is:

```html
<x-counter count="1"></x-counter>
```

**Live Example:**

[Live Example](https://jsfiddle.net/hotell/L1otg3Lb/)
