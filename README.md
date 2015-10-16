[![Build Status](https://travis-ci.org/skatejs/skatejs.png?branch=master)](https://travis-ci.org/skatejs/skatejs)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/skatejs.svg)](https://saucelabs.com/u/skatejs)

*This is the README for the master branch and is probably out of sync with the last stable release. To see the README for the last stable release select it from the list of tags.*

# Skate

Skate is a web component library that provides an API to bind behaviour to DOM elements. It's based on the W3C specification for Custom Elements.

- Provides a superset of the [Custom Element Spec](http://w3c.github.io/webcomponents/spec/custom/).
- Hooks for an elements lifecycle, custom properties and event delegation.
- Small, 5k min+gz.
- Allows easy transition from selector-based behaviour binding to element binding.

*Skate will soon be joining the [jQuery Foundation Project Incubator](https://jquery.org/) and will be helping to define that process moving forward. Nothing will change for users or contributors before, during or after the transition.*

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


- [Compatibility](#compatibility)
- [Installing](#installing)
  - [UMD (AMD / CommonJS)](#umd-amd--commonjs)
  - [ES6 Modules](#es6-modules)
  - [Global](#global)
- [Usage](#usage)
- [Component Lifecycle](#component-lifecycle)
- [Event Binding](#event-binding)
- [Constructing Elements](#constructing-elements)
  - [Function Call](#function-call)
  - [`skate.create()`](#skatecreate)
  - [Constructor](#constructor)
  - [Hydrating Properties](#hydrating-properties)
- [Extending Elements](#extending-elements)
- [Custom Methods and Properties](#custom-methods-and-properties)
- [Asynchrony](#asynchrony)
- [API](#api)
  - [`create (name, props = {})`](#create-name-props--)
  - [`emit (eventName, eventOptions = {})`](#emit-eventname-eventoptions--)
  - [`fragment ()`](#fragment-)
  - [`init ()`](#init-)
  - [`noConflict ()`](#noconflict-)
  - [`render ()`](#render-)
  - [`version`](#version)
- [Web Component Differences](#web-component-differences)
- [Transitioning Away from jQuery-style Plugins](#transitioning-away-from-jquery-style-plugins)
- [Native Support](#native-support)
- [Polyfills](#polyfills)
- [Preventing FOUC](#preventing-fouc)
- [Ignoring Elements](#ignoring-elements)
- [No Conflict](#no-conflict)
- [Multiple Version Support](#multiple-version-support)
- [Contributing](#contributing)
  - [Setup](#setup)
  - [Testing](#testing)
  - [Linting](#linting)
  - [Distribution](#distribution)
  - [Releasing](#releasing)
  - [Deploying](#deploying)
- [Who's Using It?](#whos-using-it)
- [Maintainers](#maintainers)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Compatibility

IE9+ and all evergreens.



## Questions?

If you have any questions about Skate, feel free to join the public [HipChat room](https://www.hipchat.com/gB3fMrnzo) and @mention a member.



## Installing

You can download the source yourself and put it wherever you want. Additionally you can use Bower:

    bower install skatejs

Or NPM:

    npm install skatejs

Or JSPM:

    jspm install npm:skatejs

Include either `dist/skate.js` or `dist/skate.min.js`.



### UMD (AMD / CommonJS)

UMD files are located in `lib/`. Simply `require` the `lib/index.js` file by whatever means you have and use it in accordance with whatever loader you've chosen.



### ES6 Modules

The Skate source is written using [ES6 modules](http://www.2ality.com/2014/09/es6-modules-final.html). If you're using a transpilation method, then you can `import skate from 'src/index';` and use it in your projects as you would any ES6 module.



### Global

If you're still skating old school the `dist` directory contains the compiled ES5 source. The compiled source does not use a module loader; everything will just work. Access Skate as a global with `skate`.



## Usage

You define a component by passing a component ID and definition to the `skate()` function. The ID you specify corresponds to one of the following:

- Tag name
- Value of the `is` attribute
- Attribute name
- Class name

The definition is an object of options that define your component.

```js
skate('my-element', {
  // Lifecycle Callbacks

  // Called before the element is set up. Descendants components may or may not
  // be initialised yet.
  created: function (elem) {},

  // Called when the element is attached to the document.
  attached: function (elem) {},

  // Called when the element is detached from the document.
  detached: function (elem) {},

  // Gets called after the element is set up and all descendant components are
  // initialised. This callback will be called on descendants before it is
  // called on the host element.
  ready: function (elem) {},

  // Should return a value for the renderer() lifecycle callback to use. By
  // default this should return a string, but if you supply a custom renderer()
  // then the return value can be anything that the renderer() can understand.
  //
  // When running in the browser, the element will be passed as the only
  // argument. It's recommended that you use the object as a state object, or
  // an object of properties. If you do this, then you can use this callback
  // standalone to render the element on the server-side without having to
  // support a DOM API.
  //
  // All properties that you define in the component definition will be
  // available on the element. This means that if you override the innerHTML
  // property that the original value of that property will be available for
  // you to use here.
  render: function (elem) {
    return '<shadow><dom>' + elem.innerHTML + '</dom></shadow>';
  },

  // The renderer() is responsible for rendering the result of the render()
  // callback. This callback is optional and defaults to setting the inner HTML
  // of the host element once. It's up to update the element how you see fit.
  //
  // It gets two parameters. The first is the element that is being rendered to
  // and the second is a function that is already bound with the correct
  // arguments that returns the rendered content every time it is called.
  renderer: function (elem, render) {
    elem.innerHTML = render();
  },

  // Called when an attribute is created, updated or removed.
  attribute: function (elem, data) {
    if (data.oldValue === undefined) {
      // created
    } else if (data.newValue === undefined) {
      // removed
    } else {
      // updated
    }
  },

  // Event Listeners
  events: {
    // All direct and bubbled events.
    click: function (e) {
      // Refers to the component element.
      this;

      // Standard DOM event object.
      e;

      // Same as `this`.
      e.delegateTarget;
    },

    // Restricted to events triggered only on the component element. Arguments
    // are the same as above.
    'click my-element': function (e) {},

    // Event delegation.
    'click .something': function (e) {
      // Same as above.
      this && e;

      // Instead matches whatever `.something` is.
      e.delegateTarget;
    },

    // Multiple handlers.
    click: [
      handler1,
      handler2
    ],

    // Focus and blur can be delegated, too.
    'focus .something': function () {},
    'blur .something': function () {}
  },



  // Extending Elements
  //
  // Restricts a particular component to binding explicitly to an element with
  // a tag name that matches the specified value. This value is empty by
  // default.
  //
  // Depending on the component type, it behaves like so:
  //
  // - When applied to a custom element, the component ID is used to match the
  //   value of the element's `is` attribute and the element's tag name is
  //   matched against the value specified here. This conforms with the custom
  //   element spec.
  //
  // - When given to a component that binds to an element using an attribute,
  //   the value specified here must match the element's tag name.
  //
  // - When specified on a component that is bound using a class name, this
  //   value must match the element's tag name.
  //
  // - If the value is empty, then the component is not restricted at all.
  extends: '',



  // Custom Property Descriptors
  properties: {
    prop1: {
      // Two-way binding to attributes. Changes to this property propagate to
      // its corresponding attribute and changes to its corresponding attribute
      // are propagated to the property.
      //
      // This defaults to `false`. If you specify `true` the property name is
      // dash-cased and used as the attribute it should keep in sync with. If
      // you specify a `string`, it is used as the attribute name.
      attribute: false,

      // Serializes the property value when it is set so that it can be stored
      // as an attribute value. This only is called if this property is linked
      // to an attribute.
      serialize: function () {},

      // Deserializes the attribute value when it is set so that it can be
      // set as the property value. This only is called if this property is
      // linked to an attribute.
      deserialize: function () {},

      // This will be used as the default value for the property. If you specify
      // a function then it will be invoked and the return value will be used.
      // This option will also be used in place of the value returned from the
      // `get()` option if it returns `undefined`. This does not override any
      // values present on the element when at the time it is initialised.
      default: 'default value'

      // Whether or not to trigger events when the property changes. Defaults to
      // `false`.
      //
      // If `true`, a `skate.property` event is emitted when the property is
      // set. If a `string`, it is used as the event name that will be emitted
      // when the property is set.
      //
      // The event object for the event that is triggered contains the following
      // information:
      //
      // - `name` - The property name.
      // - `newValue` - The property's new value.
      // - `oldValue` - The property's old value.
      emit: false,

      // Custom getter. The return value is used as the property value when
      // retrieved. If you don't specify a getter, the value that it was set as
      // is returned regardless of if you've specified a setter.
      //
      // The getter is passed a single argument which is the element in which
      // the property was accessed.
      //
      // To make a property "readonly", specify a getter without a setter.
      get: function () {},

      // Custom setter. Set value as you see fit. Return value is ignored. If
      // you don't specify a getter, then whatever `newValue` was passed in to
      // the setter, is returned when you access the property.
      // You receive two arguments:
      //
      // - `element` The element that the property is being set on.
      // - `changeData` Information about the change.
      //
      // The `changeData` property has three entries:
      //
      // - `name`
      // - `newValue`
      // - `oldValue`
      //
      // If you set the value to the same value that the property already
      // is, then the setter is still triggered. However, both `newValue` and
      // `oldValue` will be the same value.
      set: function (element, changeData) {},

      // A function that gets called before `set()`. It's up to you what you do
      // here. You can log, warn, or throw an exception if an unacceptable value
      // is detected. If you simply want to coerce the value, return the coerced
      // value. You *must* return a value from this. If you don't return, then
      // the coerced value becomes `undefined`.
      type: function () {}
    }
  },



  // Custom Methods and Properties
  //
  // This behaves just like any prototype object does. All methods and
  // properties are added to the element's prototype (native), or to the element
  // instance during the `created` lifecycle (polyfill).
  //
  // It's recommended you use the `properties` option for all public-api
  // properties, but nothing is stopping you from putting them here if you
  // don't need the special behaviour of `properties`.
  prototype: {
    get someProperty () {},
    someMethod: function () {}
  },


  // Component Types
  //
  // The type of component this is. By default, this makes your component
  // conform to the custom element spec, but you can use custom types if
  // required.
  //
  // - Attribute type: https://github.com/skatejs/type-attribute
  // - Class type: https://github.com/skatejs/type-class
  type: {}



  // Preventing FOUC
  //
  // The `resolved` and `unresolved` attributes allow you to style a resolved
  // or unresolved component. You can changes these if you want to use different
  // names.

  // The attribute name to add after calling the `created` callback.
  resolvedAttribute: 'resolved',

  // The attribute name to remove after calling the `created` callback.
  unresolvedAttribute: 'unresolved'
});

```



## Component Lifecycle

The component lifecycle consists of several paths in the following order starting from when the element is first created.

1. `prototype` is set up in non-native (alread set up in native)
2. `events` are set up
3. `properties` are defined
4. `created` is invoked
5. `renderer` is invoked with the result of `render` to stamp out the component's structure
6. `properties` are initialised
7. `ready` is invoked
8. `attached` is invoked when added to the document (or if already in the document)
9. `detached` is invoked when removed from the document
10. `attribute` is invoked whenever an attribute is updated

Each callback gets the element passed in as the first argument. The attribute callback gets an additional argument with information about the change:

```js
skate('my-element', {
  attribute: function (element, change) {
    if (change.oldValue === undefined) {
      // created
    } else if (change.newValue === undefined) {
      // removed
    } else {
      // updated
    }
  }
});
```

The change object contains the following properties:

- `name` The name of the attribute that was changed.
- `newValue` The new value of the attribute.
- `oldValue` The old value of the attribute.

The `attribute` callback is fired whenever an element attribute is created, updated or removed, but not if the attribute already exists on the element when it is first initialised. This is synonymous with the `attributeChangedCallback` in the web component spec. The only differences are:

- Undefined attribute values are normalised to be `undefined` instead of `null` to be consistent across the board.
- The function signature is different: the element is the first argument and the parameters are consolidated into a change object.



## Event Binding

```js
skate('my-element', {
  events: {
    // All direct and bubbled events.
    click: function (e) {
      // Refers to the component element.
      this;

      // Standard DOM event object.
      e;

      // Same as `this`.
      e.delegateTarget;
    },

    // Restricted to events triggered only on the component element. Arguments
    // are the same as above.
    'click my-element': function (e) {},

    // Event delegation.
    'click .something': function (e) {
      // Same as above.
      this && e;

      // Instead matches whatever `.something` is.
      e.delegateTarget;
    },

    // Multiple handlers.
    click: [
      handler1,
      handler2
    ],

    // Focus and blur can be delegated, too.
    'focus .something': function () {},
    'blur .something': function () {}
  }
});
```



## Constructing Elements

There's several different ways to construct an element.

### Function Call

```js
var myElement = skate('my-element', {});
var myElementInstance = myElement();
```

### `skate.create()`

```js
skate('my-element', {});
var myElementInstance = skate.create('my-element');
```

### Constructor

While not the most elegant way, this serves as an ode to the spec.

```js
var MyElement = skate('my-element');
var myElementInstance = new MyElement();
```

### Hydrating Properties

For each of the ways you can construct an element, Skate also allows you to pass a properties object to them. The properties object is used to hydrate property values for the element.

```js
var props = { propname: 'propvalue' };
var myElementInstance = myElement(props);
var myElementInstance = skate.create('my-element', props);
var myElementInstance = new MyElement(props);
```



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



## Custom Methods and Properties

Skate gives you the option to specify custom properties and methods on your component.

```js
skate('my-component', {
  prototype: {
    callMeLikeAnyNativeMethod: function () {}
  }
});
```

These members are applied directly to the element instance that your component is bound to so you can do stuff like this:

```js
document.getElementById('my-component-id').callMeLikeanyNativeMethod();
```



## Asynchrony

Due to the fact that Skate uses Mutation Observers - and polyfills it for older browsers - elements are processed asynchronously. This means that if you insert an element into the DOM, custom methods and properties on that element will not be available right away. This will not work:

```js
document.body.innerHTML = '<my-component id="my-component-id"></my-component>';

document.getElementById('my-component-id').someCustomMethod();
```

This is because the component will not be processed until after the block this code is in releases control back to the JavaScript engine. If you need to use the element right away, you must explicitly initialise it in a synchronous manner using `skate.init()`:

```js
var element = document.getElementById('my-component-id');

skate.init(element);

element.someCustomMethod();
```

This is very useful during testing, but can be used for any use case that requires synchronous operation.



## API

The following are all available on the `skate` object, or available for use from the `src/api` or `lib/api` folders.



### `create (name, props = {})`

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



#### `emit (element, eventName, eventOptions = {})`

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



### `emit (eventName, eventOptions = {})`

Same as above except that it makes forwarding events simpler by returning a function that uses `this` as the `element` and calls `skate.emit(element, eventName, eventOptions)`. Using this form, the `x-tab` component's `click` handler from the example above could be simplified as:

```js
click: skate.emit('selected')
```



### `fragment ()`

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


### `init ()`

It's encouraged that you use `skate.create()` and `skate.fragment()` for creating elements and ensuring that they're synchronously initialised, however, there are edge-cases where synchronously initialising an existing element `skate.init()` may be necessary.

```js
skate.init(element1, element2);
```

Note, that if you use a functional approach to rendering your custom elements, you should *never* need to use `skate.init()` as you shouldn't be querying for elements and interacting with them directly.



### `noConflict ()`

Same as what you'd come to expect from most libraries that offer a global namespace. It will restore the value of `window.skate` to the previous value and return the current `skate` object.

```js
var currentSkate = skate.noConflict();
```



### `render ()`

Renders the specified element using the render lifecycle specified in the first matched component. If no component is found for the element, nothing happens.

```js
var hello = skate('x-hello', {
  render: function (elem) {
    return `Hello, ${elem.name || 'World'}!`;
  }
});

// <x-hello>Hello, World!</x-hello>
var elem = hello();

// <x-hello>Hello, Bob!</x-hello>
elem.name = 'Bob';
skate.render(elem);
```

This makes it extremely useful when using properties because you can rewrite the above component to re-render itself while taking advantave of all that `properties` has to offer:

```js
var hello = skate('x-hello', {
  properties: {
    name: {
      attribute: true,
      default: 'World',
      set: skate.render
    }
  },
  render: function (elem) {
    return `Hello, ${elem.name}!`;
  }
});

// <x-hello name="World">Hello, World!</x-hello>
var elem = hello();

// <x-hello name="Bob">Hello, Bob!</x-hello>
elem.name = 'Bob';
```



### `version`

Returns the current version of Skate.



## Web Component Differences

Skate implements the [Custom Element spec](http://w3c.github.io/webcomponents/spec/custom/) with a custom API but it does not polyfill the native methods. Since Skate is a custom element library, it does not polyfill [ShadowDOM](http://w3c.github.io/webcomponents/spec/shadow/) or [HTML Imports](http://w3c.github.io/webcomponents/spec/imports/).

You can do some pretty cool things with Skate that you can't do with Web Components. For example, you can write polyfills for existing elements:

`<datalist>...</datalist>`:

```js
skate('datalist', {
  created: polyfillDatalistElement
});
```

`<input placeholder="">`:

```js
var typeAttribute = require('skatejs-type-attribute');

skate('placeholder', {
  extends: 'input',
  type: typeAttribute,
  created: polyfillInputPlaceholder
});
```

`<input type="date">`:

```js
var typeAttribute = require('skatejs-type-attribute');

skate('type', {
  extends: 'input',
  type: typeAttribute,
  properties: {
    type: skate.property.string({
      set: function (element, change) {
        if (change.newValue === 'date') {
          makeIntoDatepicker(element);
        }
      }
    })
  }
});
```

`<link rel="import" href="path/to/import.html">` (HTML Imports):

```js
var typeAttribute = require('skatejs-type-attribute');

skate('rel', {
  extends: 'link',
  type: typeAttribute,
  properties: {
    rel: skate.property.string({
      set: function (element, change) {
        if (change.newValue === 'import') {
          makeIntoHtmlImport(element);
        }
      }
    })
  }
});
```



## Transitioning Away from jQuery-style Plugins

Because Skate can also bind to attributes and classes, it offers a way to transition away from jQuery-style plugins to web components.

```js
jQuery(function ($) {
  $('.tabs').tabs();
});
```

There's several problems with this approach. First, you're running a selector against the document. This is unnecessary and can get slow in large DOMs even in the latest browsers. Second, it only gets executed on `DOMContentLoaded`. If you want to dynamically add some tabs to your document, then you've got to manually call that again once they've been added to the DOM.

With Skate, those problems vanish. No selectors are run and your tabs will automatically be initialised regardless of when they are put into the document.

To refactor that into a Skate component, all you need to do is:

```js
var typeClass = require('skatejs-type-class');

skate('tabs', {
  type: typeClass,
  created: function (element) {
    jQuery(element).tabs();
  }
});
```

Possibly the best part about this is that you don't need to touch any markup and only a minimal amount of JavaScript.



## Native Support

If your component is bound via custom tags and your browser supports custom elements then Skate will use the native DOM implementation instead of using Mutation Observers which will have added performance benefits. This all happens underneath the hood and the API does not change.



## Polyfills

As you may know, the only way to polyfill Mutation Observers is to use the deprecated DOM 3 Mutation Events. They were deprecated because if you insert 5k elements at once, you then trigger 5k handlers at once. Mutation Observers will batch that into a single callback.

Skate mostly polyfills [Mutation Observers](https://developer.mozilla.org/en/docs/Web/API/MutationObserver), but only internally. It is not usable outside of Skate since it only polyfills what Skate needs to function. Its code is written to withstand an extreme number of incoming DOM elements. It's fast in Internet Explorer, not just modern browsers, and this is what sets it apart from other polyfills. It also ensures that mutation events are queued, rather than executed as they come in. Once queued, they are batched into a single callback.



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



## No Conflict

Skate has a `noConflict()` method that we have come to expect from libraries that may come into conflict with the same name, or multiple versions of itself. It returns the new `skate` while restoring the global `skate` to the previous value.

```js
var mySkate = skate.noConflict();
```



## Multiple Version Support

On top of offering a no-conflict mode, Skate plays well with multiple versions of itself on the same page. Prior to version `0.11` Skate did not share a registry or mutation observers. `0.11` and later share a registry and a mutation observer. This means that trying to register the same component in `0.11` and `0.12` would result in an error. Sharing a mutation observer ensures that we don't have more than main mutation observer on the page scanning incoming elements which helps with performance.
