# `withProps (Base = HTMLElement)`

The `withProps` mixin defines the behaviour of Skate's special `static props` that can be coerced and reflected to / from attributes.

```js
import { propArray, withProps } from 'skatejs';

class MyComponent extends withProps() {
  static props = {
    test: propArray
  }
  propsUpdatedCallback (prevProps, nextProps) {

  }
}
```

### Implementation details

- The `Props` mixin defines the `attributeChangedCallback()` for providing linkage between properties and attributes. If you define this, make sure you call `super.attributeChangedCallback()`.

### Prop options

Custom properties that should be defined on the element. These are set up in the `constructor`.

```js
import { withProps } from 'skatejs';

customElements.define('my-component', class extends withProps() {
  static get props () {
    return {
      // Defaults are shown.
      myProp: {
        attribute: undefined,
        coerce: value => value,
        default: () => undefined,
        deserialize: value => value,
        serialize: value => value
      }
    };
  }
});
```

#### `attribute`

Whether or not to link the property to an attribute. This can be either a `Boolean`, a `String`, or an `Object` with properties `source` and/or `target`.

- If it's `false`, it's not linked to an attribute. This is the default.
- If it's `true`, the property name is dash-cased and used as the attribute name it should be linked to.
- If it's a `String`, the value is used as the attribute name it should be linked to.
- If it's a `Object`, it must have properties `source` or `target` or both.
	- `source` indicates the observed input attribute that sets the property's value.
	- `target` indicates the output attribute where the property's value will be reflected to.
	- `source` and `target` can be eighter `Boolean` or `String` and follow the same rules as described above.

Attributes are set from props on your element once it is inserted into the DOM.

```js
import { withProps } from 'skatejs';

customElements.define('my-component', class extends withProps() {
  static get props () {
    return {
      myProp: { attribute: true }
    };
  }
});
```

*When you declare a linked attribute, it automatically adds this attribute to the list of `observedAttributes`.*

*Even though property values are set up in the `constructor`, attributes are not synced until `connectedCallback()` is invoked.*

#### `coerce`

A function that coerces the incoming property value and returns the coerced value. This value is used as the internal value of the property.

```js
import { withProps } from 'skatejs';

customElements.define('my-component', class extends withProps() {
  static get props () {
    return {
      myProp: {
        coerce (value) {
          return value;
        }
      }
    };
  }
});
```

The parameters passed to the function are:

- `value` - the value that should be coerced


#### `default`

Specifies the default value of the property. If the property is ever set to `null` or `undefined`, instead of being set to 'null', the `default` value will be used instead.

```js
import { withProps } from 'skatejs';

customElements.define('my-component', class extends withProps() {
  static get props () {
    return {
      myProp: {
        default: 'default value'
      }
    };
  }
});
```

#### `deserialize`

A function that converts the linked attribute value to the linked property value.

```js
import { withProps } from 'skatejs';

customElements.define('my-component', class extends withProps() {
  static get props () {
    return {
      myProp: {
        deserialize (value) {
          return value.split(',');
        }
      }
    };
  }
});
```

The parameters passed to the function are:

- `value` - the property value that needs to be coerced to the attribute value.

#### `serialize`

A function that converts the linked property value to the linked attribute value.

```js
import { withProps } from 'skatejs';

customElements.define('my-component', class extends withProps() {
  static get props () {
    return {
      myProp: {
        serialize (value) {
          return value.join(',');
        }
      }
    };
  }
});
```

The parameters passed to the function are:

- `value` - the attribute value that needs to be coerced to the property value.

## Built-in props

Skate has some built-in property definitions to help you with defining consistent property behaviour within your components.

By default, all built-in props are have one-way reflection with their corresponding attribute. This ensures that you get three things out of the box:

- A consistent API for your consumers because they can still use HTML attributes if necessary to update the components.
- Less friction for the developer because they don't need to think about the `attribute` API, unless they need special behaviour.
- Good performance. You should always be setting `props` when possible which doesn't inherently affect performance because there's no round trip back to the attribute.

```js
import { Component, propArray, propBoolean } from 'skatejs';

export default class extends Component {
  static get props () {
    return {
      myArray: propArray,
      myBoolean: propBoolean
    };
  }
}
```

### `array`

The `array` property ensures that any value passed to the property is an array. Serialisation and deserialisation happen using `JSON.stringify()` and `JSON.parse()`, respectively, if the property is linked to an attribute.

*The `default` value is a shared, frozen `array`, so it's immutable.*

### `boolean`

The `boolean` property allows you to define a property that should *always* have a boolean value to mirror the behaviour of boolean properties / attributes in HTML. By default it is `false`. If an empty value is passed, then the value is `false`. If a boolean property is linked to an attribute, the attribute will have no value and its presence indicates whether or not it is `true` (present) or `false` (absent).

### `number`

Ensures the value is a `Number` and is correctly linked to an attribute. Numeric string values such as `'10'` will be converted to a `Number`. Non-numeric string values will be converted to `undefined`. The value will default to `0` if an empty value is passed.

### `object`

Ensures the value is always an object literal and that it serialises / deserialises properly when linked to an attribute.

*The `default` value is a shared, frozen `object`, so it's immutable.*

### `string`

Ensures the value is always a `String` and is correctly linked to an attribute. Empty values are not coerced to strings.

*All built in properties normalise empty property values such as `null` or `undefined` to be `null`.*

### Custom properties

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
  customProp: Object.assign({}, propArray, {
    deserialize () {}
  });
};
```

A simpler way of doing this, if you're using object spread, is to do something like:

```js
const myProps = {
  customProp: {
    ...propArray,
    ...{ deserialize () {} }
  }
}
```

This has the added benefit of not accidentally causing a mutation of the source prop, if it's not frozen.

*All built-in props are frozen, so they can't be mutated. However, if you create custom properties, they can be mutated unless you freeze them.*

## Getting and setting props

### `getProps (elem)`

### `setProps (elem, props)`
