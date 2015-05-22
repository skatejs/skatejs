import helpers from '../lib/helpers';
import skate from '../../src/index';

describe('extending', function () {
  var Ctor, tag;

  beforeEach(function () {
    Ctor = skate(helpers.safeTagName().safe, {
      extends: 'div',
      someNonStandardProperty: true,
      created: function (element) {
        element.textContent = 'test';
      },
      attributes: {
        myAttribute: function () {}
      },
      prototype: {
        test: true,
        someFunction: function () {}
      }
    });
    tag = helpers.safeTagName().safe;
  });

  it('should copy all configuration options to the constructor', function () {
    expect(Ctor.extends).to.equal('div');
    expect(Ctor.someNonStandardProperty).to.equal(true);
    expect(Ctor.created).to.be.a('function');
    expect(Ctor.attributes.myAttribute).to.be.a('function');
    expect(Ctor.prototype.test).to.equal(true);
    expect(Ctor.prototype.someFunction).to.be.a('function');
  });

  it('should copy all configuration options to the extended object', function () {
    var ExtendedCtor = skate(tag, class extends Ctor {});
    expect(ExtendedCtor.extends).to.equal('div');
    expect(ExtendedCtor.someNonStandardProperty).to.equal(true);
    expect(ExtendedCtor.created).to.be.a('function');
    expect(ExtendedCtor.attributes.myAttribute).to.be.a('function');
    expect(ExtendedCtor.prototype.test).to.equal(true);
    expect(ExtendedCtor.prototype.someFunction).to.be.a('function');
  });

  it('prototype members should be available', function () {
    var ExtendedCtor = skate(tag, class extends Ctor {});
    expect(new ExtendedCtor().test).to.equal(true);
    expect(new ExtendedCtor().someFunction).to.be.a('function');
  });

  it('should not mess with callbacks', function () {
    var ExtendedCtor = skate(tag, class extends Ctor {});
    expect(new ExtendedCtor().textContent).to.equal('test');
  });

  it('should allow overriding of callbacks', function () {
    var ExtendedCtor = skate(tag, class extends Ctor {
      static created (element) {
        super.created(element);
        element.textContent += 'ing';
      }
    });
    expect(new ExtendedCtor().textContent).to.equal('testing');
  });
});
