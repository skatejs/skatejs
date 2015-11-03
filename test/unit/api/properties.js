import assign from 'object-assign';
import element from '../../lib/element';
import properties from '../../../src/api/properties';

function create (prop) {
  return element().skate({
    properties: {
      test: assign({ attribute: true }, prop)
    }
  })();
}

describe('api/property', function () {
  describe('boolean', function () {
    it('initial value', function () {
      let elem = create(properties.boolean);
      expect(elem.test).to.equal(false);
      expect(elem.getAttribute('test')).to.equal(null);
    });

    [undefined, null, false, 0, '', 'something'].forEach(function (value) {
      value = JSON.stringify(value);
      it('setting attribute to ' + value, function () {
        let elem = create(properties.boolean);
        elem.setAttribute('test', value);
        expect(elem.test).to.equal(true, 'property');
        expect(elem.getAttribute('test')).to.equal(String(value), 'attribute');
      });
      it('setting property to ' + value, function () {
        let elem = create(properties.boolean);
        elem.test = value;
        expect(elem.test).to.equal(!!value, 'property');
        expect(elem.getAttribute('test')).to.equal(value ? '' : null, 'attribute');
      });
    });

    it('removing attribute', function () {
      let elem = create(properties.boolean);
      elem.setAttribute('test', '');
      expect(elem.test).to.equal(true);
      elem.removeAttribute('test');
      expect(elem.test).to.equal(false);
    });
  });

  describe('float', function () {
    it('default', function () {
      let elem = create(properties.float);
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal('0');
    });
  });

  describe('number', function () {
    it('default', function () {
      let elem = create(properties.number);
      expect(elem.test).to.equal(0);
      expect(elem.getAttribute('test')).to.equal('0');
    });
  });

  describe('string', function () {
    it('default', function () {
      let elem = create(properties.string);
      expect(elem.test).to.equal('');
      expect(elem.getAttribute('test')).to.equal('');
    });
  });
});
