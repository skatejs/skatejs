# Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Added

- [#162](https://github.com/skatejs/skatejs/issues/162) - Extending components.
- [#173](https://github.com/skatejs/skatejs/issues/173) - The presence of the `resolved` attribute skips the `template` callback.
- [#177](https://github.com/skatejs/skatejs/issues/177) - `skate.create()` as an alternative to `document.createElement()` and `skate.init()`.
- [#187](https://github.com/skatejs/skatejs/issues/187) - `attribute` handlers are now synchronous.
- [#200](https://github.com/skatejs/skatejs/issues/200) - Support for a `properties` definition that defines instance properties and their behaviour.
- [#206](https://github.com/skatejs/skatejs/issues/206) - Element constructors can be called like a function, or instantiated like a constructor.
- [#270](https://github.com/skatejs/skatejs/issues/270) - Retain existing property value if a defined property overrides it.
- [#275](https://github.com/skatejs/skatejs/issues/275) - Allow an object of properties to be passed to element constructors / functions and `skate.create()`.
- [#276](https://github.com/skatejs/skatejs/issues/276) - `skate.emit()` triggers events and simulates bubbling for detached elements in browsers that don't support it.

### Changed

- [#200](#user-content-200) - The attribute lifecycle callbacks have been implemented in a different API under `properties`.
- [#204](#user-content-204) - Event handlers now pass the element as `this` and if using event delegation, put the delegate target as the `delegateTarget` property on the event object instead of passing it as the third argument.
- [#205](#user-content-205) - Lifecycle callbacks now use `this`.
- [#208](#user-content-208) - `attributes` are no longer granular and is now closer to the spec.
- [#209](#user-content-209) - Renamed `attributes` to `attribute` because now it's just a single callback.
- [#210](#user-content-210) - Renamed `lib/skate.js` and `src/skate.js` to `lib/index.js` and `src/index.js`.
- [#277](#user-content-277) - The `created()` callback is now fired after descendants have been upgraded.
- [#278](#user-content-278) - Event handlers queue up before the `created()` callback is fired and are processed after `created()` is called.
- [#279](#user-content-279) - Properties since being implemented were updated to be bound before `created()` and values initialised after `created()` (if not already set).
- [#295](#user-content-295) - Moved `MutationObserver` polyfill to https://github.com/skatejs/polyfill-mutation-observer.

### Fixed

- [#141](https://github.com/skatejs/skatejs/issues/141) - Lifecycle callbacks called separately. First `created` is called on all elements then `attached` is called on all elements. Before, `created` and `attached` would be invoked on an element before moving on to the next.
- [#174](https://github.com/skatejs/skatejs/issues/174) - Polyfilled custom element prototype members not inherited.
- [#292](https://github.com/skatejs/skatejs/pull/292) - Fix race condition with component initialisation.

### Removed

- [#184](https://github.com/skatejs/skatejs/issues/184) - The `skate.defaults` property is no longer public and has been removed. No alternative will be provided.
- [#187](https://github.com/skatejs/skatejs/issues/187) - Modifying `element.attributes` directly no longer triggers the `attribute` callback.
- [#289](https://github.com/skatejs/skatejs/issues/289) - the `skate` global is no longer set when importing `src/index.js`, and the `skate.noConflict()` method is not present when consuming skate in this way.

### Upgrading

#### [#200](https://github.com/skatejs/skatejs/issues/200)<a name="200"></a> - Attribute lifecycle moved into `properties`.

The old way of specifying behaviour within properties:

```js
attributes: {
  myAttribute1: function (element, changes) {},
  myAttribute2: {
    value: 'initial value'
  },
  myAttribute3: {
    value: function () {
      return 'initial value';
    }
  },
  myAttribute4: {
    created: function (element, changes) {},
    updated: function (element, changes) {},
    removed: function (element, changes) {},
  }
}
```

In the example above, each attribute would automatically create a property link. All behaviour would be handled by the attribute and there was no disctinction between a property value and an attribute value. This is a little backward, though, since not all API points need, or should, have linkage between properties and attributes. Now, everything gets defined as properties and has an option to be linked to an attribute. To translate the above variations to the new `properties` option, you would do the following:

```js
properties: {
  myAttribute1: {
    attr: true,
    set: function (newValue, oldValue) {

    }
  },
  myAttribute2: {
    attr: true,
    init: 'initial value',
    set: function (newValue, oldValue) {

    }
  },
  myAttribute3: {
    attr: true,
    value: function () {
      return 'initial value';
    }
  },
  myAttribute4: {
    attr: true,
    set: function (newValue, oldValue) {
      if (oldValue === null) {
        // created
      } else if (newValue === null) {
        // removed
      } else {
        // updated
      }
    }
  }
}
```

When `set` is called, `newValue` and `oldValue` have the same meaning as when used inside the `attribute` callback.

#### [#204](https://github.com/skatejs/skatejs/issues/204)<a name="204"></a> - Event handler using `this` and `e.delegateTarget`.

Before:

```js
events: {
  'click button': function (element, e, delegateTarget) {

  }
}
```

After:

```js
events: {
  'click button': function (e) {
    this;
    e.delegateTarget;
  }
}
```

#### [#205](https://github.com/skatejs/skatejs/issues/205)<a name="205"></a> - Lifecycle callbacks now use `this`

The following callbacks now use `this` to refer to the element instead of it being passed as the first argument:

- `created`
- `attached`
- `detached`
- `attribute`
- `events`
- `template`

For example, this:

```js
created: function (element) {
  element.textContent = 'Hello, World!';
}
```

Is now this:

```js
created: function () {
  this.textContent = 'Hello, World!';
}
```

For events, you use `this` inside the handler:

```js
events: {
  click: function () {
    this.clicked = true;
  }
}
```

#### [#208](https://github.com/skatejs/skatejs/issues/208)<a name="208"></a> - `attributes` are no longer granular and is now closer to the spec.

This callback has been simplified since in most cases the `properties` will be used for specifying side-effects.

- You may now only specify a callback as the `attribute` option.
- The signature of the callback matches the web component spec.
  - Use `this` to refer to the element.
  - Arguments are: `name`, `oldValue` and `newValue` in that order.

```js
attribute: function (name, oldValue, newValue) {
  this;
}
```

#### [#209](https://github.com/skatejs/skatejs/issues/209)<a name="209"></a> - Renamed `attributes` to `attribute` because now it's just a single callback

Wherever you're specifying the `attributes` option, just rename it to `attribute` (singular).

#### [#210](https://github.com/skatejs/skatejs/issues/210)<a name="210"></a> - Renamed `lib/skate.js` and `src/skate.js` to `lib/index.js` and `src/index.js`.

If you're using the ES6 or UMD versions of Skate (`lib` and `src` folders), rename the reference to the `skate` file to `index`.

#### [#277](https://github.com/skatejs/skatejs/issues/277)<a name="277"></a> - The `created()` callback is now fired after descendants have been upgraded

In native web components, the behaviour around when components are initialised are really inconsistent.

##### Definitions in `<head>` or at the top of `<body>` (before HTML content)

If you put your component definitions at the top of the page, they will be upgraded as they are encountered by the browser's rendering engine. Meaning no matter what order you specify your component definitions a parent component will be upgraded before its descendants. For example:

```html
<x-parent>
  <x-child>
    <x-descendant></x-descendant>
  </x-child>
</x-parent>
```

In the HTML example above, `x-parent` would be upgraded, then `x-child` and finally `x-descendant`. If `x-parent` or `x-child` need something from one of their descendants they're out of luck.

##### Definitions at the end of `<body>`

You get something completely different if you put your definitions at the bottom of the page. In that case, your components are initialised in the order which your definitions are registered. Meaning if you register them in this order:

1. `x-child`
2. `x-descendant`
3. `x-parent`

Then your elements will be upgraded in that order. This is very unpredictable.

##### Skate to the rescue

What Skate does is assume that you're properly declaring your dependencies. Meaning if `x-parent` needs `x-child` then it will somehow ensure `x-child` is registered before itself. This can easily be done with any module system (AMD, CommonJS, ES2015, etc.).

If you do this then no matter where you put your definitions Skate can descend into a DOM tree and ensure that descendants are initialised before parents. This means you can write predictable compound components without having to worry about browser semantics.

##### Discussed alternatives

We discussed having `created()` behave like native (all over the place) and having a `ready()` callback similar to Polymer's but thought it would be a bad idea to add yet more API when we could simply make `created()` behave sanely.

#### [#278](https://github.com/skatejs/skatejs/issues/278)<a name="278"></a> - Event handler binding and handling in relation to the `created()` callback



#### [#279](https://github.com/skatejs/skatejs/issues/279)<a name="279"></a> - Property binding and initialisation in relation to the `created()` callback



#### [#295](https://github.com/skatejs/skatejs/issues/295)<a name="295"></a> - Moved `MutationObserver` polyfill to https://github.com/skatejs/polyfill-mutation-observer

If you include SkateJS' `MutationObserver` polyfill on the page, Skate will automatically just pick it up. Since it's up to you to include your own `MutationObserver` polyfill, this means you can use whichever polyfill you want. That said, if you are concerned about performance in IE, it's recommended that you use ours as it's been specifically designed to be performant over other offerings.

Ensure you include the polyfill before any Skate definitions have been defined.
