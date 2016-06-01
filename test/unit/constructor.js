import helperElement from '../lib/element';
import resolved from '../lib/resolved';
import skate from '../../src/index';

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

  it('without new operator', function () {
    var ctor = skate(id, {});
    expect(resolved(ctor())).to.equal(true);
  });
});
