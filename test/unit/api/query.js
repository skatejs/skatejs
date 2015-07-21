import apiQuery from '../../../src/api/query';
import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import skate from '../../../src/index';

describe('api/query', function () {
  var host;

  beforeEach(function () {
    host = skate(helperElement().safe, {});
  });

  it('existing components', function (done) {
    var tag = helperElement();
    var elem = host();

    skate(tag.safe, {});
    elem.appendChild(tag.create());
    apiQuery(elem, tag.safe, function () {
      expect(this.tagName.toLowerCase()).to.equal(tag.safe);
      done();
    });
  });

  it('subsequent components', function (done) {
    var tag = helperElement();
    var elem = host();

    skate(tag.safe, {});
    elem.appendChild(document.createElement(tag.safe));
    apiQuery(elem, tag.safe, function () {
      expect(this.tagName.toLowerCase()).to.equal(tag.safe);
      done();
    });
    helperFixture(elem);
  });
});
