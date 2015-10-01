import property from '../../../src/api/property';
import propertiesCreated from '../../../src/lifecycle/properties-created';
import propertiesReady from '../../../src/lifecycle/properties-ready';
import skate from '../../../src/index';

function create (definition) {
  let elem = document.createElement('div');
  let prop = { test: definition('test') };
  propertiesCreated(elem, prop);
  propertiesReady(elem, prop);
  return elem;
}

describe('api/property', function () {
  it('skate.property', function () {
    expect(skate.property).to.be.an('object');
    expect(skate.property.boolean).to.be.a('function');
    expect(skate.property.float).to.be.a('function');
    expect(skate.property.number).to.be.a('function');
    expect(skate.property.string).to.be.a('function');
  });

  describe('boolean', function () {
    it('initial value', function () {
      let elem = create(property.boolean());
      expect(elem.test).to.equal(false);
      expect(elem.getAttribute('test')).to.equal(null);
    });

    [undefined, null, false, 0, '', 'something'].forEach(function (value) {
      value = (typeof value === 'string' ? '"' + value + '"' : value);
      it('setting attribute to ' + value, function () {
        let elem = create(property.boolean());
        elem.setAttribute('test', value);
        expect(elem.test).to.equal(true, 'property');
        expect(elem.getAttribute('test')).to.equal(String(value), 'attribute');
      });
      it('setting property to ' + value, function () {
        let elem = create(property.boolean());
        elem.test = value;
        expect(elem.test).to.equal(!!value, 'property');
        expect(elem.getAttribute('test')).to.equal(value ? '' : null, 'attribute');
      });
    });

    it('removing attribute', function () {
      let elem = create(property.boolean());
      elem.setAttribute('test', '');
      expect(elem.test).to.equal(true);
      elem.removeAttribute('test');
      expect(elem.test).to.equal(false);
    });
  });

  describe('float', function () {
    it('default', function () {
      let elem = create(property.float());
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal('0');
    });
  });

  describe('number', function () {
    it('default', function () {
      let elem = create(property.number());
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal('0');
    });
  });

  describe('string', function () {
    it('default', function () {
      let elem = create(property.string());
      expect(elem.test).to.equal('');
      expect(elem.getAttribute('test')).to.equal('');
    });
  });
});
