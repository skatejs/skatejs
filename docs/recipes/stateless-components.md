# Stateless Components

If you write a component that manages its props internally, this is called a "smart component"; very much the same as in React. There's many ways you can write components and separate them out in to smart / dumb components. You can then compose the dumb one in the smart one, reusing code while separating concerns.

However, there is one way where you can write a smart component and it can be made "dumb" as part of its API by emitting an event that allows any listeners to optionally prevent it from updating, or to simply update it with new props that it should render with.

```js
customElements.define('x-component', class extends skate.Component {
  updatedCallback (prev) {
    // Notify any listeners that the component updated. At this point the
    // listener can update the component's props without fear that this will
    // cause recursion - because it's prevented internally - and it will
    // proceed past this point with the updated props.
    const canRender = skate.emit(this, 'updated', { detail: prev });

    // This can be custom, or just reuse the default implementation. Since we
    // emitted the event and listeners had a chance to update the component,
    // this will get called with the updated state.
    return canRender && super.updatedCallback(prev);
  }
});
```

The previous example emits an event that bubbles and is cancelable. If it is canceled, then the component does not render. If the listening component updates the component's props in response to the event, the component will render with the updated props if it passes the default `updatedCallback()` check.
