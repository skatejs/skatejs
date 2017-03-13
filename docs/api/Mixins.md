# `Mixins`

The main `Component` class is a composition of mixins. These mixins are exposed via the `Mixins` export which gives you the ability to use a subset of the `Component` behaviour, and to compose in custom functionality.


## `Raw (Base = HTMLElement)`

The `Raw` mixin is a mixin that simply defines defaults for the native custom elements API. It ensures that callbacks are noops and that `observedAttributes` defaults to an empty array. This is convenient because it means that you can extend it and consumers don't have to do any checks to see if a `super` method is defined before calling it, or accessing the property and operating on it.

```js
import { Minxins } from 'skatejs';

class MyComponent extends Mixins.Raw() {
  connectedCallback () {
    super.connectedCallback();
  }
}
```


## `Props (Base = Raw)`

The `Props` mixin defines the behaviour of Skate's special `static props` that can be coerced and reflected to / from attributes.

```js
import { Mixins, prop } from 'skatejs';

class MyComponent extends Mixins.Props() {
  static props = {
    test: prop.array
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
import { Mixins } from 'skatejs';

customElements.define('my-component', class extends Mixins.Props() {
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
import { Mixins } from 'skatejs';

customElements.define('my-component', class extends Mixin.Props() {
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
import { Mixins } from 'skatejs';

customElements.define('my-component', class extends Mixin.Props() {
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
import { Mixins } from 'skatejs';

customElements.define('my-component', class extends Mixin.Props() {
  static get props () {
    return {
      myProp: {
        default: 'default value'
      }
    };
  }
});
```

You may also specify a function that returns the default value. This is useful if you are doing calculations or need to return a reference:


```js
import { Mixins } from 'skatejs';

customElements.define('my-component', class extends Mixin.Props() {
  static get props () {
    return {
      myProp: {
        default (elem, data) {
          return [];
        }
      }
    };
  }
});
```

The parameters passed to the function are:

- `elem` - the component element
- `data` - an object containing information about the property
  - `name` - the property name

*If specified, `default` will set the property value but will **not** be reflected back to the attribute, if linked. If at any point the property is set back to the `default`, the attribute will be removed, if linked.*


#### `deserialize`

A function that converts the linked attribute value to the linked property value.

```js
import { Mixins } from 'skatejs';

customElements.define('my-component', class extends Mixin.Props() {
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
import { Mixins } from 'skatejs';

customElements.define('my-component', class extends Mixin.Props() {
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


## `Render (Base = Props)`

The `Render` mixins allows you to define a custom `rendererCallback()` which will render the result of `renderCallback()`. It uses `shouldRenderCallback()` to determine whether or not a render should even occur, and if one does, it will call `renderedCallback()` after.

```js
/** @jsx h **/

import { h, render } from 'preact';
import { Mixins, prop } from 'skatejs';

class MyComponent extends Mixins.Render() {
  rendererCallback (renderCallbackResult) {
    return render(renderCallbackResult, this.shadowRoot);
  }
  shouldRenderCallback (prevProps, nextProps) {
    return true;
  }
}

class Test extends MyComponent {
  renderCallback () {
    return <div />;
  }
  renderedCallback () {
    console.log(this.shadowRoot.querySelector('div'));
  }
}
```

If you return a `Promise` from `rendererCallback()`, then `renderedCallback()` won't be fired until after the it resolves. The `renderCallback()` function can also return a `Promise` which will delay calling the `rendererCallback()` until it's resolved.

```js
/** @jsx h */

import { h } from 'preact';

class Test extends MyComponent {
  renderCallback () {
    return fetch('/something')
      .then(r => r.json())
      .then(r => <input value={r.value} />);
  }
  renderedCallback () {
    console.log(this.shadowRoot.querySelector('input').value);
  }
}
```


### connectedCallback ()

The `connectedCallback()` is overridden so that the component can render when it is connected to the DOM. If you define this, you should make sure that you call `super.connectedCallback()`.


### shouldRenderCallback (prevProps, nextProps)

Called after `props` have been updated and returns `true` if the render lifecycle should occur. If anything other than true is returned, a render lifecycle does not occur.

The default implementation of this does a strict equality check on the members of `prevProps` and `nextProps`. If a value has changed, it returns `true`. If not, then it returns `false`.


### renderCallback (props)

The callback that returns the content that the `rendererCallback()` should render.


### rendererCallback (renderCallbackResult)

The callback that renders the result of the `renderCallback()`.


#### renderedCallback ()

Called after the component has completed rendering.


## `Component (Base = Render)`

The `Component` mixin is what is used to create the base `Component` class. This allows you to specify a custom base class, if need be. This is an extension of the `Render` mixin and uses [Preact](https://github.com/developit/preact) to render your component.
