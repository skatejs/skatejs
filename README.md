[![Build Status](https://travis-ci.org/treshugart/skate.png?branch=master)](https://travis-ci.org/treshugart/skate)

Skate
=====

Skate is a component-based micro-framework that provides a common interface for interacting with existing and new DOM elements.

Installation
------------

You can install via Bower or use the files located in `dist/`.

    bower install skate

Why?
----

Skate is heavily inspired by the [animation keyframe](http://www.backalleycoder.com/2012/04/25/i-want-a-damnodeinserted/) technique by Daniel Buchner. Currently, the only way to accomplish handling elements added to the DOM is by using [Mutation Observers](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) which are only available in the [greenest](https://developer.mozilla.org/en/docs/Web/API/MutationObserver#Browser_compatibility) of evergreen browsers. Contrary to Mutation Observers, this technique uses CSS animation keyframes to notify handlers about elements that are added to the DOM. This works for both new elements and existing elements alike and is very performant.

Usage
-----

Creating a new component out of existing and new DOM elements is as easy as passing a CSS selector and component handler to a function. A component is simply a function that takes a DOM element as its only argument.

    var component = skate('css[selector]', function(element) {
      // your component initialisation here
    });

When you bind a component to a subset of elements, a component instance is returned. This allows you to interact with the elements bound to that component.

    // [el1, el2, ...]
    component.elements();

    // Stop listening for new elements.
    component.destroy();

Examples
--------

### Integrating Frameworks

If you like frameworks like Knockout, you can organise the setup logic into a component.

    skate('[model]', function(el) {
      ko.applyBindings(window[el.getAttribute('model')], el);
    });

Then you can declaratively activate it on the element of your choice.

    <script>
      window.myModel = {
        hello: ko.observable()
      };
    </script>

    <p model="myModel">Hello, <span data-bind="text: hello"></span>!</p>

### Templating

You can even create components that will render templates.

    skate('[template]', function(el) {
      var temp = Handlebars.compile(document.getElementById(el.getAttribute('template')));
      var data = window[el.getAttribute('template-data')] || {};
      el.innerHTML = temp(data);
    });

This allows you to properly separate concerns.

    <script type="text/javascript">
      window.context = {
        hello: 'World'
      };
    </script>

    <script type="text/handlebars" id="hello">
      Hello, {{hello}}!
    </script>

    <div template="hello" template-data="context"></div>

### Nesting Components

Since components activate once they hit the DOM, this means you can nest components within each other and they just work.

    <tabs>
      <tab pane="tab1">Tab 1</tab>
      <tab pane="tab2">Tab 2</tab>
      <pane tab="tab1">Tab 1 content.</pane>
      <pane tab="tab2">Tab 2 content.</pane>
    </tabs>

Your selector places restrictions on whether a component is valid within a given hierarchy.

    skate('tabs > tab', function() {
      // get tabby with it
    });

    skate('tabs > pane', function() {
      // cause some pane
    });

Compatibility
-------------

Works in all *evergreen* browsers that [support CSS animation](http://caniuse.com/#feat=css-animation) and falls back to using [deprecated mutation events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events) in **IE9**.

License
-------

The MIT License (MIT)

Copyright (c) 2014 Trey Shugart

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
