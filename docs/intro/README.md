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
