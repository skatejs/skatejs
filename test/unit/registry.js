'use strict';

import registry from '../../src/global/registry';
import typeAttribute from 'skatejs-type-attribute';
import typeClass from 'skatejs-type-class';

describe('Registry', function () {
  it('should set definitions', function () {
    registry.set('test', {});
    try {
      registry.set('test', {});
      assert(false);
    } catch (e) {}
  });

  it('should return definitions for a given element', function () {
    var definition1 = {};
    var definition2 = { type: typeAttribute };
    var definition3 = { type: typeClass };
    var definitions;
    var element = document.createElement('test1');

    element.setAttribute('test2', '');
    element.className = 'test3';

    registry.set('test1', definition1);
    registry.set('test2', definition2);
    registry.set('test3', definition3);

    definitions = registry.find(element);

    expect(definitions.length).to.equal(3);
    expect(definitions).to.contain(definition1, 'element');
    expect(definitions).to.contain(definition2, 'attribute');
    expect(definitions).to.contain(definition3, 'classname');
  });
});
