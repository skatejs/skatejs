# Component composition/extending

Since Skate is already close to the platform, you can easily extend other component classes via:

- [Inheritance](#inheritance)
- [Mixins](#mixins)

## Inheritance

```js
/** @jsx h */

import { Component, h, propString } from 'skatejs';

// If you never use this class for an HTML element then you don't have to
// ever register it as a custom element and it can still be extended.
class BaseComponent extends Component {
  static props = {
    someBaseProp: propString
  }
}

class SuperComponent extends BaseComponent {
  renderCallback ({ someBaseProp }) {
    return <div>{someBaseProp}</div>;
  }
}

customElements.define('super-component', SuperComponent);
```

### Extending Props API via inheritance

Let's say you want to inherit from some component which already defines some common `props`.

```js
/** @jsx h */

import { Component, h, propBoolean, propString } from 'skatejs';

// Some common component.
class Colors extends Component {
  static get props () {
    return {
      color: propString
    }
  }
}

// Your component which will have color and disabled as props.
class Button extends Colors {
  static get props () {
    return {
      // The color prop comes from the super class.
      ...super.props,
      // The disabled prop comes from this class.
      ...{ disabled: propBoolean }
    }
  }
  renderCallback ({ color, disabled }) {
    return <button disabled={disabled} style={{ color }}><slot /></button>
  }
}
```


## Mixins

> Learn more at [real-mixins-with-javascript-classes](justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)

```js
/** @jsx h */

import { Component, h, propString } from 'skatejs';

// We can define some common behaviour via our mixin.
function BaseBehaviour (Base = HTMLElement) {
  return class extends Base {
    static props = {
      someBaseProp: propString
    }
  }
}

class SuperComponent extends BaseBehaviour(Component) {
  renderCallback ({ someBaseProp }) {
    return <div>{someBaseProp}</div>;
  }
}

customElements.define('super-component', SuperComponent);
```


### Extending Props API via mixin

```js
/** @jsx h */

import { Component, h, propBoolean, propString } from 'skatejs';

// some common mixin factory
function Colored (Base) {
  return class extends Base {
    static get props () {
      return {
        // Mixins are composable, so we have to make sure that the apply chain
        // will always continue.
        ...super.props,
        // Our mixin specific props api definition.
        ...{ color: propString }
      }
    }
  }
}

// Your component which will have color and disabled as props.
class Button extends Colored (Component) {
  static get props () {
    return {
      // Inherit from any mixin application so both mixed and our props will
      // be applied.
      ...super.props,
      // Your component specific props API.
      ...{ disabled: propBoolean }
    }
  }
  renderCallback ({ color }) {
    return <button style={{ color }}>Hello</button>;
  }
}

customElements.define('x-button', Button);
```
