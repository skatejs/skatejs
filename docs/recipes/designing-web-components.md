# Designing Web Components

A web component's public API should be available both imperatively (via JavaScript) and declaratively (via HTML). You should be able to do everything in one, that you can do in the other within reason.



## Imperative

You should always try and make the constructor available whether it's exported from an ES2015 module or a global:

```js
import { Component } from 'skatejs';

class MyComponent extends Component {}

customElements.define('my-component', MyComponent);

export default MyComponent;
```



## Declarative

By declaring a Skate component, you are automatically making your element available to be used as HTML. For example, if you were to create a custom element for a video player:

```js
import { Component, define } from 'skatejs';

export default define(class extends Component {
  static is = 'x-video'
});
```

You could now just write:

```html
<x-video />
```

Instead of providing just imperative methods - such as `play()` for the native `<video>` element - you should try to provide attributes that offer the same functionality. For example, if you had a player component, you could offer a `playing` boolean attribute, so that it starts playing when it's put on the page.

```html
<x-video playing />
```

To pause / stop the player, you remove the attribute.

```html
<x-video />
```

If you're using something like React or Skate to render this component, you don't have to write any imperative code to remove that attribute as the virtual DOM implementations will do that for you.

The nice part about thinking this way is that you get both a declarative and imperative API for free. You can think about this in simpler terms by designing your API around attributes rather than methods.



## Naming Collisions

You may write a component that you change in a backward incompatible way. In order for your users to upgrade, they'd have to do so all at once instead of incrementally if you haven't given the new one a different name. One option is to choose a different name for your component, but that may not be ideal. You could also use `define()` to ensure the name is unique. An ideal solution would be to only export your constructor and let the consumer register it.

```js
/** @jsx h */

import { Component, h } from 'skatejs';

export default class extends Component {
  renderCallback ({ localName }) {
    return <div>This element has been called {localName}.</div>;
  }
}
```



## Compatible with multiple versions of itself

Skate is designed so that you can have multiple versions of it on the same page. This is so that if you have several components, your upgrades and releases aren't coupled. If you have a UI library based on Skate and those consuming your library also have Skate, your versions aren't coupled.



## Properties and Attributes

Properties and attributes should represent as much of your public API as possible as this will ensure that no matter which way your component is created, its API remains as consistent as the constraints of HTML will allow. You can do this by ensuring your properties have corresponding attributes:

```js
import { Component, h, prop } from 'skatejs';

customElements.define('my-component', class extends Component {
  static get props () {
    return {
      // Automatically creates a one-way (attribute to prop) binding for the
      // name attribute / property.
      name: prop.string
    };
  }
});
```

Sometimes this may not be viable, for example when passing complex data types to attributes. In this scenario, you can try and serialize / deserialize to / from attributes. For example, if you wanted to take a comma-separated list in an attribute and have the property take an array, but still have them linked, you could do something like:

```js
import { Component } from 'skatejs';

customElements.define('my-component', class extends Component {
  static get props () {
    return {
      values: {
        attribute: { source: true },
        deserialize: v => v.split(','),
        serialize: v => v.join(',')
      }
    };
  }
});
```



## Private Members

Skate doesn't have any opinions on how you store or use private methods and properties on your elements. Classically, one would normally use scoped functions or underscores to indicate privacy:

```js
import { Component } from 'skatejs';

function scoped (elem) {}

customElements.define('my-component', class extends Component {
  constructor () {
    super();
    scoped(this);
    this._privateButNotReally();
  }
  _privateButNotReally() {}
});
```

With ES2015, another pattern for "private" members is to use [symbol-keyed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) properties:

```js
import { Component } from 'skatejs';

const sym = Symbol();

customElements.define('my-component', class extends Component {
  constructor () {
    super();
    this[sym]();
  }
  [sym]() {}
});
```

Note these also are not truly private, as they're discoverable via reflection.

## Private Data

A slightly different use-case than using private members would be storing private data. As with members, you can use scoped variables or underscores. However, scoped variables generally aren't specific to an element instance and underscores are only a privacy guideline; anyone can still access the data.

The best way to do this depends on your needs. Generally a `WeakMap` is a good choice as it will hold weak references to the key:

```js
import { Component } from 'skatejs';

const map = new WeakMap();

customElements.define('my-component', class extends Component {
  constructor () {
    map.set(this, 'some data');
  },
  renderCallback () {
    return <div>{map.get(this)}</div>;
  }
});
```

You can also use symbols on your element just like we did above with standard methods and properties, if that suits your workflow better.

