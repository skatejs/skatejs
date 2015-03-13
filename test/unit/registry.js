'use strict';

import registry from '../../src/registry';
import skate from '../../src/skate';

describe('Registry', function () {
  afterEach(function () {
    registry.clear();
  });

  it('should set definitions', function () {
    registry.set('test', {});
    try {
      registry.set('test', {});
      assert(false);
    } catch (e) {}
  });

  it('should clear definitions', function () {
    registry.set('test', {});
    registry.clear();
    registry.set('test', {});
  });

  it('should return definitions for a given element', function () {
    var definition1 = { type: skate.type.ELEMENT };
    var definition2 = { type: skate.type.ATTRIBUTE };
    var definition3 = { type: skate.type.CLASSNAME };
    var definitions;
    var element = document.createElement('test1');

    element.setAttribute('test2', '');
    element.className += ' test3';

    registry.set('test1', definition1);
    registry.set('test2', definition2);
    registry.set('test3', definition3);

    definitions = registry.getForElement(element);

    expect(definitions.length).to.equal(3);
    expect(definitions[0]).to.equal(definition1);
    expect(definitions[1]).to.equal(definition2);
    expect(definitions[2]).to.equal(definition3);
  });
});
