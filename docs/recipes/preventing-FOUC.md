# Preventing FOUC

An element may not be initialised right away if your definitions are loaded after the document is parsed. In native custom elements, you can use the `:defined` pseudo-class to select all elements that have been upgraded, thus allowing you to do `:not(:defined)` to invert that.

If you need to do something similar where custom elements aren't natively supported, then you can add an attribute - or something similar:

```js
customElements.define('my-element', class extends HTMLElement {
  connectedCallback () {
    this.setAttribute('defined', '');
  }
});
```

And then you can target it with CSS:

```css
my-element {
  opacity: 1;
  transition: opacity .3s ease;
}
my-element:not([defined]) {
  opacity: 0;
}
```
