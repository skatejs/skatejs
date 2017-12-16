# skatejs/renderer-react

> SkateJS renderer for React.

## Install

```sh
npm install @skatejs/renderer-react react react-dom skatejs
```

## Usage

The simple use case is if you're using React as a rendering layer.

```js
import { props, withComponent } from 'skatejs';
import withReact from '@skatejs/renderer-react';
import React from 'react';

class WcHello extends withReact(withComponent()) {
  // The `children` prop is auto-defined in the `withReact` mixin and outputs a <slot />
  static props = {
    yell: props.boolean
  };
  render({ children, yell }) {
    return <div>Hello, {yell ? <strong>{children}</strong> : children}!</div>;
  }
}

customElements.define('wc-hello', WcHello);
```

## Wrapping React components with Web Components

Being able to wrap a React component with a web component is extremely powerful
because you can author everything in React - whether it be existing or new
components - and use them in any other stack that works with the DOM such as
Vue, Angular, Preact, Inferno, CycleJS and more.

This isn't specific to React, we have other renderers and the same rule applies,
React is simply the largest and most popular option at the moment, so it carries
more weight to make an example with it.

Here we take the previous example and author a standalone React component from
it.

```js
import { props, withComponent } from 'skatejs';
import withReact from '@skatejs/renderer-react';
import React from 'react';

class ReactHello extends React.Component {
  render() {
    const { children, yell } = this.props;
    return <div>Hello, {yell ? <strong>{children}</strong> : children}!</div>;
  }
}

class WcHello extends withReact(withComponent()) {
  static props = {
    yell: props.boolean
  };
  render({ props }) {
    return <ReactHello {...props} />;
  }
}

customElements.define('wc-hello', WcHello);
```

For either example, you can now just write HTML:

```html
<wc-hello yell>World</wc-hello>
```

To simplify wrapping, there's a default `render()` implementation that allows
you to simply do:

```js
class WcHello extends withReact(withComponent()) {
  static props = { yell: props.boolean };
  static reactComponent = ReactHello;
}
```

It's important to note that it's a best practice to provide an attribute API, so
we must specify `props` that will auto-link props to attributes. This is also
required because the component needs to know which props cause a re-render.

This can be automated as described in the next section.

## Using Flow to share prop types

If you're using Flow, you can share prop type definitions for both components
using
[this Babel plugin](https://github.com/skatejs/babel-plugin-transform-skate-flow-props).

The example above can be rewritten to share Flow types for their props.

```js
// @flow

import { props, withComponent } from 'skatejs';
import withReact from '@skatejs/renderer-react';
import React from 'react';

type Props = {
  yell: boolean
};

class ReactHello extends React.Component {
  props: Props;
  render() {
    const { children, yell } = this.props;
    return <div>Hello, {yell ? <strong>{children}</strong> : children}!</div>;
  }
}

class WcHello extends withReact(withComponent()) {
  props: Props;
  render() {
    return <ReactHello {...this.props} />;
  }
}

customElements.define('wc-hello', WcHello);
```
