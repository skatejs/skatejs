# Skate

[![Build Status](https://travis-ci.org/skatejs/skatejs.svg?branch=master)](https://travis-ci.org/skatejs/skatejs)
[![Downloads per month](https://img.shields.io/npm/dm/skatejs.svg)](https://www.npmjs.com/package/skatejs)
[![Join the chat at https://gitter.im/skatejs/skatejs](https://badges.gitter.im/skatejs/skatejs.svg)](https://gitter.im/skatejs/skatejs)
[![Follow @skate_js on Twitter](https://img.shields.io/twitter/follow/skate_js.svg?style=social&label=@skate_js)](https://twitter.com/skate_js)

Skate is a functional reactive abstraction over
[the web component standards](https://github.com/w3c/webcomponents) as a set of packages that enables you to write small, fast and scalable web components using popular view libraries such as React, Preact and LitHTML.

- 🌏 Cross-framework compatible components.
- ⚛️ Render components using your favourite view libary, or none at all.
- 👑 Guided conventions for best-practices when reflecting between, and reacting to attributes, properties and events.
- 🌟 Full TypeScript support.
- 📚 Docs [https://skatejs.netlify.com](https://skatejs.netlify.com).

## Getting started

The simplest way to get up and running is to start with a pre-configured element such as [`@skatejs/element-lit-html`]([https://skatejs.netlify.com/packages/element-lit-html).

```sh
npm i @skatejs/element-lit-html
```

### Simple example

```js
import Element, { html } from '@skatejs/element-lit-html';

export default class extends Element {
  static props = {
    name: String
  };
  render() {
    return html`
      Hello, ${this.name}!
    `;
  }
}
```

### Other examples

1. [Todo list](https://codesandbox.io/s/8zjp9qqj9l)

### Cli

There's a CLI to get you up and running: [https://skatejs.netlify.com/packages/cli](https://skatejs.netlify.com/packages/cli).

```sh
$ npm i -g @skatejs/cli
$ skatejs
```

## Polyfills

Skate builds upon the
[Custom Elements](https://w3c.github.io/webcomponents/spec/custom/) and
[the Shadow DOM](https://w3c.github.io/webcomponents/spec/shadow/) standards.
It is capable of operating without the Shadow DOM &mdash; it just means you
don't get any encapsulation of your component's HTML or styles. It also means
that it's up to you to provide a way to project content (i.e. `<slot>`). It's
highly recommended you use Shadow DOM whenever possible.

Though most modern browsers support these standards, some still need polyfills
to implement missing or inconsistent behaviours for them.

For more information on the polyfills, see
[the web components polyfill documentation](https://github.com/webcomponents/webcomponentsjs), emphasis on the caveats.

## Browser Support

Skate supports all evergreens and IE11, and is subject to the browser support
matrix of the polyfills.

## Backers

Support us with a monthly donation and help us continue our activities.
[Become a backer](https://opencollective.com/skatejs#backer)!

[![](https://opencollective.com/skatejs/backer/0/avatar.svg)](https://opencollective.com/skatejs/backer/0/website)
[![](https://opencollective.com/skatejs/backer/1/avatar.svg)](https://opencollective.com/skatejs/backer/1/website)
[![](https://opencollective.com/skatejs/backer/2/avatar.svg)](https://opencollective.com/skatejs/backer/2/website)
[![](https://opencollective.com/skatejs/backer/3/avatar.svg)](https://opencollective.com/skatejs/backer/3/website)
[![](https://opencollective.com/skatejs/backer/4/avatar.svg)](https://opencollective.com/skatejs/backer/4/website)
[![](https://opencollective.com/skatejs/backer/5/avatar.svg)](https://opencollective.com/skatejs/backer/5/website)
[![](https://opencollective.com/skatejs/backer/6/avatar.svg)](https://opencollective.com/skatejs/backer/6/website)
[![](https://opencollective.com/skatejs/backer/7/avatar.svg)](https://opencollective.com/skatejs/backer/7/website)
[![](https://opencollective.com/skatejs/backer/8/avatar.svg)](https://opencollective.com/skatejs/backer/8/website)
[![](https://opencollective.com/skatejs/backer/9/avatar.svg)](https://opencollective.com/skatejs/backer/9/website)
[![](https://opencollective.com/skatejs/backer/10/avatar.svg)](https://opencollective.com/skatejs/backer/10/website)
[![](https://opencollective.com/skatejs/backer/11/avatar.svg)](https://opencollective.com/skatejs/backer/11/website)
[![](https://opencollective.com/skatejs/backer/12/avatar.svg)](https://opencollective.com/skatejs/backer/12/website)
[![](https://opencollective.com/skatejs/backer/13/avatar.svg)](https://opencollective.com/skatejs/backer/13/website)
[![](https://opencollective.com/skatejs/backer/14/avatar.svg)](https://opencollective.com/skatejs/backer/14/website)
[![](https://opencollective.com/skatejs/backer/15/avatar.svg)](https://opencollective.com/skatejs/backer/15/website)
[![](https://opencollective.com/skatejs/backer/16/avatar.svg)](https://opencollective.com/skatejs/backer/16/website)
[![](https://opencollective.com/skatejs/backer/17/avatar.svg)](https://opencollective.com/skatejs/backer/17/website)
[![](https://opencollective.com/skatejs/backer/18/avatar.svg)](https://opencollective.com/skatejs/backer/18/website)
[![](https://opencollective.com/skatejs/backer/19/avatar.svg)](https://opencollective.com/skatejs/backer/19/website)

## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your
site. [Become a sponsor](https://opencollective.com/skatejs#sponsor)!

[![](https://opencollective.com/skatejs/sponsor/0/avatar.svg)](https://opencollective.com/skatejs/sponsor/0/website)
[![](https://opencollective.com/skatejs/sponsor/1/avatar.svg)](https://opencollective.com/skatejs/sponsor/1/website)
[![](https://opencollective.com/skatejs/sponsor/2/avatar.svg)](https://opencollective.com/skatejs/sponsor/2/website)
[![](https://opencollective.com/skatejs/sponsor/3/avatar.svg)](https://opencollective.com/skatejs/sponsor/3/website)
[![](https://opencollective.com/skatejs/sponsor/4/avatar.svg)](https://opencollective.com/skatejs/sponsor/4/website)
[![](https://opencollective.com/skatejs/sponsor/5/avatar.svg)](https://opencollective.com/skatejs/sponsor/5/website)
[![](https://opencollective.com/skatejs/sponsor/6/avatar.svg)](https://opencollective.com/skatejs/sponsor/6/website)
[![](https://opencollective.com/skatejs/sponsor/7/avatar.svg)](https://opencollective.com/skatejs/sponsor/7/website)
[![](https://opencollective.com/skatejs/sponsor/8/avatar.svg)](https://opencollective.com/skatejs/sponsor/8/website)
[![](https://opencollective.com/skatejs/sponsor/9/avatar.svg)](https://opencollective.com/skatejs/sponsor/9/website)
[![](https://opencollective.com/skatejs/sponsor/10/avatar.svg)](https://opencollective.com/skatejs/sponsor/10/website)
[![](https://opencollective.com/skatejs/sponsor/11/avatar.svg)](https://opencollective.com/skatejs/sponsor/11/website)
[![](https://opencollective.com/skatejs/sponsor/12/avatar.svg)](https://opencollective.com/skatejs/sponsor/12/website)
[![](https://opencollective.com/skatejs/sponsor/13/avatar.svg)](https://opencollective.com/skatejs/sponsor/13/website)
[![](https://opencollective.com/skatejs/sponsor/14/avatar.svg)](https://opencollective.com/skatejs/sponsor/14/website)
[![](https://opencollective.com/skatejs/sponsor/15/avatar.svg)](https://opencollective.com/skatejs/sponsor/15/website)
[![](https://opencollective.com/skatejs/sponsor/16/avatar.svg)](https://opencollective.com/skatejs/sponsor/16/website)
[![](https://opencollective.com/skatejs/sponsor/17/avatar.svg)](https://opencollective.com/skatejs/sponsor/17/website)
[![](https://opencollective.com/skatejs/sponsor/18/avatar.svg)](https://opencollective.com/skatejs/sponsor/18/website)
[![](https://opencollective.com/skatejs/sponsor/19/avatar.svg)](https://opencollective.com/skatejs/sponsor/19/website)
