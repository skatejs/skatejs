# sk-router

> A web component router that's compatible with code-splitting out of the box.

## Install

```sh
npm install @skatejs/sk-router
```

## Usage

In these examples we've used the hyperscript `h` export in
[@skatejs/val](https://github.com/skatejs/val) to create _real_ DOM using JSX so
that we can express them in a readable manner while still setting complex data
types **_(which you cannot do with HTML)_**.

```js
/** @jsx h */

import { Route, Router } from '@skatejs/sk-router';
import { h } from '@skatejs/val';
import { Index, NotFound } from './pages';

const router = (
  <Router>
    <Route page={Index} path="/" />
    <Route page={NotFound} path="*" />
  </Router>
);
```

The `page` prop on the `Route` component is just a function that returns a DOM
node. This means that it can be:

* A custom element constructor.
* A function that mounts a React DOM tree to a node and returns the node.
* A function that does anything, so long as it returns a normal DOM node.

### Optimisation / code-splitting

The example above loads everything up front. However, in a large app, you'd
probably want to split up your pages into separate resources. Webpack can easily
do this for you using `import()`. All you need to do to enable this is to:

1. Use a function as your component instead of a constructor.
2. Call `import()` in the function.
3. Ensure the module you import contains a default export that can be anything
   that `page` takes, as mentioned above.

```js
const lazyRoute = <Route page={() => import('./pages/docs')} path="/docs" />;
```

### Links

We use PageJS underneath the hood, but we also export a `Link` component so that
it doesn't have to capture all anchor clicks on the page, which could cause some
confusion.

```js
import { Link } from '@skatejs/sk-router';

const indexLink = <Link href="/">Home</Link>;
```
