## API

Each API point is accessible on the main `skate` object:

```js
const { define, vdom } = skate;
```

Or can be imported by name in ES2015:

```js
import { define, vdom } from 'skatejs';
```



### Using the Platform

Skate focuses on staying as close to the platform as possible. This means that instead of having to use `skate.define()` you can just use `customElements.define()`, which is built-in. You can still use `skate.define()`, but it's opt-in, and only serves to enhance what the browser already gives you.

The lifecycle methods in Skate also use the `*Callback` naming convention. For example, the `render` lifecycle is represented by the `renderCallback()` on the custom element `prototype`. Things like `props` follow the convention of `observedAttributes` and are provided as static getters.

If you're using IE9 and 10, transpiling class extension is limited to instance methods and properties. Statics don't get added to the chain. However, Skate supports calling `extend()` on a component which you want to extend. This means that in older browsers, you can do something like:

```js
const MyComponent1 = skate.Component.extend();
const MyComponent2 = MyComponent1.extend();
```

Recently, we've deprecated several old methods in favour of aligning closer to the native APIs. These methods still work but will be removed in a future version. Not all methods / properties are listed here, only the ones that have been deprecated and what they're superseded by.

- `static created()` -> `constructor()`
- `static attached()` -> `connectedCallback()`
- `static detached()` -> `disconnectedCallback()`
- `static attributeChanged` -> `attributeChangedCallback()`
- `static updated()` -> `updatedCallback()`
- `static render()` -> `renderCallback()`
- `static rendered()` -> `renderedCallback()`

Most of the old API were static methods, or specified as options not on the `prototype`. The new APIs are mostly specified on the custom element's `prototype` unless it makes sense to be a `static`, such as `props` as they loosely correspond to `observedAttributes`.
