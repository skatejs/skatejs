import element from '../../lib/element';
import resolved from '../../lib/resolved';
import skate from '../../../src/index';

describe('api/create', function () {
  var tagName;

  beforeEach(function () {
    tagName = element().safe;
  });

  it('should init a component', function () {
    skate(tagName, {});
    expect(resolved(skate.create(tagName))).to.equal(true);
  });

  it('should create an element if no component is found', function () {
    expect(resolved(skate.create(tagName))).to.equal(false);
  });

  it('should set properties on it', function () {
    expect(skate.create(tagName, { test: true }).test).to.equal(true);
  });
});
