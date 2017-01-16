# `ready (element, callback)`

The `skate.ready()` function allows you to define a `callback` that is fired when the specified `element` is has been upgraded. This is useful when you want to ensure an element has been upgraded before doing anything with it. For more information regarding why an element may not be upgraded right away, read the following section.



## Background

If you put your component definitions before your components in the DOM loading `component-a` before `component-b`:

```html
<script src="component-a.js"></script>
<script src="component-b.js"></script>
<component-a>
  <component-b></component-b>
</component-a>
```

The initialisation order will be:

1. `component-a`
2. `component-b`

If you flip that around so that `component-b` is loaded before `component-a`, the order is the same. This is because the browser will initialise elements with their corresponding definitions as it descends the DOM tree.

However, if you put your component definitions at the bottom of the page, it gets really hairy. For example:

```html
<component-a>
  <component-b></component-b>
</component-a>
<script src="component-a.js"></script>
<script src="component-b.js"></script>
```

In this example, we are loading `component-a` before `component-b` and the same order will apply. *However*, if you flip that around so that `component-b` is loaded before `component-a`, then `component-b` will be initialised first. This is because when a definition is registered via `window.customElements.define()`, it will look for elements to upgrade *immediately*.
