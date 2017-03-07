# `emit (elem, name, opts = {})`

Emits an [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event) on `elem` (or `CustomEvent` if `Event` isn't supported). The `detail` option - normally used with `CustomEvent` - is normalised to also work with `Event`.

Events are the proper way to communicate changes up in the DOM tree as this decouples your logic from your DOM structure.

```js
/** @jsx h */

import { Component, emit, h } from 'skatejs';

customElements.define('x-tabs', class extends Component {
  renderCallback () {
    return <x-tab onSelect={() => {}}>clici me</x-tab>;
  }
});

customElements.define('x-tab', class extends skate.Component {
  renderCallback () {
    return <a onClick={() => emit(this, 'select')}><slot /></a>;
  }
});
```

The return value of `emit()` is the same as [`dispatchEvent()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent).

The default option values are:

- `bubbles: true`
- `cancelable: true`
- `composed: false`


## Passing data

You can pass data when emitting the event with the `detail` option in the `opts` argument.

```js
emit(elem, 'event', {
  detail: 'some data'
});
```


## Preventing bubbling / canceling

If you want to override the default options that Skate specifies to `dispatchEvent()`, you can pass them as the `opts` argument.

```js
emit(elem, 'event', {
  bubbles: false,
  cancelable: false,
  composed: true
});
```

## Bubbling through shadow boundaries

By default, events do not bubble past shadow roots. To enable bubbling past the shadow boundary, set the `composed` option to `true`.
