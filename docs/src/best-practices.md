---
template: layout.html
---

## Best Practices

There are some things to consider when building a web component that aren't quite obvious at first. Things like having compound components; ones that have parents and children that are all components and are supposed to interact with each other. There's also some gotcha's when working with polyfilled components vs native web components.

## Setup

The most basic component needn't have anything in it but there are still some important parts to this first step:

```js
// File: my-component.js

// Imports from NPM using Browserify,
// Galvatron or something like that
// as your build step.
import skate from 'skatejs';

// Exposes the component constructor.
export default skate('my-component', {

});
```

You'll notice it's using ES6 modules. Regardless of the module system, you should make sure that your component constructor is available to use by an API consumer. The `export default skate...` line does just that. If you `import` this component, you can now use its constructor.

```js
// File: main.js

// Imports "my-component.js".
import MyComponent from 'my-component';

// <my-component></my-component>
var myComponent = new MyComponent();
```

## Which callback is right for you?

If you're building a static component; something that will set itself up and not respond to much, you'll probably just end up using one of the lifecycle callbacks. For example, the `created` callback is called when the element is created, but not yet in the DOM. See notes below.

```js
skate('my-component', {
  created: function (element) {
    ...
  }
});
```

*BEWARE that when using native custom elements and polyfilled custom elements that the `created` callback behaves differently. In native, your element will not have a parent or any children even if the HTML you've written begs to differ. This is because the element is created the instant the HTML parser encounters it. In polyfill land, we can't only detect changes to the DOM once it's already added, so it would already be in the DOM along with its children by the time you get into this callback.*

*Because of this, __never__ ever assume structure in your `created` callback. Use the `attached` callback instead.*

If you need to do something when the element is inserted into the DOM, then use the `attached` callback.

```js
skate('my-component', {
  attached: function (element) {
    ...
  }
});
```

*REMEMBER the `attached` callback gets called every time the element is inserted into the DOM. This means that if you remove it and then reinsert it, no matter if you do it manually or if something moved it somewhere else, it will be called.*

If you need to do something whenever an attribute changes, then use the `attributes` option.

```js
skate('my-component', {
  attributes: {
    'my-attribute': function (element, data) {
      ...
    }
  }
});
```

The attribute hooks are a great place to put any functionality that requires you do something based on its value. A good rule of thumb is that if you start typing `getAttribute` in the `created` or `attached` lifecycle callbacks, theres a good chance that you can do what you need to do within the attribute listener. This avoids any sort of duplication and ensures that your element can respond to updates.

## Unidirectional data-flow

Parents should control and know about their children and the children should not know about their parents or their siblings. Maintaining this philosophy will help to ensure that you do not couple any behavoiur with how you've structured your component.

If a parent needs to respond to a change within a child, respond to an event.

```js
var MyParent = skate('my-parent', {
  events: {
    'update my-child': function (element, e, target) {
      console.log('my-child got updated');
    }
  }
});

var MyChild = skate('my-child', {
  prototype: {
    update: function () {
      this.dispatchEvent(new CustomEvent('updated', { bubbles: true }));
    }
  }
});

var myParent = new MyParent();
var myChild = new MyChild();

myParent.appendChild(myChild);

// Logs: "my-child got updated".
myChild.update();
```

## Keep things concise

When you define attributes on your component:

```js
var MyComponent = skate('my-component', {
  attributes: {
    'my-attribute-1': ...,
    'my-attribute-2': ...
  }
});
```

Skate will create property links for those attributes:

```js
var myComponent = new MyComponent();
myComponent.myAttribute1 = 'testing';

// "testing"
myComponent.myAttribute1;
myComponent.getAttribute('my-attribute-1');
```

This makes the behaviour consistent with properties / attributes like `id` and `name` that are linked by default.

## Data-binding. Sort of.

Being able to use attribute listeners is kinda like having an abstract way to use data-binding. As seen above we can use property links to manipulate attributes which, visually, looks more like a view model - and for all intents and purposes, it *is* a view model. This means you can do some really cool stuff with a very small amount of code.

For example, you can write a helper to take an attiribute change and apply it to an element.

```js
// File: helper/text.js

export default function text (selector) {
  return function (element, data) {
    [].slice.call(element.querySelectorAll(selector)).forEach(function (descendant) {
      descendant.textContent = data.newValue;
    });
  };
}
```

And then use it in your component:

```js
// File: my-component.js
import text from './helper/text';

export default skate('my-component', {
  attributes: {
    name: text('.name')
  },

  template: function (element) {
    element.innerHTML = '<div class="name"></div>';
  }
});
```

When you set the `name` attribute of the element, it will update the descendants:

```js
// File main.js
import MyComponent from 'my-component';

var myComponent = new MyComponent();

myComponent.name = 'Trey';

// Logs: <my-component name="Trey"><div class="name">Trey</div></my-component>
console.log(myComponent);
```

You're not limited to text either. You can use that functional pattern to set attributes, form field values and manipulate structure.

## Re-rendering a Component

There is no built-in way to re-render a component. This is left up to the developer to implement if they need it. One way you could do this is to make your template callback able to be called multiple times. How the re-rendering is done within that callback is up to the developer and templating engine.

All you need to do for this is just to call the template callback from anywhere in your code. For example, if you wanted to call the template callback when any attribute changes:

```js
skate('my-element', {
  attributes: function (element) {
    element.constructor.template(element);
  }
});
```

If you want to make this easier to call, you can create a prototype method for it:

```js
skate('my-element', {
  prototype: {
    render: function () {
      this.constructor.template(this);
      return this;
    }
  }
});
```
