'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('Registration', function () {
  it('should not allow you to register the same component more than once.', function () {
    var multiple = false;

    skate('div', {});

    try {
      skate('div', {});
      multiple = true;
    } catch (e) {}

    assert(!multiple, 'Multiple "div" components were registered.');
  });
});

describe('Returning a constructor', function () {
  it('should return a constructor that extends a native element.', function () {
    var Div = skate('div', {
      prototype: {
        func1: function () {}
      }
    });

    Div.prototype.func2 = function () {};

    expect(Div.prototype.func1).to.be.a('function');
    expect(Div.prototype.func2).to.be.a('function');

    var div = new Div();

    expect(div.func1).to.be.a('function');
    expect(div.func2).to.be.a('function');

    expect(div.func1).to.equal(Div.prototype.func1);
    expect(div.func2).to.equal(Div.prototype.func2);
  });

  it('should not allow the constructor property to be enumerated.', function () {
    var Div = skate('div', {});

    for (var prop in Div.prototype) {
      if (prop === 'constructor') {
        throw new Error('The constructor property should not be enumerable.');
      }
    }
  });

  it('should affect the element prototype even if it was not constructed using the constructor.', function () {
    var Div = skate('div', {
      prototype: {
        func1: function () {}
      }
    });

    Div.prototype.func2 = function () {};

    var div = new Div();

    expect(div.func1).to.be.a('function');
    expect(div.func2).to.be.a('function');
  });

  it('should allow the overwriting of the prototype', function () {
    var Div = skate('div', {});

    Div.prototype = {
      func: function () {}
    };

    var div = new Div();

    expect(div.func).to.be.a('function');
  });

  it('should allow getters and setters on the prototype', function () {
    var Div = skate('div', {
      prototype: Object.create({}, {
        test: {
          get: function () {
            return true;
          }
        }
      })
    });

    var div = new Div();

    expect(div.test).to.equal(true);
  });

  it('should overwrite prototype members', function () {
    var called = false;
    var {safe: tagName} = helpers.safeTagName('super-input');
    var Input = skate(tagName, {
      extends: 'input',
      type: skate.type.ELEMENT,
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
      tagName = helpers.safeTagName('my-element');
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
    };
  });

  afterEach(function () {
    document.registerElement = oldRegisterElement;
  });

  it('should be called if it is compatible with tags', function () {
    var { safe: tagName } = helpers.safeTagName('my-element');
    skate(tagName, {
      type: skate.type.ELEMENT
    });
    expect(tagName in definitions).to.equal(true);
  });

  it('should not be called if it is not compatible with tags', function () {
    var { safe: tagName1 } = helpers.safeTagName('my-element');
    var { safe: tagName2 } = helpers.safeTagName('my-element');

    skate(tagName1, {
      type: skate.type.ATTRIBUTE
    });

    skate(tagName2, {
      type: skate.type.CLASSNAME
    });

    expect(tagName1 in definitions).to.equal(false);
    expect(tagName2 in definitions).to.equal(false);
  });

  it('should not be called if the id is invalid', function () {
    var { safe: tagName } = helpers.safeTagName('div');

    skate(tagName, {
      type: skate.type.ELEMENT
    });

    expect(tagName in definitions).to.equal(false);
  });
});
