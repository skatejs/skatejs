import init from '../../../src/api/init';
import ready from '../../../src/api/ready';
import skate from '../../../src/index';
import unique from '../../lib/element';

describe('api/ready', function () {
  let elem;
  let tag;

  function setup () {
    skate(tag, {});
  }

  function initialise () {
    init(elem);
  }

  beforeEach(function () {
    tag = unique().safe;
    elem = document.createElement(tag);
  });

  it('should fire for an element when it is already ready', function (done) {
    let called = false;

    setup();
    initialise();

    ready(elem, () => called = true);
    expect(called).to.equal(true);

    ready(elem, function (shouldBeElem) {
      expect(shouldBeElem).to.equal(elem);
      done();
    });
  });

  it('should fire for an element when it is eventually ready', function (done) {
    ready(elem, function (shouldBeElem) {
      expect(shouldBeElem).to.equal(elem);
      done();
    });
    setup();
    initialise();
  });

  it('should take an array of elements', function (done) {
    const elements = [elem];
    ready(elements, function (shouldBeElements) {
      expect(shouldBeElements).to.equal(elements);
      done();
    });
    setup();
    initialise();
  });
});
