import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('Lifecycle Callbacks', function () {
  it('should remove the "unresolved" attribute after the ready callback is called', function (done) {
    skate('my-element', {
      ready: function (element) {
        done();
      }
    });

    helpers.fixture('<my-element></my-element>');
  });

  it('should remove the "unresolved" attribute before the insert callback is called', function (done) {
    skate('my-element', {
      insert: function (element) {
        done();
      }
    });

    helpers.fixture('<my-element></my-element>');
  });

  it('should trigger removed when the element is removed.', function (done) {
    skate('my-element', {
      remove: function () {
        done();
      }
    });

    helpers.fixture('<my-element></my-element>');
    helpers.fixture('');
  });
});

describe('Unresolved attribute', function () {
  it('should remove the "unresolved" attribute after the ready callback is called', function () {
    skate('my-element', {
      ready: function (element) {
        expect(element.hasAttribute('unresolved')).to.equal(true);
      }
    });

    skate.init(helpers.fixture('<my-element unresolved></my-element>'));
  });

  it('should remove the "unresolved" attribute before the insert callback is called', function () {
    skate('my-element', {
      insert: function (element) {
        expect(element.hasAttribute('unresolved')).to.equal(false);
      }
    });

    skate.init(helpers.fixture('<my-element unresolved></my-element>'));
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
