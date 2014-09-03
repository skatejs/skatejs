[![Build Status](https://travis-ci.org/skatejs/skatejs.png?branch=master)](https://travis-ci.org/skatejs/skatejs)

Skate
=====

Skate is a web component library that allows you to define behaviour for elements without worrying about when that element is inserted into the DOM.

*I recently [spoke about Skate](http://slides.com/treshugart/skating-with-web-components) at [SydJS](http://www.sydjs.com/).*

HTML

```html
<my-component></my-component>
```

JavaScript

```js
skate('my-component', {
  ready: function (element) {
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

Skate supports AMD if detected and is registered as an anonymous module.

### CommonJS

Skate also exports itself as a CommonJS module if detected.

### Global

If you're still skating old school, we've got you covered. Just make sure it's included on the page and you can access it via `window.skate`.

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
  ready: function (element) {

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
  // triggered if a descendant matching the selector triggered the event.
  // This is synonymous with Backbone's style of event binding in its
  // views.
  events: {
    'click': function (element, eventObject) {

    },

    'click .some-child-selector': function (element, eventObject) {

    }
  },

  // Properties and methods to add to each element instance. It's notable
  // that the element's prototype is not modified. These are added after the
  // element is instantiated. Since the methods and properties are applied to
  // the element, `this` inside a method will refer to the element.
  prototype: {
    callMeLikeAnyNativeMethod: function () {

    }
  },

  // By default, Skate ships with a simple templating mechanism that is
  // similar to ShadowDOM templating. This is explained later in the
  // templating section.
  template: '<article><h3><content select=".heading"></content></h3><section><content><p>There is no content to display.</p></content></section></article>',

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

  // This is the class name that is added to the web component in order to
  // display it in the DOM after the `ready` callback is invoked.
  classname: '__skate'
});

```
### Component Lifecycle

The component lifecycle consists of three callbacks:

1. `ready` Called before the element is displayed.
2. `insert` Called after the element is displayed.
3. `remove` Called after the element is removed.

The `ready` callback gets triggered before the element is shown.  Without full web-component support, we can only emulate the `ready` callback to ensure the element is hidden by inserting a CSS rule that matches the element based on its component type. That being the case, it is best to define your components as early as possible so that Skate can make sure there is a CSS rule to hide it before it ever exists in the DOM. The lifecycle continues from the `ready` callback by showing the element and then calling the `insert` callback.

It is possible to render the entire DOM tree and then define your components, however, this is not recommended for a couple reasons:

- Skate must scour the entire DOM tree for components to process (this is faster than `querySelectorAll` in large DOMs). It minimises the impact of subsequent calls to `skate()` by debouncing the initialisation process.
- If you have any elements in the DOM already and the component adds CSS rules to ensure the component elements are hidden until augmented, these elements may disappear and then reappear after they have been processed.

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

- The element is inserted with attributes already on it.
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

- The element is inserted with the corresponding attribute already on it.
- The corresponding attribute is added to the element.
- The corresponding attribute is updated on the element.

The third form gives you more granularity and flexibility, and is the same form that the example component at the top takes:

```js
skate('my-component', {
  attributes: {
    'my-attribute': {
      insert: function (element, change) {

      },

      update: function (element, change) {

      },

      remove: function (element, change) {

      }
    }
  }
});
```

The `insert` handler gets called when:

- The element is inserted with the corresponding attribute already on it.
- The corresponding attribute is added to the element.

The `update` handler gets called when:

- The corresponding attribute is updated on the element.

The `remove` handler gets called when:

- The corresponding attribute is removed from the element.

Callbacks that get fired for attributes that already exist on an element get called after the `insert` callback is triggered.

### Event Binding

Event binding allows you to declare which events you want to listen for and also offers you the ability to use event delegation, Backbone style.

As we saw above:

```js
skate('my-component', {
  events: {
    'click': function (element, eventObject) {

    },

    'click .some-child-selector': function (element, eventObject) {

    }
  }
});
```

The first `click` handler gets executed whenever the component receives a click event regardless of what triggered it. The second `click .some-child-selector` handler gets executed only when it receives a click event that came from a descendant matching the `.some-child-selector` selector.

Events listeners are not automatically removed from the element when it is removed from the DOM. This is because Skate does not know if you intend to re-insert the element back into the DOM. Skate leaves it up to you and the JavaScript engine's garbage collector to manage this.

### Prototype Extending

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
    compiled({ name: element.getAttribute('name') });
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
skate('my-component', {
  template: function (element) {
    var initialHtml = element.innerHTML;
    var shadowRoot = element.createShadowRoot();

    shadowRoot.innerHTML = '<content></content>';
    element.innerHTML = initialHtml;
  }
});
```



### Default HTML Templates

Skate bundles a simple templating engine based on how the Shadow DOM spec uses the `<content>` element and `select` attribute.

For example, we may have the following definition:

```js
skate('my-component', {
  template: '<article><h3><content select=".heading"></content></h3><section><content><p>There is no content to display.</p></content></section></article>',
});
```

By default, if a string is passed, Skate will use the default templating engine. It is the same thing as calling:

```js
skate.template.html(myTemplateString);
```

Now if we try and insert the following HTML:

```html
<my-component>
  <span class="heading">My Heading</span>
  <p>First paragraph.</p>
  <p>Second paragraph.</p>
</my-component>
```

The built-in templating engine will transform it into:

```html
<my-component>
  <article>
    <h3><span class="heading">My Heading</span></h3>
    <section>
      <p>First paragraph.</p>
      <p>Second paragraph.</p>
    </section>
  </article>
</my-component>
```

However, if you want to insert another paragraph dynamically, it will not get projected into the `<section>` by default. If you want to work with the element's template dynamically, you must wrap it in a wrapper that overrides native methods to ensure that the modifcations you make only affect the content areas.

You'd wrap it like so:

```js
// Assuming myComponent is a reference to the element in the previous examples.
var myWrappedComponent = skate.template.html.wrap(myComponent);
```

Once wrapped, you work with the wrapper just like a normal element. For example, if you wanted to add a third paragraph, all you'd need to do is:

```js
var thirdParagraph = document.createElement('p');
thirdParagraph.textContent = 'Third paragraph.';
myWrappedComponent.appendChild(thirdParagraph);

```

Doing that would result in:

```html
<my-component>
  <article>
    <h3><span class="heading">My Heading</span></h3>
    <section>
      <p>First paragraph.</p>
      <p>Second paragraph.</p>
      <p>Third paragraph.</p>
    </section>
  </article>
</my-component>
```

Notice how the when you appended the content, it didn't actually put it as a first child to the component, it actually moved it into the correct content area in the correct spot.

You could have achieved the same thing doing:

```js
myWrappedComponent.innerHTML += '<p>Third paragraph.</p>';
```

Additionally, if all paragraphs were removed from the `<section>`:

```js
myWrappedComponent.removeChild(myWrappedComponent.childNodes[0]);
myWrappedComponent.removeChild(myWrappedComponent.childNodes[1]);
myWrappedComponent.removeChild(myWrappedComponent.childNodes[2]);
```

Then the default content that we specified in the template definition would take their place:

```html
<my-component>
  <article>
    <h3>
      <span class="heading">My Heading</span>
    </h3>
    <section>
      <p>There is no content to display.</p>
    </section>
  </article>
</my-component>
```

If you decide you want to put some content back in, then it will remove the default content in favour of the content you specify.

The properties and methods that are wrapped to give you this behaviour are:

1. childNodes
2. firstChild
3. innerHTML
4. lastChild
5. outerHTML
6. textContent
7. appendChild()
8. insertAdjacentHTML()
9. insertBefore()
10. removeChild()
11. replaceChild()

The following properties and methods are not wrapped (but are planned to be):

1. elements
2. getElementsByClassName()
3. getElementsByTagName()
4. getElementsByTagNameNS()
5. querySelector()
6. querySelectorAll()

Additionally, descendants are not wrapped (but are planned to be). This means the following members on descendants behave as they normally would:

1. nextSibling
2. parentElement
3. parentNode
4. previousSibling

*The wrapped elements may look and act like normal elements (including instanceof checks), but due to browser API limitations, you cannot pass it off to other DOM methods as an element.*



### Asynchronous Nature

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

### Element Constructors

As with the spec, when you define a component that is compatible with tag bindings, your call to `skate()` will return an element constructor for you to use:

```js
var MyComponent = skate('my-component', {
  ready: function (element) {
    element.textContent = 'something';
  },

  prototype: {
    logTextContent: function () {
      console.log(this.textContent);
    }
  }
});
```

It is favourable to use a constructor in your code wherever possible because it will synchronously initialise the component and call the `ready` callback. Only when you insert it into the DOM will the `insert` callback be called:

```js
var element = new MyComponent();

// Logs: "something"
element.logTextContent();

// Asynchronously calls the `insert` callback.
document.body.appendChild(element);
```

### Unregistering Components

If you need to remove a component definition just call `skate.unregister('your-component-id')`. If you need to reset everything call `skate.destroy()`.

### Performance

There are some things to consider when using Skate, just like any library, in terms of performance. These are recommendations for scenarios which we have come across. If you have any recommendations, please submit a PR adding it to this.

#### Very, Very Large DOMs

Skate is pretty fast. In any browser other than Internet Explorer, it can process in excess of 100k elements in less than half a second. However, IE tends to be fraction of that. If you have a super-massive DOM and are worried about performance, read the section on "Ignoring Elements" to learn how you can mitigate this.

#### Ready Callbacks

Using the `ready` callback implies that a CSS rule will be added to the page that ensures any matching element is hidden until a class is added to it. The selector varies depending on the type of component you've registered and depending on the DOM size, it can impact performance.

Explicitly defining the type of your component will narrow the selector and will ensure a selector is built specifically for your component's type. For example, if you register a component and do not restrict the type:

```js
skate('my-unrestricted-component', {
  type: skate.types.ANY
});
```

This will create a CSS rule with a selector of:

```css
my-unrestricted-component,
[is="my-unrestricted-component"],
[my-unrestricted-component],
.my-unrestricted-component { ... }
```

If you only need it to act as a custom element, then you should restrict it as such:

```js
skate('my-restricted-component', {
  type: skate.types.TAG
});
```

This is generally good practice anyways, but it will also ensure the selector is built as:

```css
my-restricted-component { ... }
```

### Ignoring Elements

Sometimes you may want to ignore a particular DOM tree. All you need to do is add the `data-skate-ignore` attribute to the container that you want to ignore:

```html
<div data-skate-ignore>
  <!-- Everything including the container will be ignored. -->
</div>
```

This will prevent Skate from traversing that particular tree and eliminate any overhead it otherwise would have incurred.

Who's Using It?
---------------

<img alt="Atlassian" src="http://www.atlassian.com/dms/wac/images/press/Atlassian-logos/logoAtlassianPNG.png" width="200">

Credits
-------

Trey Shugart (author), Atlassian

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
