# Skate

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

Skate is high level, functional abstraction over the web component [specs](https://github.com/w3c/webcomponents) that:

- Produces cross-framework compatible components
- Abstracts away common attribute / property semantics via `props`, such as attribute reflection and coercion
- Adds several lifecycle callbacks for responding to prop updates, rendering and more
- Provides a base set of [mixins](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) that hook into renderers such as [@skatejs/renderer-preact](https://github.com/skatejs/renderer-preact).

## Installing

```sh
npm install skatejs
```

To use Skate with a renderer, you'll want to install one of them:

```sh
npm install skatejs @skatejs/renderer-[renderer]
```

Where `[renderer]` is one of:

- [@skatejs/renderer-lit-html](https://github.com/skatejs/renderer-lit-html)
- [@skatejs/renderer-preact](https://github.com/skatejs/renderer-preact)
- [@skatejs/renderer-react](https://github.com/skatejs/renderer-react)
- Or any custom renderer!

## Basic usage

HTML

```html
<x-hello name="Bob"></x-hello>
```

JavaScript (using the Preact renderer)

```js
/** @jsx h */

import { props, withComponent } from 'skatejs';
import withPreact from '@skatejs/renderer-preact';
import { h } from 'preact';

const Component = withComponent(withPreact());

customElements.define('x-hello', class extends Component {
  static props = {
    name: props.string
  }
  renderCallback ({ name }) {
    return <span>Hello, {name}!</span>;
  }
});
```

Result

```html
<x-hello name="Bob">
  #shadow-root
    <span>Hello, Bob!</span>
</x-hello>
```

Whenever you change the `name` property - or attribute - the component will re-render, only changing the part of the DOM that requires updating.

## Polyfills

Skate uses both Custom Elements and Shadow DOM, but is capable of operating without Shadow DOM, you just don't get any encapsulation.

For more information on the polyfills, see [their docs](https://github.com/webcomponents/webcomponentsjs).

## Browser Support

Skate supports all evergreens and IE11, and is subject to the browser support matrix of the polyfills.

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
