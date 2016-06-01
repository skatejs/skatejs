import helperElement from '../lib/element';
import helperFixture from '../lib/fixture';
import ready from '../../src/api/ready';
import skate from '../../src/index';

const supportsCustomElements = !!document.registerElement;

describe('lifecycle-scenarios', function () {
  it('definition is registered before the element is created', function () {
    const el = helperElement();
    const elem = document.createElement(el.safe);
    let called = false;

    skate(el.safe, {
      created () {
        called = true;
      }
    });
    helperFixture(elem);
    expect(called).to.equal(true);
  });

  it('definition is registered after the element is created', function (done) {
    const el = helperElement();
    const elem = document.createElement(el.safe);
    let called = false;

    helperFixture(elem);
    skate(el.safe, {
      created () {
        called = true;
      }
    });

    // We have to debounce in non-native for performance.
    if (supportsCustomElements) {
      expect(called).to.equal(true);
      done();
    } else {
      expect(called).to.equal(false);
      ready(elem, function () {
        expect(called).to.equal(true);
        done();
      });
    }
  });
});
