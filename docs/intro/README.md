## Resources

- [Building a custom tag input with SkateJS](https://hackernoon.com/building-a-custom-tag-input-with-skate-js-fbd4cdf744f#.16oe09fif)
- [SkateJS Website](https://github.com/skatejs/skatejs.github.io)
- [Web Platform Podcast: Custom Elements & SkateJS](http://thewebplatformpodcast.com/66-custom-elements-skatejs)
- [SydJS: Skating with Web Components](http://slides.com/treshugart/skating-with-web-components#/)
- [SydJS: Still got your Skate on](http://slides.com/treshugart/still-got-your-skate-on#/)



## Questions?

If you have any questions about Skate you can use one of these:

- [Gitter](https://gitter.im/skatejs/skatejs)
- [HipChat](https://www.hipchat.com/gB3fMrnzo)



## Terminology

Let's define some terms used in these docs:

- polyfill, polyfilled, polyfill-land - no native web component support.
- upgrade, upgraded, upgrading - when an element is initialised as a custom element.


## Customised built-in elements

The spec [mentions](http://w3c.github.io/webcomponents/spec/custom/#customized-built-in-element) this as a way to extend built-in elements. Currently, how this is exposed to the user is still [under contention](https://github.com/w3c/webcomponents/issues/509#issuecomment-222860736). Skate doesn't need do anything to support this underneath the hood, but be aware of this when building components.



## VS other libraries

We hold no ill thoughts against other libraries and we are just trying to articulate why one would choose Skate over another. If any information here is inaccurate, please feel free to raise an issue to discuss how we can make it accurate.



### VS WebComponentsJS

[webcomponentsjs](https://github.com/webcomponents/webcomponentsjs)

WebComponentsJS is a suite of polyfills. If there is native browser support, they're not needed. Skate is a superset of these specifications, thus is a value-add on top of them, if they're needed.


### VS Polymer

Polymer uses webcomponentsjs and adds an abstraction on top of it. In their high-level design, Skate and Polymer are very similar in that they're built on top of emerging standards. However, fundamentally, Skate and Polymer are very different.

- Skate uses a functional programming model for rendering in which you can use any templating language you want that compiles down to Incremental DOM. It calls `renderCallback()` when something changes and then tells Incremental DOM to diff and patch what's different between the two states. With Polymer, you use their custom template syntax that creates links between properties and mutations happen to the DOM directly.
- Skate only has a single option for its usage, making it simpler to grok what you're getting. Polymer has three different builds, most of which Skate is smaller than. The following comparisons are using non-gzipped, minified versions.
  - `polymer-micro.html` 17k vs 11k
  - `polymer-mini.html` 54k vs 11k
  - `polymer.html` 124k vs 11k
- Polymer uses HTML Imports to build their codebase. This can be obtuse if you're used to using JavaScript module formats, especially since HTML Imports are currently very contentious and Google are the only ones who are pushing for it.
- Skate supports JSPM, NPM and more. Polymer currently [only supports Bower](https://github.com/Polymer/polymer/issues/2578).



### VS X-Tags

Skate is very close to X-Tags in terms of API shape, however, it is very different in the way it is applied and shares a lot of the same differences with X-Tags as it does with Polymer.

- Skate uses a functional programming model for rendering in which you can use any templating language you want that compiles down to Incremental DOM. X-Tags is not very opinionated about rendering or templating. You define a string of HTML and it will use that as the component's content.
- Skate's property API is thorough and extensible. We provide implementations or commonly used property patterns and give you an API to easily write your own reusable properties.
- Skate is about the same size and scales well for building large, complex user interfaces.
- There's no mutating your component's DOM from property accessors which can become unwieldy.



### VS React

React has definitely had an influence on Skate. That said, they're completely different beasts, only sharing a functional rendering pipeline and some aspects of the API.

- React is 10x the size of Skate.
- In the performance tests you can see a Skate component is several times faster than a similarly written React component.
- **Skate is written on top of W3C standards.** The React authors have been [very vocal](https://github.com/facebook/react/issues/5052) about this. However, the response to that issue is incorrect. Web Components by nature are declarative: it's just HTML. Web Components also completely solve the integration problems between libraries and frameworks due to the nature of how Custom Elements and Shadow DOM work: Custom Elements provide a declarative API, Shadow DOM hides the implementation details. When integrating with frameworks, you're just writing HTML. In terms of the problems with imperative APIs, it's not the fault of Web Components that force a user to call a method, it's the fault of the design of the Web Component. There's nothing stopping a Web Component from being completely declarative, especially if it's written in Skate. More information about [web component design](#declarative).
- We have plans to support server-side rendering.
