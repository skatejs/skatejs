Skate
=====

Listens for DOM elements matching a selector and runs a function against each element once available.

Usage
-----

Skate allows you to easily define a component:

    skate('p[hello]', function(p) {
      p.innerText = 'Hello, ' + p.getAttribute('hello') + '!';
    });

which make all current and future elements matching `p[hello]`:

    <p hello="World">Hello, World!</p>
