# API

Each API point is accessible on the main `skate` object:

```js
const { Component, h } = skate;
```

Or can be imported by name in ES2015:

```js
import { Component, h } from 'skatejs';
```


## Using the Platform

Skate focuses on staying as close to the platform as possible. This means that instead of having to use `skate.define()` you can just use `customElements.define()`, which is built-in. You can still use `skate.define()`, but it's opt-in, and only serves to enhance what the platform already gives you.

The lifecycle methods in Skate use the `*Callback` naming convention to stay inline with the platform. For example, the `render` lifecycle is represented by the `renderCallback()` on the custom element `prototype`. Things like `props` follow the convention of `observedAttributes` and are provided as static getters.

The `static props` property is static because it's similar in nature to `static observedAttributes` and there's no need to make it an instance member as it's providing information about the class, not the instance.


## Methods and Properties

The following members are all importable by name:

- [Component](./Component.html)
- [define](./define.html)
- [emit](./emit.html)
- [h](./h.html)
- [link](./link.html)
- [Mixins](./Mixins.html)
- [prop](./prop.html)
- [props](./props.html)
