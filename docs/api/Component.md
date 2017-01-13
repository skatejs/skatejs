# Component

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation. skate.Component is provided by skate.

## Overview

`skate.Component` is an abstract base class (which has `HTMLElement` as super class) and is a basic building block of building web-components via skate.

Normally you would define a Skate component as a plain Javascript class and register it via browsers `customElements` wc API:

```js
import { Component, h } from 'skatejs';

class Greeting extends Component {
  static get is(){ return 'my-greeting' }
  renderCallback(){
    return <div>Hello World!</div>
  }
}

window.customElements.define(Greeting.is, Greeting);
```

If you don't use ES6 yet, you may use the `skate.define` helper instead. Take a look at Using Skate without ES6 to learn more.

### The Component Lifecycle

#### Mounting

- [`constructor()` /supersedes `static created()`/](#constructor---supersedes-static-created)
- [`connectedCallback()` /supersedes `static attached()`/](#connectedcallback---supersedes-static-attached)

#### Updating

- [`updatedCallback()` /supersedes `static updated()`/](#updatedcallback---supersedes-static-updated)
- [`renderCallback()` /supersedes `static render()`/](#rendercallback---supersedes-static-render)
- [`renderedCallback()` /supersedes `static rendered()`/](#renderedcallback---supersedes-static-rendered)
- [`attributeChangedCallback()` /supersedes `static attributeChanged()`/](#attributechangedcallback---supersedes-static-attributechanged)

#### Unmounting

- [`disconnectedCallback()` /supersedes `static detached()/ ](#disconnectedcallback---supersedes-static-detached)

### Other APIs

- [`prototype`](#prototype)

### `static` Class Properties

- [`props`](#static-props)
- [`observedAttributes`](#static-observedattributes)

---

## Reference

### `constructor` - supersedes `static created()`

Override `constructor` to do any setup of the custom element. You're subject to the [requirements for custom element constructors as defined in the spec](https://www.w3.org/TR/custom-elements/#custom-element-conformance).

```js
customElements.define('my-component', class extends skate.Component {
  constructor () {
    super();
  }
});
```


### `connectedCallback` - supersedes `static attached()`

Function that is called after the element has been inserted to the document.

```js
customElements.define('my-component', class extends skate.Component {
  connectedCallback () {
    super.connectedCallback();
  }
});
```

*The default implementation in `skate.Component` will render, so you should make sure to call it back if you override it.*


### `updatedCallback` - supersedes `static updated()`

Called before `renderCallback()` after `props` are updated. If it returns falsy, `renderCallback()` is not called. If it returns truthy, `renderCallback()` is called.

```js
customElements.define('x-component', class extends skate.Component {
  updatedCallback (previousProps) {
    // The 'previousProps' will be undefined if it is the initial render.
    if (!previousProps) {
      return true;
    }

    // The keys are the prop names, these can be String or Symbol.
    const namesAndSymbols = Object.getOwnPropertySymbols
      ? Object.getOwnPropertySymbols(previousProps).concat(Object.getOwnPropertyNames(previousProps))
      : Object.getOwnPropertyNames(previousProps);

    // The 'previousProps' will always contain all of the keys.
    for (let nameOrSymbol of namesAndSymbols) {
      // With Object.is NaN is equal to NaN
      if (!Object.is(previousProps[nameOrSymbol], elem[nameOrSymbol])) {
        return true;
      }
    }
  }
});
```

The default implementation does what is described in the example above:

- If it is the initial update, always call `renderCallback()`.
- If any of the properties have changed according to a strict equality comparison, always call `renderCallback()`.
- In any other scenario, don't render.

This generally covers 99% of the use-cases and vastly improves performance over just returning `true` by default. A good rule of thumb is to always reassign your props. For example, if you have a component that has a string prop and an array prop:

```js
class Elem extends skate.Component {
  static get props () {
    return {
      str: skate.prop.string(),
      arr: skate.prop.array()
    }
  }
  renderCallback () {
    return skate.h('div', 'testing');
  }
}

customElements.define('x-element', Elem);

const elem = new Elem();

// Re-renders:
elem.str = 'updated';

// Will not re-render:
elem.arr.push('something');

// Will re-render:
elem.arr = elem.arr.concat('something');
```

*It is not called if the element is not in the document for the same reasons as `renderCallback()`.*

*If you set properties within `updatedCallback()`, they will not cause it to be called more than once.*

*The code you write in here is performance critical.*



##### Other use-cases

Generally you'll probably supply a `renderCallback()` function for most of your components. If you require special checks for your props, you can override it:

```js
customElements.define('my-component', class extends skate.Component {
  updatedCallback (prev) {
    // You can reuse the original check if you want as part of your new check.
    // You could also call it directly if not extending: skate.Component().
    return super.updated(prev) && myCustomCheck(this, prev);
  }
});
```

If you don't have a `renderCallback()` function, sometimes it's still useful to respond to property updates:

```js
customElements.define('my-component', class extends skate.Component {
  static get props () {
    return {
      name: skate.prop.string()
    };
  }
  updatedCallback (prev) {
    if (prev.name !== this.name) {
      skate.emit(this, 'name-changed', { detail: prev });
    }
  }
});
```



### `renderCallback` - supersedes `static render()`

Function that is called to render the element.

```js
customElements.define('my-component', class extends skate.Component {
  renderCallback () {
    return skate.h('p', `My name is ${this.tagName}.`);
  }
});
```

You may also return an array which negates the need to put a wrapper around several elements:

```js
customElements.define('my-component', class extends skate.Component {
  renderCallback () {
    return [
      skate.h('paragraph 1'),
      skate.h('paragraph 2'),
    ];
  }
});
```



##### Return Value

The return value of `renderCallback()` should be either the result of a `skate.h` call, or an array of `skate.h` calls. Calling the deprecated `vdom.element()` and `vdom.text()` calls are not supported here (though they may still work). They are only supported in the deprecated `static render()` callback.

*It is not called if the element is not in the document. It will be called in `connectedCallback()` so that it renders as early as possible, but only if necessary.*

*Updating props from within `renderCallback()`, while discouraged, will not trigger another render.*



See also:

- [`updatedCallback()`](#updatedcallback---supersedes-static-updated)
- [`renderedCallback()`](#renderedcallback---supersedes-static-rendered)



### `renderedCallback` - supersedes `static rendered()`

Called after the component has rendered (i.e. called `renderCallback()`). If you need to do any DOM manipulation that can't be done in a `ref`, you can do it here. This is not called if `updatedCallback()` prevents rendering, or `renderCallback()` is not defined.


### `attributeChangedCallback` - supersedes `static attributeChanged()`

Function that is called when an attribute changes value (added, updated or removed).

```js
customElements.define('my-component', class extends skate.Component {
  attributeChangedCallback (name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }
});
```

*The default implementation in `skate.Component` will sync linked props, so you should make sure to call it back if you override it.*


### `disconnectedCallback` - supersedes `static detached()`

Function that is called after the element has been removed from the document.

```js
customElements.define('my-component', class extends skate.Component {
  disconnectedCallback () {
    super.disconnectedCallback();
  }
});
```


### `prototype`

Specifying methods and properties on your custom element is done simply by adding them to the prototype as you would with any web component.

```js
customElements.define('my-component', class extends skate.Component {
  get someProperty () {}
  set someProperty () {}
  someMethod () {}
});
```


## `static` Class Properties

### `static observedAttributes`

The attributes that trigger `attributeChangedCallback` [as per the spec](http://w3c.github.io/webcomponents/spec/custom/#custom-elements-autonomous-example).

```js
customElements.define('my-component', class extends skate.Component {
  static get observedAttributes () {
    return super.observedAttributes.concat('my-attribute');
  }
});
```

*The default implementation in `skate.Component` will return attributes linked to props, so you should make sure to do something with the default value if you override it.*



### `static props`

Custom properties that should be defined on the element. These are set up in the `constructor`.

```js
customElements.define('my-component', class extends skate.Component {
  static get props () {
    return {};
  }
});
```

Declare properties that (when mutated) cause the component re-render.

The custom property definition accepts the following options.



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
customElements.define('my-component', class extends skate.Component {
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
customElements.define('my-component', class extends skate.Component {
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
customElements.define('my-component', class extends skate.Component {
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
customElements.define('my-component', class extends skate.Component {
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
customElements.define('my-component', class extends skate.Component {
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



#### `get`

A function that is used to return the value of the property. If this is not specified, the internal property value is returned.

```js
customElements.define('my-component', class extends skate.Component {
  static get props () {
    return {
      myProp: {
        get (elem, data) {
          return `prefix_${data.internalValue}`;
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
  - `internalValue` - the current internal value of the property



#### `initial`

The initial value the property should have. This is different from `default` in the sense that it is only ever invoked once to set the initial value. If this is not specified, then `default` is used in its place.

```js
customElements.define('my-component', class extends skate.Component {
  static get props () {
    return {
      myProp: {
        initial: 'initial value'
      }
    };
  }
});
```

It can also be a function that returns the initial value:

```js
customElements.define('my-component', class extends skate.Component {
  static get props () {
    return {
      myProp: {
        initial (elem, data) {
          return 'initial value';
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

*Unlike `default`, `initial` will be refleted back to the attribute if linked.*



#### `serialize`

A function that converts the linked property value to the linked attribute value.

```js
customElements.define('my-component', class extends skate.Component {
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



#### `set`

A function that is called whenever the property is set. This is also called when the property is first initialised.

```js
customElements.define('my-component', class extends skate.Component {
  static get props () {
    return {
      myProp: {
        set (elem, data) {
          // do something
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
  - `newValue` - the new property value
  - `oldValue` - the old property value.

When the property is initialised, `oldValue` will always be `null` and `newValue` will correspond to the initial value. If the property is set to `null` or `undefined`, the `oldValue` is again normalised to be `null` for consistency.

*An important thing to note is that native property setters are not invoked if you use the `delete` keyword. For that reason, Skate property setters are also not able to be invoked, so keep this in mind when using your components.*
