'use strict';

import customElements from '../../src/native/custom-elements';
import create from '../../src/api/create';
import helperElement from '../lib/element';

describe('registry', function () {
  it('define()', function () {
    customElements.define(helperElement().safe, {});
    try {
      // It should throw an error for duplicate definitions.
      customElements.define('test', function () {});
      assert(false);
    } catch (e) {
      // Do nothing
    }
  });

  it('get()', function () {
    const definition = function () {};
    const name = helperElement().safe;
    const element = create(name);

    customElements.define(name, definition);

    const found = customElements.get(name);

    expect(found).to.equal(definition, 'found === definition');
  });
});
