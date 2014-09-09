define(['../../src/skate.js'], function (skate) {
  'use strict';

  describe('Templates', function () {
    it('should execute the template function before ready is called', function () {
      skate('my-element', {
        ready: function (element) {
          expect(element.textContent).to.equal('test');
        },

        template: function (element) {
          element.textContent = test;
        }
      });
    });
  });
});
