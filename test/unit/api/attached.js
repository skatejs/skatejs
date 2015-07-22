import apiAttached from '../../../src/api/attached';
import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import skate from '../../../src/index';

describe('api/attached', function () {
  var host;

  beforeEach(function () {
    helperFixture(host = skate(helperElement().safe, {})());
  });

  it('existing components', function (done) {
    var tag = helperElement();

    skate(tag.safe, {});
    host.appendChild(tag.create());
    apiAttached(host, tag.safe, function (desc) {
      expect(desc.tagName.toLowerCase()).to.equal(tag.safe);
      done();
    });
  });

  it('subsequent components', function (done) {
    var tag = helperElement();

    apiAttached(host, tag.safe, function (desc) {
      expect(desc.tagName.toLowerCase()).to.equal(tag.safe);
      done();
    });
    host.appendChild(tag.create());
    skate(tag.safe, {});
  });
});
