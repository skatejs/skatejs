---
template: layout.html
---

[![Build Status](https://travis-ci.org/skatejs/skatejs.png?branch=master)](https://travis-ci.org/skatejs/skatejs)

# Skate

Skate is a web component library that is focused on being a tiny, performant, syntactic-sugar for binding behaviour to custom and existing elements without ever having to worry about when your element is inserted into the DOM. It uses the [Custom Element](http://w3c.github.io/webcomponents/spec/custom/) spec as a guideline and adds some features on top of it.

*I recently [spoke about Skate](http://slides.com/treshugart/skating-with-web-components) at [SydJS](http://www.sydjs.com/).*

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
  // Called before the element is displayed.
  created: function (element) {

  },

  // Called after the element is displayed.
  attached: function (element) {

  },

  // Called after the element is removed.
  detached: function (element) {

  },

  // Attribute callbacks that get triggered when attributes on the main web
  // component are inserted, updated or removed. Each callback gets the
  // element that the change occurred on and the corresponding changes. The
  // change object contains the following information:
  //
  // - type: The type of modification (created, updated or removed).
  // - name: The attribute name.
  // - newValue: The new value. If type === 'removed', this will be undefined.
  // - oldValue: The old value. If type === 'created', this will be undefined.
  attributes: {
    'my-attribute': {
      // The element's default value if not already specified on the element.
      // Can also be a function that returns a value. The function gets passed
      // The element as its only argument.
      value: 'default value',

      // Called when the attribute is set for the first time.
      created: function (element, change) {

      },

      // Called on all attribute modifications except for the intial creation.
      updated: function (element, change) {

      },

      // Called when the attribute is removed.
      removed: function (element, change) {

      },

      // Called when created, updated or remove is not specified. This is the
      // same as specifying a function instead of an options object for a
      // given attribute.
      fallback: function (element, change) {

      }
    }
  },

  // The event handlers to bind to the web component element. If the event
  // name is followed by a space and a CSS selector, the handler is only
  // triggered if a descendant matching the selector triggered the event.
  // This is synonymous with Backbone's style of event binding in its
  // views.
  events: {
    'click': function (element, eventObject) {

    },

    'click .some-child-selector': function (element, eventObject, currentTarget) {

    }
  },

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
  //   value must match the element's tag name, as with attribute components.
  //
  // - If the value is empty, then the component is not restricted at all.
  extends: '',

  // Properties and methods to add to each element instance. It's notable
  // that the element's prototype is not modified. These are added after the
  // element is instantiated. Since the methods and properties are applied to
  // the element, `this` inside a method will refer to the element.
  prototype: {
    callMeLikeAnyNativeMethod: function () {

    }
  },  

  // A function that renders a template to your element. You can literally use
  // any templating engine you like here.
  template: function (element) {
    bindLatestHipsterTemplateEngineTo(element);
  },

  // The binding methods this component supports. For example, if you specify
  // the `type` as `skate.type.ELEMENT`, then the component will only be bound
  // to an element whos tag name matches the component ID.
  //
  // - `ELEMENT` Tag name only.
  // - `ATTRIBUTE` Attribute names.
  // - `CLASSNAME` Class names.
  type: skate.type.ELEMENT,

  // The attribute name to add after calling the created() callback.
  resolvedAttribute: 'resolved',

  // The attribute name to remove after calling the created() callback.
  unresolvedAttribute: 'unresolved'
});

```



### Component Lifecycle

The component lifecycle consists of three callbacks:

1. `created` Called before the element is displayed.
2. `attached` Called after the element is displayed.
3. `detached` Called after the element is removed.

The `created` callback gets triggered before the element is shown and is only ever fired once.  Without full web-component support, we can only emulate the `created` callback to ensure the element is hidden. For more information see [Preventing FOUC](#preventing-fouc). The `attached` and `detached` callbacks are fired each time the element is attached and detached from the DOM, which can happen multiple times.



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



### Attribute Lifecycle

An attribute lifecycle definition can take three forms. First, it does something similar to what we see in the Web Component spec:

```js
skate('my-component', {
  attributes: function (element, change) {

  }
});
```

A notable difference, though, is that this callback gets called for attributes that already exist on the element as this is more predictable. This also allows you to have initialisation code for attributes, rather than forcing the developer to do this in one of the lifecycle callbacks.

This is called for each attribute on an element when:

- The element is created with attributes already on it.
- Attributes are added to the element.
- Attributes on the element are updated.
- Attributes are removed from the element.

The second form of a callback takes an object of attribues and handlers.

```js
skate('my-component', {
  attributes: {
    'my-attribute': function handleInsertAndUpdate (element, change) {

    }
  }
});
```

This allows you to specify which attributes you want to listen to and will call the specified function when:

- The element is created with the corresponding attribute already on it.
- The corresponding attribute is added to the element.
- The corresponding attribute is updated on the element.

The third form gives you more granularity and flexibility, and is the same form that the example component at the top takes:

```js
skate('my-component', {
  attributes: {
    'my-attribute': {
      created: function (element, change) {

      },

      updated: function (element, change) {

      },

      removed: function (element, change) {

      }
    }
  }
});
```

The `created` handler gets called when:

- The element is created with the corresponding attribute already on it.
- The corresponding attribute is added to the element.

The `updated` handler gets called when:

- The corresponding attribute is updated on the element.

The `removed` handler gets called when:

- The corresponding attribute is removed from the element.

Callbacks that get fired for attributes that already exist on an element get called after the `attached` callback is triggered.



#### Catching Unspecified Modifications

You may also specify a `fallback` callback that will get called if a specific callback for the type of modification isn't found. For example, if you wanted to do the same thing on `created` and `updated` but something different on `removed`, then you'd do something like:

```js
skate('my-component', {
  attributes: {
    'my-attribute': {
      fallback: function (element, change) {

      },

      removed: function (element, change) {

      }
    }
  }
}
```

Note that doing:

```js
skate('my-component', {
  attributes: {
    'my-attribute': {
      fallback: function (element, change) {

      }
    }
  }
}
```

Is the same thing as:

```js
skate('my-component', {
  attributes: {
    'my-attribute': function (element, change) {

    }
  }
}
```

The only difference is that the former allows you to specify other options for that specific attribute.


#### Default Values

If you want to specify a default value for your component you may do so by setting the `default` option for an attribute.

```js
skate('my-component', {
  attributes: {
    'my-attribute': {
      value: 'default value'
    }
  }
}
```

That would ensure that the attribute `my-attribute` is set to `default value` but only if that attribute doesn't already exist.



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

Skate mostly polyfills [Mutation Observers](https://developer.mozilla.org/en/docs/Web/API/MutationObserver), but only internally. It is not usable outside of Skate at the moment since it only polyfills what Skate needs to function.

As you may know, the only way to polyfill Mutation Observers is to use the deprecated DOM 3 Mutation Events. They were deprecated because if you insert 5k elements at once, you then trigger 5k handlers at once. Mutation Observers will batch that into a single callback. What Skate does to mitigate this overhead is to queue up each event to be processed on the next tick. Once queued, it then batches them up like Mutation Observers do, and then calls the callback only once.



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

If you need to ignore an element and its descendants you can add the `data-skate-ignore` attribute to an element.

```html
<div data-skate-ignore>
  <!-- Everything including the container will be ignored. -->
</div>
```


## No Conflict

Skate has a `noConflict()` method that we have come to expect from libraries that may come into conflict with the same name, or multiple versions of itself. It returns the new `skate` while restoring `skate` to the previous value.

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
npm test -- --keepalive
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
