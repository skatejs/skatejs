# `define (nameOrConstructor, Constructor)`

The `define()` function is syntactic sugar on top of `customElements.define()` that enables the following things:

1. Non-conflicting custom element names
2. Automated custom element names

Both non-conflicting names and automated names are complementary and derive from the same functionality. Basically, if you were to do:

```js
customElements.define('x-test', class extends HTMLElement {});
customElements.define('x-test', class extends HTMLElement {});
```

Then you'd get an error. Similarly, you could do this:

```js
skate.define('x-test', class extends HTMLElement {});
skate.define('x-test', class extends HTMLElement {});
```

Skate will ensure that the second definition gets a unique name prefixed with `x-test`. This is immensely useful when writing tests because you don't need to keep track of what's already registered, but it can also be useful if you have several versions of a particular component appearing on the page. The only caveat is that if you need the tag name that the element was registered with, you have to use the constructor and access the `tagName` property. However, if you have access to the constructor, it's likely you don't need the tag name in the first place.

You may also omit the first argument, making your custom elements autonomous. This is useful if you're building your app comprised entirely of Skate and your components will only be used within a Skate app.

```js
skate.define(class extends skate.Component {
  renderCallback () {}
});
```

This works well because you can pass around constructors within your Skate components and you won't ever need to worry about HTML tag naming conventions.

*Autonomous custom element names aren't recommended if you're exposing your components outside of your app because then one wouldn't be able to just write HTML as they wouldn't know the tag name.*



## WebPack Hot-Module Reloading

If you're using HMR and the standard `customElements.define()`, you'll run into issues if you've defined your component a module that reloads. If this is the case, you can use `skate.define()` to ensure each registration has a unique name.

*Skate cannot refresh the component definition as there is no way to reregister a component using the web component APIs.*
