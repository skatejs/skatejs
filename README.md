# Skate

[![NPM version](https://img.shields.io/npm/v/skatejs.svg)](https://www.npmjs.com/package/skatejs)
[![Build Status](https://travis-ci.org/skatejs/skatejs.svg?branch=master)](https://travis-ci.org/skatejs/skatejs)
[![Downloads per month](https://img.shields.io/npm/dm/skatejs.svg)](https://www.npmjs.com/package/skatejs)
[![OpenCollective](https://opencollective.com/skatejs/backers/badge.svg)](#backers)
[![OpenCollective](https://opencollective.com/skatejs/sponsors/badge.svg)](#sponsors)
[![Join the chat at https://gitter.im/skatejs/skatejs](https://badges.gitter.im/skatejs/skatejs.svg)](https://gitter.im/skatejs/skatejs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Follow @skate_js on Twitter](https://img.shields.io/twitter/follow/skate_js.svg?style=social&label=@skate_js)](https://twitter.com/skate_js)

Skate is a functional abstraction over
[the web component standards](https://github.com/w3c/webcomponents) that:

* Produces cross-framework compatible components.
* Abstracts away common attribute / property semantics via `props`, such as
  attribute reflection and coercion.
* Adds several lifecycle callbacks for responding to prop updates, rendering and
  updating, as well as a way to manage internal component state.
* Provides a base set of
  [mixins](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)
  that hook into renderers such as
  [@skatejs/renderer-preact](https://github.com/skatejs/skatejs/tree/master/packages/renderer-preact).

## Installing

Skate is on NPM:

```sh
npm install skatejs
```

The core principle of Skate is to provide abstractions for writing custom
elements based on best-practices; things that aren't controversial. However,
templating can be highly contentious. For this reason, Skate provides a hook to
inject renderers for any view library. For example, if you wanted to write your
custom elements with Preact, you'd install it like so:

```sh
npm install skatejs @skatejs/renderer-preact preact
```

There are renderers for many popular view libraries:

* [LitHTML](https://skatejs.netlify.com/renderers/with-lit-html)
* [Preact](https://skatejs.netlify.com/renderers/with-preact)
* [React](https://skatejs.netlify.com/renderers/with-react)
* Or a [custom renderer](https://skatejs.netlify.com/renderers)!

## Usage

This is how you might write a web component usinge Skate and Preact:

```js
// @jsx h

import { props, withComponent } from 'skatejs';
import withPreact from '@skatejs/renderer-preact';
import { h } from 'preact';

class WithPreact extends withComponent(withPreact()) {
  static props = {
    name: props.string
  };
  render({ name }) {
    return <span>Hello, {name}!</span>;
  }
}

customElements.define('with-preact', WithPreact);
```

## Getting started

To get up and running with Skate, head over to the
[getting started guide](https://skatejs.netlify.com/guides/getting-started).

## Polyfills

Skate builds upon the
[Custom Elements](https://w3c.github.io/webcomponents/spec/custom/) and
[the Shadow DOM](https://w3c.github.io/webcomponents/spec/shadow/) standards.
Skate is capable of operating without the Shadow DOM &mdash; it just means you
don't get any encapsulation of your component's HTML or styles. It also means
that it's up to you to provide a way to project content (i.e. `<slot>`). It's
highly recommended you use Shadow DOM whenever possible.

Though most modern browsers support these standards, some still need polyfills
to implement missing or inconsistent behaviours for them.

For more information on the polyfills, see
[the web components polyfill documentation](https://github.com/webcomponents/webcomponentsjs).

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
