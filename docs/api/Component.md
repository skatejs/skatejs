# Component

The component class is a base class that extends from `HTMLElement`. If you want to specify the base class for this, have a look at the [`withComponent` mixin](with-component.md#component-base--render).

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation. Most components will extend the standard `Component` base class.

```js
/** @jsx h */

import { Component, h } from 'skatejs';

class Greeting extends Component {
  renderCallback () {
    return <div>Hello, World!</div>;
  }
}

customElements.define('x-greeting', Greeting);
```

## The Component Lifecycle

The lifecycle members for the `Component` base class is a consolidation of all the mixins (functions prefixed with `when*`. If you only need a subset of these, then you might be better of using them directly. This base class is merely convenience for the most common scenarios.

*An asterisk denotes a Skate-specific API member. Non-asterisked members are native to the platform.*

### Mounting

- [`constructor()`](#constructor)
- [`connectedCallback()`](#connectedcallback)

### Updating

- [`attributeChangedCallback()`](#attributechangedcallback)
- [`propsSetCallback()`](#propsSetCallback) *
- [`propsUpdatedCallback()`](#propsUpdatedCallback) *
- [`propsChangedCallback()`](#propsChangedCallback) *
- [`renderCallback()`](#rendercallback) *
- [`rendererCallback()`](#rendererCallback) *
- [`renderedCallback()`](#renderedcallback) *

### Unmounting

- [`disconnectedCallback()`](#disconnectedcallback---supersedes-static-detached)

### Custom APIs

Just like any object prototype, this is how you add custom imperative APIs to your component.

- [`prototype`](#prototype)

### `static` Class Properties

- [`is`](#static-is) *
- [`props`](#static-props) *
- [`observedAttributes`](#static-observedattributes)
