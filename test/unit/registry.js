'use strict';

import helperElement from '../lib/element';
import registry from '../../src/shared/registry';
import typeElement from '../../src/type/element';

describe('registry', function () {
  it('should set definitions', function () {
    registry.set('test', { type: typeElement });
    try {
      // It should throw an error for duplicate definitions.
      registry.set('test', {});
      assert(false);
    } catch (e) {
      // Do nothing
    }
  });

  it('should return definitions for a given element', function () {
    const definition = { type: typeElement };
    const name = helperElement().safe;
    const element = document.createElement(name);

    registry.set(name, definition);

    const reduced = registry.find(element);

    expect(reduced).to.equal(definition);
  });
});
