# skatejs/renderer-lit-html

SkateJS renderer for [Lit HTML](https://github.com/PolymerLabs/lit-html).

## Install

```sh
npm install skatejs lit-html @skatejs/renderer-lit-html
```

## Usage

This assumes knowledge of SkateJS.

```js
import { html } from 'lit-html';
import { withComponent } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';

class MyComponent extends withComponent(withLitHtml()) {
  render() {
    return html`Hello, <slot />!`;
  }
}
```
