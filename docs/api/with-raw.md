# `withRaw (Base = HTMLElement)`

The `Raw` mixin is a mixin that simply defines defaults for the native custom elements API. It ensures that callbacks are noops and that `observedAttributes` defaults to an empty array. This is convenient because it means that you can extend it and consumers don't have to do any checks to see if a `super` method is defined before calling it, or accessing the property and operating on it.

```js
import { withRaw } from 'skatejs';

class MyComponent extends withRaw() {
  connectedCallback () {
    super.connectedCallback();
  }
}
```
