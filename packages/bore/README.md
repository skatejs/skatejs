# bore

[Enzyme](https://github.com/airbnb/enzyme)-like testing utility built for the DOM and Web Components, that works both on the server and in browsers.

```sh
npm install @skatejs/bore --save-dev
```

## Usage

Bore makes testing the DOM simpler in the same way Enzyme makes testing React simpler. It's built with Web Components in mind and follows similar conventions to Enzyme, but the APIs won't map 1:1.

```js
/* @jsx h */

import { mount } from '@skatejs/bore';
import { h } from '@skatejs/val';

const wrapper = mount(
  <div>
    <span />
  </div>
);

// "span"
console.log(wrapper.one('span').node.localName);
```

**_You don't have to use [@skatejs/val](https://github.com/skatejs/val) but it makes creating DOM a lot easier than using the native imperative APIs._**

## Testing with Jest / JSDOM / Node

Currently JSDOM doesn't have web component support, so you're limited to testing non-web-component DOM in JSDOM and Jest's default configuration.

To test your web components in Node or Jest, you'll have to use [@skatejs/ssr](https://github.com/skatejs/skatejs/tree/master/packages/ssr). More information there.

## Notes about web components

Since web components are an extension of the HTML standard, Bore inherently works with it. However there are a few things that it does underneath the hood that should be noted.

* The custom element polyfill, if detected, is supported by calling `flush()` after mounting the nodes so things appear synchronous.
* Nodes are mounted to a fixture that is always kept in the DOM (even if it's removed, it will put itself back). This is so that custom elements can go through their natural lifecycle.
* The fixture is cleaned up on every mount, so there's no need to cleanup after your last mount.
* The `attachShadow()` method is overridden to _always_ provide an `open` shadow root so that there is always a `shadowRoot` property and it can be queried against.

## API

There's no distinction between shallow rendering and full rendering as there's no significant performance implications and Shadow DOM negates the need for the distinction.

### `mount(htmlOrNode)`

The mount function takes a node, or a string - and converts it to a node - and returns a wrapper around it.

```js
/** @jsx h */

import { mount } from '@skatejs/bore';
import { h } from '@skatejs/val';

mount(
  <div>
    <span />
  </div>
);
```

## Wrapper API

A wrapper is returned when you call `mount()`:

```js
const wrapper = mount(
  <div>
    <span />
  </div>
);
```

The wrapper contains several methods and properties that you can use to test your DOM.

### `node`

Returns the node the wrapper is representing.

```js
// div
mount(<div />).node.localName;
```

### `all(query)`

You can search using pretty much anything and it will return an array of wrapped nodes that matched the query.

#### Element constructors

You can use element constructors to search for nodes in a tree.

```js
mount(
  <div>
    <span />
  </div>
).all(HTMLSpanElement);
```

Since custom elements are just extensions of HTML elements, you can do it in the same exact way:

```js
class MyElement extends HTMLElement {}
customElements.define('my-element', MyElement);

mount(
  <div>
    <my-element />
  </div>
).all(MyElement);
```

#### Custom filtering function

Custom filtering functions are simply functions that take a single node argument.

```js
mount(
  <div>
    <span />
  </div>
).all(node => node.localName === 'span');
```

#### Diffing node trees

You can mount a node and search using a different node instance as long as it looks the same.

```js
mount(
  <div>
    <span />
  </div>
).all(<span />);
```

The node trees must match exactly, so this will not work.

```js
mount(
  <div>
    <span>test</span>
  </div>
).all(<span />);
```

#### Using an object as criteria

You can pass an object and it will match the properties on the object to the properties on the element.

```js
mount(
  <div>
    <span id="test" />
  </div>
).all({ id: 'test' });
```

The objects must completely match, so this will not work.

```js
mount(
  <div>
    <span id="test" />
  </div>
).all({ id: 'test', somethingElse: true });
```

#### Selector

You can pass a string and it will try and use it as a selector.

```js
mount(
  <div>
    <span id="test" />
  </div>
).all('#test');
```

### `one(query)`

Same as `all(query)` but only returns a single wrapped node.

```js
mount(
  <div>
    <span />
  </div>
).one(<span />);
```

### `has(query)`

Same as `all(query)` but returns true or false if the query returned results.

```js
mount(
  <div>
    <span />
  </div>
).has(<span />);
```

### `wait([then])`

The `wait()` function returns a promise that waits for a shadow root to be present. Even though Bore ensures the `constructor` and `connectedCallback` are called synchronously, your component may not have a shadow root right away, for example, if it were to have an async renderer that automatically creates a shadow root. An example of this is [Skate's](https://github.com/skatejs/skatejs) renderer.

```js
mount(<MyComponent />)
  .wait()
  .then(doSomething);
```

A slightly more concise form of the same thing could look like:

```js
mount(<MyComponent />).wait(doSomething);
```

### `waitFor(funcReturnBool[, options = { delay: 1 }])`

Similar to `wait()`, `waitFor(callback)` will return a `Promise` that polls the `callback` at the specified `delay`. When it returns truthy, the promise resolves with the wrapper as the value.

```js
mount(<MyElement />).waitFor(wrapper => wrapper.has(<div />));
```

This is very usefull when coupled with a testing framework that supports promises, such as Mocha:

```js
describe('my custom element', () => {
  it('should have an empty div', () => {
    return mount(<MyComponent />).waitFor(w => w.has(<div />));
  });
});
```
