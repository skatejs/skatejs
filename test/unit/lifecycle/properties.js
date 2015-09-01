import fixture from '../../lib/fixture';
import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import skate from '../../../src/index';

describe('lifecycle/properties', function () {
  var elem;

  beforeEach(function () {
    elem = helperElement();
  });

  it('no arguments', function () {
    skate(elem.safe, {
      properties: {
        propName1: undefined
      }
    });

    var el = elem.create();
    el.propName1 = 'testing';
    expect(el.propName1).to.equal('testing', 'Value should just be passed through');
    expect(el.hasAttribute('prop-name1')).to.equal(false, 'Attribute linking should be off by default');
  });

  it('type', function () {
    skate(elem.safe, {
      properties: {
        propName1: Boolean,
        propName2: {
          type: Boolean
        }
      }
    });

    var el = elem.create();
    el.propName1 = '';
    el.propName2 = 'something';
    expect(el.propName1).to.equal(false, 'Type function can be specified instead of object');
    expect(el.propName2).to.equal(true, 'Object with only type definition can be specified');
  });

  it('attribute (Boolean)', function () {
    skate(elem.safe, {
      properties: {
        propName1: {
          attr: true
        }
      }
    });

    var el = fixture(`<${elem.safe} prop-name1="test1"></${elem.safe}>`).querySelector(elem.safe);
    skate.init(el);
    expect(el.propName1).to.equal('test1', 'property initialised from attribute');
    expect(el.getAttribute('prop-name1')).to.equal('test1', 'attribute matches initial value');
    el.propName1 = 'test2';
    expect(el.propName1).to.equal('test2', 'property updated to new value');
    expect(el.getAttribute('prop-name1')).to.equal('test2', 'attribute updated to new value');
  });

  it('attribute (String)', function () {
    skate(elem.safe, {
      properties: {
        propName1: {
          attr: 'my-attr'
        }
      }
    });

    var el = fixture(`<${elem.safe} my-attr="test1"></${elem.safe}>`).querySelector(elem.safe);
    skate.init(el);
    expect(el.propName1).to.equal('test1', 'property initialised from attribute');
    expect(el.getAttribute('my-attr')).to.equal('test1', 'attribute matches initial value');
    el.propName1 = 'test2';
    expect(el.propName1).to.equal('test2', 'property updated to new value');
    expect(el.getAttribute('my-attr')).to.equal('test2', 'attribute updated to new value');
  });

  it('attribute - removing', function () {
    skate(elem.safe, {
      properties: {
        propName1: {
          attr: true
        }
      }
    });

    var el = elem.create();
    el.propName1 = 'test';
    el.removeAttribute('prop-name1');
    expect(el.propName1).to.equal(undefined);

    el.propName1 = 'test';
    el.setAttribute('prop-name1', '');
    expect(el.propName1).to.equal('');
  });

  it('Boolean + attribute', function () {
    skate(elem.safe, {
      properties: {
        propName1: {
          attr: true,
          type: Boolean
        }
      }
    });

    var el = elem.create();

    el.propName1 = 'something';
    expect(el.propName1).to.equal(true, 'Value should just be converted to boolean true');
    expect(el.getAttribute('prop-name1')).to.equal('', 'Attribute should be added but no value should be set');

    el.propName1 = '';
    expect(el.propName1).to.equal(false, 'Value should be converted to boolean false');
    expect(el.hasAttribute('prop-name1')).to.equal(false, 'Attribute should be removed if value is false');
  });

  it('default value (scalar)', function () {
    skate(elem.safe, {
      properties: {
        propName1: {
          init: 'test'
        }
      }
    });

    var el = elem.create();
    expect(el.propName1).to.equal('test');
  });

  it('default value (function)', function () {
    skate(elem.safe, {
      properties: {
        propName1: {
          init: function () {
            return 'test';
          }
        }
      }
    });

    var el = elem.create();
    expect(el.propName1).to.equal('test');
  });

  it('initial value should not trump existing attribute values', function () {
    skate(elem.safe, {
      properties: {
        trump: {
          attr: true,
          init: 'property'
        }
      }
    });

    helperFixture(`<${elem.safe} trump="attribute"></${elem.safe}>`);
    skate.init(helperFixture());
    var el = helperFixture().querySelector(elem.safe);
    expect(el.getAttribute('trump')).to.equal('attribute');
    expect(el.trump).to.equal('attribute');
  });

  it('internal values should not leak to other element instances of the same type', function () {
    skate(elem.safe, {
      properties: {
        prop1: {}
      }
    });

    var el1 = elem.create({ prop1: 'test1' });
    var el2 = elem.create({ prop1: 'test2' });
    expect(el1.prop1).to.equal('test1');
    expect(el2.prop1).to.equal('test2');
  });

  it('passing undefined should remove the linked attribute', function () {
    skate(elem.safe, {
      properties: {
        prop1: {
          attr: true
        }
      }
    });

    var el = elem.create({ prop1: 'test1' });
    expect(el.prop1).to.equal('test1');
    el.prop1 = undefined;
    expect(el.hasAttribute('prop1')).to.equal(false);
  });

  it('passing null should remove the linked attribute', function () {
    skate(elem.safe, {
      properties: {
        prop1: {
          attr: true
        }
      }
    });

    var el = elem.create({ prop1: 'test1' });
    expect(el.prop1).to.equal('test1');
    el.prop1 = null;
    expect(el.hasAttribute('prop1')).to.equal(false);
  });

  it('passing an empty string shoud not remove the linked attribute', function () {
    skate(elem.safe, {
      properties: {
        prop1: {
          attr: true
        }
      }
    });

    var el = elem.create({ prop1: 'test1' });
    expect(el.prop1).to.equal('test1');
    el.prop1 = '';
    expect(el.getAttribute('prop1')).to.equal('');
  });

  describe('270', function () {
    function setup (initialValue) {
      var el = elem.create();
      el.textContent = 'existing content';
      skate(elem.safe, {
        properties: {
          textContent: {
            init: initialValue,
            set (value) {
              this.children[0].textContent = value;
            }
          }
        },
        template () {
          this.innerHTML = `{<span></span>}`;
        }
      });
      skate.init(el);
      return el;
    }

    it('should use existing value of overwriting an existing property', function () {
      var el = setup();
      expect(el.innerHTML).to.equal('{<span>existing content</span>}');
    });

    it('should override the init option', function () {
      var el = setup('init value');
      expect(el.innerHTML).to.equal('{<span>existing content</span>}');
    });
  });
});
