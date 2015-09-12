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

  describe('attribute - setting', function() {
    it('with `attr` set to true', function() {
      skate(elem.safe, {
        properties: {
          test: {
            attr: true
          }
        }
      });

      var el = fixture(`<${elem.safe}></${elem.safe}>`).querySelector(elem.safe);
      skate.init(el);

      el.test = 'value1';
      el.setAttribute('test', 'value2');
      expect(el.test).to.equal('value2');
    });

    it('with `attr` set to a string value', function() {
      skate(elem.safe, {
        properties: {
          test: {
            attr: 'test2'
          }
        }
      });

      var el = fixture(`<${elem.safe}></${elem.safe}>`).querySelector(elem.safe);
      skate.init(el);
      el.test = 'value1';
      el.setAttribute('test2', 'value2');
      expect(el.test).to.equal('value2');
    });
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

  describe('removing attributes when property is set', function () {
    function setup () {
      skate(elem.safe, {
        properties: {
          prop1: {
            attr: true,

            // We add a type so that we can test what happens when the value
            // is coerced from null / undefined.
            type: String
          }
        }
      });

      var el = elem.create({ prop1: 'test1' });
      expect(el.prop1).to.equal('test1');
      return el;
    }

    it('passing undefined should remove the linked attribute', function () {
      let el = setup();
      el.prop1 = undefined;
      expect(el.hasAttribute('prop1')).to.equal(false);
    });

    it('passing null should remove the linked attribute', function () {
      let el = setup();
      el.prop1 = null;
      expect(el.hasAttribute('prop1')).to.equal(false);
    });

    it('passing an empty string shoud not remove the linked attribute', function () {
      let el = setup();
      el.prop1 = '';
      expect(el.getAttribute('prop1')).to.equal('');
    });

    it('passing false should not remove the linked attribute', function () {
      let el = setup();
      el.prop1 = false;
      expect(el.getAttribute('prop1')).to.equal('false');
    });

    it('passing 0 should not remove the linked attribute', function () {
      let el = setup();
      el.prop1 = 0;
      expect(el.getAttribute('prop1')).to.equal('0');
    });
  });

  it('should not be triggered on initialisation', function () {
    let triggered;
    let newValue;
    let oldValue;

    skate(elem.safe, {
      properties: {
        prop: {
          update: function (nv, ov) {
            triggered = true;
            newValue = nv;
            oldValue = ov;
          }
        }
      }
    });

    let el = elem.create();
    expect(triggered).to.equal(undefined);
    expect(newValue).to.equal(undefined);
    expect(oldValue).to.equal(undefined);

    el.prop = 'one';
    expect(triggered).to.equal(true);
    expect(newValue).to.equal('one');
    expect(oldValue).to.equal(undefined);

    el.prop = 'two';
    expect(triggered).to.equal(true);
    expect(newValue).to.equal('two');
    expect(oldValue).to.equal('one');
  });

  it('should override existing properties', function () {
    skate(elem.safe, {
      properties: {
        textContent: {}
      }
    });

    let el = skate.create(`<${elem.safe}>initial content</${elem.safe}>`);
    expect(el.textContent).to.equal('initial content');
    el.textContent = 'updated content';
    expect(el.textContent).to.equal('updated content');
    expect(el.innerHTML).to.equal('initial content');
  });

  it('should not trigger the attribute callback if not linked', function () {
    let triggered = false;

    elem.skate({
      attribute: function (name) {
        if (name !== 'resolved' && name !== 'unresolved') {
          triggered = true;
        }
      },
      properties: {
        test: {}
      }
    });

    elem.create().test = 'something';
    expect(triggered).to.equal(false);
  });

  it('should trigger the attribute callback if linked', function () {
    let triggered = false;

    elem.skate({
      attribute: function (name) {
        if (name !== 'resolved' && name !== 'unresolved') {
          triggered = true;
        }
      },
      properties: {
        test: { attr: true }
      }
    });

    elem.create().test = 'something';
    expect(triggered).to.equal(true);
  });

  describe('templating integration', function () {
    it('scenario 1 - DOM mutation', function () {
      skate(elem.safe, {
        created () {
          this.innerHTML = `<span>${this.textContent}</span>`;
        },
        properties: {
          textContent: {
            update (value) {
              this.querySelector('span').textContent = value;
            }
          }
        }
      });

      var el = skate.create(`<${elem.safe}>initial content</${elem.safe}>`);
      expect(el.innerHTML).to.equal('<span>initial content</span>');
      expect(el.textContent).to.equal('initial content');

      el.textContent = 'updated content';
      expect(el.innerHTML).to.equal('<span>updated content</span>');
      expect(el.textContent).to.equal('updated content');
    });

    it('scenario 2 - re-rendering', function () {
      function render () {
        this.innerHTML = `<span>${this.textContent}</span>`;
      }

      skate(elem.safe, {
        created: render,
        properties: {
          textContent: {
            update: render
          }
        }
      });

      var el = skate.create(`<${elem.safe}>initial content</${elem.safe}>`);
      expect(el.innerHTML).to.equal('<span>initial content</span>');
      expect(el.textContent).to.equal('initial content');

      el.textContent = 'updated content';
      expect(el.innerHTML).to.equal('<span>updated content</span>');
      expect(el.textContent).to.equal('updated content');
    });
  });

  describe('initial values from one element being set on another element', function () {
    it('the initial value of one element should not affect another element', function () {
      let elem = helperElement().skate({
        properties: {
          textContent: {}
        }
      });
      let el1 = skate.create(`<${elem.name}></${elem.name}>`);
      let el2 = skate.create(`<${elem.name}>should only be set for this element</${elem.name}>`);
      expect(el1.textContent).to.equal('');
      expect(el2.textContent).to.equal('should only be set for this element');
    });
  });
});
