# Skate

[![NPM version](https://img.shields.io/npm/v/skatejs.svg)](https://www.npmjs.com/package/skatejs)
[![Build Status](https://travis-ci.org/skatejs/skatejs.svg?branch=master)](https://travis-ci.org/skatejs/skatejs)
[![Size](https://img.shields.io/badge/min+gz-4.64%20kB-blue.svg)](https://unpkg.com/skatejs)
[![Join the chat at https://gitter.im/skatejs/skatejs](https://badges.gitter.im/skatejs/skatejs.svg)](https://gitter.im/skatejs/skatejs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Semantic Release](https://img.shields.io/badge/semantic--release-%F0%9F%9A%80-ffffff.svg)](https://github.com/semantic-release/semantic-release)
[![Follow @skate_js on Twitter](https://img.shields.io/twitter/follow/skate_js.svg?style=social&label=@skate_js)](https://twitter.com/skate_js)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/skatejs.svg)](https://saucelabs.com/u/skatejs)

Skate is a library built on top of the [W3C web component specs](https://github.com/w3c/webcomponents) that enables you to write functional and performant web components with a very small footprint.

- Functional rendering pipeline backed by Google's [Incremental DOM](https://github.com/google/incremental-dom).
- Inherently cross-framework compatible. For example, it works seamlessly with - and complements - React and other frameworks.
- Skate itself is only 4k min+gz.
- It's very fast.
- It works with multiple versions of itself on the page.

HTML

```html
<x-hello name="Bob"></x-hello>
```

JavaScript

```js
customElements.define('x-hello', class extends skate.Component {
  static get props () {
    return {
      name: { attribute: true }
    };
  }
  renderCallback () {
    return skate.h('div', `Hello, ${this.name}`);
  }
});
```

Result

```html
<x-hello name="Bob">Hello, Bob!</x-hello>
```

Whenever you change the `name` property - or attribute - the component will re-render, only changing the part of the DOM that requires updating.



## Documentation

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

  - [Installing](#installing)
    - [NPM](#npm)
    - [Script Tag](#script-tag)
  - [Dependencies](#dependencies)
  - [Browser Support](#browser-support)
  - [Recipes](docs/recipes/README.md)
  - [Examples](docs/examples/README.md)
  - [API](docs/api/README.md)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Installing

There's a couple ways to consume Skate.



### NPM

```sh
npm install skatejs
```

Skate exports a UMD definition so you can:

```js
import * as skate from 'skatejs';
const skate = require('skatejs');
require(['skatejs'], function (skate) {});
```

There's three files in `dist/`. Each has a UMD definition and a corresponding sourcemap file:

1. `index.js` - This is the `main` entry point in the `package.json` without dependencies.
2. `index-with-deps.js` - Unminified with dependencies.
3. `index-with-deps.min.js` - Minified with dependencies.



### Script Tag

```html
<script src="https://unpkg.com/skatejs/dist/index-with-deps.min.js"></script>
```

Since Skate exports a UMD definition, you can then access it via the global:

```js
const { skate } = window;
```



## Dependencies

Skate doesn't require you provide any external dependencies, but recommends you provide some web component polyfills depending on what browsers you require support for. **Skate requires both Custom Elements and Shadow DOM v1.**

To get up and running quickly with our recommended configuration, we've created a single package called [`skatejs-web-components`](https://github.com/skatejs/web-components) where all you have to do is *load it before Skate*.

```sh
npm install skatejs skatejs-web-components
```

And then you can import it:

```js
import 'skatejs-web-components';
import { define, vdom } from 'skatejs';
```

Or you can use script tags:

```html
<script src="https://unpkg.com/skatejs-web-components/dist/index.min.js"></script>
<script src="https://unpkg.com/skatejs/dist/index-with-deps.min.js"></script>
```

If you want finer grained control about which polyfills you use, you'll have to BYO Custom Element and Shadow DOM polyfills.



## Browser Support

Skate supports all evergreens and IE11. We recommend using the following polyfills:

- Custom Elements: https://github.com/webcomponents/custom-elements
- Shadow DOM: https://github.com/webcomponents/shadydom
- Shadow DOM (CSS fills): https://github.com/webcomponents/shadycss
