'use strict';

import skate from '../../src/skate';

describe('ignoring', function () {
  it('should ignore a flagged element', function () {
    var called = 0;

    // Test attaching before.
    document.body.innerHTML = '<div></div><div id="container-1" data-skate-ignore><div><div></div></div></div><div></div>';
    document.getElementById('container-1').innerHTML = '<div><div></div></div>';

    // Now register.
    skate('div', {
      attached: function () {
        ++called;
      }
    });

    // Ensure the document is sync'd.
    skate.init(document.body);

    // Test attaching after.
    document.body.innerHTML = '<div></div><div id="container-2" data-skate-ignore><div><div></div></div></div><div></div>';
    document.getElementById('container-2').innerHTML = '<div><div></div></div>';

    // Ensure all new content is sync'd.
    skate.init(document.body);

    expect(called).to.equal(4);
  });
});
