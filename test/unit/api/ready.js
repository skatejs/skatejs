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
    var element1 = host();
    var element2 = tag.create();

    element1.appendChild(element2);
    apiReady(element1, tag.safe, function () {
      expect(this).to.equal(element2);
      done();
    });

    skate(tag.safe, {});
  });

  it('subsequent components', function (done) {
    var tag = helperElement();
    var element1 = host();
    var element2 = tag.create();

    apiReady(element1, tag.safe, function () {
      expect(this).to.equal(element2);
      done();
    });
    element1.appendChild(element2);

    skate(tag.safe, {});
  });
});
