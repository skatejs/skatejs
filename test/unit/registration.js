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
