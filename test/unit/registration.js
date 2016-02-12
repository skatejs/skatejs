'use strict';

import helperElement from '../lib/element';
import skate from '../../src/index';

describe('Registration', function () {
  it('should not allow you to register the same component more than once.', function () {
    var multiple = false;
    var tag = helperElement('my-el');
    skate(tag.safe, {});

    try {
      skate(tag.safe, {});
      multiple = true;
    } catch (e) {
      // Do nothing
    }

    assert(!multiple);
  });
});

describe('Returning a constructor', function () {
  it('should return a constructor that extends a native element.', function () {
    var tag = helperElement('my-el');
    var Element = skate(tag.safe, {
      prototype: {
        func1: function () {}
      }
    });

    Element.prototype.func2 = function () {};

    expect(Element.prototype.func1).to.be.a('function');
    expect(Element.prototype.func2).to.be.a('function');

    var element = new Element();

    expect(element.func1).to.be.a('function');
    expect(element.func2).to.be.a('function');

    expect(element.func1).to.equal(Element.prototype.func1);
    expect(element.func2).to.equal(Element.prototype.func2);
  });

  it('should not allow the constructor property to be enumerated.', function () {
    var tag = helperElement('my-el');
    var Element = skate(tag.safe, {});

    for (var prop in Element.prototype) {
      if (prop === 'constructor') {
        throw new Error('The constructor property should not be enumerable.');
      }
    }
  });

  it('should affect the element prototype even if it was not constructed using the constructor.', function () {
    var tag = helperElement('my-el');
    var Element = skate(tag.safe, {
      prototype: {
        func1: function () {}
      }
    });

    Element.prototype.func2 = function () {};

    var element = new Element();

    expect(element.func1).to.be.a('function');
    expect(element.func2).to.be.a('function');
  });

  it('should allow getters and setters on the prototype', function () {
    var tag = helperElement('my-el');
    var Element = skate(tag.safe, {
      prototype: Object.create({}, {
        test: {
          get: function () {
            return true;
          }
        }
      })
    });

    var element = new Element();
    expect(element.test).to.equal(true);
  });

  it('should overwrite prototype members', function () {
    var called = false;
    var { safe: tagName } = helperElement('super-input');
    var Input = skate(tagName, {
      extends: 'input',
      prototype: {
        focus: function () {
          called = true;
        }
      }
    });

    var input = new Input();
    input.focus();
    expect(called).to.equal(true);
  });

  describe('when an extends option is specified', function () {
    var Div;
    var div;
    var tagName;

    beforeEach(function () {
      tagName = helperElement('my-element');
      Div = skate(tagName.safe, {
        extends: 'div'
      });

      div = new Div();
    });

    it('should return an element whose tag name matches the extends option', function () {
      expect(div.tagName).to.equal('DIV');
    });

    it('should return an element whose is attribute is equal to the component id', function () {
      expect(div.getAttribute('is')).to.equal(tagName.safe);
    });
  });
});
