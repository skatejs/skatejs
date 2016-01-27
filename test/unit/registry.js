'use strict';

import registry from '../../src/shared/registry';
import typeElement from '../../src/type/element';
import { attribute as typeAttribute } from 'skatejs-types';
import { classname as typeClass } from 'skatejs-types';

describe('registry', function () {
  it('should set definitions', function () {
    registry.set('test', { type: typeElement });
    try {
      registry.set('test', {});
      assert(false);
    } catch (e) {
      // Do nothing
    }
  });

  it('should return definitions for a given element', function () {
    const definition1 = { type: typeElement };
    const definition2 = { type: typeAttribute };
    const definition3 = { type: typeClass };
    const element = document.createElement('test1');

    element.setAttribute('test2', '');
    element.className = 'test3';

    registry.set('test1', definition1);
    registry.set('test2', definition2);
    registry.set('test3', definition3);

    const definitions = registry.find(element);

    expect(definitions.length).to.equal(3);
    expect(definitions).to.contain(definition1, 'element');
    expect(definitions).to.contain(definition2, 'attribute');
    expect(definitions).to.contain(definition3, 'classname');
  });
});
