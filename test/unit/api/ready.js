import apiReady from '../../../src/api/ready';
import helperElement from '../../lib/element';
import skate from '../../../src/index';

describe('api/ready', function () {
  var host;

  beforeEach(function () {
    host = skate(helperElement().safe, {});
  });

  it('existing components', function (done) {
    var tag = helperElement();
    var elem = host();

    skate(tag.safe, {});
    elem.appendChild(tag.create());
    apiReady(elem, tag.safe, function () {
      expect(this.tagName.toLowerCase()).to.equal(tag.safe);
      done();
    });
  });

  it('subsequent components', function (done) {
    var tag = helperElement();
    var elem = host();

    apiReady(elem, tag.safe, function () {
      expect(this.tagName.toLowerCase()).to.equal(tag.safe);
      done();
    });
    skate(tag.safe, {});
    elem.appendChild(tag.create());
  });
});
