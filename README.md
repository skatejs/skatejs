# [Skate][gitbook]

[![Downloads per month](https://img.shields.io/npm/dm/skatejs.svg)](https://www.npmjs.com/package/skatejs)
[![NPM version](https://img.shields.io/npm/v/skatejs.svg)](https://www.npmjs.com/package/skatejs)
[![Build Status](https://travis-ci.org/skatejs/skatejs.svg?branch=master)](https://travis-ci.org/skatejs/skatejs)
[![Join the chat at https://gitter.im/skatejs/skatejs](https://badges.gitter.im/skatejs/skatejs.svg)](https://gitter.im/skatejs/skatejs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Semantic Release](https://img.shields.io/badge/semantic--release-%F0%9F%9A%80-ffffff.svg)](https://github.com/semantic-release/semantic-release)
[![OpenCollective](https://opencollective.com/skatejs/backers/badge.svg)](#backers) 
[![OpenCollective](https://opencollective.com/skatejs/sponsors/badge.svg)](#sponsors)
[![Follow @skate_js on Twitter](https://img.shields.io/twitter/follow/skate_js.svg?style=social&label=@skate_js)](https://twitter.com/skate_js)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/skatejs.svg)](https://saucelabs.com/u/skatejs)

Skate is a library built on top of the [W3C web component specs](https://github.com/w3c/webcomponents) that enables you to write functional and performant web components with a very small footprint.

- Functional rendering pipeline backed by Google's [Incremental DOM](https://github.com/google/incremental-dom).
- Inherently cross-framework compatible. For example, it works seamlessly with - and complements - React and other frameworks.
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
  - [Recipes](https://skatejs.gitbooks.io/skatejs/content/docs/recipes)
  - [Examples](https://skatejs.gitbooks.io/skatejs/content/docs/examples)
  - [API](https://skatejs.gitbooks.io/skatejs/content/docs/api)

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

To get up and running quickly with our recommended configuration, we've created a single package called [`skatejs-web-components`](https://github.com/skatejs/web-components) where all you have to do is *load it before your definitions*.

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



### Transpilation and native custom element gotchas

*If you’re using Babel or some other tool to transpile your ES2015 code to ES5, simply import `skatejs` and `skatejs-web-components` (or selectively include the polyfills) as needed and ignore the following.*

Native custom element support requires that you load a shim if you're not delivering native ES2015 classes to the browser. If you're transpiling to ES5, you must - at the very least - load the [native shim](https://github.com/webcomponents/custom-elements/blob/master/src/native-shim.js):

When you load Skate by module name (`import { ... } from 'skatejs';` or `require('skatejs');`), you'll be getting the transpiled source. Thus even if you author your components in ES2015, you'll still be getting ES5 base-classes and the native custom elements implementation will complain. If you want to deliever native classes you have to point to the non-transpiled Skate source: `import { ... } from 'skatejs/src';`. Currently this is not supported by our API versioning but we have an [issue](#992) to work around this.

More information can be found in the [webcomponents/custom-elements](https://github.com/webcomponents/custom-elements#known-issues) repo.



## Browser Support

Skate supports all evergreens and IE11. We recommend using the following polyfills:

- Custom Elements: https://github.com/webcomponents/custom-elements
- Shadow DOM: https://github.com/webcomponents/shadydom
- Shadow DOM (CSS fills): https://github.com/webcomponents/shadycss


[gitbook]: https://skatejs.gitbooks.io/skatejs/content/

## Backers
Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/skatejs#backer)]

<a href="https://opencollective.com/skatejs/backer/0/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/1/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/2/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/3/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/4/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/5/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/6/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/7/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/8/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/9/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/10/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/11/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/12/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/13/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/14/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/15/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/16/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/17/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/18/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/19/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/20/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/21/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/22/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/23/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/24/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/25/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/26/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/27/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/28/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/backer/29/website" target="_blank"><img src="https://opencollective.com/skatejs/backer/29/avatar.svg"></a>

## Sponsors
Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/skatejs#sponsor)]

<a href="https://opencollective.com/skatejs/sponsor/0/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/1/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/2/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/3/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/4/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/5/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/6/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/7/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/8/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/9/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/10/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/11/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/12/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/13/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/14/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/15/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/16/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/17/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/18/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/19/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/20/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/21/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/22/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/23/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/24/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/25/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/26/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/27/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/28/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/skatejs/sponsor/29/website" target="_blank"><img src="https://opencollective.com/skatejs/sponsor/29/avatar.svg"></a>
