# `vdom`

Skate includes several helpers for creating virtual elements with Incremental DOM.



## [DEPRECATED] `vdom.element (elementName, attributesOrChildren, ...children)`

*This has been deprecated in favour of using the the `h` export directly.*

The `elementName` argument is the name of the element you want to create. This can be a string or a function. If it's a function, it is treated as a [component constructor](#component-constructor) or [function helper](#function-helper).

The `attributesOrChildren` argument is either an `object`, a `function` that will render the children for this element or a `string` if you only want to render a text node as the children.

The rest of the arguemnts are functions that render out `children`.

```js
skate.vdom.element('select', { name: 'my-select' }, function () {
  skate.vdom.element('option', { value: 'myval' }, 'My Value');
});
```



## [DEPRECATED] `vdom.text (text)`

*This has been deprecated in favour of just passing text to an element.*

The `text()` function is exported directly from Incremental DOM and you could use that if you wanted to instead of specifying text as a string to a parent node:

```js
skate.vdom.element('option', { name: 'my-select' }, function () {
  skate.vdom.element('option', { value: 'myval' }, function () {
    skate.vdom.text('My Value');
  });
});
```

This is very useful if you need to render text with other elements as siblings, or do complex conditional rendering. It's also useful when your custom element may only need to render text nodes to its shadow root.



## Incremental DOM

Skate uses Incremental DOM underneath the hood because not only is it performant and memory-efficient, it also acts as a backend to any templating language that can compile down to it. It's less limiting as a transpile target than other virtual DOM implementations so you can use languages other than JSX with it.

We wrap Incremental DOM to add functionality on top of it that we feel is essential to productively building web components:

- We set properties instead of attributes wherever possible
- You can pass component constructors and stateless functions as element names directly to the Incremental DOM functions, just like you can in JSX
- We handle special properties such as `class`, `key`, `ref`, `skip` and `statics`



### Component constructor

If you pass a component constructor instead of an string as the element name, the name of the component will be used. This means that instead of using hard-coded custom element names, you can import your constructor and pass that instead:

```js
class MyElement extends skate.Component {}
customElements.define('my-element', MyElement);

// Renders <my-element />
skate.h(MyElement);
```

This is provided at the Incremental DOM level of Skate, so you can also do:

```js
skate.vdom.elementOpen(MyElement);
```

This is very helpful in JSX:

```js
<MyElement />
```

However, since this is provided in the Incremental DOM functions that Skate exports, it means that you can do this in any templating language that supports it.



### Function helper

Function helpers are passed in the same way as a component constructor but are handled differently. They provide a way for you to write pure, stateless, functions that will render virtual elements in place of the element that you've passed the function to. Essentially they're stateless, private web components.

```js
const MyElement = () => skate.h('div', 'Hello, World!');

// Renders <div>Hello, World!</div>
skate.h(MyElement);
```

You can customise the output using properties:

```js
const MyElement = props => skate.h('div', `Hello, ${props.name}!`);

// Renders <div>Hello, Bob!</div>
skate.h(MyElement, { name: 'Bob' });
```

Or you could use children:

```js
const MyElement = (props, chren) => skate.h('div', 'Hello, ', chren, '!');

// Renders <div>Hello, Mary!</div>
skate.h(MyElement, 'Mary');
```

As with the component constructor, you can also use this in JSX or any other templating language that supports passing functions as tag names:

```js
const MyElement = (props, chren) => <div>Hello, {chren}!</div>;

// Renders <div>Hello, Mary!</div>
<MyElement>Mary</MyElement>
```



### Special Attributes

Skate adds some opinionated behaviour to Incremental DOM.



#### `class`

The recommended way to specify a list of classes on an element is by simply specifying the `class` attribute as you'd normally do in HTML. It's not necessary to specify `className`, though you can if you really want to.



#### `key`

This gives the virtual element a [`key`](http://google.github.io/incremental-dom/#conditional-rendering/array-of-items) that Incremental DOM uses to keep track of it for more efficient patches when dealing with arrays of items.

```js
skate.h('ul',
  skate.h('li', { key: 0 }),
  skate.h('li', { key: 1 }),
);
```



#### `on*`

Any attribute beginning with `on` followed by an uppercase character or dash, will be bound to the event matching the part found after `on`.

```js
const onClick = console.log;
skate.h('button', { onClick });
skate.h('button', { 'on-click': onClick });
```

Additionally, events that exist as properties on DOM elements can also be used:

```js
skate.h('button', { onclick: onClick });
```

if you need to bind listeners directly to your host element, you should do this in one of your lifecycle callbacks:

```js
customElements.define('my-element', class extends skate.Component {
  constructor () {
    super();
    this.addEventListener('change', this.handleChange);
  }

  handleChange(e) {
    // `this` is the element.
    // The event is passed as the only argument.
  }
});
```



#### `ref`

A callback that is called when the attribute is set on the corresponding element. The only argument is the element that `ref` is bound to.

```js
const ref = button => button.addEventListener('click', console.log);
skate.h('button', { ref });
```

Refs are only called on the element when the value of `ref` changes. This means they get called on the initial set, and subsequent sets if the reference to the value changes.

For example, if you define a function outside of `renderCallback()`, it will only be called when the element is rendered for the first time:

```js
const ref = console.log;
customElements.define('my-element', class extends skate.Component {
  renderCallback () {
    return skate.h('div', { ref });
  }
});
```

However, if you define the `ref` function within `renderCallback()`, it will be a new reference every time, and thus be called every time:

```js
customElements.define('my-element', class extends skate.Component {
  renderCallback () {
    const ref = console.log;
    return skate.h('div', { ref });
  }
});
```

*It's important to understand that this only gets called on the element when either the ref is set up or changed, not when the element is removed from the tree. This is because we discourage saving the value of `ref`. If you need it to only be called when the element is set up, put the `ref` outside of `render()`. If you absolutely need to save the value, try using a `WeakMap`.*



#### `skip`

This is helpful when integrating with 3rd-party libraries that may mutate the DOM.

```js
skate.h('div', { ref: e => (e.innerHTML = '<p>oh no you didn\'t</p>'), skip: true });
```



#### `statics`

This is an array that tells Incremental DOM which attributes should be considered [static](http://google.github.io/incremental-dom/#rendering-dom/statics-array).

```js
skate.h('div', { statics: ['attr1', 'prop2'] });
```



#### Boolean Attributes

If you specify `false` as any attribute value, the attribute will not be added, it will simply be ignored.
