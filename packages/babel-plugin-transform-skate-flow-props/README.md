# babel-plugin-transform-skate-flow-props

> Babel plugin to transform Flow types to Skate props.

## Install

```sh
npm install babel-plugin-transform-skate-flow-props
```

## Usage

In your `.babelrc`:

```json
{
  "plugins": ["transform-skate-flow-props"]
}
```

## Output

This plugin is designed to be used with Skate props, but can be applied to any class deriving from HTMLElement. The output simply assumes that you're using `props` from SkateJS.

Sample input:

```js
import { props } from 'skatejs';

type Props = {
  name: string,
  tags: Array<string>
};

class Test extends HTMLElement {
  props: Props;
}
```

Sample output with Flow types stripped and before transforming class fields:

```js
import { props } from 'skatejs';

class Test extends HTMLElement {
  static props = {
    name: props.string,
    tags: props.array
  };
}
```

## Use cases

The major use case of this library is to allow you to simply write Flow without having to duplicate them as Skate props. You get the behaviour and semantics of Skate props and Flow types all in one.

### Skate's React renderer

Something we're aiming to support is sharing Flow types between React prop types and Skate props. This means that if you want to wrap your React component with web component (using [Skate's React renderer](https://github.com/skatejs/renderer-react)), you can share the Flow types and not have to redefine the props for Skate to get their behaviour.

An example:

```js
// @flow

import React from 'react';
import { props, withComponent } from 'skatejs';
import withRenderer from '@skatejs/renderer-react';

type Props = {
  name: string,
  tags: Array<string>
};

class ReactComponent extends React.Component {
  props: Props;
  render() {
    return (
      <div>
        {this.props.name}: {this.props.tags.join(' ')}
      </div>
    );
  }
}

class SkateComponent extends withComponent(withRenderer()) {
  props: Props;
  renderCallback() {
    return <ReactComponent {...this.props} />;
  }
}
```

Without this, you'd have to manually write the props on the Skate component like so:

```js
class SkateComponent extends withComponent(withRenderer()) {
  static props = {
    name: props.string,
    tags: props.array
  };
  renderCallback() {
    return <ReactComponent {...this.props} />;
  }
}
```

This can be _super_ tedious.

On top of trying to make your life easier, we also want to try and bridge the gap between web components and the React component model as much as possible. We think the two are complimentary and should be simple to compose together when necessary.
