# skatejs/define

Manage the complexity of having a global custom element registry.

- Define a custom element only if it hasn't been defined yet.
- Retrieve the custom element name of a particular constructor.
- Generate a unique custom-element name, with an optional prefix.

## Installing

```sh
npm i @skatejs/define
```

## Using

The common use case would be ensuring a custom element is defined and then retrieving that name so you can use it.

```js
import define, { getName } from '@skatejs/define';
import CustomElement from 'some-custom-element';

define(CustomElement);

const name = getName(CustomElement);

document.body.innerHTML = `
  <${name}>Hello!</${name}>
`;
```

While this becomes a bit cumbersome if you were to write everything like that, this library is intended to be used inside of an abstraction.

## Note about use cases

This package is intended for use when you're using custom elements inside of a JavaScript context. Examples of this are if you're building your app with a JavaScript library, or framework, and you have the ability to retrieve and use the unique name that is generated from this libray.

When using in the context of an HTML file, you can't retrieve the unique name of a custom element so that you can use it. In this scenario, you must choose an explicit name for the element.

Many authors choose to export a pre-defined custom element. While this is convenient - and is a viable option - this pollutes the global namespace and means that there cannot be multiple versions of the element on the page.

We recommend that if authors do this, that they create a separate module to pre-define the element in.

```js
// custom-element/index.js
export default class extends HTMLElement {}

// custom-element/register.js
import MyCustomElement from './index.js';
customElements.define('custom-element', MyCustomElement);
```

This allows the consumer to import the constructor separately from the registration and avoid the pitfalls of pre-registering.

The author of the custom element could take this even further and conditionally register if it hasn't alreayd been registered.

```js
// custom-element/index.js
export default class extends HTMLElement {}

// custom-element/register.js
import MyCustomElement from './index.js';
customElements.define('custom-element', MyCustomElement);
```
