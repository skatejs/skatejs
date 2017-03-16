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

Skate focuses on staying as close to the platform as possible. This means that instead of having to use `define()` you can just use `customElements.define()`, which is built-in. You can still use `define()`, but it's opt-in, and only serves to enhance what the platform already gives you.

The lifecycle methods in Skate use the `*Callback` naming convention to stay inline with the platform. For example, the `render` lifecycle is represented by the `renderCallback()` on the custom element `prototype`. Things like `props` follow the convention of `observedAttributes` and are provided as static getters.

## Methods and Properties

The following members are all importable by name.

- [Component](./Component.html)
- [define](./define.html)
- [emit](./emit.html)
- [link](./link.html)
- [withComponent](./with-component.html)
  - [h](./h.html)
- [withProps](./with-component.html)
  - [getProps](./get-props.html)
  - [setProps](./set-props.html)
  - [propArray]('./prop-array.html)
  - [propBoolean]('./prop-boolean.html)
  - [propNumber]('./prop-number.html)
  - [propObject]('./prop-object.html)
  - [propString]('./prop-string.html)
- [withRender](./with-component.html)

*Every member is provided as a top-level export, they're just organised under parent export to show what part of the API they are provided by.*
