# Skate

[![Build Status](https://travis-ci.org/skatejs/skatejs.svg?branch=master)](https://travis-ci.org/skatejs/skatejs)
[![Join the chat at https://gitter.im/skatejs/skatejs](https://badges.gitter.im/skatejs/skatejs.svg)](https://gitter.im/skatejs/skatejs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/skatejs.svg)](https://saucelabs.com/u/skatejs)

Skate is a library built on top of the [W3C web component specs](https://github.com/w3c/webcomponents) that enables you to write functional and performant web components with a very small footprint.

- Functional rendering pipeline backed by Google's [Incremental DOM](https://github.com/google/incremental-dom).
- Inherently cross-framework compatible. For example, it works seamlessly with - and complements - React and other frameworks.
- It's only 7k min+gz and it will only get smaller as more browsers start supporting web components natively.
- It's very fast.
- It works with multiple versions of itself on the page, if need be.



HTML

```html
<x-hello name="Bob"></x-hello>
```

JavaScript

```js
skate.define('x-hello', {
  props: {
    name: { attribute: true }
  },
  render (elem) {
    skate.vdom.text(`Hello, ${elem.name}`);
  }
});
```

Result

```html
<x-hello name="Bob">Hello, Bob!</x-hello>
```

Whenever you change the `name` property - or attribute - the component will re-render, only changing the part of the DOM that requires updating.



## Dependencies

Skate doesn't require you provide any external dependencies, but recommends you provide polyfills depending on what browsers you require support for.



### Custom Elements

Skate requires Custom Element support. In [browsers that don't support it](http://caniuse.com/#search=custom%20elements), you'll need to include a polyfill. Skate supports both v0 and v1 custom elements and normalises necessary behaviour between both.

- v0: https://github.com/webcomponents/webcomponentsjs
- v1 (work in progress in src/CustomElements/v1): https://github.com/webcomponents/webcomponentsjs/tree/v1

Skate prefers v0 support if it detects both as that yields the best performance in browsers that support it natively. If you supply only a v1 polyfill, it will use v0 where supported by native and v1 in other browsers.



### Shadow DOM

Skate works with or without [Shadow DOM](http://w3c.github.io/webcomponents/spec/shadow/) support. However, it works best with it so it's recommended you use a polyfill for [browsers](http://caniuse.com/#search=shadow%20dom) that don't support it natively. Skate supports both v0 and v1 shadow DOM APIs.

- v0 (slow, but complete): https://github.com/WebComponents/webcomponentsjs
- v1 (partial support, built for speed and virtual DOM integration, see README: https://github.com/skatejs/named-slots/

Without native support and if you do not supply a Shadow DOM polyfill, any components that have a `render()` function may cause issues integrating with React and other virtual DOM-based libraries (such as Skate itself) because the shadow DOM hides changes that are made to the components during `render()`. If no Shadow DOM support is available, your component renders directly to the host element rather than to the shadow root. This means your component will work fine on its own, but may fail when composed into other libraries.



## Documentation

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


  - [Installing](#installing)
    - [UMD (AMD / CommonJS)](#umd-amd--commonjs)
    - [ES6 Modules](#es6-modules)
    - [Global](#global)
  - [Examples](#examples)
  - [Resources](#resources)
  - [Questions?](#questions)
  - [Terminology](#terminology)
  - [API](#api)
    - [`define(name, definition)`](#definename-definition)
      - [`prototype`](#prototype)
      - [`events`](#events)
        - [Event Delegation](#event-delegation)
      - [`created`](#created)
      - [`props`](#props)
        - [`attribute`](#attribute)
        - [`coerce`](#coerce)
        - [`default`](#default)
        - [`deserialize`](#deserialize)
        - [`event`](#event)
        - [`get`](#get)
        - [`initial`](#initial)
        - [`serialize`](#serialize)
        - [`render`](#render)
        - [`set`](#set)
      - [`render`](#render-1)
      - [`ready`](#ready)
      - [`attached`](#attached)
      - [`detached`](#detached)
      - [`attributeChanged`](#attributechanged)
      - [`observedAttributes`](#observedattributes)
      - [`definedAttribute`](#definedattribute)
    - [`emit (elem, eventName, eventOptions = {})`](#emit-elem-eventname-eventoptions--)
      - [Preventing Bubbling or Canceling](#preventing-bubbling-or-canceling)
      - [Passing Data](#passing-data)
    - [`factory (componentDefinition)`](#factory-componentdefinition)
    - [`link (elem, propSpec)`](#link-elem-propspec)
    - [`prop`](#prop)
      - [`array`](#array)
      - [`boolean`](#boolean)
      - [`number`](#number)
      - [`string`](#string)
    - [`ready (element, callback)`](#ready-element-callback)
      - [Background](#background)
      - [The problem](#the-problem)
      - [The solution](#the-solution)
      - [Drawbacks](#drawbacks)
    - [`state (elem[, state])`](#state-elem-state)
    - [`symbols`](#symbols)
      - [`shadowRoot`](#shadowroot)
    - [`vdom`](#vdom)
      - [`vdom (elementName, attributesOrChildren, children)`](#vdom-elementname-attributesorchildren-children)
      - [Named Slots](#named-slots)
      - [Special Attributes](#special-attributes)
        - [`attrs.class`](#attrsclass)
        - [`attrs.key`](#attrskey)
        - [`attrs.on*`](#attrson)
        - [`attrs.skip`](#attrsskip)
        - [`attrs.statics`](#attrsstatics)
        - [Boolean Attributes](#boolean-attributes)
      - [Using JSX and other templating languages](#using-jsx-and-other-templating-languages)
  - [Component Lifecycle](#component-lifecycle)
  - [Extending Elements](#extending-elements)
  - [Asynchrony](#asynchrony)
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
  - [React Integration](#react-integration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Resources

- [Web Platform Podcast: Custom Elements & SkateJS](http://thewebplatformpodcast.com/66-custom-elements-skatejs)
- [SydJS: Skating with Web Components](http://slides.com/treshugart/skating-with-web-components#/)
- [SydJS: Still got your Skate on](http://slides.com/treshugart/still-got-your-skate-on#/)



## Questions?

If you have any questions about Skate you can use one of these:

- [Gitter](https://gitter.im/skatejs/skatejs)
- [HipChat](https://www.hipchat.com/gB3fMrnzo)



## Terminology

Let's define some terms used in these docs:

- v0 - the original Blink implementation of web components - when the spec was still contentious.
- v1 - the non-contentious - modern-day - specs.
- polyfill, polyfilled, polyfill-land - not v0 or v1; no native custom element support at all.
- upgrade, upgraded, upgrading - when an element is initialised as a custom element.



## Installing

Using package managers:

```sh
jspm install npm:skatejs
npm install skatejs
```

Or you can DIY by downloading the zip.



## Consuming

Skate can be consumed in the following ways:

Global:

```js
window.skate;
```

AMD:

```js
require(['skatejs'], function (skate) {});
```

CommonJS

```js
const skate = require('skatejs');
```

ES2015:

```js
import * as skate from 'skatejs';
```

Each API point is accessible on the main `skate` object, or can be imported by name in ES2015:

```js
import { define, vdom } from 'skatejs';
```



## API



### `define(name, definition)`

The `name` is a string that is the tag name of the custom element that you are creating. It must be a "valid custom element name" as specified [in the spec](http://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts). For example, `my-component`, is a valid custom element name.

The `definition` argument is a class / constructor or object literal of component definition to use for your custom element. The recommended way is to use ES2015 classes:

```js
import { Component, define } from 'skatejs';

const MyComponent = define('my-component', class extends Component {});
```

A simpler way, especially for ES5 users, would be to just pass an object literal.

```js
import { define } from 'skatejs';

const MyComponent = define('my-component', {});
```

Using this method will automatically extend the base `Component` for you.

This is exactly the same thing as doing:

```js
import { Component, define } from 'skatejs';

const MyComponent = define('my-component', Component.extend({}));
```

You can also use `Component.extend()` to eliminate the boilerplate of extending base classes in ES5:

```js
import { Component, define } from 'skatejs';

const MyComponent1 = define('my-component-1', {});
const MyComponent2 = define('my-component-2', MyComponent1.extend({});
```

Whichever method you use, `define()` will return you a constructor you can use to create a new instance of your element:

```js
const myElement = new MyComponent();
```



#### `prototype`

The element's prototype. This is the first thing that happens in the element's lifecycle.

```js
skate.define('my-component', {
  prototype: {
    get someProperty () {},
    set someProperty () {},
    someMethod () {},
  }
});
```



#### `events`

Event listeners to add to the custom element. These get bound after the `prototype` is set up and before `created` is called.

```js
skate.define('my-component', {
  events: {
    click (elem, eventObject) {}
  }
});
```

The arguments passed to the handler are:

- `elem` is the DOM element
- `eventObject` is the native event object that was dispatched on the DOM element



##### Event Delegation

Event descriptors can use selectors to target descendants using event delegation.

```js
skate.define('my-component', {
  events: {
    'click button' (elem, eventObject) {}
  }
});
```

Instead of firing for every click on the component element - or that bubbles to the component element - it will only fire if a descendant `<button>` was clicked.

Event delegation works with or without a shadow root as it will inspect the event `path` if it exists.



#### `created`

Function that is called when the element is created. This corresponds to the native `createdCallback` (v0) or `constructor` (v1). We don't use `constructor` here because Skate does a lot of automation in it and thus offers this as a way to hook into that part of the lifecycle. It is the first lifecycle callback that is called and is called after the `prototype` is set up.

```js
skate.define('my-component', {
  created (elem) {}
});
```

The only argument passed to `created` is component element. In this case that is `<my-component>`.



#### `props`

Custom properties that should be defined on the element. These are set up after the `created` lifecycle callback is called.

```js
skate.define('my-component', {
  props: { ...props }
});
```

The custom property definition accepts the following options.



##### `attribute`

Whether or not to link the property to an attribute. This can be either a `Boolean` or `String`.

- If it's `false`, it's not linked to an attribute. This is the default.
- If it's `true`, the property name is dash-cased and used as the attribute name it should be linked to.
- If it's a `String`, the value is used as the attribute name it should be linked to.

```js
skate.define('my-component', {
  props: {
    myProp: {
      attribute: true
    }
  }
});
```

*When you declare a linked attribute, it automatically adds this attribute to the list of `observedAttributes`.*



##### `coerce`

A function that coerces the incoming property value and returns the coerced value. This value is used as the internal value of the property.

```js
skate.define('my-component', {
  props: {
    myProp: {
      coerce (value) {
        return value;
      }
    }
  }
});
```

The parameters passed to the function are:

- `value` - the value that should be coerced



##### `default`

Specifies the default value of the property. If the property is ever set to `null` or `undefined`, instead of being empty, the `default` value will be used instead.

```js
skate.define('my-component', {
  props: {
    myProp: {
      default: 'default value'
    }
  }
});
```

You may also specify a function that returns the default value. This is useful if you are doing calculations or need to return a reference:


```js
skate.define('my-component', {
  props: {
    myProp: {
      default (elem, data) {
        return [];
      }
    }
  }
});
```

The parameters passed to the function are:

- `elem` - the component element
- `data` - an object containing information about the property
  - `name` - the property name



##### `deserialize`

A function that coerces the property value to a `String` so that it can be set to the linked attribute, if it is linked.

```js
skate.define('my-component', {
  props: {
    myProp: {
      deserialize (value) {
        return value ? value.toString() : '';
      }
    }
  }
});
```

The parameters passed to the function are:

- `value` - the property value that needs to be coerced to the attribute value.



##### `event`

An event name to trigger whenever the property changes. This event is cancelable, and does not bubble.

```js
skate.define('my-component', {
  props: {
    myProp: {
      event: 'my-prop-changed'
    }
  }
});
```

By default, no events are triggered.



##### `get`

A function that is used to return the value of the property. If this is not specified, the internal property value is returned.

```js
skate.define('my-component', {
  props: {
    myProp: {
      get (elem, data) {
        return `prefix_${data.internalValue}`;
      }
    }
  }
});
```

The parameters passed to the function are:

- `elem` - the component element
- `data` - an object containing information about the property
  - `name` - the property name
  - `internalValue` - the current internal value of the property



##### `initial`

The initial value the property should have. This is different from `default` in the sense that it is only ever invoked once to set the initial value. If this is not specified, then `default` is used in its place.

```js
skate.define('my-component', {
  props: {
    myProp: {
      initial: 'initial value'
    }
  }
});
```

It can also be a function that returns the initial value:

```js
skate.define('my-component', {
  props: {
    myProp: {
      initial (elem, data) {
        return 'initial value';
      }
    }
  }
});
```

The parameters passed to the function are:

- `elem` - the component element
- `data` - an object containing information about the property
  - `name` - the property name



##### `serialize`

A function that coerces the attribute value back to the property value, if it is linked.

```js
skate.define('my-component', {
  props: {
    myProp: {
      deserialize (value) {
        return value ? value.toString() : '';
      }
    }
  }
});
```

The parameters passed to the function are:

- `value` - the attribute value that needs to be coerced to the property value.



##### `render`

```js
skate.define('my-component', {
  props: {
    myProp: {
      render (elem, data) {
        return data.newValue !== data.oldValue;
      }
    }
  },
  render (elem) {
    skate.vdom.element('div', elem.myProp);
  }
});
```

The property `render()` function is called before re-rendering the component. If must return `true` in order for a re-render to occur. If you specify a `boolean` instead of a function for this option, then `true` will always re-render and `false` will never re-render. This option defaults to a `function` that returns true if `oldValue` is `!==` to `newValue` and `false` otherwise.

If you do not specify a component `render()` function, then this option is ignored.



##### `set`

A function that is called whenever the property is set. This is also called when the property is first initialised.

```js
skate.define('my-component', {
  props: {
    myProp: {
      set (elem, data) {
        // do something
      }
    }
  }
});
```

The parameters passed to the function are:

- `elem` - the component element
- `data` - an object containing information about the property
  - `name` - the property name
  - `newValue` - the new property value
  - `oldValue` - the old property value.

When the property is initialised, `oldValue` will always be `undefined` and `newValue` will correspond to the initial value. If the property is set to `null` or `undefined`, the value is normalised to be `undefined` for consistency.

*An important thing to note is that native property setters are not invoked if you use the `delete` keyword. For that reason, Skate property setters are also not able to be invoked, so keep this in mind when using your components.*




#### `render`

Function that is called to render the element. This is called when the element is first created and on subsequent property updates if the property `render()` function returns true.

```js
skate.define('my-component', {
  render (elem) {
    skate.vdom.element('p', `My name is ${elem.tagName}.`);
  }
});
```

The only argument passed to `render` is the component element. In this case that is `<my-component>`.

*On initial creation, `render()` is called synchronously. However, when you set a property it is rendered asynchronously so that multiple property sets only cause a single render to occur.*



#### `ready`

Function that is called after the element has been rendered for the first time (see `render`).

```js
skate.define('my-component', {
  ready (elem) {}
});
```

The only argument passed to `ready` is component element. In this case that is `<my-component>`.



#### `attached`

Function that is called after the element has been inserted to the document. This corredsponds to the native `attachedCallback`. This can be called several times, for example, if you were to remove the element and re-insert it.

```js
skate.define('my-component', {
  attached (elem) {}
});
```

The only argument passed to `attached` is component element. In this case that is `<my-component>`.



#### `detached`

Function that is called after the element has been removed from the document. This corredsponds to the native `detachedCallback`. This can be called several times, for example, if you were to remove the element, re-attach it and the remove it again.

```js
skate.define('my-component', {
  detached (elem) {}
});
```

The only argument passed to `detached` is component element. In this case that is `<my-component>`.



#### `attributeChanged`

Function that is called whenever an attribute is added, updated or removed. This corresponds to the native `attributeChangedCallback` (both v0 and v1). Generally, you'll probably end up using `props` that have linked attributes instead of this callback, but there are still use cases where this could come in handy.

```js
skate.define('my-component', {
  attributeChanged (elem, data) {
    if (data.oldValue === undefined) {
      // created
    } else if (data.newValue === undefined) {
      // removed
    } else {
      // updated
    }
  }
});
```

The arguments passed to the `attributeChanged()` callback differ from the native `attributeChangedCallback()` to provide consistency and predictability with the rest of the Skate API:

- `elem` is the component element
- `data` is an object containing attribute `name`, `newValue` and `oldValue`. If `newValue` and `oldValue` are empty, the values are `undefined`.

There are differences between v0 and v1 that Skate normalises to behave like v1. In v0:

1. The `attributeChangedCallback()` is *not* invoked for every attribute that exists on the element at the time of upgrading.
2. You can call `setAttribute()` at any point in the element lifecycle and it will queue a call to it.

In v1:

1. The `attributeChangedCallback()` *is* invoked for every attribute that exists on the element at the time of creation.
2. Only once the constructor has been called and `attributeChangedCallback()` invoked for each existing attribute, can calls to `setAttribute()` begin to queue calls to `attributeChangedCallback()`.



#### `observedAttributes`

This behaves exactly like described in the [v1 spec](http://w3c.github.io/webcomponents/spec/custom/#custom-elements-autonomous-example).

For example, the following:

```js
skate.define('my-component', {
  observedAttributes: ['some-attribute'],
  attributeChanged () {}
});
```

Could similarly be written as:

```js
skate.define('my-component', {
  props: {
    someAttribute: { attribute: true }
  }
});
```

The differences being that as a result of defining it as a property, it is now linked to an attribute and will cause a re-render. If you only want to observe attribute changes within the `attributeChanged()` callback, then that is totally valid.

*Observing attributes directly using `observedAttributes` doesn't make sense without specifying an `attributeChanged()` callback.*



#### `definedAttribute`

The name of the attribute that is added to the element after it has been upgraded.

```html
<my-component defined />
```



### `emit (elem, eventName, eventOptions = {})`

Emits a `CustomEvent` on `elem` that `bubbles` and is `cancelable` by default. This is useful for use in components that are children of a parent component and need to communicate changes to the parent.

```js
skate.define('x-tabs', {
  events: {
    selected: hideAllAndShowSelected
  }
});

skate.define('x-tab', {
  events: {
    click () {
      skate.emit(this, 'selected');
    }
  }
});
```

It's preferrable not to reach up the DOM hierarchy because that couples your logic to a specific DOM structure that the child has no control over. To decouple this so that your child can be used anywhere, simply trigger an event.

*Note that events cannot be triggered with `skate.emit()` on disabled elements. Events also can't bubble through disabled elements.*

The return value of `emit()` is the same as [`dispatchEvent()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent).



#### Preventing Bubbling or Canceling

If you don't want the event to bubble, or you don't want it to be cancelable, then you can specify those options in the `eventOptions` argument.

```js
skate.emit(elem, 'event', {
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



### `factory (componentDefinition)`

The `factory()` function gives you a way to define a custom element without defining its name. This is useful because it allows your consumers to decide which name your component should have. This is also effective in maintaining UI components that may have breaking changes made to them as you don't have to change their global name in order to have multiple versions of them on the same page. It can be up to your consumers to decide how they want to do that based on how they're using them.

```js
const myComponentFactory = skate.factory({ ... });
const ComponentConstructor = myComponentFactory('my-component');
const myElementInstance = new ComponentConstructor();
```



### `link (elem, propSpec)`

The `link()` function returns a function that you can bind as an event listener. The handler will take the event and propagte the changes back to the host element. This essentially allows for 2-way data-binding but is safer as the propagation of the user input value back to the component element will trigger a re-render ensuring all dependent UI is up to date.

```js
skate.define('my-input', function () {
  props: {
    value: { attribute: true }
  },
  render (elem) {
    skate.vdom.element('input', { onchange: skate.link(elem), type: 'text' });
  }
});
```

By default the `propSpec` defaults to `e.currentTarget.getAttribute('name')` or `"value"` which is why it wasn't specified in the example above. In the example above, it would set `value` on the component. If you were to give your input a name, it would use the name from the event `currentTarget` as the name that should be set. For example if you changed your input to read:

```js
skate.vdom.element('input', { name: 'someValue', onchange: skate.link(elem), type: 'text' });
```

Then instead of setting `value` on the component, it would set `someValue`.

You may explicitly set the property you would like to set by specifying a second argument to `link()`:

```js
skate.link(elem, 'someValue')
```

The above link would set `someValue` on the component.

You can also use dot-notation to reach into objects. If you do this, the top-most object will trigger a re-render of the component.

```js
skate.link(elem, 'obj.someValue')
```

In the above example, the `obj` property would trigger an update even though only the `someValue` sub-property was changed. This is so you don't have to worry about re-rendering.

You can even take this a step further and specify a sub-object to modify using the name of the `currentTarget` (or `value`, of course) if `propSpec` ends with a `.`. For example:

```js
skate.vdom.element('input', { name: 'someValue', onchange: skate.link(elem, 'obj.'), type: 'text' });
```

The above example would set `obj.someValue` because the name of the input was `someValue`. This doesn't look much different from the previous example, but this allows you to create a single link handler for use with multiple inputs:

```js
const linkage = skate.link(elem, 'obj.');
skate.vdom.element('input', { name: 'someValue1', onchange: linkage, type: 'text' });
skate.vdom.element('input', { name: 'someValue2', onchange: linkage, type: 'checkbox' });
skate.vdom.element('input', { name: 'someValue3', onchange: linkage, type: 'radio' });
skate.vdom.element('select', { name: 'someValue4', onchange: linkage }, function () {
  skate.vdom.element('option', { value: 2 }, 'Option 2');
  skate.vdom.element('option', { value: 1 }, 'Option 1');
});
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

Generally built-in properties will only return a definition containing `coerce`, `deserialize` and `serialize` options. They may also define a `deafult`, such as with the `boolean` property.

*Empty values are defined as `null` or `undefined`. All empty values, if the property accepts them, are normalised to `undefined`.

*Properties are only linked to attributes if the `attribute` option is set. Each built-in property, if possible, will supply a `deserialize` and `serialize` option but will not be linked by default.*



#### `array`

The `array` property ensures that any value passed to the property is an array. Serialisation and deserialisation happen using `JSON.stringify()` and `JSON.parse()`, respectively, if the property is linked to an attribute.



#### `boolean`

The `boolean` property allows you to define a property that should *always* have a boolean value to mirror the behaviour of boolean properties / attributes in HTML. By default it is `false`. If an empty value is passed, then the value is `false`. If a boolean property is linked to an attribute, the attribute will have no value and its presence indicates whether or not it is `true` (present) or `false` (absent).



#### `number`

Ensures the value is always a `Number` and is correctly linked to an attribute. Empty values are not coerced to Numbers. If a value cannot be coerced then it is `NaN`.



#### `string`

Ensures the value is always a `String` and is correctly linked to an attribute. Empty values are not coerced to strings.



### `ready (element, callback)`

The `skate.ready()` function should not be confused with the `ready` lifecycle callback. The lifecycle callback is called when the component element is ready to be worked with. It means that it's been templated out and all properties have been set up completely. It does not mean, however, that descendant components have been initialised.



#### Background

You maybe thinking "that sucks, why wouldn't they have been initialised?" That's a very good question. In order to realise the problem, we must first know how native custom elements behave.

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

In this example, we are loading `component-a` before `component-b` and the same order will apply. *However*, if you flip that around so that `component-b` is loaded before `component-a`, then `component-b` will be initialised first. This is because when a definition is registered via `document.registerElement()`, it will look for elements to upgrade *immediately*.



#### The problem

If you want `component-a` to be able to rely on `component-b` being initialised, you'd have to put some constraints on your consumers:

- If you're running native, you must load your definitions at the bottom of the page. You must also ensure that you're loading `component-b` before `component-a`. You could use a module loader to ensure `component-b` is imported by `component-a`, but you still have the constraint of making the consumer load the definitions at the bottom of the page.
- If you're running in polyfill land, just make sure that you load `component-b` before `component-a`. As above, you could just use a module loader for this.

The problem here is that your consumer is now concerned with implementation details and have constraints placed on them that they shouldn't have to worry about.



#### The solution

If you need to interact with components that may not be initialised yet (at any level), you can use `skate.ready()`. It works for both native and polyfill no matter when the element is upgraded.

```js
skate.define('component-a', {
  ready (elem) {
    const b = elem.querySelector('component-b');

    // Would be `undefined` because it's not defined yet.
    b.initialised;

    // Your selected elements are passed to the callback as the first argument.
    skate.ready(b, function (b) {
      // Will now be `true`, for sure.
      b.initialised;
    });
  },
  render (elem) {
    skate.vdom.element('component-b');
  }
});

skate.define('component-b', {
  created (elem) {
    elem.initialised = true;
  }
});
```



#### Drawbacks

This does not solve the situation where you want to be notified of future elements that may be added somewhere in your descendant DOM. That is more a concern of what API you choose to expose to your consumers, the rendering path you choose and the problem you're trying to solve. This only concerns itself with the descendant nodes that you *know* exist. Most of the time this will come from the `render` lifecycle callback.



### `state (elem[, state])`

The `state` function is a getter or setter depending on if you specify the second `state` argument. If you do not provide `state`, then the current state of the component is returned. If you pass `state`, then the current state of the component is set. When you set state, the component will re-render synchronously only if it needs to be re-rendered.

Component state is derived from the declared properties. It will only ever return properties that are defined in the `props` object. However, when you set state, whatever state you specify will be set even if they're not declared in `props`.

```js
import { define, state } from 'skatejs';

const Elem = define('my-element', {
  props: {
    prop1: null
  }
});
const elem = new Elem();

// Set any property you want.
state(elem, {
  prop1: 'value 1',
  prop2: 'value 2'
});

// Only returns props you've defined on your component.
// { prop1: 'value 1' }
state(elem);
```



### `symbols`

Symbols are exposed for you to access information that stored on objects that are not otherwise accessible.

#### `shadowRoot`

When a component renders for the first time, it creates a new shadow root - if it can - and stores this shadow root on the element using this symbol. If a shadow root cannot be created, this returns the element itself.

```js
import { define, symbols, vdom } from 'skatejs';

define('my-component', {
  render () {
    vdom.element('p', 'test');
  },
  ready (elem) {
    // #shadow-root
    //   <p>test</p>
    elem[symbols.shadowRoot];
  }
});
```



### `vdom`

Skate includes several helpers for creating virtual elements with Incremental DOM.

#### `vdom (elementName, attributesOrChildren, children)`

The `elementName` argument is the name of the element you want to create. This can be a string or function that has the `id` or `name` property set, which makes it compatible with any function as well as Skate component constructors (that use `id` because WebKit doesn't let you re-define `name`).

The `attributesOrChildren` argument is either an `object`, a `function` that will render the children for this element or a `string` if you only want to render a text node as the children.

The `children` argument is a `function` that will render the children of this element or a `string` if you are only rendering text.

```js
skate.vdom.element('select', { name: 'my-select' }, function () {
  skate.vdom.element('option', { value: 'myval' }, 'My Value');
});
```

#### Text Nodes

The `text()` function is exported directly from Incremental DOM and you could use that if you wanted to instead of specifying text as a string to a parent node:

```js
skate.vdom.element('option', { name: 'my-select' }, function () {
  skate.vdom.element('option', { value: 'myval' }, function () {
    skate.vdom.text('My Value');
  });
});
```

This is very useful if you need to render text with other elements as siblings, or do complex conditional rendering. It's also useful when your custom element may only need to render text nodes to its shadow root.

#### Special Attributes

Skate adds some opinionated behaviour to Incremental DOM.

##### `attrs.class`

We ensure that if you pass the `class` attribute, that it sets that via the `className` property.

##### `attrs.key`

This gives the virtual element a [`key`](http://google.github.io/incremental-dom/#conditional-rendering/array-of-items) that Incremental DOM uses to keep track of it for more efficient patches when dealing with arrays of items.

```js
skate.vdom.element('ul', function () {
  skate.vdom.element('li', { key: 0 });
  skate.vdom.element('li', { key: 1 });
});
```

##### `attrs.on*`

Any attribute beginning with `on` will be bound to the event matching the part found after `on`. For example, if you specify `onclick`, the value will be bound to the `click` event of the element.

```js
skate.vdom.element('button', { onclick: e => console.log(e) }, 'Click me!');
```

You can also bind to custom events:

```js
skate.vdom.element('my-element', { onsomecustomevent: e => console.log(e) });
```

##### `attrs.skip`

This tells Incremental DOM to skip the element that has this attribute. This is automatically applied when `slot()` is called as the slotted elements will be managed by the parent component, not by the current diff tree. Elements that have this attribute cannot have children.

This is also helpful when integrating with 3rd-party libraries that may mutate the DOM.

```js
skate.vdom.element('div', { skip: true });
```

##### `attrs.statics`

This is an array that tells Incremental DOM which attributes should be considered [static](http://google.github.io/incremental-dom/#rendering-dom/statics-array).

```js
skate.vdom.element('div', { statics: ['attr1', 'prop2'] });
```

##### Boolean Attributes

If you specify `false` as any attribute value, the attribute will not be added, it will simply be ignored.

#### Using JSX and other templating languages

The `vdom` module is provided for a simple way to write virtual DOM using only functions. If you don't want to do that, you can use any templating language that compiles down to Incremental DOM calls.

If you wanted to use JSX, for example, you'd have to add support for compiling JSX down to Incremental DOM calls. This can be done using the following modules:

- https://github.com/thejameskyle/incremental-dom-react-helper
- https://github.com/jridgewell/babel-plugin-incremental-dom

Once that is set up, you may write a component using JSX. For example, a simple blog element may look something like:

```js
skate.define('my-element', {
  props: {
    title: skate.prop.string()
  },
  render (elem) {
    <div>
      <h1>{elem.title}</h1>
      <slot name="description" />
      <article>
        <slot />
      </article>
    </div>
  }
});
```

And it could be used like:

```html
<my-element title="Eggs">
  <p slot="description">Article description.</p>
  <p>Main paragraph 1.</p>
  <p>Main paragraph 2.</p>
</my-element>
```



## Component Lifecycle

The component lifecycle consists of several paths in the following order starting from when the element is first created.

1. `events` are set up
2. `props` are defined and set to initial values
3. `created` is invoked
4. `render` is invoked to render an HTML structure to the component
5. `ready` is invoked
6. `attached` is invoked when added to the document (or if already in the document)
7. `detached` is invoked when removed from the document
8. `attributeChanged` is invoked whenever an attribute is changed



## Extending Elements

You may extend components using ES6 classes or your favorite ES5 library.

```js
const XParent = skate.define('x-parent', {
  static created () {

  }
  static get events {
    return {
      event1 () {}
    }
  }
});

const XChild = skate.define('x-child', class extends XParent {
  static created () {
    super.created();
  }
  static get events {
    return class extends super.events {
      event1 (e) {
        super.event1(e);
      }
      event2 () {

      }
    };
  }
});
```

Due to the semantics of ES6 classes, you must specify any non-prototype members as static. ES6 classes also do not support the object literal syntax. In order to specify properties, just use the getter syntax like we did with `events` above.



## Asynchrony

When native support for custom elements aren't supported, Skate uses Mutation Observers and elements are processed asynchronously. This means that if you insert an element into the DOM, custom methods and properties on that element will not be available right away. This will not work:

```js
document.body.innerHTML = '<my-component id="my-component-id"></my-component>';
document.getElementById('my-component-id').someCustomMethod();
```

This is because Mutation Observers queue a [microtask](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/). In order to get around this behaviour, you should use `skate.ready()`.



## Customised built-in elements

The spec [mentions](http://w3c.github.io/webcomponents/spec/custom/#customized-built-in-element) this as a way to extend built-in elements. Currently, how this is exposed to the user is still [under contention](https://github.com/w3c/webcomponents/issues/509#issuecomment-222860736). Skate doesn't need do anything to support this underneath the hood, but be aware of this when building components.



## VS other libraries

We hold no ill thoughts against other libraries and we are just trying to articulate why one would choose Skate over another. If any information here is inaccurate, please feel free to raise an issue to discuss how we can make it accurate.



### VS WebComponentsJS

[webcomponentsjs](https://github.com/webcomponents/webcomponentsjs)

WebComponentsJS is a suite of polyfills. If there is native browser support, they're not needed. Skate is a superset of these specifications, thus is a value-add on top of them, if they're needed.


### VS Polymer

Polymer uses webcomponentsjs and adds an abstraction on top of it. In their high-level design, Skate and Polymer are very similar in that they're built on top of emerging standards. However, fundametally, Skate and Polymer are very different.

- Skate uses a functional programming model for rendering in which you can use any templating language you want that compiles down to Incremental DOM. It calls `render()` when something changes and then tells Incremental DOM to diff and patch what's different between the two states. With Polymer, you use their custom template syntax that creates links between properties and mutations happen to the DOM directly.
- Skate only has a single option for its usage, making it simpler to grok what you're getting. Polymer has three different builds, most of which Skate is smaller than. The following comparisons are using non-gzipped, minified versions.
  - `polymer-micro.html` 17k vs 20k
  - `polymer-mini.html` 54k vs 20k
  - `polymer.html` 124k vs 20k
- Polymer uses HTML Imports to build their codebase. This can be obtuse if you're used to using JavaScript module formats, especially since HTML Imports are currently very contentious and Google are the only ones who are pushing for it.
- Skate supports JSPM, NPM and more. Polymer currently [only supports Bower](https://github.com/Polymer/polymer/issues/2578).



### VS X-Tags

Skate is very close to X-Tags in terms of API shape, however, it is very different in the way it is applied and shares a lot of the same differences with X-Tags as it does with Polymer.

- Skate uses a functional programming model for rendering in which you can use any templating language you want that compiles down to Incremental DOM. X-Tags is not very opinionated about rendering or templating. You define a string of HTML and it will use that as the component's content.
- Skate's property API is thorough and extensible. We provide implementationsf or commonly used property patterns and give you an API to easily write your own reusable properties.
- Skate is only slightly larger and gives you everything you need to build complex components.
- There's no mutating your component's DOM from property accessors which can become unweidly.



### VS React

React has definitely had an influence on Skate. That said, they're completely different beasts, only sharing a functional rendering pipeline and some aspects of the API.

- React is massive: a whopping 145k minified vs 20k.
- In the performance tests you can see a Skate component is several times faster than a similarly written React component.
- **Skate is written on top of W3C standards.** The React authors have been [very vocal](https://github.com/facebook/react/issues/5052) about this. However, the response to that issue is incorrect. Web Components by nature are declarative: it's just HTML. Web Components also completely solve the integration problems between libraries and frameworks due to the nature of how Custom Elements and Shadow DOM work: Custom Elements provide a declarative API, Shadow DOM hides the implementation details. When integrating with frameworks, you're just writing HTML. In terms of the problems with imperative APIs, it's not the fault of Web Components that force a user to call a method, it's the fault of the design of the Web Component. There's nothing stopping a Web Component from being completely declarative, especially if it's written in Skate. More information about [web component design](#declarative).
- We have plans to support server-side rendering.



## Preventing FOUC

An element may not be initialised right away. In order to prevent jank or FOUC, you can use the `defined` attribute to style your components accordingly.

```css
my-element:not([defined]) {
  opacity: 0;
}

my-element[defined] {
  opacity: 1;
  transition: opacity .3s ease;
}
```




## Designing Web Components

A web component's public API should be available both imperatively (via JavaScript) and declaratively (via HTML). You should be able to do everything in one, that you can do in the other within reason.



### Imperative

You should always try and make the constructor available whether it's exported from an ES2015 module or a global:

```js
export default skate.define('my-component', {});
```



### Declarative

By declaring a Skate component, you are automatically making your element available to be used as HTML. For example, if you were to create a custom element for a video player:

```js
skate.define('x-video', {});
```

You could now just write:

```html
<x-video></x-video>
```

Instead of providing just imperative methods - such as `play()` for the natve `<video>` element - you should try to provide attributes that offer the same functionality. For example, if you had a player component, you could offer a `playing` boolean attribute, so that it starts playing when it's put on the page.

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

You may write a component that you change in a backward incompatible way. In order for your users to upgrade, they'd have to do so all at once instead of incrementally if you haven't given the new one a different name. You could rename your component so it can co-exist with the old one, or you can create a function that allows your users to define a name for your component:

```js
export default function (name) {
  return skate.define(name, {
    render (elem) {
      skate.vdom.text(`This element has been called: ${elem.tagName}.`);
    }
  });
}
```



### Compatible with multiple versions of itself

Skate is designed so that you can have multiple versions of it on the same page. This is so that if you have several components, your upgrades and releases aren't coupled. If you have a UI library based on Skate and those consuming your library also have Skate, your versions aren't coupled.



### Properties and Attributes

Properties and attributes should represent as much of your public API as possible as this will ensure that no matter which way your component is created, its API remains as consistent as the constraints of HTML will allow. You can do this by ensuring your properties have corresponding attributes:

```js
skate.define('my-component', {
  props: {
    // Links the `name` property to the `name` attribute.
    name: { attribute: true }
  }
});
```

Sometimes this may not be viable, for example when passing complex data types to attributes. In this scenario, you can try and serialize / deserialize to / from attributes. For example, if you wanted to take a comma-separated list in an attribute and have the property take an array, but still have them linked, you could do something like:

```js
skate.define('my-component', {
  props: {
    values: {
      attribute: true,
      deserialize (val) {
        return val.split(',');
      },
      serialize (val) {
        return val.join(',');
      }
    }
  }
});
```



## React Integration

We provide an [integration layer](https://github.com/skatejs/react-integration) for React that transforms your web components into React components so that they can be used as first-class citizens within React.
