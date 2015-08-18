[![Build Status](https://travis-ci.org/skatejs/skatejs.png?branch=master)](https://travis-ci.org/skatejs/skatejs)

*This is the README for the master branch and is probably out of sync with the last stable release. To see the README for the last stable release select it from the list of tags.*

# Skate

Skate provides an API to bind behaviours to DOM elements. It's based on the W3C specification for <a href="http://w3c.github.io/webcomponents/spec/custom/">Custom Elements</a>.

HTML

```html
<my-element></my-element>
```

JavaScript

```js
skate('my-element', {
  created: function () {
    this.textContent = 'Hello, World!';
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
  - [`created`](#created)
  - [`attached`](#attached)
  - [`detached`](#detached)
  - [`attribute`](#attribute)
  - [`template`](#template)
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
  - [`chain (...args)`](#chain-args)
  - [`create (name, props = {})`](#create-name-props--)
  - [`emit (eventName, eventOptions = {})`](#emit-eventname-eventoptions--)
  - [`event ()`](#event-)
  - [`init ()`](#init-)
  - [`noConflict ()`](#noconflict-)
  - [`property (element, propertyName, propertyDefinition)`](#property-element-propertyname-propertydefinition)
  - [`property (element, propertyDefinitions)`](#property-element-propertydefinitions)
  - [`ready (callback)`](#ready-callback)
  - [`type`](#type)
  - [`version`](#version)
  - [`watch (element, callback, options = {})`](#watch-element-callback-options--)
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
  //
  // All lifecycle callbacks use `this` to refer to the component element (https://developer.mozilla.org/en-US/docs/Web/API/Element).

  // Called when the element is created.
  created: function () {},

  // Called when the element is attached to the document.
  attached: function () {},

  // Called when the element is detached from the document.
  detached: function () {},

  // Called when an attribute is created, updated or removed.
  attribute: function (name, oldValue, newValue) {
    if (oldValue === null) {
      // created
    } else if (newValue === null) {
      // removed
    } else {
      // updated
    }
  },

  // A function that renders a template to your element. Since this function is
  // responsible for rendering the template, you can literally use anything you
  // want here.
  template: function () {
    this.innerHTML = 'something';
  },



  // Event Listeners
  events: {
    // All direct and bubbled events.
    // e is the event object (https://developer.mozilla.org/en/docs/Web/API/Event)
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
      attr: false,

      // This property should be notified of changes when these dependencies
      // are notified of changes.
      //
      // You may also specify dependencies as space-separated string.
      deps: [
        // This property's notify events will be triggered when its sibling
        // `dependencyProperty` is notified of changes.
        'dependencyProperty',

        // This property's notify events will be triggered when the descendant's
        // `deepDependencyProperty` notify events are triggered.
        //
        // At the time the dependency event bubbles up from the descendant, it
        // must be accessible via `this.some.nested.child`. If it is not, then
        // the dependency is ignored.
        'some.nested.child.deepDependencyProperty'
      ],

      // Custom getter. The return value is used as the property value when
      // retrieved. If you don't specify a getter, the value that it was set as
      // is returned regardless of if you've specified a setter.
      //
      // To make a property "readonly", specify a getter without a setter.
      get: function () {},

      // Whether or not to trigger events when the property changes. Defaults to
      // `true`. If you do not want events triggered, set this to a falsy value.
      //
      // If this is truthy, when the property is changed it will trigger an
      // event called `skate.property` if `notify` is `true`, or an event with
      // the same name as `notify` if specified as a `String`.
      //
      // The event object for both events contains the following information
      // in the `detail` property:
      //
      // - `name` - The property name (String).
      // - `newValue` - The property's new value (String).
      // - `oldValue` - The property's old value (String).
      notify: true

      // Custom setter. Set value as you see fit. Return value is ignored. If
      // you don't specify a getter, then whatever `newValue` was passed in to
      // the setter, is returned by the default getter. If you want to return
      // a custom value, specify a getter.
      set: function (newValue, oldValue) {},

      // A function that coerces the value to another value. You can specify
      // any function you want here. The return value is then stored internally
      // and passed as `newValue` in the setter.
      type: Boolean,

      // This will be used as the initial value for the property. If you specify
      // a function then it will be invoked and the return value will be used.
      value: 'initial value'
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
  // The binding methods this component supports. For example, if you specify
  // the `type` as `skate.type.ELEMENT`, then the component will only be bound
  // to an element whos tag name matches the component ID.
  //
  // - `ELEMENT` Tag name only.
  // - `ATTRIBUTE` Attribute names.
  // - `CLASSNAME` Class names.
  type: skate.type.ELEMENT,



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

The component lifecycle consists several callbacks:

- `created`
- `attached`
- `detached`
- `attribute`
- `template`

### `created`

```js
skate('my-element', {
  created: function () {}
});
```

The `created` callback gets triggered when the element is created.

#### Timing

There are some differences when using native vs polyfilled support.

```js
// native: called immediately (synchronous)
// polyfill: called immediately (synchronous)
myElement();
new myElement();
skate.create('my-element');

// native: called immediately (synchronous)
// polyfill: called when inserted to the DOM (asynchronous)
document.createElement('my-element');

// native: called immediately (synchronous)
// polyfill: called when the mutation observer fires (asynchronous)
document.body.innerHTML = '<my-element></my-element>';

// native: called immediately (synchronous)
// polyfill: called when <div> is inserted into the DOM (asynchronous)
document.createElement('div').innerHTML = '<my-element></my-element>';
```

In instances where an element is initialized asynchronously, or your definition is loaded after the element is already on the page, there may be a flash of un-styled content. For more information see [Preventing FOUC](#preventing-fouc).

If using native custom elements, the element may not have any children when the `created` callback is invoked. You should not assume a specific structure exists. For more information see [skate.ready()](#ready-callback).

```js
// Will not have children.
document.createElement('my-el');

// Will have children.
document.body.innerHTML = '<my-el>child</my-el>';
document.createElement('div').innerHTML = '<my-el>child</my-el>';
```

### `attached`

```js
skate('my-element', {
  attached: function () {}
});
```

The `attached` callback is fired when the element is attached to the `document`. It can be invoked more than once. For example, if you were to add and remove the same element multiple times.

#### Timing

The `attached` callback is called synchronously in native custom elements and asynchronously when polyfilled.

### `detached`

```js
skate('my-element', {
  detached: function () {}
});
```

The `detached` callback is fired when the element is detached from the `document`. It can be invoked more than once. For example, if you were to add and remove the same element multiple times.

#### Timing

The `detached` callback is called synchronously in native custom elements and asynchronously when polyfilled.

### `attribute`

```js
skate('my-element', {
  attribute: function (name, oldValue, newValue) {
    if (oldValue === null) {
      // created
    } else if (newValue === null) {
      // removed
    } else {
      // updated
    }
  }
});
```

The `attribute` callback is fired whenever an element attribute is created, updated or removed. Unlike the native `attributeChangedCallback`, this gets fired for every attribute an element has by the time it is initialised.

#### Timing

Attribute handlers are notified synchronously. Instead of using mutation observers, `setAttribute` and `removeAttribute` are patched to notify the callback as soon as the change occurs. If your existing code uses timeouts to wait until after mutations happen to execute logic related to an attribute change, you don't need to worry about changing it. The only difference is you won't need to write async boilerplate anymore.

However, this means that updating the attribute instance directly is *not* supported. If you do the following, the `attribute` callback will *not* be notified of the change. For example the following will not trigger the `attribute` callback:

```js
myElement.attributes.myAttribute.value = 'new value';
```

You must use the attribute methods instead:

```js
myElement.setAttribute('myAttribute', 'new value');
```

### `template`

```js
skate('my-element', {
  template: function () {}
});
```

Since the template function is just a callback and it's up to you how you template the element, you can use any templating engine that you want.

#### Handlebars

```js
skate('my-element', {
  template: function () {
    var compiled = Handlebars.compile('<p>Hello, {{ name }}!</p>');
    this.innerHTML = compiled(this);
  }
});
```

A good way to reuse a template function is to simply create a function that takes a string and returns a function that templates that string onto the element. You could rewrite the above example to be reusable very easily:

```js
function handlebarify (html) {
  var compiled = Handlebars.compile(html);
  return function () {
    this.innerHTML = compiled(this);
  };
}

skate('my-element', {
  template: handlebarify('<p>Hello, {{name}}!</p>')
});
```

#### Shadow DOM

If you wanted to fully embrace Web Components, you could even use Shadow DOM:

```js
function shadowify (html) {
  return function () {
    this.createShadowRoot().innerHTML = html;
  };
}

skate('my-element', {
  template: shadowify('<p>Hello, <content></content>!</p>')
});
```

#### Virtual DOM

You could also use a virtual DOM implementation - such as [virtual-dom](https://github.com/Matt-Esch/virtual-dom) - here if you wanted to.

```js
import createElement from './path/to/virtual-dom/create-element';

function createVdomTree (props) {
  // Return your Virtual DOM tree.
}

skate('my-element', {
  template: function () {
    var tree = createVdomTree(this);
    var root = createElement(tree);

    // Initial render.
    this.appendChild(root);
  }
});
```

#### Responding to Component Changes

If you want to re-render your component when properties change, you can listen to the `skate.property` event triggered by defined `properties`.

With Handlebars you might do something like:

```js
skate('my-element', {
  template: function () {
    var render = handlebarify('<p>Hello, {{name}}!</p>');
    this.addEventListener('skate.property', render);
    render.call(this);
  }
});
```

If you're using Virtual DOM you might do something like:

```js
import createElement from './path/to/virtual-dom/create-element';
import diff from './path/to/virtual-dom/diff';
import patch from './path/to/virtual-dom/patch';

function createVdomTree (props) {
  // Return your Virtual DOM tree.
}

skate('my-element', {
  template: function () {
    var tree = createVdomTree(this);
    var root = createElement(tree);

    // Initial render.
    this.appendChild(root);

    // Subsequent renders.
    this.addEventListener('skate.property', function () {
      var newTree = createVdomTree(this);
      root = patch(root, diff(tree, newTree));
      tree = newTree;
    });
  }
});
```



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

### `chain (...args)`

Returns a function that attempts to make all arguments passed in callable. The arguments and context passed to the returned function are forwarded, so it can be used to compose behaviour. The context passed to the proxy function is returned.

```js
function increment () {
  ++this.calls;
}

var proxy = skate.chain(
  // Strings point to a method on the context.
  'increment',

  // Functions are invoked and passed the context.
  increment,

  // A new chain is created from array values.
  [ 'increment', increment ],

  // A new chain is created from object values.
  { key1: 'increment', key2: increment },

  // Same as both the array and object forms.
  skate.chain('increment', increment);
);

var context = proxy.call({
  calls: 0,
  increment: increment
});

// 8
console.log(context.calls);
```

This makes it really simple to compose functionality:

```js
function sharedFunction (e) {}

skate('my-element', {
  events: {
    click: skate.chain(
      'instanceMethod',
      sharedFunction,
      function (e) {}
    )
  },
  prototype: {
    instanceMethod: function (e) {}
  }
});
```

You could do all this with in a function, but it's nice not to have to worry about passing context and arguments. Everything is automatically invoked with the same context and arguments:

```js
function sharedFunction (e) {}

skate('my-element', {
  events: {
    click: function (e) {
      this.instanceMethod(e);
      sharedFunction.call(this, e);
      (function (e) {}(e));
    }
  },
  prototype: {
    instanceMethod: function (e) {}
  }
});
```



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



### `event ()`

[soon]



### `init ()`

[soon]



### `noConflict ()`

Same as what you'd come to expect from most libraries that offer a global namespace. It will restore the value of `window.skate` to the previous value and return the current `skate` object.

```js
var currentSkate = skate.noConflict();
```



### `property (element, name, definition)`

Defines the specified property `name` using `definition` on the `element`. The property definition is different than that normally specified to `Object.defineProperty()` and may contain the following options.

#### `attr`

Whether or not to link the property to an attribute. If `true`, then the property name will be converted from `camelCase` to `dash-case` and the result will be used as the linked attribute.

```js
attr: true
```

If a `String`, then that will be used as the linked attribute exactly as it is specified.

```js
attr: 'my-attribute-name'
```

No attribute is linked by default.

#### `deps`

A space-separated `String` or `Array` of property names that this property depends on. If any of these properties change, then this property's setter will be invoked.

```js
deps: 'dependency1 dependency2'
```

Or:

```js
deps: [ 'dependency1', 'dependency2' ]
```

You can also specify dependencies on nested components by giving the dependency a dot-separated path.

```js
deps: 'my.descendant.dependencyProperty'
```

If you do this, there are a couple requirements that must be met:

- The path (`my.descendant` in the above example) must be accessible from the element in which you're defining the property.
- The name (`dependencyProperty` in the above example) must be defined as a property on `my.descendant` and notifying turned on.

#### `get`

The custom getter for this property. If not specified, then the value is stored internally when the value is set and returned whenever it is retrieved. The element is passed as `this`.

If you want to make a property read-only, then specify `get` without `set`.

#### `notify`

Whether or not to emit an event when the property is set. Defaults to `true`.

If `true`, then a `skate.property` event is emitted:

```js
notify: true
```

If a `String`, then the value is used as the event name that is emitted.

```js
notify: 'emit-this-instead'
```

You may also specify any type of event spec that [`emit`](emit-element-eventname-eventoptions--) takes. This means you can specify a space-separated string or an array of event names.

```js
notify: 'event1 event2',
notify: [ 'event1', 'event2' ]
```

The event that gets emitted contains the following information in its `detail` property:

- `e.detail.name` The property name.
- `e.detail.newValue` The new value that was just set on the property.
- `e.detail.oldValue` The previous value of the property.

#### `set`

The custom setter for this property. The return value is ignored, so the logic in this method is responsible for setting the value however it needs to. The element is passed in as `this` and it receives two arguments: `newValue` and `oldValue`, in that order.

```js
set: function (newValue, oldValue) {
  this.someOtherValue = oldValue + newValue;
}
```

#### `type`

Responsible for coercing the value before the setter is called. The return value of this function is what is passed as `newValue` into the setter.

```js
type: Number
```

You can use `type` in conjunction with `attr` to make a boolean attribute:

```js
attr: true,
type: Boolean
```

When the property is passed a truthy value, the attribute is added and void of a value. When passed a falsy value, the attribute is removed.

#### `value`

The initial value for the property. It will be coerced and pass through the setter when initialised.

```js
value: 'initial value'
```

If you specify a `Function` then it will be called and the return value used as the initial value.

```js
value: function () {
  return 'initial value';
}
```

The element is *not* passed as `this` because property initialisation order is not guaranteed. If you need the element in order to compute the value, it's better to use `get` or `set` instead.

If you wanted to have a property linked to a boolean attribute and have it set on the element by default, all you'd have to do is:

```js
attr: true,
type: Boolean,
value: true
```



### `property (element, definitions)`

A way to define multiple property definitions to an `element` at once. The `definitions` argument is an object who's keys are the property names and values are the respective property definitions.



### `ready (callback)`

Executes `callback` when all components are loaded and all elements are upgraded. This comes in handy inside a component when it requires descendants to be upgraded before it uses them.

For example, the following may not work because parents are upgraded before descendants in native custom elements:

```js
skate('x-parent', {
  created: function () {
    this.querySelector('x-child').sayHello();
  }
});

skate('x-child', {
  prototype: {
    sayHello: function () {
      console.log('hello');
    }
  }
});
```

But wrapping the call to `sayHello()` will:

```js
skate.ready(function () { this.querySelector('x-child').sayHello() });
```



### `type`

Contains the constants for each type of binding that Skate supports. They are:

- `skate.type.ELEMENT` - Bind to a tag name.
- `skate.type.ATTRIBUTE` - Bind to an attribute name.
- `skate.type.CLASSNAME` - Bind to a class name.



### `version`

Returns the current version of Skate.



### `watch (element, callback, options = {})`

A convenient wrapper around Skate's internal `MutationObserver`. It allows you to watch an element for added or removed nodes.

```js
skate.watch(element, function (added, removed) {
  console.log(added.length);
  console.log(removed.length);
});
```

If you want to listen for changes to descendants, pass the `subtree` option:

```js
skate.watch(element, callback, { subtree: true });
```

Currently, no other options besides `subtree` are supported.



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
skate('placeholder', {
  extends: 'input',
  type: skate.type.ATTRIBUTE,
  created: polyfillInputPlaceholder
});
```

`<input type="date">`:

```js
skate('type', {
  extends: 'input',
  type: skate.type.ATTRIBUTE,
  attributes: {
    type: function (element, change) {
      if (change.newValue === 'date') {
        makeIntoDatepicker(element);
      }
    }
  }
});
```

`<link rel="import" href="path/to/import.html">` (HTML Imports):

```js
skate('rel', {
  extends: 'link',
  type: skate.type.ATTRIBUTE,
  attributes: {
    rel: function (element, change) {
      if (change.newValue === 'import') {
        makeIntoHtmlImport(element);
      }
    }
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
skate('tabs', {
  type: skate.type.CLASSNAME
  created: function () {
    jQuery(this).tabs();
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



## Contributing

The `.editorconfig`, `.jscs` and `.jshint` configs are all set up. If you can, enable these in your editor of choice.



### Setup

To get a dev environment up and running, all you should need to do is run:

```bash
npm install
```


### Testing

To run tests:

```bash
npm test
```

If you want to keep the Karma server alive to run them in your browser of choice:

```bash
npm test -- --watch
```

To run tests in a specific browser:

```bash
npm test -- --browsers Chrome,Firefox
```



### Linting

To lint your files with `jscs` and `jshint`:

```bash
npm run lint
```



### Distribution

To build the distribution all you have to do is run:

```bash
npm run dist
```

This will build `dist/skate.js` and `dist/skate.min.js`. Don't worry about doing this in a PR; it'll avoid conflicts.

To build the `lib` (ES5 + UMD) files:

```bash
npm run lib
```



### Releasing

To release all you've got to do is run `npm release`. You can either specify the release `type`, or `tag`.

```bash
npm run release -- --tag x.x.x
```

Or:

```bash
npm run release -- --type minor
```



### Deploying

To deploy the documentation, run the following command from the branch or tag which you want to deploy:

```bash
npm run deploy
```



## Who's Using It?

<img alt="Atlassian" src="http://www.atlassian.com/dms/wac/images/press/Atlassian-logos/logoAtlassianPNG.png" width="200">



## Maintainers

- [Trey Shugart](https://twitter.com/treshugart) (author), Atlassian
