import helperElement from '../lib/element';
import resolved from '../lib/resolved';
import skate from '../../src/index';
import { attribute as typeAttribute } from 'skatejs-types';
import { classname as typeClass } from 'skatejs-types';

describe('constructor', function () {
  var id;

  beforeEach(function () {
    id = helperElement().safe;
  });

  it('existing elements', function () {
    id = id.replace(/-/, '');
    var Ctor = skate(id, {});
    var ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal(id);
  });

  it('existing elements + extends', function () {
    id = id.replace(/-/, '');
    var Ctor = skate(id, { extends: 'span' });
    var ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('span');
    expect(ctor.getAttribute('is')).to.equal(id);
  });

  it('custom elements', function () {
    var Ctor = skate(id, {});
    var ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal(id);
  });

  it('custom elements + extends', function () {
    var Ctor = skate(id, { extends: 'span' });
    var ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('span');
    expect(ctor.getAttribute('is')).to.equal(id);
  });

  it('attributes', function () {
    var Ctor = skate(id, { type: typeAttribute });
    var ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('div');
    expect(ctor.getAttribute(id)).to.equal('');
  });

  it('attributes + extends', function () {
    var Ctor = skate(id, { type: typeAttribute, extends: 'span' });
    var ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('span');
    expect(ctor.getAttribute(id)).to.equal('');
  });

  it('classes', function () {
    var Ctor = skate(id, { type: typeClass });
    var ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('div');
    expect(ctor.getAttribute('class')).to.equal(id);
  });

  it('classes + extends', function () {
    var Ctor = skate(id, { type: typeClass, extends: 'span' });
    var ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal('span');
    expect(ctor.getAttribute('class')).to.equal(id);
  });

  it('without new operator', function () {
    var ctor = skate(id, {});
    expect(resolved(ctor())).to.equal(true);
  });

  it('with properties', function () {
    var ctor = skate(id, {});
    expect(ctor({ test: true }).test).to.equal(true);
  });
});
