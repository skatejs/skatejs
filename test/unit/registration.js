'use strict';

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

    div.func1.should.equal(Div.prototype.func1);
    div.func2.should.equal(Div.prototype.func2);
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

    div.func1.should.be.a('function');
    div.func2.should.be.a('function');
  });

  it('should allow the overwriting of the prototype', function () {
    var Div = skate('div', {});

    Div.prototype = {
      func: function () {}
    };

    var div = new Div();

    div.func.should.be.a('function');
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
    var Input = skate('super-input', {
      extends: 'input',
      type: skate.types.TAG,
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

    beforeEach(function () {
      Div = skate('my-element', {
        extends: 'div'
      });

      div = new Div();
    });

    it('should return an element whose tag name matches the extends option', function () {
      expect(div.tagName).to.equal('DIV');
    });

    it('should return an element whose is attribute is equal to the component id', function () {
      expect(div.getAttribute('is')).to.equal('my-element');
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

  it('should be called if it is compatible with anything', function () {
    skate('my-div', {
      type: skate.types.ANY
    });
    expect('my-div' in definitions).to.equal(true);
  });

  it('should be called if it is compatible with tags', function () {
    skate('my-div', {
      type: skate.types.TAG
    });
    expect('my-div' in definitions).to.equal(true);
  });

  it('should be called if it is not compatible with tags', function () {
    skate('my-div-1', {
      type: skate.types.ATTR
    });
    skate('my-div-2', {
      type: skate.types.CLASS
    });
    skate('my-div-3', {
      type: skate.types.NOTAG
    });
    expect('my-div-1' in definitions).to.equal(false);
    expect('my-div-2' in definitions).to.equal(false);
    expect('my-div-3' in definitions).to.equal(false);
  });

  it('should not be called if the id is invalid', function () {
    skate('div', {
      type: skate.types.TAG
    });
    expect('div' in definitions).to.equal(false);
  });
});
