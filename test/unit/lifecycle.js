import helpers from '../lib/helpers';
import skate from '../../src/skate';

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
  var calls;
  var El;

  beforeEach(function () {
    calls = {
      ready: 0,
      insert: 0,
      remove: 0
    };

    El = skate('my-element', {
      ready: function () {
        ++calls.ready;
      },
      insert: function () {
        ++calls.insert;
      },
      remove: function () {
        ++calls.remove;
      }
    });
  });

  describe('use the constructor then add it to the DOM', function () {
    beforeEach(function () {
      helpers.fixture(new El());
    });

    it('should call ready', function (done) {
      helpers.afterMutations(function () {
        expect(calls.ready).to.greaterThan(0);
        done();
      });
    });

    it('should call insert', function (done) {
      helpers.afterMutations(function () {
        expect(calls.insert).to.greaterThan(0);
        done();
      });
    });
  });

  describe('inserted multiple times', function () {
    function expectNumCalls (num, val, done) {
      var el = new El();

      el.textContent = 'gagas';

      helpers.fixture(el);
      helpers.afterMutations(function () {
        helpers.fixture().removeChild(el);
        helpers.afterMutations(function () {
          helpers.fixture(el);
          helpers.afterMutations(function () {
            helpers.fixture().removeChild(el);
            helpers.afterMutations(function () {
              expect(calls[num]).to.equal(val);
              done();
            });
          });
        });
      });
    }

    it('should have called ready only once', function (done) {
      expectNumCalls('ready', 1, done);
    });

    it('should have called insert twice', function (done) {
      expectNumCalls('insert', 2, done);
    });

    it('should have called remove twice', function (done) {
      expectNumCalls('remove', 2, done);
    });
  });
});
