# Recipes

An element may not be initialised right away if your definitions are loaded after the document is parsed. In native custom elements, you can use the `:defined` pseudo-class to select all elements that have been upgraded, thus allowing you to do `:not(:defined)` to invert that. Since that only works in native, Skate adds a `defined` attribute so that you have a cross-browser way of dealing with FOUC and jank.

```css
my-element {
  opacity: 1;
  transition: opacity .3s ease;
}
my-element:not([defined]) {
  opacity: 0;
}
```



## Designing Web Components

A web component's public API should be available both imperatively (via JavaScript) and declaratively (via HTML). You should be able to do everything in one, that you can do in the other within reason.



### Imperative

You should always try and make the constructor available whether it's exported from an ES2015 module or a global:

```js
class MyComponent extends skate.Component {}
customElements.define('my-component', MyComponent);
export default MyComponent;
```



### Declarative

By declaring a Skate component, you are automatically making your element available to be used as HTML. For example, if you were to create a custom element for a video player:

```js
customElements.define('x-video', class extends skate.Component {});
```

You could now just write:

```html
<x-video></x-video>
```

Instead of providing just imperative methods - such as `play()` for the native `<video>` element - you should try to provide attributes that offer the same functionality. For example, if you had a player component, you could offer a `playing` boolean attribute, so that it starts playing when it's put on the page.

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

You may write a component that you change in a backward incompatible way. In order for your users to upgrade, they'd have to do so all at once instead of incrementally if you haven't given the new one a different name. One option is to choose a different name for your component, but that may not be ideal. You could also use `skate.define()` to ensure the name is unique. An ideal solution would be to only export your constructor and let the consumer register it.

```js
export default class extends skate.Component {
  renderCallback () {
    return skate.h('div', `This element has been called: ${this.tagName}.`);
  }
}
```



### Compatible with multiple versions of itself

Skate is designed so that you can have multiple versions of it on the same page. This is so that if you have several components, your upgrades and releases aren't coupled. If you have a UI library based on Skate and those consuming your library also have Skate, your versions aren't coupled.



### Properties and Attributes

Properties and attributes should represent as much of your public API as possible as this will ensure that no matter which way your component is created, its API remains as consistent as the constraints of HTML will allow. You can do this by ensuring your properties have corresponding attributes:

```js
customElements.define('my-component', class extends skate.Component {
  static get props () {
    return {
      // Links the `name` property to the `name` attribute.
      name: { attribute: true }
    };
  }
});
```

Sometimes this may not be viable, for example when passing complex data types to attributes. In this scenario, you can try and serialize / deserialize to / from attributes. For example, if you wanted to take a comma-separated list in an attribute and have the property take an array, but still have them linked, you could do something like:

```js
customElements.define('my-component', class extends skate.Component {
  static get props () {
    return {
      values: {
        attribute: true,
        deserialize (val) {
          return val.split(',');
        },
        serialize (val) {
          return val.join(',');
        }
      }
    };
  }
});
```



### Private Members

Skate doesn't have any opinions on how you store or use private methods and properties on your elements. Classically, one would normally use scoped functions or underscores to indicate privacy:

```js
function scoped(elem) {}

customElements.define('my-component', class extends skate.Component {
  constructor () {
    super();
    scoped(this);
    this._privateButNotReally();
  }
  _privateButNotReally() {}
});
```

With ES2015, another pattern for "private" members is to use [symbol-keyed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) properties:

```js
const sym = Symbol();

customElements.define('my-component', class extends skate.Component {
  constructor () {
    super();
    this[sym]();
  }
  [sym]() {

  }
});
```

Note these also are not truly private, as they're discoverable via reflection.

### Private Data

A slightly different use-case than using private members would be storing private data. As with members, you can use scoped variables or underscores. However, scoped variables generally aren't specific to an element instance and underscores are only a privacy guideline; anyone can still access the data.

The best way to do this depends on your needs. Generally a `WeakMap` is a good choice as it will hold weak references to the key:

```js
const map = new WeakMap();

customElements.define('my-component', class extends skate.Component {
  constructor () {
    map.set(this, 'some data');
  },
  renderCallback () {
    // Renders: "<div>some data</div>"
    return skate.h('div', map.get(this));
  }
});
```

You can also use symbols on your element just like we did above with standard methods and properties, if that suits your workflow better.



## React Integration

There is a [React integration library](https://github.com/webcomponents/react-integration) that allows you to write web components - written with any *true* web component library - and convert them to react components using a single function. Once converted, it can be used in React just like you would use a normal React component.

### Patching `React.createElement()` for better DOM integration

If you want better control over attributes, properties and events, or want to pass off custom element constructors as React component names (`<CustomElement />`) have a look at [this gist](https://gist.github.com/treshugart/2fb509a8828adf7fee5245bfa2a54ba7).

### Rendering React nodes in `renderCallback()`

Skate now supports rendering a React node directly in `renderCallback()`. This means you can pass a React node as a prop and directly render it. This works very well in conjunction with the gist linked to above because you can render a custom element just like are React element and pass on React virtual nodes to it and it will render them just like it would a Skate virtual node.

See the documentation on `h()` for more information.



## Form Behaviour and the Shadow DOM



### Submission

When you encapsulate a form, button or both inside a shadow root, forms will *not* be submitted when the submit button is clicked. This is because the shadow boundary prevents each shadow root from communicating with each other. Fortunately this isn't very difficult to wire up.

Let's say we have a custom form and custom button (to reproduce, only one of them would need to be contained in a shadow root):

```js
<x-form>
  <x-button type="submit">Submit</x-button>
</x-form>
```

The definitions look like the following:

```js
customElements.define('x-form', class extends skate.Component {
  renderCallback () {
    return (
      <form>
        <slot />
      </form>
    );
  }
});

customElements.define('x-button', class extends skate.Component {
  renderCallback () {
    return (
      <button>
        <slot />
      </button>
    );
  }
});
```

To wire this up we listen for clicks coming from something that has a `type` of `"submit"`. You can also check for type, but for the sake of simplicity, we'll just check for `type`:

```js
function onClick (e) {
  if (e.target.getAttribute('type') === 'submit') {
    // do something submitty
  }
}
```

Now all you need to do is put that on the `<form>` inside of `<x-form>`:

```js
<form { onClick }>
```

You cane take this a step further and emit a `submit` event on the form and call `submit()` on it if the event wasn't canceled:

```js
function onClick (e) {
  if (e.target.getAttribute('type') === 'submit') {
    if (skate.emit(e.currentTarget, 'submit')) {
      e.currentTarget.submit();
    }
  }
}
```

The full example looks like:

```js
function onClick (e) {
  if (e.target.getAttribute('type') === 'submit') {
    if (skate.emit(e.currentTarget, 'submit')) {
      e.currentTarget.submit();
    }
  }
}

customElements.define('x-form', class extends skate.Component {
  renderCallback () {
    return (
      <form { onClick }>
        <slot />
      </form>
    );
  }
});

customElements.define('x-button', class extends skate.Component {
  renderCallback () {
    return (
      <button>
        <slot />
      </button>
    );
  }
});
```



### Form Data

The idea that built-in form elements don't publish their form-data when inside a shadow root is [being discussed](https://github.com/w3c/webcomponents/issues/187).

In order to handle this, your custom form would need to gather all the form data associated with it and submit it along with its request.



## Stateless Components

If you write a component that manages its props internally, this is called a "smart component"; very much the same as in React. There's many ways you can write components and separate them out in to smart / dumb components. You can then compose the dumb one in the smart one, reusing code while separating concerns.

However, there is one way where you can write a smart component and it can be made "dumb" as part of its API by emitting an event that allows any listeners to optionally prevent it from updating, or to simply update it with new props that it should render with.

```js
customElements.define('x-component', class extends skate.Component {
  updatedCallback (prev) {
    // Notify any listeners that the component updated. At this point the
    // listener can update the component's props without fear that this will
    // cause recursion - because it's prevented internally - and it will
    // proceed past this point with the updated props.
    const canRender = skate.emit(this, 'updated', { detail: prev });

    // This can be custom, or just reuse the default implementation. Since we
    // emitted the event and listeners had a chance to update the component,
    // this will get called with the updated state.
    return canRender && super.updatedCallback(prev);
  }
});
```

The previous example emits an event that bubbles and is cancelable. If it is canceled, then the component does not render. If the listening component updates the component's props in response to the event, the component will render with the updated props if it passes the default `updatedCallback()` check.



## Styling Components

In order to style your components, you should assume Shadow DOM encapsulation. The best-practice here is to simply put styles into a `<style>` block:

```js
customElements.define('x-component', class extends skate.Component {
  renderCallback () {
    return [
      skate.h('style', '.my-class { display: block; }'),
      skate.h('div', { class: 'my-class' }),
    ];
  }
});
```

If you want to ensure your styles are encapsulated even if using a polyfill, you can use something like [CSS Modules](https://github.com/css-modules/css-modules).
