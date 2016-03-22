# Skate

[![Build Status](https://travis-ci.org/skatejs/skatejs.svg?branch=master)](https://travis-ci.org/skatejs/skatejs)
[![Join the chat at https://gitter.im/skatejs/skatejs](https://badges.gitter.im/skatejs/skatejs.svg)](https://gitter.im/skatejs/skatejs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/skatejs.svg)](https://saucelabs.com/u/skatejs)

*This is the README for the master branch and is probably out of sync with the last stable release. To see the README for the last stable release select it from the list of tags.*

Skate is a web component library that provides an API to bind behaviour to DOM elements. It's based on the W3C specification for Custom Elements.

- Provides a superset of the [Custom Element Spec](http://w3c.github.io/webcomponents/spec/custom/).
- Hooks for the spec'd lifecycle, templating, custom properties and event delegation.
- Small, 5k min+gz.
- Allows easy transition from selector-based behaviour binding to element binding.

HTML

```html
<my-element></my-element>
```

JavaScript

```js
skate('my-element', {
  created: function (elem) {
    elem.textContent = 'Hello, World!';
  }
});
```

Result

```html
<my-element>Hello, World!</my-element>
```



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
      - [`created`](#created-1)
      - [`default`](#default)
      - [`deserialize`](#deserialize)
      - [`get`](#get)
      - [`initial`](#initial)
      - [`serialize`](#serialize)
      - [`set`](#set)
    - [`render`](#render)
      - [Custom renderers](#custom-renderers)
    - [`ready`](#ready)
    - [`attached`](#attached)
    - [`detached`](#detached)
    - [`attribute`](#attribute-1)
    - [`extends` *](#extends-)
    - [`type`](#type)
      - [Custom bindings](#custom-bindings)
        - [Considerations](#considerations)
        - [Transitioning Away from jQuery-style Plugins](#transitioning-away-from-jquery-style-plugins)
    - [`resolvedAttribute`](#resolvedattribute)
    - [`unresolvedAttribute`](#unresolvedattribute)
- [`skate.*` API](#skate-api)
  - [`create (componentName, elementProperties = {})`](#create-componentname-elementproperties--)
    - [Alternatives](#alternatives)
    - [Setting Properties](#setting-properties)
    - [Why not just patch `document.createElement()`?](#why-not-just-patch-documentcreateelement)
  - [`emit (element, eventName, eventOptions = {})`](#emit-element-eventname-eventoptions--)
    - [Emitting Several Events at Once](#emitting-several-events-at-once)
    - [Return Value](#return-value-1)
    - [Preventing Bubbling or Canceling](#preventing-bubbling-or-canceling)
    - [Passing Data](#passing-data)
  - [`fragment (...almostAnything)`](#fragment-almostanything)
  - [`init (...elements)`](#init-elements)
  - [`noConflict ()`](#noconflict-)
  - [`properties`](#properties-1)
    - [`boolean`](#boolean)
    - [`number`](#number)
    - [`string`](#string)
  - [`ready (elementOrElements, callback)` *](#ready-elementorelements-callback-)
    - [Background](#background)
    - [The problem](#the-problem)
    - [The solution](#the-solution)
    - [Drawbacks](#drawbacks)
  - [`render (element)`](#render-element)
  - [`version`](#version)
- [Component Lifecycle](#component-lifecycle)
- [Extending Elements](#extending-elements)
- [Asynchrony](#asynchrony)
- [Web Component Differences](#web-component-differences)
- [WebComponentsJS Differences](#webcomponentsjs-differences)
- [Native Custom Element Support](#native-custom-element-support)
  - [Spec Stability](#spec-stability)
- [SVG](#svg)
- [Polyfills](#polyfills)
- [Preventing FOUC](#preventing-fouc)
- [Ignoring Elements](#ignoring-elements)
- [Multiple Version Support](#multiple-version-support)
- [Designing Web Components](#designing-web-components)
  - [Imperative](#imperative)
  - [Declarative](#declarative)
  - [Properties and Attributes](#properties-and-attributes)
  - [Content Projection](#content-projection)
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

The Skate source is written using [ES2015 modules](http://www.2ality.com/2014/09/es6-modules-final.html). If you're using a transpilation method, then you can `import skate from 'src/index';` and use it in your projects as you would any ES6 module.



### Global

If you're still skating old school the `dist` directory contains the bundled ES5 source and contains both a UMD definition and a global `skate` variable.



## Examples

- [SkateJS website (WIP)](https://github.com/skatejs/skatejs.github.io/tree/future)
- [TodoMVC, classic DOM](https://github.com/skatejs/todomvc/tree/skatejs/examples/skatejs)
- [TodoMVC, functional UI](https://github.com/skatejs/todomvc/tree/skatejs/examples/skatejs-dom-diff) (DOM diffing etc)
- [AUI](https://bitbucket.org/atlassian/aui) (only some components)



## Resources

- [Web Platform Podcast: Custom Elements & SkateJS (#66)](https://www.youtube.com/watch?v=AbolmN4mp-g)
- [SydJS: Skating with Web Components](http://slides.com/treshugart/skating-with-web-components#/)
- [SydJS: Still got your Skate on](http://slides.com/treshugart/still-got-your-skate-on#/)
- [Kickflip: Functional web components with SkateJS](https://github.com/skatejs/kickflip)



## Questions?

If you have any questions about Skate you can use one of these:

- [Gitter](https://gitter.im/skatejs/skatejs)
- [HipChat](https://www.hipchat.com/gB3fMrnzo)



## `skate (componentName, componentDefinition)` API

The main `skate()` function is the entry-point to the API and is what defines your custom element.

*All experimental members are marked with an asterisk (\*).*



### Return Value

The `skate()` function returns you a function / constructor that you can use to create an instance of your component.

```js
var MyComponent = skate('my-component', {
  created: function (elem) {}
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
MyComponent.created;
```

It also contains extra information about the component:

- `id` The id / name of the component. In this case it would be `my-component`.
- `isNative` Whether or not the definition is using native custom elements underneath the hood.
- `name` Same as `id`, but the name of the function / constructor is reflected properly when debugging. This doesn't work in WebKit because it's non-configurable.



### `componentName`

The `componentName` is a string that is the tag name of the custom element that you are creating. If you are using / creating [custom component types](https://github.com/skatejs/types), then this may correspond to something else. Even though that's possible, Skate is a custom element library. It always will be at its core.



### `componentDefinition`

The `componentDefinition` argument is an object literal or constructor / function / class that houses your component definition. The following options are supported and are chronologically ordered in terms of where they get used in the component's lifecycle.



#### `prototype`

The element's prototype. This is the first thing that happens in the element's lifecycle.

```js
skate('my-component', {
  prototype: {
    get someProperty () {},
    set someProperty () {},
    someMethod: function () {},
  }
});
```

In native custom elements, you must provide the entire prototype for your custom element. This means that even if you're creating a new custom element, you must be explicit about it:

```js
document.registerElement('my-component', {
  prototype: Object.create(HTMLElement.prototype, {
    someProperty: {
      get: function () {},
      set: function () {}
    },
    someMethod: {
      value: function () {}
    }
  })
});
```

If your `prototype` doesn't inherit from the base `HTMLElement`, Skate will automatically do this for you.



#### `events`

Event listeners to add to the custom element. These get bound after the `prototype` is set up and before `created` is called.

```js
skate('my-component', {
  events: {
    click: function (e) {}
  }
});
```

The context and arguments passed to the event handler are the same as the native [`EventTarget.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) method:

- `this` is the DOM element
- `e` is the native event object that was dispatched on the DOM element



##### Event Delegation

Event descriptors can use selectors to target descendants using event delegation.

```js
skate('my-component', {
  events: {
    'click button': function (e) {}
  }
});
```

Instead of firing for every click on the component element - or that bubbles to the component element - it will only fire if a descendant `<button>` was clicked.



#### `created`

Function that is called when the element is created. This corresponds to the native `createdCallback`. It is the first lifecycle callback that is called and is called after the `prototype` is set up.

```js
skate('my-component', {
  created: function (elem) {}
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



##### `created`

A function that is called during the `created` lifecycle of the element. It's useful when you need to some setup that is specific to a given property.

```js
skate('my-component', {
  properties: {
    myProp: {
      created (elem, data) {
        // do some setup
      }
    }
  }
});
```

The parameters passed to the function are:

- `elem` - the component element
- `data` - an object containing information about the property
  - `name` - the property name
  - `internalValue` - the internal value of the property at the time of creation



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

Function that is called to render the element. This is called after the `properties` have been set up on the element so they are accessible here. This function is not called if the `resolvedAttribute` has been applied to the element. This means that you can render your componnent on the server and still go through its lifecycle.

```js
skate('my-component', {
  render: function (elem) {
    elem.innerHTML = '<p>something</p>';
  }
});
```

The only argument passed to `render` is the component element. In this case that is `<my-component>`.



##### Custom renderers

Writing your own renderers consists of writing a function that returns a function:

```js
function render (renderFn) {
  return function (elem) {
    elem.innerHTML = renderFn(elem);
  };
}

skate('x-hello', {
  properties: {
    name: {
      attribute: true,
      set: skate.render
    }
  },
  render: render(function (elem) {
    return `<div>Hello, ${elem.name || 'World'}!</div>`;
  })
});
```

Or using something like [skatejs-dom-diff](https://github.com/skatejs/dom-diff) for virtual DOM diffing and patching:

```js
var div = skatejsDomDiff.vdom.div;
var render = skatejsDomDiff.render;

skate('x-hello', {
  properties: {
    name: {
      attribute: true,
      set: skate.render
    }
  },
  render: render(function (elem) {
    return div('Hello, ', elem.name || 'World', '!');
  })
});
```

Both components have the same result, however, the latter only patches the DOM that needs updating which means the `Hello, ` and `!` text nodes won't be updated when the `name` changes and the component re-renders.

*A complete approach to writing more functional web components can be found in the [`kickflip`](https://github.com/skatejs/kickflip) repo.*



#### `ready`

Function that is called after the element has been rendered (see `render`).

```js
skate('my-component', {
  ready: function (elem) {}
});
```

The only argument passed to `ready` is component element. In this case that is `<my-component>`.



#### `attached`

Function that is called after the element has been inserted to the document. This corredsponds to the native `attachedCallback`. This can be called several times, for example, if you were to remove the element and re-insert it.

```js
skate('my-component', {
  attached: function (elem) {}
});
```

The only argument passed to `attached` is component element. In this case that is `<my-component>`.



#### `detached`

Function that is called after the element has been removed from the document. This corredsponds to the native `detachedCallback`. This can be called several times, for example, if you were to remove the element, re-attach it and the remove it again.

```js
skate('my-component', {
  detached: function (elem) {}
});
```

The only argument passed to `detached` is component element. In this case that is `<my-component>`.



#### `attribute`

Function that is called whenever an attribute is added, updated or removed. This corresponds to the native `attributeChangedCallback` and is *not* called for attributes that exist on the element before it is upgraded, just like with native custom elements. Generally, you'll probably end up using `properties` that have linked attributes instead of this callback.

```js
skate('my-component', {
  attribute: function (elem, data) {
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

The arguments passed to the `attribute` callback differ from the native `attributeChanged` callback to provide consistency and predictability with the rest of the Skate API:

- `elem` is the component element
- `data` is an object containing attribute `name`, `newValue` and `oldValue`. If `newValue` and `oldValue` are empty, the values are `undefined`.



#### `extends` *

The built-in element to extend. This option is up for contention in the custom element spec and may be removed in a future release. It exists because it's currently the only way to extend built-in types natively.

```js
skate('my-component', {
  extends: 'input'
});
```

Skate will automatically detect the native prototype for the element that you are extending and ensure that your `prototype` extends it, rather than you having to do this manually. This is also explained in the `prototype` option.



#### `type`

The [custom type](https://github.com/skatejs/types) to use if diverging from the spec.

```js
skate('my-component', {
  type: customType
});
```



##### Custom bindings

Skate supports custom bindings such as the ability to bind functionality to elements that have a particular attribute or classname. This comes in handy when wanting to work with legacy code that uses class / attribute selectors to bind stuff to elements on `DOMContentLoaded` because it negates the need to use selectors and / or `DOMContentLoaded` altogether. Not only does this have added performance benefits because you're not running selectors or blocking, it also means that you don't have to run any manual initialisation code. Just write your HTML and things happen.

The actual binding functionality isn't built into Skate. Skate simply offers an API for you to use custom bindings that you or others have written. If you want to write a binding, all you have to do is provide a particular interface for Skate to call.

```js
var myCustomBinding = {
  create: function (componentDefinition) {
    // Create an element matching the component definition.
  },
  reduce: function (element, componentDefinitions) {
    // Return the component that the element should upgrade to, or falsy if it
    // doesn't exist.
  }
};
```

There's some that we've already built for you over at https://github.com/skatejs/types.



###### Considerations

There's a few things that you must consider when building and using custom bindings:

- You're deviating from the spec - Skate will always be a superset of the custom element spec. This means that core-Skate will never stray too far from the spec other than offering a more convenient API and featureset.
- Performance - The `reduce` callback is performance-critical. This function *must* be run for every single element that comes into existence. Be very aware of this.
- With great power comes great responsibility - No matter if we decided to expose this as API or not, we'd still have to do a similar algorithm behind the scenes. Since there are many use-cases where writing a component with the Skate API is useful, we felt it was best to offer safe, spec-backed defaults while giving developers a little bit of breathing room.



###### Transitioning Away from jQuery-style Plugins

Because Skate supports custom bindings as mentioned above, it allows you to do things like refactor your jQuery initialisation code without touching any HTML:

```js
jQuery(function ($) {
  $('.tabs').tabs();
});
```

There's several problems with this approach. First, you're running a selector against the document. This is unnecessary and can get slow in large DOMs even in the latest browsers. Second, it only gets executed on `DOMContentLoaded`. If you want to dynamically add some tabs to your document, then you've got to manually call that again once they've been added to the DOM.

With Skate, those problems vanish. No selectors are run and your tabs will automatically be initialised regardless of when they are put into the document.

To refactor that into a Skate component, all you need to do is:

```js
var types = require('skatejs-types');

skate('tabs', {
  type: types.classname,
  created: function (element) {
    jQuery(element).tabs();
  }
});
```

Possibly the best part about this is that you don't need to touch any markup and only a minimal amount of JavaScript.




#### `resolvedAttribute`

The name of the attribute that is added after the element is upgraded. This can be used to server-side render your custom element because if this is present, `render` will not be called. It can also be added to target elements without this attribute to have styling that helps to prevent FOUC or jank.

```html
<my-component resolved />
```



#### `unresolvedAttribute`

The name of the attribute that is removed from the element after it is upgraded. It can be used to selectively target elements that have not been upgraded yet.

```html
<my-component unresolved />
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
var element = document.createElement('my-element');
skate.init(element);
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
document.createElement('div', 'my-element');
```

And in polyfill land, it's much different:

```js
var element = document.createElement('div');
element.setAttribute('is', 'my-element');
skate.init(element);
```

Both the native and polyfilled examples above expose too many implementation details. It's much better to have one simple and consistent way to create an element.



#### Alternatives

If you have access to the function / constructor returned from the `skate()` call, invoking that does the same exact thing as `skate.create()`:

```js
var myElement;
var MyElement = skate('my-element', {});

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



### `emit (element, eventName, eventOptions = {})`

Emits a `CustomEvent` on `element` that `bubbles` and is `cancelable` by default. This is useful for use in components that are children of a parent component and need to communicate changes to the parent.

```js
skate('x-tabs', {
  events: {
    selected: hideAllAndShowSelected
  }
});

skate('x-tab', {
  events: {
    click: function () {
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
skate.emit(element, 'event1 event2');
skate.emit(element, [ 'event1', 'event2' ]);
```



#### Return Value

The native `element.dispatchEvent()` method returns `false` if the event was cancelled. Since `skate.emit()` can trigger more then one event, a `Boolean` return value is ambiguous. Instead it returns an `Array` of the event names that were canceled.



#### Preventing Bubbling or Canceling

If you don't want the event to bubble, or you don't want it to be cancelable, then you can specify those options in the `eventOptions` argument.

```js
skate.emit(element, 'event', {
  bubbles: false,
  cancelable: false
});
```



#### Passing Data

You can pass data when emitting the event with the `detail` option in the `eventOptions` argument.

```js
skate.emit(element, 'event', {
  detail: {
    data: 'my-data'
  }
});
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



### `init (...elements)`

It's encouraged that you use `skate.create()` and `skate.fragment()` for creating elements and ensuring that they're synchronously initialised, however, there are edge-cases where synchronously initialising an existing element `skate.init()` may be necessary.

```js
skate.init(element1, element2);
```

*You shouldn't use skate.init() in native to ensure descendant DOM is initialised as there's stuff native does that we don't emulate with it. See the docs on `skate.ready()` for how you can interact with descendant components after they've been upgraded.*



### `noConflict ()`

Same as what you'd come to expect from most libraries that offer a global namespace. It will restore the value of `window.skate` to the previous value and return the current `skate` object.

```js
var currentSkate = skate.noConflict();
```

*No conflict mode is only available from the version in `dist/` since that's the only version that exports a global.*



### `properties`

Skate has some built-in property definitions to help you with defining consistent property behaviour within your components. All built-in properties are functions that return a property definition.

```js
skate.properties.boolean();
```

You are able to pass options to these properties to override built-in behaviour, or to define extra options that would normally be supported by a Skate property definition.

```js
skate.properties.boolean({
  coerce: function () {
    // coerce it differently than the default way
  },
  set: function () {
    // do something when set
  }
});
```

Generally built-in properties will only return a definition containing `coerce`, `deserialize` and `serialize` options. They may also define a `deafult`, such as with the `boolean` property.

*Empty values are defined as `null` or `undefined`. All empty values, if the property accepts them, are normalised to `undefined`.

*Properties are only linked to attributes if the `attribute` option is set. Each built-in property, if possible, will supply a `deserialize` and `serialize` option but will not be linked by default.*



#### `boolean`

The `boolean` property allows you to define a property that should *always* have a boolean value to mirror the behaviour of boolean properties / attributes in HTML. By default it is `false`. If an empty value is passed, then the value is `false`. If a boolean property is linked to an attribute, the attribute will have no value and its presence indicates whether or not it is `true` (present) or `false` (absent).



#### `number`

Ensures the value is always a `Number` and is correctly linked to an attribute. Empty values are not coerced to Numbers. If a value cannot be coerced then it is `NaN`.



#### `string`

Ensures the value is always a `String` and is correctly linked to an attribute. Empty values are not coerced to strings.



### `ready (elementOrElements, callback)` *

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
  created: function (elem) {
    var b = elem.querySelector('component-b');

    // undefined
    b.initialised;

    // Your selected elements are passed to the callback as the first argument.
    skate.ready(elem.querySelector('component-b'), function (b) {
      // true
      b.initialised;
    });
  },
  render: function (elem) {
    elem.innerHTML = '<component-b></component-b>';
  }
});

skate('component-b', {
  created: function (elem) {
    elem.initialised = true;
  }
});
```



#### Drawbacks

This does not solve the situation where you want to be notified of future elements that may be added somewhere in your descendant DOM. That is more a concern of what API you choose to expose to your consumers, the rendering path you choose and the problem you're trying to solve. This only concerns itself with the descendant nodes that you *know* exist. Most of the time this will come from the `render` lifecycle callback.



### `render (element)`

Invokes the `render()` lifecycle callback on the specified element for the components that are bound to it. If no components are found for the element, nothing happens.

```js
var hello = skate('x-hello', {
  render: function (elem) {
    elem.innerHTML = `Hello, ${elem.name || 'World'}!`;
  }
});

// <x-hello>Hello, World!</x-hello>
var elem = hello();

// <x-hello>Hello, Bob!</x-hello>
elem.name = 'Bob';
skate.render(elem);
```

This is extremely useful when using properties in conjunction with a virtual DOM renderer. See [custom renderers](#custom-renderers) for more information.



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
var XParent = skate('x-parent', {
  static created () {

  }
  static get events {
    return {
      event1 () {}
    }
  }
});

var XChild = skate('x-child', class extends XParent {
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

Skate implements the [Custom Element spec](http://w3c.github.io/webcomponents/spec/custom/) with a custom API but it does not polyfill the native methods. Since Skate is a custom element library, it does not polyfill [ShadowDOM](http://w3c.github.io/webcomponents/spec/shadow/) or [HTML Imports](http://w3c.github.io/webcomponents/spec/imports/).



## WebComponentsJS Differences

[webcomponentsjs](https://github.com/webcomponents/webcomponentsjs)

Like the web component differences mentioned above, Skate only polyfills and value-adds to the Custom Element spec, so it will only compare to the Custom Element polyfill. The notable differences are:

- Skate does much more.
- Skate is faster. If it's not, it's a bug. See the [perf tests](https://github.com/skatejs/skatejs/tree/master/test/perf).
- Skate is smaller (15k vs 17k min, no gzip).
- Skate does not override any native methods.
- You can have multiple versions of Skate on the page.
- Skate can work with the WebComponentsJS polyfills on the page, but will ignore the Custom Element polyfill.



## Native Custom Element Support

If your component is not using custom types and your browser supports custom elements then Skate will use the native DOM implementation instead of using Mutation Observers which will have added performance benefits. This all happens underneath the hood and the API does not change.

We strive to ensure Skate has as little base overhead as possible. What this means is that if you build a component with Skate vs with native it should not have a negative impact on performance. Of course, there will always be some overhead, but it should not be significant.

### Spec Stability

Currently, the custom element spec is no longer contentious. There is still a lot of work for them to finalise which will hold up browser adoption and there are quite a few changes than what is currently implemented in browsers that have native implementations. For this reason, we will strive to keep things as stable as possible and make transitions between changes as smooth as possible. However, it won't come without some breaking changes. For this reason we are opting to not release a `1.0` until the custom element spec is stable. This is so that our versioning stays semantic and reflects our confidence in the stability of the spec. Breaking changes will *always* be made in minor releases while still in `0.*` releases.


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



## Polyfills

As you may know, the only way to polyfill Mutation Observers is to use the deprecated DOM 3 Mutation Events. They were deprecated because if you insert 5k elements at once, you then trigger 5k handlers at once. Mutation Observers will batch that into a single callback.

Skate requires that you BYO your own [Mutation Observers](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) implementation. There are several out there:

- https://github.com/webcomponents/webcomponentsjs (requires WeakMap polyfill)
- https://github.com/megawac/MutationObserver.js
- https://github.com/bitovi/mutationobserver



## Preventing FOUC

An element may not be initialised right away. To prevent FOUC, you can add the `unresolved` attribute to any web component element and then use that attribute to hide the element in your stylesheets.

```html
<style>
  [unresolved] {
    opacity: 0;
  }
</style>
<my-element unresolved></my-element>
```

The `unresolved` attribute will be removed after the `created()` callback is called and before the `attached()` callback is called.

Additionally, after removing the `unresolved` attribute, Skate will add the `resolved` attribute. This allows you to transition your styles:

```css
[resolved] {
  opacity: 1;
  transition: opacity .3s ease;
}
```



## Ignoring Elements

If you have a DOM tree that you don't want Skate to polyfill then you can add the `data-skate-ignore` attribute. This is ideal for mitigating performance issues associated with older browsers and inspecting each element that is added to the document. Generally this is only an issue in Internet Explorer and dealing with hundreds of thousands of elements. If your browser natively supports Custom Elements then this attribute is ignored.

```html
<div data-skate-ignore>
  <!-- Everything including the container will be ignored. -->
</div>
```



## Multiple Version Support

On top of offering a no-conflict mode, Skate plays well with multiple versions of itself on the same page. Prior to version `0.11` Skate did not share a registry or mutation observers. `0.11` and later share a registry and a mutation observer. This means that trying to register the same component in `0.11` and `0.12` would result in an error. Sharing a mutation observer ensures that there is only a single mutation observer on the page that is scanning incoming elements if the versions are compatible. This drastically helps with performance. If the shared code is updated in a backward incompatible way, the different versions will still function, but will not be able to share code. This is an implementation detail that you generally won't need to be concerned with.




## Designing Web Components

A web component's public API should be available both imperatively (via JavaScript) and declaratively (via HTML). You should be able to do everything in one, that you can do in the other within reason.



### Imperative

You should always try and make the constructor available whether it's exported from an ES2015 module or a global:

```js
window.MyComponent = skate('my-component', {});

// Somewhere else.
var element = window.MyComponent();
```



### Declarative

By declaring a Skate component, you are automatically making your element available to be used as HTML:

```html
<my-component></my-component>
```



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
      deserialize: function (val) {
        return val.split(',');
      },
      serialize: function (val) {
        return val.join(',');
      }
    }
  }
});
```



### Content Projection

Content projection - or allowing the user to define content which the component can use in its template - is a difficult subject not to be opinionated about. The Shadow DOM spec is supposed to deal with this, but it's still being fully fleshed out and is ~~probably~~ a ways off from full browser support. Until then, we have to find other ways to do this.

An example of this would be if you wanted to create a custom select box that the user can pass options to. And in this select box, you want to put the user's options into a particular spot in your template.

```html
<my-select>
  <my-option>1</my-option>
  <my-option>2</my-option>
</my-select>
```

And you want it to render out to:

```html
<my-select>
  <div class="wrapper">
    <my-option>1</my-option>
    <my-option>2</my-option>
  </div>
</my-select>
```

Dealing with this can be done in many ways.

A simple, straight-forward way to do this would be to take the `childNodes` at the time of rendering, and put them where you want them. In this case, you're creating a `<div>`, putting all initial children in it and then appending that div to the main component:

```js
skate('my-select', {
  render: function (elem) {
    var div = document.createElement('div');
    div.classList.add('wrapper');
    while (elem.hasChildNodes()) {
      div.appendChild(elem.firstChild);
    }
    elem.appendChild(div);
  }
});
```

This can very easily be abstracted to a function and reused. However, with updates, it starts to get awkward. Your user shouldn't have to `querySelector` for the `<div>` where all the content is and append children to it; they shouldn't even know about that `<div>` at all.

A simple way to get around this, is to create a property that represents that `<div>` and expose it as part of your public API. In the above `render` function, you could add:

```js
Object.defineProperty(elem, 'content', {
  value: div,
  writable: false
});
```

Your consumers can then use that property to add more options:

```js
var option = document.createElement('option');
var select = document.querySelector('my-select');
option.textContent = '3';
select.content.appendChild(option);
```

Which would result in:

```html
<my-select>
  <div class="wrapper">
    <my-option>1</my-option>
    <my-option>2</my-option>
    <my-option>3</my-option>
  </div>
</my-select>
```



### React Integration

You can create React components from web components (thus Skate components work) using [react-integration](https://github.com/skatejs/react-integration).
