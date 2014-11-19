[![Build Status](https://travis-ci.org/skatejs/skatejs.png?branch=master)](https://travis-ci.org/skatejs/skatejs)

Skate
=====

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



Compatibility
-------------

IE9+ and all evergreens.



Installing
----------

You can download the source yourself and put it wherever you want. Additionally you can use Bower:

    bower install skatejs

Or NPM:

    npm install skatejs

Include either `dist/skate.js` or `dist/skate.min.js`.



### AMD

An anonymous AMD module is defined, if supported.



### CommonJS

A CommonJS module is exported, if supported.



### Global

If you're still skating old school, we've got you covered. Just make sure it's included on the page and you can access it via `window.skate`.



### ES6 Modules

The Skate source is written using [ES6 modules](http://www.2ality.com/2014/09/es6-modules-final.html). If you're using a transpilation method, then you can `import skate from 'src/skate';` and use it in your projects as you would any ES6 module. Otherwise, the `dist` directory contains the compiled ES5 source.



Usage
-----

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
      created: function (element, change) {

      },

      updated: function (element, change) {

      },

      removed: function (element, change) {

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
  // the `type` as `skate.types.TAG`, then the component will only be bound
  // to an element whos tag name matches the component ID.
  //
  // - `ANY` Any type of binding. This is the default.
  // - `TAG` Tag name only.
  // - `ATTR` Attribute names.
  // - `CLASS` Class names.
  // - `NOTAG` Attribute or class names.
  // - `NOATTR` Class or tag names.
  // - `NOCLASS` Attribute or tag names.
  type: skate.types.ANY,

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
    var lightHtml = element.innerHTML;
    var shadowRoot = element.createShadowRoot();

    shadowRoot.innerHTML = shadowHtml;
    element.innerHTML = lightHtml;
  };
}

skate('my-component', {
  template: shadowDomTemplate('<h1 class=".heading"></h1><section><content></content></section>');
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



Web Component Differences
-------------------------

Skate uses the [Custom Element spec](http://w3c.github.io/webcomponents/spec/custom/) as a guideline but it does not polyfill it, nor does it polyfill the behaviour of [ShadowDOM](http://w3c.github.io/webcomponents/spec/shadow/) or [HTML Imports](http://w3c.github.io/webcomponents/spec/imports/).

You can do some pretty cool things with Skate that you can't do with Web Components. For example, you can write polyfills for existing elements:

`<input placeholder="">`:

```js
skate('placeholder', {
  extends: 'input',
  type: skate.types.ATTR,
  created: polyfillInputPlaceholder
});
```

`<input type="date">`:

```js
skate('type', {
  extends: 'input',
  type: skate.types.ATTR,
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
  type: skate.types.ATTR,
  attributes: {
    rel: function (element, change) {
      if (change.newValue === 'import') {
        makeIntoHtmlImport(element);
      }
    }
  }
});
```

You can even [polyfill Custom Elements](https://github.com/skatejs/polyfill-custom-elements) in accordance to the Web Component spec with Skate.



Polymer / X-Tags Differences
----------------------------

Polymer polyfills the web component spec (mostly) and adds data binding. X-Tags uses Polymer's Custom Element and Mutation Observer polyfills to add a layer of sugar on top of Custom Elements. Although they have differences amongst themselves, they share functionality in terms of Custom Elements. Skate shares this functionality and provides some things that they don't.



### Attribute / Class Bindings

Polymer and X-Tags do not offer a way to bind behaviour to elements with a particular attribute or class. Skate allows this because classes can be a good transitional period away from legacy components. For example:

```js
jQuery(function ($) {
  $('.tabs').tabs();
});
```

This will only get executed on DOM Ready. If you ever insert some tabs dynamically, you'd have to call that again. Skate makes it possible to only define this once:

```js
skate('tabs', {
  type: skate.types.CLASS
  created: function (element) {
    jQuery(element).tabs();
  }
});
```

You're definition is now in one place. If you dynamically insert some tabs into the document, they'll be upgraded automatically without you having to do anything. You also have the added benefit of ensuring that the element is not visible when it is upgraded to tabs because you've used the `created()` callback.

Furthermore, this is especially good when you don't have the time to refactor a legacy component into web components. You get many of the benefits of a web component without having to change any markup.



### Size (min + gz)

Size does matter.

1. Skate: 3.4k
2. X-Tags: 10.8k
3. Polymer without polyfills: 33.7k
4. Polymer with polyfills: 70.2k



### Performance

Skate comes close to Polymer and X-Tags in modern browsers but isn't quite as fast in this area for a couple reasons:

1. Skate doesn't use `document.registerElement()` if supported. There are [plans](https://github.com/skatejs/skatejs/issues/46) to do this.
2. Skate supports more than just Custom Elements. The added overhead is because it also supports attribute and class bindings and has to check these on top of just checking the tag name / `is` attribute value.



#### How bad is it?

Skate takes about 350ms to go through 100k elements. With Polymer and X-Tags, in browsers that natively support Custom Elements, there's almost zero overhead because they don't need to use Mutation Observers. With no native support, they take around 200ms.

The real difference comes in when you [have to polyfill Mutation Observers](http://caniuse.com/#feat=mutationobserver). In IE9, Skate goes through 100k elements in a mere ~2s. Polymer and X-Tags take around 25s (that's not a typo). Even if you bring this down to a reasonable 5k elements, it'll still take them over a second to process the elements.



Polyfills
---------

Skate mostly polyfills [Mutation Observers](https://developer.mozilla.org/en/docs/Web/API/MutationObserver), but only internally. It is not usable outside of Skate at the moment since it only polyfills what Skate needs to function.

As you may know, the only way to polyfill Mutation Observers is to use the deprecated DOM 3 Mutation Events. They were deprecated because if you insert 5k elements at once, you then trigger 5k handlers at once. Mutation Observers will batch that into a single callback. What Skate does to mitigate this overhead is to queue up each event to be processed on the next tick. Once queued, it then batches them up like Mutation Observers do, and then calls the callback only once.



Preventing FOUC
---------------

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



Ignoring Elements
-----------------

If you need to ignore an element and its descendants you can add the `data-skate-ignore` attribute to an element.

```html
<div data-skate-ignore>
  <!-- Everything including the container will be ignored. -->
</div>
```



Contributing
------------

The `.editorconfig`, `.jscs` and `.jshint` configs are all set up. If you can, enable these in your editor of choice.



### Setup

To get a dev environment up and running, all you should need to do is run:

```bash
npm install
```

To see a list of commands, run:

```bash
grunt
```


### Testing

To run tests:

```bash
grunt test
```

If you want to keep the Karma server alive to run them in your browser of choice:

```bash
grunt test --keepalive
```

To run tests in a specific browser:

```bash
grunt test --browsers Chrome,Firefox
```



### Distribution

To build the distribution all you have to do is run:

```bash
grunt dist
```

This will build `dist/skate.js` and `dist/skate.min.js`. Don't worry about doing this in a PR; it'll avoid conflicts.



### Releasing

To release all you've got to do is run `grunt release`. You can either specify the release `type`, or `tag`.

```bash
grunt release --tag x.x.x
```

Or:

```bash
grunt release --type minor
```



### Deploying

To deploy the documentation, run the following command from the branch or tag which you want to deploy:

```bash
grunt deploy
```



Who's Using It?
---------------

<img alt="Atlassian" src="http://www.atlassian.com/dms/wac/images/press/Atlassian-logos/logoAtlassianPNG.png" width="200">



Maintainers
-----------

- [Trey Shugart](https://twitter.com/treshugart) (author), Atlassian



License
-------

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
