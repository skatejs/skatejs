# element-react

SkateJS renderer for [React](https://reactjs.org/).

## Install

```bash
npm i @skatejs/element-react react react-dom
```

## Usage

```js
import Element, { React } from "@skatejs/element-react";

class Hello extends Element {
  render() {
    return (
      <span>
        Hello, <slot />!
      </span>
    );
  }
}

customElements.define("x-hello", Hello);
```

```html
<x-hello>World</x-hello>
```

## Current issues with React

There are currently a few issues integrating with React that we have to work
around:

1. React only sets attributes on custom elements.
2. React does not bind to custom events.

### Attributes vs properties

React doesn't set properties on custom elements because it doesn't know which
ones are properties and which ones are attributes. As the author of a custom
element, you should always try and provide attributes for every property that
you have and property deserialize from the attribute to the property.

In Skate, a lot of this happens automatically for you. However there are times
when you must still explicitly specify a property. For this case, we've provided
a `setProps` export that allows you to do this in React:

```js
import Element, { React, setProps } from "@skatejs/element-react";
import React, { Component } from "react";

class Hello extends Element {
  static props = {
    name: String
  };
  render() {
    return <span>Hello, {this.name}!</span>;
  }
}

export default class extends Component {
  optionalParentRefCallback = () => {};
  render() {
    return (
      <Hello
        ref={setProps({ name: "World" }, this.optionalParentRefCallback)}
      />
    );
  }
}
```

### Custom events

The issue with custom events is similar to with properties in that React doesn't
know which events it should bind to.

Instead of providing a separate abstraction to work around this, you can define
properties that bind to custom events and use the `setProps` function to add
custom event handlers. With Skate's `event` prop type, this is trivial.

```js
import Element, { React, setProps } from "@skatejs/element-react";
import React, { Component } from "react";

class Button extends Element {
  static props = {
    name: String,
    onClick: Event
  };
  render() {
    return (
      <button onClick={this.onClick}>
        <slot />
      </button>
    );
  }
}

export default class extends Component {
  optionalParentRefCallback = () => {};
  state = {
    clicked: false
  };
  render() {
    return (
      <Button
        ref={setProps({
          onClick(e) {
            this.setState({ clicked: e.detail.clicked });
          }
        })}
      >
        {this.state.clicked ? "Clicked!" : "Click me"}
      </Button>
    );
  }
}
```
