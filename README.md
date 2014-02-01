Skate
=====

Listens for DOM elements matching a selector and runs a function against each element once available.

    skate('p[hello]', function(p) {
      p.innerText = 'Hello, ' + p.getAttribute('hello') + '!';
    });

Would make all current and future elements matching `p[hello]`:

    <p hello="World">Hello, World!</p>
