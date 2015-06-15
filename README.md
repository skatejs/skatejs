[![Build Status](https://travis-ci.org/skatejs/skatejs.png?branch=master)](https://travis-ci.org/skatejs/skatejs)

# Skate

Skate is a web component library that is focused on being a tiny, performant, syntactic-sugar for binding behaviour to custom and existing elements without ever having to worry about when your element is inserted into the DOM. It uses the [Custom Element](http://w3c.github.io/webcomponents/spec/custom/) spec as a guideline and adds some features on top of it.

HTML

```html
<my-component></my-component>
```

JavaScript

```js
skate('my-component', {
  created: function (element) {
    element.textContent = 'Hello, World!';
  }
});
```

Result

```html
<my-component>Hello, World!</my-component>
```



## Compatibility

IE9+ and all evergreens.



## Installing

You can download the source yourself and put it wherever you want. Additionally you can use Bower:

    bower install skatejs

Or NPM:

    npm install skatejs

Include either `dist/skate.js` or `dist/skate.min.js`.



### UMD (AMD / CommonJS)

UMD files are located in `lib/`. Simply import `lib/skate.js` and use it as normal.



### ES6 Modules

The Skate source is written using [ES6 modules](http://www.2ality.com/2014/09/es6-modules-final.html). If you're using a transpilation method, then you can `import skate from 'src/skate';` and use it in your projects as you would any ES6 module.



### Global

If you're still skating old school the `dist` directory contains the compiled ES5 source. The compiled source does not use a module loader; everything will just work. Access Skate as a global with `skate`.



## Usage

You define a component by passing a component ID and definition to the `skate()` function. The ID you specify corresponds to one of the following:

- Tag name
- Value of the `is` attribute
- Attribute name
- Class name

The definition is an object of options defining your component.

```js
skate('my-component', {
  // Lifecycle Callbacks
  //
  // All lifecycle callbacks use `this` to refer to the component element.

  // Called when the element is created.
  created () {},

  // Called when the element is attached to the document.
  attached () {},

  // Called when the element is detached from the document.
  detached () {},

  // Called when an attribute is created, updated or removed.
  attribute (name, oldValue, newValue) {
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
  template () {
    this.innerHTML = 'something';
  },



  // Event Listeners
  events: {
    // All direct and bubbled events.
    click (e) {
      // Refers to the component element.
      this;

      // Standard DOM event object.
      e;

      // Same as `this`.
      e.delegateTarget;
    },

    // Restricted to events triggered only on the component element. Arguments
    // are the same as above.
    'click my-element' (e) {},

    // Event delegation.
    'click .something' (e) {
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
    'focus .something' () {},
    'blur .something' () {}
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
      // Two-way binding to attributes. Changes to this property affect
      // attributes and changes to attributes affect this property.
      attr: true,

      // This property should be notified of changes when these dependencies
      // are notified of changes.
      //
      // You may also specify dependencies as space-separated string.
      deps: [
        // This property's notify events will be triggered when its sibling
        // `dependencyProperty` is notified of changes.
        'dependencyProperty',

        // This property's notify events will be triggered when the descendant's
        // `deepDependencyProperty` notified of changes.
        //
        // At the time the dependency event bubbles up from the descendant, it
        // must be accessible via `some.nested.child`. If it is not, then the
        // dependency is ignored.
        'some.nested.child.deepDependencyProperty'
      ],

      // Custom getter. The return value is used as the property value when
      // retrieved. If you don't specify a getter, the value that it was set as
      // is returned regardless of if you've specified a setter.
      //
      // To make a property "readyonly", specify a getter without a setter.
      get () {},

      // Whether or not to trigger events when the property changes. Defaults to
      // `true`. If you do not want events triggered, set this to a falsy value.
      //
      // If this is truthy, when the property is changed it will trigger two
      // events:
      //
      // - `skate.property` - When any property changes.
      // - `skate.property.prop1` - When a specific property changes.
      //
      // The event object for both events contains the following information
      // in the `detail` property:
      //
      // - `name` - The property name.
      // - `newValue` - The property's new value.
      // - `oldValue` - The property's old value.
      notify: true

      // Custom setter. Set value as you see fit. Return value is ignored. If
      // you don't specify a getter, then whatever `newValue` was passed in to
      // the setter, is returned by the default getter. If you want to return
      // a custom value, specify a getter.
      set (newValue, oldValue) {},

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

  // This behaves just like any prototype object does. All methods and
  // properties are added to the element's prototype (native), or to the element
  // during the `created` lifecycle (polyfill).
  //
  // It's recommended you use the `properties` option for all public-api
  // properties, but nothing is stopping you from putting them here if you
  // don't need the special behaviour of `properties`.
  prototype: {
    get someProperty () {},
    someMethod () {}
  },

  // The binding methods this component supports. For example, if you specify
  // the `type` as `skate.type.ELEMENT`, then the component will only be bound
  // to an element whos tag name matches the component ID.
  //
  // - `ELEMENT` Tag name only.
  // - `ATTRIBUTE` Attribute names.
  // - `CLASSNAME` Class names.
  type: skate.type.ELEMENT,

  // The attribute name to add after calling the `created` callback.
  resolvedAttribute: 'resolved',

  // The attribute name to remove after calling the `created` callback.
  unresolvedAttribute: 'unresolved'
});

```



### Component Lifecycle

The component lifecycle consists of three callbacks:

1. `created`
2. `attached`
3. `detached`

These callbacks try and mimic the spec as closely as possible when native support is unavailable.

#### `created`

The `created` callback gets triggered when the element is created. There are some differences when using native vs polyfilled support.

```js
// native: called immediately (synchronous)
// polyfill: called immediately (synchronous)
new MyEl();

// native: called immediately (synchronous)
// polyfill: called when inserted to the DOM (asynchronous)
document.createElement('my-el');

// native: called immediately (synchronous)
// polyfill: called when the mutation observer fires (asynchronous)
document.body.innerHTML = '<my-el></my-el>';

// native: called immediately (synchronous)
// polyfill: called when <div> is inserted into the DOM (asynchronous)
document.createElement('div').innerHTML = '<my-el></my-el>';
```

In instances where an element is initialised asynchronously, there may be a flash of unstyled content or jank. For more information see [Preventing FOUC](#preventing-fouc).

If using native custom elements, the element may not have any children when the `created` callback is invoked. You should not assume a specific structure exists here unless you've used the `template` callback.

```js
// Will not have children.
document.createElement('my-el');

// Will have children.
document.body.innerHTML = '<my-el>child</my-el>';
document.createElement('div').innerHTML = '<my-el>child</my-el>';
```

#### `attached`

The `attached` callback is fired when the element is attached to the `document`. It must actually be in the document to be triggered. This means if you attach your custom element to an element that is detached from the `document`, it will not be called until the element in which you've attached it to is inserted into the `document`.

#### `detached`

The `detached` callback is fired when the element is detached from the `document`. Like the `attached` callback, this only gets fired when the element gets removed from the `document`.

#### `attribute`

Listening to attribute changes are done in a similar way you would do it in accordance with the W3C spec:

```js
skate('my-element', {
  attribute: function (name, oldValue, newValue) {
    // "this" refers to <my-element>
  }
});
```

However, there are some differences:

- You specify an `attribute` callback on the component definition instead of `attributeChangedCallback` on the `prototype`.
- If you insert `<my-element my-attribute="something">` into the DOM, `my-attribute` will not trigger the callback in native web components. In Skate land, it will.

##### Synchrony

Attribute handlers are notified synchronously. Instead of using mutation observers, `setAttribute` and `removeAttribute` are patched to notify the callback as soon as the change occurs. If your existing code uses timeouts to wait until after mutations happen to execute logic related to an attribute change, you don't need to worry about changing it. The only difference is you won't need to write async boilerplate anymore.

However, this means that updating the attribute instance directly is *not* supported. If you do the following, the `attribute` callback will *not* be notified of the change. For example the following will not trigger the `attribute` callback:

```js
myElement.attributes.myAttribute.value = 'new value';
```

You must use the attribute methods instead:

```js
myElement.setAttribute('myAttribute', 'new value');
```



### Event Binding

Event binding allows you to declare which events you want to listen for and also offers you the ability to use event delegation, Backbone style.

As we saw above:

```js
skate('my-component', {
  events: {
    'click': function (element, eventObject) {

    },

    'click .some-child-selector': function (element, eventObject, currentTarget) {

    }
  }
});
```

The first `click` handler gets executed whenever the component receives a click event regardless of what triggered it. The second `click .some-child-selector` handler gets executed only when it receives a click event that came from a descendant matching the `.some-child-selector` selector, This will also get fired for any ancestor of the target, up to the component element, that matches the selector. The `currentTarget` parameter is the element which the delegate selector matched.

Events listeners are not automatically removed from the element when it is removed from the DOM. This is because Skate does not know if you intend to re-insert the element back into the DOM. Skate leaves it up to you and the JavaScript engine's garbage collector to manage this.

#### Reaching into the Shadow DOM

You may use the `::shadow` pseudo-element when specifying a delegate selector to an event. Underneath, Skate will walk the parent hierarchy from `e.path[0]` instead of `e.target` to find a matching target.

Note:

- It's experimental because the spec may change. As the spec changes, this may also change.
- Only `::shadow` is supported. Combinators are not because of the [proposed removal](https://www.w3.org/wiki/Webapps/WebComponentsApril2015Meeting).
- If you are using this in browsers that do not support it natively, you must include a polyfill capable of allowing you to use these selectors.



### Element Constructors

As with the spec, when you define a component that is compatible with tag bindings, your call to `skate()` will return an element constructor for you to use:

```js
var MyComponent = skate('my-component', {
  created: function (element) {
    element.textContent = 'something';
  },

  prototype: {
    logTextContent: function () {
      console.log(this.textContent);
    }
  }
});
```

It is favourable to use a constructor in your code wherever possible because it will synchronously initialise the component and call the `created` callback. Only when you insert it into the DOM will the `attached` callback be called:

```js
var element = new MyComponent();

// Logs: "something"
element.logTextContent();

// Asynchronously calls the `attached` callback.
document.body.appendChild(element);
```



### Extending Components

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



### Custom Methods and Properties

Skate gives you the option to specify custom properties and methods on your component.

```js
skate('my-component', {
  prototype: {
    callMeLikeAnyNativeMethod: function () {

    }
  }
});
```

These members are applied directly to the element instance that your component is bound to so you can do stuff like this:

```js
document.getElementById('my-component-id').callMeLikeanyNativeMethod();
```

It's important to understand that the `Element.prototype` is not modified as part of this process.



### Templating

To template a component, all you need to do is define a function that takes an element as its first argument. When templating is invoked during an element's lifecycle, this function will be called and the element being Skated will be passed in as the first argument. It's up to you at this point to invoke whatever templating engine you want.

For example, Handlebars:

```js
skate('my-component', {
  template: function (element) {
    var compiled = Handlebars.compile('<p>Hello, {{ name }}!</p>');
    element.innerHTML = compiled({ name: element.getAttribute('name') });
  }
});
```

A good way to reuse a template function is to simply create a function that takes a string and returns a function that templates that string. The following example will compile the HTML using Handlebars and when invoked it will take all the attributes on the element and pass them in to the compiled template function as the context. This way, you can use any of the attributes specified on the element.

```js
function handlebarify (html) {
  var compiled = Handlebars.compile(html);

  return function (element) {
    var attrs = {};

    for (var a = 0; a < element.attributes.length; a++) {
      var attr = element.attributes[a];
      attrs[attr.name] = attr.value;
    }

    element.innerHTML = compiled(attrs);
  };
}

skate('my-component', {
  template: handlebarify('<p>Hello, {{ name }}!</p>')
});
```

If you wanted to fully embrace Web Components, you could even use Shadow DOM:

```js
function shadowDomTemplate (shadowHtml) {
  return function (element) {
    element.createShadowRoot().innerHTML = shadowHtml;
  };
}

skate('my-component', {
  template: shadowDomTemplate('<header><content select="h2"></content></header><section><content></content></section>')
});
```



### Asynchrony

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



## Web Component Differences

Skate uses the [Custom Element spec](http://w3c.github.io/webcomponents/spec/custom/) as a guideline but it does not polyfill it, nor does it polyfill the behaviour of [ShadowDOM](http://w3c.github.io/webcomponents/spec/shadow/) or [HTML Imports](http://w3c.github.io/webcomponents/spec/imports/).

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

There's several problems with this approach. First, you're running a selector against the document. This is unnecessary and can get slow in large DOMs even in the latest browsers. Second, it only gets executed on DOMReady. If you want to dynamically add some tabs to your document, then you've got to manually call that again once they've been added to the DOM.

With Skate, those problems vanish. No selectors are run and your tabs will automatically be initialised regardless of when they are put into the document.

To refactor that into a Skate component, all you need to do is:

```js
skate('tabs', {
  type: skate.type.CLASSNAME
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

    [resolved] {
      opacity: 1;
      transition: opacity .3s ease;
    }



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



## License

The MIT License (MIT)

Copyright (c) 2014 Trey Shugart

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
