# Skate

[![Build Status](https://travis-ci.org/skatejs/skatejs.svg?branch=master)](https://travis-ci.org/skatejs/skatejs)
[![Downloads per month](https://img.shields.io/npm/dm/skatejs.svg)](https://www.npmjs.com/package/skatejs)
[![Join the chat at https://gitter.im/skatejs/skatejs](https://badges.gitter.im/skatejs/skatejs.svg)](https://gitter.im/skatejs/skatejs)
[![Follow @skate_js on Twitter](https://img.shields.io/twitter/follow/skate_js.svg?style=social&label=@skate_js)](https://twitter.com/skate_js)

Skate is a functional abstraction over
[the web component standards](https://github.com/w3c/webcomponents) as a set of
packages that enables you to write small, fast and scalable web components using
popular view libraries such as React, Preact and LitHTML.

- 🌏 Cross-framework compatible components.
- ⚛️ Render components using your favourite view libary, or none at all.
- 👑 Streamlined reaction to attributes, properties and events.
- 🔌 Plug in _any_ view framework.
- 🖥 Server-side rendering support for certain frameworks.
- 🌟 TypeScript!
- 📚 Docs [https://skatejs.netlify.com](https://skatejs.netlify.com).

## Getting started

The simplest way to get up and running is to start with a base class such as
[@skatejs/element-react]([https://skatejs.netlify.com/packages/element-react).
These element base classes are pre-configured to work with existing, popular
view libaries:

- [@skatejs/element-hyperhtml]([https://skatejs.netlify.com/packages/element-hyperhtml)
- [@skatejs/element-lit-html]([https://skatejs.netlify.com/packages/element-lit-html)
- [@skatejs/element-preact]([https://skatejs.netlify.com/packages/element-preact)
- [@skatejs/element-react]([https://skatejs.netlify.com/packages/element-react)

Leveraging the plethora of frameworks that already exists allows us to focus on
a common web component abstraction around each of them.

Additionally, the following view libraries support server-side rendering:

- [@skatejs/element-react]([https://skatejs.netlify.com/packages/element-react)
- @skatejs/element-preact - coming soon!

### Installing

You'll need to install the base class and its corresponding view framework. To
write web components using React, you'd install:

```sh
npm i @skatejs/element-react react react-dom
```

_You need both React and ReactDOM because you may already be using it, so its
best for Skate to make this a peer dependency and not install its own version._

### Simple example

The following example is how you'd create a simple "hello world" example using
the React element.

```js
// @jsx h

import Element, { g } from "@skatejs/element-react";

export default class extends Element {
  render() {
    return (
      <span>
        Hello, <slot />!
      </span>
    );
  }
}
```

The resulting element can be used anywhere as a standard HTMLElement by first
defining it:

```js
import Hello from "./hello";

customElements.define("x-hello", Hello);
```

And then using it:

```html
<x-hello>World</x-hello>
```

Or you could use it in React like so:

```js
import { h } from "@skatejs/element-react";
import Hello from "./hello";

<Hello>World</Hello>;
```

_It's important to use the `h` export from `@skatejs/element-react` because it
wraps `React.createElement` to support things like custom element constructors
as tag names and Shadow DOM simulation when server-side rendering._

Since the React element supports server-side rendering, all you need to do is
just call `renderToString()` on it if you need SSR.

```js
import { h } from "@skatejs/element-react";
import { renderToString } from "react-dom/server";
import Hello from "./hello";

// The resulting HTML would look something like:
//
// <x-hello>
//   <span>
//     Hello, <slot>World</slot>!
//   </span>
// </x-hello>
renderToString(<Hello>World</Hello>);
```

This output is friendly to bots because there are no shadow roots present. It's
simulating the content projection offered by shadow roots and slots. To get
simulated CSS scoping, you could use something like `@skatejs/shadow-css`.

Rehydration is just as simple.

```js
import { h } from "@skatejs/element-react";
import { hydrate } from "react-dom";
import Hello from "./hello";

// Dev tools would show something like:
//
// <x-hello>
//   # shadow-root
//     <span>Hello, <slot />!</span>
//   World
// </x-hello>
hydrate(<Hello>World</Hello>, window.app);
```

For more information on @skatejs/element-react, see its
[documentation]([https://skatejs.netlify.com/packages/element-react).

### Other examples

1. [Todo list](https://codesandbox.io/s/8zjp9qqj9l)

### Cli

If you want to get up and running super quickly then
[@skatejs/cli](https://skatejs.netlify.com/packages/cli) can help you!

```sh
$ npx @skatejs/cli -h

  Description
    CLI tool for generating SkateJS projects.

  Usage
    $ @skatejs/cli <command> [options]

  Available Commands
    default    Generates an example SkateJS element.
    package    Generates a SkateJS monorepo package.

  For more info, run any command with the `--help` flag
    $ @skatejs/cli default --help
    $ @skatejs/cli package --help

  Options
    -d, --dry        Perform a dry run.
    -v, --version    Displays current version
    -h, --help       Displays this message

```

## Polyfills

Skate builds upon the
[Custom Elements](https://w3c.github.io/webcomponents/spec/custom/) and
[Shadow DOM](https://w3c.github.io/webcomponents/spec/shadow/) standards. It is
capable of operating without the Shadow DOM &mdash; it just means you don't get
any encapsulation of your component's HTML or styles. It also means that it's up
to you to provide a way to project content (i.e. `<slot>`). It's highly
recommended you use Shadow DOM whenever possible.

Though most modern browsers support these standards, if you're still targetting
IE11 then you'll need to include at least the Custom Element polyfill (and shim,
if you're transpiling to ES5). You'll also need the Shadow DOM polyfill if you
want encapsulation.

For more information on the polyfills, see
[the web components polyfill documentation](https://github.com/webcomponents/webcomponentsjs),
emphasis on the caveats.

## Browser Support

Skate supports all evergreens and IE11, and is subject to the browser support
matrix of the polyfills.
