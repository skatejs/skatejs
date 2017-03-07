# `prop`

Skate has some built-in property definitions to help you with defining consistent property behaviour within your components.

By default, all built-in props are have one-way reflection with their corresponding attribute. This ensures that you get three things out of the box:

- A consistent API for your consumers because they can still use HTML attributes if necessary to update the components.
- Less friction for the developer because they don't need to think about the `attribute` API, unless they need special behaviour.
- Good performance. You should always be setting `props` when possible which doesn't inherently affect performance because there's no round trip back to the attribute.

```js
import { Component, prop } from 'skatejs';

export default class extends Component {
  static get props () {
    return {
      myArray: prop.array,
      myBoolean: prop.boolean
    };
  }
}
```


## `array`

The `array` property ensures that any value passed to the property is an array. Serialisation and deserialisation happen using `JSON.stringify()` and `JSON.parse()`, respectively, if the property is linked to an attribute.

*The `default` value is a shared, frozen `array`, so it's immutable.*


## `boolean`

The `boolean` property allows you to define a property that should *always* have a boolean value to mirror the behaviour of boolean properties / attributes in HTML. By default it is `false`. If an empty value is passed, then the value is `false`. If a boolean property is linked to an attribute, the attribute will have no value and its presence indicates whether or not it is `true` (present) or `false` (absent).


## `number`

Ensures the value is a `Number` and is correctly linked to an attribute. Numeric string values such as `'10'` will be converted to a `Number`. Non-numeric string values will be converted to `undefined`. The value will default to `0` if an empty value is passed.


## `object`

Ensures the value is always an object literal and that it serialises / deserialises properly when linked to an attribute.

*The `default` value is a shared, frozen `object`, so it's immutable.*


## `string`

Ensures the value is always a `String` and is correctly linked to an attribute. Empty values are not coerced to strings.

*All built in properties normalise empty property values such as `null` or `undefined` to be `null`.*


## Custom properties

Custom properties can be defined by simply passing an object definition.

```js
const myProps = {
  customProp: {}
};
```

If you're defining a property that can be anything, you can also pass an empty value such as `null`:

```js
const myProps = {
  customProp: null
}
```

If you want to customise the behaviour of a built-in, you can do something like:

```js
const myProps = {
  customProp: Object.assign({}, prop.array, {
    deserialize () {}
  });
};
```

A simpler way of doing this, if you're using object spread, is to do something like:

```js
const myProps = {
  customProp: {
    ...prop.array,
    ...{ deserialize () {} }
  }
}
```

This has the added benefit of not accidentally causing a mutation of the source prop, if it's not frozen.

*All built-in props are frozen, so they can't be mutated. However, if you create custom properties, they can be mutated unless you freeze them.*
