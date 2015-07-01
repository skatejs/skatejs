'use strict';

import registry from '../../src/global/registry';
import skate from '../../src/index';

describe('Registry', function () {
  it('should set definitions', function () {
    registry.set('test', { type: 'element' });
    try {
      registry.set('test', { type: 'element' });
      assert(false);
    } catch (e) {}
  });

  it('should return definitions for a given element', function () {
    var definition1 = { type: 'element' };
    var definition2 = { type: 'attribute' };
    var definition3 = { type: 'class' };
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
