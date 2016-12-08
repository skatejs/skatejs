# Skate

[![NPM version](https://img.shields.io/npm/v/skatejs.svg)](https://www.npmjs.com/package/skatejs)
[![Build Status](https://travis-ci.org/skatejs/skatejs.svg?branch=master)](https://travis-ci.org/skatejs/skatejs)
[![Size](https://img.shields.io/badge/min+gz-4.64%20kB-blue.svg)](https://unpkg.com/skatejs)
[![Join the chat at https://gitter.im/skatejs/skatejs](https://badges.gitter.im/skatejs/skatejs.svg)](https://gitter.im/skatejs/skatejs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Semantic Release](https://img.shields.io/badge/semantic--release-%F0%9F%9A%80-ffffff.svg)](https://github.com/semantic-release/semantic-release)
[![Follow @skate_js on Twitter](https://img.shields.io/twitter/follow/skate_js.svg?style=social&label=@skate_js)](https://twitter.com/skate_js)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/skatejs.svg)](https://saucelabs.com/u/skatejs)

Skate is a library built on top of the [W3C web component specs](https://github.com/w3c/webcomponents) that enables you to write functional and performant web components with a very small footprint.

- Functional rendering pipeline backed by Google's [Incremental DOM](https://github.com/google/incremental-dom).
- Inherently cross-framework compatible. For example, it works seamlessly with - and complements - React and other frameworks.
- Skate itself is only 4k min+gz.
- It's very fast.
- It works with multiple versions of itself on the page.

HTML

```html
<x-hello name="Bob"></x-hello>
```

JavaScript

```js
customElements.define('x-hello', class extends skate.Component {
  static get props () {
    return {
      name: { attribute: true }
    };
  }
  renderCallback () {
    return skate.h('div', `Hello, ${this.name}`);
  }
});
```

Result

```html
<x-hello name="Bob">Hello, Bob!</x-hello>
```

Whenever you change the `name` property - or attribute - the component will re-render, only changing the part of the DOM that requires updating.



## Documentation

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


  - [Installing](#installing)
    - [NPM](#npm)
    - [Script Tag](#script-tag)
  - [Dependencies](#dependencies)
  - [Browser Support](#browser-support)
  - [Resources](#resources)
  - [Questions?](#questions)
  - [Terminology](#terminology)
  - [Examples](#examples)
    - [Counter](#counter)
  - [API](#api)
    - [Using the Platform](#using-the-platform)
    - [`constructor` - supersedes `static created()`](#constructor---supersedes-static-created)
    - [`connectedCallback` - supersedes `static attached()`](#connectedcallback---supersedes-static-attached)
    - [`disconnectedCallback` - supersedes `static detached()`](#disconnectedcallback---supersedes-static-detached)
    - [`attributeChangedCallback` - supersedes `static attributeChanged()`](#attributechangedcallback---supersedes-static-attributechanged)
    - [`static observedAttributes`](#static-observedattributes)
    - [`static props`](#static-props)
      - [`attribute`](#attribute)
      - [`coerce`](#coerce)
      - [`default`](#default)
      - [`deserialize`](#deserialize)
      - [`get`](#get)
      - [`initial`](#initial)
      - [`serialize`](#serialize)
      - [`set`](#set)
    - [`prototype`](#prototype)
      - [`updatedCallback` - supersedes `static updated()`](#updatedcallback---supersedes-static-updated)
        - [Other use-cases](#other-use-cases)
      - [`renderCallback` - supersedes `static render()`](#rendercallback---supersedes-static-render)
        - [Return Value](#return-value)
      - [`renderedCallback` - supersedes `static rendered()`](#renderedcallback---supersedes-static-rendered)
    - [`define (nameOrConstructor, Constructor)`](#define-nameorconstructor-constructor)
      - [WebPack Hot-Module Reloading](#webpack-hot-module-reloading)
    - [`emit (elem, eventName, eventOptions = {})`](#emit-elem-eventname-eventoptions--)
      - [Preventing Bubbling or Canceling](#preventing-bubbling-or-canceling)
      - [Passing Data](#passing-data)
    - [`link (elem, propSpec)`](#link-elem-propspec)
    - [`prop`](#prop)
      - [`array`](#array)
      - [`boolean`](#boolean)
      - [`number`](#number)
      - [`string`](#string)
    - [`props (elem[, props])`](#props-elem-props)
    - [`ready (element, callback)`](#ready-element-callback)
      - [Background](#background)
    - [`h`](#h)
      - [`Hyperscript`](#hyperscript)
      - [`JSX`](#jsx)
        - [Setting `pragma`](#setting-pragma)
        - [Default `React.createElement()`](#default-reactcreateelement)
        - [Other ways to use JSX](#other-ways-to-use-jsx)
    - [`vdom`](#vdom)
      - [`vdom.builder ()`](#vdombuilder-)
      - [`vdom.builder (...elements)`](#vdombuilder-elements)
      - [[DEPRECATED] `vdom.element (elementName, attributesOrChildren, ...children)`](#deprecated-vdomelement-elementname-attributesorchildren-children)
      - [[DEPRECATED] `vdom.text (text)`](#deprecated-vdomtext-text)
      - [Incremental DOM](#incremental-dom)
        - [Component constructor](#component-constructor)
        - [Function helper](#function-helper)
        - [Special Attributes](#special-attributes)
          - [`class`](#class)
          - [`key`](#key)
          - [`on*`](#on)
          - [`ref`](#ref)
          - [`skip`](#skip)
          - [`statics`](#statics)
          - [Boolean Attributes](#boolean-attributes)
  - [Customised built-in elements](#customised-built-in-elements)
  - [VS other libraries](#vs-other-libraries)
    - [VS WebComponentsJS](#vs-webcomponentsjs)
    - [VS Polymer](#vs-polymer)
    - [VS X-Tags](#vs-x-tags)
    - [VS React](#vs-react)
  - [Preventing FOUC](#preventing-fouc)
  - [Designing Web Components](#designing-web-components)
    - [Imperative](#imperative)
    - [Declarative](#declarative)
    - [Naming Collisions](#naming-collisions)
    - [Compatible with multiple versions of itself](#compatible-with-multiple-versions-of-itself)
    - [Properties and Attributes](#properties-and-attributes)
    - [Private Members](#private-members)
    - [Private Data](#private-data)
  - [React Integration](#react-integration)
  - [Form Behaviour and the Shadow DOM](#form-behaviour-and-the-shadow-dom)
    - [Submission](#submission)
    - [Form Data](#form-data)
  - [Stateless Components](#stateless-components)
  - [Styling Components](#styling-components)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Installing

There's a couple ways to consume Skate.



### NPM

```sh
npm install skatejs
```

Skate exports a UMD definition so you can:

```js
import * as skate from 'skatejs';
const skate = require('skatejs');
require(['skatejs'], function (skate) {});
```

There's three files in `dist/`. Each has a UMD definition and a corresponding sourcemap file:

1. `index.js` - This is the `main` entry point in the `package.json` without dependencies.
2. `index-with-deps.js` - Unminified with dependencies.
3. `index-with-deps.min.js` - Minified with dependencies.



### Script Tag

```html
<script src="https://unpkg.com/skatejs/dist/index-with-deps.min.js"></script>
```

Since Skate exports a UMD definition, you can then access it via the global:

```js
const { skate } = window;
```



## Dependencies

Skate doesn't require you provide any external dependencies, but recommends you provide some web component polyfills depending on what browsers you require support for. **Skate requires both Custom Elements and Shadow DOM v1.**

To get up and running quickly with our recommended configuration, we've created a single package called [`skatejs-web-components`](https://github.com/skatejs/web-components) where all you have to do is *load it before Skate*.

```sh
npm install skatejs skatejs-web-components
```

And then you can import it:

```js
import 'skatejs-web-components';
import { define, vdom } from 'skatejs';
```

Or you can use script tags:

```html
<script src="https://unpkg.com/skatejs-web-components/dist/index.min.js"></script>
<script src="https://unpkg.com/skatejs/dist/index-with-deps.min.js"></script>
```

If you want finer grained control about which polyfills you use, you'll have to BYO Custom Element and Shadow DOM polyfills.



## Browser Support

Skate supports all evergreens and IE11. We recommend using the following polyfills:

- Custom Elements: https://github.com/webcomponents/custom-elements
- Shadow DOM: https://github.com/webcomponents/shadydom
- Shadow DOM (CSS fills): https://github.com/webcomponents/shadycss



## Resources

- [SkateJS Website](https://github.com/skatejs/skatejs.github.io)
- [Web Platform Podcast: Custom Elements & SkateJS](http://thewebplatformpodcast.com/66-custom-elements-skatejs)
- [SydJS: Skating with Web Components](http://slides.com/treshugart/skating-with-web-components#/)
- [SydJS: Still got your Skate on](http://slides.com/treshugart/still-got-your-skate-on#/)



## Questions?

If you have any questions about Skate you can use one of these:

- [Gitter](https://gitter.im/skatejs/skatejs)
- [HipChat](https://www.hipchat.com/gB3fMrnzo)



## Terminology

Let's define some terms used in these docs:

- polyfill, polyfilled, polyfill-land - no native web component support.
- upgrade, upgraded, upgrading - when an element is initialised as a custom element.



## Examples

The following are some simple examples to get you started with Skate.



### Counter

The following is a simple counter that increments the count for every second that passes.

```js
const sym = Symbol();

customElements.define('x-counter', class extends skate.Component {
  static get props () {
    return {
      // By declaring the property an attribute, we can now pass an initial value
      // for the count as part of the HTML.
      count: skate.prop.number({ attribute: true })
    };
  }
  connectedCallback () {
    // Ensure we call the parent.
    super.connectedCallback();

    // We use a symbol so we don't pollute the element's namespace.
    this[sym] = setInterval(() => ++this.count, 1000);
  }
  disconnectedCallback () {
    // Ensure we callback the parent.
    super.disconnectedCallback();

    // If we didn't clean up after ourselves, we'd continue to render
    // unnecessarily.
    clearInterval(this[sym]);
  }
  renderCallback () {
    // By separating the strings (and not using template literals or string
    // concatenation) it ensures the strings are diffed indepenedently. If
    // you select "Count" with your mouse, it will not deselect whenr endered.
    return skate.h('div', 'Count ', this.count);
  }
});
```

To use this, all you'd need to do in your HTML somewhere is:

```html
<x-counter count="1"></x-counter>
```



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

Whether or not to link the property to an attribute. This can be either a `Boolean` or `String`.

- If it's `false`, it's not linked to an attribute. This is the default.
- If it's `true`, the property name is dash-cased and used as the attribute name it should be linked to.
- If it's a `String`, the value is used as the attribute name it should be linked to.

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
    // The previous props will not be defined if it is the initial render.
    if (!previousProps) {
      return true;
    }

    // The previous props will always contain all of the keys.
    for (let name in previousProps) {
      if (previousProps[name] !== this[name]) {
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



## Customised built-in elements

The spec [mentions](http://w3c.github.io/webcomponents/spec/custom/#customized-built-in-element) this as a way to extend built-in elements. Currently, how this is exposed to the user is still [under contention](https://github.com/w3c/webcomponents/issues/509#issuecomment-222860736). Skate doesn't need do anything to support this underneath the hood, but be aware of this when building components.



## VS other libraries

We hold no ill thoughts against other libraries and we are just trying to articulate why one would choose Skate over another. If any information here is inaccurate, please feel free to raise an issue to discuss how we can make it accurate.



### VS WebComponentsJS

[webcomponentsjs](https://github.com/webcomponents/webcomponentsjs)

WebComponentsJS is a suite of polyfills. If there is native browser support, they're not needed. Skate is a superset of these specifications, thus is a value-add on top of them, if they're needed.


### VS Polymer

Polymer uses webcomponentsjs and adds an abstraction on top of it. In their high-level design, Skate and Polymer are very similar in that they're built on top of emerging standards. However, fundamentally, Skate and Polymer are very different.

- Skate uses a functional programming model for rendering in which you can use any templating language you want that compiles down to Incremental DOM. It calls `renderCallback()` when something changes and then tells Incremental DOM to diff and patch what's different between the two states. With Polymer, you use their custom template syntax that creates links between properties and mutations happen to the DOM directly.
- Skate only has a single option for its usage, making it simpler to grok what you're getting. Polymer has three different builds, most of which Skate is smaller than. The following comparisons are using non-gzipped, minified versions.
  - `polymer-micro.html` 17k vs 11k
  - `polymer-mini.html` 54k vs 11k
  - `polymer.html` 124k vs 11k
- Polymer uses HTML Imports to build their codebase. This can be obtuse if you're used to using JavaScript module formats, especially since HTML Imports are currently very contentious and Google are the only ones who are pushing for it.
- Skate supports JSPM, NPM and more. Polymer currently [only supports Bower](https://github.com/Polymer/polymer/issues/2578).



### VS X-Tags

Skate is very close to X-Tags in terms of API shape, however, it is very different in the way it is applied and shares a lot of the same differences with X-Tags as it does with Polymer.

- Skate uses a functional programming model for rendering in which you can use any templating language you want that compiles down to Incremental DOM. X-Tags is not very opinionated about rendering or templating. You define a string of HTML and it will use that as the component's content.
- Skate's property API is thorough and extensible. We provide implementations or commonly used property patterns and give you an API to easily write your own reusable properties.
- Skate is about the same size and scales well for building large, complex user interfaces.
- There's no mutating your component's DOM from property accessors which can become unwieldy.



### VS React

React has definitely had an influence on Skate. That said, they're completely different beasts, only sharing a functional rendering pipeline and some aspects of the API.

- React is 10x the size of Skate.
- In the performance tests you can see a Skate component is several times faster than a similarly written React component.
- **Skate is written on top of W3C standards.** The React authors have been [very vocal](https://github.com/facebook/react/issues/5052) about this. However, the response to that issue is incorrect. Web Components by nature are declarative: it's just HTML. Web Components also completely solve the integration problems between libraries and frameworks due to the nature of how Custom Elements and Shadow DOM work: Custom Elements provide a declarative API, Shadow DOM hides the implementation details. When integrating with frameworks, you're just writing HTML. In terms of the problems with imperative APIs, it's not the fault of Web Components that force a user to call a method, it's the fault of the design of the Web Component. There's nothing stopping a Web Component from being completely declarative, especially if it's written in Skate. More information about [web component design](#declarative).
- We have plans to support server-side rendering.



## Preventing FOUC

An element may not be initialised right away if your definitions are loaded after the document is parsed. In native custom elements, you can use the `:defined` pseudo-class to select all elements that have been upgraded, thus allowing you to do `:not(:defined)` to invert that. Since that only works in native, Skate adds a `defined` attribute so that you have a cross-browser way of dealing with FOUC and jank.

```css
my-element {
  opacity: 1;
  transition: opacity .3s ease;
}
my-element:not([defined]) {
  opacity: 0;
}
```




## Designing Web Components

A web component's public API should be available both imperatively (via JavaScript) and declaratively (via HTML). You should be able to do everything in one, that you can do in the other within reason.



### Imperative

You should always try and make the constructor available whether it's exported from an ES2015 module or a global:

```js
class MyComponent extends skate.Component {}
customElements.define('my-component', MyComponent);
export default MyComponent;
```



### Declarative

By declaring a Skate component, you are automatically making your element available to be used as HTML. For example, if you were to create a custom element for a video player:

```js
customElements.define('x-video', class extends skate.Component {});
```

You could now just write:

```html
<x-video></x-video>
```

Instead of providing just imperative methods - such as `play()` for the native `<video>` element - you should try to provide attributes that offer the same functionality. For example, if you had a player component, you could offer a `playing` boolean attribute, so that it starts playing when it's put on the page.

```html
<x-video playing></x-video>
```

To pause / stop the player, you remove the attribute.

```html
<x-video></x-video>
```

If you're using something like React or Skate to render this component, you don't have to write any imperative code to remove that attribute as the virtual DOM implementations will do that for you.

The nice part about thinking this way is that you get both a declarative and imperative API for free. You can think about this in simpler terms by designing your API around attributes rather than methods.



### Naming Collisions

You may write a component that you change in a backward incompatible way. In order for your users to upgrade, they'd have to do so all at once instead of incrementally if you haven't given the new one a different name. One option is to choose a different name for your component, but that may not be ideal. You could also use `skate.define()` to ensure the name is unique. An ideal solution would be to only export your constructor and let the consumer register it.

```js
export default class extends skate.Component {
  renderCallback () {
    return skate.h('div', `This element has been called: ${this.tagName}.`);
  }
}
```



### Compatible with multiple versions of itself

Skate is designed so that you can have multiple versions of it on the same page. This is so that if you have several components, your upgrades and releases aren't coupled. If you have a UI library based on Skate and those consuming your library also have Skate, your versions aren't coupled.



### Properties and Attributes

Properties and attributes should represent as much of your public API as possible as this will ensure that no matter which way your component is created, its API remains as consistent as the constraints of HTML will allow. You can do this by ensuring your properties have corresponding attributes:

```js
customElements.define('my-component', class extends skate.Component {
  static get props () {
    return {
      // Links the `name` property to the `name` attribute.
      name: { attribute: true }
    };
  }
});
```

Sometimes this may not be viable, for example when passing complex data types to attributes. In this scenario, you can try and serialize / deserialize to / from attributes. For example, if you wanted to take a comma-separated list in an attribute and have the property take an array, but still have them linked, you could do something like:

```js
customElements.define('my-component', class extends skate.Component {
  static get props () {
    return {
      values: {
        attribute: true,
        deserialize (val) {
          return val.split(',');
        },
        serialize (val) {
          return val.join(',');
        }
      }
    };
  }
});
```



### Private Members

Skate doesn't have any opinions on how you store or use private methods and properties on your elements. Classically, one would normally use scoped functions or underscores to indicate privacy:

```js
function scoped(elem) {}

customElements.define('my-component', class extends skate.Component {
  constructor () {
    super();
    scoped(this);
    this._privateButNotReally();
  }
  _privateButNotReally() {}
});
```

With ES2015, another pattern for "private" members is to use [symbol-keyed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) properties:

```js
const sym = Symbol();

customElements.define('my-component', class extends skate.Component {
  constructor () {
    super();
    this[sym]();
  }
  [sym]() {

  }
});
```

Note these also are not truly private, as they're discoverable via reflection.

### Private Data

A slightly different use-case than using private members would be storing private data. As with members, you can use scoped variables or underscores. However, scoped variables generally aren't specific to an element instance and underscores are only a privacy guideline; anyone can still access the data.

The best way to do this depends on your needs. Generally a `WeakMap` is a good choice as it will hold weak references to the key:

```js
const map = new WeakMap();

customElements.define('my-component', class extends skate.Component {
  constructor () {
    map.set(this, 'some data');
  },
  renderCallback () {
    // Renders: "<div>some data</div>"
    return skate.h('div', map.get(this));
  }
});
```

You can also use symbols on your element just like we did above with standard methods and properties, if that suits your workflow better.



## React Integration

There is a [React integration library](https://github.com/webcomponents/react-integration) that allows you to write web components - written with any *true* web component library - and convert them to react components using a single function. Once converted, it can be used in React just like you would use a normal React component.



## Form Behaviour and the Shadow DOM



### Submission

When you encapsulate a form, button or both inside a shadow root, forms will *not* be submitted when the submit button is clicked. This is because the shadow boundary prevents each shadow root from communicating with each other. Fortunately this isn't very difficult to wire up.

Let's say we have a custom form and custom button (to reproduce, only one of them would need to be contained in a shadow root):

```js
<x-form>
  <x-button type="submit">Submit</x-button>
</x-form>
```

The definitions look like the following:

```js
customElements.define('x-form', class extends skate.Component {
  renderCallback () {
    return (
      <form>
        <slot />
      </form>
    );
  }
});

customElements.define('x-button', class extends skate.Component {
  renderCallback () {
    return (
      <button>
        <slot />
      </button>
    );
  }
});
```

To wire this up we listen for clicks coming from something that has a `type` of `"submit"`. You can also check for type, but for the sake of simplicity, we'll just check for `type`:

```js
function onClick (e) {
  if (e.target.getAttribute('type') === 'submit') {
    // do something submitty
  }
}
```

Now all you need to do is put that on the `<form>` inside of `<x-form>`:

```js
<form { onClick }>
```

You cane take this a step further and emit a `submit` event on the form and call `submit()` on it if the event wasn't canceled:

```js
function onClick (e) {
  if (e.target.getAttribute('type') === 'submit') {
    if (skate.emit(e.currentTarget, 'submit')) {
      e.currentTarget.submit();
    }
  }
}
```

The full example looks like:

```js
function onClick (e) {
  if (e.target.getAttribute('type') === 'submit') {
    if (skate.emit(e.currentTarget, 'submit')) {
      e.currentTarget.submit();
    }
  }
}

customElements.define('x-form', class extends skate.Component {
  renderCallback () {
    return (
      <form { onClick }>
        <slot />
      </form>
    );
  }
});

customElements.define('x-button', class extends skate.Component {
  renderCallback () {
    return (
      <button>
        <slot />
      </button>
    );
  }
});
```



### Form Data

The idea that built-in form elements don't publish their form-data when inside a shadow root is [being discussed](https://github.com/w3c/webcomponents/issues/187).

In order to handle this, your custom form would need to gather all the form data associated with it and submit it along with its request.



## Stateless Components

If you write a component that manages its props internally, this is called a "smart component"; very much the same as in React. There's many ways you can write components and separate them out in to smart / dumb components. You can then compose the dumb one in the smart one, reusing code while separating concerns.

However, there is one way where you can write a smart component and it can be made "dumb" as part of its API by emitting an event that allows any listeners to optionally prevent it from updating, or to simply update it with new props that it should render with.

```js
customElements.define('x-component', class extends skate.Component {
  updatedCallback (prev) {
    // Notify any listeners that the component updated. At this point the
    // listener can update the component's props without fear that this will
    // cause recursion - because it's prevented internally - and it will
    // proceed past this point with the updated props.
    const canRender = skate.emit(this, 'updated', { detail: prev });

    // This can be custom, or just reuse the default implementation. Since we
    // emitted the event and listeners had a chance to update the component,
    // this will get called with the updated state.
    return canRender && super.updatedCallback(prev);
  }
});
```

The previous example emits an event that bubbles and is cancelable. If it is canceled, then the component does not render. If the listening component updates the component's props in response to the event, the component will render with the updated props if it passes the default `updatedCallback()` check.



## Styling Components

In order to style your components, you should assume Shadow DOM encapsulation. The best-practice here is to simply put styles into a `<style>` block:

```js
customElements.define('x-component', class extends skate.Component {
  renderCallback () {
    return [
      skate.h('style', '.my-class { display: block; }'),
      skate.h('div', { class: 'my-class' }),
    ];
  }
});
```

If you want to ensure your styles are encapsulated even if using a polyfill, you can use something like [CSS Modules](https://github.com/css-modules/css-modules).
