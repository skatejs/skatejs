# `prop`

Skate has some built-in property definitions to help you with defining consistent property behaviour within your components. All built-in properties are functions that return a property definition.

By default, all built-in props are have one-way reflection with their corresponding attribute. This ensures that you get three things out of the box:

- A consistent API for your consumers because they can still use HTML attributes if necessary to update the components.
- Less friction for the developer because they don't need to think about the `attribute` API, unless they need special behaviour.
- Good performance. You should always be setting `props` when possible which doesn't inherently affect performance because there's no round trip back to the attribute.

```js
skate.prop.boolean();
```

You are able to pass options to these properties to override built-in behaviour, or to define extra options that would normally be supported by a Skate property definition.

You can easily define a new property by calling `skate.prop.create()` as a function and passing it the default options for the property. All built-in properties are created using this method.

```js
const myNewProp = skate.prop.create({ ... });
myNewProp({ ... });
```

Built-in properties are accessed on the `skate.prop` namespace:

```js
skate.prop.boolean({
  coerce () {
    // coerce it differently than the default way
  },
  set () {
    // do something when set
  }
});
```

Generally built-in properties return a definition containing `default`, `coerce`, `deserialize` and `serialize` options.

*Empty values are defined as `null` or `undefined`. All empty values, if the property accepts them, are normalised to `null`.



## `array`

The `array` property ensures that any value passed to the property is an array. Serialisation and deserialisation happen using `JSON.stringify()` and `JSON.parse()`, respectively, if the property is linked to an attribute.



## `boolean`

The `boolean` property allows you to define a property that should *always* have a boolean value to mirror the behaviour of boolean properties / attributes in HTML. By default it is `false`. If an empty value is passed, then the value is `false`. If a boolean property is linked to an attribute, the attribute will have no value and its presence indicates whether or not it is `true` (present) or `false` (absent).



## `number`

Ensures the value is a `Number` and is correctly linked to an attribute. Numeric string values such as `'10'` will be converted to a `Number`. Non-numeric string values will be converted to `undefined`. The value will default to `0` if an empty value is passed.



## `string`

Ensures the value is always a `String` and is correctly linked to an attribute. Empty values are not coerced to strings.
