[![Build Status](https://travis-ci.org/skatejs/skatejs.png?branch=master)](https://travis-ci.org/skatejs/skatejs)

Skate
=====

Skate is a web component library that allows you to define behaviour for elements without worrying about when that element is inserted into the DOM.

HTML

    <my-component></my-component>

JavaScript

    skate('my-component', {
      ready: function (element) {
        element.textContent = 'Hello, World!';
      }
    });

Result

    <my-component>Hello, World!</my-component>

Compatibility
-------------

IE9+ and all evergreens.

Installing
----------

You can install Skate using Bower or by downloading the source from the repository.

    bower install skate

### AMD

Skate supports AMD if detected and is registered as an anonymous module.

### Global

If you're still skating old school, we've got you covered. Just make sure skate is included on the page and you can access it via `window.skate`.

Docs
----

You define a component by calling `skate()` and passing it your component ID and a definition. The ID you speicfy corresponds to one of the following:

- Tag name
- Value of the `is` attribute
- Attribute name
- Class name

The definition is an object of options defining your component.

  	skate('my-component', {
      // Called before the element is displayed. This can be made asynchronous
      // by defining a second argument in the method signature. You would then
      // call that argument as a function to tell the component it's ok to
      // proceed with its lifecycle. If the second argument is not provided, it
      // is assumed everything in the callback is synchronous.
  	  ready: function (element, done) {
        doSomethingAsync().then(done);
  	  },

      // Called after the element is displayed.
  	  insert: function (element) {

  	  },

      // Called after the element is removed.
  	  remove: function (element) {

  	  },

  	  // Attribute callbacks that get triggered when attributes on the main web
      // component are inserted, updated or removed. Each callback gets the
      // element that the change occurred on and the corresponding changes. The
      // change object contains the following information:
      //
      // - type: The type of modification (insert, update or remove).
      // - name: The attribute name.
      // - newValue: The new value. If inserted, this will be undefined.
      // - oldValue: The old value. If removed, this will be undefined.
      attributes: {
      	'my-attribute': {
      	  insert: function (element, change) {

      	  },

      	  update: function (element, change) {

          },

      	  remove: function (element, change) {

          }
      	}
      },

      // The event handlers to bind to the web component element. If the event
      // name is followed by a space and a CSS selector, the handler is only
      // triggered if a child matching the selector triggered the event. This is
      // synonymous with Backbone's style of event binding in its views.
      events: {
        'click': onClick,
        'click .some-child-selector': onDelegateClick
      },

      // Properties and methods to add to each element instance. It's notable
      // that the element's prototype is not modified. These are added after the
      // element is instantiated. Since the methods and properties are applied to
      // the element, `this` inside a method will refer to the element.
      prototype: {
        callMeLikeAnyNativeMethod: function () {

        }
      },

      // By default, Skate ships with a default templating mechanism that is
      // similar to ShadowDOM templating. This is explained later in the
      // templating section.
      template: '<article><h3 data-skate-content=".heading"></h3><section data-skate-content></section></article>',

      // The binding methods this component supports. For example, if you specify
      // the `type` as `skate.types.TAG`, then the component will only be bound
      // to an element whos tag name matches the component ID.
      //
      // - `skate.types.ANY` Any type of binding. This is the default.
      // - `skate.types.TAG` Tag name only.
      // - `skate.types.ATTR` Attribute names.
      // - `skate.types.CLASS` Class names.
      // - `skate.types.NOTAG` Attribute or class names.
      // - `skate.types.NOATTR` Class or tag names.
      // - `skate.types.NOCLASS` Attribute or tag names.
      type: skate.types.ANY,

      // This is the class name that is added to the web component in order to
      // display it in the DOM after the `ready` callback is invoked.
      classname: '__skate',
  	});

### Component Lifecycle

Without full web-component support, we can only emulate the `ready` callback and ensure the element is hidden by inserting a CSS rule that matches the element based on its component type before it is inserted into the DOM. The lifecycle can be described as follows:

1. User defines components using `skate(componentId, componentDefinition)`.
2. Skate adds CSS rules matching future elements based on the component type.


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


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/treshugart/skate/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
