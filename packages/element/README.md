# skatejs/element

@skatejs/element is the core functionality of SkateJS that each renderer - such as @skatejs/element-lit-html - uses as its base.

## Install

```sh
npm i @skatejs/element
```

## Usage

By default, `@skatejs/element` lets you return a `string` from `render()` and sets `shadowRoot.innerHTML` to whatever is returned.

```js
import Element from '@skatejs/element';

class Hello extends Element {
  render() {
    return `
      <span>
        Hello, <slot></slot>!
      </span>
    `;
  }
}

customElements.define('x-hello', Hello);
```

```html
<x-hello>World</x-hello>
```

### Authoring a renderer

To use `@skatejs/element` as a base class for creating your own renderer, you simply extend it and define a `renderer()` method. For example, `@skatejs/lit-html` looks something like:

```js
import Element from '@skatejs/element';
import { render } from 'lit-html';

export default class extends Element {
  renderer() {
    return render(this.render(), this.renderRoot);
  }
}
```

Using `renderRoot` means that your consumer can customise where the element renders its content. By default this is `shadowRoot`.

### Props

All we've seen so far is an element that exposes a `<slot>`, which gets light DOM projected into it. For more information on slots read [MDN's guide on templates and slots](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots).

However, most components you write will expose a broader public API than just its content. It may not even have content. For example we could write the original "hello" example above using just `props`:

```js
class Hello extends Element {
  static get props() {
    return {
      name: String
    };
  }
  render() {
    return `
      <span>
        Hello, ${this.name}!
      </span>
    `;
  }
}
```

And then you'd use it like:

```html
<x-hello name="World"></x-hello>
```

### Prop types

As you can see in the above example for `props`, we used the built-in `String` type. The complete list of supported types are:

- `Array`
- `Boolean`
- `Event`
- `Number`
- `Object`
- `String`

You specify each of them just like you saw `String` specified above.

All props:

- Have a corresponding prop you can also `import { props } from "@skatejs/element";` and use like `props.string`.
- Deserialize from their corresponding attribute by default. The `source` property name is the lowercased property name (i.e `propName.toLowerCase()`).
- Do _not_ serialize to an attribute by default. This is for performance reasons and so that the DOM is not unexpectedly mutated. This can be overridden (see "Serializing to an attribute").

#### Any

- Defaults to `null`.
- Serializes / deserializes to / from an attribute by simply passing the value to / from the attribute as-is. No transformations occur.

#### Array

- Defaults to `[]`.
- Serlializes to an attribute using `JSON.stringify`.
- Deserializes from an attribute using `JSON.parse`.

#### Boolean

- Defaults to `false`. Beware that overriding this to `true` means that you can never set the value to `false` using a declarative HTML attribute unless you invoke `removeAttribute()` imperatively.
- Serializes to an attribute with an empty string as its value (boolean attribute) if the value is truthy.
- Deserializes from an attribute simply by the attribute's presence. If it exists, the value is true. If not, it's false.

#### Event

- Does not have a default.
- Does not serialize / deserialize because it violates CSP.
- Returns a function that dispatches the event on the element the handler was set on.
- It's similar to how `onclick` and other properties work with events.

Example:

```js
class MyElement extends Element {
  static get props() {
    return {
      myEvent: Event
    };
  }
}

// Assuming you've defined your element.
const elem = new MyElement();

// Your handler is wrapped in a dispatch function that dispatches a custom event.
elem.myEvent = e => console.log(e.detail);

// Logs "event detail".
elem.myEvent('event detail');
```

This removes heaps of boilerplate around the `addEventListener()` / `removeEventListener()` / `dispatchEvent` lifecycle because:

- You don't have to construct a new event and dispatch it on your element; the handler wrapper does this for you.
- Whenever you set a new handler, the previous handler is automatically removed and cleaned up.

#### Number

- Defaults to `0`.
- Serializes to an attribute by converting it to a string. For example, `0` becomes `"0"`.
- Deserializes from an attribute by converting it back to a number.

#### Object

- Defaults to `{}`.
- Otherwise, same as `Array`.

#### String

- Defaults to `''`.
- Serializes to an attribute by converting whatever the value is to a string.
- Deserializes from an attribute by just using the attribute value (because it's already a string).

#### Serializing to an attribute

As mentioned above, props do not serialize to attributes by default. This is for a couple of reasons:

1. We do not want to mutate the DOM. It may be being tracked by a vDOM library, or something else and the mutation may be unexpected.
2. It can cause unwanted performance implications (attribute sets are roughly 3x slower than property sets).

If you would like to serialize a property to an attribute, simply specify a `target` option over your prop of choice. For example:

```js
class Example extends Element {
  static get props() {
    return {
      name: { ...props.string, target: 'name' }
    };
  }
}
```

If you'd like to generalize this, you can make `target` a function:

```js
const target = prop => prop.toLowerCase();

class Example extends Element {
  static get props() {
    return {
      name: { ...props.string, target }
    };
  }
}
```

### Custom prop types

Coming soon!
