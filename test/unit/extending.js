import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('extending', function () {
  var Ctor, tag;

  beforeEach(function () {
    tag = helpers.safeTagName().safe;
    Ctor = skate(tag, {
      extends: 'div',
      someNonStandardProperty: true,
      attributes: {
        myAttribute: function () {

        }
      },
      prototype: {
        test: true,
        someFunction: function () {

        }
      }
    });
  });

  it('should copy all configuration options to the constructor', function () {
    expect(Ctor.extends).to.equal('div');
    expect(Ctor.someNonStandardProperty).to.equal(true);
    expect(Ctor.attributes.myAttribute).to.be.a('function');
    expect(Ctor.prototype.test).to.equal(true);
    expect(Ctor.prototype.someFunction).to.be.a('function');
  });

  it('should copy all configuration options to the extended object', function () {
    class ExtendedCtor extends Ctor {}
    expect(ExtendedCtor.extends).to.equal('div');
    expect(ExtendedCtor.someNonStandardProperty).to.equal(true);
    expect(ExtendedCtor.attributes.myAttribute).to.be.a('function');
    expect(ExtendedCtor.prototype.test).to.equal(true);
    expect(ExtendedCtor.prototype.someFunction).to.be.a('function');
  });
});
