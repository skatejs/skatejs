# skatejs/renderer-preact

> SkateJS renderer for Preact.

## Install

```sh
npm install @skatejs/renderer-preact preact skatejs
```

## Usage

The simple use case is if you're using Preact as a rendering layer.

```js
import { props, withComponent } from 'skatejs';
import withPreact from '@skatejs/renderer-preact';
import Preact from 'preact';

class WcHello extends withComponent(withPreact()) {
  static props = {
    yell: props.boolean
  };
  renderCallback({ name }) {
    return <div>Hello, {yell ? <strong>{children}</strong> : children}!</div>;
  }
}

customElements.define('wc-hello', WcHello);
```

A more complex use case is if you have an existing Preact component that you
want to wrap in a web component.

```js
import { props, withComponent } from 'skatejs';
import withPreact from '@skatejs/renderer-preact';
import { h, Component } from 'preact';

// Preact component we want to wrap in the web component.
class PreactHello extends Component {
  render() {
    const { children, yell } = this.props;
    return <div>Hello, {yell ? <strong>{children}</strong> : children}!</div>;
  }
}

// Web component that renders using Preact. This is all you need
// to do to wrap the Preact component. All props can be passed
// down and {children} becomes <slot />.
class WcHello extends withComponent(withPreact()) {
  static props = {
    // Unfortunately we need to declare props on the custom element
    // because it needs to be able to link between observed attributes
    // and properties.
    //
    // You could write a Babel plugin to transform Flow types to
    // property definitions, but we haven't done that yet.
    yell: props.boolean
  };
  render({ props }) {
    return <PreactHello {...props} />;
  }
}

customElements.define('wc-hello', WcHello);
```

For either example, you can now just write HTML:

```html
<wc-hello yell>World</wc-hello>
```
