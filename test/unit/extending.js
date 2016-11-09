/* eslint-env jasmine, mocha */

import { Component, define } from '../../src/index';
import { classStaticsInheritance } from '../lib/support';
import uniqueId from '../../src/util/unique-id';

describe('extending', () => {
  let Ctor;

  beforeEach(() => {
    Ctor = Component.extend({
      extends: 'div',
      someNonStandardProperty: true,
      created (elem) {
        elem.__test = 'test';
      },
      attributeChanged () {},
      prototype: {
        test: true,
        someFunction: () => {}
      }
    });
  });

  it('should copy all configuration options to the constructor', () => {
    expect(Ctor.extends).to.equal('div');
    expect(Ctor.someNonStandardProperty).to.equal(true);
    expect(Ctor.created).to.be.a('function');
    expect(Ctor.attributeChanged).to.be.a('function');
    expect(Ctor.prototype.test).to.equal(true);
    expect(Ctor.prototype.someFunction).to.be.a('function');
  });

  it('should copy all configuration options to the extended object', () => {
    const ExtendedCtor = define(Ctor.extend());
    expect(ExtendedCtor.extends).to.equal('div');
    expect(ExtendedCtor.someNonStandardProperty).to.equal(true);
    expect(ExtendedCtor.created).to.be.a('function');
    expect(ExtendedCtor.attributeChanged).to.be.a('function');
    expect(ExtendedCtor.prototype.test).to.equal(true);
    expect(ExtendedCtor.prototype.someFunction).to.be.a('function');
  });

  it('prototype members should be available', () => {
    const ExtendedCtor = define(Ctor.extend());
    expect(new ExtendedCtor().test).to.equal(true);
    expect(new ExtendedCtor().someFunction).to.be.a('function');
  });

  it('should not mess with callbacks', () => {
    const ExtendedCtor = define(Ctor.extend());
    expect(new ExtendedCtor().__test).to.equal('test');
  });

  it('should allow overriding of callbacks', () => {
    const ExtendedCtor = define(Ctor.extend({
      created (elem) {
        Ctor.created(elem);
        elem.__test += 'ing';
      }
    }));
    const elem = new ExtendedCtor();
    expect(elem.__test).to.equal('testing');
  });

  it('constructor should be accessible', () => {
    const El = define(Ctor.extend());
    const el = new El();
    expect(el.constructor).to.be.a('function');
    expect(el.constructor.extends).to.equal('div');
  });

  if (classStaticsInheritance()) {
    it('extend()', () => {
      const Comp1 = define(class extends Component {});
      const Comp2 = define(class extends Comp1 {});
      const elem1 = new Comp1();
      const elem2 = new Comp2();
      expect(elem1).to.be.an.instanceof(Comp1);
      expect(elem1).to.not.be.an.instanceof(Comp2);
      expect(elem2).to.be.an.instanceof(Comp1);
      expect(elem2).to.be.an.instanceof(Comp2);
    });
  }
});
