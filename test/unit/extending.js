import helperElement from '../lib/element';
import skate, { create, symbols, vdom } from '../../src/index';

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
      created () {},
      render () {
        vdom.text('test');
      },
      attributeChanged () {},
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
    expect(Ctor.attributeChanged).to.be.a('function');
    expect(Ctor.prototype.test).to.equal(true);
    expect(Ctor.prototype.someFunction).to.be.a('function');
  });

  it('should copy all configuration options to the extended object', function () {
    const ExtendedCtor = skate(tag, class extends Ctor {});
    if (canExtendStaticProperties) {
      expect(ExtendedCtor.extends).to.equal('div');
      expect(ExtendedCtor.someNonStandardProperty).to.equal(true);
      expect(ExtendedCtor.created).to.be.a('function');
      expect(ExtendedCtor.attributeChanged).to.be.a('function');
    }
    expect(ExtendedCtor.prototype.test).to.equal(true);
    expect(ExtendedCtor.prototype.someFunction).to.be.a('function');
  });

  it('prototype members should be available', function () {
    const ExtendedCtor = skate(tag, class extends Ctor {});
    expect(new ExtendedCtor().test).to.equal(true);
    expect(new ExtendedCtor().someFunction).to.be.a('function');
  });

  canExtendStaticProperties && it('should not mess with callbacks', function () {
    const ExtendedCtor = skate(tag, class extends Ctor {});
    expect(new ExtendedCtor()[symbols.shadowRoot].textContent).to.equal('test');
  });

  canResolveSuper && it('should allow overriding of callbacks', function () {
    const ExtendedCtor = skate(tag, class extends Ctor {
      static render (elem) {
        super.render(elem);
        vdom.text('ing');
      }
    });
    const elem = new ExtendedCtor();
    expect(elem[symbols.shadowRoot].textContent).to.equal('testing');
  });

  canExtendStaticProperties && it('constructor should be accessible', function () {
    skate(tag, class extends Ctor {});
    const el = create(tag);
    expect(el.constructor).to.be.a('function');
    expect(el.constructor.extends).to.equal('div');
  });
});
