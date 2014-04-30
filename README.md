[![Build Status](https://travis-ci.org/treshugart/skate.png?branch=master)](https://travis-ci.org/treshugart/skate)

Skate
=====

Skate is a web component library that allows you to define behaviour for elements without worrying about when that element is inserted into the DOM.

HTML

    <my-component></my-component>

JavaScript

    skate('my-component', function(element) {
      element.textContent = 'Hello, World!';
    });

Output

    Hello, World!

Installing
----------

You can install Skate using Bower or by downloading the source from the repository.

    bower install skate

### AMD

Skate supports AMD if detected and is registered as `skate`. You must ensure that when you `require(['skate'])` that you have pointed that module to the correct path. In RequireJS you would use the `paths` configuration option:

    require.config({
      paths: {
        skate: 'bower_components/skate/dist/skate'
      }
    });

### Global

If you're still skating old school, we've got you covered. Just make sure skate is included on the page and you can access it via `window.skate`.

Docs
----

The full documentation is available at [http://treshugart.github.io/skate/](http://treshugart.github.io/skate/).

Compatibility
-------------

IE9+ and all evergreens.

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


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/treshugart/skate/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

