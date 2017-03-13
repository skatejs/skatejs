# `define (Constructor)`

The `define()` function is syntactic sugar on top of `customElements.define()` that allows you to specify a `static is` property on your constructor that is the name of the component, or omit it altogether. If you define the `static is` property, it will attempt to use that as the name for the custom element when calling `customElements.define()` internally. For example:

```js
import { define } from 'skatejs';

const Ctor1 = define(class extends HTMLElement {
  static is = 'x-test-1'
});

const Ctor2 = define(class extends HTMLElement {
  static is = 'x-test-2'
});
```

## Unique tag names

When building apps with Skate, you may not care about the name that is exposed because you can use the constructor in the virtual DOM rather than specifying the tag name. If this is the case, you can omit the `static is` property and `define()` will generate a unique name, define it on the constructor and register it with that.

## Authoring components used in HTML

Autonomous custom element names aren't recommended if you're exposing your components outside of your app because then one wouldn't be able to just write HTML as they wouldn't know the tag name. In this scenario, it's recommended that you leave it up to the consumer to call `customElements.define()` and just export your constructor for them to do so. That way, they have the choice of when it's loaded, registered and what name it gets.

## Using define() outside of Skate

You can use `define()` on vanilla custom elements, not just on Skate constructors. For example, this works:

```js
import { define } from 'skatejs';

const Test = define(class extends HTMLEleement {});
```

Test will not be a Skate component, but will have a unique name associated with it. You can also provide the `static is` property, too, just like you can on a standard Skate component.

## WebPack hot-module reloading

If you're using HMR and the standard `customElements.define()`, you'll run into issues if you've defined your component a module that reloads. If this is the case, you can use `define()` to work around that. 
