'use strict';

import registry from '../../src/registry';
import skate from '../../src/skate';

describe('Registry', function () {
  afterEach(function () {
    registry.clear();
  });

  it('should set definitions', function () {
    registry.set('test', {});
  });

  it('should check if definitions exist', function () {
    expect(registry.has('test')).to.equal(false);
    registry.set('test', {});
    expect(registry.has('test')).to.equal(true);
  });

  it('should remove definitions', function () {
    registry.set('test', {});
    registry.remove('test', {});
    expect(registry.has('test')).to.equal(false);
  });

  it('should clear definitions', function () {
    registry.set('test', {});
    registry.clear();
    expect(registry.has('test')).to.equal(false);
  });

  it('should return definitions for a given element', function () {
    var definition1 = { type: skate.types.TAG };
    var definition2 = { type: skate.types.ATTR };
    var definition3 = { type: skate.types.CLASS };
    var definitions;
    var element = document.createElement('test1');

    element.setAttribute('test2', '');
    element.classList.add('test3');

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
