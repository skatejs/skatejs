# skatejs/renderer-hyperhtml

SkateJS renderer for [HyperHTML](https://github.com/WebReflection/hyperHTML).

## Install

```sh
npm install skatejs hyperhtml @skatejs/renderer-hyperhtml
```

## Usage

This assumes knowledge of SkateJS.

```js
import { render } from 'hyperhtml';
import { Component } from 'skatejs';
import withRenderer from '@skatejs/renderer-hyperhtml';

class MyComponent extends withRenderer(Component) {
  render() {
    return render`Hello, <slot />!`;
  }
}
```
