'use strict';

import helperElement from '../lib/element';
import skate from '../../src/index';
import { attribute as typeAttribute } from 'skatejs-types';
import { classname as typeClass } from 'skatejs-types';

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

  it('should merge prototype functions if an element is skated more than once', function () {
    var { safe: tagName } = helperElement('my-el');

    var Element = skate(tagName, {
      prototype: {
        func1:  function () {
          return true;
        }
      }
    });

    var element = new Element();
    var { safe: attrName } = helperElement('my-attr');
    element.setAttribute(attrName, '');
    skate(attrName, {
      type: typeAttribute,
      prototype: {
        func2:  function () {
          return true;
        }
      }
    });
    skate.init(element);

    expect(element.func1).to.be.a('function');
    expect(element.func2).to.be.a('function');
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

describe('Native document.registerElement', function () {
  var definitions;
  var oldRegisterElement;

  beforeEach(function () {
    definitions = {};
    oldRegisterElement = document.registerElement;
    document.registerElement = function (name, definition) {
      definitions[name] = definition;
      return function () {};
    };
  });

  afterEach(function () {
    document.registerElement = oldRegisterElement;
  });

  it('should be called if it is compatible with tags', function () {
    var { safe: tagName } = helperElement('my-element');
    skate(tagName, {});
    expect(tagName in definitions).to.equal(true);
  });

  it('should not be called if it is not compatible with tags', function () {
    var { safe: tagName1 } = helperElement('my-element');
    var { safe: tagName2 } = helperElement('my-element');

    skate(tagName1, {
      type: typeAttribute
    });

    skate(tagName2, {
      type: typeClass
    });

    expect(tagName1 in definitions).to.equal(false);
    expect(tagName2 in definitions).to.equal(false);
  });

  it('should not be called if the id is invalid', function () {
    var { safe: tagName } = helperElement('div');
    skate(tagName, {});
    expect(tagName in definitions).to.equal(false);
  });
});
