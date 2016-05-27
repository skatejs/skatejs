# Skate

[![Build Status](https://travis-ci.org/skatejs/skatejs.svg?branch=master)](https://travis-ci.org/skatejs/skatejs)
[![Join the chat at https://gitter.im/skatejs/skatejs](https://badges.gitter.im/skatejs/skatejs.svg)](https://gitter.im/skatejs/skatejs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/skatejs.svg)](https://saucelabs.com/u/skatejs)

Skate is a library built on top of the [W3C web component specs](https://github.com/w3c/webcomponents) that enables you to write functional and performant web components with a very small footprint.

- Functional rendering pipeline backed by Google's [Incremental DOM](https://github.com/google/incremental-dom).
- Inherently cross-framework compatible. For example, it works seamlessly with - and complements - React and other frameworks.
- It's only 10k min+gz and it will only get smaller as more browsers start supporting web components natively.
- It's very fast. It's roughly 4x as fast as React for similarly written components.
- It works with multiple versions of itself on the page, if need be.



HTML

```html
<x-hello name="Bob"></x-hello>
```

JavaScript

```js
skate('x-hello', {
  properties: {
    name { attribute: true }
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



### Shadow DOM

Skate works with or without [Shadow DOM](http://w3c.github.io/webcomponents/spec/shadow/) support. However, it's recommended you use a polyfill for [browsers](http://caniuse.com/#search=shadow%20dom) that don't support it natively:

- https://github.com/skatejs/named-slots/
- https://github.com/WebComponents/webcomponentsjs (does *not* support named slots yet)

Without native support and if you do not supply a Shadow DOM polyfill, any components that have a `render()` function may cause issues integrating with React and other virtual DOM-based libraries (such as Skate itself) because the shadow DOM hides changes that are made to the components during `render()`. If no Shadow DOM support is available, your component renders directly to the host element rather than to the shadow root. This means your component will work fine on its own, but may fail when composed into other libraries.



### Mutation Observer

In IE9 and IE10, Skate requires that you BYO a [Mutation Observer](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) polyfill:

- https://github.com/webcomponents/webcomponentsjs (requires WeakMap polyfill)
- https://github.com/megawac/MutationObserver.js
- https://github.com/bitovi/mutationobserver



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
  - [`skate (componentName, componentDefinition)` API](#skate-componentname-componentdefinition-api)
    - [Return Value](#return-value)
    - [`componentName`](#componentname)
    - [`componentDefinition`](#componentdefinition)
      - [`prototype`](#prototype)
      - [`events`](#events)
        - [Event Delegation](#event-delegation)
      - [`created`](#created)
      - [`properties`](#properties)
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
      - [`attribute`](#attribute-1)
      - [`extends`](#extends)
      - [`definedAttribute`](#definedattribute)
  - [`skate.*` API](#skate-api)
    - [`create (componentName, elementProperties = {})`](#create-componentname-elementproperties--)
      - [Alternatives](#alternatives)
      - [Setting Properties](#setting-properties)
      - [Why not just patch `document.createElement()`?](#why-not-just-patch-documentcreateelement)
    - [`emit (elem, eventName, eventOptions = {})`](#emit-elem-eventname-eventoptions--)
      - [Emitting Several Events at Once](#emitting-several-events-at-once)
      - [Return Value](#return-value-1)
      - [Preventing Bubbling or Canceling](#preventing-bubbling-or-canceling)
      - [Passing Data](#passing-data)
    - [`factory (componentDefinition)`](#factory-componentdefinition)
    - [`fragment (...almostAnything)`](#fragment-almostanything)
    - [`init (...elems)`](#init-elems)
    - [`link (elem, propSpec)`](#link-elem-propspec)
    - [`noConflict ()`](#noconflict-)
    - [`prop`](#prop)
      - [`array`](#array)
      - [`boolean`](#boolean)
      - [`number`](#number)
      - [`string`](#string)
    - [`ready (elementOrElements, callback)`](#ready-elementorelements-callback)
      - [Background](#background)
      - [The problem](#the-problem)
      - [The solution](#the-solution)
      - [Drawbacks](#drawbacks)
    - [`state (elem[, state])`](#state-elem-state)
    - [`vdom`](#vdom)
      - [`vdom (elementName, attributesOrChildren, children)`](#vdom-elementname-attributesorchildren-children)
      - [Elements as Functions](#elements-as-functions)
      - [Named Slots](#named-slots)
      - [Special Attributes](#special-attributes)
        - [`attrs.class`](#attrsclass)
        - [`attrs.key`](#attrskey)
        - [`attrs.on*`](#attrson)
        - [`attrs.skip`](#attrsskip)
        - [`attrs.statics`](#attrsstatics)
        - [Boolean Attributes](#boolean-attributes)
      - [Using JSX and other templating languages](#using-jsx-and-other-templating-languages)
    - [`version`](#version)
  - [Component Lifecycle](#component-lifecycle)
  - [Extending Elements](#extending-elements)
  - [Asynchrony](#asynchrony)
  - [Web Component Differences](#web-component-differences)
  - [VS WebComponentsJS](#vs-webcomponentsjs)
  - [VS Polymer](#vs-polymer)
  - [VS X-Tags](#vs-x-tags)
  - [VS React](#vs-react)
  - [Native Custom Element Support](#native-custom-element-support)
  - [SVG](#svg)
  - [Preventing FOUC](#preventing-fouc)
  - [Designing Web Components](#designing-web-components)
    - [Imperative](#imperative)
    - [Declarative](#declarative)
    - [Naming Collisions](#naming-collisions)
    - [Compatible with multiple versions of itself](#compatible-with-multiple-versions-of-itself)
    - [Properties and Attributes](#properties-and-attributes)
  - [React Integration](#react-integration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Installing

Using package managers:

    bower install skatejs
    jspm install npm:skatejs
    npm install skatejs

Or you can DIY by downloading the zip and consuming it via one of the following ways.



### UMD (AMD / CommonJS)

UMD files are located in `lib/`. Simply `require` the `lib/index.js` file by whatever means you have and use it in accordance with whatever loader you've chosen.



### ES6 Modules

The Skate source is written using [ES2015 modules](http://www.2ality.com/2014/09/es6-modules-final.html). If you're using a transpilation method, then you can `import skate from 'skatejs';` and use it in your projects as you would any ES6 module.



### Global

If you're still skating old school the `dist` directory contains the bundled ES5 source and contains both a UMD definition and a global `skate` variable.



## Examples

- [SkateJS website (WIP)](https://github.com/skatejs/skatejs.github.io/tree/future)
- [TodoMVC, classic DOM](https://github.com/skatejs/todomvc/tree/skatejs/examples/skatejs)
- [AUI](https://bitbucket.org/atlassian/aui) (only some components)



## Resources

- [Web Platform Podcast: [Custom Elements & SkateJS](http://thewebplatformpodcast.com/66-custom-elements-skatejs)
- [SydJS: Skating with Web Components](http://slides.com/treshugart/skating-with-web-components#/)
- [SydJS: Still got your Skate on](http://slides.com/treshugart/still-got-your-skate-on#/)



## Questions?

If you have any questions about Skate you can use one of these:

- [Gitter](https://gitter.im/skatejs/skatejs)
- [HipChat](https://www.hipchat.com/gB3fMrnzo)



## Terminology

Wherever we refer to "v0" or "v1" we are referring to the Custom Element spec and can be categorised as:

- polyfill, polyfilled, polyfill-land - not v0 or v1; no native custom element support at all.
- upgrade, upgraded, upgrading - when an element is initialised as a custom element.
- v0 - the original Blink implementation - when the spec was still contentious - that used the `document.registerElement()` method.
- v1 - the non-contentious - modern-day - spec that uses the `window.customElements` namespace.



## `skate (componentName, componentDefinition)` API

The main `skate()` function is the entry-point to the API and is what defines your custom element.



### Return Value

The `skate()` function returns you a function / constructor that you can use to create an instance of your component.

```js
const MyComponent = skate('my-component', {
  render () {
    skate.vdom.div();
  }
});
```

Can be created in both of the following ways:

```js
MyComponent();
new MyComponent();
```

The returned function also contains the information specified in your definition:

```js
// function (elem) {}
MyComponent.render;
```

It also contains extra information about the component:

- `id` The id / name of the component. In this case it would be `my-component`.
- `name` Same as `id`, but the name of the function / constructor is reflected properly when debugging. This doesn't work in WebKit because it's non-configurable.



### `componentName`

The `componentName` is a string that is the tag name of the custom element that you are creating. It must be a "valid custom element name" as specified [in the spec](http://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts).



### `componentDefinition`

The `componentDefinition` argument is an object literal or constructor / function / class that houses your component definition. The following options are supported and are chronologically ordered in terms of where they get used in the component's lifecycle.



#### `prototype`

The element's prototype. This is the first thing that happens in the element's lifecycle.

```js
skate('my-component', {
  prototype: {
    get someProperty () {},
    set someProperty () {},
    someMethod () {},
  }
});
```

In native custom elements, you must provide the entire prototype for your custom element. This means that even if you're creating a new custom element, you must be explicit about it:

```js
document.registerElement('my-component', {
  prototype: Object.create(HTMLElement.prototype, {
    someProperty: {
      get () {},
      set () {}
    },
    someMethod: {
      value () {}
    }
  })
});
```

In Skate, however, if your `prototype` doesn't inherit from the base `HTMLElement`, Skate will automatically do this for you, so you don't have to worry about it.



#### `events`

Event listeners to add to the custom element. These get bound after the `prototype` is set up and before `created` is called.

```js
skate('my-component', {
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
skate('my-component', {
  events: {
    'click button' (elem, eventObject) {}
  }
});
```

Instead of firing for every click on the component element - or that bubbles to the component element - it will only fire if a descendant `<button>` was clicked.



#### `created`

Function that is called when the element is created. This corresponds to the native `createdCallback` (v0) or `constructor` (v1). We don't use `constructor` here because Skate does a lot of automation in it and thus offers this as a way to hook into that part of the lifecycle. It is the first lifecycle callback that is called and is called after the `prototype` is set up.

```js
skate('my-component', {
  created (elem) {}
});
```

The only argument passed to `created` is component element. In this case that is `<my-component>`.



#### `properties`

Custom properties that should be defined on the element. These are set up after the `created` lifecycle callback is called.

```js
skate('my-component', {
  properties: { ...properties }
});
```

The custom property definition accepts the following options.



##### `attribute`

Whether or not to link the property to an attribute. This can be either a `Boolean` or `String`.

- If it's `false`, it's not linked to an attribute. This is the default.
- If it's `true`, the property name is dash-cased and used as the attribute name it should be linked to.
- If it's a `String`, the value is used as the attribute name it should be linked to.

```js
skate('my-component', {
  properties: {
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
skate('my-component', {
  properties: {
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
skate('my-component', {
  properties: {
    myProp: {
      default: 'default value'
    }
  }
});
```

You may also specify a function that returns the default value. This is useful if you are doing calculations or need to return a reference:


```js
skate('my-component', {
  properties: {
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
skate('my-component', {
  properties: {
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
skate('my-component', {
  properties: {
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
skate('my-component', {
  properties: {
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
skate('my-component', {
  properties: {
    myProp: {
      initial: 'initial value'
    }
  }
});
```

It can also be a function that returns the initial value:

```js
skate('my-component', {
  properties: {
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
skate('my-component', {
  properties: {
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
skate('my-component', {
  properties: {
    myProp: {
      render (elem, data) {
        return data.newValue !== data.oldValue;
      }
    }
  },
  render (elem) {
    skate.vdom.div(elem.myProp);
  }
});
```

The property `render()` function is called before re-rendering the component. If must return `true` in order for a re-render to occur. If you specify a `boolean` instead of a function for this option, then `true` will always re-render and `false` will never re-render. This option defaults to a `function` that returns true if `oldValue` is `!==` to `newValue` and `false` otherwise.

If you do not specify a component `render()` function, then this option is ignored.



##### `set`

A function that is called whenever the property is set. This is also called when the property is first initialised.

```js
skate('my-component', {
  properties: {
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
skate('my-component', {
  render (elem) {
    skate.vdom.p(`My name is ${elem.tagName}.`);
  }
});
```

The only argument passed to `render` is the component element. In this case that is `<my-component>`.

*On initial creation, `render()` is called synchronously. However, when you set a property it is rendered asynchronously so that multiple property sets only cause a single render to occur.*



#### `ready`

Function that is called after the element has been rendered for the first time (see `render`).

```js
skate('my-component', {
  ready (elem) {}
});
```

The only argument passed to `ready` is component element. In this case that is `<my-component>`.



#### `attached`

Function that is called after the element has been inserted to the document. This corredsponds to the native `attachedCallback`. This can be called several times, for example, if you were to remove the element and re-insert it.

```js
skate('my-component', {
  attached (elem) {}
});
```

The only argument passed to `attached` is component element. In this case that is `<my-component>`.



#### `detached`

Function that is called after the element has been removed from the document. This corredsponds to the native `detachedCallback`. This can be called several times, for example, if you were to remove the element, re-attach it and the remove it again.

```js
skate('my-component', {
  detached (elem) {}
});
```

The only argument passed to `detached` is component element. In this case that is `<my-component>`.



#### `attributeChanged`

Function that is called whenever an attribute is added, updated or removed. This corresponds to the native `attributeChangedCallback` (both v0 and v1). Generally, you'll probably end up using `properties` that have linked attributes instead of this callback, but there are still use cases where this could come in handy.

```js
skate('my-component', {
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

This behaves exactly like described in the [v1 spec](http://w3c.github.io/webcomponents/spec/custom/#custom-elements-autonomous-example). The only things we do here are to make it behave consistently in both polyfill-land and in v0, and automatically add attributes that are linked to properties to it so that you don't have to duplicate any code between the two.

For example, the following:

```js
skate('my-component', {
  observedAttributes: ['some-attribute'],
  attributeChanged () {}
});
```

Could similarly be written as:

```js
skate('my-component', {
  properties: {
    someAttribute: { attribute: true }
  }
});
```

The differences being that as a result of defining it as a property, it is now linked to an attribute and will cause a re-render. If you only want to observe attribute changes within the `attributeChanged()` callback, then that is totally valid.

*Observing attributes directly using `observedAttributes` doesn't make sense without specifying an `attributeChanged()` callback.*



#### `extends`

The built-in element to extend. This is how you create a "customised built-in element" as outlined in [the spec](http://w3c.github.io/webcomponents/spec/custom/#custom-elements-customized-builtin-example). This used to be known as "type extensions" and *was* contentious, but no longer is.

```js
skate('my-component', {
  extends: 'input'
});
```

Skate will automatically detect the native prototype for the element that you are extending and ensure that your `prototype` extends it, rather than you having to do this manually. This is also explained in the `prototype` option.




#### `definedAttribute`

The name of the attribute that is added to the element after it has been upgraded.

```html
<my-component defined />
```



## `skate.*` API

The following are all available on the `skate` object, or available for use from the `src/api` or `lib/api` folders.



### `create (componentName, elementProperties = {})`

Creates an element for the specified component `name`, ensures that it's synchronously initialized and assigns all `props` to it. On the surface, this doesn't appear much different than `document.createElement()` in browsers that support custom elements, however, there's several benefits that it gives you on top of being a single, consistent and convenient way to do things in any browser and environment.

For example, this can be called in any browser and it will behave consistently:

```js
skate.create('my-element');
```

In browsers that support custom elements, it is equivalent to:

```js
document.createElement('my-element');
```

In browsers that do not support custom elements, you would have to manually ensure that the element is initialised synchronously:

```js
const elem = document.createElement('my-element');
skate.init(elem);
```

To take this example further, if we've extended an element:

```js
skate('my-element', {
  extends: 'div'
});
```

How we call this function does not change:

```js
skate.create('my-element');
```

However, in native land this does change:

```js
// custom elements v0
document.createElement('div', 'my-element');

// custom elements v1
document.createElement('div', { is: 'my-element' });
```

And in polyfill land, it's much different:

```js
const elem = document.createElement('div');
elem.setAttribute('is', 'my-element');
skate.init(elem);
```

Both the native and polyfilled examples above expose too many implementation details. It's much better to have one simple and consistent way to create an element.



#### Alternatives

If you have access to the function / constructor returned from the `skate()` call, invoking that does the same exact thing as `skate.create()`:

```js
let myElement;
const MyElement = skate('my-element', {});

// Same thing:
myElement = skate.create('my-element');
myElement = MyElement();
myElement = new MyElement();
```



#### Setting Properties

All methods of constructing an element support passing properties.

```js
myElement = skate.create('my-element', { prop: 'value' });
myElement = MyElement({ prop: 'value' });
myElement = new MyElement({ prop: 'value' });
```

Passing properties automatically assigns them to the element:

```js
// 'value'
console.log(myElement.prop);
```



#### Why not just patch `document.createElement()`?

Skate is designed to work with multiple versions of itself on the same page. If one version patches `document.createElement()` differently than another, then you have problems. Even if we did do this, how `document.createElement()` is called still depends on how the corresponding component has been registered, which is bad, especially when we can infer that information from the component definition.



### `emit (elem, eventName, eventOptions = {})`

Emits a `CustomEvent` on `elem` that `bubbles` and is `cancelable` by default. This is useful for use in components that are children of a parent component and need to communicate changes to the parent.

```js
skate('x-tabs', {
  events: {
    selected: hideAllAndShowSelected
  }
});

skate('x-tab', {
  events: {
    click () {
      skate.emit(this, 'selected');
    }
  }
});
```

It's preferrable not to reach up the DOM hierarchy because that couples your logic to a specific DOM structure that the child has no control over. To decouple this so that your child can be used anywhere, simply trigger an event.

*Note that events cannot be triggered with `skate.emit()` on disabled elements. Events also can't bubble through disabled elements.*



#### Emitting Several Events at Once

You can emit more than one event at once by passing a space-separated string or an array as the `eventName` parameter:

```js
skate.emit(elem, 'event1 event2');
skate.emit(elem, [ 'event1', 'event2' ]);
```



#### Return Value

The native `Element.dispatchEvent()` method returns `false` if the event was cancelled. Since `skate.emit()` can trigger more then one event, a `Boolean` return value is ambiguous. Instead it returns an `Array` of the event names that were canceled.



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
const createMyComponent = myComponentFactory('my-component');
const myElementInstance = createMyComponent();
```



### `fragment (...almostAnything)`

Creates a document fragment from the specified node or HTML string and ensures any components within the fragment are synchronously initialised.

You can pass a DOM node:

```js
skate.fragment(document.createElement('my-element'));
```

A string:

```js
skate.fragment('<my-element></my-element>');
```

Any traversible item:

```js
skate.fragment([document.createElement('my-element'), '<my-element></my-element>']);
```

Or a combination of those:

```js
skate.fragment(
  document.createElement('my-element'),
  '<my-element></my-element>',
  [document.createElement('my-element'), '<my-element></my-element>']
);
```

You are returned a document fragment that contains synchronously initialised components (if you added any components). It's just a normal `DocumentFragment` so you can do anything you would normally be able to do. However, it should be noted that the methods aren't decorated to sync init components that you add after calling `skate.fragment()`.

If you want to add components that are synchronously initialised, you can just chain `skate.fragment()` calls:

```js
skate
  .fragment('<my-element></my-element>')
  .appendChild(skate.fragment('<my-other-element></my-other-element>'));
```



### `init (...elems)`

It's encouraged that you use `skate.create()` and `skate.fragment()` for creating elements and ensuring that they're synchronously initialised, however, there are edge-cases where synchronously initialising an existing element `skate.init()` may be necessary.

```js
skate.init(element1, element2);
```

*You shouldn't use skate.init() in native to ensure descendant DOM is initialised as there's stuff native does that we don't emulate with it. See the docs on `skate.ready()` for how you can interact with descendant components after they've been upgraded.*



### `link (elem, propSpec)`

The `link()` function returns a function that you can bind as an event listener. The handler will take the event and propagte the changes back to the ``. This essentially allows for 2-way data-binding but is safer as the propagation of the user input value back to the component element will trigger a re-render ensuring all dependent UI is up to date.

```js
skate('my-input', function () {
  properties: {
    value: { attribute: true }
  },
  render (elem) {
    skate.vdom.input({ onchange: skate.link(elem), type: 'text' });
  }
});
```

By default the `propSpec` defaults to `e.currentTarget.getAttribute('name')` or `"value"` which is why it wasn't specified in the example above. In the example above, it would set `value` on the component. If you were to give your input a name, it would use the name from the event `currentTarget` as the name that should be set. For example if you changed your input to read:

```js
skate.vdom.input({ name: 'someValue', onchange: skate.link(elem), type: 'text' });
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
skate.vdom.input({ name: 'someValue', onchange: skate.link(elem, 'obj.'), type: 'text' });
```

The above example would set `obj.someValue` because the name of the input was `someValue`. This doesn't look much different from the previous example, but this allows you to create a single link handler for use with multiple inputs:

```js
const linkage = skate.link(elem, 'obj.');
skate.vdom.input({ name: 'someValue1', onchange: linkage, type: 'text' });
skate.vdom.input({ name: 'someValue2', onchange: linkage, type: 'checkbox' });
skate.vdom.input({ name: 'someValue3', onchange: linkage, type: 'radio' });
skate.vdom.select({ name: 'someValue4', onchange: linkage }, function () {
  skate.vdom.option({ value: 1 }, 'Option 1');
  skate.vdom.option({ value: 2 }, 'Option 2');
});
```

The above linkage would set:

- `obj.someValue1`
- `obj.someValue2`
- `obj.someValue3`
- `obj.someValue4`



### `noConflict ()`

Same as what you'd come to expect from most libraries that offer a global namespace. It will restore the value of `window.skate` to the previous value and return the current `skate` object.

```js
const currentSkate = skate.noConflict();
```

*No conflict mode is only available from the version in `dist/` since that's the only version that exports a global.*



### `prop`

Skate has some built-in property definitions to help you with defining consistent property behaviour within your components. All built-in properties are functions that return a property definition.

```js
skate.prop.boolean();
```

You are able to pass options to these properties to override built-in behaviour, or to define extra options that would normally be supported by a Skate property definition.

You can easily define a new property by calling `skate.prop()` as a function and passing it the default options for the property. All built-in properties are created using this method.

```js
const myNewProp = skate.prop({ ... });
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



### `ready (elemOrElems, callback)`

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
skate('component-a', {
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
    skate.vdom('component-b');
  }
});

skate('component-b', {
  created (elem) {
    elem.initialised = true;
  }
});
```



#### Drawbacks

This does not solve the situation where you want to be notified of future elements that may be added somewhere in your descendant DOM. That is more a concern of what API you choose to expose to your consumers, the rendering path you choose and the problem you're trying to solve. This only concerns itself with the descendant nodes that you *know* exist. Most of the time this will come from the `render` lifecycle callback.



### `state (elem[, state])`

The `state` function is a getter or setter depending on if you specify the second `state` argument. If you do not provide `state`, then the current state of the component is returned. If you pass `state`, then the current state of the component is set. When you set state, the component will re-render synchronously only if it needs to be re-rendered.

Component state is derived from the declared properties. It will only ever return properties that are defined in the `properties` object. However, when you set state, whatever state you specify will be set even if they're not declared in `properties`.

```js
const create = skate('my-element', {
  properties: {
    prop1: null
  }
});
const elem = create();

// Set any property you want.
skate.state(elem, {
  prop1: 'value 1',
  prop2: 'value 2'
});

// Only returns props you've defined on your component.
// { prop1: 'value 1' }
skate.state(elem);
```



### `symbols`

Symbols are exposed for you to access information that stored on objects that are not otherwise accessible.

#### `shadowRoot`

When a component renders for the first time, it creates a new shadow root - if it can - and stores this shadow root on the element using this symbol. If a shadow root cannot be created, this returns the element itself.

```js
skate('my-component', {
  render () {
    skate.vdom.p('test');
  },
  ready (elem) {
    // #shadow-root
    //   <p>test</p>
    elem[skate.symbols.shadowRoot];
  }
});
```



### `vdom`

Kickflip includes several helpers for creating virtual elements with Incremental DOM.

#### `vdom (elementName, attributesOrChildren, children)`

The `elementName` argument is the name of the element you want to create. This can be a string or function that has the `id` or `name` property set, which makes it compatible with any function as well as Skate component constructors (that use `id` because WebKit doesn't let you re-define `name`).

The `attributesOrChildren` argument is either an `object`, a `function` that will render the children for this element or a `string` if you only want to render a text node as the children.

The `children` argument is a `function` that will render the children of this element or a `string` if you are only rendering text.

```js
skate.vdom('select', { name: 'my-select' }, function () {
  skate.vdom('option', { value: 'myval' }, 'My Value');
});
```

#### Elements as Functions

The `vdom` API also exports functions for every HTML5 element. You could rewrite the above example using those instead:

```js
skate.vdom.select({ name: 'my-select' }, function () {
  skate.vdom.option({ value: 'myval' }, 'My Value');
});
```

The `text()` function is also exported directly from Incremental DOM and you could use that if you wanted to instead of specifying as string:

```js
skate.vdom.select({ name: 'my-select' }, function () {
  skate.vdom.option({ value: 'myval' }, function () {
    skate.vdom.text('My Value');
  });
});
```

This is very useful if you need to render text with other elements as siblings, or do complex conditional rendering.

#### Named Slots

The `vdom` API also exports a `slot()` function so that you can use [named slots](https://github.com/skatejs/named-slots/).

```js
skate.vdom.slot();
```

If Shadow DOM v0 is detected, then Skate will output a `<content>` element instead of a `<slot>` that will look for nodes in the same way a `<slot>` would so you don't have to worry about which version of Shadow DOM is available.

#### Special Attributes

Kickflip adds some opinionated behaviour to Incremental DOM.

##### `attrs.class`

We ensure that if you pass the `class` attribute, that it sets that via the `className` property.

##### `attrs.key`

This gives the virtual element a [`key`](http://google.github.io/incremental-dom/#conditional-rendering/array-of-items) that Incremental DOM uses to keep track of it for more efficient patches when dealing with arrays of items.

```js
skate.vdom.ul(function () {
  skate.vdom.li({ key: 0 });
  skate.vdom.li({ key: 1 });
});
```

##### `attrs.on*`

Any attribute beginning with `on` will be bound to the event matching the part found after `on`. For example, if you specify `onclick`, the value will be bound to the `click` event of the element.

```js
skate.vdom.button({ onclick: e => console.log(e) }, 'Click me!');
```

You can also bind to custom events:

```js
skate.vdom('my-element', { onsomecustomevent: e => console.log(e) });
```

Events are added / removed using `addEventListener()` / `removeEventListener()` so they will fire for bubbling events.

##### `attrs.skip`

This tells Incremental DOM to skip the element that has this attribute. This is automatically applied when `slot()` is called as the slotted elements will be managed by the parent component, not by the current diff tree. Elements that have this attribute cannot have children.

This is also helpful when integrating with 3rd-party libraries that may mutate the DOM.

```js
skate.vdom.div({ skip: true });
```

##### `attrs.statics`

This is an array that tells Incremental DOM which attributes should be considered [static](http://google.github.io/incremental-dom/#rendering-dom/statics-array).

```js
skate.vdom.div({ statics: ['attr1', 'prop2'] });
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
skate('my-element', {
  properties: {
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



### `version`

Returns the current version of Skate.



## Component Lifecycle

The component lifecycle consists of several paths in the following order starting from when the element is first created.

1. `prototype` is set up in non-native (already set up in native)
2. `events` are set up
3. `properties` are defined
4. `created` is invoked
5. `render` is invoked to render an HTML structure to the component
6. `properties` are initialised
7. `ready` is invoked
8. `attached` is invoked when added to the document (or if already in the document)
9. `detached` is invoked when removed from the document
10. `attribute` is invoked whenever an attribute is updated



## Extending Elements

You may extend components using ES6 classes or your favorite ES5 library.

```js
const XParent = skate('x-parent', {
  static created () {

  }
  static get events {
    return {
      event1 () {}
    }
  }
});

const XChild = skate('x-child', class extends XParent {
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

This is because Mutation Observers queue a [microtask](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/). In order to get around this behaviour, you'll need to use one of the following depending on your use case:

- `skate.create()` or the element constructor
- `skate.fragment()`
- `skate.init()`
- `skate.ready()`



## Web Component Differences

Skate implements the [Custom Element spec](http://w3c.github.io/webcomponents/spec/custom/) with a custom API but it does not polyfill the native methods. This allows it to minimise code overhead and optimise performance. Because of this, Skate is around the same size as the custom element polyfill, performs better and can have multiple versions of itself on the page if need be. However, you cannot abstract the Shadow DOM in the same way, which is why we've opted to have the user provide their own Shadow DOM polyfill instead of bundling it.



## VS other libraries

We hold no ill thoughts against other libraries and we are just trying to articulate why one would choose Skate over another. If any information here is inaccurate, please feel free to raise an issue to discuss how we can make it accurate.



### VS WebComponentsJS

[webcomponentsjs](https://github.com/webcomponents/webcomponentsjs)

WebComponentsJS is a suite of polyfills. Skate can work along side these, but is a superset of these so it provides you with an opinionated layer on top of them. There are a few things to note:

- Skate's Custom Element implementation is faster than the WebComponentsJS polyfill.
- Skate does not override any native Custom Element methods.
- Skate is only slightly larger than the Custom Element polyfill (28k vs 17k, min not gzipped).
- You can have multiple versions of Skate on the page.
- If the WebComponentsJS polyfills are on the page, Skate will use those instead. Beware, though, using the WebComponentsJS Custom Element polyfill may degrade performance over just using Skate as is.



### VS Polymer

Polymer uses webcomponentsjs and adds an abstraction on top of it. In their high-level design, Skate and Polymer are very similar in that they're built on top of emerging standards. However, fundametally, Skate and Polymer are very different.

- Skate uses a functional programming model for rendering in which you can use any templating language you want that compiles down to Incremental DOM. It calls `render()` when something changes and then tells Incremental DOM to diff and patch what's different between the two states. With Polymer, you use their custom template syntax that creates links between properties and mutations happen to the DOM directly.
- Skate only has a single option for its usage, making it simpler to grok what you're getting. Polymer has three different builds, most of which Skate is smaller than. The following comparisons are using non-gzipped, minified versions. All versions listed below for Polymer don't include the size of the Custom Element polyfill (17k):
  - `polymer-micro.html` 17k vs 28k
  - `polymer-mini.html` 54k vs 28k
  - `polymer.html` 124k vs 28k
- Due to the fact that Skate internally polyfills Custom Elements, it is faster at initialising components since Polymer uses the WebComponentsJS polyfill.
- Polymer uses HTML Imports to build their codebase. This can be obtuse if you're used to using JavaScript module formats, especially since HTML Imports are currently very contentious and Google are the only ones who are pushing for it.
- Skate supports JSPM, Bower, NPM and more. Polymer currently [only supports Bower](https://github.com/Polymer/polymer/issues/2578).



### VS X-Tags

Skate is very close to X-Tags in terms of API shape, however, it is very different in the way it is applied and shares a lot of the same differences with X-Tags as it does with Polymer.

- Skate uses a functional programming model for rendering in which you can use any templating language you want that compiles down to Incremental DOM. X-Tags is not very opinionated about rendering or templating. You define a string of HTML and it will use that as the component's content.
- Skate is larger than X-Tags without the Custom Element polyfill, but is smaller than X-Tags after you include the Custom Element polyfill. This is due to the fact that Skate provides the Custom Element implementation internally.
- Due to the fact that Skate internally polyfills Custom Elements, it is faster at initialising components since X-Tags uses the WebComponentsJS polyfill.
- There's no mutating your component's DOM from property accessors which can become unweidly.



### VS React

React has definitely had an influence on Skate. That said, they're completely different beasts, only sharing a functional rendering pipeline and some aspects of the API.

- React is massive: a whopping 145k minified vs 28k.
- In the performance tests you can see a Skate component is several times faster than a similarly written React component.
- **Skate is written on top of W3C standards.** The React authors have been [very vocal](https://github.com/facebook/react/issues/5052) about this. However, the response to that issue is incorrect. Web Components by nature are declarative: it's just HTML. Web Components also completely solve the integration problems between libraries and frameworks due to the nature of how Custom Elements and Shadow DOM work: Custom Elements provide a declarative API, Shadow DOM hides the implementation details. When integrating with frameworks, you're just writing HTML. In terms of the problems with imperative APIs, it's not the fault of Web Components that force a user to call a method, it's the fault of the design of the Web Component. There's nothing stopping a Web Component from being completely declarative, especially if it's written in Skate. More information about [web component design](#declarative).
- We have plans to support server-side rendering.



## Native Custom Element Support

If the browser supports custom elements then Skate will use the native DOM implementation instead of using Mutation Observers which will have added performance benefits. This all happens underneath the hood and the API does not change.

We strive to ensure Skate has as little base overhead as possible. What this means is that if you build a component with Skate vs with native it should not have a negative impact on performance. Of course, there will always be some overhead, but it should not be significant.



## SVG

When using custom elements in SVG, you need to explicitly extend the `SVGElement.prototype` as well as set the `extends` option to a valid `SVGElement` name:

```js
skate('my-path', {
  extends: 'path',
  prototype: Object.create(SVGElement.prototype)
});
```

Then you may write the following:

```html
<svg xmlns="http://www.w3.org/2000/svg">
  <circle />
  <path is="my-path" />
</svg>
```

The [custom element spec](http://w3c.github.io/webcomponents/spec/custom/#registering-custom-elements) is very vague on SVG and it would seem that it implies you don't need to specify `extends`. However, this is not the case in Chrome under native support it would seem. This is not an implementation detail of Skate, but the spec and the browser implementations.

Theoretically, Skate could automatically detect this and extend `path` by default (as it is the most generic SVG element), but then it would be ambiguous when reading your custom element definition as to what - and if - it is extending. For that reason, we leave this up to you.



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
export default skate('my-component', {});
```



### Declarative

By declaring a Skate component, you are automatically making your element available to be used as HTML. For example, if you were to create a custom element for a video player:

```js
skate('x-video', {});
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

You may write a component that you change in a backward incompatible way. In order for your users to upgrade, they'd have to do so all at once instead of incrementally if you haven't given the new one a different name. You could rename your component so it can co-exist with the old one, or you can use `skate.factory()` to export a function that will allow your consumers to define a name for your component while preventing them from having to use `skate()` (or even know about it).

```js
export default skate.factory({
  render (elem) {
    skate.vdom.text(`This element has been called: ${elem.tagName}.`);
  }
});
```



### Compatible with multiple versions of itself

Skate is designed so that you can have multiple versions of it on the same page. This is so that if you have several components, your upgrades and releases aren't coupled. If you have a UI library based on Skate and those consuming your library also have Skate, your versions aren't coupled.



### Properties and Attributes

Properties and attributes should represent as much of your public API as possible as this will ensure that no matter which way your component is created, its API remains as consistent as the constraints of HTML will allow. You can do this by ensuring your properties have corresponding attributes:

```js
skate('my-component', {
  properties: {
    // Links the `name` property to the `name` attribute.
    name: { attribute: true }
  }
});
```

Sometimes this may not be viable, for example when passing complex data types to attributes. In this scenario, you can try and serialize / deserialize to / from attributes. For example, if you wanted to take a comma-separated list in an attribute and have the property take an array, but still have them linked, you could do something like:

```js
skate('my-component', {
  properties: {
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
