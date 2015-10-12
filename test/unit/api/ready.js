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

  it('should fire for an element if no definitions are registered for it', function (done) {
    ready(elem, function (shouldBeElem) {
      expect(shouldBeElem).to.equal(elem);
      done();
    });
  });

  it('should fire for an element when it is already ready', function (done) {
    let called = false;

    setup();
    initialise();

    // Ensure it's called right away.
    ready(elem, () => called = true);
    expect(called).to.equal(true);

    ready(elem, function (shouldBeElem) {
      expect(shouldBeElem).to.equal(elem);
      done();
    });
  });

  it('should fire for an element when it is eventually ready', function (done) {
    setup();
    ready(elem, function (shouldBeElem) {
      expect(shouldBeElem).to.equal(elem);
      done();
    });
    initialise();
  });

  it('should take multiple elements', function (done) {
    let elements = [elem, document.createElement(unique().safe)];
    setup();
    ready(elements, function (shouldBeElements) {
      expect(shouldBeElements).to.equal(elements);
      done();
    });
    initialise();
  });

  it('should fire if no elements are passed in', function (done) {
    let elements = [];
    ready(elements, function (shouldBeArray) {
      expect(shouldBeArray).to.equal(elements);
      done();
    });
  });
});
