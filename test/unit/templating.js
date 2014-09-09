define(['../../src/skate.js'], function (skate) {
  'use strict';

  describe('Templates', function () {
    it('should execute the template function before ready is called', function () {
      var MyEl = skate('my-el', {
        ready: function (element) {
          expect(element.textContent).to.equal('test');
        },

        template: function (element) {
          element.textContent = 'test';
        }
      });

      var myEl = new MyEl();
    });
  });
});
