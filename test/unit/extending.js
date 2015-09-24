import helperElement from '../lib/element';
import skate from '../../src/index';

describe('extending', function () {
  var Ctor, tag;

  // IE <= 10 can't inherit static properties via __proto__ (https://babeljs.io/docs/advanced/caveats/).
  var canExtendStaticProperties = !!Object.setPrototypeOf;

  // IE <= 10 can't resolve super (https://babeljs.io/docs/advanced/caveats/).
  var canResolveSuper = !!Object.setPrototypeOf;

  beforeEach(function () {
    Ctor = skate(helperElement().safe, {
      extends: 'div',
      someNonStandardProperty: true,
      created: function (elem) {
        elem.textContent = 'test';
      },
      attribute: function () {},
      prototype: {
        test: true,
        someFunction: function () {}
      }
    });
    tag = helperElement().safe;
  });

  it('should copy all configuration options to the constructor', function () {
    expect(Ctor.extends).to.equal('div');
    expect(Ctor.someNonStandardProperty).to.equal(true);
    expect(Ctor.created).to.be.a('function');
    expect(Ctor.attribute).to.be.a('function');
    expect(Ctor.prototype.test).to.equal(true);
    expect(Ctor.prototype.someFunction).to.be.a('function');
  });

  it('should copy all configuration options to the extended object', function () {
    var ExtendedCtor = skate(tag, class extends Ctor {});
    if (canExtendStaticProperties) {
      expect(ExtendedCtor.extends).to.equal('div');
      expect(ExtendedCtor.someNonStandardProperty).to.equal(true);
      expect(ExtendedCtor.created).to.be.a('function');
      expect(ExtendedCtor.attribute).to.be.a('function');
    }
    expect(ExtendedCtor.prototype.test).to.equal(true);
    expect(ExtendedCtor.prototype.someFunction).to.be.a('function');
  });

  it('prototype members should be available', function () {
    var ExtendedCtor = skate(tag, class extends Ctor {});
    expect(new ExtendedCtor().test).to.equal(true);
    expect(new ExtendedCtor().someFunction).to.be.a('function');
  });

  it('should not mess with callbacks', function () {
    if (canExtendStaticProperties) {
      var ExtendedCtor = skate(tag, class extends Ctor {
      });
      expect(new ExtendedCtor().textContent).to.equal('test');
    }
  });

  it('should allow overriding of callbacks', function () {
    if (canResolveSuper) {
      var ExtendedCtor = skate(tag, class extends Ctor {
        static created(elem) {
          super.created(elem);
          elem.textContent += 'ing';
        }
      });
      expect(new ExtendedCtor().textContent).to.equal('testing');
    }
  });
});
