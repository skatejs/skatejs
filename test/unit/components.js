define(['src/skate'], function (skate) {
  'use strict';

  describe('Using components', function () {
    function assertType (type, shouldEqual) {
      it('type: ' + type, function () {
        var calls = 0;

        skate('my-element', {
          type: type,
          ready: function () {
            ++calls;
          }
        });

        var el1 = document.createElement('my-element');
        skate.init(el1);

        var el2 = document.createElement('div');
        el2.setAttribute('is', 'my-element');
        skate.init(el2);

        var el3 = document.createElement('div');
        el3.setAttribute('my-element', '');
        skate.init(el3);

        var el4 = document.createElement('div');
        el4.className = 'my-element';
        skate.init(el4);

        calls.should.equal(shouldEqual);
      });
    }

    describe('tags, attributes and classes', function () {
      assertType(skate.types.TAG, 2);
      assertType(skate.types.ATTR, 1);
      assertType(skate.types.CLASS, 1);

      it('should not initialise a single component more than once on a single element', function () {
        var calls = 0;

        skate('my-element', {
          ready: function () {
            ++calls;
          }
        });

        var el = document.createElement('my-element');
        el.setAttribute('my-element', '');
        el.className = 'my-element';
        skate.init(el);

        calls.should.equal(1);
      });
    });
  });
});
