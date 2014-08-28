define(['../../src/skate.js', '../lib/helpers.js'], function (skate, helpers) {
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

  describe('Lifecycle scenarios', function () {
    var ready, insert, remove;
    var El;

    beforeEach(function () {
      ready = insert = remove = 0;
      El = skate('my-element', {
        ready: function () {
          ++ready;
        },
        insert: function () {
          ++insert;
        },
        remove: function () {
          ++remove;
        }
      });
    });

    describe('use the constructor then add it to the DOM', function () {
      beforeEach(function () {
        helpers.fixture(new El());
      });

      it('should call ready', function (done) {
        helpers.afterMutations(function () {
          expect(ready).to.equal(1);
          done();
        });
      });

      it('should call insert', function (done) {
        helpers.afterMutations(function () {
          expect(insert).to.equal(1);
          done();
        });
      });
    });

    describe('inserted multiple times', function () {
      beforeEach(function () {
        var el = new El();

        helpers.fixture(el);
        skate.init(el);
        helpers.fixture().removeChild(el);

        helpers.fixture(el);
        skate.init(el);
        helpers.fixture().removeChild(el);
      });

      it('should have called ready only once', function (done) {
        helpers.afterMutations(function () {
          expect(ready).to.equal(1);
          done();
        });
      });

      it('should have called insert twice', function (done) {
        helpers.afterMutations(function () {
          expect(insert).to.equal(2);
          done();
        });
      });

      it('should have called remove twice', function (done) {
        helpers.afterMutations(function () {
          expect(remove).to.equal(2);
          done();
        });
      });
    });
  });
});
