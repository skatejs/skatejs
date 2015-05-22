'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/index';

describe('create-element', function () {
  it('If parentElementName is provided, use it to lookup the definition in the registry.', function () {
    var { safe: tagName } = helpers.safeTagName();
    var Ctor = skate('div', { extends: tagName });
    expect(document.createElement('div', tagName).getAttribute('is')).to.equal(tagName);
  });

  it('If parentElementName is not provided, use elementName to lookup the definition in the registry.', function () {
    var { safe: tagName } = helpers.safeTagName();
    var Ctor = skate(tagName, {});
    expect(document.createElement(tagName).tagName.toLowerCase()).to.equal(tagName);
  });

  it('If no registry entry is found, create the element using the saved method and return it.', function () {
    var { safe: tagName } = helpers.safeTagName();
    expect(document.createElement(tagName).getAttribute('resolved')).to.equal(null);
  });

  it('If a registry entry is found and parentElementName is defined, if elementName does not match the value of the registry extends property, create the element from elementName using the saved method, set the is attribute to the value of parentElementName and return it.', function () {
    var { safe: tagName } = helpers.safeTagName();
    var Ctor = skate(tagName, { extends: 'div' });
    expect(document.createElement('span', tagName).getAttribute('is')).to.equal(tagName);
    expect(document.createElement('span', tagName).getAttribute('resolved')).to.equal(null);
  });

  it('If a registry entry is found, use it to create the element and return it.', function () {
    var { safe: tagName } = helpers.safeTagName();
    skate(tagName, {});
    expect(document.createElement(tagName).getAttribute('resolved')).to.equal('');
  });
});
