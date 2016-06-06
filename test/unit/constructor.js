import { define } from '../../src/index';
import helperElement from '../lib/element';
import resolved from '../lib/resolved';

describe('constructor', function () {
  var id;

  beforeEach(function () {
    id = helperElement().safe;
  });

  it('custom elements', function () {
    var Ctor = define(id, {});
    var ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal(id);
  });
});
