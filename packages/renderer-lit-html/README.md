# skatejs/renderer-lit-html

SkateJS renderer for [Lit HTML](https://github.com/PolymerLabs/lit-html).

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
import { withComponent } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';

class MyComponent extends withComponent(withLitHtml()) {
  render() {
    return html`Hello, <slot />!`;
  }
}
```
