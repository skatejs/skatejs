# Component composition/extending

Since Skate is already close to the platform, you can easily extend other component classes via:

- [Inheritance](#inheritance)
- [Mixins](#mixins)

## Inheritance

```js
import { Component, h } from 'skatejs';

// If you never use this class for an HTML element then you don't have to
// ever register it as a custom element and it can still be extended.
class BaseComponent extends Component {
  static props = {
    someBaseProp: {}
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
// some common component
class Colors extends Component {
  static get props () {
    return {
      color: prop.string()
    }
  }
}

// your component which will have color and disabled as props
class Button extends Colors {
  static get props () {
    return {
        // inherit from super class
      ...super.props,
      // your component specific props API
      ...{
        disabled: prop.boolean()
      }
    }
  }
  renderCallback ({color}) {
    return <button style={{color}}>Hello</button>
  }
}
```


## Mixins

> Learn more at [real-mixins-with-javascript-classes](justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)

```js
import { Component, h } from 'skatejs';

// we can define some common behaviour via our mixin
function BaseBehaviour( Base ){
  return class extends Base {
    static props = {
      someBaseProp: {}
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
import { Component, h, prop } from 'skatejs';

// some common mixin factory
function Colored(Base) {
  return class extends Base {
    static get props () {
      return {
        // mixins are composable, so we have to make sure that the apply chain will always continue
        ...super.props,
        // our mixin specific props api definition
        ...{color: prop.string()}
      }
    }
  }
}


// your component which will have color and disabled as props
class Button extends Colors(Component) {
  static get props () {
    return {
      // inherit from any mixin application so both mixed and our props will be applied
      ...super.props,
      // your component specific props API
      ...{
        disabled: prop.boolean()
      }
    }
  }
  renderCallback ({color}) {
    return <button style={{color}}>Hello</button>
  }
}

customElements.define('x-button', Button);
```
