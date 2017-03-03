# Styling Components

In order to style your components, you should assume Shadow DOM encapsulation. The best-practice here is to simply put styles into a `<style>` block:

```js
customElements.define('x-component', class extends skate.Component {
  renderCallback () {
    return [
      skate.h('style', '.my-class { display: block; }'),
      skate.h('div', { class: 'my-class' }),
    ];
  }
});
```

If you want to ensure your styles are encapsulated even if using a polyfill, you can use something like [CSS Modules](https://github.com/css-modules/css-modules).
