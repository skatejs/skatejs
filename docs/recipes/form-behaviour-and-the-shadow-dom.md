# Form Behaviour and the Shadow DOM



## Submission

When you encapsulate a form, button or both inside a shadow root, forms will *not* be submitted when the submit button is clicked. This is because the shadow boundary prevents each shadow root from communicating with each other. Fortunately this isn't very difficult to wire up.

Let's say we have a custom form and custom button (to reproduce, only one of them would need to be contained in a shadow root):

```js
<x-form>
  <x-button type="submit">Submit</x-button>
</x-form>
```

The definitions look like the following:

```js
customElements.define('x-form', class extends skate.Component {
  renderCallback () {
    return (
      <form>
        <slot />
      </form>
    );
  }
});

customElements.define('x-button', class extends skate.Component {
  renderCallback () {
    return (
      <button>
        <slot />
      </button>
    );
  }
});
```

To wire this up we listen for clicks coming from something that has a `type` of `"submit"`. You can also check for type, but for the sake of simplicity, we'll just check for `type`:

```js
function onClick (e) {
  if (e.target.getAttribute('type') === 'submit') {
    // do something submitty
  }
}
```

Now all you need to do is put that on the `<form>` inside of `<x-form>`:

```js
<form { onClick }>
```

You cane take this a step further and emit a `submit` event on the form and call `submit()` on it if the event wasn't canceled:

```js
function onClick (e) {
  if (e.target.getAttribute('type') === 'submit') {
    if (skate.emit(e.currentTarget, 'submit')) {
      e.currentTarget.submit();
    }
  }
}
```

The full example looks like:

```js
function onClick (e) {
  if (e.target.getAttribute('type') === 'submit') {
    if (skate.emit(e.currentTarget, 'submit')) {
      e.currentTarget.submit();
    }
  }
}

customElements.define('x-form', class extends skate.Component {
  renderCallback () {
    return (
      <form { onClick }>
        <slot />
      </form>
    );
  }
});

customElements.define('x-button', class extends skate.Component {
  renderCallback () {
    return (
      <button>
        <slot />
      </button>
    );
  }
});
```



## Form Data

The idea that built-in form elements don't publish their form-data when inside a shadow root is [being discussed](https://github.com/w3c/webcomponents/issues/187).

In order to handle this, your custom form would need to gather all the form data associated with it and submit it along with its request.
