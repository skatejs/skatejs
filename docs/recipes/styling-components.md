# Styling Components

In order to style your components, you should assume Shadow DOM encapsulation. The best-practice here is to simply put styles into a `<style>` block:

```js
import { Component, h } from 'skatejs';

customElements.define('x-component', class extends Component {
  css = `
    .my-class {
      display: block;
    }
  `;
  renderCallback ({ css }) {
    return (
      <div>
        <style>{css}</style>
        <div className="my-class" />
      </div>
    );
  }
});
```

If you want to ensure your styles are encapsulated even if using a polyfill, you can use something like [CSS Modules](https://github.com/css-modules/css-modules).
