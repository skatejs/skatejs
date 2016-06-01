import element from '../../lib/element';
import resolved from '../../lib/resolved';
import skate, { create } from '../../../src/index';

describe('api/create', function () {
  var tagName;

  beforeEach(function () {
    tagName = element().safe;
  });

  it('should init a component', function () {
    skate(tagName, {});
    expect(resolved(create(tagName))).to.equal(true);
  });

  it('should create an element if no component is found', function () {
    expect(resolved(create(tagName))).to.equal(false);
  });
});
