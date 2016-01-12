# Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## 0.15.3

### Fixed

- [#463](https://github.com/skatejs/skatejs/issues/463) - `skate.emit` events no longer fire on disabled elements.

## 0.15.2

### Fixed

- [#374](https://github.com/skatejs/skatejs/issues/374) - Fix innerHTML being empty in `skate.render.html()` when it's not overridden.

## 0.15.1

### Fixed

- [#114](https://github.com/skatejs/skatejs/issues/114) - TodoMVC style example. Documented in `README`.
- [#450](https://github.com/skatejs/skatejs/issues/450) - Missing default of `render`.

## 0.15.0

### Fixed

- [#445](https://github.com/skatejs/skatejs/issues/445) - Add a created callback to the property definition.

## 0.14.3

### Fixed

- [#441](https://github.com/skatejs/skatejs/issues/441) - Throw error if Mutation Observer is not found and it is required.

## 0.14.2

### Fixed

- [#440](https://github.com/skatejs/skatejs/issues/440) - Ensure docs for ready lifecycle callback and ready function are in sync.

## 0.14.1

### Fixed

- [#436](https://github.com/skatejs/skatejs/issues/436) - Fix issue where property definition objects were being mutated and shared.

## 0.14.0

### Added

- [#162](https://github.com/skatejs/skatejs/issues/162) - Using ES6 classes to extend component definitions / constructors.
- [#173](https://github.com/skatejs/skatejs/issues/173) - The presence of the `resolved` attribute skips the `render` callback.
- [#177](https://github.com/skatejs/skatejs/issues/177) - `skate.create()` as an alternative to `document.createElement()` and `skate.init()`.
- [#187](https://github.com/skatejs/skatejs/issues/187) - `attribute` handlers are now synchronous.
- [#200](https://github.com/skatejs/skatejs/issues/200) - Support for a `properties` definition that defines instance properties and their behaviour.
- [#206](https://github.com/skatejs/skatejs/issues/206) - Element constructors can be called like a function, or instantiated like a constructor.
- [#206](https://github.com/skatejs/skatejs/issues/248) - `skate.fragment()` as a way to create a document fragment from almost any type of argument list.
- [#270](https://github.com/skatejs/skatejs/issues/270) - Retain existing property value if a defined property overrides it.
- [#275](https://github.com/skatejs/skatejs/issues/275) - Allow an object of properties to be passed to element constructors / functions and `skate.create()`.
- [#276](https://github.com/skatejs/skatejs/issues/276) - `skate.emit()` triggers events and simulates bubbling for detached elements in browsers that don't support it.
- [#354](https://github.com/skatejs/skatejs/issues/354) - `skate.render()` re-invokes the `render` lifecycle on the specified element for all of its matching components.
- [#413](https://github.com/skatejs/skatejs/issues/413) - Added the `name` property on the function returned from `skate()` to polyfill native behaviour where it is possible.

### Changed

- [#200](#user-content-200) - The attribute lifecycle callbacks have been implemented in a different API under `properties`.
- [#208](#user-content-208) - `attributes` is not just a single callback called `attribute`.
- [#209](#user-content-209) - Renamed `attributes` to `attribute` because now it's just a single callback.
- [#210](#user-content-210) - Renamed `lib/skate.js` and `src/skate.js` to `lib/index.js` and `src/index.js`.
- [#225](#user-content-225) - Moved attribute and class binding types to separate repositories.
- [#295](#user-content-295), [#377](#user-content-377) - (Re-)moved `MutationObserver` polyfill.
- [#337](#user-content-337) - Streamlined, consistent and predictable lifecycle.
- [#359](#user-content-359) - `skate.init()` only supports DOM elements but you can pass multiple ones as an argument list.

### Fixed

- [#141](https://github.com/skatejs/skatejs/issues/141) - Lifecycle callbacks called separately. First `created` is called on all elements then `attached` is called on all elements. Before, `created` and `attached` would be invoked on an element before moving on to the next.
- [#174](https://github.com/skatejs/skatejs/issues/174) - Polyfilled custom element prototype members not inherited.
- [#292](https://github.com/skatejs/skatejs/pull/292) - Fix race condition with component initialisation.

### Removed

- [#184](https://github.com/skatejs/skatejs/issues/184) - The `skate.defaults` property is no longer public and has been removed. No alternative will be provided.
- [#187](https://github.com/skatejs/skatejs/issues/187) - Modifying `element.attributes` directly no longer triggers the `attribute` callback.
- [#289](https://github.com/skatejs/skatejs/issues/289) - the `skate` global is no longer set when importing `src/index.js`, and the `skate.noConflict()` method is not present when consuming skate in this way.

### Upgrading

#### [#200](https://github.com/skatejs/skatejs/issues/200)<a name="200"></a> - Attribute lifecycle moved into `properties`

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
    attribute: true,
    set: function (elem, data) {

    }
  },
  myAttribute2: {
    attribute: true,
    default: 'initial value',
    set: function (elem, data) {

    }
  },
  myAttribute3: {
    attribute: true,
    default: function () {
      return 'initial value';
    }
  },
  myAttribute4: {
    attribute: true,
    set: function (elem, data) {
      if (data.oldValue === undefined) {
        // created
      } else if (data.newValue === undefined) {
        // removed
      } else {
        // updated
      }
    }
  }
}
```

When `set` is called, `newValue` and `oldValue` have the same meaning as when used inside the `attribute` callback.

#### [#208](https://github.com/skatejs/skatejs/issues/208)<a name="208"></a> - `attributes` is not just a single callback called `attribute`

This callback has been simplified since in most cases the `properties` will be used for specifying side-effects.

```js
attribute: function (elem, data) {

}
```

- `elem` is the element which the attribute change was triggered on.
- `data` is the information about the change that occurred.
  - `data.name` the name of the attribute that changed.
  - `data.newValue` the value that the attribute changed to, or `undefined` if attribute was removed.
  - `data.oldValue` the value that the attribute changed from, or `undefined` if the attribute was added.

#### [#209](https://github.com/skatejs/skatejs/issues/209)<a name="209"></a> - Renamed `attributes` to `attribute` because now it's just a single callback

Wherever you're specifying the `attributes` option, just rename it to `attribute` (singular).

#### [#210](https://github.com/skatejs/skatejs/issues/210)<a name="210"></a> - Renamed `lib/skate.js` and `src/skate.js` to `lib/index.js` and `src/index.js`

If you're using the ES6 or UMD versions of Skate (`lib` and `src` folders), rename the reference to the `skate` file to `index`.

#### [#225](https://github.com/skatejs/skatejs/issues/225)<a name="225"></a> - Moved attribute and class binding types to separate repositories

The attribute and class bindings have been moved out of core:

- https://github.com/skatejs/type-attribute
- https://github.com/skatejs/type-class

The issue contains details as to why this has been done.

#### [#295](https://github.com/skatejs/skatejs/issues/295) <a name="295"></a>, [#377](https://github.com/skatejs/skatejs/pull/377) <a name="377"></a> - Removed `MutationObserver` polyfill (moved to https://github.com/skatejs/polyfill-mutation-observer and marked as unmaintained)

Since it's up to you to include your own `MutationObserver` polyfill, this means you can use whichever polyfill you want. That said, if you are concerned about performance in IE, it's recommended that you use ours as it's been specifically designed to be performant over other offerings.

Ensure you include the polyfill before any Skate definitions have been defined.

A polyfill that generally seems to work well is the one from [webcomponents/webcomponentsjs](https://github.com/webcomponents/webcomponentsjs/blob/v0.7.15/MutationObserver.js).

#### [#337](https://github.com/skatejs/skatejs/issues/337)<a name="277"></a> - Streamlined, consistent and predictable lifecycle

In native web components, the behaviour around when components are initialised is really inconsistent. The Skate lifecycle has been streamlined to make this consistent especially when building compound components. See the issue for more details.

#### [#337](https://github.com/skatejs/skatejs/issues/337)<a name="277"></a> - `skate.init()` only supports DOM elements but you can pass multiple ones as an argument list.

`skate.init()` only supports DOM elements as arguments. This means that you cannot pass a selector or DOMNodeList as an argument. If you do want to pass multiple nodes at once, you can use the ES6 spread operator:

```js
skate.init(...document.querySelectorAll('some-elements'));
```

Or you can convert it to an array if you can't use ES6:

```js
skate.init.apply(null, [].slice.call(document.querySelectorAll('some-elements')));
```

#### [#359](https://github.com/skatejs/skatejs/issues/359) - `skate.init()` only supports DOM elements but you can pass multiple ones as an argument list.

Before you could specify a selector or pass an traversable list:

```js
skate.init(document.querySelectorAll('.items'));
```

This was changed to support only a single element for simplicity:

```js
skate.init(element);
```

But since ES6 supports the spread (`...`) operator, we've expanded this to take multiple arguments so that you can:

```js
skate.init(...document.querySelector('.items'));
```

This was also done to follow the same convention that `skate.fragment()` does when accepting arguments.
