define(['src/skate', 'test/lib/helpers'], function (skate, helpers) {
  'use strict';

  describe('Lifecycle Callbacks', function () {
    it('should trigger ready before the element is shown.', function (done) {
      skate('div', {
        ready: function (element) {
          assert(element.className.split(' ').indexOf('__skate') === -1, 'Class found');
          done();
        }
      });

      helpers.add('div');
    });

    it('should trigger insert after the element is shown.', function (done) {
      skate('div', {
        insert: function (element) {
          assert(element.className.split(' ').indexOf('__skate') > -1, 'Class not found');
          done();
        }
      });

      helpers.add('div');
    });

    it('should trigger removed when the element is removed.', function (done) {
      skate('div', {
        remove: function () {
          assert(true);
          done();
        }
      });

      var el = helpers.add('div');
      skate.init(el);
      helpers.remove(el);
    });
  });

  describe('Async ready callback.', function () {
    it('Ready event should be async and provide a done callback.', function (done) {
      var ok = false;

      skate('div', {
        ready: function (element, next) {
          setTimeout(function () {
            ok = true;
            next();
          }, 100);
        },

        insert: function () {
          assert(ok, 'Ready not called before insert.');
          done();
        }
      });

      helpers.add('div');
    });
  });
});
