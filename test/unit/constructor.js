import helperElement from '../lib/element';
import resolved from '../lib/resolved';
import skate from '../../src/index';
import typeAttribute from 'skatejs-type-attribute';
import typeClass from 'skatejs-type-class';

describe('constructor', function () {
  let id;

  beforeEach(function () {
    id = helperElement().safe;
  });

  it('existing elements', function () {
    id = id.replace(/-/, '');
    const Ctor = skate(id, {});
    const ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal(id);
  });

  it('existing elements + extends', function () {
    id = id.replace(/-/, '');
    const Ctor = skate(id, { extends: 'span' });
    const ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('span');
    expect(ctor.getAttribute('is')).to.equal(id);
  });

  it('custom elements', function () {
    const Ctor = skate(id, {});
    const ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal(id);
  });

  it('custom elements + extends', function () {
    const Ctor = skate(id, { extends: 'span' });
    const ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('span');
    expect(ctor.getAttribute('is')).to.equal(id);
  });

  it('attributes', function () {
    const Ctor = skate(id, { type: typeAttribute });
    const ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('div');
    expect(ctor.getAttribute(id)).to.equal('');
  });

  it('attributes + extends', function () {
    const Ctor = skate(id, { type: typeAttribute, extends: 'span' });
    const ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('span');
    expect(ctor.getAttribute(id)).to.equal('');
  });

  it('classes', function () {
    const Ctor = skate(id, { type: typeClass });
    const ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('div');
    expect(ctor.getAttribute('class')).to.equal(id);
  });

  it('classes + extends', function () {
    const Ctor = skate(id, { type: typeClass, extends: 'span' });
    const ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('span');
    expect(ctor.getAttribute('class')).to.equal(id);
  });

  it('without new operator', function () {
    const ctor = skate(id, {});
    expect(resolved(ctor())).to.equal(true);
  });

  it('with properties', function () {
    const ctor = skate(id, {});
    expect(ctor({ test: true }).test).to.equal(true);
  });

  it('the name should be overridden on supported browsers', function () {
    const ctor = skate(id, {});
    if (Object.getOwnPropertyDescriptor(ctor, 'name').configurable) {
      expect(ctor.name).to.equal(id);
    }
  });
});
