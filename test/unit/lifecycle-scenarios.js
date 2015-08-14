import helperElement from '../lib/element';
import helperFixture from '../lib/fixture';
import helperReady from '../lib/ready';
import skate from '../../src/index';
import supportCustomElements from '../../src/support/custom-elements';

describe('lifecycle-scenarios', function () {
  it('definition is registered before the element is created', function (done) {
    var el = helperElement();
    var called = false;

    skate(el.safe, {
      created () {
        called = true;
      }
    });
    helperFixture(document.createElement(el.safe));

    if (supportCustomElements()) {
      expect(called).to.equal(true);
      done();
    } else {
      expect(called).to.equal(false);
      helperReady(function () {
        expect(called).to.equal(true);
        done();
      });
    }
  });

  it('definition is registered after the element is created', function (done) {
    var el = helperElement();
    var called = false;

    helperFixture(el.create());
    skate(el.safe, {
      created () {
        called = true;
      }
    });

    // We have to debounce in non-native for performance.
    if (supportCustomElements()) {
      expect(called).to.equal(true);
      done();
    } else {
      expect(called).to.equal(false);
      helperReady(function () {
        expect(called).to.equal(true);
        done();
      });
    }
  });
});
