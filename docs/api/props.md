# `props (elem[, props])`

The `props` function is a getter or setter depending on if you specify the second argument. If you do not provide `props`, then the current state of the component is returned. If you pass `props`, then the current state of the component is set. When you set state, the component will re-render synchronously only if it needs to be re-rendered.

Component state is derived from the declared properties. It will only ever return properties that are defined in the `props` object. However, when you set state, whatever state you specify will be set even if they're not declared in `props`.

```js
import { Component, define, props } from 'skatejs';

class Elem extends Component {
  static get props () {
    return {
      prop1: {}
    };
  }
}
customElements.define('my-element', Elem);
const elem = new Elem();

// Set any property you want.
props(elem, {
  prop1: 'value 1',
  prop2: 'value 2'
});

// Only returns props you've defined on your component.
// { prop1: 'value 1' }
props(elem);
```
