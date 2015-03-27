---
template: layout.html
---

## Skate

Skate is a web component library that is focused on being a tiny, performant, syntactic-sugar for binding behaviour to custom and existing elements without ever having to worry about when your element is inserted into the DOM. It uses the [Custom Element](http://w3c.github.io/webcomponents/spec/custom/) spec as a guideline and adds some features on top of it.

HTML

```html
<my-component></my-component>
```

JavaScript

```js
skate('my-component', {
  created: function (element) {
    element.textContent = 'Hello, World!';
  }
});
```

Result

```html
<my-component>Hello, World!</my-component>
```



## Compatibility

IE9+ and all evergreens.



## Installing

You can download the source yourself and put it wherever you want. Additionally you can use Bower:

    bower install skatejs

Or NPM:

    npm install skatejs

Include either `dist/skate.js` or `dist/skate.min.js`.



### UMD (AMD / CommonJS)

UMD files are located in `lib/`. Simply import `lib/skate.js` and use it as normal.



### ES6 Modules

The Skate source is written using [ES6 modules](http://www.2ality.com/2014/09/es6-modules-final.html). If you're using a transpilation method, then you can `import skate from 'src/skate';` and use it in your projects as you would any ES6 module.



### Global

If you're still skating old school the `dist` directory contains the compiled ES5 source. The compiled source does not use a module loader; everything will just work. Access Skate as a global with `skate`.



## Who's Using It?

<img alt="Atlassian" src="http://www.atlassian.com/dms/wac/images/press/Atlassian-logos/logoAtlassianPNG.png" width="200">
