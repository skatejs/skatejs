# `emit (elem, eventName, eventOptions = {})`

Emits an `Event` on `elem` that is `composed`, `bubbles` and is `cancelable` by default. It also ensures a 'CustomEvent' is emitted properly in browsers that don't support using `new CustomEvent()`. This is useful for use in components that are children of a parent component and need to communicate changes to the parent.

```js
customElements.define('x-tabs', class extends skate.Component {
  renderCallback () {
    return skate.h('x-tab', { onSelect: () => {} });
  }
});

customElements.define('x-tab', class extends skate.Component {
  renderCallback () {
    return skate.h('a', { onClick: () => skate.emit(this, 'select') });
  }
});
```

It's preferable not to reach up the DOM hierarchy because that couples your logic to a specific DOM structure that the child has no control over. To decouple this so that your child can be used anywhere, simply trigger an event.

The return value of `emit()` is the same as [`dispatchEvent()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent).



## Preventing Bubbling or Canceling

If you don't want the event to bubble, or you don't want it to be cancelable, then you can specify the standard event options in the `eventOptions` argument.

```js
skate.emit(elem, 'event', {
  composed: false,
  bubbles: false,
  cancelable: false
});
```



## Passing Data

You can pass data when emitting the event with the `detail` option in the `eventOptions` argument.

```js
skate.emit(elem, 'event', {
  detail: {
    data: 'my-data'
  }
});
```
