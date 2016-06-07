import { define } from '../../../src/index';
import fixture from '../../lib/fixture';
import ready from '../../../src/api/ready';
import unique from '../../lib/element';

describe('api/ready', function () {
  let elem;
  let tag;

  function setup () {
    define(tag, {});
  }

  beforeEach(function () {
    tag = unique().safe;
    elem = fixture().appendChild(document.createElement(tag));
  });

  it('should fire for an element when it is already ready', function (done) {
    setup();
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
  });
});
