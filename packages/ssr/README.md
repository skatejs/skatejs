# Web component server-side rendering and testing

[![Build Status](https://travis-ci.org/skatejs/ssr.svg?branch=master)](https://travis-ci.org/skatejs/ssr)

This repo contains all you need to server-side render your web components and
run their tests in a node environment.

* Uses [`undom`](https://github.com/developit/undom) for a minimal DOM API in
  Node.
* Great for rendering out static sites from components.
* Run your tests in Jest!
* Statically generate JS files to HTML files.

## Installing

```
npm install @skatejs/ssr
```

## Usage

_This example is using vanilla custom elements and shadow DOM in order to show
that it can work with any web component library._

On the server (`example.js`):

```js
require('@skatejs/ssr/register');
const render = require('@skatejs/ssr');

class Hello extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML =
      '<span>Hello, <x-yell><slot></slot></x-yell>!</span>';
  }
}
class Yell extends HTMLElement {
  connectedCallback() {
    Promise.resolve().then(() => {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = '<strong><slot></slot></strong>';
    });
  }
}
customElements.define('x-hello', Hello);
customElements.define('x-yell', Yell);

const hello = new Hello();
hello.textContent = 'World';

render(hello).then(console.log);
```

And then just `node` your server code:

```
$ node example.js
<script>function __ssr(){var a=document.currentScript.previousElementSibling,b=a.firstElementChild;a.removeChild(b);for(var c=a.attachShadow({mode:"open"});b.hasChildNodes();)c.appendChild(b.firstChild);}</script><x-hello><shadow-root><span>Hello, <x-yell><shadow-root><strong><slot></slot></strong></shadow-root><slot></slot></x-yell><script>__ssr()</script>!</span></shadow-root>World</x-hello><script>__ssr()</script>
```

On the client, just inline your server-rendered string:

```html
<script>function __ssr(){var a=document.currentScript.previousElementSibling,b=a.firstElementChild;a.removeChild(b);for(var c=a.attachShadow({mode:"open"});b.hasChildNodes();)c.appendChild(b.firstChild);}</script><x-hello><shadow-root><span>Hello, <x-yell><shadow-root><strong><slot></slot></strong></shadow-root><slot></slot></x-yell><script>__ssr()</script>!</span></shadow-root>World</x-hello><script>__ssr()</script>
```

[See it in action!](http://jsbin.com/cilocowozu/2/edit?html,output)

## API

The only function this library exposes is `render()`. The first argument is the
DOM tree you want to render. It can be a `document` node or any HTML node. The
second argument are the options to customise rendering. These options are:

* `debug` - Whether or not to pretty print the HTML result. Defaults to `false`.
* `rehydrate` - Whether or not to add the inline rehydration scripts. Defaults
  to `true`.
* `resolver` - The function to call that will resolve the promise. Defaults to
  `setTimeout`.

## Running in Node

If you want to run your code in Node, just require the registered environment
before doing anything DOMish.

```js
// index.js
require('@skatejs/ssr/register');

// DOM stuff...
```

## Running in Jest

If you want to run your tests in Jest, all you have to do is configure Jest to
use the environment we've provided for it.

```js
// package.json
{
  "jest": {
    "testEnvironment": "@skatejs/ssr/jest"
  }
}
```

## Static-site generation

This package ships with a command that you can use to statically generate a site
from JS files.

* It uses babel-register to parse your JS files.
* Each JS file must have a default export that is a custom element.

```sh
ssr --out public --src path/to/site/**/*.js
```

Options are:

* `--babel` - Path to custom babel config. Uses `require()` to load relative to
  `process.cwd()`. Defaults to `.babelrc` / `package.json` field.
* `--debug` - Whether or not to pretty print the HTML result. Defaults to
  `false`.
* `--out` - The directory to place the statically rendered files.
* `--props` - A JSON object of custom props to assign to the custom elements
  before they're rendered.
* `--rehydrate` - Whether or not to add rehydration scripts. Defaults to `true`.
* `--src` - A glob for the source files to statically render to `--out`.
* `--suffix` - The suffix to put on the output files. Defaults to `html`;

### Watching files and generating them in dev mode

You can use something like `nodemon` to watch for updates and then regenerate
your site:

```sh
nodemon --exec "ssr --out public --src path/to/site/**/*.js" --watch path/to/site
```

## Running with other Node / DOM implementations

There's other implementations out there such as
[Domino](https://github.com/fgnass/domino) and
[JSDOM](https://github.com/tmpvar/jsdom). They don't yet have support for custom
elements or shadow DOM, but if they did, then you would use this library in the
same way, just without requiring `@skatejs/ssr/register`. With some
implementations that don't yet support web components, requiring
`@skatejs/ssr/register` may work, but your mileage may vary. Currently only
Undom is officially supported.

## The future

The definition of success for this library is if it can be made mostly
redundant. Things like a DOM implementation in Node (JSDOM / UnDOM, etc) are
still necessary. The static-site generation will probably still be a thing.
However, we hope that the serialisation and rehydration of Shadow DOM can be
spec'd - in some way - and a standardised API for doing so makes it's way to the
platform.

Serialisation may still be done in a Node DOM implementation, but it'd be great
to see it standardised beacuse it is tightly coupled to the rehydration step on
the client. This also helps to ensure that if an imperative distrubution API
ever makes its way into the spec, that both serialisation and rehydration may be
accounted for.

## Notes

There's some notes and limitations that you should be aware of.

### Scoped styles

Scoped styles are emulated by scoping class names only. This means you are
limited to using only class names within your shadow root `<style />` tags:

```html
<style>
  .some-class {}
</style>
```

It will make that class name unique and scope it to the shadow roots that use
it.

Support for both `:host` and `:slotted` still need to be implemented.

Style tags are also deduped. This means that if you use a `<style />` element
that has the same content in several places, it will only be added to the head
once. If you enable rehydration, it will pull from that script tag directly when
attaching a shadow root.

### DOM API limitations

You're limited to the subset of DOM methods available through Undom, plus what
we add on top of it (which is quite a bit at the moment). Undom works well with
Preact and SkateJS due to their mininmal overhead and limited native DOM
interface usage.

There's currently [some work](https://github.com/tmpvar/jsdom/pull/1872)
happening to get custom element and shadow DOM support in JSDOM. Once that
lands, we'll have broader API support and we can start thikning about focusing
this API on just serialisation and rehydration.

### Misc

* Performance benchmarks focus on comparing a baseline to different methods of
  rehydration. Thanks to @robdodson for sharing some code that helped me flesh
  these out. Spin up a static server and load them up for more details.
* Inline `<script>` tags use relative DOM accessors like
  `document.currentScript`, `previousElementSibling` and `firstElementChild`.
  Any HTML post-processing could affect the mileage of it, so beware.
* Inline `<script>` method is currently the fastest overall method of
  rehydration. This has been discussed
  [elsewhere](https://discourse.wicg.io/t/declarative-shadow-dom/1904/8) but the
  difference between methods seemed more pronounced, possibly because things
  were deduped in a single `<template>` which isn't really possible because most
  components will be rendered in a different state. Also, cralers don't read
  content in `<template>` elements, so we need to store it in non-inert blocks.
* Using a custom `<shadow-root>` element seems acceptable for performance,
  however there's some problems with delivering it:
  * Do we ship an ES5 or ES6 component? ES5 requires transpilation and shims.
    ES6 excludes older browsers.
  * We could make the consumer ship the element themselves and provide helpers
    they call out to, but that's more friction.
  * This is probably a better method once we can assume custom elements / ES2015
    support in all targeted browsers.
* Shadow root content, prior to being hydrated, is _not_ inert so that it can be
  found by `querySelector` and crawlers. Putting it inside of a `<template>` tag
  means that it's not participating in the document and the aforementioned
  wouldn't work, thus negating the benefits of SSR altogether.
* Using invalid HTML, such as putting a `<div />` in a `<p />` tag could result
  in broken rehydration because the browser may try and "fix" the incorrect
  line, thus making things out of sync with what the rehydration script expects.
