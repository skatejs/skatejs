# Preventing FOUC

An element may not be initialised right away if your definitions are loaded after the document is parsed. In native custom elements, you can use the `:defined` pseudo-class to select all elements that have been upgraded, thus allowing you to do `:not(:defined)` to invert that. Since that only works in native, Skate adds a `defined` attribute so that you have a cross-browser way of dealing with FOUC and jank.

```css
my-element {
  opacity: 1;
  transition: opacity .3s ease;
}
my-element:not([defined]) {
  opacity: 0;
}
```
