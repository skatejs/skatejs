import helpers from '../../lib/helpers';
import resolved from '../../lib/resolved';
import skate from '../../../src/index';

describe('api/create', function () {
  var tagName;

  beforeEach(function () {
    tagName = helpers.safeTagName().safe;
  });

  describe('name', function () {
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

  describe('html', function () {
    it('should init an element and its descendants', function () {
      var descendantTagName = helpers.safeTagName().safe;
      skate(tagName, {});
      skate(descendantTagName, { type: skate.type.ATTRIBUTE });

      var result = skate.create(`<${tagName}><div ${descendantTagName}></div></${tagName}>`);
      expect(resolved(result)).to.equal(true);
      expect(resolved(result.firstElementChild)).to.equal(true);
    });

    it('should set properties on it', function () {
      expect(skate.create('<div></div>', { test: true }).test).to.equal(true);
    });
  });
});
