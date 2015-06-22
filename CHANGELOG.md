# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Added

- #162 - Extending components.
- #173 - The presence of the `resolved` attribute skips the `template` callback.
- #177 - `skate.create()` as an alternative to `document.createElement()`.
- #178 - `events` now support an array of handlers.
- #187 - `attribute` handlers are now synchronous.
- #200 - Support for a `properties` definition that defines instance properties and their behaviour.
- #206 - Element constructors can be called like a function, or instantiated like a constructor.

### Changed

- #205 - Lifecycle callbacks now use `this`.
- #208 - `attributes` are no longer granular and is now closer to the spec.
- #209 - Renamed `attributes` to `attribute` because now it's just a single callback.
- #210 - Renamed `lib/skate.js` and `src/skate.js` to `lib/index.js` and `src/index.js`.

### Fixed

- #141 - Lifecycle callbacks called separately. First `created` is called on all elements then `attached` is called on all elements. Before, `created` and `attached` would be invoked on an element before moving on to the next.
- #174 - Polyfilled custom element prototype members not inherited

### Removed

- #184 - The `skate.defaults` property is no longer public and has been removed. No alternative will be provided.
- #187 - Modifying `element.attributes` directly no longer triggers the `attribute` callback.

### Upgrading

#### #205 - Lifecycle callbacks now use `this`

The following callbacks now use `this` to refer to the element instead of it being passed as the first argument:

- `created`
- `attached`
- `detached`
- `attribute`
- `events`
- `template`

For example, this:

```js
created (element) {
  element.textContent = 'Hello, World!';
}
```

Is now this:

```js
created () {
  this.textContent = 'Hello, World!';
}
```

####  #208 - `attributes` are no longer granular and is now closer to the spec

- You may now only specify a callback as the `attribute` option.
- The signature of the callback matches the web component spec.
  - Use `this` to refer to the element.
  - Arguments are: `name`, `oldValue` and `newValue` in that order.

Previous:

```js
attributes: {
  myAttribute1 (element, changes) {},
  myAttribute2: {
    value: 'initial value'
  },
  myAttribute3: {
    value () {
      return 'initial value';
    }
  },
  myAttribute4: {
    created (element, changes) {},
    updated (element, changes) {},
    removed (element, changes) {},
  }
}
```

Current:

```js
attribute (name, oldValue, newValue) {

}
```

To translate the above variations to the new `properties` option, you would do the following:

```js
properties: {
  myAttribute1: {
    attr: true,
    set (newValue, oldValue) {

    }
  },
  myAttribute2: {
    attr: true,
    value: 'initial value',
    set (newValue, oldValue) {

    }
  },
  myAttribute3: {
    attr: true,
    value () {
      return 'initial value';
    }
  },
  myAttribute4: {
    attr: true,
    set (newValue, oldValue) {
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

#### #209 - Renamed `attributes` to `attribute` because now it's just a single callback

Wherever you're specifying the `attributes` option, just rename it to `attribute` (singular).

#### #210 - Renamed `lib/skate.js` and `src/skate.js` to `lib/index.js` and `src/index.js`.

If you're using the ES6 or UMD versions of Skate (`lib` and `src` folders), rename the reference to the `skate` file to `index`.
