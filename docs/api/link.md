# `link (elem, propSpec)`

The `link()` function returns a function that you can bind as an event listener. The handler will take the event and propagate the changes back to the host element. This essentially allows for 2-way data-binding, but is safer as the propagation of the user input value back to the component element will trigger a re-render, ensuring all dependent UI is up to date.

```js
/** @jsx h */

import { Component, h, link } from 'skatejs';

customElements.define('my-input', class extends Component {
  static get props () {
    return {
      value: { attribute: true }
    };
  }
  renderCallback () {
    return <input onChange={link(this)} type="text" />;
  }
});
```

By default the `propSpec` defaults to `e.currentTarget.getAttribute('name')` or `"value"` which is why it wasn't specified in the example above. In the example above, it would set `value` on the component. If you were to give your input a name, it would use the name from the event `currentTarget` as the name that should be set. For example if you changed your input to read:

```js
<input name="someValue" onChange={link(this)} type="text" />
```

Then instead of setting `value` on the component, it would set `someValue`.

You may explicitly set the property you would like to set by specifying a second argument to `link()`:

```js
link(this, 'someValue')
```

The above link would set `someValue` on the component.

You can also use dot-notation to reach into objects. If you do this, the top-most object will trigger a re-render of the component.

```js
link(this, 'obj.someValue')
```

In the above example, the `obj` property would trigger an update even though only the `someValue` sub-property was changed. This is so you don't have to worry about re-rendering.

You can even take this a step further and specify a sub-object to modify using the name of the `currentTarget` (or `value`, of course) if `propSpec` ends with a `.`. For example:

```js
<input name="someValue" onChange={link(this, 'obj.')} type="text" />
```

The above example would set `obj.someValue` because the name of the input was `someValue`. This doesn't look much different from the previous example, but this allows you to create a single link handler for use with multiple inputs:

```js
const linkage = link(this, 'obj.');

<input name="someValue1" onChange={linkage} type="text" />
<input name="someValue2" onChange={linkage} type="checkbox" />
<input name="someValue3" onChange={linkage} type="radio" />
<select name="someValue4" onChange={linkage}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

The above linkage would set:

- `obj.someValue1`
- `obj.someValue2`
- `obj.someValue3`
- `obj.someValue4`
