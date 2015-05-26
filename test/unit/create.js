import helpers from '../lib/helpers';
import resolved from '../lib/resolved';
import skate from '../../src/index';

describe('skate.create()', function () {
  var tagName;

  beforeEach(function () {
    tagName = helpers.safeTagName().safe;
  })

  it('should init a component', function () {
    skate(tagName, {});
    expect(resolved(skate.create(tagName))).to.equal(true);
  });

  it('should create an element if no component is found', function () {
    expect(resolved(skate.create(tagName))).to.equal(false);
  });
});
