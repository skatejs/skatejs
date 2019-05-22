# sk-shadow

> A web component for declaratively attaching a shadow root to its parent that is SSR friendly.

- Declaratively use a shadow root.
- Does not mutate the DOM.
- Use Shadow DOM in any frmaework.
- SSR compatible.

It will:

- Attach a shadow to its parent, if one doesn't exist.
- Proxy all updates from it to its parent's shadow root.

## Installing

```
npm i @skatejs/sk-shadow
```

## Using

```js
<div>
  <sk-shadow>
    <style>
      :host {
        border: 1px solid black;
        padding: 10px;
      }
    </style>
    <slot></slot>
  </sk-shadow>
</div>
```

## Usage in a web component

```js
class Hello extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <sk-shadow>
        Hello, <slot></slot>!
      </sk-shadow>
    `;
  }
}

customElements.define('my-hello', Hello);
```

Then:

```html
<!--
<my-hello>
  World
  #shadow-root
    Hello, <slot></slot>!
</my-hello>
-->
<my-hello>World</my-hello>
```

## Usage in React

```js
const Hello = (
  <div>
    <sk-shadow>
      Hello, <slot />!
    </sk-shadow>
  </div>
);

const App = <Hello>World</Hello>;
```

### SSR

You can simply use `renderToString` and no content will be hidden.

```js
renderToString(<App />);
```

Which would produce:

```html
<div><sk-shadow> </sk-shadow></div>
```
