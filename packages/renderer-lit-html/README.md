# skatejs/renderer-lit-html

SkateJS renderer for [LitHTML](https://github.com/PolymerLabs/lit-html).

Please note `renderer-lit-html` uses Lit HTML's extended renderer by default. This provides slightly different
than default, and enhanced, functionality as described
[here](https://github.com/PolymerLabs/lit-html/blob/master/src/lib/lit-extended.ts#L25).

## Install

```sh
npm install skatejs lit-html @skatejs/renderer-lit-html
```

## Usage

This assumes knowledge of SkateJS.

```js
import { html } from 'lit-html';
import { Component } from 'skatejs';
import withRenderer from '@skatejs/renderer-lit-html';

class MyComponent extends withRenderer(Component) {
  render() {
    return html`Hello, <slot></slot>!`;
  }
}
```
