## API

Each API point is accessible on the main `skate` object:

```js
const { define, vdom } = skate;
```

Or can be imported by name in ES2015:

```js
import { define, vdom } from 'skatejs';
```



### Using the Platform

Skate focuses on staying as close to the platform as possible. This means that instead of having to use `skate.define()` you can just use `customElements.define()`, which is built-in. You can still use `skate.define()`, but it's opt-in, and only serves to enhance what the browser already gives you.

The lifecycle methods in Skate also use the `*Callback` naming convention. For example, the `render` lifecycle is represented by the `renderCallback()` on the custom element `prototype`. Things like `props` follow the convention of `observedAttributes` and are provided as static getters.

If you're using IE9 and 10, transpiling class extension is limited to instance methods and properties. Statics don't get added to the chain. However, Skate supports calling `extend()` on a component which you want to extend. This means that in older browsers, you can do something like:

```js
const MyComponent1 = skate.Component.extend();
const MyComponent2 = MyComponent1.extend();
```

Recently, we've deprecated several old methods in favour of aligning closer to the native APIs. These methods still work but will be removed in a future version. Not all methods / properties are listed here, only the ones that have been deprecated and what they're superseded by.

- `static created()` -> `constructor()`
- `static attached()` -> `connectedCallback()`
- `static detached()` -> `disconnectedCallback()`
- `static attributeChanged` -> `attributeChangedCallback()`
- `static updated()` -> `updatedCallback()`
- `static render()` -> `renderCallback()`
- `static rendered()` -> `renderedCallback()`

Most of the old API were static methods, or specified as options not on the `prototype`. The new APIs are mostly specified on the custom element's `prototype` unless it makes sense to be a `static`, such as `props` as they loosely correspond to `observedAttributes`.



### Extension

Since Skate is already close to the platform, you can easily extend other component classes just as you normally would:

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


### `disconnectedCallback` - supersedes `static detached()`

Function that is called after the element has been removed from the document.

```js
customElements.define('my-component', class extends skate.Component {
  disconnectedCallback () {
    super.disconnectedCallback();
  }
});
```



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



### `prototype`

Specifying methods and properties on your custom element is done simply by adding them to the prototype as you would with any web component.

```js
customElements.define('my-component', class extends skate.Component {
  get someProperty () {}
  set someProperty () {}
  someMethod () {}
});
```



#### `updatedCallback` - supersedes `static updated()`

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



#### `renderCallback` - supersedes `static render()`

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



#### `renderedCallback` - supersedes `static rendered()`

Called after the component has rendered (i.e. called `renderCallback()`). If you need to do any DOM manipulation that can't be done in a `ref`, you can do it here. This is not called if `updatedCallback()` prevents rendering, or `renderCallback()` is not defined.



### `define (nameOrConstructor, Constructor)`

The `define()` function is syntactic sugar on top of `customElements.define()` that enables the following things:

1. Non-conflicting custom element names
2. Automated custom element names

Both non-conflicting names and automated names are complementary and derive from the same functionality. Basically, if you were to do:

```js
customElements.define('x-test', class extends HTMLElement {});
customElements.define('x-test', class extends HTMLElement {});
```

Then you'd get an error. Similarly, you could do this:

```js
skate.define('x-test', class extends HTMLElement {});
skate.define('x-test', class extends HTMLElement {});
```

Skate will ensure that the second definition gets a unique name prefixed with `x-test`. This is immensely useful when writing tests because you don't need to keep track of what's already registered, but it can also be useful if you have several versions of a particular component appearing on the page. The only caveat is that if you need the tag name that the element was registered with, you have to use the constructor and access the `tagName` property. However, if you have access to the constructor, it's likely you don't need the tag name in the first place.

You may also omit the first argument, making your custom elements autonomous. This is useful if you're building your app comprised entirely of Skate and your components will only be used within a Skate app.

```js
skate.define(class extends skate.Component {
  renderCallback () {}
});
```

This works well because you can pass around constructors within your Skate components and you won't ever need to worry about HTML tag naming conventions.

*Autonomous custom element names aren't recommended if you're exposing your components outside of your app because then one wouldn't be able to just write HTML as they wouldn't know the tag name.*



#### WebPack Hot-Module Reloading

If you're using HMR and the standard `customElements.define()`, you'll run into issues if you've defined your component a module that reloads. If this is the case, you can use `skate.define()` to ensure each registration has a unique name.

*Skate cannot refresh the component definition as there is no way to reregister a component using the web component APIs.*



### `emit (elem, eventName, eventOptions = {})`

Emits an `Event` on `elem` that is `composed`, `bubbles` and is `cancelable` by default. It also ensures a 'CustomEvent' is emitted properly in browsers that don't support using `new CustomEvent()`. This is useful for use in components that are children of a parent component and need to communicate changes to the parent.

```js
customElements.define('x-tabs', class extends skate.Component {
  renderCallback () {
    return skate.h('x-tab', { onSelect: () => {} });
  }
});

customElements.define('x-tab', class extends skate.Component {
  renderCallback () {
    return skate.h('a', { onClick: () => skate.emit(this, 'select') });
  }
});
```

It's preferable not to reach up the DOM hierarchy because that couples your logic to a specific DOM structure that the child has no control over. To decouple this so that your child can be used anywhere, simply trigger an event.

The return value of `emit()` is the same as [`dispatchEvent()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent).



#### Preventing Bubbling or Canceling

If you don't want the event to bubble, or you don't want it to be cancelable, then you can specify the standard event options in the `eventOptions` argument.

```js
skate.emit(elem, 'event', {
  composed: false,
  bubbles: false,
  cancelable: false
});
```



#### Passing Data

You can pass data when emitting the event with the `detail` option in the `eventOptions` argument.

```js
skate.emit(elem, 'event', {
  detail: {
    data: 'my-data'
  }
});
```



### `link (elem, propSpec)`

The `link()` function returns a function that you can bind as an event listener. The handler will take the event and propagate the changes back to the host element. This essentially allows for 2-way data-binding, but is safer as the propagation of the user input value back to the component element will trigger a re-render, ensuring all dependent UI is up to date.

```js
customElements.define('my-input', class extends skate.Component {
  static get props () {
    return {
      value: { attribute: true }
    };
  }
  renderCallback () {
    return skate.h('input', { onChange: skate.link(this), type: 'text' });
  }
});
```

By default the `propSpec` defaults to `e.currentTarget.getAttribute('name')` or `"value"` which is why it wasn't specified in the example above. In the example above, it would set `value` on the component. If you were to give your input a name, it would use the name from the event `currentTarget` as the name that should be set. For example if you changed your input to read:

```js
skate.h('input', { name: 'someValue', onChange: skate.link(this), type: 'text' });
```

Then instead of setting `value` on the component, it would set `someValue`.

You may explicitly set the property you would like to set by specifying a second argument to `link()`:

```js
skate.link(this, 'someValue')
```

The above link would set `someValue` on the component.

You can also use dot-notation to reach into objects. If you do this, the top-most object will trigger a re-render of the component.

```js
skate.link(this, 'obj.someValue')
```

In the above example, the `obj` property would trigger an update even though only the `someValue` sub-property was changed. This is so you don't have to worry about re-rendering.

You can even take this a step further and specify a sub-object to modify using the name of the `currentTarget` (or `value`, of course) if `propSpec` ends with a `.`. For example:

```js
skate.h('input', { name: 'someValue', onChange: skate.link(this, 'obj.'), type: 'text' });
```

The above example would set `obj.someValue` because the name of the input was `someValue`. This doesn't look much different from the previous example, but this allows you to create a single link handler for use with multiple inputs:

```js
const linkage = skate.link(this, 'obj.');
skate.h('input', { name: 'someValue1', onChange: linkage, type: 'text' });
skate.h('input', { name: 'someValue2', onChange: linkage, type: 'checkbox' });
skate.h('input', { name: 'someValue3', onChange: linkage, type: 'radio' });
skate.h('select', { name: 'someValue4', onChange: linkage },
  skate.h('option', { value: 2 }, 'Option 2'),
  skate.h('option', { value: 1 }, 'Option 1'),
);
```

The above linkage would set:

- `obj.someValue1`
- `obj.someValue2`
- `obj.someValue3`
- `obj.someValue4`



### `prop`

Skate has some built-in property definitions to help you with defining consistent property behaviour within your components. All built-in properties are functions that return a property definition.

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

*Properties are only linked to attributes if the `attribute` option is set. Each built-in property, if possible, will supply a `deserialize` and `serialize` option but will not be linked by default.*



#### `array`

The `array` property ensures that any value passed to the property is an array. Serialisation and deserialisation happen using `JSON.stringify()` and `JSON.parse()`, respectively, if the property is linked to an attribute.



#### `boolean`

The `boolean` property allows you to define a property that should *always* have a boolean value to mirror the behaviour of boolean properties / attributes in HTML. By default it is `false`. If an empty value is passed, then the value is `false`. If a boolean property is linked to an attribute, the attribute will have no value and its presence indicates whether or not it is `true` (present) or `false` (absent).



#### `number`

Ensures the value is a `Number` and is correctly linked to an attribute. Numeric string values such as `'10'` will be converted to a `Number`. Non-numeric string values will be converted to `undefined`. The value will default to `0` if an empty value is passed.



#### `string`

Ensures the value is always a `String` and is correctly linked to an attribute. Empty values are not coerced to strings.



### `props (elem[, props])`

The `props` function is a getter or setter depending on if you specify the second argument. If you do not provide `props`, then the current state of the component is returned. If you pass `props`, then the current state of the component is set. When you set state, the component will re-render synchronously only if it needs to be re-rendered.

Component state is derived from the declared properties. It will only ever return properties that are defined in the `props` object. However, when you set state, whatever state you specify will be set even if they're not declared in `props`.

```js
import { define, props } from 'skatejs';

class Elem extends skate.Component {
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



### `ready (element, callback)`

The `skate.ready()` function allows you to define a `callback` that is fired when the specified `element` is has been upgraded. This is useful when you want to ensure an element has been upgraded before doing anything with it. For more information regarding why an element may not be upgraded right away, read the following section.



#### Background

If you put your component definitions before your components in the DOM loading `component-a` before `component-b`:

```html
<script src="component-a.js"></script>
<script src="component-b.js"></script>
<component-a>
  <component-b></component-b>
</component-a>
```

The initialisation order will be:

1. `component-a`
2. `component-b`

If you flip that around so that `component-b` is loaded before `component-a`, the order is the same. This is because the browser will initialise elements with their corresponding definitions as it descends the DOM tree.

However, if you put your component definitions at the bottom of the page, it gets really hairy. For example:

```html
<component-a>
  <component-b></component-b>
</component-a>
<script src="component-a.js"></script>
<script src="component-b.js"></script>
```

In this example, we are loading `component-a` before `component-b` and the same order will apply. *However*, if you flip that around so that `component-b` is loaded before `component-a`, then `component-b` will be initialised first. This is because when a definition is registered via `window.customElements.define()`, it will look for elements to upgrade *immediately*.



### `h`

The `h` export is the result of a call to `vdom.builder()` that allows you to write [Hyperscript](https://github.com/dominictarr/hyperscript). This also adds first-class JSX support so you can just set the JSX `pragma` to `h` and carry on building stuff.

#### `Hyperscript`

You can use the `h` export to write Hyperscript:

```js
customElements.define('my-component', class extends skate.Component {
  renderCallback () {
    return skate.h('p', { style: { fontWeight: 'bold' } }, 'Hello!');
  }
});
```

*Currently id / class selectors are not supported, but [will be soon](https://github.com/skatejs/skatejs/issues/807).*



#### `JSX`

The `h` export also allows you to write JSX out of the box. All you have to do is include the [standard babel transform](https://babeljs.io/docs/plugins/transform-react-jsx/).



##### Setting `pragma`

It's preferred that you set the JSX `pragma` to `h` (or `skate.h` if you're using globals), if possible, so that you don't confuse anyone by using the default `React.createElement()` in a non-React app.

```js
// .babelrc
{
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "h"
    }]
  ]
}

// my-component.js
import { Component, h } from 'skatejs';

customElements.define('my-component', class extends Component {
  renderCallback () {
    return <p>Hello!</p>;
  }
});
```



##### Default `React.createElement()`

If you don't have control over the `pragma`, you can get around it by defining the `React.createElement()` interface with the `h` export.

```js
import { Component, h } from 'skatejs';
const React = { createElement: h };
customElements.define('my-component', class extends Component {
  renderCallback () {
    return <p>Hello!</p>;
  }
});
```



##### Other ways to use JSX

You can also enable JSX support in a couple of other ways, though they require slightly more work:

- https://github.com/thejameskyle/incremental-dom-react-helper - Allows `React.createElement()` calls to translate to Incremental DOM calls.
- https://github.com/jridgewell/babel-plugin-incremental-dom - Babel plugin for transpiling JSX to Incremental DOM calls.

```js
// Incremental DOM needs to be available globally, so you'll have to do:
IncrementalDOM = skate.vdom;

// For the plugin you need to configure the `prefix` option to
// point to Skate's `vdom` or you'll need to do something like this
// so the functions are in scope.
const { elementOpen, elementOpenStart, elementVoid } = skate.vdom;

customElements.define('my-component', class extends skate.Component {
  static get props () {
    return {
      title: skate.prop.string()
    };
  }
  renderCallback () {
    return (
      <div>
        <h1>{this.title}</h1>
        <slot name="description" />
        <article>
          <slot />
        </article>
      </div>
    );
  }
});
```



### `vdom`

Skate includes several helpers for creating virtual elements with Incremental DOM.



#### `vdom.builder ()`

Calling `vdom.builder()` without any arguments returns a function that you can call in `renderCallback()` to create elements. This is how the `h` export is created.

```js
const h = vdom.builder();
customElements.define('my-component', class extends skate.Component {
  renderCallback () {
    return h('div', { id: 'test', }, h('p', 'test'));
  }
});
```



#### `vdom.builder (...elements)`

When `vdom.builder()` is called with arguments, it returns an array of functions that create elements corresponding to the arguments that you've passed in. This makes creating a DSL very simple:

```js
const [ div, p ] = skate.vdom.builder('div', 'p');
customElements.define('my-component', class extends skate.Component {
  renderCallback() {
    return div({ id: 'mydiv' }, p('test'));
  }
});
```


#### [DEPRECATED] `vdom.element (elementName, attributesOrChildren, ...children)`

*This has been deprecated in favour of using the `vdom.builder()` API, or the `h` export directly.*

The `elementName` argument is the name of the element you want to create. This can be a string or a function. If it's a function, it is treated as a [component constructor](#component-constructor) or [function helper](#function-helper).

The `attributesOrChildren` argument is either an `object`, a `function` that will render the children for this element or a `string` if you only want to render a text node as the children.

The rest of the arguemnts are functions that render out `children`.

```js
skate.vdom.element('select', { name: 'my-select' }, function () {
  skate.vdom.element('option', { value: 'myval' }, 'My Value');
});
```



#### [DEPRECATED] `vdom.text (text)`

*This has been deprecated in favour of just passing text to an element.*

The `text()` function is exported directly from Incremental DOM and you could use that if you wanted to instead of specifying text as a string to a parent node:

```js
skate.vdom.element('option', { name: 'my-select' }, function () {
  skate.vdom.element('option', { value: 'myval' }, function () {
    skate.vdom.text('My Value');
  });
});
```

This is very useful if you need to render text with other elements as siblings, or do complex conditional rendering. It's also useful when your custom element may only need to render text nodes to its shadow root.



#### Incremental DOM

Skate uses Incremental DOM underneath the hood because not only is it performant and memory-efficient, it also acts as a backend to any templating language that can compile down to it. It's less limiting as a transpile target than other virtual DOM implementations so you can use languages other than JSX with it.

We wrap Incremental DOM to add functionality on top of it that we feel is essential to productively building web components:

- We set properties instead of attributes wherever possible
- You can pass component constructors and stateless functions as element names directly to the Incremental DOM functions, just like you can in JSX
- We handle special properties such as `class`, `key`, `ref`, `skip` and `statics`



##### Component constructor

If you pass a component constructor instead of an string as the element name, the name of the component will be used. This means that instead of using hard-coded custom element names, you can import your constructor and pass that instead:

```js
class MyElement extends skate.Component {}
customElements.define('my-element', MyElement);

// Renders <my-element />
skate.h(MyElement);
```

This is provided at the Incremental DOM level of Skate, so you can also do:

```js
skate.vdom.elementOpen(MyElement);
```

This is very helpful in JSX:

```js
<MyElement />
```

However, since this is provided in the Incremental DOM functions that Skate exports, it means that you can do this in any templating language that supports it.



##### Function helper

Function helpers are passed in the same way as a component constructor but are handled differently. They provide a way for you to write pure, stateless, functions that will render virtual elements in place of the element that you've passed the function to. Essentially they're stateless, private web components.

```js
const MyElement = () => skate.h('div', 'Hello, World!');

// Renders <div>Hello, World!</div>
skate.h(MyElement);
```

You can customise the output using properties:

```js
const MyElement = props => skate.h('div', `Hello, ${props.name}!`);

// Renders <div>Hello, Bob!</div>
skate.h(MyElement, { name: 'Bob' });
```

Or you could use children:

```js
const MyElement = (props, chren) => skate.h('div', 'Hello, ', chren, '!');

// Renders <div>Hello, Mary!</div>
skate.h(MyElement, 'Mary');
```

As with the component constructor, you can also use this in JSX or any other templating language that supports passing functions as tag names:

```js
const MyElement = (props, chren) => <div>Hello, {chren}!</div>;

// Renders <div>Hello, Mary!</div>
<MyElement>Mary</MyElement>
```



##### Special Attributes

Skate adds some opinionated behaviour to Incremental DOM.



###### `class`

The recommended way to specify a list of classes on an element is by simply specifying the `class` attribute as you'd normally do in HTML. It's not necessary to specify `className`, though you can if you really want to.



###### `key`

This gives the virtual element a [`key`](http://google.github.io/incremental-dom/#conditional-rendering/array-of-items) that Incremental DOM uses to keep track of it for more efficient patches when dealing with arrays of items.

```js
skate.h('ul',
  skate.h('li', { key: 0 }),
  skate.h('li', { key: 1 }),
);
```



###### `on*`

Any attribute beginning with `on` followed by an uppercase character or dash, will be bound to the event matching the part found after `on`.

```js
const onClick = console.log;
skate.h('button', { onClick });
skate.h('button', { 'on-click': onClick });
```

Additionally, events that exist as properties on DOM elements can also be used:

```js
skate.h('button', { onclick: onClick });
```

if you need to bind listeners directly to your host element, you should do this in one of your lifecycle callbacks:

```js
customElements.define('my-element', class extends skate.Component {
  constructor () {
    super();
    this.addEventListener('change', this.handleChange);
  }

  handleChange(e) {
    // `this` is the element.
    // The event is passed as the only argument.
  }
});
```



###### `ref`

A callback that is called when the attribute is set on the corresponding element. The only argument is the element that `ref` is bound to.

```js
const ref = button => button.addEventListener('click', console.log);
skate.h('button', { ref });
```

Refs are only called on the element when the value of `ref` changes. This means they get called on the initial set, and subsequent sets if the reference to the value changes.

For example, if you define a function outside of `renderCallback()`, it will only be called when the element is rendered for the first time:

```js
const ref = console.log;
customElements.define('my-element', class extends skate.Component {
  renderCallback () {
    return skate.h('div', { ref });
  }
});
```

However, if you define the `ref` function within `renderCallback()`, it will be a new reference every time, and thus be called every time:

```js
customElements.define('my-element', class extends skate.Component {
  renderCallback () {
    const ref = console.log;
    return skate.h('div', { ref });
  }
});
```

*It's important to understand that this only gets called on the element when either the ref is set up or changed, not when the element is removed from the tree. This is because we discourage saving the value of `ref`. If you need it to only be called when the element is set up, put the `ref` outside of `render()`. If you absolutely need to save the value, try using a `WeakMap`.*



###### `skip`

This is helpful when integrating with 3rd-party libraries that may mutate the DOM.

```js
skate.h('div', { ref: e => (e.innerHTML = '<p>oh no you didn\'t</p>'), skip: true });
```



###### `statics`

This is an array that tells Incremental DOM which attributes should be considered [static](http://google.github.io/incremental-dom/#rendering-dom/statics-array).

```js
skate.h('div', { statics: ['attr1', 'prop2'] });
```



###### Boolean Attributes

If you specify `false` as any attribute value, the attribute will not be added, it will simply be ignored.
