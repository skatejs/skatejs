import helperElement from '../lib/element';
import { define, symbols, vdom } from '../../src/index';

describe('extending', function () {
  var Ctor, tag;

  beforeEach(function () {
    Ctor = define(helperElement().safe, {
      extends: 'div',
      someNonStandardProperty: true,
      created (elem) {
        elem.__test = 'test';
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
    const ExtendedCtor = define(tag, class extends Ctor {});
    expect(ExtendedCtor.extends).to.equal('div');
    expect(ExtendedCtor.someNonStandardProperty).to.equal(true);
    expect(ExtendedCtor.created).to.be.a('function');
    expect(ExtendedCtor.attributeChanged).to.be.a('function');
    expect(ExtendedCtor.prototype.test).to.equal(true);
    expect(ExtendedCtor.prototype.someFunction).to.be.a('function');
  });

  it('prototype members should be available', function () {
    const ExtendedCtor = define(tag, class extends Ctor {});
    expect(new ExtendedCtor().test).to.equal(true);
    expect(new ExtendedCtor().someFunction).to.be.a('function');
  });

  it('should not mess with callbacks', function () {
    const ExtendedCtor = define(tag, class extends Ctor {});
    expect(new ExtendedCtor().__test).to.equal('test');
  });

  it('should allow overriding of callbacks', function () {
    const ExtendedCtor = define(tag, class extends Ctor {
      static created (elem) {
        super.created(elem);
        elem.__test += 'ing';
      }
    });
    const elem = new ExtendedCtor();
    expect(elem.__test).to.equal('testing');
  });

  it('constructor should be accessible', function () {
    const El = define(tag, class extends Ctor {});
    const el = new El();
    expect(el.constructor).to.be.a('function');
    expect(el.constructor.extends).to.equal('div');
  });

  it('extends()', function () {
    const Comp1 = define(`${tag}-1`, {});
    const Comp2 = define(`${tag}-2`, Comp1.extend({}));
    const elem1 = new Comp1();
    const elem2 = new Comp2();
    expect(elem1).to.be.an.instanceof(Comp1);
    expect(elem1).to.not.be.an.instanceof(Comp2);
    expect(elem2).to.be.an.instanceof(Comp1);
    expect(elem2).to.be.an.instanceof(Comp2);
  });
});
